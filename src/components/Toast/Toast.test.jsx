import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Toast from './Toast';
import ToastContainer from './ToastContainer';

// Mock createPortal so ToastContainer renders inline instead of into document.body
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

// =====================================================================
// Toast component tests
// =====================================================================
describe('Toast', () => {
  const defaultProps = {
    id: 'test-1',
    type: 'info',
    message: 'Test notification message',
    onDismiss: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- Rendering ----

  it('renders the toast message', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Test notification message')).toBeInTheDocument();
  });

  it('has role="alert"', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('has aria-live="polite"', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
  });

  // ---- Type styling ----

  it('applies success styling', () => {
    render(<Toast {...defaultProps} type="success" />);
    const toast = screen.getByTestId('toast-success');
    expect(toast.className).toContain('bg-success-50');
    expect(toast.className).toContain('border-success-500');
  });

  it('applies error styling', () => {
    render(<Toast {...defaultProps} type="error" />);
    const toast = screen.getByTestId('toast-error');
    expect(toast.className).toContain('bg-danger-50');
    expect(toast.className).toContain('border-danger-500');
  });

  it('applies warning styling', () => {
    render(<Toast {...defaultProps} type="warning" />);
    const toast = screen.getByTestId('toast-warning');
    expect(toast.className).toContain('bg-warning-50');
    expect(toast.className).toContain('border-warning-500');
  });

  it('applies info styling', () => {
    render(<Toast {...defaultProps} type="info" />);
    const toast = screen.getByTestId('toast-info');
    expect(toast.className).toContain('bg-info-50');
    expect(toast.className).toContain('border-info-500');
  });

  // ---- Icons ----

  it('renders an icon for each type', () => {
    const types = ['success', 'error', 'warning', 'info'];
    types.forEach((type) => {
      const { unmount } = render(<Toast {...defaultProps} type={type} />);
      expect(screen.getByTestId('toast-icon')).toBeInTheDocument();
      unmount();
    });
  });

  // ---- Dismiss button ----

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = jest.fn();
    render(<Toast {...defaultProps} onDismiss={onDismiss} />);

    const dismissBtn = screen.getByTestId('toast-dismiss');
    fireEvent.click(dismissBtn);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith('test-1');
  });

  it('renders dismiss button when dismissible is true (default)', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByTestId('toast-dismiss')).toBeInTheDocument();
  });

  it('hides dismiss button when dismissible is false', () => {
    render(<Toast {...defaultProps} dismissible={false} />);
    expect(screen.queryByTestId('toast-dismiss')).not.toBeInTheDocument();
  });

  it('dismiss button has accessible label', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
  });

  // ---- Auto-dismiss ----

  it('auto-dismisses after the specified duration', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();

    render(<Toast {...defaultProps} duration={3000} onDismiss={onDismiss} />);

    // Not called immediately
    expect(onDismiss).not.toHaveBeenCalled();

    // Fast-forward past the duration
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith('test-1');

    jest.useRealTimers();
  });

  it('does not auto-dismiss when duration is 0', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();

    render(<Toast {...defaultProps} duration={0} onDismiss={onDismiss} />);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(onDismiss).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('clears timer on unmount to prevent memory leaks', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();

    const { unmount } = render(
      <Toast {...defaultProps} duration={3000} onDismiss={onDismiss} />,
    );

    // Unmount before timer fires
    unmount();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onDismiss).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  // ---- Defaults ----

  it('defaults to info type when type is not provided', () => {
    render(<Toast id="no-type" message="Fallback" onDismiss={jest.fn()} />);
    const toast = screen.getByTestId('toast-info');
    expect(toast).toBeInTheDocument();
  });
});

// =====================================================================
// ToastContainer component tests
// =====================================================================
describe('ToastContainer', () => {
  const sampleToasts = [
    { id: '1', type: 'success', message: 'First toast' },
    { id: '2', type: 'error', message: 'Second toast' },
  ];
  const removeToast = jest.fn();

  it('renders all toasts', () => {
    render(<ToastContainer toasts={sampleToasts} removeToast={removeToast} />);
    expect(screen.getByText('First toast')).toBeInTheDocument();
    expect(screen.getByText('Second toast')).toBeInTheDocument();
  });

  it('renders nothing when toasts array is empty', () => {
    const { container } = render(
      <ToastContainer toasts={[]} removeToast={removeToast} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('applies top-right position classes by default', () => {
    render(<ToastContainer toasts={sampleToasts} removeToast={removeToast} />);
    const container = screen.getByTestId('toast-container');
    expect(container.className).toContain('top-4');
    expect(container.className).toContain('right-4');
  });

  it('applies bottom-left position classes when specified', () => {
    render(
      <ToastContainer
        toasts={sampleToasts}
        removeToast={removeToast}
        position="bottom-left"
      />,
    );
    const container = screen.getByTestId('toast-container');
    expect(container.className).toContain('bottom-4');
    expect(container.className).toContain('left-4');
  });

  it('applies top-center position classes when specified', () => {
    render(
      <ToastContainer
        toasts={sampleToasts}
        removeToast={removeToast}
        position="top-center"
      />,
    );
    const container = screen.getByTestId('toast-container');
    expect(container.className).toContain('top-4');
    expect(container.className).toContain('left-1/2');
    expect(container.className).toContain('-translate-x-1/2');
  });

  it('has z-[9999] for stacking context', () => {
    render(<ToastContainer toasts={sampleToasts} removeToast={removeToast} />);
    const container = screen.getByTestId('toast-container');
    expect(container.className).toContain('z-[9999]');
  });

  it('uses flex column layout with gap', () => {
    render(<ToastContainer toasts={sampleToasts} removeToast={removeToast} />);
    const container = screen.getByTestId('toast-container');
    expect(container.className).toContain('flex');
    expect(container.className).toContain('flex-col');
    expect(container.className).toContain('gap-3');
  });

  it('calls removeToast when a toast dismiss button is clicked', () => {
    render(<ToastContainer toasts={sampleToasts} removeToast={removeToast} />);
    const dismissButtons = screen.getAllByTestId('toast-dismiss');
    fireEvent.click(dismissButtons[0]);
    expect(removeToast).toHaveBeenCalledWith('1');
  });
});
