import { Container } from "./container";
import { Inject } from "./inject";
import { ProviderNotFoundException } from "./provider-not-found.exception";
import { Token } from "./token";
import { IOnProviderInit, ProviderMode } from "./types";

describe("Container interactions", () => {
  let rootContainer: Container;
  class ProviderWithNoDeps {
    public readonly Id: string;
    constructor() {
      this.Id = (Math.random() * Date.now()).toString();
    }
  }

  const noDepsToken = new Token<ProviderWithNoDeps>("No deps");

  class ProviderWithOneDep extends ProviderWithNoDeps {
    constructor(@Inject(noDepsToken) public readonly dep: ProviderWithNoDeps) {
      super();
    }
  }

  const oneDepToken = new Token<ProviderWithOneDep>("One Dep");

  class ProviderWithMultipleDeps extends ProviderWithNoDeps {
    constructor(
      @Inject(noDepsToken) public readonly noDeps: ProviderWithNoDeps,
      @Inject(oneDepToken) public readonly oneDep: ProviderWithOneDep,
    ) {
      super();
    }
  }

  const mulipleDepToken = new Token<ProviderWithMultipleDeps>("many deps");

  beforeEach(() => {
    rootContainer = new Container();
  });

  it("should create a child container linked to the root", () => {
    const child = rootContainer.createChildContainer();
    expect(child["parent"]).toEqual(rootContainer);
  });

  describe("Single layer provider lifecycle", () => {
    it("should resolve a single provider with no dependencies", async () => {
      rootContainer.addProvider(noDepsToken, ProviderWithNoDeps);
      const provider = await rootContainer.resolveProvider(noDepsToken);
      expect(provider).toBeInstanceOf(ProviderWithNoDeps);
      expect(provider.Id).not.toBeUndefined();
    });

    it("should always resolve the same provider instance by default", async () => {
      rootContainer.addProvider(noDepsToken, ProviderWithNoDeps);
      const provider1 = await rootContainer.resolveProvider(noDepsToken);
      const provider2 = await rootContainer.resolveProvider(noDepsToken);
      expect(provider1.Id).toEqual(provider2.Id);
    });

    it("should resolve a single provider with a singleton dependency", async () => {
      rootContainer.addProvider(noDepsToken, ProviderWithNoDeps);
      rootContainer.addProvider(oneDepToken, ProviderWithOneDep);

      const provider = await rootContainer.resolveProvider(oneDepToken);
      expect(provider).toBeInstanceOf(ProviderWithOneDep);
      expect(provider.dep).toBeInstanceOf(ProviderWithNoDeps);
      expect(provider.Id).not.toEqual(provider.dep.Id);
    });

    it("should resolve a single provider with a transient dependency", async () => {
      rootContainer.addProvider(oneDepToken, ProviderWithOneDep);
      rootContainer.addProvider(noDepsToken, ProviderWithNoDeps, {
        mode: ProviderMode.TRANSIENT,
      });
      const provider1 = await rootContainer.resolveProvider(oneDepToken);
      const provider2 = await rootContainer.resolveProvider(noDepsToken);
      expect(provider1.dep.Id).not.toEqual(provider2.Id);
    });

    it("should resolve a provider with multiple dependencies", async () => {
      rootContainer.addProvider(noDepsToken, ProviderWithNoDeps);
      rootContainer.addProvider(oneDepToken, ProviderWithOneDep);
      rootContainer.addProvider(mulipleDepToken, ProviderWithMultipleDeps);
      const provider = await rootContainer.resolveProvider(mulipleDepToken);
      expect(provider).toBeInstanceOf(ProviderWithMultipleDeps);
      expect(provider.noDeps.Id).toEqual(provider.oneDep.dep.Id);
    });

    it("should throw an exception when resolving a missing provider", async () => {
      await expect(() =>
        rootContainer.resolveProvider(noDepsToken),
      ).rejects.toThrow(ProviderNotFoundException);
    });
  });

  describe("Multi layer provider lifecycle", () => {
    let childContainer: Container;

    beforeEach(() => {
      childContainer = rootContainer.createChildContainer();
    });

    it("should resolve a provider from the child using a parent dependency", async () => {
      rootContainer.addProvider(noDepsToken, ProviderWithNoDeps);
      childContainer.addProvider(oneDepToken, ProviderWithOneDep);
      const provider1 = await childContainer.resolveProvider(oneDepToken);
      const provider2 = await rootContainer.resolveProvider(noDepsToken);
      expect(provider1.dep.Id).toEqual(provider2.Id);
    });

    it("should throw an exception when resolving a provider that depends on the child", async () => {
      childContainer.addProvider(noDepsToken, ProviderWithNoDeps);
      rootContainer.addProvider(oneDepToken, ProviderWithOneDep);
      await expect(() =>
        childContainer.resolveProvider(oneDepToken),
      ).rejects.toThrow(ProviderNotFoundException);
    });
  });

  describe("Provider lifecycle methods", () => {
    class InitAbleProvider
      extends ProviderWithNoDeps
      implements IOnProviderInit
    {
      public isInit: boolean;

      constructor() {
        super();
        this.isInit = false;
      }
      public onProviderInit(): void {
        this.isInit = true;
      }
    }

    const initToken = new Token<InitAbleProvider>();

    it("should call onProviderInit if present when constructing a provider instance", async () => {
      rootContainer.addProvider(initToken, InitAbleProvider);
      const provider = await rootContainer.resolveProvider(initToken);
      expect(provider.isInit).toEqual(true);
    });
  });
});
