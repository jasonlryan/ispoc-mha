import { streamMessage } from './openai';

export async function sendMessage(message: string, onUpdate: (content: string) => void) {
  try {
    const messageStream = streamMessage(message);
    let hasReceivedResponse = false;
    
    for await (const chunk of messageStream) {
      hasReceivedResponse = true;
      onUpdate(chunk);
    }

    if (!hasReceivedResponse) {
      throw new Error('No response received from the assistant');
    }
  } catch (error) {
    console.error('Chat error:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        onUpdate('Error: OpenAI API key is missing or invalid. Please check your environment variables.');
      } else if (error.message.includes('Assistant ID')) {
        onUpdate('Error: OpenAI Assistant ID is missing. Please check your environment variables.');
      } else {
        onUpdate(`Error: ${error.message}`);
      }
    } else {
      onUpdate('I apologize, but I\'m currently unable to process your request. Please try again later.');
    }
  }
}