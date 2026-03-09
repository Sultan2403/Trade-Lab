import { BrowserRouter, Route, Routes } from "react-router-dom";

import Main from "./Components/Main/main";
import Login from "./Components/Auth/login";
import Register from "./Components/Auth/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Main />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
