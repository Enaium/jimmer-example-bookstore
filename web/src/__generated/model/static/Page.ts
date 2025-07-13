export interface Page<T> {
    rows: Array<T>;
    totalPageCount: number;
    totalRowCount: number;
}
