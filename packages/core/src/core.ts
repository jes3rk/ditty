import { Container } from "@dtty/simpldi";
import { HandlerFunction } from "./handler.function";

export class DttyCore {
  private readonly globalContainer: Container;

  constructor() {
    this.globalContainer = new Container();
  }

  public handleRequest(handler: HandlerFunction): any {
    return handler();
  }
}
