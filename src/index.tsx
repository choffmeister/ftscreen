import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import { registerServiceWorker } from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('app'))

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker()
}
