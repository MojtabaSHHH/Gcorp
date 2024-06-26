class ApiErr extends Error {
    statusCode: number
    constructor(statusCode: number, message: string,stack = '') {
        super(message);
        this.statusCode = statusCode;
        console.error(this)
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default ApiErr