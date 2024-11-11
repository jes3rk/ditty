import { Container } from "./container";
import { Inject } from "./inject";
import { Token } from "./token";
import { ProviderMode } from "./types";

describe("Container interactions", () => {
  let rootContainer: Container;

  beforeEach(() => {
    rootContainer = new Container();
  });

  it("should create a child container linked to the root", () => {
    const child = rootContainer.createChildContainer();
    expect(child["parent"]).toEqual(rootContainer);
  });

  describe("Single layer provider lifecycle", () => {
    class ProviderWithNoDeps {
      public readonly Id: string;
      constructor() {
        this.Id = (Math.random() * Date.now()).toString();
      }
    }

    const noDepsToken = new Token<ProviderWithNoDeps>("No deps");

    class ProviderWithOneDep extends ProviderWithNoDeps {
      constructor(
        @Inject(noDepsToken) public readonly dep: ProviderWithNoDeps,
      ) {
        super();
      }
    }

    const oneDepToken = new Token<ProviderWithOneDep>("One Dep");

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

    it.todo("should resolve a provider with multiple dependencies");
    it.todo("should throw an exception when resolving a missing provider");
  });

  describe("Multi layer provider lifecycle", () => {
    // var childContainer: Container;

    // beforeEach(() => {
    //   childContainer= rootContainer.createChildContainer();
    // })

    it.todo(
      "should resolve a provider from the child using a parent dependency",
    );
    it.todo(
      "should throw an exception when resolving a provider that depends on the child",
    );
  });
});
