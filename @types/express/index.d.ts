declare namespace Express {
    export interface Request {
      user: any;
      decoded?: string;
      file?: any;
      files?: any;
      userId?: any;
    }
  }
  