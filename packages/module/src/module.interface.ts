import { IProvider } from "./provider.interface";

export interface IModule {
  getGlobalProviders(): IProvider[];
  getRequestProviders(): IProvider[];
}
