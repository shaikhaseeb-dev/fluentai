'use client';

import Link from 'next/link';
import { Mic, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function QuickStart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-primary-700 to-primary-900 text-white border-0 shadow-glow"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl mb-1">Ready to practice?</h3>
          <p className="text-primary-200 text-sm">Start a new session and keep building your confidence.</p>
        </div>
        <Link
          href="/dashboard/session"
          className="flex items-center gap-2 bg-white text-primary-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors flex-shrink-0 text-sm"
        >
          <Mic className="w-4 h-4" />
          Start Now
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
