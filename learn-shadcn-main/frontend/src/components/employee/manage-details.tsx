//@ts-nocheck
import { useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

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

interface ManageProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Non-binary", "Prefer not to say"])
    .required(),
  dob: yup.date().required("Date of birth is required"),
  marital_status: yup.string().nullable(),
  nationality: yup.string().required("Nationality is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pin_code: yup.string().required("Pin Code is required"),
  pan_number: yup.string().required("PAN Number is required"),
  aadhaar_number: yup.string().nullable(),
  employee_number: yup.string().required("Employee Number is required"),
  employment_type: yup.string().required("Employment Type is required"),
  department: yup.string().required("Department is required"),
  designation: yup.string().required("Designation is required"),
  reporting_manager: yup.string().required("Reporting Manager is required"),
  joining_date: yup.date().required("Joining Date is required"),
  work_mode: yup.string().oneOf(["On-site", "Remote", "Hybrid"]).required(),
  shift_type: yup.string().nullable(),
  qualification: yup.string().required("Qualification is required"),
  specialization: yup.string().nullable(),
  experience_years: yup
    .number()
    .required()
    .min(0, "Experience must be 0 or more"),
});

type FormData = yup.InferType<typeof schema>;

export default function EmployeeForm({ isOpen, onOpenChange }: ManageProps) {
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
  const employeeData = empDetails[0];

  useEffect(() => {
    console.log("empDetails ", employeeData);
    if ((isEdit || isView) && employeeData) {
      reset({
        ...employeeData,
        dob: employeeData.dob ? employeeData.dob.split("T")[0] : "",
        joining_date: employeeData.joining_date
          ? employeeData.joining_date.split("T")[0]
          : "",
      });
    } else {
      reset({});
    }
  }, [actionType]);

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : null,
        joining_date: data.joining_date
          ? new Date(data.joining_date).toISOString().split("T")[0]
          : null,
      };

      let response;
      if (actionType === "edit" && employeeData?.id) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/employees/${employeeData.id}`,
          formattedData
        );
        console.log("Employee updated:", response.data);
        toast.success("Employee updated successful!");
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/employees`,
          formattedData
        );
        console.log("Employee created:", response.data);
        toast.success("Employee created successful!");
      }
      updateActionType("updated");
      onOpenChange(false);
    } catch (error) {
      toast.error("Error ", error.message || "Something went wrong");
      console.error(
        actionType === "edit"
          ? "Error updating employee:"
          : "Error creating employee:",
        error
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          {isView && <SheetTitle>View Employee Details</SheetTitle>}
          {isEdit && <SheetTitle>Edit Employee Details</SheetTitle>}
          {!isView && !isEdit && <SheetTitle>Create New Employee</SheetTitle>}
        </SheetHeader>
        <div className="px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 max-h-[75vh] overflow-y-auto pr-2 mt-4 min-h-[85vh]"
          >
            {[
              { label: "Full Name", name: "full_name" },
              { label: "Email", name: "email" },
              { label: "Phone Number", name: "phone_number" },
              { label: "Gender", name: "gender" },
              { label: "Date of Birth", name: "dob" },
              { label: "Marital Status", name: "marital_status" },
              { label: "Nationality", name: "nationality" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "State", name: "state" },
              { label: "Pin Code", name: "pin_code" },
              { label: "PAN Number", name: "pan_number" },
              { label: "Aadhaar Number", name: "aadhaar_number" },
              { label: "Employee Number", name: "employee_number" },
              { label: "Employment Type", name: "employment_type" },
              { label: "Department", name: "department" },
              { label: "Designation", name: "designation" },
              { label: "Reporting Manager", name: "reporting_manager" },
              { label: "Joining Date", name: "joining_date" },
              { label: "Work Mode", name: "work_mode" },
              { label: "Shift Type", name: "shift_type" },
              { label: "Qualification", name: "qualification" },
              { label: "Specialization", name: "specialization" },
              { label: "Experience Years", name: "experience_years" },
            ].map((field) => (
              <div key={field.name} className="px-4">
                {isView ? (
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">{field.label}:</span>{" "}
                    {employeeData?.[field.name] ?? "-"}
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

            {isView && (
              <>
                <div className="px-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Gender:</span>{" "}
                    {employeeData?.["gender"] ?? "-"}
                  </p>
                </div>
                <div className="px-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold">Work Mode:</span>{" "}
                    {employeeData?.["work_mode"] ?? "-"}
                  </p>
                </div>
              </>
            )}

            {!isView && (
              <>
                {/* Gender Dropdown */}
                <div className="grid gap-1 px-4">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="border rounded-md p-2"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Work Mode Dropdown */}
                <div className="grid gap-1 px-4">
                  <Label htmlFor="work_mode">Work Mode</Label>
                  <select
                    id="work_mode"
                    {...register("work_mode")}
                    className="border rounded-md p-2"
                  >
                    <option value="">Select</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  {errors.work_mode && (
                    <p className="text-red-500 text-sm">
                      {errors.work_mode.message}
                    </p>
                  )}
                </div>
                <SheetFooter className="mt-4">
                  <Button type="submit">Save Employee</Button>
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                </SheetFooter>
              </>
            )}
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
