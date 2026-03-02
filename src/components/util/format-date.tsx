import React, { FC } from "react";
import dayjs from "dayjs";

interface IDateProps {
  date: string;
  inputFormat?: string;
  outputFormat?: string;
}

export const FormatDate: FC<IDateProps> = ({
  date,
  inputFormat,
  outputFormat = "hh:mm a, DD MMM YYYY",
}) => {
  if (!date) return null;
  if (!outputFormat) return <>{date}</>;
  return <>{dayjs(date, inputFormat).format(outputFormat)}</>;
};
