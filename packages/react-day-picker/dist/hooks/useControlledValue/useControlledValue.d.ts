import React from 'react';
export declare type DispatchStateAction<T> = React.Dispatch<React.SetStateAction<T>>;
/**
 * Helper hook for using controlled/uncontrolled values from a component props.
 *
 * When the value is not controlled, pass `undefined` as `controlledValue` and
 * use the returned setter to update it.
 *
 * When the value is controlled, pass the controlled value as second
 * argument, which will be always returned as `value`.
 */
export declare function useControlledValue<T>(defaultValue: T, controlledValue: T | undefined): [T, DispatchStateAction<T>];
