import { Constructable } from "./types";

export function isClassDefintion(
  target: Constructable<unknown> | ((...args: any[]) => any),
): boolean {
  const objectKeys = Object.getOwnPropertyNames(target);
  return !objectKeys.includes("arguments") && objectKeys.includes("prototype");
}
