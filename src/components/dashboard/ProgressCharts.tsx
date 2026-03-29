'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

interface DataPoint {
  date: string;
  confidence: number;
  fillers: number;
  corrections: number;
}

export function ProgressCharts({ data }: { data: DataPoint[] }) {
  if (!data?.length) {
    return (
      <div className="card text-center py-10">
        <p className="text-surface-400">Complete your first session to see progress charts.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Confidence trend */}
      <div className="card">
        <h3 className="font-semibold text-surface-800 mb-4">Confidence Score Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              formatter={(val: number) => [val.toFixed(1), 'Confidence']}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#1d4ed8"
              strokeWidth={2.5}
              dot={{ fill: '#1d4ed8', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filler word trend */}
      <div className="card">
        <h3 className="font-semibold text-surface-800 mb-4">Filler Words Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              formatter={(val: number) => [val, 'Fillers']}
            />
            <Line
              type="monotone"
              dataKey="fillers"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-accent-600 mt-2">↓ Lower is better. You're improving!</p>
      </div>
    </div>
  );
}
