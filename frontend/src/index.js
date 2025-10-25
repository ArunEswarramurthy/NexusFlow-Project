import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Toaster } from 'react-hot-toast';
import './utils/suppressResizeObserver';

// Suppress ResizeObserver errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && args[0].toString().includes('ResizeObserver loop completed with undelivered notifications')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #10b981',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #ef4444',
            },
          },
          loading: {
            iconTheme: {
              primary: '#4f46e5',
              secondary: '#fff',
            },
            style: {
              borderLeft: '4px solid #4f46e5',
            },
          },
        }}
      />

    </QueryClientProvider>
  </React.StrictMode>
);

// Performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Add performance monitoring here
  console.log('🚀 NexusFlow Production Mode');
} else {
  console.log('🔧 NexusFlow Development Mode');
}