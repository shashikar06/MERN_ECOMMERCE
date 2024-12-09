import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Header from './Components/Header'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Components/Footer'
import { ToastContainer } from 'react-toastify'

function App() {
  

  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
         <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
