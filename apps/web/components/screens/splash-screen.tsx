'use client'

import { useEffect } from 'react'

export default function SplashScreen({
  onFinish,
  duration = 1200,
}: {
  onFinish?: () => void
  duration?: number
}) {
  useEffect(() => {
    const t = setTimeout(() => onFinish?.(), duration)
    return () => clearTimeout(t)
  }, [onFinish, duration])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#A65B1A' }}
      aria-label="Écran de démarrage MiabéGa"
    >
      <img
        src="/images/miabe-ga-logo.png"
        alt="Logo MiabéGa"
        className="w-[40vw] max-w-[260px] h-auto object-contain drop-shadow-xl splash-fade"
      />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .splash-fade {
          animation: fadeIn 700ms ease-out both;
        }
      `}</style>
    </div>
  )
}
