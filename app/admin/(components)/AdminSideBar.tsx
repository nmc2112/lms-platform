"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import clsx from 'clsx';
import {
  Banknote,
  Clapperboard,
  Folder,
  HomeIcon,
  Settings
} from "lucide-react";
import { FaTasks } from 'react-icons/fa';

export default function DashboardSideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="lg:block hidden border-r h-full">
      <div className="flex h-full max-h-screen flex-col gap-2 ">
        <div className="flex h-[55px] items-center justify-between border-b px-3 w-full">
          <div
            className="flex items-center gap-2 font-semibold ml-1 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <span>Admin Dashboard</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-2 ">
          <nav className="grid items-start px-4 text-sm font-medium">
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/admin"
              })}
              onClick={() => handleNavigation('/admin')}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <HomeIcon className="h-3 w-3" />
              </div>
              Home
            </div>
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/user-manage"
              })}
              onClick={() => handleNavigation('/admin/user-manage')}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Folder className="h-3 w-3" />
              </div>
              User Management
            </div>
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/class-manage"
              })}
              onClick={() => handleNavigation('/admin/class-manage')}
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Clapperboard className="h-3 w-3" />
              </div>
              Class Management
            </div>
            <Separator className="my-3" />
            <div
              className={clsx("flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer", {
                "flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50": pathname === "/dashboard/settings"
              })}
              onClick={() => handleNavigation('/dashboard/settings')}
              id="onboarding"
            >
              <div className="border rounded-lg dark:bg-black dark:border-gray-800 border-gray-400 p-1 bg-white">
                <Settings className="h-3 w-3" />
              </div>
              Settings
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
