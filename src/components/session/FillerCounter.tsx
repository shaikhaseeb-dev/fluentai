'use client';

import { motion } from 'framer-motion';

interface Props {
  counts: Record<string, number>;
}

export function FillerCounter({ counts: rawCounts }: Props) {
  const counts = Object.entries(rawCounts).filter(([, v]) => v > 0);
  if (counts.length === 0) return null;

  const total = counts.reduce((a, [, v]) => a + v, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-wrap items-center gap-2 justify-center"
    >
      <span className="text-xs text-surface-500">Fillers detected:</span>
      {counts.map(([word, count]) => (
        <span
          key={word}
          className="badge badge-red text-xs"
        >
          "{word}" × {count}
        </span>
      ))}
      {total > 3 && (
        <span className="text-xs text-surface-400">({total} total)</span>
      )}
    </motion.div>
  );
}
