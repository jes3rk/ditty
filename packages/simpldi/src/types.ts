import { Token } from "./token";

export enum ProviderType {
  CLASS,
}

export interface Constructable<T> {
  new (...args: any[]): T;
}

export interface Provider<T> {
  type: ProviderType;
  token: Token<T>;
  instance?: T;
  inject: Token<unknown>[];
}

export interface IClassProvider<T> extends Provider<T> {
  type: ProviderType.CLASS;
  Constructor: Constructable<T>;
}
