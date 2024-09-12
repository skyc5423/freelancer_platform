import React, { useState } from "react";

const SimpleCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const changeMonth = (increment) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + increment,
        1
      )
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "300px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2>
          {currentMonth.getFullYear()}. {currentMonth.getMonth() + 1}
        </h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "5px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ textAlign: "center", fontWeight: "bold" }}>
            {day}
          </div>
        ))}
        {[...Array(daysInMonth)].map((_, index) => (
          <div key={index} style={{ textAlign: "center", padding: "5px" }}>
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleCalendar;
