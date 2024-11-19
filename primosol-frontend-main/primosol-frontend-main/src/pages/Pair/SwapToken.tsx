import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import BuyToken from "./BuyToken";
import SellToken from "./SellToken";
import { ILimitOrder, IPoolOverview } from "../../interface";

type Props = {
  poolInfo?: IPoolOverview;
  addTPLine: (order: ILimitOrder) => void;
  addSLLine: (order: ILimitOrder) => void;
};

export default function SwapToken(props: Props) {

  return (
    <div
      className={`p-4 w-full`}
    >
      <TabGroup className="w-full">
        <TabList className="flex items-center gap-1">
          {["Buy", "Sell"].map((tabName) => (
            <Tab
              key={tabName}
              className={({ selected }) =>
                `border-b-2 rounded-none outline-none text-sm px-4 font-semibold ${selected ? "text-soft-white border-b-2  border-primary" : "text-gray border-light-gray"}`
              }
            >
              {tabName}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-2">
          <TabPanel>
            <BuyToken poolInfo = {props.poolInfo} />
          </TabPanel>
          <TabPanel>
            <SellToken poolInfo = {props.poolInfo} addTPLine={props.addTPLine} addSLLine={props.addSLLine} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
} 
