'use client';
import { motion, useInView } from 'framer-motion';
import * as React from 'react';

interface StaggeredCardsProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggeredCards: React.FC<StaggeredCardsProps> = ({
  children,
  className = '',
  staggerDelay = 0.1
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          viewport={{ once: true }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};