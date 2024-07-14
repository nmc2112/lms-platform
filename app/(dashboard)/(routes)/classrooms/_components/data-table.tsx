"use client"

import * as React from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import ClassroomService from "@/app/admin/services/ClassroomService"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  userId: string
}

interface Classroom {
  id: number;
  subjectName: string;
  totalStudents: number;
  teacherId: number;
  startTime: string;
  endTime: string;
  meetingLink: string;
  hostId?: number;
  description?: string;
  imgUrl?: string;
}


export function DataTable<TData, TValue>({
  columns,
  userId,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [data, setClassrooms] = useState<Classroom[]>([]);
  useEffect(() => {
      async function fetchData() {
          try {
              const classroomResponse = await ClassroomService.getClassroomByStudentId(userId);
              setClassrooms(classroomResponse.data);
              console.log("Data: ", userId, classroomResponse.data)
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      }
      fetchData();
  }, [userId]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    }
  })

  return (
    <div>
        <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter classrooms..."
          value={(table.getColumn("subjectName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("subjectName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
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
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
  )
}
