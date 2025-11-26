import Link from 'next/link'
export default function Home(){ 
  return (
    <main style={{padding:20}}>
      <h1>Compramos Juntos — Web (starter)</h1>
      <p>Instalá dependencias y configurá Firebase para probar.</p>
      <ul>
        <li><Link href="/list">Lista colaborativa (demo)</Link></li>
      </ul>
    </main>
  )
}
