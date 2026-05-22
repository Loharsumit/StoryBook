import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Tooltip from './Tooltip';

// Helper: the trigger element used in most tests
const TriggerButton = () => <button>Hover me</button>;

describe('Tooltip', () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  it('renders children', () => {
    render(
      <Tooltip content="Tip">
        <TriggerButton />
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: /hover me/i })).toBeInTheDocument();
  });

  it('does not show tooltip by default', () => {
    render(
      <Tooltip content="Hidden tip">
        <TriggerButton />
      </Tooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  // ─── Show / Hide ───────────────────────────────────────────────────────────

  it('shows tooltip on mouse enter', () => {
    render(
      <Tooltip content="Visible tip">
        <TriggerButton />
      </Tooltip>
    );

    // The wrapper div is the first element with the relative class
    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Visible tip');
  });

  it('hides tooltip on mouse leave', () => {
    render(
      <Tooltip content="Disappearing tip">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(wrapper);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders tooltip content', () => {
    render(
      <Tooltip content="My content">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByRole('tooltip')).toHaveTextContent('My content');
  });

  // ─── Position classes ─────────────────────────────────────────────────────

  it('applies correct position classes for top', () => {
    render(
      <Tooltip content="Top" position="top">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('bottom-full');
    expect(tooltip.className).toContain('mb-2');
  });

  it('applies correct position classes for bottom', () => {
    render(
      <Tooltip content="Bottom" position="bottom">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('top-full');
    expect(tooltip.className).toContain('mt-2');
  });

  it('applies correct position classes for left', () => {
    render(
      <Tooltip content="Left" position="left">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('right-full');
    expect(tooltip.className).toContain('mr-2');
  });

  it('applies correct position classes for right', () => {
    render(
      <Tooltip content="Right" position="right">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('left-full');
    expect(tooltip.className).toContain('ml-2');
  });

  // ─── Arrow ────────────────────────────────────────────────────────────────

  it('shows arrow by default', () => {
    render(
      <Tooltip content="Arrow tip">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByTestId('tooltip-arrow')).toBeInTheDocument();
  });

  it('hides arrow when arrow=false', () => {
    render(
      <Tooltip content="No arrow" arrow={false}>
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    expect(screen.queryByTestId('tooltip-arrow')).not.toBeInTheDocument();
  });

  // ─── Accessibility ────────────────────────────────────────────────────────

  it('has role tooltip', () => {
    render(
      <Tooltip content="Accessible tip">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('has aria-describedby linking to tooltip', () => {
    render(
      <Tooltip content="Linked tip">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    const tooltip = screen.getByRole('tooltip');
    const tooltipId = tooltip.getAttribute('id');

    // The inner wrapper div should have aria-describedby matching tooltip id
    const triggerWrapper = screen.getByRole('button', { name: /hover me/i }).parentElement;
    expect(triggerWrapper).toHaveAttribute('aria-describedby', tooltipId);
  });

  it('does not set aria-describedby when tooltip is hidden', () => {
    render(
      <Tooltip content="Hidden">
        <TriggerButton />
      </Tooltip>
    );

    const triggerWrapper = screen.getByRole('button', { name: /hover me/i }).parentElement;
    expect(triggerWrapper).not.toHaveAttribute('aria-describedby');
  });

  // ─── Delay ────────────────────────────────────────────────────────────────

  describe('delay behaviour', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('delays showing tooltip when delay is set', () => {
      render(
        <Tooltip content="Delayed tip" delay={500}>
          <TriggerButton />
        </Tooltip>
      );

      const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
      fireEvent.mouseEnter(wrapper);

      // Tooltip should NOT be visible yet
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Advance timers by 499ms — still not visible
      act(() => {
        jest.advanceTimersByTime(499);
      });
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Advance to 500ms — now visible
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('cancels delayed tooltip when mouse leaves before delay completes', () => {
      render(
        <Tooltip content="Cancelled tip" delay={500}>
          <TriggerButton />
        </Tooltip>
      );

      const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
      fireEvent.mouseEnter(wrapper);

      // Advance only 200ms then leave
      act(() => {
        jest.advanceTimersByTime(200);
      });
      fireEvent.mouseLeave(wrapper);

      // Advance past the original delay
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Tooltip should never have appeared
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('shows tooltip immediately when delay is 0', () => {
      render(
        <Tooltip content="Instant tip" delay={0}>
          <TriggerButton />
        </Tooltip>
      );

      const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
      fireEvent.mouseEnter(wrapper);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // ─── Custom className ─────────────────────────────────────────────────────

  it('merges custom className onto tooltip', () => {
    render(
      <Tooltip content="Styled tip" className="my-custom-tooltip">
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByRole('tooltip').className).toContain('my-custom-tooltip');
  });

  // ─── Rich content ─────────────────────────────────────────────────────────

  it('renders rich JSX content inside tooltip', () => {
    render(
      <Tooltip content={<span data-testid="rich">Rich content</span>}>
        <TriggerButton />
      </Tooltip>
    );

    const wrapper = screen.getByRole('button', { name: /hover me/i }).closest('.relative');
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByTestId('rich')).toBeInTheDocument();
    expect(screen.getByTestId('rich')).toHaveTextContent('Rich content');
  });
});
