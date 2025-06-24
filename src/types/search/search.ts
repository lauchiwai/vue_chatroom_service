export interface PagedViewModel<T> {
    items: T;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export interface SearchParams {
    pageNumber?: number;
    pageSize: number;
    keyword?: string;
    sortBy?: string;
    sortDirection?: string;
    startDate?: Date | string;
    endDate?: Date | string;
}