"use client";

import React, { useState } from 'react';

const PivotDoorAnimation = () => {
  const [openAmount, setOpenAmount] = useState(0);
  const [pivotType, setPivotType] = useState<'offset' | 'center'>('offset');
  const [material, setMaterial] = useState<'wood' | 'metal'>('wood');
  const [isAnimating, setIsAnimating] = useState(false);

  const animateDoor = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const targetValue = openAmount > 50 ? 0 : 100;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = openAmount;
    const difference = targetValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out function for smooth animation
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newValue = startValue + (difference * easeProgress);
      setOpenAmount(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const rotationAngle = (openAmount / 100) * 90;
  const pivotOrigin = pivotType === 'center' ? '50% 50%' : '12% 50%';

  const doorBackground = material === 'wood'
    ? 'linear-gradient(180deg, #A67C52 0%, #8B6914 30%, #7C5E3C 70%, #6B4E31 100%)'
    : 'linear-gradient(180deg, #52525B 0%, #3F3F46 30%, #27272A 70%, #18181B 100%)';

  const frameColor = material === 'wood' ? '#5C4033' : '#27272A';

  const OutdoorScene = ({ opacity }: { opacity: number }) => (
    <div style={{
      position: 'absolute',
      inset: 0,
      opacity,
      transition: 'opacity 0.4s ease',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #60A5FA 0%, #93C5FD 30%, #BFDBFE 60%, #E0F2FE 100%)',
      }} />
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '20%',
        width: '50px',
        height: '50px',
        background: 'radial-gradient(circle, rgba(253,224,71,0.9) 0%, rgba(253,224,71,0.3) 40%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '25%',
        background: 'linear-gradient(180deg, #D6D3D1 0%, #A8A29E 100%)',
      }} />
    </div>
  );

  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', maxWidth: '600px' }}>
        <h2 style={{
          fontSize: '34px',
          fontWeight: '700',
          color: '#18181B',
          margin: '0 0 10px 0',
        }}>
          Interactive Pivot Preview
        </h2>
        <p style={{
          fontSize: '15px',
          color: '#71717A',
          margin: 0,
          lineHeight: 1.7,
        }}>
          See how pivot doors rotate on different axes
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {/* Pivot Type */}
        <div style={{
          display: 'flex',
          background: '#F4F4F5',
          padding: '4px',
          borderRadius: '10px',
        }}>
          {[
            { id: 'offset' as const, label: 'Offset Pivot' },
            { id: 'center' as const, label: 'Center Pivot' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => { setPivotType(type.id); setOpenAmount(0); }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: pivotType === type.id ? '#FFFFFF' : 'transparent',
                color: pivotType === type.id ? '#18181B' : '#71717A',
                fontWeight: '500',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: pivotType === type.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Material */}
        <div style={{
          display: 'flex',
          background: '#F4F4F5',
          padding: '4px',
          borderRadius: '10px',
        }}>
          {[
            { id: 'wood' as const, label: 'Premium Wood' },
            { id: 'metal' as const, label: 'Metal' },
          ].map(mat => (
            <button
              key={mat.id}
              onClick={() => setMaterial(mat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: material === mat.id ? '#FFFFFF' : 'transparent',
                color: material === mat.id ? '#18181B' : '#71717A',
                fontWeight: '500',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: material === mat.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {mat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Door Display */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}>
        {/* Frame Container */}
        <div style={{
          position: 'relative',
          height: '420px',
        }}>
          {/* Outer Frame */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: frameColor,
            borderRadius: '4px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            {/* Top frame detail */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '14px',
              background: `linear-gradient(180deg, ${material === 'wood' ? '#7C5E3C' : '#52525B'} 0%, ${frameColor} 100%)`,
              borderRadius: '4px 4px 0 0',
            }} />
            {/* Bottom frame detail */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '18px',
              background: `linear-gradient(0deg, ${material === 'wood' ? '#4A3728' : '#18181B'} 0%, ${frameColor} 100%)`,
              borderRadius: '0 0 4px 4px',
            }} />
          </div>

          {/* Inner Opening */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            right: '14px',
            bottom: '18px',
            background: '#FFFFFF',
            overflow: 'hidden',
          }}>
            {/* Outdoor scene */}
            <OutdoorScene opacity={openAmount > 10 ? Math.min((openAmount - 10) / 50, 1) : 0} />

            {/* Interior floor hint when closed */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '15%',
              background: 'linear-gradient(180deg, #E4E4E7 0%, #D4D4D8 100%)',
              opacity: openAmount < 50 ? 1 - openAmount / 50 : 0,
              transition: 'opacity 0.3s',
            }} />
          </div>

          {/* The Pivot Door */}
          <div style={{
            position: 'absolute',
            top: '18px',
            left: '18px',
            right: '18px',
            bottom: '22px',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotationAngle}deg)`,
            transformOrigin: pivotOrigin,
            transition: 'transform 0.05s linear',
          }}>
            {/* Door Front Face */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: doorBackground,
              backfaceVisibility: 'hidden',
              boxShadow: openAmount > 5
                ? `${8 + openAmount * 0.2}px 0 ${20 + openAmount * 0.4}px rgba(0,0,0,${0.1 + openAmount * 0.002})`
                : '2px 0 8px rgba(0,0,0,0.1)',
            }}>
              {/* Wood grain overlay */}
              {material === 'wood' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `
                    repeating-linear-gradient(
                      90deg,
                      transparent 0px,
                      transparent 30px,
                      rgba(139,90,43,0.08) 30px,
                      rgba(139,90,43,0.08) 31px
                    )
                  `,
                }} />
              )}

              {/* Door panels */}
              <div style={{
                position: 'absolute',
                top: '4%',
                left: '8%',
                right: '8%',
                bottom: '4%',
                border: `3px solid ${material === 'wood' ? 'rgba(92,64,51,0.4)' : 'rgba(113,113,122,0.4)'}`,
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: `${3 + i * 32}%`,
                    left: '5%',
                    right: '5%',
                    height: '28%',
                    background: material === 'wood'
                      ? 'linear-gradient(180deg, rgba(139,105,20,0.25) 0%, rgba(107,78,49,0.15) 100%)'
                      : 'linear-gradient(180deg, rgba(82,82,91,0.4) 0%, rgba(39,39,42,0.2) 100%)',
                    border: `2px solid ${material === 'wood' ? 'rgba(92,64,51,0.25)' : 'rgba(82,82,91,0.3)'}`,
                  }} />
                ))}
              </div>

              {/* Handle */}
              <div style={{
                position: 'absolute',
                top: '44%',
                right: '8%',
                width: '4%',
                height: '12%',
                background: material === 'wood'
                  ? 'linear-gradient(90deg, #A8A29E 0%, #D6D3D1 50%, #A8A29E 100%)'
                  : 'linear-gradient(90deg, #71717A 0%, #A1A1AA 50%, #71717A 100%)',
                borderRadius: '2px',
                boxShadow: '1px 2px 4px rgba(0,0,0,0.2)',
              }} />

              {/* Lock indicator */}
              <div style={{
                position: 'absolute',
                top: '53%',
                right: '9%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: openAmount < 5 ? '#22C55E' : '#F59E0B',
                boxShadow: `0 0 6px ${openAmount < 5 ? 'rgba(34,197,94,0.5)' : 'rgba(245,158,11,0.5)'}`,
              }} />

              {/* Pivot point indicator */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: pivotType === 'center' ? '50%' : '12%',
                transform: 'translate(-50%, -50%)',
                width: '10px',
                height: '10px',
                background: '#3B82F6',
                borderRadius: '50%',
                boxShadow: '0 0 0 3px rgba(59,130,246,0.3)',
                zIndex: 10,
              }} />
            </div>

            {/* Door Back Face */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: material === 'wood'
                ? 'linear-gradient(180deg, #8B7355 0%, #6B5344 100%)'
                : 'linear-gradient(180deg, #3F3F46 0%, #27272A 100%)',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }} />

            {/* Door Edge */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: '-6px',
              width: '6px',
              height: '100%',
              background: material === 'wood'
                ? 'linear-gradient(90deg, #6B4E31 0%, #5C4033 100%)'
                : 'linear-gradient(90deg, #27272A 0%, #18181B 100%)',
              transform: 'rotateY(90deg)',
              transformOrigin: 'left center',
            }} />
          </div>

          {/* Floor pivot hardware */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: pivotType === 'center' ? 'calc(50%)' : 'calc(12% + 14px)',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '10px',
            background: 'linear-gradient(180deg, #71717A 0%, #52525B 100%)',
            borderRadius: '2px',
            zIndex: 20,
          }} />

          {/* Top pivot hardware */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: pivotType === 'center' ? 'calc(50%)' : 'calc(12% + 14px)',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '10px',
            background: 'linear-gradient(0deg, #71717A 0%, #52525B 100%)',
            borderRadius: '2px',
            zIndex: 20,
          }} />
        </div>

        {/* Size label */}
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '12px',
          color: '#A1A1AA',
        }}>
          Custom sizes up to 5' wide × 12' tall
        </div>
      </div>

      {/* Animated Button */}
      <div style={{
        marginTop: '32px',
        width: '100%',
        maxWidth: '320px',
        padding: '24px',
        background: '#FAFAFA',
        borderRadius: '16px',
        border: '1px solid #E4E4E7',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#3F3F46' }}>
            Pivot Angle
          </span>
          <span style={{
            fontSize: '32px',
            fontWeight: '700',
            color: openAmount < 5 ? '#22C55E' : '#3B82F6',
            fontVariantNumeric: 'tabular-nums',
            minWidth: '80px',
            textAlign: 'right',
          }}>
            {Math.round((openAmount / 100) * 90)}°
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ position: 'relative', height: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#E4E4E7',
            borderRadius: '6px',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${openAmount}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: '6px',
            transition: 'width 0.05s linear',
          }} />
        </div>

        {/* Button */}
        <button
          onClick={animateDoor}
          disabled={isAnimating}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: isAnimating
              ? '#D1D5DB'
              : openAmount < 50
                ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: isAnimating ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {isAnimating ? 'Animating...' : openAmount < 50 ? 'Open Door' : 'Close Door'}
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
          fontSize: '11px',
          color: '#A1A1AA',
          fontWeight: '500',
          textTransform: 'uppercase',
        }}>
          <span>Closed</span>
          <span>Open 90°</span>
        </div>
      </div>

      {/* Pivot Info */}
      <div style={{
        marginTop: '24px',
        padding: '20px',
        background: '#F9FAFB',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151',
        }}>
          {pivotType === 'center' ? 'Center Pivot' : 'Offset Pivot'}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: '#6B7280',
          lineHeight: 1.6,
        }}>
          {pivotType === 'center'
            ? 'Rotates around center axis — dramatic effect, requires clearance on both sides'
            : 'Pivot near edge — maximizes opening width with modern mechanics'
          }
        </p>
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #E5E7EB',
          fontSize: '12px',
          color: '#9CA3AF',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22C55E',
            }} />
            Locked (Closed)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#F59E0B',
            }} />
            Unlocked (Open)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#3B82F6',
            }} />
            Pivot Point
          </div>
        </div>
      </div>
    </div>
  );
};

export default PivotDoorAnimation;
