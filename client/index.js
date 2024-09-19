import React from 'react';
import styles from './styles.scss';
import App from './components/App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
