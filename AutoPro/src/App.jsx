import { useState } from 'react'
import Header from './components/header'
import Global from './styles/Global'
import Banner from './components/banner'
import Home from './pages/Home'
import Rodape from './components/rodape'

function App() {
  const [count, setCount] = useState(0)
return(
  <div>
    <Header/>
    <Global/>
    <Banner/>
    <Home/>
    <Rodape/>
  
  </div>
)
  
  
}

export default App
