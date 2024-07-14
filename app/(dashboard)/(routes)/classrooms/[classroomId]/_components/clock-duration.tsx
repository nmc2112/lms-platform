import { useEffect, useState } from "react";

interface ClockDurationProps {
  initialDuration: number; // Duration in seconds
}

const ClockDuration = ({ initialDuration }: { initialDuration: number }) => {
  const [time, setTime] = useState(initialDuration * 60); // Initialize with the provided duration in seconds

  useEffect(() => {
    console.log("ClockDuration initialized with:", initialDuration);
    setTime(initialDuration * 60); // Ensure time is set when initialDuration changes
  }, [initialDuration]);

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000); // Update time every second

      return () => clearInterval(timerId); // Cleanup on unmount
    }
  }, [time]);

  // Helper function to format time
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div>
      <h2>Time Remaining: {formatTime(time)}</h2>
    </div>
  );
};

export default ClockDuration;
