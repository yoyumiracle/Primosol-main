import { Button } from "@headlessui/react";
import Input from "../../components/common/Input";
import { ArrowLongRightIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { useAccountInfo } from "../../providers/AppContext";
import { copyToClipboard, shortenAddress } from "../../libs/utils";
import { toast } from "react-toastify";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { depositFunds } from "../../libs/fetches";
import { connection, TIP_ACCT } from "../../helpers/config";

export default function Deposit() {
  const { signTransaction, publicKey } = useWallet();
  const { useUserInfo, useTxData, priority } = useAccountInfo();
  const { data: userInfo, refetch } = useUserInfo();
  const { data: txData, refetch: txRefetch } = useTxData(['deposit'])
  const [amount, setAmount] = useState("");
  const handleCopyDepositAddress = () => {
    if (userInfo) {
      copyToClipboard(userInfo.deposit_wallet, () => {
        toast.success('Successfuly copied');
      });
    }
  }

  const handleDeposit = async () => {
    if (!publicKey || !signTransaction || !userInfo) {
      toast.error('Wallet is not connected!');
      return;
    }
    if (isNaN(Number(amount))) {
      toast.error('amount is not correct!');
      return;
    }
    try {
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(userInfo.deposit_wallet),
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      });
      const tipInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: TIP_ACCT,
        lamports: Math.floor(userInfo.trxPriority * LAMPORTS_PER_SOL),
      })
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        instructions: [transferInstruction, tipInstruction]
      }).compileToV0Message()
      const versionedTransaction = new VersionedTransaction(messageV0)
      const signedTransaction = await signTransaction(versionedTransaction);
      const rawTransaction = signedTransaction.serialize();
      toast.success('Sending Transaction...')
      const trxId = await depositFunds(Buffer.from(rawTransaction).toString('base64'), Number(amount));
      if (trxId) {
        toast.success(`Transaction has been confirmed.`);
        refetch()
        txRefetch()
      } else {
        toast.error(`Failed to confirm transaction.`);
      }
    } catch (error) {
      console.log("deposit funds error", error)
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 py-4`}
    >
      <span className="text-sm text-gray font-semibold">Deposit SOL to your PrimoSol trading wallet.</span>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col gap-2 w-full md:w-fit">
          <span className="font-bold">Deposit SOL amount</span>
          <Input
            type="number"
            placeholder="Input Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="flex-col gap-2 w-full md:w-fit hidden md:flex">
          <span className="h-6"></span>
          <ArrowLongRightIcon className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-fit">
          <span className="font-bold">Deposit to</span>
          <div className="flex items-center gap-1 border border-outline bg-light-gray px-4 py-2 rounded-lg justify-between">
            <span className="text-sm">{shortenAddress(userInfo?.deposit_wallet)}</span>
            <ClipboardDocumentIcon className="size-4 text-gray cursor-pointer" onClick={handleCopyDepositAddress} />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end w-full md:w-fit">
          <span className="h-6 hidden md:block"></span>
          <Button className="primary w-full" onClick={handleDeposit}>Deposit</Button>
        </div>
      </div>
    </div>
  );
}
