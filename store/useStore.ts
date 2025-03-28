// store/useData.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendTx } from "../utils/send";

export interface DataStore {
  settings: {
    apiKey: string;
    secretKey: string;
    lastUpdated: string | null;
    setApiKey: () => void;
    setSecretKey: () => void;
    error: string;
  };
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
      settings: {
        apiKey: "",
        secretKey: "",
        lastUpdated: null,
        error: "",
        setApiKey: async () => {
          try {
            let error = "";
            const clipboardData = await navigator.clipboard.readText();
            if (!clipboardData.startsWith("apiKey")) {
              error = "Invalid API Key";
            }
            set({
              settings: { ...get().settings, apiKey: clipboardData, error },
            });
          } catch (error) {
            set({
              settings: {
                ...get().settings,
                error: `Failed to read clipboard ${error}`,
              },
            });
          }
        },
        setSecretKey: async () => {
          try {
            let error = "";
            const clipboardData = await navigator.clipboard.readText();
            if (!clipboardData.startsWith("-----BEGIN PRIVATE KEY-----")) {
              error = "Invalid Secret Key";
            }
            set({
              settings: { ...get().settings, secretKey: clipboardData, error },
            });
          } catch (error) {
            set({
              settings: {
                ...get().settings,
                error: `Failed to read clipboard ${error}`,
              },
            });
          }
        },
      },
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
          await sendTx();
          set((state) => ({
            tx: {
              ...state.tx,
              loading: false,
              success: true,
              error: "",
              receipt: [],
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
          settings: {
            ...currentState.settings,
            ...persisted.settings,
            error: persisted.settings?.error ?? currentState.settings.error,
          },
          data: {
            data: persisted.data?.data ?? currentState.data.data,
            error: persisted.data?.error ?? currentState.data.error,
            parse: currentState.data.parse,
          },
          tx: {
            ...currentState.tx,
            ...persisted.tx,
            receipt: persisted.tx?.receipt ?? currentState.tx.receipt,
          },
          reset: currentState.reset,
        };
      },
    }
  )
);

export default useStore;
