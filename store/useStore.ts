// store/useData.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendTx } from "./send";
interface DataStore {
  data: {
    data: string[][];
    error: string;
    parse: () => void;
  };
  tx: {
    send: () => Promise<void>;
    loading: boolean;
    success: boolean;
    error: string;
    receipt: string[];
  };
  reset: () => void;
}

const useStore = create<DataStore>()(
  persist(
    (set, get) => ({
      data: {
        data: [] as string[][],
        error: "",
        parse: async () => {
          const clipboardData = await navigator.clipboard.readText();
          const rows = clipboardData.trim().split("\n");
          for (const row of rows) {
            if (row.split("\t").length !== 3) {
              set({
                data: {
                  ...get().data,
                  error: "Error: Clipboard data is not in the correct format",
                },
              });
              return;
            }
          }
          get().reset();
          const data = rows.map((row) => row.split("\t"));
          set({ data: { ...get().data, data, error: "" } });
        },
      },
      tx: {
        loading: false,
        success: false,
        error: "",
        receipt: [],
        send: async () => {
          set((state) => ({
            tx: {
              ...state.tx,
              loading: true,
              success: false,
              error: "",
              receipt: [],
            },
          }));
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const receipt = await sendTx(get().data.data);
          set((state) => ({
            tx: {
              ...state.tx,
              loading: false,
              success: true,
              error: "",
              receipt: receipt,
            },
          }));
        },
      },
      reset: () => {
        set({
          data: { ...get().data, data: [] },
          tx: {
            ...get().tx,
            loading: false,
            success: false,
            error: "",
            receipt: [],
          },
        });
      },
    }),
    {
      name: "sheet-data-store",
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<DataStore>) || {};
        return {
          ...currentState,
          data: {
            data: persisted.data?.data ?? currentState.data.data,
            error: persisted.data?.error ?? currentState.data.error,
            parse: currentState.data.parse,
          },

          tx: { ...currentState.tx, ...persisted.tx },
          reset: currentState.reset,
        };
      },
    }
  )
);

export default useStore;
