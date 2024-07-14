"use client"

import { Layout, Compass, List, BarChart, FileQuestion, BookOpenCheck, Glasses } from "lucide-react";
import {SidebarItem} from "./sidebar-item";
import { usePathname } from "@/node_modules/next/navigation";

const guestRoutes = [
    {
        icon:Layout,
        label: "Your Courses",
        href: "/",
    },
    {
        icon:Compass,
        label: "Browse",
        href: "/search",
    },
    {
        icon:BookOpenCheck,
        label: "Assignment",
        href: "/assignments",
    },
    {
        icon:Glasses,
        label: "Classrooms",
        href: "/classrooms",
    },

]

const teacherRoutes = [
    {
        icon:List,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon:FileQuestion,
        label: "Question Bank",
        href: "/teacher/quesBanks",
    },
    {
        icon:BookOpenCheck,
        label: "Assignments",
        href: "/teacher/assignments",
    },
    {
        icon:Glasses,
        label: "Classrooms",
        href: "/teacher/classrooms",
    },
    {
        icon:BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    },
]


export const SidebarRoutes = () => {

    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");

    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return(
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}