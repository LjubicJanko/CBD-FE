import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import i18next from 'i18next';
import { CircularProgress } from '@mui/material';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import './dayJsConfig.ts';
import { Analytics } from "@vercel/analytics/react";
import { registerSW } from 'virtual:pwa-register';
import authBus from './services/bus';

dayjs.extend(customParseFormat);
const container = document.getElementById('root');
const root = createRoot(container as Element);

registerSW({
    onOfflineReady() {
        authBus.emit('snackbar', {
            message: i18next.t('pwa.offlineReady'),
            severity: 'success',
        });
    },
});

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
