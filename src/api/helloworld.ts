import { NextFunction, Request, Response } from 'express';
import { Builder, parseString } from 'xml2js';
import { stripPrefix } from 'xml2js/lib/processors';

import * as fs from 'fs';
import * as path from 'path';

import ErrnoException = NodeJS.ErrnoException;

const SERVICE_WSDL: string = path.join(
    __dirname,
    '../../public/helloworld.wsdl'
);

const JSON_RESPONSE = (result: string) => {
    return {
        'soapenv:Envelope': {
            $: {
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
                'xmlns:urn': 'urn:examples:helloservice',
            },
            'soapenv:Header': [''],
            'soapenv:Body': [
                {
                    'urn:sayHelloResponse': [
                        {
                            $: {
                                'soapenv:encodingStyle':
                                    'http://schemas.xmlsoap.org/soap/encoding/',
                            },
                            greeting: [
                                {
                                    _: result,
                                    $: {
                                        'xsi:type': 'xsd:string',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };
};

/**
 * GET /
 * Home page.
 */
export let wsdl = (req: Request, res: Response, next: NextFunction) => {
    if (req.query.wsdl === '') {
        res.setHeader('Content-Type', 'application/xml');
        res.statusCode = 200;
        console.log('Loading ' + SERVICE_WSDL);
        fs.readFile(
            SERVICE_WSDL,
            'utf8',
            (err: ErrnoException, data: string) => {
                if (err) {
                    if (err.stack) endResponse(err.stack);
                    else endResponse('Unknown error');
                } else {
                    endResponse(data);
                }
            }
        );
    } else {
        endResponse('Invalid GET request');
    }

    function endResponse(data: string) {
        res.write(data);
        res.end();
        next();
    }
};

export let soapHelloWorld = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Parse input
    console.log('Convert POST request to usable JSON');
    console.log('XML Received = ' + JSON.stringify(req.body));
    const envelope = req.body["soapenv:envelope"];
    const serviceData = envelope["soapenv:body"][0];
    const sayHelloData = serviceData["urn:sayhello"][0];
    console.log('Body = ' + JSON.stringify(sayHelloData));
    const serviceObject = sayHelloData["firstname"][0];
    const firstName = serviceObject["_"];
    console.log('First Name = ' + firstName);
    soapResponse(firstName, null, res, next);
};

let soapResponse = (
    result: string,
    err: Object | null,
    res: Response,
    next: NextFunction
) => {
    let builder = new Builder();
    let xmlresponse = builder.buildObject(JSON_RESPONSE(result));
    console.log(
        'Returning response Result: ' +
            result +
            '; Error: ' +
            JSON.stringify(err)
    );
    res.setHeader('Content-Type', 'application/xml');
    res.statusCode = 200;
    res.end(xmlresponse);
    next(err);
};
