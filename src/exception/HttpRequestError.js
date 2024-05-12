import log from '../utils/Logger.js';

class HttpRequestError extends Error {
    constructor(message, httpCode = 500) {
        super(message);
        this.message = message;
        this.code = httpCode;
        this.name = 'HttpRequestError';

        log.error(message);
    }

    get className() {
        return this.name;
    }

    httpResponse(headers) {
        return headers.response({
            'status': 'fail',
            'message': this.message
        }).code(this.code);
    }

}

export default HttpRequestError;