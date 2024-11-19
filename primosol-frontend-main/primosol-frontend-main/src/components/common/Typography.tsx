import { twMerge } from 'tailwind-merge';
export interface TypographyProps extends React.AllHTMLAttributes<HTMLParagraphElement | HTMLLabelElement> {
  children?: React.ReactNode;
  className?: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8' | 'poppins1' | 'poppins2' | 'poppins3' | 'poppins4' | 'poppins5' | 'poppins6' | 'poppins7' | 'poppins8';
}

export const Typography: React.FC<TypographyProps> = ({ children, className, level, ...rest }) => {
  switch (level) {
    case 'h1':
      return (
        <span {...rest} className={twMerge(className, 'text-[32px] font-bold leading-none xl:text-[39px]')}>
          {children}
        </span>
      );
    case 'h2':
      return (
        <span {...rest} className={twMerge(className, 'text-[26px] font-bold leading-none xl:text-[33px]')}>
          {children}
        </span>
      );
    case 'h3':
      return (
        <span {...rest} className={twMerge(className, 'text-[20px] font-bold leading-none xl:text-[26px]')}>
          {children}
        </span>
      );
    case 'h4':
      return (
        <span {...rest} className={twMerge(className, 'text-[16px] font-bold leading-none xl:text-[22px]')}>
          {children}
        </span>
      );
    case 'h5':
      return (
        <span {...rest} className={twMerge(className, 'text-[15px] font-bold leading-none')}>
          {children}
        </span>
      );
    case 'h6':
      return (
        <span {...rest} className={twMerge(className, 'text-[14px] font-bold leading-none')}>
          {children}
        </span>
      );
    case 'h7':
      return (
        <span {...rest} className={twMerge(className, 'text-[12px] font-bold leading-none')}>
          {children}
        </span>
      );
    case 'h8':
      return (
        <span {...rest} className={twMerge(className, 'text-[10px] font-bold leading-none')}>
          {children}
        </span>
      );
    case 'poppins1':
      return (
        <span {...rest} className={twMerge(className, 'text-[31px] leading-none')}>
          {children}
        </span>
      );
    case 'poppins2':
      return (
        <span {...rest} className={twMerge(className, 'text-[26px] leading-none')}>
          {children}
        </span>
      );
    case 'poppins3':
      return (
        <span {...rest} className={twMerge(className, 'text-[20px] leading-none')}>
          {children}
        </span>
      );
    case 'poppins4':
      return (
        <span {...rest} className={twMerge(className, 'text-[16px] leading-none')}>
          {children}
        </span>
      );
    case 'poppins5':
      return (
        <span {...rest} className={twMerge(className, 'text-[14px] leading-none')}>
          {children}
        </span>
      );
    case 'poppins6':
      return (
        <span {...rest} className={twMerge(className, 'text-[12px] leading-none lg:text-[13px]')}>
          {children}
        </span>
      );
    case 'poppins7':
      return (
        <span {...rest} className={twMerge(className, 'text-[12px] leading-none')}>
          {children}
        </span>
      );
    case 'poppins8':
      return (
        <span {...rest} className={twMerge(className, 'text-[10px] leading-none')}>
          {children}
        </span>
      );
    default:
      break;
  }
};
