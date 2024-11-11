import { Container } from "./container";

describe("Container interactions", () => {
  let rootContainer: Container;

  beforeEach(() => {
    rootContainer = new Container();
  });

  it("should create a child container linked to the root", () => {
    const child = rootContainer.createChildContainer();
    expect(child["parent"]).toEqual(rootContainer);
  });
});
