import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPrincipal;
    }
  }
}

export {};
