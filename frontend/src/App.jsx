import React, { useState, useEffect } from 'react'

const API = 'http://localhost:8080/api'

function useFetch(url){
  const [data,setData]=useState(null)
  useEffect(()=>{
    fetch(url)
        .then(r=>r.json())
        .then(setData)
        .catch(()=>setData([]))
  },[url])
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

function KpiCard({ title, value, onClick }) {
  return (
      <div
          className="card"
          style={{ cursor: onClick ? 'pointer' : 'default' }}
          onClick={onClick}
      >
        <div className="muted">{title}</div>
        <div className="kpi">{value}</div>
      </div>
  );
}

function Dashboard({ setCurrent }) {
  const inv = useFetch(API + '/kpi/inventory-turnover');
  const ord = useFetch(API + '/kpi/orders-open');
  const pos = useFetch(API + '/kpi/pos-in-progress');
  const pay = useFetch(API + '/kpi/payroll-next');
  const alerts = useFetch(API + '/kpi/alerts');

  return (
      <div className="grid">
        <div
            className="grid grid-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 16,
            }}
        >
          <KpiCard title="Rotación inventario" value={inv?.value ?? '—'} />
          <KpiCard title="Pedidos abiertos" value={ord?.value ?? '—'} />
          <KpiCard title="OT en curso" value={pos?.value ?? '—'} />
          <KpiCard
              title="Nómina de empleados"
              value={pay?.value ?? '—'}
              onClick={() => setCurrent('REGISTRO_NOMINA')}
          />
        </div>

        <div className="card">
          <h3>Alertas</h3>
          <ul>
            {(alerts || []).map((a, i) => (
                <li key={i}>
                  {a.type}: {a.message}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
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

function NominaForm({ setCurrent }) {
  const [dui, setDui] = useState('');
  const [names, setNames] = useState('');
  const [lastName, setLastName] = useState('');
  const [weeklySalary, setWeeklySalary] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🎯 Nuevo estado para almacenar y mostrar el error del backend
  const [formError, setFormError] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const fetchEmployees= async ()=>{
    setListLoading(true);
    try{
      const response = await fetch(API+'/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }else{
        console.error("Error al cargar el listado:", response.status);
        setEmployees([]);
      }
    }catch (error) {
      console.error('Error al cargar el listado:', error);
      setEmployees([]);
    }finally{
      setListLoading(false);
    }
  };
  useEffect(()=>{
    fetchEmployees();
  }, []);

  //Envio de datos del formulario
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try{
      const response = await fetch(API+'/employees',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({dui, names, lastName, weeklySalary: +weeklySalary})
      });

      if (response.ok) {
        alert(`Empleado ${names} ${lastName} registrado exitosamente!`);
        await fetchEmployees(); // Refresca la lista

        //Limpia el formuliario
        setDui(''); setNames(''); setLastName(''); setWeeklySalary(0);
      } else if (response.status === 400) {
        const errorText = await response.text();
        setFormError(errorText);
        alert(`Error de Validación: ${errorText}`);
      } else {
        alert(`Verifique cumplir con los formatos requeridos (monto positivo, sin símbolos, DUI único).`);
      }
    } catch(error){
      setFormError('Error de conexión con el servidor.');
      alert('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return(
      <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: 600 }}>

            {formError && (
                <div
                    style={{
                      padding: '10px',
                      backgroundColor: '#993333',
                      color: 'white',
                      borderRadius: '4px',
                      marginBottom: '15px',
                      textAlign: 'center'
                    }}
                >
                  ❌ **Error:** {formError}
                </div>
            )}

            <h3>Registro de nómina semanal por empleado:</h3>
            <form onSubmit={handleSubmit} className="grid grid-2">
              <input placeholder="DUI (Formato de 10 digitos con guion)" value={dui} onChange={e => setDui(e.target.value)} maxLength={10} required/>
              <input placeholder="Ingrese los nombres del empleado" value={names} onChange={e => setNames(e.target.value)} pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$" title="Solo se permiten letras y espacios." required/>
              <input placeholder="Ingrese los apellidos del empleado" value={lastName} onChange={e => setLastName(e.target.value)} pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$" title="Solo se permiten letras y espacios." required/>
              <input placeholder="Salario semanal del empleado" type="number" step="0.01" value={weeklySalary} onChange={e => setWeeklySalary(e.target.value)} required/>

              <button style={{ gridColumn: '1 / span 2' }} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Empleado'}
              </button>
            </form>

            <button type="button" onClick={() => setCurrent('Dashboard')} className="muted">
              ← Regresar
            </button>
          </div>
        </div>

        <div className="card">
          <h3>Nomina de los empleados ({employees ? employees.length : '—'})</h3>

          {listLoading && <p>Cargando datos de empleados...</p>}

          {(!listLoading && employees && employees.length > 0) && (
              <table
                  width="100%"
                  style={{
                    borderCollapse: 'collapse',
                    border: '1px solid #374151',
                    fontSize: '0.95em'
                  }}
              >
                <thead style={{ backgroundColor: '#1F2937', color: '#F3F4F6' }}>
                <tr>
                  <th style={{ width: '5%', textAlign: 'center', padding: '12px 8px', borderRight: '1px solid #374151' }}>ID</th>
                  <th style={{ width: '15%', textAlign: 'left', padding: '12px 8px', borderRight: '1px solid #374151' }}>DUI</th>
                  <th style={{ width: '25%', textAlign: 'left', padding: '12px 8px', borderRight: '1px solid #374151' }}>Nombres</th>
                  <th style={{ width: '25%', textAlign: 'left', padding: '12px 8px', borderRight: '1px solid #374151' }}>Apellidos</th>
                  <th style={{ width: '30%', textAlign: 'right', padding: '12px 8px' }}>Salario Semanal</th>
                </tr>
                </thead>
                <tbody>
                {employees.map(emp => (
                    <tr
                        key={emp.id}
                        style={{ borderBottom: '1px solid #374151' }}
                    >
                      <td style={{ textAlign: 'center', padding: '10px 8px' }}>{emp.id}</td>
                      <td style={{ textAlign: 'left', padding: '10px 8px' }}>{emp.dui}</td>
                      <td style={{ textAlign: 'left', padding: '10px 8px' }}>{emp.names}</td>
                      <td style={{ textAlign: 'left', padding: '10px 8px' }}>{emp.lastName}</td>
                      <td style={{ textAlign: 'right', padding: '10px 8px' }}>${emp.weeklySalary?.toFixed(2) ?? '0.00'}</td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
          {(!listLoading && employees.length === 0) && (
              <p className="muted">No hay empleados regisrados en el sistema.</p>
          )}
        </div>
      </div>
  );
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
  const tabs=['Dashboard','Productos','Salas']
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
    {current==='Dashboard' && <Dashboard setCurrent={setCurrent} />}
    {current==='Productos' && <Products />}
    {current==='Salas' && <Rooms />}
    {current==='REGISTRO_NOMINA' && <NominaForm setCurrent={setCurrent} />}
  </div>)
}