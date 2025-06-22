import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import Header from "@/components/header"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import ManageDetails from "@/components/employee/manage-details"
import { Button } from "@/components/ui/button"
import DataTableDemo from "@/components/employee/table/data-table"
import { useEmployeeColumns, type Employee } from "@/components/employee/table/details-columns"
import axios from "axios"
import useDataStore from '@/store/dataStore';


export default function Details() {
    const [isManage, setIsManage] = useState(false)
    const [data, setData] = useState<Employee[]>([])
    const columns = useEmployeeColumns();
    const { actionType, updateActionType, updateEmpDetails } = useDataStore();

    useEffect(() => {
        if (!isManage) {
            updateActionType("");
        }
    }, [isManage])

    useEffect(() => {
        if (actionType === "view" || actionType === "edit") {
            setIsManage(true);
        }
        if (actionType === "updated") {
            fetchData();
        }

    }, [actionType])

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
            // console.log("data ", response.data);
            setData(response.data);
        } catch (error) {
            console.error("Error ", error);
        }
    }


    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header currentPage="Employee Details" />
                <div className="flex justify-end px-10">
                    <Button variant="outline" onClick={() => {
                        setIsManage(true);
                        updateActionType("");
                        updateEmpDetails([]);
                    }}>Add Employee</Button>
                </div>
                <ManageDetails isOpen={isManage} onOpenChange={setIsManage} />
                <div className="mt-10 mx-10">
                    <DataTableDemo columns={columns} data={data} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
