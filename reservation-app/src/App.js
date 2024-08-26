import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservationApp = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  const locations = ["원데이 클래스", "어쩌구 저쩌구"];
  const times = ["09:55", "11:15", "12:35", "13:55", "15:15"];
  const themes = ["춤 1", "춤 2", "춤 3", "춤 4", "춤 5"];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">RESERVATION</h1>

      {/* Main content */}
      <div className="space-y-6">
        {/* Location selection */}
        <div>
          <h2 className="text-xl font-bold mb-2">지점</h2>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location}
                className={`px-3 py-1 border rounded ${
                  selectedLocation === location
                    ? "bg-gray-800 text-white"
                    : "bg-white"
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

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

        {/* Theme selection */}
        <div>
          <h2 className="text-xl font-bold mb-2">테마</h2>
          <div className="space-y-2">
            {themes.map((theme) => (
              <button
                key={theme}
                className={`w-full text-left p-2 ${
                  selectedTheme === theme
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedTheme(theme)}
              >
                {theme}
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
                  selectedTime === time ? "bg-gray-800 text-white" : "bg-white"
                }`}
                onClick={() => setSelectedTime(time)}
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
