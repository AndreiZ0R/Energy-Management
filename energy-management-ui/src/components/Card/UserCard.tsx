import {Device, User} from "../../models/entities.ts";
import {MdAlternateEmail, MdBookmarkAdded, MdDevicesOther} from "react-icons/md";
import {formatDaysHours} from "../../utils/date-format.ts";
import {TbEdit} from "react-icons/tb";
import {FaRegTrashAlt} from "react-icons/fa";
import {UserForm} from "../index.ts";
import {UserFormData} from "../Form/UserForm.tsx";

type UserCardProps = {
   user: User;
   onEdit: () => void;
   onDelete: () => void;
   isEditing: boolean;
   editable?: boolean;
   onSubmit: (data: UserFormData) => void;
   userDevices: Device[];
   availableDevices: Device[];
}

export default function UserCard({user, onEdit, onDelete, isEditing, editable = true, onSubmit, userDevices, availableDevices}: UserCardProps) {

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
                 <TbEdit className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onEdit}/>
                 <FaRegTrashAlt className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onDelete}/>
             </div>
         }
      </div>
      :
      <div className="flex flex-col w-full h-full ">
         <UserForm
            user={user}
            userDevices={userDevices}
            availableDevices={availableDevices}
            onEditClick={onEdit}
            onSubmit={onSubmit}
         />
      </div>
}
