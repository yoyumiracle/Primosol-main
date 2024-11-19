import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type DialogProps = {
  isOpen: boolean;
  className?: string;
  closeModal: () => void;
  title: string;
  children: ReactNode;
  buttonText?: string;
};

function Modal({ isOpen, className, closeModal, title, children, buttonText }: DialogProps) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-dark-gray bg-opacity-50 backdrop-blur-md" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className={`w-full max-w-md p-6 text-left align-middle transition-all transform border rounded-md shadow-xl bg-dark-gray bg-opacity-80 max-md:bg-opacity-100 overflow-visible backdrop-blur-sm border-light-gray ${className}`}
                >
                  <DialogTitle as="h3" className="text-lg font-bold leading-6 text-white">
                    {title}
                  </DialogTitle>

                  <div className="mt-2">{children}</div>

                  {buttonText && (
                    <div className="mt-4">
                      <Button onClick={closeModal} className="w-full primary">
                        {buttonText}
                      </Button>
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Modal;
