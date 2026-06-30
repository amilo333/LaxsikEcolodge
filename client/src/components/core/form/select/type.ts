export type TSelectOption = {
  id: string;
  label: string;
};

export type TSelectProps = {
  label?: string;
  options: TSelectOption[];
};
