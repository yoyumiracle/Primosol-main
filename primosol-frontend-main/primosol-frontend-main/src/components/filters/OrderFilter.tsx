import { IOrderFilter } from "../../interface";
import Card from "../common/Card";
import CheckBox from "../common/CheckBox";

interface OrderFilterProps {
  filters: IOrderFilter;
  setFilters: (newFilters: IOrderFilter) => void;
}

export default function OrderFilter({ filters, setFilters }: OrderFilterProps) {

  return (
    <Card
      className={`p-4 w-[160px] flex-col gap-4 text-sm rounded-md`}
    >
      <div className="flex flex-col gap-4">
        <CheckBox 
          initialEnabled={filters.active} 
          onChange={(enabled) => setFilters({...filters, active:enabled})}
        > Active </CheckBox>
        <CheckBox 
          initialEnabled={filters.success} 
          onChange={(enabled) => setFilters({...filters, success:enabled})}
        > Success </CheckBox>
        <CheckBox 
          initialEnabled={filters.failed} 
          onChange={(enabled) => setFilters({...filters, failed:enabled})}
        > Failed </CheckBox>
      </div>
      <hr className="text-light-gray -mx-4" />
      <div className="flex flex-col gap-4">
        <CheckBox 
          initialEnabled={filters.buyDip} 
          onChange={(enabled) => setFilters({...filters, buyDip:enabled})}
        > Buy Dip </CheckBox>
        <CheckBox 
          initialEnabled={filters.stopLoss} 
          onChange={(enabled) => setFilters({...filters, stopLoss:enabled})}
        > Stop Loss </CheckBox>
        <CheckBox 
          initialEnabled={filters.takeProfit} 
          onChange={(enabled) => setFilters({...filters, takeProfit:enabled})}
        > Take Profit </CheckBox>
      </div>
    </Card>
  );
}
