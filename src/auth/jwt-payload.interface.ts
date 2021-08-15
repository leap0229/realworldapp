import { JwtPayload } from 'jsonwebtoken';

export interface ExtJwtPayload extends JwtPayload {
  id: number;
}
