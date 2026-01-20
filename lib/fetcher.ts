import axios from "axios";

const fetcher = <T>(url: string): Promise<T> => 
  axios.get<T>(url).then((res) => {
    // Detect HTML responses and reject them
    if (typeof res.data === "string" && res.data.trim().startsWith("<!DOCTYPE html>")) {
      throw new Error("Received HTML instead of JSON");
    }
    return res.data;
  });

export default fetcher;
