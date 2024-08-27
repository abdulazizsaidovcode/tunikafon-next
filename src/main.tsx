import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'flatpickr/dist/flatpickr.min.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@material-tailwind/react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThemeProvider>
    <Router>
      <title>Tunikafon</title>
      <Toaster position="bottom-right" />
      <App />
    </Router>
  </ThemeProvider>,
);
