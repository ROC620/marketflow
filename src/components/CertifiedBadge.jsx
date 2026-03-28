export default function CertifiedBadge({ size = 40 }) {
  return (
    <div
      title="Certifié MarchéduRoi — Vérifié sur le terrain par l'équipe MarchéduRoi"
      style={{ display: "inline-flex", alignItems: "center", flexShrink: 0, cursor: "help", filter: "drop-shadow(0 2px 4px rgba(108,99,255,0.4))" }}>
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 3 L70 20 L70 54 L40 71 L10 54 L10 20 Z"
          fill="white" stroke="#6C63FF" strokeWidth="3.5" strokeLinejoin="round"/>
        <text x="40" y="52" textAnchor="middle" fontSize="36" fontWeight="900"
          fill="#FF4757" fontFamily="Georgia, serif">M</text>
        <line x1="12" y1="62" x2="62" y2="62" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round"/>
        <polygon points="60,58 68,62 60,66" fill="#6C63FF"/>
        <text x="36" y="76" textAnchor="middle" fontSize="10" fontWeight="600"
          fill="#FF4757" fontFamily="Georgia, serif" fontStyle="italic">MarchéduRoi</text>
      </svg>
    </div>
  );
}
