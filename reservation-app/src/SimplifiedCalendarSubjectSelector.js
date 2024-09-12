import React, { useState, useEffect } from "react";

const SimplifiedCalendarSubjectSelector = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await fetch(`http://localhost:8000/api/${dateString}`);
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
    },
    calendarSection: {
      width: "60%",
      padding: "20px",
      backgroundColor: "#f8f8f8",
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
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth(),
                      date
                    )
                  )
                }
              >
                {date}
              </div>
            );
          })}
        </div>
      </div>
      <div style={styles.subjectSection}>
        <h3 style={styles.subjectHeader}>
          과목 {selectedDate ? `(${selectedDate.toLocaleDateString()})` : ""}
        </h3>
        {loading ? (
          <p>Loading subjects...</p>
        ) : selectedDate ? (
          subjects.length > 0 ? (
            <ul style={styles.subjectList}>
              {subjects.map((subject) => (
                <li key={subject} style={styles.subjectItem}>
                  {`${subject.start_time}-${subject.end_time}: ${subject.class_type}\n${subject.location_name} (${subject.user_id_list.length}/${subject.max_user_num})`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No subjects for this date.</p>
          )
        ) : (
          <p>Select a date to view subjects.</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default SimplifiedCalendarSubjectSelector;
