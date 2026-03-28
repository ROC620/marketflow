import Icon from "./Icon";

export default function VehicleCard({ vehicle, theme }) {
  if (!vehicle) return null;
  const fields = [
    { label: "Marque",          val: vehicle.marque },
    { label: "Modèle",          val: vehicle.modele },
    { label: "Année",           val: vehicle.annee },
    { label: "Transmission",    val: vehicle.transmission },
    { label: "Puissance",       val: vehicle.puissance },
    { label: "Carburant",       val: vehicle.carburant },
    { label: "Garniture sièges",val: vehicle.garniture },
    { label: "Capacité",        val: vehicle.capacite },
    { label: "Climatisation",   val: vehicle.climatisation },
    { label: "Documents",       val: vehicle.docs },
    { label: "Série/Immat.",    val: vehicle.serie },
    { label: "Position",        val: vehicle.position },
    { label: "Autre",           val: vehicle.autre },
  ].filter(f => f.val);

  return (
    <div style={{ background: `${theme.bg}99`, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ color: "#6C63FF" }}><Icon name="car" size={16}/></span>
        <p style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>Fiche technique</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {fields.map(f => (
          <div key={f.label} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 12px" }}>
            <p style={{ fontSize: 10, color: theme.sub, fontWeight: 600, marginBottom: 2 }}>{f.label.toUpperCase()}</p>
            <p style={{ fontSize: 13, color: theme.text, fontWeight: 600 }}>{f.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
