import { Request } from "express";
import { DttyRequest } from "@dtty/core";

export type IDttyRequest = Request & DttyRequest;
