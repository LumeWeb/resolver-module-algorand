import algosdk from "algosdk";
// @ts-ignore
import * as HTTPClientImport from "algosdk/dist/cjs/src/client/client.js";
const { default: HTTPClient } = HTTPClientImport.default;
export function getAcceptFormat(query) {
    if (query !== undefined &&
        Object.prototype.hasOwnProperty.call(query, "format")) {
        switch (query.format) {
            case "msgpack":
                return "application/msgpack";
            case "json":
            default:
                return "application/json";
        }
    }
    else {
        return "application/json";
    }
}
function tolowerCaseKeys(o) {
    /* eslint-disable no-param-reassign,no-return-assign,no-sequences */
    // @ts-ignore
    // tslint:disable-next-line:ban-comma-operator
    return Object.keys(o).reduce((c, k) => ((c[k.toLowerCase()] = o[k]), c), {});
    /* eslint-enable no-param-reassign,no-return-assign,no-sequences */
}
export default class Client extends algosdk.Algodv2 {
    constructor(network, bypassCache = false) {
        super("http://0.0.0.0");
        this._network = network;
        this._bypassCache = bypassCache;
        this.c = this;
    }
    async post(relativePath, data, requestHeaders) {
        const fullHeaders = {
            "content-type": "application/json",
            ...tolowerCaseKeys(requestHeaders),
        };
        const req = this._network.wisdomQuery("rest_request", "algorand", {
            method: "POST",
            endpoint: relativePath,
            data: HTTPClient.serializeData(data, requestHeaders),
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
