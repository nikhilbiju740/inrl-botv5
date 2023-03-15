const {ytdl} = require('whatsapp-bot-pack')
const { getRandom, getBuffer } = require('./cloud');
let {yts} = require("whatsapp-bot-pack");
const fs = require('fs')
let videotime = 9000 // 200 min
let dlsize = 300 // 300mb
const {getVar}=require('./database/variable');
const got = require('got');
const { BASE_URL } = require('../config');
async function getYtV(m, c){
    let data = await getVar();
    let {PREFIX,FOOTER,BOT_INFO,CAPTION} = data.data[0];
    let prefix =PREFIX =='false'?'':PREFIX;
const t = m.client.text;
if(!t.includes('http')){
try {
let search = await yts(t)
listSerch = []
            teskd = `\nResult got from ${t}.\n`
            for (let i of search.all) {
                listSerch.push({
                    title: i.title,
                    rowId: `${prefix}ytmp4 ${i.url}`,
                    description: `time : / ${i.timestamp}`
                })
            }
const sections = [

                {
                    title: "Total Search🔍" + search.all.length,
                    rows: listSerch
                }

            ]
            const listMessage = {
                text: teskd,
                footer: FOOTER,
                title: `_your request  will been accepted with reasonable output by ${BOT_INFO.split(',')[0]}._`,
                buttonText: "VIDEOS",
                sections
            }
await c.sendMessage( m.from, listMessage, { quoted: m });
          } catch(e){
         return await m.send(""+e)
        }
    } else {
    let urlYt = t.trim();
            try {
                if (!urlYt.includes("http")) return m.reply(`your youtube link is not valid or not a yt link`);
                let infoYt = await ytdl.getInfo(urlYt);
                if (infoYt.videoDetails.lengthSeconds >= videotime) return m.reply(` Video file too big!`);
                let titleYt = infoYt.videoDetails.title;
                let randomName = getRandom(".mp4");

                const stream = ytdl(urlYt, {
                        filter: (info) => info.itag == 22 || info.itag == 18,
                    })
                    .pipe(fs.createWriteStream(`./${randomName}`));
                await new Promise((resolve, reject) => {
                    stream.on("error", reject);
                    stream.on("finish", resolve);
                });
                let stats = fs.statSync(`./${randomName}`);
                let fileSizeInBytes = stats.size;
                let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                if (fileSizeInMegabytes <= dlsize) {
                    let search = await yts(t);
                    let buttonMessage = {
                        video: fs.readFileSync(`./${randomName}`),caption :CAPTION
                    }
await c.sendMessage( m.from, buttonMessage, { quoted: m });
   } else {
                    m.reply(`we think File size bigger than 80mb.`);
                        }
                  fs.unlinkSync(`./${randomName}`);
                 } catch (e) {
                return await m.send("error\n"+e);
          }
     }
}

async function getYtA(m, c){
    let data = await getVar();
    let {PREFIX,FOOTER,BOT_INFO,CAPTION} = data.data[0];
    let prefix =PREFIX =='false'?'':PREFIX;
let t = m.client.text.trim();
if(!t.includes('http')){
try {
let search = await yts(t)
            listSerch = []
            teskd = `Result for ${search.all[0].title}.\n+ ${search.all.length} more results.`
            for (let i of search.all) {
                listSerch.push({
                    title: i.title,
                    rowId: `${prefix}ytmp3 ${i.url}`,
                    description: `time :/ ${i.timestamp}`
                })
            }
            const sections = [

                {
                    title: "Total Search🔍" + search.all.length,
                    rows: listSerch
                }

            ]
            const listMessage = {
                text: teskd,
                footer: FOOTER,
                title: ``,
                buttonText: "SONGS",
                sections
            }
await c.sendMessage( m.from, listMessage, { quoted: m });
      } catch (e){
      m.send("error\n"+e)
      }
    } else {
    try {
            let urlYt = t;
            let infoYt = await ytdl.getInfo(urlYt);
            //30 MIN
            if (infoYt.videoDetails.lengthSeconds >= videotime) {
                reply(` can't possble to download that long audio!`);
                return;
            }
            let titleYt = infoYt.videoDetails.title;
            let randomName = getRandom(".mp3");
            const stream = ytdl(urlYt, {
                    filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
                })
                .pipe(fs.createWriteStream(`./${randomName}`));
                await new Promise((resolve, reject) => {
                stream.on("error", reject);
                stream.on("finish", resolve);
            });

            let stats = fs.statSync(`./${randomName}`);
            let fileSizeInBytes = stats.size;
            let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMegabytes <= dlsize) {
                let search = await yts(t);
                let buttonMessage = {
                    audio: fs.readFileSync(`./${randomName}`),
                    mimetype: 'audio/mpeg',
                    fileName: titleYt + ".mp3",
                    headerType: 4,
                    contextInfo: {
                        externalAdReply: {
                            title: titleYt,
                            body: m.client.pushName,
                            renderLargerThumbnail: true,
                            thumbnailUrl: search.all[0].thumbnail,
                            mediaUrl: t,
                            mediaType: 1,
                            thumbnail: await getBuffer(search.all[0].thumbnail),
                            sourceUrl: t,
                        },
                    },
                }
                return c.sendMessage(m.from, buttonMessage, { quoted: m })
            } else {
                m.send(`we think File size bigger than 60mb.`);
            }
            fs.unlinkSync(`./${randomName}`);
        } catch (e) {
            m.send("error\n"+e)
      } 
    }
  }
async function weather(message, client){
           const text = message.client.text;
	    if (!text) return await client.sendMessage( message.from, { text: 'Enter A location'}, { quoted: message });
	    const url = `http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=tr`;
	    try {
		    const response = await got(url);
		    const json = JSON.parse(response.body);
		    if (response.statusCode === 200) return await client.sendMessage( message.from, { text:'climet of ' +text+ ' is \n\n' +
		     '🌄 ᴛᴇᴍʀᴀᴛᴜʀᴇ:-' + json.main.temp_max + '\n'+
		     '💖 ᴅᴇꜱᴄʀᴩᴛɪᴏɴ:-' + json.weather[0].description + '\n'+
		     '☀ ʜᴜᴍɪᴅɪᴛy    :-' + json.main.humidity +  '\n'+
		     '💨 ᴡɪɴᴅ            :-' + json.wind.speed + 'm/s\n'+
		     '🎇 ᴄʟᴏᴜᴅ          :-' + json.clouds.all + '\n' }, { quoted: message });
	    } catch {
		     await client.sendMessage( message.from, { text : "no data found on this location"},{ quoted: message });
     }
}

async function movie(message, client){
try {
    let data = await getVar();
    let {PREFIX,FOOTER,BOT_INFO,CAPTION} = data.data[0];
    let prefix =PREFIX =='false'?'':PREFIX;
    let text = message.client.text,
                sectionss = [],
                sec2 = `\nResult for ${text}.\n`
	if (!text) return await client.sendMessage( message.from, { text: 'Enter A filim name'}, { quoted: message });
	let url = `${BASE_URL}api/film?name=${text}`
	const response = await got(url);
	const json = JSON.parse(response.body).result;
	if(!response.body.status == 'true') return await mesage.reply('no data found error!');
	for (let i of json) {
                sectionss.push({
                    title: i.name,
                    rowId: `${prefix}getfilm ${i.name}`,
                    description: `quality/${i.quality}, type/${i.type},  uploaded/${i.upload}`
                })
            }
            const sections = [

                {
                    title: "Total Search🔍" + json.length,
                    rows: sectionss
                }

            ]
            const listMessage = {
                text: sec2,
                footer: FOOTER,
                title: json[0].name,
                buttonText: "RESULTS",
                sections
            }
	return await client.sendMessage(message.from, listMessage, { quoted: message });
	} catch (e){
	return await message.reply(e);
  }
}
async function getFilm(message, client, match){
try {
let url = `${BASE_URL}api/film?name=${match}`;
	const response = await got(url);
	const json = JSON.parse(response.body).result;
	let {name,quality,type,upload,link,thumb} = json[0];
	return await client.sendMessage(message.from, {image:{url:thumb}, caption :`name :${name}\nquality : ${quality}\ntype : ${type}\nuploaded : ${upload}\nlink : ${link}`});
	} catch (e){
	return await message.reply(e);
	 }
}
async function Insta(m, conn, surl){
    let data = await getVar();
    let {PREFIX,FOOTER,BOT_INFO,CAPTION} = data.data[0];
try {
if(!surl.includes('instagram')){
     return await m.reply('need Instagram url');
  }
  let urll = `${BASE_URL}api/insta?url=${surl}`;
  let {body} = await got(urll);
  body = JSON.parse(body)
  let url = body.result.url,
       type = body.result.type;
       return await conn.sendMessage(m.from, {[type]:{url:url}, caption:CAPTION});
 } catch(e){
   return await m.reply(e);
   }
}
module.exports = { getYtV, getYtA, weather, movie, getFilm, Insta }
