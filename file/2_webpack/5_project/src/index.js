import React from 'react'
import { createRoot } from 'react-dom/client'
import './css'
import Header from '@c/header'
import 'bootstrap'

const root = createRoot(document.getElementById('app'))

root.render(<Header />)
