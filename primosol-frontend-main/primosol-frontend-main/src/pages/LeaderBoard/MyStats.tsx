import { InformationCircleIcon } from "@heroicons/react/24/solid";
import Card from "../../components/common/Card";
import Tooltip from "../../components/common/Tooltip";

export default function MyStats() {
  return (
    <Card className="flex flex-col px-4 md:px-6 py-4 gap-2 rounded-xl">
      <span className="font-bold">Your Stats</span>
      <hr className="text-light-gray -mx-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 py-4 gap-4">
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Ranking</span>
            <Tooltip content={"Your rank on the leaderboard for the current 7-days cycle"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">0</span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Total Points</span>
            <Tooltip content={"Total of all PrimoSol points that you've accumulated"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">0</span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Week Points</span>
            <Tooltip content={"PrimoSol points that you've earned for the past 7 days"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">150K</span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Trading Volume</span>
            <Tooltip content={"Total volume of tokens you've trade on PrimoSol"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">33.2</span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>Trader Referrals</span>
            <Tooltip content={"# of people you referred who have traded at least once"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">0</span>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-1 text-gray text-sm font-semibold">
            <span>PrimoSol Shares</span>
            <Tooltip content={"# of times you've shared your PrimoSol gains"}>
              <InformationCircleIcon className="size-3" />
            </Tooltip>
          </div>
          <span className="font-semibold">1</span>
        </div>
      </div>
    </Card>
  )
}