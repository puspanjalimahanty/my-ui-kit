import React from "react";

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  multiSelect?: boolean; // optional extension
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;
}

type SortState = { key: string | null; direction: "asc" | "desc" | null };

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  multiSelect = true,
  onRowSelect,
  className = "",
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>({ key: null, direction: null });
  const [selectedIndexes, setSelectedIndexes] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    // call back with selected rows when selectedIndexes changes
    onRowSelect?.(Array.from(selectedIndexes).map((i) => data[i]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndexes, data]);

  const toggleSort = (colKey: string) => {
    setSort((s) => {
      if (s.key !== colKey) return { key: colKey, direction: "asc" };
      if (s.direction === "asc") return { key: colKey, direction: "desc" };
      return { key: null, direction: null };
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sort.key) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const index = col.dataIndex;
    const direction = sort.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = a[index];
      const vb = b[index];
      // handle numbers
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * direction;
      // fallback to string compare
      return String(va ?? "").localeCompare(String(vb ?? "")) * direction;
    });
  }, [data, sort, columns]);

  const toggleRow = (idx: number) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      if (multiSelect) {
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
      } else {
        // single select
        if (next.has(idx)) next.clear();
        else { next.clear(); next.add(idx); }
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIndexes((prev) => {
      if (prev.size === data.length) return new Set();
      return new Set(data.map((_, i) => i));
    });
  };

  if (loading) {
    return (
      <div className={`w-full p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={`w-full p-8 text-center text-gray-500 ${className}`}>
        No data to display
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            {selectable && (
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={selectedIndexes.size === data.length}
                  onChange={toggleSelectAll}
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sort.key === col.key && sort.direction;
              return (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width }}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => col.sortable && toggleSort(col.key)}
                      className={`flex items-center gap-2 ${col.sortable ? "cursor-pointer" : ""}`}
                      aria-sort={
                        isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
                      }
                    >
                      <span>{col.title}</span>
                      {col.sortable && (
                        <span className="text-xs text-gray-400">
                          {isSorted ? (sort.direction === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      )}
                    </button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {sortedData.map((row, rowIndex) => {
            const origIndex = data.indexOf(row); // find original index for selection mapping
            const checked = selectedIndexes.has(origIndex);
            return (
              <tr key={rowIndex} className={`${checked ? "bg-indigo-50" : ""}`}>
                {selectable && (
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleRow(origIndex)}
                      aria-checked={checked}
                      aria-label={`Select row ${rowIndex + 1}`}
                    />
                  </td>
                )}

                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-700 align-top">
                    {col.render ? col.render(row[col.dataIndex], row) : String(row[col.dataIndex] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
