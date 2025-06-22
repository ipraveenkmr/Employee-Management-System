import { type ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import axios from "axios"
import toast from 'react-hot-toast'
import useDataStore from '@/store/dataStore'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export type Employee = {
    id: number
    full_name: string
    email: string
    phone_number: string
    gender: string
    dob: string
    marital_status: string
    nationality: string
    address: string
    city: string
    state: string
    pin_code: string
    pan_number: string
    aadhaar_number: string
    employee_number: string
    employment_type: string
    department: string
    designation: string
    reporting_manager: string
    joining_date: string
    work_mode: string
    shift_type: string
    qualification: string
    specialization: string
    experience_years: number
    created_at: string
    updated_at: string
}



export const useEmployeeColumns = (): ColumnDef<Employee>[] => {
    const { updateActionType, updateEmpDetails } = useDataStore();

    const handleDelete = async (id: number) => {

        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteRecord(id)
                },
                {
                    label: 'No',
                }
            ]
        });


    };

    const deleteRecord = async (id: number) => {
        console.log("Delete action triggered");
        await axios.delete(`${import.meta.env.VITE_API_URL}/employees/${id}`);
        updateActionType("updated");
        toast.success("Employee deleted successfully");
    }

    const handleViewOrDelete = async (emp: Employee, type: string) => {
        console.log("View or Edit action triggered ", emp, ' ', type);
        updateEmpDetails([emp]);
        updateActionType(type);
    };


    return [{
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "employee_number",
        header: "Employee No.",
        cell: ({ row }) => <div>{row.getValue("employee_number")}</div>,
    },
    {
        accessorKey: "full_name",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "phone_number",
        header: "Phone",
        cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
    },
    {
        accessorKey: "department",
        header: "Department",
    },
    {
        accessorKey: "designation",
        header: "Designation",
    },
    {
        accessorKey: "experience_years",
        header: "Experience",
        cell: ({ row }) => <div>{row.getValue("experience_years")} yrs</div>,
    },
    {
        accessorKey: "joining_date",
        header: "Joining Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("joining_date"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const employee = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(employee.id.toString())}
                        >
                            Copy Employee ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleViewOrDelete(employee, 'view')}
                        >View Profile</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleViewOrDelete(employee, 'edit')}
                        >Edit Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-orange-700"
                            onClick={() => handleDelete(employee.id)}
                        >Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
    ];
}
