import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

// Mock createPortal so content renders inline instead of into document.body
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

// Shared default props to reduce boilerplate
const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  title: 'Test Modal',
};

const renderModal = (overrides = {}, children = 'Modal body text') =>
  render(
    <Modal {...defaultProps} {...overrides}>
      {children}
    </Modal>,
  );

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────

  it('renders when isOpen is true', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal body text')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title', () => {
    renderModal({ title: 'My Title' });
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderModal({}, <span data-testid="child">Hello</span>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderModal({ footer: <button>Save</button> });
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
  });

  // ── Close button ───────────────────────────────────────────────────

  it('renders close button by default', () => {
    renderModal();
    expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    renderModal({ showCloseButton: false });
    expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ── Backdrop close ─────────────────────────────────────────────────

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when closeOnBackdrop is false', () => {
    const onClose = jest.fn();
    renderModal({ onClose, closeOnBackdrop: false });

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when modal panel is clicked (not backdrop)', () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    fireEvent.click(screen.getByTestId('modal-panel'));
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Escape key close ──────────────────────────────────────────────

  it('calls onClose when Escape is pressed', () => {
    const onClose = jest.fn();
    renderModal({ onClose });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when closeOnEsc is false', () => {
    const onClose = jest.fn();
    renderModal({ onClose, closeOnEsc: false });

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── Accessibility ──────────────────────────────────────────────────

  it('has aria-modal attribute', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has role dialog', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-labelledby pointing to the title', () => {
    renderModal({ title: 'Accessible Title' });
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(screen.getByText('Accessible Title')).toHaveAttribute(
      'id',
      'modal-title',
    );
  });

  it('close button has an accessible label', () => {
    renderModal();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  // ── Size classes ───────────────────────────────────────────────────

  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
    ['xl', 'max-w-xl'],
  ])('applies correct size class for size="%s"', (size, expectedClass) => {
    renderModal({ size });
    expect(screen.getByTestId('modal-panel')).toHaveClass(expectedClass);
  });

  it('defaults to md size when no size is provided', () => {
    renderModal();
    expect(screen.getByTestId('modal-panel')).toHaveClass('max-w-md');
  });

  // ── Custom className ───────────────────────────────────────────────

  it('applies custom className to the modal panel', () => {
    renderModal({ className: 'my-custom-class' });
    expect(screen.getByTestId('modal-panel')).toHaveClass('my-custom-class');
  });

  // ── Body scroll lock ──────────────────────────────────────────────

  it('sets overflow hidden on body when open', () => {
    renderModal();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when closed', () => {
    const { unmount } = renderModal();
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
