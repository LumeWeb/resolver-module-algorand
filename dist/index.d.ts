import { AbstractResolverModule } from "@lumeweb/libresolver";
import { DNSResult, ResolverOptions } from "@lumeweb/libresolver/src/types.js";
export default class Algorand extends AbstractResolverModule {
  getSupportedTlds(): string[];
  resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult>;
}
