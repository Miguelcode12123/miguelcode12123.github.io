import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeroPage from "./pages/HeroPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroPage />} />
      </Routes>
    </Router>
  )
}

export default App
