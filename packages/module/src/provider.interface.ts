import {
  AddFactoryProviderOptions,
  AddProviderOptions,
  Constructable,
  FunctionType,
  Token,
} from "@dtty/simpldi";

export type IClassProvider<T> = {
  token: Token<T>;
  provider: Constructable<T>;
  options?: AddProviderOptions<T>;
};

export type IFactoryProvider<T> = {
  token: Token<T>;
  provider: FunctionType<T>;
  options?: AddFactoryProviderOptions<T>;
};

export type IProvider<T = any> = IClassProvider<T> | IFactoryProvider<T>;
