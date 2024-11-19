import { ChevronDownIcon, ChevronUpIcon, Cog8ToothIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import Tooltip from "../../components/common/Tooltip";
import Input from "../../components/common/Input";
import { Button } from "@headlessui/react";
import ToggleButton from "../../components/buttons/ToggleButton";
import { useAccountInfo } from "../../providers/AppContext";

export default function AdvancedSetting() {

  const { slippage, priority, setSlippage, setPriority } = useAccountInfo();

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
      className={`flex flex-col font-semibold`}
    >
      <div className="flex border-t border-b border-light-gray text-gray text-sm py-2">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-1">
            <Cog8ToothIcon className="size-4" />
            <span>Advanced Settings</span>
          </div>
          <div className="flex items-center gap-1">
            <ChevronDownIcon onClick={toggleShow} className={`size-4 cursor-pointer ${show?'hidden':''}`} />
            <ChevronUpIcon onClick={toggleShow} className={`size-4 cursor-pointer ${show?'':'hidden'}`} />
          </div>
        </div>
      </div>
      
      <div className={`flex flex-col gap-4 transition-all duration-300 ease-in-out max-h-0 ${!show?'overflow-hidden':''}`} ref={ref}>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Input 
            type="number" 
            label="Slippage"
            value={slippage} 
            onChange={e => setSlippage(e.target.value)} 
          > % </Input>

          <Input 
            type="number" 
            label="Priority"
            value={priority} 
            onChange={e => setPriority(e.target.value)} 
          > SOL </Input>
        </div>
      </div>
    </div>
  );
}
