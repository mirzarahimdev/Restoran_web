import type { CSSProperties } from 'react'

type IconProps = {
  name: string
  className?: string
  filled?: boolean
  style?: CSSProperties
}

export function Icon({ name, className = '', filled = false, style }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        ...style,
      }}
      aria-hidden
    >
      {name}
    </span>
  )
}
