// Environment variables for API configuration
export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    assistantId: import.meta.env.VITE_OPENAI_ASSISTANT_ID
  }
};

// Debug function to check configuration
export function debugConfig() {
  // Log all available environment variables
  console.log('Environment Variables Debug:');
  console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY ? '(exists)' : '(undefined)');
  console.log('VITE_OPENAI_ASSISTANT_ID:', import.meta.env.VITE_OPENAI_ASSISTANT_ID ? '(exists)' : '(undefined)');
  
  const apiKeyExists = Boolean(config.openai.apiKey);
  const apiKeyValid = config.openai.apiKey?.startsWith('sk-');
  const assistantIdExists = Boolean(config.openai.assistantId);
  
  console.log('Configuration Check:');
  console.log('- API Key exists:', apiKeyExists);
  console.log('- API Key is valid:', apiKeyValid);
  console.log('- Assistant ID exists:', assistantIdExists);
}