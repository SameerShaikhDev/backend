class ApiResponse {
    constructor(success = true, message = '', data = null, pagination = null) {
        this.success = success;
        this.message = message;
        if (data !== null) this.data = data;
        if (pagination) this.pagination = pagination;
    }

    static success(message = 'Success', data = null, pagination = null) {
        return new ApiResponse(true, message, data, pagination);
    }
}

module.exports = { ApiResponse };