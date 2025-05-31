import type { Express, RequestHandler, Response } from "express";
import { DttyCore, IHandler } from "@dtty/core";
import { IDttyRequest } from "./dtty.request";

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
      const token = this.addHandler(req, handler);
      const response = await this.handleRequest(req, token);
      res.send(response);
    };
  }

  public get(path: string, handler: IHandler): DttyExpress {
    this.app.get(path, this.mapToExpress(handler));
    return this;
  }

  public post(path: string, handler: IHandler): DttyExpress {
    this.app.post(path, this.mapToExpress(handler));
    return this;
  }

  public put(path: string, handler: IHandler): DttyExpress {
    this.app.put(path, this.mapToExpress(handler));
    return this;
  }

  public delete(path: string, handler: IHandler): DttyExpress {
    this.app.delete(path, this.mapToExpress(handler));
    return this;
  }
}
