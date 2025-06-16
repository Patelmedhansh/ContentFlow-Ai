// src/services/webhook.ts

import { WorkflowPayload } from '../types';

// Read the full proxy URL from env, or default to your Netlify function URL
const KESTRA_WEBHOOK_URL =
  import.meta.env.VITE_KESTRA_WEBHOOK_URL ||
  'https://ubiquitous-paprenjak-47115a.netlify.app' +
  '/.netlify/functions/kestra-proxy' +
  '/api/v1/executions/webhook/contentflow/contentflow-handler/from-web' +
  '?key=contentflow-key';

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<boolean> {
    try {
      console.log('Sending webhook to:', KESTRA_WEBHOOK_URL);

      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentPayload: payload }),
      });

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 404) {
          throw new Error(
            'Automation endpoint not found. Please check your workflow configuration.'
          );
        } else if (response.status === 204) {
          console.log('Workflow completed successfully (no content returned)');
          return true;
        } else if (response.status === 502) {
          throw new Error('Automation service is temporarily unavailable.');
        } else {
          console.error(`Kestra error ${response.status}`, text);
          throw new Error(
            `Automation pipeline failed (status ${response.status}).`
          );
        }
      }

      console.log('Content sent to automation pipeline successfully');
      return true;
    } catch (err: any) {
      // Network or CORS failures
      if (err instanceof TypeError) {
        const msg =
          'Unable to connect to content automation pipeline. Please check your network or proxy configuration.';
        console.error('Webhook error:', msg);
        throw new Error(msg);
      }
      console.error('Automation pipeline error:', err);
      throw err;
    }
  }
}

export const webhookService = new WebhookService();