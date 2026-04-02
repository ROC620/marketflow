import { useRef, useState } from "react";
import { supabase } from "../supabase";
import Icon from "./Icon";

// Compression automatique via canvas — cible 200KB max
const compressImage = (file, maxKB = 200) => {
  return new Promise((resolve) => {
    const maxBytes = maxKB * 1024;
    // Si déjà assez petit, pas besoin de compresser
    if (file.size <= maxBytes) { resolve(file); return; }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Réduire les dimensions si trop grandes
      const maxDim = 1200;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
        else { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      // Chercher la qualité optimale par dichotomie
      let quality = 0.8;
      let lo = 0.1, hi = 0.95;
      const attempt = (q) => new Promise(res => canvas.toBlob(blob => res(blob), "image/jpeg", q));

      const tryCompress = async () => {
        for (let i = 0; i < 6; i++) {
          const blob = await attempt(quality);
          if (blob.size <= maxBytes || quality <= lo) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
            return;
          }
          hi = quality;
          quality = (lo + hi) / 2;
        }
        const blob = await attempt(quality);
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
      };
      tryCompress();
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
};

export default function PhotoUploader({ photos, setPhotos, theme, folder = "annonces" }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - photos.length);
    if (files.length === 0) return;
    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) {
        alert(`${file.name} est trop lourd. Maximum 15 MB par photo.`);
        continue;
      }

      // Compression automatique vers 200KB
      setCompressing(true);
      const compressed = await compressImage(file, 200);
      setCompressing(false);

      const ext = "jpg"; // toujours JPEG après compression
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("photos")
        .upload(fileName, compressed, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });

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

  const busy = uploading || compressing;

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: theme.sub, display: "block", marginBottom: 8 }}>
        Photos ({photos.length}/3) {compressing && <span style={{ color:"#FFD700" }}>⚡ Compression...</span>}
                                   {uploading && !compressing && <span style={{ color: "#6C63FF" }}>⏳ Upload en cours...</span>}
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
        {photos.length < 3 && !busy && (
          <div onClick={() => fileRef.current.click()}
            style={{ width: 90, height: 90, borderRadius: 10, border: `2px dashed ${theme.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: theme.sub, gap: 4 }}>
            <Icon name="image" size={20}/>
            <span style={{ fontSize: 10, fontWeight: 600 }}>Ajouter</span>
          </div>
        )}
        {busy && (
          <div style={{ width: 90, height: 90, borderRadius: 10, border: "2px dashed #6C63FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#6C63FF", gap: 4 }}>
            <div style={{ width: 24, height: 24, border: "3px solid #6C63FF33", borderTop: "3px solid #6C63FF", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}/>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{compressing ? "Compression" : "Upload"}...</span>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: "none" }} onChange={handleFiles}/>
      <p style={{ fontSize: 11, color: theme.sub, marginTop: 6 }}>Maximum 3 photos · Compression automatique ≤ 200 Ko</p>
    </div>
  );
}
