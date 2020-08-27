import { Express, Request, Response, NextFunction } from "express";
// Re-declare express namespace
declare namespace Express {
    export interface Request {
        flash(): { [key: string]: string[]; };
        flash(): any;
    }
}
// Declare a new module flash
declare module "flash" {
    function flash(): (req: Request, res: Response, next: NextFunction) => void;
    // export flash function
    export = flash;
}