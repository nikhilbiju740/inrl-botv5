const moment = require('moment-timezone')
const {getVar}=require('../lib/database/variable');
const { inrl } = require('../lib/');
const {isInAutoDb,getAutomutes,getAutoUnMutes,add_Schedule,dlt_Schedule} = require('../lib/database/automation')

module.exports = async(msg, conn, m, store) => {
let time2,time1;
setInterval(async () => {
  let mute = await getAutomutes();
  if(mute!== 'no data') {
  mute.map(async({jid,time})=>{
  time2 = moment().tz('Asia/Kolkata').format('HH:mm');
  if(time2 == time){
  const groupMetadata = await conn.groupMetadata(jid).catch(e => {});
  const participants = await groupMetadata.participants;
  let admins = await participants.filter(v => v.admin !== null).map(v => v.id);
  if(!admins.includes(conn.user.jid)) return;
  return await conn.groupSettingUpdate(jid, "announcement");
     }
  })
}
  let unmute = await getAutoUnMutes();
  if(unmute == 'no data') return;
  unmute.map(async({jid,time})=>{
  time1 = moment().tz('Asia/Kolkata').format('HH:mm');
  if(time1 == time){
  const groupMetadata = await conn.groupMetadata(jid).catch(e => {});
  const participants = await groupMetadata.participants;
  let admins = await participants.filter(v => v.admin !== null).map(v => v.id);
  if(!admins.includes(conn.user.jid)) return;
  return await conn.groupSettingUpdate(jid, "not_announcement");
    }
  })
 }, 1000 * 20);
}
//automaton plugins
inrl({
    pattern: ['automute'],
    desc: 'auto mute groups',
    sucReact: "🙃",
    category: ["system", "all"],
    type : "general"
    },
  async (message, client, match) => {
  let {AUTOMUTE_MSG} = await getVar();
  if(!message.client.isCreator) return message.send('only for owner!');
  if(!message.isGroup) return message.reply('this plugin only work on group');
  const groupMetadata = message.isGroup ? await client.groupMetadata(message.from).catch(e => {}) : ''
  const participants = message.isGroup ? await groupMetadata.participants : ''
  let admins = message.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
  if(!admins.includes(message.sender)) return message.reply('make me admin i can do this');
  if(!match.match(':'))return message.reply('need time (example :- 23:59)')
  let [hr,mn] = match.split(':');
  if(hr.length == 1) hr = '0'+hr;
  if(mn.length == 1) mn = '0'+mn;
  if(isNaN(hr)||isNaN(mn)) return message.reply('need number; ex:- automute 22:22');
  await add_Schedule(message.from,`${hr}:${mn}`,'mute')
  let ast = hr>12? `${hr-12}:${mn}PM`:`${hr}:${mn}AM`;
  ast = AUTOMUTE_MSG.replace('@time',ast)
  return message.reply(ast)
  });
inrl({
    pattern: ['autounmute'],
    desc: 'unmute a group',
    sucReact: "🙂",
    category: ["system", "all"],
    type : "general"
    },
    async (message, client, match) => {
    let {AUTOUNMUTE_MSG} = await getVar();
    if(!message.client.isCreator) return message.send('only for owner!');
    if(!message.isGroup) return message.reply('this plugin only work on group');
    const groupMetadata = message.isGroup ? await client.groupMetadata(message.from).catch(e => {}) : ''
	   const participants = message.isGroup ? await groupMetadata.participants : ''
           let admins = message.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : ''
  if(!admins.includes(message.sender)) return message.reply('make me admin i can do this');
  if(!match.match(':'))return message.reply('need time (example :- 23:59)')
  let [hr,mn] = match.split(':')
  if(hr.length == 1) hr = '0'+hr;
  if(mn.length == 1) mn = '0'+mn;
  if(isNaN(hr)||isNaN(mn)) return message.reply('need number; ex:- autounmute 22:22');
  await add_Schedule(message.from,`${hr}:${mn}`,'unmute')
  let ast = hr>12? `${hr-12}:${mn}PM`:`${hr}:${mn}AM`;
  ast = AUTOUNMUTE_MSG.replace('@time',ast)
  return message.reply(ast)
})
