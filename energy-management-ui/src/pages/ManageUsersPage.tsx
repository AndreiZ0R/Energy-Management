import {AuthState, selectAuthState} from "../redux/slices";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../utils/constants.ts";
import {
   useCreateDeviceMutation,
   useCreateUserMutation,
   useDeleteDeviceMutation,
   useDeleteUserMutation,
   useGetAllDevicesQuery,
   useGetAllUsersQuery,
   useUpdateDeviceMutation,
   useUpdateUserMutation
} from "../redux/api.ts";
import {Device, User} from "../models/entities.ts";
import {MdAlternateEmail, MdBookmarkAdded, MdDevicesOther, MdLocationOn} from "react-icons/md";
import {SlEnergy} from "react-icons/sl";
import {formatDaysHours} from "../utils/date-format.ts";
import {IoMdAdd} from "react-icons/io";
import {FaRegTrashAlt} from "react-icons/fa";
import {TbEdit} from "react-icons/tb";

export default function ManageUsersPage() {
   const authState: AuthState = useSelector(selectAuthState);
   const navigate = useNavigate();

   const {data: users} = useGetAllUsersQuery();
   const [createUser] = useCreateUserMutation();
   const [updateUser] = useUpdateUserMutation();
   const [deleteUser] = useDeleteUserMutation();

   const {data: devices} = useGetAllDevicesQuery();
   const [createDevice] = useCreateDeviceMutation();
   const [updateDevice] = useUpdateDeviceMutation();
   const [deleteDevice] = useDeleteDeviceMutation();

   // Todo: use react-hook-form and zod

   useEffect(() => {
      if (authState.user?.role !== "Manager") {
         navigate(AppRoutes.HOME);
      }
   }, [authState, navigate]);

   const onAddUser = () => {
   }

   const onUpdateUser = (user: User) => {
   }

   const onDeleteUser = (user: User) => {
      deleteUser(user.id);
   }


   const onAddDevice = () => {
   }

   const onUpdateDevice = (device: Device) => {
   }

   const onDeleteDevice = (device: Device) => {
      deleteDevice(device.id);
   }

   return (
      <div className="px-4 py-4 bg-background-accent h-screen w-full">

         {/* Manage Users panel */}
         <div>
            <div className="flex flex-row items-center justify-start gap-4">
               <span className="text-2xl text-background-reverse">Manage users</span>
               <IoMdAdd className="text-background-reverse text-2xl hover:text-primary-color cursor-pointer" onClick={onAddUser}/>
            </div>
            <section className="grid grid-cols-3 gap-5 mt-5">
               {users?.payload.map(user =>
                  <UserCard user={user} onUpdate={() => onUpdateUser(user)} onDelete={() => onDeleteUser(user)}/>
               )}
            </section>
         </div>

         <div className="w-full h-1 bg-primary-color my-10"></div>

         {/* Manage Devices panel */}
         <div>
            <div className="flex flex-row items-center justify-start gap-4">
               <span className="text-2xl text-background-reverse">Manage devices</span>
               <IoMdAdd className="text-background-reverse text-2xl hover:text-primary-color cursor-pointer" onClick={onAddDevice}/>
            </div>
            <section className="grid grid-cols-3 gap-5 mt-5">
               {devices?.payload.map(device =>
                  <DeviceCard device={device} onUpdate={() => onUpdateDevice(device)} onDelete={() => onDeleteDevice(device)}/>
               )}
            </section>
         </div>

      </div>
   )
}

// Todo: extract this somehow
type DeviceCardProps = {
   device: Device;
   onUpdate: () => void;
   onDelete: () => void;
}

function DeviceCard({device, onUpdate, onDelete}: DeviceCardProps) {
   return (
      <div className="flex flex-row bg-background-color text-background-reverse rounded-xl px-3 py-3">

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
         <div className="flex flex-col items-center justify-around px-1 py-1">
            <TbEdit className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onUpdate}/>
            <FaRegTrashAlt className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onDelete}/>
         </div>
      </div>


   )
}

type UserCardProps = {
   user: User;
   onUpdate: () => void;
   onDelete: () => void;
}

function UserCard({user, onUpdate, onDelete}: UserCardProps) {
   return (
      <div className="flex flex-row bg-background-color text-background-reverse rounded-xl px-3 py-3">

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
         <div className="flex flex-col items-center justify-around px-1 py-1">
            <TbEdit className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onUpdate}/>
            <FaRegTrashAlt className="text-2xl hover:text-primary-color transition-all cursor-pointer" onClick={onDelete}/>
         </div>
      </div>


   )
}