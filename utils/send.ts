import { Fireblocks, BasePath, TransferPeerPathType } from "@fireblocks/ts-sdk";

import useStore from "../store/useStore";
const { settings } = useStore.getState();

const fireblocks = new Fireblocks({
  apiKey: settings.apiKey,
  basePath: BasePath.Sandbox, // or assign directly to "https://sandbox-api.fireblocks.io/v1";
  secretKey: settings.secretKey,
});

export const sendTx = async () => {
  const payload = {
    assetId: "USDT_ERC20",
    amount: 1,
    source: {
      type: TransferPeerPathType.VaultAccount,
      id: String(""),
    },
    destination: {
      type: TransferPeerPathType.VaultAccount,
      id: String(""),
    },
    note: "Your first transaction!",
  };
  const result = await fireblocks.transactions.createTransaction({
    transactionRequest: payload,
  });
  console.log(JSON.stringify(result, null, 2));
};
