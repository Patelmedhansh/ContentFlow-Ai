import { WorkflowPayload } from '../types';

const KESTRA_WEBHOOK_URL = import.meta.env.VITE_KESTRA_WEBHOOK_URL || 'https://ec76-2401-4900-8fc7-ff30-c939-155b-876-8e18.ngrok-free.app/api/v1/executions/webhook/contentflow/contentflow-handler/from-web?key=contentflow-key';

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<boolean> {
    try {
      console.log('Sending webhook to:', KESTRA_WEBHOOK_URL);
      
      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook failed with status ${response.status}: ${response.statusText}`, errorText);
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      console.log('Webhook sent successfully');
      return true;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const errorMessage = `Unable to connect to Kestra server. Please ensure Kestra is running and accessible at:\n\n${KESTRA_WEBHOOK_URL}`;
        console.error('Webhook error:', errorMessage);
        throw new Error(errorMessage);
      } else {
        console.error('Webhook error:', error);
        throw error;
      }
    }
  }
}

export const webhookService = new WebhookService();