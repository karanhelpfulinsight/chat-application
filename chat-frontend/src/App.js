
import Home from './pages/Home';
import Login from './pages/Login';
import SignupForm from './pages/Signup';
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/" element={<Home/>}/>
    </Routes>
  );
}

export default App;
