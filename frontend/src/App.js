import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Header />
      <p className="text-orange-600 text-center text-5xl">ELOELO</p>
      <Footer />
    </Router>
  );
}

export default App;
