export interface JwtAccessPayload {
  id: string;
  roles: number[];
  iat?: number;
  exp?: number;
}
