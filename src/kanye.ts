import fetch from 'node-fetch';
import { API_ERROR } from './error';
import { KanyeQuoteInterface } from './interfaces';

const getKenyeQuote = async (): Promise<KanyeQuoteInterface | any> =>{
	try {
		const response = await fetch('https://api.kanye.rest');
		const quote = await response.json();
		return quote.quote;
	} catch (error) {
		throw new API_ERROR('something went wrong while fetching data');
	}
};

export { getKenyeQuote };