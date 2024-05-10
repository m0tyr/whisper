
const Dismiss = ({ title, onDismiss ,  action , onAction }: any) => {
  return (
    <div className="bg-good-gray flex flex-col justify-center items-center  rounded-2xl  border-[0.2333333px]
    border-border shadow-md w-[280px]">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="flex flex-row w-full">
      <div className="flex justify-center items-center shrink-0 relative h-14 w-full">
        <button
          className=" text-white rounded-xl transition-colors"
          onClick={onDismiss}
        >
          Annuler
        </button>
        </div>
        <div className="flex justify-center items-center shrink-0 relative h-14 w-full">
        <button
          className="text-red-600  rounded-xl  transition-colors"
          onClick={onAction}
        >
          {action}
        </button>
        </div>
      </div>
    </div>
  );
};

export default Dismiss;