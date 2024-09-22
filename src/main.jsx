import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function Root() {
    return (
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);