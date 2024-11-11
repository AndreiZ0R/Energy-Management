import {MdLocationOn} from "react-icons/md";
import {SlEnergy} from "react-icons/sl";
import {TbEdit} from "react-icons/tb";
import {FaRegTrashAlt} from "react-icons/fa";
import {Device} from "../../models/entities.ts";
import DeviceForm, {DeviceFormData} from "../Form/DeviceForm.tsx";

type DeviceCardProps = {
   device: Device;
   onEdit: () => void;
   onDelete: () => void;
   isEditing: boolean;
   editable?: boolean;
   onSubmit: (data: DeviceFormData) => void;
}

export default function DeviceCard({device, onEdit, onDelete, isEditing, editable = true, onSubmit}: DeviceCardProps) {
   return !isEditing || !editable ?
      <div className="flex flex-row bg-background-color text-background-reverse rounded-xl px-3 py-3 w-full h-full">

         {/* Card */}
         <div
            className="flex flex-col rounded-xl px-1 py-1 gap-1 animate-fadeIn flex-grow">
            <span className="text-3xl mb-1">{device.description}</span>

            <div className="flex flex-row items-center justify-start gap-3">
               <MdLocationOn className="text-md text-accent-color"/>
               <span>{device.address}</span>
            </div>

            <div className="flex flex-row items-center justify-start gap-3">
               <SlEnergy className="text-md text-accent-color"/>
               <span>{device.maximumHourlyConsumption}</span>
               <span className="text-gray-400">kw/H</span>
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
         <DeviceForm
            device={device}
            onEditClick={onEdit}
            onSubmit={onSubmit}
         />
      </div>
}