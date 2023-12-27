export const acceptedFileTypes = "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
export const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {
   return item.trim();
 });

export const originAddress = '1640 Leckie Rd, Kelowna, BC V1X 7C6, Canada'
export const originLatitude = 49.8837165
export const originLongitude = -119.4312619
export const imageMaxSize = 10000000; // bytes
export const limitDesc = 60;
export const addressLimit = 50;