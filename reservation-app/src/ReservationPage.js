import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

const ReservationPage = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const { subject } = location.state || {};

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "20px auto",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
    },
    info: {
      marginBottom: "10px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      marginTop: "20px",
    },
  };

  // if (!subject) {
  return <div style={styles.container}>No subject information available.</div>;
  // }

  // return (
  //   <div style={styles.container}>
  //     <h2 style={styles.header}>Subject Reservation</h2>
  //     <div style={styles.info}>
  //       <p>
  //         <strong>Class Type:</strong> {subject.class_type}
  //       </p>
  //       <p>
  //         <strong>Time:</strong> {subject.start_time} - {subject.end_time}
  //       </p>
  //       <p>
  //         <strong>Location:</strong> {subject.location_name}
  //       </p>
  //       <p>
  //         <strong>Available Spots:</strong>{" "}
  //         {subject.max_user_num - subject.user_id_list.length} /{" "}
  //         {subject.max_user_num}
  //       </p>
  //     </div>
  //     <button style={styles.button} onClick={() => navigate("/")}>
  //       Back to Calendar
  //     </button>
  //   </div>
  // );
};

export default ReservationPage;
