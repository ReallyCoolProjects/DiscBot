import fetch from 'node-fetch';
import { NewsInterface } from './interfaces';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_KEY = process.env.API_KEY;

const getNews = async (field: string): Promise<NewsInterface[] | any> => {
	try {
		const listRsp = await fetch(
			`https://newsapi.org/v2/everything?q=${field}&from=2022-06-01&sortBy=popularity&apiKey=${API_KEY}`
		);
		const news: any = await listRsp.json();
		const arr: any = news.articles;
		const newsFeed: NewsInterface[] = [];
		if (arr.length >= 10) {
			for (let i = 0; i < 3; i++) {
				newsFeed.push({
					title: arr[i].title,
					description: arr[i].description,
					content: arr[i].url,
					source: arr[i].source.name,
					date: arr[i].publishedAt,
				});
			}
		} else {
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
		console.error(error);
	}
	
};


export {getNews};