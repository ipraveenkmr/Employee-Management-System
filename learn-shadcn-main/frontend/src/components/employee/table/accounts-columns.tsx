import { type ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import useDataStore from "@/store/dataStore";

export type AccountDetails = {
  id: number;
  employee_details_id: number;
  pay_grade: string;
  gross_salary: string;
  net_salary?: string;
  ctc: string;
  pf_account_number?: string;
  uan_number?: string;
  esi_number?: string;
  bank_name: string;
  bank_account_number: string;
  ifsc_code: string;
  branch_name: string;
  bank_city: string;
  tax_regime: "Old" | "New";
};

export const useAccountColumns = (): ColumnDef<AccountDetails>[] => {
  const { updateActionType, updateEmpDetails } = useDataStore();

  const handleViewOrEdit = async (record: AccountDetails, type: string) => {
    updateEmpDetails([record]);
    updateActionType(type);
  };

  return [
    {
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
      accessorKey: "employee_details_id",
      header: "Employee ID",
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
      accessorKey: "pay_grade",
      header: "Pay Grade",
    },
    {
      accessorKey: "gross_salary",
      header: "Gross Salary",
      cell: ({ row }) =>
        `₹${parseFloat(row.getValue("gross_salary")).toFixed(2)}`,
    },
    {
      accessorKey: "net_salary",
      header: "Net Salary",
      cell: ({ row }) => {
        const val = row.getValue("net_salary") as number | string | null;
        return val ? `₹${parseFloat(val.toString()).toFixed(2)}` : "—";
      },
    },
    {
      accessorKey: "ctc",
      header: "CTC",
      cell: ({ row }) => `₹${parseFloat(row.getValue("ctc")).toFixed(2)}`,
    },
    {
      accessorKey: "pf_account_number",
      header: "PF Number",
      cell: ({ row }) => row.getValue("pf_account_number") || "—",
    },
    {
      accessorKey: "uan_number",
      header: "UAN Number",
      cell: ({ row }) => row.getValue("uan_number") || "—",
    },
    // {
    //   accessorKey: "esi_number",
    //   header: "ESI Number",
    //   cell: ({ row }) => row.getValue("esi_number") || "—",
    // },
    // {
    //   accessorKey: "bank_name",
    //   header: "Bank Name",
    // },
    // {
    //   accessorKey: "bank_account_number",
    //   header: "Account Number",
    // },
    // {
    //   accessorKey: "ifsc_code",
    //   header: "IFSC Code",
    // },
    // {
    //   accessorKey: "branch_name",
    //   header: "Branch Name",
    // },
    // {
    //   accessorKey: "bank_city",
    //   header: "Bank City",
    // },
    {
      accessorKey: "tax_regime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tax Regime
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
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
                onClick={() =>
                  navigator.clipboard.writeText(record.id.toString())
                }
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleViewOrEdit(record, "view")}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleViewOrEdit(record, "edit")}
              >
                Edit Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
