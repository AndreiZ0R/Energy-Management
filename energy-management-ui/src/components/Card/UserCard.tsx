import {Device, User, UserRole} from "../../models/entities.ts";
import {MdAlternateEmail, MdBookmarkAdded, MdDevicesOther} from "react-icons/md";
import {formatDaysHours} from "../../utils/date-format.ts";
import {TbEdit} from "react-icons/tb";
import {FaRegTrashAlt} from "react-icons/fa";
import {Button, ButtonType, InputField} from "../index.ts";
import MultiSelector, {DropdownOption} from "../Select/MultiSelector.tsx";
import {useEffect, useState} from "react";
import RadioButtonSelector from "../Select/RadioButtonSelector.tsx";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UpdateUserRequest} from "../../models/transfer.ts";

type UserCardProps = {
   user: User;
   onEditClick: () => void;
   onDelete: () => void;
   isEditing: boolean;
   editable?: boolean;
   onSave: (updateUserRequest: UpdateUserRequest) => void;
   userDevices: Device[];
   availableDevices: Device[];
}

export default function UserCard({user, onEditClick, onDelete, isEditing, editable = true, onSave, userDevices, availableDevices}: UserCardProps) {
   const [selectedDevices, setSelectedDevices] = useState<DropdownOption[]>([]);

   const updateUserSchema = z.object({
      username: z.string({required_error: "Field is required"}).refine(data => data.trim() !== "", {message: "Username can not be empty"}),
      email: z.string({required_error: "Field is required"}).email({message: "Your email is not valid, try again"}),
      role: z.enum([UserRole.USER, UserRole.MANAGER])
   });

   type UpdateUserFields = z.infer<typeof updateUserSchema>;

   const {
      register: registerFn,
      handleSubmit,
      formState: {errors},
   } = useForm<UpdateUserFields>({
      resolver: zodResolver(updateUserSchema),
      defaultValues: {
         ...user
      }
   });

   const formatDropdownOptions = (devices: Device[]): DropdownOption[] => {
      return devices.map(device => ({value: device.id, label: device.description, optionalDescription: device.address}));
   }

   const formatOptionToDeviceIds = (options: DropdownOption[]): string[] => {
      return options.map(option => option.value);
   }


   useEffect(() => {
      setSelectedDevices(formatDropdownOptions(userDevices));
   }, [userDevices]);


   const onSubmit: SubmitHandler<UpdateUserFields> = (data) => {
      onSave({
         ...data,
         id: user.id,
         deviceIds: formatOptionToDeviceIds(selectedDevices)
      });
   }

   return !isEditing || !editable ?
      <div className="flex flex-row bg-background-color text-background-reverse rounded-xl px-3 py-3 w-full h-full">
         {/* Card */}
         <div
            className="flex flex-col rounded-xl px-1 py-1 gap-1 animate-fadeIn flex-grow">
            <div className="flex flex-row items-center justify-between gap-5">
               <div className="flex flex-row items-center justify-between gap-3">
                  <span className="text-3xl mb-1">{user.username}</span>
                  <span className="text-sm text-accent-color">{user.role}</span>
               </div>

            </div>

            <div className="flex flex-row items-center justify-start gap-3">
               <MdAlternateEmail className="text-md text-accent-color"/>
               <span>{user.email}</span>
            </div>

            <div className="flex flex-row items-center justify-start gap-3">
               <MdBookmarkAdded className="text-md text-accent-color"/>
               <span>{formatDaysHours(user.createdAt)}</span>
            </div>

            <div className="flex flex-row items-center justify-start gap-3">
               <MdDevicesOther className="text-md text-accent-color"/>
               <span>{user.deviceIds.length} devices</span>
            </div>
         </div>

         {/* Actions */}
         {editable &&
             <div className="flex flex-col items-center justify-around px-1 py-1">
                 <TbEdit className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onEditClick}/>
                 <FaRegTrashAlt className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onDelete}/>
             </div>
         }

      </div>
      :
      <div className="flex flex-col w-full h-full ">
         <form className="flex flex-col gap-2 animate-fadeIn" id="updateUserForm">
            <InputField label="Username" value={user.username} type="text" name="username" registerFn={registerFn} errorLabel={errors.username?.message}/>
            <InputField label="Email" value={user.email} type="text" name="email" registerFn={registerFn} errorLabel={errors.email?.message}/>

            <MultiSelector
               placeholder="Devices"
               selectedValues={selectedDevices}
               onChange={setSelectedDevices}
               options={formatDropdownOptions(availableDevices)}
            />

            <RadioButtonSelector options={[UserRole.USER, UserRole.MANAGER]} registerFn={registerFn} name="role"/>

            <div className="flex flex-row justify-between gap-2">
               <Button label="Confirm" onClick={handleSubmit(onSubmit)} type="submit" formId="updateUserForm" additionalStyles="w-full"/>
               <Button label="Cancel" onClick={onEditClick} type="button" buttonType={ButtonType.SECONDARY} additionalStyles="w-full"/>
            </div>
            <span className="text-red-400">{errors.root?.message}</span>
         </form>
      </div>
}
