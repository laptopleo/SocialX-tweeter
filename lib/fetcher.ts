import axios from "axios";

const fetcher = <T>(url: string): Promise<T> => axios.get<T>(url).then((res) => res.data);

export default fetcher;
