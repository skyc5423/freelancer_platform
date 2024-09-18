import React, { useState, useEffect } from "react";
import SubjectList from "./SubjectList.js";
import { useNavigate } from "react-router-dom";

const CalenderView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  // Simulate fetching subjects for a specific date

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  };

  const fetchSubjectsForDate = async (date) => {
    setLoading(true);
    setError(null);
    const dateString = formatDate(date);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/${dateString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data = await response.json();
      setSubjects(data);
    } catch (err) {
      setError("Failed to load subjects. Please try again later.");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateToKorean = (date) => {
    if (!(date instanceof Date)) return "";

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();

    return `${year}년 ${month.toString().padStart(2, "0")}월 ${day
      .toString()
      .padStart(2, "0")}일`;
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleReservation = () => {
    if (selectedSubject) {
      navigate("/reservation", { state: { subject: selectedSubject } });
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchSubjectsForDate(selectedDate);
    }
  }, [selectedDate]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const changeMonth = (increment) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + increment,
        1
      )
    );
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "20px auto",
      display: "flex",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      height: "55vh", // or use "80vh" for responsive height
    },
    calendarSection: {
      width: "60%",
      padding: "20px",
      backgroundColor: "#f8f8f8",
      overflowY: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    monthYear: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    button: {
      padding: "5px 10px",
      fontSize: "18px",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
    },
    calendar: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "5px",
    },
    day: {
      textAlign: "center",
      padding: "10px",
      fontSize: "14px",
      fontWeight: "bold",
    },
    date: {
      textAlign: "center",
      padding: "10px",
      cursor: "pointer",
      borderRadius: "50%",
      transition: "background-color 0.3s",
    },
    subjectSection: {
      width: "40%",
      padding: "20px",
      backgroundColor: "white",
      position: "relative", // Add this to allow absolute positioning of children
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    subjectHeader: {
      fontSize: "20px",
      marginBottom: "15px",
    },
    subjectList: {
      listStyleType: "none",
      padding: 0,
    },
    subjectItem: {
      padding: "10px",
      marginBottom: "5px",
      backgroundColor: "#f0f0f0",
      borderRadius: "4px",
      transition: "background-color 0.3s",
    },
    reserveButton: {
      position: "absolute",
      bottom: "50px",
      right: "20px",
      padding: "10px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      transition: "background-color 0.3s, transform 0.1s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.calendarSection}>
        <div style={styles.header}>
          <button style={styles.button} onClick={() => changeMonth(-1)}>
            &lt;
          </button>
          <div style={styles.monthYear}>
            {currentMonth.getFullYear()}. {currentMonth.getMonth() + 1}
          </div>
          <button style={styles.button} onClick={() => changeMonth(1)}>
            &gt;
          </button>
        </div>
        <div style={styles.calendar}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} style={styles.day}>
              {day}
            </div>
          ))}
          {[...Array(firstDayOfMonth)].map((_, index) => (
            <div key={`empty-${index}`} style={styles.date}></div>
          ))}
          {[...Array(daysInMonth)].map((_, index) => {
            const date = index + 1;
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === date &&
              selectedDate.getMonth() === currentMonth.getMonth() &&
              selectedDate.getFullYear() === currentMonth.getFullYear();
            return (
              <div
                key={date}
                style={{
                  ...styles.date,
                  backgroundColor: isSelected ? "#007bff" : "transparent",
                  color: isSelected ? "white" : "black",
                }}
                onClick={() => {
                  setSelectedDate(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      date
                    )
                  );
                  setSelectedSubject(null);
                }}
              >
                {date}
              </div>
            );
          })}
        </div>
      </div>
      <div style={styles.subjectSection}>
        <h3 style={styles.subjectHeader}>
          {selectedDate ? `${formatDateToKorean(selectedDate)}` : ""}
        </h3>
        {loading ? (
          <p>불러 오는 중...</p>
        ) : selectedDate ? (
          <SubjectList
            subjects={subjects}
            onSubjectClick={handleSubjectClick}
            selectedSubject={selectedSubject}
          />
        ) : (
          <p>원하시는 날짜를 골라주세요!</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          style={{
            ...styles.reserveButton,
            opacity: selectedSubject ? 1 : 0.5,
            cursor: selectedSubject ? "pointer" : "not-allowed",
          }}
          onClick={handleReservation}
          disabled={!selectedSubject}
        >
          예약하기
        </button>
      </div>
    </div>
  );
};

export default CalenderView;
