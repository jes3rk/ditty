import { Token } from "./token";

export const INJECT_META_KEY = Symbol("inject_meta");

export const Inject =
  <T>(token: Token<T>): ParameterDecorator =>
  (target, propertyKey, parameterIndex) => {
    const tokens =
      (Reflect as any).getOwnMetadata(INJECT_META_KEY, target, propertyKey) ||
      [];
    tokens[parameterIndex] = token;
    (Reflect as any).defineMetadata(
      INJECT_META_KEY,
      tokens,
      target,
      propertyKey,
    );
  };
