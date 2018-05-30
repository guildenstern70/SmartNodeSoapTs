import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';

import errorHandler = require('errorhandler');

// Controllers (Route Handlers)
import * as helloworldController from "./api/helloworld";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    public app: express.Application;


    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        console.log('Welcome to SmartNodeSoapTs v.0.0.1');

        // create expressjs application
        this.app = express();

        // configure application
        this.config();

        // add routes
        this.routes();

        // add api
        this.api();
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        this.app.get("/helloworld", helloworldController.wsdl);
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        // add static paths
        this.app.use(express.static(path.join(__dirname, '../public')));

        // use logger middlware
        this.app.use(logger('dev'));

        // use json form parser middlware
        this.app.use(bodyParser.json());

        // use query string parser middlware
        this.app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );

        // catch 404 and forward to error handler
        this.app.use( (
            err: any,
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            err.status = 404;
            next(err);
        });

        // error handling
        this.app.use(errorHandler());
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    public routes() {
        // empty for now
    }
}
