import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export const getFormattedDate = (xDate: string) => {
  if (!xDate) {
    return 'Invalid string';
  }
  return dayjs(xDate).format('Do MMM, YYYY')
}
