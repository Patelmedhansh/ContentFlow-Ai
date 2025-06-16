import { WorkflowPayload } from '../types';

// Use environment variable for Netlify function proxy base URL, fallback to relative path for local dev
const NETLIFY_PROXY_BASE = import.meta.env.VITE_NETLIFY_FUNCTION_PROXY_BASE_URL || '';

// Determine the webhook URL based on environment
const getWebhookUrl = () => {
  // If Netlify proxy base URL is configured, use the proxy
  if (NETLIFY_PROXY_BASE) {
    return NETLIFY_PROXY_BASE +
      "/.netlify/functions/kestra-proxy" +
      "/api/v1/executions/webhook/contentflow/contentflow-handler/from-web" +
      "?key=contentflow-key";
  }
  
  // Otherwise, use direct Kestra webhook URL for local development
  const directKestraUrl = import.meta.env.VITE_KESTRA_WEBHOOK_URL;
  if (directKestraUrl) {
    return directKestraUrl;
  }
  
  // Fallback to empty string if neither is configured
  return '';
};

const KESTRA_WEBHOOK_URL = getWebhookUrl();

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<boolean> {
    if (!KESTRA_WEBHOOK_URL) {
      throw new Error('Webhook URL is not configured. Please set either VITE_NETLIFY_FUNCTION_PROXY_BASE_URL or VITE_KESTRA_WEBHOOK_URL in your environment variables.');
    }

    try {
      console.log('Sending webhook to automation pipeline:', KESTRA_WEBHOOK_URL);
      
      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle specific status codes
        if (response.status === 404) {
          throw new Error('Automation endpoint not found. Please check your workflow configuration.');
        } else if (response.status === 204) {
          console.log('Workflow skipped due to conditions');
          return true; // 204 is actually success for conditional workflows
        } else {
          console.error(`Webhook failed with status ${response.status}: ${response.statusText}`, errorText);
          throw new Error(`Automation pipeline failed: ${response.status} ${response.statusText}`);
        }
      }

      console.log('Content sent to automation pipeline successfully');
      return true;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const errorMessage = `Unable to connect to content automation pipeline. Please check your network connection and try again.`;
        console.error('Webhook error:', errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error('Automation pipeline error:', error);
        throw error;
      }
    }
  }
}

export const webhookService = new WebhookService();