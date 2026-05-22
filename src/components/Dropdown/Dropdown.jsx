import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Dropdown - A select dropdown menu with search, keyboard navigation,
 * and full ARIA accessibility support.
 */
const Dropdown = forwardRef(function Dropdown(
  {
    options = [],
    value,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    searchable = false,
    label,
    error,
    helperText,
    className = '',
    id,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listboxRef = useRef(null);
  const optionRefs = useRef([]);

  // Merge forwarded ref with internal container ref
  const mergedRef = useCallback(
    (node) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  // Generate a stable unique ID for ARIA attributes
  const dropdownId = id || 'dropdown';
  const listboxId = `${dropdownId}-listbox`;
  const labelId = `${dropdownId}-label`;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable]);

  // Find the currently selected option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll the focused option into view
  useEffect(() => {
    if (
      focusedIndex >= 0 &&
      optionRefs.current[focusedIndex] &&
      typeof optionRefs.current[focusedIndex].scrollIntoView === 'function'
    ) {
      optionRefs.current[focusedIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  /** Toggle the dropdown open/closed */
  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    setIsOpen((prev) => {
      if (prev) {
        // Closing
        setSearchQuery('');
        setFocusedIndex(-1);
      } else {
        // Opening — set focus to selected option if one exists
        const selectedIdx = filteredOptions.findIndex(
          (opt) => opt.value === value
        );
        setFocusedIndex(selectedIdx >= 0 ? selectedIdx : -1);
      }
      return !prev;
    });
  }, [disabled, filteredOptions, value]);

  /** Select an option and close the dropdown */
  const selectOption = useCallback(
    (option) => {
      if (onChange) {
        onChange(option.value);
      }
      setIsOpen(false);
      setSearchQuery('');
      setFocusedIndex(-1);
      // Return focus to trigger
      triggerRef.current?.focus();
    },
    [onChange]
  );

  /** Handle keyboard navigation */
  const handleKeyDown = useCallback(
    (event) => {
      if (disabled) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;
        }
        case 'Enter': {
          event.preventDefault();
          if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            selectOption(filteredOptions[focusedIndex]);
          } else if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
        }
        case ' ': {
          // Space opens/closes if not in search input
          if (!searchable || document.activeElement !== searchInputRef.current) {
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
              setFocusedIndex(0);
            }
          }
          break;
        }
        default:
          break;
      }
    },
    [disabled, isOpen, focusedIndex, filteredOptions, selectOption, searchable]
  );

  /** Handle search input changes */
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setFocusedIndex(0);
  };

  // ── Styles ──────────────────────────────────────────────────────────────

  const triggerClasses = [
    'flex items-center justify-between w-full px-4 py-2.5',
    'bg-white border rounded-lg text-left',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500',
    error
      ? 'border-danger-500 focus:ring-danger-500/30 focus:border-danger-500'
      : 'border-slate-300',
    disabled
      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
      : 'cursor-pointer hover:border-slate-400',
  ].join(' ');

  const panelClasses = [
    'absolute z-50 w-full mt-1',
    'bg-white rounded-lg shadow-lg border border-slate-200',
    'max-h-60 overflow-y-auto',
    'animate-fade-in',
  ].join(' ');

  return (
    <div
      ref={mergedRef}
      className={`relative inline-block w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Label */}
      {label && (
        <label
          id={labelId}
          htmlFor={dropdownId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={dropdownId}
        className={triggerClasses}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? labelId : undefined}
        disabled={disabled}
        data-testid="dropdown-trigger"
      >
        <span
          className={
            selectedOption ? 'text-slate-900' : 'text-slate-400'
          }
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Chevron Icon */}
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={panelClasses} data-testid="dropdown-panel">
          {/* Search Input */}
          {searchable && (
            <div className="sticky top-0 bg-white p-2 border-b border-slate-200">
              <input
                ref={searchInputRef}
                type="text"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search options"
                data-testid="dropdown-search"
              />
            </div>
          )}

          {/* Options List */}
          <ul
            ref={listboxRef}
            role="listbox"
            id={listboxId}
            aria-labelledby={label ? labelId : undefined}
            className="py-1"
            data-testid="dropdown-listbox"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-2.5 text-sm text-slate-400 text-center">
                No options found
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                const optionClasses = [
                  'flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer',
                  'transition-colors duration-100',
                  isSelected
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-slate-700',
                  isFocused && !isSelected
                    ? 'bg-slate-100 ring-2 ring-inset ring-primary-500/20'
                    : '',
                  isFocused && isSelected
                    ? 'ring-2 ring-inset ring-primary-500/20'
                    : '',
                  !isSelected && !isFocused ? 'hover:bg-slate-50' : '',
                ].join(' ');

                return (
                  <li
                    key={option.value}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    role="option"
                    aria-selected={isSelected}
                    className={optionClasses}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    data-testid={`dropdown-option-${option.value}`}
                  >
                    <span>{option.label}</span>

                    {/* Checkmark for selected option */}
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-primary-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p
          className={`mt-1.5 text-sm ${
            error ? 'text-danger-500' : 'text-slate-500'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  /** Array of options to display */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  /** Currently selected value */
  value: PropTypes.string,
  /** Callback when selection changes — receives the selected value */
  onChange: PropTypes.func,
  /** Placeholder text when no value is selected */
  placeholder: PropTypes.string,
  /** Whether the dropdown is disabled */
  disabled: PropTypes.bool,
  /** Enable search/filter input inside the dropdown panel */
  searchable: PropTypes.bool,
  /** Label displayed above the dropdown */
  label: PropTypes.string,
  /** Error message — also applies error styling to the trigger */
  error: PropTypes.string,
  /** Helper text displayed below the dropdown */
  helperText: PropTypes.string,
  /** Additional CSS classes for the container */
  className: PropTypes.string,
  /** HTML id for the trigger button */
  id: PropTypes.string,
};

Dropdown.defaultProps = {
  options: [],
  value: undefined,
  onChange: undefined,
  placeholder: 'Select an option',
  disabled: false,
  searchable: false,
  label: undefined,
  error: undefined,
  helperText: undefined,
  className: '',
  id: undefined,
};

export default Dropdown;
