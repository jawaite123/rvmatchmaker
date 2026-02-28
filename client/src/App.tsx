import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Matchmaker from './pages/Matchmaker'
import Results from './pages/Results'
import RVDetail from './pages/RVDetail'
import Submit from './pages/Submit'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<Matchmaker />} />
          <Route path="/results" element={<Results />} />
          <Route path="/rv/:id" element={<RVDetail />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
