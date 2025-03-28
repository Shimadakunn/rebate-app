/// <reference types="vite/client" />

// Basic Chrome API types to support our extension
declare namespace chrome {
  namespace runtime {
    const lastError:
      | {
          message?: string;
        }
      | undefined;

    function sendMessage<T = unknown, R = unknown>(
      message: T,
      callback?: (response: R) => void
    ): void;
  }

  namespace storage {
    namespace local {
      function get(
        keys: string | string[] | null,
        callback: (items: Record<string, unknown>) => void
      ): void;

      function set(items: Record<string, unknown>, callback?: () => void): void;

      function remove(keys: string | string[], callback?: () => void): void;
    }
  }
}
