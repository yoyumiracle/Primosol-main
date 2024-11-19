import { useState } from "react";
import Input from "../../components/common/Input";
import { Button } from "@headlessui/react";
import AdvancedSetting from "./AdvancedSetting";
import { IPoolOverview } from "../../interface";
import { useAccountInfo } from "../../providers/AppContext";
import millify from "millify";
import { addLimitOrder, fetchPoolInfo, swapToken } from "../../libs/fetches";
import { DEFAULT_TOKEN } from "../../helpers/config";
import RadioButtons from "../../components/buttons/RadioButtons";
import BuyDip from "./BuyDip";
import { useTokenData } from "../../providers/TokenData";
import { toast } from "react-toastify";

type Props = {
  poolInfo?: IPoolOverview;
};

const SELL_OPTIONS = [
  {
    value: 'now',
    label: 'Buy Now'
  },
  {
    value: 'dip',
    label: 'Buy Dip'
  }
]

export default function BuyToken(props: Props) {
  const { useUserInfo, slippage, priority } = useAccountInfo();
  const { data: userInfo, refetch } = useUserInfo()
  
  const [amount, setAmount] = useState<string>("");
  const [option, setOption] = useState<string>("now");
  
  const [type, setType] = useState(0);
  const [value, setValue] = useState("20.0");
  const [expire, setExpire] = useState("24");

  const handleBuyNow = async () => {
    if (props.poolInfo && !isNaN(Number(amount))) {
      toast.success('Sending Transaction...')
      const ret = await swapToken(DEFAULT_TOKEN, props.poolInfo.baseMint, Number(amount), slippage, priority)
      if (ret) {
        toast.success("Transaction has been confirmed successfully")
        refetch()
      } else {
        toast.error("Transaction has been failed")
      }
    }
  }

  const handleBuyDip = async () => {
    if (props.poolInfo && !isNaN(Number(value)) && !isNaN(Number(amount)) && !isNaN(Number(expire))) {
      const poolInfo: IPoolOverview = await fetchPoolInfo(props.poolInfo.poolAddress);
      if (poolInfo) {
        let target_value = Number(value)
        if (type % 2 === 0) {
          target_value = type === 0 ? poolInfo.mcap * (100 - target_value) / 100 : poolInfo.price * (100 - target_value) / 100
        }
        const trigger_type = type < 2 ? 1 : 0 // 1: marketcap, 0: price
        const ret = await addLimitOrder({
          order_type: 0,
          tokenAddress: poolInfo.baseMint,
          symbol: poolInfo.baseSymbol,
          logo: poolInfo.baseImage,
          created_price: poolInfo.price,
          target_value: target_value,
          amount: Number(amount),
          expire: Number(expire),
          slippage: slippage,
          trxPriority: priority,
          trigger_type: trigger_type
        })
        if (ret) {
          toast.success("New order has been booked successfully")
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
    
      <div className="flex flex-col gap-5">
        <Input 
          label="Balance"
          highlight={`${millify(userInfo ? userInfo.sol_balance : 0, { precision: 4})} SOL`}
          value={amount} 
          placeholder="Amount"
          onChange={e => setAmount(e.target.value)}
          onHighlight={() => setAmount(millify(userInfo ? userInfo.sol_balance : 0, { precision: 8}))}
        >
          <span className="text-sm">SOL</span>
        </Input>

        {option === "dip" ? 
        <BuyDip 
          type={type}
          expire={expire}
          value={value}
          setType={setType}
          setExpire={setExpire}
          setValue={setValue}
        /> : null}
      </div>

      <AdvancedSetting />
      
      {option === "now" ? 
        <Button className="primary w-full justify-center" onClick={() => handleBuyNow()}> Quick Buy </Button> : 
        <Button className="primary w-full justify-center" onClick={() => handleBuyDip()}> Create Order </Button>}
      
    </div>
  );
}
