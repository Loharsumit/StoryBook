import React, { useState } from 'react';
import {
  Button,
  Card,
  Modal,
  Input,
  Dropdown,
  Toast,
  ToastContainer,
  useToast,
  Pagination,
  Badge,
  Tooltip,
  Accordion,
} from './index';
import './App.css';

function App() {
  // Dynamic Storybook Redirect (checks if running locally or deployed)
  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const storybookUrl = isLocal
    ? 'http://localhost:6006'
    : 'https://story-book-docs.vercel.app'; // Replace with your live Storybook Vercel URL

  // Theme State
  const [darkMode, setDarkMode] = useState(true);

  // Synchronize document root class with theme state
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState('md');

  // Input State
  const [textValue, setTextValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errorValue, setErrorValue] = useState('');

  // Dropdown State
  const [selectedOption, setSelectedOption] = useState('');
  const dropdownOptions = [
    { value: 'react', label: 'React.js (Library)' },
    { value: 'vue', label: 'Vue.js (Framework)' },
    { value: 'svelte', label: 'Svelte.js (Compiler)' },
    { value: 'angular', label: 'Angular (Platform)' },
    { value: 'solid', label: 'Solid.js (Reactive)' },
  ];

  // Toast State
  const { toasts, addToast, removeToast } = useToast();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // Accordion Items
  const accordionItems = [
    {
      id: 'faq1',
      title: 'Is this component library production-ready?',
      content: 'Absolutely! Every component is rigorously styled with Tailwind CSS, features complete runtime PropType validation, passes strict Jest unit tests, and comes with exhaustive keyboard/screen-reader accessibility built right in.',
    },
    {
      id: 'faq2',
      title: 'How do I publish this library to npm?',
      content: 'Run "npm run build:lib" to trigger Vite\'s library mode build. It compiles code into standard CJS and ESM formats in the "dist/" folder. Then run "npm publish" to share it with the world.',
    },
    {
      id: 'faq3',
      title: 'Does it support Tailwind CSS v3 and v4?',
      content: 'Yes, it is fully optimized for Tailwind v3 out of the box and uses standard utility classes that transition seamlessly to newer versions of Tailwind.',
      disabled: false,
    },
    {
      id: 'faq4',
      title: 'Disabled accordion item demo',
      content: 'This accordion item is disabled and cannot be opened.',
      disabled: true,
    },
  ];

  const handleTriggerToast = (type, message) => {
    addToast({
      type,
      message,
      duration: 4000,
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} font-sans transition-colors duration-300`}>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} position="top-right" />

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-primary-500/20">
              AG
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Antigravity UI</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">React Component Library</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href={storybookUrl}
              target="_blank"
              rel="noreferrer"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              📚 Open Storybook
            </a>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              aria-label="Toggle Theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_left] dark:bg-grid-slate-400/[0.05]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <Badge variant="subtle" color="primary" size="lg" className="mb-4">
            v1.0.0 Stable Release
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
            A Premium Component Library
          </h2>
          <p className={`mt-4 max-w-2xl mx-auto text-lg sm:text-xl ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Beautiful, accessible, and lightweight React components crafted with Tailwind CSS, thoroughly tested, and fully customizable.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. BUTTONS */}
          <Card title="Button Component" subtitle="Multi-variant action button with states and sizing" hoverable bordered shadow="sm" className="h-full">
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sizes</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">States & Icons</h4>
                <div className="flex flex-wrap gap-2">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. FORMS & INPUTS */}
          <Card title="Input & Selection" subtitle="Accessible text input validation and select dropdown" hoverable bordered shadow="sm" className="h-full">
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Name (Required)"
                  placeholder="Shri Vardhan"
                  required
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  helperText="At least 8 characters"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Validated Field"
                  placeholder="Type 'error' to trigger"
                  value={errorValue}
                  onChange={(e) => {
                    setErrorValue(e.target.value);
                    if (e.target.value.toLowerCase() === 'error') {
                      setErrorValue(e.target.value);
                    }
                  }}
                  error={errorValue.toLowerCase() === 'error' ? 'Validation failed! You typed error.' : undefined}
                />
                
                <Dropdown
                  label="Select framework"
                  options={dropdownOptions}
                  value={selectedOption}
                  onChange={(val) => {
                    setSelectedOption(val);
                    handleTriggerToast('info', `Selected Framework: ${val.toUpperCase()}`);
                  }}
                  placeholder="Choose options..."
                  searchable
                />
              </div>
            </div>
          </Card>

          {/* 3. MODAL & FEEDBACK (TOASTS) */}
          <Card title="Modal & Notifications" subtitle="Overlay dialogues and dynamic notification triggers" hoverable bordered shadow="sm" className="h-full">
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Dialog Triggers</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" onClick={() => { setModalSize('sm'); setIsModalOpen(true); }}>
                    Small Modal
                  </Button>
                  <Button variant="secondary" onClick={() => { setModalSize('md'); setIsModalOpen(true); }}>
                    Medium Modal
                  </Button>
                  <Button variant="outline" onClick={() => { setModalSize('lg'); setIsModalOpen(true); }}>
                    Large Modal
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Toast Triggers</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" className="!bg-success-600 hover:!bg-success-700 !text-white" onClick={() => handleTriggerToast('success', 'Operation completed successfully!')}>
                    🟢 Success
                  </Button>
                  <Button variant="secondary" className="!bg-danger-600 hover:!bg-danger-700 !text-white" onClick={() => handleTriggerToast('error', 'Critical system error encountered.')}>
                    🔴 Error
                  </Button>
                  <Button variant="secondary" className="!bg-warning-500 hover:!bg-warning-600 !text-white" onClick={() => handleTriggerToast('warning', 'Low disk space warning detected.')}>
                    🟡 Warning
                  </Button>
                  <Button variant="secondary" className="!bg-info-600 hover:!bg-info-700 !text-white" onClick={() => handleTriggerToast('info', 'Check your inbox for new items.')}>
                    🔵 Info
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. DATA DISPLAY: BADGES & TOOLTIPS & PAGINATION */}
          <Card title="Data & Status Indicators" subtitle="Badges, tooltips, and interactive paginators" hoverable bordered shadow="sm" className="h-full">
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Badges & Tooltips</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip content="Verified Account Status" position="top">
                    <Badge color="success" variant="subtle" dot>
                      Verified
                    </Badge>
                  </Tooltip>

                  <Tooltip content="Critical Server Alert" position="bottom">
                    <Badge color="danger" variant="solid" removable onRemove={() => handleTriggerToast('warning', 'Removed alert badge!')}>
                      Alert
                    </Badge>
                  </Tooltip>

                  <Tooltip content="System Info Message" position="left">
                    <Badge color="info" variant="outline">
                      Info
                    </Badge>
                  </Tooltip>

                  <Tooltip content="Draft status" position="right">
                    <Badge color="slate" variant="subtle">
                      Draft
                    </Badge>
                  </Tooltip>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Interactive Pagination</h4>
                <div className="mt-2 py-2 flex flex-col items-center gap-3 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      handleTriggerToast('info', `Navigated to Page ${page}`);
                    }}
                    size="sm"
                  />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Displaying Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* 5. ACCORDIONS & COLLAPSIBLE CONTENT */}
          <div className="lg:col-span-2">
            <Card title="Collapsible FAQ Accordion" subtitle="Self-contained collapsible item panels with keyboard support" hoverable bordered shadow="sm">
              <div className="mt-4">
                <Accordion items={accordionItems} allowMultiple={false} />
              </div>
            </Card>
          </div>

        </div>
      </main>

      {/* Modal Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalSize.toUpperCase()} Dialog Overlay`}
        size={modalSize}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {
              setIsModalOpen(false);
              handleTriggerToast('success', 'Modal configurations saved.');
            }}>
              Confirm Actions
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            This dialog modal demonstrates the premium focus-trapping layout. Notice that clicking backdrop overlays or hitting <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono text-xs text-slate-700">ESC</kbd> safely dismisses the window.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border dark:border-slate-700">
            Current Configuration Size: <span className="text-primary-600 uppercase font-mono">{modalSize}</span>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className={`border-t py-12 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'} text-center transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm font-semibold">© 2026 Antigravity UI. Designed with passion for Google DeepMind Pair Programming.</p>
          <p className="text-xs text-slate-400 mt-2">Built with React, Storybook, Jest, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
