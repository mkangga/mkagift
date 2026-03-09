'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiArrowLeft, FiPlus, FiTrash2, FiCopy, FiCheck, FiLink, FiEye, FiSave } from 'react-icons/fi'
import { themes, type ThemeKey } from '@/lib/themes'

type GiftLink = { title: string; url: string; id: string }

const THEME_KEYS = Object.values(themes)

export default function CreateGiftPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [createdGiftId, setCreatedGiftId] = useState('')
  const [giftLink, setGiftLink] = useState('')

  const [form, setForm] = useState({
    giftId: '',
    password: '',
    senderName: '',
    recipientName: '',
    message: '',
    theme: 'romantic' as ThemeKey,
  })

  const [links, setLinks] = useState<GiftLink[]>([
    { title: '', url: '', id: '1' },
  ])

  const currentTheme = themes[form.theme]

  const handleAddLink = () => {
    setLinks([...links, { title: '', url: '', id: Date.now().toString() }])
  }

  const handleRemoveLink = (id: string) => {
    if (links.length === 1) return
    setLinks(links.filter((l) => l.id !== id))
  }

  const handleLinkChange = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  const handleSubmit = useCallback(async () => {
    setError('')
    if (!form.giftId || !form.password || !form.senderName || !form.recipientName || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.giftId.length < 4) {
      setError('Gift ID must be at least 4 characters.')
      return
    }
    const validLinks = links.filter((l) => l.title && l.url)

    setLoading(true)
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: form.giftId.toLowerCase().replace(/\s+/g, '-'),
          password: form.password,
          senderName: form.senderName,
          recipientName: form.recipientName,
          message: form.message,
          theme: form.theme,
          links: validLinks,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setCreatedGiftId(data.giftId)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      setGiftLink(`${appUrl}/open?id=${data.giftId}`)
      setStep('success')
    } catch {
      setError('Failed to create gift. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [form, links])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === 'success') {
    return (
      <main className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center p-4`}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-7xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Gift Box Created!
          </h2>
          <p className={`font-body ${currentTheme.textSecondary} mb-8`}>
            Your magical gift is ready to be opened by {form.recipientName}
          </p>

          <div className="space-y-4 mb-8">
            <div className="glass-card-light p-4 rounded-xl text-left">
              <p className="text-white/40 text-xs font-body mb-1 uppercase tracking-wider">Gift Box ID</p>
              <div className="flex items-center justify-between">
                <code className="text-white font-mono text-lg">{createdGiftId}</code>
                <button
                  onClick={() => handleCopy(createdGiftId)}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>

            <div className="glass-card-light p-4 rounded-xl text-left">
              <p className="text-white/40 text-xs font-body mb-1 uppercase tracking-wider">Share Link</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-white/80 text-sm font-body truncate">{giftLink}</p>
                <button
                  onClick={() => handleCopy(giftLink)}
                  className="text-white/60 hover:text-white transition-colors p-2 flex-shrink-0"
                >
                  {copied ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/open?id=${createdGiftId}`}>
              <button
                className={`btn-primary w-full bg-gradient-to-r ${currentTheme.buttonGradient} py-3`}
                style={{ boxShadow: `0 0 30px ${currentTheme.glowColor}` }}
              >
                Preview Gift Experience 👀
              </button>
            </Link>
            <button
              onClick={() => router.push('/')}
              className="text-white/50 hover:text-white text-sm font-body transition-colors py-2"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} relative`}>
      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {currentTheme.particleEmoji.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl opacity-10 select-none"
            style={{
              left: `${(i * 17 + 5) % 95}%`,
              top: `${(i * 23 + 10) % 90}%`,
            }}
            animate={{ y: [0, -20, 0], rotate: [-10, 10, -10] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7 }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <motion.button
              className="glass-card p-3 text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="text-lg" />
            </motion.button>
          </Link>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Create Your Gift Box 🎁
            </h1>
            <p className="font-body text-white/50 text-sm">Fill in the details to create a magical experience</p>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="ml-auto glass-card px-4 py-2 flex items-center gap-2 text-white/70 hover:text-white text-sm font-body transition-colors"
          >
            <FiEye className="text-base" />
            <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
        </motion.div>

        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {/* Gift Identity */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                🔑 Gift Identity
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-body uppercase tracking-wider mb-2 block">
                    Gift Box ID *
                  </label>
                  <input
                    className="gift-input"
                    placeholder="e.g. sarah-bday-2024"
                    value={form.giftId}
                    onChange={(e) => setForm({ ...form, giftId: e.target.value })}
                  />
                  <p className="text-white/30 text-xs mt-1 font-body">Must be unique</p>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-body uppercase tracking-wider mb-2 block">
                    Password *
                  </label>
                  <input
                    className="gift-input"
                    type="password"
                    placeholder="Set a secret password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* People */}
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-white">💌 From & To</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-body uppercase tracking-wider mb-2 block">
                    Your Name *
                  </label>
                  <input
                    className="gift-input"
                    placeholder="Sender name"
                    value={form.senderName}
                    onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-body uppercase tracking-wider mb-2 block">
                    Recipient Name *
                  </label>
                  <input
                    className="gift-input"
                    placeholder="Their name"
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-4">💬 Your Message *</h2>
              <textarea
                className="gift-input min-h-[120px] resize-none"
                placeholder={`Write something heartfelt...\n\n"Hey ${form.recipientName || 'there'}, I made this little surprise just for you. Hope it makes you smile! 🌸"`}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            {/* Theme */}
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-4">🎨 Choose Theme</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {THEME_KEYS.map((theme) => (
                  <motion.button
                    key={theme.key}
                    onClick={() => setForm({ ...form, theme: theme.key })}
                    className={`relative p-3 rounded-xl border-2 transition-all ${
                      form.theme === theme.key
                        ? 'border-white/60 scale-105'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{
                      background:
                        form.theme === theme.key
                          ? `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`
                          : 'rgba(255,255,255,0.03)',
                    }}
                    whileHover={{ scale: form.theme === theme.key ? 1.05 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="text-2xl mb-1">{theme.emoji}</div>
                    <div className="text-white/70 text-xs font-body">{theme.name}</div>
                    {form.theme === theme.key && (
                      <motion.div
                        layoutId="theme-selected"
                        className="absolute inset-0 rounded-xl border-2 border-white/40"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Gift Links */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-white">🔗 Gift Links</h2>
                <motion.button
                  onClick={handleAddLink}
                  className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-body transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlus /> Add Link
                </motion.button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {links.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-card-light p-4 rounded-xl"
                    >
                      <div className="flex gap-3 items-start">
                        <FiLink className="text-white/30 mt-3 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <input
                            className="gift-input text-sm py-2"
                            placeholder="Title (e.g. My Spotify Playlist)"
                            value={link.title}
                            onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)}
                          />
                          <input
                            className="gift-input text-sm py-2"
                            placeholder="URL (https://...)"
                            value={link.url}
                            onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveLink(link.id)}
                          className="text-white/20 hover:text-rose-400 transition-colors mt-2 p-1"
                          disabled={links.length === 1}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-4 border border-rose-500/30 text-rose-300 text-sm font-body"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-base"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.accentColor}, rgba(168,85,247,0.8))`,
                boxShadow: `0 0 30px ${currentTheme.glowColor}`,
              }}
              whileHover={{ scale: 1.02, boxShadow: `0 0 50px ${currentTheme.glowColor}` }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Creating magic...
                </>
              ) : (
                <>
                  <FiSave className="text-xl" />
                  Create Gift Box ✨
                </>
              )}
            </motion.button>
          </motion.div>

          {/* LIVE PREVIEW */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="sticky top-8 h-fit"
              >
                <div className={`rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${currentTheme.gradient} p-6`}>
                  <p className="text-white/40 text-xs uppercase tracking-wider font-body mb-4">
                    Live Preview ✦
                  </p>

                  {/* Preview gift box */}
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="text-6xl mb-3 inline-block"
                      style={{ filter: `drop-shadow(0 0 20px ${currentTheme.glowColor})` }}
                    >
                      🎁
                    </motion.div>
                    <p className="font-display text-white text-lg font-semibold">
                      A gift from {form.senderName || 'you'}
                    </p>
                    <p className={`${currentTheme.textSecondary} text-sm font-body mt-1`}>
                      For {form.recipientName || 'someone special'} 💕
                    </p>
                  </div>

                  {/* Preview message */}
                  {form.message && (
                    <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 mb-4`}>
                      <p className="text-white/80 text-sm font-body leading-relaxed line-clamp-4">
                        {form.message}
                      </p>
                    </div>
                  )}

                  {/* Preview links */}
                  <div className="space-y-2">
                    {links.filter((l) => l.title).map((link, i) => (
                      <div
                        key={link.id}
                        className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl px-4 py-3 flex items-center gap-3`}
                      >
                        <span className="text-lg">🎁</span>
                        <span className="text-white/80 text-sm font-body">{link.title || 'Gift Link'}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-white/20 text-xs text-center mt-4 font-body">
                    Theme: {currentTheme.name} {currentTheme.emoji}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
