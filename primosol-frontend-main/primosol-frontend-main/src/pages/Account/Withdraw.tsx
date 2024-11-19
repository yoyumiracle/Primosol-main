import { Button } from "@headlessui/react";
import Input from "../../components/common/Input";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import { useAccountInfo } from "../../providers/AppContext";
import { shortenAddress } from "../../libs/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { withdrawFunds } from "../../libs/fetches";

export default function Withdraw() {
  const { useUserInfo, isSign, useTxData } = useAccountInfo();
  const { data: userInfo, refetch } = useUserInfo()
  const { data: txData, refetch: txRefetch } = useTxData(['withdraw'])
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    if (!isSign) {
      toast.error('Wallet is not connected!');
      return;
    }
    if (isNaN(Number(amount))) {
      toast.error('amount is not correct!');
      return;
    }
    try {
      toast.success('Sending Transaction...')
      const trxId = await withdrawFunds(Number(amount))
      if (trxId) {
        toast.success(`Transaction has been confirmed.`);
        refetch()
        txRefetch()
      } else {
        toast.error(`Failed to confirm transaction.`);
      }
    } catch (error) {
      console.log("withdraw funds error", error)
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 py-4`}
    >
      <span className="text-sm text-gray font-semibold">Withdraw from your PrimoSol trading wallet to your chosen wallet.</span>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col gap-2 w-full md:w-fit">
          <span className="font-bold">Withdraw from</span>
          <div className="flex items-center gap-1 border border-outline bg-light-gray px-4 py-2 rounded-lg">
            <span className="text-sm h-full">{shortenAddress(userInfo?.deposit_wallet)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-fit">
          <span className="font-bold">SOL amount</span>
          <Input 
            type="number"
            placeholder="Input Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="hidden md:flex flex-col gap-2">
          <span className="h-6"></span>
          <ArrowLongRightIcon className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-fit">
          <span className="font-bold">Withdraw to</span>
          <div className="flex items-center gap-1 border border-outline bg-light-gray px-4 py-2 rounded-lg">
            <span className="text-sm w-full overflow-hidden text-ellipsis">{userInfo?.wallet}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end w-full md:w-fit">
          <span className="h-6 hidden md:block"></span>
          <Button className="primary w-full" onClick={handleWithdraw}>Withdraw</Button>
        </div>
      </div>
    </div>
  );
}
