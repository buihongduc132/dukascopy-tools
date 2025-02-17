import { instrumentMetaData } from '../config/instruments-metadata';
import { Timeframe } from '../config/timeframes';
import { getUTCDateFromString } from '../utils/date';
import { NormaliseDatesInput } from './types';

function applyDateLimits(date: Date, min: Date, max: Date): Date {
  let adjustedDate: Date;

  if (date < max) {
    adjustedDate = date < min ? min : date;
  } else {
    adjustedDate = max;
  }

  return adjustedDate;
}

export function normaliseDates({
  instrument,
  startDate,
  endDate,
  timeframe,
  utcOffset
}: NormaliseDatesInput): [Date, Date] {
  const [parsedFromDate, parsedToDate] = [startDate, endDate]
    .map(d => getUTCDateFromString(d) || new Date())
    .sort((a, b) => +a - +b);

  const { minStartDate, minStartDateDaily } = instrumentMetaData[instrument];

  const minIsoDate =
    timeframe === Timeframe.d1 || timeframe === Timeframe.mn1 ? minStartDateDaily : minStartDate;

  const minFromIsoDate = `${minIsoDate}:00:00:00.000Z`;

  let minFromDate = new Date(minFromIsoDate);
  let maxToDate = new Date();

  if (utcOffset) {
    parsedFromDate.setUTCMinutes(parsedFromDate.getUTCMinutes() + utcOffset);
    parsedToDate.setUTCMinutes(parsedToDate.getUTCMinutes() + utcOffset);
  }

  let adjustedFromDate = applyDateLimits(parsedFromDate, minFromDate, maxToDate);
  let adjustedToDate = applyDateLimits(parsedToDate, minFromDate, maxToDate);

  return [adjustedFromDate, adjustedToDate];
}
