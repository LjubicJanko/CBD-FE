import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import { CircularProgress } from '@mui/material';

const container = document.getElementById('root');
const root = createRoot(container as Element);

root.render(
  <Suspense
    fallback={
      <div className="spinner-wrapper">
        <CircularProgress />
      </div>
    }
  >
    <App />
  </Suspense>
);
