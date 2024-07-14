"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import clsx from 'clsx';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Settings,
  Contact,
} from "lucide-react";
import Image from 'next/image';
import logo from '../img/logo.png';

export default function DashboardSideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="lg:block hidden border-r h-full" style={{ backgroundColor: '#404A54', color: 'white' }}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[55px] items-center justify-between border-b px-3 w-full">
          <div className="flex items-center gap-2 font-semibold ml-1 cursor-pointer">
            <Image src={logo} alt="Logo" width={40} height={40} />
            <span className="text-sm">The English Teaching Management System</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-4 py-3 transition-all cursor-pointer", {
                "bg-gray-600 text-white": pathname === "/admin",
                "text-gray-300 hover:bg-gray-600 hover:text-white": pathname !== "/admin"
              })}
              onClick={() => handleNavigation('/admin')}
            >
              <Home className="h-5 w-5" />
              Home
            </div>
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-4 py-3 transition-all cursor-pointer", {
                "bg-gray-600 text-white": pathname === "/admin/student-manage",
                "text-gray-300 hover:bg-gray-600 hover:text-white": pathname !== "/admin/student-manage"
              })}
              onClick={() => handleNavigation('/admin/student-manage')}
            >
              <Users className="h-5 w-5" />
              Student Management
            </div>
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-4 py-3 transition-all cursor-pointer", {
                "bg-gray-600 text-white": pathname === "/admin/teacher-manage",
                "text-gray-300 hover:bg-gray-600 hover:text-white": pathname !== "/admin/teacher-manage"
              })}
              onClick={() => handleNavigation('/admin/teacher-manage')}
            >
              <Contact className="h-5 w-5" />
              Teacher Management
            </div>
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-4 py-3 transition-all cursor-pointer", {
                "bg-gray-600 text-white": pathname.startsWith("/admin/class-manage"),
                "text-gray-300 hover:bg-gray-600 hover:text-white": !pathname.startsWith("/admin/class-manage")
              })}
              onClick={() => handleNavigation('/admin/class-manage')}
            >
              <GraduationCap className="h-5 w-5" />
              Class Management
            </div>
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-4 py-3 transition-all cursor-pointer", {
                "bg-gray-600 text-white": pathname === "/admin/course-manage",
                "text-gray-300 hover:bg-gray-600 hover:text-white": pathname !== "/admin/course-manage"
              })}
              onClick={() => handleNavigation('/admin/course-manage')}
            >
              <BookOpen className="h-5 w-5" />
              Course Management
            </div>
            <Separator className="my-3 border-gray-500" />
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-4 py-3 transition-all cursor-pointer", {
                "bg-gray-600 text-white": pathname === "/admin/revenue",
                "text-gray-300 hover:bg-gray-600 hover:text-white": pathname !== "/admin/revenue"
              })}
              onClick={() => handleNavigation('/admin/revenue')}
            >
              <DollarSign className="h-5 w-5" />
              Revenue
            </div>
            <Separator className="my-3 border-gray-500" />
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-4 py-3 transition-all cursor-pointer", {
                "bg-gray-600 text-white": pathname === "/admin/settings",
                "text-gray-300 hover:bg-gray-600 hover:text-white": pathname !== "/admin/settings"
              })}
              onClick={() => handleNavigation('/admin/settings')}
              id="onboarding"
            >
              <Settings className="h-5 w-5" />
              Settings
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
