import { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import { Button, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import AdvancedSetting from "./AdvancedSetting";
import { ILimitOrder, IPoolOverview } from "../../interface";
import { useAccountInfo } from "../../providers/AppContext";
import { addLimitOrder, fetchPoolInfo, swapToken } from "../../libs/fetches";
import millify from "millify";
import { DEFAULT_TOKEN } from "../../helpers/config";
import { useTokenData } from "../../providers/TokenData";
import RadioButtons from "../../components/buttons/RadioButtons";
import StopLoss from "./StopLoss";
import TakeProfit from "./TakeProfit";
import { toast } from "react-toastify";

type Props = {
  poolInfo?: IPoolOverview;
  addTPLine: (order: ILimitOrder) => void;
  addSLLine: (order: ILimitOrder) => void;
};

const SELL_OPTIONS = [
  {
    value: 'now',
    label: 'Sell Now'
  },
  {
    value: 'auto',
    label: 'Auto Sell'
  }
]

export default function SellToken(props: Props) {
  const { useUserInfo, isSign, slippage, priority } = useAccountInfo();
  const { useTokenBalance } = useTokenData();
  const { data: userInfo, refetch: userRefetch } = useUserInfo()
  const { data: tokenBalance, refetch } = useTokenBalance(userInfo?.deposit_wallet, props.poolInfo?.baseMint, props.poolInfo?.baseDecimals)

  const [amount, setAmount] = useState<string>("");
  const [option, setOption] = useState<string>("now");

  const [type, setType] = useState(0);
  const [isStopLoss, setIsStopLoss] = useState<boolean>(true);
  const [expire, setExpire] = useState("24");
  const [value, setValue] = useState("20.0");

  const handleSellNow = async () => {
    if (props.poolInfo && !isNaN(Number(amount))) {
      toast.success('Sending Transaction...')
      const ret = await swapToken(props.poolInfo.baseMint, DEFAULT_TOKEN, Number(amount), slippage, priority)
      if (ret) {
        toast.success("Transaction has been confirmed successfully")
        userRefetch()
        refetch()
      } else {
        toast.error("Transaction has been failed")
      }
    }
  }

  const handleSellAuto = async () => {
    if (props.poolInfo && !isNaN(Number(value)) && !isNaN(Number(amount)) && !isNaN(Number(expire))) {
      const poolInfo:IPoolOverview = await fetchPoolInfo(props.poolInfo.poolAddress);
      if (poolInfo) {
        let target_value = Number(value)
        if (type % 2 === 0) {
          if (isStopLoss) {
            target_value = type === 0 ? poolInfo.mcap * (100 - target_value) / 100 : poolInfo.price * (100 - target_value) / 100
          } else {
            target_value = type === 0 ? poolInfo.mcap * (100 + target_value) / 100 : poolInfo.price * (100 + target_value) / 100
          }
        }
        const trigger_type = type < 2 ? 1 : 0 // 1: marketcap, 0: price
        const ret = await addLimitOrder({
          order_type: 1,
          tokenAddress: poolInfo.baseMint,
          symbol: poolInfo.baseSymbol,
          logo: poolInfo.baseImage,
          created_price: poolInfo.price,
          target_value: target_value,
          type: isStopLoss? 1 : 0, // 0: TP, 1: SL
          amount: Number(amount),
          expire: Number(expire),
          slippage: slippage,
          trxPriority: priority,
          trigger_type: trigger_type
        })
        if (ret) {
          toast.success("New order has been booked successfully")
          if (isStopLoss) props.addSLLine(ret);
          else props.addTPLine(ret);
        } else {
          toast.error("order book has been failed")
        }
      }
    }
  }

  return (
    <div
      className={`flex flex-col py-4 gap-4 font-semibold`}
    >
      <RadioButtons className="grid grid-cols-2" options={SELL_OPTIONS} onChange={setOption} defaultValue={option} />

      {option === "now" ? (
        <div className="flex flex-col gap-4">
          <Input 
            label="Balance"
            highlight={`${millify(tokenBalance || 0, { precision: 4 })} ${props.poolInfo?.baseSymbol}`}
            value={amount} 
            placeholder="Amount"
            onChange={e => setAmount(e.target.value)}
            onHighlight={() => setAmount(millify(tokenBalance || 0, { precision: 8 }))}
          >
            <span className="text-sm">{props.poolInfo?.baseSymbol}</span>
          </Input>
          
          <div className="grid grid-cols-3 gap-5">
            <Button className="third w-full" onClick={() => setAmount(millify((tokenBalance || 0) / 4, { precision: 4 }))}>25%</Button>
            <Button className="third w-full" onClick={() => setAmount(millify((tokenBalance || 0) / 2, { precision: 4 }))}>50%</Button>
            <Button className="third w-full" onClick={() => setAmount(millify((tokenBalance || 0), { precision: 4 }))}>100%</Button>
          </div>
        </div>
      ) : (
        <TabGroup className="w-full bg-mid-gray rounded-xl">
          <TabList className="flex items-center gap-1">
            {["Stop Loss", "Take Profit"].map((tabName) => (
              <Tab
                key={tabName}
                className={({ selected }) =>
                  `flex-grow border-b-2 rounded-none outline-none text-sm px-4 font-semibold ${selected ? "text-soft-white border-b-2  border-primary" : "text-gray border-light-gray"}`
                }
                onClick={() => setIsStopLoss(tabName === "Stop Loss")}
              >
                {tabName}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-2">
            <TabPanel>
              <StopLoss 
                type={type}
                symbol={props.poolInfo?.baseSymbol}
                value={value}
                amount={amount}
                balance={tokenBalance}
                expire={expire}
                setType={setType}
                setAmount={setAmount}
                setExpire={setExpire}
                setValue={setValue}
              />
            </TabPanel>
            <TabPanel>
              <TakeProfit 
                type={type}
                symbol={props.poolInfo?.baseSymbol}
                value={value}
                amount={amount}
                balance={tokenBalance}
                expire={expire}
                setType={setType}
                setAmount={setAmount}
                setExpire={setExpire}
                setValue={setValue}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}

      <AdvancedSetting />
      
      {option === "now" ? 
        <Button className="secondary w-full justify-center" onClick={() => handleSellNow()}>Quick Sell</Button> :
        <Button className="primary w-full justify-center" onClick={() => handleSellAuto()}>Create Order</Button>}
      
    </div>
  );
}
