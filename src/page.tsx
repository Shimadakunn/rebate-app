import useData from "../store/useStore";
import Header from "./components/Header";
import Table from "./components/Table";

export default function Page() {
  const { data } = useData();

  return (
    <div className="relative p-4 h-full w-full ">
      <Header />
      <div className="flex flex-col justify-center items-center h-[calc(100%-16px)] w-full pb-4 ">
        {data.data.length === 0 && (
          <button
            onClick={data.parse}
            className="bg-black text-white px-4 py-2 rounded-2xl cursor-pointer font-bold"
          >
            Paste Table
          </button>
        )}
        {data.error && (
          <div className="my-4 text-red-500 text-center w-[50vw]">
            {data.error}
          </div>
        )}
        {data.data.length > 0 && <Table />}
      </div>
    </div>
  );
}
