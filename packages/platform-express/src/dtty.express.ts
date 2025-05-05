import type { Express, RequestHandler, Request, Response } from "express";
import { DttyCore, HandlerFunction } from "@dtty/core";

export class DttyExpress {
  private readonly core: DttyCore;
  constructor(private readonly app: Express) {
    this.core = new DttyCore();
  }

  private mapToExpress(
    handler: HandlerFunction,
  ): RequestHandler<any, any, any> {
    return async (_: Request, res: Response) => {
      const response = await this.core.handleRequest(handler);
      res.send(response);
    };
  }

  public get(path: string, handler: HandlerFunction): DttyExpress {
    this.app.get(path, this.mapToExpress(handler));
    return this;
  }
}
