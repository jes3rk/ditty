import { IModule } from "./module.interface";
import { IProvider } from "./provider.interface";

export abstract class AbstractModuleBase implements IModule {
  public getGlobalProviders(): IProvider[] {
    return [];
  }

  public getRequestProviders(): IProvider[] {
    return [];
  }
}
