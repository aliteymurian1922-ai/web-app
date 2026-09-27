import express from 'express';
import pg from 'pg';

const {Pool}=pg;
const app=express();
app.use(express.json({limit:'1mb'}));

const PORT=Number(process.env.PORT||10000);
const BOT=process.env.TELEGRAM_BOT_TOKEN||'';
const WSECRET=process.env.TELEGRAM_WEBHOOK_SECRET||'';
const PAIR=(process.env.PAIRING_CODE||'').trim().toUpperCase();
const CRON=process.env.CRON_TOKEN||'';
const DB=process.env.DATABASE_URL||'';
const BASE=(process.env.PUBLIC_BASE_URL||process.env.RENDER_EXTERNAL_URL||'').replace(/\/$/,'');
const pool=DB?new Pool({connectionString:DB,ssl:process.env.DATABASE_SSL==='true'?{rejectUnauthorized:false}:false,max:5}):null;

const seed=[
['uniqme','Uniqme','client',90000000,40000000,0,1,'رسیدن به milestone پرداخت بعدی'],
['spad','Spad','client',60000000,30000000,0,1,'تکمیل تعهدات و پیشنهاد پشتیبانی/SEO'],
['velora','Velora','client',20000000,12000000,0,1,'تحویل سریع و تعریف نگهداری ماهانه'],
['nirvana','Nirvana','owned',0,0,268000000,1,'تبدیل موجودی به نقدینگی خالص برای کاهش بدهی'],
['nexa','Nexa','owned',0,0,0,2,'گرفتن اولین مشتری پولی'],
['saeed-sodouri','آموزشگاه نقاشی سعید صدوری','revenue_share',0,0,0,3,'ساخت MVP فروش یک دوره و تست تقاضا'],
['arses','Arses Perfume','friend',0,0,0,4,'اجرای آزمایش‌های محدود فروش'],
['mojtaba','مجتبی سیاح','team',0,0,0,3,'ثبت تعهد و خروجی بعدی تیم']
];
const aliases={
uniqme:['uniqme','یونیک','یونیکمی','یونیک می'],spad:['spad','اسپاد'],velora:['velora','ولورا'],
nirvana:['nirvana','نیروانا'],nexa:['nexa','نکسا'],'saeed-sodouri':['سعید صدوری','صدوری'],
arses:['arses','آرسس'],mojtaba:['مجتبی سیاح','مجتبی','سیاح']
};
const fa='۰۱۲۳۴۵۶۷۸۹', ar='٠١٢٣٤٥٦٧٨٩';
const digits=s=>String(s).replace(/[۰-۹]/g,d=>fa.indexOf(d)).replace(/[٠-٩]/g,d=>ar.indexOf(d));
const fmt=n=>Number(n||0).toLocaleString('fa-IR');
const money=n=>Number(n||0)>=1e6?`${(Number(n)/1e6).toLocaleString('fa-IR',{maximumFractionDigits:1})} میلیون`:fmt(n);
function amount(text){
  const m=digits(text).replace(/,/g,'').match(/(\d+(?:\.\d+)?)\s*(میلیون|م(?:\s|$)|هزار)?/);
  if(!m)return null;let n=Number(m[1]);
  if(m[2]?.startsWith('میلیون')||m[2]?.trim()==='م')n*=1e6;else if(m[2]?.startsWith('هزار'))n*=1e3;
  return Math.round(n);
}
function projectCode(text){const l=text.toLowerCase();for(const [c,a] of Object.entries(aliases))if(a.some(x=>l.includes(x.toLowerCase())))return c;return null}
function availableMinutes(text){const t=digits(text);const m=t.match(/(\d+(?:\.\d+)?)\s*ساعت/);if(m)return Math.round(Number(m[1])*60);const w={نیم:30,یک:60,دو:120,سه:180,چهار:240};for(const[k,v]of Object.entries(w))if(t.includes(k+' ساعت'))return v;return 120}

async function init(){
 if(!pool)return;
 await pool.query(`
 create extension if not exists pgcrypto;
 create table if not exists bot_users(id uuid primary key default gen_random_uuid(),telegram_user_id bigint unique not null,chat_id bigint not null,first_name text,username text,is_active boolean default true,paired_at timestamptz default now());
 create table if not exists projects(id uuid primary key default gen_random_uuid(),code text unique not null,name text not null,kind text not null,status text default 'active',contract_value bigint default 0,received_amount bigint default 0,debt_amount bigint default 0,progress_percent smallint default 0,priority smallint default 3,next_action text,updated_at timestamptz default now());
 create table if not exists tasks(id uuid primary key default gen_random_uuid(),project_id uuid references projects(id) on delete cascade,title text not null,status text default 'todo',priority smallint default 3,estimate_minutes integer,financial_impact bigint default 0,strategic_impact smallint default 0,completed_at timestamptz,created_at timestamptz default now());
 create table if not exists finance_entries(id uuid primary key default gen_random_uuid(),project_id uuid references projects(id) on delete set null,entry_type text not null,amount bigint not null,note text,occurred_at timestamptz default now());
 create table if not exists updates(id uuid primary key default gen_random_uuid(),project_id uuid references projects(id) on delete cascade,summary text not null,progress_percent smallint,source_text text,created_at timestamptz default now());
 create table if not exists messages(id uuid primary key default gen_random_uuid(),telegram_user_id bigint,direction text not null,message_text text,created_at timestamptz default now());
 `);
 for(const p of seed)await pool.query(`insert into projects(code,name,kind,contract_value,received_amount,debt_amount,priority,next_action) values($1,$2,$3,$4,$5,$6,$7,$8) on conflict(code) do nothing`,p);
}

async function api(method,payload){
 if(!BOT)throw new Error('missing telegram token');
 const r=await fetch(`https://api.telegram.org/bot${BOT}/${method}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
 const j=await r.json();if(!j.ok)throw new Error(j.description||method);return j.result;
}
const keyboard={keyboard:[[{text:'📋 امروز چی کار کنم؟'},{text:'📁 وضعیت پروژه‌ها'}],[{text:'💰 وضعیت مالی'},{text:'✅ تسک‌ها'}],[{text:'📊 گزارش هفتگی'},{text:'ℹ️ راهنما'}]],resize_keyboard:true};
async function send(chat,text){await api('sendMessage',{chat_id:chat,text,parse_mode:'HTML',disable_web_page_preview:true,reply_markup:keyboard})}
async function auth(uid){if(!pool)return false;const r=await pool.query('select 1 from bot_users where telegram_user_id=$1 and is_active=true',[uid]);return !!r.rowCount}
async function pair(update){
 if(!pool)return 'دیتابیس هنوز متصل نشده است.';
 const m=update.message,code=(m.text.split(/\s+/)[1]||'').toUpperCase();
 if(!PAIR||code!==PAIR)return 'کد اتصال درست نیست.';
 const e=await pool.query('select telegram_user_id from bot_users where is_active=true limit 1');
 if(e.rowCount&&String(e.rows[0].telegram_user_id)!==String(m.from.id))return 'این دستیار قبلاً به یک حساب متصل شده است.';
 await pool.query(`insert into bot_users(telegram_user_id,chat_id,first_name,username) values($1,$2,$3,$4) on conflict(telegram_user_id) do update set chat_id=excluded.chat_id,is_active=true`,[m.from.id,m.chat.id,m.from.first_name||null,m.from.username||null]);
 return '✅ دستیار به حساب شما متصل شد.';
}
async function projects(){
 const r=await pool.query(`select * from projects where status='active' order by priority,name`);
 return '<b>📁 وضعیت پروژه‌ها</b>\n\n'+r.rows.map(p=>{const rem=Math.max(0,Number(p.contract_value)-Number(p.received_amount));return `• <b>${p.name}</b> — ${fmt(p.progress_percent)}٪${p.contract_value>0?' | مانده '+money(rem):''}${p.debt_amount>0?' | بدهی '+money(p.debt_amount):''}\n↳ ${p.next_action||'قدم بعدی ثبت نشده'}`}).join('\n\n');
}
async function finances(){
 const r=await pool.query(`select * from projects where status='active'`);let total=0,lines=[];
 for(const p of r.rows){const rem=Math.max(0,Number(p.contract_value)-Number(p.received_amount));if(rem){total+=rem;lines.push(`• ${p.name}: ${money(rem)}`)}}
 const nir=r.rows.find(x=>x.code==='nirvana');
 const f=await pool.query(`select entry_type,coalesce(sum(amount),0)::bigint amount from finance_entries where occurred_at>=now()-interval '7 days' group by entry_type`);
 const s=Object.fromEntries(f.rows.map(x=>[x.entry_type,Number(x.amount)]));
 return `<b>💰 وضعیت مالی</b>\n\nمطالبات: <b>${money(total)}</b>\n${lines.join('\n')}\n\n<b>Nirvana</b>\nبدهی: ${money(nir?.debt_amount||0)}\nفروش ۷ روز: ${money(s.sale||0)}\nپرداخت بدهی ۷ روز: ${money(s.debt_payment||0)}`;
}
async function taskList(){
 const r=await pool.query(`select t.*,p.name project_name from tasks t left join projects p on p.id=t.project_id where t.status in('todo','doing','blocked') order by t.priority,created_at limit 20`);
 if(!r.rowCount)return '<b>✅ تسک‌ها</b>\n\nفعلاً تسک بازی ثبت نشده.';
 return '<b>✅ تسک‌های باز</b>\n\n'+r.rows.map((t,i)=>`${i+1}. <b>${t.title}</b>${t.project_name?' — '+t.project_name:''}${t.estimate_minutes?' · '+fmt(t.estimate_minutes)+' دقیقه':''}`).join('\n');
}
async function plan(minutes=120){
 const tr=await pool.query(`select t.*,p.name project_name from tasks t left join projects p on p.id=t.project_id where t.status in('todo','doing') order by t.priority,financial_impact desc,strategic_impact desc limit 8`);
 const pr=await pool.query(`select * from projects where status='active' order by priority,(contract_value-received_amount) desc limit 8`);
 let left=minutes,picks=[];
 for(const t of tr.rows){const est=Number(t.estimate_minutes||45);if(picks.length<3&&(est<=left||!picks.length)){const use=Math.min(est,left);picks.push([t.project_name||'عمومی',t.title,use,t.financial_impact>0?'اثر مالی '+money(t.financial_impact):'تسک اولویت‌دار']);left-=use}}
 for(const p of pr.rows){if(picks.length>=3||left<15)break;if(picks.some(x=>x[0]===p.name))continue;const rem=Math.max(0,Number(p.contract_value)-Number(p.received_amount));const use=Math.min(60,left);picks.push([p.name,p.next_action||'قدم بعدی پروژه',use,rem?'نزدیک‌کردن '+money(rem)+' به وصول':'اثر استراتژیک']);left-=use}
 return `<b>📋 برنامه ${fmt(minutes)} دقیقه‌ای</b>\n\n`+picks.map((x,i)=>`${i+1}. <b>${x[0]}</b> — ${x[1]}\n⏱ ${fmt(x[2])} دقیقه\n🎯 ${x[3]}`).join('\n\n');
}
async function weekly(){const f=await finances();const d=await pool.query(`select count(*)::int c from tasks where status='done' and completed_at>=now()-interval '7 days'`);return `<b>📊 گزارش هفتگی</b>\n\nتسک تکمیل‌شده: ${fmt(d.rows[0].c)}\n\n${f.replace('<b>💰 وضعیت مالی</b>\n\n','')}\n\nتمرکز: وصول پروژه‌ها، سپس Nirvana، بعد Nexa.`}
async function payment(code,n,text){
 const c=await pool.connect();try{await c.query('begin');const r=await c.query('select * from projects where code=$1 for update',[code]);if(!r.rowCount)throw Error('project');const p=r.rows[0],next=Number(p.received_amount)+n;await c.query('update projects set received_amount=$1,updated_at=now() where id=$2',[next,p.id]);await c.query(`insert into finance_entries(project_id,entry_type,amount,note) values($1,'payment_received',$2,$3)`,[p.id,n,text]);await c.query('commit');return `✅ ${p.name}: دریافت ${money(n)} ثبت شد.\nمانده: ${money(Math.max(0,Number(p.contract_value)-next))}`}catch(e){await c.query('rollback');throw e}finally{c.release()}
}
async function sale(n,text){const p=await pool.query(`select id from projects where code='nirvana'`);await pool.query(`insert into finance_entries(project_id,entry_type,amount,note) values($1,'sale',$2,$3)`,[p.rows[0].id,n,text]);return `✅ فروش Nirvana: ${money(n)} ثبت شد.\nبدهی را کم نکردم؛ فقط پرداخت واقعی بدهی آن را کاهش می‌دهد.`}
async function debt(n,text){const c=await pool.connect();try{await c.query('begin');const r=await c.query(`select * from projects where code='nirvana' for update`),p=r.rows[0],next=Math.max(0,Number(p.debt_amount)-n);await c.query('update projects set debt_amount=$1,updated_at=now() where id=$2',[next,p.id]);await c.query(`insert into finance_entries(project_id,entry_type,amount,note) values($1,'debt_payment',$2,$3)`,[p.id,n,text]);await c.query('commit');return `✅ پرداخت بدهی ${money(n)} ثبت شد.\nبدهی باقی‌مانده: ${money(next)}`}catch(e){await c.query('rollback');throw e}finally{c.release()}}
async function progress(code,n,text){const r=await pool.query('update projects set progress_percent=$1,updated_at=now() where code=$2 returning id,name',[n,code]);if(!r.rowCount)return 'پروژه پیدا نشد.';await pool.query('insert into updates(project_id,summary,progress_percent,source_text) values($1,$2,$3,$4)',[r.rows[0].id,'progress',n,text]);return `✅ پیشرفت ${r.rows[0].name}: ${fmt(n)}٪`}
async function addTask(code,title){const p=code?await pool.query('select id,name from projects where code=$1',[code]):{rowCount:0,rows:[]};await pool.query(`insert into tasks(project_id,title,status,priority) values($1,$2,'todo',3)`,[p.rowCount?p.rows[0].id:null,title]);return `✅ تسک ثبت شد${p.rowCount?' برای '+p.rows[0].name:''}:\n${title}`}
const help=()=>`<b>دستیار پروژه شخصی</b>\n\nنمونه‌ها:\n• ولورا ۸ میلیون پرداخت کرد\n• یونیک ۷۰ درصد شد\n• نیروانا امروز ۱۲ میلیون فروش داشت\n• ۵ میلیون از بدهی نیروانا پرداخت کردم\n• برای اسپاد تسک بررسی صفحه محصول اضافه کن\n• الان دو ساعت وقت دارم چی کار کنم؟\n\n/projects /money /today /tasks /weekly /help`;

async function handle(u){
 const m=u.message,text=(m.text||'').trim(),uid=m.from.id;
 if(pool)await pool.query(`insert into messages(telegram_user_id,direction,message_text) values($1,'in',$2)`,[uid,text]);
 if(text.startsWith('/pair '))return pair(u);
 if(!(await auth(uid)))return 'این دستیار خصوصی است. دستور /pair CODE را بفرست.';
 const clean=text.replace(/^[^\p{L}\p{N}/]+/u,'').trim();
 if(['/start','/help'].includes(clean)||text.includes('راهنما'))return help();
 if(clean==='/projects'||text.includes('وضعیت پروژه'))return projects();
 if(clean==='/money'||text.includes('وضعیت مالی')||text.includes('چقدر طلب'))return finances();
 if(clean==='/tasks'||text.includes('تسک‌ها'))return taskList();
 if(clean==='/weekly'||text.includes('گزارش هفتگی'))return weekly();
 if(clean==='/today'||text.includes('امروز چی کار')||text.includes('وقت دارم'))return plan(availableMinutes(text));
 const code=projectCode(text),n=amount(text),norm=digits(text);
 if(text.includes('نیروانا')&&text.includes('فروش')&&n)return sale(n,text);
 if(text.includes('بدهی')&&n&&/(پرداخت|کم کردم|تسویه)/.test(text))return debt(n,text);
 if(code&&n&&/(پرداخت|واریز|دریافت|گرفتم|تسویه)/.test(text))return payment(code,n,text);
 const pm=norm.match(/(\d{1,3})\s*درصد/);if(code&&pm)return progress(code,Math.min(100,Number(pm[1])),text);
 if(/تسک|کار جدید/.test(text)){let title=text.replace(/تسک|اضافه کن|ثبت کن|[«»"]/g,' ').replace(/\s+/g,' ').trim();return addTask(code,title)}
 return 'منظور دقیق را نگرفتم. کوتاه‌تر بنویس؛ مثلاً «ولورا ۸ میلیون پرداخت کرد».';
}

app.get('/health',async(_q,r)=>{let db='missing';if(pool)try{await pool.query('select 1');db='ok'}catch{db='error'}r.json({ok:true,database:db,telegram:BOT?'configured':'missing'})});
app.get('/',(_q,r)=>r.send('Personal Project Assistant is running.'));
app.post('/telegram/webhook',async(q,r)=>{if(WSECRET&&q.headers['x-telegram-bot-api-secret-token']!==WSECRET)return r.status(401).json({ok:false});r.json({ok:true});try{if(q.body?.message?.text)await send(q.body.message.chat.id,await handle(q.body))}catch(e){console.error(e)}});
app.all('/cron/:type',async(q,r)=>{try{if(!CRON||(q.headers['x-cron-token']||q.query.token)!==CRON)return r.status(401).json({ok:false});const u=await pool.query('select chat_id from bot_users where is_active=true limit 1');if(!u.rowCount)return r.status(409).json({ok:false});const body=q.params.type==='weekly'?await weekly():await plan(q.params.type==='morning'?180:150);await send(u.rows[0].chat_id,body);r.json({ok:true})}catch(e){console.error(e);r.status(500).json({ok:false})}});
async function setup(){if(!BOT||!BASE)return;try{const me=await api('getMe',{});await api('setWebhook',{url:BASE+'/telegram/webhook',secret_token:WSECRET||undefined,allowed_updates:['message']});console.log('webhook ready @'+me.username)}catch(e){console.error('telegram setup',e.message)}}
(async()=>{try{await init();console.log('db ready')}catch(e){console.error('db init',e.message)}app.listen(PORT,'0.0.0.0',async()=>{console.log('listening '+PORT);await setup()})})();