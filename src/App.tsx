import './App.css'
import { Routes, Route } from "react-router-dom"
import { DataProvider } from "./utils/Context"
import Navbar from "./components/Navbar"
import InfoComponent from './pages/InfoComponent'
import ItemComponent from './pages/ItemComponent'
import ItemTableComponent from './components/ItemTableComponent'
import FooterComponent from './components/Footer'
import AthleteComponent from './pages/AthleteComponent'
import ResultsTableComponent from './pages/ResultsTableComponent'

function App() {

  return (
    <>
      <DataProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<InfoComponent />} />
          <Route path="/athletes" element={<AthleteComponent />} />
          <Route path="/result-types" element={<ResultsTableComponent />} />
          <Route path="/items" element={<ItemComponent/>} />
          <Route path="/itemstable" element={<ItemTableComponent/>} />
        </Routes>
        <FooterComponent/>
      </DataProvider>
    </>
  )
}

export default App
