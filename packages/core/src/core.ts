import {
  AddFactoryProviderOptions,
  AddProviderOptions,
  Constructable,
  Container,
  FunctionType,
  ProviderMode,
  Token,
} from "@dtty/simpldi";
import { DttyRequest } from "./dtty.request";
import {
  HandlerProviderBuilder,
  IHandlerProvider,
} from "./request-handler.provider";
import { IHandler } from "./handler.function";

export abstract class DttyCore {
  protected readonly globalContainer: Container;
  protected readonly requestScopedProviderTemplates: [
    Token<unknown>,
    Constructable<unknown> | FunctionType<unknown>,
    AddFactoryProviderOptions<unknown>,
  ][];

  constructor() {
    this.globalContainer = new Container();
    this.requestScopedProviderTemplates = [];
  }

  public async handleRequest(
    req: DttyRequest,
    handlerToken: Token<unknown>,
  ): Promise<unknown> {
    const handler =
      await req.scopedContainer.resolveProvider<IHandlerProvider>(handlerToken);
    return handler.invokeHandler();
  }

  public getRequestContainer(): Container {
    const container = this.globalContainer.createChildContainer();
    for (const providerArgs of this.requestScopedProviderTemplates) {
      container.addProvider.call(container, ...providerArgs);
    }
    return container;
  }

  public addGlobalProvider<T>(
    token: Token<T>,
    Provider: Constructable<T>,
    options?: AddProviderOptions<T>,
  ): typeof this;
  public addGlobalProvider<T>(
    token: Token<T>,
    Provider: FunctionType<T>,
    options?: AddFactoryProviderOptions<T>,
  ): typeof this;
  public addGlobalProvider<T>(
    token: Token<T>,
    Provider: Constructable<T> | FunctionType<T>,
    options?: AddFactoryProviderOptions<T>,
  ): typeof this {
    this.globalContainer.addProvider(token, Provider as any, options);
    return this;
  }

  public addRequestProvider<T>(
    token: Token<T>,
    Provider: Constructable<T>,
    options?: AddProviderOptions<T>,
  ): typeof this;
  public addRequestProvider<T>(
    token: Token<T>,
    Provider: FunctionType<T>,
    options?: AddFactoryProviderOptions<T>,
  ): typeof this;
  public addRequestProvider<T>(
    token: Token<T>,
    Provider: Constructable<T> | FunctionType<T>,
    options?: AddFactoryProviderOptions<T>,
  ): typeof this {
    this.requestScopedProviderTemplates.push([token, Provider, options]);
    return this;
  }

  public addHandler(
    req: DttyRequest,
    handler: IHandler,
  ): Token<IHandlerProvider> {
    const token = new Token<IHandlerProvider>();
    req.scopedContainer.addProvider<IHandlerProvider>(
      token,
      new HandlerProviderBuilder(handler.handler).build,
      {
        tokenList: handler.injectionTokens || [],
        mode: ProviderMode.TRANSIENT,
      },
    );
    return token;
  }
}
