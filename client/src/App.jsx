import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import InsightBoard from './components/InsightBoard'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/login/insight-board" element={<InsightBoard />} />
        </Route>
      </Routes>
    </>
  )
}

export default App