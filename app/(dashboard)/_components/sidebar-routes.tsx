"use client"

import { Layout, Compass, List, BarChart, FileQuestion, BookOpenCheck } from "lucide-react";
import {SidebarItem} from "./sidebar-item";
import { usePathname } from "@/node_modules/next/navigation";

const guestRoutes = [
    {
        icon:Layout,
        label: "Dashboard",
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