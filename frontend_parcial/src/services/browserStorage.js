export const readCollection = (storageKey, fallbackData) => {
  if (typeof window === "undefined") {
    return fallbackData;
  }

  const storedValue = window.localStorage.getItem(storageKey);

  if (!storedValue) {
    window.localStorage.setItem(storageKey, JSON.stringify(fallbackData));
    return fallbackData;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify(fallbackData));
    return fallbackData;
  }
};

export const writeCollection = (storageKey, data) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(data));
};
