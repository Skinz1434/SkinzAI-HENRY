#!/usr/bin/env node
/**
 * 🚀 HENRY PLATFORM TURBO API SERVER
 * Ultra-high performance Node.js server with clustering, caching, and real-time features
 * Author: Michael Skinner, Marine Veteran & VA AI SME
 */

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const Redis = require('redis');
const { Pool } = require('pg');
const WebSocket = require('ws');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

// 🔥 ULTRA-PERFORMANCE CONFIGURATION
const CONFIG = {
    port: process.env.PORT || 3001,
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    },
    postgres: {
        connectionString: process.env.DATABASE_URL,
        max: 20, // Maximum pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        application_name: 'HENRY_TURBO_API'
    },
    cache: {
        stdTTL: 300, // 5 minutes default
        checkperiod: 60,
        useClones: false // Better performance
    }
};

// 🚀 CLUSTERING FOR MAXIMUM PERFORMANCE
if (cluster.isMaster) {
    console.log(`🎖️  HENRY TURBO API - Master ${process.pid} starting`);
    console.log(`🔥 Spawning ${numCPUs} worker processes...`);
    
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    cluster.on('exit', (worker, code, signal) => {
        console.log(`❌ Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
    
    // Master process monitoring
    setInterval(() => {
        const workers = Object.values(cluster.workers).length;
        console.log(`📊 Active workers: ${workers}/${numCPUs}`);
    }, 60000);
    
} else {
    // Worker process
    startWorker();
}

async function startWorker() {
    const app = express();
    const cache = new NodeCache(CONFIG.cache);
    
    // Database connection pool
    const pool = new Pool(CONFIG.postgres);
    
    // Redis connection (for distributed caching)
    let redis;
    try {
        redis = Redis.createClient(CONFIG.redis);
        await redis.connect();
        console.log(`✅ Redis connected (Worker ${process.pid})`);
    } catch (error) {
        console.log(`⚠️  Redis not available, using local cache only`);
    }
    
    // 🛡️ SECURITY & PERFORMANCE MIDDLEWARE
    app.use(helmet({
        contentSecurityPolicy: false // Disable for API
    }));
    
    app.use(compression({
        level: 6,
        threshold: 1024,
        filter: (req, res) => {
            if (req.headers['x-no-compression']) return false;
            return compression.filter(req, res);
        }
    }));
    
    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 1000 requests per windowMs
        message: 'Too many requests, please try again later',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api/', limiter);
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // 📊 PERFORMANCE MONITORING
    app.use((req, res, next) => {
        req.startTime = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - req.startTime;
            if (duration > 1000) { // Log slow requests
                console.log(`🐌 Slow request: ${req.method} ${req.path} - ${duration}ms`);
            }
        });
        next();
    });
    
    // 🚀 CACHED DATABASE QUERIES
    class HENRYTurboAPI {
        static async getCachedQuery(key, query, params = [], ttl = 300) {
            try {
                // Try Redis first
                if (redis) {
                    const cached = await redis.get(`henry:${key}`);
                    if (cached) return JSON.parse(cached);
                }
                
                // Try local cache
                const localCached = cache.get(key);
                if (localCached) return localCached;
                
                // Execute query
                const result = await pool.query(query, params);
                const data = result.rows;
                
                // Cache results
                cache.set(key, data, ttl);
                if (redis) {
                    await redis.setEx(`henry:${key}`, ttl, JSON.stringify(data));
                }
                
                return data;
            } catch (error) {
                console.error(`Database query error: ${error.message}`);
                throw error;
            }
        }
        
        static async getDashboardMetrics() {
            return this.getCachedQuery(
                'dashboard_metrics',
                'SELECT * FROM mv_dashboard_metrics',
                [],
                60 // Cache for 1 minute
            );
        }
        
        static async searchVeterans(searchTerm, limit = 50, offset = 0) {
            const cacheKey = `search:${searchTerm}:${limit}:${offset}`;
            return this.getCachedQuery(
                cacheKey,
                'SELECT * FROM search_veterans_turbo($1, $2, $3)',
                [searchTerm, limit, offset],
                120 // Cache for 2 minutes
            );
        }
        
        static async getCascadeRisk() {
            return this.getCachedQuery(
                'cascade_risk',
                'SELECT * FROM detect_cascade_risk()',
                [],
                30 // Cache for 30 seconds (real-time critical)
            );
        }
        
        static async getVeteranDetails(id) {
            const cacheKey = `veteran:${id}`;
            return this.getCachedQuery(
                cacheKey,
                `SELECT v.*, 
                        json_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL) as claims,
                        json_agg(DISTINCT ra.*) FILTER (WHERE ra.id IS NOT NULL) as risk_assessments
                 FROM veterans v
                 LEFT JOIN claims c ON c.veteran_id = v.id
                 LEFT JOIN risk_assessments ra ON ra.veteran_id = v.id
                 WHERE v.id = $1
                 GROUP BY v.id`,
                [id],
                600 // Cache for 10 minutes
            );
        }
        
        static async getPredictiveAnalytics() {
            return this.getCachedQuery(
                'predictive_analytics',
                'SELECT * FROM generate_predictive_analytics()',
                [],
                300 // Cache for 5 minutes
            );
        }
        
        static async getPerformanceMetrics() {
            return this.getCachedQuery(
                'performance_metrics',
                'SELECT * FROM v_henry_performance',
                [],
                120 // Cache for 2 minutes
            );
        }
        
        static async invalidateCache(pattern = null) {
            // Clear local cache
            if (pattern) {
                const keys = cache.keys().filter(key => key.includes(pattern));
                cache.del(keys);
            } else {
                cache.flushAll();
            }
            
            // Clear Redis cache
            if (redis) {
                if (pattern) {
                    const keys = await redis.keys(`henry:*${pattern}*`);
                    if (keys.length > 0) {
                        await redis.del(keys);
                    }
                } else {
                    await redis.flushdb();
                }
            }
        }
    }
    
    // 🔥 ULTRA-FAST API ENDPOINTS
    
    // Dashboard metrics (cached, sub-second response)
    app.get('/api/dashboard/metrics', async (req, res) => {
        try {
            const metrics = await HENRYTurboAPI.getDashboardMetrics();
            res.json({
                success: true,
                data: metrics,
                cached: true,
                timestamp: new Date().toISOString(),
                worker_id: process.pid
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // Lightning-fast veteran search
    app.get('/api/veterans/search', async (req, res) => {
        try {
            const { q, limit = 50, offset = 0 } = req.query;
            if (!q || q.length < 2) {
                return res.status(400).json({
                    success: false,
                    error: 'Search term must be at least 2 characters'
                });
            }
            
            const veterans = await HENRYTurboAPI.searchVeterans(q, parseInt(limit), parseInt(offset));
            res.json({
                success: true,
                data: veterans,
                count: veterans.length,
                query: q,
                worker_id: process.pid
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // Real-time cascade risk detection
    app.get('/api/risk/cascade', async (req, res) => {
        try {
            const risks = await HENRYTurboAPI.getCascadeRisk();
            res.json({
                success: true,
                data: risks,
                high_priority_count: risks.filter(r => r.urgency_level === 'IMMEDIATE').length,
                worker_id: process.pid
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // Veteran details (cached)
    app.get('/api/veterans/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const veteran = await HENRYTurboAPI.getVeteranDetails(id);
            
            if (!veteran || veteran.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Veteran not found'
                });
            }
            
            res.json({
                success: true,
                data: veteran[0],
                worker_id: process.pid
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // Predictive analytics
    app.get('/api/analytics/predictive', async (req, res) => {
        try {
            const analytics = await HENRYTurboAPI.getPredictiveAnalytics();
            res.json({
                success: true,
                data: analytics,
                worker_id: process.pid
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // Performance monitoring
    app.get('/api/system/performance', async (req, res) => {
        try {
            const performance = await HENRYTurboAPI.getPerformanceMetrics();
            const memUsage = process.memoryUsage();
            
            res.json({
                success: true,
                data: {
                    database_performance: performance,
                    server_performance: {
                        worker_id: process.pid,
                        memory_usage: {
                            rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
                            heap_used: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
                            heap_total: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`
                        },
                        uptime: `${Math.round(process.uptime())} seconds`,
                        cache_stats: {
                            local_keys: cache.keys().length,
                            local_hits: cache.getStats().hits,
                            local_misses: cache.getStats().misses
                        }
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // Cache management
    app.post('/api/system/cache/clear', async (req, res) => {
        try {
            const { pattern } = req.body;
            await HENRYTurboAPI.invalidateCache(pattern);
            
            res.json({
                success: true,
                message: `Cache cleared${pattern ? ` for pattern: ${pattern}` : ' (all)'}`,
                worker_id: process.pid
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // Health check
    app.get('/api/health', async (req, res) => {
        try {
            // Quick database health check
            const dbCheck = await pool.query('SELECT NOW() as timestamp');
            
            res.json({
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                worker_id: process.pid,
                database: 'connected',
                redis: redis ? 'connected' : 'not_available',
                database_timestamp: dbCheck.rows[0].timestamp
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                status: 'unhealthy',
                error: error.message,
                worker_id: process.pid
            });
        }
    });
    
    // 📡 REAL-TIME WEBSOCKET FOR LIVE UPDATES
    const server = app.listen(CONFIG.port, () => {
        console.log(`🚀 HENRY Turbo API Worker ${process.pid} listening on port ${CONFIG.port}`);
    });
    
    const wss = new WebSocket.Server({ server });
    
    wss.on('connection', (ws) => {
        console.log(`📡 WebSocket client connected (Worker ${process.pid})`);
        
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                
                if (data.type === 'subscribe_risk_alerts') {
                    // Subscribe to real-time risk alerts
                    ws.risk_alerts = true;
                    ws.send(JSON.stringify({
                        type: 'subscribed',
                        channel: 'risk_alerts',
                        worker_id: process.pid
                    }));
                }
                
                if (data.type === 'get_dashboard') {
                    // Send real-time dashboard data
                    const metrics = await HENRYTurboAPI.getDashboardMetrics();
                    ws.send(JSON.stringify({
                        type: 'dashboard_update',
                        data: metrics,
                        worker_id: process.pid
                    }));
                }
                
            } catch (error) {
                ws.send(JSON.stringify({
                    type: 'error',
                    message: error.message,
                    worker_id: process.pid
                }));
            }
        });
        
        ws.on('close', () => {
            console.log(`📡 WebSocket client disconnected (Worker ${process.pid})`);
        });
    });
    
    // Broadcast risk alerts to all connected clients
    setInterval(async () => {
        try {
            const risks = await HENRYTurboAPI.getCascadeRisk();
            const immediateRisks = risks.filter(r => r.urgency_level === 'IMMEDIATE');
            
            if (immediateRisks.length > 0) {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client.risk_alerts) {
                        client.send(JSON.stringify({
                            type: 'risk_alert',
                            data: immediateRisks,
                            count: immediateRisks.length,
                            worker_id: process.pid
                        }));
                    }
                });
            }
        } catch (error) {
            console.error(`Risk alert broadcast error: ${error.message}`);
        }
    }, 30000); // Check every 30 seconds
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log(`🔄 Worker ${process.pid} shutting down gracefully...`);
        server.close(() => {
            pool.end();
            if (redis) redis.quit();
            process.exit(0);
        });
    });
}

// Export for testing
module.exports = { CONFIG };
