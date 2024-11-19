import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import Tooltip from "../../components/common/Tooltip";
import { IPoolOverview } from "../../interface";

type Props = {
  poolInfo?: IPoolOverview;
};


export default function DataSecurity(props: Props) {
  const [show, setShow] = useState<boolean>(false);
  const ref = useRef(null);

  const toggleShow = () => {
    if (!ref || !ref.current) return;

    if (show) {
        (ref.current as any).style.maxHeight = '0';
    } else {
      (ref.current as any).style.maxHeight = (ref.current as any).scrollHeight + 'px';
    }

    setShow(prev => !prev);
  }

  return (
    <div
      className={`flex flex-col p-4 font-semibold`}
    >
      <div className="flex justify-between">
        <span>Data & Security</span> 
        <ChevronDownIcon onClick={toggleShow} className={`size-4 cursor-pointer text-gray ${show?'hidden':''}`} />
        <ChevronUpIcon onClick={toggleShow} className={`size-4 cursor-pointer text-gray ${show?'':'hidden'}`} />
      </div>
      
      <div className={`flex flex-col gap-4 transition-all duration-300 ease-in-out max-h-0 ${!show?'overflow-hidden':''}`} ref={ref}>
        <hr className="text-light-gray mt-4" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>Ability to mint new tokens</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>Mint Authority</span>
          </div>
          <span className="text-red">Disabled</span>
        </div>

        <hr className="text-light-gray" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>Ability to freeze token accounts</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>Freeze Authority</span>
          </div>
          <span className="text-red">Disabled</span>
        </div>

        <hr className="text-light-gray" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>% of LP that is burned. Highlighted in red if LP burned is below 50%</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>LP Burned</span>
          </div>
          <span className="text-primary">100.00%</span>
        </div>

        <hr className="text-light-gray" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>Amount of base tokens in pool</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>Pooled INNIT</span>
          </div>
          <span className="text-red">185M $18K</span>
        </div>

        <hr className="text-light-gray" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>Amount of quote tokens in pool</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>Pooled SOL</span>
          </div>
          <span className="text-red">111.61 $18K</span>
        </div>

        <hr className="text-light-gray" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>% owned by top 10 holders. Highlighted in red if ownership is above 15%</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>Top 10 Holders</span>
          </div>
          <span className="text-red">23.23%</span>
        </div>

        <hr className="text-light-gray" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>Address of the deployer</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>Deployer</span>
          </div>
          <span className="text-primary">SDF.SDF</span>
        </div>

        <hr className="text-light-gray" />

        <div className="flex justify-between text-sm">
          <div className="text-gray flex items-center gap-1">
            <Tooltip position='right' content={(
              <span>Time when trading is opened</span>
            )}>
              <InformationCircleIcon className="size-3" /> 
            </Tooltip>
            <span>Open Trading</span>
          </div>
          <span className="text-red">-</span>
        </div>
      </div>
    </div>
  );
}
