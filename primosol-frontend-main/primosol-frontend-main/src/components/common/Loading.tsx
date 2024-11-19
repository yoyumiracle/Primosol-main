import { useContext } from "react";
import AppContext from "../../providers/AppContext";

export default function Loading() {
    const { loading } = useContext(AppContext);

  const modalStyle = loading ? "flex" : "hidden";

  return (
    <div
      className={`fixed inset-0 z-50 ${modalStyle} items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm`}
    >
      <div className="px-6 py-4 rounded-md shadow-lg bg-[#242424]">
        <div className="flex items-center gap-2 text-[16px]">
          <img src="/assets/icons/spin.svg" className="w-8 h-8 animate-spin" />
          {loading && typeof loading === "string" && loading}
        </div>
      </div>
    </div>
  );
}
