export class Container {
  private parent: Container;

  public createChildContainer(): Container {
    const newContainer = new Container();
    newContainer.parent = this;
    return newContainer;
  }
}
