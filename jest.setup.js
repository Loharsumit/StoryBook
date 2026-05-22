import '@testing-library/jest-dom';

// JSDOM does not implement layout, so scrollHeight is always 0.
// We mock scrollHeight to return a default non-zero value (e.g., 100)
// so that components managing dynamic height-based transitions function in tests.
Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
  configurable: true,
  get() {
    return 100;
  },
});
