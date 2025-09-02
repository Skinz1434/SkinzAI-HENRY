import { createClient } from '@supabase/supabase-js';
import { veteranDataService } from '../veteran-data-service';
import type { Database } from './database.types';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// This script migrates the local veteran data to Supabase
// Run with: npx tsx lib/supabase/migrate-data.ts

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper function to encrypt SSN (mock encryption for demo)
function encryptSSN(ssn: string): string {
  // In production, use proper encryption
  return Buffer.from(ssn).toString('base64');
}

// Helper function to determine risk level
function getRiskLevel(score: number): Database['public']['Tables']['veterans']['Row']['risk_level'] {
  if (score >= 90) return 'Immediate';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Low';
  return 'Minimal';
}

async function migrateVeterans() {
  console.log('Starting veteran data migration to Supabase...');
  
  const veterans = veteranDataService.getAllVeterans();
  console.log(`Found ${veterans.length} veterans to migrate`);

  let successCount = 0;
  let errorCount = 0;

  for (const veteran of veterans) {
    try {
      // Prepare veteran data for insertion
      const veteranData: Database['public']['Tables']['veterans']['Insert'] = {
        id: veteran.id,
        ssn_encrypted: encryptSSN(veteran.ssn),
        name: veteran.name,
        dob: veteran.dob,
        gender: veteran.gender,
        email: veteran.email,
        phone: veteran.phone,
        street: veteran.address.street,
        city: veteran.address.city,
        state: veteran.address.state,
        zip: veteran.address.zip,
        branch: veteran.branch as any,
        service_start_date: veteran.serviceYears.split('-')[0] + '-01-01',
        service_end_date: veteran.dischargeDate,
        discharge_status: veteran.dischargeStatus as any,
        rank: veteran.rank,
        mos: veteran.mos,
        combat_service: veteran.combatService,
        disability_rating: veteran.disabilityRating,
        monthly_compensation: veteran.monthlyCompensation,
        healthcare_priority: veteran.healthcarePriority,
        enrolled_va_healthcare: veteran.enrolledVAHealthcare,
        risk_score: Math.floor(Math.random() * 100), // Generate random risk score for demo
        risk_level: getRiskLevel(Math.floor(Math.random() * 100)),
        profile_completeness: 85,
      };

      // Insert veteran
      const { data: insertedVeteran, error: veteranError } = await supabase
        .from('veterans')
        .insert(veteranData)
        .select()
        .single();

      if (veteranError) {
        throw veteranError;
      }

      console.log(`✓ Migrated veteran: ${veteran.name}`);

      // Migrate deployments
      if (veteran.deployments && veteran.deployments.length > 0) {
        const deployments = veteran.deployments.map(deployment => ({
          veteran_id: insertedVeteran.id,
          location: deployment.location,
          start_date: deployment.startDate,
          end_date: deployment.endDate,
          exposures: deployment.exposures,
        }));

        const { error: deploymentError } = await supabase
          .from('deployments')
          .insert(deployments);

        if (deploymentError) {
          console.error(`  ✗ Error migrating deployments for ${veteran.name}:`, deploymentError);
        } else {
          console.log(`  ✓ Migrated ${deployments.length} deployments`);
        }
      }

      // Migrate conditions
      if (veteran.conditions && veteran.conditions.length > 0) {
        const conditions = veteran.conditions.map(condition => ({
          veteran_id: insertedVeteran.id,
          name: condition.name,
          rating: condition.rating,
          service_connected: condition.serviceConnected,
          effective_date: condition.effectiveDate,
          diagnostic_code: condition.diagnosticCode,
        }));

        const { error: conditionError } = await supabase
          .from('conditions')
          .insert(conditions);

        if (conditionError) {
          console.error(`  ✗ Error migrating conditions for ${veteran.name}:`, conditionError);
        } else {
          console.log(`  ✓ Migrated ${conditions.length} conditions`);
        }
      }

      // Migrate claims
      if (veteran.pendingClaims && veteran.pendingClaims.length > 0) {
        const claims = veteran.pendingClaims.map((claim, index) => ({
          veteran_id: insertedVeteran.id,
          claim_number: `CL-${veteran.id}-${index + 1}`,
          condition: claim.condition,
          filed_date: claim.filedDate,
          status: claim.status as any,
          last_update: claim.lastUpdate,
          current_phase: Math.floor(Math.random() * 8) + 1,
          priority: false,
        }));

        const { error: claimError } = await supabase
          .from('claims')
          .insert(claims);

        if (claimError) {
          console.error(`  ✗ Error migrating claims for ${veteran.name}:`, claimError);
        } else {
          console.log(`  ✓ Migrated ${claims.length} claims`);
        }
      }

      // Migrate medications
      if (veteran.medications && veteran.medications.length > 0) {
        const medications = veteran.medications.map(medication => ({
          veteran_id: insertedVeteran.id,
          name: medication.name,
          dosage: medication.dosage,
          prescriber: medication.prescriber,
          start_date: medication.startDate,
          active: true,
        }));

        const { error: medicationError } = await supabase
          .from('medications')
          .insert(medications);

        if (medicationError) {
          console.error(`  ✗ Error migrating medications for ${veteran.name}:`, medicationError);
        } else {
          console.log(`  ✓ Migrated ${medications.length} medications`);
        }
      }

      // Migrate appointments
      if (veteran.appointments && veteran.appointments.length > 0) {
        const appointments = veteran.appointments.map(appointment => ({
          veteran_id: insertedVeteran.id,
          date: appointment.date,
          provider: appointment.provider,
          type: appointment.type,
          location: appointment.location,
          notes: appointment.notes,
        }));

        const { error: appointmentError } = await supabase
          .from('appointments')
          .insert(appointments);

        if (appointmentError) {
          console.error(`  ✗ Error migrating appointments for ${veteran.name}:`, appointmentError);
        } else {
          console.log(`  ✓ Migrated ${appointments.length} appointments`);
        }
      }

      // Create initial risk assessment
      const riskAssessment = {
        veteran_id: insertedVeteran.id,
        mental_health_score: Math.floor(Math.random() * 100),
        financial_score: Math.floor(Math.random() * 100),
        housing_score: Math.floor(Math.random() * 100),
        substance_score: Math.floor(Math.random() * 100),
        social_score: Math.floor(Math.random() * 100),
        physical_health_score: Math.floor(Math.random() * 100),
        overall_risk_score: insertedVeteran.risk_score,
        risk_level: insertedVeteran.risk_level,
        confidence_score: 0.85,
        cascade_risk: Math.random() > 0.7,
        days_until_crisis: Math.floor(Math.random() * 60) + 30,
        crisis_probability: Math.random() * 0.5,
        recommendations: {
          primary: 'Continue monitoring',
          actions: ['Regular check-ins', 'Medication adherence monitoring'],
        },
      };

      const { error: assessmentError } = await supabase
        .from('risk_assessments')
        .insert(riskAssessment);

      if (assessmentError) {
        console.error(`  ✗ Error creating risk assessment for ${veteran.name}:`, assessmentError);
      } else {
        console.log(`  ✓ Created risk assessment`);
      }

      successCount++;
    } catch (error) {
      console.error(`✗ Error migrating veteran ${veteran.name}:`, error);
      errorCount++;
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`✓ Successfully migrated: ${successCount} veterans`);
  console.log(`✗ Failed migrations: ${errorCount} veterans`);
  console.log(`Total processed: ${veterans.length} veterans`);
}

// Run the migration
migrateVeterans()
  .then(() => {
    console.log('\nMigration completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });