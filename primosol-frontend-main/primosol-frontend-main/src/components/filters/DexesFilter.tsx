import Card from "../common/Card";
import CheckBox from "../common/CheckBox";
import { Button } from "@headlessui/react";

export default function DexesFilter() {
  return (
    <Card
      className={`p-4 w-[320px] flex-col gap-2 text-sm rounded-md`}
    >
      <div className="flex flex-col gap-2">
        <CheckBox> Raydium </CheckBox>
        <CheckBox> Pupm.fun </CheckBox>
        <CheckBox> Moonshot </CheckBox>
        <CheckBox> Orca </CheckBox>
        <CheckBox> Meteora </CheckBox>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="flex justify-between -mb-2">
        <Button className="text-sm">Reset</Button>
        <Button className="primary text-sm">Apply</Button>
      </div>
    </Card>
  );
}
