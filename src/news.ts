import fetch from 'node-fetch';
import { NewsInterface } from './interfaces';
import path from 'path';
import dotenv from 'dotenv';
import { API_ERROR } from './error';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_KEY = process.env.API_KEY;


/*
getNews takes field(news domain), fetch data, push it to array of NewsInterface
returns a promise "Promise<NewsInterface[] | any>"
*/
const getNews = async (field: string): Promise<NewsInterface[] | any> => {
	try {
		const listRsp = await fetch(
			`https://newsapi.org/v2/everything?q=${field}&from=2022-06-01&sortBy=popularity&apiKey=${API_KEY}`
		);
		const news: any = await listRsp.json();
		const arr: any = news.articles;
		const newsFeed: NewsInterface[] = [];
		if (arr.length > 3) { //if there is more then 5 news, it returns 3
			for (let i = 0; i < 3; i++) {
				newsFeed.push({
					title: arr[i].title,
					description: arr[i].description,
					content: arr[i].url,
					source: arr[i].source.name,
					date: arr[i].publishedAt,
				});
			}
			
		} 
		else if (arr.length == 0){
			throw new API_ERROR('Empty news feed');
		}else {
			arr.forEach((element: any) => {
				newsFeed.push({
					title: element.title,
					description: element.description,
					content: element.url,
					source: element.source.name,
					date: element.publishedAt,
				});
			});
		}
		return newsFeed;
	} catch (error) {
		throw new API_ERROR('Unvalid request');
	}
	
};

export {getNews};