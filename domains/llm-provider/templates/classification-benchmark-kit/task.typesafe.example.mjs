// Direct TypeSafe transport for the same generic ticket-triage example.
// Verify the model ID and endpoint against current provider documentation before use.
import task from './task.example.mjs';

export default {
  ...task,
  endpoint: 'https://api.typesafe.ai/v1/systemone',
  apiKeyEnv: 'TYPESAFE_API_KEY',
  model: 'jev-1.13.0',
};
