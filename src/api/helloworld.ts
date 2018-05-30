import {NextFunction, Request, Response} from 'express';

import * as fs from 'fs';
import * as path from 'path';

import ErrnoException = NodeJS.ErrnoException;

const SERVICE_WSDL = path.join(__dirname, '../../public/helloworld.wsdl');

/**
 * GET /
 * Home page.
 */
export let wsdl = (req: Request, res: Response, next: NextFunction) => {

    if (req.query.wsdl === "") {
        res.setHeader('Content-Type', 'application/xml');
        res.statusCode = 200;
        console.log("Loading " + SERVICE_WSDL);
        fs.readFile(SERVICE_WSDL, "utf8", (err: ErrnoException, data: string) => {
            if (err) {
                if (err.stack)
                    endResponse(err.stack);
                else
                    endResponse("Unknown error");
            } else {
                endResponse(data);
            }
        });
    } else {
        endResponse("Invalid GET request");
    }

    function endResponse(data:string) {
        res.write(data);
        res.end();
        next();
    }

};
