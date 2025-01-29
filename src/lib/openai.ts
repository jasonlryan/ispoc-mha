import OpenAI from 'openai';
import { config } from './config';

let openai: OpenAI | null = null;
let isConfigValid = false;

try {
  if (config.openai.apiKey?.startsWith('sk-')) {
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
    throw new Error('OpenAI is not properly configured. Please check your API key.');
  }

  if (!config.openai.assistantId) {
    throw new Error('Assistant ID is not configured.');
  }

  try {
    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: config.openai.assistantId
    });

    let status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (status.status !== 'completed' && status.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 200));
      status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (status.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }

    // Get the messages, focusing on the latest assistant response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

    if (!assistantMessage || !assistantMessage.content[0]) {
      throw new Error('No response received from assistant');
    }

    // Safely handle different content types
    const content = assistantMessage.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from assistant');
    }

    // Stream the response in larger chunks for better performance
    const response = content.text.value;
    const chunkSize = 25; // Stream 25 characters at a time
    let streamedResponse = '';
    
    for (let i = 0; i < response.length; i += chunkSize) {
      const chunk = response.slice(i, i + chunkSize);
      streamedResponse += chunk;
      yield streamedResponse;
      // Updated delay to 10ms between chunks
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  } catch (error) {
    console.error('Error in streamMessage:', error);
    throw error;
  }
}