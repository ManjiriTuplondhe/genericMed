import { db } from '../db';
import { logger } from '../utils/logger';

export class WebhookService {
  public static dispatchEvent(topic: string, entityContext: string, endpoint?: string): void {
    const targetEndpoint = endpoint || 'https://api.healthbridge.io/webhooks/listener';
    const latencyMs = Math.floor(20 + Math.random() * 50);

    const event = db.addWebhookEvent({
      topic,
      entityContext,
      targetEndpoint,
      responseCode: 200,
      latencyMs,
      dispatchedAgo: 'Just now'
    });

    logger.info(`[WEBHOOK DISPATCH] ${topic} -> ${entityContext} (${latencyMs}ms)`, { eventId: event.id });
  }
}
