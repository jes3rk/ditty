import { INJECT_META_KEY } from "./inject";
import { Token } from "./token";
import {
  Constructable,
  IClassProvider,
  Provider,
  ProviderMode,
  ProviderType,
} from "./types";

/**
 * Dependency injection container
 */
export class Container {
  private parent: Container;
  private providers: Map<Token<unknown>, Provider<unknown>>;

  constructor() {
    this.providers = new Map();
  }

  /**
   * Create a new container instance linked to a parent,
   * where the child can access providers from the parent
   * but not vice versa. Useful for scoping dependencies to
   * the lifetime of a child container.
   */
  public createChildContainer(): Container {
    const newContainer = new Container();
    newContainer.parent = this;
    return newContainer;
  }

  /**
   * Add a provider to the container using a token and a type
   **/
  public addProvider<T>(
    token: Token<T>,
    Constructor: Constructable<T>,
    options: Pick<Partial<Provider<T>>, "mode"> = {},
  ): void {
    const { mode = ProviderMode.SINGLETON } = options;
    const provider: IClassProvider<T> = {
      type: ProviderType.CLASS,
      token,
      Constructor,
      inject:
        (Reflect as any).getOwnMetadata(
          INJECT_META_KEY,
          Constructor,
          undefined,
        ) || [],
      mode,
    };
    this.providers.set(token, provider);
  }

  /**
   * Resolve a provider from this or a parent container
   */
  public async resolveProvider<T>(token: Token<T>): Promise<T> {
    if (this.providers.has(token)) {
      const provider = this.providers.get(token) as Provider<T>;
      return provider.instance || (await this.constructInstance(provider));
    }
    throw Error();
  }

  private async constructInstance<T>(provider: Provider<T>): Promise<T> {
    let instance: T;
    switch (provider.type) {
      case ProviderType.CLASS:
        instance = new (provider as IClassProvider<T>).Constructor(
          ...(await Promise.all(
            provider.inject.map((t) => this.resolveProvider(t)),
          )),
        );
        break;
    }
    if (provider.mode == ProviderMode.SINGLETON)
      this.providers.set(provider.token, { ...provider, instance });
    return instance;
  }
}
