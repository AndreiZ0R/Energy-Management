import {useGetDevicesByIdsQuery} from "../redux/api.ts";
import {AuthState, selectAuthState} from "../redux/slices";
import {useSelector} from "react-redux";
import {Device} from "../models/entities.ts";
import {SlEnergy} from "react-icons/sl";
import {MdLocationOn} from "react-icons/md";

export default function ManageDevicesPage() {
   const authState: AuthState = useSelector(selectAuthState);
   const {data: devicesResponse} = useGetDevicesByIdsQuery(authState.user?.deviceIds ?? []);


   return (
      <div className="px-4 py-4 bg-background-accent h-screen w-full">
         {devicesResponse?.payload.length === 0 && <span className="text-background-reverse">No devices yet.</span>}

         <div className="grid grid-cols-3 gap-5 ">
            {devicesResponse?.payload.map(device => <DeviceCard device={device}/>)}
            {devicesResponse?.payload.map(device => <DeviceCard device={device}/>)}
            {devicesResponse?.payload.map(device => <DeviceCard device={device}/>)}
            {devicesResponse?.payload.map(device => <DeviceCard device={device}/>)}
            {devicesResponse?.payload.map(device => <DeviceCard device={device}/>)}
         </div>
      </div>
   )
}

type DeviceCardProps = {
   device: Device;
}

function DeviceCard({device}: DeviceCardProps) {
   return (
      <div
         className="bg-background-color text-background-reverse flex flex-col rounded-xl px-3 py-3 gap-1 cursor-pointer hover:bg-primary-color transition-all animate-fadeIn">
         <span className="text-xl mb-1">{device.description}</span>

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
   )
}