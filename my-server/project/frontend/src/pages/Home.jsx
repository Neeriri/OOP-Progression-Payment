import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <section className="home">
      <div className="hero-content">
        <img src="https://img.freepik.com/premium-vector/pet-paw-shop-logo-zoo-dog-goods-store-concept-icon_101884-1604.jpg" className="hero-img" alt="Зоомагазин" />
        <h1>Добро пожаловать в зоомагазин ЗооИмбра!</h1>
        <p>У нас представлены различные товары для животных как и сами животные</p>
        <Link to="/menu" className="btn-primary">Посмотреть ассортимент магазина</Link>
      </div>
    </section>
  )
}

export default Home
