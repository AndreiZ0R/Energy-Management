import {Button, ButtonType, InputField} from "../index.ts";
import MultiSelector, {DropdownOption} from "../Select/MultiSelector.tsx";
import RadioButtonSelector from "../Select/RadioButtonSelector.tsx";
import {Device, User, UserRole} from "../../models/entities.ts";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

export type UserFormData = {
   id?: string;
   password?: string;
   username: string;
   email: string;
   role: UserRole;
   deviceIds: string[];
};

type UserFormProps = {
   user?: User;
   userDevices?: Device[];
   availableDevices: Device[];
   onEditClick: () => void;
   onSubmit: (data: UserFormData) => void;
}

const userFormSchema = z.object({
   username: z.string({required_error: "Field is required"}).refine(data => data.trim() !== "", {message: "Username can not be empty"}),
   password: z.string().optional().refine(data => data?.trim() !== "", {message: "Password can not be empty"}),
   email: z.string({required_error: "Field is required"}).email({message: "Your email is not valid, try again"}),
   role: z.enum([UserRole.USER, UserRole.MANAGER])
});
type UserFormSchema = z.infer<typeof userFormSchema>;

export default function UserForm({user, userDevices = [], availableDevices, onSubmit, onEditClick}: UserFormProps) {
   const [selectedDevices, setSelectedDevices] = useState<DropdownOption[]>([]);

   const {
      register: registerFn,
      handleSubmit,
      formState: {errors},
   } = useForm<UserFormSchema>({
      resolver: zodResolver(userFormSchema),
      defaultValues: {
         ...user
      }
   });

   const formatDropdownOptions = (devices: Device[]): DropdownOption[] => {
      if (devices.length > 0)
         return devices.map(device => ({value: device.id, label: device.description, optionalDescription: device.address}));
      return [];
   }

   const formatOptionToDeviceIds = (options: DropdownOption[]): string[] => {
      return options.map(option => option.value);
   }

   useEffect(() => {
      if (userDevices?.length > 0)
         setSelectedDevices(formatDropdownOptions(userDevices));
   }, [userDevices]);


   const onFormSubmit: SubmitHandler<UserFormSchema> = (data) => {
      onSubmit({
         ...data,
         id: user?.id,
         deviceIds: formatOptionToDeviceIds(selectedDevices)
      });
   }

   return (
      <form className="flex flex-col gap-2 animate-fadeIn w-full h-full" id="userForm">
         <InputField label="Username" type="text" name="username" registerFn={registerFn} errorLabel={errors.username?.message}/>
         <InputField label="Email" type="text" name="email" registerFn={registerFn} errorLabel={errors.email?.message}/>

         {!user &&
             <InputField label="Password" type="password" name="password" registerFn={registerFn} errorLabel={errors.password?.message}/>
         }

         <MultiSelector
            placeholder="Devices"
            selectedValues={selectedDevices}
            onChange={setSelectedDevices}
            options={formatDropdownOptions(availableDevices)}
         />

         <RadioButtonSelector options={[UserRole.USER, UserRole.MANAGER]} registerFn={registerFn} name="role"/>

         <div className="flex flex-row justify-between gap-2">
            <Button label="Confirm" onClick={handleSubmit(onFormSubmit)} type="submit" formId="userForm" additionalStyles="w-full"/>
            <Button label="Cancel" onClick={onEditClick} type="button" buttonType={ButtonType.SECONDARY} additionalStyles="w-full"/>
         </div>
         <span className="text-red-400">{errors.root?.message}</span>
      </form>
   )
}