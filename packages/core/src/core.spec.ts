import { Token } from "@dtty/simpldi";
import { DttyCore } from "./core";
import { DttyRequest } from "./dtty.request";
import { IHandler } from "./handler.function";

describe("Dtty Core", () => {
  class DttyApp extends DttyCore {}
  let app: DttyApp;

  beforeEach(() => {
    app = new DttyApp();
  });

  describe("handler behavior", () => {
    class TestSvc {
      public readonly id = "TestSvc";
    }
    const testSvcToken = new Token<TestSvc>();

    class ReqSvc {
      public readonly id = "ReqSvc";
    }
    const reqSvcToken = new Token<ReqSvc>();
    let req: DttyRequest;

    beforeEach(() => {
      app.addGlobalProvider(testSvcToken, TestSvc);
      app.addRequestProvider(reqSvcToken, ReqSvc);

      req = {
        scopedContainer: app.getRequestContainer(),
      };
    });

    it("should resolve an added handler and execute the function", async () => {
      const testValue = "Hello world";
      const handler: IHandler = {
        handler: jest.fn(() => testValue),
      };

      const token = app.addHandler(req, handler);
      const result = await app.handleRequest(req, token);
      expect(handler.handler).toHaveBeenCalledTimes(1);
      expect(result).toEqual(testValue);
    });

    it("should resolve an added handler with global dependencies", async () => {
      const handler: IHandler = {
        handler: jest.fn((service: TestSvc) => service.id),
        injectionTokens: [testSvcToken],
      };

      const token = app.addHandler(req, handler);
      const result = await app.handleRequest(req, token);
      expect(handler.handler).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });

    it("should resolve an added handler with request dependencies", async () => {
      const handler: IHandler = {
        handler: jest.fn((service: ReqSvc) => service.id),
        injectionTokens: [reqSvcToken],
      };

      const token = app.addHandler(req, handler);
      const result = await app.handleRequest(req, token);
      expect(handler.handler).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });
  });
});
