import React, { useEffect, useState } from "react";
import frame1 from "./assets/loading-frames/frame1.png";
import frame2 from "./assets/loading-frames/frame2.png";
import frame3 from "./assets/loading-frames/frame3.png";
import frame4 from "./assets/loading-frames/frame4.png";
import frame5 from "./assets/loading-frames/frame5.png";
import frame6 from "./assets/loading-frames/frame6.png";
import "./LoadingAnimation.css";

function LoadingAnimation() {
  const [frame, setFrame] = useState(0);
  const frames = [frame1, frame2, frame3, frame4, frame5, frame6];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <img src={frames[frame]} alt="Loading..." className="loading-frame" />
    </div>
  );
}

export default LoadingAnimation;
