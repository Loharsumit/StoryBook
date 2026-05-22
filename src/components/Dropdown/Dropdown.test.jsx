import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dropdown from './Dropdown';

// ── Helpers ────────────────────────────────────────────────────────────

const defaultOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

const renderDropdown = (props = {}) =>
  render(<Dropdown options={defaultOptions} {...props} />);

const openDropdown = () => {
  fireEvent.click(screen.getByTestId('dropdown-trigger'));
};

// ── Tests ──────────────────────────────────────────────────────────────

describe('Dropdown', () => {
  // ─── Rendering ───────────────────────────────────────────────────────

  it('renders with placeholder', () => {
    renderDropdown({ placeholder: 'Pick something' });
    expect(screen.getByText('Pick something')).toBeInTheDocument();
  });

  it('renders label', () => {
    renderDropdown({ label: 'My Label' });
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  it('shows selected value text', () => {
    renderDropdown({ value: '2' });
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('shows helper text when provided', () => {
    renderDropdown({ helperText: 'Pick wisely' });
    expect(screen.getByText('Pick wisely')).toBeInTheDocument();
  });

  // ─── Open / Close ───────────────────────────────────────────────────

  it('opens dropdown on click', () => {
    renderDropdown();
    openDropdown();
    expect(screen.getByTestId('dropdown-panel')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('closes dropdown on outside click', () => {
    const { container } = renderDropdown();
    openDropdown();
    expect(screen.getByTestId('dropdown-panel')).toBeInTheDocument();

    // Click outside — use mousedown because that's the event we listen to
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('dropdown-panel')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking trigger again', () => {
    renderDropdown();
    openDropdown();
    expect(screen.getByTestId('dropdown-panel')).toBeInTheDocument();

    // Click trigger again to close
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.queryByTestId('dropdown-panel')).not.toBeInTheDocument();
  });

  // ─── Selection ──────────────────────────────────────────────────────

  it('selects option and calls onChange', () => {
    const onChange = jest.fn();
    renderDropdown({ onChange });
    openDropdown();

    fireEvent.click(screen.getByTestId('dropdown-option-2'));
    expect(onChange).toHaveBeenCalledWith('2');
    // Panel should close after selection
    expect(screen.queryByTestId('dropdown-panel')).not.toBeInTheDocument();
  });

  it('displays checkmark on selected option', () => {
    renderDropdown({ value: '1' });
    openDropdown();

    const selectedOption = screen.getByTestId('dropdown-option-1');
    // The selected option should contain an SVG checkmark
    expect(selectedOption.querySelector('svg')).toBeInTheDocument();

    // Non-selected option should NOT have an SVG
    const otherOption = screen.getByTestId('dropdown-option-2');
    expect(otherOption.querySelector('svg')).not.toBeInTheDocument();
  });

  // ─── Search / Filter ───────────────────────────────────────────────

  it('filters options when searchable', () => {
    renderDropdown({ searchable: true });
    openDropdown();

    const searchInput = screen.getByTestId('dropdown-search');
    fireEvent.change(searchInput, { target: { value: 'Option 3' } });

    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  it('shows "No options found" when search yields no results', () => {
    renderDropdown({ searchable: true });
    openDropdown();

    const searchInput = screen.getByTestId('dropdown-search');
    fireEvent.change(searchInput, { target: { value: 'zzzzz' } });

    expect(screen.getByText('No options found')).toBeInTheDocument();
  });

  it('does not render search input when searchable is false', () => {
    renderDropdown({ searchable: false });
    openDropdown();
    expect(screen.queryByTestId('dropdown-search')).not.toBeInTheDocument();
  });

  // ─── Keyboard Navigation ────────────────────────────────────────────

  it('keyboard ArrowDown moves focus', () => {
    renderDropdown();
    const trigger = screen.getByTestId('dropdown-trigger');
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    // Dropdown should now be open
    expect(screen.getByTestId('dropdown-panel')).toBeInTheDocument();

    // First option should be focused (has ring class)
    const firstOption = screen.getByTestId('dropdown-option-1');
    expect(firstOption.className).toContain('ring-2');
  });

  it('keyboard ArrowDown and ArrowUp cycle through options', () => {
    renderDropdown();
    const trigger = screen.getByTestId('dropdown-trigger');

    // Open + focus first
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByTestId('dropdown-option-1').className).toContain('ring-2');

    // Move to second
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByTestId('dropdown-option-2').className).toContain('ring-2');
    // First should no longer have ring
    expect(screen.getByTestId('dropdown-option-1').className).not.toContain('ring-2');

    // Move back up
    fireEvent.keyDown(trigger, { key: 'ArrowUp' });
    expect(screen.getByTestId('dropdown-option-1').className).toContain('ring-2');
  });

  it('keyboard Enter selects option', () => {
    const onChange = jest.fn();
    renderDropdown({ onChange });
    const trigger = screen.getByTestId('dropdown-trigger');

    // Open and focus first option
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Select with Enter
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith('1');
    expect(screen.queryByTestId('dropdown-panel')).not.toBeInTheDocument();
  });

  it('keyboard Escape closes dropdown', () => {
    renderDropdown();
    openDropdown();
    expect(screen.getByTestId('dropdown-panel')).toBeInTheDocument();

    const trigger = screen.getByTestId('dropdown-trigger');
    fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(screen.queryByTestId('dropdown-panel')).not.toBeInTheDocument();
  });

  // ─── Disabled State ─────────────────────────────────────────────────

  it('disabled state prevents opening', () => {
    renderDropdown({ disabled: true });
    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(screen.queryByTestId('dropdown-panel')).not.toBeInTheDocument();
  });

  it('disabled trigger has correct attributes', () => {
    renderDropdown({ disabled: true });
    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger).toBeDisabled();
    expect(trigger.className).toContain('cursor-not-allowed');
  });

  // ─── Error State ────────────────────────────────────────────────────

  it('shows error styling', () => {
    renderDropdown({ error: 'Required field' });
    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger.className).toContain('border-danger-500');
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  // ─── ARIA Accessibility ─────────────────────────────────────────────

  it('has aria-expanded attribute', () => {
    renderDropdown();
    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    openDropdown();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('has aria-haspopup listbox', () => {
    renderDropdown();
    const trigger = screen.getByTestId('dropdown-trigger');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('has role listbox', () => {
    renderDropdown();
    openDropdown();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('options have role option', () => {
    renderDropdown();
    openDropdown();
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
  });

  it('selected option has aria-selected true', () => {
    renderDropdown({ value: '2' });
    openDropdown();
    const option = screen.getByTestId('dropdown-option-2');
    expect(option).toHaveAttribute('aria-selected', 'true');
  });

  it('non-selected options have aria-selected false', () => {
    renderDropdown({ value: '2' });
    openDropdown();
    const option1 = screen.getByTestId('dropdown-option-1');
    expect(option1).toHaveAttribute('aria-selected', 'false');
  });

  // ─── Edge Cases ─────────────────────────────────────────────────────

  it('renders with no options', () => {
    render(<Dropdown options={[]} />);
    openDropdown();
    expect(screen.getByText('No options found')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = renderDropdown({ className: 'my-custom-class' });
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('keyboard navigation does not go below last option', () => {
    renderDropdown();
    const trigger = screen.getByTestId('dropdown-trigger');

    // Open + focus first
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Move to second
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Move to third
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Try to go past last — should stay on third
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    expect(screen.getByTestId('dropdown-option-3').className).toContain('ring-2');
  });

  it('keyboard navigation does not go above first option', () => {
    renderDropdown();
    const trigger = screen.getByTestId('dropdown-trigger');

    // Open + focus first
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Try to go above first — should stay on first
    fireEvent.keyDown(trigger, { key: 'ArrowUp' });

    expect(screen.getByTestId('dropdown-option-1').className).toContain('ring-2');
  });
});
