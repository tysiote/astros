import React from 'react'
import ReactDOM from 'react-dom'
import { MainApp } from './pages/main-app'
import './assets/roboto-condensed-v19-latin-regular.woff'
import './assets/roboto-condensed-v19-latin-regular.woff2'
import './assets/roboto-condensed-v19-latin-regular.ttf'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
