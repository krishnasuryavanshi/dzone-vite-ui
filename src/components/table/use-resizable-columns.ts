import { useState, useEffect } from 'react';
import { TableProps } from 'antd/lib/table';
import { ResizableTitle } from './resizable-title';

/**
 * Hook to manage resizable columns for tables
 * @param initialColumns - Initial column configuration
 * @param resizable - Whether columns should be resizable
 * @returns Processed columns and table components configuration
 */
export const useResizableColumns = <T>(
  initialColumns: TableProps<T>['columns'],
  resizable: boolean = false,
) => {
  const [tableColumns, setTableColumns] = useState(initialColumns);

  useEffect(() => {
    if (resizable && initialColumns) {
      // Keep existing widths, only add ellipsis for resizable columns
      const columnsWithEllipsis = initialColumns.map((col: any) => ({
        ...col,
        ellipsis: col.ellipsis !== false, // Enable ellipsis by default for resizable columns
      }));
      setTableColumns(columnsWithEllipsis);
    } else {
      setTableColumns(initialColumns);
    }
  }, [initialColumns, resizable]);

  // Handle column resize
  const handleResize = (index: number, width: number) => {
    const newColumns = [...(tableColumns || [])];
    newColumns[index] = {
      ...newColumns[index],
      width,
    };
    setTableColumns(newColumns);
  };

  // Add resize capabilities to columns if resizable is enabled
  const processedColumns = resizable
    ? tableColumns?.map((col: any, index: number) => ({
        ...col,
        onHeaderCell: () => ({
          width: col.width,
          onResize: (width: number) => handleResize(index, width),
        }),
      }))
    : tableColumns;

  // Components configuration for resizable columns
  const components = resizable
    ? {
        header: {
          cell: ResizableTitle,
        },
      }
    : undefined;

  return {
    columns: processedColumns,
    components,
  };
};
