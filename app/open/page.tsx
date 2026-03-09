'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiArrowLeft, FiLock, FiUnlock, FiGift } from 'react-icons/fi'

function OpenGiftForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [giftId, setGiftId] = useState(searchParams.get('id') || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const handleSubmit = async () => {
    if (!giftId || !password) {
      setError('Please fill in both fields.')
      triggerShake()
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/gifts/${encodeURIComponent(giftId.toLowerCase().trim())}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid Gift ID or password.')
        triggerShake()
        return
      }

      setUnlocked(true)
      setTimeout(() => {
        router.push(`/reveal/${encodeURIComponent(giftId.toLowerCase().trim())}`)
      }, 1000)
    } catch {
      setError('Something went wrong. Please try again.')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-rose-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Link href="/">
            <button className="glass-card px-4 py-2 flex items-center gap-2 text-white/60 hover:text-white text-sm font-body transition-colors">
              <FiArrowLeft />
              Back to Home
            </button>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
          className={`glass-card p-8 ${shake ? 'animate-shake' : ''}`}
        >
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="relative"
              animate={unlocked ? { scale: [1, 1.3, 1] } : {}}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: unlocked
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(16,185,129,0.2))'
                    : 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(168,85,247,0.2))',
                  border: `2px solid ${unlocked ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: unlocked
                    ? '0 0 40px rgba(34,197,94,0.3)'
                    : '0 0 30px rgba(244,63,94,0.15)',
                }}
                animate={
                  !unlocked && !loading
                    ? { boxShadow: ['0 0 20px rgba(168,85,247,0.2)', '0 0 40px rgba(244,63,94,0.3)', '0 0 20px rgba(168,85,247,0.2)'] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AnimatePresence mode="wait">
                  {unlocked ? (
                    <motion.div
                      key="unlocked"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-3xl"
                    >
                      🎁
                    </motion.div>
                  ) : loading ? (
                    <motion.div
                      key="loading"
                      className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <motion.div
                      key="locked"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <FiLock className="text-white text-3xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Pulse ring */}
              {!unlocked && !loading && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-white/10"
                  animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              {unlocked ? 'Gift Unlocked! 🎉' : 'Open Your Gift 🎁'}
            </h1>
            <p className="font-body text-white/50 text-sm">
              {unlocked
                ? 'Preparing your magical experience...'
                : 'Enter the Gift Box ID and password to reveal your surprise'}
            </p>
          </div>

          {/* Form */}
          <AnimatePresence>
            {!unlocked && (
              <motion.div
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-white/40 text-xs font-body uppercase tracking-wider mb-2 block">
                    Gift Box ID
                  </label>
                  <div className="relative">
                    <input
                      className="gift-input pr-10"
                      placeholder="e.g. sarah-bday-2024"
                      value={giftId}
                      onChange={(e) => setGiftId(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <FiGift className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs font-body uppercase tracking-wider mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="gift-input pr-10"
                      type="password"
                      placeholder="Enter the secret password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-card p-3 border border-rose-500/40 text-rose-300 text-sm font-body flex items-center gap-2"
                    >
                      <span>⚠️</span> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-base"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
                    boxShadow: '0 0 30px rgba(244,63,94,0.3)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(244,63,94,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUnlock className="text-xl" />
                  Open Gift Box
                </motion.button>

                <p className="text-white/30 text-xs text-center font-body pt-2">
                  Don&apos;t have a code? Ask the gift sender to share the link with you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success animation */}
          <AnimatePresence>
            {unlocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-4xl"
                >
                  ✨
                </motion.div>
                <p className="text-white/60 font-body text-sm mt-2">Redirecting to your gift...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Create gift CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-white/30 text-sm font-body">
            Want to send a gift?{' '}
            <Link href="/create" className="text-white/60 hover:text-white underline underline-offset-4 transition-colors">
              Create a Gift Box
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}

export default function OpenGiftPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-indigo-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <OpenGiftForm />
    </Suspense>
  )
}
