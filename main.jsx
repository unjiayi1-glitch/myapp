import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element with id "root" not found in HTML')
}

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
