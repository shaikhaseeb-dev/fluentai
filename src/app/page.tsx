'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mic, TrendingUp, Zap, Shield, ChevronRight, Star } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Real-Time AI Conversation',
    desc: 'Practice speaking naturally with an AI partner that responds intelligently in under 3 seconds.',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    icon: Zap,
    title: 'Live Grammar Correction',
    desc: 'Gentle, non-judgmental corrections that help you improve without breaking your flow.',
    color: 'bg-accent-100 text-accent-700',
  },
  {
    icon: Shield,
    title: 'Stuck Word Assistant',
    desc: 'AI detects when your mind goes blank and suggests the perfect word to keep you going.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    desc: 'Track your confidence score, grammar improvements, and filler word reduction over time.',
    color: 'bg-orange-100 text-orange-700',
  },
];

const stats = [
  { value: '94%', label: 'Users feel more confident' },
  { value: '<3s', label: 'AI response time' },
  { value: '50+', label: 'Practice topics' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 via-white to-surface-50">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl text-surface-900">FluentAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">
              Start Free <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 badge badge-blue mb-6 py-1.5 px-4 text-sm">
              <Star className="w-3.5 h-3.5" />
              AI-Powered English Speaking Coach
            </div>
            <h1 className="text-5xl md:text-6xl font-display text-surface-900 leading-tight mb-6">
              Speak English with
              <span className="text-primary-700"> Confidence</span>
            </h1>
            <p className="text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice real conversations, get gentle grammar corrections, and unlock your speaking
              potential with intelligent AI coaching — available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary text-base px-8 py-3.5 justify-center">
                Start Practicing Free
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/signin" className="btn-secondary text-base px-8 py-3.5 justify-center">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-12 mt-16"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-display text-primary-700">{s.value}</div>
                <div className="text-sm text-surface-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Simulated UI preview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="card p-0 overflow-hidden shadow-card-hover"
          >
            {/* Mock browser chrome */}
            <div className="bg-surface-100 px-4 py-3 flex items-center gap-2 border-b border-surface-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-surface-400 text-center">
                app.fluentai.com/session
              </div>
            </div>
            {/* Mock session UI */}
            <div className="p-8 bg-white">
              <div className="flex gap-6">
                {/* Sidebar mock */}
                <div className="w-48 flex-shrink-0 space-y-2">
                  {['Dashboard', 'Session', 'Progress', 'Settings'].map((item, i) => (
                    <div key={item} className={`rounded-xl px-3 py-2 text-sm font-medium ${i === 1 ? 'bg-primary-50 text-primary-700' : 'text-surface-500'}`}>
                      {item}
                    </div>
                  ))}
                </div>
                {/* Main area mock */}
                <div className="flex-1 space-y-4">
                  {/* Mic */}
                  <div className="flex flex-col items-center py-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary-700 rounded-full flex items-center justify-center shadow-glow">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping" />
                    </div>
                    {/* Waveform */}
                    <div className="flex items-center gap-1 mt-4">
                      {[3,5,8,6,9,7,5,4].map((h, i) => (
                        <div
                          key={i}
                          className="wave-bar w-1.5 bg-primary-500 rounded-full"
                          style={{ height: `${h * 3}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Transcript */}
                  <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="badge badge-blue flex-shrink-0">AI</span>
                      <p className="text-surface-600">Tell me about a challenging experience you've had recently.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="badge badge-grey flex-shrink-0">You</span>
                      <p className="text-surface-800">Last month I have... uh... I had a difficult presentation at work.</p>
                    </div>
                  </div>
                  {/* Correction card preview */}
                  <div className="correction-card text-sm">
                    <div className="flex items-center gap-1.5 text-correction font-medium mb-2">❌ Improvement Opportunity</div>
                    <p className="text-surface-500 text-xs">You said: "Last month I have"</p>
                    <p className="text-accent-700 text-xs mt-1">✅ Better: "Last month I had"</p>
                    <p className="text-surface-500 text-xs mt-1">💡 Use past tense for completed events.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display text-surface-900 mb-3">Everything you need to speak better</h2>
            <p className="text-surface-500">A complete toolkit designed for real improvement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card hover:shadow-card-hover transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color} mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-surface-900 mb-2">{f.title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display text-surface-900 mb-3">Simple, transparent pricing</h2>
            <p className="text-surface-500">Start free, upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="card">
              <div className="badge badge-grey mb-4">Free</div>
              <div className="text-3xl font-display text-surface-900 mb-1">$0</div>
              <p className="text-surface-500 text-sm mb-6">Forever free</p>
              <ul className="space-y-3 text-sm text-surface-600 mb-8">
                {['5 minutes practice/day', 'Basic grammar correction', 'Session summary', 'Progress tracking'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-accent-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="btn-secondary justify-center w-full">Get Started</Link>
            </div>
            {/* Pro */}
            <div className="card border-primary-200 bg-primary-50 relative">
              <div className="badge badge-blue mb-4">Pro</div>
              <div className="text-3xl font-display text-surface-900 mb-1">$12<span className="text-lg text-surface-500">/mo</span></div>
              <p className="text-surface-500 text-sm mb-6">Cancel anytime</p>
              <ul className="space-y-3 text-sm text-surface-600 mb-8">
                {['Unlimited sessions', 'Stuck Word Assistant', 'Advanced analytics', 'Weekly email report', 'All correction modes'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-accent-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?plan=pro" className="btn-primary justify-center w-full">Start Pro Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-surface-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-700 rounded-md flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </div>
            FluentAI © 2024
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-surface-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-surface-700 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
