import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { promisify } from 'util';
import { Client } from 'discord.js'
import { Intents } from 'discord.js'; //tried { Client, Intents } didn't work :(
import childProcess from 'child_process';
import { TextChannel } from 'discord.js';
import { getNews  }  from './news';
import { API_ERROR } from './error';
import { getKenyeQuote } from './kanye';
import {getCryptoPrice} from './coinprice';
import {CryptoPriceInterface, WeatherInterface} from './interfaces';
import { getWeather } from './weather';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const exec = promisify(childProcess.exec);
const token = process.env.TOKEN;

/**
 * 
 * @param msg discord msg function
 * @param field news topic, choosed by user
 * retrieveData execute getNews, format the response and send it to chat
 */

const retrieveData = async (msg: any, field: string)=>{
	await getNews(field).then(result => result).then(data=> {
		data.forEach((element: {
			title: string,
			description: string,
			content: string,
			source: string,
			date: string
		}) => {
			console.log(element.description);
			msg.reply(`title: ${element.title} \ndescription: ${element.description} \ncontent: `+ (element.content) +` \nsource: ${element.source} \ndate: ${element.date}`);
		});
	}).catch(error => {
		throw new API_ERROR('Something went wrong while fetching data');
	});
	
};


const retrieveWeather = async(msg: any, location: string) =>{
	await getWeather(location).then(response => response).then(data =>{
		data.forEach((element: WeatherInterface) => {
			msg.reply(`\nCountry : ${element.country} \nCity : ${element.name} \nTemp : ${element.temp}°C \nFeels like : ${element.feelsLike}°C \nLowest temp. : ${element.tempMin}°C \nHighest temp. : ${element.tempMax}°C \nDescription: ${element.weatherDescription}\nHumidity : ${element.humidity}% `);
		});
	});
}

const retreivePrice = async (msg: any, field: string) =>{
	await getCryptoPrice(field).then(response=> response).then(data =>{
		data.forEach((element: CryptoPriceInterface) => {
			msg.reply(`id : ${element.id} \nsymbol : ${element.symbol} \nname : ${element.name} \nprice : $${String(element.price)} \nmarket cap rank : ${element.market_cap_rank} \nimage : ${element.image} \ngenesis date : ${element.genesis_date}`);
		});
	});
};

const retreiveQuote = async (msg: any) =>{
	await getKenyeQuote().then(response=> response).then(data =>{
		msg.reply(data);
	}).catch(e => {
		throw new API_ERROR('Something went wrong while fetching data');
	});
};
//creating a client, with intent
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

//when client ready, get msg stream and check conditions below

client.on('ready', () => {
	(client.channels.cache.get('985581831774687272') as TextChannel).send({
		content: 'Hey, i\'m online',
	}); //saying it
});

client.on('message', (msg: any) => {
	if (msg.content.toLowerCase() === 'hello') {
		msg.reply(`${msg.author} World!`);
	}

	if (msg.channel.id === '985125240147431434') {
		//this long number is the id of a channel
		(client.channels.cache.get('985572924998184990') as TextChannel).send({
			content: `${client.user?.tag} shared resource, check it out`,
		});
	}
	if (msg.content.startsWith('!compile')) {
		const code = msg.content;
		compile(msg, code);
	}
	if (msg.content.startsWith('!kanye')) {
		retreiveQuote(msg);
	}

	if (msg.content.startsWith('!crypto')) {
		const code = msg.content;
		const commands: string[] = code.split(' ');
		if(commands.length > 2){
			throw new API_ERROR('Unvalid request');
		}
		else{
			const field: string = commands[1];
			//will add other functions
			retreivePrice(msg, field);
		}
		
	}

	// weahter

	if(msg.content.startsWith('!weather')){
		const code = msg.content;
		const commands: string[] = code.split(' ');
		if(commands.length > 2){
			throw new API_ERROR('Unvalid request');
		} else {
			const location: string = commands[1];
			retrieveWeather(msg, location)
		}
	}
	
	//!news !science 10/12/2022
	if (msg.content.startsWith('!news')) {
		const code = msg.content;
		//2022-05-01
		const commands: string[] = code.split(' ');
		console.log(commands);
		
		if(commands.length > 2){
			throw new API_ERROR('Unvalid request');
		}
		else{
			const field: string = commands[1];
			//will add other functions
			retrieveData(msg, field);
		}
		
	}

	
});

/*
compile will
write the received code to compile.js
use exec_code() to execute it and display it in chat 
*/
const compile = (msg: any,  c: string) => {
	// msg.reply(`${msg.author} ${c}`)
	c = c.replace('!compile ', '');

	try {
		fs.writeFileSync(`${__dirname}/compile.js`, c);
		msg.reply('compiling...');

		const response = exec_code();
		response
			.then((data) => {
				console.log(data);
				msg.reply('`' + `${data.toString()}` + '`');
			})
			.catch((err) => {
				msg.reply(`Error: ${err}`);
			});
	} catch (err) {
		console.error(err);
	}
};

//exec_code will execute the code received by msg using exec() and returns output
async function exec_code() {
	// Exec output contains both stderr and stdout outputs
	// const chenge_dir = await exec('cd dist');
	const command = await exec('node dist/compile.js');
	//we take only stdout
	return command.stdout.trim();
}

client.login(token);
