import duration from "dayjs/plugin/duration";
import dayjs from "dayjs";

dayjs.extend(duration);

export const getFormattedTimeDuration = (date: Date) => {
  const now = dayjs();
  const minutes = now.diff(date, "minutes");

  if (minutes < 1) {
    return `Just now`;
  }

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours >= 1 && hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `${days} days ago`;
  }
};
