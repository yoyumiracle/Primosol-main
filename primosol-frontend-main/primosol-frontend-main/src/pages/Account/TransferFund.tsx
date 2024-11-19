import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Card from "../../components/common/Card";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

export default function TransferFund() {
  return (
    <div className="flex flex-col gap-4 w-full py-2">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">Transfer Funds</span>
        <span className="text-gray font-medium text-sm">Easily deposit or withdraw funds.</span>
      </div>

      <Card className="flex flex-col px-6 py-4 gap-2 rounded-xl">
        <TabGroup className="w-full">
          <TabList className="flex items-center gap-4">
            {["Deposit", "Withdraw"].map((tabName) => (
              <Tab
                key={tabName}
                className={({ selected }) =>
                  `border-b-2 rounded-none text-md outline-none font-bold pt-0 ${selected ? "text-soft-white border-b-2  border-primary" : "text-gray border-transparent"}`
                }
              >
                {tabName}
              </Tab>
            ))}
          </TabList>

          <hr className="text-light-gray -mx-6" />
          
          <TabPanels className="mt-2">
            <TabPanel>
              <Deposit />
            </TabPanel>
            <TabPanel>
              <Withdraw />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>

      <Card className="flex flex-col px-6 py-4 gap-2 rounded-xl">
        <span className="font-bold">History</span>
        <hr className="text-light-gray -mx-6" />
        <div className="grid grid-cols-3 py-4">
          {/* There are currently no transactions yet. */}
        </div>
      </Card>
    </div>
  );
}
