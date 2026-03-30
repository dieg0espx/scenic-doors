"use client";

import React, { useState, useEffect, useRef } from 'react';

/**
 * Parse a bi-fold panel layout string into a fold direction.
 * "All Left (4L)" → "left"
 * "All Right (3R)" → "right"
 * "Split 2L-2R" → "center"
 */
function layoutToDirection(layout: string): 'left' | 'right' | 'center' {
  if (layout.startsWith('Split')) return 'center';
  if (layout.includes('Right') || layout.endsWith('R)')) return 'right';
  return 'left';
}

export default function BifoldDoorAnimation({
  panelCountOverride,
  panelLayoutOverride,
  compact,
}: {
  panelCountOverride?: number;
  panelLayoutOverride?: string;
  compact?: boolean;
} = {}) {
  const [panelCount, setPanelCount] = useState(panelCountOverride ?? 4);
  const [foldDirection, setFoldDirection] = useState<'left' | 'right' | 'center'>(
    panelLayoutOverride ? layoutToDirection(panelLayoutOverride) : 'left'
  );
  const [openPercent, setOpenPercent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Measure container width for responsive calculations
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sync overrides
  useEffect(() => {
    if (panelCountOverride !== undefined) {
      setPanelCount(panelCountOverride);
      setOpenPercent(0);
    }
  }, [panelCountOverride]);

  useEffect(() => {
    if (panelLayoutOverride) {
      setFoldDirection(layoutToDirection(panelLayoutOverride));
      setOpenPercent(0);
    }
  }, [panelLayoutOverride]);

  // Animation logic
  const toggleDoors = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const targetOpen = openPercent > 50 ? 0 : 100;
    const startOpen = openPercent;
    const startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setOpenPercent(startOpen + (targetOpen - startOpen) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  // Calculate panel position and rotation — scales to actual container width
  const calculatePanelStyle = (panelIndex: number) => {
    const scale = containerWidth / 800;
    const PANEL_WIDTH = containerWidth / panelCount;
    const FOLDED_PANEL_WIDTH = 50 * scale;
    const GAP_BETWEEN_PANELS = -40 * scale;
    const progress = openPercent / 100;

    // Starting position when CLOSED (spread across container)
    const closedX = panelIndex * PANEL_WIDTH;

    // Ending position when OPEN (stacked at edge)
    let openX = 0;
    let rotationAngle = 0;
    let zIndex = 0;

    // Width transitions from full to folded
    const currentWidth = PANEL_WIDTH + (FOLDED_PANEL_WIDTH - PANEL_WIDTH) * progress;

    const LEFT_OFFSET = -50 * scale;

    if (foldDirection === 'left') {
      openX = LEFT_OFFSET + panelIndex * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
      rotationAngle = (panelIndex % 2 === 0 ? -75 : 75);
      zIndex = panelIndex;

    } else if (foldDirection === 'right') {
      openX = containerWidth - (panelCount - panelIndex) * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
      rotationAngle = (panelIndex % 2 === 0 ? 75 : -75);
      zIndex = panelCount - panelIndex;

    } else {
      const halfPoint = Math.floor(panelCount / 2);

      if (panelIndex < halfPoint) {
        openX = LEFT_OFFSET + panelIndex * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
        rotationAngle = (panelIndex % 2 === 0 ? -75 : 75);
        zIndex = panelIndex;
      } else {
        const rightIdx = panelIndex - halfPoint;
        const rightCount = panelCount - halfPoint;
        openX = containerWidth - (rightCount - rightIdx) * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
        rotationAngle = (rightIdx % 2 === 0 ? 75 : -75);
        zIndex = panelCount - panelIndex;
      }
    }

    const currentX = closedX + (openX - closedX) * progress;
    const currentRotation = rotationAngle * progress;

    return {
      transform: `translateX(${currentX}px) rotateY(${currentRotation}deg)`,
      transformOrigin: '50% 50%',
      width: currentWidth,
      zIndex,
    };
  };

  const hasOverrides = panelCountOverride !== undefined || panelLayoutOverride !== undefined;

  return (
    <div style={{
      width: '100%',
      padding: compact ? '16px 12px' : 'clamp(20px, 4vw, 40px) clamp(12px, 3vw, 20px)',
      background: '#fff',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Title */}
      {!compact && (
        <div style={{ textAlign: 'center', marginBottom: 'clamp(20px, 4vw, 30px)', padding: '0 16px' }}>
          <h2 style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: '700', color: '#1F2937', margin: '0 0 10px 0' }}>
            Bi-Fold Door Preview
          </h2>
          <p style={{ fontSize: 'clamp(12px, 3vw, 16px)', color: '#6B7280', margin: 0 }}>
            Interactive door animation - choose panels and fold direction
          </p>
        </div>
      )}

      {/* Controls — hidden in wizard (compact) or when overrides are set */}
      {!compact && !hasOverrides && (
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: compact ? '16px' : '40px',
          flexWrap: 'wrap',
        }}>
          {/* Panel count selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 10px)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', fontWeight: '600', color: '#374151' }}>Panels:</span>
            {[2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => { setPanelCount(num); setOpenPercent(0); }}
                style={{
                  width: 'clamp(34px, 8vw, 40px)',
                  height: 'clamp(34px, 8vw, 40px)',
                  borderRadius: '8px',
                  border: panelCount === num ? '2px solid #3B82F6' : '2px solid #E5E7EB',
                  background: panelCount === num ? '#EFF6FF' : '#fff',
                  color: panelCount === num ? '#2563EB' : '#6B7280',
                  fontSize: 'clamp(13px, 3vw, 16px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Fold direction selector */}
          <div style={{ display: 'flex', gap: '8px', background: '#F3F4F6', padding: '4px', borderRadius: '8px' }}>
            {[
              { id: 'left' as const, label: '← Left' },
              { id: 'center' as const, label: '↔ Center' },
              { id: 'right' as const, label: 'Right →' },
            ].map(option => (
              <button
                key={option.id}
                onClick={() => { setFoldDirection(option.id); setOpenPercent(0); }}
                style={{
                  padding: 'clamp(7px, 1.5vw, 10px) clamp(12px, 3vw, 20px)',
                  borderRadius: '6px',
                  border: 'none',
                  background: foldDirection === option.id ? '#fff' : 'transparent',
                  color: foldDirection === option.id ? '#1F2937' : '#6B7280',
                  fontSize: 'clamp(11px, 2.5vw, 14px)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: foldDirection === option.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Door visualization */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        perspective: '1500px',
        padding: '0 16px',
      }}>
        {/* Top track */}
        <div style={{
          height: '16px',
          background: 'linear-gradient(180deg, #78716C 0%, #57534E 100%)',
          borderRadius: '3px',
          marginBottom: '2px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '6px',
            left: '10px',
            right: '10px',
            height: '4px',
            background: '#44403C',
            borderRadius: '2px',
          }} />
        </div>

        {/* Door container */}
        <div
          ref={containerRef}
          style={{
          position: 'relative',
          height: compact ? '200px' : 'clamp(250px, 50vw, 400px)',
          width: '100%',
          background: '#F9FAFB',
          overflow: 'visible',
        }}>
          {/* Render panels */}
          {Array.from({ length: panelCount }).map((_, i) => {
            const style = calculatePanelStyle(i);
            const isLocked = openPercent < 5;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${style.width}px`,
                  height: '100%',
                  transform: style.transform,
                  transformOrigin: style.transformOrigin,
                  transformStyle: 'preserve-3d',
                  zIndex: style.zIndex,
                }}
              >
                {/* Panel glass */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, rgba(135,206,235,0.2) 0%, rgba(176,224,230,0.15) 100%)',
                  border: '3px solid #78716C',
                  borderRadius: '2px',
                  position: 'relative',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  backfaceVisibility: 'hidden',
                }}>
                  {/* Top frame */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '8px',
                    background: 'linear-gradient(180deg, #A8A29E 0%, #78716C 100%)',
                  }} />

                  {/* Bottom frame */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '12px',
                    background: 'linear-gradient(0deg, #A8A29E 0%, #78716C 100%)',
                  }} />

                  {/* Left frame */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '6px',
                    background: 'linear-gradient(90deg, #A8A29E 0%, #78716C 100%)',
                  }} />

                  {/* Right frame */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '6px',
                    background: 'linear-gradient(-90deg, #A8A29E 0%, #78716C 100%)',
                  }} />

                  {/* Glass reflection */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '15px',
                    width: '45%',
                    height: '35%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 70%)',
                    borderRadius: '3px',
                  }} />

                  {/* Hinges */}
                  {[20, 50, 80].map(top => (
                    <div key={top} style={{
                      position: 'absolute',
                      top: `${top}%`,
                      left: '-3px',
                      width: '8px',
                      height: '25px',
                      background: '#57534E',
                      borderRadius: '2px',
                    }} />
                  ))}

                  {/* Handle - only on operating panels */}
                  {(() => {
                    let showHandle = false;
                    let handlePosition: 'left' | 'right' = 'right';

                    if (foldDirection === 'left') {
                      showHandle = i === panelCount - 1;
                      handlePosition = 'left';
                    } else if (foldDirection === 'right') {
                      showHandle = i === 0;
                      handlePosition = 'right';
                    } else if (foldDirection === 'center') {
                      const halfPoint = Math.floor(panelCount / 2);
                      if (i === halfPoint - 1) {
                        showHandle = true;
                        handlePosition = 'right';
                      } else if (i === halfPoint) {
                        showHandle = true;
                        handlePosition = 'left';
                      }
                    }

                    if (!showHandle) return null;

                    return (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: handlePosition === 'right' ? '10px' : 'auto',
                        left: handlePosition === 'left' ? '10px' : 'auto',
                        width: '8px',
                        height: '60px',
                        background: '#44403C',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                      }} />
                    );
                  })()}

                  {/* Lock indicator */}
                  {i === 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '15px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: isLocked ? '#10B981' : '#EF4444',
                      boxShadow: `0 0 10px ${isLocked ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)'}`,
                    }} />
                  )}

                  {/* Panel number */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#78716C',
                  }}>
                    {i + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom track */}
        <div style={{
          height: '20px',
          background: 'linear-gradient(0deg, #78716C 0%, #57534E 100%)',
          borderRadius: '3px',
          marginTop: '2px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '10px',
            right: '10px',
            height: '6px',
            background: '#44403C',
            borderRadius: '2px',
          }} />
        </div>
      </div>

      {/* Control panel */}
      <div style={{
        maxWidth: '400px',
        margin: `${compact ? '16px' : '40px'} auto 0`,
        padding: compact ? '16px' : '30px',
        background: '#F9FAFB',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        {/* Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: compact ? '14px' : '16px', fontWeight: '600', color: '#374151' }}>
            Door Position
          </span>
          <span style={{
            fontSize: compact ? '28px' : '32px',
            fontWeight: '700',
            color: openPercent < 5 ? '#10B981' : '#3B82F6',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {Math.round(openPercent)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          position: 'relative',
          height: compact ? '8px' : '10px',
          background: '#E5E7EB',
          borderRadius: '5px',
          marginBottom: '20px',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${openPercent}%`,
            background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
            borderRadius: '5px',
            transition: 'width 0.05s linear',
          }} />
        </div>

        {/* Slider */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={openPercent}
            onChange={(e) => setOpenPercent(Number(e.target.value))}
            disabled={isAnimating}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              outline: 'none',
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${openPercent}%, #E5E7EB ${openPercent}%, #E5E7EB 100%)`,
              WebkitAppearance: 'none',
              cursor: isAnimating ? 'not-allowed' : 'pointer',
              opacity: isAnimating ? 0.5 : 1,
            }}
            className="door-slider"
          />
          <style dangerouslySetInnerHTML={{ __html: `
            .door-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #3B82F6;
              cursor: pointer;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .door-slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #3B82F6;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .door-slider:disabled::-webkit-slider-thumb {
              cursor: not-allowed;
              background: #9CA3AF;
            }
            .door-slider:disabled::-moz-range-thumb {
              cursor: not-allowed;
              background: #9CA3AF;
            }
          `}} />
        </div>

        {/* Action button */}
        <button
          onClick={toggleDoors}
          disabled={isAnimating}
          style={{
            width: '100%',
            padding: compact ? '14px' : '18px',
            fontSize: compact ? '16px' : '18px',
            fontWeight: '700',
            color: '#fff',
            background: isAnimating
              ? '#9CA3AF'
              : openPercent < 50
                ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            boxShadow: isAnimating ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {isAnimating ? 'Animating...' : openPercent < 50 ? 'Open Doors' : 'Close Doors'}
        </button>

        {/* Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#9CA3AF',
        }}>
          <span>CLOSED</span>
          <span>OPEN</span>
        </div>
      </div>
    </div>
  );
}
