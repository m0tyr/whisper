const InformationPopup = ({ title, onDismiss ,  action , onAction }: any) => {
    return (
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md mr-2 hover:bg-gray-400 transition-colors"
            onClick={onDismiss}
          >
            Annuler
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            onClick={onAction}
          >
            {action}
          </button>
        </div>
      </div>
    );
  };
  
  export default InformationPopup;