import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

function UserTable({ userReport = [], onDelete }) {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
      },
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: (tableData) => {
          const user = tableData.row.original;

          return (
            <div className="table-actions">
              <button
                type="button"
                className="edit-btn"
                onClick={() =>
                  navigate(`/add-user?edit=${encodeURIComponent(user.id)}`)
                }
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this user?"
                  );
                  if (confirmed) {
                    onDelete(user.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    [navigate, onDelete] // Fixed accidental '+' symbol here
  );

  const table = useReactTable({
    data: userReport,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, filterValue) => {
      const searchValue = String(filterValue).toLowerCase().trim();

      if (!searchValue) return true;

      const searchableData = [
        row.original.fullName,
        row.original.email,
        row.original.phone,
        row.original.country,
      ];

      return searchableData.some((value) =>
        String(value ?? "").toLowerCase().includes(searchValue)
      );
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  // Zero State: Agar koi users dynamic list mein hain hi nahi
  if (userReport.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👤</div>
        <h3>No users registered yet</h3>
        <p>Start by adding your first user.</p>
        <button
          type="button"
          className="primary-btn"
          onClick={() => navigate("/add-user")}
        >
          + Add Your First User
        </button>
      </div>
    );
  }

  const renderedRows = table.getRowModel().rows;

  return (
    <div className="table-card">
      {/* Header & Search */}
      <div className="table-header">
        <div>
          <h2>User Records</h2>
          <p>
            {userReport.length}{" "}
            {userReport.length === 1 ? "user" : "users"} registered
          </p>
        </div>

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Search users..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder) {
                    return <th key={header.id}></th>;
                  }

                  const canSort = header.column.getCanSort();
                  let sortIcon = "";

                  if (canSort) {
                    const sortState = header.column.getIsSorted();
                    if (sortState === "asc") {
                      sortIcon = " ↑";
                    } else if (sortState === "desc") {
                      sortIcon = " ↓";
                    } else {
                      sortIcon = " ↕";
                    }
                  }

                  return (
                    <th key={header.id}>
                      <div
                        className={canSort ? "sortable-header" : ""}
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="sort-icon">{sortIcon}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {renderedRows.length > 0 ? (
              renderedRows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No users found matching "{globalFilter}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <div className="pagination-info">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          <strong>{table.getPageCount() || 1}</strong>
        </div>

        <div className="pagination-buttons">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ← Previous
          </button>

          <button
            type="button"
            className="pagination-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTable;