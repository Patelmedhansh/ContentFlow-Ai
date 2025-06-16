import { ContentResult, ToneType } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_BASE_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIService {
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(prompt: string, retries = 3): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          
          // Check if it's a rate limit error
          if (response.status === 429 && attempt < retries) {
            // Extract wait time from error message or use exponential backoff
            const errorMessage = error.error?.message || '';
            const waitTimeMatch = errorMessage.match(/try again in (\d+(?:\.\d+)?)s/);
            const waitTime = waitTimeMatch ? parseFloat(waitTimeMatch[1]) * 1000 : Math.pow(2, attempt) * 1000;
            
            console.log(`Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt + 1}/${retries + 1})`);
            await this.sleep(waitTime);
            continue;
          }
          
          throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        
        // For non-rate-limit errors, use exponential backoff
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Request failed, retrying in ${waitTime}ms (attempt ${attempt + 1}/${retries + 1})`);
        await this.sleep(waitTime);
      }
    }

    throw new Error('Max retries exceeded');
  }

  async generateSEOTitle(content: string): Promise<string> {
    const prompt = `Generate a short SEO-optimized blog title (max 60 characters) based on this content: ${content}`;
    return this.makeRequest(prompt);
  }

  async generateMetaDescription(content: string): Promise<string> {
    const prompt = `Generate a meta description under 160 characters for this content: ${content}`;
    return this.makeRequest(prompt);
  }

  async generateSummary(content: string): Promise<string[]> {
    const prompt = `Summarize this content in exactly 3 short bullet points (each under 100 characters): ${content}`;
    const response = await this.makeRequest(prompt);
    return response.split('\n').filter(line => line.trim()).slice(0, 3).map(line => line.replace(/^[•\-\*]\s*/, ''));
  }

  async generateSocialPosts(content: string, tone: ToneType): Promise<{ twitter: string; linkedin: string }> {
    const prompt = `Create one engaging LinkedIn post (max 300 characters) and one tweet (max 280 characters) based on this content in ${tone} tone. Format your response as:
    
LINKEDIN:
[linkedin post here]

TWITTER:
[twitter post here]

Content: ${content}`;

    const response = await this.makeRequest(prompt);
    
    const linkedinMatch = response.match(/LINKEDIN:\s*([\s\S]*?)(?=TWITTER:|$)/i);
    const twitterMatch = response.match(/TWITTER:\s*([\s\S]*?)$/i);

    return {
      linkedin: linkedinMatch?.[1]?.trim() || 'LinkedIn post generation failed',
      twitter: twitterMatch?.[1]?.trim() || 'Twitter post generation failed',
    };
  }

  async processContent(content: string, tone: ToneType): Promise<ContentResult> {
    try {
      const [seoTitle, metaDescription, summary, socialPosts] = await Promise.all([
        this.generateSEOTitle(content),
        this.generateMetaDescription(content),
        this.generateSummary(content),
        this.generateSocialPosts(content, tone),
      ]);

      return {
        seoTitle: seoTitle.replace(/^["']|["']$/g, ''),
        metaDescription: metaDescription.replace(/^["']|["']$/g, ''),
        summary,
        socialPosts,
      };
    } catch (error) {
      console.error('Error processing content:', error);
      throw error;
    }
  }
}

export const openaiService = new OpenAIService();