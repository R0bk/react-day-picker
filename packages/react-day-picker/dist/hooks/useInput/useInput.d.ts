import React from 'react';
import { DayPickerBase } from '../../types/DayPickerBase';
import { DayPickerDefaultProps } from '../../types/DayPickerDefault';
/** The props to attach to the input field when using [[useInput]]. */
export declare type InputHTMLAttributes = Pick<React.InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'onChange' | 'onFocus' | 'value' | 'placeholder'>;
/** The props to attach to the DayPicker component when using [[useInput]]. */
export declare type InputDayPickerProps = Pick<DayPickerDefaultProps, 'fromDate' | 'toDate' | 'locale' | 'month' | 'onDayClick' | 'onMonthChange' | 'selected' | 'today'>;
export interface UseInputOptions extends Pick<DayPickerBase, 'locale' | 'fromDate' | 'toDate' | 'fromMonth' | 'toMonth' | 'fromYear' | 'toYear' | 'today'> {
    /** The initially selected date */
    defaultSelected?: Date;
    /** The format string for formatting the input field. See https://date-fns.org/docs/format for a list of format strings. Default to `PP`. */
    format?: string;
    /** Make the selection required. */
    required?: boolean;
}
/** Represent the value returned by [[useInput]]. */
export interface UseInput {
    /** The props to pass to a DayPicker component. */
    dayPickerProps: InputDayPickerProps;
    /** The props to pass to an input field. */
    inputProps: InputHTMLAttributes;
    /** A function to reset to the initial state. */
    reset: () => void;
    /** A function to set the selected day. */
    setSelected: (day: Date | undefined) => void;
}
/** Return props and setters for binding an input field to DayPicker. */
export declare function useInput(options?: UseInputOptions): UseInput;
