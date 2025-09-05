/**
 * Comprehensive COD Language Library
 * Pre-approved, legally compliant language templates for Character of Discharge determinations
 */

export interface LanguageTemplate {
  id: string;
  category: string;
  subcategory?: string;
  title: string;
  content: string;
  variables?: string[];
  regulations?: string[];
  notes?: string;
}

export const CODLanguageLibrary: Record<string, LanguageTemplate[]> = {
  // ISSUE SECTION TEMPLATES
  issue: [
    {
      id: 'issue-standard',
      category: 'issue',
      title: 'Standard Issue Statement',
      content: 'Whether the character of discharge for the service period from [START_DATE] to [END_DATE] constitutes a bar to VA benefits under 38 CFR 3.12.',
      variables: ['START_DATE', 'END_DATE']
    },
    {
      id: 'issue-multiple-periods',
      category: 'issue',
      title: 'Multiple Service Periods',
      content: 'Whether the character of discharge for multiple service periods, specifically from [START_DATE_1] to [END_DATE_1] and from [START_DATE_2] to [END_DATE_2], constitutes a bar to VA benefits under 38 CFR 3.12.',
      variables: ['START_DATE_1', 'END_DATE_1', 'START_DATE_2', 'END_DATE_2']
    },
    {
      id: 'issue-insanity',
      category: 'issue',
      subcategory: 'insanity',
      title: 'Issue with Insanity Consideration',
      content: 'Whether the character of discharge for the service period from [START_DATE] to [END_DATE] constitutes a bar to VA benefits under 38 CFR 3.12, including consideration of whether the veteran was insane at the time of the offense(s) leading to discharge under 38 CFR 3.354.',
      variables: ['START_DATE', 'END_DATE'],
      regulations: ['38 CFR 3.12', '38 CFR 3.354']
    },
    {
      id: 'issue-healthcare-eligibility',
      category: 'issue',
      subcategory: 'healthcare',
      title: 'Healthcare Eligibility Specific',
      content: 'Whether the character of discharge for the service period from [START_DATE] to [END_DATE] constitutes a bar to VA healthcare benefits under 38 CFR 3.360, and whether compelling circumstances or insanity exceptions apply.',
      variables: ['START_DATE', 'END_DATE'],
      regulations: ['38 CFR 3.360', '38 CFR 3.354']
    }
  ],

  // EVIDENCE SECTION TEMPLATES
  evidence: [
    {
      id: 'evidence-standard-list',
      category: 'evidence',
      title: 'Standard Evidence List',
      content: `The following evidence was reviewed and considered in making this determination:
• DD Form 214, Certificate of Release or Discharge from Active Duty, showing [DISCHARGE_TYPE] discharge dated [DISCHARGE_DATE]
• Complete service personnel records (SPRs) from [BRANCH] service
• Service treatment records (STRs) covering the period from [START_DATE] to [END_DATE]
• [ADDITIONAL_EVIDENCE]`,
      variables: ['DISCHARGE_TYPE', 'DISCHARGE_DATE', 'BRANCH', 'START_DATE', 'END_DATE', 'ADDITIONAL_EVIDENCE']
    },
    {
      id: 'evidence-court-martial',
      category: 'evidence',
      subcategory: 'court-martial',
      title: 'Court-Martial Evidence',
      content: `• Record of Trial by [COURT_TYPE] Court-Martial dated [TRIAL_DATE]
• Convening Authority Action dated [CA_DATE]
• Staff Judge Advocate's Review dated [SJA_DATE]
• Appellate review documents, if applicable
• Confinement records showing [CONFINEMENT_DETAILS]`,
      variables: ['COURT_TYPE', 'TRIAL_DATE', 'CA_DATE', 'SJA_DATE', 'CONFINEMENT_DETAILS']
    },
    {
      id: 'evidence-mental-health',
      category: 'evidence',
      subcategory: 'mental-health',
      title: 'Mental Health Evidence',
      content: `• Mental health evaluation conducted by [PROVIDER] on [EVAL_DATE]
• Psychiatric hospitalization records from [FACILITY] dated [HOSP_DATES]
• Psychological testing results including [TEST_TYPES]
• Command-directed mental health evaluation dated [CMD_EVAL_DATE]
• Post-service VA mental health treatment records from [VA_FACILITY]`,
      variables: ['PROVIDER', 'EVAL_DATE', 'FACILITY', 'HOSP_DATES', 'TEST_TYPES', 'CMD_EVAL_DATE', 'VA_FACILITY']
    },
    {
      id: 'evidence-combat-related',
      category: 'evidence',
      subcategory: 'combat',
      title: 'Combat-Related Evidence',
      content: `• Combat action reports from [DEPLOYMENT_LOCATION] during [DEPLOYMENT_PERIOD]
• Purple Heart citation dated [PH_DATE]
• Bronze Star with "V" device citation dated [BS_DATE]
• Unit deployment history showing combat operations in [COMBAT_ZONES]
• Traumatic event documentation including [TRAUMA_DETAILS]`,
      variables: ['DEPLOYMENT_LOCATION', 'DEPLOYMENT_PERIOD', 'PH_DATE', 'BS_DATE', 'COMBAT_ZONES', 'TRAUMA_DETAILS']
    }
  ],

  // LAWS AND REGULATIONS TEMPLATES
  regulations: [
    {
      id: 'regs-standard',
      category: 'regulations',
      title: 'Standard Regulations Block',
      content: `The following laws and regulations were considered in this determination:

• 38 U.S.C. § 5303 - Certain bars to benefits
• 38 CFR 3.12 - Character of discharge
• 38 CFR 3.12(b) - Discharges that are a bar to benefits
• 38 CFR 3.12(c) - Conditions under which benefits are not payable
• 38 CFR 3.12(d) - Definition of dishonorable conditions
• 38 CFR 3.354 - Insanity exception
• M21-1, Part III, Subpart v, Chapter 1, Section B - Character of Discharge Determinations`,
      regulations: ['38 U.S.C. § 5303', '38 CFR 3.12', '38 CFR 3.354']
    },
    {
      id: 'regs-healthcare',
      category: 'regulations',
      subcategory: 'healthcare',
      title: 'Healthcare-Specific Regulations',
      content: `Additional healthcare-specific regulations considered:

• 38 U.S.C. § 1710 - Eligibility for hospital, nursing home, and domiciliary care
• 38 CFR 3.360 - Eligibility for health care benefits
• 38 CFR 3.361 - Compelling circumstances determination
• VHA Directive 1601A.02 - Eligibility Determination`,
      regulations: ['38 U.S.C. § 1710', '38 CFR 3.360', '38 CFR 3.361']
    },
    {
      id: 'regs-insanity',
      category: 'regulations',
      subcategory: 'insanity',
      title: 'Insanity Exception Regulations',
      content: `Insanity exception analysis under:

• 38 CFR 3.354(a) - Definition of insanity
• 38 CFR 3.354(b) - Insanity determinations
• M21-1, Part III, Subpart v, Chapter 1, Section B.4 - Insanity Exception Procedures
• VA General Counsel Precedent Opinion 20-90 (Insanity at time of offense)`,
      regulations: ['38 CFR 3.354', 'VAOPGCPREC 20-90']
    }
  ],

  // ANALYSIS SECTION TEMPLATES
  analysis: [
    {
      id: 'analysis-oth-standard',
      category: 'analysis',
      subcategory: 'oth',
      title: 'OTH Discharge Analysis',
      content: `The veteran received an Other Than Honorable (OTH) discharge on [DISCHARGE_DATE] following [REASON_FOR_DISCHARGE]. Under 38 CFR 3.12(b), an OTH discharge is considered issued under dishonorable conditions if it was based on a pattern of behavior that constitutes a willful and persistent disregard of military discipline.

The veteran's service record shows [MISCONDUCT_DETAILS]. This pattern of misconduct included [SPECIFIC_INCIDENTS]. The evidence demonstrates [NUMBER] unauthorized absences totaling [TOTAL_DAYS] days, [NUMBER] Article 15s/NJPs, and [OTHER_DISCIPLINARY_ACTIONS].`,
      variables: ['DISCHARGE_DATE', 'REASON_FOR_DISCHARGE', 'MISCONDUCT_DETAILS', 'SPECIFIC_INCIDENTS', 'NUMBER', 'TOTAL_DAYS', 'OTHER_DISCIPLINARY_ACTIONS']
    },
    {
      id: 'analysis-compelling-circumstances',
      category: 'analysis',
      subcategory: 'compelling',
      title: 'Compelling Circumstances Analysis',
      content: `In evaluating whether compelling circumstances exist that would warrant special consideration, the following factors were examined:

1. Combat Service: The veteran served in [COMBAT_LOCATION] from [COMBAT_START] to [COMBAT_END], participating in [COMBAT_OPERATIONS]. [He/She] was awarded [COMBAT_AWARDS] for valor in combat.

2. Traumatic Experiences: The record documents exposure to [TRAUMATIC_EVENTS], including [SPECIFIC_TRAUMA]. These events occurred [TRAUMA_TIMELINE] before the misconduct began.

3. Mental Health: Evidence shows the veteran was diagnosed with [MH_CONDITIONS] during service. Treatment records indicate [MH_TREATMENT_DETAILS]. The temporal relationship between the mental health symptoms and misconduct suggests [CAUSAL_RELATIONSHIP].

4. Personal Circumstances: The veteran experienced [PERSONAL_CIRCUMSTANCES] during the period of misconduct, including [SPECIFIC_PERSONAL_ISSUES].`,
      variables: ['COMBAT_LOCATION', 'COMBAT_START', 'COMBAT_END', 'COMBAT_OPERATIONS', 'COMBAT_AWARDS', 'TRAUMATIC_EVENTS', 'SPECIFIC_TRAUMA', 'TRAUMA_TIMELINE', 'MH_CONDITIONS', 'MH_TREATMENT_DETAILS', 'CAUSAL_RELATIONSHIP', 'PERSONAL_CIRCUMSTANCES', 'SPECIFIC_PERSONAL_ISSUES']
    },
    {
      id: 'analysis-insanity-positive',
      category: 'analysis',
      subcategory: 'insanity',
      title: 'Positive Insanity Finding',
      content: `The evidence supports a finding that the veteran was insane at the time of the offense(s) leading to discharge. Per 38 CFR 3.354, insanity is defined as a condition where the person, due to disease or defect, lacks the mental capacity to understand the nature and consequences of their acts or is unable to distinguish right from wrong.

Medical evidence shows the veteran was diagnosed with [PSYCHIATRIC_DIAGNOSIS] during service. [PROVIDER_NAME], [PROVIDER_CREDENTIALS], evaluated the veteran on [EVAL_DATE] and opined that the veteran "lacked substantial capacity to appreciate the wrongfulness of [his/her] conduct" at the time of the offenses. This opinion is supported by:

1. Documentation of [PSYCHOTIC_SYMPTOMS] beginning [SYMPTOM_ONSET]
2. Hospitalization records showing [HOSPITALIZATION_DETAILS]
3. Witness statements describing [BEHAVIORAL_OBSERVATIONS]
4. The veteran's documented inability to [FUNCTIONAL_IMPAIRMENTS]

The preponderance of evidence establishes the veteran was insane within the meaning of 38 CFR 3.354 during the commission of the offenses.`,
      variables: ['PSYCHIATRIC_DIAGNOSIS', 'PROVIDER_NAME', 'PROVIDER_CREDENTIALS', 'EVAL_DATE', 'PSYCHOTIC_SYMPTOMS', 'SYMPTOM_ONSET', 'HOSPITALIZATION_DETAILS', 'BEHAVIORAL_OBSERVATIONS', 'FUNCTIONAL_IMPAIRMENTS']
    },
    {
      id: 'analysis-insanity-negative',
      category: 'analysis',
      subcategory: 'insanity',
      title: 'Negative Insanity Finding',
      content: `While the veteran has documented mental health conditions, the evidence does not support a finding of insanity under 38 CFR 3.354. The record shows:

1. The veteran was diagnosed with [MH_DIAGNOSIS], but medical records indicate [he/she] retained the capacity to understand the nature and consequences of [his/her] actions.

2. Command statements and counseling records demonstrate the veteran acknowledged wrongdoing and expressed understanding of military regulations when counseled about [MISCONDUCT_TYPE].

3. The mental health evaluation conducted on [EVAL_DATE] concluded the veteran "retained substantial capacity to appreciate the wrongfulness of [his/her] conduct" despite experiencing [MH_SYMPTOMS].

4. The veteran's ability to [FUNCTIONAL_ABILITIES] during the period of misconduct indicates retention of cognitive capacity to distinguish right from wrong.

Therefore, while mental health conditions may have influenced the veteran's behavior, they did not rise to the level of insanity as defined in 38 CFR 3.354.`,
      variables: ['MH_DIAGNOSIS', 'MISCONDUCT_TYPE', 'EVAL_DATE', 'MH_SYMPTOMS', 'FUNCTIONAL_ABILITIES']
    }
  ],

  // DECISION SECTION TEMPLATES
  decision: [
    {
      id: 'decision-bar-to-benefits',
      category: 'decision',
      subcategory: 'unfavorable',
      title: 'Bar to Benefits',
      content: `Based upon careful review of all evidence of record, the character of the veteran's discharge is considered to have been under dishonorable conditions and constitutes a bar to VA benefits. The discharge resulted from willful and persistent misconduct that demonstrates a disregard for military discipline. No insanity or compelling circumstances exception applies.`,
      regulations: ['38 CFR 3.12(d)']
    },
    {
      id: 'decision-not-bar-insanity',
      category: 'decision',
      subcategory: 'favorable',
      title: 'Not a Bar - Insanity Exception',
      content: `Based upon careful review of all evidence of record, although the veteran's discharge would ordinarily constitute a bar to benefits, the evidence establishes the veteran was insane within the meaning of 38 CFR 3.354 at the time of the offense(s) leading to discharge. Therefore, the character of discharge does not bar entitlement to VA benefits.`,
      regulations: ['38 CFR 3.354']
    },
    {
      id: 'decision-not-bar-compelling',
      category: 'decision',
      subcategory: 'favorable',
      title: 'Not a Bar - Compelling Circumstances',
      content: `Based upon careful review of all evidence of record, compelling circumstances have been identified that warrant special consideration. The veteran's combat service, documented trauma exposure, and service-connected mental health conditions collectively establish that the misconduct leading to discharge was substantially influenced by factors beyond the veteran's control. The character of discharge does not bar entitlement to VA healthcare benefits under 38 CFR 3.360.`,
      regulations: ['38 CFR 3.360']
    },
    {
      id: 'decision-honorable-for-va',
      category: 'decision',
      subcategory: 'favorable',
      title: 'Honorable for VA Purposes',
      content: `Based upon careful review of all evidence of record, the character of the veteran's service is found to be honorable for VA purposes. The discharge, while administratively characterized as [DISCHARGE_TYPE], does not constitute a statutory or regulatory bar to VA benefits under 38 CFR 3.12.`,
      variables: ['DISCHARGE_TYPE'],
      regulations: ['38 CFR 3.12']
    }
  ],

  // REASONS AND BASES TEMPLATES
  reasoning: [
    {
      id: 'reasoning-willful-misconduct',
      category: 'reasoning',
      subcategory: 'unfavorable',
      title: 'Willful Misconduct Reasoning',
      content: `The determination that the veteran's discharge was under dishonorable conditions is based on the following analysis:

Pattern of Misconduct:
The service records document a clear pattern of willful and persistent misconduct spanning [TIME_PERIOD]. This pattern included:
• [INCIDENT_1] on [DATE_1], resulting in [PUNISHMENT_1]
• [INCIDENT_2] on [DATE_2], resulting in [PUNISHMENT_2]
• [INCIDENT_3] on [DATE_3], resulting in [PUNISHMENT_3]

The frequency and severity of these incidents, coupled with the veteran's continued misconduct despite progressive disciplinary action, demonstrate a willful disregard for military authority and discipline.

Lack of Mitigating Factors:
While the veteran [MITIGATING_CLAIM], the evidence shows [CONTRARY_EVIDENCE]. The record indicates the veteran was provided opportunities for rehabilitation through [REHAB_EFFORTS] but failed to modify behavior.

Regulatory Analysis:
Under 38 CFR 3.12(d)(4), a discharge under other than honorable conditions will be considered under dishonorable conditions if the reason for discharge was based on a pattern of behavior that constitutes a willful and persistent disregard of military discipline. The documented pattern of misconduct clearly meets this regulatory standard.`,
      variables: ['TIME_PERIOD', 'INCIDENT_1', 'DATE_1', 'PUNISHMENT_1', 'INCIDENT_2', 'DATE_2', 'PUNISHMENT_2', 'INCIDENT_3', 'DATE_3', 'PUNISHMENT_3', 'MITIGATING_CLAIM', 'CONTRARY_EVIDENCE', 'REHAB_EFFORTS']
    },
    {
      id: 'reasoning-combat-exception',
      category: 'reasoning',
      subcategory: 'favorable',
      title: 'Combat Service Exception Reasoning',
      content: `The determination that compelling circumstances warrant an exception is based on the following comprehensive analysis:

Combat Service and Trauma:
The veteran's exemplary combat service in [COMBAT_LOCATION] from [START_DATE] to [END_DATE] is extensively documented. During this deployment, the veteran:
• Participated in [NUMBER] combat missions
• Was exposed to [COMBAT_INCIDENTS]
• Witnessed [TRAUMATIC_EVENTS]
• Received [COMBAT_AWARDS] for valor

The temporal relationship between combat exposure and subsequent misconduct is significant. The first disciplinary action occurred [TIMEFRAME] after return from deployment, suggesting a direct correlation between combat trauma and behavioral changes.

Mental Health Nexus:
Medical evidence establishes the veteran developed [PTSD/OTHER_CONDITION] as a direct result of combat experiences. [PROVIDER_NAME] opined that "the veteran's misconduct was substantially influenced by [CONDITION], which impaired judgment and impulse control." This opinion is consistent with:
• Treatment records showing [SYMPTOMS]
• Command observations of [BEHAVIORAL_CHANGES]
• The veteran's previously exemplary service record

Proportionality Analysis:
When weighing the veteran's combat service and trauma against the misconduct, the scales tip decidedly in favor of finding compelling circumstances. The misconduct, while serious, must be viewed through the lens of combat-induced mental health conditions that substantially influenced behavior.`,
      variables: ['COMBAT_LOCATION', 'START_DATE', 'END_DATE', 'NUMBER', 'COMBAT_INCIDENTS', 'TRAUMATIC_EVENTS', 'COMBAT_AWARDS', 'TIMEFRAME', 'PTSD/OTHER_CONDITION', 'PROVIDER_NAME', 'CONDITION', 'SYMPTOMS', 'BEHAVIORAL_CHANGES']
    },
    {
      id: 'reasoning-ipr-required',
      category: 'reasoning',
      subcategory: 'ipr',
      title: 'IPR Required Reasoning',
      content: `Individual Personnel Review (IPR) Requirements:
As this determination results in a finding that the discharge constitutes a bar to benefits, Individual Personnel Review procedures under M21-1, Part III, Subpart v, Chapter 1, Section B.7 are required. The veteran must be:

1. Notified of the proposed adverse determination via VA Form 21-0961
2. Provided 60 days to submit additional evidence or argument
3. Afforded the opportunity for a personal hearing if requested
4. Given notice of appellate rights

The file is being forwarded to the IPR unit for processing in accordance with established procedures. No final determination will be made until IPR procedures are complete.`,
      regulations: ['M21-1, Part III, Subpart v, Chapter 1, Section B.7']
    }
  ],

  // FAVORABLE FINDINGS TEMPLATES
  favorable: [
    {
      id: 'favorable-periods',
      category: 'favorable',
      title: 'Favorable Period Finding',
      content: `The following findings are favorable to the claimant and are binding on future determinations:

1. Service Period [START_DATE] to [END_DATE]: This period of service is found to be honorable for VA purposes. The veteran served without disciplinary action and received [AWARDS/COMMENDATIONS].

2. Combat Service: The veteran's combat service in [LOCATION] from [COMBAT_START] to [COMBAT_END] is verified and constitutes honorable service.

3. Service Connection: Nothing in this determination precludes establishing service connection for disabilities incurred or aggravated during any period of honorable service.`,
      variables: ['START_DATE', 'END_DATE', 'AWARDS/COMMENDATIONS', 'LOCATION', 'COMBAT_START', 'COMBAT_END']
    },
    {
      id: 'favorable-medical',
      category: 'favorable',
      subcategory: 'medical',
      title: 'Medical Condition Findings',
      content: `The following medical findings are established as favorable:

1. The veteran was diagnosed with [CONDITION_1] during service, first documented on [DATE_1].

2. Treatment records confirm the veteran sought mental health treatment on [NUMBER] occasions between [START_DATE] and [END_DATE].

3. The relationship between [CONDITION] and the veteran's military service is established through [EVIDENCE/NEXUS].

These findings may be relevant for future service connection claims.`,
      variables: ['CONDITION_1', 'DATE_1', 'NUMBER', 'START_DATE', 'END_DATE', 'CONDITION', 'EVIDENCE/NEXUS']
    }
  ],

  // SPECIAL CIRCUMSTANCES TEMPLATES
  special: [
    {
      id: 'special-desertion',
      category: 'special',
      subcategory: 'desertion',
      title: 'Desertion Analysis',
      content: `The veteran's discharge for desertion requires special analysis under 38 CFR 3.12(c)(6). Desertion is defined as unauthorized absence for a continuous period of 180 days or more, terminated by apprehension or surrender.

The record shows the veteran was absent without authority from [AWOL_START] to [AWOL_END], a period of [TOTAL_DAYS] days. The absence was terminated by [APPREHENSION/SURRENDER] on [TERMINATION_DATE].

[If less than 180 days]: As the period of unauthorized absence was less than 180 continuous days, it does not constitute desertion under VA regulations.

[If 180+ days]: The absence meets the regulatory definition of desertion. However, consideration must be given to whether compelling circumstances or insanity exception applies.`,
      variables: ['AWOL_START', 'AWOL_END', 'TOTAL_DAYS', 'APPREHENSION/SURRENDER', 'TERMINATION_DATE']
    },
    {
      id: 'special-sexual-assault',
      category: 'special',
      subcategory: 'mst',
      title: 'Military Sexual Trauma Consideration',
      content: `The record contains evidence of military sexual trauma (MST) that requires careful consideration in this determination. The veteran reported [MST_INCIDENT] occurring on/around [INCIDENT_DATE].

Supporting evidence includes:
• [EVIDENCE_1]
• [EVIDENCE_2]
• Behavioral changes noted in service records following [DATE]
• Mental health treatment for [RELATED_CONDITIONS]

The temporal relationship between the reported MST and subsequent misconduct is significant. Research recognizes that MST can lead to behavioral changes including [BEHAVIORAL_MANIFESTATIONS]. The veteran's misconduct began [TIMEFRAME] after the reported incident, suggesting a potential causal relationship.

This evidence weighs heavily in favor of finding compelling circumstances that warrant special consideration.`,
      variables: ['MST_INCIDENT', 'INCIDENT_DATE', 'EVIDENCE_1', 'EVIDENCE_2', 'DATE', 'RELATED_CONDITIONS', 'BEHAVIORAL_MANIFESTATIONS', 'TIMEFRAME']
    },
    {
      id: 'special-conscientious-objector',
      category: 'special',
      subcategory: 'conscientious',
      title: 'Conscientious Objector Analysis',
      content: `The veteran's discharge resulted from conscientious objector status under [AR/AFI/REGULATION]. The record shows:

1. The veteran submitted application for conscientious objector status on [APPLICATION_DATE]
2. The application was [APPROVED/DENIED] on [DECISION_DATE]
3. The basis for objection was [RELIGIOUS/MORAL/ETHICAL] beliefs regarding [SPECIFIC_BELIEFS]

Under 38 CFR 3.12(c)(5), discharge as a conscientious objector who refused to perform military duty, wear the uniform, or comply with lawful orders constitutes discharge under dishonorable conditions unless the refusal was based on moral or religious beliefs.

[Analysis of whether exception applies based on specific facts]`,
      variables: ['AR/AFI/REGULATION', 'APPLICATION_DATE', 'APPROVED/DENIED', 'DECISION_DATE', 'RELIGIOUS/MORAL/ETHICAL', 'SPECIFIC_BELIEFS']
    }
  ]
};

// Helper function to get templates by category
export const getTemplatesByCategory = (category: string): LanguageTemplate[] => {
  return CODLanguageLibrary[category] || [];
};

// Helper function to get template by ID
export const getTemplateById = (id: string): LanguageTemplate | undefined => {
  for (const category of Object.values(CODLanguageLibrary)) {
    const template = category.find(t => t.id === id);
    if (template) return template;
  }
  return undefined;
};

// Helper function to replace variables in template content
export const applyTemplateVariables = (
  content: string,
  variables: Record<string, string>
): string => {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    result = result.replace(regex, value);
  }
  return result;
};

// Helper function to get all unique regulations referenced
export const getAllRegulations = (): string[] => {
  const regulations = new Set<string>();
  for (const category of Object.values(CODLanguageLibrary)) {
    for (const template of category) {
      if (template.regulations) {
        template.regulations.forEach(reg => regulations.add(reg));
      }
    }
  }
  return Array.from(regulations).sort();
};

// Export categories for UI
export const TEMPLATE_CATEGORIES = [
  { id: 'issue', label: 'Issue Statements', icon: 'FileText' },
  { id: 'evidence', label: 'Evidence', icon: 'Search' },
  { id: 'regulations', label: 'Laws & Regulations', icon: 'Book' },
  { id: 'analysis', label: 'Analysis', icon: 'Brain' },
  { id: 'decision', label: 'Decisions', icon: 'Gavel' },
  { id: 'reasoning', label: 'Reasons & Bases', icon: 'MessageSquare' },
  { id: 'favorable', label: 'Favorable Findings', icon: 'CheckCircle' },
  { id: 'special', label: 'Special Circumstances', icon: 'AlertTriangle' }
];