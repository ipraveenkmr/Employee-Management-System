import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useWatch } from "react-hook-form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface OffboardingProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = yup.object().shape({
  resignationDate: yup.date().required("Resignation Date is required"),
  lastWorkingDay: yup.date().required("Last Working Day is required"),
  exitInterviewStatus: yup
    .string()
    .required("Exit Interview Status is required"),
  reasonForLeaving: yup.string().optional(),
  documentsHandoverStatus: yup
    .string()
    .required("Documents Handover Status is required"),
  clearanceStatus: yup.string().required("Clearance Status is required"),
  finalSettlementDate: yup.date().required("Final Settlement Date is required"),

  experienceCertificateIssued: yup.boolean().required(),
  experienceCertificateDate: yup
    .date()
    .when("experienceCertificateIssued", {
      is: true,
      then: (schema) => schema.required("Date is required"),
      otherwise: (schema) => schema.optional(),
    }),

  relievingLetterIssued: yup.boolean().required(),
  relievingLetterDate: yup.date().when("relievingLetterIssued", {
    is: true,
    then: (schema) => schema.required("Date is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

type FormData = yup.InferType<typeof schema>;

export default function OffboardingDetails({
  isOpen,
  onOpenChange,
}: OffboardingProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      experienceCertificateIssued: false,
      relievingLetterIssued: false,
    },
  });

  const experienceCertificateIssued = useWatch({
    control,
    name: "experienceCertificateIssued",
  });

  const relievingLetterIssued = useWatch({
    control,
    name: "relievingLetterIssued",
  });

  const onSubmit = (data: FormData) => {
    console.log("Offboarding Details Submitted:", data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[30vw]">
        <SheetHeader>
          <SheetTitle>Offboarding Details</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 max-h-[75vh] overflow-y-auto pr-2 mt-4 min-h-[85vh]"
          >
            {/* Date Fields */}
            {[
              { label: "Resignation Date", name: "resignationDate" },
              { label: "Last Working Day", name: "lastWorkingDay" },
              { label: "Final Settlement Date", name: "finalSettlementDate" },
            ].map((field) => (
              <div className="grid gap-1 px-4" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type="date"
                  {...register(field.name as keyof FormData)}
                />
                {errors[field.name as keyof FormData] && (
                  <p className="text-red-500 text-sm">
                    {errors[field.name as keyof FormData]?.message?.toString()}
                  </p>
                )}
              </div>
            ))}

            {/* Select Dropdowns */}
            {[
              {
                label: "Exit Interview Status",
                name: "exitInterviewStatus",
                options: ["Completed", "Pending", "Not Applicable"],
              },
              {
                label: "Documents Handover Status",
                name: "documentsHandoverStatus",
                options: ["Complete", "In Progress", "Pending"],
              },
            ].map((field) => (
              <div className="grid gap-1 px-4" key={field.name}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <select
                  id={field.name}
                  {...register(field.name as keyof FormData)}
                  className="border rounded-md p-2"
                >
                  <option value="">Select</option>
                  {field.options.map((opt) => (
                    <option value={opt} key={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors[field.name as keyof FormData] && (
                  <p className="text-red-500 text-sm">
                    {errors[field.name as keyof FormData]?.message?.toString()}
                  </p>
                )}
              </div>
            ))}

            {/* Text Area */}
            <div className="grid gap-1 px-4">
              <Label htmlFor="reasonForLeaving">Reason for Leaving</Label>
              <Textarea id="reasonForLeaving" {...register("reasonForLeaving")} />
            </div>

            {/* Clearance Status */}
            <div className="grid gap-1 px-4">
              <Label htmlFor="clearanceStatus">Clearance Status</Label>
              <Input id="clearanceStatus" {...register("clearanceStatus")} />
              {errors.clearanceStatus && (
                <p className="text-red-500 text-sm">
                  {errors.clearanceStatus.message}
                </p>
              )}
            </div>

            {/* Experience Certificate */}
            <div className="grid gap-1 px-4">
              <Label>Experience Certificate Issued</Label>
              <Controller
                control={control}
                name="experienceCertificateIssued"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              {experienceCertificateIssued && (
                <div className="mt-2">
                  <Label htmlFor="experienceCertificateDate">Date</Label>
                  <Input
                    id="experienceCertificateDate"
                    type="date"
                    {...register("experienceCertificateDate")}
                  />
                  {errors.experienceCertificateDate && (
                    <p className="text-red-500 text-sm">
                      {errors.experienceCertificateDate.message?.toString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Relieving Letter */}
            <div className="grid gap-1 px-4">
              <Label>Relieving Letter Issued</Label>
              <Controller
                control={control}
                name="relievingLetterIssued"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              {relievingLetterIssued && (
                <div className="mt-2">
                  <Label htmlFor="relievingLetterDate">Date</Label>
                  <Input
                    id="relievingLetterDate"
                    type="date"
                    {...register("relievingLetterDate")}
                  />
                  {errors.relievingLetterDate && (
                    <p className="text-red-500 text-sm">
                      {errors.relievingLetterDate.message?.toString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <SheetFooter className="mt-4">
              <Button type="submit">Save Offboarding</Button>
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
