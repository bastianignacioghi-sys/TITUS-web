import { useState } from 'react';
import { useListContactMessages } from '@workspace/api-client-react';
import { Mail, Calendar, User, RefreshCw, Inbox } from 'lucide-react';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export default function Admin() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: messages, isLoading, isError, refetch, isFetching } = useListContactMessages();

  const selectedMsg = messages?.find(m => m.id === selected) ?? null;

  return (
    <div
      style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Top bar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#fff', textDecoration: 'none', letterSpacing: '0.05em' }}>
            STUDIO<span style={{ color: '#ff5a1f' }}>·KM</span>
          </a>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 18 }}>|</span>
          <span style={{ fontSize: 13, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Admin</span>
        </div>
        <button
          data-testid="button-refresh"
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: '#888', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s ease',
            opacity: isFetching ? 0.4 : 1,
          }}
        >
          <RefreshCw size={13} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          Actualizar
        </button>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        {/* Left panel — message list */}
        <aside style={{
          width: 360, flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Mensajes
            </span>
            {messages && (
              <span style={{ fontSize: 11, background: '#ff5a1f', color: '#000', padding: '2px 8px', fontWeight: 600, letterSpacing: '0.05em' }}>
                {messages.length}
              </span>
            )}
          </div>

          {isLoading && (
            <div style={{ padding: 40, textAlign: 'center', color: '#333', fontSize: 13 }}>
              Cargando...
            </div>
          )}

          {isError && (
            <div style={{ padding: 40, textAlign: 'center', color: '#ff4444', fontSize: 13 }}>
              Error al cargar mensajes.
            </div>
          )}

          {messages && messages.length === 0 && (
            <div style={{ padding: 60, textAlign: 'center', color: '#333' }}>
              <Inbox size={32} style={{ margin: '0 auto 12px', display: 'block', color: '#222' }} />
              <p style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sin mensajes aún</p>
            </div>
          )}

          {messages?.map(msg => (
            <button
              key={msg.id}
              data-testid={`msg-item-${msg.id}`}
              onClick={() => setSelected(msg.id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '18px 24px',
                background: selected === msg.id ? 'rgba(255,90,31,0.06)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderLeft: selected === msg.id ? '2px solid #ff5a1f' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: selected === msg.id ? '#fff' : '#ccc', fontWeight: 500, letterSpacing: '0.01em' }}>
                  {msg.name}
                </span>
                <span style={{ fontSize: 10, color: '#444', letterSpacing: '0.05em', flexShrink: 0, marginLeft: 8 }}>
                  {formatDate(msg.createdAt).split(',')[0]}
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#555', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {msg.email}
              </p>
              <p style={{ fontSize: 12, color: '#444', margin: '4px 0 0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {msg.message}
              </p>
            </button>
          ))}
        </aside>

        {/* Right panel — message detail */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '48px 56px' }}>
          {!selectedMsg ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#222' }}>
              <Mail size={48} style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#333' }}>
                Selecciona un mensaje
              </p>
            </div>
          ) : (
            <div style={{ maxWidth: 680 }}>
              {/* Header */}
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 10, color: '#ff5a1f', textTransform: 'uppercase', letterSpacing: '0.2em', border: '1px solid #ff5a1f', padding: '3px 10px' }}>
                    Mensaje #{selectedMsg.id}
                  </span>
                </div>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, lineHeight: 1, color: '#fff', letterSpacing: '0.02em', margin: 0 }}>
                  {selectedMsg.name}
                </h1>
              </div>

              {/* Meta */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 48 }}>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Mail size={12} color="#ff5a1f" />
                    <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Email</span>
                  </div>
                  <a
                    href={`mailto:${selectedMsg.email}`}
                    style={{ fontSize: 15, color: '#ccc', textDecoration: 'none' }}
                    data-testid="link-email"
                  >
                    {selectedMsg.email}
                  </a>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Calendar size={12} color="#ff5a1f" />
                    <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Recibido</span>
                  </div>
                  <span style={{ fontSize: 15, color: '#ccc' }}>{formatDate(selectedMsg.createdAt)}</span>
                </div>
              </div>

              {/* Message body */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Mensaje</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                </div>
                <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {selectedMsg.message}
                </p>
              </div>

              {/* Reply CTA */}
              <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <a
                  href={`mailto:${selectedMsg.email}?subject=Re: Studio KM`}
                  data-testid="link-reply"
                  style={{
                    display: 'inline-block',
                    border: '1px solid #ff5a1f', color: '#ff5a1f', background: 'transparent',
                    padding: '14px 32px', fontSize: 12, letterSpacing: '0.2em',
                    textTransform: 'uppercase', textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#ff5a1f';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#000';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#ff5a1f';
                  }}
                >
                  Responder por email →
                </a>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        aside button:hover { background: rgba(255,255,255,0.02) !important; }
      `}</style>
    </div>
  );
}
