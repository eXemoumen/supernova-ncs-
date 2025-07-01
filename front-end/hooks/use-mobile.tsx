import * as React from "react"

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

type Breakpoint = keyof typeof breakpoints

export function useBreakpoint(breakpoint: Breakpoint) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`)
    const onChange = () => {
      setMatches(mql.matches)
    }
    mql.addEventListener("change", onChange)
    setMatches(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [breakpoint])

  return matches
}

export function useIsMobile() {
  return !useBreakpoint("md")
}

export function useIsTablet() {
  const isLargerThanMobile = useBreakpoint("md")
  const isSmallerThanDesktop = !useBreakpoint("lg")
  return isLargerThanMobile && isSmallerThanDesktop
}

export function useIsDesktop() {
  return useBreakpoint("lg")
}

export function useOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')

  React.useEffect(() => {
    const updateOrientation = () => {
      if (typeof window !== 'undefined') {
        setOrientation(
          window.screen.orientation?.type.includes('landscape') ? 'landscape' : 'portrait'
        )
      }
    }

    updateOrientation()
    window.addEventListener('orientationchange', updateOrientation)
    return () => window.removeEventListener('orientationchange', updateOrientation)
  }, [])

  return orientation
}

export function useTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false)

  React.useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}

export function usePrefersDarkMode() {
  const [prefersDark, setPrefersDark] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setPrefersDark(mql.matches)
    
    mql.addEventListener('change', onChange)
    setPrefersDark(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return prefersDark
}

export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setPrefersReduced(mql.matches)
    
    mql.addEventListener('change', onChange)
    setPrefersReduced(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return prefersReduced
}
