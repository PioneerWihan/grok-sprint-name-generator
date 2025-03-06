import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { FC } from "react";

interface ConfettiEffectProps {
  show: boolean;
  windowWidth: number;
  windowHeight: number;
}

export const ConfettiEffect: FC<ConfettiEffectProps> = ({
  show,
  windowWidth,
  windowHeight,
}) => {
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const fadeOutIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  useEffect(() => {
    if (show) {
      setConfettiOpacity(1);
      const timeout = setTimeout(() => {
        fadeOutIntervalRef.current = setInterval(() => {
          setConfettiOpacity((prev) => {
            if (prev <= 0) {
              clearInterval(fadeOutIntervalRef.current!);
              return 0;
            }
            return prev - 0.05;
          });
        }, 100);
      }, 3000); // Start fading after 3 seconds
      return () => clearTimeout(timeout);
    }
  }, [show]);

  useEffect(() => {
    return () => {
      if (fadeOutIntervalRef.current) {
        clearInterval(fadeOutIntervalRef.current);
      }
    };
  }, []);

  if (!show) return null;

  return (
    <Confetti
      drawShape={(ctx) => {
        ctx.beginPath();
        for (let i = 0; i < 22; i++) {
          const angle = 0.35 * i;
          const x = (0.2 + 1.5 * angle) * Math.cos(angle);
          const y = (0.2 + 1.5 * angle) * Math.sin(angle);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.closePath();
      }}
      width={windowWidth}
      height={windowHeight}
      numberOfPieces={150}
      recycle={false}
      gravity={0.2}
      opacity={confettiOpacity}
      initialVelocityX={{ min: -10, max: 10 }}
      initialVelocityY={{ min: -20, max: -10 }}
      confettiSource={{
        x: windowWidth / 2,
        y: windowHeight / 2,
        w: 10,
        h: 10,
      }}
    />
  );
};
