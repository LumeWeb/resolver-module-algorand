import algosdk from "algosdk";
import { getAcceptFormat } from "./client.js";
function removeFalsyOrEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // eslint-disable-next-line no-param-reassign
            if (!obj[key] || obj[key].length === 0)
                delete obj[key];
        }
    }
    return obj;
}
// @ts-ignore
export default class Indexer extends algosdk.Indexer {
    constructor(network, bypassCache = false) {
        super("http://0.0.0.0");
        this._network = network;
        this._bypassCache = bypassCache;
        this.c = this;
    }
    async get(relativePath, query, requestHeaders, jsonOptions) {
        const format = getAcceptFormat(query);
        const fullHeaders = { ...requestHeaders, accept: format };
        const req = this._network.wisdomQuery("indexer_request", "algorand", {
            method: "GET",
            endpoint: relativePath,
            query: removeFalsyOrEmpty(query),
            fullHeaders,
        }, this._bypassCache);
        const body = await req.result;
        const text = undefined;
        if (body.error) {
            throw new Error(body.error);
        }
        // @ts-ignore
        return {
            body: body.data,
            text,
            ok: true,
        };
    }
}
