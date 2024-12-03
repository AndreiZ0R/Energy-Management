import {MonitoredDevice} from "@/models/entities.ts";
import AppPicker from "@/components/DayPicker/AppPicker.tsx";
import {ReactElement, useState} from "react";
import {formatHoursMinutes, getDate} from "@/utils/date-format.ts";
import {Chart, ChartWrapperOptions} from "react-google-charts";
import {cssVar, rgbCssVar} from "@/utils/theme-utils.ts";

type MonitoredDeviceCardProps = {
   monitoredDevice: MonitoredDevice;
}

export default function MonitoredDeviceCard({monitoredDevice}: MonitoredDeviceCardProps) {
   const [date, setDate] = useState<Date>(new Date());

   const sameDay = (firstDate: Date, secondDate: Date): boolean => {
      return firstDate.getFullYear() === secondDate.getFullYear() &&
         secondDate.getMonth() === secondDate.getMonth() &&
         firstDate.getDay() === secondDate.getDay();
   }

   const getChartData = () => {
      const chartData = monitoredDevice.hourlyConsumptions
         .filter(hc => sameDay(new Date(hc.timestamp), date))
         .map(hc => [formatHoursMinutes(hc.timestamp), hc.consumption]);

      return [
         ["Hour", monitoredDevice.description],
         ...chartData,
      ]
   }

   const prepareChart = (): ReactElement => {
      const chartData = getChartData();

      if (chartData.length > 1) {
         return <Chart
            chartType={"AreaChart"}
            data={chartData}
            options={chartOptions}
         />
      } else return <div className="mt-3 text-gray-500">
         No data available for {getDate(date)}.
      </div>
   }

   const chartOptions: ChartWrapperOptions["options"] = {
      backgroundColor: cssVar("----background-color"),
      colors: [rgbCssVar("--primary-color")],
      legend: {position: "none"},
      hAxis: {
         textStyle: {color: rgbCssVar("--accent-color")},
      },
      vAxis: {
         textStyle: {color: rgbCssVar("--accent-color")},
         gridlines: {color: rgbCssVar("--background-color")}
      },
      chartArea: {width: "83%", height: "83%"},
      pointSize: 6,
   }

   return (
      <div key={monitoredDevice.id} className="bg-background-color text-background-reverse rounded-xl px-3 py-3 w-full h-full shadow-lg flex flex-col gap-3">

         <div className="flex flex-row items-center justify-between w-full">
            <div className="text-2xl">{monitoredDevice.description}</div>
            <div className={`h-2 w-2 ${monitoredDevice.monitored ? "bg-green-300" : "bg-red-400"} rounded-full`}/>
         </div>

         <AppPicker selectedDate={date} onSelect={(date) => setDate(date as Date ?? new Date())}/>

         {prepareChart()}

      </div>
   )
}