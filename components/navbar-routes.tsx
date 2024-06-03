"use client";

import { usePathname} from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import  Link from "next/link";
import { SearchInput } from "./search-input";

import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {

    const { userId } = useAuth();


    const pathname = usePathname();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/course");
    const isSearhPage = pathname === "/search";

    return(
        <>
            {isSearhPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2"/>Exit
                        </Button>
                    </Link>
                ) : isTeacher(userId) ? (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher mode
                        </Button>
                    </Link>
                ) : null
                }
                <UserButton 
                    afterSignOutUrl="/sign-in"
                />
            </div>
        </>
    )
}