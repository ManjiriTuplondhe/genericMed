import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const notificationsRouter = Router();

// GET /api/notifications
notificationsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { role, userId } = req.query;
    const notifications = db.getNotifications(role as string | undefined, userId as string | undefined);
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to get notifications' });
  }
});

// PATCH /api/notifications/:id/read
notificationsRouter.patch('/:id/read', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ok = db.markNotificationAsRead(id);
    if (!ok) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update notification' });
  }
});

// POST /api/notifications/broadcast
notificationsRouter.post('/broadcast', (req: Request, res: Response) => {
  try {
    const { title, message, type, roleTarget } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const notif = db.addNotification({
      title,
      message,
      type: type || 'SYSTEM_ALERT',
      roleTarget: roleTarget || 'all',
      read: false
    });

    res.status(201).json(notif);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to broadcast notification' });
  }
});
