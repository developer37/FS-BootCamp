import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  // Load once from storage and recover gracefully from parse errors.
  const initialState = (() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null) {
        return {
          value: initialValue,
          error: "",
        };
      }

      return {
        value: JSON.parse(storedValue),
        error: "",
      };
    } catch {
      return {
        value: initialValue,
        error: "Stored library data was corrupted, so it was reset.",
      };
    }
  })();

  const [value, setValue] = useState(initialState.value);
  const [storageError] = useState(initialState.error);

  useEffect(() => {
    try {
      // Persist whenever value changes.
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep app usable if storage quota is exceeded or blocked.
    }
  }, [key, value]);

  return [value, setValue, storageError];
}
