"use client";

import React, { useState, useEffect } from 'react';

const SlideStackDoorAnimation = () => {
  useEffect(() => {
    // Add custom slider styles
    const style = document.createElement('style');
    style.textContent = `
      .custom-range-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 48px;
        height: 48px;
        cursor: pointer;
        opacity: 0;
      }
      .custom-range-slider::-moz-range-thumb {
        width: 48px;
        height: 48px;
        cursor: pointer;
        opacity: 0;
        border: none;
        background: transparent;
      }
      .custom-range-slider::-webkit-slider-runnable-track {
        width: 100%;
        height: 48px;
        cursor: pointer;
      }
      .custom-range-slider::-moz-range-track {
        width: 100%;
        height: 48px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [panelCount, setPanelCount] = useState(4);
  const [openAmount, setOpenAmount] = useState(0);
  const [stackSide, setStackSide] = useState<'left' | 'right' | 'split'>('right');
  const [viewMode, setViewMode] = useState<'standard' | 'corner'>('standard');
  const [cornerOpenMain, setCornerOpenMain] = useState(0);
  const [cornerOpenSide, setCornerOpenSide] = useState(0);
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
      // Panels slide right and stack at the right side
      const distanceFromRight = total - 1 - index;
      const maxSlide = panelWidth * distanceFromRight * 1.05;
      const stackOffset = index * 3; // Increased offset for better stacking
      return {
        translateX: maxSlide * progress + stackOffset * progress,
        zIndex: index,
      };
    } else if (direction === 'left') {
      // Panels slide left and stack at the left side
      const maxSlide = panelWidth * index * 1.05;
      const stackOffset = (total - 1 - index) * 3;
      return {
        translateX: -maxSlide * progress - stackOffset * progress,
        zIndex: total - index,
      };
    } else {
      // Split - left half goes left, right half goes right
      const mid = Math.floor(total / 2);
      if (index < mid) {
        const maxSlide = panelWidth * index * 1.05;
        const stackOffset = (mid - 1 - index) * 3;
        return {
          translateX: -maxSlide * progress - stackOffset * progress,
          zIndex: mid - index,
        };
      } else {
        const rightIndex = index - mid;
        const rightTotal = total - mid;
        const maxSlide = panelWidth * (rightTotal - 1 - rightIndex) * 1.05;
        const stackOffset = rightIndex * 3;
        return {
          translateX: maxSlide * progress + stackOffset * progress,
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
    }}>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #60A5FA 0%, #93C5FD 30%, #BFDBFE 60%, #E0F2FE 100%)',
      }} />

      {/* Sun glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '20%',
        width: '60px',
        height: '60px',
        background: 'radial-gradient(circle, rgba(253,224,71,0.9) 0%, rgba(253,224,71,0.3) 40%, transparent 70%)',
        borderRadius: '50%',
      }} />

      {/* Distant water */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)',
      }}>
        {/* Water shimmer */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '40%',
          height: '2px',
          background: 'rgba(255,255,255,0.6)',
          filter: 'blur(1px)',
        }} />
      </div>

      {/* Patio stones */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '25%',
        background: 'linear-gradient(180deg, #D6D3D1 0%, #A8A29E 100%)',
      }}>
        {/* Stone pattern */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}>
          <pattern id="stones" width="60" height="40" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="28" height="18" fill="none" stroke="#78716C" strokeWidth="1" />
            <rect x="30" y="0" width="28" height="18" fill="none" stroke="#78716C" strokeWidth="1" />
            <rect x="15" y="20" width="28" height="18" fill="none" stroke="#78716C" strokeWidth="1" />
            <rect x="45" y="20" width="13" height="18" fill="none" stroke="#78716C" strokeWidth="1" />
            <rect x="0" y="20" width="13" height="18" fill="none" stroke="#78716C" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#stones)" />
        </svg>
      </div>
    </div>
  );

  const AnimatedButton = ({ value, setValue, label }: { value: number; setValue: (val: number) => void; label: string }) => {
    const isClosed = value < 50;

    return (
      <div style={{
        flex: 1,
        minWidth: '280px',
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
            {label}
          </span>
          <span style={{
            fontSize: '28px',
            fontWeight: '700',
            color: value < 5 ? '#22C55E' : '#3B82F6',
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
            background: '#E4E4E7',
            borderRadius: '4px',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${value}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
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
          {isAnimating ? 'Animating...' : isClosed ? 'Open Doors' : 'Close Doors'}
        </button>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
          fontSize: '11px',
          color: '#A1A1AA',
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
          fontSize: '34px',
          fontWeight: '700',
          color: '#18181B',
          margin: '0 0 10px 0',
          letterSpacing: '-0.5px',
        }}>
          Interactive Slide & Stack Preview
        </h2>
        <p style={{
          fontSize: '15px',
          color: '#71717A',
          margin: 0,
          lineHeight: 1.7,
        }}>
          Explore different configurations and see how panels stack
        </p>
      </div>

      {/* View Mode Toggle */}
      <div style={{
        display: 'flex',
        background: '#F4F4F5',
        padding: '4px',
        borderRadius: '12px',
        marginBottom: '20px',
      }}>
        {[
          { id: 'standard' as const, label: 'Standard View' },
          { id: 'corner' as const, label: '90° Corner' },
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => {
              setViewMode(mode.id);
              setOpenAmount(0);
              setCornerOpenMain(0);
              setCornerOpenSide(0);
            }}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === mode.id ? '#FFFFFF' : 'transparent',
              color: viewMode === mode.id ? '#18181B' : '#71717A',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: viewMode === mode.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      {viewMode === 'standard' && (
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
      )}

      {/* Door Display */}
      {viewMode === 'standard' ? (
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
      ) : (
        /* 90° Corner View */
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '750px',
          justifyContent: 'center',
        }}>
          {/* Main Wall */}
          <div style={{ width: '55%' }}>
            <Track position="top" grooveCount={2} />
            <div style={{
              position: 'relative',
              height: '340px',
              background: '#FFFFFF',
              overflow: 'hidden',
              borderLeft: '4px solid #52525B',
            }}>
              <OutdoorScene opacity={cornerOpenMain > 15 ? Math.min((cornerOpenMain - 15) / 60, 1) : 0} />
              {[...Array(3)].map((_, i) => {
                const { translateX, zIndex } = getPanelTransform(i, 3, cornerOpenMain, 'left');
                return (
                  <GlassPanel
                    key={i}
                    index={i}
                    total={3}
                    translateX={translateX}
                    zIndex={zIndex}
                    isFirst={i === 0}
                    isLast={i === 2}
                  />
                );
              })}
            </div>
            <Track position="bottom" grooveCount={2} />
          </div>

          {/* Corner Post - No Mullion */}
          <div style={{
            width: '8px',
            background: 'linear-gradient(90deg, #71717A 0%, #52525B 50%, #71717A 100%)',
            marginTop: '14px',
            marginBottom: '18px',
            position: 'relative',
            zIndex: 50,
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '3px',
              height: '90%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)',
            }} />
          </div>

          {/* Side Wall */}
          <div style={{ width: '45%' }}>
            <Track position="top" grooveCount={2} />
            <div style={{
              position: 'relative',
              height: '340px',
              background: '#FFFFFF',
              overflow: 'hidden',
              borderRight: '4px solid #52525B',
            }}>
              <OutdoorScene opacity={cornerOpenSide > 15 ? Math.min((cornerOpenSide - 15) / 60, 1) : 0} />
              {[...Array(2)].map((_, i) => {
                const { translateX, zIndex } = getPanelTransform(i, 2, cornerOpenSide, 'right');
                return (
                  <GlassPanel
                    key={i}
                    index={i}
                    total={2}
                    translateX={translateX}
                    zIndex={zIndex}
                    isFirst={i === 0}
                    isLast={i === 1}
                  />
                );
              })}
            </div>
            <Track position="bottom" grooveCount={2} />
          </div>
        </div>
      )}

      {/* Animated Buttons */}
      <div style={{
        marginTop: '32px',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: viewMode === 'corner' ? '620px' : '340px',
      }}>
        {viewMode === 'standard' ? (
          <AnimatedButton value={openAmount} setValue={setOpenAmount} label="Door Position" />
        ) : (
          <>
            <AnimatedButton value={cornerOpenMain} setValue={setCornerOpenMain} label="Main Wall" />
            <AnimatedButton value={cornerOpenSide} setValue={setCornerOpenSide} label="Side Wall" />
          </>
        )}
      </div>

      {/* Legend */}
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
          How It Works
        </h3>
        <div style={{
          display: 'grid',
          gap: '12px',
          fontSize: '13px',
          color: '#6B7280',
        }}>
          <div><strong>Panel Count:</strong> Choose 2-6 panels based on your opening width</div>
          <div><strong>Stacking Direction:</strong> Stack left, right, or split from center</div>
          <div><strong>90° Corner:</strong> Open two walls simultaneously with no mullion</div>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default SlideStackDoorAnimation;
