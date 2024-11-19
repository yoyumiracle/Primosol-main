import { CheckBadgeIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { ReactNode, useEffect } from "react";

interface MessageProps {
  msg: string | ReactNode;
  closeToast: () => void;
  timeout?: number;
}

export function SuccessMessage({ msg, closeToast, timeout = 3 }: MessageProps) {
  useEffect(() => {
    setTimeout(() => {
      closeToast();
    }, timeout * 1000);
  });
  return (
    <MessageContainer type="success">
      <div className="flex items-center gap-3">
        <CheckBadgeIcon className="size-6" />
        <div>
          <div className="msg__title">Success</div>
          <div className="msg__text">{msg}</div>
        </div>
      </div>
    </MessageContainer>
  );
}

export function WarningMessage({ msg, closeToast, timeout = 3 }: MessageProps) {
  useEffect(() => {
    setTimeout(() => {
      closeToast();
    }, timeout * 1000);
  });
  return (
    <MessageContainer type="warning">
      <div className="flex items-center gap-3">
        <ExclamationTriangleIcon className="size-6" />
        <div>
          <div className="msg__title">Warning</div>
          <div className="msg__text">{msg}</div>
        </div>
      </div>
    </MessageContainer>
  );
}

export function FailedMessage({ msg, closeToast, timeout = 3 }: MessageProps) {
  useEffect(() => {
    setTimeout(() => {
      closeToast();
    }, timeout * 1000);
  });
  return (
    <MessageContainer type="failed">
      <div className="flex items-center gap-3">
        <ExclamationTriangleIcon className="size-6" />
        <div>
          <div className="msg__title">Error</div>
          <div className="msg__text">{msg}</div>
        </div>
      </div>
    </MessageContainer>
  );
}

export function InfoMessage({ msg, closeToast, timeout = 3 }: MessageProps) {
  useEffect(() => {
    setTimeout(() => {
      closeToast();
    }, timeout * 1000);
  });
  return (
    <MessageContainer type="information">
      <div className="flex items-center gap-3">
        <InformationCircleIcon className="size-6" />
        <div>
          <div className="msg__title">Information</div>
          <div className="msg__text">{msg}</div>
        </div>
      </div>
    </MessageContainer>
  );
}

function MessageContainer({ children, type = "success" }: { children: ReactNode; type?: string }) {
  return <div className={`msg__container ${type}`}> {children}</div>;
}
