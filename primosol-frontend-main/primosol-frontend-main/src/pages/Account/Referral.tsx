import { Button } from "@headlessui/react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Tooltip from "../../components/common/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export default function Referral() {
  return (
    <div className="flex flex-col gap-4 w-full py-2">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">Referrals</span>
        <span className="text-gray font-medium text-sm">Track earnings from your referrals in real-time.</span>
      </div>

      <Card className="flex flex-col px-6 py-4 gap-2 rounded-xl">
        <span className="font-bold">Your Referral Link</span>
        <hr className="text-light-gray -mx-6" />
        <div className="flex flex-col py-4 gap-4">
          <span className="text-gray text-sm font-semibold">You can update your referral URL handle once.</span>
          <div className="flex gap-2 items-center">
            <span>primosol.io/@</span>
            <Input />
            <Button className="primary">Save</Button>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col px-6 py-4 gap-2 rounded-xl">
        <span className="font-bold">Your Stats</span>
        <hr className="text-light-gray -mx-6" />
        <div className="grid grid-cols-3 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-gray text-sm font-semibold">
              <span>Referrals</span>
              <Tooltip content={"Number of ppl who signed up using your referral link"}>
                <InformationCircleIcon className="size-3" />
              </Tooltip>
            </div>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-gray text-sm font-semibold">
              <span>Traders</span>
              <Tooltip content={"Number of referrals who traded at least once"}>
                <InformationCircleIcon className="size-3" />
              </Tooltip>
            </div>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 text-gray text-sm font-semibold">
              <span>Total Volume by Traders</span>
              <Tooltip content={"Total combined volume of all your referrals"}>
                <InformationCircleIcon className="size-3" />
              </Tooltip>
            </div>
            <span className="font-semibold">150K</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
