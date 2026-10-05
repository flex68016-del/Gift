"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";

interface RevealProps {
  children: React.ReactNode;
  trigger?: boolean;
}

export function Reveal({ children, trigger }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
    }
  }, [trigger]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export function useReveal() {
  const [isVisible, setIsVisible] = useState(false);

  const reveal = () => setIsVisible(true);

  return { isVisible, reveal };
}
