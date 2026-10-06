export function getEnumList<T extends Record<string, string | number>>(
  enumObject: T,
): string {
  return Object.values(enumObject).join("\n");
}

export function enumFromKeyStringThrow<T extends Record<string, string>>(
  enumObject: T,
  key: string,
): T[keyof T] {
  if (!(key in enumObject)) {
    throw new Error(`Invalid enum key: ${key}`);
  }

  return enumObject[key as keyof T];
}

export function enumToKeyStringThrow<T extends Record<string, string>>(
  enumObject: T,
  value: T[keyof T],
): string {
  const entry = Object.entries(enumObject).find(
    ([, enumValue]) => enumValue === value,
  );

  if (!entry) {
    throw new Error(`Invalid enum value: ${value}`);
  }

  return entry[0];
}
