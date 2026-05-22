import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Badge from './Badge';

// ─── Rendering ──────────────────────────────────────────────────────────────

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByRole('status')).toHaveTextContent('New');
  });

  // ─── Solid variant classes ──────────────────────────────────────────────────

  describe('solid variant classes', () => {
    it.each([
      ['primary', 'bg-primary-600'],
      ['success', 'bg-success-600'],
      ['warning', 'bg-warning-600'],
      ['danger', 'bg-danger-600'],
      ['info', 'bg-info-600'],
      ['slate', 'bg-slate-600'],
    ])('applies solid variant classes for %s', (color, expectedClass) => {
      render(<Badge variant="solid" color={color}>{color}</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain(expectedClass);
      expect(badge.className).toContain('text-white');
    });
  });

  // ─── Outline variant classes ────────────────────────────────────────────────

  describe('outline variant classes', () => {
    it.each([
      ['primary', 'border-primary-600', 'text-primary-600'],
      ['success', 'border-success-600', 'text-success-600'],
      ['warning', 'border-warning-600', 'text-warning-600'],
      ['danger', 'border-danger-600', 'text-danger-600'],
      ['info', 'border-info-600', 'text-info-600'],
      ['slate', 'border-slate-600', 'text-slate-600'],
    ])('applies outline variant classes for %s', (color, borderClass, textClass) => {
      render(<Badge variant="outline" color={color}>{color}</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain('border');
      expect(badge.className).toContain(borderClass);
      expect(badge.className).toContain(textClass);
    });
  });

  // ─── Subtle variant classes ─────────────────────────────────────────────────

  describe('subtle variant classes', () => {
    it.each([
      ['primary', 'bg-primary-100', 'text-primary-700'],
      ['success', 'bg-success-100', 'text-success-700'],
      ['warning', 'bg-warning-100', 'text-warning-700'],
      ['danger', 'bg-danger-100', 'text-danger-700'],
      ['info', 'bg-info-100', 'text-info-700'],
      ['slate', 'bg-slate-100', 'text-slate-700'],
    ])('applies subtle variant classes for %s', (color, bgClass, textClass) => {
      render(<Badge variant="subtle" color={color}>{color}</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain(bgClass);
      expect(badge.className).toContain(textClass);
    });
  });

  // ─── Size classes ──────────────────────────────────────────────────────────

  describe('size classes', () => {
    it('applies sm size classes', () => {
      render(<Badge size="sm">Small</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain('px-2');
      expect(badge.className).toContain('py-0.5');
      expect(badge.className).toContain('text-xs');
    });

    it('applies md size classes', () => {
      render(<Badge size="md">Medium</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain('px-2.5');
      expect(badge.className).toContain('py-1');
      expect(badge.className).toContain('text-sm');
    });

    it('applies lg size classes', () => {
      render(<Badge size="lg">Large</Badge>);
      const badge = screen.getByRole('status');
      expect(badge.className).toContain('px-3');
      expect(badge.className).toContain('py-1.5');
      expect(badge.className).toContain('text-base');
    });
  });

  // ─── Dot indicator ─────────────────────────────────────────────────────────

  it('renders dot indicator when dot=true', () => {
    render(<Badge dot>Active</Badge>);
    const dot = screen.getByTestId('badge-dot');
    expect(dot).toBeInTheDocument();
    expect(dot.className).toContain('rounded-full');
  });

  it('does not render dot indicator when dot=false', () => {
    render(<Badge>No Dot</Badge>);
    expect(screen.queryByTestId('badge-dot')).not.toBeInTheDocument();
  });

  // ─── Removable ─────────────────────────────────────────────────────────────

  it('renders remove button when removable=true', () => {
    render(<Badge removable>Tag</Badge>);
    expect(screen.getByTestId('badge-remove')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', () => {
    const handleRemove = jest.fn();
    render(
      <Badge removable onRemove={handleRemove}>
        Tag
      </Badge>
    );
    fireEvent.click(screen.getByTestId('badge-remove'));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('hides remove button when removable=false', () => {
    render(<Badge>Tag</Badge>);
    expect(screen.queryByTestId('badge-remove')).not.toBeInTheDocument();
  });

  // ─── Defaults ──────────────────────────────────────────────────────────────

  it('default variant is solid', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByRole('status');
    expect(badge.className).toContain('bg-primary-600');
    expect(badge.className).toContain('text-white');
  });

  it('default color is primary', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByRole('status');
    expect(badge.className).toContain('bg-primary-600');
  });

  it('default size is md', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByRole('status');
    expect(badge.className).toContain('px-2.5');
    expect(badge.className).toContain('py-1');
    expect(badge.className).toContain('text-sm');
  });

  // ─── Base layout classes ────────────────────────────────────────────────────

  it('always applies base layout classes', () => {
    render(<Badge>Base</Badge>);
    const badge = screen.getByRole('status');
    expect(badge.className).toContain('inline-flex');
    expect(badge.className).toContain('items-center');
    expect(badge.className).toContain('gap-1');
    expect(badge.className).toContain('rounded-full');
    expect(badge.className).toContain('font-medium');
  });

  // ─── Custom className ──────────────────────────────────────────────────────

  it('merges custom className', () => {
    render(<Badge className="my-custom">Custom</Badge>);
    expect(screen.getByRole('status').className).toContain('my-custom');
  });

  // ─── Accessibility ─────────────────────────────────────────────────────────

  it('has role="status"', () => {
    render(<Badge>Accessible</Badge>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('dot has aria-hidden="true"', () => {
    render(<Badge dot>Dot</Badge>);
    expect(screen.getByTestId('badge-dot')).toHaveAttribute('aria-hidden', 'true');
  });

  it('remove button has accessible label', () => {
    render(<Badge removable>Tag</Badge>);
    expect(screen.getByLabelText('Remove')).toBeInTheDocument();
  });
});
