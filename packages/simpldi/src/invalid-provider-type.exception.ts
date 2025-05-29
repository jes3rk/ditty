import { ProviderType } from "./types";

export class InvalidProviderTypeException extends Error {
  constructor(public readonly type: ProviderType) {
    super(`Invalid provider type: ${type}`);
  }
}
