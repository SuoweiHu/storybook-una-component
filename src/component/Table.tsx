import React from 'react';
import { tv } from 'tailwind-variants';
import '../css/tw-global.css';

type TableLink = {
    label: string;
    href: string;
};

type TableCellData =
    | string
    | {
          text?: string;
          // Smaller second line under `text`, which then renders as a sub-heading.
          subtext?: string;
          links?: TableLink[];
          colSpan?: number;
          rowSpan?: number;
      };

type TableRow = {
    // Renders a row header cell at the start of the row.
    header?: string;
    cells: TableCellData[];
};

const table = tv({
    slots: {
        wrapper: 'w-full overflow-x-auto',
        table: 'w-full border-collapse text-left text-base/6.5 font-normal',
        caption: 'sr-only',
        headerRow: 'border-b-3',
        // Empty cell above the row headers.
        corner: '',
        columnHeader: 'p-4 align-top text-lg/6.75 font-semibold',
        row: '',
        rowHeader: 'px-4 py-2 align-middle text-lg/6.75 font-semibold',
        cell: 'px-4 py-2 align-middle',
        cellContent: 'flex flex-col gap-2',
        cellHeading: 'text-lg/6.75 font-semibold tracking-wide',
        link: 'underline-offset-2 hover:underline',
    },
    variants: {
        // The background the table sits on.
        background: {
            white: {
                table: 'text-black',
                headerRow: 'bg-anu-grey-100 border-anu-primary-700',
                link: 'text-blue-700',
            },
            tint: {
                table: 'text-black',
                headerRow: 'bg-white border-anu-primary-700',
                link: 'text-blue-700',
            },
            grey: {
                table: 'text-black',
                headerRow: 'bg-white border-anu-primary-700',
                link: 'text-blue-700',
            },
            black: {
                table: 'text-white',
                headerRow: 'bg-anu-grey-700 border-anu-primary-650',
                link: 'text-blue-300',
            },
        },
        variant: {
            default: { row: 'border-b border-anu-grey-400' },
            striped: { row: 'last:border-b last:border-anu-grey-400' },
        },
        // Borders around every cell. Use this whenever cells are merged.
        bordered: {
            true: {
                table: 'border border-anu-grey-400',
                corner: 'border border-anu-grey-400',
                columnHeader: 'border border-anu-grey-400',
                rowHeader: 'border border-anu-grey-400',
                cell: 'border border-anu-grey-400',
            },
        },
    },
    compoundVariants: [
        // Row headers get a solid fill only when rows aren't striped.
        { variant: 'default', background: 'white', class: { rowHeader: 'bg-anu-grey-100' } },
        { variant: 'default', background: ['tint', 'grey'], class: { rowHeader: 'bg-white' } },
        { variant: 'default', background: 'black', class: { rowHeader: 'bg-anu-grey-700' } },
        { variant: 'striped', background: 'white', class: { row: 'even:bg-anu-grey-200' } },
        { variant: 'striped', background: ['tint', 'grey'], class: { row: 'odd:bg-white even:bg-anu-grey-200' } },
        { variant: 'striped', background: 'black', class: { row: 'odd:bg-anu-grey-650 even:bg-anu-grey-700' } },
    ],
    defaultVariants: {
        background: 'white',
        variant: 'default',
        bordered: false,
    },
});

type TableProps = {
    // Header row along the top. Leave empty for a table with row headers only.
    columns?: string[];
    rows: TableRow[];
    // Describes the table for screen readers; visually hidden.
    caption?: string;
    // The background the table sits on.
    background?: 'white' | 'tint' | 'grey' | 'black';
    variant?: 'default' | 'striped';
    // Borders around every cell. Use this whenever cells are merged.
    bordered?: boolean;
};

const get_cellContent = (cell: TableCellData, styles: ReturnType<typeof table>) => {
    if (typeof cell === 'string') {
        return cell;
    }
    return (
        <div className={styles.cellContent()}>
            {cell.text && <span className={cell.subtext ? styles.cellHeading() : undefined}>{cell.text}</span>}
            {cell.subtext && <span>{cell.subtext}</span>}
            {cell.links?.map((link) => (
                <a key={link.href} href={link.href} className={styles.link()}>
                    {link.label}
                </a>
            ))}
        </div>
    );
};

export const Table: React.FC<TableProps> = ({
    columns = [],
    rows,
    caption,
    background = 'white',
    variant = 'default',
    bordered = false,
}) => {
    const styles = table({ background, variant, bordered });
    const hasRowHeaders = rows.some((row) => row.header !== undefined);

    return (
        <div className={styles.wrapper()}>
            <table className={styles.table()}>
                {caption && <caption className={styles.caption()}>{caption}</caption>}

                {columns.length > 0 && (
                    <thead>
                        <tr className={styles.headerRow()}>
                            {hasRowHeaders && <td className={styles.corner()} />}
                            {columns.map((column) => (
                                <th key={column} scope="col" className={styles.columnHeader()}>
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}

                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={styles.row()}>
                            {row.header !== undefined && (
                                <th scope="row" className={styles.rowHeader()}>
                                    {row.header}
                                </th>
                            )}
                            {row.cells.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    colSpan={typeof cell === 'string' ? undefined : cell.colSpan}
                                    rowSpan={typeof cell === 'string' ? undefined : cell.rowSpan}
                                    className={styles.cell()}
                                >
                                    {get_cellContent(cell, styles)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
