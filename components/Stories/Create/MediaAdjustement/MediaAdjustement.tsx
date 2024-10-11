import { Modal } from "@/components/Modal/Modal";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";

interface MediaAdjustementProps {
  mediaUrl: string;
  mediaWidth: number;
  mediaHeight: number;
  maximumWidthReach: number;
  maximumHeightReach: number;
  DismissAdjustement: () => void;
}

const MediaAdjustement = ({
  mediaUrl,
  mediaWidth,
  mediaHeight,
  maximumWidthReach,
  maximumHeightReach,
  DismissAdjustement,
}: MediaAdjustementProps) => {
  console.log(mediaWidth, mediaHeight);
  const mediaAdjustStageRef = useRef<Konva.Stage | null>(null);
  const mediaAdjustLayerRef = useRef<Konva.Layer | null>(null);
  useEffect(() => {
    const mediaAdjustStage = mediaAdjustStageRef.current;
    const mediaAdjustLayer = mediaAdjustLayerRef.current;
    if (mediaAdjustLayer && mediaAdjustStage) {
      const image = new window.Image();
      image.src = mediaUrl;
      image.onload = () => {
        const imageRatio = image.width / image.height;

        // Créer l'image avec Konva
        const konvaImage = new Konva.Image({
          image: image,
          x: 0,
          y: 0,
          width: mediaWidth,
          height: mediaHeight,
          draggable: true,
          listening: false,
          cornerRadius: 4,
        });
        mediaAdjustLayer.add(konvaImage);
        mediaAdjustLayer.draw();

        const maximumAreaRect = new Konva.Rect({
          x: (mediaWidth - maximumWidthReach / 2) / 2,
          y: 0,
          width: maximumWidthReach / 2,
          height: mediaHeight,
          draggable: true,
          stroke: "red",
          strokeWidth: 2,
        });
        mediaAdjustLayer.add(maximumAreaRect);

        const transformer = new Konva.Transformer({
          nodes: [maximumAreaRect],
          anchorStroke: "#212121",
          borderStroke: "#f1f1f1",
          anchorFill: "#212121",
          draggable: true,
          anchorStyleFunc: (anchor) => {
            anchor.stroke("#212121");
          },
          keepRatio: true,
          enabledAnchors: [
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ],
          rotateEnabled: true,
          resizeEnabled: true,
          rotationSnaps: [0, 90, -90, 180, -180],
          rotationSnapTolerance: 15,
        });
        mediaAdjustLayer.add(transformer);
        mediaAdjustLayer.draw();
      };
    }
  }, []);

  return (
    <>
      <Modal OnClickOutsideAction={DismissAdjustement} />
      <div
        className="z-[100] w-full h-full fixed inset-0 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) DismissAdjustement();
        }}
      >
        <div className="w-[80%] h-[80%] flex flex-col relative bg-good-gray border border-border rounded-2xl">
          {/* Header with title and cancel */}
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-start py-6 px-8">
              <span className="font-semibold text-[22px]">
                Ajuster le média avant l'importation
              </span>
            </div>
            <div className="flex justify-end items-end px-8">
              <span className="cursor-pointer select-none">Annuler</span>
            </div>
          </div>

          {/* Stage container */}
          <div className="w-full h-full flex justify-center items-center overflow-hidden p-6">
            <Stage
              ref={mediaAdjustStageRef}
              width={mediaWidth}
              height={mediaHeight}
            >
              <Layer ref={mediaAdjustLayerRef}></Layer>
            </Stage>
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaAdjustement;
