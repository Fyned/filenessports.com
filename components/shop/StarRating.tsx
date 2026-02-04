'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  showText?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showText = false,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const value = index + 1
        const isFilled = value <= rating
        const isHalfFilled = value - 0.5 <= rating && value > rating

        return (
          <button
            key={index}
            type={interactive ? 'button' : undefined}
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'cursor-default'
            )}
          >
            {/* Empty star (background) */}
            <Star
              className={cn(
                sizeClasses[size],
                'text-gray-300'
              )}
            />
            {/* Filled star (overlay) */}
            {(isFilled || isHalfFilled) && (
              <Star
                className={cn(
                  sizeClasses[size],
                  'absolute top-0 left-0 text-yellow-400 fill-yellow-400',
                  isHalfFilled && 'clip-path-half'
                )}
                style={isHalfFilled ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
              />
            )}
          </button>
        )
      })}
      {showText && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  )
}
