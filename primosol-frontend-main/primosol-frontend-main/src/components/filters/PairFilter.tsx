import { useState } from "react";
import Card from "../common/Card";
import CheckBox from "../common/CheckBox";
import Input from "../common/Input";
import { Button } from "@headlessui/react";

export default function PairFilter() {
  const [value, setValue] = useState<string>("");

  return (
    <Card
      className={`p-4 w-[360px] flex-col gap-2 text-sm rounded-md`}
    >
      <div className="flex flex-col gap-2">
        <CheckBox> Mint Auth </CheckBox>
        <CheckBox> Freeze Auth </CheckBox>
        <CheckBox> LP Burned </CheckBox>
        <CheckBox> Top 10 Holders </CheckBox>
        <CheckBox> With at least 1 social </CheckBox>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="w-full flex flex-col gap-2">
        <span className="text-gray">By Current Liquidity($)</span>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} />
          <span className="text-center">to</span>
          <Input value={value} onChange={e => setValue(e.target.value)} />
        </div>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="w-full flex flex-col gap-2">
        <span className="text-gray">By Volume</span>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} />
          <span className="text-center">to</span>
          <Input value={value} onChange={e => setValue(e.target.value)} />
        </div>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="w-full flex flex-col gap-2">
        <span className="text-gray">By MKT Cap</span>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} />
          <span className="text-center">to</span>
          <Input value={value} onChange={e => setValue(e.target.value)} />
        </div>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="w-full flex flex-col gap-2">
        <span className="text-gray">By TXNS</span>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} />
          <span className="text-center">to</span>
          <Input value={value} onChange={e => setValue(e.target.value)} />
        </div>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="w-full flex flex-col gap-2">
        <span className="text-gray">By Buys</span>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} />
          <span className="text-center">to</span>
          <Input value={value} onChange={e => setValue(e.target.value)} />
        </div>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="w-full flex flex-col gap-2">
        <span className="text-gray">By Sells</span>
        <div className="grid grid-cols-[1fr_40px_1fr] items-center">
          <Input value={value} onChange={e => setValue(e.target.value)} />
          <span className="text-center">to</span>
          <Input value={value} onChange={e => setValue(e.target.value)} />
        </div>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="flex justify-between -mb-2">
        <Button className="text-sm">Reset</Button>
        <Button className="primary text-sm">Apply</Button>
      </div>
    </Card>
  );
}
