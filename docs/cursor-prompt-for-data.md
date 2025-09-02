# Cursor Agent Prompt for HENRY Platform Data Population

## Copy this entire prompt to Cursor:

---

I need you to create comprehensive mock data for the HENRY Platform database that's already deployed in Supabase. The database tracks veterans with cascade risk patterns as defined in the HENRY Protocol documentation.

## Context Files to Reference:
- `/resources/HENRY_Platform_Overview.md` - Contains the Henry Protocol methodology
- `/resources/VA_Benefits_Rates_2024.json` - Current VA compensation rates
- `/resources/VA_Disability_Codes.json` - Condition codes and ratings
- `/vis-service-verifier/documentation/CASCADE_RISK_PATTERNS.md` - Detailed cascade patterns
- `/vis-service-verifier/documentation/INTERVENTION_PROTOCOLS.md` - Intervention strategies
- `/vis-service-verifier/lib/supabase/schema.sql` - Database schema

## Requirements:

Create SQL INSERT statements for 20 diverse veterans with:

### 1. Veteran Profiles (veterans table):
- Mix of all military branches
- Service dates from Gulf War to recent Afghanistan/Iraq
- Various discharge statuses (mostly Honorable)
- Disability ratings from 0% to 100%
- Different risk levels following Henry Protocol patterns
- Include encrypted SSNs using: `encrypt_ssn('XXX-XX-XXXX')`
- Realistic names, addresses (use real VA locations from different states)
- Ages ranging from 25 to 75 years old

### 2. For EACH Veteran Include:

#### Deployments (2-3 per veteran):
- Iraq: Baghdad, Fallujah, Mosul (2003-2011)
- Afghanistan: Kabul, Kandahar, Bagram (2001-2021)
- Include exposure arrays: ['Combat', 'Burn Pits', 'IED', 'Chemical', 'Noise']

#### Medical Conditions (3-5 per veteran):
- Use actual ICD-10 codes from VA_Disability_Codes.json
- Service-connected conditions with ratings
- Common conditions: PTSD (F43.1), Tinnitus (H93.1), Back Pain (M54.5), TBI (S06.0)
- Match disability ratings to overall rating

#### Medications (2-4 per veteran):
- Realistic VA prescriptions
- Mental health meds for PTSD cases
- Pain management for physical conditions
- Include prescriber names like "Dr. Smith, VA Mental Health"

#### Claims (1-3 per veteran):
- Various stages per claim_status enum
- Realistic claim numbers (CLM-2024-XXXXX)
- Mix of initial claims and appeals
- Different phases of processing

#### Risk Assessments (2-3 per veteran over time):
- Follow CASCADE_RISK_PATTERNS.md patterns
- Mental Health-Substance Cascade (scores 70+/60+)
- Housing-Financial Cascade (scores 70+/70+)
- Health-Isolation Cascade (scores 80+/60+)
- Include predictive data (days_until_crisis, crisis_probability)
- Generate appropriate interventions using JSONB format

#### Appointments (3-5 upcoming per veteran):
- Mental Health, Primary Care, C&P Exams
- VA Medical Centers from their state
- Mix of attended/missed for history

#### Interventions (for high-risk veterans):
- Based on risk assessment scores
- Follow INTERVENTION_PROTOCOLS.md
- Include immediate, high, and routine priority levels
- Assign to case managers

#### Audit Trail Entries:
- Login events
- Profile updates
- Risk assessment reviews
- Document access logs

### 3. Special Cases to Include:

1. **Crisis Case**: Veteran with immediate risk (score 85+), cascade detected, 7 days until crisis
2. **Success Story**: Veteran who improved from high to moderate risk over assessments
3. **New Veteran**: Recently separated, initial claim filing
4. **Elderly Veteran**: Vietnam era, multiple conditions, stable but complex
5. **Female Veteran**: MST-related claims, specific women's health needs

### 4. Data Relationships:
- Ensure all foreign keys match
- Veteran IDs should cascade through all related tables
- Dates should be logical (appointments future, deployments past)
- Risk scores should justify risk levels

### 5. Format Requirements:
- Use transaction blocks for data integrity
- Include comments explaining each veteran's scenario
- Generate UUIDs using uuid_generate_v4()
- Use proper date formats
- Follow the enum types exactly

## Example Structure:

```sql
-- Transaction for Veteran 1: John Smith - Combat Veteran with PTSD, High Risk
BEGIN;

-- Insert veteran
INSERT INTO veterans (id, name, ssn_encrypted, ...) VALUES 
(uuid_generate_v4(), 'John Smith', encrypt_ssn('123-45-6789'), ...);

-- Insert related deployments
INSERT INTO deployments (veteran_id, location, ...) VALUES ...;

-- Insert conditions
INSERT INTO conditions (veteran_id, name, icd10_code, ...) VALUES ...;

-- Continue for all tables...

COMMIT;
```

Create realistic, medically accurate data that demonstrates the HENRY Platform's cascade risk detection capabilities. Each veteran should tell a story that case managers would actually encounter in VA systems.

---

## Additional Instructions for Cursor:

1. Read all referenced documentation files first
2. Create a single SQL file with all INSERT statements
3. Include helpful comments about cascade patterns being demonstrated
4. Ensure data validates against all constraints
5. Test that the risk calculation functions will work with this data
6. Make the data compelling for demonstrations but respectful to actual veterans