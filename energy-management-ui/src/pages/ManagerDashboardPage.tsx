import {AuthState, selectAuthState} from "../redux/slices";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
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
import {IoMdAdd} from "react-icons/io";
import {CreateDeviceRequest, CreateUserRequest, UpdateDeviceRequest, UpdateUserRequest} from "../models/transfer.ts";
import {UserCard, UserForm} from "../components";
import {toast, Toaster} from "react-hot-toast";
import {UserFormData} from "../components/Form/UserForm.tsx";
import {errorToastOptions, successToastOptions} from "../utils/toast.tsx";
import {extractErrorMessage} from "../utils/errors-helper.ts";
import DeviceCard from "../components/Card/DeviceCard.tsx";
import DeviceForm, {DeviceFormData} from "../components/Form/DeviceForm.tsx";

export default function ManagerDashboardPage() {
   const authState: AuthState = useSelector(selectAuthState);
   const navigate = useNavigate();

   const {data: usersResponse} = useGetAllUsersQuery();
   const [createUser] = useCreateUserMutation();
   const [updateUser] = useUpdateUserMutation();
   const [deleteUser] = useDeleteUserMutation();

   const {data: devicesResponse} = useGetAllDevicesQuery();
   const [createDevice] = useCreateDeviceMutation();
   const [updateDevice] = useUpdateDeviceMutation();
   const [deleteDevice] = useDeleteDeviceMutation();

   // const [whatForm, setWhatForm] = useState<string>("updateUser");
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
   const [createUserView, setCreateUserView] = useState<boolean>(true);
   const [createDeviceView, setCreateDeviceView] = useState<boolean>(true);

   useEffect(() => {
      if (authState.user?.role !== "Manager") {
         navigate(AppRoutes.HOME);
      }
   }, [authState, navigate]);

   // ------ Users ------
   const getUserDevices = (user: User): Device[] => {
      return devicesResponse?.payload.filter(device => user.deviceIds.includes(device.id)) ?? [];
   }

   const getAvailableDevices = (user?: User): Device[] => {
      return devicesResponse?.payload.filter(device => user?.deviceIds.includes(device.id) || device.userId === null) ?? [];
   }

   const toggleSelectedUser = (user: User) => {
      setSelectedUser(selectedUser === user ? null : user);
      if (!createUserView) {
         toggleCreateUserView();
      }
   }

   const toggleCreateUserView = () => {
      setCreateUserView(!createUserView);
      if (selectedUser !== null) {
         setSelectedUser(null);
      }
   };

   const onSaveUser = (data: UserFormData) => {
      createUser(data as CreateUserRequest).unwrap()
         .then(createdUserResponse => {
            toast.success(`Successfully created new user: ${createdUserResponse.payload.username}`, successToastOptions());
            toggleCreateUserView();
         })
         .catch(response => {
            toast.error(extractErrorMessage(response.errors), errorToastOptions());
         });
   }

   const onUpdateUser = (data: UserFormData) => {
      updateUser(data as UpdateUserRequest).unwrap()
         .then(updatedUserResponse => {
            toast.success(`Successfully updated ${updatedUserResponse.payload.username}`, successToastOptions());
         })
         .catch(response => {
            toast.error(extractErrorMessage(response.errors), errorToastOptions());
         });
   }

   const onDeleteUser = (user: User) => {
      deleteUser(user.id);
      toast.success(`Successfully deleted: ${user.username}`, successToastOptions());
   }

   // ------ Devices ------
   const toggleSelectedDevice = (device: Device) => {
      setSelectedDevice(selectedDevice === device ? null : device);
      if (!createDeviceView) {
         toggleCreateDeviceView();
      }
   }

   const toggleCreateDeviceView = () => {
      setCreateDeviceView(!createDeviceView);
      if (selectedDevice !== null) {
         setSelectedDevice(null);
      }
   };

   const onSaveDevice = (data: DeviceFormData) => {
      createDevice(data as CreateDeviceRequest).unwrap()
         .then(createdDeviceResponse => {
            toast.success(`Successfully created new device: ${createdDeviceResponse.payload.description}`, successToastOptions());
            toggleCreateDeviceView();
         })
         .catch(response => {
            toast.error(extractErrorMessage(response.errors), errorToastOptions());
         });
   }

   const onUpdateDevice = (data: DeviceFormData) => {
      updateDevice(data as UpdateDeviceRequest).unwrap()
         .then(updatedUserResponse => {
            toast.success(`Successfully updated ${updatedUserResponse.payload.description}`, successToastOptions());
         })
         .catch(response => {
            console.log(response);
            // toast.error(extractErrorMessage(response.errors), errorToastOptions());
         });
   }

   const onDeleteDevice = (device: Device) => {
      deleteDevice(device.id);
      toast.success(`Successfully deleted: ${device.description}`, successToastOptions());
   }

   return (
      <div className="px-4 py-4 bg-background-accent h-full w-full overflow-auto transition-all">

         {/* Manage Users panel */}
         <div className="flex flex-col items-start justify-center gap-4">
            <span className="text-4xl text-background-reverse">Manage users</span>
            <div className="h-0.5 w-full bg-primary-color"/>
         </div>
         <section className="flex flex-row gap-4 flex-wrap mt-5">
            {usersResponse?.payload.map(user =>
               <div className="h-full flex-grow-0 basis-[100%] 2xl:basis-[32.7%] xl:basis-[32%] lg:basis-[49%]" key={user.id}>
                  <UserCard
                     user={user}
                     key={user.id}
                     isEditing={selectedUser === user}
                     userDevices={getUserDevices(user)}
                     availableDevices={getAvailableDevices(user)}
                     onSubmit={onUpdateUser}
                     onEdit={() => toggleSelectedUser(user)}
                     onDelete={() => onDeleteUser(user)}
                  />
               </div>
            )}
            <div
               className={`${createUserView ? "bg-background-color" : "bg-transparent"} flex-grow-0 2xl:basis-[32.7%] xl:basis-[32%] lg:basis-[49%] rounded-xl flex items-center justify-center`}>
               {createUserView ?
                  <IoMdAdd className="text-background-reverse text-7xl hover:text-primary-color cursor-pointer transition-all"
                           onClick={toggleCreateUserView}/> :
                  <UserForm
                     onSubmit={onSaveUser}
                     onEditClick={toggleCreateUserView}
                     availableDevices={getAvailableDevices()}
                  />
               }
            </div>
         </section>

         {/* Manage Devices panel */}
         <div className="flex flex-col items-start justify-center gap-4 mt-10">
            <span className="text-4xl text-background-reverse">Manage devices</span>
            <div className="h-0.5 w-full bg-primary-color"/>
         </div>
         <section className="flex flex-row gap-4 flex-wrap mt-5">
            {devicesResponse?.payload.map(device =>
               <div className="h-full flex-grow-0 basis-[100%] 2xl:basis-[32.7%] xl:basis-[32%] lg:basis-[49%]" key={device.id}>
                  <DeviceCard
                     device={device}
                     key={device.id}
                     isEditing={selectedDevice === device}
                     onSubmit={onUpdateDevice}
                     onEdit={() => toggleSelectedDevice(device)}
                     onDelete={() => onDeleteDevice(device)}
                  />
               </div>
            )}
            <div
               className={`${createDeviceView ? "bg-background-color" : "bg-transparent"} flex-grow-0 2xl:basis-[32.7%] xl:basis-[32%] lg:basis-[49%] rounded-xl flex items-center justify-center`}>
               {createDeviceView ?
                  <IoMdAdd className="text-background-reverse text-7xl hover:text-primary-color cursor-pointer transition-all"
                           onClick={toggleCreateDeviceView}/> :
                  <DeviceForm
                     onSubmit={onSaveDevice}
                     onEditClick={toggleCreateDeviceView}
                  />
               }
            </div>
         </section>
         <Toaster/>
      </div>
   )
}