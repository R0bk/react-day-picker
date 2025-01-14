import { Locale } from 'date-fns';
import { ActiveModifiers } from '../types/Modifiers';
/** Map of functions to translate ARIA labels for the relative elements. */
export declare type Labels = {
    labelMonthDropdown: () => string;
    labelYearDropdown: () => string;
    labelNext: NavButtonLabel;
    labelPrevious: NavButtonLabel;
    labelDay: DayLabel;
    labelWeekday: WeekdayLabel;
    labelWeekNumber: WeekNumberLabel;
};
/** Return the ARIA label for the [[Day]] component. */
export declare type DayLabel = (day: Date, activeModifiers: ActiveModifiers, options?: {
    locale?: Locale;
}) => string;
/** Return the ARIA label for the "next month" / "prev month" buttons in the navigation.*/
export declare type NavButtonLabel = (month?: Date, options?: {
    locale?: Locale;
}) => string;
/** Return the ARIA label for the Head component.*/
export declare type WeekdayLabel = (day: Date, options?: {
    locale?: Locale;
}) => string;
/** Return the ARIA label of the week number.*/
export declare type WeekNumberLabel = (n: number, options?: {
    locale?: Locale;
}) => string;
