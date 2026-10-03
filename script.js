const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

const texts={
en:{
apps:"Apps",categories:"Categories",about:"About",creator:"CREATED BY",
title:"Your digital space.",subtitle:"Discover simple, futuristic apps created by YhlasxSpace.",
explore:"Explore Apps",learn:"Learn More",created:"Created",
appsTitle:"Featured Apps",categoriesTitle:"Categories",
aboutTitle:"Small. Fast. Futuristic.",
aboutText:"YSpace is a simple home for applications created by YhlasxSpace.",
download:"Download APK"
},
tk:{
apps:"Programmalar",categories:"Kategoriýalar",about:"Biz barada",creator:"DÖREDEN",
title:"Seniň sanly giňişligiň.",subtitle:"YhlasxSpace tarapyndan döredilen ýönekeý we futuristik programmalary tap.",
explore:"Programmalara geç",learn:"Has köp",created:"Döredilen",
appsTitle:"Programmalar",categoriesTitle:"Kategoriýalar",
aboutTitle:"Kiçi. Çalt. Futuristik.",
aboutText:"YSpace YhlasxSpace tarapyndan döredilen programmalaryň ýönekeý merkezi.",
download:"APK ýüklä"
},
ru:{
apps:"Приложения",categories:"Категории",about:"О нас",creator:"СОЗДАТЕЛЬ",
title:"Твоё цифровое пространство.",subtitle:"Открой простые и футуристичные приложения от YhlasxSpace.",
explore:"Открыть приложения",learn:"Подробнее",created:"Создано",
appsTitle:"Приложения",categoriesTitle:"Категории",
aboutTitle:"Минимально. Быстро. Футуристично.",
aboutText:"YSpace это простое пространство для приложений от YhlasxSpace.",
download:"Скачать APK"
},
tr:{
apps:"Uygulamalar",categories:"Kategoriler",about:"Hakkında",creator:"GELİŞTİREN",
title:"Dijital alanın.",subtitle:"YhlasxSpace tarafından oluşturulan sade ve futuristik uygulamaları keşfet.",
explore:"Uygulamaları keşfet",learn:"Daha fazla",created:"Oluşturuldu",
appsTitle:"Uygulamalar",categoriesTitle:"Kategoriler",
aboutTitle:"Küçük. Hızlı. Futuristik.",
aboutText:"YSpace, YhlasxSpace tarafından oluşturulan uygulamalar için sade bir merkezdir.",
download:"APK İndir"
}
};

let lang=localStorage.getItem("yspaceLang")||(
navigator.language.startsWith("tk")?"tk":
navigator.language.startsWith("ru")?"ru":
navigator.language.startsWith("tr")?"tr":"en"
);

let apps=[];
let currentApp=null;

function t(k){return texts[lang][k]||texts.en[k]||k}

function applyLang(){
 document.documentElement.lang=lang;
 $$(".small-btn").forEach(b=>{
   if(b.id==="langBtn")b.textContent=lang.toUpperCase()
 });
 $$("[data-i18n]").forEach(e=>e.textContent=t(e.dataset.i18n));
 $("#search").placeholder=lang==="tk"?"Programma gözle...":lang==="ru"?"Поиск приложений...":lang==="tr"?"Uygulama ara...":"Search apps...";
}

function render(){
 const q=$("#search").value.toLowerCase().trim();
 const filtered=apps.filter(a=>{
   const name=a.i18n?.[lang]?.name||a.name;
   const desc=a.i18n?.[lang]?.description||a.description;
   return `${name} ${desc} ${a.category}`.toLowerCase().includes(q);
 });

 $("#appsGrid").innerHTML=filtered.length?filtered.map(card).join():
 `<div class="glass" style="padding:25px;color:var(--muted)">No apps found.</div>`;

 const cats=[...new Set(apps.map(a=>a.category))];
 $("#categoriesGrid").innerHTML=cats.map(c=>`
 <a href="#apps" class="category glass" data-category="${c}">
   <div class="category-icon">${icon(c)}</div>
   <b>${c}</b>
   <span>${apps.filter(a=>a.category===c).length} apps</span>
 </a>`).join("");

 $("#appCount").textContent=apps.length;
 $("#catCount").textContent=cats.length;
}

function card(a){
 const name=a.i18n?.[lang]?.name||a.name;
 const desc=a.i18n?.[lang]?.description||a.description;

 return `
 <article class="app glass">
   <img class="app-icon" src="${a.icon}" alt="${name}">
   <div class="app-content">
     <span class="tag">${a.category}</span>
     <h3>${name}</h3>
     <p>${desc}</p>
     <div class="app-bottom">
       <small>v${a.version}</small>
       <button class="view" onclick="openApp('${a.id}')">View →</button>
     </div>
   </div>
 </article>`;
}

function icon(c){
 return {
   Music:"♫",Video:"◉",Social:"⌁",AI:"✦",Tools:"⌘",Games:"◇"
 }[c]||"✦";
}

window.openApp=id=>{
 currentApp=apps.find(a=>a.id===id);
 if(!currentApp)return;

 const a=currentApp;
 const name=a.i18n?.[lang]?.name||a.name;
 const desc=a.i18n?.[lang]?.description||a.description;

 $("#modalIcon").src=a.icon;
 $("#modalCategory").textContent=a.category;
 $("#modalName").textContent=name;
 $("#modalDescription").textContent=desc;
 $("#modalVersion").textContent="v"+a.version;
 $("#modalAndroid").textContent=a.android;
 $("#modalSize").textContent=a.size;
 $("#modalFeatures").innerHTML=(a.features||[]).map(x=>`<span>${x}</span>`).join("");
 $("#downloadBtn").href=a.download;

 $("#modal").classList.add("show");
 document.body.style.overflow="hidden";
};

function closeModal(){
 $("#modal").classList.remove("show");
 document.body.style.overflow="";
}

$("#closeModal").onclick=closeModal;
$("#modal").onclick=e=>{
 if(e.target.id==="modal")closeModal();
};

$("#search").oninput=render;

$("#langBtn").onclick=()=>{
 $("#langMenu").style.display=$("#langMenu").style.display==="block"?"none":"block";
};

$$("[data-lang]").forEach(b=>{
 b.onclick=()=>{
   lang=b.dataset.lang;
   localStorage.setItem("yspaceLang",lang);
   $("#langMenu").style.display="none";
   applyLang();
   render();
 };
});

$("#themeBtn").onclick=()=>{
 const root=document.documentElement;
 const light=root.dataset.theme==="light";
 root.dataset.theme=light?"dark":"light";
 localStorage.setItem("yspaceTheme",light?"dark":"light");
 $("#themeBtn").textContent=light?"☼":"☾";
};

$("#menuBtn").onclick=()=>{
 $("#mobileMenu").classList.toggle("show");
};

$$(".mobile-menu a").forEach(a=>{
 a.onclick=()=>$("#mobileMenu").classList.remove("show");
});

document.addEventListener("click",e=>{
 const c=e.target.closest("[data-category]");
 if(c){
   const cat=c.dataset.category;
   $("#search").value=cat;
   render();
 }
});

document.addEventListener("pointerdown",e=>{
 const r=document.createElement("span");
 r.className="ring";
 r.style.left=e.clientX+"px";
 r.style.top=e.clientY+"px";
 $("#ripple").appendChild(r);
 setTimeout(()=>r.remove(),700);

 if(e.target.closest("button,.btn,a")&&navigator.vibrate)
   navigator.vibrate(6);
},{passive:true});

async function load(){
 try{
   const res=await fetch("apps.json");
   apps=await res.json();
   applyLang();
   render();
 }catch(e){
   $("#appsGrid").innerHTML=
   `<div class="glass" style="padding:25px">Could not load apps.json</div>`;
 }
}

const savedTheme=localStorage.getItem("yspaceTheme")||"dark";
document.documentElement.dataset.theme=savedTheme;
$("#themeBtn").textContent=savedTheme==="light"?"☾":"☼";

load();

if("serviceWorker"in navigator){
 window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
}