import { Button } from "@headlessui/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="hidden md:flex md:justify-between border-t border-light-gray bg-dark-gray px-12 py-8 md:-mx-12">
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img src="/assets/icons/logo.svg" className="w-20 h-14" />
            <span className="futura text-[40px] font-bold">PRIMOSOL</span>
          </div>
          <span className="text-gray font-medium">©2024 PrimoSol All Rights Reserved</span>
          <div className="flex items-center gap-5">
            <div className="flex gap-3">
              <Link to="" className="flex justify-center items-center border rounded-md w-7 h-7" target="_blank">
                <img src="/assets/icons/twitter.svg" className="size-5" />
              </Link>
              <Link to="" className="flex justify-center items-center border rounded-md w-7 h-7" target="_blank">
                <img src="/assets/icons/telegram.svg" className="size-5" />
              </Link>
            </div>
            <span className="text-gray text-sm font-medium">Privacy Policy | Term Of Service</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[160px_360px] gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold">Build</span>
          <span className="text-gray font-medium">Discover</span>
          <span className="text-gray font-medium">Monitor</span>
          <span className="text-gray font-medium">Quick Buy And Sell</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold">Subscribe</span>
          <div className="flex border border-light-gray rounded-lg">
            <input className="bg-transparent outline-none mx-2 flex-grow" placeholder="Email Address" />
            <Button className="primary font-bold text-xl">{'->'}</Button>
          </div>
          <span className="text-sm text-gray">Subscribe to our newsletter to receive relevant information on the PRIMOSOL.</span>
        </div>
      </div>
    </footer>
  );
}
