import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Krpano from './Components/Krpano';
import Gallery from './Components/Gallery';
import Navbar from './Components/Navbar';

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        {/* <Route path="/" element={<Navbar />} /> */}
        <Route index element={<Gallery />} />
        <Route path="/view" element={<Krpano />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
