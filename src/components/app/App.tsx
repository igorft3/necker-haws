import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "../catalog/Catalog";
import Details from "../details/Details";
import "./App.module.css";

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalog />}></Route>
        <Route path="/news/:id" element={<Details />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
