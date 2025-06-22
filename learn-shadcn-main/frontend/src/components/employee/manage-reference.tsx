import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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

interface ReferenceDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Validation schema
const referenceSchema = yup.object().shape({
  referenceName: yup.string().required("Reference Name is required"),
  referenceEmail: yup.string().email("Invalid email").required("Email is required"),
  referencePhone: yup.string().required("Phone is required"),
  referenceDesignation: yup.string().required("Designation is required"),
  referenceCompany: yup.string().required("Company / Department is required"),
});

type ReferenceFormData = yup.InferType<typeof referenceSchema>;

export default function ReferenceDetails({ isOpen, onOpenChange }: ReferenceDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReferenceFormData>({
    resolver: yupResolver(referenceSchema),
  });

  const onSubmit = (data: ReferenceFormData) => {
    console.log("Reference Details Submitted:", data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Reference Details</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 max-h-[75vh] overflow-y-auto pr-2 mt-4 min-h-[85vh]"
          >
            {[
              { label: "Reference Name", name: "referenceName" },
              { label: "Email", name: "referenceEmail", type: "email" },
              { label: "Phone", name: "referencePhone", type: "tel" },
              { label: "Designation", name: "referenceDesignation" },
              { label: "Company / Department", name: "referenceCompany" },
            ].map((field) => (
              <div className="grid gap-1 px-4" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type || "text"}
                  {...register(field.name as keyof ReferenceFormData)}
                />
                {errors[field.name as keyof ReferenceFormData] && (
                  <p className="text-red-500 text-sm">
                    {errors[field.name as keyof ReferenceFormData]?.message?.toString()}
                  </p>
                )}
              </div>
            ))}

            <SheetFooter className="mt-4">
              <Button type="submit">Save Reference</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
