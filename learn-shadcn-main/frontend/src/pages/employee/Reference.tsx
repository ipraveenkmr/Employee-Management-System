import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import ReferenceDetails from "@/components/employee/manage-reference"
import { Button } from "@/components/ui/button"

export default function Reference() {
    const [isManage, setIsManage] = useState(false)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header currentPage="Reference Details" />
                <div className="flex justify-end px-10">
                    <Button variant="outline" onClick={() => setIsManage(true)}>Add Reference</Button>
                </div>
                <ReferenceDetails isOpen={isManage} onOpenChange={setIsManage} />
            </SidebarInset>
        </SidebarProvider>
    )
}
