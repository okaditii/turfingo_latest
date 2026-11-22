import './App.css'
import About from './components/about.jsx'
import Community from './components/community.jsx'
import Contact from './components/contact.jsx'
import Footer from './components/footer.jsx'
import Glimpse from './components/glimpse.jsx'
import Hero from './components/hero.jsx'
import ScrollBanner from './components/scrollBanner.jsx'
import Services from './components/services.jsx'

function App() {
  return (
    <main className="landing-page">
      <Hero />
      <About />
      <Services />
      <Glimpse />
      <ScrollBanner />
      <Community />
      <Contact />
      <Footer />
    </main>
  )
}

export default App
