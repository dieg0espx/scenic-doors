"use client";

import React, { useState } from 'react';

const BifoldDoorAnimation = () => {
  const [selectedConfig, setSelectedConfig] = useState(4);
  const [openAmount, setOpenAmount] = useState(0);
  const [foldDirection, setFoldDirection] = useState<'left' | 'right' | 'center'>('left');
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

  const configurations = [2, 3, 4, 5, 6];

  // Calculate panel transformations based on open amount
  const getPanelStyle = (index: number, totalPanels: number) => {
    const panelWidth = 100 / totalPanels;
    const progress = openAmount / 100;

    const isLeftFold = foldDirection === 'left';
    const isRightFold = foldDirection === 'right';
    const isCenterFold = foldDirection === 'center';

    let translateX = 0;
    let rotateY = 0;
    let zIndex = totalPanels - index;
    let originX = '100%';

    const stackGap = 0.3; // Gap between folded panels in % (very tight stacking at edges)

    if (isCenterFold) {
      const midPoint = Math.floor(totalPanels / 2);
      const isLeftSide = index < midPoint;

      if (isLeftSide) {
        // Left side panels fold left and stack at left edge
        const foldAngle = index % 2 === 0 ? -88 : 88;
        rotateY = foldAngle * progress;
        originX = index % 2 === 0 ? '0%' : '100%';

        // Current position: index * panelWidth
        // Target position at left edge: index * stackGap
        const currentPos = index * panelWidth;
        const targetPos = index * stackGap;
        translateX = ((targetPos - currentPos) / panelWidth) * 100 * progress;
        zIndex = index;
      } else {
        // Right side panels fold right and stack at right edge
        const rightIndex = index - midPoint;
        const rightTotal = totalPanels - midPoint;
        const foldAngle = rightIndex % 2 === 0 ? 88 : -88;
        rotateY = foldAngle * progress;
        originX = rightIndex % 2 === 0 ? '100%' : '0%';

        // Current position: index * panelWidth
        // Target position at right edge: 100 - (rightTotal - rightIndex) * stackGap
        const currentPos = index * panelWidth;
        const targetPos = 100 - (rightTotal - rightIndex) * stackGap;
        translateX = ((targetPos - currentPos) / panelWidth) * 100 * progress;
        zIndex = totalPanels - index;
      }
    } else if (isLeftFold) {
      // All panels fold to the left and stack at left edge
      const foldAngle = index % 2 === 0 ? -88 : 88;
      rotateY = foldAngle * progress;
      originX = index % 2 === 0 ? '0%' : '100%';

      // Current position: index * panelWidth
      // Target position at left edge: index * stackGap
      const currentPos = index * panelWidth;
      const targetPos = index * stackGap;
      translateX = ((targetPos - currentPos) / panelWidth) * 100 * progress;
      zIndex = index;
    } else if (isRightFold) {
      // All panels fold to the right and stack at right edge
      const foldAngle = index % 2 === 0 ? 88 : -88;
      rotateY = foldAngle * progress;
      originX = index % 2 === 0 ? '100%' : '0%';

      // Current position: index * panelWidth
      // Target position at right edge: 100 - (totalPanels - index) * stackGap
      const currentPos = index * panelWidth;
      const targetPos = 100 - (totalPanels - index) * stackGap;
      translateX = ((targetPos - currentPos) / panelWidth) * 100 * progress;
      zIndex = totalPanels - index;
    }

    return {
      width: `${panelWidth}%`,
      transform: `translateX(${translateX}%) rotateY(${rotateY}deg)`,
      transformOrigin: `${originX} center`,
      zIndex,
      transformStyle: 'preserve-3d' as const,
    };
  };

  const Panel = ({ index, totalPanels }: { index: number; totalPanels: number }) => {
    const style = getPanelStyle(index, totalPanels);
    const isLocked = openAmount < 5;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${(index * 100) / totalPanels}%`,
          top: 0,
          height: '100%',
          transition: 'transform 0.1s ease-out',
          ...style,
        }}
      >
        {/* Panel Frame */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(135,206,235,0.15) 0%, rgba(176,224,230,0.1) 50%, rgba(135,206,235,0.2) 100%)',
            border: '3px solid #78716C',
            borderRadius: '1px',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1), inset 0 0 30px rgba(255,255,255,0.1)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Slim aluminum frame - Top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(180deg, #A8A29E 0%, #78716C 100%)',
          }} />
          {/* Bottom frame */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '10px',
            background: 'linear-gradient(0deg, #A8A29E 0%, #78716C 100%)',
          }} />
          {/* Left frame */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '5px',
            background: 'linear-gradient(90deg, #A8A29E 0%, #78716C 100%)',
          }} />
          {/* Right frame */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '5px',
            background: 'linear-gradient(-90deg, #A8A29E 0%, #78716C 100%)',
          }} />

          {/* Thermal break indicator line */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '5px',
            right: '5px',
            height: '2px',
            background: '#1F2937',
            opacity: 0.3,
          }} />

          {/* Glass reflection */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '10px',
            width: '40%',
            height: '30%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
            borderRadius: '2px',
          }} />

          {/* Secondary reflection */}
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '25%',
            height: '15%',
            background: 'linear-gradient(315deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
            borderRadius: '2px',
          }} />

          {/* Hinge indicators */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '-2px',
            width: '6px',
            height: '20px',
            background: 'linear-gradient(90deg, #57534E 0%, #78716C 100%)',
            borderRadius: '2px',
          }} />
          <div style={{
            position: 'absolute',
            top: '45%',
            left: '-2px',
            width: '6px',
            height: '20px',
            background: 'linear-gradient(90deg, #57534E 0%, #78716C 100%)',
            borderRadius: '2px',
          }} />
          <div style={{
            position: 'absolute',
            top: '75%',
            left: '-2px',
            width: '6px',
            height: '20px',
            background: 'linear-gradient(90deg, #57534E 0%, #78716C 100%)',
            borderRadius: '2px',
          }} />

          {/* Handle on specific panels */}
          {(index === 0 || index === totalPanels - 1) && (
            <div style={{
              position: 'absolute',
              top: '48%',
              right: index === 0 ? '8px' : 'auto',
              left: index === totalPanels - 1 ? '8px' : 'auto',
              width: '6px',
              height: '50px',
              background: 'linear-gradient(90deg, #57534E 0%, #44403C 100%)',
              borderRadius: '3px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }} />
          )}

          {/* Lock indicator */}
          {index === 0 && (
            <div style={{
              position: 'absolute',
              bottom: '15px',
              right: '8px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isLocked ? '#10B981' : '#EF4444',
              boxShadow: isLocked
                ? '0 0 8px rgba(16, 185, 129, 0.6)'
                : '0 0 8px rgba(239, 68, 68, 0.6)',
              transition: 'all 0.3s',
            }} />
          )}

          {/* Panel number */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '11px',
            color: '#78716C',
            fontWeight: '600',
          }}>
            {index + 1}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', maxWidth: '600px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1F2937',
          margin: '0 0 8px 0',
        }}>
          Bi-Fold Door Preview
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0,
        }}>
          Explore different panel configurations and folding directions
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* Panel Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#71717A', fontWeight: '500' }}>Panels</span>
          {configurations.map((count) => (
            <button
              key={count}
              onClick={() => {
                setSelectedConfig(count);
                setOpenAmount(0);
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: selectedConfig === count ? '2px solid #3B82F6' : '2px solid #E4E4E7',
                background: selectedConfig === count ? '#EFF6FF' : '#FFFFFF',
                color: selectedConfig === count ? '#2563EB' : '#71717A',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {count}
            </button>
          ))}
        </div>

        {/* Fold Direction */}
        <div style={{
          display: 'flex',
          background: '#F4F4F5',
          padding: '4px',
          borderRadius: '10px',
          marginLeft: '8px',
        }}>
          {[
            { id: 'left' as const, label: '← Left' },
            { id: 'center' as const, label: '↔ Center' },
            { id: 'right' as const, label: 'Right →' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setFoldDirection(option.id);
                setOpenAmount(0);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: foldDirection === option.id ? '#FFFFFF' : 'transparent',
                color: foldDirection === option.id ? '#18181B' : '#71717A',
                fontWeight: '500',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: foldDirection === option.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Door Animation Container */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
      }}>
        {/* Top Track */}
        <div style={{
          height: '14px',
          background: 'linear-gradient(180deg, #57534E 0%, #78716C 50%, #57534E 100%)',
          borderRadius: '2px',
          marginBottom: '2px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          position: 'relative',
        }}>
          {/* Track groove */}
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '8px',
            right: '8px',
            height: '4px',
            background: '#44403C',
            borderRadius: '2px',
          }} />
        </div>

        {/* Door Frame Container */}
        <div style={{
          position: 'relative',
          height: '400px',
          background: '#FFFFFF',
          overflow: 'visible',
          border: '4px solid #57534E',
          borderTop: 'none',
          borderBottom: 'none',
        }}>

          {/* Panels */}
          {Array.from({ length: selectedConfig }).map((_, index) => (
            <Panel
              key={index}
              index={index}
              totalPanels={selectedConfig}
            />
          ))}
        </div>

        {/* Bottom Track/Threshold */}
        <div style={{
          height: '18px',
          background: 'linear-gradient(0deg, #57534E 0%, #78716C 50%, #57534E 100%)',
          borderRadius: '2px',
          marginTop: '2px',
          boxShadow: '0 -2px 6px rgba(0,0,0,0.1)',
          position: 'relative',
        }}>
          {/* Threshold detail */}
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '8px',
            right: '8px',
            height: '6px',
            background: 'linear-gradient(180deg, #44403C 0%, #57534E 100%)',
            borderRadius: '2px',
          }} />
        </div>
      </div>

      {/* Animated Button */}
      <div style={{
        marginTop: '32px',
        width: '100%',
        maxWidth: '340px',
        padding: '24px',
        background: '#F9FAFB',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
          }}>
            Door Position
          </span>
          <span style={{
            fontSize: '28px',
            fontWeight: '700',
            color: openAmount < 5 ? '#22C55E' : '#3898EC',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(openAmount)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ position: 'relative', height: '8px', marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#E5E7EB',
            borderRadius: '4px',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${openAmount}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3898EC 0%, #1D4ED8 100%)',
            borderRadius: '4px',
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
                ? 'linear-gradient(135deg, #3898EC 0%, #1D4ED8 100%)'
                : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: isAnimating ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {isAnimating ? 'Animating...' : openAmount < 50 ? 'Open Doors' : 'Close Doors'}
        </button>

        {/* Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
          fontSize: '11px',
          color: '#9CA3AF',
          fontWeight: '500',
        }}>
          <span>CLOSED</span>
          <span>OPEN</span>
        </div>
      </div>
    </div>
  );
};

export default BifoldDoorAnimation;
