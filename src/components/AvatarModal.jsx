import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Upload, 
  Camera, 
  Check, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundFx } from '../lib/soundEffects';
import { AvatarFrame } from './AvatarFrame';

// Preset RPG Avatars
const PRESET_AVATARS = [
  { id: 'alex', name: 'Alex (Adventurer)', url: '/avatar-alex.jpg' },
  { id: 'cyber', name: 'Cyber Operative', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80' },
  { id: 'paladin', name: 'Golden Knight', url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80' },
  { id: 'mage', name: 'Mystic Mage', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'shadow', name: 'Shadow Scout', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' }
];

export const AvatarModal = ({ isOpen, onClose }) => {
  const { profile, updateProfileAvatar } = useGame();
  const fileInputRef = useRef(null);

  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || '/avatar-alex.jpg');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Sync avatar when modal opens or profile changes
  useEffect(() => {
    if (isOpen && profile?.avatar_url) {
      setSelectedAvatar(profile.avatar_url);
    }
  }, [isOpen, profile?.avatar_url]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle local file upload (user selects image from device)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          // Crop and resize to crisp 400x400 avatar for fast database sync
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');

          // Center-crop to square
          const startX = (img.width - size) / 2;
          const startY = (img.height - size) / 2;
          ctx.drawImage(img, startX, startY, size, size, 0, 0, 400, 400);

          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          setSelectedAvatar(compressed);
          setCustomPhotoUrl(compressed);
          setIsUploading(false);
          soundFx.playClick();
        } catch (err) {
          setSelectedAvatar(reader.result);
          setCustomPhotoUrl(reader.result);
          setIsUploading(false);
        }
      };
      img.onerror = () => {
        setUploadError('Failed to load image.');
        setIsUploading(false);
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    soundFx.playClick();
    if (updateProfileAvatar) {
      await updateProfileAvatar(selectedAvatar);
    }
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-[#0e1424] border border-[#232e4d] p-5 sm:p-6 shadow-2xl relative space-y-4 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182035] transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-heading font-black text-white leading-tight">
              Change Profile Picture (DP)
            </h2>
            <p className="text-[11px] text-slate-400">
              Upload your photo or choose an RPG avatar.
            </p>
          </div>
        </div>

        {uploadError && (
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {uploadError}
          </div>
        )}

        {/* Current Active Preview */}
        <div className="flex flex-col items-center justify-center py-1.5 space-y-1.5 bg-[#0a0f1d]/60 border border-[#1b253b] rounded-2xl p-3">
          <div className="relative flex items-center justify-center">
            <AvatarFrame
              frameName={profile?.equipped_frame}
              avatarUrl={selectedAvatar}
              size="md"
              alt="Avatar Preview"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#6d5df6] text-white hover:bg-[#5b4ae3] shadow-lg border-2 border-[#0e1424] transition-all transform hover:scale-105 z-30"
              title="Upload Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[11px] text-purple-300 font-medium">Avatar & Frame Preview</span>
        </div>

        {/* Option 1: Upload from device */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            1. Upload Your Own Photo
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-purple-500/50 hover:border-purple-400 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Processing Photo...' : 'Click to Upload from Computer / Phone'}</span>
          </button>
        </div>

        {/* Option 2: Choose from RPG Presets */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            2. Or Pick a Preset RPG Avatar
          </label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_AVATARS.map((item) => {
              const isSelected = selectedAvatar === item.url;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedAvatar(item.url);
                  }}
                  className={`relative p-1 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_10px_rgba(109,93,246,0.5)] scale-105'
                      : 'border-[#1e263d] bg-[#111625] hover:border-slate-600'
                  }`}
                  title={item.name}
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full aspect-square rounded-xl object-cover"
                  />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-[#1e263d] text-slate-400 hover:text-white text-xs font-semibold hover:bg-[#151c2e] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="w-1/2 py-2.5 rounded-xl bg-[#6d5df6] hover:bg-[#5b4ae3] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(109,93,246,0.4)] active:scale-95 transition-all"
          >
            Apply Photo
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
