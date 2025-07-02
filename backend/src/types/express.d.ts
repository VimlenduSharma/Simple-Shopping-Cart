import 'express'; // pulls in the base typings

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isAdmin?: boolean;
    }
    interface Request {
      user?: User;
    }
  }
}