
import { Message, MessageRole } from '../utils/chat-utils';

// Use this interface for sending messages to the AI service
export interface AIRequestMessage {
  role: MessageRole;
  content: string;
  id: string;
}

export const callTouristasAI = async (messages: AIRequestMessage[]): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    // Use import.meta.env instead of process.env for Vite applications
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-travel-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      console.error('AI response error:', response.status, response.statusText);
      return null;
    }

    return response.body;
  } catch (error) {
    console.error('Error calling AI assistant:', error);
    return null;
  }
};

export const searchHotels = async (query: string): Promise<any[]> => {
  try {
    // Use import.meta.env instead of process.env for Vite applications
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-hotels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error('Hotel search error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.hotels || [];
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
};

export const processStreamingResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  messageId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<string> => {
  const decoder = new TextDecoder();
  let fullContent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // Decode the chunk and append to the message content
      const chunk = decoder.decode(value, { stream: true });
      fullContent += chunk;
      
      // Update the message with the accumulated content
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: fullContent } 
            : msg
        )
      );
    }
    
    return fullContent;
  } catch (error) {
    console.error('Error processing stream:', error);
    return fullContent;
  }
};
