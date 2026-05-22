import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';

describe('Card', () => {
  // ── Rendering ──────────────────────────────────────────────────────────

  it('renders children content', () => {
    render(<Card>Hello World</Card>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders title and subtitle', () => {
    render(<Card title="My Title" subtitle="My Subtitle" />);
    const heading = screen.getByRole('heading', { level: 3, name: 'My Title' });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('renders title as h3 element', () => {
    render(<Card title="Heading Test" />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Heading Test');
  });

  it('renders subtitle with muted text color', () => {
    render(<Card subtitle="Muted text" />);
    const subtitle = screen.getByText('Muted text');
    expect(subtitle.tagName).toBe('P');
    expect(subtitle).toHaveClass('text-slate-500');
  });

  it('does not render header section when no title or subtitle', () => {
    const { container } = render(<Card>Content only</Card>);
    // The header wrapper (px-6 pt-4) should not be present
    expect(container.querySelector('.pt-4')).not.toBeInTheDocument();
  });

  // ── Image ──────────────────────────────────────────────────────────────

  it('renders image with correct src and alt text', () => {
    render(<Card image="/test-image.jpg" imageAlt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-image.jpg');
  });

  it('does not render image section when no image provided', () => {
    const { container } = render(<Card title="No Image" />);
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders image with empty alt when imageAlt is not provided', () => {
    render(<Card image="/photo.png" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', '');
  });

  // ── Footer ─────────────────────────────────────────────────────────────

  it('renders footer content', () => {
    render(<Card footer={<span>Footer Content</span>} />);
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('does not render footer section when no footer provided', () => {
    const { container } = render(<Card>Body</Card>);
    expect(container.querySelector('.bg-slate-50')).not.toBeInTheDocument();
  });

  // ── Click interaction ──────────────────────────────────────────────────

  it('calls onClick when the card is clicked', async () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Click me</Card>);
    const card = screen.getByTestId('card');
    await userEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets role="button" and tabIndex=0 when onClick is provided', () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('applies cursor-pointer class when onClick is provided', () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('does not set role or tabIndex when onClick is not provided', () => {
    render(<Card>Not clickable</Card>);
    const card = screen.getByTestId('card');
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');
  });

  // ── Keyboard interaction ───────────────────────────────────────────────

  it('calls onClick on Enter key press when clickable', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Keyboard</Card>);
    const card = screen.getByTestId('card');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Space key press when clickable', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Keyboard</Card>);
    const card = screen.getByTestId('card');
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick on other key presses', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Keyboard</Card>);
    const card = screen.getByTestId('card');
    fireEvent.keyDown(card, { key: 'Tab' });
    fireEvent.keyDown(card, { key: 'Escape' });
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ── Hoverable ──────────────────────────────────────────────────────────

  it('applies hover effect classes when hoverable is true', () => {
    render(<Card hoverable>Hover card</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('hover:-translate-y-1');
    expect(card).toHaveClass('transition-all');
  });

  it('does not apply hover classes when hoverable is false', () => {
    render(<Card>No hover</Card>);
    const card = screen.getByTestId('card');
    expect(card).not.toHaveClass('hover:shadow-lg');
    expect(card).not.toHaveClass('hover:-translate-y-1');
  });

  // ── Bordered ───────────────────────────────────────────────────────────

  it('applies border classes when bordered is true', () => {
    render(<Card bordered>Bordered</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-slate-200');
  });

  it('does not apply border classes when bordered is false', () => {
    render(<Card>No border</Card>);
    const card = screen.getByTestId('card');
    expect(card).not.toHaveClass('border-slate-200');
  });

  // ── Shadow variants ────────────────────────────────────────────────────

  it.each([
    ['none', 'shadow-none'],
    ['sm', 'shadow-sm'],
    ['md', 'shadow-md'],
    ['lg', 'shadow-lg'],
  ])('applies shadow-%s class correctly', (variant, expectedClass) => {
    render(<Card shadow={variant}>Shadow</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass(expectedClass);
  });

  it('defaults to shadow-md when shadow prop is not provided', () => {
    render(<Card>Default shadow</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('shadow-md');
  });

  // ── Rounded variants ──────────────────────────────────────────────────

  it.each([
    ['none', 'rounded-none'],
    ['md', 'rounded-md'],
    ['lg', 'rounded-lg'],
    ['xl', 'rounded-xl'],
  ])('applies rounded-%s class correctly', (variant, expectedClass) => {
    render(<Card rounded={variant}>Rounded</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass(expectedClass);
  });

  it('defaults to rounded-lg when rounded prop is not provided', () => {
    render(<Card>Default rounded</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('rounded-lg');
  });

  // ── Custom className ──────────────────────────────────────────────────

  it('merges custom className into the card element', () => {
    render(<Card className="my-custom-class">Custom</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('my-custom-class');
    // Should still retain base classes
    expect(card).toHaveClass('bg-white');
  });

  // ── Ref forwarding ────────────────────────────────────────────────────

  it('forwards ref to the root div element', () => {
    const ref = React.createRef();
    render(<Card ref={ref}>Ref test</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-testid', 'card');
  });

  // ── Snapshot / structure ───────────────────────────────────────────────

  it('renders a complete card with all sections', () => {
    render(
      <Card
        image="/hero.jpg"
        imageAlt="Hero"
        title="Full Card"
        subtitle="All sections present"
        footer={<button>Action</button>}
        bordered
        hoverable
      >
        <p>Body content</p>
      </Card>
    );

    expect(screen.getByAltText('Hero')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Full Card' })).toBeInTheDocument();
    expect(screen.getByText('All sections present')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
