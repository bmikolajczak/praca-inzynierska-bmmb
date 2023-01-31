import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { store } from './infrastructure/store/index'
import { Provider } from 'react-redux'

import './index.scss'

import Mars from './pages/Mars/components/Mars'
import { App } from './App'
// import { LinkHub } from './pages/LinkHub/components/LinkHub'
import { Account } from './pages/Account/components/Account'
import { About } from './pages/About Page/components/About'
import { Apod } from './pages/APOD/components/Apod'
import { Quizes } from './pages/Quizes/components/Quizes'
import { LinkHub } from './pages/LinkHub/components/LinkHub'
import Solar from './pages/Solar System/components/Solar'
import StageModels from './pages/Stage Models/components/StageModels'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/mars" element={<Mars />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={<Account />} />
            <Route path="/apod" element={<Apod />} />
            <Route path="/solar" element={<Solar />} />
            <Route path="/stage" element={<StageModels />} />
            <Route path="/quiz" element={<Quizes />} />
            <Route path="/menu" element={<LinkHub />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
