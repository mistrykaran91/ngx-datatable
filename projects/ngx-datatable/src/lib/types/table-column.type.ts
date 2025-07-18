import { PipeTransform, TemplateRef } from '@angular/core';

import { CellContext, HeaderCellContext, Row } from './public.types';

/**
 * Column property that indicates how to retrieve this column's
 * value from a row.
 * 'a.deep.value', 'normalprop', 0 (numeric)
 */
export type TableColumnProp = string | number;

/**
 * Column Type
 */
export interface TableColumn<TRow extends Row = any> {
  /**
   * Determines if column is checkbox
   */
  checkboxable?: boolean;

  /**
   * Determines if the column is frozen to the left
   */
  frozenLeft?: boolean;

  /**
   * Determines if the column is frozen to the right
   */
  frozenRight?: boolean;

  /**
   * The grow factor relative to other columns. Same as the flex-grow
   * API from http =//www.w3.org/TR/css3-flexbox/. Basically;
   * take any available extra width and distribute it proportionally
   * according to all columns' flexGrow values.
   */
  flexGrow?: number;

  /**
   * Min width of the column
   */
  minWidth?: number;

  /**
   * Max width of the column
   */
  maxWidth?: number;

  /**
   * The default width of the column, in pixels
   */
  width?: number;

  /**
   * Can the column be resized
   */
  resizeable?: boolean;

  /**
   * Custom sort comparator
   */
  comparator?: (
    valueA: any,
    valueB: any,
    rowA: TRow,
    rowB: TRow,
    sortDir: 'desc' | 'asc'
  ) => number;

  /**
   * Custom pipe transforms
   */
  pipe?: PipeTransform;

  /**
   * Can the column be sorted
   */
  sortable?: boolean;

  /**
   * Can the column be re-arranged by dragging
   */
  draggable?: boolean;

  /**
   * Whether the column can automatically resize to fill space in the table.
   */
  canAutoResize?: boolean;

  /**
   * Column name or label
   */
  name?: string;

  /**
   * Property to bind to the row. Example:
   *
   * `someField` or `some.field.nested`, 0 (numeric)
   *
   * If left blank, will use the name as camel case conversion
   */
  prop?: TableColumnProp;

  /**
   * By default, the property is bound using normal data binding `<span>{{content}}</span>`.
   * If this property is set to true, the property will be bound as `<span [innerHTML]="content" />`.
   *
   * **DANGER** If enabling this feature, make sure the source of the data is trusted. This can be a vector for HTML injection attacks.
   */
  bindAsUnsafeHtml?: boolean;

  /**
   * Cell template ref
   */
  cellTemplate?: TemplateRef<CellContext<TRow>>;

  /**
   * Ghost Cell template ref
   */
  ghostCellTemplate?: TemplateRef<any>;

  /**
   * Header template ref
   */
  headerTemplate?: TemplateRef<HeaderCellContext>;

  /**
   * Tree toggle template ref
   */
  treeToggleTemplate?: any;

  /**
   * CSS Classes for the cell
   */
  cellClass?:
    | string
    | ((data: {
        row: TRow;
        group?: TRow[];
        column: TableColumn<TRow>;
        value: any;
        rowHeight: number;
      }) => string | Record<string, boolean>);

  /**
   * CSS classes for the header
   */
  headerClass?: string | ((data: { column: TableColumn }) => string | Record<string, boolean>);

  /**
   * Header checkbox enabled
   */
  headerCheckboxable?: boolean;

  /**
   * Is tree displayed on this column
   */
  isTreeColumn?: boolean;

  /**
   * Width of the tree level indent
   */
  treeLevelIndent?: number;

  /**
   * Summary function
   *
   * Null and undefined have different meanings:
   *  - undefined will use the default summary function
   *  - null will not compute a summary
   */
  summaryFunc?: ((cells: any[]) => any) | null;

  /**
   * Summary cell template ref
   */
  summaryTemplate?: TemplateRef<any>;
}
