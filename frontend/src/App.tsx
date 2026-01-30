import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/about" element={<Dashboard />} />
      <Route path="/test" element={<Test/>}/>
    </Routes>
  );
}

export default App;
