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
  const inv = useFetch(API + '/kpi/inventory-turnover')
  const pos = useFetch(API + '/kpi/pos-in-progress');
  const pay = useFetch(API + '/kpi/payroll-next');

  // Fetch para obtener el total de productos
  const [totalProducts, setTotalProducts] = useState(null);

  // Fetch para obtener el total de empleados
  const [totalEmployees, setTotalEmployees] = useState(null);

  // 🎯 Nuevo fetch para obtener el total de compras OT
  const [totalPurchases, setTotalPurchases] = useState(null);

  useEffect(() => {
    // Obtener total de productos
    fetch(`${API}/products?page=0&size=1`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => setTotalProducts(data.totalItems || 0))
        .catch(() => setTotalProducts(0));

    // Obtener total de empleados
    fetch(`${API}/employees`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => setTotalEmployees(data.length || 0))
        .catch(() => setTotalEmployees(0));

    // Obtener total de compras OT
    fetch(`${API}/ot-en-curso/purchases`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => setTotalPurchases(data.length || 0))
        .catch(() => setTotalPurchases(0));
  }, []);

  return (
      <div className="grid">
        <div
            className="grid grid-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 16,
              marginTop: '2%'
            }}
        >
          <KpiCard
              title="Rotación inventario"
              value={totalProducts !== null ? totalProducts : '—'}
          />
          <KpiCard
              title="OT en curso"
              value={totalPurchases !== null ? totalPurchases : '—'}
              onClick={() => setCurrent('OT_EN_CURSO')}
          />
          <KpiCard
              title="Nómina de empleados"
              value={totalEmployees !== null ? totalEmployees : '—'}
              onClick={() => setCurrent('REGISTRO_NOMINA')}
          />
        </div>
      </div>
  );
}

function Products(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({sku:'', name:'', units:0, cost:0})
  const [editId, setEditId] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => {
    fetch(`${API}/products?page=${page}&size=15`)
        .then(r => {
          if (!r.ok) {
            throw new Error(`HTTP error! status: ${r.status}`);
          }
          return r.json();
        })
        .then(data => {
          console.log('Datos recibidos:', data);
          setList(data.products || [])
          setTotalPages(data.totalPages || 0)
          setTotalItems(data.totalItems || 0)
        })
        .catch(err => {
          console.error('Error al cargar productos:', err)
          setError('Error al cargar productos: ' + err.message)
          setList([])
        })
  }

  useEffect(() => { load() }, [page])

  const resetForm = () => {
    setForm({sku:'', name:'', units:0, cost:0})
    setEditId(null)
    setError('')
    setSuccess('')
  }

  const add = async(e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!form.sku.trim()) {
      setError('El SKU es obligatorio')
      return
    }
    if (!form.name.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    if (parseFloat(form.cost) <= 0) {
      setError('El costo debe ser mayor a 0')
      return
    }
    if (parseInt(form.units) < 0) {
      setError('Las unidades no pueden ser negativas')
      return
    }

    try {
      const method = editId ? 'PUT' : 'POST'
      const url = editId ? `${API}/products/${editId}` : `${API}/products`

      const payload = {
        sku: form.sku.trim(),
        name: form.name.trim(),
        units: parseInt(form.units),
        cost: parseFloat(form.cost).toFixed(2)
      }

      console.log('Enviando payload:', payload)

      const response = await fetch(url, {
        method,
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        setSuccess(editId ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente')
        resetForm()
        load()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error del servidor:', errorData)
        setError(errorData.error || 'Error al guardar el producto')
      }
    } catch (err) {
      console.error('Error al guardar:', err)
      setError('Error de conexión con el servidor: ' + err.message)
    }
  }

  const edit = (product) => {
    setForm({
      sku: product.sku,
      name: product.name,
      units: product.units,
      cost: product.cost
    })
    setEditId(product.id)
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const del = async(id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return

    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/products/${id}`, { method: 'DELETE' })

      if (response.ok) {
        setSuccess('Producto eliminado exitosamente')

        // Si la página actual queda vacía y no es la primera, ir a la página anterior
        if (list.length === 1 && page > 0) {
          setPage(page - 1)
        } else {
          load()
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || 'Error al eliminar el producto')
      }
    } catch (err) {
      console.error('Error al eliminar:', err)
      setError('Error de conexión con el servidor')
    }
  }

  return (
      <div className="grid">
        {/* Formulario */}
        <div className="card">
          <h3>{editId ? 'Editar producto' : 'Nuevo producto'}</h3>

          {error && (
              <div style={{
                padding: '10px',
                backgroundColor: '#993333',
                color: 'white',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                ❌ {error}
              </div>
          )}

          {success && (
              <div style={{
                padding: '10px',
                backgroundColor: '#2d5016',
                color: 'white',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                ✅ {success}
              </div>
          )}

          <form className="grid grid-2" onSubmit={add}>
            <input
                placeholder="SKU"
                value={form.sku}
                onChange={e => setForm({...form, sku:e.target.value})}
                required
            />

            <input
                placeholder="Nombre"
                value={form.name}
                onChange={e => setForm({...form, name:e.target.value})}
                required
            />

            {/* Input con label flotante para Unidades */}
            <div style={{position:'relative'}}>
              <input
                  placeholder=" "
                  type="number"
                  value={form.units}
                  onChange={e => setForm({...form, units:e.target.value})}
                  style={{width:'95%'}}
                  min="0"
                  step="1"
                  required
              />
              <label style={{
                position:'absolute',
                left:'12px',
                top: form.units || form.units === 0 ? '-8px' : '50%',
                transform: (form.units || form.units === 0) ? 'translateY(0)' : 'translateY(-50%)',
                background:'#1f2937',
                padding:'0 6px',
                fontSize: (form.units || form.units === 0) ? '12px' : '14px',
                color: (form.units || form.units === 0) ? '#6366f1' : '#9ca3af',
                transition:'all 0.2s ease',
                pointerEvents:'none'
              }}>Unidades</label>
            </div>

            {/* Input con label flotante para Costo */}
            <div style={{position:'relative'}}>
              <input
                  placeholder=" "
                  type="number"
                  step="0.01"
                  value={form.cost}
                  onChange={e => setForm({...form, cost:e.target.value})}
                  style={{width:'95%'}}
                  min="0.01"
                  required
              />
              <label style={{
                position:'absolute',
                left:'12px',
                top: form.cost || form.cost === 0 ? '-8px' : '50%',
                transform: (form.cost || form.cost === 0) ? 'translateY(0)' : 'translateY(-50%)',
                background:'#1f2937',
                padding:'0 6px',
                fontSize: (form.cost || form.cost === 0) ? '12px' : '14px',
                color: (form.cost || form.cost === 0) ? '#6366f1' : '#9ca3af',
                transition:'all 0.2s ease',
                pointerEvents:'none'
              }}>Costo</label>
            </div>

            <div style={{gridColumn:'1 / span 2', display:'flex', gap:'12px'}}>
              <button type="submit" style={{flex:1}}>
                {editId ? 'Actualizar' : 'Guardar'}
              </button>
              {editId && (
                  <button
                      type="button"
                      onClick={resetForm}
                      style={{background:'#3d4152'}}
                  >
                    Cancelar
                  </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="card">
          <h3>Inventario</h3>

          <table width="100%">
            <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Costo</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {list.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign:'center', padding:'40px', color:'#9ca3af'}}>
                    No hay productos registrados
                  </td>
                </tr>
            ) : (
                list.map(p => (
                    <tr key={p.id}>
                      <td style={{padding:'10px', textAlign:'center'}}>{p.sku}</td>
                      <td style={{padding:'10px', textAlign:'center'}}>{p.name}</td>
                      <td style={{padding:'10px', textAlign:'center'}}>{p.units}</td>
                      <td style={{padding:'10px', textAlign:'center'}}>${p.cost?.toFixed?.(2) || '0.00'}</td>
                      <td style={{padding:'10px', textAlign:'center'}}>
                        <button
                            onClick={() => edit(p)}
                            style={{
                              background:'none',
                              border:'none',
                              cursor:'pointer',
                              fontSize:'18px',
                              padding:'4px 8px'
                            }}
                            title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                            onClick={() => del(p.id)}
                            style={{
                              background:'none',
                              border:'none',
                              cursor:'pointer',
                              fontSize:'18px',
                              padding:'4px 8px'
                            }}
                            title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPages > 1 && (
              <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                gap:'20px',
                marginTop:'20px',
                paddingTop:'20px',
                borderTop:'1px solid #3d4152'
              }}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    style={{opacity: page === 0 ? 0.3 : 1}}
                >
                  Anterior
                </button>

                <span style={{color:'#9ca3af', fontSize:'14px'}}>
              Página {page + 1} de {totalPages} ({totalItems} productos)
            </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages - 1}
                    style={{opacity: page === totalPages - 1 ? 0.3 : 1}}
                >
                  Siguiente
                </button>
              </div>
          )}
        </div>
      </div>
  )
}

function Receipts(){
  const [suppliers,setSup]=useState([])
  const [products,setProducts]=useState([])
  const [receipt,setReceipt]=useState(null)
  const [item,setItem]=useState({productId:'',quantity:0,unitCost:0,lotCode:'',expiryDate:''})

  useEffect(()=>{
    fetch(API+'/products/all')
        .then(r=>r.json())
        .then(setProducts)
        .catch(err => {
          console.error('Error cargando productos:', err);
          setProducts([]);
        });

    fetch(API+'/suppliers')
        .then(r=>r.json())
        .then(setSup)
        .catch(()=>setSup([]));
  },[])

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

function Salas() {
  const [q, setQ] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar todas al inicio
  useEffect(() => {
    setLoading(true);
    fetch(API + '/salas')
        .then(r => r.json())
        .then(data => {
          setList(data);
          setLoading(false);
        })
        .catch(() => {
          setList([]);
          setLoading(false);
        });
  }, []);

  const search = () => {
    setLoading(true);
    const query = q.trim();
    const url = query
        ? `${API}/salas/search?q=${encodeURIComponent(query)}`
        : `${API}/salas`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
          setList(data);
          setLoading(false);
        })
        .catch(() => {
          setList([]);
          setLoading(false);
        });
  };

  // Permitir búsqueda al presionar Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') search();
  };

  return (
      <div className="card">
        <h3>Salas (Super Selectos)</h3>
        <div className="grid grid-3" style={{ marginBottom: '16px' }}>
          <input
              placeholder="Buscar por número de sala o nombre comercial..."
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
          />
          <button onClick={search}>Buscar</button>
          <span className="muted">{list.length} resultados</span>
        </div>

        {loading ? (
            <p>Cargando salas...</p>
        ) : (
            <table width="100%">
              <thead>
              <tr>
                <th>Número de Sala</th>
                <th>Nombre Comercial</th>
                <th>Dirección</th>
                <th>Distrito</th>
                <th>Municipio</th>
                <th>Departamento</th>
              </tr>
              </thead>
              <tbody>
              {list.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
                      No se encontraron salas
                    </td>
                  </tr>
              ) : (
                  list.map(sala => (
                      <tr key={sala.id}>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{sala.noDeSala}</td>
                        <td style={{ padding: '8px' }}>{sala.nombreComercial}</td>
                        <td style={{ padding: '8px' }}>{sala.direccion || '—'}</td>
                        <td style={{ padding: '8px' }}>{sala.distrito || '—'}</td>
                        <td style={{ padding: '8px' }}>{sala.municipio || '—'}</td>
                        <td style={{ padding: '8px' }}>{sala.departamento || '—'}</td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
        )}
      </div>
  );
}

function OTEnCurso({ setCurrent }) {
  const [view, setView] = useState('purchases'); // 'purchases', 'form', 'logs'
  const [purchases, setPurchases] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    distributor: '',
    totalPrice: 0
  });
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar lista de compras
  const fetchPurchases = async () => {
    setListLoading(true);
    try {
      const response = await fetch(`${API}/ot-en-curso/purchases`);
      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      } else {
        console.error('Error al cargar compras:', response.status);
        setPurchases([]);
      }
    } catch (err) {
      console.error('Error al cargar compras:', err);
      setError('Error al cargar las compras');
      setPurchases([]);
    } finally {
      setListLoading(false);
    }
  };

  // Cargar bitácora de operaciones
  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await fetch(`${API}/ot-en-curso/logs`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        console.error('Error al cargar bitácora:', response.status);
        setLogs([]);
      }
    } catch (err) {
      console.error('Error al cargar bitácora:', err);
      setLogs([]);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'purchases') {
      fetchPurchases();
    } else if (view === 'logs') {
      fetchLogs();
    }
  }, [view]);

  // Resetear formulario
  const resetForm = () => {
    setForm({ productName: '', distributor: '', totalPrice: 0 });
    setError('');
    setSuccess('');
  };

  // Guardar nueva compra
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validaciones
    if (!form.productName.trim()) {
      setError('El nombre del producto es obligatorio');
      setLoading(false);
      return;
    }
    if (!form.distributor.trim()) {
      setError('El distribuidor es obligatorio');
      setLoading(false);
      return;
    }
    if (parseFloat(form.totalPrice) <= 0) {
      setError('El precio total debe ser mayor a 0');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        productName: form.productName.trim(),
        distributor: form.distributor.trim(),
        totalPrice: parseFloat(form.totalPrice).toFixed(2)
      };

      const response = await fetch(`${API}/ot-en-curso/purchase/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccess('Compra registrada exitosamente');
        resetForm();
        setTimeout(() => {
          setView('purchases');
          setSuccess('');
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Error al guardar la compra');
      }
    } catch (err) {
      console.error('Error al guardar:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
      <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
        {/* Header con navegación */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h2 style={{ margin: 0 }}>OT en Curso</h2>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
                onClick={() => setView('purchases')}
                style={{
                  background: view === 'purchases' ? '#6366f1' : '#3d4152',
                  padding: '8px 16px'
                }}
            >
              📦 Compras
            </button>
            <button
                onClick={() => setView('form')}
                style={{
                  background: view === 'form' ? '#6366f1' : '#3d4152',
                  padding: '8px 16px'
                }}
            >
              ➕ Nueva Compra
            </button>
            <button
                onClick={() => setView('logs')}
                style={{
                  background: view === 'logs' ? '#6366f1' : '#3d4152',
                  padding: '8px 16px'
                }}
            >
              📋 Bitácora
            </button>
            <button
                type="button"
                onClick={() => setCurrent('Dashboard')}
                style={{ background: '#3d4152', padding: '8px 16px' }}
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {/* Vista: Lista de Compras */}
        {view === 'purchases' && (
            <div className="card">
              <h3>Compras Registradas ({purchases.length})</h3>

              {listLoading && (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    Cargando compras...
                  </p>
              )}

              {!listLoading && purchases.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                      No hay compras registradas
                    </p>
                    <button onClick={() => setView('form')} style={{ background: '#2d5016' }}>
                      ➕ Registrar Primera Compra
                    </button>
                  </div>
              )}

              {!listLoading && purchases.length > 0 && (
                  <table width="100%" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}>
                      <th style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid #374151' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #374151' }}>Producto</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #374151' }}>Distribuidor</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderRight: '1px solid #374151' }}>Precio Total</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Fecha</th>
                    </tr>
                    </thead>
                    <tbody>
                    {purchases.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #374151' }}>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{p.id}</td>
                          <td style={{ padding: '10px', textAlign: 'left' }}>{p.productName}</td>
                          <td style={{ padding: '10px', textAlign: 'left' }}>{p.distributor}</td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            ${p.totalPrice?.toFixed?.(2) || '0.00'}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            {formatDate(p.createdAt)}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </div>
        )}

        {/* Vista: Formulario Nueva Compra */}
        {view === 'form' && (
            <div className="card">
              <h3>Registrar Nueva Compra</h3>

              {error && (
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#993333',
                    color: 'white',
                    borderRadius: '4px',
                    marginBottom: '15px'
                  }}>
                    ❌ {error}
                  </div>
              )}

              {success && (
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#2d5016',
                    color: 'white',
                    borderRadius: '4px',
                    marginBottom: '15px'
                  }}>
                    ✅ {success}
                  </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
                    Nombre del Producto *
                  </label>
                  <input
                      type="text"
                      placeholder="Ingrese el nombre del producto"
                      value={form.productName}
                      onChange={e => setForm({ ...form, productName: e.target.value })}
                      required
                      style={{ width: '95%' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
                    Distribuidor *
                  </label>
                  <input
                      type="text"
                      placeholder="Ingrese el nombre del distribuidor"
                      value={form.distributor}
                      onChange={e => setForm({ ...form, distributor: e.target.value })}
                      required
                      style={{ width: '95%' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>
                    Precio Total para el Proyecto *
                  </label>
                  <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={form.totalPrice}
                      onChange={e => setForm({ ...form, totalPrice: e.target.value })}
                      required
                      style={{ width: '95%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                      type="submit"
                      disabled={loading}
                      style={{ flex: 1 }}
                  >
                    {loading ? 'Guardando...' : 'Guardar Compra'}
                  </button>
                  <button
                      type="button"
                      onClick={() => setView('purchases')}
                      style={{ background: '#3d4152' }}
                  >
                    Ver Compras
                  </button>
                </div>
              </form>
            </div>
        )}

        {/* Vista: Bitácora de Operaciones */}
        {view === 'logs' && (
            <div className="card">
              <h3>Bitácora de Operaciones</h3>

              {logsLoading && (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    Cargando bitácora...
                  </p>
              )}

              {!logsLoading && logs.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No hay operaciones registradas
                  </p>
              )}

              {!logsLoading && logs.length > 0 && (
                  <table width="100%" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}>
                      <th style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid #374151', width: '8%' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #374151', width: '15%' }}>Usuario</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #374151', width: '15%' }}>Acción</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #374151', width: '40%' }}>Detalles</th>
                      <th style={{ padding: '12px', textAlign: 'center', width: '22%' }}>Fecha</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logs.map(log => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #374151' }}>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{log.id}</td>
                          <td style={{ padding: '10px', textAlign: 'left' }}>{log.username}</td>
                          <td style={{ padding: '10px', textAlign: 'left' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#374151',
                        fontSize: '12px'
                      }}>
                        {log.action}
                      </span>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'left', color: '#9ca3af' }}>
                            {log.details}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            {formatDate(log.whenAction)}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </div>
        )}
      </div>
  );
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
    {current==='Salas' && <Salas />}
    {current==='REGISTRO_NOMINA' && <NominaForm setCurrent={setCurrent} />}
    {current==='OT_EN_CURSO' && <OTEnCurso setCurrent={setCurrent} />}
  </div>)
}