"use client";

import React, { useState, useEffect } from 'react';

const BifoldDoorAnimation = () => {
  const [selectedConfig, setSelectedConfig] = useState(4);
  const [openAmount, setOpenAmount] = useState(0);
  const [foldDirection, setFoldDirection] = useState<'left' | 'right' | 'center'>('left');

  useEffect(() => {
    // Add custom slider styles
    const style = document.createElement('style');
    style.textContent = `
      .bifold-door-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 44px;
        height: 44px;
        cursor: pointer;
        opacity: 0;
      }
      .bifold-door-slider::-moz-range-thumb {
        width: 44px;
        height: 44px;
        cursor: pointer;
        opacity: 0;
        border: none;
        background: transparent;
      }
      .bifold-door-slider::-webkit-slider-runnable-track {
        width: 100%;
        height: 44px;
        cursor: pointer;
      }
      .bifold-door-slider::-moz-range-track {
        width: 100%;
        height: 44px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
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

    if (isCenterFold) {
      const midPoint = Math.floor(totalPanels / 2);
      const isLeftSide = index < midPoint;

      if (isLeftSide) {
        // Left side panels fold left
        const foldAngle = index % 2 === 0 ? -90 : 90;
        rotateY = foldAngle * progress;
        originX = index % 2 === 0 ? '0%' : '100%';

        const stackOffset = panelWidth * progress * (midPoint - index) * 1.1;
        translateX = -stackOffset;
        zIndex = index % 2 === 0 ? totalPanels - index : index;
      } else {
        // Right side panels fold right
        const rightIndex = index - midPoint;
        const foldAngle = rightIndex % 2 === 0 ? 90 : -90;
        rotateY = foldAngle * progress;
        originX = rightIndex % 2 === 0 ? '100%' : '0%';

        const stackOffset = panelWidth * progress * (index - midPoint + 1) * 1.1;
        translateX = stackOffset;
        zIndex = rightIndex % 2 === 0 ? totalPanels - rightIndex : rightIndex;
      }
    } else if (isLeftFold) {
      // All panels fold to the left
      const foldAngle = index % 2 === 0 ? -90 : 90;
      rotateY = foldAngle * progress;
      originX = index % 2 === 0 ? '0%' : '100%';

      const stackOffset = panelWidth * progress * (totalPanels - index - 1) * 1.1;
      translateX = -stackOffset;
      zIndex = index % 2 === 0 ? totalPanels - index : index;
    } else if (isRightFold) {
      // All panels fold to the right
      const foldAngle = index % 2 === 0 ? 90 : -90;
      rotateY = foldAngle * progress;
      originX = index % 2 === 0 ? '100%' : '0%';

      const stackOffset = panelWidth * progress * index * 1.1;
      translateX = stackOffset;
      zIndex = index % 2 === 0 ? index : totalPanels - index;
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
      <div style={{ textAlign: 'center', marginBottom: '20px', maxWidth: '600px' }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1F2937',
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px',
        }}>
          Interactive Bi-fold Preview
        </h2>
        <p style={{
          fontSize: '15px',
          color: '#6B7280',
          margin: 0,
          lineHeight: 1.6,
        }}>
          Explore different panel configurations and folding directions
        </p>
      </div>

      {/* Panel Count Selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <span style={{
          fontSize: '13px',
          color: '#6B7280',
          alignSelf: 'center',
          marginRight: '8px',
        }}>
          Panels:
        </span>
        {configurations.map((count) => (
          <button
            key={count}
            onClick={() => {
              setSelectedConfig(count);
              setOpenAmount(0);
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: selectedConfig === count ? '2px solid #78716C' : '2px solid #E5E7EB',
              background: selectedConfig === count ? '#F5F5F4' : '#FFFFFF',
              color: selectedConfig === count ? '#44403C' : '#6B7280',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {count}
          </button>
        ))}
      </div>

      {/* Fold Direction Selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        background: '#F5F5F4',
        padding: '4px',
        borderRadius: '12px',
      }}>
        {[
          { id: 'left' as const, label: '← Fold Left' },
          { id: 'center' as const, label: '↔ Fold Center' },
          { id: 'right' as const, label: 'Fold Right →' },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setFoldDirection(option.id);
              setOpenAmount(0);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: foldDirection === option.id ? '#FFFFFF' : 'transparent',
              color: foldDirection === option.id ? '#44403C' : '#78716C',
              fontWeight: '500',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: foldDirection === option.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {option.label}
          </button>
        ))}
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
          background: openAmount > 50
            ? 'linear-gradient(180deg, #87CEEB 0%, #98D8C8 100%)'
            : '#FFFFFF',
          overflow: 'visible',
          border: '4px solid #57534E',
          borderTop: 'none',
          borderBottom: 'none',
          transition: 'background 0.5s ease',
        }}>
          {/* Outdoor scene hint when open */}
          {openAmount > 30 && (
            <div style={{
              position: 'absolute',
              inset: 0,
              opacity: (openAmount - 30) / 70,
              transition: 'opacity 0.3s',
              overflow: 'hidden',
            }}>
              {/* Sky gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 60%, #98D8C8 100%)',
              }} />
              {/* Sun */}
              <div style={{
                position: 'absolute',
                top: '30px',
                right: '60px',
                width: '50px',
                height: '50px',
                background: 'radial-gradient(circle, #FEF3C7 0%, #FCD34D 50%, transparent 70%)',
                borderRadius: '50%',
              }} />
              {/* Distant hills */}
              <div style={{
                position: 'absolute',
                bottom: '80px',
                left: 0,
                right: 0,
                height: '60px',
                background: '#6EE7B7',
                borderRadius: '50% 50% 0 0',
                opacity: 0.7,
              }} />
              {/* Patio/deck suggestion */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '80px',
                background: 'linear-gradient(180deg, #D4A574 0%, #BC8F5F 100%)',
              }}>
                {/* Deck lines */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: `${i * 12 + 5}px`,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'rgba(0,0,0,0.1)',
                  }} />
                ))}
              </div>
            </div>
          )}

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

      {/* Slider Control */}
      <div style={{
        marginTop: '32px',
        width: '100%',
        maxWidth: '500px',
        padding: '24px',
        background: '#FAFAF9',
        borderRadius: '16px',
        border: '1px solid #E7E5E4',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#44403C',
          }}>
            Open / Close
          </span>
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: openAmount < 5 ? '#10B981' : '#78716C',
            minWidth: '80px',
            textAlign: 'right',
          }}>
            {Math.round(openAmount)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ position: 'relative', height: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#E7E5E4',
            borderRadius: '5px',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${openAmount}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #78716C 0%, #57534E 100%)',
            borderRadius: '5px',
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
                ? 'linear-gradient(135deg, #78716C 0%, #57534E 100%)'
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
          fontSize: '12px',
          color: '#A8A29E',
        }}>
          <span>Closed</span>
          <span>Fully Open</span>
        </div>
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
          <div><strong>Fold Direction:</strong> Choose how panels fold - left, right, or from center</div>
          <div><strong>Panel Count:</strong> Select 2-6 panels based on your opening width</div>
          <div><strong>Stacking:</strong> Panels fold accordion-style and stack neatly to maximize opening</div>
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
              background: '#10B981',
            }} />
            Locked (Closed)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#EF4444',
            }} />
            Unlocked (Open)
          </div>
        </div>
      </div>
    </div>
  );
};

export default BifoldDoorAnimation;
