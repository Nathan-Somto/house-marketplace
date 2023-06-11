import { FieldValue, Timestamp } from 'firebase/firestore';
type category = "rent" | "sale";
type geoLocation = {
    lat:string,
    lng:string
}
interface IUser{
    firstName:string,
    email:string,
    timestamp:Timestamp|string | FieldValue
}
interface IListing{
    name:string,
    type:category,
    userRef:string,
    bedrooms:number,
    bathrooms:number,
    parking:boolean,
    furnished:boolean,
    offer:boolean,
    regularPrice:number,
    discountedPrice?:number,
    location:string,
    geoLocation:geoLocation,
    imgUrls:string[],
    timestamp:Timestamp|string | FieldValue,
    city?:string
}
export {IListing, category,geoLocation, IUser}