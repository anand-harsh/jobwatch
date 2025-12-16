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
import { useState } from "react";
import { ArrowUpDown, Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// ... (existing imports)

// ... (existing statusColors)

// ... (existing getStatusStyles)

// Custom styles for badges to match the "soft" aesthetic
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
  onUpdateStatus: (id: string, newStatus: JobStatus) => void;
}

export function JobTable({ data, onUpdateStatus }: JobTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<JobApplication>[] = [
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
      cell: ({ row }) => <div className="font-semibold text-base">{row.getValue("company")}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("role")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal text-xs uppercase tracking-wider text-muted-foreground">
          {row.getValue("category")}
        </Badge>
      ),
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
      cell: ({ row }) => <div className="text-sm">{row.getValue("dateApplied")}</div>,
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
                  onClick={() => onUpdateStatus(jobId, s as JobStatus)}
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
    },
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["Applied", "Shortlisted", "Interview Scheduled", "Offer Received", "Rejected"].map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={(table.getColumn("status")?.getFilterValue() as string[])?.includes(status)}
                onCheckedChange={(checked) => {
                   // Simple filter implementation for demo
                   // In a real app we'd likely use a faceted filter component
                   const current = (table.getColumn("status")?.getFilterValue() as string[]) || [];
                   // This is a simplified placeholder for proper array filtering
                   // For now, let's just clear if unchecked or set if checked to show intent
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
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
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

      <div className="flex items-center justify-end space-x-2 py-4">
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
  );
}
