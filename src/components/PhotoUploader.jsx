import { useRef, useState } from "react";
import { supabase } from "../supabase";
import Icon from "./Icon";

export default function PhotoUploader({ photos, setPhotos, theme, folder = "annonces" }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - photos.length);
    if (files.length === 0) return;
    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} est trop lourd. Maximum 5 MB par photo.`);
        continue;
      }
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("photos")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) { console.error("Erreur upload:", error); alert("Erreur lors de l'upload de " + file.name); continue; }

      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(fileName);
      uploaded.push(urlData.publicUrl);
    }

    setPhotos(prev => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  };

  const removePhoto = async (index) => {
    const url = photos[index];
    try {
      const path = url.split("/storage/v1/object/public/photos/")[1];
      if (path) await supabase.storage.from("photos").remove([path]);
    } catch (e) { console.error("Erreur suppression photo:", e); }
    setPhotos(prev => prev.filter((_, j) => j !== index));
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: theme.sub, display: "block", marginBottom: 8 }}>
        Photos ({photos.length}/3) {uploading && <span style={{ color: "#6C63FF" }}>⏳ Upload en cours...</span>}
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {photos.map((photo, i) => (
          <div key={i} style={{ position: "relative", width: 90, height: 90, borderRadius: 10, overflow: "hidden", border: `1px solid ${theme.border}` }}>
            <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            <button onClick={() => removePhoto(i)}
              style={{ position: "absolute", top: 4, right: 4, background: "rgba(255,71,87,0.9)", border: "none", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="x" size={10}/>
            </button>
          </div>
        ))}
        {photos.length < 3 && !uploading && (
          <div onClick={() => fileRef.current.click()}
            style={{ width: 90, height: 90, borderRadius: 10, border: `2px dashed ${theme.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.sub, gap: 4 }}>
            <Icon name="image" size={20}/>
            <span style={{ fontSize: 10, fontWeight: 600 }}>Ajouter</span>
          </div>
        )}
        {uploading && (
          <div style={{ width: 90, height: 90, borderRadius: 10, border: "2px dashed #6C63FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#6C63FF", gap: 4 }}>
            <div style={{ width: 24, height: 24, border: "3px solid #6C63FF33", borderTop: "3px solid #6C63FF", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
            <span style={{ fontSize: 10, fontWeight: 600 }}>Upload...</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: "none" }} onChange={handleFiles}/>
      <p style={{ fontSize: 11, color: theme.sub, marginTop: 6 }}>Maximum 3 photos · JPG, PNG, WEBP · 5 MB max</p>
    </div>
  );
}
