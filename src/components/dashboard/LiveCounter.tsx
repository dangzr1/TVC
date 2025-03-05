import React, { useState, useEffect } from "react";

interface LiveCounterProps {
  label: string;
  value: number;
  color: string;
  prefix?: string;
  increment?: number;
  decrement?: number;
  fluctuate?: boolean;
  interval?: number;
}

const LiveCounter: React.FC<LiveCounterProps> = ({
  label,
  value: initialValue,
  color,
  prefix = "",
  increment = 0,
  decrement = 0,
  fluctuate = false,
  interval = 10000,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Set up interval for live updates
    const timer = setInterval(() => {
      setIsAnimating(true);

      if (fluctuate) {
        // Randomly go up or down by 1-3
        const change = Math.floor(Math.random() * 3) + 1;
        const direction = Math.random() > 0.5 ? 1 : -1;
        setValue((prev) => Math.max(1, prev + change * direction));
      } else if (increment > 0) {
        // Increment by specified amount
        setValue((prev) => prev + increment);
      } else if (decrement > 0) {
        // Decrement by specified amount, but never below 0
        setValue((prev) => Math.max(0, prev - decrement));
      }

      // Reset animation state
      setTimeout(() => setIsAnimating(false), 1000);
    }, interval);

    return () => clearInterval(timer);
  }, [increment, decrement, fluctuate, interval]);

  return (
    <div className="text-center px-3 py-1 bg-white/50 rounded-lg transition-all duration-300 hover:bg-white/70">
      <p className="text-xs text-gray-600">{label}</p>
      <p
        className={`text-lg font-bold ${color} ${isAnimating ? "animate-bounce-subtle" : ""}`}
      >
        {prefix}
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default LiveCounter;
