import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  // ---- Basic rendering ----

  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    // Label should be associated via htmlFor
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id');
    const id = input.getAttribute('id');
    expect(screen.getByText('Email').closest('label')).toHaveAttribute(
      'for',
      id
    );
  });

  it('renders placeholder text', () => {
    render(<Input placeholder="Type here…" />);
    expect(screen.getByPlaceholderText('Type here…')).toBeInTheDocument();
  });

  // ---- Interaction ----

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // ---- Error state ----

  it('shows error message when error prop is set', () => {
    render(<Input error="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input error="Invalid" />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('sets aria-describedby pointing to the error element', () => {
    render(<Input error="Bad value" id="my-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'my-input-error');
    // The error element should carry that id
    expect(screen.getByText('Bad value')).toHaveAttribute(
      'id',
      'my-input-error'
    );
  });

  // ---- Helper text ----

  it('shows helper text when provided', () => {
    render(<Input helperText="Hint message" />);
    expect(screen.getByText('Hint message')).toBeInTheDocument();
  });

  it('hides helper text when error is shown', () => {
    render(<Input helperText="Hint" error="Error!" />);
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  // ---- Disabled ----

  it('applies disabled attribute and styling', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input.className).toContain('cursor-not-allowed');
    expect(input.className).toContain('opacity-50');
    expect(input.className).toContain('bg-slate-50');
  });

  // ---- Sizes ----

  it.each([
    ['sm', 'py-1.5', 'text-sm'],
    ['md', 'py-2', 'text-base'],
    ['lg', 'py-3', 'text-lg'],
  ])('applies correct classes for size="%s"', (size, pyClass, textClass) => {
    render(<Input size={size} />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain(pyClass);
    expect(input.className).toContain(textClass);
  });

  // ---- Required ----

  it('shows required asterisk after the label', () => {
    render(<Input label="Name" required />);
    // The asterisk should be in the DOM
    expect(screen.getByText('*')).toBeInTheDocument();
    // The input itself should carry required + aria-required
    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  // ---- Icons ----

  it('renders left icon', () => {
    render(<Input leftIcon={<span>L</span>} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('renders right icon', () => {
    render(<Input rightIcon={<span>R</span>} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  // ---- Ref forwarding ----

  it('forwards ref to the underlying input element', () => {
    const ref = createRef();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // ---- Misc ----

  it('uses the provided id and name', () => {
    render(<Input id="custom-id" name="username" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('does not set aria-invalid when there is no error', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('applies additional className to the input', () => {
    render(<Input className="my-custom-class" />);
    expect(screen.getByRole('textbox').className).toContain('my-custom-class');
  });

  it('sets aria-describedby for helper text when no error', () => {
    render(<Input helperText="Some help" id="help-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'help-input-helper');
  });
});
