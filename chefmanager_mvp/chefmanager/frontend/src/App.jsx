import React, { useState, useEffect } from 'react'

const API = 'http://localhost:8080/api'

function useFetch(url){
  const [data,setData]=useState(null)
  useEffect(()=>{ fetch(url).then(r=>r.json()).then(setData).catch(()=>setData([])) },[url])
  return data
}

function Login({onLogin}){
  const [username,setU]=useState('admin')
  const [password,setP]=useState('admin123')
  const [err,setErr]=useState('')
  const submit=async(e)=>{
    e.preventDefault()
    const r = await fetch(API+'/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})})
    if(r.ok){ const j=await r.json(); onLogin(j) } else { setErr('Credenciales inválidas') }
  }
  return (<div className="card" style={{maxWidth:380, margin:'64px auto'}}>
    <h2>ChefManager • Iniciar sesión</h2>
    <form onSubmit={submit} className="grid">
      <input value={username} onChange={e=>setU(e.target.value)} placeholder="Usuario" />
      <input type="password" value={password} onChange={e=>setP(e.target.value)} placeholder="Contraseña" />
      <button>Entrar</button>
      {err && <p className="muted">{err}</p>}
    </form>
  </div>)
}

function KpiCard({title,value}){
  return <div className="card"><div className="muted">{title}</div><div className="kpi">{value}</div></div>
}

function Dashboard(){
  const inv = useFetch(API+'/kpi/inventory-turnover')
  const ord = useFetch(API+'/kpi/orders-open')
  const pos = useFetch(API+'/kpi/pos-in-progress')
  const pay = useFetch(API+'/kpi/payroll-next')
  const alerts = useFetch(API+'/kpi/alerts')
  return (<div className="grid">
    <div className="grid grid-4" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
      <KpiCard title="Rotación inventario" value={inv?.value ?? '—'} />
      <KpiCard title="Pedidos abiertos" value={ord?.value ?? '—'} />
      <KpiCard title="OT en curso" value={pos?.value ?? '—'} />
      <KpiCard title="Nómina (días para cierre)" value={pay?.value ?? '—'} />
    </div>
    <div className="card">
      <h3>Alertas</h3>
      <ul>{(alerts||[]).map((a,i)=><li key={i}>{a.type}: {a.message}</li>)}</ul>
    </div>
  </div>)
}

function Products(){
  const [list,setList]=useState([])
  const [form,setForm]=useState({sku:'',name:'',unit:'UND',minStock:0,maxStock:0,cost:0})
  const load=()=>fetch(API+'/products').then(r=>r.json()).then(setList)
  useEffect(load,[])
  const add=async(e)=>{ e.preventDefault(); await fetch(API+'/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); setForm({sku:'',name:'',unit:'UND',minStock:0,maxStock:0,cost:0}); load(); }
  return (<div className="grid">
    <div className="card"><h3>Nuevo producto</h3>
      <form className="grid grid-2" onSubmit={add}>
        <input placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}/>
        <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Unidad" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/>
        <input placeholder="Stock min" type="number" value={form.minStock} onChange={e=>setForm({...form,minStock:+e.target.value})}/>
        <input placeholder="Stock max" type="number" value={form.maxStock} onChange={e=>setForm({...form,maxStock:+e.target.value})}/>
        <input placeholder="Costo" type="number" step="0.01" value={form.cost} onChange={e=>setForm({...form,cost:+e.target.value})}/>
        <button>Guardar</button>
      </form>
    </div>
    <div className="card"><h3>Inventario</h3>
      <table width="100%">
        <thead><tr><th>SKU</th><th>Nombre</th><th>Unidad</th><th>Costo</th></tr></thead>
        <tbody>{list.map(p=>(<tr key={p.id}><td>{p.sku}</td><td>{p.name}</td><td>{p.unit}</td><td>${p.cost?.toFixed?.(2)}</td></tr>))}</tbody>
      </table>
    </div>
  </div>)
}

function Receipts(){
  const [suppliers,setSup]=useState([])
  const [products,setProducts]=useState([])
  const [receipt,setReceipt]=useState(null)
  const [item,setItem]=useState({productId:'',quantity:0,unitCost:0,lotCode:'',expiryDate:''})
  useEffect(()=>{ fetch(API+'/products').then(r=>r.json()).then(setProducts); fetch('http://localhost:8080/api/suppliers').catch(()=>{}); },[])
  const create=async()=>{ 
    const r=await fetch(API+'/receipts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({supplierId:1})}); 
    const j=await r.json(); setReceipt(j);
  }
  const add=async()=>{
    if(!receipt) return;
    const product = products.find(p=>p.id==item.productId)
    await fetch(API+`/receipts/${receipt.id}/items`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      receipt: {id: receipt.id},
      product,
      quantity:+item.quantity, unitCost:+item.unitCost, lotCode:item.lotCode, expiryDate:item.expiryDate
    })})
    alert('Item agregado')
  }
  const confirm=async()=>{
    await fetch(API+`/receipts/${receipt.id}/confirm`,{method:'POST'})
    alert('Recepción confirmada')
  }
  return (<div className="grid">
    <div className="card">
      <h3>Recepción de compras</h3>
      {!receipt && <button onClick={create}>Crear recepción</button>}
      {receipt && <div>Recepción #{receipt.id} • Estado: {receipt.status} <button onClick={confirm}>Confirmar</button></div>}
    </div>
    <div className="card">
      <h3>Agregar ítem</h3>
      <div className="grid grid-3">
        <select value={item.productId} onChange={e=>setItem({...item,productId:e.target.value})}>
          <option value="">Producto</option>
          {products.map(p=><option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
        </select>
        <input type="number" placeholder="Cantidad" value={item.quantity} onChange={e=>setItem({...item,quantity:e.target.value})}/>
        <input type="number" step="0.01" placeholder="Costo" value={item.unitCost} onChange={e=>setItem({...item,unitCost:e.target.value})}/>
        <input placeholder="Lote" value={item.lotCode} onChange={e=>setItem({...item,lotCode:e.target.value})}/>
        <input type="date" placeholder="Vence" value={item.expiryDate} onChange={e=>setItem({...item,expiryDate:e.target.value})}/>
        <button onClick={add}>Agregar</button>
      </div>
    </div>
  </div>)
}

function Rooms(){
  const [q,setQ]=useState('')
  const [list,setList]=useState([])
  const search=()=>fetch(API+`/rooms/search?q=${encodeURIComponent(q||'')}`).then(r=>r.json()).then(setList)
  useEffect(()=>{ fetch(API+'/rooms').then(r=>r.json()).then(setList) },[])
  return (<div className="card">
    <h3>Salas (Super Selectos)</h3>
    <div className="grid grid-3">
      <input placeholder="Buscar nombre..." value={q} onChange={e=>setQ(e.target.value)} />
      <button onClick={search}>Buscar</button>
      <span className="muted">{list.length} resultados</span>
    </div>
    <ul>{list.map(r=><li key={r.id}><b>{r.storeCode}</b> — {r.name} · {r.municipality}, {r.departmentName}</li>)}</ul>
  </div>)
}

function Nav({current,setCurrent}){
  const tabs=['Dashboard','Productos','Recepción','Salas']
  return (<header style={{display:'flex',gap:12,alignItems:'center',justifyContent:'space-between',padding:16}}>
    <div style={{display:'flex',gap:12,alignItems:'center'}}>
      <b>ChefManager</b>
      {tabs.map(t=><button key={t} onClick={()=>setCurrent(t)} style={{background: current===t?'#1f2937':'#0f172a'}}>{t}</button>)}
    </div>
    <a href="https://">Ayuda</a>
  </header>)
}

export default function App(){
  const [session,setSession]=useState(null)
  const [current,setCurrent]=useState('Dashboard')
  if(!session) return <Login onLogin={setSession} />
  return (<div style={{maxWidth:1100, margin:'24px auto', padding:'0 16px'}}>
    <Nav current={current} setCurrent={setCurrent} />
    {current==='Dashboard' && <Dashboard />}
    {current==='Productos' && <Products />}
    {current==='Recepción' && <Receipts />}
    {current==='Salas' && <Rooms />}
  </div>)
}
