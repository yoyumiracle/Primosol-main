import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Card from "../../components/common/Card";
import { ITokenInfo } from '../../types';
import { Link } from "react-router-dom";
import { POPULAR_TOKENS } from "../../data";

export default function TrendTokens() {

  const TokenItem = ({ token }: { token: ITokenInfo }) => {
    return (
      <div className="grid grid-cols-[24px_2fr_3fr_2fr_1fr] gap-2 text-soft-white py-1">
        <img className="size-6" src={token.logo} alt="token-logo"/>
        <span className="">{token.symbol}</span>
        <span className="text-gray">{token.name}</span>
        <span className="text-right">${token.price?.toLocaleString()}</span>
        <span className={token.priceChange >= 0 ? 'text-primary text-right' : 'text-red text-right'}>
          {token.priceChange > 0 ? '+' : ''}{token.priceChange}
        </span>
      </div>
    )
  }

  return (
    <Card
      className={`p-4 max-w-[435px] w-full rounded-xl`}
    >
      <TabGroup className="w-full">
        <TabList className="flex items-center gap-1">
          {["Popular", "New Tokens"].map((tabName) => (
            <Tab
              key={tabName}
              className={({ selected }) =>
                `border-b-2 rounded-none outline-none font-semibold ${selected ? "text-soft-white border-b-2  border-primary" : "text-gray border-transparent"}`
              }
            >
              {tabName}
            </Tab>
          ))}

          <div className="flex-grow" />

          <Link to="/trending" className="text-xs text-gray font-semibold">{'View All Coins >'}</Link>
        </TabList>
        <TabPanels className="mt-2">
          <TabPanel>
            {POPULAR_TOKENS.map((token: ITokenInfo) => (
              <TokenItem token={token} key={token.id} />
            ))}
          </TabPanel>
          <TabPanel>
            {POPULAR_TOKENS.map((token: ITokenInfo) => (
              <TokenItem token={token} key={token.id} />
            ))}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
