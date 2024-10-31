export const formatDate = (date: Date): string => {
   return new Date(date).toLocaleString("en-GB");
}

export const formatDaysHours = (date: Date): string => {
   const daysDifference = Math.floor(Math.abs(new Date(Date.now()).getTime() - new Date(date).getTime()) / (1000 * 3600 * 24));

   if (daysDifference >= 1) {
      return `${daysDifference} days ago`;
   }

   const hoursDifference = Math.floor(Math.abs(new Date(Date.now()).getTime() - new Date(date).getTime()) / 36e5);
   return `${hoursDifference}h ago`;
}