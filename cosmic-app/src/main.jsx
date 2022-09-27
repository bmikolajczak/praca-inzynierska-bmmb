import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import Mars from './pages/Mars/components/Mars'
import { App } from './App'
import { Settings } from './pages/Settings Page/components/Settings'
import { Account } from './pages/Account/components/Account'
import { About } from './pages/About Page/components/About'
import { Apod } from './pages/APOD/components/Apod'
import Solar from './pages/Solar System/components/Solar'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/mars" element={<Mars />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/apod" element={<Apod />} />
          <Route path="/solar" element={<Solar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
