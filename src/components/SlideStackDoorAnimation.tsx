"use client";

import React, { useState } from 'react';

const SlideStackDoorAnimation = () => {
  const [panelCount, setPanelCount] = useState(4);
  const [openAmount, setOpenAmount] = useState(0);
  const [stackSide, setStackSide] = useState<'left' | 'right' | 'split'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const animateDoor = (currentValue: number, setValue: (val: number) => void) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const targetValue = currentValue > 50 ? 0 : 100;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = currentValue;
    const difference = targetValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease in-out function for smooth animation
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newValue = startValue + (difference * easeProgress);
      setValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const getPanelTransform = (index: number, total: number, amount: number, direction: string) => {
    const progress = amount / 100;
    const panelWidth = 100 / total;

    if (direction === 'right') {
      // Panels slide right and stack completely at the right edge
      // translateX is relative to element width, so we need to convert container % to element %
      const containerDistanceToMove = (total - 1 - index) * panelWidth; // in container %
      const elementDistanceToMove = (containerDistanceToMove / panelWidth) * 100; // convert to element %
      const stackOffset = index * 3; // Small offset in element % so panels are slightly visible when stacked
      return {
        translateX: elementDistanceToMove * progress + stackOffset * progress,
        zIndex: index,
      };
    } else if (direction === 'left') {
      // Panels slide left and stack completely at the left edge
      const containerDistanceToMove = index * panelWidth;
      const elementDistanceToMove = (containerDistanceToMove / panelWidth) * 100;
      const stackOffset = (total - 1 - index) * 3;
      return {
        translateX: -elementDistanceToMove * progress - stackOffset * progress,
        zIndex: total - index,
      };
    } else {
      // Split - left half goes left, right half goes right
      const mid = Math.floor(total / 2);
      if (index < mid) {
        // Left half panels go left
        const containerDistanceToMove = index * panelWidth;
        const elementDistanceToMove = (containerDistanceToMove / panelWidth) * 100;
        const stackOffset = (mid - 1 - index) * 3;
        return {
          translateX: -elementDistanceToMove * progress - stackOffset * progress,
          zIndex: mid - index,
        };
      } else {
        // Right half panels go right
        const rightIndex = index - mid;
        const rightTotal = total - mid;
        const rightPanelWidth = 100 / total; // Same as panelWidth
        const containerDistanceToMove = (rightTotal - 1 - rightIndex) * rightPanelWidth;
        const elementDistanceToMove = (containerDistanceToMove / rightPanelWidth) * 100;
        const stackOffset = rightIndex * 3;
        return {
          translateX: elementDistanceToMove * progress + stackOffset * progress,
          zIndex: rightIndex,
        };
      }
    }
  };

  const GlassPanel = ({ index, total, translateX, zIndex, isLast, isFirst }: {
    index: number;
    total: number;
    translateX: number;
    zIndex: number;
    isLast: boolean;
    isFirst: boolean;
  }) => {
    const panelWidth = 100 / total;
    const isLocked = openAmount < 3;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${index * panelWidth}%`,
          top: 0,
          width: `${panelWidth}%`,
          height: '100%',
          transform: `translateX(${translateX}%)`,
          zIndex,
          transition: 'transform 0.12s ease-out',
          padding: '0 1px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(165deg, rgba(220,235,250,0.25) 0%, rgba(200,220,240,0.15) 30%, rgba(180,210,235,0.2) 100%)',
          border: '3px solid #71717A',
          position: 'relative',
          boxShadow: `
            inset 0 0 60px rgba(255,255,255,0.1),
            4px 0 20px rgba(0,0,0,0.08)
          `,
        }}>
          {/* Top frame */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(180deg, #A1A1AA 0%, #71717A 100%)',
          }} />

          {/* Bottom frame with thermal break */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '10px',
            background: 'linear-gradient(0deg, #A1A1AA 0%, #71717A 100%)',
          }}>
            {/* Thermal break indicator */}
            <div style={{
              position: 'absolute',
              top: '3px',
              left: '8px',
              right: '8px',
              height: '3px',
              background: '#52525B',
              borderRadius: '1px',
            }} />
          </div>

          {/* Left frame */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '5px',
            background: 'linear-gradient(90deg, #A1A1AA 0%, #71717A 100%)',
          }} />

          {/* Right frame */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '5px',
            background: 'linear-gradient(-90deg, #A1A1AA 0%, #71717A 100%)',
          }} />

          {/* Glass shine */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '10px',
            width: '45%',
            height: '35%',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            borderRadius: '2px',
          }} />

          {/* Secondary reflection */}
          <div style={{
            position: 'absolute',
            bottom: '25%',
            right: '10%',
            width: '30%',
            height: '20%',
            background: 'linear-gradient(-45deg, rgba(255,255,255,0.15) 0%, transparent 70%)',
          }} />

          {/* Handle - on lead panels */}
          {((stackSide === 'right' && isLast) || (stackSide === 'left' && isFirst) ||
            (stackSide === 'split' && (index === Math.floor(total / 2) - 1 || index === Math.floor(total / 2)))) && (
            <div style={{
              position: 'absolute',
              top: '46%',
              left: stackSide === 'right' || (stackSide === 'split' && index === Math.floor(total / 2)) ? '10px' : 'auto',
              right: stackSide === 'left' || (stackSide === 'split' && index === Math.floor(total / 2) - 1) ? '10px' : 'auto',
              width: '6px',
              height: '48px',
              background: 'linear-gradient(90deg, #52525B 0%, #3F3F46 100%)',
              borderRadius: '3px',
              boxShadow: '1px 2px 4px rgba(0,0,0,0.2)',
            }} />
          )}

          {/* Lock indicator */}
          {isFirst && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '12px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isLocked ? '#22C55E' : '#F59E0B',
              boxShadow: `0 0 8px ${isLocked ? 'rgba(34,197,94,0.5)' : 'rgba(245,158,11,0.5)'}`,
              transition: 'all 0.3s',
            }} />
          )}
        </div>
      </div>
    );
  };

  const Track = ({ position = 'top', grooveCount = 3 }: { position?: 'top' | 'bottom'; grooveCount?: number }) => (
    <div style={{
      height: position === 'top' ? '14px' : '18px',
      background: `linear-gradient(${position === 'top' ? '180deg' : '0deg'}, #52525B 0%, #71717A 50%, #52525B 100%)`,
      borderRadius: '2px',
      marginBottom: position === 'top' ? '2px' : 0,
      marginTop: position === 'bottom' ? '2px' : 0,
      boxShadow: position === 'top' ? '0 3px 10px rgba(0,0,0,0.15)' : '0 -3px 10px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Track grooves */}
      {[...Array(grooveCount)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: position === 'top' ? `${5 + i * 3}px` : `${6 + i * 4}px`,
          left: '8px',
          right: '8px',
          height: '2px',
          background: '#3F3F46',
          borderRadius: '1px',
        }} />
      ))}
      {/* Track shine */}
      <div style={{
        position: 'absolute',
        top: position === 'top' ? '1px' : 'auto',
        bottom: position === 'bottom' ? '1px' : 'auto',
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'rgba(255,255,255,0.2)',
      }} />
    </div>
  );

  const OutdoorScene = ({ opacity }: { opacity: number }) => (
    <div style={{
      position: 'absolute',
      inset: 0,
      opacity,
      transition: 'opacity 0.5s ease',
      background: '#FFFFFF',
    }} />
  );

  const AnimatedButton = ({ value, setValue, label }: { value: number; setValue: (val: number) => void; label: string }) => {
    const isClosed = value < 50;

    return (
      <div style={{
        flex: 1,
        minWidth: '280px',
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
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            {label}
          </span>
          <span style={{
            fontSize: '28px',
            fontWeight: '700',
            color: value < 5 ? '#22C55E' : '#3898EC',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(value)}%
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
            width: `${value}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3898EC 0%, #1D4ED8 100%)',
            borderRadius: '4px',
            transition: 'width 0.05s linear',
          }} />
        </div>

        {/* Button */}
        <button
          onClick={() => animateDoor(value, setValue)}
          disabled={isAnimating}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: isAnimating
              ? '#D1D5DB'
              : isClosed
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
          {isAnimating ? 'Animating...' : isClosed ? 'Open Doors' : 'Close Doors'}
        </button>

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
    );
  };

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
          fontSize: '28px',
          fontWeight: '700',
          color: '#1F2937',
          margin: '0 0 8px 0',
        }}>
          Slide & Stack Door Preview
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0,
        }}>
          Explore different configurations and see how panels stack
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
          {[2, 3, 4, 5, 6].map(count => (
            <button
              key={count}
              onClick={() => { setPanelCount(count); setOpenAmount(0); }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: panelCount === count ? '2px solid #3B82F6' : '2px solid #E4E4E7',
                background: panelCount === count ? '#EFF6FF' : '#FFFFFF',
                color: panelCount === count ? '#2563EB' : '#71717A',
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

        {/* Stack Direction */}
        <div style={{
          display: 'flex',
          background: '#F4F4F5',
          padding: '4px',
          borderRadius: '10px',
          marginLeft: '8px',
        }}>
          {[
            { id: 'left' as const, label: '← Left' },
            { id: 'split' as const, label: '↔ Split' },
            { id: 'right' as const, label: 'Right →' },
          ].map(dir => (
            <button
              key={dir.id}
              onClick={() => { setStackSide(dir.id); setOpenAmount(0); }}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: stackSide === dir.id ? '#FFFFFF' : 'transparent',
                color: stackSide === dir.id ? '#18181B' : '#71717A',
                fontWeight: '500',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: stackSide === dir.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {dir.label}
            </button>
          ))}
        </div>
      </div>

      {/* Door Display */}
      <div style={{ width: '100%', maxWidth: '850px' }}>
        <Track position="top" grooveCount={Math.min(panelCount, 4)} />

        <div style={{
          position: 'relative',
          height: '380px',
          background: '#FFFFFF',
          overflow: 'hidden',
          borderLeft: '4px solid #52525B',
          borderRight: '4px solid #52525B',
        }}>
          <OutdoorScene opacity={openAmount > 15 ? Math.min((openAmount - 15) / 60, 1) : 0} />

          {[...Array(panelCount)].map((_, i) => {
            const { translateX, zIndex } = getPanelTransform(i, panelCount, openAmount, stackSide);
            return (
              <GlassPanel
                key={i}
                index={i}
                total={panelCount}
                translateX={translateX}
                zIndex={zIndex}
                isFirst={i === 0}
                isLast={i === panelCount - 1}
              />
            );
          })}
        </div>

        <Track position="bottom" grooveCount={Math.min(panelCount, 4)} />
      </div>

      {/* Animated Button */}
      <div style={{
        marginTop: '32px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '340px',
      }}>
        <AnimatedButton value={openAmount} setValue={setOpenAmount} label="Door Position" />
      </div>
    </div>
  );
};

export default SlideStackDoorAnimation;
