// src/services/webhook.ts

import { WorkflowPayload } from '../types';

const KESTRA_WEBHOOK_URL =
  import.meta.env.VITE_KESTRA_WEBHOOK_URL ||
  '/.netlify/functions/kestra-proxy' +
  '/api/v1/executions/webhook/contentflow/contentflow-handler/from-web' +
  '?key=contentflow-key';

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<boolean> {
    try {
      console.log('Sending webhook to:', KESTRA_WEBHOOK_URL);

      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentPayload: payload }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        // Handle specific status codes
        if (response.status === 404) {
          throw new Error(
            'Automation endpoint not found. Please check your workflow configuration.'
          );
        } else if (response.status === 204) {
          console.log('Workflow completed successfully (no content returned)');
          return true;
        } else if (response.status === 502) {
          throw new Error(
            'Automation service is temporarily unavailable. Please try again later.'
          );
        } else {
          console.error(
            `Webhook failed with status ${response.status}: ${response.statusText}`,
            errorText
          );
          throw new Error(
            `Automation pipeline failed with status ${response.status}. Please check your configuration.`
          );
        }
      }

      console.log('Content sent to automation pipeline successfully');
      return true;
    } catch (error: any) {
      // Network-level errors (e.g. DNS, CORS)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const errorMessage =
          'Unable to connect to content automation pipeline. Please check your network connection and try again.';
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