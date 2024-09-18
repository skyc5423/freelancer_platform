import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CalenderView from "./CalenderView";
import ReservationPage from "./ReservationPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CalenderView />} />
          <Route path="/reservation" element={<ReservationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
