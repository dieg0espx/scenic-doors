"use client";

import React, { useState, useEffect } from 'react';

/**
 * Multi-Slide Door Animation
 *
 * How multi-slide doors work:
 * - Some panels are "Fixed" (they never move)
 * - Some panels are "Operating" (they slide on a track)
 * - Operating panels slide over/behind adjacent fixed panels
 *
 * Common layouts:
 * 2 panels: "Operating + Fixed" — left panel slides right behind the fixed right panel
 * 4 panels: "Operating + Fixed + Fixed + Operating" — outer panels slide inward behind inner fixed panels
 * 6 panels: same pattern with more fixed panels in the middle
 */

type PanelType = 'operating' | 'fixed';

interface LayoutConfig {
  panels: PanelType[];
  label: string;
}

// Parse a layout string like "Operating + Fixed + Fixed + Operating" into panel types
function parseLayout(layout: string): PanelType[] {
  return layout
    .replace(/\s*\(.*?\)\s*/g, '') // strip (L) / (R) suffixes
    .split('+')
    .map(s => s.trim().toLowerCase() === 'operating' ? 'operating' : 'fixed');
}

// Default layouts per panel count
const DEFAULT_LAYOUTS: Record<number, LayoutConfig[]> = {
  2: [
    { panels: ['operating', 'fixed'], label: 'Operating + Fixed' },
    { panels: ['fixed', 'operating'], label: 'Fixed + Operating' },
  ],
  3: [
    { panels: ['operating', 'operating', 'fixed'], label: 'Operating + Operating + Fixed' },
    { panels: ['fixed', 'operating', 'fixed'], label: 'Fixed + Operating + Fixed' },
  ],
  4: [
    { panels: ['operating', 'fixed', 'fixed', 'operating'], label: 'Oper + Fixed + Fixed + Oper' },
  ],
  5: [
    { panels: ['operating', 'fixed', 'fixed', 'fixed', 'operating'], label: 'Oper + 3 Fixed + Oper' },
  ],
  6: [
    { panels: ['operating', 'fixed', 'fixed', 'fixed', 'fixed', 'operating'], label: 'Oper + 4 Fixed + Oper' },
  ],
};

const SlidingDoorAnimation = ({
  panelCountOverride,
  panelLayoutOverride,
  compact,
}: {
  panelCountOverride?: number;
  panelLayoutOverride?: string;
  compact?: boolean;
} = {}) => {
  const [panelCount, setPanelCount] = useState(panelCountOverride ?? 2);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState(0);
  const [openAmount, setOpenAmount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine panel layout
  const layoutsForCount = DEFAULT_LAYOUTS[panelCount] ?? DEFAULT_LAYOUTS[2]!;
  let panelTypes: PanelType[];

  if (panelLayoutOverride) {
    panelTypes = parseLayout(panelLayoutOverride);
  } else {
    panelTypes = layoutsForCount[selectedLayoutIndex % layoutsForCount.length].panels;
  }

  useEffect(() => {
    if (panelCountOverride !== undefined) {
      setPanelCount(panelCountOverride);
      setOpenAmount(0);
      setSelectedLayoutIndex(0);
    }
  }, [panelCountOverride]);

  useEffect(() => {
    if (panelLayoutOverride) {
      setOpenAmount(0);
    }
  }, [panelLayoutOverride]);

  const animateDoor = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const targetValue = openAmount > 50 ? 0 : 100;
    const duration = 2000;
    const startTime = Date.now();
    const startValue = openAmount;
    const difference = targetValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setOpenAmount(startValue + (difference * easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  /**
   * Calculate how an operating panel moves.
   * Operating panels slide toward the nearest fixed panel and tuck behind it.
   */
  const getPanelTransform = (index: number) => {
    const isFixed = panelTypes[index] === 'fixed';
    if (isFixed) {
      return { translateX: 0, zIndex: 20 }; // Fixed panels stay put, always on top
    }

    const progress = openAmount / 100;
    const total = panelTypes.length;

    // Find nearest fixed panel to determine slide direction
    let nearestFixedLeft = -1;
    let nearestFixedRight = total;

    for (let i = index - 1; i >= 0; i--) {
      if (panelTypes[i] === 'fixed') { nearestFixedLeft = i; break; }
    }
    for (let i = index + 1; i < total; i++) {
      if (panelTypes[i] === 'fixed') { nearestFixedRight = i; break; }
    }

    const distLeft = index - nearestFixedLeft;
    const distRight = nearestFixedRight - index;

    // Slide toward the closest fixed panel
    let slideDirection: 'left' | 'right';
    if (nearestFixedLeft === -1) {
      slideDirection = 'right';
    } else if (nearestFixedRight === total) {
      slideDirection = 'left';
    } else {
      slideDirection = distLeft <= distRight ? 'left' : 'right';
    }

    // The panel slides one full panel width in its direction to overlap the fixed panel
    const translateX = slideDirection === 'right'
      ? (distRight) * 100 * progress
      : -(distLeft) * 100 * progress;

    // Operating panels go behind fixed panels
    const zIndex = 10;

    return { translateX, zIndex };
  };

  const Panel = ({ index }: { index: number }) => {
    const { translateX, zIndex } = getPanelTransform(index);
    const panelWidth = 100 / panelTypes.length;
    const isFixed = panelTypes[index] === 'fixed';

    return (
      <div
        style={{
          position: 'absolute',
          left: `${index * panelWidth}%`,
          top: 0,
          width: `${panelWidth}%`,
          height: '100%',
          transform: `translateX(${translateX}%)`,
          transition: 'transform 0.12s ease-out',
          display: 'flex',
          flexDirection: 'column',
          zIndex,
          padding: '0 1px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            flex: 1,
            margin: '2px',
            border: `4px solid ${isFixed ? '#4B5563' : '#6B7280'}`,
            borderRadius: '2px',
            background: isFixed
              ? 'linear-gradient(180deg, rgba(200,220,240,0.4) 0%, rgba(180,200,220,0.3) 100%)'
              : 'linear-gradient(180deg, rgba(200,220,240,0.3) 0%, rgba(180,200,220,0.2) 100%)',
            position: 'relative',
            boxShadow: !isFixed && openAmount > 5
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {/* Top frame */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '8px',
            background: 'linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)',
          }} />
          {/* Bottom frame */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '8px',
            background: 'linear-gradient(0deg, #9CA3AF 0%, #6B7280 100%)',
          }} />
          {/* Left frame */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: '8px',
            background: 'linear-gradient(90deg, #9CA3AF 0%, #6B7280 100%)',
          }} />
          {/* Right frame */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '8px',
            background: 'linear-gradient(-90deg, #9CA3AF 0%, #6B7280 100%)',
          }} />

          {/* Glass reflection */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px', right: '60%', bottom: '60%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            borderRadius: '2px',
          }} />

          {/* Handle */}
          {!isFixed && (
            <div style={{
              position: 'absolute', top: '45%', right: '12px',
              width: '8px', height: '40px',
              background: 'linear-gradient(90deg, #4B5563 0%, #374151 100%)',
              borderRadius: '4px',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
            }} />
          )}

          {/* Panel label */}
          <div style={{
            position: 'absolute', bottom: '8px', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px', color: isFixed ? '#4B5563' : '#6B7280',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.85)',
            padding: '3px 6px', borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}>
            {isFixed ? 'Fixed' : 'Oper.'}
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
      padding: compact ? '16px 12px' : '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      {!compact && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', margin: '0 0 8px 0' }}>
            Multi-Slide Door Preview
          </h2>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            Operating panels slide over the fixed panels to open
          </p>
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: compact ? '16px' : '24px',
        flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
      }}>
        {/* Panel Count */}
        {!panelCountOverride && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#71717A', fontWeight: '500' }}>Panels</span>
            {[2, 3, 4, 6].map(count => (
              <button
                key={count}
                onClick={() => { setPanelCount(count); setOpenAmount(0); setSelectedLayoutIndex(0); }}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  border: panelCount === count ? '2px solid #3B82F6' : '2px solid #E4E4E7',
                  background: panelCount === count ? '#EFF6FF' : '#FFFFFF',
                  color: panelCount === count ? '#2563EB' : '#71717A',
                  fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {count}
              </button>
            ))}
          </div>
        )}

        {/* Layout switcher (when multiple layouts available and no override) */}
        {!panelLayoutOverride && layoutsForCount.length > 1 && (
          <div style={{
            display: 'flex', background: '#F4F4F5', padding: '4px',
            borderRadius: '10px', marginLeft: panelCountOverride ? '0px' : '8px',
          }}>
            {layoutsForCount.map((layout, i) => (
              <button
                key={i}
                onClick={() => { setSelectedLayoutIndex(i); setOpenAmount(0); }}
                style={{
                  padding: '8px 12px', borderRadius: '6px', border: 'none',
                  background: selectedLayoutIndex === i ? '#FFFFFF' : 'transparent',
                  color: selectedLayoutIndex === i ? '#18181B' : '#71717A',
                  fontWeight: '500', fontSize: '11px', cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: selectedLayoutIndex === i ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {layout.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Door Animation Container */}
      <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
        {/* Track - Top */}
        <div style={{
          height: '12px',
          background: 'linear-gradient(180deg, #374151 0%, #4B5563 50%, #374151 100%)',
          borderRadius: '2px', marginBottom: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: '4px', left: '10px', right: '10px', height: '2px', background: '#1F2937', borderRadius: '1px' }} />
          <div style={{ position: 'absolute', top: '7px', left: '10px', right: '10px', height: '2px', background: '#1F2937', borderRadius: '1px' }} />
        </div>

        {/* Door Frame */}
        <div style={{
          position: 'relative', height: compact ? '250px' : '350px',
          background: '#FFFFFF', overflow: 'hidden',
          border: '3px solid #4B5563', borderTop: 'none', borderBottom: 'none',
        }}>
          {panelTypes.map((_, i) => (
            <Panel key={i} index={i} />
          ))}
        </div>

        {/* Track - Bottom */}
        <div style={{
          height: '16px',
          background: 'linear-gradient(0deg, #374151 0%, #4B5563 50%, #374151 100%)',
          borderRadius: '2px', marginTop: '4px',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.2)', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: '5px', left: '10px', right: '10px', height: '3px', background: '#1F2937', borderRadius: '1px' }} />
          <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', height: '3px', background: '#1F2937', borderRadius: '1px' }} />
        </div>

        {/* Roller indicators */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px', padding: '0 20px' }}>
          {Array.from({ length: Math.min(panelTypes.length * 2, 8) }).map((_, i) => (
            <div key={i} style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          ))}
        </div>
      </div>

      {/* Animated Button */}
      <div style={{
        marginTop: compact ? '16px' : '32px', width: '100%', maxWidth: '340px',
        padding: compact ? '16px' : '24px',
        background: '#F9FAFB', borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Door Position</span>
          <span style={{
            fontSize: '28px', fontWeight: '700',
            color: openAmount < 5 ? '#22C55E' : '#3898EC',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(openAmount)}%
          </span>
        </div>

        <div style={{ position: 'relative', height: '8px', marginBottom: '20px' }}>
          <div style={{ width: '100%', height: '100%', background: '#E5E7EB', borderRadius: '4px' }} />
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: `${openAmount}%`, height: '100%',
            background: 'linear-gradient(90deg, #3898EC 0%, #1D4ED8 100%)',
            borderRadius: '4px', transition: 'width 0.05s linear',
          }} />
        </div>

        <button
          onClick={animateDoor}
          disabled={isAnimating}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
            background: isAnimating ? '#D1D5DB'
              : openAmount < 50
                ? 'linear-gradient(135deg, #3898EC 0%, #1D4ED8 100%)'
                : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            color: '#FFFFFF', fontSize: '16px', fontWeight: '600',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: isAnimating ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {isAnimating ? 'Animating...' : openAmount < 50 ? 'Open Doors' : 'Close Doors'}
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>
          <span>CLOSED</span>
          <span>OPEN</span>
        </div>
      </div>
    </div>
  );
};

export default SlidingDoorAnimation;
