import { useEffect, useState } from 'react'
import { db } from '../lib/firebaseClient'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'

export default function ListPage(){
  const [items, setItems] = useState([])
  const [text, setText] = useState('')
  useEffect(()=>{
    const unsub = onSnapshot(collection(db,'demoItems'), snap=>{
      setItems(snap.docs.map(d=>({id:d.id,...d.data()})))
    })
    return ()=>unsub()
  },[])
  async function add(){
    if(!text) return
    await addDoc(collection(db,'demoItems'), { name:text, qty:1, createdAt: new Date() })
    setText('')
  }
  return <div style={{padding:20}}>
    <h2>Lista colaborativa (demo)</h2>
    <input value={text} onChange={e=>setText(e.target.value)} />
    <button onClick={add}>Agregar</button>
    <ul>{items.map(i=> <li key={i.id}>{i.name} — {i.qty}</li>)}</ul>
  </div>
}
