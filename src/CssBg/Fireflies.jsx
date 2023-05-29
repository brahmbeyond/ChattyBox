import React, { useState, useEffect } from "react";
// import './Fireflies.css'

const Fireflies = () => {  const [fireflies, setFireflies] = useState([]);

  useEffect(() => {
    const generateFireflies = () => {
      const fireflies = [];
      for (let i = 0; i < 8; i++) {
        const firefly = {
          position: {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          },
          velocity: {
            x: Math.random() * 5 - 9,
            y: Math.random() * 5 - 9,
          },
          color: `yellow`,
        };
        fireflies.push(firefly);
      }
      setFireflies(fireflies);
    };

    setInterval(generateFireflies, 1000);
  }, []);

  return (
    <div >
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            top: firefly.position.y,
            left: firefly.position.x,
            borderRadius: "50%",
            backgroundColor: firefly.color,
            animation : 'twinkle 2s infinite',
            filter: "brightness(1) blur(2px)"
          }}
        />
      ))}
    </div>
  );
};

export default Fireflies;
