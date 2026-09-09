import React, { useState, useEffect } from 'react';
import { InAppNotification } from '../types';
import { api } from '../services/api';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationCountChange?: (count: number) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNotificationCountChange
}) => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const list = await api.getNotifications();
      setNotifications(list);
      const unread = list.filter((n) => !n.read).length;
      if (onNotificationCountChange) {
        onNotificationCountChange(unread);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    const unread = notifications.filter((n) => n.id !== id && !n.read).length;
    if (onNotificationCountChange) {
      onNotificationCountChange(unread);
    }
  };

  const handleMarkAllRead = async () => {
    for (const notif of notifications) {
      if (!notif.read) {
        await api.markNotificationRead(notif.id);
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (onNotificationCountChange) {
      onNotificationCountChange(0);
    }
  };

  const getIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'PRICE_DROP':
        return { icon: 'trending_down', color: 'text-emerald-400 bg-emerald-500/10' };
      case 'REFILL_REMINDER':
        return { icon: 'medical_services', color: 'text-primary bg-primary/10' };
      case 'SLA_ALERT':
        return { icon: 'bolt', color: 'text-amber-400 bg-amber-500/10' };
      case 'ORDER_STATUS':
        return { icon: 'local_shipping', color: 'text-sky-400 bg-sky-500/10' };
      default:
        return { icon: 'notifications', color: 'text-on-surface-variant bg-surface-variant' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface border border-outline/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-outline/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            <h3 className="font-bold text-base text-on-surface">Notification Center</h3>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="text-[10px] font-bold bg-primary text-on-primary px-2 py-0.5 rounded-full">
                {notifications.filter((n) => !n.read).length} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-variant/50 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-outline/10">
          {loading ? (
            <div className="p-8 text-center text-xs text-on-surface-variant">
              Loading alerts...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-on-surface-variant">
              No notifications yet. You're completely up to date!
            </div>
          ) : (
            notifications.map((notif) => {
              const { icon, color } = getIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-4 flex items-start gap-3 hover:bg-surface-container cursor-pointer transition-colors ${
                    !notif.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-semibold ${!notif.read ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant/80 shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-container/50 border-t border-outline/10 text-center">
          <span className="text-[11px] text-on-surface-variant">
            Real-time multi-tenant fulfillment alerts & TeleRx sync
          </span>
        </div>
      </div>
    </div>
  );
};
