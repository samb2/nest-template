export interface ResponseObject {
  success: boolean;
  statusCode: number;
  message: string;
  data: object | string;
  path: string;
  method: string;
  responseTime?: string; // Optional property
}
