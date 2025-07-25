import { TableColumnProp } from '../types/table-column.type';

// maybe rename this file to prop-getters.ts

export type ValueGetter = (obj: any, prop: TableColumnProp) => any;

/**
 * Always returns the empty string ''
 */
export const emptyStringGetter = (): string => {
  return '';
};

/**
 * Returns the appropriate getter function for this kind of prop.
 * If prop == null, returns the emptyStringGetter.
 */
export const getterForProp = (prop: TableColumnProp | undefined): ValueGetter => {
  // TODO requires better typing which will also involve adjust TableColum. So postponing it.
  if (prop == null) {
    return emptyStringGetter;
  }

  if (typeof prop === 'number') {
    return numericIndexGetter as ValueGetter;
  } else {
    // deep or simple
    if (prop.includes('.')) {
      return deepValueGetter as ValueGetter;
    } else {
      return shallowValueGetter as ValueGetter;
    }
  }
};

/**
 * Returns the value at this numeric index.
 * @param row array of values
 * @param index numeric index
 * @returns any or '' if invalid index
 */
export const numericIndexGetter = (row: any[], index: number): any => {
  if (row == null) {
    return '';
  }
  // mimic behavior of deepValueGetter
  if (!row || index == null) {
    return row;
  }

  const value = row[index];
  if (value == null) {
    return '';
  }
  return value;
};

/**
 * Returns the value of a field.
 * (more efficient than deepValueGetter)
 * @param obj object containing the field
 * @param fieldName field name string
 */
export const shallowValueGetter = (obj: any, fieldName: string): any => {
  if (obj == null) {
    return '';
  }
  if (!obj || !fieldName) {
    return obj;
  }

  const value = obj[fieldName];
  if (value == null) {
    return '';
  }
  return value;
};

/**
 * Returns a deep object given a string. zoo['animal.type']
 */
export const deepValueGetter = (obj: any, path: string): any => {
  if (obj == null) {
    return '';
  }
  if (!obj || !path) {
    return obj;
  }

  // check if path matches a root-level field
  // { "a.b.c": 123 }
  let current = obj[path];
  if (current !== undefined) {
    return current;
  }

  current = obj;
  const splits = path.split('.');

  if (splits.length) {
    for (const split of splits) {
      current = current[split];

      // if found undefined, return empty string
      if (current === undefined || current === null) {
        return '';
      }
    }
  }

  return current;
};
