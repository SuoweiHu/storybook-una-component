import React from 'react';
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

const lightOnColour = {
    text: 'text-black',
    header: 'bg-white border-anu-primary-700',
    rowHeader: 'bg-white',
    stripes: 'odd:bg-white even:bg-anu-grey-200',
    link: 'text-blue-700',
};

const tableStyles = {
    white: {
        text: 'text-black',
        header: 'bg-anu-grey-100 border-anu-primary-700',
        rowHeader: 'bg-anu-grey-100',
        stripes: 'even:bg-anu-grey-200',
        link: 'text-blue-700',
    },
    tint: lightOnColour,
    grey: lightOnColour,
    black: {
        text: 'text-white',
        header: 'bg-anu-grey-700 border-anu-primary-650',
        rowHeader: 'bg-anu-grey-700',
        stripes: 'odd:bg-anu-grey-650 even:bg-anu-grey-700',
        link: 'text-blue-300',
    },
} as const;

const get_cellContent = (cell: TableCellData, linkStyle: string) => {
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
                <a key={link.href} href={link.href} className={`${linkStyle} underline-offset-2 hover:underline`}>
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
    const styles = tableStyles[background];
    const hasRowHeaders = rows.some((row) => row.header !== undefined);
    const isStriped = variant === 'striped';
    const cellBorder = bordered ? 'border border-anu-grey-400' : '';
    const rowStyle = isStriped
        ? `${styles.stripes} last:border-b last:border-anu-grey-400`
        : 'border-b border-anu-grey-400';

    return (
        <div className="w-full overflow-x-auto">
            <table className={`w-full border-collapse text-left text-base/6.5 font-normal ${styles.text} ${bordered ? 'border border-anu-grey-400' : ''}`}>
                {caption && <caption className="sr-only">{caption}</caption>}

                {columns.length > 0 && (
                    <thead>
                        <tr className={`border-b-3 ${styles.header}`}>
                            {hasRowHeaders && <td className={cellBorder} />}
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    scope="col"
                                    className={`p-4 align-top text-lg/6.75 font-semibold ${cellBorder}`}
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}

                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowStyle}>
                            {row.header !== undefined && (
                                <th
                                    scope="row"
                                    className={`px-4 py-2 align-middle text-lg/6.75 font-semibold ${isStriped ? '' : styles.rowHeader} ${cellBorder}`}
                                >
                                    {row.header}
                                </th>
                            )}
                            {row.cells.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    colSpan={typeof cell === 'string' ? undefined : cell.colSpan}
                                    rowSpan={typeof cell === 'string' ? undefined : cell.rowSpan}
                                    className={`px-4 py-2 align-middle ${cellBorder}`}
                                >
                                    {get_cellContent(cell, styles.link)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
