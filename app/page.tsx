export default function Home() {
  return (
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0A0A0A',
      }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: '900',
          color: '#F5A623',
          letterSpacing: '12px',
        }}>
          WAX
        </h1>
        <p style={{ color: '#888888', marginTop: '8px', letterSpacing: '2px' }}>
          Your vinyl library
        </p>
      </main>
  )
}