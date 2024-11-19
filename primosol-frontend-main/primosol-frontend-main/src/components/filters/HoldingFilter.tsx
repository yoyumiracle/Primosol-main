import { IHoldingFilter } from "../../interface";
import Card from "../common/Card";
import CheckBox from "../common/CheckBox";

interface HoldingFilterProps {
  filters: IHoldingFilter;
  setFilters: (newFilters: IHoldingFilter) => void;
}

export default function HoldingFilter({filters, setFilters}: HoldingFilterProps) {

  return (
    <Card
      className={`p-4 w-[320px] flex-col gap-2 text-sm rounded-md`}
    >
      <div className="flex flex-col gap-2">
        <CheckBox 
          initialEnabled={filters.remainToken} 
          onChange={(enabled) => setFilters({...filters, remainToken: enabled})}
        > With remaining tokens </CheckBox>
      </div>
    </Card>
  );
}
