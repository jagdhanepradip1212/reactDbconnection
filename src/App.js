import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/HomePage";
import LoginPage from "./Components/LoginPage";
import NavbarLink from "./Components/Navbar";
import RegisterForm from "./Components/RegisterForm";
import ShowData from "./Components/showData";

function App() {
  return (
    <div className="App">
      <NavbarLink />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/export" element={<ShowData />}></Route>
      </Routes>
    </div>
  );
}

export default App;
