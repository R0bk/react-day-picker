/** Represent the props of the [[Caption]] component. */
export interface CaptionProps {
    /** The ID for the heading element. Must be the same as the labelled-by in Table. */
    id?: string;
    /** The month where the caption is displayed. */
    displayMonth: Date;
}
/**
 * The layout of the caption:
 *
 * - `dropdown`: display dropdowns for choosing the month and the year.
 * - `buttons`: display previous month / next month buttons.
 */
export declare type CaptionLayout = 'dropdown' | 'buttons';
/**
 * Render the caption of a month, which includes title and navigation buttons.
 * The caption has a different layout when setting the [[DayPickerProps.captionLayout]] prop.
 */
export declare function Caption(props: CaptionProps): JSX.Element;
