import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Shadow variant class mapping.
 * Maps shadow prop values to their corresponding Tailwind utility classes.
 */
const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

/**
 * Rounded variant class mapping.
 * Maps rounded prop values to their corresponding Tailwind utility classes.
 */
const roundedClasses = {
  none: 'rounded-none',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

/**
 * Card — A flexible content container for grouping related information.
 *
 * Supports optional image, title/subtitle, body content, and footer.
 * Can be made hoverable (lift effect) or clickable (acts as a button).
 */
const Card = forwardRef(
  (
    {
      title,
      subtitle,
      image,
      imageAlt = '',
      footer,
      onClick,
      hoverable = false,
      bordered = false,
      shadow = 'md',
      rounded = 'lg',
      className = '',
      children,
      ...rest
    },
    ref
  ) => {
    // Determine if the card acts as a clickable element
    const isClickable = typeof onClick === 'function';

    /**
     * Handle keyboard events for clickable cards.
     * Triggers onClick on Enter or Space key press.
     */
    const handleKeyDown = useCallback(
      (event) => {
        if (!isClickable) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(event);
        }
      },
      [isClickable, onClick]
    );

    // Build the class list based on props
    const cardClasses = [
      // Base styles
      'bg-white dark:bg-slate-800 overflow-hidden',
      // Shadow variant
      shadowClasses[shadow] || shadowClasses.md,
      // Rounded variant
      roundedClasses[rounded] || roundedClasses.lg,
      // Border
      bordered ? 'border border-slate-200 dark:border-slate-700' : '',
      // Hoverable effect — subtle lift on hover
      hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200' : '',
      // Clickable styles
      isClickable ? 'cursor-pointer' : '',
      // Custom classes from consumer
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Accessibility props for clickable cards
    const interactiveProps = isClickable
      ? {
          role: 'button',
          tabIndex: 0,
          onClick,
          onKeyDown: handleKeyDown,
        }
      : {};

    return (
      <div
        ref={ref}
        className={cardClasses}
        data-testid="card"
        {...interactiveProps}
        {...rest}
      >
        {/* Card image — rendered at the top when provided */}
        {image && (
          <div className="card-image">
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Card header — title and/or subtitle */}
        {(title || subtitle) && (
          <div className="px-6 pt-4">
            {title && (
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        )}

        {/* Card body — children content */}
        {children && <div className="px-6 py-4">{children}</div>}

        {/* Card footer — rendered at the bottom when provided */}
        {footer && (
          <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

Card.propTypes = {
  /** Card title rendered as an h3 heading */
  title: PropTypes.string,
  /** Subtitle text rendered below the title in muted color */
  subtitle: PropTypes.string,
  /** Image URL displayed at the top of the card */
  image: PropTypes.string,
  /** Alt text for the card image (required for accessibility when image is set) */
  imageAlt: PropTypes.string,
  /** Content rendered in the footer section */
  footer: PropTypes.node,
  /** Click handler — makes the card act as a button with keyboard support */
  onClick: PropTypes.func,
  /** Adds a hover lift effect with shadow transition */
  hoverable: PropTypes.bool,
  /** Adds a visible border around the card */
  bordered: PropTypes.bool,
  /** Controls the card shadow depth */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  /** Controls the card border-radius */
  rounded: PropTypes.oneOf(['none', 'md', 'lg', 'xl']),
  /** Additional CSS classes to apply to the card root element */
  className: PropTypes.string,
  /** Card body content */
  children: PropTypes.node,
};

Card.defaultProps = {
  title: undefined,
  subtitle: undefined,
  image: undefined,
  imageAlt: '',
  footer: undefined,
  onClick: undefined,
  hoverable: false,
  bordered: false,
  shadow: 'md',
  rounded: 'lg',
  className: '',
  children: undefined,
};

export default Card;
