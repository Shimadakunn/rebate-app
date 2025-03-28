import { useState } from "react";
import useStore from "../../store/useStore";

const Settings = () => {
  const [show, setShow] = useState(false);
  const { settings } = useStore();

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
            <div>
              <h1 className="text-sm mb-2 text-center">API Key</h1>
              {settings.apiKey && (
                <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                  <p className="text-xs font-mono break-all">
                    {settings.apiKey}
                  </p>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-sm mb-2 text-center">Secret Key</h1>
              {settings.secretKey && (
                <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                  <p className="text-xs font-mono break-all">
                    {settings.secretKey}
                  </p>
                </div>
              )}
            </div>
            {settings.error && (
              <p className="text-red-400 text-xs mt-2 text-center">
                {settings.error}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
