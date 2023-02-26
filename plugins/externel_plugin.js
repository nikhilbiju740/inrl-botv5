const { inrl } = require("../lib")
const { exec } = require("child_process");
const Config = require('../config')
const got = require("got");
const fs = require("fs");
const { add_plugin, dlt_plugin, getListOfPlugin } = require('../lib/database/pluginsdb')
const {getVar} = require('../lib/database/variable');
const { withValue } = require('../lib/database/groupdbs');
inrl(
	   {
	    pattern: ['restart'],
	    desc: 'to restart bot',
        sucReact: "😛",
        category: ["system", "all"],
        type : "system"
	   }, async (message, client, match, cmd) => {
	    if(!message.client.isCreator) return await message.replay("action only for owner!");
	    await message.reply('Restarting please await few second°s')
        process.exit(1);
	})
inrl(
	   {
	    pattern: ['install'],
	    desc: 'to install externel Plugin ',
        sucReact: "😛",
        category: ["system", "all"],
        type : "system"
        }, async (message, client, match, cmd) => {
	if(!message.client.isCreator) return await message.replay("action only for owner!");
	if(!match) return message.send("need url");
	if(!match.startsWith("http")) return message.reply("need Url!");
    message.reply("wait a minut!")
	let plugin_name, url = match.trim();
        let { body, statusCode } = await got(url).catch((e)=>{
        message.reply('not valid!')
       })
       if (statusCode == 200) {
       plugin_name = body.split("pattern")[1].split('[')[1].split(']')[0];
       plugin_name = plugin_name.includes("'") ? plugin_name.replaceAll("'", "") : plugin_name.replaceAll('"',"");
       plugin_name = plugin_name+"test";
       fs.writeFileSync(__dirname + "/" + plugin_name + ".js", body);
       try {
        require("./" + plugin_name);
       } catch (e) {
        fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
        return await message.reply(e);
       }
     await message.reply("newly installed plugin are "+plugin_name.split('test')[0])
     await add_plugin(plugin_name.split('test')[0], url)
     fs.unlinkSync(__dirname + "/" + plugin_name + ".js");
    }    
});
inrl(
	   {
	    pattern: ['plugins'],
	    desc: 'to get all externel Plugin ',
        sucReact: "😛",
        category: ["system", "all"],
        type : "system"
	   }, async (message, client, match, cmd) => {
	let valueie = await withValue();
	if(!message.client.isCreator) return await message.replay("action only for owner!");
    let text = "", name, urls;
    if(!match){
    let list = await getListOfPlugin();
    if(list == 'no data') return message.reply('externel plugins db is empty!')
    for (let i=0;i<list.length;i++) {
    name = list[i].name.replace(valueie,'');
    urls = list[i].url;
    text += name+"\n"+urls+"\n";
    }
    if(text){
    await message.reply(text)
    }else{
    message.send('no externel plugins!')
       }
    }
})

inrl(
	   {
		pattern: ['dlt'],
		desc: 'to remove externel Plugin ',
        sucReact: "🐽",
        category: ["system", "all"],
        type : "system"
	   }, async (message, client, match, cmd) => {
	   const {PREFIX,FOOTER} = await getVar();
	   let prefix  = PREFIX == 'false' ? '' : PREFIX;
	   let valueie = await withValue();
	   if(!message.client.isCreator) return await message.replay("action only for owner!");
       if(!match) return ;
       match = match.trim();
       let list = await getListOfPlugin(), name ="";
       if(list == 'no data') return message.reply('externel plugins db is empty!')
       for (let i=0;i<list.length;i++) {
       name = list[i].name.replace(valueie,'');
       if(name == match){
             await dlt_plugin(match)
           }
       }
const buttons = [
        { buttonId: prefix+"restart", buttonText: { displayText: "RESTART"}, type: 1, }
      ]
const caption = match+" plugin deleted from the database\nbut the plugins work for befor restarting\nthe project, as you want to remove this \nplugin permently from the code at this \nmomment! click the below \nrestart button"
const templateButtons = {
      text:'```'+caption+'```',
      footer:FOOTER,
      buttons: buttons,
      headerType: 1
    };
return await client.sendMessage(message.from,templateButtons, { quoted: message});
})
