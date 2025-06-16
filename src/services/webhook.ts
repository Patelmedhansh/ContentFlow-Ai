import { WorkflowPayload } from '../types';

const KESTRA_WEBHOOK_URL = import.meta.env.VITE_KESTRA_WEBHOOK_URL || 'https://ec76-2401-4900-8fc7-ff30-c939-155b-876-8e18.ngrok-free.app/api/v1/executions/webhook/contentflow/contentflow-handler/contentflow-key';

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = `Webhook failed with status ${response.status}: ${response.statusText}`;
        console.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to Kestra server. Please ensure Kestra is running and accessible, or check your network connection.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      console.error('Webhook error:', error);
      return { success: false, error: errorMessage };
    }
  }

  isConfigured(): boolean {
    return !!import.meta.env.VITE_KESTRA_WEBHOOK_URL;
  }

  getWebhookUrl(): string {
    return KESTRA_WEBHOOK_URL;
  }
}

export const webhookService = new WebhookService();