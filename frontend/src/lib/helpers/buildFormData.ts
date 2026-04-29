export const buildFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // 1. File MUST FIRST
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    // 2. Array
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }

    // 3. primitive only
    formData.append(key, String(value));
  });

  return formData;
};
