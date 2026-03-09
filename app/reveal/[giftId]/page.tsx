'use client'

export const runtime = 'edge';

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiExternalLink, FiArrowLeft, FiMusic, FiVolumeX } from 'react-icons/fi'
import { getTheme, type Theme } from '@/lib/themes'
import type { GiftBoxWithLinks } from '@/lib/db'

type Step = 'loading' | 'intro' | 'opening' | 'message' | 'gifts'

let confettiInstance: ((opts: object) => void) | null = null

async function loadConfetti() {
  if (confettiInstance) return confettiInstance
  const mod = await import('canvas-confetti')
  confettiInstance = mod.default
  return confettiInstance
}

function ParticleField({ theme }: { theme: Theme }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {theme.particleEmoji.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-2xl"
          initial={{
            x: `${(i * 17 + 5) % 95}vw`,
            y: '110vh',
            opacity: 0,
          }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.6, 0.6, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            delay: i * 1.2,
            ease: 'linear',
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  )
}

function GiftLidAnimation({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.div
      className="absolute -top-2 left-0 right-0 z-20"
      animate={isOpen ? {
        rotateX: -160,
        y: -80,
        opacity: 0,
        scaleY: 0.5,
      } : {
        rotateX: 0,
        y: 0,
        opacity: 1,
        scaleY: 1,
      }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformOrigin: 'top center', perspective: 600 }}
    >
      {/* Lid */}
      <div
        className="h-14 rounded-t-2xl relative mx-[-4px]"
        style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
      >
        {/* Ribbon on lid */}
        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center">
          <div className="w-3 h-full bg-amber-400/80" />
        </div>
        {/* Bow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
          <div className="w-6 h-4 bg-amber-400 rounded-full transform -rotate-45" />
          <div className="w-6 h-4 bg-amber-400 rounded-full transform rotate-45" />
          <div className="absolute inset-x-0 -top-1 flex justify-center">
            <div className="w-4 h-4 bg-amber-300 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function GiftRevealPage() {
  const params = useParams()
  const router = useRouter()
  const giftId = params.giftId as string

  const [step, setStep] = useState<Step>('loading')
  const [gift, setGift] = useState<GiftBoxWithLinks | null>(null)
  const [theme, setTheme] = useState<Theme>(getTheme('romantic'))
  const [error, setError] = useState('')
  const [isBoxOpen, setIsBoxOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [shaking, setShaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    async function fetchGift() {
      try {
        const res = await fetch(`/api/gifts/${encodeURIComponent(giftId)}`)
        if (!res.ok) {
          setError('Gift not found or has expired.')
          setStep('intro')
          return
        }
        const data: GiftBoxWithLinks = await res.json()
        setGift(data)
        setTheme(getTheme(data.theme))
        setStep('intro')
      } catch {
        setError('Failed to load gift.')
        setStep('intro')
      }
    }
    fetchGift()
  }, [giftId])

  const triggerConfetti = useCallback(async () => {
    const confetti = await loadConfetti()
    const colors = ['#ff0000', '#ff69b4', '#ffd700', '#ff4500', '#00ff00', '#4169e1', '#ff1493']

    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors })
    setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 }, colors }), 200)
    setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 }, colors }), 400)
    setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.3 }, colors, scalar: 1.5 }), 800)
  }, [])

  const handleOpenGift = useCallback(async () => {
    // Shake animation
    setShaking(true)
    await new Promise((r) => setTimeout(r, 400))
    setShaking(false)
    await new Promise((r) => setTimeout(r, 100))
    setShaking(true)
    await new Promise((r) => setTimeout(r, 400))
    setShaking(false)

    setStep('opening')

    // Open box
    await new Promise((r) => setTimeout(r, 300))
    setIsBoxOpen(true)

    // Confetti!
    await new Promise((r) => setTimeout(r, 400))
    await triggerConfetti()

    // Show message
    await new Promise((r) => setTimeout(r, 600))
    setStep('message')

    // Show gifts
    await new Promise((r) => setTimeout(r, 2000))
    setStep('gifts')
  }, [triggerConfetti])

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/gift-music.mp3')
      audioRef.current.loop = true
    }
    if (musicOn) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setMusicOn(!musicOn)
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 to-purple-950 flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎁
          </motion.div>
          <p className="text-white/60 font-body">Preparing your gift...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-sm text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-display text-2xl text-white mb-2">Gift Not Found</h2>
          <p className="text-white/50 font-body mb-6">{error}</p>
          <button
            onClick={() => router.push('/open')}
            className="btn-primary px-6 py-3"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}>
      <ParticleField theme={theme} />

      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none z-1"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Controls */}
      <div className="fixed top-4 left-4 right-4 flex items-center justify-between z-50">
        <button
          onClick={() => router.push('/open')}
          className="glass-card p-2.5 text-white/50 hover:text-white transition-colors"
        >
          <FiArrowLeft />
        </button>
        <button
          onClick={toggleMusic}
          className="glass-card p-2.5 text-white/50 hover:text-white transition-colors"
        >
          {musicOn ? <FiMusic /> : <FiVolumeX />}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <AnimatePresence mode="wait">
          {/* ── INTRO STEP ── */}
          {step === 'intro' && gift && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center max-w-lg mx-auto"
            >
              {/* Glow behind box */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse, ${theme.glowColor} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                }}
              />

              {/* Gift box */}
              <motion.div
                className="relative inline-block mb-8"
                animate={shaking ? {
                  x: [-8, 8, -6, 6, -4, 4, 0],
                  rotate: [-3, 3, -2, 2, 0],
                } : {
                  y: [0, -15, 0],
                }}
                transition={shaking
                  ? { duration: 0.4 }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <span
                  className="text-[8rem] md:text-[10rem] select-none block"
                  style={{
                    filter: `drop-shadow(0 0 50px ${theme.glowColor}) drop-shadow(0 30px 40px rgba(0,0,0,0.5))`,
                  }}
                >
                  🎁
                </span>

                {/* Sparkles */}
                {['✨', '⭐', '💫'].map((s, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-xl select-none"
                    style={{
                      top: ['0%', '60%', '20%'][i],
                      left: ['-25%', '-20%', '105%'][i],
                    }}
                    animate={{ scale: [0.5, 1.3, 0.5], opacity: [0.3, 1, 0.3], rotate: [0, 360] }}
                    transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className={`${theme.textSecondary} text-sm font-body uppercase tracking-widest mb-3`}>
                  You have a gift! 🎀
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                  A gift from
                </h1>
                <h2
                  className="font-display text-4xl md:text-5xl font-bold mb-8"
                  style={{ color: theme.accentColor }}
                >
                  {gift.sender_name}
                </h2>

                <motion.button
                  onClick={handleOpenGift}
                  className="btn-primary px-10 py-5 text-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentColor}, rgba(168,85,247,0.8))`,
                    boxShadow: `0 0 40px ${theme.glowColor}, 0 20px 40px rgba(0,0,0,0.3)`,
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: `0 0 60px ${theme.glowColor}, 0 30px 50px rgba(0,0,0,0.4)`,
                  }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      `0 0 30px ${theme.glowColor}`,
                      `0 0 60px ${theme.glowColor}`,
                      `0 0 30px ${theme.glowColor}`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Open Gift 🎁
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* ── OPENING ANIMATION ── */}
          {step === 'opening' && (
            <motion.div
              key="opening"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="relative inline-block">
                {/* Box body */}
                <motion.div
                  className="relative w-48 h-40"
                  animate={isBoxOpen ? {
                    scale: [1, 1.2, 1.3],
                    opacity: [1, 1, 0],
                  } : {}}
                  transition={{ duration: 1.2 }}
                >
                  {/* Lid */}
                  <GiftLidAnimation isOpen={isBoxOpen} />

                  {/* Box */}
                  <div
                    className="absolute inset-0 top-12 rounded-b-2xl flex items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                  >
                    {/* Ribbon on box */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-full bg-amber-400/60" />
                    </div>

                    {/* Light burst from inside */}
                    <AnimatePresence>
                      {isBoxOpen && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 20, opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute w-12 h-12 rounded-full"
                          style={{ background: `radial-gradient(${theme.accentColor}, transparent)` }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Explosion particles */}
                <AnimatePresence>
                  {isBoxOpen && theme.particleEmoji.map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-3xl select-none"
                      style={{ top: '50%', left: '50%' }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: (Math.cos((i / theme.particleEmoji.length) * Math.PI * 2) * 200),
                        y: (Math.sin((i / theme.particleEmoji.length) * Math.PI * 2) * 200),
                        opacity: 0,
                        scale: 1.5,
                      }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* ── MESSAGE STEP ── */}
          {(step === 'message' || step === 'gifts') && gift && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-2xl mx-auto space-y-6"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-2"
              >
                <p className={`${theme.textSecondary} text-sm font-body tracking-widest uppercase mb-1`}>
                  A special message for
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                  {gift.recipient_name} 🎀
                </h1>
              </motion.div>

              {/* Message card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0.3, delay: 0.2 }}
                className={`${theme.cardBg} border ${theme.cardBorder} rounded-3xl p-8 relative overflow-hidden`}
                style={{ boxShadow: `0 0 60px ${theme.glowColor}` }}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-4xl opacity-20 select-none">
                  {theme.particleEmoji[0]}
                </div>
                <div className="absolute bottom-4 left-4 text-4xl opacity-10 select-none rotate-12">
                  {theme.particleEmoji[1]}
                </div>

                {/* Quote mark */}
                <div
                  className="font-display text-6xl leading-none mb-4 opacity-40"
                  style={{ color: theme.accentColor }}
                >
                  "
                </div>

                <p className={`font-body text-lg md:text-xl ${theme.textPrimary} leading-relaxed whitespace-pre-wrap`}>
                  {gift.message}
                </p>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className={`font-display text-lg ${theme.textSecondary}`}>
                    — {gift.sender_name}
                  </p>
                  <span className="text-2xl">{theme.emoji}</span>
                </div>
              </motion.div>

              {/* Gift Links */}
              <AnimatePresence>
                {step === 'gifts' && gift.links && gift.links.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${theme.textSecondary} text-sm font-body text-center uppercase tracking-wider mb-4`}
                    >
                      Your gifts are here ✨
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {gift.links.map((link, i) => (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            delay: i * 0.15,
                            type: 'spring',
                            bounce: 0.4,
                          }}
                          whileHover={{
                            scale: 1.03,
                            boxShadow: `0 0 30px ${theme.glowColor}`,
                          }}
                          whileTap={{ scale: 0.97 }}
                          className={`block ${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-5 cursor-pointer group transition-all relative overflow-hidden`}
                        >
                          {/* Shimmer on hover */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity shimmer rounded-2xl" />

                          <div className="relative flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${theme.glowColor}, transparent)`,
                                border: `1px solid rgba(255,255,255,0.1)`,
                              }}
                            >
                              🎁
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-body font-semibold truncate">{link.title}</p>
                              <p className={`${theme.textSecondary} text-xs font-body truncate mt-0.5`}>
                                {link.url}
                              </p>
                            </div>
                            <FiExternalLink
                              className="text-white/30 group-hover:text-white/80 transition-colors flex-shrink-0"
                            />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center pt-4 pb-8"
              >
                <p className={`${theme.textSecondary} text-sm font-body opacity-50`}>
                  Made with love using Digital Gift Box 🎁
                </p>
                <Link href="/create">
                  <button className="mt-3 text-white/30 hover:text-white/60 text-xs font-body underline underline-offset-4 transition-colors">
                    Create your own gift →
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
