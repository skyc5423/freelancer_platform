import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const ReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || {};

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [errors, setErrors] = useState({});

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
      marginBottom: "20px",
    },
    inputGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
    },
    input: {
      width: "80%",
      padding: "8px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "20px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      border: "none",
      borderRadius: "4px",
      width: "45%",
    },
    submitButton: {
      backgroundColor: "#007bff",
      color: "white",
    },
    backButton: {
      backgroundColor: "#6c757d",
      color: "white",
    },
    requiredStar: {
      color: "red",
      marginLeft: "3px",
    },
    errorText: {
      color: "red",
      fontSize: "14px",
      marginTop: "5px",
    },
  };

  const formatPhoneNumber = (input) => {
    const cleaned = input.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return input;
  };

  const handlePhoneNumberChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "이름을 입력해주세요.";
    if (!phoneNumber.match(/^\d{3}-\d{4}-\d{4}$/)) {
      newErrors.phoneNumber = "올바른 전화번호 형식을 입력해주세요.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const reservationData = {
        subject,
        clientInfo: {
          name,
          phoneNumber,
          instagramId,
        },
      };
      // API 요청 보내기
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
        try {
          const response = await axios.post(`${apiUrl}/api/reservation`, reservationData);
          console.log("예약이 성공적으로 생성되었습니다:", response.data);
        } catch (error) {
          if (error.response) {
            console.error("서버 응답 오류:", error.response.data);
            throw new Error("예약 생성에 실패했습니다: " + error.response.data.message);
          } else if (error.request) {
            console.error("요청 오류:", error.request);
            throw new Error("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
          } else {
            console.error("오류 발생:", error.message);
            throw new Error("예약 생성 중 오류가 발생했습니다.");
          }
        }
        alert("예약이 성공적으로 완료되었습니다.");
        navigate(-1); // 이전 화면으로 돌아가기
      } catch (err) {
        console.error("예약 중 오류 발생:", err);
        alert("예약에 실패했습니다. 다시 시도해 주세요.");
      }
      console.log("Submitting reservation:", reservationData);
    }
  };

  if (!subject) {
    return (
      <div style={styles.container}>No subject information available.</div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>수업 예약하기</h2>
      <div style={styles.info}>
        <p>
          <strong>수업 종류: </strong> {subject.class_type}:{" "}
          {subject.class_song}
        </p>
        <p>
          <strong>시간: </strong> {subject.start_time} - {subject.end_time}
        </p>
        <p>
          <strong>장소: </strong> {subject.location_name}
        </p>
        <p>
          <strong>현재 예약 인원:</strong> {subject.user_id_list.length} /{" "}
          {subject.max_user_num}
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="name">
            이름<span style={styles.requiredStar}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <div style={styles.errorText}>{errors.name}</div>}
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="phoneNumber">
            전화번호<span style={styles.requiredStar}>*</span>
          </label>
          <input
            style={styles.input}
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="010-1234-5678"
            required
          />
          {errors.phoneNumber && (
            <div style={styles.errorText}>{errors.phoneNumber}</div>
          )}
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="instagramId">
            인스타그램 ID (선택 사항)
          </label>
          <input
            style={styles.input}
            type="text"
            id="instagramId"
            value={instagramId}
            onChange={(e) => setInstagramId(e.target.value)}
          />
        </div>
        <div style={styles.buttonContainer}>
          <button
            style={{ ...styles.button, ...styles.submitButton }}
            type="submit"
          >
            예약하기
          </button>
          <button
            style={{ ...styles.button, ...styles.backButton }}
            type="button"
            onClick={() => navigate("/")}
          >
            돌아가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationPage;
