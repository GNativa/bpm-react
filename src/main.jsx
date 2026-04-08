import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import './styles/animations.css'
import './Custom.css';
import App from './App.jsx'
import ToastProvider from './components/messages/ToastProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App/>
    </ToastProvider>
  </StrictMode>,
);