import { Token } from "./token";

export enum ProviderType {
  CLASS,
  FACTORY,
}

export enum ProviderMode {
  SINGLETON,
  TRANSIENT,
}

export interface Constructable<T> {
  new (...args: any[]): T;
}

export type FunctionType<TRet = any> = (...args: any[]) => TRet;

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

export interface IFactoryProvider<T> extends Provider<T> {
  type: ProviderType.FACTORY;
  FactoryFunction: (...args: any[]) => T | Promise<T>;
}

export interface IOnProviderInit {
  onProviderInit(): void | Promise<void>;
}

export type AddProviderOptions<T> = Pick<Partial<Provider<T>>, "mode">;
export type AddFactoryProviderOptions<T> = AddProviderOptions<T> & {
  tokenList?: Token<any>[];
};
