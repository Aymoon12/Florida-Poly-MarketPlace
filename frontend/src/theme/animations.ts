import { keyframes } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';

// Keyframe animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Transition presets
export const transitions = {
  standard: 'all 0.2s ease-in-out',
  emphasized: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'all 0.3s cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'all 0.2s cubic-bezier(0.4, 0, 1, 1)',
  smooth: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

// Hover effect sx props
export const hoverEffects = {
  lift: {
    transition: transitions.emphasized,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    },
  } as SxProps<Theme>,

  liftSmall: {
    transition: transitions.standard,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    },
  } as SxProps<Theme>,

  scale: {
    transition: transitions.standard,
    '&:hover': {
      transform: 'scale(1.02)',
    },
  } as SxProps<Theme>,

  scaleSmall: {
    transition: transitions.standard,
    '&:hover': {
      transform: 'scale(1.01)',
    },
  } as SxProps<Theme>,

  glow: (_color: string = 'primary.main') => ({
    transition: transitions.emphasized,
    '&:hover': {
      boxShadow: `0 0 20px rgba(83, 45, 142, 0.3)`,
    },
  }) as SxProps<Theme>,

  brighten: {
    transition: transitions.standard,
    '&:hover': {
      filter: 'brightness(1.05)',
    },
  } as SxProps<Theme>,

  imageZoom: {
    overflow: 'hidden',
    '& img': {
      transition: transitions.emphasized,
    },
    '&:hover img': {
      transform: 'scale(1.08)',
    },
  } as SxProps<Theme>,
};

// Animation delay helper
export const getAnimationDelay = (index: number, baseDelay: number = 0.1): string => {
  return `${index * baseDelay}s`;
};

// Staggered animation sx generator
export const staggeredAnimation = (
  animation: string,
  index: number,
  baseDelay: number = 0.1
): SxProps<Theme> => ({
  animation: `${animation} 0.5s ease-out forwards`,
  animationDelay: getAnimationDelay(index, baseDelay),
  opacity: 0,
});

// Framer Motion variants (for pages using framer-motion)
export const framerVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 },
  },
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};
