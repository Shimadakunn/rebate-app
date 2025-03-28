// store/useData.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendTx } from "../utils/send";
import { sendChromeMessage } from "../utils/utils";
import { decodeBase64 } from "../utils/utils";
import { CheckKeyExistsResponse, KeyActionResponse } from "../utils/utils";

export interface DataStore {
  key: {
    status: "no-key" | "has-key";
    lastUpdated: string | null;
    content: string | undefined;
    checkKeyFileExists: () => void;
    uploadKey: (base64Data: string) => Promise<KeyActionResponse | undefined>;
    deleteKey: () => Promise<KeyActionResponse | undefined>;
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
      key: {
        status: "no-key",
        lastUpdated: null,
        content: undefined,
        checkKeyFileExists: () => {
          console.log("Checking if key file exists");
          sendChromeMessage(
            { action: "checkKeyExists" },
            (response: CheckKeyExistsResponse | undefined) => {
              if (response?.success && response.exists && response.data) {
                set((state) => ({
                  key: {
                    ...state.key,
                    status: "has-key",
                    lastUpdated: response.data?.dateUploaded ?? null,
                    content: response.data?.data
                      ? decodeBase64(response.data.data)
                      : undefined,
                  },
                }));
              } else {
                set((state) => ({
                  key: {
                    ...state.key,
                    status: "no-key",
                    lastUpdated: null,
                    content: undefined,
                  },
                }));
              }
            }
          );
        },
        uploadKey: (base64Data: string) => {
          return new Promise((resolve) => {
            sendChromeMessage(
              {
                action: "uploadKey",
                fileData: base64Data,
              },
              (response: KeyActionResponse | undefined) => {
                if (response?.success) {
                  get().key.checkKeyFileExists();
                }
                resolve(response);
              }
            );
          });
        },
        deleteKey: () => {
          return new Promise((resolve) => {
            sendChromeMessage(
              { action: "deleteKey" },
              (response: KeyActionResponse | undefined) => {
                if (response?.success) {
                  set((state) => ({
                    key: {
                      ...state.key,
                      status: "no-key",
                      lastUpdated: null,
                      content: undefined,
                    },
                  }));
                }
                resolve(response);
              }
            );
          });
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
          key: { ...currentState.key, ...persisted.key },
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
