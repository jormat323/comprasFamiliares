import { useEffect, useState } from 'react'
import { Text, View, TextInput, Button, FlatList } from 'react-native'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.EXPO_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_FIREBASE_PROJECT_ID
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function App(){
  const [text, setText] = useState('')
  const [items, setItems] = useState([])
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
  return (
    <View style={{padding:20, marginTop:40}}>
      <Text style={{fontSize:18, fontWeight:'bold'}}>Compramos Juntos — Mobile (demo)</Text>
      <TextInput value={text} onChangeText={setText} style={{borderWidth:1, padding:8, marginVertical:10}} />
      <Button title='Agregar' onPress={add} />
      <FlatList data={items} keyExtractor={i=>i.id} renderItem={({item})=> <Text>{item.name} — {item.qty}</Text>} />
    </View>
  )
}
