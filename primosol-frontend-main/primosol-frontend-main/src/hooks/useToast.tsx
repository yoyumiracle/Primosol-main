import { ReactNode, useRef } from "react";
import { Id, toast } from "react-toastify";
import { FailedMessage, InfoMessage, SuccessMessage, WarningMessage } from "../components/common/Notifications";

export function useToast() {
  const toastRef = useRef<Id | undefined>();

  const handleToastClose = () => {
    toast.dismiss(toastRef.current);
  };

  const notifySuccess = (msg: string | ReactNode, timeout = 5) => {
    toastRef.current = toast(<SuccessMessage msg={msg} closeToast={handleToastClose} timeout={timeout} />);
    return handleToastClose;
  };

  const notifyWarning = (msg: string | ReactNode, timeout = 5) => {
    toastRef.current = toast(<WarningMessage msg={msg} closeToast={handleToastClose} timeout={timeout} />);
    return handleToastClose;
  };

  const notifyFailed = (msg: string | ReactNode, timeout = 5) => {
    toastRef.current = toast(<FailedMessage msg={msg} closeToast={handleToastClose} timeout={timeout} />);
    return handleToastClose;
  };

  const notifyInfo = (msg: string | ReactNode, timeout = 5) => {
    toastRef.current = toast(<InfoMessage msg={msg} closeToast={handleToastClose} timeout={timeout} />);
    return handleToastClose;
  };

  return {
    messageApi: {
      notifySuccess,
      notifyFailed,
      notifyWarning,
      notifyInfo,
    },
  };
}

export default useToast;
