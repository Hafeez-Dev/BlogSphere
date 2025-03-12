import React, { useState, useEffect } from 'react'
import { login, logout } from './store/authSlice'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import {Header, Footer} from './components' 
import { Outlet } from 'react-router-dom'
import { FullPageLoader } from './components/Loaders'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((user) => {
        if (user) {
          dispatch(login({ userData: user }))
        } else {
          dispatch(logout())
        }
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  return !loading ? (
    <div>
      <Header />
        <main>
          <Outlet />
        </main>
      <Footer />
    </div>
  ) : (<FullPageLoader />)
}

export default App