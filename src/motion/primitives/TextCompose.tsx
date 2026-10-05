"use client";

import { motion } from "motion/react";

interface TextComposeProps {
  text: string;
  className?: string;
}

export function TextCompose({ text, className }: TextComposeProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
