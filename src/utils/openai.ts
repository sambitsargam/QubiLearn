const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: OpenAIMessage[]): Promise<string> {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  }

  getSystemPrompt(): string {
    return `You are an expert AI tutor specializing in Qubic blockchain development and C++ smart contracts. Your role is to help students learn:

1. Qubic blockchain fundamentals and architecture
2. C++ programming for smart contracts
3. Best practices for secure smart contract development
4. Debugging and optimization techniques
5. Qubic-specific concepts like Computors, Epochs, and the Spectrum

Guidelines:
- Provide clear, beginner-friendly explanations
- Use practical examples and code snippets
- Encourage hands-on learning
- Help debug code issues
- Explain concepts step-by-step
- Be encouraging and supportive
- Focus on practical application

Always be helpful, accurate, and educational in your responses.`;
  }
}

export const createOpenAIService = (apiKey: string) => {
  return new OpenAIService(apiKey);
};

export const getOpenAIApiKey = (): string => {
  // First try environment variable, then fall back to localStorage
  return import.meta.env.VITE_OPENAI_API_KEY || getApiKey();
};