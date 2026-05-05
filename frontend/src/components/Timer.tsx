import { useEffect, useState } from "react";

export default function Timer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  return (
    <>
      <div>timer</div>
    </>
  );
}
