'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var dateFns = require('date-fns');
var enUS = require('date-fns/locale/en-US');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var enUS__default = /*#__PURE__*/_interopDefaultLegacy(enUS);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function canUseDOM() {
  return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}

/**
 * React currently throws a warning when using useLayoutEffect on the server. To
 * get around it, we can conditionally useEffect on the server (no-op) and
 * useLayoutEffect in the browser. We occasionally need useLayoutEffect to
 * ensure we don't get a render flash for certain operations, but we may also
 * need affected components to render on the server. One example is when setting
 * a component's descendants to retrieve their index values.
 *
 * Important to note that using this hook as an escape hatch will break the
 * eslint dependency warnings unless you rename the import to `useLayoutEffect`.
 * Use sparingly only when the effect won't effect the rendered HTML to avoid
 * any server/client mismatch.
 *
 * If a useLayoutEffect is needed and the result would create a mismatch, it's
 * likely that the component in question shouldn't be rendered on the server at
 * all, so a better approach would be to lazily render those in a parent
 * component after client-side hydration.
 *
 * https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
 * https://github.com/reduxjs/react-redux/blob/master/src/utils/useIsomorphicLayoutEffect.js
 *
 * @param effect
 * @param deps
 */

var useIsomorphicLayoutEffect = /*#__PURE__*/canUseDOM() ? React.useLayoutEffect : React.useEffect;

/*
 * Welcome to @reach/auto-id!

 * Let's see if we can make sense of why this hook exists and its
 * implementation.
 *
 * Some background:
 *   1. Accessibility APIs rely heavily on element IDs
 *   2. Requiring developers to put IDs on every element in Reach UI is both
 *      cumbersome and error-prone
 *   3. With a component model, we can generate IDs for them!
 *
 * Solution 1: Generate random IDs.
 *
 * This works great as long as you don't server render your app. When React (in
 * the client) tries to reuse the markup from the server, the IDs won't match
 * and React will then recreate the entire DOM tree.
 *
 * Solution 2: Increment an integer
 *
 * This sounds great. Since we're rendering the exact same tree on the server
 * and client, we can increment a counter and get a deterministic result between
 * client and server. Also, JS integers can go up to nine-quadrillion. I'm
 * pretty sure the tab will be closed before an app never needs
 * 10 quadrillion IDs!
 *
 * Problem solved, right?
 *
 * Ah, but there's a catch! React's concurrent rendering makes this approach
 * non-deterministic. While the client and server will end up with the same
 * elements in the end, depending on suspense boundaries (and possibly some user
 * input during the initial render) the incrementing integers won't always match
 * up.
 *
 * Solution 3: Don't use IDs at all on the server; patch after first render.
 *
 * What we've done here is solution 2 with some tricks. With this approach, the
 * ID returned is an empty string on the first render. This way the server and
 * client have the same markup no matter how wild the concurrent rendering may
 * have gotten.
 *
 * After the render, we patch up the components with an incremented ID. This
 * causes a double render on any components with `useId`. Shouldn't be a problem
 * since the components using this hook should be small, and we're only updating
 * the ID attribute on the DOM, nothing big is happening.
 *
 * It doesn't have to be an incremented number, though--we could do generate
 * random strings instead, but incrementing a number is probably the cheapest
 * thing we can do.
 *
 * Additionally, we only do this patchup on the very first client render ever.
 * Any calls to `useId` that happen dynamically in the client will be
 * populated immediately with a value. So, we only get the double render after
 * server hydration and never again, SO BACK OFF ALRIGHT?
 */
var serverHandoffComplete = false;
var id = 0;

var genId = function genId() {
  return ++id;
};
/**
 * useId
 *
 * Autogenerate IDs to facilitate WAI-ARIA and server rendering.
 *
 * Note: The returned ID will initially be `null` and will update after a
 * component mounts. Users may need to supply their own ID if they need
 * consistent values for SSR.
 *
 * @see Docs https://reach.tech/auto-id
 */


function useId(idFromProps) {
  /*
   * If this instance isn't part of the initial render, we don't have to do the
   * double render/patch-up dance. We can just generate the ID and return it.
   */
  var initialId = idFromProps || (serverHandoffComplete ? genId() : null);

  var _React$useState = React.useState(initialId),
      id = _React$useState[0],
      setId = _React$useState[1];

  useIsomorphicLayoutEffect(function () {
    if (id === null) {
      /*
       * Patch the ID after render. We do this in `useLayoutEffect` to avoid any
       * rendering flicker, though it'll make the first render slower (unlikely
       * to matter, but you're welcome to measure your app and let us know if
       * it's a problem).
       */
      setId(genId());
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  React.useEffect(function () {
    if (serverHandoffComplete === false) {
      /*
       * Flag all future uses of `useId` to skip the update dance. This is in
       * `useEffect` because it goes after `useLayoutEffect`, ensuring we don't
       * accidentally bail out of the patch-up dance prematurely.
       */
      serverHandoffComplete = true;
    }
  }, []);
  return id != null ? String(id) : undefined;
}

/**
 * The name of the default CSS classes.
 */
var defaultClassNames = {
    root: 'rdp',
    multiple_months: 'rdp-multiple_months',
    with_weeknumber: 'rdp-with_weeknumber',
    vhidden: 'rdp-vhidden',
    button_reset: 'rdp-button_reset',
    button: 'rdp-button',
    caption: 'rdp-caption',
    caption_start: 'rdp-caption_start',
    caption_end: 'rdp-caption_end',
    caption_between: 'rdp-caption_between',
    caption_label: 'rdp-caption_label',
    caption_dropdowns: 'rdp-caption_dropdowns',
    dropdown: 'rdp-dropdown',
    dropdown_month: 'rdp-dropdown_month',
    dropdown_year: 'rdp-dropdown_year',
    dropdown_icon: 'rdp-dropdown_icon',
    months: 'rdp-months',
    month: 'rdp-month',
    table: 'rdp-table',
    tbody: 'rdp-tbody',
    tfoot: 'rdp-tfoot',
    head: 'rdp-head',
    head_row: 'rdp-head_row',
    head_cell: 'rdp-head_cell',
    nav: 'rdp-nav',
    nav_button: 'rdp-nav_button',
    nav_button_previous: 'rdp-nav_button_previous',
    nav_button_next: 'rdp-nav_button_next',
    nav_icon: 'rdp-nav_icon',
    row: 'rdp-row',
    weeknumber: 'rdp-weeknumber',
    cell: 'rdp-cell',
    day: 'rdp-day',
    day_today: 'rdp-day_today',
    day_outside: 'rdp-day_outside',
    day_selected: 'rdp-day_selected',
    day_disabled: 'rdp-day_disabled',
    day_hidden: 'rdp-day_hidden',
    day_range_start: 'rdp-day_range_start',
    day_range_end: 'rdp-day_range_end',
    day_range_middle: 'rdp-day_range_middle'
};

/**
 * The default formatter for the caption.
 */
function formatCaption(month, options) {
    return dateFns.format(month, 'LLLL y', options);
}

/**
 * The default formatter for the Day button.
 */
function formatDay(day, options) {
    return dateFns.format(day, 'd', options);
}

/**
 * The default formatter for the Month caption.
 */
function formatMonthCaption(month, options) {
    return dateFns.format(month, 'LLLL', options);
}

/**
 * The default formatter for the week number.
 */
function formatWeekNumber(weekNumber) {
    return "".concat(weekNumber);
}

/**
 * The default formatter for the name of the weekday.
 */
function formatWeekdayName(weekday, options) {
    return dateFns.format(weekday, 'cccccc', options);
}

/**
 * The default formatter for the Year caption.
 */
function formatYearCaption(year, options) {
    return dateFns.format(year, 'yyyy', options);
}

var formatters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    formatCaption: formatCaption,
    formatDay: formatDay,
    formatMonthCaption: formatMonthCaption,
    formatWeekNumber: formatWeekNumber,
    formatWeekdayName: formatWeekdayName,
    formatYearCaption: formatYearCaption
});

/**
 * The default ARIA label for the day button.
 */
var labelDay = function (day, activeModifiers, options) {
    return dateFns.format(day, 'do MMMM (EEEE)', options);
};

/**
 * The default ARIA label for the WeekNumber element.
 */
var labelMonthDropdown = function () {
    return 'Month: ';
};

/**
 * The default ARIA label for next month button in navigation
 */
var labelNext = function () {
    return 'Go to next month';
};

/**
 * The default ARIA label for previous month button in navigation
 */
var labelPrevious = function () {
    return 'Go to previous month';
};

/**
 * The default ARIA label for the Weekday element.
 */
var labelWeekday = function (day, options) {
    return dateFns.format(day, 'cccc', options);
};

/**
 * The default ARIA label for the WeekNumber element.
 */
var labelWeekNumber = function (n) {
    return "Week n. ".concat(n);
};

/**
 * The default ARIA label for the WeekNumber element.
 */
var labelYearDropdown = function () {
    return 'Year: ';
};

var labels = /*#__PURE__*/Object.freeze({
    __proto__: null,
    labelDay: labelDay,
    labelMonthDropdown: labelMonthDropdown,
    labelNext: labelNext,
    labelPrevious: labelPrevious,
    labelWeekday: labelWeekday,
    labelWeekNumber: labelWeekNumber,
    labelYearDropdown: labelYearDropdown
});

/**
 * Returns the default values to use in the DayPickerContext, in case they are
 * not passed down with the DayPicker initial props.
 */
function getDefaultContextValue() {
    var captionLayout = 'buttons';
    var classNames = defaultClassNames;
    var locale = enUS__default["default"];
    var modifiersClassNames = {};
    var modifiers = {};
    var numberOfMonths = 1;
    var styles = {};
    var today = new Date();
    return {
        captionLayout: captionLayout,
        classNames: classNames,
        formatters: formatters,
        labels: labels,
        locale: locale,
        modifiersClassNames: modifiersClassNames,
        modifiers: modifiers,
        numberOfMonths: numberOfMonths,
        styles: styles,
        today: today,
        mode: 'default'
    };
}

/** Return the `fromDate` and `toDate` prop values values parsing the DayPicker props. */
function parseFromToProps(props) {
    var fromYear = props.fromYear, toYear = props.toYear, fromMonth = props.fromMonth, toMonth = props.toMonth;
    var fromDate = props.fromDate, toDate = props.toDate;
    if (fromMonth) {
        fromDate = dateFns.startOfMonth(fromMonth);
    }
    else if (fromYear) {
        fromDate = new Date(fromYear, 0, 1);
    }
    if (toMonth) {
        toDate = dateFns.startOfMonth(toMonth);
    }
    else if (toYear) {
        toDate = new Date(toYear, 11, 31);
    }
    return {
        fromDate: fromDate ? dateFns.startOfDay(fromDate) : undefined,
        toDate: toDate ? dateFns.startOfDay(toDate) : undefined
    };
}

/**
 * The DayPicker Context shares the props passed to DayPicker within internal
 * and custom components. It is used to set the default values and perform
 * one-time calculations required to render the days.
 *
 * Developers may access this context from the [[useDayPicker]] hook when
 * using custom components.
 */
var DayPickerContext = React.createContext(undefined);
/**
 * The provider for the [[DayPickerContext]], assigning the defaults from the
 * initial DayPicker props.
 */
function DayPickerProvider(props) {
    var _a, _b, _c, _d;
    var initialProps = props.initialProps;
    var defaults = getDefaultContextValue();
    var _e = parseFromToProps(initialProps), fromDate = _e.fromDate, toDate = _e.toDate;
    var captionLayout = (_a = initialProps.captionLayout) !== null && _a !== void 0 ? _a : defaults.captionLayout;
    if (captionLayout !== 'buttons' && (!fromDate || !toDate)) {
        captionLayout = 'buttons';
    }
    var value = {
        captionLayout: captionLayout,
        className: initialProps.className,
        classNames: __assign(__assign({}, defaults.classNames), initialProps.classNames),
        components: __assign(__assign({}, defaults.components), initialProps.components),
        defaultMonth: initialProps.defaultMonth,
        dir: initialProps.dir,
        disabled: initialProps.disabled,
        disableNavigation: initialProps.disableNavigation,
        fixedWeeks: initialProps.fixedWeeks,
        footer: initialProps.footer,
        formatters: __assign(__assign({}, defaults.formatters), initialProps.formatters),
        fromDate: fromDate,
        hidden: initialProps.hidden,
        hideHead: initialProps.hideHead,
        initialFocus: initialProps.initialFocus,
        labels: __assign(__assign({}, defaults.labels), initialProps.labels),
        locale: (_b = initialProps.locale) !== null && _b !== void 0 ? _b : defaults.locale,
        mode: initialProps.mode || 'default',
        modifiers: __assign(__assign({}, defaults.modifiers), initialProps.modifiers),
        modifiersClassNames: __assign(__assign({}, defaults.modifiersClassNames), initialProps.modifiersClassNames),
        modifiersStyles: initialProps.modifiersStyles,
        month: initialProps.month,
        numberOfMonths: (_c = initialProps.numberOfMonths) !== null && _c !== void 0 ? _c : defaults.numberOfMonths,
        onDayBlur: initialProps.onDayBlur,
        onDayClick: initialProps.onDayClick,
        onDayFocus: initialProps.onDayFocus,
        onDayKeyDown: initialProps.onDayKeyDown,
        onDayKeyPress: initialProps.onDayKeyPress,
        onDayKeyUp: initialProps.onDayKeyUp,
        onDayMouseEnter: initialProps.onDayMouseEnter,
        onDayMouseLeave: initialProps.onDayMouseLeave,
        onDayTouchCancel: initialProps.onDayTouchCancel,
        onDayTouchEnd: initialProps.onDayTouchEnd,
        onDayTouchMove: initialProps.onDayTouchMove,
        onDayTouchStart: initialProps.onDayTouchStart,
        onMonthChange: initialProps.onMonthChange,
        onNextClick: initialProps.onNextClick,
        onPrevClick: initialProps.onPrevClick,
        onWeekNumberClick: initialProps.onWeekNumberClick,
        pagedNavigation: initialProps.pagedNavigation,
        reverseMonths: initialProps.reverseMonths,
        selected: initialProps.selected,
        showOutsideDays: initialProps.showOutsideDays,
        showWeekNumber: initialProps.showWeekNumber,
        style: initialProps.style,
        styles: __assign(__assign({}, defaults.styles), initialProps.styles),
        toDate: toDate,
        today: (_d = initialProps.today) !== null && _d !== void 0 ? _d : defaults.today
    };
    return (React__default["default"].createElement(DayPickerContext.Provider, { value: value }, props.children));
}

/**
 * Hook to access the [[DayPickerContext]].
 *
 * To use this hook make sure to wrap the components with a one
 * [[DayPickerProvider]].
 */
function useDayPicker() {
    var context = React.useContext(DayPickerContext);
    if (!context) {
        throw new Error("useDayPicker must be used within a DayPickerProvider.");
    }
    return context;
}

/** Render the caption for the displayed month. This component is used when `captionLayout="buttons"`. */
function CaptionLabel(props) {
    var _a = useDayPicker(), locale = _a.locale, classNames = _a.classNames, styles = _a.styles, formatCaption = _a.formatters.formatCaption;
    return (React__default["default"].createElement("h2", { className: classNames.caption_label, style: styles.caption_label, "aria-live": "polite", "aria-atomic": "true", id: props.id }, formatCaption(props.displayMonth, { locale: locale })));
}

/**
 * Render the icon in the styled drop-down.
 */
function IconDropdown(props) {
    return (React__default["default"].createElement("svg", __assign({ width: "8px", height: "8px", viewBox: "0 0 120 120", "data-testid": "iconDropdown" }, props),
        React__default["default"].createElement("path", { d: "M4.22182541,48.2218254 C8.44222828,44.0014225 15.2388494,43.9273804 19.5496459,47.9996989 L19.7781746,48.2218254 L60,88.443 L100.221825,48.2218254 C104.442228,44.0014225 111.238849,43.9273804 115.549646,47.9996989 L115.778175,48.2218254 C119.998577,52.4422283 120.07262,59.2388494 116.000301,63.5496459 L115.778175,63.7781746 L67.7781746,111.778175 C63.5577717,115.998577 56.7611506,116.07262 52.4503541,112.000301 L52.2218254,111.778175 L4.22182541,63.7781746 C-0.0739418023,59.4824074 -0.0739418023,52.5175926 4.22182541,48.2218254 Z", fill: "currentColor", fillRule: "nonzero" })));
}

/**
 * Render a styled select component – displaying a caption and a custom
 * drop-down icon.
 */
function Dropdown(props) {
    var _a, _b;
    var onChange = props.onChange, value = props.value, children = props.children, caption = props.caption, className = props.className, style = props.style;
    var dayPicker = useDayPicker();
    var IconDropdownComponent = (_b = (_a = dayPicker.components) === null || _a === void 0 ? void 0 : _a.IconDropdown) !== null && _b !== void 0 ? _b : IconDropdown;
    return (React__default["default"].createElement("div", { className: className, style: style },
        React__default["default"].createElement("span", { className: dayPicker.classNames.vhidden }, props['aria-label']),
        React__default["default"].createElement("select", { "aria-label": props['aria-label'], className: dayPicker.classNames.dropdown, style: dayPicker.styles.dropdown, value: value, onChange: onChange }, children),
        React__default["default"].createElement("div", { className: dayPicker.classNames.caption_label, style: dayPicker.styles.caption_label, "aria-hidden": "true" },
            caption,
            React__default["default"].createElement(IconDropdownComponent, { className: dayPicker.classNames.dropdown_icon, style: dayPicker.styles.dropdown_icon }))));
}

/** Render the dropdown to navigate between months. */
function MonthsDropdown(props) {
    var _a;
    var _b = useDayPicker(), fromDate = _b.fromDate, toDate = _b.toDate, styles = _b.styles, locale = _b.locale, formatMonthCaption = _b.formatters.formatMonthCaption, classNames = _b.classNames, components = _b.components, labelMonthDropdown = _b.labels.labelMonthDropdown;
    // Dropdown should appear only when both from/toDate is set
    if (!fromDate)
        return React__default["default"].createElement(React__default["default"].Fragment, null);
    if (!toDate)
        return React__default["default"].createElement(React__default["default"].Fragment, null);
    var dropdownMonths = [];
    if (dateFns.isSameYear(fromDate, toDate)) {
        // only display the months included in the range
        var date = dateFns.startOfMonth(fromDate);
        for (var month = fromDate.getMonth(); month <= toDate.getMonth(); month++) {
            dropdownMonths.push(dateFns.setMonth(date, month));
        }
    }
    else {
        // display all the 12 months
        var date = dateFns.startOfMonth(new Date()); // Any date should be OK, as we just need the year
        for (var month = 0; month <= 11; month++) {
            dropdownMonths.push(dateFns.setMonth(date, month));
        }
    }
    var handleChange = function (e) {
        var selectedMonth = Number(e.target.value);
        var newMonth = dateFns.setMonth(dateFns.startOfMonth(props.displayMonth), selectedMonth);
        props.onChange(newMonth);
    };
    var DropdownComponent = (_a = components === null || components === void 0 ? void 0 : components.Dropdown) !== null && _a !== void 0 ? _a : Dropdown;
    return (React__default["default"].createElement(DropdownComponent, { "aria-label": labelMonthDropdown(), className: classNames.dropdown_month, style: styles.dropdown_month, onChange: handleChange, value: props.displayMonth.getMonth(), caption: formatMonthCaption(props.displayMonth, { locale: locale }) }, dropdownMonths.map(function (m) { return (React__default["default"].createElement("option", { key: m.getMonth(), value: m.getMonth() }, formatMonthCaption(m, { locale: locale }))); })));
}

/**
 * Render the "previous month" button in the navigation.
 */
function IconLeft(props) {
    return (React__default["default"].createElement("svg", __assign({ width: "16px", height: "16px", viewBox: "0 0 120 120" }, props),
        React__default["default"].createElement("path", { d: "M69.490332,3.34314575 C72.6145263,0.218951416 77.6798462,0.218951416 80.8040405,3.34314575 C83.8617626,6.40086786 83.9268205,11.3179931 80.9992143,14.4548388 L80.8040405,14.6568542 L35.461,60 L80.8040405,105.343146 C83.8617626,108.400868 83.9268205,113.317993 80.9992143,116.454839 L80.8040405,116.656854 C77.7463184,119.714576 72.8291931,119.779634 69.6923475,116.852028 L69.490332,116.656854 L18.490332,65.6568542 C15.4326099,62.5991321 15.367552,57.6820069 18.2951583,54.5451612 L18.490332,54.3431458 L69.490332,3.34314575 Z", fill: "currentColor", fillRule: "nonzero" })));
}

/**
 * Render the "next month" button in the navigation.
 */
function IconRight(props) {
    return (React__default["default"].createElement("svg", __assign({ width: "16px", height: "16px", viewBox: "0 0 120 120" }, props),
        React__default["default"].createElement("path", { d: "M49.8040405,3.34314575 C46.6798462,0.218951416 41.6145263,0.218951416 38.490332,3.34314575 C35.4326099,6.40086786 35.367552,11.3179931 38.2951583,14.4548388 L38.490332,14.6568542 L83.8333725,60 L38.490332,105.343146 C35.4326099,108.400868 35.367552,113.317993 38.2951583,116.454839 L38.490332,116.656854 C41.5480541,119.714576 46.4651794,119.779634 49.602025,116.852028 L49.8040405,116.656854 L100.804041,65.6568542 C103.861763,62.5991321 103.926821,57.6820069 100.999214,54.5451612 L100.804041,54.3431458 L49.8040405,3.34314575 Z", fill: "currentColor" })));
}

/**
 * Render a button HTML element applying the reset class name.
 */
var Button = React.forwardRef(function (props, ref) {
    var _a = useDayPicker(), classNames = _a.classNames, styles = _a.styles;
    var classNamesArr = [classNames.button_reset, classNames.button];
    if (props.className) {
        classNamesArr.push(props.className);
    }
    var className = classNamesArr.join(' ');
    var style = __assign(__assign({}, styles.button_reset), styles.button);
    if (props.style) {
        Object.assign(style, props.style);
    }
    return (React__default["default"].createElement("button", __assign({}, props, { ref: ref, type: "button", className: className, style: style })));
});

/** A component rendering the navigation buttons or the drop-downs. */
function Navigation(props) {
    var _a, _b;
    var _c = useDayPicker(), dir = _c.dir, locale = _c.locale, classNames = _c.classNames, styles = _c.styles, _d = _c.labels, labelPrevious = _d.labelPrevious, labelNext = _d.labelNext, components = _c.components;
    if (!props.nextMonth && !props.previousMonth) {
        return React__default["default"].createElement(React__default["default"].Fragment, null);
    }
    var previousLabel = labelPrevious(props.previousMonth, { locale: locale });
    var previousClassName = [
        classNames.nav_button,
        classNames.nav_button_previous
    ].join(' ');
    var nextLabel = labelNext(props.nextMonth, { locale: locale });
    var nextClassName = [
        classNames.nav_button,
        classNames.nav_button_next
    ].join(' ');
    var IconRightComponent = (_a = components === null || components === void 0 ? void 0 : components.IconRight) !== null && _a !== void 0 ? _a : IconRight;
    var IconLeftComponent = (_b = components === null || components === void 0 ? void 0 : components.IconLeft) !== null && _b !== void 0 ? _b : IconLeft;
    return (React__default["default"].createElement("div", { className: classNames.nav, style: styles.nav },
        !props.hidePrevious && (React__default["default"].createElement(Button, { "aria-label": previousLabel, className: previousClassName, style: styles.nav_button_previous, disabled: !props.previousMonth, onClick: props.onPreviousClick }, dir === 'rtl' ? (React__default["default"].createElement(IconRightComponent, { className: classNames.nav_icon, style: styles.nav_icon })) : (React__default["default"].createElement(IconLeftComponent, { className: classNames.nav_icon, style: styles.nav_icon })))),
        !props.hideNext && (React__default["default"].createElement(Button, { "aria-label": nextLabel, className: nextClassName, style: styles.nav_button_next, disabled: !props.nextMonth, onClick: props.onNextClick }, dir === 'rtl' ? (React__default["default"].createElement(IconLeftComponent, { className: classNames.nav_icon, style: styles.nav_icon })) : (React__default["default"].createElement(IconRightComponent, { className: classNames.nav_icon, style: styles.nav_icon }))))));
}

/**
 * Render a dropdown to change the year. Take in account the `nav.fromDate` and
 * `toDate` from context.
 */
function YearsDropdown(props) {
    var _a;
    var displayMonth = props.displayMonth;
    var _b = useDayPicker(), fromDate = _b.fromDate, toDate = _b.toDate, locale = _b.locale, styles = _b.styles, classNames = _b.classNames, components = _b.components, formatYearCaption = _b.formatters.formatYearCaption, labelYearDropdown = _b.labels.labelYearDropdown;
    var years = [];
    // Dropdown should appear only when both from/toDate is set
    if (!fromDate)
        return React__default["default"].createElement(React__default["default"].Fragment, null);
    if (!toDate)
        return React__default["default"].createElement(React__default["default"].Fragment, null);
    var fromYear = fromDate.getFullYear();
    var toYear = toDate.getFullYear();
    for (var year = fromYear; year <= toYear; year++) {
        years.push(dateFns.setYear(dateFns.startOfYear(new Date()), year));
    }
    var handleChange = function (e) {
        var newMonth = dateFns.setYear(dateFns.startOfMonth(displayMonth), Number(e.target.value));
        props.onChange(newMonth);
    };
    var DropdownComponent = (_a = components === null || components === void 0 ? void 0 : components.Dropdown) !== null && _a !== void 0 ? _a : Dropdown;
    return (React__default["default"].createElement(DropdownComponent, { "aria-label": labelYearDropdown(), className: classNames.dropdown_month, style: styles.dropdown_month, onChange: handleChange, value: displayMonth.getFullYear(), caption: formatYearCaption(displayMonth, { locale: locale }) }, years.map(function (year) { return (React__default["default"].createElement("option", { key: year.getFullYear(), value: year.getFullYear() }, formatYearCaption(year, { locale: locale }))); })));
}

/**
 * Helper hook for using controlled/uncontrolled values from a component props.
 *
 * When the value is not controlled, pass `undefined` as `controlledValue` and
 * use the returned setter to update it.
 *
 * When the value is controlled, pass the controlled value as second
 * argument, which will be always returned as `value`.
 */
function useControlledValue(defaultValue, controlledValue) {
    var _a = React.useState(defaultValue), uncontrolledValue = _a[0], setValue = _a[1];
    var value = controlledValue === undefined ? uncontrolledValue : controlledValue;
    return [value, setValue];
}

/** Return the initial month according to the given options. */
function getInitialMonth(context) {
    var month = context.month, defaultMonth = context.defaultMonth, today = context.today;
    var initialMonth = month || defaultMonth || today || new Date();
    var toDate = context.toDate, fromDate = context.fromDate, _a = context.numberOfMonths, numberOfMonths = _a === void 0 ? 1 : _a;
    // Fix the initialMonth if is after the to-date
    if (toDate && dateFns.differenceInCalendarMonths(toDate, initialMonth) < 0) {
        var offset = -1 * (numberOfMonths - 1);
        initialMonth = dateFns.addMonths(toDate, offset);
    }
    // Fix the initialMonth if is before the from-date
    if (fromDate && dateFns.differenceInCalendarMonths(initialMonth, fromDate) < 0) {
        initialMonth = fromDate;
    }
    return dateFns.startOfMonth(initialMonth);
}

/** Controls the navigation state. */
function useNavigationState() {
    var context = useDayPicker();
    var initialMonth = getInitialMonth(context);
    var _a = useControlledValue(initialMonth, context.month), month = _a[0], setMonth = _a[1];
    var goToMonth = function (date) {
        if (context.disableNavigation)
            return;
        setMonth(dateFns.startOfMonth(date));
    };
    return [month, goToMonth];
}

/**
 * Return the months to display in the component according to the number of
 * months and the from/to date.
 */
function getDisplayMonths(month, _a) {
    var reverseMonths = _a.reverseMonths, numberOfMonths = _a.numberOfMonths;
    var start = dateFns.startOfMonth(month);
    var end = dateFns.startOfMonth(dateFns.addMonths(start, numberOfMonths));
    var monthsDiff = dateFns.differenceInCalendarMonths(end, start);
    var months = [];
    for (var i = 0; i < monthsDiff; i++) {
        var nextMonth = dateFns.addMonths(start, i);
        months.push(nextMonth);
    }
    if (reverseMonths)
        months = months.reverse();
    return months;
}

/**
 * Returns the next month the user can navigate to according to the given
 * options.
 *
 * Please note that the next month is not always the next calendar month:
 *
 * - if after the `toDate` range, is undefined;
 * - if the navigation is paged, is the number of months displayed ahead.
 *
 */
function getNextMonth(startingMonth, options) {
    if (options.disableNavigation) {
        return undefined;
    }
    var toDate = options.toDate, pagedNavigation = options.pagedNavigation, _a = options.numberOfMonths, numberOfMonths = _a === void 0 ? 1 : _a;
    var offset = pagedNavigation ? numberOfMonths : 1;
    var month = dateFns.startOfMonth(startingMonth);
    if (!toDate) {
        return dateFns.addMonths(month, offset);
    }
    var monthsDiff = dateFns.differenceInCalendarMonths(toDate, startingMonth);
    if (monthsDiff < numberOfMonths) {
        return undefined;
    }
    // Jump forward as the number of months when paged navigation
    return dateFns.addMonths(month, offset);
}

/**
 * Returns the next previous the user can navigate to, according to the given
 * options.
 *
 * Please note that the previous month is not always the previous calendar
 * month:
 *
 * - if before the `fromDate` date, is `undefined`;
 * - if the navigation is paged, is the number of months displayed before.
 *
 */
function getPreviousMonth(startingMonth, options) {
    if (options.disableNavigation) {
        return undefined;
    }
    var fromDate = options.fromDate, pagedNavigation = options.pagedNavigation, _a = options.numberOfMonths, numberOfMonths = _a === void 0 ? 1 : _a;
    var offset = pagedNavigation ? numberOfMonths : 1;
    var month = dateFns.startOfMonth(startingMonth);
    if (!fromDate) {
        return dateFns.addMonths(month, -offset);
    }
    var monthsDiff = dateFns.differenceInCalendarMonths(month, fromDate);
    if (monthsDiff <= 0) {
        return undefined;
    }
    // Jump back as the number of months when paged navigation
    return dateFns.addMonths(month, -offset);
}

/**
 * The Navigation context shares details about the months being navigated in DayPicker.
 *
 * Access this context from the [[useNavigation]] hook.
 */
var NavigationContext = React.createContext(undefined);
/** Provides the values for the [[NavigationContext]]. */
function NavigationProvider(props) {
    var dayPicker = useDayPicker();
    var _a = useNavigationState(), currentMonth = _a[0], goToMonth = _a[1];
    var displayMonths = getDisplayMonths(currentMonth, dayPicker);
    var nextMonth = getNextMonth(currentMonth, dayPicker);
    var previousMonth = getPreviousMonth(currentMonth, dayPicker);
    var isDateDisplayed = function (date) {
        return displayMonths.some(function (displayMonth) {
            return dateFns.isSameMonth(date, displayMonth);
        });
    };
    var goToDate = function (date, refDate) {
        if (isDateDisplayed(date)) {
            return;
        }
        if (refDate && dateFns.isBefore(date, refDate)) {
            goToMonth(dateFns.addMonths(date, 1 + dayPicker.numberOfMonths * -1));
        }
        else {
            goToMonth(date);
        }
    };
    var value = {
        currentMonth: currentMonth,
        displayMonths: displayMonths,
        goToMonth: goToMonth,
        goToDate: goToDate,
        previousMonth: previousMonth,
        nextMonth: nextMonth,
        isDateDisplayed: isDateDisplayed
    };
    return (React__default["default"].createElement(NavigationContext.Provider, { value: value }, props.children));
}

/** Hook to access the [[NavigationContext]]. */
function useNavigation() {
    var context = React.useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
}

/**
 * Render the caption of a month, which includes title and navigation buttons.
 * The caption has a different layout when setting the [[DayPickerProps.captionLayout]] prop.
 */
function Caption(props) {
    var _a;
    var _b;
    var _c = useDayPicker(), classNames = _c.classNames, numberOfMonths = _c.numberOfMonths, disableNavigation = _c.disableNavigation, styles = _c.styles, captionLayout = _c.captionLayout, onMonthChange = _c.onMonthChange, dir = _c.dir, components = _c.components;
    var _d = useNavigation(), previousMonth = _d.previousMonth, nextMonth = _d.nextMonth, goToMonth = _d.goToMonth, displayMonths = _d.displayMonths;
    var handlePreviousClick = function () {
        if (!previousMonth)
            return;
        goToMonth(previousMonth);
        onMonthChange === null || onMonthChange === void 0 ? void 0 : onMonthChange(previousMonth);
    };
    var handleNextClick = function () {
        if (!nextMonth)
            return;
        goToMonth(nextMonth);
        onMonthChange === null || onMonthChange === void 0 ? void 0 : onMonthChange(nextMonth);
    };
    var handleMonthChange = function (newMonth) {
        goToMonth(newMonth);
        onMonthChange === null || onMonthChange === void 0 ? void 0 : onMonthChange(newMonth);
    };
    var displayIndex = displayMonths.findIndex(function (month) {
        return dateFns.isSameMonth(props.displayMonth, month);
    });
    var isFirst = displayIndex === 0;
    var isLast = displayIndex === displayMonths.length - 1;
    if (dir === 'rtl') {
        _a = [isFirst, isLast], isLast = _a[0], isFirst = _a[1];
    }
    var hideNext = numberOfMonths > 1 && (isFirst || !isLast);
    var hidePrevious = numberOfMonths > 1 && (isLast || !isFirst);
    var CaptionLabelComponent = (_b = components === null || components === void 0 ? void 0 : components.CaptionLabel) !== null && _b !== void 0 ? _b : CaptionLabel;
    var captionLabel = (React__default["default"].createElement(CaptionLabelComponent, { id: props.id, displayMonth: props.displayMonth }));
    var captionContent;
    if (disableNavigation) {
        captionContent = captionLabel;
    }
    else if (captionLayout === 'dropdown') {
        captionContent = (React__default["default"].createElement("div", { className: classNames.caption_dropdowns, style: styles.caption_dropdowns },
            React__default["default"].createElement("div", { className: classNames.vhidden }, captionLabel),
            React__default["default"].createElement(MonthsDropdown, { onChange: handleMonthChange, displayMonth: props.displayMonth }),
            React__default["default"].createElement(YearsDropdown, { onChange: handleMonthChange, displayMonth: props.displayMonth })));
    }
    else {
        captionContent = (React__default["default"].createElement(React__default["default"].Fragment, null,
            captionLabel,
            React__default["default"].createElement(Navigation, { displayMonth: props.displayMonth, hideNext: hideNext, hidePrevious: hidePrevious, nextMonth: nextMonth, previousMonth: previousMonth, onPreviousClick: handlePreviousClick, onNextClick: handleNextClick })));
    }
    return (React__default["default"].createElement("div", { className: classNames.caption, style: styles.caption }, captionContent));
}

/** Render the Footer component (empty as default).*/
function Footer() {
    var _a = useDayPicker(), footer = _a.footer, styles = _a.styles, tfoot = _a.classNames.tfoot;
    if (!footer)
        return React__default["default"].createElement(React__default["default"].Fragment, null);
    return (React__default["default"].createElement("tfoot", { className: tfoot, style: styles.tfoot },
        React__default["default"].createElement("tr", null,
            React__default["default"].createElement("td", { colSpan: 8 }, footer))));
}

/**
 * Generate a series of 7 days, starting from the week, to use for formatting
 * the weekday names (Monday, Tuesday, etc.).
 */
function getWeekdays(locale) {
    var start = dateFns.startOfWeek(new Date(), { locale: locale });
    var days = [];
    for (var i = 0; i < 7; i++) {
        var day = dateFns.addDays(start, i);
        days.push(day);
    }
    return days;
}

/**
 * Render the Head component - i.e. the table head with the weekday names.
 */
function Head() {
    var _a = useDayPicker(), classNames = _a.classNames, styles = _a.styles, showWeekNumber = _a.showWeekNumber, locale = _a.locale, formatWeekdayName = _a.formatters.formatWeekdayName, labelWeekday = _a.labels.labelWeekday;
    var weekdays = getWeekdays(locale);
    return (React__default["default"].createElement("thead", { style: styles.head, className: classNames.head },
        React__default["default"].createElement("tr", { style: styles.head_row, className: classNames.head_row },
            showWeekNumber && (React__default["default"].createElement("th", { scope: "col", style: styles.head_cell, className: classNames.head_cell })),
            weekdays.map(function (weekday, i) { return (React__default["default"].createElement("th", { key: i, scope: "col", className: classNames.head_cell, style: styles.head_cell },
                React__default["default"].createElement("span", { "aria-hidden": true }, formatWeekdayName(weekday, { locale: locale })),
                React__default["default"].createElement("span", { className: classNames.vhidden }, labelWeekday(weekday, { locale: locale })))); }))));
}

/**
 * Render the content of the day cell.
 */
function DayContent(props) {
    var _a = useDayPicker(), locale = _a.locale, classNames = _a.classNames, styles = _a.styles, labelDay = _a.labels.labelDay, formatDay = _a.formatters.formatDay;
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement("span", { "aria-hidden": "true" }, formatDay(props.date, { locale: locale })),
        React__default["default"].createElement("span", { className: classNames.vhidden, style: styles.vhidden }, labelDay(props.date, props.activeModifiers, { locale: locale }))));
}

/** Returns true when the props are of type [[DayPickerMultiple]]. */
function isDayPickerMultiple(props) {
    return props.mode === 'multiple';
}

/**
 * The SelectMultiple context shares details about the selected days when in
 * multiple selection mode.
 *
 * Access this context from the [[useSelectMultiple]] hook.
 */
var SelectMultipleContext = React.createContext(undefined);
/** Provides the values for the [[SelectMultipleContext]]. */
function SelectMultipleProvider(props) {
    if (!isDayPickerMultiple(props.initialProps)) {
        var emptyContextValue = {
            selected: undefined,
            modifiers: {
                disabled: []
            }
        };
        return (React__default["default"].createElement(SelectMultipleContext.Provider, { value: emptyContextValue }, props.children));
    }
    return (React__default["default"].createElement(SelectMultipleProviderInternal, { initialProps: props.initialProps, children: props.children }));
}
function SelectMultipleProviderInternal(_a) {
    var initialProps = _a.initialProps, children = _a.children;
    var selected = initialProps.selected, min = initialProps.min, max = initialProps.max;
    var onDayClick = function (day, activeModifiers, e) {
        var _a, _b;
        (_a = initialProps.onDayClick) === null || _a === void 0 ? void 0 : _a.call(initialProps, day, activeModifiers, e);
        var isMinSelected = Boolean(activeModifiers.selected && min && (selected === null || selected === void 0 ? void 0 : selected.length) === min);
        if (isMinSelected) {
            return;
        }
        var isMaxSelected = Boolean(!activeModifiers.selected && max && (selected === null || selected === void 0 ? void 0 : selected.length) === max);
        if (isMaxSelected) {
            return;
        }
        var selectedDays = selected ? __spreadArray([], selected, true) : [];
        if (activeModifiers.selected) {
            var index = selectedDays.findIndex(function (selectedDay) {
                return dateFns.isSameDay(day, selectedDay);
            });
            selectedDays.splice(index, 1);
        }
        else {
            selectedDays.push(day);
        }
        (_b = initialProps.onSelect) === null || _b === void 0 ? void 0 : _b.call(initialProps, selectedDays, day, activeModifiers, e);
    };
    var modifiers = {
        disabled: []
    };
    if (selected) {
        modifiers.disabled.push(function (day) {
            var isMaxSelected = max && selected.length > max - 1;
            var isSelected = selected.some(function (selectedDay) {
                return dateFns.isSameDay(selectedDay, day);
            });
            return Boolean(isMaxSelected && !isSelected);
        });
    }
    var contextValue = {
        selected: selected,
        onDayClick: onDayClick,
        modifiers: modifiers
    };
    return (React__default["default"].createElement(SelectMultipleContext.Provider, { value: contextValue }, children));
}

/** Hook to access the [[SelectMultipleContext]]. */
function useSelectMultiple() {
    var context = React.useContext(SelectMultipleContext);
    if (!context) {
        throw new Error('useSelectMultiple must be used within a SelectMultipleProvider');
    }
    return context;
}

/** Returns true when the props are of type [[DayPickerRange]]. */
function isDayPickerRange(props) {
    return props.mode === 'range';
}

/**
 * Add a day to an existing range.
 *
 * The returned range takes in account the `undefined` values and if the added
 * day is already present in the range.
 */
function addToRange(day, range) {
    var _a = range || {}, from = _a.from, to = _a.to;
    if (!from) {
        return { from: day, to: undefined };
    }
    if (!to && dateFns.isSameDay(from, day)) {
        return { from: from, to: day };
    }
    if (!to && dateFns.isBefore(day, from)) {
        return { from: day, to: from };
    }
    if (!to) {
        return { from: from, to: day };
    }
    if (dateFns.isSameDay(to, day) && dateFns.isSameDay(from, day)) {
        return undefined;
    }
    if (dateFns.isSameDay(to, day)) {
        return { from: to, to: undefined };
    }
    if (dateFns.isSameDay(from, day)) {
        return undefined;
    }
    if (dateFns.isAfter(from, day)) {
        return { from: day, to: to };
    }
    return { from: from, to: day };
}

/**
 * The SelectRange context shares details about the selected days when in
 * range selection mode.
 *
 * Access this context from the [[useSelectRange]] hook.
 */
var SelectRangeContext = React.createContext(undefined);
/** Provides the values for the [[SelectRangeProvider]]. */
function SelectRangeProvider(props) {
    if (!isDayPickerRange(props.initialProps)) {
        var emptyContextValue = {
            selected: undefined,
            modifiers: {
                range_start: [],
                range_end: [],
                range_middle: [],
                disabled: []
            }
        };
        return (React__default["default"].createElement(SelectRangeContext.Provider, { value: emptyContextValue }, props.children));
    }
    return (React__default["default"].createElement(SelectRangeProviderInternal, { initialProps: props.initialProps, children: props.children }));
}
function SelectRangeProviderInternal(_a) {
    var initialProps = _a.initialProps, children = _a.children;
    var selected = initialProps.selected;
    var _b = selected || {}, selectedFrom = _b.from, selectedTo = _b.to;
    var min = initialProps.min;
    var max = initialProps.max;
    var onDayClick = function (day, activeModifiers, e) {
        var _a, _b;
        (_a = initialProps.onDayClick) === null || _a === void 0 ? void 0 : _a.call(initialProps, day, activeModifiers, e);
        var range = addToRange(day, selected);
        if ((min || max) &&
            selected &&
            (range === null || range === void 0 ? void 0 : range.to) &&
            range.from &&
            range.from !== range.to) {
            var diff = Math.abs(dateFns.differenceInCalendarDays(range === null || range === void 0 ? void 0 : range.to, range === null || range === void 0 ? void 0 : range.from));
            if ((min && diff < min) || (max && diff >= max)) {
                return;
            }
        }
        (_b = initialProps.onSelect) === null || _b === void 0 ? void 0 : _b.call(initialProps, range, day, activeModifiers, e);
    };
    var modifiers = {
        range_start: [],
        range_end: [],
        range_middle: [],
        disabled: []
    };
    if (selectedFrom) {
        modifiers.range_start = [selectedFrom];
        if (!selectedTo) {
            modifiers.range_end = [selectedFrom];
        }
        else {
            modifiers.range_end = [selectedTo];
            modifiers.range_middle = [
                {
                    after: selectedFrom,
                    before: selectedTo
                }
            ];
        }
    }
    if (min && selectedFrom && selectedTo) {
        modifiers.disabled.push(function (date) {
            return ((dateFns.isBefore(date, selectedFrom) &&
                dateFns.differenceInCalendarDays(selectedFrom, date) < min) ||
                (dateFns.isAfter(date, selectedTo) &&
                    dateFns.differenceInCalendarDays(date, selectedFrom) < min));
        });
    }
    if (max && selectedFrom && selectedTo) {
        modifiers.disabled.push(function (date) {
            return ((dateFns.isBefore(date, selectedFrom) &&
                dateFns.differenceInCalendarDays(selectedTo, date) >= max) ||
                (dateFns.isAfter(date, selectedTo) &&
                    dateFns.differenceInCalendarDays(date, selectedFrom) >= max));
        });
    }
    return (React__default["default"].createElement(SelectRangeContext.Provider, { value: { selected: selected, onDayClick: onDayClick, modifiers: modifiers } }, children));
}

/** Hook to access the [[SelectRangeContext]]. */
function useSelectRange() {
    var context = React.useContext(SelectRangeContext);
    if (!context) {
        throw new Error('useSelectRange must be used within a SelectRangeProvider');
    }
    return context;
}

/** Normalize to array a matcher input. */
function matcherToArray(matcher) {
    if (Array.isArray(matcher)) {
        return matcher;
    }
    else if (matcher !== undefined) {
        return [matcher];
    }
    else {
        return [];
    }
}

/** Create CustomModifiers from dayModifiers */
function getCustomModifiers(dayModifiers) {
    var customModifiers = {};
    Object.entries(dayModifiers).forEach(function (_a) {
        var modifier = _a[0], matcher = _a[1];
        customModifiers[modifier] = matcherToArray(matcher);
    });
    return customModifiers;
}

/** The name of the modifiers that are used internally by DayPicker. */
exports.InternalModifier = void 0;
(function (InternalModifier) {
    InternalModifier["Outside"] = "outside";
    /** Name of the modifier applied to the disabled days, using the `disabled` prop. */
    InternalModifier["Disabled"] = "disabled";
    /** Name of the modifier applied to the selected days using the `selected` prop). */
    InternalModifier["Selected"] = "selected";
    /** Name of the modifier applied to the hidden days using the `hidden` prop). */
    InternalModifier["Hidden"] = "hidden";
    /** Name of the modifier applied to the day specified using the `today` prop). */
    InternalModifier["Today"] = "today";
    /** The modifier applied to the day starting a selected range, when in range selection mode.  */
    InternalModifier["RangeStart"] = "range_start";
    /** The modifier applied to the day ending a selected range, when in range selection mode.  */
    InternalModifier["RangeEnd"] = "range_end";
    /** The modifier applied to the days between the start and the end of a selected range, when in range selection mode.  */
    InternalModifier["RangeMiddle"] = "range_middle";
})(exports.InternalModifier || (exports.InternalModifier = {}));

var Selected = exports.InternalModifier.Selected, Disabled = exports.InternalModifier.Disabled, Hidden = exports.InternalModifier.Hidden, Today = exports.InternalModifier.Today, RangeEnd = exports.InternalModifier.RangeEnd, RangeMiddle = exports.InternalModifier.RangeMiddle, RangeStart = exports.InternalModifier.RangeStart, Outside = exports.InternalModifier.Outside;
/** Return the [[InternalModifiers]] from the DayPicker and select contexts. */
function getInternalModifiers(dayPicker, selectMultiple, selectRange) {
    var _a;
    var internalModifiers = (_a = {},
        _a[Selected] = matcherToArray(dayPicker.selected),
        _a[Disabled] = matcherToArray(dayPicker.disabled),
        _a[Hidden] = matcherToArray(dayPicker.hidden),
        _a[Today] = [dayPicker.today],
        _a[RangeEnd] = [],
        _a[RangeMiddle] = [],
        _a[RangeStart] = [],
        _a[Outside] = [],
        _a);
    if (dayPicker.fromDate) {
        internalModifiers[Disabled].push({ before: dayPicker.fromDate });
    }
    if (dayPicker.toDate) {
        internalModifiers[Disabled].push({ after: dayPicker.toDate });
    }
    if (isDayPickerMultiple(dayPicker)) {
        internalModifiers[Disabled] = internalModifiers[Disabled].concat(selectMultiple.modifiers[Disabled]);
    }
    else if (isDayPickerRange(dayPicker)) {
        internalModifiers[Disabled] = internalModifiers[Disabled].concat(selectRange.modifiers[Disabled]);
        internalModifiers[RangeStart] = selectRange.modifiers[RangeStart];
        internalModifiers[RangeMiddle] = selectRange.modifiers[RangeMiddle];
        internalModifiers[RangeEnd] = selectRange.modifiers[RangeEnd];
    }
    return internalModifiers;
}

/** The Modifiers context store the modifiers used in DayPicker. To access the value of this context, use [[useModifiers]]. */
var ModifiersContext = React.createContext(undefined);
/** Provide the value for the [[ModifiersContext]]. */
function ModifiersProvider(props) {
    var dayPicker = useDayPicker();
    var selectMultiple = useSelectMultiple();
    var selectRange = useSelectRange();
    var internalModifiers = getInternalModifiers(dayPicker, selectMultiple, selectRange);
    var customModifiers = getCustomModifiers(dayPicker.modifiers);
    var modifiers = __assign(__assign({}, internalModifiers), customModifiers);
    return (React__default["default"].createElement(ModifiersContext.Provider, { value: modifiers }, props.children));
}

/**
 * Return the modifiers used by DayPicker.
 *
 * Requires to be wrapped into [[ModifiersProvider]]. */
function useModifiers() {
    var context = React.useContext(ModifiersContext);
    if (!context) {
        throw new Error('useModifiers must be used within a ModifiersProvider');
    }
    return context;
}

/** Returns true if `matcher` is of type [[DateInterval]]. */
function isDateInterval(matcher) {
    return Boolean(matcher &&
        typeof matcher === 'object' &&
        'before' in matcher &&
        'after' in matcher);
}
/** Returns true if `value` is a [[DateRange]] type. */
function isDateRange(value) {
    // TODO: Check if dates?!
    return Boolean(value && typeof value === 'object' && 'from' in value);
}
/** Returns true if `value` is of type [[DateAfter]]. */
function isDateAfterType(value) {
    return Boolean(value && typeof value === 'object' && 'after' in value);
}
/** Returns true if `value` is of type [[DateBefore]]. */
function isDateBeforeType(value) {
    return Boolean(value && typeof value === 'object' && 'before' in value);
}
/** Returns true if `value` is a [[DayOfWeek]] type. */
function isDayOfWeekType(value) {
    return Boolean(value && typeof value === 'object' && 'dayOfWeek' in value);
}

/** Return `true` whether `date` is inside `range`. */
function isDateInRange(date, range) {
    var _a;
    var from = range.from, to = range.to;
    if (!from) {
        return false;
    }
    if (!to && dateFns.isSameDay(from, date)) {
        return true;
    }
    if (!to) {
        return false;
    }
    var isToBeforeFrom = dateFns.differenceInCalendarDays(to, from) < 0;
    if (to && isToBeforeFrom) {
        _a = [to, from], from = _a[0], to = _a[1];
    }
    return (dateFns.differenceInCalendarDays(date, from) >= 0 &&
        dateFns.differenceInCalendarDays(to, date) >= 0);
}

/** Returns true if `value` is a Date type. */
function isDateType(value) {
    return dateFns.isDate(value);
}
/** Returns true if `value` is an array of valid dates. */
function isArrayOfDates(value) {
    return Array.isArray(value) && value.every(dateFns.isDate);
}
/**
 * Returns whether a day matches against at least one of the given Matchers.
 *
 * ```
 * const day = new Date(2022, 5, 19);
 * const matcher1: DateRange = {
 *    from: new Date(2021, 12, 21),
 *    to: new Date(2021, 12, 30)
 * }
 * const matcher2: DateRange = {
 *    from: new Date(2022, 5, 1),
 *    to: new Date(2022, 5, 23)
 * }
 *
 * const isMatch(day, [matcher1, matcher2]); // true, since day is in the matcher1 range.
 * ```
 * */
function isMatch(day, matchers) {
    return matchers.some(function (matcher) {
        if (typeof matcher === 'boolean') {
            return matcher;
        }
        if (isDateType(matcher)) {
            return dateFns.isSameDay(day, matcher);
        }
        if (isArrayOfDates(matcher)) {
            return matcher.includes(day);
        }
        if (isDateRange(matcher)) {
            return isDateInRange(day, matcher);
        }
        if (isDayOfWeekType(matcher)) {
            return matcher.dayOfWeek.includes(day.getDay());
        }
        if (isDateInterval(matcher)) {
            var isBefore = dateFns.differenceInCalendarDays(matcher.before, day) > 0;
            var isAfter = dateFns.differenceInCalendarDays(day, matcher.after) > 0;
            return isBefore && isAfter;
        }
        if (isDateAfterType(matcher)) {
            return dateFns.differenceInCalendarDays(day, matcher.after) > 0;
        }
        if (isDateBeforeType(matcher)) {
            return dateFns.differenceInCalendarDays(matcher.before, day) > 0;
        }
        if (typeof matcher === 'function') {
            return matcher(day);
        }
        return false;
    });
}

/** Return the active modifiers for the given day. */
function getActiveModifiers(day, 
/** The modifiers to match for the given date. */
modifiers, 
/** The month where the day is displayed, to add the "outside" modifiers.  */
displayMonth) {
    var matchedModifiers = Object.keys(modifiers).reduce(function (result, key) {
        var modifier = modifiers[key];
        if (isMatch(day, modifier)) {
            result.push(key);
        }
        return result;
    }, []);
    var activeModifiers = {};
    matchedModifiers.forEach(function (modifier) { return (activeModifiers[modifier] = true); });
    if (displayMonth && !dateFns.isSameMonth(day, displayMonth)) {
        activeModifiers.outside = true;
    }
    return activeModifiers;
}

/** Returns the day that should be the target of the focus when DayPicker is rendered the first time. */
function getInitialFocusTarget(displayMonths, modifiers) {
    var firstDayInMonth = dateFns.startOfMonth(displayMonths[0]);
    var lastDayInMonth = dateFns.endOfMonth(displayMonths[displayMonths.length - 1]);
    // TODO: cleanup code
    var firstFocusableDay;
    var today;
    var date = firstDayInMonth;
    while (date <= lastDayInMonth) {
        var activeModifiers = getActiveModifiers(date, modifiers);
        var isFocusable = !activeModifiers.disabled && !activeModifiers.hidden;
        if (!isFocusable) {
            date = dateFns.addDays(date, 1);
            continue;
        }
        if (activeModifiers.selected) {
            return date;
        }
        if (activeModifiers.today && !today) {
            today = date;
        }
        if (!firstFocusableDay) {
            firstFocusableDay = date;
        }
        date = dateFns.addDays(date, 1);
    }
    if (today) {
        return today;
    }
    else {
        return firstFocusableDay;
    }
}

/**
 * The Focus context shares details about the focused day for the keyboard
 *
 * Access this context from the [[useFocus]] hook.
 */
var FocusContext = React.createContext(undefined);
/** The provider for the [[FocusContext]]. */
function FocusProvider(props) {
    var navigation = useNavigation();
    var modifiers = useModifiers();
    var _a = React.useState(), focusedDay = _a[0], setFocusedDay = _a[1];
    var _b = React.useState(), lastFocused = _b[0], setLastFocused = _b[1];
    var initialFocusTarget = getInitialFocusTarget(navigation.displayMonths, modifiers);
    // TODO: cleanup and test obscure code below
    var focusTarget = (focusedDay !== null && focusedDay !== void 0 ? focusedDay : (lastFocused && navigation.isDateDisplayed(lastFocused)))
        ? lastFocused
        : initialFocusTarget;
    var blur = function () {
        setLastFocused(focusedDay);
        setFocusedDay(undefined);
    };
    var focus = function (date) {
        setFocusedDay(date);
    };
    var focusDayBefore = function () {
        if (!focusedDay)
            return;
        var before = dateFns.addDays(focusedDay, -1);
        focus(before);
        navigation.goToDate(before, focusedDay);
    };
    var focusDayAfter = function () {
        if (!focusedDay)
            return;
        var after = dateFns.addDays(focusedDay, 1);
        focus(after);
        navigation.goToDate(after, focusedDay);
    };
    var focusWeekBefore = function () {
        if (!focusedDay)
            return;
        var up = dateFns.addWeeks(focusedDay, -1);
        focus(up);
        navigation.goToDate(up, focusedDay);
    };
    var focusWeekAfter = function () {
        if (!focusedDay)
            return;
        var down = dateFns.addWeeks(focusedDay, 1);
        focus(down);
        navigation.goToDate(down, focusedDay);
    };
    var focusStartOfWeek = function () {
        if (!focusedDay)
            return;
        var dayToFocus = dateFns.startOfWeek(focusedDay);
        navigation.goToDate(dayToFocus, focusedDay);
        focus(dayToFocus);
    };
    var focusEndOfWeek = function () {
        if (!focusedDay)
            return;
        var dayToFocus = dateFns.endOfWeek(focusedDay);
        navigation.goToDate(dayToFocus, focusedDay);
        focus(dayToFocus);
    };
    var focusMonthBefore = function () {
        if (!focusedDay)
            return;
        var monthBefore = dateFns.addMonths(focusedDay, -1);
        navigation.goToDate(monthBefore, focusedDay);
        focus(monthBefore);
    };
    var focusMonthAfter = function () {
        if (!focusedDay)
            return;
        var monthAfter = dateFns.addMonths(focusedDay, 1);
        navigation.goToDate(monthAfter, focusedDay);
        focus(monthAfter);
    };
    var focusYearBefore = function () {
        if (!focusedDay)
            return;
        var yearBefore = dateFns.addYears(focusedDay, -1);
        navigation.goToDate(yearBefore, focusedDay);
        focus(yearBefore);
    };
    var focusYearAfter = function () {
        if (!focusedDay)
            return;
        var yearAfter = dateFns.addYears(focusedDay, 1);
        navigation.goToDate(yearAfter, focusedDay);
        focus(yearAfter);
    };
    var value = {
        focusedDay: focusedDay,
        focusTarget: focusTarget,
        blur: blur,
        focus: focus,
        focusDayAfter: focusDayAfter,
        focusDayBefore: focusDayBefore,
        focusWeekAfter: focusWeekAfter,
        focusWeekBefore: focusWeekBefore,
        focusMonthBefore: focusMonthBefore,
        focusMonthAfter: focusMonthAfter,
        focusYearBefore: focusYearBefore,
        focusYearAfter: focusYearAfter,
        focusStartOfWeek: focusStartOfWeek,
        focusEndOfWeek: focusEndOfWeek
    };
    return (React__default["default"].createElement(FocusContext.Provider, { value: value }, props.children));
}

/** Hook to access the [[FocusContext]]. */
function useFocusContext() {
    var context = React.useContext(FocusContext);
    if (!context) {
        throw new Error('useFocusContext must be used within a FocusProvider');
    }
    return context;
}

/**
 * Return the active modifiers for the specified day.
 *
 * @param day
 * @param displayMonth The month where the date is displayed. If not the same as
 * `date`, the day is an "outside day".
 */
function useActiveModifiers(day, displayMonth) {
    var modifiers = useModifiers();
    var activeModifiers = getActiveModifiers(day, modifiers, displayMonth);
    return activeModifiers;
}

/** Returns true when the props are of type [[DayPickerSingle]]. */
function isDayPickerSingle(props) {
    return props.mode === 'single';
}

/**
 * The SelectSingle context shares details about the selected days when in
 * single selection mode.
 *
 * Access this context from the [[useSelectSingle]] hook.
 */
var SelectSingleContext = React.createContext(undefined);
/** Provides the values for the [[SelectSingleProvider]]. */
function SelectSingleProvider(props) {
    if (!isDayPickerSingle(props.initialProps)) {
        var emptyContextValue = {
            selected: undefined
        };
        return (React__default["default"].createElement(SelectSingleContext.Provider, { value: emptyContextValue }, props.children));
    }
    return (React__default["default"].createElement(SelectSingleProviderInternal, { initialProps: props.initialProps, children: props.children }));
}
function SelectSingleProviderInternal(_a) {
    var initialProps = _a.initialProps, children = _a.children;
    var onDayClick = function (day, activeModifiers, e) {
        var _a, _b, _c;
        (_a = initialProps.onDayClick) === null || _a === void 0 ? void 0 : _a.call(initialProps, day, activeModifiers, e);
        if (activeModifiers.selected && !initialProps.required) {
            (_b = initialProps.onSelect) === null || _b === void 0 ? void 0 : _b.call(initialProps, undefined, day, activeModifiers, e);
            return;
        }
        (_c = initialProps.onSelect) === null || _c === void 0 ? void 0 : _c.call(initialProps, day, day, activeModifiers, e);
    };
    var contextValue = {
        selected: initialProps.selected,
        onDayClick: onDayClick
    };
    return (React__default["default"].createElement(SelectSingleContext.Provider, { value: contextValue }, children));
}

/** Hook to access the [[SelectSingleContext]]. */
function useSelectSingle() {
    var context = React.useContext(SelectSingleContext);
    if (!context) {
        throw new Error('useSelectSingle must be used within a SelectSingleProvider');
    }
    return context;
}

/**
 * This hook returns details about the content to render in the day cell.
 *
 *
 * When a day cell is rendered in the table, DayPicker can either:
 *
 * - render nothing: when the day is outside the month or has matched the
 *   "hidden" modifier.
 * - render a button when `onDayClick` or a selection mode is set.
 * - render a non-interactive element: when no selection mode is set, the day
 *   cell shouldn’t respond to any interaction. DayPicker should render a `div`
 *   or a `span`.
 *
 * ### Usage
 *
 * Use this hook to customize the behavior of the [[Day]] component. Create a
 * new `Day` component using this hook and pass it to the `components` prop.
 * The source of [[Day]] can be a good starting point.
 *
 */
function useDayEventHandlers(date, activeModifiers) {
    var dayPicker = useDayPicker();
    var single = useSelectSingle();
    var multiple = useSelectMultiple();
    var range = useSelectRange();
    var _a = useFocusContext(), focusDayAfter = _a.focusDayAfter, focusDayBefore = _a.focusDayBefore, focusWeekAfter = _a.focusWeekAfter, focusWeekBefore = _a.focusWeekBefore, blur = _a.blur, focus = _a.focus, focusMonthBefore = _a.focusMonthBefore, focusMonthAfter = _a.focusMonthAfter, focusYearBefore = _a.focusYearBefore, focusYearAfter = _a.focusYearAfter, focusStartOfWeek = _a.focusStartOfWeek, focusEndOfWeek = _a.focusEndOfWeek;
    var onClick = function (e) {
        var _a, _b, _c, _d;
        if (isDayPickerSingle(dayPicker)) {
            (_a = single.onDayClick) === null || _a === void 0 ? void 0 : _a.call(single, date, activeModifiers, e);
        }
        else if (isDayPickerMultiple(dayPicker)) {
            (_b = multiple.onDayClick) === null || _b === void 0 ? void 0 : _b.call(multiple, date, activeModifiers, e);
        }
        else if (isDayPickerRange(dayPicker)) {
            (_c = range.onDayClick) === null || _c === void 0 ? void 0 : _c.call(range, date, activeModifiers, e);
        }
        (_d = dayPicker.onDayClick) === null || _d === void 0 ? void 0 : _d.call(dayPicker, date, activeModifiers, e);
    };
    var onFocus = function (e) {
        var _a;
        focus(date);
        (_a = dayPicker.onDayFocus) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onBlur = function (e) {
        var _a;
        blur();
        (_a = dayPicker.onDayBlur) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onMouseEnter = function (e) {
        var _a;
        (_a = dayPicker.onDayMouseEnter) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onMouseLeave = function (e) {
        var _a;
        (_a = dayPicker.onDayMouseLeave) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onTouchCancel = function (e) {
        var _a;
        (_a = dayPicker.onDayTouchCancel) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onTouchEnd = function (e) {
        var _a;
        (_a = dayPicker.onDayTouchEnd) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onTouchMove = function (e) {
        var _a;
        (_a = dayPicker.onDayTouchMove) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onTouchStart = function (e) {
        var _a;
        (_a = dayPicker.onDayTouchStart) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onKeyUp = function (e) {
        var _a;
        (_a = dayPicker.onDayKeyUp) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var onKeyDown = function (e) {
        var _a;
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                e.stopPropagation();
                dayPicker.dir === 'rtl' ? focusDayAfter() : focusDayBefore();
                break;
            case 'ArrowRight':
                e.preventDefault();
                e.stopPropagation();
                dayPicker.dir === 'rtl' ? focusDayBefore() : focusDayAfter();
                break;
            case 'ArrowDown':
                e.preventDefault();
                e.stopPropagation();
                focusWeekAfter();
                break;
            case 'ArrowUp':
                e.preventDefault();
                e.stopPropagation();
                focusWeekBefore();
                break;
            case 'PageUp':
                e.preventDefault();
                e.stopPropagation();
                e.shiftKey ? focusYearBefore() : focusMonthBefore();
                break;
            case 'PageDown':
                e.preventDefault();
                e.stopPropagation();
                e.shiftKey ? focusYearAfter() : focusMonthAfter();
                break;
            case 'Home':
                e.preventDefault();
                e.stopPropagation();
                focusStartOfWeek();
                break;
            case 'End':
                e.preventDefault();
                e.stopPropagation();
                focusEndOfWeek();
                break;
        }
        (_a = dayPicker.onDayKeyDown) === null || _a === void 0 ? void 0 : _a.call(dayPicker, date, activeModifiers, e);
    };
    var eventHandlers = {
        onClick: onClick,
        onFocus: onFocus,
        onBlur: onBlur,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onTouchCancel: onTouchCancel,
        onTouchEnd: onTouchEnd,
        onTouchMove: onTouchMove,
        onTouchStart: onTouchStart
    };
    return eventHandlers;
}

/**
 * Return the current selected days when DayPicker is in selection mode.
 *
 * Days selected by the custom selection mode are not returned.
 */
function useSelectedDays() {
    var dayPicker = useDayPicker();
    var single = useSelectSingle();
    var multiple = useSelectMultiple();
    var range = useSelectRange();
    var selectedDays = isDayPickerSingle(dayPicker)
        ? single.selected
        : isDayPickerMultiple(dayPicker)
            ? multiple.selected
            : isDayPickerRange(dayPicker)
                ? range.selected
                : undefined;
    return selectedDays;
}

function isInternalModifier(modifier) {
    return Object.values(exports.InternalModifier).includes(modifier);
}
/**
 * Return the class names for the Day element, according to the given active
 * modifiers.
 *
 * Custom class names are set via `modifiersClassNames` or `classNames`,
 * where the first have the precedence.
 */
function getDayClassNames(dayPicker, activeModifiers) {
    var classNames = [dayPicker.classNames.day];
    Object.keys(activeModifiers).forEach(function (modifier) {
        var customClassName = dayPicker.modifiersClassNames[modifier];
        if (customClassName) {
            classNames.push(customClassName);
        }
        else if (isInternalModifier(modifier)) {
            var internalClassName = dayPicker.classNames["day_".concat(modifier)];
            if (internalClassName) {
                classNames.push(internalClassName);
            }
        }
    });
    return classNames;
}

/** Return the style for the Day element, according to the given active modifiers. */
function getDayStyle(dayPicker, activeModifiers) {
    var style = __assign({}, dayPicker.styles.day);
    Object.keys(activeModifiers).forEach(function (modifier) {
        var _a;
        style = __assign(__assign({}, style), (_a = dayPicker.modifiersStyles) === null || _a === void 0 ? void 0 : _a[modifier]);
    });
    return style;
}

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
function useDayRender(day, displayMonth, buttonRef) {
    var _a;
    var _b, _c;
    var dayPicker = useDayPicker();
    var focusContext = useFocusContext();
    var activeModifiers = useActiveModifiers(day, displayMonth);
    var eventHandlers = useDayEventHandlers(day, activeModifiers);
    var selectedDays = useSelectedDays();
    var isButton = Boolean(dayPicker.onDayClick || dayPicker.mode !== 'default');
    // Focus the button if the day is focused according to the focus context
    React.useEffect(function () {
        var _a;
        if (!focusContext.focusedDay)
            return;
        if (!isButton)
            return;
        if (dateFns.isSameDay(focusContext.focusedDay, day)) {
            (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [focusContext.focusedDay, day, buttonRef, isButton]);
    var className = getDayClassNames(dayPicker, activeModifiers).join(' ');
    var style = getDayStyle(dayPicker, activeModifiers);
    var isHidden = Boolean((activeModifiers.outside && !dayPicker.showOutsideDays) ||
        activeModifiers.hidden);
    var DayContentComponent = (_c = (_b = dayPicker.components) === null || _b === void 0 ? void 0 : _b.DayContent) !== null && _c !== void 0 ? _c : DayContent;
    var children = (React__default["default"].createElement(DayContentComponent, { date: day, displayMonth: displayMonth, activeModifiers: activeModifiers }));
    var divProps = {
        style: style,
        className: className,
        children: children
    };
    var isFocusTarget = Boolean(focusContext.focusTarget && dateFns.isSameDay(focusContext.focusTarget, day));
    var buttonProps = __assign(__assign(__assign({}, divProps), (_a = { disabled: activeModifiers.disabled }, _a['aria-pressed'] = activeModifiers.selected, _a.tabIndex = isFocusTarget ? 0 : -1, _a)), eventHandlers);
    var dayRender = {
        isButton: isButton,
        isHidden: isHidden,
        activeModifiers: activeModifiers,
        selectedDays: selectedDays,
        buttonProps: buttonProps,
        divProps: divProps
    };
    return dayRender;
}

/**
 * The content of a day cell – as a button or span element according to its
 * modifiers.
 */
function Day(props) {
    var buttonRef = React.useRef(null);
    var dayRender = useDayRender(props.date, props.displayMonth, buttonRef);
    if (dayRender.isHidden) {
        return React__default["default"].createElement(React__default["default"].Fragment, null);
    }
    if (!dayRender.isButton) {
        return React__default["default"].createElement("div", __assign({}, dayRender.divProps));
    }
    return React__default["default"].createElement(Button, __assign({ ref: buttonRef }, dayRender.buttonProps));
}

/**
 * Render the week number element. If `onWeekNumberClick` is passed to DayPicker, it
 * renders a button, otherwise a span element.
 */
function WeekNumber(props) {
    var weekNumber = props.number, dates = props.dates;
    var _a = useDayPicker(), onWeekNumberClick = _a.onWeekNumberClick, styles = _a.styles, classNames = _a.classNames, locale = _a.locale, labelWeekNumber = _a.labels.labelWeekNumber, formatWeekNumber = _a.formatters.formatWeekNumber;
    var content = formatWeekNumber(Number(weekNumber), { locale: locale });
    if (!onWeekNumberClick) {
        return (React__default["default"].createElement("span", { className: classNames.weeknumber, style: styles.weeknumber }, content));
    }
    var label = labelWeekNumber(Number(weekNumber), { locale: locale });
    var handleClick = function (e) {
        onWeekNumberClick(weekNumber, dates, e);
    };
    return (React__default["default"].createElement(Button, { "aria-label": label, className: classNames.weeknumber, style: styles.weeknumber, onClick: handleClick }, content));
}

/** Render a row in the calendar, with the days and the week number. */
function Row(props) {
    var _a, _b;
    var _c = useDayPicker(), styles = _c.styles, classNames = _c.classNames, showWeekNumber = _c.showWeekNumber, components = _c.components;
    var DayComponent = (_a = components === null || components === void 0 ? void 0 : components.Day) !== null && _a !== void 0 ? _a : Day;
    var WeeknumberComponent = (_b = components === null || components === void 0 ? void 0 : components.WeekNumber) !== null && _b !== void 0 ? _b : WeekNumber;
    var weekNumberCell;
    if (showWeekNumber) {
        weekNumberCell = (React__default["default"].createElement("td", { className: classNames.cell, style: styles.cell },
            React__default["default"].createElement(WeeknumberComponent, { number: props.weekNumber, dates: props.dates })));
    }
    return (React__default["default"].createElement("tr", { className: classNames.row, style: styles.row },
        weekNumberCell,
        props.dates.map(function (date) { return (React__default["default"].createElement("td", { className: classNames.cell, style: styles.cell, key: dateFns.getUnixTime(date) },
            React__default["default"].createElement(DayComponent, { displayMonth: props.displayMonth, date: date }))); })));
}

/** Return the weeks between two dates.  */
function daysToMonthWeeks(fromDate, toDate, options) {
    var toWeek = dateFns.endOfWeek(toDate, options);
    var fromWeek = dateFns.startOfWeek(fromDate, options);
    var nOfDays = dateFns.differenceInCalendarDays(toWeek, fromWeek);
    var days = [];
    for (var i = 0; i <= nOfDays; i++) {
        days.push(dateFns.addDays(fromWeek, i));
    }
    var weeksInMonth = days.reduce(function (result, date) {
        var weekNumber = dateFns.getWeek(date, options);
        var existingWeek = result.find(function (value) { return value.weekNumber === weekNumber; });
        if (existingWeek) {
            existingWeek.dates.push(date);
            return result;
        }
        result.push({
            weekNumber: weekNumber,
            dates: [date]
        });
        return result;
    }, []);
    return weeksInMonth;
}

/**
 * Return the weeks belonging to the given month, adding the "outside days" to
 * the first and last week.
 */
function getMonthWeeks(
/** The month to get the weeks from */
month, options) {
    var weeksInMonth = daysToMonthWeeks(dateFns.startOfMonth(month), dateFns.endOfMonth(month), options);
    // Add extra weeks to the month, up to 6 weeks
    if (options === null || options === void 0 ? void 0 : options.useFixedWeeks) {
        var nrOfMonthWeeks = dateFns.getWeeksInMonth(month, options);
        if (nrOfMonthWeeks < 6) {
            var lastWeek = weeksInMonth[weeksInMonth.length - 1];
            var lastDate = lastWeek.dates[lastWeek.dates.length - 1];
            var toDate = dateFns.addWeeks(lastDate, 6 - nrOfMonthWeeks);
            var extraWeeks = daysToMonthWeeks(dateFns.addWeeks(lastDate, 1), toDate, options);
            weeksInMonth.push.apply(weeksInMonth, extraWeeks);
        }
    }
    return weeksInMonth;
}

/** Render the table with the calendar. */
function Table(props) {
    var _a, _b, _c;
    var _d = useDayPicker(), locale = _d.locale, classNames = _d.classNames, styles = _d.styles, hideHead = _d.hideHead, fixedWeeks = _d.fixedWeeks, components = _d.components;
    var weeks = getMonthWeeks(props.displayMonth, {
        useFixedWeeks: Boolean(fixedWeeks),
        locale: locale
    });
    var HeadComponent = (_a = components === null || components === void 0 ? void 0 : components.Head) !== null && _a !== void 0 ? _a : Head;
    var RowComponent = (_b = components === null || components === void 0 ? void 0 : components.Row) !== null && _b !== void 0 ? _b : Row;
    var FooterComponent = (_c = components === null || components === void 0 ? void 0 : components.Footer) !== null && _c !== void 0 ? _c : Footer;
    return (React__default["default"].createElement("table", { className: classNames.table, style: styles.table, role: "grid", "aria-labelledby": props['aria-labelledby'] },
        !hideHead && React__default["default"].createElement(HeadComponent, null),
        React__default["default"].createElement("tbody", { className: classNames.tbody, style: styles.tbody }, weeks.map(function (week) { return (React__default["default"].createElement(RowComponent, { displayMonth: props.displayMonth, key: week.weekNumber, dates: week.dates, weekNumber: week.weekNumber })); })),
        React__default["default"].createElement(FooterComponent, null)));
}

/** Render a month. */
function Month(props) {
    var _a;
    var _b, _c;
    var dayPicker = useDayPicker();
    var dir = dayPicker.dir, classNames = dayPicker.classNames, styles = dayPicker.styles, components = dayPicker.components;
    var displayMonths = useNavigation().displayMonths;
    var captionId = useId();
    var className = [classNames.month];
    var style = styles.month;
    var isStart = props.displayIndex === 0;
    var isEnd = props.displayIndex === displayMonths.length - 1;
    var isCenter = !isStart && !isEnd;
    if (dir === 'rtl') {
        _a = [isStart, isEnd], isEnd = _a[0], isStart = _a[1];
    }
    if (isStart) {
        className.push(classNames.caption_start);
        style = __assign(__assign({}, style), styles.caption_start);
    }
    if (isEnd) {
        className.push(classNames.caption_end);
        style = __assign(__assign({}, style), styles.caption_end);
    }
    if (isCenter) {
        className.push(classNames.caption_between);
        style = __assign(__assign({}, style), styles.caption_between);
    }
    var CaptionComponent = (_b = components === null || components === void 0 ? void 0 : components.Caption) !== null && _b !== void 0 ? _b : Caption;
    var TableComponent = (_c = components === null || components === void 0 ? void 0 : components.Table) !== null && _c !== void 0 ? _c : Table;
    return (React__default["default"].createElement("div", { key: props.displayIndex, className: className.join(' '), style: style },
        React__default["default"].createElement(CaptionComponent, { id: captionId, displayMonth: props.displayMonth }),
        React__default["default"].createElement(TableComponent, { "aria-labelledby": captionId, displayMonth: props.displayMonth })));
}

/** Render the container with the months according to the number of months to display. */
function Root() {
    var _a;
    var dayPicker = useDayPicker();
    var focusContext = useFocusContext();
    var navigation = useNavigation();
    var _b = React.useState(false), hasInitialFocus = _b[0], setHasInitialFocus = _b[1];
    // Focus the focus target when initialFocus is passed in
    React.useEffect(function () {
        if (!dayPicker.initialFocus)
            return;
        if (!focusContext.focusTarget)
            return;
        if (hasInitialFocus)
            return;
        focusContext.focus(focusContext.focusTarget);
        setHasInitialFocus(true);
    }, [
        dayPicker.initialFocus,
        hasInitialFocus,
        focusContext.focus,
        focusContext.focusTarget,
        focusContext
    ]);
    // Apply classnames according to props
    var classNames = [(_a = dayPicker.className) !== null && _a !== void 0 ? _a : dayPicker.classNames.root];
    if (dayPicker.numberOfMonths > 1) {
        classNames.push(dayPicker.classNames.multiple_months);
    }
    if (dayPicker.showWeekNumber) {
        classNames.push(dayPicker.classNames.with_weeknumber);
    }
    var style = __assign(__assign({}, dayPicker.styles.root), dayPicker.style);
    return (React__default["default"].createElement("div", { className: classNames.join(' '), style: style, dir: dayPicker.dir },
        React__default["default"].createElement("div", { className: dayPicker.classNames.months, style: dayPicker.styles.months }, navigation.displayMonths.map(function (month, i) { return (React__default["default"].createElement(Month, { key: i, displayIndex: i, displayMonth: month })); }))));
}

/** Provide the value for all the context providers. */
function RootProvider(props) {
    var children = props.children, initialProps = __rest(props, ["children"]);
    return (React__default["default"].createElement(DayPickerProvider, { initialProps: initialProps },
        React__default["default"].createElement(NavigationProvider, null,
            React__default["default"].createElement(SelectSingleProvider, { initialProps: initialProps },
                React__default["default"].createElement(SelectMultipleProvider, { initialProps: initialProps },
                    React__default["default"].createElement(SelectRangeProvider, { initialProps: initialProps },
                        React__default["default"].createElement(ModifiersProvider, null,
                            React__default["default"].createElement(FocusProvider, null, children))))))));
}

function DayPicker(props) {
    return (React__default["default"].createElement(RootProvider, __assign({}, props),
        React__default["default"].createElement(Root, null)));
}

/** @private */
function isValidDate(day) {
    return !isNaN(day.getTime());
}

/** Return props and setters for binding an input field to DayPicker. */
function useInput(options) {
    if (options === void 0) { options = {}; }
    var _a = options.locale, locale = _a === void 0 ? enUS__default["default"] : _a, required = options.required, _b = options.format, format = _b === void 0 ? 'PP' : _b, defaultSelected = options.defaultSelected, _c = options.today, today = _c === void 0 ? new Date() : _c;
    var _d = parseFromToProps(options), fromDate = _d.fromDate, toDate = _d.toDate;
    // Shortcut to the DateFns functions
    var parseValue = function (value) { return dateFns.parse(value, format, today, { locale: locale }); };
    // Initialize states
    var _e = React.useState(defaultSelected !== null && defaultSelected !== void 0 ? defaultSelected : today), month = _e[0], setMonth = _e[1];
    var _f = React.useState(defaultSelected), selectedDay = _f[0], setSelectedDay = _f[1];
    var defaultInputValue = defaultSelected
        ? dateFns.format(defaultSelected, format, { locale: locale })
        : '';
    var _g = React.useState(defaultInputValue), inputValue = _g[0], setInputValue = _g[1];
    var reset = function () {
        setSelectedDay(defaultSelected);
        setMonth(defaultSelected !== null && defaultSelected !== void 0 ? defaultSelected : today);
        setInputValue(defaultInputValue !== null && defaultInputValue !== void 0 ? defaultInputValue : '');
    };
    var setSelected = function (date) {
        setSelectedDay(date);
        setMonth(date !== null && date !== void 0 ? date : today);
        setInputValue(date ? dateFns.format(date, format, { locale: locale }) : '');
    };
    var handleDayClick = function (day, _a) {
        var selected = _a.selected;
        if (!required && selected) {
            setSelectedDay(undefined);
            setInputValue('');
            return;
        }
        setSelectedDay(day);
        setInputValue(day ? dateFns.format(day, format, { locale: locale }) : '');
    };
    var handleMonthChange = function (month) {
        setMonth(month);
    };
    // When changing the input field, save its value in state and check if the
    // string is a valid date. If it is a valid day, set it as selected and update
    // the calendar’s month.
    var handleChange = function (e) {
        setInputValue(e.target.value);
        var day = parseValue(e.target.value);
        var isBefore = fromDate && dateFns.differenceInCalendarDays(fromDate, day) > 0;
        var isAfter = toDate && dateFns.differenceInCalendarDays(day, toDate) > 0;
        if (!isValidDate(day) || isBefore || isAfter) {
            setSelectedDay(undefined);
            return;
        }
        setSelectedDay(day);
        setMonth(day);
    };
    // Special case for _required_ fields: on blur, if the value of the input is not
    // a valid date, reset the calendar and the input value.
    var handleBlur = function (e) {
        var day = parseValue(e.target.value);
        if (!isValidDate(day)) {
            reset();
        }
    };
    // When focusing, make sure DayPicker visualizes the month of the date in the
    // input field.
    var handleFocus = function (e) {
        if (!e.target.value) {
            reset();
            return;
        }
        var day = parseValue(e.target.value);
        if (isValidDate(day)) {
            setMonth(day);
        }
    };
    var dayPickerProps = {
        month: month,
        onDayClick: handleDayClick,
        onMonthChange: handleMonthChange,
        selected: selectedDay,
        locale: locale,
        fromDate: options === null || options === void 0 ? void 0 : options.fromDate,
        toDate: options === null || options === void 0 ? void 0 : options.toDate,
        today: today
    };
    var inputProps = {
        onBlur: handleBlur,
        onChange: handleChange,
        onFocus: handleFocus,
        value: inputValue,
        placeholder: dateFns.format(new Date(), format, { locale: locale })
    };
    return { dayPickerProps: dayPickerProps, inputProps: inputProps, reset: reset, setSelected: setSelected };
}

/** Returns true when the props are of type [[DayPickerDefault]]. */
function isDayPickerDefault(props) {
    return props.mode === undefined || props.mode === 'default';
}

exports.Button = Button;
exports.Caption = Caption;
exports.CaptionLabel = CaptionLabel;
exports.Day = Day;
exports.DayContent = DayContent;
exports.DayPicker = DayPicker;
exports.DayPickerContext = DayPickerContext;
exports.DayPickerProvider = DayPickerProvider;
exports.Dropdown = Dropdown;
exports.FocusContext = FocusContext;
exports.FocusProvider = FocusProvider;
exports.Footer = Footer;
exports.Head = Head;
exports.IconDropdown = IconDropdown;
exports.IconLeft = IconLeft;
exports.IconRight = IconRight;
exports.NavigationContext = NavigationContext;
exports.NavigationProvider = NavigationProvider;
exports.RootProvider = RootProvider;
exports.Row = Row;
exports.SelectMultipleContext = SelectMultipleContext;
exports.SelectMultipleProvider = SelectMultipleProvider;
exports.SelectMultipleProviderInternal = SelectMultipleProviderInternal;
exports.SelectRangeContext = SelectRangeContext;
exports.SelectRangeProvider = SelectRangeProvider;
exports.SelectRangeProviderInternal = SelectRangeProviderInternal;
exports.SelectSingleContext = SelectSingleContext;
exports.SelectSingleProvider = SelectSingleProvider;
exports.SelectSingleProviderInternal = SelectSingleProviderInternal;
exports.Table = Table;
exports.WeekNumber = WeekNumber;
exports.getMonthWeeks = getMonthWeeks;
exports.isDateAfterType = isDateAfterType;
exports.isDateBeforeType = isDateBeforeType;
exports.isDateInterval = isDateInterval;
exports.isDateRange = isDateRange;
exports.isDayOfWeekType = isDayOfWeekType;
exports.isDayPickerDefault = isDayPickerDefault;
exports.isDayPickerMultiple = isDayPickerMultiple;
exports.isDayPickerRange = isDayPickerRange;
exports.isDayPickerSingle = isDayPickerSingle;
exports.isMatch = isMatch;
exports.useActiveModifiers = useActiveModifiers;
exports.useDayPicker = useDayPicker;
exports.useDayRender = useDayRender;
exports.useFocusContext = useFocusContext;
exports.useInput = useInput;
exports.useNavigation = useNavigation;
exports.useSelectMultiple = useSelectMultiple;
exports.useSelectRange = useSelectRange;
exports.useSelectSingle = useSelectSingle;
//# sourceMappingURL=index.js.map
