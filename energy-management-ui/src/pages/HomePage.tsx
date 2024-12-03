import {useGetAllMonitoredDevicesQuery} from "../redux/api.ts";
import MonitoredDeviceCard from "@/components/Card/MonitoredDeviceCard.tsx";
import {AuthState, selectAuthState} from "@/redux/slices";
import {useSelector} from "react-redux";

export default function HomePage() {
   const authState: AuthState = useSelector(selectAuthState);
   const {data: monitoredDevicesResponse} = useGetAllMonitoredDevicesQuery();

   return (
      <div className="w-full h-screen p-4 bg-background-accent overflow-auto text-background-reverse">
         <h2 className="text-4xl flex">My Monitored Devices</h2>
         <div className="h-0.5 w-full bg-primary-color my-5"/>
         <section className="flex flex-row gap-4 flex-wrap">
            {monitoredDevicesResponse?.payload ?
               monitoredDevicesResponse.payload
                  .filter(device => device.userId === authState.user?.id)
                  .map((monitoredDevice) =>
                     <div className="h-full flex-grow-0 lg:basis-[calc(25%-2rem)] md:basis-[31.7%] sm:basis-[48.2%] basis-[100%]"
                          key={monitoredDevice.deviceId}>
                        <MonitoredDeviceCard monitoredDevice={monitoredDevice}/>
                     </div>
                  ) :
               <div className="text-background-reverse">No monitored devices yet.</div>
            }
         </section>
      </div>
   );
}