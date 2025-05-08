// Update the interface to include 'id' if it's not already there
import { Message, MessageRole } from '../utils/chat-utils';

// Add this interface if it doesn't exist already
interface AIRequestMessage {
  role: MessageRole;
  content: string;
  id: string;  // Add the id field
}

export const callTouristasAI = async (messages: AIRequestMessage[]): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    // We can simply pass through the messages with their id properties
    // The actual Supabase function might not use the id field, but it's now part of the interface
    const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/ai-travel-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
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
    const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/search-hotels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
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
