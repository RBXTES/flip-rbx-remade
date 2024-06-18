import React from 'react'
import ReactDOM from 'react-dom/client'
import Router from './router'
import { io } from 'socket.io-client'
const socket = io.connect('https://backend-production-03d9.up.railway.app/')
import SocketContext from './Context/SocketContext'
import './main.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <SocketContext.Provider value={socket}>
      <Router />
    </SocketContext.Provider>
  </React.StrictMode>
)