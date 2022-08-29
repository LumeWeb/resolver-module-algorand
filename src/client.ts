import algosdk from "algosdk";
import pocketNetworks from "@lumeweb/pokt-rpc-endpoints";
// @ts-ignore
import { Query } from "algosdk/dist/cjs/src/client/baseHTTPClient.js";
// @ts-ignore
import * as HTTPClientImport from "algosdk/dist/cjs/src/client/client.js";
import { RpcNetwork } from "@lumeweb/dht-rpc-client";

const { default: HTTPClient } = HTTPClientImport.default;

interface HTTPClientResponse {
  body: Uint8Array | any;
  text?: string;
  headers: Record<string, string>;
  status: number;
  ok: boolean;
}

export function getAcceptFormat(
  query?: Query<"msgpack" | "json">
): "application/msgpack" | "application/json" {
  if (
    query !== undefined &&
    Object.prototype.hasOwnProperty.call(query, "format")
  ) {
    switch (query.format) {
      case "msgpack":
        return "application/msgpack";
      case "json":
      default:
        return "application/json";
    }
  } else {
    return "application/json";
  }
}

function tolowerCaseKeys(o: any) {
  /* eslint-disable no-param-reassign,no-return-assign,no-sequences */
  // @ts-ignore
  // tslint:disable-next-line:ban-comma-operator
  return Object.keys(o).reduce((c, k) => ((c[k.toLowerCase()] = o[k]), c), {});
  /* eslint-enable no-param-reassign,no-return-assign,no-sequences */
}

export default class Client extends algosdk.Algodv2 {
  private _bypassCache: boolean;
  private _network: RpcNetwork;
  // @ts-ignore
  private c: Client;

  constructor(network: RpcNetwork, bypassCache = false) {
    super("http://0.0.0.0");
    this._network = network;
    this._bypassCache = bypassCache;
    this.c = this;
  }

  private async post(
    relativePath: string,
    data: any,
    requestHeaders?: Record<string, string>
  ): Promise<HTTPClientResponse> {
    const fullHeaders = {
      "content-type": "application/json",
      ...tolowerCaseKeys(requestHeaders),
    };
    const req = this._network.wisdomQuery(
      "rest_request",
      "algorand",
      {
        method: "POST",
        endpoint: relativePath,
        data: HTTPClient.serializeData(data, requestHeaders),
        fullHeaders,
      },
      this._bypassCache
    );

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
