"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// This type is used to define the shape of our data.
export type Classroom = {
    id: number;
    subjectName: string;
    teacherName: string;
    totalStudents: number;
    startTime: string;
    endTime: string;
    meetingLink: string;
    status: number; // Assuming status is a part of Classroom for example purposes
    result?: number; // Assuming result is a part of Classroom for example purposes
};

export const columns: ColumnDef<Classroom>[] = [
    {
        accessorKey: "subjectName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Subject Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "teacherName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Teacher Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    // },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const { id, status } = row.original;

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-4 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     {status === 0 ? (
    //                         <Link href={`/classrooms/${id}`}>
    //                             <DropdownMenuItem>
    //                                 <Pencil className="h-4 w-4 mr-2" />
    //                                 Start your classroom
    //                             </DropdownMenuItem>
    //                         </Link>
    //                     ) : (
    //                         <DropdownMenuItem disabled>
    //                             You have completed the classroom
    //                         </DropdownMenuItem>
    //                     )}
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    }
];
