import { Token } from "./token";

export enum ProviderType {
  CLASS,
}

export enum ProviderMode {
  SINGLETON,
  TRANSIENT,
}

export interface Constructable<T> {
  new (...args: any[]): T;
}

export interface Provider<T> {
  type: ProviderType;
  token: Token<T>;
  instance?: T;
  inject: Token<unknown>[];
  mode: ProviderMode;
}

export interface IClassProvider<T> extends Provider<T> {
  type: ProviderType.CLASS;
  Constructor: Constructable<T>;
}

export interface IOnProviderInit {
  onProviderInit(): void | Promise<void>;
}
