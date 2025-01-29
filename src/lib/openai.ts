import OpenAI from 'openai';
import { config } from './config';

let openai: OpenAI | null = null;
let isConfigValid = false;

try {
  if (config.openai.apiKey?.startsWith('sk-') && config.openai.assistantId) {
    openai = new OpenAI({
      apiKey: config.openai.apiKey,
      dangerouslyAllowBrowser: true
    });
    isConfigValid = true;
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error instanceof Error ? error.message : 'Unknown error');
}

export async function* streamMessage(message: string) {
  if (!isConfigValid || !openai) {
    throw new Error('OpenAI is not properly configured. Please check your API key and Assistant ID.');
  }

  try {
    const thread = await openai.beta.threads.create();
    
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: config.openai.assistantId as string
    });

    let attempts = 0;
    const maxAttempts = 60;
    let lastResponse = '';

    while (attempts < maxAttempts) {
      try {
        const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        if (runStatus.status === 'completed') {
          const messages = await openai.beta.threads.messages.list(thread.id, {
            limit: 1,
            order: 'desc'
          });
          
          if (messages.data.length > 0 && messages.data[0].content.length > 0) {
            const content = messages.data[0].content[0];
            if ('text' in content && content.text.value !== lastResponse) {
              lastResponse = content.text.value;
              yield lastResponse;
            }
          }
          break;
        } 
        
        if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
          throw new Error(`Chat failed: ${runStatus.status}`);
        }
        
        if (runStatus.status === 'in_progress') {
          const messages = await openai.beta.threads.messages.list(thread.id, {
            limit: 1,
            order: 'desc'
          });
          
          if (messages.data.length > 0 && messages.data[0].content.length > 0) {
            const content = messages.data[0].content[0];
            if ('text' in content && content.text.value !== lastResponse) {
              lastResponse = content.text.value;
              yield lastResponse;
            }
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        console.error('Error during message streaming:', error instanceof Error ? error.message : 'Unknown error');
        throw error;
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error('Request timed out after 60 seconds');
    }
  } catch (error) {
    console.error('OpenAI chat error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}