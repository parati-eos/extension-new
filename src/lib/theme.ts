// src/lib/theme.ts

export const Theme = {
  colors: {
    primary: '#3667B2',
    secondary: '#F5F7FA',
    background: '#FFFFFF',
    grounding: '#17191A',

    button: {
      primary: '#0A8568',
      hover: '#0A8568',
      disabled: '#8A8B8C',
    },

    text: {
      default: '#000000',
      strong: '#091220',
      weak: '#5D5F61',
    },

    stroke: {
      strong: '#8A8B8C',
      weak: '#E1E3E5',
    },

    gradient: {
      secondary1: '#f1f1f3',  // Added for soft top background
      primary1: '#aec2e6',    // Added for subtle mid-tone blend
    },
        error: '#DC2626',
        success: '#16A34A', // Optional: Tailwind's green-600
        warning: '#F59E0B', // Optional: Tailwind's amber-500
        info: '#3B82F6',    // Optional: Tailwind's blue-500
  },

  font: {
    family: "'Inter', sans-serif",
    size: {
      small: '0.875rem',
      base: '1rem',
      large: '1.25rem',
    },
  },

  radius: {
    small: '6px',
    base: '12px',
    large: '20px',
  },

};