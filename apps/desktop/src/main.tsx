import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { setStorageAdapter } from '@focus-gtd/core';
import { electronStorage } from './lib/storage-adapter';
import { LanguageProvider } from './contexts/language-context';

// Initialize storage adapter for desktop
setStorageAdapter(electronStorage);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </React.StrictMode>,
)

