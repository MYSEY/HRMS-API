class ErrorResponse {
  constructor(errMsg = "Error Occurring", errDesc = "") {
    this.status = false;
    this.error = errMsg;
    this.error_description = errDesc;
  }
}

export { ErrorResponse };
