class HttpController {
    constructor(request, h) {
        this.request = request;
        this.h = h;
    }

    status(statusCode = 200) {
        this.statusCode = statusCode;
        return this;
    }

    content(content = {}) {
        this.content = content;
        return this;
    }

    send(data, statusCode = 200) {
        return this.h.response(data).code(statusCode);
    }
}

export default HttpController;