import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { TranslationProvider } from './i18n/TranslationContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TranslationProvider>
      <App />
    </TranslationProvider>
  </React.StrictMode>,
)
