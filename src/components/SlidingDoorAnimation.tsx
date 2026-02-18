"use client";

import React, { useState, useEffect } from 'react';

const SlidingDoorAnimation = () => {
  const [slidePosition, setSlidePosition] = useState(50); // 0 = left panel forward, 50 = both visible, 100 = right panel forward

  useEffect(() => {
    // Add custom slider styles
    const style = document.createElement('style');
    style.textContent = `
      .sliding-door-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 40px;
        height: 40px;
        cursor: pointer;
        opacity: 0;
      }
      .sliding-door-slider::-moz-range-thumb {
        width: 40px;
        height: 40px;
        cursor: pointer;
        opacity: 0;
        border: none;
        background: transparent;
      }
      .sliding-door-slider::-webkit-slider-runnable-track {
        width: 100%;
        height: 40px;
        cursor: pointer;
      }
      .sliding-door-slider::-moz-range-track {
        width: 100%;
        height: 40px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Calculate panel positions and offsets
  // When slidePosition = 0: left panel slides fully right (behind right panel)
  // When slidePosition = 50: both panels side by side (neutral position)
  // When slidePosition = 100: right panel slides fully left (behind left panel)

  const getLeftPanelOffset = () => {
    if (slidePosition < 50) {
      // Left panel slides right to overlap with right panel
      return (1 - slidePosition / 50) * 48; // Moves up to 48% right
    }
    return 0; // At or past center position
  };

  const getRightPanelOffset = () => {
    if (slidePosition > 50) {
      // Right panel slides left to overlap with left panel
      return -((slidePosition - 50) / 50) * 48; // Moves up to -48% left
    }
    return 0; // At or before center position
  };

  // Determine z-index based on which panel should be visible on top
  const getLeftPanelZIndex = () => {
    return slidePosition < 50 ? 5 : 10; // Behind when sliding right, front otherwise
  };

  const getRightPanelZIndex = () => {
    return slidePosition > 50 ? 5 : 10; // Behind when sliding left, front otherwise
  };

  const Panel = ({
    basePosition,
    offset,
    zIndex,
    label,
  }: {
    basePosition: number;
    offset: number;
    zIndex: number;
    label: string;
  }) => {
    const isMoving = slidePosition !== 50;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${basePosition + offset}%`,
          top: 0,
          width: '50%',
          height: '100%',
          transition: 'left 0.15s ease-out',
          display: 'flex',
          flexDirection: 'column',
          zIndex: zIndex,
        }}
      >
        {/* Frame */}
        <div
          style={{
            flex: 1,
            margin: '2px',
            border: '4px solid #6B7280',
            borderRadius: '2px',
            background: 'linear-gradient(180deg, rgba(200,220,240,0.3) 0%, rgba(180,200,220,0.2) 100%)',
            position: 'relative',
            boxShadow: isMoving
              ? '0 4px 20px rgba(0,0,0,0.15)'
              : '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {/* Aluminum frame details */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(180deg, #9CA3AF 0%, #6B7280 100%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(0deg, #9CA3AF 0%, #6B7280 100%)',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '8px',
            background: 'linear-gradient(90deg, #9CA3AF 0%, #6B7280 100%)',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '8px',
            background: 'linear-gradient(-90deg, #9CA3AF 0%, #6B7280 100%)',
          }} />

          {/* Glass reflection */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '60%',
            bottom: '60%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            borderRadius: '2px',
          }} />

          {/* Handle for sliding panels */}
          <div style={{
            position: 'absolute',
            top: '45%',
            right: '12px',
            width: '8px',
            height: '40px',
            background: 'linear-gradient(90deg, #4B5563 0%, #374151 100%)',
            borderRadius: '4px',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
          }} />

          {/* Panel label */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#6B7280',
            fontWeight: '600',
            background: 'rgba(255,255,255,0.8)',
            padding: '4px 8px',
            borderRadius: '4px',
          }}>
            {label}
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
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1F2937',
          margin: '0 0 8px 0',
        }}>
          Multi-Slide Door Preview
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0,
        }}>
          Two panels slide horizontally, overlapping within the frame
        </p>
      </div>

      {/* Door Animation Container */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        position: 'relative',
      }}>
        {/* Track - Top */}
        <div style={{
          height: '12px',
          background: 'linear-gradient(180deg, #374151 0%, #4B5563 50%, #374151 100%)',
          borderRadius: '2px',
          marginBottom: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          position: 'relative',
        }}>
          {/* Track grooves */}
          <div style={{
            position: 'absolute',
            top: '4px',
            left: '10px',
            right: '10px',
            height: '2px',
            background: '#1F2937',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute',
            top: '7px',
            left: '10px',
            right: '10px',
            height: '2px',
            background: '#1F2937',
            borderRadius: '1px',
          }} />
        </div>

        {/* Door Frame */}
        <div style={{
          position: 'relative',
          height: '350px',
          background: '#FFFFFF',
          overflow: 'hidden',
          border: '3px solid #4B5563',
          borderTop: 'none',
          borderBottom: 'none',
        }}>
          {/* Left Panel */}
          <Panel
            basePosition={0}
            offset={getLeftPanelOffset()}
            zIndex={getLeftPanelZIndex()}
            label="Left Panel"
          />

          {/* Right Panel */}
          <Panel
            basePosition={50}
            offset={getRightPanelOffset()}
            zIndex={getRightPanelZIndex()}
            label="Right Panel"
          />
        </div>

        {/* Track - Bottom */}
        <div style={{
          height: '16px',
          background: 'linear-gradient(0deg, #374151 0%, #4B5563 50%, #374151 100%)',
          borderRadius: '2px',
          marginTop: '4px',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.2)',
          position: 'relative',
        }}>
          {/* Track grooves */}
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '10px',
            right: '10px',
            height: '3px',
            background: '#1F2937',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            height: '3px',
            background: '#1F2937',
            borderRadius: '1px',
          }} />
        </div>

        {/* Roller indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '8px',
          padding: '0 20px',
        }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B7280 0%, #374151 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          ))}
        </div>
      </div>

      {/* Slider Control */}
      <div style={{
        marginTop: '32px',
        width: '100%',
        maxWidth: '500px',
        padding: '24px',
        background: '#F9FAFB',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
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
            color: '#374151',
          }}>
            Panel Position
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
          }}>
            {slidePosition < 50 ? 'Left Sliding →' : slidePosition > 50 ? '← Right Sliding' : 'Centered'}
          </span>
        </div>

        {/* Custom Slider */}
        <div style={{ position: 'relative', height: '40px', userSelect: 'none', touchAction: 'none' }}>
          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="100"
            value={slidePosition}
            onChange={(e) => setSlidePosition(Number(e.target.value))}
            onInput={(e) => setSlidePosition(Number((e.target as HTMLInputElement).value))}
            className="sliding-door-slider"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              padding: 0,
              cursor: 'pointer',
              zIndex: 20,
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              background: 'transparent',
              border: 'none',
              outline: 'none',
            } as React.CSSProperties}
          />

          {/* Track background */}
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
            right: 0,
            height: '8px',
            background: '#E5E7EB',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Center marker */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '3px',
            height: '20px',
            background: '#9CA3AF',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Filled track (left side) */}
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
            width: slidePosition < 50 ? `${50 - slidePosition}%` : '0%',
            height: '8px',
            background: 'linear-gradient(90deg, #3898EC 0%, #1D4ED8 100%)',
            borderRadius: '4px',
            transition: 'width 0.05s linear',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Filled track (right side) */}
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: 0,
            width: slidePosition > 50 ? `${slidePosition - 50}%` : '0%',
            height: '8px',
            background: 'linear-gradient(-90deg, #3898EC 0%, #1D4ED8 100%)',
            borderRadius: '4px',
            transition: 'width 0.05s linear',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Custom thumb */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${slidePosition}%`,
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2), 0 0 0 3px #3898EC',
            pointerEvents: 'none',
            transition: 'left 0.05s linear',
            zIndex: 3,
          }}>
            {/* Grip lines */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              gap: '3px',
              pointerEvents: 'none',
            }}>
              <div style={{ width: '2px', height: '10px', background: '#9CA3AF', borderRadius: '1px', pointerEvents: 'none' }} />
              <div style={{ width: '2px', height: '10px', background: '#9CA3AF', borderRadius: '1px', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '12px',
          color: '#9CA3AF',
        }}>
          <span>Left Panel Forward</span>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Center</span>
          <span>Right Panel Forward</span>
        </div>
      </div>

    </div>
  );
};

export default SlidingDoorAnimation;
