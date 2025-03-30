import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        if (typeof decoded != 'object' || !decoded?.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export function authenticateRefreshToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers.authorization;
    if (!refreshToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET as string);
        if (typeof decoded != 'object' || !decoded?.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET as string);
        if (typeof decoded != 'object' || !decoded?.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (decoded.role != 'admin' ) {
            res.status(401).json({ message: 'User not authorised to perform this action!' });
            return;
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}