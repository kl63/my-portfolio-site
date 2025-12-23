import { useEffect, useState } from 'react'
import prefersReducedMotion from 'prefers-reduced-motion'

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has reduced motion preference enabled
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    // Check user's motion preference
    const reducedMotion = prefersReducedMotion()
    setShouldReduceMotion(reducedMotion === 'reduce')

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return shouldReduceMotion
}

/**
 * Utility function to get animation variants based on motion preference
 */
export function getAnimationProps(shouldReduceMotion: boolean) {
  return {
    initial: shouldReduceMotion ? false : undefined,
    animate: shouldReduceMotion ? false : undefined,
    exit: shouldReduceMotion ? false : undefined,
    transition: shouldReduceMotion ? { duration: 0 } : undefined,
  }
}

/**
 * Get transition duration based on motion preference
 */
export function getTransitionDuration(shouldReduceMotion: boolean, defaultDuration: number = 0.3): number {
  return shouldReduceMotion ? 0 : defaultDuration
}
