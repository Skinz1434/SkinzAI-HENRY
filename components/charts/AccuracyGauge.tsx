'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AccuracyGaugeProps {
  value: number;
  threshold: number;
  size?: number;
}

export function AccuracyGauge({ value, threshold, size = 200 }: AccuracyGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - 20;
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const currentAngle = startAngle + ((value / 100) * (endAngle - startAngle));

    ctx.clearRect(0, 0, size, size);

    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(45, 49, 57, 0.6)';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw value arc with gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    if (value >= threshold) {
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#059669');
    } else {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#dc2626');
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw threshold line
    const thresholdAngle = startAngle + ((threshold / 100) * (endAngle - startAngle));
    const thresholdX1 = centerX + (radius - 25) * Math.cos(thresholdAngle);
    const thresholdY1 = centerY + (radius - 25) * Math.sin(thresholdAngle);
    const thresholdX2 = centerX + (radius + 25) * Math.cos(thresholdAngle);
    const thresholdY2 = centerY + (radius + 25) * Math.sin(thresholdAngle);

    ctx.beginPath();
    ctx.moveTo(thresholdX1, thresholdY1);
    ctx.lineTo(thresholdX2, thresholdY2);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center text
    ctx.font = 'bold 36px Inter';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value.toFixed(1)}%`, centerX, centerY - 10);

    ctx.font = '14px Inter';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Accuracy', centerX, centerY + 20);

    // Draw threshold label
    ctx.font = '12px Inter';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${threshold}% threshold`, centerX, centerY + 40);
  }, [value, threshold, size]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full h-full"
      />
      {value >= threshold && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"
        />
      )}
    </motion.div>
  );
}