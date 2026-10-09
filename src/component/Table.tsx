import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
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
    background?: TableBackground;
    variant?: NonNullable<VariantProps<typeof tableRow>['variant']>;
    // Borders around every cell. Use this whenever cells are merged.
    bordered?: boolean;
};

const tableRoot = cva('w-full border-collapse text-left text-base/6.5 font-normal', {
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
    defaultVariants: {
        background: 'white',
        bordered: false,
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
    defaultVariants: {
        background: 'white',
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
        variant: {
            default: 'border-b border-anu-grey-400',
            striped: 'last:border-b last:border-anu-grey-400',
        },
    },
    compoundVariants: [
        { variant: 'striped', background: 'white', class: 'even:bg-anu-grey-200' },
        { variant: 'striped', background: ['tint', 'grey'], class: 'odd:bg-white even:bg-anu-grey-200' },
        { variant: 'striped', background: 'black', class: 'odd:bg-anu-grey-650 even:bg-anu-grey-700' },
    ],
    defaultVariants: {
        background: 'white',
        variant: 'default',
    },
});

const tableRowHeader = cva('px-4 py-2 align-middle text-lg/6.75 font-semibold', {
    variants: {
        background: {
            white: '',
            tint: '',
            grey: '',
            black: '',
        },
        striped: {
            true: '',
            false: '',
        },
        bordered: {
            true: 'border border-anu-grey-400',
            false: '',
        },
    },
    compoundVariants: [
        { striped: false, background: 'white', class: 'bg-anu-grey-100' },
        { striped: false, background: ['tint', 'grey'], class: 'bg-white' },
        { striped: false, background: 'black', class: 'bg-anu-grey-700' },
    ],
    defaultVariants: {
        background: 'white',
        striped: false,
        bordered: false,
    },
});

const tableCell = cva('', {
    variants: {
        // 'corner' is the empty cell above the row headers.
        type: {
            corner: '',
            column: 'p-4 align-top text-lg/6.75 font-semibold',
            body: 'px-4 py-2 align-middle',
        },
        bordered: {
            true: 'border border-anu-grey-400',
            false: '',
        },
    },
    defaultVariants: {
        type: 'body',
        bordered: false,
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
    defaultVariants: {
        background: 'white',
    },
});

type TableBackground = NonNullable<VariantProps<typeof tableRoot>['background']>;

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
    const isStriped = variant === 'striped';

    return (
        <div className="w-full overflow-x-auto">
            <table className={tableRoot({ background, bordered })}>
                {caption && <caption className="sr-only">{caption}</caption>}

                {columns.length > 0 && (
                    <thead>
                        <tr className={tableHeaderRow({ background })}>
                            {hasRowHeaders && <td className={tableCell({ type: 'corner', bordered })} />}
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    scope="col"
                                    className={tableCell({ type: 'column', bordered })}
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}

                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={tableRow({ background, variant })}>
                            {row.header !== undefined && (
                                <th
                                    scope="row"
                                    className={tableRowHeader({ background, striped: isStriped, bordered })}
                                >
                                    {row.header}
                                </th>
                            )}
                            {row.cells.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    colSpan={typeof cell === 'string' ? undefined : cell.colSpan}
                                    rowSpan={typeof cell === 'string' ? undefined : cell.rowSpan}
                                    className={tableCell({ type: 'body', bordered })}
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
