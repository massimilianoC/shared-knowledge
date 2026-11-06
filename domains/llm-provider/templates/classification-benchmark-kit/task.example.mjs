// Example task. Verify the endpoint and model before use, then replace the policy and labels.
const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default {
  name: 'ticket-triage-example',
  endpoint: 'https://openrouter.ai/api/v1/systemone',
  apiKeyEnv: 'OPENROUTER_API_KEY',
  model: 'typesafe/jev-1.13',
  questions: {
    priority: {
      type: 'score',
      instructions: {
        question: 'Which priority level does policy assign to item?',
        apply: 'Apply policy to item only.',
      },
      criteria: [
        'LOW: no action needed, unwanted promotion, or thanks.',
        'MEDIUM: exploratory request without commitment or deadline.',
        'HIGH: concrete request or active issue without an immediate blocking deadline.',
        'CRITICAL: current operational block or binding near-term deadline.',
      ],
    },
    intent: {
      type: 'choice',
      instructions: 'What is the primary intent of item?',
      criteria: {
        quote: 'Requests a price or proposal.',
        support: 'Reports a technical problem or asks for assistance.',
        info: 'Requests general information.',
        complaint: 'Reports dissatisfaction or a defect.',
        spam: 'Unwanted promotion or fraud.',
        other: 'None of the above.',
      },
    },
    real_deadline: {
      type: 'noul',
      instructions: 'Item states a concrete deadline or ongoing operational block, not merely a claim of urgency.',
    },
  },
  buildState: (record) => ({
    policy: record.policy ?? '',
    item: { subject: record.subject, body: record.body },
  }),
  targets: [
    { key: 'priority', answer: 'priority', kind: 'ordinal', levels },
    { key: 'intent', answer: 'intent', kind: 'nominal' },
  ],
  signals: ['real_deadline'],
  // Illustrative routing rules, not validated acceptance thresholds.
  gates: { priority: 0.9, intent: 0.85 },
  alwaysEscalate: (prediction) => prediction.priority === 'CRITICAL',
  hardErrors: [
    {
      name: 'false-critical-on-low-or-medium',
      when: (prediction, record) =>
        prediction.priority === 'CRITICAL' && ['LOW', 'MEDIUM'].includes(record.expected.priority),
    },
  ],
};
