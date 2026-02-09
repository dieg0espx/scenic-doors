"use client";

import React, { useState, useEffect } from 'react';

const SlidingDoorAnimation = () => {
  const [selectedConfig, setSelectedConfig] = useState('OXO');
  const [openAmount, setOpenAmount] = useState(0);
  const [showWallPocket, setShowWallPocket] = useState(false);

  const configurations: Record<string, { panels: number; fixed: number[]; sliding: number[]; directions: number[] }> = {
    'XO': { panels: 2, fixed: [1], sliding: [0], directions: [-1] },
    'OX': { panels: 2, fixed: [0], sliding: [1], directions: [1] },
    'OXO': { panels: 3, fixed: [0, 2], sliding: [1], directions: [1] },
    'OXXO': { panels: 4, fixed: [0, 3], sliding: [1, 2], directions: [1, -1] },
    'XX': { panels: 2, fixed: [], sliding: [0, 1], directions: [-1, 1] },
    'XXX': { panels: 3, fixed: [], sliding: [0, 1, 2], directions: [-1, 0, 1] },
    'XXXX': { panels: 4, fixed: [], sliding: [0, 1, 2, 3], directions: [-1, -1, 1, 1] },
  };

  const config = configurations[selectedConfig];
  const panelWidth = 100 / config.panels;

  // Reset slider when config changes
  useEffect(() => {
    setOpenAmount(0);
  }, [selectedConfig]);

  // Calculate panel position based on slider value
  const getPanelPosition = (index: number) => {
    const basePosition = index * panelWidth;

    if (config.sliding.includes(index)) {
      const slidingIndex = config.sliding.indexOf(index);
      const direction = config.directions[slidingIndex];
      const slideAmount = panelWidth * 0.85 * (openAmount / 100);
      return basePosition + (direction * slideAmount);
    }

    return basePosition;
  };

  const Panel = ({ index, position }: { index: number; position: number }) => {
    const isSliding = config.sliding.includes(index);
    const isLocked = openAmount < 5;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${position}%`,
          top: 0,
          width: `${panelWidth}%`,
          height: '100%',
          transition: 'left 0.05s linear',
          display: 'flex',
          flexDirection: 'column',
          zIndex: isSliding ? 10 : 5,
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
            boxShadow: isSliding
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
          {isSliding && (
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
          )}

          {/* Lock indicator */}
          {isSliding && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '10px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isLocked ? '#10B981' : '#EF4444',
              boxShadow: isLocked
                ? '0 0 8px rgba(16, 185, 129, 0.5)'
                : '0 0 8px rgba(239, 68, 68, 0.5)',
              transition: 'all 0.2s',
            }} />
          )}

          {/* Panel type indicator */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: '#6B7280',
            fontWeight: '600',
          }}>
            {selectedConfig[index]}
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
          Interactive Configuration Preview
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0,
        }}>
          Explore different panel configurations and see how they operate
        </p>
      </div>

      {/* Configuration Selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {Object.keys(configurations).map((cfg) => (
          <button
            key={cfg}
            onClick={() => setSelectedConfig(cfg)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: selectedConfig === cfg ? '2px solid #3898EC' : '2px solid #E5E7EB',
              background: selectedConfig === cfg ? '#EFF6FF' : '#FFFFFF',
              color: selectedConfig === cfg ? '#1D4ED8' : '#4B5563',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cfg}
          </button>
        ))}
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
          background: showWallPocket
            ? 'linear-gradient(90deg, #F3F4F6 0%, #FFFFFF 15%, #FFFFFF 85%, #F3F4F6 100%)'
            : '#FFFFFF',
          overflow: 'hidden',
          border: '3px solid #4B5563',
          borderTop: 'none',
          borderBottom: 'none',
        }}>
          {/* Wall pocket indicators */}
          {showWallPocket && (
            <>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '12%',
                background: 'repeating-linear-gradient(90deg, #E5E7EB 0px, #E5E7EB 2px, #F9FAFB 2px, #F9FAFB 8px)',
                borderRight: '2px dashed #9CA3AF',
                opacity: 0.7,
              }} />
              <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '12%',
                background: 'repeating-linear-gradient(90deg, #F9FAFB 0px, #F9FAFB 6px, #E5E7EB 6px, #E5E7EB 8px)',
                borderLeft: '2px dashed #9CA3AF',
                opacity: 0.7,
              }} />
            </>
          )}

          {/* Panels */}
          {Array.from({ length: config.panels }).map((_, index) => (
            <Panel
              key={index}
              index={index}
              position={getPanelPosition(index)}
            />
          ))}
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
          {Array.from({ length: config.panels * 2 }).map((_, i) => (
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
            Door Position
          </span>
          <span style={{
            fontSize: '24px',
            fontWeight: '700',
            color: openAmount < 5 ? '#10B981' : '#3898EC',
            minWidth: '80px',
            textAlign: 'right',
          }}>
            {Math.round(openAmount)}%
          </span>
        </div>

        {/* Custom Slider */}
        <div style={{ position: 'relative', height: '40px' }}>
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
          }} />

          {/* Filled track */}
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
            width: `${openAmount}%`,
            height: '8px',
            background: 'linear-gradient(90deg, #3898EC 0%, #1D4ED8 100%)',
            borderRadius: '4px',
            transition: 'width 0.05s linear',
          }} />

          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="100"
            value={openAmount}
            onChange={(e) => setOpenAmount(Number(e.target.value))}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 10,
            }}
          />

          {/* Custom thumb */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${openAmount}%`,
            transform: 'translate(-50%, -50%)',
            width: '28px',
            height: '28px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2), 0 0 0 3px #3898EC',
            pointerEvents: 'none',
            transition: 'left 0.05s linear',
          }}>
            {/* Grip lines */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              gap: '3px',
            }}>
              <div style={{ width: '2px', height: '10px', background: '#9CA3AF', borderRadius: '1px' }} />
              <div style={{ width: '2px', height: '10px', background: '#9CA3AF', borderRadius: '1px' }} />
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
          <span>Closed</span>
          <span>Open</span>
        </div>
      </div>

      {/* Wall Pocket Toggle */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#4B5563',
        marginTop: '20px',
        padding: '12px 20px',
        background: showWallPocket ? '#EFF6FF' : '#F9FAFB',
        borderRadius: '10px',
        border: showWallPocket ? '2px solid #3898EC' : '2px solid transparent',
        transition: 'all 0.2s',
      }}>
        <input
          type="checkbox"
          checked={showWallPocket}
          onChange={(e) => setShowWallPocket(e.target.checked)}
          style={{ display: 'none' }}
        />
        <div style={{
          width: '44px',
          height: '24px',
          background: showWallPocket ? '#3898EC' : '#D1D5DB',
          borderRadius: '12px',
          position: 'relative',
          transition: 'all 0.2s',
        }}>
          <div style={{
            position: 'absolute',
            top: '2px',
            left: showWallPocket ? '22px' : '2px',
            width: '20px',
            height: '20px',
            background: '#FFFFFF',
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left 0.2s',
          }} />
        </div>
        Show Wall Pocket Configuration
      </label>

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
          Configuration Legend
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          fontSize: '13px',
          color: '#6B7280',
        }}>
          <div><strong>X</strong> = Sliding Panel</div>
          <div><strong>O</strong> = Fixed Panel</div>
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

export default SlidingDoorAnimation;
