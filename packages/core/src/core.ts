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
import { IModule, IProvider } from "@dtty/module";
import { CoreModule } from "./core.module";

export abstract class DttyCore {
  protected readonly globalContainer: Container;
  protected readonly requestScopedProviderTemplates: IProvider[];

  constructor() {
    this.globalContainer = new Container();
    this.requestScopedProviderTemplates = [];
    this.mountModule(new CoreModule());
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
      container.addProvider(
        providerArgs.token,
        providerArgs.provider as any,
        providerArgs.options,
      );
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
    this.requestScopedProviderTemplates.push({
      token,
      provider: Provider as any,
      options,
    });
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

  public mountModule(module: IModule): typeof this {
    module
      .getGlobalProviders()
      .forEach((provider) =>
        this.addGlobalProvider(
          provider.token,
          provider.provider as any,
          provider.options,
        ),
      );
    this.requestScopedProviderTemplates.push(...module.getRequestProviders());
    return this;
  }
}
