import { useEffect, useState } from 'react';
import { ShieldCheck, Play as Youtube, Camera as Instagram } from 'lucide-react';

export default function InAppBlockingSettings({ preferences, onChange }) {
  const [values, setValues] = useState(preferences || {});
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { setValues(preferences || {}); }, [preferences]);
  const toggle = async key => {
    const enabled = !values[key]; setSaving(key); setMessage('');
    try {
      const result = await onChange(key, enabled);
      setValues(previous => ({...previous,[key]:enabled}));
      setMessage(result?.ok ? 'Saved to your account.' : 'Saved locally. Account sync will retry when connected.');
    } catch(error) { setMessage(error.message || 'Could not save this preference.'); }
    finally { setSaving(''); }
  };
  return <section className="north-inapp" aria-label="In-app blocking">
    <div className="north-inapp-heading"><ShieldCheck size={22}/><div><h3>Keep the useful parts.</h3><p>In-app blocking · choose the feeds you want to leave behind.</p></div><span className="north-inapp-badge">Account preference</span></div>
    {[{name:'YouTube',Icon:Youtube,features:[['shorts','Shorts','Keep videos and subscriptions. Hide the endless feed.']]}, {name:'Instagram',Icon:Instagram,features:[['reels','Reels','Keep your connections. Skip short-video scrolling.'],['stories','Stories','Hide story browsing without blocking Instagram.']]}].map(({name,Icon,features}) => <div key={name} className="north-inapp-app"><div className="north-inapp-brand"><Icon size={22}/><strong>{name}</strong></div>{features.map(([key,label,detail]) => <div key={key} className="north-inapp-feature"><div><strong>{label}</strong><p>{detail}</p></div><button className="north-inapp-switch" type="button" role="switch" aria-label={`Block ${name} ${label}`} aria-checked={Boolean(values[key])} disabled={Boolean(saving)} onClick={() => toggle(key)}><span /></button></div>)}</div>)}
    <p className="north-inapp-note">Browser: install and connect the North extension. Android: approve Accessibility and start monitoring in tracking setup. Support depends on the app version; other parts of each app remain available.</p>
    <p className="north-inapp-message" role="status">{saving ? 'Saving…' : message}</p>
  </section>;
}
