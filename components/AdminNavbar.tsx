"use client";


import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function AdminNavbar() {
return (
<header className="h-16 bg-white border-b flex items-center justify-between px-6">
<div className="flex items-center gap-3 w-full max-w-md">
<Search className="h-4 w-4 text-gray-400" />
<input
placeholder="Search companies, jobs..."
className="w-full bg-transparent outline-none text-sm"
/>
</div>


<div className="flex items-center gap-4">
<Button size="icon" variant="ghost">
<Bell className="h-5 w-5" />
</Button>
<div className="h-8 w-8 rounded-full bg-slate-200" />
</div>
</header>
);
}



