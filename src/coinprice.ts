import fetch from 'node-fetch';
import { CryptoPriceInterface } from './interfaces';
import path from 'path';
import { API_ERROR } from './error';

const getCryptoPrice = async (field: string) => {
	try{
		const listRsp = await fetch(
			`https://api.coingecko.com/api/v3/coins/${field}`
		);
		const jsonFile: any = await listRsp.json();
		const dataToDisplay: CryptoPriceInterface[] = [];
		dataToDisplay.push({
			id: jsonFile.id,
			symbol: jsonFile.symbol,
			name: jsonFile.name,
			description: jsonFile.description.en,
			image: jsonFile.image.thumb,
			genesis_date: jsonFile.genesis_date,
			market_cap_rank: jsonFile.market_cap_rank,
			price: jsonFile.market_data.current_price.usd,
		});
		return dataToDisplay;
	} catch (error) {
		throw new API_ERROR('Unvalid request');
        
	}
    
};


export {getCryptoPrice};