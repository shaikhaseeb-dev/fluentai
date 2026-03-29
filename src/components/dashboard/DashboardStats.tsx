'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  subtext: string;
  trend: string;
  positive: boolean;
}

export function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="card"
        >
          <p className="text-xs text-surface-500 mb-2">{stat.label}</p>
          <p className="text-2xl font-display text-surface-900 mb-1">{stat.value}</p>
          <div className="flex items-center gap-1">
            {stat.positive ? (
              <TrendingUp className="w-3 h-3 text-accent-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-correction" />
            )}
            <span className={`text-xs font-medium ${stat.positive ? 'text-accent-600' : 'text-correction'}`}>
              {stat.trend}
            </span>
            <span className="text-xs text-surface-400">{stat.subtext}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
