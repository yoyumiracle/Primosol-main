import { motion } from 'framer-motion';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import React from 'react';
import { copyToClipboard } from '../../libs/utils';
import { toast } from 'react-toastify';

interface CopyContentProps {
  value: string;
  className?: string;
  children: ReactNode;
  copiedContent: ReactNode;
  copiedClassName?: string;
  enabled?: boolean;
  timeout?: number;
}

const CopyContent = React.forwardRef(({ value, className, children, copiedContent, copiedClassName, timeout = 2000, enabled = true }: CopyContentProps, ref) => {
  const [isCopied, setIsCopied] = useState(false);

  const staticCopy = useCallback((text: string) => {
    copyToClipboard(text, () => {
      toast.success("Address copied");
    });
    setIsCopied(true);
  }, []);

  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false);
      }, timeout);

      return () => {
        clearTimeout(hide);
      };
    }
    return undefined;
  }, [isCopied, setIsCopied, timeout]);

  return (
    <div ref={ref as any} onClick={() => staticCopy(value)} className={`relative ${className} ${enabled ? 'cursor-pointer' : 'cursor-default'}`}>
      <motion.div
        initial={false}
        animate={isCopied ? 'show' : 'hidden'}
        variants={{
          show: { opacity: 1 },
          hidden: { opacity: 0 },
        }}
        className={`absolute flex h-full w-full items-center justify-center ${copiedClassName}`}>
        {copiedContent}
      </motion.div>
      <motion.div
        initial={false}
        animate={!isCopied ? 'show' : 'hidden'}
        variants={{
          show: { opacity: 1 },
          hidden: { opacity: 0 },
        }}>
        {children}
      </motion.div>
    </div>
  );
});

export default CopyContent;
