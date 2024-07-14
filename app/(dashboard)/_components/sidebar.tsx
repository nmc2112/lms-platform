import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto text-white shadow-sm" style={{ backgroundColor: '#404A54', color: 'white'}}>
      <div className="p-3">
           <div className="flex items-center gap-2 font-semibold ml-1 cursor-pointer">
            <Logo />
            <span className="text-sm">The English Teaching Management System</span>
          </div>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
