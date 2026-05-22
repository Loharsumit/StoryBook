import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Accordion from './Accordion';

// ─── Shared test data ───────────────────────────────────────────────────────

const defaultItems = [
  { id: '1', title: 'First Item', content: 'First content' },
  { id: '2', title: 'Second Item', content: 'Second content' },
  { id: '3', title: 'Third Item', content: 'Third content' },
];

const itemsWithDisabled = [
  { id: '1', title: 'Enabled Item', content: 'Enabled content' },
  { id: '2', title: 'Disabled Item', content: 'Disabled content', disabled: true },
  { id: '3', title: 'Another Item', content: 'Another content' },
];

// ─── Helper ─────────────────────────────────────────────────────────────────

/**
 * Returns the max-height inline style value of a panel element.
 */
const getPanelMaxHeight = (panelEl) => panelEl.style.maxHeight;

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Accordion', () => {
  // ── Rendering ───────────────────────────────────────────────────────────

  it('renders all accordion items', () => {
    render(<Accordion items={defaultItems} />);
    expect(screen.getByTestId('accordion-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item-3')).toBeInTheDocument();
  });

  it('renders item titles', () => {
    render(<Accordion items={defaultItems} />);
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
    expect(screen.getByText('Third Item')).toBeInTheDocument();
  });

  it('renders the accordion wrapper with correct classes', () => {
    render(<Accordion items={defaultItems} />);
    const wrapper = screen.getByTestId('accordion');
    expect(wrapper.className).toContain('border');
    expect(wrapper.className).toContain('rounded-lg');
    expect(wrapper.className).toContain('overflow-hidden');
  });

  it('merges custom className onto the wrapper', () => {
    render(<Accordion items={defaultItems} className="my-custom" />);
    expect(screen.getByTestId('accordion').className).toContain('my-custom');
  });

  // ── Expand / Collapse ─────────────────────────────────────────────────

  it('expands an item on click', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');
    const panel = screen.getByTestId('accordion-panel-1');

    // Initially collapsed
    expect(getPanelMaxHeight(panel)).toBe('0px');

    fireEvent.click(header);
    expect(getPanelMaxHeight(panel)).not.toBe('0px');
  });

  it('collapses an item on a second click', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');
    const panel = screen.getByTestId('accordion-panel-1');

    fireEvent.click(header); // expand
    expect(getPanelMaxHeight(panel)).not.toBe('0px');

    fireEvent.click(header); // collapse
    expect(getPanelMaxHeight(panel)).toBe('0px');
  });

  // ── Single-expand mode ────────────────────────────────────────────────

  it('in single mode, opening one item closes others', () => {
    render(<Accordion items={defaultItems} />);
    const header1 = screen.getByTestId('accordion-header-1');
    const header2 = screen.getByTestId('accordion-header-2');
    const panel1 = screen.getByTestId('accordion-panel-1');
    const panel2 = screen.getByTestId('accordion-panel-2');

    // Expand item 1
    fireEvent.click(header1);
    expect(getPanelMaxHeight(panel1)).not.toBe('0px');

    // Expand item 2 → item 1 should close
    fireEvent.click(header2);
    expect(getPanelMaxHeight(panel2)).not.toBe('0px');
    expect(getPanelMaxHeight(panel1)).toBe('0px');
  });

  // ── Multiple-expand mode ──────────────────────────────────────────────

  it('in multiple mode, multiple items can be open at once', () => {
    render(<Accordion items={defaultItems} allowMultiple />);
    const header1 = screen.getByTestId('accordion-header-1');
    const header2 = screen.getByTestId('accordion-header-2');
    const panel1 = screen.getByTestId('accordion-panel-1');
    const panel2 = screen.getByTestId('accordion-panel-2');

    fireEvent.click(header1);
    fireEvent.click(header2);

    expect(getPanelMaxHeight(panel1)).not.toBe('0px');
    expect(getPanelMaxHeight(panel2)).not.toBe('0px');
  });

  // ── Default expanded ──────────────────────────────────────────────────

  it('respects defaultExpanded prop', () => {
    render(<Accordion items={defaultItems} defaultExpanded={['2']} />);
    const panel1 = screen.getByTestId('accordion-panel-1');
    const panel2 = screen.getByTestId('accordion-panel-2');

    // Item 2 should be expanded by default
    expect(getPanelMaxHeight(panel2)).not.toBe('0px');
    // Item 1 should remain collapsed
    expect(getPanelMaxHeight(panel1)).toBe('0px');
  });

  it('supports multiple defaultExpanded ids', () => {
    render(<Accordion items={defaultItems} allowMultiple defaultExpanded={['1', '3']} />);
    const panel1 = screen.getByTestId('accordion-panel-1');
    const panel3 = screen.getByTestId('accordion-panel-3');

    expect(getPanelMaxHeight(panel1)).not.toBe('0px');
    expect(getPanelMaxHeight(panel3)).not.toBe('0px');
  });

  // ── Disabled items ────────────────────────────────────────────────────

  it('disabled item cannot be toggled', () => {
    render(<Accordion items={itemsWithDisabled} />);
    const header = screen.getByTestId('accordion-header-2');
    const panel = screen.getByTestId('accordion-panel-2');

    fireEvent.click(header);
    expect(getPanelMaxHeight(panel)).toBe('0px');
  });

  it('disabled item has opacity-50 class', () => {
    render(<Accordion items={itemsWithDisabled} />);
    const header = screen.getByTestId('accordion-header-2');
    expect(header.className).toContain('opacity-50');
  });

  it('disabled item has cursor-not-allowed class', () => {
    render(<Accordion items={itemsWithDisabled} />);
    const header = screen.getByTestId('accordion-header-2');
    expect(header.className).toContain('cursor-not-allowed');
  });

  it('disabled button element has disabled attribute', () => {
    render(<Accordion items={itemsWithDisabled} />);
    const header = screen.getByTestId('accordion-header-2');
    expect(header).toBeDisabled();
  });

  // ── Icon rotation ─────────────────────────────────────────────────────

  it('chevron icon has rotate-180 class when expanded', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');

    fireEvent.click(header);

    // The chevron SVG within the first item should have the rotate class
    const chevronContainer = screen.getByTestId('chevron-right-1');
    const svg = chevronContainer.querySelector('svg');
    expect(svg.className.baseVal || svg.getAttribute('class')).toContain('rotate-180');
  });

  it('chevron icon does not have rotate-180 when collapsed', () => {
    render(<Accordion items={defaultItems} />);
    const chevronContainer = screen.getByTestId('chevron-right-1');
    const svg = chevronContainer.querySelector('svg');
    expect(svg.className.baseVal || svg.getAttribute('class')).not.toContain('rotate-180');
  });

  // ── Icon position ─────────────────────────────────────────────────────

  it('iconPosition="right" places chevron after title (default)', () => {
    render(<Accordion items={defaultItems} />);
    expect(screen.getByTestId('chevron-right-1')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-left-1')).not.toBeInTheDocument();
  });

  it('iconPosition="left" places chevron before title', () => {
    render(<Accordion items={defaultItems} iconPosition="left" />);
    expect(screen.getByTestId('chevron-left-1')).toBeInTheDocument();
    expect(screen.queryByTestId('chevron-right-1')).not.toBeInTheDocument();
  });

  // ── Accessibility attributes ──────────────────────────────────────────

  it('header buttons have aria-expanded attribute', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');
    expect(header).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  it('header buttons have aria-controls linking to their panel', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');
    const controlsId = header.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();

    // The panel with the matching ID should exist
    const panel = document.getElementById(controlsId);
    expect(panel).toBeInTheDocument();
  });

  it('content panels have role="region"', () => {
    render(<Accordion items={defaultItems} />);
    const panel = screen.getByTestId('accordion-panel-1');
    expect(panel).toHaveAttribute('role', 'region');
  });

  it('panels have aria-labelledby referencing their header', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');
    const panel = screen.getByTestId('accordion-panel-1');

    expect(panel).toHaveAttribute('aria-labelledby', header.id);
  });

  it('header elements are <button> elements', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');
    expect(header.tagName).toBe('BUTTON');
  });

  // ── Content visibility ────────────────────────────────────────────────

  it('clicking header toggles content visibility via max-height', () => {
    render(<Accordion items={defaultItems} />);
    const header = screen.getByTestId('accordion-header-1');
    const panel = screen.getByTestId('accordion-panel-1');

    // Collapsed → max-height is 0px
    expect(getPanelMaxHeight(panel)).toBe('0px');

    // Expand
    fireEvent.click(header);
    expect(getPanelMaxHeight(panel)).not.toBe('0px');

    // Collapse again
    fireEvent.click(header);
    expect(getPanelMaxHeight(panel)).toBe('0px');
  });

  // ── Empty items ───────────────────────────────────────────────────────

  it('renders nothing when items array is empty', () => {
    render(<Accordion items={[]} />);
    const wrapper = screen.getByTestId('accordion');
    expect(wrapper.children.length).toBe(0);
  });
});
