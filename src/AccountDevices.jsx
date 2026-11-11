import { useEffect, useState } from 'react';
import { readDevices } from './lib/devices.js';
export default function AccountDevices({ client, owner, style }) {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
  const load = async () => { try { setDevices(await readDevices(client, owner)); setError(''); } catch (e) { setError(e.message); } };
  useEffect(() => { let live = true; readDevices(client, owner).then(rows => { if (live) setDevices(rows); }).catch(e => { if (live) setError(e.message); }); return () => { live = false; }; }, [client, owner]);
  return <section style={style} aria-label="Paired devices"><h3>Paired devices</h3><p style={{opacity:.7,fontSize:13}}>Devices connected to your account. Last seen is their most recent connection.</p>{error && <p role="alert">{error}</p>}<div style={{display:'grid',gap:8}}>{devices.map(d => <div key={d.device_id} style={{display:'flex',justifyContent:'space-between',gap:12,padding:'12px 14px',border:'1px solid #ffffff24',borderRadius:12}}><div><strong style={{textTransform:'capitalize'}}>{d.platform}</strong><div style={{opacity:.6,fontSize:12}}>Device {d.device_id.slice(0,8)}</div></div><span style={{opacity:.7,fontSize:12,textAlign:'right'}}>Last seen<br/>{new Date(d.last_seen).toLocaleString()}</span></div>)}</div>{!devices.length && !error && <p>No devices registered yet.</p>}<button className="b" type="button" onClick={load} style={{marginTop:12,padding:'9px 14px',border:'1px solid #ffffff35',borderRadius:10,color:'inherit'}}>Refresh</button></section>;
}
