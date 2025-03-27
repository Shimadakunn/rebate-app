import useStore from "../../store/useStore";
import { toast } from "sonner";

export default function Table() {
  const { data, tx, reset } = useStore();
  return (
    <>
      <div className="max-h-[90vh] max-w-[95vw] overflow-auto">
        <table className="table-auto border-collapse mb-4">
          <thead>
            <tr className="bg-black text-white border-2 border-black">
              <th className="border px-2 py-1 min-w-[100px]">Protocol</th>
              <th className="border px-2 py-1 min-w-[100px]">Address</th>
              <th className="border px-2 py-1 min-w-[100px]">
                Rebate <br /> (in kind)
              </th>
              {tx.receipt.length > 0 && (
                <th className="flex flex-col gap-2 justify-center items-center px-2 py-1 min-w-[100px]">
                  receipt
                  <br />
                  <span
                    className="border-b-2 text-blue-500 cursor-pointer"
                    onClick={() => {
                      const links = tx.receipt
                        .map((url) => `=HYPERLINK("${url}", "tx")`)
                        .join("\n");
                      navigator.clipboard.writeText(links);
                      toast.success("Receipts copied as links");
                    }}
                  >
                    (copy all)
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.data.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-100 h-20">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border px-2 py-1">
                    <div className="flex justify-center items-center h-20">
                      {cell}
                    </div>
                  </td>
                ))}
                {tx.receipt.length > 0 && (
                  <td className="border px-2 py-1">
                    <div className="flex gap-2 justify-center items-center">
                      <img
                        src="/copy.svg"
                        alt="copy"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(tx.receipt[rowIndex]);
                          toast.success("Receipt copied to clipboard");
                        }}
                      />
                      <img
                        src="/link.svg"
                        alt="link"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => {
                          window.open(tx.receipt[rowIndex], "_blank");
                        }}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between w-[70vw] mt-2">
        <button
          onClick={() => {
            reset();
            toast.success("Table Deleted");
          }}
          className=" text-red-400 px-4 py-1 rounded-xl font-bold cursor-pointer border-1 border-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          Delete
        </button>

        <button
          onClick={() => {
            data.parse();
            toast.success("Table Pasted");
          }}
          className=" text-black px-4 py-1 rounded-xl font-bold cursor-pointer border-1 border-black hover:bg-black hover:text-white transition-all duration-300"
        >
          Paste New Table
        </button>

        <button
          onClick={tx.send}
          className={`bg-black text-white px-4 py-1 rounded-xl cursor-pointer font-bold disabled:opacity-50 disabled:cursor-not-allowed ${
            tx.loading || tx.success
              ? ""
              : "hover:bg-white hover:text-black transition-all duration-300"
          } border-1 border-black`}
          disabled={tx.loading || tx.success}
        >
          {tx.loading ? "Sending..." : tx.success ? "Success!" : "Send Tx"}
        </button>
      </div>
    </>
  );
}
