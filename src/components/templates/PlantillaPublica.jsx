import Navbar from '../organisms/Navbar'
import Footer from '../organisms/Footer'

function PlantillaPublica({ children }) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default PlantillaPublica