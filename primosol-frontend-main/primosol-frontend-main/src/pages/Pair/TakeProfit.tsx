import Input from "../../components/common/Input";
import millify from "millify";
import Tooltip from "../../components/common/Tooltip";
import { ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import Dropdown, { DropdownItem } from "../../components/common/Dropdown";

const TYPES = [
  'MC ↑ by', 
  'MC is', 
  'Price ↑ by', 
  'Price is', 
  // 'By target line'
]

interface TakeProfitProps {
  type: number
  value: string
  amount: string
  expire: string
  setType: (value: number) => void
  setAmount: (value: string) => void
  setValue: (value: string) => void
  setExpire: (value: string) => void
  balance?: number
  symbol?: string
}

const TakeProfit = ({type, setType, value, setValue, amount, setAmount, expire, setExpire, balance, symbol = 'SOL'}: TakeProfitProps) => {
  return (
    <div className="flex flex-col gap-5 p-2">
      <div className="flex flex-col gap-2">
        <div className="flex border border-outline rounded-lg text-sm">
          <div className={`w-[140px] flex`}>
            <Dropdown
              position='left'
              className='w-full'
              DropdownButton={(toggle: any) => 
                <div className="flex justify-between items-center p-2 relative cursor-pointer" onClick={toggle}>
                  <span>{TYPES[type]}</span>
                  <ChevronDownIcon className="size-4" />
                </div>
              }
              DropdownMenu={
                <div className='flex w-[160px] flex-col gap-2 font-normal normal-case'>
                  {TYPES.map((value, index) => (
                    <DropdownItem key={value} className='flex items-center justify-start gap-1 text-start text-sm' onClick={() => {setType(index)}}>
                      {value}
                    </DropdownItem>
                  ))}
                </div>
              }
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border-l border-outline">
            <span className="text-gray text-center">{'≥'}</span>
            <input className="flex-grow bg-transparent outline-none w-full" value={value} onChange={e => setValue(e.target.value)} type="number" />
            <span className="text-gray text-center">
              {type === 0 || type === 2 ? '%' : '$'}
            </span>
          </div>
        </div>
        {value && 
        <div className="flex">
          <Tooltip position="right" content={(
            <div className="text-left w-[320px]">
              For limit orders, they are executed according to the target price. The market cap displayed is for your reference only and is not used in order execution.
              <br />
              When setting a limit order, please make sure that the target price shown is accurate and that the price you want the order to trigger at is correct before pressing the Create Order button.
            </div>
          )}>
            <InformationCircleIcon className="size-3 text-gray" />
          </Tooltip>
          <span className="text-xs text-gray">{`Triggers on: MC ≥ $${value}, SOL ≥ 0.005`}</span>
        </div> }
      </div>

      <hr className="text-light-gray -mx-2" />

      <Input 
        label="Balance"
        highlight={`${millify(balance || 0, { precision: 4 })} ${symbol}`}
        value={amount} 
        placeholder="Amount"
        type="number"
        onChange={e => setAmount(e.target.value)}
        onHighlight={() => setAmount(millify(balance || 0, { precision: 8 }))}
      >
        <span className="text-sm">{symbol}</span>
      </Input>

      <Input 
        label="Expires in hrs"
        value={expire} 
        type="number"
        onChange={e => setExpire(e.target.value)}
      />
    </div>
  )
}

export default TakeProfit;