import { useState, useRef, ChangeEvent } from "react";
import useStore from "../../store/useStore";

const Settings = () => {
  const [show, setShow] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { key } = useStore();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".key")) {
      setError("Please upload a .key file");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const reader = new FileReader();

      const result = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
      });

      if (!result.trim()) {
        throw new Error("Key file is empty");
      }

      const response = await key.uploadKey(btoa(result.trim()));
      if (!response?.success) {
        throw new Error("Failed to upload key");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload key");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
            <div className="mb-4">
              <h1 className="text-sm mb-2 text-center">
                {key.status === "has-key" ? "Key Set" : "No Key Set"}
              </h1>
              {key.content && (
                <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                  <p className="text-xs font-mono break-all">{key.content}</p>
                </div>
              )}
              {key.lastUpdated && (
                <div className="text-xs text-gray-400 mt-2 text-center">
                  Updated: {new Date(key.lastUpdated).toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex justify-between w-full">
              <button
                onClick={key.deleteKey}
                className="rounded-xl px-3 py-1 text-red-400 border border-red-400 text-sm font-bold cursor-pointer hover:bg-red-400 hover:text-white transition-all duration-300"
                disabled={key.status === "no-key"}
              >
                Delete
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".key"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-xl px-3 py-1 ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                } text-black text-sm font-bold`}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Key"}
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
