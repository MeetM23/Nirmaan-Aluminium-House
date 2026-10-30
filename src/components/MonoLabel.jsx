// src/components/MonoLabel.jsx
export default function MonoLabel({ children, color = 'text-[#C9CCD1]', className = '' }) {
  return (
    <span className={`font-mono text-xs uppercase tracking-wider ${color} ${className}`}>
      {children}
    </span>
  );
}

