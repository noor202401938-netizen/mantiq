import React, { useState } from 'react';
import { X, Bell, BellRing, Clock, Flame, CheckCircle, Sparkles } from 'lucide-react';
import { SyncManager } from '../utils/syncManager';
import { soundFX } from '../utils/soundEffects';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [reminderTime, setReminderTime] = useState<string>('20:00');
  const [streakProtectorEnabled, setStreakProtectorEnabled] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    soundFX.playClick();
    const granted = await SyncManager.requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      soundFX.playCorrect();
      setMessage('Push notifications enabled! You will receive daily AI study reminders.');
      SyncManager.sendStudyNotification('AIMA Daily AI Reminder', 'Your study streak is active! Ready for today\'s challenge?');
    } else {
      setMessage('Notification permission was declined. You can enable it in your browser settings.');
    }
  };

  const handleTestNotification = () => {
    soundFX.playClick();
    SyncManager.sendStudyNotification(
      'AIMA Exam Prep Nudge',
      'Reminder: Review Chapter 3 (A* Search) heuristics before your upcoming exam!'
    );
    setMessage('Test notification dispatched!');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <Bell size={20} className="text-accent" />
            <h3>Daily Study Reminders & Push Notifications</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="push-permission-card">
            <div className="permission-row">
              <div className="permission-info">
                <BellRing size={24} className="text-accent" />
                <div>
                  <h4 className="permission-title">Browser Web Push Notifications</h4>
                  <p className="permission-desc">
                    Get daily study challenges and keep your study streak alive.
                  </p>
                </div>
              </div>
              <button
                className={`btn-action ${hasPermission ? 'secondary' : 'primary'}`}
                onClick={handleRequestPermission}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {hasPermission ? (
                  <>
                    <CheckCircle size={15} color="#22C55E" />
                    <span>Enabled</span>
                  </>
                ) : (
                  'Enable Notifications'
                )}
              </button>
            </div>
          </div>

          <div className="notification-settings-group">
            <div className="setting-item">
              <div className="setting-label-group">
                <Clock size={16} className="text-accent" />
                <div>
                  <span className="setting-label">Daily Reminder Time</span>
                  <span className="setting-sub">Consistent study time helps memory retention</span>
                </div>
              </div>
              <input
                type="time"
                className="time-input"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>

            <div className="setting-item">
              <div className="setting-label-group">
                <Flame size={16} className="text-accent" />
                <div>
                  <span className="setting-label">Streak Protector Alert</span>
                  <span className="setting-sub">Notify if streak is at risk before midnight</span>
                </div>
              </div>
              <input
                type="checkbox"
                className="toggle-checkbox"
                checked={streakProtectorEnabled}
                onChange={(e) => setStreakProtectorEnabled(e.target.checked)}
              />
            </div>
          </div>

          {message && (
            <div className="status-alert-box success">
              <CheckCircle size={16} />
              <span>{message}</span>
            </div>
          )}

          <div className="test-notify-row">
            <button className="btn-action secondary" onClick={handleTestNotification}>
              <Sparkles size={16} /> Send Test Push Alert
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-action primary full-width" onClick={onClose}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
