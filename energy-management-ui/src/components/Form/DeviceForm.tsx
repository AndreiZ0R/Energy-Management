import {Device} from "../../models/entities.ts";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, ButtonType, InputField} from "../index.ts";

export type DeviceFormData = {
   id?: string;
   userId: string | null;
   description: string;
   address: string;
   maximumHourlyConsumption: number;
}

type DeviceFormProps = {
   device?: Device;
   onEditClick: () => void;
   onSubmit: (data: DeviceFormData) => void;
}

const deviceFromSchema = z.object({
   id: z.string().optional(),
   userId: z.string().optional().nullable().default(null),
   description: z.string({required_error: "Field is required"}).refine(data => data.trim() !== "", {message: "Description can not be empty"}),
   address: z.string({required_error: "Field is required"}).refine(data => data.trim() !== "", {message: "Address can not be empty"}),
   maximumHourlyConsumption: z.coerce.number({required_error: "Field is required"}).refine(data => data > 0, {message: "Consumption can not be zero"}),
});
type DeviceFromSchema = z.infer<typeof deviceFromSchema>;

export default function DeviceForm({device, onSubmit, onEditClick}: DeviceFormProps) {

   const {
      register: registerFn,
      handleSubmit,
      formState: {errors},
   } = useForm<DeviceFromSchema>({
      resolver: zodResolver(deviceFromSchema),
      defaultValues: {
         ...device
      }
   });

   const onFormSubmit: SubmitHandler<DeviceFromSchema> = (data) => onSubmit(data)

   return (
      <form className="flex flex-col gap-2 animate-fadeIn w-full" id="deviceForm">
         <InputField label="Description" type="text" name="description" registerFn={registerFn} errorLabel={errors.description?.message}/>
         <InputField label="Address" type="text" name="address" registerFn={registerFn} errorLabel={errors.address?.message}/>
         <InputField label="Maximum Hourly Consumption" type="number" name="maximumHourlyConsumption" registerFn={registerFn}
                     errorLabel={errors.maximumHourlyConsumption?.message}/>

         <div className="flex flex-row justify-between gap-2">
            <Button label="Confirm" onClick={handleSubmit(onFormSubmit)} type="submit" formId="userForm" additionalStyles="w-full"/>
            <Button label="Cancel" onClick={onEditClick} type="button" buttonType={ButtonType.SECONDARY} additionalStyles="w-full"/>
         </div>
         <span className="text-red-400">{errors.root?.message}</span>
      </form>
   )
}