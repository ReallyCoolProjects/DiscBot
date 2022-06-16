import fs = require('fs');
import dotenv from 'dotenv';
import path from 'path';
import { promisify } from 'util';
import { Client } from 'discord.js';
import { Intents } from 'discord.js'; //tried { Client, Intents } didn't work :(
import childProcess = require('child_process');
import { TextChannel } from 'discord.js';
import { getNews  }  from './news';
import { NewsInterface } from './interfaces';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const exec = promisify(childProcess.exec);
const token = process.env.TOKEN;


const retrieveData = async (msg: any, field: string)=>{
	await getNews(field).then(result => result).then(data=> {
		data.forEach((element: {
			title: string,
			description: string,
			content: string,
			source: string,
			date: string
		}) => {
			msg.reply('`' + `title: ${element.title} \ndescription: ${element.description} \ncontent: ${element.content} \nsource: ${element.source} \ndate: ${element.date}` + '`');
		});
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
	//!news !science 10/12/2022
	if (msg.content.startsWith('!news')) {
		const code = msg.content;
		//2022-05-01
		const commands: string[] = code.split(' ');
		const field: string = commands[1];
		retrieveData(msg, field);
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
