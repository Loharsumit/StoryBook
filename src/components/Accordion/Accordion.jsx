import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import PropTypes from 'prop-types';

/**
 * Chevron icon used as the expand/collapse indicator.
 * Rotates 180° when the associated panel is expanded.
 */
const ChevronIcon = ({ isExpanded }) => (
  <svg
    className={[
      'h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform duration-200',
      isExpanded ? 'rotate-180' : '',
    ]
      .filter(Boolean)
      .join(' ')}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
    data-testid="chevron-icon"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

ChevronIcon.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
};

// ─── Individual Accordion Item ──────────────────────────────────────────────

/**
 * A single collapsible item within the Accordion.
 * Manages its own content height measurement for the max-height transition.
 */
const AccordionItem = ({
  id,
  title,
  content,
  disabled,
  isExpanded,
  onToggle,
  iconPosition,
  uniqueId,
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure the content's scrollHeight whenever the panel expands or content changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, content]);

  const headerId = `${uniqueId}-header-${id}`;
  const panelId = `${uniqueId}-panel-${id}`;

  /** Handle header button click – delegates to parent if not disabled */
  const handleClick = () => {
    if (!disabled) {
      onToggle(id);
    }
  };

  /** Handle keyboard events for accessibility */
  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle(id);
    }
  };

  // Build the header button classes
  const headerClasses = [
    'w-full flex items-center px-4 py-3 bg-white dark:bg-slate-800 text-left font-medium text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700',
    iconPosition === 'left' ? 'flex-row' : 'justify-between',
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer',
  ]
    .filter(Boolean)
    .join(' ');

  // Build the content panel's inline style for the animated max-height
  const panelStyle = {
    maxHeight: isExpanded ? `${contentHeight}px` : '0px',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-in-out',
  };

  return (
    <div data-testid={`accordion-item-${id}`}>
      {/* ── Header button ─────────────────────────────────────────────── */}
      <button
        id={headerId}
        className={headerClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        disabled={disabled}
        type="button"
        data-testid={`accordion-header-${id}`}
      >
        {/* Chevron on the left side */}
        {iconPosition === 'left' && (
          <span className="mr-3 inline-flex" data-testid={`chevron-left-${id}`}>
            <ChevronIcon isExpanded={isExpanded} />
          </span>
        )}

        <span className="flex-1">{title}</span>

        {/* Chevron on the right side (default) */}
        {iconPosition === 'right' && (
          <span className="ml-3 inline-flex" data-testid={`chevron-right-${id}`}>
            <ChevronIcon isExpanded={isExpanded} />
          </span>
        )}
      </button>

      {/* ── Content panel ─────────────────────────────────────────────── */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        style={panelStyle}
        data-testid={`accordion-panel-${id}`}
      >
        <div ref={contentRef} className="px-4 py-3 text-slate-600 dark:text-slate-300 text-sm">
          {content}
        </div>
      </div>
    </div>
  );
};

AccordionItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  iconPosition: PropTypes.oneOf(['left', 'right']).isRequired,
  uniqueId: PropTypes.string.isRequired,
};

AccordionItem.defaultProps = {
  disabled: false,
};

// ─── Main Accordion Component ───────────────────────────────────────────────

/**
 * A fully accessible, collapsible Accordion component.
 *
 * Supports single-expand (default) and multi-expand modes, disabled items,
 * default expanded state, configurable icon position, and smooth
 * max-height transitions.
 */
const Accordion = ({
  items = [],
  allowMultiple = false,
  defaultExpanded = [],
  iconPosition = 'right',
  className = '',
}) => {
  // Generate a unique prefix so header/panel IDs never collide on the page
  const uniqueId = useId();

  // Track which item IDs are currently expanded
  const [expandedIds, setExpandedIds] = useState(() => new Set(defaultExpanded));

  /**
   * Toggle an item's expanded state.
   * In single-expand mode, opening one item closes all others.
   */
  const handleToggle = useCallback(
    (id) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);

        if (next.has(id)) {
          // Collapse the item
          next.delete(id);
        } else if (allowMultiple) {
          // Multi-expand: just add it
          next.add(id);
        } else {
          // Single-expand: clear everything first, then add the new one
          next.clear();
          next.add(id);
        }

        return next;
      });
    },
    [allowMultiple]
  );

  // Build the wrapper classes
  const wrapperClasses = [
    'border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden divide-y divide-slate-200 dark:divide-slate-700',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses} data-testid="accordion">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          disabled={item.disabled}
          isExpanded={expandedIds.has(item.id)}
          onToggle={handleToggle}
          iconPosition={iconPosition}
          uniqueId={uniqueId}
        />
      ))}
    </div>
  );
};

Accordion.displayName = 'Accordion';

Accordion.propTypes = {
  /** Array of accordion items to render */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique identifier for the item */
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      /** Header title – can be a string or JSX */
      title: PropTypes.node.isRequired,
      /** Content shown when the item is expanded */
      content: PropTypes.node.isRequired,
      /** Whether the item is disabled (non-interactive) */
      disabled: PropTypes.bool,
    })
  ).isRequired,
  /** Allow more than one item to be expanded simultaneously */
  allowMultiple: PropTypes.bool,
  /** Array of item IDs that should be expanded on first render */
  defaultExpanded: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  /** Position of the expand/collapse chevron icon */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** Additional CSS classes for the wrapper */
  className: PropTypes.string,
};

Accordion.defaultProps = {
  items: [],
  allowMultiple: false,
  defaultExpanded: [],
  iconPosition: 'right',
  className: '',
};

export default Accordion;
