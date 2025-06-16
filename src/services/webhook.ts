import { WorkflowPayload } from '../types';

const KESTRA_WEBHOOK_URL = import.meta.env.VITE_KESTRA_WEBHOOK_URL || 'https://ec76-2401-4900-8fc7-ff30-c939-155b-876-8e18.ngrok-free.app/api/v1/executions/webhook/contentflow/contentflow-handler/contentflow-key';

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<boolean> {
    try {
      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`Webhook failed with status ${response.status}: ${response.statusText}`);
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Webhook error: Unable to connect to Kestra server. Please ensure Kestra is running and accessible at:', KESTRA_WEBHOOK_URL);
      } else {
        console.error('Webhook error:', error);
      }
      return false;
    }
  }
}

export const webhookService = new WebhookService();