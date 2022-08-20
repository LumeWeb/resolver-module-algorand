import Client from "./client.js";
import Indexer from "./indexer.js";
import { ANS } from "@algonameservice/sdk";
import { AbstractResolverModule, DNS_RECORD_TYPE, resolverEmptyResponse, resolverError, resolveSuccess, } from "@lumeweb/libresolver";
export default class Algorand extends AbstractResolverModule {
    getSupportedTlds() {
        return ["algo"];
    }
    async resolve(domain, options, bypassCache) {
        if (!this.isTldSupported(domain)) {
            return resolverEmptyResponse();
        }
        const client = new Client(this.resolver.rpcNetwork, bypassCache);
        const indexer = new Indexer(this.resolver.rpcNetwork, bypassCache);
        // @ts-ignore
        const resolver = new ANS(client, indexer);
        const ansDomain = resolver.name(domain);
        const records = [];
        if ([DNS_RECORD_TYPE.CONTENT, DNS_RECORD_TYPE.TEXT].includes(options.type)) {
            let record;
            try {
                record = await ansDomain.getContent();
            }
            catch (e) {
                return resolverError(e);
            }
            if (record.length > 0) {
                records.push({ type: DNS_RECORD_TYPE.CONTENT, value: record });
            }
        }
        if (options.type === DNS_RECORD_TYPE.A) {
            let record;
            try {
                record = await ansDomain.getText("ipaddress");
            }
            catch (e) {
                return resolverError(e);
            }
            if (record.length > 0) {
                records.push({ type: options.type, value: record });
            }
        }
        if (0 < records.length) {
            return resolveSuccess(records);
        }
        return resolverEmptyResponse();
    }
}
