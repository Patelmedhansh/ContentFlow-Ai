import { WorkflowPayload } from '../types';

const KESTRA_WEBHOOK_URL = import.meta.env.VITE_KESTRA_WEBHOOK_URL || 'http://localhost:8080/api/v1/executions/webhook/contentflow/contentflow-handler/contentflow-key';

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

      return response.ok;
    } catch (error) {
      console.error('Webhook error:', error);
      return false;
    }
  }
}

export const webhookService = new WebhookService();