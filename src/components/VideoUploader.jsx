import { useRef } from "react";

export default function VideoUploader({ video, setVideo, theme }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { alert("Vidéo trop lourde. Maximum 50MB."); return; }
    const url = URL.createObjectURL(file);
    setVideo({ url, name: file.name, file });
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: theme.sub, display: "block", marginBottom: 8 }}>
        🎬 Vidéo de présentation (30 sec max · optionnel)
      </label>
      {video ? (
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${theme.border}` }}>
          <video src={video.url} controls style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}/>
          <button onClick={() => setVideo(null)}
            style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,71,87,0.9)", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>
            ✕
          </button>
        </div>
      ) : (
        <div onClick={() => fileRef.current.click()}
          style={{ border: `2px dashed ${theme.border}`, borderRadius: 12, padding: 24, textAlign: "center", cursor: "pointer", color: theme.sub }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎬</div>
          <p style={{ fontWeight: 600, fontSize: 13 }}>Cliquez pour ajouter une vidéo</p>
          <p style={{ fontSize: 11, marginTop: 4 }}>MP4, MOV · Max 50MB · 30 secondes</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFile}/>
    </div>
  );
}
