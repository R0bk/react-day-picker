/**
 * A value or a function that matches a specific day.
 *
 *
 * Matchers are passed to DayPicker via [[DayPickerProps.disabled]],
 * [[DayPickerProps.hidden]] or [[DayPickerProps.selected]] and are used to
 * determine if a day should get a [[Modifier]].
 *
 * Matchers can be of different types:
 *
 * ```
 * // will always match the day
 * const booleanMatcher: Matcher = true;
 *
 *  // will match the today's date
 * const dateMatcher: Matcher = new Date();
 *
 * // will match the days in the array
 * const arrayMatcher: Matcher = [new Date(2019, 1, 2);, new Date(2019, 1, 4)];
 *
 * // will match days after the 2nd of February 2019
 * const afterMatcher: DateAfter = { after: new Date(2019, 1, 2); };
 *  // will match days before the 2nd of February 2019 }
 * const beforeMatcher: DateBefore = { before: : new Date(2019, 1, 2); };
 *
 * // will match Sundays
 * const dayOfWeekMatcher: DayOfWeek = {
 *  dayOfWeek: 0
 * };
 *
 * // will match the included days, except the two dates
 * const intervalMatcher: DateInterval = {
 *    after: new Date(2019, 1, 2);,
 *    before: new Date(2019, 1, 5)
 * };
 *
 * // will match the included days, including the two dates
 * const rangeMatcher: DateRange = {
 *    from: new Date(2019, 1, 2);,
 *    to: new Date(2019, 1, 5)
 * };
 *
 * // will match when the function return true
 * const functionMatcher: Matcher = (day: Date) => {
 *  return (new Date()).getMonth() === 2 // match when month is March
 * };
 * ```
 *
 * @see [[isMatch]]
 *
 * */
export declare type Matcher = boolean | ((date: Date) => boolean) | Date | Date[] | DateRange | DateBefore | DateAfter | DateInterval | DayOfWeek;
/** A matcher to match a day falling after the specified date, with the date not included. */
export declare type DateAfter = {
    after: Date;
};
/** A matcher to match a day falling before the specified date, with the date not included. */
export declare type DateBefore = {
    before: Date;
};
/** A matcher to match a day falling before and after two dates, where the dates are not included. */
export declare type DateInterval = {
    before: Date;
    after: Date;
};
/** A matcher to match a range of dates. The range can be open. Differently from [[DateInterval]], the dates here are included. */
export declare type DateRange = {
    from: Date | undefined;
    to?: Date | undefined;
};
/** A matcher to match a date being one of the specified days of the week (`0-7`, where `0` is Sunday). */
export declare type DayOfWeek = {
    dayOfWeek: number[];
};
/** Returns true if `matcher` is of type [[DateInterval]]. */
export declare function isDateInterval(matcher: unknown): matcher is DateInterval;
/** Returns true if `value` is a [[DateRange]] type. */
export declare function isDateRange(value: unknown): value is DateRange;
/** Returns true if `value` is of type [[DateAfter]]. */
export declare function isDateAfterType(value: unknown): value is DateAfter;
/** Returns true if `value` is of type [[DateBefore]]. */
export declare function isDateBeforeType(value: unknown): value is DateBefore;
/** Returns true if `value` is a [[DayOfWeek]] type. */
export declare function isDayOfWeekType(value: unknown): value is DayOfWeek;
