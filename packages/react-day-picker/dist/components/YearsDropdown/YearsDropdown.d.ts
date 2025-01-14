import { MonthChangeEventHandler } from '../../types/EventHandlers';
/**
 * The props for the [[YearsDropdown]] component.
 */
export interface YearsDropdownProps {
    /** The month where the drop-down is displayed. */
    displayMonth: Date;
    /** Callback to handle the `change` event. */
    onChange: MonthChangeEventHandler;
}
/**
 * Render a dropdown to change the year. Take in account the `nav.fromDate` and
 * `toDate` from context.
 */
export declare function YearsDropdown(props: YearsDropdownProps): JSX.Element;
