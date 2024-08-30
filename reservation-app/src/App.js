import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL_QUERY_SCHEDULE_BY_MONTH = "http://localhost:8000/api";

const ReservationApp = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses(selectedDate);
  }, [selectedDate]);

  const fetchClasses = async (date) => {
    const formattedDate = date.toISOString().split("T")[0].replace(/-/g, "");
    try {
      console.log(
        `Fetching from URL: ${API_URL_QUERY_SCHEDULE_BY_MONTH}/${formattedDate}`
      );
      const response = await fetch(
        `${API_URL_QUERY_SCHEDULE_BY_MONTH}/${formattedDate}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          mode: "cors", // Explicitly set CORS mode
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();

        console.log(data);
        setClasses(data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const locations = Array.from(new Set(classes.map((c) => c.location_name)));
  const times = Array.from(new Set(classes.map((c) => c.start_time)));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">RESERVATION</h1>

      <div className="space-y-6">
        {/* Date selection */}
        <div>
          <h2 className="text-xl font-bold mb-2">날짜</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy. MM. dd"
            className="px-3 py-1 border rounded"
          />
        </div>

        {/* Location selection */}
        <div>
          <h2 className="text-xl font-bold mb-2">지점</h2>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location}
                className={`px-3 py-1 border rounded ${
                  selectedClass?.location_name === location
                    ? "bg-gray-800 text-white"
                    : "bg-white"
                }`}
                onClick={() => setSelectedClass(null)}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* Class selection */}
        <div>
          <h2 className="text-xl font-bold mb-2">수업</h2>
          <div className="space-y-2">
            {classes.map((classItem) => (
              <button
                key={`${classItem.date}-${classItem.start_time}-${classItem.location_name}`}
                className={`w-full text-left p-2 ${
                  selectedClass === classItem
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedClass(classItem)}
              >
                {classItem.class_type || "일반 수업"} -{" "}
                {classItem.location_name} - {classItem.start_time}~
                {classItem.end_time}
              </button>
            ))}
          </div>
        </div>

        {/* Time selection */}
        <div>
          <h2 className="text-xl font-bold mb-2">시간</h2>
          <div className="flex flex-wrap gap-2">
            {times.map((time) => (
              <button
                key={time}
                className={`flex items-center px-3 py-1 border rounded ${
                  selectedClass?.start_time === time
                    ? "bg-gray-800 text-white"
                    : "bg-white"
                }`}
                onClick={() =>
                  setSelectedClass(classes.find((c) => c.start_time === time))
                }
              >
                <span className="mr-1">🕒</span> {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationApp;
