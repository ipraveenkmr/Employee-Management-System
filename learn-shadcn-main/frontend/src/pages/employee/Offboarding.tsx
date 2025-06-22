import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import ManageDetails from "@/components/employee/manage-offboarding"
import { Button } from "@/components/ui/button"

export default function OffboardingDetails() {
    const [isManage, setIsManage] = useState(false)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header currentPage="Offboarding Details" />
                <div className="flex justify-end px-10">
                    <Button variant="outline" onClick={() => setIsManage(true)}>Add Offboarding</Button>
                </div>
                <ManageDetails isOpen={isManage} onOpenChange={setIsManage} />
            </SidebarInset>
        </SidebarProvider>
    )
}
