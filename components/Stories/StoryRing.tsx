import { useRef, useEffect } from "react";

const StoryRing = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const radius = canvas.width / 2; // Radius of the circle
          const lineWidth = 3.25; // Line width for the border
  
          context.clearRect(0, 0, canvas.width, canvas.height);
  
          const borderGradient = context.createRadialGradient(
            radius, radius, radius - lineWidth / 2, // Start circle
            radius, radius, radius // End circle
        );
        borderGradient.addColorStop(0, '#314BFF'); // Start with blue
        borderGradient.addColorStop(1, '#9faaf1'); // Transition to white-blue
  
          // Clip the area inside the circle
          context.save();
          context.beginPath();
          context.arc(radius, radius, radius - lineWidth / 2, 0, Math.PI * 2);
          context.clip();
  
          // Draw the border with the radial gradient
          context.globalCompositeOperation = 'destination-over';
          context.beginPath();
          context.arc(radius, radius, radius - lineWidth / 2, 0, Math.PI * 2);
          context.lineWidth = lineWidth;
          context.strokeStyle = borderGradient; // Border gradient
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