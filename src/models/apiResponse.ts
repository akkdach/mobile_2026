import { IPagination } from "./Pagination";

export interface APIResponse<T = any> {
    [x: string]: SetStateAction<string | null>;
    isSuccess: boolean
    message: string
    dataResult?: T
    billNo?: string
    equipment?: string
    totalVanActive?: number
    paginateItem?: IPagination
}
