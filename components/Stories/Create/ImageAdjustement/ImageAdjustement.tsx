import { Modal } from "@/components/Modal/Modal";

interface ImageAdjustementProps {
  image: string;
  DismissAdjustement: () => void;
}

const ImageAdjustement = ({
  image,
  DismissAdjustement,
}: ImageAdjustementProps) => {
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

          {/* Image container */}
          <div className="w-full h-full flex justify-center items-center overflow-hidden p-6">
            <img
              src={image}
              alt="adjusted"
              className="max-w-full max-h-full object-contain rounded-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageAdjustement;
