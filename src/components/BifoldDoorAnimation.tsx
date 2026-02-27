"use client";

import React, { useState } from 'react';

export default function BifoldDoorAnimation() {
  const [panelCount, setPanelCount] = useState(4);
  const [foldDirection, setFoldDirection] = useState<'left' | 'right' | 'center'>('left');
  const [openPercent, setOpenPercent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Calculate panel position and rotation
  const calculatePanelStyle = (panelIndex: number) => {
    const CONTAINER_WIDTH = 800; // Fixed container width
    const PANEL_WIDTH = CONTAINER_WIDTH / panelCount;
    const FOLDED_PANEL_WIDTH = 50; // Width of each panel when folded (thicker so visible)
    const GAP_BETWEEN_PANELS = -40; // NEGATIVE gap - panels overlap heavily
    const progress = openPercent / 100;

    // Starting position when CLOSED (spread across container)
    const closedX = panelIndex * PANEL_WIDTH;

    // Ending position when OPEN (stacked at edge)
    let openX = 0;
    let rotationAngle = 0;
    let zIndex = 0;

    // Width transitions from full to folded
    const currentWidth = PANEL_WIDTH + (FOLDED_PANEL_WIDTH - PANEL_WIDTH) * progress;

    const LEFT_OFFSET = -50; // Move stacks 50px more to the left

    if (foldDirection === 'left') {
      // Stack all panels at LEFT edge with gaps
      openX = LEFT_OFFSET + panelIndex * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
      rotationAngle = (panelIndex % 2 === 0 ? -75 : 75);
      zIndex = panelIndex;

    } else if (foldDirection === 'right') {
      // Stack all panels at RIGHT edge with gaps
      openX = CONTAINER_WIDTH - (panelCount - panelIndex) * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
      rotationAngle = (panelIndex % 2 === 0 ? 75 : -75);
      zIndex = panelCount - panelIndex;

    } else {
      // CENTER: split panels
      const halfPoint = Math.floor(panelCount / 2);

      if (panelIndex < halfPoint) {
        // Left group stacks at LEFT
        openX = LEFT_OFFSET + panelIndex * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
        rotationAngle = (panelIndex % 2 === 0 ? -75 : 75);
        zIndex = panelIndex;
      } else {
        // Right group stacks at RIGHT
        const rightIdx = panelIndex - halfPoint;
        const rightCount = panelCount - halfPoint;
        openX = CONTAINER_WIDTH - (rightCount - rightIdx) * (FOLDED_PANEL_WIDTH + GAP_BETWEEN_PANELS);
        rotationAngle = (rightIdx % 2 === 0 ? 75 : -75);
        zIndex = panelCount - panelIndex;
      }
    }

    // Interpolate position and rotation
    const currentX = closedX + (openX - closedX) * progress;
    const currentRotation = rotationAngle * progress;

    return {
      transform: `translateX(${currentX}px) rotateY(${currentRotation}deg)`,
      transformOrigin: '50% 50%',
      width: currentWidth,
      zIndex,
    };
  };

  return (
    <div style={{
      width: '100%',
      padding: '40px 20px',
      background: '#fff',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: '0 0 10px 0' }}>
          Bi-Fold Door Preview
        </h2>
        <p style={{ fontSize: '16px', color: '#6B7280', margin: 0 }}>
          Interactive door animation - choose panels and fold direction
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        marginBottom: '40px',
        flexWrap: 'wrap',
      }}>
        {/* Panel count selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Panels:</span>
          {[2, 3, 4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => { setPanelCount(num); setOpenPercent(0); }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: panelCount === num ? '2px solid #3B82F6' : '2px solid #E5E7EB',
                background: panelCount === num ? '#EFF6FF' : '#fff',
                color: panelCount === num ? '#2563EB' : '#6B7280',
                fontSize: '16px',
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
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: foldDirection === option.id ? '#fff' : 'transparent',
                color: foldDirection === option.id ? '#1F2937' : '#6B7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: foldDirection === option.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Door visualization */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        perspective: '1500px',
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
        <div style={{
          position: 'relative',
          height: '400px',
          width: '800px',
          margin: '0 auto',
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

                  {/* Handle */}
                  {(i === 0 || i === panelCount - 1) && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      right: i === 0 ? '10px' : 'auto',
                      left: i === panelCount - 1 ? '10px' : 'auto',
                      width: '8px',
                      height: '60px',
                      background: '#44403C',
                      borderRadius: '4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    }} />
                  )}

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
        margin: '40px auto 0',
        padding: '30px',
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
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>
            Door Status
          </span>
          <span style={{
            fontSize: '32px',
            fontWeight: '700',
            color: openPercent < 5 ? '#10B981' : '#3B82F6',
          }}>
            {Math.round(openPercent)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          position: 'relative',
          height: '10px',
          background: '#E5E7EB',
          borderRadius: '5px',
          marginBottom: '25px',
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

        {/* Action button */}
        <button
          onClick={toggleDoors}
          disabled={isAnimating}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '18px',
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
