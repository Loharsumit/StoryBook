import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

// ─── Rendering ──────────────────────────────────────────────────────────────

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders as a <button> element with default type "button"', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  // ─── Click behaviour ───────────────────────────────────────────────────────

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Press</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Press
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} loading>
        Press
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ─── Loading state ─────────────────────────────────────────────────────────

  it('renders loading spinner when loading=true', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
  });

  it('does not render loading spinner when loading=false', () => {
    render(<Button>Normal</Button>);
    expect(screen.queryByTestId('button-spinner')).not.toBeInTheDocument();
  });

  // ─── Variant classes ───────────────────────────────────────────────────────

  describe('variant classes', () => {
    it('applies primary variant classes', () => {
      render(<Button variant="primary">Primary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-primary-600');
      expect(btn.className).toContain('text-white');
    });

    it('applies secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-slate-600');
      expect(btn.className).toContain('text-white');
    });

    it('applies outline variant classes', () => {
      render(<Button variant="outline">Outline</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('border-2');
      expect(btn.className).toContain('border-primary-600');
      expect(btn.className).toContain('text-primary-600');
    });

    it('applies ghost variant classes', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('text-primary-600');
      expect(btn.className).not.toContain('bg-primary-600');
    });

    it('applies danger variant classes', () => {
      render(<Button variant="danger">Danger</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('bg-danger-600');
      expect(btn.className).toContain('text-white');
    });
  });

  // ─── Size classes ──────────────────────────────────────────────────────────

  describe('size classes', () => {
    it('applies sm size classes', () => {
      render(<Button size="sm">Small</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('px-3');
      expect(btn.className).toContain('py-1.5');
      expect(btn.className).toContain('text-sm');
    });

    it('applies md size classes', () => {
      render(<Button size="md">Medium</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('px-4');
      expect(btn.className).toContain('py-2');
      expect(btn.className).toContain('text-base');
    });

    it('applies lg size classes', () => {
      render(<Button size="lg">Large</Button>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('px-6');
      expect(btn.className).toContain('py-3');
      expect(btn.className).toContain('text-lg');
    });
  });

  // ─── fullWidth ─────────────────────────────────────────────────────────────

  it('applies w-full class when fullWidth is true', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button').className).toContain('w-full');
  });

  it('does not apply w-full class when fullWidth is false', () => {
    render(<Button>Narrow</Button>);
    expect(screen.getByRole('button').className).not.toContain('w-full');
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  it('has aria-disabled="true" when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has aria-disabled="false" when not disabled', () => {
    render(<Button>Enabled</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');
  });

  it('has aria-busy="true" when loading', () => {
    render(<Button loading>Busy</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('has aria-busy="false" when not loading', () => {
    render(<Button>Idle</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'false');
  });

  // ─── Icons ─────────────────────────────────────────────────────────────────

  it('renders leftIcon', () => {
    render(<Button leftIcon={<span>⬅</span>}>Left</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders rightIcon', () => {
    render(<Button rightIcon={<span>➡</span>}>Right</Button>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('hides leftIcon when loading', () => {
    render(<Button loading leftIcon={<span>⬅</span>}>Loading</Button>);
    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
  });

  // ─── Ref forwarding ───────────────────────────────────────────────────────

  it('forwards ref to the underlying button element', () => {
    const ref = createRef();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  // ─── Custom className ──────────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Button className="my-custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('my-custom-class');
  });

  // ─── Type attribute ────────────────────────────────────────────────────────

  it('accepts type="submit"', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  // ─── Disabled state styling ────────────────────────────────────────────────

  it('applies opacity-50 and cursor-not-allowed when disabled', () => {
    render(<Button disabled>Styled Disabled</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('opacity-50');
    expect(btn.className).toContain('cursor-not-allowed');
  });
});
