import { useState, useEffect, useRef } from 'react';
import { useListContactMessages, useListProjects, useCreateProject, useDeleteProject, useRequestUploadUrl } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Mail, Calendar, RefreshCw, Inbox, Lock, ImagePlus, Trash2, Upload, LayoutGrid } from 'lucide-react';

const SESSION_KEY = 'km_admin_auth';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function getImageUrl(imagePath: string) {
  if (imagePath.startsWith('http')) return imagePath;
  return imagePath.replace('/objects/', '/api/storage/objects/');
}

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onAuth();
    } else {
      setError(true);
      setShaking(true);
      setValue('');
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setError(false), 2500);
    }
  }

  return (
    <div style={{
      background: '#0a0a0a', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ width: 360, textAlign: 'center' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#fff', letterSpacing: '0.05em' }}>
            TITUS<span style={{ color: '#ff5a1f' }}>·DISEÑO</span>
          </span>
          <p style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 8 }}>
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: shaking ? 'shake 0.4s ease' : 'none' }}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Lock size={14} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: error ? '#ff4444' : '#333', transition: 'color 0.2s' }} />
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Contraseña"
              style={{
                width: '100%', padding: '14px 16px 14px 44px',
                background: '#111', border: `1px solid ${error ? '#ff444466' : 'rgba(255,255,255,0.08)'}`,
                color: '#fff', fontSize: 15, outline: 'none',
                letterSpacing: '0.05em', transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#ff4444', marginBottom: 16, letterSpacing: '0.05em' }}>
              Contraseña incorrecta
            </p>
          )}

          <button
            type="submit"
            style={{
              width: '100%', padding: '14px', background: '#ff5a1f', border: 'none',
              color: '#000', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Ingresar
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

function ProjectsPanel() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useListProjects();
  const requestUploadUrl = useRequestUploadUrl();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setUploadError('');
    try {
      const urlResp = await requestUploadUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type },
      });
      await fetch(urlResp.uploadURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      await createProject.mutateAsync({
        data: {
          title: title.trim(),
          category: category.trim() || undefined,
          imagePath: urlResp.objectPath,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['listProjects'] });
      setTitle('');
      setCategory('');
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setUploadError('Error al subir imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await deleteProject.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: ['listProjects'] });
    } finally {
      setDeletingId(null);
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, color: '#555', textTransform: 'uppercase',
    letterSpacing: '0.15em', marginBottom: 8,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', background: '#111',
    border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', height: 'calc(100vh - 65px)' }}>
      {/* Upload panel */}
      <aside style={{
        borderRight: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>
          Subir proyecto
        </div>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* File picker */}
          <div>
            <label style={labelStyle}>Imagen</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${preview ? '#ff5a1f44' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 2, cursor: 'pointer', overflow: 'hidden',
                aspectRatio: '4/3', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#0d0d0d', transition: 'border-color 0.2s',
              }}
            >
              {preview ? (
                <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#333' }}>
                  <ImagePlus size={28} style={{ margin: '0 auto 8px', display: 'block' }} />
                  <span style={{ fontSize: 12, letterSpacing: '0.05em' }}>Seleccionar imagen</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Título *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Señalética Hospital del Norte"
              style={inputStyle}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Categoría (opcional)</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Sin categoría</option>
              <option value="Producción Gráfica">Producción Gráfica</option>
              <option value="Producción Industrial">Producción Industrial</option>
              <option value="Montaje en Obra">Montaje en Obra</option>
              <option value="Soluciones">Soluciones</option>
            </select>
          </div>

          {uploadError && (
            <p style={{ fontSize: 12, color: '#ff4444', margin: 0 }}>{uploadError}</p>
          )}

          <button
            type="submit"
            disabled={!file || !title.trim() || uploading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px', background: !file || !title.trim() || uploading ? '#1a1a1a' : '#ff5a1f',
              border: 'none', color: !file || !title.trim() || uploading ? '#333' : '#000',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
              cursor: !file || !title.trim() || uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Upload size={13} style={{ animation: uploading ? 'spin 1s linear infinite' : 'none' }} />
            {uploading ? 'Subiendo...' : 'Subir proyecto'}
          </button>
        </form>
      </aside>

      {/* Projects grid */}
      <main style={{ overflowY: 'auto', padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Proyectos publicados
          </span>
          {projects && (
            <span style={{ fontSize: 11, background: '#ff5a1f', color: '#000', padding: '2px 8px', fontWeight: 600 }}>
              {projects.length}
            </span>
          )}
        </div>

        {isLoading && (
          <div style={{ color: '#333', fontSize: 13, textAlign: 'center', paddingTop: 60 }}>
            Cargando...
          </div>
        )}

        {!isLoading && projects?.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 80, color: '#222' }}>
            <LayoutGrid size={40} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Sube el primer proyecto
            </p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}>
          {projects?.map(p => (
            <div
              key={p.id}
              style={{
                position: 'relative', background: '#111', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img
                  src={getImageUrl(p.imagePath)}
                  alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                {p.category && (
                  <p style={{ fontSize: 9, color: '#ff5a1f', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 4px' }}>
                    {p.category}
                  </p>
                )}
                <p style={{ fontSize: 13, color: '#ddd', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
                  {p.title}
                </p>
                <p style={{ fontSize: 10, color: '#444', margin: '4px 0 0' }}>
                  {formatDate(p.createdAt).split(',')[0]}
                </p>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                disabled={deletingId === p.id}
                title="Eliminar proyecto"
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4, color: deletingId === p.id ? '#444' : '#ff4444',
                  cursor: deletingId === p.id ? 'not-allowed' : 'pointer',
                  padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [adminTab, setAdminTab] = useState<'messages' | 'projects'>('messages');
  const [selected, setSelected] = useState<number | null>(null);
  const { data: messages, isLoading, isError, refetch, isFetching } = useListContactMessages();

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />;

  const selectedMsg = messages?.find(m => m.id === selected) ?? null;

  return (
    <div
      style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Top bar */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 65 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#fff', textDecoration: 'none', letterSpacing: '0.05em' }}>
            TITUS<span style={{ color: '#ff5a1f' }}>·DISEÑO</span>
          </a>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 18 }}>|</span>
          <span style={{ fontSize: 13, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Admin</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { key: 'messages', label: 'Mensajes', icon: <Mail size={13} /> },
            { key: 'projects', label: 'Proyectos', icon: <LayoutGrid size={13} /> },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setAdminTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: adminTab === tab.key ? 'rgba(255,90,31,0.12)' : 'transparent',
                border: adminTab === tab.key ? '1px solid rgba(255,90,31,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color: adminTab === tab.key ? '#ff5a1f' : '#666',
                fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {adminTab === 'messages' && (
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
        )}
        {adminTab === 'projects' && <div style={{ width: 120 }} />}
      </header>

      {adminTab === 'projects' ? (
        <ProjectsPanel />
      ) : (
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

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Mensaje</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  </div>
                  <p style={{ fontSize: 17, color: '#bbb', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedMsg.message}
                  </p>
                </div>

                <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <a
                    href={`mailto:${selectedMsg.email}?subject=Re: TITUS`}
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
      )}

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
