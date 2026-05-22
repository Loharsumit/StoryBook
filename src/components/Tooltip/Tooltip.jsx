import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Position-specific classes for the tooltip container.
 * Each position places the tooltip relative to the trigger element.
 */
const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * Arrow classes for each position.
 * Uses CSS borders to create a small triangle pointing toward the trigger.
 */
const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-slate-950',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-slate-900 dark:border-b-slate-950',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-slate-900 dark:border-l-slate-950',
  right: 'right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-slate-900 dark:border-r-slate-950',
};

/**
 * A hover-triggered Tooltip component that displays contextual information
 * near the trigger element. Supports four positions, an optional delay,
 * an optional directional arrow, and full ARIA accessibility.
 */
const Tooltip = ({
  content,
  position = 'top',
  delay = 0,
  arrow = true,
  children,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  /** Stable unique ID for the tooltip, used by aria-describedby */
  const tooltipId = useRef(
    `tooltip-${Math.random().toString(36).substring(2, 9)}`
  ).current;

  /**
   * Show the tooltip after the optional delay.
   * If delay is 0 the tooltip appears immediately.
   */
  const handleMouseEnter = useCallback(() => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
      }, delay);
    } else {
      setVisible(true);
    }
  }, [delay]);

  /**
   * Hide the tooltip and cancel any pending delay timer.
   */
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  /**
   * Also show/hide on keyboard focus for accessibility.
   */
  const handleFocus = useCallback(() => {
    handleMouseEnter();
  }, [handleMouseEnter]);

  const handleBlur = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Trigger element – links to the tooltip via aria-describedby */}
      <div aria-describedby={visible ? tooltipId : undefined}>
        {children}
      </div>

      {/* Tooltip bubble */}
      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={[
            'absolute z-50',
            'bg-slate-900 dark:bg-slate-950 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg border border-slate-800 dark:border-slate-900 whitespace-nowrap',
            'animate-fade-in',
            positionClasses[position],
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content}

          {/* Directional arrow */}
          {arrow && (
            <span
              className={`absolute w-0 h-0 ${arrowClasses[position]}`}
              data-testid="tooltip-arrow"
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

Tooltip.propTypes = {
  /** Tooltip content – can be a string or React node */
  content: PropTypes.node.isRequired,
  /** Placement relative to the trigger element */
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  /** Delay in milliseconds before the tooltip appears */
  delay: PropTypes.number,
  /** Whether to show a directional arrow */
  arrow: PropTypes.bool,
  /** The trigger element(s) */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes for the tooltip bubble */
  className: PropTypes.string,
};

Tooltip.defaultProps = {
  position: 'top',
  delay: 0,
  arrow: true,
  className: '',
};

export default Tooltip;
