export default function ImmoCard({ immo, theme }) {
  if (!immo) return null;
  const colorMap = { "Vente": "#FF6584", "Location": "#6C63FF" };

  return (
    <div style={{ background: `${theme.bg}99`, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>🏠</span>
        <p style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>Fiche immobilière</p>
        {immo.transaction && (
          <span style={{ background: `${colorMap[immo.transaction]}22`, color: colorMap[immo.transaction] || "#6C63FF", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            {immo.transaction}
          </span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {immo.sousType    && <Cell label="TYPE"          val={immo.sousType} theme={theme}/>}
        {immo.recasee     && <Cell label="RECASÉE"       val={immo.recasee}  theme={theme} color={immo.recasee==="Oui"?"#43C6AC":"#FF4757"}/>}
        {immo.superficie  && <Cell label="SUPERFICIE"    val={`${immo.superficie} m²`} theme={theme}/>}
        {immo.pieces      && <Cell label="NB. PIÈCES"    val={immo.pieces}   theme={theme}/>}
        {immo.titre       && <Cell label="TITRE FONCIER" val={immo.titre}    theme={theme}/>}
        {immo.etat        && <Cell label="ÉTAT GÉNÉRAL"  val={immo.etat}     theme={theme}/>}
        {immo.eau         && <Cell label="RÉSEAU EAU"    val={immo.eau}      theme={theme}/>}
        {immo.electricite && <Cell label="ÉLECTRICITÉ"   val={immo.electricite} theme={theme}/>}
        {[immo.ville, immo.quartier, immo.von].filter(Boolean).join(", ") && (
          <Cell label="LOCALISATION" val={[immo.ville, immo.quartier, immo.von].filter(Boolean).join(", ")} theme={theme} full/>
        )}
        {immo.autres && <Cell label="AUTRES INFOS" val={immo.autres} theme={theme} full/>}
      </div>
    </div>
  );
}

function Cell({ label, val, theme, color, full }) {
  return (
    <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 12px", ...(full ? { gridColumn: "1/-1" } : {}) }}>
      <p style={{ fontSize: 10, color: theme.sub, fontWeight: 600, marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 13, color: color || theme.text, fontWeight: 600 }}>{val}</p>
    </div>
  );
}
