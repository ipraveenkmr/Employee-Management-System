//@ts-nocheck
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import ComboboxDemo from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useDataStore from "@/store/dataStore";
import { type Employee } from "@/components/employee/table/details-columns"

interface ManageProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = yup.object().shape({
  pay_grade: yup.string().required("Pay Grade is required"),
  gross_salary: yup
    .number()
    .typeError("Gross Salary must be a number")
    .required("Gross Salary is required"),
  net_salary: yup.number().typeError("Net Salary must be a number").nullable(),
  ctc: yup
    .number()
    .typeError("CTC must be a number")
    .required("CTC is required"),
  pf_account_number: yup.string().nullable(),
  uan_number: yup.string().nullable(),
  esi_number: yup.string().nullable(),
  bank_name: yup.string().required("Bank Name is required"),
  bank_account_number: yup.string().required("Bank Account Number is required"),
  ifsc_code: yup.string().required("IFSC Code is required"),
  branch_name: yup.string().required("Branch Name is required"),
  bank_city: yup.string().required("Bank City is required"),
  tax_regime: yup
    .string()
    .oneOf(["Old", "New"], "Invalid Tax Regime")
    .required("Tax Regime is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function AccountDetailsForm({
  isOpen,
  onOpenChange,
}: ManageProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { actionType, empDetails, updateActionType } = useDataStore();
  const isView = actionType === "view";
  const isEdit = actionType === "edit";
  const accountData = empDetails[0];
  const [empData, setEmpData] = useState<Employee[]>([])
  const [selectedValue, setSelectedvalue] = useState("")

  const handleUpdateSelectedValue = (value: string) => {
    setSelectedvalue(value)
  }

  useEffect(() => {
    if ((isEdit || isView) && accountData) {
      reset(accountData);
    } else {
      reset({});
    }
  }, [actionType]);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
      // console.log("data ", response.data);
      setEmpData(response.data);
    } catch (error) {
      console.error("Error ", error);
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      let response;

      console.log('empData ', empData)
      console.log('selectedValue ', selectedValue)
      const employeeRecord = empData.find((emp) => emp.email === selectedValue);
       console.log('empData ', employeeRecord)
      const id = employeeRecord ? employeeRecord.id : null;

      console.log('empData ', id)

      const formattedData = {
        ...data,
        employee_details_id: id,
        email: selectedValue
      };

      if (isEdit && accountData?.id) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/employee-accounts/${accountData.id}`,
          formattedData
        );
        toast.success("Account details updated successfully!");
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/employee-accounts`,
          formattedData
        );
        toast.success("Account details created successfully!");
      }
      updateActionType("updated");
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const fields = [
    { label: "Pay Grade", name: "pay_grade" },
    { label: "Gross Salary", name: "gross_salary" },
    { label: "Net Salary", name: "net_salary" },
    { label: "CTC", name: "ctc" },
    { label: "PF Account Number", name: "pf_account_number" },
    { label: "UAN Number", name: "uan_number" },
    { label: "ESI Number", name: "esi_number" },
    { label: "Bank Name", name: "bank_name" },
    { label: "Bank Account Number", name: "bank_account_number" },
    { label: "IFSC Code", name: "ifsc_code" },
    { label: "Branch Name", name: "branch_name" },
    { label: "Bank City", name: "bank_city" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          {isView && <SheetTitle>View Account Details</SheetTitle>}
          {isEdit && <SheetTitle>Edit Account Details</SheetTitle>}
          {!isView && !isEdit && (
            <SheetTitle>Create Account Details</SheetTitle>
          )}
        </SheetHeader>
        <div className="px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 max-h-[75vh] overflow-y-auto pr-2 mt-4 min-h-[85vh]"
          >
            {!isView && (
              <div>
                <Label htmlFor="Select Employee" className="px-4 mb-2">Employee Email</Label>
                <ComboboxDemo frameworks={empData} handleUpdateSelectedValue={handleUpdateSelectedValue} />
              </div>
            )}
            {fields.map((field) => (
              <div key={field.name} className="px-4">
                {isView ? (
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">{field.label}:</span>{" "}
                    {accountData?.[field.name] ?? "-"}
                  </p>
                ) : (
                  <div className="grid gap-1">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      type={field.type || "text"}
                      {...register(field.name as keyof FormData)}
                    />
                    {errors[field.name as keyof FormData] && (
                      <p className="text-red-500 text-sm">
                        {errors[
                          field.name as keyof FormData
                        ]?.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Tax Regime Dropdown */}
            <div className="grid gap-1 px-4">

              {isView ? (
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Tax Regime:</span>{" "}
                  {accountData?.tax_regime ?? "-"}
                </p>
              ) : (
                <>
                  <Label htmlFor="tax_regime">Tax Regime</Label>
                  <select
                    id="tax_regime"
                    {...register("tax_regime")}
                    className="border rounded-md p-2"
                  >
                    <option value="">Select</option>
                    <option value="Old">Old</option>
                    <option value="New">New</option>
                  </select>
                </>
              )}
              {errors.tax_regime && (
                <p className="text-red-500 text-sm">
                  {errors.tax_regime.message}
                </p>
              )}
            </div>

            {!isView && (
              <SheetFooter className="mt-4">
                <Button type="submit">Save</Button>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
              </SheetFooter>
            )}
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
