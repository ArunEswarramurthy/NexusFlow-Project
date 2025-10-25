// Suppress ResizeObserver errors
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && args[0].toString().includes('ResizeObserver loop completed with undelivered notifications')) {
    return;
  }
  originalError.apply(console, args);
};

// Handle window errors
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    e.preventDefault();
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && e.reason.toString().includes('ResizeObserver loop completed with undelivered notifications')) {
    e.preventDefault();
    return false;
  }
});

export default {};