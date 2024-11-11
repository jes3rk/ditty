import { Token } from "./token";

export class ProviderNotFoundException extends Error {
  constructor(public readonly token: Token<unknown>) {
    super(`Cannot find provider for ${token}`);
    this.name = this.constructor.name;
  }
}
