export type ThemeKey = 'romantic' | 'birthday' | 'cute' | 'minimal' | 'galaxy'

export type Theme = {
  key: ThemeKey
  name: string
  emoji: string
  description: string
  gradient: string
  cardBg: string
  cardBorder: string
  textPrimary: string
  textSecondary: string
  accentColor: string
  buttonGradient: string
  particleEmoji: string[]
  fontClass: string
  glowColor: string
  overlayClass: string
}

export const themes: Record<ThemeKey, Theme> = {
  romantic: {
    key: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    description: 'Soft pink love vibes',
    gradient: 'from-rose-950 via-pink-900 to-rose-950',
    cardBg: 'bg-rose-900/40',
    cardBorder: 'border-rose-400/30',
    textPrimary: 'text-rose-50',
    textSecondary: 'text-rose-200',
    accentColor: '#fb7185',
    buttonGradient: 'from-rose-500 to-pink-500',
    particleEmoji: ['💕', '💖', '🌹', '💝', '✨', '🌸'],
    fontClass: 'font-display',
    glowColor: 'rgba(251, 113, 133, 0.4)',
    overlayClass: 'bg-rose-500/5',
  },
  birthday: {
    key: 'birthday',
    name: 'Birthday',
    emoji: '🎂',
    description: 'Festive & colorful',
    gradient: 'from-violet-950 via-purple-900 to-indigo-950',
    cardBg: 'bg-violet-900/40',
    cardBorder: 'border-violet-400/30',
    textPrimary: 'text-violet-50',
    textSecondary: 'text-violet-200',
    accentColor: '#a78bfa',
    buttonGradient: 'from-violet-500 to-purple-500',
    particleEmoji: ['🎂', '🎉', '🎈', '🎊', '⭐', '🥳'],
    fontClass: 'font-body',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    overlayClass: 'bg-violet-500/5',
  },
  cute: {
    key: 'cute',
    name: 'Cute',
    emoji: '🌸',
    description: 'Pastel kawaii style',
    gradient: 'from-amber-950 via-orange-900 to-pink-950',
    cardBg: 'bg-pink-900/40',
    cardBorder: 'border-pink-400/30',
    textPrimary: 'text-pink-50',
    textSecondary: 'text-pink-200',
    accentColor: '#f472b6',
    buttonGradient: 'from-pink-500 to-orange-400',
    particleEmoji: ['🌸', '⭐', '🍭', '🌈', '✨', '🦋'],
    fontClass: 'font-display',
    glowColor: 'rgba(244, 114, 182, 0.4)',
    overlayClass: 'bg-pink-500/5',
  },
  minimal: {
    key: 'minimal',
    name: 'Minimal',
    emoji: '🤍',
    description: 'Clean & elegant',
    gradient: 'from-zinc-950 via-stone-900 to-zinc-950',
    cardBg: 'bg-zinc-900/60',
    cardBorder: 'border-zinc-600/40',
    textPrimary: 'text-zinc-50',
    textSecondary: 'text-zinc-300',
    accentColor: '#a1a1aa',
    buttonGradient: 'from-zinc-600 to-zinc-500',
    particleEmoji: ['✦', '◆', '●', '▲', '◉', '✧'],
    fontClass: 'font-body',
    glowColor: 'rgba(161, 161, 170, 0.3)',
    overlayClass: 'bg-zinc-500/5',
  },
  galaxy: {
    key: 'galaxy',
    name: 'Galaxy',
    emoji: '🌌',
    description: 'Deep space magic',
    gradient: 'from-slate-950 via-blue-950 to-violet-950',
    cardBg: 'bg-blue-950/50',
    cardBorder: 'border-blue-400/20',
    textPrimary: 'text-blue-50',
    textSecondary: 'text-blue-200',
    accentColor: '#60a5fa',
    buttonGradient: 'from-blue-600 to-violet-600',
    particleEmoji: ['⭐', '🌟', '💫', '✨', '🪐', '☄️'],
    fontClass: 'font-body',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    overlayClass: 'bg-blue-500/5',
  },
}

export function getTheme(key: string): Theme {
  return themes[(key as ThemeKey)] ?? themes.romantic
}
