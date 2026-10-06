export function transformAdapterName(name: string): string {
  if (!name) return name;

  const suffix = "Adapter";
  if (name.endsWith(suffix)) {
    return name.slice(0, name.length - suffix.length);
  }

  return name;
}
