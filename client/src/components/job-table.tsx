import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { JobApplication, JobStatus } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { ArrowUpDown, Search, Filter, Plus, ChevronDown, Trash2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditableCell } from "./editable-cell";

// Custom styles for badges
const getStatusStyles = (status: JobStatus) => {
  switch (status) {
    case "Applied": return "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300";
    case "Shortlisted": return "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300";
    case "Interview Scheduled": return "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300";
    case "Technical Interview": return "bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300";
    case "Offer Received": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "Rejected": return "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300";
    case "Withdrawn": return "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";
    default: return "bg-slate-100 text-slate-700";
  }
};

interface JobTableProps {
  data: JobApplication[];
  onUpdateJob: (id: string, field: keyof JobApplication, value: any) => void;
  onAddJob: () => void;
  onDeleteJobs: (ids: string[]) => void;
  onExportCSV: () => void;
}

export function JobTable({ data, onUpdateJob, onAddJob, onDeleteJobs, onExportCSV }: JobTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState(10);

  const columns: ColumnDef<JobApplication>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("company")}
          onUpdate={(val) => onUpdateJob(row.original.id, "company", val)}
          className="font-semibold text-base"
        />
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <EditableCell
          value={row.getValue("role")}
          onUpdate={(val) => onUpdateJob(row.original.id, "role", val)}
          className="text-muted-foreground"
        />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 px-2 -ml-2 font-normal text-xs uppercase tracking-wider text-muted-foreground border border-transparent hover:border-input hover:bg-transparent"
              >
                {category}
                <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {["Big Tech", "Startup", "Mid-Tier", "Other"].map((c) => (
                <DropdownMenuItem 
                  key={c}
                  onClick={() => onUpdateJob(row.original.id, "category", c)}
                >
                  {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "dateApplied",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Applied
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <EditableCell
          type="date"
          value={row.getValue("dateApplied")}
          onUpdate={(val) => onUpdateJob(row.original.id, "dateApplied", val)}
          className="text-sm w-[130px]"
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as JobStatus;
        const jobId = row.original.id;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`h-8 px-2 lg:px-3 text-xs font-medium border-0 ring-0 hover:bg-transparent ${getStatusStyles(status)}`}
              >
                {status}
                <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {[
                "Applied", 
                "Shortlisted", 
                "Interview Scheduled", 
                "Technical Interview", 
                "Offer Received", 
                "Rejected", 
                "Withdrawn"
              ].map((s) => (
                <DropdownMenuItem 
                  key={s}
                  onClick={() => onUpdateJob(jobId, "status", s as JobStatus)}
                  className="cursor-pointer"
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    s === status ? "bg-primary" : "bg-transparent"
                  }`} />
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => (
        <EditableCell
          type="textarea"
          value={row.getValue("notes")}
          onUpdate={(val) => onUpdateJob(row.original.id, "notes", val)}
          placeholder="Add notes..."
          className="text-sm text-muted-foreground w-full min-w-[200px]"
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => onDeleteJobs([row.original.id])}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize === -1 ? data.length : pageSize,
      }
    },
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  // Handle "All" pagination
  const handlePageSizeChange = (val: string) => {
    const size = parseInt(val);
    setPageSize(size);
    table.setPageSize(size === -1 ? data.length : size);
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center flex-1 max-w-sm relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter companies..."
            value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("company")?.setFilterValue(event.target.value)
            }
            className="pl-9 bg-white dark:bg-slate-950"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
                onDeleteJobs(selectedIds);
                setRowSelection({});
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedCount})
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm"
            onClick={onExportCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>

          <Button onClick={onAddJob} className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Applied", "Shortlisted", "Interview Scheduled", "Offer Received", "Rejected"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={(table.getColumn("status")?.getFilterValue() as string[])?.includes(status)}
                  onCheckedChange={(checked) => {
                     if (checked) table.getColumn("status")?.setFilterValue(status);
                     else table.getColumn("status")?.setFilterValue(undefined);
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-xl border bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-12">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">Rows per page</p>
          <Select 
            value={pageSize.toString()} 
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
              <SelectItem value="-1">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground mr-4">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
