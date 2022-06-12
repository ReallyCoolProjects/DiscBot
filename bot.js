require("dotenv").config()
const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

const token = process.env.TOKEN
const {
    Client,
    Intents
} = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {
    console.log(client.user.tag)
})

client.on('message', msg => {
    if (msg.content.toLowerCase() === 'hello') {
        msg.reply(`${msg.author} World!`)
    }

    if (msg.channel.id === '985288693189328997') {
        client.channels.cache.get('985273790592319552').send({
            content: `${client.user.tag} shared ressource, check it out`
        });
    }
    if (msg.content.startsWith("!compile")) {
        let code = msg.content;
        compile(msg, code)
    }
})


const compile = (msg, c) => {
    // msg.reply(`${msg.author} ${c}`)
    c = c.replace("!compile ", "");


    try {
        fs.writeFileSync(`${__dirname}/compile.js`, c);
        msg.reply("compiling...")
        
        const response = exec_code('node compile.js');
        response.then(data =>{
            console.log(data)
            msg.reply(`${data.toString()}`)
            
        }).catch(err=>{
            msg.reply(`Error: ${err}`)
        })
        
    } catch (err) {
        console.error(err);
    }

}

async function exec_code(jcode){
    // Exec output contains both stderr and stdout outputs
    const command = await exec(`node compile.js`)
  
    return command.stdout.trim()
  };


client.login(token)