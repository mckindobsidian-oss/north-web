import { useEffect, useState } from 'react';

export default function NorthContextMenu() {
  const [menu,setMenu] = useState(null);
  useEffect(() => {
    const open = event => {
      if (event.target.closest('input, textarea, select, [contenteditable="true"], a')) return;
      event.preventDefault();
      setMenu({x:Math.min(event.clientX,window.innerWidth-190),y:Math.min(event.clientY,window.innerHeight-150)});
    };
    const close = () => setMenu(null);
    const escape = event => { if (event.key === 'Escape') close(); };
    document.addEventListener('contextmenu',open);
    document.addEventListener('click',close);
    document.addEventListener('keydown',escape);
    window.addEventListener('scroll',close,true);
    return () => { document.removeEventListener('contextmenu',open); document.removeEventListener('click',close); document.removeEventListener('keydown',escape); window.removeEventListener('scroll',close,true); };
  },[]);
  if (!menu) return null;
  return <div role="menu" aria-label="North menu" style={{position:'fixed',zIndex:99999,left:Math.max(0,menu.x),top:Math.max(0,menu.y),width:180,padding:6,borderRadius:14,background:'#24232e',border:'1px solid #ffffff30',boxShadow:'0 16px 40px #0008',color:'#f7f5ff'}}>{[['Back',()=>history.back()],['Forward',()=>history.forward()],['Reload',()=>location.reload()]].map(([label,action]) => <button key={label} role="menuitem" type="button" onClick={action} style={{display:'block',width:'100%',padding:'10px 12px',textAlign:'left',color:'inherit',background:'transparent',border:0,borderRadius:8,cursor:'pointer'}}>{label}</button>)}</div>;
}
