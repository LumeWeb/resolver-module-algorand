import algosdk from "algosdk";
import { RpcNetwork } from "@lumeweb/dht-rpc-client";
export default class Indexer extends algosdk.Indexer {
  private _bypassCache;
  private _network;
  private c;
  constructor(network: RpcNetwork, bypassCache?: boolean);
  private get;
}
