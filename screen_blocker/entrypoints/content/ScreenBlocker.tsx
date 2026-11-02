import { useEffect, useRef, useState } from 'react';
import BloomLogo from '@/assets/bloom-icon.svg';
import FocusFlower from '../../public/flower-progression/leafy.svg?raw';
import { getActivities, type Activity } from '../../features/interactive_activity/storage';
import {
  confirmFocusSession,
  finishFocusSession,
  getFocusSession,
  getSessionKey,
  startFocusSession,
  type FocusSession,
} from '../../features/screenblocker/session';
import ContinueButton from '../../features/social_media/ContinueButton';
import { BYPASS_MINUTES } from '../../features/social_media/bypass';
import './ScreenBlocker.css';

const focusFlowerUrl = `data:image/svg+xml,${encodeURIComponent(FocusFlower)}`;

interface ScreenBlockerProps {
  site: string;
  onContinue: () => Promise<void>;
}

function ActivityIcon({ icon }: { icon?: Activity['icon'] }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon === 'read' ? <path d="M16 8c-4-3-8-3-12-2v20c4-1 8-1 12 2m0-20c4-3 8-3 12-2v20c-4-1-8-1-12 2V8Z" />
        : icon === 'walk' ? <><circle cx="18" cy="5" r="3" /><path d="m13 30 3-11 4 4 1 7M9 17l4-7 5 1 3 6 5 1M16 11l-1 9-6 10" /></>
          : icon === 'stretch' ? <><circle cx="16" cy="5" r="3" /><path d="m3 11 13 3 13-3M16 14v7m-7 9 7-9 7 9" /></>
            : icon === 'study' ? <path d="m2 11 14-7 14 7-14 7-14-7Zm6 3v9c5 4 11 4 16 0v-9m6-3v12" />
              : <path d="M16 29V15m0 5C5 20 5 11 5 11s11-1 11 9Zm0-5C16 5 27 5 27 5s0 10-11 10Z" />}
    </svg>
  );
}

const ScreenBlocker = ({ site, onContinue }: ScreenBlockerProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [session, setSession] = useState<FocusSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(Date.now());
  const heading = useRef<HTMLHeadingElement>(null);
  const remaining = session ? Math.max(0, Math.ceil((session.endsAt - now) / 1000)) : 0;
  const screen = session ? (session.phase === 'confirm' || remaining === 0 ? 'confirm' : 'focus') : 'prompt';

  useEffect(() => {
    let active = true;
    let revision = 0;
    async function load() {
      const version = ++revision;
      try {
        const [savedActivities, savedSession] = await Promise.all([getActivities(), getFocusSession(site)]);
        if (!active || version !== revision) return;
        setActivities(savedActivities);
        setSession(savedSession);
        setNow(Date.now());
        setError('');
      } catch {
        if (active && version === revision) setError('Bloom could not load your activities. Refresh to try again.');
      } finally {
        if (active && version === revision) setLoading(false);
      }
    }
    const onChange = (changes: Record<string, unknown>, area: string) => {
      if (area === 'local' && ('activities' in changes || getSessionKey(site) in changes)) void load();
    };
    browser.storage.onChanged.addListener(onChange);
    void load();
    return () => {
      active = false;
      browser.storage.onChanged.removeListener(onChange);
    };
  }, [site]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  useEffect(() => {
    heading.current?.focus();
  }, [screen, loading]);

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch {
      setError('Your change could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function finish(completed: boolean) {
    if (!session) return;
    const saved = await finishFocusSession(site, session, completed);
    if (saved && completed) {
      setNotice(`${session.activity.name} complete. +${session.activity.points} ${session.activity.points === 1 ? 'point' : 'points'} earned.`);
    }
  }

  const activity = session?.activity;

  return (
    <div id="screen-blocker" className={`blocker-${screen}`} role="dialog" aria-modal="true" aria-labelledby="bloom-heading">
      {screen === 'prompt' ? (
        <section className="blocker-card activity-prompt">
          <header className="blocker-header">
            <span className="blocker-brand"><img src={BloomLogo} alt="" />Bloom</span>
          </header>
          <h1 id="bloom-heading" ref={heading} tabIndex={-1}>Give your attention somewhere new.</h1>
          <p className="blocker-description">Choose a short activity and help your flower grow.</p>
          {notice && <p className="completion-notice" role="status">{notice}</p>}
          <div className="blocker-activities" aria-label="Choose an activity">
            {loading ? <p role="status">Loading your activities...</p> : activities.length === 0 ? <p>Your saved activity list is empty.</p> : activities.map((item) => (
              <button className={`activity-choice activity-${item.icon ?? 'custom'}`} key={item.id} disabled={busy}
                onClick={() => void run(async () => { await startFocusSession(site, item); setNotice(''); })}>
                <ActivityIcon icon={item.icon} />
                <span><strong>{item.name}</strong> · {item.minutes} min · +{item.points}</span>
                <span className="activity-chevron" aria-hidden="true">›</span>
              </button>
            ))}
          </div>
          <footer className="blocker-footer">
            <ContinueButton disabled={busy || loading} onContinue={() => void run(onContinue)}>Continue for {BYPASS_MINUTES} minutes</ContinueButton>
            <p>This site will be blocked again automatically.</p>
          </footer>
        </section>
      ) : screen === 'focus' && activity ? (
        <section className="focus-session">
          <span className={`activity-badge activity-${activity.icon ?? 'custom'}`}><ActivityIcon icon={activity.icon} />{activity.name} · {activity.minutes} min · +{activity.points} {activity.points === 1 ? 'point' : 'points'}</span>
          <h1 id="bloom-heading" ref={heading} tabIndex={-1}>Time to {activity.name.toLowerCase()}</h1>
          <img className="focus-flower" src={focusFlowerUrl} alt="A growing flower" />
          <div className="focus-timer" role="timer" aria-label="Time remaining">{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</div>
          <p className="blocker-description">{site} is covered while you focus.</p>
          <div className="focus-actions">
            <button className="blocker-outline" disabled={busy} onClick={() => void run(async () => { await confirmFocusSession(site, session!); })}><span aria-hidden="true">✓</span> I'm done</button>
            <button className="blocker-link" disabled={busy} onClick={() => void run(() => finish(false))}>End session without reward</button>
          </div>
        </section>
      ) : activity ? (
        <section className="blocker-card completion-confirm">
          <span className={`confirmation-icon activity-${activity.icon ?? 'custom'}`}><ActivityIcon icon={activity.icon} /></span>
          <h1 id="bloom-heading" ref={heading} tabIndex={-1}>Did you finish your activity?</h1>
          <p className="blocker-description">{remaining === 0 ? `Your ${activity.minutes}-minute ${activity.name.toLowerCase()} session has ended.` : `Confirm completion to earn +${activity.points} ${activity.points === 1 ? 'point' : 'points'}.`}</p>
          <button className="blocker-primary" disabled={busy} onClick={() => void run(() => finish(true))}>Yes, complete activity</button>
          <button className="blocker-secondary" disabled={busy} onClick={() => void run(() => finish(false))}>Not this time</button>
          <p className="confirmation-note">Self-reported · no points if you skip</p>
        </section>
      ) : null}
      {error && <p className="blocker-error" role="alert">{error}</p>}
    </div>
  );
};

export default ScreenBlocker;
