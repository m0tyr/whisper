import { useRef, useEffect } from "react";

const StoryRing: React.FC<{
  color: string;
}> = ({ color }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const radius = canvas.width / 2; 
          const lineWidth = 3.25; 
  
          context.clearRect(0, 0, canvas.width, canvas.height);
  
          const borderGradient = context.createRadialGradient(
            radius, radius, radius - lineWidth / 2, 
            radius, radius, radius 
        );
        if(color === 'red') {
          borderGradient.addColorStop(0, '#df1b1b'); 
          borderGradient.addColorStop(1, '#ba3030');
        } else if (color === 'blue') {
          borderGradient.addColorStop(0, '#314BFF'); 
          borderGradient.addColorStop(1, '#9faaf1');
        } else {

        }
     
          context.save();
          context.beginPath();
          context.arc(radius, radius, radius - lineWidth / 2, 0, Math.PI * 2);
          context.clip();
  
          context.globalCompositeOperation = 'destination-over';
          context.beginPath();
          context.arc(radius, radius, radius - lineWidth / 2, 0, Math.PI * 2);
          context.lineWidth = lineWidth;
          context.strokeStyle = borderGradient; 
          context.stroke();
          context.restore();
        }
      }
    }, []);
  
  
    return (
        <canvas
        ref={canvasRef}
        height="66"
        width="66"
        style={{
          left: "-5px",
          position: "absolute",
          top: "-5px",
          height: "66px",
          width: "66px",
        }}
      />
    )
}
export default StoryRing;