import { WorkflowPayload } from '../types';

const KESTRA_WEBHOOK_URL = import.meta.env.VITE_KESTRA_WEBHOOK_URL || '';

export class WebhookService {
  async sendToKestra(payload: WorkflowPayload): Promise<{ success: boolean; error?: string }> {
    // Check if webhook URL is configured
    if (!KESTRA_WEBHOOK_URL) {
      return { 
        success: false, 
        error: 'Webhook URL not configured. Please set VITE_KESTRA_WEBHOOK_URL in your .env file.' 
      };
    }

    try {
      // Add a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(KESTRA_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `Webhook failed with status ${response.status}: ${response.statusText}`;
        console.error(errorMessage);
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error && error.name === 'AbortError') {
        errorMessage = 'Connection to Kestra webhook timed out. This usually means:\n\n' +
          '• The Kestra server is not responding\n' +
          '• The webhook URL is incorrect or expired\n' +
          '• Network connectivity issues\n\n' +
          `Current webhook URL: ${KESTRA_WEBHOOK_URL}\n\n` +
          'Please verify your Kestra setup and update the VITE_KESTRA_WEBHOOK_URL in your .env file.';
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Unable to connect to Kestra webhook. This usually means:\n\n' +
          '• The Kestra server is not running\n' +
          '• The webhook URL has expired (if using ngrok)\n' +
          '• Network connectivity issues\n' +
          '• CORS is not properly configured on the Kestra server\n\n' +
          `Current webhook URL: ${KESTRA_WEBHOOK_URL}\n\n` +
          'Please verify your Kestra setup and update the VITE_KESTRA_WEBHOOK_URL in your .env file if needed.';
      } else if (error instanceof Error) {
        errorMessage = `Connection failed: ${error.message}\n\n` +
          'This typically indicates a network or server issue. Please check:\n' +
          '• Kestra server is running and accessible\n' +
          '• Webhook URL is correct and active\n' +
          '• No firewall or network restrictions\n\n' +
          `Current webhook URL: ${KESTRA_WEBHOOK_URL}`;
      }
      
      console.error('Webhook error:', error);
      return { success: false, error: errorMessage };
    }
  }

  isConfigured(): boolean {
    return !!KESTRA_WEBHOOK_URL && KESTRA_WEBHOOK_URL.trim() !== '';
  }

  getWebhookUrl(): string {
    return KESTRA_WEBHOOK_URL;
  }
}

export const webhookService = new WebhookService();