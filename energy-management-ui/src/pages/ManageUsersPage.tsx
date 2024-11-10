import {AuthState, selectAuthState} from "../redux/slices";
import {useSelector} from "react-redux";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
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
import {MdLocationOn} from "react-icons/md";
import {SlEnergy} from "react-icons/sl";
import {IoMdAdd} from "react-icons/io";
import {FaRegTrashAlt} from "react-icons/fa";
import {TbEdit} from "react-icons/tb";
import {CreateDeviceRequest, CreateUserRequest, UpdateDeviceRequest, UpdateUserRequest} from "../models/transfer.ts";
import {UserCard} from "../components";
import {toast, Toaster} from "react-hot-toast";
import {extractErrorMessage} from "../utils/errors-helper.ts";
import {errorToastOptions, successToastOptions} from "../utils/toast.tsx";

export default function ManageUsersPage() {
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

   useEffect(() => {
      if (authState.user?.role !== "Manager") {
         navigate(AppRoutes.HOME);
      }
   }, [authState, navigate]);

   const onAddUser = () => {
      // setWhatForm("createUser");
      setSelectedUser(null);
      // setModalIsOpen(true);
   }

   const onDeleteUser = (user: User) => {
      deleteUser(user.id);
   }


   const onAddDevice = () => {
      // setWhatForm("createDevice");
      setSelectedDevice(null);
      // setModalIsOpen(true);
   }

   const onUpdateDevice = (device: Device) => {
      // setWhatForm("updateDevice");
      setSelectedDevice(device);
      // setModalIsOpen(true);
   }

   const onDeleteDevice = (device: Device) => {
      deleteDevice(device.id);
   }

   const getUserDevices = (user: User): Device[] => {
      return devicesResponse?.payload.filter(device => user.deviceIds.includes(device.id)) ?? [];
   }

   const getForm = () => {
      switch ("whatForm") {
         case "createUser":
            return <CreateUserForm onSubmit={createUser}/>
         case "updateDevice":
            return <UpdateDeviceForm selectedDevice={selectedDevice} onSave={updateDevice}/>
         case "createDevice":
            return <CreateDeviceForm onSubmit={createDevice}/>
      }
   }

   const toggleSelectedUser = (user: User) => {
      setSelectedUser(selectedUser === user ? null : user);
   }

   const onUpdateUser = (request: UpdateUserRequest) => {
      updateUser(request).unwrap()
         .then(updatedUserResponse => {
            toast.success(`Successfully updated ${updatedUserResponse.payload.username}`, successToastOptions());
         })
         .catch(response => {
            toast.error(extractErrorMessage(response.errors), errorToastOptions())
         })
   }
   // Todo: make the same with the device card + add the card below for inserting!

   return (
      <div className="px-4 py-4 bg-background-accent h-screen w-full">

         {/* Manage Users panel */}
         <div className="flex flex-row items-center justify-start gap-4">
            <span className="text-5xl text-background-reverse">Manage users</span>
            <IoMdAdd className="text-background-reverse text-3xl hover:text-primary-color cursor-pointer transition-all" onClick={onAddUser}/>
         </div>
         <section className="flex flex-row gap-4 flex-wrap mt-5">
            {usersResponse?.payload.map(user =>
               <div className="h-full flex-grow-0 basis-[32%]" key={user.id}>
                  <UserCard
                     isEditing={selectedUser === user}
                     user={user}
                     key={user.id}
                     userDevices={getUserDevices(user)}
                     availableDevices={devicesResponse?.payload ?? []}
                     onDelete={() => onDeleteUser(user)}
                     onEditClick={() => toggleSelectedUser(user)}
                     onSave={onUpdateUser}
                  />
               </div>
            )}
         </section>

         <div className="w-full h-1 bg-primary-color my-10"></div>

         {/* Manage Devices panel */}
         <div>
            <div className="flex flex-row items-center justify-start gap-4">
               <span className="text-2xl text-background-reverse">Manage devices</span>
               <IoMdAdd className="text-background-reverse text-2xl hover:text-primary-color cursor-pointer" onClick={onAddDevice}/>
            </div>
            <section className="grid grid-cols-3 gap-5 mt-5">
               {devicesResponse?.payload.map(device =>
                  <DeviceCard device={device} onUpdate={() => onUpdateDevice(device)} onDelete={() => onDeleteDevice(device)} key={device.id}/>
               )}
            </section>
         </div>
         <Toaster/>
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

// Todo: garbage need to remove

interface EditUserProps {
   selectedUser: User | null;
   onSave: (user: UpdateUserRequest) => void;
}

// const EditUser: React.FC<EditUserProps> = ({selectedUser, onSave}) => {
//    const [updateUserRequest, setUpdateUserRequest] = useState<UpdateUserRequest>({
//       id: "",
//       username: '',
//       email: '',
//       role: 'User',
//       deviceIds: []
//    });
//
//    useEffect(() => {
//       if (selectedUser)
//          setUpdateUserRequest({...selectedUser});
//    }, [selectedUser]);
//
//    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       const {name, value} = e.target;
//       setUpdateUserRequest((prevUser) => ({
//          ...prevUser,
//          [name]: name === 'deviceIds' ? value.split(',') : value
//       }));
//    };
//
//    const handleSubmit = (e: FormEvent) => {
//       e.preventDefault();
//       onSave(updateUserRequest);
//    };
//
//    return (
//       <form onSubmit={handleSubmit} className="bg-background-accent p-10 rounded-xl w-full">
//          <InputField label="Username" value={updateUserRequest.username} onChange={handleChange} type="text"/>
//          <InputField label="Email" value={updateUserRequest.email} onChange={handleChange} type="text"/>
//
//          <div>
//             <label>Role:</label>
//             <select name="role" value={updateUserRequest.role} onChange={handleChange} required>
//                <option value="User">User</option>
//                <option value="Manager">Manager</option>
//             </select>
//          </div>
//
//          <InputField label="Devices" value={updateUserRequest.deviceIds.join(",").valueOf()} onChange={handleChange} type="text"/>
//          <button type="submit">Save</button>
//       </form>
//    );
// };

interface CreateUserFormProps {
   onSubmit: (newUser: CreateUserRequest) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({onSubmit}) => {
   const [formData, setFormData] = useState<CreateUserRequest>({
      username: '',
      email: '',
      password: '',
      role: 'User',
      deviceIds: []
   });

   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const {name, value} = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: name === 'deviceIds' ? value.split(',') : value
      }));
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
   };

   return (
      <form onSubmit={handleSubmit}>
         <div>
            <label>Username:</label>
            <input
               type="text"
               name="username"
               value={formData.username}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>Email:</label>
            <input
               type="email"
               name="email"
               value={formData.email}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>Password:</label>
            <input
               type="password"
               name="password"
               value={formData.password}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
               <option value="User">User</option>
               <option value="Manager">Manager</option>
            </select>
         </div>

         <div>
            <label>Device IDs (comma-separated):</label>
            <input
               type="text"
               name="deviceIds"
               value={formData.deviceIds.join(',')}
               onChange={handleChange}
            />
         </div>

         <button type="submit">Create User</button>
      </form>
   );
};

interface UpdateDeviceFormProps {
   selectedDevice: UpdateDeviceRequest | null;
   onSave: (device: UpdateDeviceRequest) => void;
}

const UpdateDeviceForm: React.FC<UpdateDeviceFormProps> = ({selectedDevice, onSave}) => {
   const [deviceData, setDeviceData] = useState<UpdateDeviceRequest>({
      id: '',
      description: '',
      address: '',
      maximumHourlyConsumption: 0,
      userId: ''
   });

   useEffect(() => {
      if (selectedDevice)
         setDeviceData(selectedDevice);
   }, [selectedDevice]);

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setDeviceData((prevData) => ({
         ...prevData,
         [name]: name === 'maximumHourlyConsumption' ? Number(value) : value
      }));
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSave(deviceData);
   };

   return (
      <form onSubmit={handleSubmit}>
         <div>
            <label>Description:</label>
            <input
               type="text"
               name="description"
               value={deviceData.description}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>Address:</label>
            <input
               type="text"
               name="address"
               value={deviceData.address}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>Maximum Hourly Consumption:</label>
            <input
               type="number"
               name="maximumHourlyConsumption"
               value={deviceData.maximumHourlyConsumption}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>User ID:</label>
            <input
               type="text"
               name="userId"
               value={deviceData.userId}
               onChange={handleChange}
            />
         </div>

         <button type="submit">Save Device</button>
      </form>
   );
};

interface CreateDeviceFormProps {
   onSubmit: (newDevice: CreateDeviceRequest) => void;
}

const CreateDeviceForm: React.FC<CreateDeviceFormProps> = ({onSubmit}) => {
   const [formData, setFormData] = useState<CreateDeviceRequest>({
      description: '',
      address: '',
      maximumHourlyConsumption: 0
   });

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: name === 'maximumHourlyConsumption' ? Number(value) : value
      }));
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
   };

   return (
      <form onSubmit={handleSubmit}>
         <div>
            <label>Description:</label>
            <input
               type="text"
               name="description"
               value={formData.description}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>Address:</label>
            <input
               type="text"
               name="address"
               value={formData.address}
               onChange={handleChange}
               required
            />
         </div>

         <div>
            <label>Maximum Hourly Consumption:</label>
            <input
               type="number"
               name="maximumHourlyConsumption"
               value={formData.maximumHourlyConsumption}
               onChange={handleChange}
               required
            />
         </div>

         <button type="submit">Create Device</button>
      </form>
   );
};