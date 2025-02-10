import express from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
){
    if(!req.headers.authorization){
        res.status(401).json({error: 'Unauthorized'});
        return;
    }

    if(!process.env.JWT){
        res.status(500).json({error: 'something went wrong :('});
        return;
    }
    const splitHeader = req.headers.authorization.split(' ');
    if(splitHeader[0] !== 'Bearer' || splitHeader.length !== 2 || !splitHeader[1]){
        res.status(401).json({error: 'Unauthorized'});
        return;
    }
    
    const token = splitHeader[1];

    try {
        //throws error when token is invalid
        jwt.verify(token, process.env.JWT as string);
        next();
    } catch (error) {
        res.status(401).json({error: 'Unauthorized'});
        return;
    }
}