"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions";

export function Account({ user }: { user: any }) {
  return (
    <div className={"py-1 px-2"}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="rounded-full border border-border w-10 h-10 flex items-center justify-center ">
            {user?.email?.charAt(0)}
          </div>

          <DropdownMenuContent>
            <DropdownMenuItem disabled={true}>{user.email}</DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => signOutAction()}
              className="flex items-center gap-4 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
}
