import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        if (decoded.role !== 'admin') {
            res.status(403).json({ message: 'Access denied. Admin only.' });
            return;
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}; 