import { useState } from "react";
import Icon from "./Icon";

export default function PhotoCarousel({ photos }) {
  const [current, setCurrent] = useState(0);
  if (!photos || photos.length === 0) return null;
  return (
    <div style={{ position:"relative",width:"100%",height:200,overflow:"hidden" }}>
      <img src={photos[current]} alt="photo" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
      {photos.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(c => (c - 1 + photos.length) % photos.length)}
            style={{ position:"absolute",left:6,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <Icon name="chevronLeft" size={14}/>
          </button>
          <button
            onClick={() => setCurrent(c => (c + 1) % photos.length)}
            style={{ position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.5)",border:"none",color:"#fff",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <Icon name="chevronRight" size={14}/>
          </button>
          <div style={{ position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4 }}>
            {photos.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)}
                style={{ width:6,height:6,borderRadius:"50%",background:i===current?"#fff":"rgba(255,255,255,0.5)",cursor:"pointer" }}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
