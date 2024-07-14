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
import { useState } from "react"
import QuestionService from "@/app/admin/services/QuestionService"
import Modal from "@/app/admin/class-manage/components/Modal"
import toast from "react-hot-toast"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  userId: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userId
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

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

  const [showModal, setShowModal] = useState(false);

  const importData = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  const getExcelFile = async () => {
    try {
      // Fetch the file from your API
      const response = await QuestionService.downloadTemplate(userId)
  
      // Create a link element and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'question-template.xlsx'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  }

  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]); // Set the selected file into state
  };

  // const onFileUpload = async () => {
  //   try {
  //     const response = await QuestionService.importData(file, userId);
  //     console.log('Upload successful', response.data);
  //   } catch (error) {
  //     console.error('Upload failed', error);
  //   }
  // };
  
  const onFileUpload = async () => {
    try {

      const response = await QuestionService.importData(file, userId);
      if (response.data.success) {
        toast.success('Upload successful');
        console.log('Upload successful', response.data);
        setShowModal(false); // Close modal after successful upload
      } else {
        response.data.error.forEach((error) => {
          toast.error(error);
        });
        console.error('Upload failed', response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Upload failed';
      toast.error(errorMessage);
      console.error('Upload failed', error);
    }
  };

  return (
    <div>
        <div  style={{ display: 'flex', gap: '10px', margin: "20px" }}>
          <Input
            placeholder="Filter categories..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Button onClick={importData}>
              <PlusCircle className="h-4 w-4 mr-2"/> Import Data
          </Button>
          <Link href={"/teacher/quesBanks/create"}>
              <Button>
                  <PlusCircle className="h-4 w-4 mr-2"/> New Category
              </Button>
          </Link>
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
      <Modal show={showModal} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-4">Import Data</h2>
        <p>You can download the template Excel file for importing data.</p>
        <button className="text-blue-500 underline mt-2" onClick={getExcelFile}>Download Question Template</button>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
          Upload File
        </button>
      </Modal>
    </div>
    
  )
}
