export function getCelebrateFieldErrors(error) {
  const bodyValidation = error?.response?.data?.validation?.body;

  if (!bodyValidation) {
    return {};
  }

  if (Array.isArray(bodyValidation.details)) {
    return bodyValidation.details.reduce((acc, detail) => {
      const key = detail?.path?.[0];
      if (typeof key === "string") {
        acc[key] = detail?.message || "Invalid value";
      }
      return acc;
    }, {});
  }

  if (Array.isArray(bodyValidation.keys)) {
    return bodyValidation.keys.reduce((acc, key) => {
      acc[key] = bodyValidation.message || "Invalid value";
      return acc;
    }, {});
  }

  return {};
}

export function getBackendError(error, fallback) {
  const data = error?.response?.data;

  if (!data) {
    return fallback;
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.validation?.body?.message === "string") {
    return data.validation.body.message;
  }

  return fallback;
}
