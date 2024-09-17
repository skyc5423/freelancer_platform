import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SimplifiedCalendarSubjectSelector from "./SimplifiedCalendarSubjectSelector";
import ReservationPage from "./ReservationPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SimplifiedCalendarSubjectSelector />} />
          <Route path="/reservation" element={<ReservationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
