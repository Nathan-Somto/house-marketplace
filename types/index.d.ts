type category = "rent" | "sale";
type geoLocation = {
    lat:string,
    lng:string
}
interface IListing{
    name:string,
    type:category,
    userId:string,
    bedrooms:number,
    parking:boolean,
    furnished:boolean,
    offer:boolean,
    regularPrice:number,
    discountedPrice:number,
    location:string,
    geoLocation:geoLocation,
    imageUrls:string[],
    timestamp:string
}
export {IListing, category,geoLocation}