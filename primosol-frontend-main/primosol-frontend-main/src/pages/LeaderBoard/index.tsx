import { InformationCircleIcon, LinkIcon } from "@heroicons/react/24/solid";
import Card from "../../components/common/Card";
import Tooltip from "../../components/common/Tooltip";
import LeaderboardTable from "../../components/tables/LeaderboardTable";
import MyStats from "./MyStats";
import { Link } from "react-router-dom";
import CheckBox from "../../components/common/CheckBox";
import { Button } from "@headlessui/react";

export default function LeaderBoard() {
  return (
    <div className="flex flex-col gap-4 w-full py-2">
      <div className="flex">
        <div className="flex flex-col gap-2 flex-grow">
          <span className="text-2xl font-bold">PrimoSol Points Leaderboard</span>
          <span className="text-gray font-medium text-sm">Accumulate PrimoSol points by trading and fulfilling missions.</span>
        </div>
        <div className="hidden md:flex items-end">
          <Link to={"/referrals"} className="flex gap-1 items-center bg-light-gray px-4 py-2 rounded-lg font-semibold">
            <LinkIcon className="size-4"/>
            <span>Referral Tracking</span>
          </Link>
        </div>
      </div>

      <div className="flex gap-8 flex-col-reverse md:flex-row">
        <div className="flex flex-col gap-4 flex-grow">
          <MyStats />

          <Card className="flex flex-col gap-2 rounded-xl">
            <span className="font-bold px-4 md:px-6 pt-4 ">Leaderboard</span>
            <hr className="text-light-gray" />
            <LeaderboardTable />
          </Card>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-[420px]">
          <div className="flex flex-col border border-light-gray rounded-xl">
            <div className="flex gap-2 py-4 px-4 md:px-8">
              <img src="/assets/icons/cup.svg" />
              <span className="font-bold">Weekly Jackpot</span>
              <Tooltip content={"The higher up on the top 100 you are, the more you receive from the jackpot! Jackpot amount may change as trading volume increase."}>
                <InformationCircleIcon className="size-3 text-gray" />
              </Tooltip>
            </div>
            <hr className="text-light-gray" />
            <div className="flex flex-col text-center p-4">
              <span className="text-3xl font-bold">829,123 pts</span>
              <span className="text-gray text-smd">Distributed to top 100 traders in 16h 42m</span>
            </div>
            <hr className="text-light-gray" />
            <Link to={"/referrals"} className="flex gap-1 items-center justify-center px-4 py-2 font-semibold">
              <LinkIcon className="size-4"/>
              <span>Referral Tracking</span>
            </Link>
          </div>
          
          <div className="flex flex-col border border-light-gray rounded-xl">
            <div className="flex gap-2 py-4 px-4 md:px-8">
              <img src="/assets/icons/mission.svg" />
              <span className="font-bold">Missions</span>
              <Tooltip content={"Complete the following missions in order to see new ones."}>
                <InformationCircleIcon className="size-3 text-gray" />
              </Tooltip>
            </div>
            <hr className="text-light-gray" />
            <div className="flex flex-col">
              <div className="flex gap-2 px-4 md:px-8 py-4">
                <div className="flex items-center">
                  <CheckBox />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-smd">Make your first trade</span>
                  <span className="text-gray text-smd">10 points</span>
                </div>
                <div className="flex items-center">
                  <Button className="primary">Go</Button>
                </div>
              </div>
              <div className="flex gap-2 px-4 md:px-8 py-4">
                <div className="flex items-center">
                  <CheckBox />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-smd">Refer a friend</span>
                  <span className="text-gray text-smd">5 points</span>
                </div>
                <div className="flex items-center">
                  <Button className="primary">Go</Button>
                </div>
              </div>
              <div className="flex gap-2 px-4 md:px-8 py-4">
                <div className="flex items-center">
                  <CheckBox />
                </div>
                <div className="flex flex-col flex-grow">
                  <span className="text-smd">Login with Telegram</span>
                  <span className="text-gray text-smd">5 points</span>
                </div>
                <div className="flex items-center">
                  <Button className="primary">Go</Button>
                </div>
              </div>
            </div>
          </div>

          <span className="text-gray text-smd">PrimoSol may update points when required to keep the Leaderboard system fair.</span>
        </div>
      </div>
    </div>
  );
}
