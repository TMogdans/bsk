import React from 'react'
import ReactDOM from 'react-dom/client'
import {Hello} from 'rvs/Hello';

import './index.css'

const App = () => (
  <div className="container">
      <h1>Hi vom Container</h1>
      <Hello id={"bestanden"} />
  </div>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)
