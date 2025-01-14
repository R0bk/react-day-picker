import { Locale } from 'date-fns';
/** Represents a week in the month.*/
export declare type MonthWeek = {
    /** The week number from the start of the year. */
    weekNumber: number;
    /** The dates in the week. */
    dates: Date[];
};
/**
 * Return the weeks belonging to the given month, adding the "outside days" to
 * the first and last week.
 */
export declare function getMonthWeeks(
/** The month to get the weeks from */
month: Date, options: {
    locale: Locale;
    /** Add extra weeks up to 6 weeks */
    useFixedWeeks?: boolean;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}): MonthWeek[];
