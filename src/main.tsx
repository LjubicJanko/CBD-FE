import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import { CircularProgress } from '@mui/material';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import './dayJsConfig.ts';
import { Analytics } from "@vercel/analytics/react";

dayjs.extend(customParseFormat);
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
    <Analytics />
  </Suspense>
);
