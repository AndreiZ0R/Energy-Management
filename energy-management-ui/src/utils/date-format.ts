export const formatDate = (date: Date): string => {
   return new Date(date).toLocaleString("en-GB");
}

export const getDate = (date: Date): string => {
   return formatDate(date).split(",")[0];
}

export const formatDaysHours = (date: Date): string => {
   const daysDifference = Math.floor(Math.abs(new Date(Date.now()).getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));

   if (daysDifference >= 1) {
      return `${daysDifference} days ago`;
   }

   const hoursDifference = Math.floor(Math.abs(new Date(Date.now()).getTime() - new Date(date).getTime()) / 36e5);
   return `${hoursDifference}h ago`;
}

export const getHour = (date: Date): string => {
   return formatDate(date).split(', ')[1]
}

export const formatHoursMinutes = (date: Date): string => {
   const theDate = new Date(date);

   const hours = theDate.getHours().toString().padStart(2, '0'); // Ensure 2-digit format
   const minutes = theDate.getMinutes().toString().padStart(2, '0');

   return `${hours}:${minutes}`;
}