import fs = require('fs');
import dotenv from 'dotenv';
import path from 'path';
import { promisify } from 'util';
import { Client } from 'discord.js';
import { Intents } from 'discord.js'; //tried { Client, Intents } didn't work :(
import childProcess = require('child_process');
import { TextChannel } from 'discord.js';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const exec = promisify(childProcess.exec);
const token = process.env.TOKEN;

//creating a client, with intent
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

//when client ready, get msg stream and check conditions below

client.on('ready', () => {
	console.log(client.user?.tag); //saying it
});

client.on('message', (msg: any) => {
	if (msg.content.toLowerCase() === 'hello') {
		msg.reply(`${msg.author} World!`);
	}

	if (msg.channel.id === '985288693189328997') {
		//this long number is the id of a channel
		(client.channels.cache.get('985273790592319552') as TextChannel).send({
			content: `${client.user?.tag} shared resource, check it out`,
		});
	}
	if (msg.content.startsWith('!compile')) {
		const code = msg.content;
		compile(msg, code);
	}
});

/*
compile will
write the received code to compile.js
use exec_code() to execute it and display it in chat 
*/
const compile = (msg: any, c: any) => {
	// msg.reply(`${msg.author} ${c}`)
	c = c.replace('!compile ', '');

	try {
		fs.writeFileSync(`${__dirname}/compile.js`, c);
		msg.reply('compiling...');

		const response = exec_code();
		response
			.then((data) => {
				console.log(data);
				msg.reply(`${data.toString()}`);
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
	const command = await exec('node compile.js');
	//we take only stdout
	return command.stdout.trim();
}

client.login(token);
