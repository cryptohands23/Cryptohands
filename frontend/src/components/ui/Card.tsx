import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'metric';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  onClick,
}) => {
  const baseClasses = 'rounded-xl shadow-xl';
  
  const variantClasses = {
    default: 'card',
    dark: 'card-dark',
    metric: 'metric-card',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    hover ? 'hover:scale-105 transition-transform duration-200 cursor-pointer' : '',
    onClick ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ');

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  } : {};

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
};

export default Card;