"use client";

import { Grip, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Section } from "@prisma/client"
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface SectionsListProps {
    items: Section[];
    onReorder: (updateData: {id: string; position: number}[]) => void;
    onEdit: (id: string) => void
}

export const SectionsList = ({
    items,
    onReorder,
    onEdit
}: SectionsListProps) => {

    const [isMounted, setIsMounted] = useState(false);
    const [sections, setSections] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);
        const updatedSections = items.slice(startIndex, endIndex + 1);

        setSections(items)

        const bulkUpdateData = updatedSections.map((sections) => ({
            id: sections.id,
            position: items.findIndex((item) => item.id === sections.id)
        }))
        
        onReorder(bulkUpdateData);
    }

    if(!isMounted){
        return null;
    }

    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {sections.map((section, index) => (
                            <Draggable
                                key={section.id}
                                draggableId={section.id}
                                index={index}
                            >
                            {(provided) => (
                                <div
                                    className={cn(
                                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                        section.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                    )}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                >
                                <div
                                className={cn(
                                    "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                    section.isPublished && " border-r-sky-200 hover:bg-sky-200"
                                    )}
                                        {...provided.dragHandleProps}
                                >
                                    <Grip
                                        className="h-5 w-5"
                                    />
                                </div>
                                {section.title}
                                <div className="ml-auto pr-2 flex items-center gap-x-2">
                                    {section.isFree && (
                                        <Badge>
                                            Free
                                        </Badge>
                                    )}
                                    <Badge
                                        className={cn(
                                            "bg-slate-500", section.isPublished && "bg-sky-700"
                                        )}
                                    >
                                        {section.isPublished ? "Published" : "Draft"}
                                    </Badge>
                                    <Pencil
                                        onClick={() => onEdit(section.id)}
                                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                    />
                                </div>
                                </div>
                            )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
