const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Pizza Bot!'));

app.listen(port, () => console.log(`PizzaBot is listening at http://localhost:${port}`));

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const utils = require("./utils.js");
require('discord-reply'); 

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//client.on('guildMemberAdd', member => {
//  const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
//  if (!channel) return;
//  channel.send(`Welcome pizzero, ${member}`);
//});

client.on('message', async message => {
  try{
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    if (message.author.id !== '363533283214098453' && message.channel && message.channel.id !== '853383729937121310') {
      const botChannel = client.channels.cache.get('853383729937121310').toString();
      message.channel.send('Please use the bot commands in ' + botChannel);
      return;
    }
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const best = client.emojis.cache.find(emoji => emoji.name === 'best');
    const hello = client.emojis.cache.find(emoji => emoji.name === 'hello');
    const pain = client.emojis.cache.find(emoji => emoji.name === 'pain');
    const calm = client.emojis.cache.find(emoji => emoji.name === 'calm');

    switch (command){
      case 'hello':
        const helloEmbed = new Discord.MessageEmbed()        
          .setTitle(`Hello ${hello} ${message.author.username}`)
        message.channel.send(helloEmbed)
        break;
      case 'rune':
      case 'rune-multiple':
        let [startLevel, endLevel, premiums, specials, epics, primes, piecesGoal, goibhniuFlag] = utils.getRuneArguments(args, command === 'rune-multiple');        
        let successRate = (utils.getPercentage(startLevel, endLevel, premiums, specials, epics, primes, piecesGoal, goibhniuFlag)).toFixed(2);

        let premiumString = premiums > 0 ? `**Premiums**: ${premiums}\n` : '';
        let specialString = specials > 0 ? `**Specials**: ${specials}\n` : '';
        let epicString = epics > 0 ? `**Epics**: ${epics}\n` : '';
        let primeString = primes > 0 ? `**Primes**: ${primes}\n` : '';
        let stoneType =  goibhniuFlag ? 'Goibhnius' : 'Paradises';
        let goibhniuString = '**Stones**: ' + stoneType;

        const runeEmbed = new Discord.MessageEmbed()
          .setTitle(`Success Rate: ${successRate}%`)
          .setThumbnail(successRate > 60 ? 'attachment://ferghus-normal.png' : 'attachment://ferghus-troll.png')
          .setDescription(`**Start Level: ${startLevel}\n Goal Level: ${endLevel}**`)
          .addFields(
            { name: 'Materials', value: premiumString + specialString + epicString + primeString + goibhniuString}
          )
        if(command === 'rune-multiple')
          runeEmbed.addFields(
            { name: 'Gear', value: `${piecesGoal} pieces`}
          )  
        message.channel.send({
          embed: runeEmbed,
          files: [{
            attachment: successRate > 60 ? 'ferghus-normal.png' : 'ferghus-troll.png',
            name: successRate > 60 ? 'ferghus-normal.png' : 'ferghus-troll.png'
          }]
        });

        break;
      case 'test':
        let [level, goibFlag] = args;        
        if (level < 2 || level > 20 || isNaN(level))
          message.channel.send(`Level must be between 2 and 20 ${calm}`);
        else{
          let testResult = utils.testEnhance(level, goibFlag) ? `Success ${best}` : `Fail ${pain}`;
          const testEmbed = new Discord.MessageEmbed()        
            .setTitle(testResult)
          message.channel.send(testEmbed)
        }        
        break;
      case 'foo':
        //const generalChannel = client.channels.cache.get('784606534147506199');
        const msg = args.join(' ');

        const botChannel = client.channels.cache.get('853383729937121310');
        botChannel.send(msg);        
        message.channel.send(msg);
        //emoji(client,'eyes')

        /*const guild = client.guilds.cache.get("784606534147506196");
        guild.members.fetch()
          .then(members => 
            members.forEach(member => !member.user.bot && console.log(member.user.username))
          )*/
        break;
      case 'foo2':
        const msg2 = args.join(' ');
        //client.channel.messages.fetch('900066657374974004')
        message.channel.messages.fetch('903049902618185758')
          .then(oldMsg => oldMsg.lineReply(msg2))
          .catch(console.error);

        /*const guild = client.guilds.cache.get("784606534147506196");
        guild.members.fetch()
          .then(members => 
            members.forEach(member => {
              if (member.user.bot){
                let hasRole = member.roles.cache.some(role => role.name === 'PizzaBot');
                console.log(member.user.username);
                console.log(hasRole);
              }
            })
          )*/
        
        
        break;

      case 'build':
        const buildEmbed = new Discord.MessageEmbed()
            .setTitle('Delia')
            .setThumbnail('attachment://delia.png')
            .setDescription('Build 1: 4 Fasts ES, 3 critical rate infusions (can be in any accesory), the rest is attack speed. Need perfect stones')
            .addFields(
              { name: 'Weapon', value: '**Scrolls**\n-Righteous\n-Valor\n**Infusion**\n-Critical +2', inline: true },
              { name: 'Helm', value: '**Scrolls**\n-Heartless\n-Enthusiastic\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Chest', value: '**Scrolls**\n-Well Balanced\n-Master\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Pants', value: '**Scrolls**\n-Heartless\n-Capture\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Boots', value: '**Scrolls**\n-Weeping\n-Capture\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Gloves', value: '**Scrolls**\n-Weeping\n-Echo\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Earring', value: '**Scrolls**\n-Arcane\n-Passion\n**Infusion**\n-Critical +2', inline: true },
              { name: 'Wings', value: '**Scrolls**\n-Arcane\n-Spellbound\n**Infusion**\n-None', inline: true },
              { name: 'Belt', value: '**Scrolls**\n-Fast\n-Passion\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Brooch', value: '**Scrolls**\n-Fast\n-Passion\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Necklace', value: '**Scrolls**\n-Fast\n-Passion\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Artifact', value: '**Scrolls**\n-Fast\n-Berserker\n**Infusion**\n-None', inline: true },
              { name: 'Ring', value: '**Scrolls**\n-The Dead\n-Passion\n**Infusion**\n-Attack Speed +1', inline: true },
              { name: 'Ring', value: '**Scrolls**\n-The Dead\n-Passion\n**Infusion**\n-Critical +2', inline: true },
              { name: 'Stones', value: '**Keen**:\t\t\t\t 29 Bal 31 Crit\n**LightWeight**: \t20 Crit\n**Stable**: \t\t\t  45 Bal\n**Perfect**: \t\t\t4700 Attack' },
              { name: 'Total Stats', value: '```Balance\t\t\t  90 \nCritical Rate\t\t138\nAttack Speed\t \t181\nCritical Damage\t  195```' },
            )
        client.channels.cache.get('839281657919045682').send({
          embed: buildEmbed,
          files: [{attachment: 'delia.png', name: 'delia.png'}]
        });
        break;
      case 'help':
      default:
        const helpEmbed = new Discord.MessageEmbed()
          .setTitle('Pizza Bot Commands')          
          .addFields(
            { name: 'Help', value: 'Get commands information\n**Usage**:\n``!help``', inline: false},
            { name: 'Hello', value: hello, inline: false },
            { name: 'Rune', value: 'Get an approximate success rate of an enhance given the start/end levels and the runes. Only the runes in the range of the levels are required.\n**Parameters**\n\``StartLevel`` (Integer): Value should be between 1 and 19\n``EndLevel`` (Integer): Value should be between 2 and 20\n``Premiums`` (Integer) [Optional]: Number of +10-13 runes\n``Specials`` (Integer) [Optional]: Number of +13-15 runes\n``Epics`` (Integer) [Optional]: Number of +15-18 runes\n``Primes`` (Integer) [Optional]: Number of +18-20 runes\n``GoibhniusFlag`` (Integer:0/1) [Optional]: 1 for Goibhnius rates\n**Usage**: \nGet the percentage to get from +18 to +20 with 30 prime runes\n`!rune 18 20 30 `\nPercentage from +17 to +20 with 25 epics and 30 primes using Goibhnius\n``!rune 17 20 25 30 1``', inline: false },
            { name: 'Rune-Multiple', value: 'Get an approximate success rate of an enhance given the stard/end levels and the runes for multiple pieces. Only the runes in the range of the levels are required.\n**Parameters**\n``StartLevel`` (Integer): Value should be between 1 and 19\n``EndLevel`` (Integer): Value should be between 2 and 20\n``Premiums`` (Integer) [Optional]: Number of +10-13 runes\n``Specials`` (Integer) [Optional]: Number of +13-15 runes\n``Epics`` (Integer) [Optional]: Number of +15-18 runes\n``Primes`` (Integer) [Optional]: Number of +18-20 runes\n``Pieces`` (Integer): Number of pieces to enhance (1-5)\n``GoibhniusFlag`` (Integer:0/1) [Optional]: 1 for Goibhnius rates\n**Usage**: \nGet the rate to get from +18 to +20 for 4 pieces with 30 prime runes\n`!rune-multiple 18 20 30 4`\nRate from +17 to +20 for 4 pieces with 25 epics and 30 primes with Goibs\n``!rune-multiple 17 20 25 30 4 1``', inline: false },
            { name: 'Test', value: 'Simulates an enhancement attempt.\n**Parameters**\n``Level`` (Integer): Value should be between 2 and 20\n**Usage**:\nAttempt to enhance from +19 to 20\n``!test 20``', inline: false }
          )
        message.channel.send(helpEmbed);
        break;
    }    
  }
  catch(e){
    message.channel.send(e.message);
  }
});

client.login(config.token).catch(console.error);