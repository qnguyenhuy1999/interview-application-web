
export class PaginationDto {
  skip?: number = 0;
  take?: number = 20;
}

export class CursorPaginationDto {
  cursor?: string;
  limit?: number = 20;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}
