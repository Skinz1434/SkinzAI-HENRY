-- =====================================================
-- PRODUCTION DATABASE POPULATION SCRIPT
-- =====================================================
-- This script generates the same 500 veterans that the dashboard uses
-- Based on the actual data generation logic in mock-data.ts and veteran-data-generator.ts

-- IMPORTANT: This uses the ACTUAL data structure from your dashboard
-- The dashboard generates 500 veterans with extensive profiles

BEGIN;

-- =====================================================
-- GENERATE 500 VETERANS WITH REALISTIC DATA
-- =====================================================

-- Create a function to generate veterans matching the dashboard logic
CREATE OR REPLACE FUNCTION generate_production_veterans() 
RETURNS void AS $$
DECLARE
  v_id UUID;
  v_branch TEXT;
  v_discharge TEXT;
  v_rating INTEGER;
  v_risk_score INTEGER;
  v_risk_level TEXT;
  v_service_start DATE;
  v_service_end DATE;
  v_compensation DECIMAL;
  v_first_name TEXT;
  v_last_name TEXT;
  i INTEGER;
  
  -- Arrays matching mock-data.ts
  first_names TEXT[] := ARRAY['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Mary', 'Patricia', 'Jennifer', 'Linda', 
                               'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Betty', 'Helen', 'Sandra',
                               'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald'];
  last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                              'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  branches TEXT[] := ARRAY['Army', 'Navy', 'Marines', 'Air Force', 'Space Force', 'Coast Guard'];
  
  -- Service locations matching SERVICE_ERAS from veteran-data-generator.ts
  vietnam_locations TEXT[] := ARRAY['Vietnam - Da Nang', 'Vietnam - Saigon', 'Thailand - U-Tapao', 'Laos', 'Cambodia'];
  gulf_locations TEXT[] := ARRAY['Iraq - Baghdad', 'Kuwait', 'Saudi Arabia', 'Bahrain'];
  post911_locations TEXT[] := ARRAY['Afghanistan - Kabul', 'Afghanistan - Kandahar', 'Iraq - Baghdad', 'Iraq - Fallujah', 'Syria', 'Djibouti'];
  
  -- Exposure arrays from veteran-data-generator.ts
  vietnam_exposures TEXT[] := ARRAY['Agent Orange', 'Agent Blue', 'Dioxin', 'Herbicides'];
  gulf_exposures TEXT[] := ARRAY['Oil Well Fires', 'Depleted Uranium', 'Chemical Weapons', 'Pesticides'];
  post911_exposures TEXT[] := ARRAY['Burn Pits', 'IED Blast', 'Sand/Dust', 'Chemical Weapons'];
  
  -- Medical conditions with ICD codes
  conditions_ptsd RECORD;
  conditions_physical RECORD;
  
BEGIN
  -- Generate 500 veterans matching dashboard logic
  FOR i IN 1..500 LOOP
    v_id := uuid_generate_v4();
    
    -- Generate names first so they match
    v_first_name := first_names[1 + floor(random() * array_length(first_names, 1))];
    v_last_name := last_names[1 + floor(random() * array_length(last_names, 1))];
    
    -- Randomly select branch (matching distribution)
    v_branch := branches[1 + floor(random() * array_length(branches, 1))];
    
    -- 85% honorable, 10% general, 5% other (matching mock-data.ts)
    IF random() < 0.85 THEN
      v_discharge := 'Honorable';
      v_rating := floor(random() * 101); -- 0-100% rating
    ELSIF random() < 0.95 THEN
      v_discharge := 'General';
      v_rating := floor(random() * 71); -- 0-70% rating
    ELSE
      v_discharge := 'Other Than Honorable';
      v_rating := 0; -- No benefits
    END IF;
    
    -- Calculate compensation based on 2024 VA rates
    v_compensation := CASE 
      WHEN v_rating = 0 THEN 0
      WHEN v_rating = 10 THEN 171.23
      WHEN v_rating = 20 THEN 338.49
      WHEN v_rating = 30 THEN 524.31
      WHEN v_rating = 40 THEN 755.28
      WHEN v_rating = 50 THEN 1075.16
      WHEN v_rating = 60 THEN 1361.88
      WHEN v_rating = 70 THEN 1716.28
      WHEN v_rating = 80 THEN 1995.01
      WHEN v_rating = 90 THEN 2241.91
      WHEN v_rating = 100 THEN 3737.85
      ELSE v_rating * 17.12 -- Approximate for in-between
    END;
    
    -- Generate service dates based on age groups
    IF i < 100 THEN
      -- Vietnam era veterans (older)
      v_service_start := ('1965-01-01'::DATE + (random() * 3000)::INTEGER);
      v_service_end := v_service_start + (730 + random() * 1460)::INTEGER; -- 2-6 years
    ELSIF i < 300 THEN
      -- Gulf War era
      v_service_start := ('1985-01-01'::DATE + (random() * 3650)::INTEGER);
      v_service_end := v_service_start + (1460 + random() * 2190)::INTEGER; -- 4-10 years
    ELSE
      -- Post-9/11 era
      v_service_start := ('2001-01-01'::DATE + (random() * 5475)::INTEGER);
      v_service_end := v_service_start + (1460 + random() * 2920)::INTEGER; -- 4-12 years
    END IF;
    
    -- Calculate risk scores (Henry Protocol)
    v_risk_score := floor(random() * 100);
    v_risk_level := CASE
      WHEN v_risk_score >= 80 THEN 'Immediate'
      WHEN v_risk_score >= 60 THEN 'High'
      WHEN v_risk_score >= 40 THEN 'Moderate'
      WHEN v_risk_score >= 20 THEN 'Low'
      ELSE 'Minimal'
    END;
    
    -- Insert veteran
    INSERT INTO veterans (
      id, name, first_name, last_name, ssn_encrypted, dob, gender, email, phone,
      street, city, state, zip,
      branch, service_start_date, service_end_date, discharge_status,
      rank, mos, service_number, combat_service,
      disability_rating, monthly_compensation, healthcare_priority, enrolled_va_healthcare,
      risk_score, risk_level, cascade_risk_detected, profile_completeness
    ) VALUES (
      v_id,
      v_first_name || ' ' || v_last_name,
      v_first_name,
      v_last_name,
      encrypt_ssn(
        lpad(floor(random() * 900 + 100)::TEXT, 3, '0') || '-' ||
        lpad(floor(random() * 90 + 10)::TEXT, 2, '0') || '-' ||
        lpad(floor(random() * 9000 + 1000)::TEXT, 4, '0')
      ),
      ('1950-01-01'::DATE + (random() * 18250)::INTEGER), -- DOB between 1950-2000
      CASE WHEN random() > 0.15 THEN 'Male' ELSE 'Female' END, -- 85% male, 15% female
      'veteran' || i || '@example.com',
      '555-' || lpad(floor(random() * 10000)::TEXT, 4, '0'),
      floor(random() * 9999)::TEXT || ' ' || 
        CASE floor(random() * 5)
          WHEN 0 THEN 'Main St'
          WHEN 1 THEN 'Oak Ave'
          WHEN 2 THEN 'Veterans Blvd'
          WHEN 3 THEN 'Military Dr'
          ELSE 'Freedom Way'
        END,
      CASE floor(random() * 10)
        WHEN 0 THEN 'Los Angeles'
        WHEN 1 THEN 'Houston'
        WHEN 2 THEN 'Miami'
        WHEN 3 THEN 'New York'
        WHEN 4 THEN 'Philadelphia'
        WHEN 5 THEN 'Columbus'
        WHEN 6 THEN 'Chicago'
        WHEN 7 THEN 'Atlanta'
        WHEN 8 THEN 'Charlotte'
        ELSE 'Detroit'
      END,
      CASE floor(random() * 10)
        WHEN 0 THEN 'CA'
        WHEN 1 THEN 'TX'
        WHEN 2 THEN 'FL'
        WHEN 3 THEN 'NY'
        WHEN 4 THEN 'PA'
        WHEN 5 THEN 'OH'
        WHEN 6 THEN 'IL'
        WHEN 7 THEN 'GA'
        WHEN 8 THEN 'NC'
        ELSE 'MI'
      END,
      lpad(floor(random() * 100000)::TEXT, 5, '0'),
      v_branch::military_branch,
      v_service_start,
      v_service_end,
      v_discharge::discharge_status,
      CASE v_branch
        WHEN 'Army' THEN CASE floor(random() * 5)
          WHEN 0 THEN 'Private'
          WHEN 1 THEN 'Specialist'
          WHEN 2 THEN 'Sergeant'
          WHEN 3 THEN 'Staff Sergeant'
          ELSE 'Sergeant First Class'
        END
        WHEN 'Navy' THEN CASE floor(random() * 5)
          WHEN 0 THEN 'Seaman'
          WHEN 1 THEN 'Petty Officer Third Class'
          WHEN 2 THEN 'Petty Officer Second Class'
          WHEN 3 THEN 'Petty Officer First Class'
          ELSE 'Chief Petty Officer'
        END
        WHEN 'Marines' THEN CASE floor(random() * 5)
          WHEN 0 THEN 'Private'
          WHEN 1 THEN 'Lance Corporal'
          WHEN 2 THEN 'Corporal'
          WHEN 3 THEN 'Sergeant'
          ELSE 'Staff Sergeant'
        END
        WHEN 'Air Force' THEN CASE floor(random() * 5)
          WHEN 0 THEN 'Airman'
          WHEN 1 THEN 'Airman First Class'
          WHEN 2 THEN 'Senior Airman'
          WHEN 3 THEN 'Staff Sergeant'
          ELSE 'Technical Sergeant'
        END
        ELSE 'Specialist'
      END,
      CASE v_branch -- MOS based on branch
        WHEN 'Army' THEN CASE floor(random() * 5)
          WHEN 0 THEN '11B Infantry'
          WHEN 1 THEN '68W Combat Medic'
          WHEN 2 THEN '31B Military Police'
          WHEN 3 THEN '88M Motor Transport'
          ELSE '25B IT Specialist'
        END
        WHEN 'Navy' THEN CASE floor(random() * 5)
          WHEN 0 THEN 'HM Hospital Corpsman'
          WHEN 1 THEN 'AE Aviation Electrician'
          WHEN 2 THEN 'MA Master at Arms'
          WHEN 3 THEN 'IT Information Systems'
          ELSE 'BM Boatswains Mate'
        END
        WHEN 'Marines' THEN CASE floor(random() * 5)
          WHEN 0 THEN '0311 Rifleman'
          WHEN 1 THEN '3531 Motor Vehicle Operator'
          WHEN 2 THEN '0651 Cyber Operations'
          WHEN 3 THEN '6842 METOC Analyst'
          ELSE '0861 Fire Support'
        END
        WHEN 'Air Force' THEN CASE floor(random() * 5)
          WHEN 0 THEN '4N0X1 Aerospace Medical'
          WHEN 1 THEN '1N8X1 Targeting Analyst'
          WHEN 2 THEN '3D0X2 Cyber Systems'
          WHEN 3 THEN '2A3X3 Aircraft Maintenance'
          ELSE '6C0X1 Contracting'
        END
        ELSE '1N8X1 Targeting Analyst'
      END,
      'SN' || lpad(floor(random() * 10000000)::TEXT, 7, '0'), -- service number
      random() > 0.3, -- 70% combat service
      v_rating,
      v_compensation,
      CASE 
        WHEN v_rating >= 50 THEN 1
        WHEN v_rating >= 30 THEN 2
        WHEN v_rating >= 10 THEN 3
        ELSE 5
      END,
      v_discharge = 'Honorable' AND v_rating > 0,
      v_risk_score,
      v_risk_level::risk_level,
      v_risk_score >= 75 AND random() > 0.5, -- 50% chance of cascade if high risk
      75 + floor(random() * 25) -- 75-100% complete
    );
    
    -- Add deployments for combat veterans
    IF random() > 0.3 THEN -- 70% have deployments
      IF i < 100 THEN -- Vietnam era
        INSERT INTO deployments (veteran_id, location, start_date, end_date, exposures)
        VALUES (
          v_id,
          vietnam_locations[1 + floor(random() * array_length(vietnam_locations, 1))],
          v_service_start + interval '6 months',
          v_service_start + interval '18 months',
          vietnam_exposures
        );
      ELSIF i < 300 THEN -- Gulf War
        INSERT INTO deployments (veteran_id, location, start_date, end_date, exposures)
        VALUES (
          v_id,
          gulf_locations[1 + floor(random() * array_length(gulf_locations, 1))],
          v_service_start + interval '1 year',
          v_service_start + interval '2 years',
          gulf_exposures
        );
      ELSE -- Post-9/11
        INSERT INTO deployments (veteran_id, location, start_date, end_date, exposures)
        VALUES (
          v_id,
          post911_locations[1 + floor(random() * array_length(post911_locations, 1))],
          v_service_start + interval '1 year',
          v_service_start + interval '2 years',
          post911_exposures
        );
      END IF;
    END IF;
    
    -- Add medical conditions based on rating
    IF v_rating >= 30 THEN
      -- Add PTSD for 30% of veterans with 30%+ rating
      IF random() < 0.3 THEN
        INSERT INTO conditions (veteran_id, name, icd10_code, rating, service_connected, effective_date, diagnostic_code)
        VALUES (v_id, 'PTSD', 'F43.10', GREATEST(30, floor(v_rating * 0.7)), true, v_service_end + interval '6 months', '9411');
      END IF;
      
      -- Add Tinnitus for 40% of veterans
      IF random() < 0.4 THEN
        INSERT INTO conditions (veteran_id, name, icd10_code, rating, service_connected, effective_date, diagnostic_code)
        VALUES (v_id, 'Tinnitus', 'H93.1', 10, true, v_service_end + interval '1 year', '6260');
      END IF;
      
      -- Add back condition for 25% of veterans
      IF random() < 0.25 THEN
        INSERT INTO conditions (veteran_id, name, icd10_code, rating, service_connected, effective_date, diagnostic_code)
        VALUES (v_id, 'Lumbar Strain', 'M54.5', 20, true, v_service_end + interval '2 years', '5237');
      END IF;
    END IF;
    
    -- Add claims (2-4 per eligible veteran)
    IF v_discharge = 'Honorable' THEN
      FOR j IN 1..(2 + floor(random() * 3))::INTEGER LOOP
        INSERT INTO claims (veteran_id, claim_number, type, status, filing_date, description)
        VALUES (
          v_id,
          'CL' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || lpad((1000 + i * 10 + j)::TEXT, 4, '0'),
          CASE floor(random() * 5)
            WHEN 0 THEN 'Compensation'
            WHEN 1 THEN 'Increase'
            WHEN 2 THEN 'Secondary'
            WHEN 3 THEN 'Appeal'
            ELSE 'TDIU'
          END::claim_type,
          CASE floor(random() * 7)
            WHEN 0 THEN 'Initial Review'
            WHEN 1 THEN 'Evidence Gathering'
            WHEN 2 THEN 'Review of Evidence'
            WHEN 3 THEN 'Preparation for Decision'
            WHEN 4 THEN 'Pending Decision Approval'
            WHEN 5 THEN 'Preparation for Notification'
            ELSE 'Complete'
          END::claim_status,
          CURRENT_DATE - (random() * 365)::INTEGER,
          'Claim for ' || CASE floor(random() * 5)
            WHEN 0 THEN 'PTSD'
            WHEN 1 THEN 'Hearing Loss'
            WHEN 2 THEN 'Back Condition'
            WHEN 3 THEN 'TBI'
            ELSE 'Sleep Apnea'
          END
        );
      END LOOP;
    END IF;
    
    -- Add risk assessment for high-risk veterans
    IF v_risk_score >= 60 THEN
      INSERT INTO risk_assessments (
        veteran_id,
        medical_risk, mental_health_risk, social_risk,
        economic_risk, behavioral_risk, environmental_risk,
        overall_risk_score, risk_level, cascade_detected,
        prediction_30_day, prediction_60_day, prediction_90_day
      ) VALUES (
        v_id,
        floor(random() * 100), floor(random() * 100), floor(random() * 100),
        floor(random() * 100), floor(random() * 100), floor(random() * 100),
        v_risk_score, v_risk_level::risk_level, v_risk_score >= 75,
        CASE WHEN v_risk_score >= 80 THEN 70 + floor(random() * 30) ELSE 30 + floor(random() * 40) END,
        CASE WHEN v_risk_score >= 70 THEN 60 + floor(random() * 30) ELSE 20 + floor(random() * 40) END,
        CASE WHEN v_risk_score >= 60 THEN 50 + floor(random() * 30) ELSE 10 + floor(random() * 40) END
      );
    END IF;
    
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate all veterans
SELECT generate_production_veterans();

-- Clean up the function
DROP FUNCTION generate_production_veterans();

COMMIT;

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 
  'Production Data Loaded' as status,
  COUNT(*) as total_veterans,
  COUNT(DISTINCT branch) as branches,
  AVG(disability_rating) as avg_rating,
  COUNT(*) FILTER (WHERE risk_level IN ('High', 'Immediate')) as high_risk_count
FROM veterans;