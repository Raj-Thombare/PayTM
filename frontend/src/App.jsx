import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin, Signup, Dashboard, SendMoney } from "./pages";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/send' element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
