import { useState } from "react";

const Settings = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setShow(true)}
        className="p-2 bg-black rounded-full cursor-pointer"
      >
        <img src="/settings.svg" alt="Settings" className="w-4 h-4" />
      </button>
      {show && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-black p-4 rounded-2xl w-80 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Fireblocks Key</h2>
              <img
                src="/close.svg"
                alt="Close"
                className="w-4 h-4 cursor-pointer"
                onClick={() => setShow(false)}
              />
            </div>
            <h1 className="text-sm mb-2 text-center">
              { === "has-key" ? "Key Set" : "No Key Set"}
            </h1>
            <div className="flex justify-between w-full">
              <button
                onClick={}
                className="rounded-xl px-3 py-1 text-red-400 border border-red-400 text-sm font-bold cursor-pointer hover:bg-red-400 hover:text-white transition-all duration-300"
              >
                Delete
              </button>
              <button
                onClick={}
                className="rounded-xl px-3 py-1 bg-white text-black text-sm font-bold cursor-pointer"
              >
                Upload Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
