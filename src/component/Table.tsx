import React from 'react';
import { cva } from 'class-variance-authority';
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

type TableBackground = NonNullable<TableProps['background']>;

const table = cva('w-full border-collapse text-left text-base/6.5 font-normal', {
    variants: {
        background: {
            white: 'text-black',
            tint: 'text-black',
            grey: 'text-black',
            black: 'text-white',
        },
        bordered: {
            true: 'border border-anu-grey-400',
            false: '',
        },
    },
});

const tableHeaderRow = cva('border-b-3', {
    variants: {
        background: {
            white: 'bg-anu-grey-100 border-anu-primary-700',
            tint: 'bg-white border-anu-primary-700',
            grey: 'bg-white border-anu-primary-700',
            black: 'bg-anu-grey-700 border-anu-primary-650',
        },
    },
});

const tableRow = cva('', {
    variants: {
        background: {
            white: '',
            tint: '',
            grey: '',
            black: '',
        },
        striped: {
            true: 'last:border-b last:border-anu-grey-400',
            false: 'border-b border-anu-grey-400',
        },
    },
    compoundVariants: [
        { striped: true, background: 'white', className: 'even:bg-anu-grey-200' },
        { striped: true, background: ['tint', 'grey'], className: 'odd:bg-white even:bg-anu-grey-200' },
        { striped: true, background: 'black', className: 'odd:bg-anu-grey-650 even:bg-anu-grey-700' },
    ],
});

const tableCell = cva('', {
    variants: {
        kind: {
            // The empty corner cell above the row headers.
            corner: '',
            columnHeader: 'p-4 align-top text-lg/6.75 font-semibold',
            rowHeader: 'px-4 py-2 align-middle text-lg/6.75 font-semibold',
            data: 'px-4 py-2 align-middle',
        },
        bordered: {
            true: 'border border-anu-grey-400',
            false: '',
        },
    },
});

// Row headers get a solid fill unless stripes already colour the row.
const tableRowHeaderFill = cva('', {
    variants: {
        background: {
            white: 'bg-anu-grey-100',
            tint: 'bg-white',
            grey: 'bg-white',
            black: 'bg-anu-grey-700',
        },
    },
});

const tableLink = cva('underline-offset-2 hover:underline', {
    variants: {
        background: {
            white: 'text-blue-700',
            tint: 'text-blue-700',
            grey: 'text-blue-700',
            black: 'text-blue-300',
        },
    },
});

const get_cellContent = (cell: TableCellData, background: TableBackground) => {
    if (typeof cell === 'string') {
        return cell;
    }
    return (
        <div className="flex flex-col gap-2">
            {cell.text && (
                <span className={cell.subtext ? 'text-lg/6.75 font-semibold tracking-wide' : undefined}>
                    {cell.text}
                </span>
            )}
            {cell.subtext && <span>{cell.subtext}</span>}
            {cell.links?.map((link) => (
                <a key={link.href} href={link.href} className={tableLink({ background })}>
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
    const hasRowHeaders = rows.some((row) => row.header !== undefined);
    const striped = variant === 'striped';

    return (
        <div className="w-full overflow-x-auto">
            <table className={table({ background, bordered })}>
                {caption && <caption className="sr-only">{caption}</caption>}

                {columns.length > 0 && (
                    <thead>
                        <tr className={tableHeaderRow({ background })}>
                            {hasRowHeaders && <td className={tableCell({ kind: 'corner', bordered })} />}
                            {columns.map((column) => (
                                <th key={column} scope="col" className={tableCell({ kind: 'columnHeader', bordered })}>
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}

                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={tableRow({ background, striped })}>
                            {row.header !== undefined && (
                                <th
                                    scope="row"
                                    className={tableCell({
                                        kind: 'rowHeader',
                                        bordered,
                                        className: striped ? undefined : tableRowHeaderFill({ background }),
                                    })}
                                >
                                    {row.header}
                                </th>
                            )}
                            {row.cells.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    colSpan={typeof cell === 'string' ? undefined : cell.colSpan}
                                    rowSpan={typeof cell === 'string' ? undefined : cell.rowSpan}
                                    className={tableCell({ kind: 'data', bordered })}
                                >
                                    {get_cellContent(cell, background)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
