import { ButtonProps } from '@heroui/react';

export type TButtonProps = ButtonProps & {
  className?: string;
  onClick?: () => void;
};
