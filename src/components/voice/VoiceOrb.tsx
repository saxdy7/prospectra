import React, { useEffect, useState } from 'react';

interface VoiceOrbProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  size?: number;
  color?: string;
  onClick?: () => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isSpeaking = false,
  isListening = false,
  size = 180,
  onClick
}) => {
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    if (isSpeaking || isListening) {
      const interval = setInterval(() => {
        setPulse(0.9 + Math.random() * 0.25);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setPulse(1);
    }
  }, [isSpeaking, isListening]);

  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Outer ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: '50%',
          background: isSpeaking
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(255, 77, 139, 0.2) 50%, rgba(0,0,0,0) 70%)'
            : isListening
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(184, 164, 237, 0.2) 50%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(circle, rgba(232, 185, 74, 0.3) 0%, rgba(0,0,0,0) 65%)',
          filter: 'blur(20px)',
          transform: `scale(${pulse})`,
          transition: 'transform 0.15s ease, background 0.3s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Main 3D Sphere */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: isSpeaking
            ? 'radial-gradient(circle at 35% 30%, #ffd080 0%, #f59e0b 45%, #d97706 70%, #92400e 100%)'
            : isListening
            ? 'radial-gradient(circle at 35% 30%, #93c5fd 0%, #3b82f6 45%, #1d4ed8 70%, #1e3a8a 100%)'
            : 'radial-gradient(circle at 35% 30%, #fed7aa 0%, #f59e0b 40%, #ea580c 75%, #9a3412 100%)',
          boxShadow: isSpeaking
            ? '0 20px 40px rgba(245, 158, 11, 0.45), inset -8px -8px 24px rgba(0,0,0,0.35), inset 8px 8px 16px rgba(255,255,255,0.6)'
            : '0 15px 35px rgba(234, 88, 12, 0.35), inset -8px -8px 24px rgba(0,0,0,0.35), inset 8px 8px 16px rgba(255,255,255,0.6)',
          transform: `scale(${pulse})`,
          transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Specular highlights */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '20%',
            width: '28%',
            height: '20%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 80%)',
            transform: 'rotate(-25deg)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};
