// Type definitions for date-arithmetic v3.1.0
// Project: https://github.com/jquense/date-math
// Definitions by: Sergii Paryzhskyi <https://github.com/HeeL> and Angus Trau
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

type DateUnit = 'second' | 'minutes' | 'hours' | 'day' | 'week' | 'month' | 'year' | 'decade' | 'century';

/** dateArithmetic Public Instance Methods */
interface dateArithmeticStatic {
    /** Add specified amount of units to a provided date and return new date as a result */
    add(date: Date, num: number, unit: DateUnit): Date;

    /** Subtract specified amount of units from a provided date and return new date as a result */
    subtract(date: Date, num: number, unit: DateUnit): Date;

    /** Find the date at the start of a whole unit and return it as a result */
    startOf(date: Date, unit: DateUnit): Date;

    /** Find the date at the end of the whole unit and return it as a result */
    endOf(date: Date, unit: DateUnit): Date;

    /** Find the earliest of a list of dates */
    min(...dates: Date[]): Date;

    /** Find the latest of a list of dates */
    max(...dates: Date[]): Date;
}

declare module 'date-arithmetic' {
    const dateArithmetic: dateArithmeticStatic;
    export = dateArithmetic;
}
