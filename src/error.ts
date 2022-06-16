class API_ERROR extends Error {
	constructor(msg: string) {
		super(msg);
		Object.setPrototypeOf(this, API_ERROR.prototype);
	}
	handleError(): string{
		return `${this.message}`;
	}
}

export { API_ERROR};