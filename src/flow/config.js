import { config } from "@onflow/fcl";

config({
  "accessNode.api": "https://rest-testnet.onflow.org", // Mainnet: "https://rest-mainnet.onflow.org"
  // "accessNode.api": "http://192.168.1.6:8888/", // Mainnet: "https://rest-mainnet.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Mainnet: "https://fcl-discovery.onflow.org/authn"
  "app.detail.title":"test-flow",
  "app.detail.icon":window.location + "/favicon.ico",
  // "0xProfile":"0xba1132bc08f82fe2",
  "0xProfile":"0xe9c2549205cdc2f8",
  "0xmessanger": "0xe9c2549205cdc2f8", //(4888e133946b08b429bd0d4dd094ecaf76c00a69a7e2f85953298b4500cd7a5e)
  "app.detail.id":"c63046c8-423a-4b51-835a-f0e97e872608",
  "discovery.authn.endpoint":"https://fcl-discovery.onflow.org/api/testnet/authn" //mainnet : https://fcl-discovery.onflow.org/api/authn
})




