'use client';

import { useState } from 'react';
import { Crown, User, Bell, CreditCard } from 'lucide-react';

interface Props {
  user: {
    name: string | null;
    email: string | null;
    plan: string;
    correctionMode: string;
    dailyGoalMinutes: number;
    stripeCurrentPeriodEnd: Date | null;
  };
  userId: string;
}

export function SettingsClient({ user, userId }: Props) {
  const [correctionMode, setCorrectionMode] = useState(user.correctionMode);
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoalMinutes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveSettings() {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correctionMode, dailyGoalMinutes: dailyGoal }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }



  async function startUpgrade() {
  const res = await fetch('/api/stripe/checkout', { method: 'POST' });

  if (!res.ok) {
    console.error("Stripe error");
    return;
  }

  const data = await res.json();
  window.location.href = data.url;
}

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-display text-surface-900">Settings</h1>
        <p className="text-surface-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-surface-500" />
          <h3 className="font-semibold text-surface-800">Profile</h3>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-surface-500">Name</p>
          <p className="text-surface-900 font-medium">{user.name ?? '—'}</p>
        </div>
        <div className="space-y-1 mt-4">
          <p className="text-sm text-surface-500">Email</p>
          <p className="text-surface-900 font-medium">{user.email}</p>
        </div>
      </div>

      {/* Practice Preferences */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-surface-500" />
          <h3 className="font-semibold text-surface-800">Practice Preferences</h3>
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium text-surface-700 mb-2 block">Default Correction Mode</label>
          <div className="flex gap-2">
            {(['LIGHT', 'STRICT', 'FLUENCY'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setCorrectionMode(mode)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                  correctionMode === mode
                    ? 'bg-primary-700 text-white border-primary-700'
                    : 'bg-surface-50 text-surface-600 border-surface-200 hover:border-surface-300'
                }`}
              >
                {mode.charAt(0) + mode.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <p className="text-xs text-surface-400 mt-2">
            Light: major errors • Strict: all errors • Fluency: no interruptions
          </p>
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium text-surface-700 mb-2 block">
            Daily Goal: {dailyGoal} minutes
          </label>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={dailyGoal}
            onChange={e => setDailyGoal(Number(e.target.value))}
            className="w-full accent-primary-700"
          />
          <div className="flex justify-between text-xs text-surface-400 mt-1">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary"
        >
          {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Billing */}
      <div className="card">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="w-4 h-4 text-surface-500" />
          <h3 className="font-semibold text-surface-800">Plan & Billing</h3>
        </div>

        <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-surface-800">
                {user.plan === 'PRO' ? 'Pro Plan' : 'Free Plan'}
              </span>
              {user.plan === 'PRO' && <span className="badge badge-blue">Active</span>}
            </div>
            {user.plan === 'PRO' && user.stripeCurrentPeriodEnd && (
              <p className="text-xs text-surface-500 mt-0.5">
                Renews {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            {user.plan === 'FREE' && (
              <p className="text-xs text-surface-500 mt-0.5">5 minutes/day • Basic features</p>
            )}
          </div>
          {user.plan === 'FREE' && (
            <button onClick={startUpgrade} className="btn-primary text-sm gap-2">
              <Crown className="w-3.5 h-3.5" />
              Upgrade
            </button>
          )}
        </div>

        {user.plan === 'FREE' && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
            <h4 className="font-semibold text-primary-800 mb-2">🚀 Pro includes:</h4>
            <ul className="space-y-1.5 text-sm text-primary-700">
              <li>✓ Unlimited daily practice</li>
              <li>✓ Stuck Word Assistant</li>
              <li>✓ All correction modes</li>
              <li>✓ Detailed analytics & trends</li>
              <li>✓ Weekly email progress report</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
