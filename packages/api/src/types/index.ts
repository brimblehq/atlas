export interface defaultErrorDto {
  statusCode: number;
  message: string;
}

export interface queryFilterDto {
  page: number;
  limit: number;
  filterBy: string;
}
