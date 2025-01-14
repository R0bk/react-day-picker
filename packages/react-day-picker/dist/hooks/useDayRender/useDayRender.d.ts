import React from 'react';
import { ButtonProps } from '../../components/Button';
import { DayEventHandlers } from '../../hooks/useDayEventHandlers';
import { SelectedDays } from '../../hooks/useSelectedDays';
import { ActiveModifiers } from '../../types/Modifiers';
import { StyledComponent } from '../../types/Styles';
export declare type DayRender = {
    /** Whether the day should be rendered a `button` instead of a `div` */
    isButton: boolean;
    /** Whether the day should be hidden. */
    isHidden: boolean;
    /** The modifiers active for the given day. */
    activeModifiers: ActiveModifiers;
    /** The props to apply to the button element (when `isButton` is true). */
    buttonProps: StyledComponent & Pick<ButtonProps, 'disabled' | 'aria-pressed' | 'tabIndex'> & DayEventHandlers;
    /** The props to apply to the div element (when `isButton` is false). */
    divProps: StyledComponent;
    selectedDays: SelectedDays;
};
/**
 * Return props and data used to render the [[Day]] component.
 *
 * Use this hook when creating a component to replace the built-in `Day`
 * component.
 *
 * Each Day in DayPicker should render one of the following, according to the return
 * value:
 *
 * - an empty `React.Fragment`, to render if `isHidden` is true
 * - a `button` element, when the day is interactive, e.g. is selectable
 * - a `div` element, whe the day is not interactive
 *
 * @param day The date to render
 * @param displayMonth The month where the date is displayed (if not the same as
 * `date`, it means it is an "outside" day)
 * @param buttonRef A ref to the button element that will be target of focus
 * when rendered (if required).
 */
export declare function useDayRender(day: Date, displayMonth: Date, buttonRef: React.RefObject<HTMLButtonElement>): DayRender;
