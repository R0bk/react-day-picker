import { Locale } from 'date-fns';
import { MonthWeek } from './getMonthWeeks';
/** Return the weeks between two dates.  */
export declare function daysToMonthWeeks(fromDate: Date, toDate: Date, options?: {
    locale?: Locale;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}): MonthWeek[];
