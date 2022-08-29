import algosdk from "algosdk";
// @ts-ignore
import { Query } from "algosdk/dist/cjs/src/client/baseHTTPClient.js";
// @ts-ignore
import * as utils from "algosdk/dist/cjs/src/utils/utils.js";
import { getAcceptFormat } from "./client.js";
import { RpcNetwork } from "@lumeweb/dht-rpc-client";

interface HTTPClientResponse {
  body: Uint8Array | any;
  text?: string;
  headers: Record<string, string>;
  status: number;
  ok: boolean;
}

function removeFalsyOrEmpty(obj: any) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // eslint-disable-next-line no-param-reassign
      if (!obj[key] || obj[key].length === 0) delete obj[key];
    }
  }
  return obj;
}

// @ts-ignore
export default class Indexer extends algosdk.Indexer {
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

  private async get(
    relativePath: string,
    query?: Query<any>,
    requestHeaders?: Record<string, string>,
    jsonOptions?: utils.JSONOptions
  ): Promise<HTTPClientResponse> {
    const format = getAcceptFormat(query);
    const fullHeaders = { ...requestHeaders, accept: format };
    const req = this._network.wisdomQuery(
      "indexer_request",
      "algorand",
      {
        method: "GET",
        endpoint: relativePath,
        query: removeFalsyOrEmpty(query),
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
