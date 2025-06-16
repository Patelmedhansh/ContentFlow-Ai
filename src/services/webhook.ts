import { WorkflowPayload } from '../types';

// Use Netlify function proxy in production, direct URL in development
const isDevelopment = import.meta.env.DEV;
const KESTRA_WEBHOOK_URL = isDevelopment 
  ? (import.meta.env.VITE_KESTRA_WEBHOOK_URL || 'https://ec76-2401-4900-8fc7-ff30-c939-155b-876-8e18.ngrok-free.app/api/v1/executions/webhook/contentflow/contentflow-handler/from-web?key=contentflow-key')
  : '/.netlify/functions/kestra-proxy/api/v1/executions/webhook/contentflow/contentflow-handler/from-web?key=contentflow-key';

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<boolean> {
    try {
      console.log('Sending webhook to:', KESTRA_WEBHOOK_URL);
      console.log('Environment:', isDevelopment ? 'development' : 'production');
      
      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle specific status codes with more detailed messages
        if (response.status === 404) {
          if (isDevelopment) {
            throw new Error('Kestra webhook endpoint not found. Please ensure Kestra is running locally and the webhook URL is correct.');
          } else {
            throw new Error('Automation endpoint not found. The Netlify function proxy may not be deployed correctly.');
          }
        } else if (response.status === 204) {
          console.log('Workflow completed successfully (no content returned)');
          return true;
        } else if (response.status === 502) {
          throw new Error('Automation service is temporarily unavailable. Please try again later.');
        } else {
          console.error(`Webhook failed with status ${response.status}: ${response.statusText}`, errorText);
          throw new Error(`Automation pipeline failed with status ${response.status}. Please check your configuration.`);
        }
      }

      console.log('Content sent to automation pipeline successfully');
      return true;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const errorMessage = isDevelopment 
          ? `Unable to connect to Kestra server. Please ensure Kestra is running and accessible at:\n\n${KESTRA_WEBHOOK_URL}`
          : 'Unable to connect to content automation pipeline. Please check your network connection and try again.';
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