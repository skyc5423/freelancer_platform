import React from "react";

const SubjectList = ({ subjects, onSubjectClick, selectedSubject }) => {
  const styles = {
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
      cursor: "pointer",
    },
    selectedSubject: {
      backgroundColor: "#007bff",
      color: "white",
    },
  };

  return (
    <ul style={styles.subjectList}>
      {subjects.length > 0 ? (
        subjects.map((subject) => (
          <li
            key={`${subject.start_time}-${subject.class_type}`}
            style={{
              ...styles.subjectItem,
              ...(selectedSubject === subject ? styles.selectedSubject : {}),
            }}
            onClick={() => onSubjectClick(subject)}
          >
            {`${subject.start_time}-${subject.end_time}: ${subject.class_type}\n${subject.location_name} (${subject.user_id_list.length}/${subject.max_user_num})`}
          </li>
        ))
      ) : (
        <p>No subjects for this date.</p>
      )}
    </ul>
  );
};

export default SubjectList;
