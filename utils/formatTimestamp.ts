import { IListing } from "@/types";
import { Timestamp } from "firebase/firestore";
/**
 *
 * @param data
 * @returns string
 */
function formatTimestamp(data: IListing) {
  let timestampString: string;

  if (typeof data.timestamp === "string") {
    timestampString = data.timestamp;
  } else if (data.timestamp instanceof Timestamp) {
    timestampString = data.timestamp.toDate().toISOString();
  } else {
    timestampString = ""; // if no timestamp value return an empty string.
  }
  return timestampString;
}
export default formatTimestamp;
