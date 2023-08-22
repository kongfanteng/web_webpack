import React from 'react'
import { createRoot } from 'react-dom/client'
import Header from './components/header';

const root = createRoot(document.getElementById('app'))
root.render(<Header />)
