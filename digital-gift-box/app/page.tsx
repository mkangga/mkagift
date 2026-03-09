'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiGift, FiUnlock, FiHeart, FiStar, FiZap } from 'react-icons/fi'

const FLOATING_GIFTS = [
  { emoji: '🎁', x: 10, y: 20, delay: 0, scale: 1.2 },
  { emoji: '💝', x: 85, y: 15, delay: 1.5, scale: 0.9 },
  { emoji: '🎀', x: 5, y: 70, delay: 0.8, scale: 1.1 },
  { emoji: '✨', x: 90, y: 60, delay: 2.0, scale: 0.8 },
  { emoji: '🌸', x: 75, y: 80, delay: 0.3, scale: 1.0 },
  { emoji: '🎊', x: 20, y: 85, delay: 1.2, scale: 0.9 },
  { emoji: '💫', x: 50, y: 5, delay: 1.8, scale: 0.7 },
  { emoji: '🌟', x: 40, y: 90, delay: 0.5, scale: 0.8 },
  { emoji: '🎈', x: 60, y: 25, delay: 2.5, scale: 1.0 },
  { emoji: '💕', x: 30, y: 50, delay: 1.0, scale: 0.7 },
]

const FEATURES = [
  { icon: FiHeart, title: 'Personal Messages', desc: 'Write heartfelt notes for someone special' },
  { icon: FiStar, title: 'Beautiful Themes', desc: 'Choose from 5 magical gift themes' },
  { icon: FiZap, title: 'Instant Delivery', desc: 'Share with just a link, no account needed' },
]

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-950 via-purple-950 to-indigo-950 animated-bg">
      {/* Animated mesh gradient background */}
      <div
        className="absolute inset-0 opacity-40 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
            rgba(244,63,94,0.3) 0%, 
            rgba(167,139,250,0.2) 40%, 
            transparent 70%)`,
        }}
      />

      {/* Floating decorations */}
      {FLOATING_GIFTS.map((gift, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none z-10"
          style={{ left: `${gift.x}%`, top: `${gift.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [gift.scale * 0.9, gift.scale * 1.1, gift.scale * 0.9],
            y: [0, -25, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 5 + i * 0.3,
            delay: gift.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span style={{ fontSize: `${gift.scale * 2.5}rem` }}>{gift.emoji}</span>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 glass-card px-5 py-2.5">
            <span className="text-2xl">🎁</span>
            <span className="text-white/80 font-body font-medium tracking-wider text-sm uppercase">
              Digital Gift Box
            </span>
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-6"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            Create a{' '}
            <span
              className="relative inline-block"
              style={{
                WebkitTextStroke: '2px transparent',
                background: 'linear-gradient(135deg, #fb7185, #c084fc, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Magical
            </span>{' '}
            Gift Box
          </h1>
          <p className="font-body text-lg md:text-xl text-white/60 leading-relaxed">
            Send a surprise gift experience to someone special.
            <br className="hidden md:block" />
            Animated reveals, personal messages, and beautiful themes.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link href="/create">
            <motion.button
              className="btn-primary flex items-center gap-3 px-8 py-4 text-base"
              style={{
                background: 'linear-gradient(135deg, #f43f5e, #a855f7)',
                boxShadow: '0 0 30px rgba(244,63,94,0.3)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(244,63,94,0.5)' }}
              whileTap={{ scale: 0.97 }}
            >
              <FiGift className="text-xl" />
              Create Gift Box
            </motion.button>
          </Link>

          <Link href="/open">
            <motion.button
              className="btn-primary flex items-center gap-3 px-8 py-4 text-base glass-card border border-white/20"
              whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              <FiUnlock className="text-xl" />
              Open a Gift Box
            </motion.button>
          </Link>
        </motion.div>

        {/* Big animated gift box hero */}
        <motion.div
          className="relative mb-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, type: 'spring', bounce: 0.4 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Gift shadow */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full"
              style={{ background: 'rgba(0,0,0,0.3)', filter: 'blur(10px)' }}
              animate={{ scaleX: [1, 0.8, 1], opacity: [0.5, 0.3, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Giant gift emoji with glow */}
            <div
              className="text-9xl md:text-[10rem] relative z-10 select-none"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(244,63,94,0.6)) drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
              }}
            >
              🎁
            </div>

            {/* Sparkles around the box */}
            {['✨', '⭐', '💫', '✦'].map((spark, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl select-none"
                style={{
                  top: `${[20, 10, 70, 40][i]}%`,
                  left: `${[-20, 90, -15, 95][i]}%`,
                }}
                animate={{
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.3, 1, 0.3],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                {spark}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full mb-12"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card p-5 text-center card-glow"
              style={{ '--glow-color': 'rgba(244,63,94,0.15)' } as React.CSSProperties}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.3), rgba(168,85,247,0.3))' }}
              >
                <feature.icon className="text-white text-xl" />
              </div>
              <h3 className="font-body font-semibold text-white mb-1">{feature.title}</h3>
              <p className="font-body text-sm text-white/50">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Theme Preview Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-3 flex-wrap justify-center"
        >
          {[
            { emoji: '💕', name: 'Romantic', colors: 'from-rose-500 to-pink-500' },
            { emoji: '🎂', name: 'Birthday', colors: 'from-violet-500 to-purple-500' },
            { emoji: '🌸', name: 'Cute', colors: 'from-pink-500 to-orange-400' },
            { emoji: '🤍', name: 'Minimal', colors: 'from-zinc-600 to-zinc-500' },
            { emoji: '🌌', name: 'Galaxy', colors: 'from-blue-600 to-violet-600' },
          ].map((theme, i) => (
            <motion.div
              key={theme.name}
              className="flex items-center gap-2 glass-card px-4 py-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.colors}`} />
              <span className="text-sm">{theme.emoji}</span>
              <span className="text-white/60 text-sm font-body">{theme.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-white/30 text-sm font-body text-center"
        >
          Made with 💕 to bring joy to the people you love
        </motion.p>
      </div>
    </main>
  )
}
