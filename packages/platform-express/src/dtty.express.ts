import type { Express, RequestHandler, Response } from "express";
import { DttyCore, HandlerProviderBuilder, IHandler } from "@dtty/core";
import { IDttyRequest } from "./dtty.request";
import { Token } from "@dtty/simpldi";

export class DttyExpress extends DttyCore {
  constructor(private readonly app: Express) {
    super();
    this.app.use((req, _, next) => {
      (req as IDttyRequest).scopedContainer = this.getRequestContainer();
      next();
    });
  }

  private mapToExpress(handler: IHandler): RequestHandler<any, any, any> {
    return async (req: IDttyRequest, res: Response) => {
      const token = new Token<unknown>();
      req.scopedContainer.addProvider(
        token,
        new HandlerProviderBuilder(handler.handler).build,
        {
          tokenList: handler.injectionTokens || [],
        },
      );
      const response = await this.handleRequest(req, token);
      res.send(response);
    };
  }

  public get(path: string, handler: IHandler): DttyExpress {
    this.app.get(path, this.mapToExpress(handler));
    return this;
  }
}
