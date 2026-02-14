'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="card group cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center 
                    text-gold-400 mb-4 group-hover:bg-gold-500 group-hover:text-dark-950 
                    transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-dark-50 mb-2 group-hover:text-gold-400 
                    transition-colors">
        {title}
      </h3>
      <p className="text-dark-400">{description}</p>
    </motion.div>
  );
}
