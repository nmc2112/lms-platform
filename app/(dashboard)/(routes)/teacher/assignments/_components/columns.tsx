"use client"

import { Button } from "@/components/ui/button"
import { Assignment, Course, QuesCategory } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Assignment>[] = [
  {
    accessorKey: "name",
    header: ({column}) => {
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                 Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ) 
    },
  },{
    accessorKey: "classroomSubjectName",
    header: ({column}) => {
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                 Classroosm
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ) 
    },
  },
  {
    accessorKey: "duration",
    header: ({column}) => {
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                 Duration
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ) 
    },
  },
  {
    accessorKey: "numberOfQuestions",
    header: ({column}) => {
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                 Number Of Questions
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ) 
    },
  },
  {
    accessorKey: "quesCategoryName",
    header: ({column}) => {
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                 Question Bank Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ) 
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
        const { id } = row.original;

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-4 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/teacher/assignments/${id}`}>
                    <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2"/> 
                        Show Students Assignments   
                    </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
]
