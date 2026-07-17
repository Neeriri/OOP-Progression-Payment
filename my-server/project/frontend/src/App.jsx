import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">Зооимбра</Link>
          <div className="nav-links">
            <Link to="/">Главная</Link>
            <Link to="/menu">Ассортимент</Link>
          </div>
        </div> <div>
        <image src="https://img.freepik.com/premium-vector/pet-paw-shop-logo-zoo-dog-goods-store-concept-icon_101884-1604.jpg" className="Logo1"></image>
      </div>
<div>
        <image src="https://img.freepik.com/premium-vector/pet-paw-shop-logo-zoo-dog-goods-store-concept-icon_101884-1604.jpg" className="Logo2"></image>
      </div>
      </nav>
     
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
