export default function Ornament({ children = '·  ·  ·' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 14, color: 'var(--brass)', fontSize: 16, letterSpacing: '0.4em',
    }}>
      <div style={{ width: 40, height: 1, background: 'var(--hairline)' }} />
      <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>{children}</span>
      <div style={{ width: 40, height: 1, background: 'var(--hairline)' }} />
    </div>
  );
}
