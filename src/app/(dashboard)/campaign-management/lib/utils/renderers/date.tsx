import { FormatDate } from "@/components/util";

export const dateRenderer = (date: string) => {
  if (!date) {
    return null;
  }
  return (
    <FormatDate
      date={date}
      inputFormat="YYYY-MM-DD"
      outputFormat="DD MMM YYYY"
    />
  );
};
