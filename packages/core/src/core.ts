import { Container, Token } from "@dtty/simpldi";
import { DttyRequest } from "./dtty.request";
import { IHandlerProvider } from "./request-handler.provider";

export class DttyCore {
  protected readonly globalContainer: Container;

  constructor() {
    this.globalContainer = new Container();
  }

  protected async handleRequest(
    req: DttyRequest,
    handlerToken: Token<unknown>,
  ): Promise<unknown> {
    const handler =
      await req.scopedContainer.resolveProvider<IHandlerProvider>(handlerToken);
    return handler.invokeHandler();
  }

  protected getRequestContainer(): Container {
    return this.globalContainer.createChildContainer();
  }
}
