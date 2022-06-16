
class API_ERROR extends Error {
	constructor(msg: string) {
		super(msg);
	}
	handleError(): string{
		return `${this.message}`;
	}
}

export { API_ERROR};