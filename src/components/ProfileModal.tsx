import React, { useState } from 'react';
import { X, User, Check, ShieldCheck, Calendar, Target, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { soundFX } from '../utils/soundEffects';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATARS = ['AM', 'ER', 'MV', 'AK', 'HT', 'AI', 'RN', 'NN', 'RL', 'TA'];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuth();
  const { stats, examReadinessScore } = useProgress();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [targetExamDate, setTargetExamDate] = useState(user.targetExamDate || '2026-12-15');
  const [targetScore, setTargetScore] = useState(user.targetScore || 95);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundFX.playCorrect();
    updateProfile({
      name,
      avatar,
      targetExamDate,
      targetScore
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <User size={20} className="text-accent" />
            <h3>Scholar Profile & Exam Goals</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Avatar Picker */}
          <div className="form-group">
            <label className="form-label">Select Avatar Icon</label>
            <div className="avatar-picker-grid">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  className={`avatar-option ${avatar === av ? 'selected' : ''}`}
                  onClick={() => {
                    soundFX.playClick();
                    setAvatar(av);
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
            />
          </div>

          {/* Target Exam Date */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">
                <Calendar size={14} /> Upcoming AI Exam Date
              </label>
              <input
                type="date"
                className="text-input"
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
              />
            </div>

            <div className="form-group flex-1">
              <label className="form-label">
                <Target size={14} /> Target Score (%)
              </label>
              <input
                type="number"
                min="50"
                max="100"
                className="text-input"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Persistent Session Security Badge */}
          <div className="security-notice-box">
            <ShieldCheck size={18} className="text-success" />
            <div>
              <strong>Secure Local Session Persistence</strong>
              <p>Your session tokens and chapter quiz progress are safely hashed in your local browser sandbox and synced across devices.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-action secondary text-danger" onClick={logout}>
            Logout / Switch Profile
          </button>

          <button className="btn-action primary" onClick={handleSave}>
            {savedSuccess ? (
              <>
                <Check size={16} /> Saved!
              </>
            ) : (
              'Save Profile Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
