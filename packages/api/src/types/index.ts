export interface defaultErrorDto {
  statusCode: number;
  message: string;
  response?: any;
}

export interface queryFilterDto {
  page: number;
  limit: number;
  filterBy: string;
}
