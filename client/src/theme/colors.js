// Consistent color palette for the entire application
export const colors = {
  // Primary gradients
  primary: {
    gradient: 'linear(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    gradientHover: 'linear(135deg, #5a6fd8 0%, #6a4190 50%, #de7ee9 100%)',
  },
  
  // Page-specific gradients
  landing: {
    gradient: 'linear(135deg, blue.600 0%, purple.600 50%, pink.500 100%)',
    pattern: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
    patternSize: '50px 50px'
  },
  
  login: {
    gradient: 'linear(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    pattern: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
    patternSize: '50px 50px'
  },
  
  signup: {
    gradient: 'linear(135deg, #764ba2 0%, #f093fb 50%, #ff9a9e 100%)',
    pattern: 'radial-gradient(circle at 75% 25%, white 2px, transparent 2px)',
    patternSize: '60px 60px'
  },
  
  dashboard: {
    gradient: 'linear(to-b, gray.900, gray.950)',
  },
  
  // Button gradients
  buttons: {
    primary: 'linear(to-r, #667eea, #764ba2)',
    primaryHover: 'linear(to-r, #5a6fd8, #6a4190)',
    secondary: 'linear(to-r, #764ba2, #f093fb)',
    secondaryHover: 'linear(to-r, #6a4190, #de7ee9)',
    success: 'linear(to-r, #56ab2f, #a8e6cf)',
    successHover: 'linear(to-r, #4e9a2a, #96d4b7)',
  },
  
  // Card and component colors
  card: {
    bg: 'white',
    bgDark: 'gray.800',
    border: 'gray.200',
    borderDark: 'gray.600',
  }
};

export const animations = {
  // Common animation variants
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  
  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  },
  
  fadeInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },
  
  hoverLift: {
    whileHover: { y: -5, transition: { duration: 0.2 } }
  }
};
