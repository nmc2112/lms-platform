"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Badge, Download } from "lucide-react";
import { Classroom } from "./types";
import axios from "axios";
import ClassroomService from "@/app/admin/services/ClassroomService";

const exportStudentListByClass = async (id: number) => {
  try {
    const response = await ClassroomService.exportStudentListByClass(id)

    // Create a link element and trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `student-list-${id}.xlsx`); // Specify the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading the file', error);
  }
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
    accessorKey: "meetingLink",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Meeting Link
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const meetingLink = row.original.meetingLink;

      return (
        <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Link
        </a>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startTime = new Date(row.original.startTime);
      return (
        <span>
          {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const endTime = new Date(row.original.endTime);
      return (
        <span>
          {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const startDate = new Date(row.original.startTime);
      return <span>{startDate.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const endDate = new Date(row.original.until);
      return <span>{endDate.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "export",
    header: "Export",
    cell: ({ row }) => {
      const classroomId = row.original.id;

      return (
        <Button
          variant="outline"
          className="text-green-600 border-green-600 hover:bg-green-100"
          onClick={() => exportStudentListByClass(classroomId)}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      );
    },
  },
];
