import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { defaults, time, elapsed, startDraft, pauseDraft, addRound, undoRound, toRecord, validDraft } from './model';

function Icon({ name, size = 20, ...props }) {
  const paths = {
    train: <><path d="m7 4 2 2-3 3-2-2m13 13-2-2 3-3 2 2M5 19 19 5M3 12l9 9M12 3l9 9" /></>,
    history: <><path d="M3 10a9 9 0 1 1 1 7M3 4v6h6M12 7v5l3 2" /></>,
    chart: <><path d="M4 4v16h16M8 15l4-5 4 2 4-7" /></>,
    settings: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" /><circle cx="15" cy="17" r="3" /></>,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    undo: <><path d="m8 4-5 5 5 5M3 9h10a7 7 0 0 1 0 14" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    sound: <><path d="M4 9v6h4l5 4V5L8 9ZM17 8a7 7 0 0 1 0 8M20 5a11 11 0 0 1 0 14" /></>,
    mute: <><path d="M4 9v6h4l5 4V5L8 9ZM17 9l5 6m0-6-5 6" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8 12 3 3 5-6" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.shield}</svg>;
}

function Bell({ small = false }) {
  if (small) return <svg viewBox="0 0 32 36" width="30" height="34" aria-hidden="true"><path d="M10 13C2-2 30-2 22 13" fill="none" stroke="currentColor" strokeWidth="4"/><path d="M9 12h14c1 5 7 7 7 14 0 6-5 9-14 9S2 32 2 26c0-7 6-9 7-14Z" fill="currentColor"/></svg>;
  return <svg className="bell-art" viewBox="0 0 300 290" aria-hidden="true"><defs><linearGradient id="bellBody" x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#737773"/><stop offset=".33" stopColor="#333735"/><stop offset=".7" stopColor="#191c1b"/><stop offset="1" stopColor="#0d0f0e"/></linearGradient><linearGradient id="bellHandle" x1="0" x2="1"><stop stopColor="#373b38"/><stop offset=".45" stopColor="#858b81"/><stop offset="1" stopColor="#252926"/></linearGradient><radialGradient id="bellGlow"><stop stopColor="#f8783d" stopOpacity=".18"/><stop offset="1" stopColor="#f8783d" stopOpacity="0"/></radialGradient></defs><circle cx="150" cy="156" r="130" fill="url(#bellGlow)"/><ellipse cx="156" cy="264" rx="90" ry="12" fill="#080b09" opacity=".6"/><path d="M105 109C46 9 250 8 193 109" fill="none" stroke="#0c0f0d" strokeWidth="28"/><path d="M105 105C56 20 238 16 190 105" fill="none" stroke="url(#bellHandle)" strokeWidth="19"/><path d="M100 91q48-12 97 0c4 23 20 33 35 55 35 58 7 115-78 115-91 0-116-62-80-117 15-23 23-30 26-53Z" fill="url(#bellBody)" stroke="#4d534c" strokeWidth="1"/><path d="M104 98q45-11 88-1" fill="none" stroke="#a1a79a" strokeOpacity=".5" strokeWidth="2"/><circle cx="152" cy="179" r="36" fill="#151a16" stroke="#555c50" strokeOpacity=".55"/><text x="152" y="187" textAnchor="middle" fill="#b3baa9" fontFamily="sans-serif" fontSize="25" fontWeight="700">ABC</text><path d="M80 173q-18 46 24 65" fill="none" stroke="#a2a692" strokeOpacity=".12" strokeWidth="3"/></svg>;
}

function Modal({ title, children, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog className="modal" ref={ref} aria-labelledby="modal-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button></div>{children}
  </dialog>;
}

function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
const tabs = [{id:'train',label:'Train',icon:'train'},{id:'history',label:'History',icon:'history'},{id:'progress',label:'Progress',icon:'chart'},{id:'settings',label:'Settings',icon:'settings'}];
const dateLabel = date => new Date(date).toLocaleDateString('en-GB', {day:'numeric',month:'short'});

export default function ModernArmor() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [preview, setPreview] = useState(() => read('armor:device-preview', false));
  const [tab, setTab] = useState('train');
  const [config, setConfig] = useState(defaults);
  const [draft, setDraft] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadState, setLoadState] = useState('idle');
  const [historyError, setHistoryError] = useState('');
  const [modal, setModal] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(Date.now());
  const [sound, setSound] = useState(true);
  const [unit, setUnit] = useState('kg');
  const [ready, setReady] = useState(false);
  const [detail, setDetail] = useState(null);
  const [manual, setManual] = useState({rounds:10,minutes:20,date:new Date().toLocaleDateString('en-CA')});
  const audio = useRef(null);
  const lastRest = useRef(0);
  const busy = useRef(false);
  const lastTap = useRef(0);
  const account = user?.uid || (preview ? 'preview' : null);
  const key = account ? `armor-v2:${account}` : null;
  const active = !!draft;
  const paused = active && !draft.runningSince;
  const seconds = elapsed(draft, now);
  const rest = draft ? Math.max(0, Math.ceil((draft.restUntil - now) / 1000)) : 0;
  const done = active && draft.completedRounds >= draft.targetRounds;
  const displayWeight = value => unit === 'lb' ? `${Math.round(value * 2.20462 * 10) / 10} lb` : `${value} kg`;

  useEffect(() => { try { localStorage.setItem('armor:device-preview', JSON.stringify(preview)); } catch { /* Optional preference. */ } }, [preview]);

  function persist(nextDraft) {
    setDraft(nextDraft);
    if (key) { try { if (nextDraft) localStorage.setItem(`${key}:draft`, JSON.stringify(nextDraft)); else localStorage.removeItem(`${key}:draft`); }
      catch { setNotice('Device storage is unavailable. Keep this tab open until your session is saved.'); } }
  }
  function beep() {
    if (!sound || !audio.current) return;
    try { const ctx = audio.current; const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.connect(gain); gain.connect(ctx.destination); oscillator.frequency.value=740; gain.gain.setValueAtTime(.12,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.25); oscillator.start(); oscillator.stop(ctx.currentTime+.25); } catch { /* Audio is optional. */ }
  }
  function unlockAudio() { try { const Audio = window.AudioContext || window.webkitAudioContext; if (Audio && !audio.current) audio.current = new Audio(); audio.current?.resume(); } catch { /* Audio is optional. */ } }

  useEffect(() => {
    setReady(false); setDraft(null); setSessions([]); setHistoryError(''); setError(''); setModal(null);
    if (!key) { setReady(true); return; }
    const stored = read(`${key}:draft`, null);
    if (validDraft(stored)) {
      const recovered = stored.runningSince ? pauseDraft(stored) : stored;
      setDraft(recovered); setNotes(stored.notes || ''); setNotice('Your session is ready to resume.');
      try { localStorage.setItem(`${key}:draft`, JSON.stringify(recovered)); } catch { /* The existing draft is still available. */ }
    }
    const settings=read(`${key}:settings`, {});
    setConfig({...defaults, ...settings.config}); setSound(settings.sound !== false); setUnit(settings.unit === 'lb' ? 'lb':'kg');
    setReady(true);
    if (!user) { setSessions(read(`${key}:history`, [])); setLoadState('loaded'); return; }
    setLoadState('loading');
    return onSnapshot(collection(db, 'users', user.uid, 'workouts'), {includeMetadataChanges:true}, snapshot => {
      const records = snapshot.docs.filter(document => !document.metadata.hasPendingWrites).map(document => ({...document.data(), id:document.id})).filter(s => Number.isFinite(s.completedRounds) && s.completedRounds > 0 && s.startTime).sort((a,b)=>new Date(b.startTime)-new Date(a.startTime));
      setSessions(records); setLoadState(snapshot.metadata.fromCache?'cached':'loaded'); setHistoryError('');
    }, () => { setLoadState('error'); setHistoryError('Couldn’t load your workout history. Check your connection and reload to try again.'); });
  }, [key, user]);

  useEffect(() => { if (key && ready) { try { localStorage.setItem(`${key}:settings`,JSON.stringify({config,sound,unit})); } catch { /* Optional preferences. */ } } }, [key,ready,config,sound,unit]);
  useEffect(() => { if (!draft?.runningSince) return; const id=setInterval(()=>setNow(Date.now()),250); return ()=>clearInterval(id); },[draft?.runningSince]);
  useEffect(() => { if (lastRest.current > 0 && rest === 0 && draft?.runningSince) beep(); lastRest.current=rest; },[rest]);
  useEffect(() => { if (!notice) return; const id=setTimeout(()=>setNotice(''),7000); return ()=>clearTimeout(id); },[notice]);
  useEffect(() => {
    if (!draft?.runningSince || !('wakeLock' in navigator)) return;
    let lock; let cancelled=false;
    const request=async()=> { try { const acquired=await navigator.wakeLock.request('screen'); if(cancelled) acquired.release(); else lock=acquired; } catch { /* Device may decline screen wake lock. */ } };
    request(); const visible=()=>{if(document.visibilityState==='visible') request();}; document.addEventListener('visibilitychange',visible);
    return ()=>{cancelled=true; lock?.release(); document.removeEventListener('visibilitychange',visible);};
  },[draft?.runningSince]);

  function start() {
    if (!account) {setModal('auth');return;}
    unlockAudio(); setNow(Date.now()); persist(startDraft(config, crypto.randomUUID())); setTab('train'); setNotes('');
    window.scrollTo({top:0});
  }
  function recordRound() {
    if (Date.now()-lastTap.current<650) return;
    lastTap.current=Date.now(); const next=addRound(draft); persist(next); setNow(Date.now());
    if (next !== draft) {beep(); if (navigator.vibrate) navigator.vibrate(35);}
  }
  function togglePause() { unlockAudio(); persist(pauseDraft(draft)); setNow(Date.now()); }
  function finish() {
    if (draft.runningSince) persist(pauseDraft(draft));
    setModal('finish'); setError('');
  }
  async function save(record) {
    if (busy.current) return; busy.current=true; setSaving(true); setError('');
    try {
      if (user) {
        let timeout;
        try {
          await Promise.race([
            setDoc(doc(db,'users',user.uid,'workouts',record.id),{...record,createdAt:serverTimestamp()}),
            new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Save timed out')),12000);}),
          ]);
        } finally { clearTimeout(timeout); }
      } else {
        const updated=[record,...sessions.filter(s=>s.id!==record.id)];
        localStorage.setItem(`${key}:history`,JSON.stringify(updated)); setSessions(updated);
      }
      persist(null); setModal(null); setTab('history'); setNotes(''); setNotice(user ? 'Session saved to your account. Strong work.':'Session saved on this device. Strong work.');
    } catch { setError('Your session hasn’t saved yet. Your draft is still on this device. Check your connection and try again.'); }
    finally { busy.current=false; setSaving(false); }
  }
  function saveManual(e) {
    e.preventDefault(); if(!account){setModal('auth');return;}
    const startTime=new Date(`${manual.date}T12:00:00`).toISOString();
    const manualDraft={...startDraft(config,crypto.randomUUID()),startTime,completedRounds:Number(manual.rounds),targetRounds:Number(manual.rounds),accumulated:Number(manual.minutes)*60000,runningSince:null};
    persist(manualDraft); setModal('finish');
  }
  function exportData() {
    const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),sessions},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='armor-builder-sessions.json';a.click();URL.revokeObjectURL(url);
  }
  const weekStart = new Date(); weekStart.setHours(0,0,0,0);weekStart.setDate(weekStart.getDate()-((weekStart.getDay()+6)%7));
  const thisWeek=sessions.filter(s=>new Date(s.startTime)>=weekStart);
  const totalRounds=sessions.reduce((sum,s)=>sum+s.completedRounds,0);
  const totalVolume=sessions.filter(s=>s.schemaVersion===2).reduce((sum,s)=>sum+(s.totalVolume||0),0);
  const best=sessions.length ? Math.max(...sessions.map(s=>s.completedRounds)):null;
  const nav = <>{tabs.map(t=><button key={t.id} className={`nav-link ${tab===t.id?'selected':''}`} onClick={()=>setTab(t.id)} aria-current={tab===t.id?'page':undefined}><Icon name={t.icon}/><span>{t.label}</span>{tab===t.id&&<i/>}</button>)}</>;

  return <div className={`app-shell ${active && tab==='train'?'training':''}`}>
    <aside className="sidebar"><a href="#" className="brand" onClick={e=>{e.preventDefault();setTab('train');}}><span className="brand-mark"><Bell small/></span><span>ARMOR<span className="brand-light">BUILDER</span></span></a><div className="suite-label">KETTLEBELL COMMAND CENTER</div><div className="nav-caption">YOUR WORKSPACE</div><nav aria-label="Main navigation">{nav}</nav>
      <div className="sidebar-bottom"><div className="mini-sequence">2 <span>/</span> 1 <span>/</span> 3</div><p>Simple work.<br/>Lasting strength.</p><a href="https://kettlebell-command-center.bptowers.chatgpt.site" target="_blank" rel="noreferrer">Command Center <Icon name="arrow" size={15}/></a><div className="sidebar-credit">INSPIRED BY DAN JOHN’S ABC</div></div>
    </aside>
    <div className="workspace"><header className="topbar"><span className="breadcrumb">Your training <span>/</span> <strong>Armor Builder</strong></span><span className="mobile-brand"><span className="orange"><Bell small/></span> ARMOR BUILDER</span><div className="top-actions">{preview&&!user&&<span className="preview-tag">Device preview</span>}<span className="top-date">{new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}</span><button className="account-button" onClick={()=>setModal('auth')} aria-label={user?'Account':'Sign in'}>{user ? <span className="avatar">{(user.displayName || user.email || 'A')[0].toUpperCase()}</span> : <><Icon name="shield" size={16}/><span>Sign in</span></>}</button></div></header>
    {preview&&!user&&<div className="preview-banner">Device preview · sessions stay on this device. <button onClick={()=>setModal('auth')}>Sign in to sync <Icon name="arrow" size={13}/></button></div>}
    {user&&<div className="preview-banner cloud-banner" role="status">{loadState==='loaded'?'Cloud connected · completed sessions sync to your account.':loadState==='error'?'Cloud unavailable · your active workout stays on this device.':loadState==='cached'?'Showing device cache · waiting for cloud connection…':'Connecting to your cloud history…'}</div>}
    <main id="main-content">
      {tab==='train'&&<>
        <div className="page-heading"><div><div className="eyebrow"><span/> YOUR TIME. YOUR STRENGTH.</div><h1>{active ? <>ONE ROUND.<br/><span>THEN THE NEXT.</span></>:<>BUILD YOUR<br/><span>EVERYDAY ARMOR.</span></>}</h1><p>{active?'Stay present. The numbers are taken care of.':'Two cleans. One press. Three squats. Show up and make it count.'}</p></div><div className="heading-stamp"><Icon name="shield" size={23}/><span>THE ARMOR<br/>BUILDING COMPLEX</span></div></div>
        <div className="training-grid"><div className="training-primary">
        <section className={`session-card ${active?'is-active':''}`} aria-label="Workout session"><div className="card-top"><span className="eyebrow">{active?'YOUR SESSION':'LET’S GET TO WORK'}</span><span className={`status-pill ${active&&!paused?'live':''}`}><i/>{active?(paused?'PAUSED':rest?'RESTING':'IN SESSION'):'READY WHEN YOU ARE'}</span></div>
          {!active?<><div className="session-intro"><h2>The everyday strength session.</h2><p>A simple complex. An honest effort. A stronger you.</p></div><div className="sequence">{[['2','CLEANS','Clean to the rack'],['1','PRESS','Press overhead'],['3','SQUATS','Front rack squats']].map(([n,label,sub],i)=><div className="sequence-step" key={n}><div className="sequence-top"><span className="step-index">0{i+1}</span><Icon name={i===1?'arrow':'train'} size={17}/></div><strong>{n}</strong><span className="movement">{label}</span><small>{sub}</small></div>)}</div>
          <div className="session-config"><label>YOUR BELLS<select value={config.bellCount} onChange={e=>setConfig({...config,bellCount:Number(e.target.value)})}><option value="2">Double kettlebell</option><option value="1">Single · both sides</option></select></label><label>WEIGHT PER BELL<select value={config.weight} onChange={e=>setConfig({...config,weight:Number(e.target.value)})}>{[4,6,8,10,12,14,16,18,20,22,24,28,32,36,40,44,48,56,64].map(w=><option value={w} key={w}>{displayWeight(w)}</option>)}</select></label></div>
          <div className="session-config secondary-config"><div><span className="field-label">ROUND TARGET</span><div className="stepper"><button onClick={()=>setConfig({...config,targetRounds:Math.max(1,config.targetRounds-1)})} aria-label="Decrease round target" disabled={config.targetRounds<=1}><Icon name="minus" size={16}/></button><strong>{config.targetRounds}<small> rounds</small></strong><button onClick={()=>setConfig({...config,targetRounds:Math.min(50,config.targetRounds+1)})} aria-label="Increase round target" disabled={config.targetRounds>=50}><Icon name="plus" size={16}/></button></div></div><label>REST BETWEEN ROUNDS<select value={config.restSeconds} onChange={e=>setConfig({...config,restSeconds:Number(e.target.value)})}>{[0,15,30,45,60,90,120,180].map(s=><option value={s} key={s}>{s===0?'No timer':`${s} seconds`}</option>)}</select></label></div>
          <button className="primary start-button" onClick={start} disabled={authLoading||!ready}><Icon name="play" size={19}/>{authLoading?'Getting ready…':'Start session'}<Icon name="arrow"/></button><div className="session-foot"><span><Icon name="clock" size={14}/> Train at your own pace</span><button onClick={()=>{if(!account)setModal('auth');else{setModal('manual');setNotes('');}}}>Log a past session</button></div></>:<>
          <div className="active-details"><span>{draft.bellCount===2?'2 ×':'1 ×'} {displayWeight(draft.weight)}</span><span>2 cleans · 1 press · 3 squats{draft.bellCount===1?' / side':''}</span></div>
          <div className={`round-display ${rest?'resting':''}`}><svg viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="108" className="ring-track"/><circle cx="120" cy="120" r="108" className="ring-progress" strokeDasharray="679" strokeDashoffset={679*(1-draft.completedRounds/draft.targetRounds)}/></svg><div>{rest&&!paused?<><span className="timer-label">BREATHE. RESET.</span><strong>{time(rest)}</strong><span>next round in</span></>:<><span className="timer-label">ROUNDS COMPLETED</span><strong>{String(draft.completedRounds).padStart(2,'0')}</strong><span>of {draft.targetRounds} rounds</span></>}</div></div>
          <span className="sr-only" role="status">{draft.completedRounds} of {draft.targetRounds} rounds completed</span><div className="active-metrics"><div><span>SESSION TIME</span><strong>{time(seconds)}</strong></div><div><span>REPS COMPLETED</span><strong>{draft.completedRounds*(draft.bellCount===1?12:6)}</strong></div><div><span>TOTAL VOLUME</span><strong>{(draft.completedRounds*draft.weight*12).toLocaleString()}<small> kg</small></strong></div></div>
          {done?<button className="primary start-button" onClick={finish}><Icon name="check"/>Finish & save session<Icon name="arrow"/></button>:rest&&!paused?<button className="rest-button" onClick={()=>{persist({...draft,restUntil:0});setNow(Date.now());}}>Ready now? Skip rest <Icon name="arrow"/></button>:<button className="primary start-button complete-round" disabled={paused} onClick={recordRound}><Icon name="plus" size={24}/>{paused?'Session paused':'Complete round'}<span>+1</span></button>}
          <div className="workout-controls"><button onClick={()=>persist(undoRound(draft))} disabled={!draft.completedRounds}><Icon name="undo" size={18}/>Undo</button><button onClick={togglePause}><Icon name={paused?'play':'pause'} size={18}/>{paused?'Resume':'Pause'}</button><button onClick={finish} disabled={!draft.completedRounds}><Icon name="check" size={18}/>Finish</button><button className="sound-control" onClick={()=>{unlockAudio();setSound(!sound);}} aria-label={sound?'Mute timer sound':'Enable timer sound'} aria-pressed={sound}><Icon name={sound?'sound':'mute'} size={18}/></button></div><button className="discard-link" onClick={()=>setModal('discard')}>Discard session</button>
          </>}
        </section>
        <div className="training-note"><span><Icon name="shield" size={19}/></span><p><strong>Keep the goal the goal.</strong> Quality rounds beat rushed reps. Rest when you need to.</p></div>
        </div><aside className="training-aside"><section className="complex-card"><div className="eyebrow">BUILT ON THE BASICS</div><h2>Less noise.<br/>More strength.</h2><Bell/><div className="complex-bottom"><span>THE 2–1–3 FORMULA</span><button onClick={()=>setModal('guide')} aria-label="Learn about the complex"><Icon name="arrow" size={20}/></button></div></section>
          <section className="week-card"><div className="section-heading"><h3>This week</h3><span>{thisWeek.length} sessions</span></div><div className="week-days">{['M','T','W','T','F','S','S'].map((day,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);const trained=thisWeek.some(s=>new Date(s.startTime).toDateString()===d.toDateString());return <div key={i}><span>{day}</span><i className={`${trained?'trained':''} ${d.toDateString()===new Date().toDateString()?'today':''}`}>{trained?<Icon name="check" size={14}/>:''}</i></div>;})}</div><p>{loadState==='loading'?'Loading your week…':thisWeek.length?'One session at a time. Keep showing up.':'A fresh week. A good time to start.'}</p></section>
        </aside></div>
        <section className="recent-section"><div className="section-heading"><h2>Recent sessions</h2><button onClick={()=>setTab('history')}>View history <Icon name="arrow" size={16}/></button></div>{renderSessions(sessions.slice(0,3),true)}</section>
      </>}
      {tab==='history'&&<><div className="page-heading"><div><div className="eyebrow"><span/> THE WORK ADDS UP</div><h1>YOUR TRAINING.<br/><span>ON THE RECORD.</span></h1><p>Every round you showed up for, all in one place.</p></div><button className="secondary" disabled={!sessions.length} onClick={exportData}><Icon name="download" size={17}/>Export</button></div>{renderSessions(sessions)}</>}
      {tab==='progress'&&<><div className="page-heading"><div><div className="eyebrow"><span/> BUILT BY CONSISTENCY</div><h1>SMALL EFFORTS.<br/><span>REAL PROGRESS.</span></h1><p>Your own work. Your own benchmark.</p></div></div>{historyError&&<p role="alert" className="error">{historyError}</p>}<div className="stats-grid">{[['SESSIONS',sessions.length,'Every time you showed up.'],['ROUNDS',totalRounds,'Strength through repetition.'],['BEST ROUND COUNT',best??'—','Highest rounds in one session.'],['VOLUME LIFTED',`${(totalVolume/1000).toFixed(1)} t`,'New sessions · both bells counted.']].map(([label,value,sub])=><div className="stat-card" key={label}><span className="eyebrow">{label}</span><strong>{value}</strong><p>{sub}</p></div>)}</div><section className="progress-panel"><div className="section-heading"><h2>Your last 8 sessions</h2><span>Rounds completed</span></div>{sessions.length?<div className="bar-chart">{sessions.slice(0,8).reverse().map(s=><div key={s.id}><span>{s.completedRounds}</span><i style={{height:`${Math.max(8,s.completedRounds/(best||1)*150)}px`}}/><small>{dateLabel(s.startTime)}</small></div>)}</div>:<div className="empty-state"><Icon name="chart" size={34}/><h3>Your next session starts the story.</h3><p>Complete a workout to see your progress here.</p><button className="secondary" onClick={()=>setTab('train')}>Let’s train <Icon name="arrow" size={16}/></button></div>}</section><p className="muted fine-print">Single-bell rounds include both sides. Compare sessions with the same bell setup and weight. Legacy session volume is excluded from the new volume total.</p></>}
      {tab==='settings'&&<><div className="page-heading"><div><div className="eyebrow"><span/> MAKE IT YOURS</div><h1>YOUR TRAINING.<br/><span>YOUR WAY.</span></h1><p>A few small preferences. A better session.</p></div></div><section className="settings-panel"><div className="setting-row"><div><h3>Weight display</h3><p>Weights are stored in kilograms.</p></div><div className="segmented"><button className={unit==='kg'?'on':''} onClick={()=>setUnit('kg')}>kg</button><button className={unit==='lb'?'on':''} onClick={()=>setUnit('lb')}>lb</button></div></div><div className="setting-row"><div><h3>Timer sounds</h3><p>A short cue when rest ends.</p></div><button className={`toggle ${sound?'on':''}`} onClick={()=>{unlockAudio();setSound(!sound);}} role="switch" aria-checked={sound} aria-label="Timer sounds"><i/></button></div><div className="setting-row"><div><h3>Your account</h3><p>{user?user.email:'Sign in with Google to sync your sessions.'}</p></div><button className="secondary" onClick={()=>setModal('auth')}>{user?'Manage':'Sign in'}</button></div><div className="setting-row"><div><h3>Take your history with you</h3><p>Download your sessions as a JSON file.</p></div><button className="icon-button" onClick={exportData} disabled={!sessions.length} aria-label="Export workout history"><Icon name="download"/></button></div><div className="storage-note"><Icon name="shield"/><p>{user?'Completed sessions save to your Firebase account. Active workouts and preferences stay on this device.':'Preview sessions and preferences stay on this device. Sign in before training to save sessions to your account.'}</p></div></section></>}
      <footer className="app-footer"><span>SHOW UP. BUILD STRENGTH. REPEAT.</span><span>Armor Builder <i> / </i> Part of Kettlebell Command Center</span></footer>
    </main><nav className="mobile-nav" aria-label="Mobile navigation">{nav}</nav></div>
    {notice&&<div role="status" className="toast"><Icon name="check" size={17}/>{notice}</div>}
    {modal==='auth'&&<Modal title={user?'Your account':'Your strength. Saved.'} onClose={()=>setModal(null)}>{user?<><p className="modal-copy">Signed in as <strong>{user.email}</strong>. Your completed sessions sync to this account.</p><button className="secondary full" disabled={!!draft} onClick={async()=>{try{await signOut();setPreview(false);setModal(null);setNotice('Signed out.');}catch{setError('Couldn’t sign out. Please try again.');}}}>Sign out</button>{draft&&<p className="muted">Save or discard your active session before signing out.</p>}</>:<><p className="modal-copy">Sign in to keep your workout history and pick it up on any device.</p><button className="primary full" disabled={!!draft} onClick={async()=>{setError('');try{const signedIn=await signInWithGoogle();if(signedIn){setPreview(false);setModal(null);}}catch(e){setError(e.code==='auth/unauthorized-domain'?'Google sign-in needs this preview domain authorized in Firebase. Your existing live-site account is unchanged.':e.code==='auth/popup-closed-by-user'?'Sign-in was closed. You can try again.':'Couldn’t sign in. Check your connection and try again.');}}}><span className="google-mark">G</span>Continue with Google</button><button className="text-button full" onClick={()=>{setPreview(true);setModal(null);setNotice('Preview mode: workouts save on this device only.');}}>Explore on this device</button><p className="fine-print muted">Already use Armor Builder? Use the same Google account. Preview sessions won’t automatically transfer. Finish or discard an active preview session before signing in.</p></>}{error&&<p role="alert" className="error">{error}</p>}</Modal>}
    {modal==='finish'&&draft&&<Modal title="Strong work. Make it count." onClose={()=>{if(!saving)setModal(null);}}><p className="modal-copy">{draft.completedRounds} of {draft.targetRounds} rounds. Every one earned.</p><div className="summary-metrics"><div><strong>{draft.completedRounds}</strong><span>ROUNDS</span></div><div><strong>{time(elapsed(draft))}</strong><span>DURATION</span></div><div><strong>{(draft.completedRounds*draft.weight*12).toLocaleString()}</strong><span>KG LIFTED</span></div></div><label className="notes-label">SESSION NOTES <span>Optional</span><textarea maxLength={1000} value={notes} onChange={e=>{setNotes(e.target.value);persist({...draft,notes:e.target.value});}} placeholder="How did that feel?" rows={3}/></label>{error&&<p className="error" role="alert">{error}</p>}<button className="primary full" disabled={saving||!draft.completedRounds} onClick={()=>save(toRecord(draft,notes))}><Icon name="check"/>{saving?'Saving…':user?'Save to my account':'Save on this device'}</button><button className="text-button full" disabled={saving} onClick={()=>setModal(null)}>Back to session</button></Modal>}
    {modal==='discard'&&<Modal title="Leave this session behind?" onClose={()=>setModal(null)}><p className="modal-copy">Your current rounds won’t be added to your history. Saved sessions are kept.</p><button className="primary full" onClick={()=>{persist(null);setModal(null);setNotes('');}}>Discard current session</button><button className="text-button full" onClick={()=>setModal(null)}>Keep training</button></Modal>}
    {modal==='manual'&&<Modal title="Already put the work in?" onClose={()=>setModal(null)}><p className="modal-copy">Log a past session using your selected bells: {config.bellCount===2?'2 ×':'1 ×'} {displayWeight(config.weight)}.</p><form onSubmit={saveManual} className="manual-form"><label>WORKOUT DATE<input type="date" value={manual.date} max={new Date().toLocaleDateString('en-CA')} required onChange={e=>setManual({...manual,date:e.target.value})}/></label><label>ROUNDS<input type="number" min="1" max="100" step="1" required value={manual.rounds} onChange={e=>setManual({...manual,rounds:e.target.value})}/></label><label>DURATION (MINUTES)<input type="number" min="1" max="1440" required value={manual.minutes} onChange={e=>setManual({...manual,minutes:e.target.value})}/></label><button className="primary full" type="submit">Review session <Icon name="arrow"/></button></form></Modal>}
    {modal==='guide'&&<Modal title="Simple by design." onClose={()=>setModal(null)}><p className="modal-copy">Dan John’s Armor Building Complex links three movements into one round:</p><ol className="guide-list"><li><strong>2</strong><span>Cleans <small>Bring the bells to the rack.</small></span></li><li><strong>1</strong><span>Press <small>Press overhead, return to the rack.</small></span></li><li><strong>3</strong><span>Front squats <small>Keep a controlled, comfortable range.</small></span></li></ol><p className="modal-copy">With two bells, record one round after the sequence. With a single bell, complete it on each side before recording a round.</p><p className="fine-print muted">An independent tracking tool inspired by the complex. Choose your own load, rounds, and rest. No affiliation or endorsement is implied.</p><button className="primary full" onClick={()=>setModal(null)}>Got it. Let’s train.</button></Modal>}
    {detail&&<Modal title={dateLabel(detail.startTime)+' · Armor Building Complex'} onClose={()=>setDetail(null)}><div className="summary-metrics"><div><strong>{detail.completedRounds}</strong><span>ROUNDS</span></div><div><strong>{time(detail.duration||0)}</strong><span>DURATION</span></div><div><strong>{displayWeight(detail.weight)}</strong><span>PER BELL</span></div></div><p className="modal-copy">{detail.bellCount===1?'Single bell · both sides':detail.bellCount===2?'Double kettlebell':'Legacy session · bell setup not recorded'}</p><p className="notes-content">{detail.notes||'No notes for this session.'}</p><button className="secondary full" onClick={()=>setDetail(null)}>Close session</button></Modal>}
  </div>;

  function renderSessions(records, compact=false) {
    if (loadState==='loading') return <div className="empty-state"><p>Loading your training history…</p></div>;
    if (historyError) return <div className="empty-state error" role="alert"><p>{historyError}</p></div>;
    if (!records.length) return <div className={`empty-state ${compact?'compact':''}`}><span className="empty-icon"><Icon name="history" size={25}/></span><div><h3>Your first session belongs here.</h3><p>{account?'Finish a workout and start building your history.':'Sign in to see your sessions, or explore the app.'}</p></div>{!compact&&<button className="secondary" onClick={()=>setTab('train')}>Start training <Icon name="arrow" size={16}/></button>}</div>;
    return <div className="session-list">{records.map(s=><button className="session-row" key={s.id} onClick={()=>setDetail(s)}><span className="session-icon"><Icon name="train"/></span><span className="session-name"><strong>Armor Building Complex</strong><small>{dateLabel(s.startTime)} <i>·</i> {s.bellCount===1?'Single · both sides':s.bellCount===2?'Double kettlebell':'Legacy session'}</small></span><span className="row-rounds"><strong>{s.completedRounds}</strong><small>rounds</small></span><span className="row-weight">{s.bellCount===2?'2 × ':''}{displayWeight(s.weight)}</span><span className="row-duration">{time(s.duration||0)}</span><Icon name="arrow" size={18}/></button>)}</div>;
  }
}
