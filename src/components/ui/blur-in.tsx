'use client';
import { motion, useInView } from 'framer-motion';
import * as React from 'react';
 
export const BlurIn = ({ children, triggerKey }: { children: React.ReactNode; triggerKey?: string | number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      key={triggerKey}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={isInView ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(20px)', opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};