var zt=Object.defineProperty;var Kt=(e,r,a)=>r in e?zt(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a;var W=(e,r,a)=>Kt(e,typeof r!="symbol"?r+"":r,a);import{j as t,M as Vt,r as Wt}from"./markdown-vendor-QgW8DKCn.js";import{b as Yt,r as R,R as le,H as Qt,c as Xt,d as Z,u as Jt,N as Zt}from"./react-vendor-BrMZ_TUQ.js";import{U as xt,C as ge,S as er,a as et,b as tr,c as rr,H as sr,M as ar,L as nr,d as or,F as ir,R as cr,P as lr,B as Ne,e as tt,f as ft,g as pr,h as rt,i as Q,j as Re,k as Be,l as dr,m as mr,Z as yt,n as bt,o as ur,p as ve,G as gr,q as hr,r as xr,X as wt,s as Oe,t as Ie,A as fr,u as yr,T as br,v as he,w as wr,x as Ue,y as At,z as kt,D as _t,E as Et,I as Ar,J as kr,K as _r,N as Er,O as Tr,Q as vr,V as Dr}from"./ui-vendor-BFTThhA6.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();var pe={},st;function Sr(){if(st)return pe;st=1;var e=Yt();return pe.createRoot=e.createRoot,pe.hydrateRoot=e.hydrateRoot,pe}var Cr=Sr();function Tt(e){var r,a,s="";if(typeof e=="string"||typeof e=="number")s+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(r=0;r<o;r++)e[r]&&(a=Tt(e[r]))&&(s&&(s+=" "),s+=a)}else for(a in e)e[a]&&(s&&(s+=" "),s+=a);return s}function Nr(){for(var e,r,a=0,s="",o=arguments.length;a<o;a++)(e=arguments[a])&&(r=Tt(e))&&(s&&(s+=" "),s+=r);return s}const Rr=(e,r)=>{const a=new Array(e.length+r.length);for(let s=0;s<e.length;s++)a[s]=e[s];for(let s=0;s<r.length;s++)a[e.length+s]=r[s];return a},Br=(e,r)=>({classGroupId:e,validator:r}),vt=(e=new Map,r=null,a)=>({nextPart:e,validators:r,classGroupId:a}),xe="-",at=[],Ir="arbitrary..",Fr=e=>{const r=Lr(e),{conflictingClassGroups:a,conflictingClassGroupModifiers:s}=e;return{getClassGroupId:i=>{if(i.startsWith("[")&&i.endsWith("]"))return jr(i);const c=i.split(xe),p=c[0]===""&&c.length>1?1:0;return Dt(c,p,r)},getConflictingClassGroupIds:(i,c)=>{if(c){const p=s[i],l=a[i];return p?l?Rr(l,p):p:l||at}return a[i]||at}}},Dt=(e,r,a)=>{if(e.length-r===0)return a.classGroupId;const o=e[r],n=a.nextPart.get(o);if(n){const l=Dt(e,r+1,n);if(l)return l}const i=a.validators;if(i===null)return;const c=r===0?e.join(xe):e.slice(r).join(xe),p=i.length;for(let l=0;l<p;l++){const m=i[l];if(m.validator(c))return m.classGroupId}},jr=e=>e.slice(1,-1).indexOf(":")===-1?void 0:(()=>{const r=e.slice(1,-1),a=r.indexOf(":"),s=r.slice(0,a);return s?Ir+s:void 0})(),Lr=e=>{const{theme:r,classGroups:a}=e;return Pr(a,r)},Pr=(e,r)=>{const a=vt();for(const s in e){const o=e[s];$e(o,a,s,r)}return a},$e=(e,r,a,s)=>{const o=e.length;for(let n=0;n<o;n++){const i=e[n];Mr(i,r,a,s)}},Mr=(e,r,a,s)=>{if(typeof e=="string"){Or(e,r,a);return}if(typeof e=="function"){Ur(e,r,a,s);return}$r(e,r,a,s)},Or=(e,r,a)=>{const s=e===""?r:St(r,e);s.classGroupId=a},Ur=(e,r,a,s)=>{if(qr(e)){$e(e(s),r,a,s);return}r.validators===null&&(r.validators=[]),r.validators.push(Br(a,e))},$r=(e,r,a,s)=>{const o=Object.entries(e),n=o.length;for(let i=0;i<n;i++){const[c,p]=o[i];$e(p,St(r,c),a,s)}},St=(e,r)=>{let a=e;const s=r.split(xe),o=s.length;for(let n=0;n<o;n++){const i=s[n];let c=a.nextPart.get(i);c||(c=vt(),a.nextPart.set(i,c)),a=c}return a},qr=e=>"isThemeGetter"in e&&e.isThemeGetter===!0,Hr=e=>{if(e<1)return{get:()=>{},set:()=>{}};let r=0,a=Object.create(null),s=Object.create(null);const o=(n,i)=>{a[n]=i,r++,r>e&&(r=0,s=a,a=Object.create(null))};return{get(n){let i=a[n];if(i!==void 0)return i;if((i=s[n])!==void 0)return o(n,i),i},set(n,i){n in a?a[n]=i:o(n,i)}}},Fe="!",nt=":",Gr=[],ot=(e,r,a,s,o)=>({modifiers:e,hasImportantModifier:r,baseClassName:a,maybePostfixModifierPosition:s,isExternal:o}),zr=e=>{const{prefix:r,experimentalParseClassName:a}=e;let s=o=>{const n=[];let i=0,c=0,p=0,l;const m=o.length;for(let _=0;_<m;_++){const b=o[_];if(i===0&&c===0){if(b===nt){n.push(o.slice(p,_)),p=_+1;continue}if(b==="/"){l=_;continue}}b==="["?i++:b==="]"?i--:b==="("?c++:b===")"&&c--}const x=n.length===0?o:o.slice(p);let y=x,u=!1;x.endsWith(Fe)?(y=x.slice(0,-1),u=!0):x.startsWith(Fe)&&(y=x.slice(1),u=!0);const v=l&&l>p?l-p:void 0;return ot(n,u,y,v)};if(r){const o=r+nt,n=s;s=i=>i.startsWith(o)?n(i.slice(o.length)):ot(Gr,!1,i,void 0,!0)}if(a){const o=s;s=n=>a({className:n,parseClassName:o})}return s},Kr=e=>{const r=new Map;return e.orderSensitiveModifiers.forEach((a,s)=>{r.set(a,1e6+s)}),a=>{const s=[];let o=[];for(let n=0;n<a.length;n++){const i=a[n],c=i[0]==="[",p=r.has(i);c||p?(o.length>0&&(o.sort(),s.push(...o),o=[]),s.push(i)):o.push(i)}return o.length>0&&(o.sort(),s.push(...o)),s}},Vr=e=>({cache:Hr(e.cacheSize),parseClassName:zr(e),sortModifiers:Kr(e),postfixLookupClassGroupIds:Wr(e),...Fr(e)}),Wr=e=>{const r=Object.create(null),a=e.postfixLookupClassGroups;if(a)for(let s=0;s<a.length;s++)r[a[s]]=!0;return r},Yr=/\s+/,Qr=(e,r)=>{const{parseClassName:a,getClassGroupId:s,getConflictingClassGroupIds:o,sortModifiers:n,postfixLookupClassGroupIds:i}=r,c=[],p=e.trim().split(Yr);let l="";for(let m=p.length-1;m>=0;m-=1){const x=p[m],{isExternal:y,modifiers:u,hasImportantModifier:v,baseClassName:_,maybePostfixModifierPosition:b}=a(x);if(y){l=x+(l.length>0?" "+l:l);continue}let T=!!b,B;if(T){const D=_.substring(0,b);B=s(D);const d=B&&i[B]?s(_):void 0;d&&d!==B&&(B=d,T=!1)}else B=s(_);if(!B){if(!T){l=x+(l.length>0?" "+l:l);continue}if(B=s(_),!B){l=x+(l.length>0?" "+l:l);continue}T=!1}const I=u.length===0?"":u.length===1?u[0]:n(u).join(":"),C=v?I+Fe:I,k=C+B;if(c.indexOf(k)>-1)continue;c.push(k);const S=o(B,T);for(let D=0;D<S.length;++D){const d=S[D];c.push(C+d)}l=x+(l.length>0?" "+l:l)}return l},Xr=(...e)=>{let r=0,a,s,o="";for(;r<e.length;)(a=e[r++])&&(s=Ct(a))&&(o&&(o+=" "),o+=s);return o},Ct=e=>{if(typeof e=="string")return e;let r,a="";for(let s=0;s<e.length;s++)e[s]&&(r=Ct(e[s]))&&(a&&(a+=" "),a+=r);return a},Jr=(e,...r)=>{let a,s,o,n;const i=p=>{const l=r.reduce((m,x)=>x(m),e());return a=Vr(l),s=a.cache.get,o=a.cache.set,n=c,c(p)},c=p=>{const l=s(p);if(l)return l;const m=Qr(p,a);return o(p,m),m};return n=i,(...p)=>n(Xr(...p))},Zr=[],F=e=>{const r=a=>a[e]||Zr;return r.isThemeGetter=!0,r},Nt=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,Rt=/^\((?:(\w[\w-]*):)?(.+)\)$/i,es=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,ts=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,rs=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,ss=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,as=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,ns=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,z=e=>es.test(e),E=e=>!!e&&!Number.isNaN(Number(e)),q=e=>!!e&&Number.isInteger(Number(e)),De=e=>e.endsWith("%")&&E(e.slice(0,-1)),H=e=>ts.test(e),Bt=()=>!0,os=e=>rs.test(e)&&!ss.test(e),qe=()=>!1,is=e=>as.test(e),cs=e=>ns.test(e),ls=e=>!g(e)&&!h(e),ps=e=>e.startsWith("@container")&&(e[10]==="/"&&e[11]!==void 0||e[11]==="s"&&e[16]!==void 0&&e.startsWith("-size/",10)||e[11]==="n"&&e[18]!==void 0&&e.startsWith("-normal/",10)),ds=e=>K(e,jt,qe),g=e=>Nt.test(e),Y=e=>K(e,Lt,os),it=e=>K(e,bs,E),ms=e=>K(e,Mt,Bt),us=e=>K(e,Pt,qe),ct=e=>K(e,It,qe),gs=e=>K(e,Ft,cs),de=e=>K(e,Ot,is),h=e=>Rt.test(e),ee=e=>X(e,Lt),hs=e=>X(e,Pt),lt=e=>X(e,It),xs=e=>X(e,jt),fs=e=>X(e,Ft),me=e=>X(e,Ot,!0),ys=e=>X(e,Mt,!0),K=(e,r,a)=>{const s=Nt.exec(e);return s?s[1]?r(s[1]):a(s[2]):!1},X=(e,r,a=!1)=>{const s=Rt.exec(e);return s?s[1]?r(s[1]):a:!1},It=e=>e==="position"||e==="percentage",Ft=e=>e==="image"||e==="url",jt=e=>e==="length"||e==="size"||e==="bg-size",Lt=e=>e==="length",bs=e=>e==="number",Pt=e=>e==="family-name",Mt=e=>e==="number"||e==="weight",Ot=e=>e==="shadow",ws=()=>{const e=F("color"),r=F("font"),a=F("text"),s=F("font-weight"),o=F("tracking"),n=F("leading"),i=F("breakpoint"),c=F("container"),p=F("spacing"),l=F("radius"),m=F("shadow"),x=F("inset-shadow"),y=F("text-shadow"),u=F("drop-shadow"),v=F("blur"),_=F("perspective"),b=F("aspect"),T=F("ease"),B=F("animate"),I=()=>["auto","avoid","all","avoid-page","page","left","right","column"],C=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],k=()=>[...C(),h,g],S=()=>["auto","hidden","clip","visible","scroll"],D=()=>["auto","contain","none"],d=()=>[h,g,p],A=()=>[z,"full","auto",...d()],N=()=>[q,"none","subgrid",h,g],M=()=>["auto",{span:["full",q,h,g]},q,h,g],O=()=>[q,"auto",h,g],We=()=>["auto","min","max","fr",h,g],Ae=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],J=()=>["start","end","center","stretch","center-safe","end-safe"],$=()=>["auto",...d()],V=()=>[z,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...d()],ke=()=>[z,"screen","full","dvw","lvw","svw","min","max","fit",...d()],_e=()=>[z,"screen","full","lh","dvh","lvh","svh","min","max","fit",...d()],w=()=>[e,h,g],Ye=()=>[...C(),lt,ct,{position:[h,g]}],Qe=()=>["no-repeat",{repeat:["","x","y","space","round"]}],Xe=()=>["auto","cover","contain",xs,ds,{size:[h,g]}],Ee=()=>[De,ee,Y],L=()=>["","none","full",l,h,g],P=()=>["",E,ee,Y],ne=()=>["solid","dashed","dotted","double"],Je=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],j=()=>[E,De,lt,ct],Ze=()=>["","none",v,h,g],oe=()=>["none",E,h,g],ie=()=>["none",E,h,g],Te=()=>[E,h,g],ce=()=>[z,"full",...d()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[H],breakpoint:[H],color:[Bt],container:[H],"drop-shadow":[H],ease:["in","out","in-out"],font:[ls],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[H],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[H],shadow:[H],spacing:["px",E],text:[H],"text-shadow":[H],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",z,g,h,b]}],container:["container"],"container-type":[{"@container":["","normal","size",h,g]}],"container-named":[ps],columns:[{columns:[E,g,h,c]}],"break-after":[{"break-after":I()}],"break-before":[{"break-before":I()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:k()}],overflow:[{overflow:S()}],"overflow-x":[{"overflow-x":S()}],"overflow-y":[{"overflow-y":S()}],overscroll:[{overscroll:D()}],"overscroll-x":[{"overscroll-x":D()}],"overscroll-y":[{"overscroll-y":D()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:A()}],"inset-x":[{"inset-x":A()}],"inset-y":[{"inset-y":A()}],start:[{"inset-s":A(),start:A()}],end:[{"inset-e":A(),end:A()}],"inset-bs":[{"inset-bs":A()}],"inset-be":[{"inset-be":A()}],top:[{top:A()}],right:[{right:A()}],bottom:[{bottom:A()}],left:[{left:A()}],visibility:["visible","invisible","collapse"],z:[{z:[q,"auto",h,g]}],basis:[{basis:[z,"full","auto",c,...d()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[E,z,"auto","initial","none",g]}],grow:[{grow:["",E,h,g]}],shrink:[{shrink:["",E,h,g]}],order:[{order:[q,"first","last","none",h,g]}],"grid-cols":[{"grid-cols":N()}],"col-start-end":[{col:M()}],"col-start":[{"col-start":O()}],"col-end":[{"col-end":O()}],"grid-rows":[{"grid-rows":N()}],"row-start-end":[{row:M()}],"row-start":[{"row-start":O()}],"row-end":[{"row-end":O()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":We()}],"auto-rows":[{"auto-rows":We()}],gap:[{gap:d()}],"gap-x":[{"gap-x":d()}],"gap-y":[{"gap-y":d()}],"justify-content":[{justify:[...Ae(),"normal"]}],"justify-items":[{"justify-items":[...J(),"normal"]}],"justify-self":[{"justify-self":["auto",...J()]}],"align-content":[{content:["normal",...Ae()]}],"align-items":[{items:[...J(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...J(),{baseline:["","last"]}]}],"place-content":[{"place-content":Ae()}],"place-items":[{"place-items":[...J(),"baseline"]}],"place-self":[{"place-self":["auto",...J()]}],p:[{p:d()}],px:[{px:d()}],py:[{py:d()}],ps:[{ps:d()}],pe:[{pe:d()}],pbs:[{pbs:d()}],pbe:[{pbe:d()}],pt:[{pt:d()}],pr:[{pr:d()}],pb:[{pb:d()}],pl:[{pl:d()}],m:[{m:$()}],mx:[{mx:$()}],my:[{my:$()}],ms:[{ms:$()}],me:[{me:$()}],mbs:[{mbs:$()}],mbe:[{mbe:$()}],mt:[{mt:$()}],mr:[{mr:$()}],mb:[{mb:$()}],ml:[{ml:$()}],"space-x":[{"space-x":d()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":d()}],"space-y-reverse":["space-y-reverse"],size:[{size:V()}],"inline-size":[{inline:["auto",...ke()]}],"min-inline-size":[{"min-inline":["auto",...ke()]}],"max-inline-size":[{"max-inline":["none",...ke()]}],"block-size":[{block:["auto",..._e()]}],"min-block-size":[{"min-block":["auto",..._e()]}],"max-block-size":[{"max-block":["none",..._e()]}],w:[{w:[c,"screen",...V()]}],"min-w":[{"min-w":[c,"screen","none",...V()]}],"max-w":[{"max-w":[c,"screen","none","prose",{screen:[i]},...V()]}],h:[{h:["screen","lh",...V()]}],"min-h":[{"min-h":["screen","lh","none",...V()]}],"max-h":[{"max-h":["screen","lh",...V()]}],"font-size":[{text:["base",a,ee,Y]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[s,ys,ms]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",De,g]}],"font-family":[{font:[hs,us,r]}],"font-features":[{"font-features":[g]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[o,h,g]}],"line-clamp":[{"line-clamp":[E,"none",h,it]}],leading:[{leading:[n,...d()]}],"list-image":[{"list-image":["none",h,g]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",h,g]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:w()}],"text-color":[{text:w()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...ne(),"wavy"]}],"text-decoration-thickness":[{decoration:[E,"from-font","auto",h,Y]}],"text-decoration-color":[{decoration:w()}],"underline-offset":[{"underline-offset":[E,"auto",h,g]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:d()}],"tab-size":[{tab:[q,h,g]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",h,g]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",h,g]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:Ye()}],"bg-repeat":[{bg:Qe()}],"bg-size":[{bg:Xe()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},q,h,g],radial:["",h,g],conic:[q,h,g]},fs,gs]}],"bg-color":[{bg:w()}],"gradient-from-pos":[{from:Ee()}],"gradient-via-pos":[{via:Ee()}],"gradient-to-pos":[{to:Ee()}],"gradient-from":[{from:w()}],"gradient-via":[{via:w()}],"gradient-to":[{to:w()}],rounded:[{rounded:L()}],"rounded-s":[{"rounded-s":L()}],"rounded-e":[{"rounded-e":L()}],"rounded-t":[{"rounded-t":L()}],"rounded-r":[{"rounded-r":L()}],"rounded-b":[{"rounded-b":L()}],"rounded-l":[{"rounded-l":L()}],"rounded-ss":[{"rounded-ss":L()}],"rounded-se":[{"rounded-se":L()}],"rounded-ee":[{"rounded-ee":L()}],"rounded-es":[{"rounded-es":L()}],"rounded-tl":[{"rounded-tl":L()}],"rounded-tr":[{"rounded-tr":L()}],"rounded-br":[{"rounded-br":L()}],"rounded-bl":[{"rounded-bl":L()}],"border-w":[{border:P()}],"border-w-x":[{"border-x":P()}],"border-w-y":[{"border-y":P()}],"border-w-s":[{"border-s":P()}],"border-w-e":[{"border-e":P()}],"border-w-bs":[{"border-bs":P()}],"border-w-be":[{"border-be":P()}],"border-w-t":[{"border-t":P()}],"border-w-r":[{"border-r":P()}],"border-w-b":[{"border-b":P()}],"border-w-l":[{"border-l":P()}],"divide-x":[{"divide-x":P()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":P()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...ne(),"hidden","none"]}],"divide-style":[{divide:[...ne(),"hidden","none"]}],"border-color":[{border:w()}],"border-color-x":[{"border-x":w()}],"border-color-y":[{"border-y":w()}],"border-color-s":[{"border-s":w()}],"border-color-e":[{"border-e":w()}],"border-color-bs":[{"border-bs":w()}],"border-color-be":[{"border-be":w()}],"border-color-t":[{"border-t":w()}],"border-color-r":[{"border-r":w()}],"border-color-b":[{"border-b":w()}],"border-color-l":[{"border-l":w()}],"divide-color":[{divide:w()}],"outline-style":[{outline:[...ne(),"none","hidden"]}],"outline-offset":[{"outline-offset":[E,h,g]}],"outline-w":[{outline:["",E,ee,Y]}],"outline-color":[{outline:w()}],shadow:[{shadow:["","none",m,me,de]}],"shadow-color":[{shadow:w()}],"inset-shadow":[{"inset-shadow":["none",x,me,de]}],"inset-shadow-color":[{"inset-shadow":w()}],"ring-w":[{ring:P()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:w()}],"ring-offset-w":[{"ring-offset":[E,Y]}],"ring-offset-color":[{"ring-offset":w()}],"inset-ring-w":[{"inset-ring":P()}],"inset-ring-color":[{"inset-ring":w()}],"text-shadow":[{"text-shadow":["none",y,me,de]}],"text-shadow-color":[{"text-shadow":w()}],opacity:[{opacity:[E,h,g]}],"mix-blend":[{"mix-blend":[...Je(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":Je()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[E]}],"mask-image-linear-from-pos":[{"mask-linear-from":j()}],"mask-image-linear-to-pos":[{"mask-linear-to":j()}],"mask-image-linear-from-color":[{"mask-linear-from":w()}],"mask-image-linear-to-color":[{"mask-linear-to":w()}],"mask-image-t-from-pos":[{"mask-t-from":j()}],"mask-image-t-to-pos":[{"mask-t-to":j()}],"mask-image-t-from-color":[{"mask-t-from":w()}],"mask-image-t-to-color":[{"mask-t-to":w()}],"mask-image-r-from-pos":[{"mask-r-from":j()}],"mask-image-r-to-pos":[{"mask-r-to":j()}],"mask-image-r-from-color":[{"mask-r-from":w()}],"mask-image-r-to-color":[{"mask-r-to":w()}],"mask-image-b-from-pos":[{"mask-b-from":j()}],"mask-image-b-to-pos":[{"mask-b-to":j()}],"mask-image-b-from-color":[{"mask-b-from":w()}],"mask-image-b-to-color":[{"mask-b-to":w()}],"mask-image-l-from-pos":[{"mask-l-from":j()}],"mask-image-l-to-pos":[{"mask-l-to":j()}],"mask-image-l-from-color":[{"mask-l-from":w()}],"mask-image-l-to-color":[{"mask-l-to":w()}],"mask-image-x-from-pos":[{"mask-x-from":j()}],"mask-image-x-to-pos":[{"mask-x-to":j()}],"mask-image-x-from-color":[{"mask-x-from":w()}],"mask-image-x-to-color":[{"mask-x-to":w()}],"mask-image-y-from-pos":[{"mask-y-from":j()}],"mask-image-y-to-pos":[{"mask-y-to":j()}],"mask-image-y-from-color":[{"mask-y-from":w()}],"mask-image-y-to-color":[{"mask-y-to":w()}],"mask-image-radial":[{"mask-radial":[h,g]}],"mask-image-radial-from-pos":[{"mask-radial-from":j()}],"mask-image-radial-to-pos":[{"mask-radial-to":j()}],"mask-image-radial-from-color":[{"mask-radial-from":w()}],"mask-image-radial-to-color":[{"mask-radial-to":w()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":C()}],"mask-image-conic-pos":[{"mask-conic":[E]}],"mask-image-conic-from-pos":[{"mask-conic-from":j()}],"mask-image-conic-to-pos":[{"mask-conic-to":j()}],"mask-image-conic-from-color":[{"mask-conic-from":w()}],"mask-image-conic-to-color":[{"mask-conic-to":w()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:Ye()}],"mask-repeat":[{mask:Qe()}],"mask-size":[{mask:Xe()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",h,g]}],filter:[{filter:["","none",h,g]}],blur:[{blur:Ze()}],brightness:[{brightness:[E,h,g]}],contrast:[{contrast:[E,h,g]}],"drop-shadow":[{"drop-shadow":["","none",u,me,de]}],"drop-shadow-color":[{"drop-shadow":w()}],grayscale:[{grayscale:["",E,h,g]}],"hue-rotate":[{"hue-rotate":[E,h,g]}],invert:[{invert:["",E,h,g]}],saturate:[{saturate:[E,h,g]}],sepia:[{sepia:["",E,h,g]}],"backdrop-filter":[{"backdrop-filter":["","none",h,g]}],"backdrop-blur":[{"backdrop-blur":Ze()}],"backdrop-brightness":[{"backdrop-brightness":[E,h,g]}],"backdrop-contrast":[{"backdrop-contrast":[E,h,g]}],"backdrop-grayscale":[{"backdrop-grayscale":["",E,h,g]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[E,h,g]}],"backdrop-invert":[{"backdrop-invert":["",E,h,g]}],"backdrop-opacity":[{"backdrop-opacity":[E,h,g]}],"backdrop-saturate":[{"backdrop-saturate":[E,h,g]}],"backdrop-sepia":[{"backdrop-sepia":["",E,h,g]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":d()}],"border-spacing-x":[{"border-spacing-x":d()}],"border-spacing-y":[{"border-spacing-y":d()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",h,g]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[E,"initial",h,g]}],ease:[{ease:["linear","initial",T,h,g]}],delay:[{delay:[E,h,g]}],animate:[{animate:["none",B,h,g]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[_,h,g]}],"perspective-origin":[{"perspective-origin":k()}],rotate:[{rotate:oe()}],"rotate-x":[{"rotate-x":oe()}],"rotate-y":[{"rotate-y":oe()}],"rotate-z":[{"rotate-z":oe()}],scale:[{scale:ie()}],"scale-x":[{"scale-x":ie()}],"scale-y":[{"scale-y":ie()}],"scale-z":[{"scale-z":ie()}],"scale-3d":["scale-3d"],skew:[{skew:Te()}],"skew-x":[{"skew-x":Te()}],"skew-y":[{"skew-y":Te()}],transform:[{transform:[h,g,"","none","gpu","cpu"]}],"transform-origin":[{origin:k()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:ce()}],"translate-x":[{"translate-x":ce()}],"translate-y":[{"translate-y":ce()}],"translate-z":[{"translate-z":ce()}],"translate-none":["translate-none"],zoom:[{zoom:[q,h,g]}],accent:[{accent:w()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:w()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",h,g]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":w()}],"scrollbar-track-color":[{"scrollbar-track":w()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":d()}],"scroll-mx":[{"scroll-mx":d()}],"scroll-my":[{"scroll-my":d()}],"scroll-ms":[{"scroll-ms":d()}],"scroll-me":[{"scroll-me":d()}],"scroll-mbs":[{"scroll-mbs":d()}],"scroll-mbe":[{"scroll-mbe":d()}],"scroll-mt":[{"scroll-mt":d()}],"scroll-mr":[{"scroll-mr":d()}],"scroll-mb":[{"scroll-mb":d()}],"scroll-ml":[{"scroll-ml":d()}],"scroll-p":[{"scroll-p":d()}],"scroll-px":[{"scroll-px":d()}],"scroll-py":[{"scroll-py":d()}],"scroll-ps":[{"scroll-ps":d()}],"scroll-pe":[{"scroll-pe":d()}],"scroll-pbs":[{"scroll-pbs":d()}],"scroll-pbe":[{"scroll-pbe":d()}],"scroll-pt":[{"scroll-pt":d()}],"scroll-pr":[{"scroll-pr":d()}],"scroll-pb":[{"scroll-pb":d()}],"scroll-pl":[{"scroll-pl":d()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",h,g]}],fill:[{fill:["none",...w()]}],"stroke-w":[{stroke:[E,ee,Y,it]}],stroke:[{stroke:["none",...w()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}},As=Jr(ws);function f(...e){return As(Nr(e))}function ks({opacity:e=.15,speed:r=50,fontSize:a=14,charColor:s="#22c55e",className:o=""}){const n=R.useRef(null),i=R.useRef(),c=R.useRef([]),p=R.useRef([]);return R.useEffect(()=>{const l=n.current;if(!l)return;const m=l.getContext("2d");if(!m)return;const y="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()".split("");p.current=y;const u=()=>{l.width=window.innerWidth,l.height=window.innerHeight;const b=Math.floor(l.width/a);c.current=Array(b).fill(0).map(()=>Math.random()*-100)};u(),window.addEventListener("resize",u);let v=0;const _=b=>{if(b-v<r){i.current=requestAnimationFrame(_);return}v=b,m.fillStyle="rgba(0, 0, 0, 0.05)",m.fillRect(0,0,l.width,l.height),m.font=`${a}px monospace`;const T=c.current,B=p.current;for(let I=0;I<T.length;I++){const C=B[Math.floor(Math.random()*B.length)],k=I*a,S=T[I]*a,D=m.createRadialGradient(k,S,0,k,S,a*2);D.addColorStop(0,s),D.addColorStop(1,"transparent"),m.fillStyle=s,m.globalAlpha=e,m.fillText(C,k,S),m.globalAlpha=e*.3,m.fillText(C,k,S-a),m.globalAlpha=1,S>l.height&&Math.random()>.975&&(T[I]=0),T[I]++}i.current=requestAnimationFrame(_)};return i.current=requestAnimationFrame(_),()=>{window.removeEventListener("resize",u),i.current&&cancelAnimationFrame(i.current)}},[e,r,a,s]),t.jsx("canvas",{"trae-inspector-start-line":"99","trae-inspector-start-column":"4","trae-inspector-end-line":"103","trae-inspector-end-column":"6","trae-inspector-file-path":"src/components/MatrixBackground.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",ref:n,className:`fixed inset-0 pointer-events-none ${o}`,style:{zIndex:0}})}const pt=e=>{let r;const a=new Set,s=(l,m)=>{const x=typeof l=="function"?l(r):l;if(!Object.is(x,r)){const y=r;r=m??(typeof x!="object"||x===null)?x:Object.assign({},r,x),a.forEach(u=>u(r,y))}},o=()=>r,c={setState:s,getState:o,getInitialState:()=>p,subscribe:l=>(a.add(l),()=>a.delete(l))},p=r=e(s,o,c);return c},_s=(e=>e?pt(e):pt),Es=e=>e;function Ts(e,r=Es){const a=le.useSyncExternalStore(e.subscribe,le.useCallback(()=>r(e.getState()),[e,r]),le.useCallback(()=>r(e.getInitialState()),[e,r]));return le.useDebugValue(a),a}const dt=e=>{const r=_s(e),a=s=>Ts(r,s);return Object.assign(a,r),a},re=(e=>e?dt(e):dt),Ut=re(e=>({messages:[],isStreaming:!1,addMessage:r=>e(a=>({messages:[...a.messages,r]})),updateMessage:(r,a)=>e(s=>({messages:s.messages.map(o=>o.id===r?{...o,...a}:o)})),clearMessages:()=>e({messages:[]}),setStreaming:r=>e({isStreaming:r})})),mt=[{id:"chairman",name:"董事长",role:"CEO / 最高决策者",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"决策层"},{id:"cto",name:"技术总监",role:"CTO / 技术负责人",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"决策层"},{id:"pm",name:"产品经理",role:"Product Manager",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"产品部"},{id:"analyst",name:"分析员",role:"Business Analyst",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"产品部"},{id:"ux-designer",name:"UX设计师",role:"UX/UI Designer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"设计部"},{id:"ui-designer",name:"UI设计师",role:"UI Designer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"设计部"},{id:"arch",name:"架构师",role:"System Architect",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"tech-lead",name:"技术主管",role:"Tech Lead",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-1",name:"代码员小绿",role:"前端工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-2",name:"代码员小蓝",role:"后端工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-3",name:"代码员小紫",role:"全栈工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-4",name:"代码员小青",role:"测试工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-5",name:"代码员小橙",role:"数据库工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"devops",name:"运维工程师",role:"DevOps Engineer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"inspector-1",name:"检查员甲",role:"代码审查员",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"质量部"},{id:"inspector-2",name:"检查员乙",role:"质量保证员",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"质量部"},{id:"qa-lead",name:"测试主管",role:"QA Lead",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"质量部"},{id:"expander",name:"扩展员",role:"战略规划师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"战略部"},{id:"researcher",name:"研究员",role:"AI Researcher",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"研发部"},{id:"data-scientist",name:"数据科学家",role:"Data Scientist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"研发部"},{id:"packer",name:"打包员",role:"构建工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"运维部"},{id:"deliverer",name:"输送员",role:"部署工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"运维部"},{id:"doc-writer",name:"文档工程师",role:"Technical Writer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"文档部"},{id:"hr",name:"人事专员",role:"HR Specialist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"人事部"},{id:"finance",name:"财务专员",role:"Finance Specialist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"财务部"},{id:"marketing",name:"市场专员",role:"Marketing Specialist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"市场部"},{id:"customer-service",name:"客服专员",role:"Customer Service",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"客服部"},{id:"security",name:"安全工程师",role:"Security Engineer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"安全部"},{id:"legal",name:"法务顾问",role:"Legal Counsel",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"法务部"},{id:"sys-admin",name:"系统管理员",role:"System Admin",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"运维部"}],se=re(e=>({agents:mt,updateAgentStatus:(r,a)=>e(s=>({agents:s.agents.map(o=>o.id===r?{...o,status:a,lastActive:Date.now()}:o)})),setAgentProgress:(r,a,s)=>e(o=>({agents:o.agents.map(n=>n.id===r?{...n,progress:a,currentTask:s??n.currentTask,lastActive:Date.now()}:n)})),resetAllAgents:()=>e({agents:mt.map(r=>({...r,status:"idle",progress:0,currentTask:"",lastActive:Date.now()}))})}));function He(e,r){let a;try{a=e()}catch{return}return{getItem:o=>{var n;const i=p=>p===null?null:JSON.parse(p,void 0),c=(n=a.getItem(o))!=null?n:null;return c instanceof Promise?c.then(i):i(c)},setItem:(o,n)=>a.setItem(o,JSON.stringify(n,void 0)),removeItem:o=>a.removeItem(o)}}const je=e=>r=>{try{const a=e(r);return a instanceof Promise?a:{then(s){return je(s)(a)},catch(s){return this}}}catch(a){return{then(s){return this},catch(s){return je(s)(a)}}}},vs=(e,r)=>(a,s,o)=>{let n={storage:He(()=>window.localStorage),partialize:b=>b,version:0,merge:(b,T)=>({...T,...b}),...r},i=!1,c=0;const p=new Set,l=new Set;let m=n.storage;if(!m)return e((...b)=>{console.warn(`[zustand persist middleware] Unable to update item '${n.name}', the given storage is currently unavailable.`),a(...b)},s,o);const x=()=>{const b=n.partialize({...s()});return m.setItem(n.name,{state:b,version:n.version})},y=o.setState;o.setState=(b,T)=>(y(b,T),x());const u=e((...b)=>(a(...b),x()),s,o);o.getInitialState=()=>u;let v;const _=()=>{var b,T;if(!m)return;const B=++c;i=!1,p.forEach(C=>{var k;return C((k=s())!=null?k:u)});const I=((T=n.onRehydrateStorage)==null?void 0:T.call(n,(b=s())!=null?b:u))||void 0;return je(m.getItem.bind(m))(n.name).then(C=>{if(C)if(typeof C.version=="number"&&C.version!==n.version){if(n.migrate){const k=n.migrate(C.state,C.version);return k instanceof Promise?k.then(S=>[!0,S]):[!0,k]}console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,C.state];return[!1,void 0]}).then(C=>{var k;if(B!==c)return;const[S,D]=C;if(v=n.merge(D,(k=s())!=null?k:u),a(v,!0),S)return x()}).then(()=>{B===c&&(I==null||I(s(),void 0),v=s(),i=!0,l.forEach(C=>C(v)))}).catch(C=>{B===c&&(I==null||I(void 0,C))})};return o.persist={setOptions:b=>{n={...n,...b},b.storage&&(m=b.storage)},clearStorage:()=>{m==null||m.removeItem(n.name)},getOptions:()=>n,rehydrate:()=>_(),hasHydrated:()=>i,onHydrate:b=>(p.add(b),()=>{p.delete(b)}),onFinishHydration:b=>(l.add(b),()=>{l.delete(b)})},n.skipHydration||_(),v||u},$t=vs,ue=[{id:"supreme-command",title:"最高用户指令",content:`## 给TRAE的一封指令

### 核心任务
用最高用户指令完善项目，打造完整的AI公司系统，不是半成品。

### 特殊情况说明
- 本人是残疾人，多少不方便，能弄的一定弄，最好一步都不用
- 四肢打了钢钉恢复中
- 全复知觉剂和精神剂，不敢弄什么开源的
- 家贫人残，打算走免费路线
- 等手上的骨头好了再弄付费的

### 核心要求
1. **免费路**：所有功能走免费路线，能用开源的就用开源的
2. **一条龙服务**：从需求分析到部署上线全流程自动化
3. **项目要完善**：功能齐全，不能是半成品
4. **功能要用**：每个功能都要真正有用，不能是摆设
5. **手机格式**：完美适配手机端，单栏布局
6. **屏幕滚动好**：滚动流畅不卡顿
7. **没有bug错误**：零错误运行
8. **UI要好**：极客风格，专业级界面
9. **AI公司人类要够多**：角色丰富，部门齐全

---
*来源：董事长亲笔手书`,tags:["最高指令","董事长","核心要求","free","免费路线"],category:"项目规划",createdAt:Date.now(),source:"董事长手书"},{id:"roadmap",title:"项目发展路线图",content:`## 第一阶段：基础搭建（当前）
- 完成多Agent协作系统核心框架
- 实现手机端适配和底部Tab导航
- 建立知识库系统和自我学习机制
- 确保GitHub Pages稳定部署

## 第二阶段：功能增强
- 接入真实大语言模型API
- 实现Agent间真实协作对话
- 完善代码生成和审查功能
- 增加更多Agent角色和模板

## 第三阶段：智能化
- 实现自我学习和知识沉淀
- 支持自定义工作流编排
- 增加项目管理和任务追踪
- 实现多项目并行管理

## 第四阶段：生态扩展
- 支持插件系统和第三方集成
- 增加团队协作和权限管理
- 支持多语言和国际化
- 建立社区和开源生态

## 第五阶段：商业化
- 企业级功能和安全审计
- SLA保障和技术支持
- 私有化部署方案
- 商业模式探索`,tags:["roadmap","规划","发展路线"],category:"项目规划",createdAt:Date.now(),source:"董事长指令"},{id:"k001",title:"React + TypeScript 组件开发最佳实践",content:`## React组件开发核心原则

### 1. 函数式组件优先
使用函数式组件配合Hooks，避免class组件。

### 2. 单一职责原则
每个组件只做一件事，复杂功能拆分为子组件。

### 3. TypeScript类型安全
- 为所有props定义interface
- 避免使用any
- 使用泛型提高复用性

### 4. Hooks使用规范
- useState: 简单局部状态
- useReducer: 复杂状态逻辑
- useCallback/useMemo: 性能优化
- 自定义Hooks: 逻辑复用

### 5. 性能优化
- React.memo 包裹纯展示组件
- 虚拟列表处理大数据
- 懒加载减少首屏负担`,tags:["react","typescript","组件","hooks","best-practices"],category:"前端开发",createdAt:Date.now()-864e5*3,source:"内部文档"},{id:"k002",title:"Zustand 轻量状态管理方案",content:`## Zustand 核心概念

### 创建Store
\`\`\`typescript
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
\`\`\`

### 优势
- API简洁，学习成本低
- 不需要Provider包裹
- 天然支持TypeScript
- 包体积小（~1KB）
- 支持中间件（persist、devtools等）`,tags:["zustand","state-management","react","状态管理"],category:"前端开发",createdAt:Date.now()-864e5*2,source:"官方文档"},{id:"k003",title:"TypeScript 高级类型技巧",content:'## TypeScript高级类型\n\n### 条件类型\n```typescript\ntype IsString<T> = T extends string ? true : false\ntype A = IsString<"hello"> // true\ntype B = IsString<42>      // false\n```\n\n### 映射类型\n```typescript\ntype Readonly<T> = { readonly [P in keyof T]: T[P] }\ntype Partial<T> = { [P in keyof T]?: T[P] }\n```\n\n### 模板字面量类型\n```typescript\ntype EventName = `on${Capitalize<string>}`\n// "onClick" | "onChange" | ...\n```\n\n### infer推断\n```typescript\ntype ReturnType<T> = T extends (...args: any[]) => infer R ? R : never\n```',tags:["typescript","types","advanced","泛型"],category:"编程语言",createdAt:Date.now()-864e5,source:"技术博客"},{id:"k004",title:"FastAPI 异步后端开发指南",content:`## FastAPI 核心特性

### 异步路由
\`\`\`python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
\`\`\`

### Pydantic 数据校验
\`\`\`python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None
\`\`\`

### 依赖注入
\`\`\`python
from fastapi import Depends

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/")
async def read_users(db = Depends(get_db)):
    return db.query(User).all()
\`\`\`

### 优势
- 原生异步支持，高并发性能卓越
- 自动生成OpenAPI文档
- 类型安全（Pydantic校验）
- 生态完善，社区活跃`,tags:["python","fastapi","后端","异步","api"],category:"后端开发",createdAt:Date.now()-864e5*4,source:"FastAPI官方文档"},{id:"k005",title:"ReAct 算法：推理与行动的闭环",content:`## ReAct (Reasoning + Acting) 算法

### 核心思想
AI在输出最终回答前，经历多轮"思考→行动→观察"循环：

1. **Thought（思考）**：分析当前状态，决定下一步
2. **Action（行动）**：调用外部工具（搜索、计算、代码执行等）
3. **Observation（观察）**：获取工具返回结果
4. 重复直到有足够信息生成最终回答

### 伪代码
\`\`\`python
def react_loop(query):
    thoughts = []
    for step in range(max_iterations):
        thought = llm.generate(query, thoughts)
        if thought.action == "final_answer":
            return thought.answer
        result = tools[thought.action].execute(thought.input)
        thoughts.append({**thought, "observation": result})
    return "达到最大迭代次数"
\`\`\`

### 优势
- 比纯CoT更准确（有外部工具验证）
- 可追溯推理过程
- 支持动态工具调用`,tags:["ai","agent","react","算法","llm","推理"],category:"AI/智能体",createdAt:Date.now()-864e5*5,source:"论文解读"},{id:"k006",title:"RAG 检索增强生成最佳实践",content:`## RAG (Retrieval-Augmented Generation)

### 标准流程
1. **文档切分**：将长文档拆分为语义完整的chunk
2. **向量化**：用Embedding模型将文本转为向量
3. **存储**：存入向量数据库（ChromaDB/Milvus）
4. **检索**：用户提问时，检索Top-K相关chunk
5. **拼接**：将检索结果作为context拼入Prompt
6. **生成**：LLM基于context生成回答

### 代码示例
\`\`\`python
from chromadb import Client

# 存储知识
collection.add(
    documents=["React是Facebook开发的UI框架"],
    ids=["doc_001"]
)

# 检索
results = collection.query(
    query_texts=["什么是React"],
    n_results=3
)
\`\`\`

### 优化技巧
- Chunk大小：500-1000 tokens为宜
- 重排序：用Cross-Encoder重排检索结果
- 混合检索：关键词+向量检索结合
- 去重：避免相似chunk重复出现`,tags:["rag","ai","向量","检索","chromadb","embedding"],category:"AI/智能体",createdAt:Date.now()-864e5*5,source:"技术总结"},{id:"k007",title:"LangChain 多智能体编排框架",content:`## LangChain 核心概念

### Agent
Agent是LLM+工具的封装，能自主决策调用哪个工具：
\`\`\`python
from langchain.agents import initialize_agent, Tool

tools = [
    Tool(name="Search", func=search_func),
    Tool(name="Calculator", func=calc_func),
]

agent = initialize_agent(tools, llm, agent="zero-shot-react-description")
agent.run("2024年GDP是多少？")
\`\`\`

### Chain
Chain将多个步骤串联：
\`\`\`python
from langchain.chains import LLMChain
chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run(input="hello")
\`\`\`

### Memory
维护对话记忆：
- ConversationBufferMemory: 保留全部
- ConversationSummaryMemory: 压缩摘要
- VectorStoreRetrieverMemory: 向量检索

### Multi-Agent
多个Agent协作，分工处理复杂任务`,tags:["langchain","ai","agent","编排","multi-agent"],category:"AI/智能体",createdAt:Date.now()-864e5*6,source:"LangChain文档"},{id:"k008",title:"ChromaDB 向量数据库使用指南",content:`## ChromaDB 向量存储

### 安装与初始化
\`\`\`python
import chromadb
client = chromadb.PersistentClient(path="./data/chroma")
\`\`\`

### 创建Collection
\`\`\`python
collection = client.get_or_create_collection(
    name="knowledge_base",
    metadata={"hnsw:space": "cosine"}
)
\`\`\`

### 存储数据
\`\`\`python
collection.add(
    documents=["React是UI框架", "Vue是渐进式框架"],
    metadatas=[{"type": "frontend"}, {"type": "frontend"}],
    ids=["doc1", "doc2"]
)
\`\`\`

### 语义检索
\`\`\`python
results = collection.query(
    query_texts=["前端框架"],
    n_results=3,
    where={"type": "frontend"}
)
\`\`\`

### 优势
- 轻量级，纯Python实现
- 支持持久化存储
- 内置Embedding功能
- 支持元数据过滤`,tags:["chromadb","向量数据库","ai","embedding","检索"],category:"AI/智能体",createdAt:Date.now()-864e5*6,source:"ChromaDB文档"},{id:"k009",title:"Vite 构建工具配置与优化",content:`## Vite 核心配置

### vite.config.ts
\`\`\`typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'markdown-vendor': ['react-markdown', 'remark-gfm'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
\`\`\`

### 代码分割
- 路由级懒加载：\`const Page = lazy(() => import('./Page'))\`
- 手动Chunks：将大依赖拆分为独立chunk
- 动态导入：\`const mod = await import('./module')\`

### 性能优化
- 预构建依赖（optimizeDeps）
- 压缩输出（terser/esbuild）
- 资源内联（小图片转base64）`,tags:["vite","构建工具","webpack","打包","优化"],category:"前端工程化",createdAt:Date.now()-864e5*7,source:"Vite官方文档"},{id:"k010",title:"TailwindCSS 原子化CSS方案",content:`## TailwindCSS 使用指南

### 核心理念
用预定义的原子类组合样式，不写自定义CSS。

### 常用类名
\`\`\`html
<div class="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-green-700/50">
  <h1 class="text-lg font-bold text-green-400">标题</h1>
  <button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
    按钮
  </button>
</div>
\`\`\`

### 响应式
\`\`\`html
<!-- 移动端单栏，桌面端三栏 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
\`\`\`

### 暗色模式
\`\`\`html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
\`\`\`

### 自定义主题
\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        neon: '#39ff14',
      }
    }
  }
}
\`\`\``,tags:["tailwindcss","css","样式","原子化","响应式"],category:"前端开发",createdAt:Date.now()-864e5*7,source:"TailwindCSS文档"},{id:"k011",title:"Git 版本控制与团队协作流程",content:`## Git 核心操作

### 基本工作流
\`\`\`bash
git add <file>        # 暂存
git commit -m "msg"   # 提交
git push origin main  # 推送
git pull              # 拉取
\`\`\`

### 分支管理
\`\`\`bash
git checkout -b feature/xxx   # 新建分支
git merge feature/xxx         # 合并分支
git branch -d feature/xxx     # 删除分支
\`\`\`

### GitHub Pages 部署
\`\`\`bash
# 构建产物放入 gh-pages 分支
git subtree push --prefix dist origin gh-pages
\`\`\`

### 提交规范
- feat: 新功能
- fix: 修复Bug
- docs: 文档更新
- refactor: 重构
- chore: 杂项

### 冲突解决
1. git pull 拉取远程更新
2. 手动解决冲突标记 <<<< ==== >>>>
3. git add 标记已解决
4. git commit 完成合并`,tags:["git","版本控制","github","协作","部署"],category:"工程化",createdAt:Date.now()-864e5*8,source:"Pro Git"},{id:"k012",title:"SQL 数据库设计与优化",content:`## 数据库设计原则

### 范式化
- 1NF: 字段原子性
- 2NF: 非主键字段完全依赖主键
- 3NF: 消除传递依赖

### 索引优化
\`\`\`sql
-- 高频查询字段建索引
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_created_at ON tasks(created_at);

-- 复合索引（注意顺序）
CREATE INDEX idx_user_status ON tasks(user_id, status);
\`\`\`

### 分页查询优化
\`\`\`sql
-- 慢：OFFSET过大
SELECT * FROM tasks OFFSET 100000 LIMIT 10;

-- 快：游标分页
SELECT * FROM tasks WHERE id > 100000 LIMIT 10;
\`\`\`

### 事务处理
\`\`\`sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`

### 常见优化
- 避免SELECT *
- JOIN字段必须有索引
- 大表考虑水平分表
- 热点数据加Redis缓存`,tags:["sql","mysql","数据库","索引","优化","事务"],category:"数据库",createdAt:Date.now()-864e5*8,source:"数据库优化实战"},{id:"k013",title:"Docker 容器化部署指南",content:`## Docker 核心概念

### Dockerfile
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

### 常用命令
\`\`\`bash
docker build -t myapp .          # 构建镜像
docker run -p 3000:3000 myapp    # 运行容器
docker ps                         # 查看运行中容器
docker logs <container>           # 查看日志
docker exec -it <container> sh    # 进入容器
\`\`\`

### Docker Compose
\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports: ["3000:3000"]
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes: ["dbdata:/var/lib/postgresql/data"]
volumes:
  dbdata:
\`\`\`

### 优势
- 环境一致性
- 快速部署与回滚
- 资源隔离
- 易于CI/CD集成`,tags:["docker","容器","部署","devops","compose"],category:"DevOps",createdAt:Date.now()-864e5*9,source:"Docker官方文档"},{id:"k014",title:"React Router 路由管理",content:`## React Router v6

### 基本路由
\`\`\`tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
\`\`\`

### 嵌套路由
\`\`\`tsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route index element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>
\`\`\`

### 懒加载
\`\`\`tsx
const Home = lazy(() => import('./Home'))
<Route path="/" element={
  <Suspense fallback={<Loading />}><Home /></Suspense>
} />
\`\`\`

### 编程式导航
\`\`\`tsx
const navigate = useNavigate()
navigate('/dashboard')
navigate(-1) // 后退
\`\`\`

### HashRouter
GitHub Pages等静态托管推荐用HashRouter：
\`\`\`tsx
import { HashRouter } from 'react-router-dom'
\`\`\``,tags:["react-router","路由","react","spa"],category:"前端开发",createdAt:Date.now()-864e5*9,source:"React Router文档"},{id:"k015",title:"多Agent协作系统设计模式",content:`## 多Agent协作架构

### 角色分工模式
- **分析员**：拆解需求，制定方案
- **代码员**：并行开发，各负责不同模块
- **检查员**：代码审查，质量把关
- **扩展员**：未来规划，技术选型
- **打包员**：整合代码，生成文档
- **部署员**：上线部署，运维保障

### 工作流引擎
\`\`\`typescript
interface WorkflowPhase {
  id: string
  name: string
  agents: AgentTemplate[]
  minDuration: number
  maxDuration: number
}

const phases: WorkflowPhase[] = [
  { id: 'analysis', name: '需求分析', agents: [analyst] },
  { id: 'coding', name: '编码开发', agents: [coderA, coderB, coderC] },
  { id: 'review', name: '代码审查', agents: [reviewer, bugDetector] },
  { id: 'extension', name: '扩展规划', agents: [extender] },
  { id: 'packaging', name: '打包交付', agents: [packager] },
  { id: 'deployment', name: '部署上线', agents: [deployer] },
]
\`\`\`

### 通信机制
- 消息队列：Agent间异步通信
- 共享状态：Zustand全局store
- 事件驱动：观察者模式

### 优势
- 专业化分工，质量更高
- 并行开发，效率更高
- 互相检查，减少错误`,tags:["multi-agent","协作","工作流","架构","agent"],category:"AI/智能体",createdAt:Date.now()-864e5*10,source:"架构设计经验"},{id:"k016",title:"OpenRouter API 多模型路由",content:`## OpenRouter 聚合网关

### 简介
OpenRouter聚合了多个LLM提供商（OpenAI、Anthropic、Google、DeepSeek等），通过统一API调用。

### 调用示例
\`\`\`python
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="sk-or-xxx"
)

response = await client.chat.completions.create(
    model="deepseek/deepseek-chat",
    messages=[{"role": "user", "content": "Hello"}],
    temperature=0.7
)
\`\`\`

### 模型路由策略
\`\`\`python
def select_model(task_type):
    if task_type == "coding":
        return "deepseek/deepseek-coder"
    elif task_type == "reasoning":
        return "openai/gpt-4o"
    elif task_type == "cheap":
        return "deepseek/deepseek-chat"
    else:
        return "anthropic/claude-3.5-sonnet"
\`\`\`

### 优势
- 一个API Key调用所有模型
- 自动故障转移
- 统一计费
- 免费额度可用`,tags:["openrouter","llm","api","模型路由","deepseek"],category:"AI/智能体",createdAt:Date.now()-864e5*10,source:"OpenRouter文档"},{id:"k017",title:"移动端响应式设计要点",content:`## 移动端适配核心

### Viewport设置
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
\`\`\`

### 安全区域适配
\`\`\`css
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
\`\`\`

### 触摸优化
- 最小点击区域44x44px
- 使用touch事件替代mouse事件
- 禁用双击缩放
- 滑动流畅：-webkit-overflow-scrolling: touch

### 布局方案
\`\`\`css
/* 单栏布局（手机） */
.container { display: flex; flex-direction: column; }

/* 底部Tab导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
}
\`\`\`

### 性能优化
- 图片懒加载
- 虚拟列表
- 减少DOM层级
- CSS动画用transform/opacity`,tags:["mobile","响应式","手机端","css","ui"],category:"前端开发",createdAt:Date.now()-864e5*11,source:"移动端开发经验"},{id:"k018",title:"代码块复制功能实现最佳实践",content:`## 代码块复制按钮实现

### 核心方案
像千问、ChatGPT那样，代码块右上角有复制按钮，点击一键复制。

### 实现代码
\`\`\`tsx
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      // 优先使用 Clipboard API
      await navigator.clipboard.writeText(code)
    } catch {
      // 兜底方案：execCommand
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative group">
      <pre><code>{code}</code></pre>
      <button onClick={handleCopy}
        className={cn('absolute top-2 right-2',
          copied ? 'text-green-400' : 'opacity-0 group-hover:opacity-100')}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  )
}
\`\`\`

### 关键点
- navigator.clipboard + execCommand双保险
- 复制成功显示绿色对勾反馈
- hover时才显示按钮，不干扰阅读
- 1.5秒后自动恢复`,tags:["复制","clipboard","代码块","ux","最佳实践"],category:"前端开发",createdAt:Date.now()-864e5*11,source:"开发经验"},{id:"k019",title:"项目需求分析与拆解方法论",content:`## 需求分析核心步骤

### 1. 需求收集
- 用户原始描述（可能模糊）
- 隐含需求（性能、安全、兼容性）
- 约束条件（预算、时间、技术栈）

### 2. 需求分类
- **功能性需求**：系统必须实现的功能
- **非功能性需求**：性能、安全、可用性
- **约束性需求**：技术选型、预算、时间

### 3. 任务拆解
将大需求拆为可执行的子任务：
\`\`\`
用户需求："做一个AI智能体框架"
├── 后端API层（main.py, 路由设计）
├── 核心引擎层（ReAct算法, 任务拆解）
├── 记忆存储层（向量数据库, RAG检索）
├── 插件系统（搜索, 代码沙箱）
├── 前端界面（控制台, 对话面板）
└── 部署运维（Docker, CI/CD）
\`\`\`

### 4. 优先级排序
- P0：必须有（核心功能）
- P1：应该有（重要功能）
- P2：可以有（增强功能）

### 5. 风险评估
- 技术风险：是否可行
- 时间风险：能否按时
- 依赖风险：第三方服务可用性`,tags:["需求分析","项目管理","拆解","方法论"],category:"项目管理",createdAt:Date.now()-864e5*12,source:"项目管理经验"},{id:"k020",title:"GitHub Pages 免费部署方案",content:`## GitHub Pages 部署

### 适合场景
- 静态网站（HTML/CSS/JS）
- 前端SPA（React/Vue构建产物）
- 开源项目文档
- **完全免费**

### 部署步骤
\`\`\`bash
# 1. 构建前端
npm run build

# 2. 将dist推送到gh-pages分支
git subtree push --prefix dist origin gh-pages

# 或用gh-pages工具
npx gh-pages -d dist
\`\`\`

### 项目页面部署
如果部署到 username.github.io/repo/ 路径下：
\`\`\`typescript
// vite.config.ts
export default defineConfig({
  base: '/repo-name/',  // 设置base路径
})
\`\`\`

### HashRouter适配
GitHub Pages刷新会404，用HashRouter解决：
\`\`\`tsx
import { HashRouter } from 'react-router-dom'
// URL变为 /#/about 而非 /about
\`\`\`

### 自动部署CI
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
\`\`\``,tags:["github-pages","部署","免费","ci-cd","静态托管"],category:"DevOps",createdAt:Date.now()-864e5*12,source:"部署经验"},{id:"k021",title:"代码审查清单与质量标准",content:`## 代码审查核心检查项

### 功能正确性
- [ ] 代码实现了需求要求的功能
- [ ] 边界条件处理完整（空值、零值、最大值）
- [ ] 错误处理覆盖（异常捕获、错误提示）
- [ ] 并发安全性（线程安全、锁机制）

### 代码质量
- [ ] 命名清晰有意义
- [ ] 函数职责单一（SRP）
- [ ] 无重复代码（DRY）
- [ ] 注释完善（复杂逻辑有注释）
- [ ] 遵循编码规范（PEP8/ESLint）

### 性能
- [ ] 无明显的性能瓶颈
- [ ] 数据库查询有索引
- [ ] 大数据量使用分页
- [ ] 避免不必要的重复计算

### 安全
- [ ] 无SQL注入风险（参数化查询）
- [ ] 无XSS风险（输出转义）
- [ ] 敏感信息不硬编码
- [ ] 权限校验完整

### 可维护性
- [ ] 模块化设计，低耦合
- [ ] 有单元测试覆盖
- [ ] 配置项可外部化
- [ ] 日志记录完善`,tags:["代码审查","质量","review","清单","最佳实践"],category:"工程化",createdAt:Date.now()-864e5*13,source:"代码审查经验"},{id:"k022",title:"Python 异步编程指南",content:`## Python asyncio

### 基本用法
\`\`\`python
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return {"data": "hello"}

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
\`\`\`

### 并发执行
\`\`\`python
async def main():
    # 并发执行多个协程
    results = await asyncio.gather(
        fetch_data(),
        fetch_data(),
        fetch_data()
    )

    # 或使用TaskGroup (Python 3.11+)
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch_data())
        t2 = tg.create_task(fetch_data())
\`\`\`

### 异步上下文管理器
\`\`\`python
class AsyncResource:
    async def __aenter__(self):
        await self.connect()
        return self

    async def __aexit__(self, *args):
        await self.close()
\`\`\`

### FastAPI中的异步
\`\`\`python
@app.get("/items")
async def get_items():
    items = await db.fetch_all()
    return items
\`\`\`

### 注意事项
- 不要在异步函数中用time.sleep
- 用aiohttp替代requests
- 用aiomysql/asyncpg替代pymysql`,tags:["python","asyncio","异步","协程","fastapi"],category:"后端开发",createdAt:Date.now()-864e5*13,source:"Python异步编程"},{id:"k023",title:"极客风格UI设计规范",content:`## 极客/赛博朋克风格设计

### 色彩方案
- 背景：深黑/深灰 (#0a0a0a, #111111)
- 主色：霓虹绿 (#39ff14, #22c55e)
- 辅色：电子蓝 (#00ffff, #06b6d4)
- 强调：电紫 (#a855f7, #d946ef)
- 警告：霓虹黄 (#facc15)
- 文字：灰白 (#e5e5e5, #a3a3a3)

### 字体
- 代码/数据：等宽字体 (JetBrains Mono, Fira Code)
- 标题：粗体大字号
- 正文：常规字重

### 视觉效果
\`\`\`css
/* 霓虹发光 */
text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);

/* 网格背景 */
background-image: 
  linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px);
background-size: 20px 20px;

/* 扫描线效果 */
background: linear-gradient(transparent 50%, rgba(0,0,0,0.1) 50%);
background-size: 100% 4px;
\`\`\`

### 动画
- 打字机效果（逐字显示）
- 闪烁光标
- 矩阵雨背景
- 终端窗口风格`,tags:["ui","设计","极客","赛博朋克","neon","主题"],category:"设计",createdAt:Date.now()-864e5*14,source:"UI设计经验"},{id:"k024",title:"插件化架构设计模式",content:`## 插件系统设计

### 核心接口
\`\`\`typescript
interface Plugin {
  name: string
  version: string
  install(context: PluginContext): void
  uninstall?(): void
}
\`\`\`

### 插件管理器
\`\`\`typescript
class PluginManager {
  private plugins = new Map<string, Plugin>()

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(\`Plugin \${plugin.name} already registered\`)
    }
    this.plugins.set(plugin.name, plugin)
    plugin.install(this.context)
  }

  unregister(name: string): void {
    const plugin = this.plugins.get(name)
    plugin?.uninstall?.()
    this.plugins.delete(name)
  }

  list(): Plugin[] {
    return Array.from(this.plugins.values())
  }
}
\`\`\`

### 优势
- 开闭原则：新增功能不改核心代码
- 可插拔：按需加载卸载
- 可扩展：第三方可开发插件
- 解耦：核心与扩展分离

### 应用场景
- IDE插件（VSCode）
- 浏览器扩展
- CMS系统（WordPress）
- AI Agent工具系统`,tags:["插件","架构","设计模式","plugin","扩展性"],category:"架构设计",createdAt:Date.now()-864e5*14,source:"架构设计经验"},{id:"k025",title:"API 接口设计规范",content:`## RESTful API 设计

### URL规范
\`\`\`
GET    /api/v1/users          # 列表
GET    /api/v1/users/:id      # 详情
POST   /api/v1/users          # 创建
PUT    /api/v1/users/:id      # 全量更新
PATCH  /api/v1/users/:id      # 部分更新
DELETE /api/v1/users/:id      # 删除
\`\`\`

### 统一响应格式
\`\`\`json
{
  "success": true,
  "data": { "id": 1, "name": "test" },
  "message": "操作成功"
}
\`\`\`

### 错误响应
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": [{ "field": "email", "msg": "邮箱格式不正确" }]
  }
}
\`\`\`

### 状态码使用
- 200: 成功
- 201: 创建成功
- 400: 请求错误
- 401: 未认证
- 403: 无权限
- 404: 不存在
- 500: 服务器错误

### 分页
\`\`\`json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
\`\`\``,tags:["api","rest","接口设计","restful","规范"],category:"后端开发",createdAt:Date.now()-864e5*15,source:"API设计规范"},{id:"k026",title:"知识沉淀与自我学习机制",content:`## 自我学习系统设计

### 知识沉淀流程
1. **任务执行**：Agent完成用户任务
2. **经验提取**：从任务中提取关键知识点
3. **分类归档**：按类别存入知识库
4. **标签管理**：打上相关标签便于检索
5. **后续复用**：新任务时检索相关知识

### 知识库结构
\`\`\`typescript
interface KnowledgeEntry {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: number
  source: string  // 来源（任务经验/手动录入/外部文档）
}
\`\`\`

### 自动知识提取
\`\`\`python
def extract_knowledge(task_result):
    """从任务结果中提取知识"""
    return {
        "title": task_result.title,
        "content": summarize(task_result),
        "tags": extract_keywords(task_result),
        "category": classify(task_result),
    }
\`\`\`

### RAG增强
新任务开始时，先检索知识库中相关经验：
\`\`\`python
async def task_with_knowledge(query):
    # 检索相关知识
    knowledge = await memory.retrieve(query, top_k=5)
    # 拼入上下文
    context = format_knowledge(knowledge)
    # 带着知识执行任务
    return await agent.run(query, context=context)
\`\`\``,tags:["知识库","自我学习","知识沉淀","rag","agent"],category:"AI/智能体",createdAt:Date.now()-864e5*15,source:"系统设计经验"},{id:"k027",title:"Redis 缓存与高性能数据结构",content:`## Redis 核心使用

### 常用数据结构
\`\`\`bash
# 字符串
SET key "value"
GET key
SETEX key 60 "value"  # 60秒过期

# 哈希
HSET user:1 name "张三" age 25
HGET user:1 name

# 列表（消息队列）
LPUSH queue "task1"
RPOP queue

# 集合（去重）
SADD tags "react" "vue"

# 有序集合（排行榜）
ZADD ranking 100 "player1"
ZREVRANGE ranking 0 9
\`\`\`

### 缓存策略
\`\`\`python
# Cache Aside（旁路缓存）
async def get_user(user_id):
    # 1. 先查缓存
    data = await redis.get(f"user:{user_id}")
    if data:
        return json.loads(data)
    # 2. 查数据库
    user = await db.get_user(user_id)
    # 3. 写入缓存（设过期时间）
    await redis.setex(f"user:{user_id}", 300, json.dumps(user))
    return user
\`\`\`

### 应用场景
- 热点数据缓存
- 分布式锁
- 限流计数器
- 消息队列
- 会话存储
- 排行榜/计数器`,tags:["redis","缓存","高性能","数据结构","nosql"],category:"数据库",createdAt:Date.now()-864e5*16,source:"Redis官方文档"},{id:"k028",title:"WebSocket 实时通信方案",content:`## WebSocket 实时通信

### 前端实现
\`\`\`typescript
class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0

  connect(url: string) {
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('WebSocket已连接')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      this.handleMessage(data)
    }

    this.ws.onclose = () => {
      console.log('连接断开，尝试重连...')
      setTimeout(() => this.connect(url), 3000)
    }
  }

  send(data: object) {
    this.ws?.send(JSON.stringify(data))
  }
}
\`\`\`

### 后端实现 (FastAPI)
\`\`\`python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # 广播给所有连接
            await manager.broadcast(f"{client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
\`\`\`

### 应用场景
- 实时聊天
- 协作编辑
- 实时通知
- 股票行情
- 在线游戏`,tags:["websocket","实时通信","fastapi","实时","推送"],category:"后端开发",createdAt:Date.now()-864e5*16,source:"实时通信实践"},{id:"k029",title:"CI/CD 持续集成与部署",content:`## CI/CD 核心概念

### GitHub Actions 工作流
\`\`\`yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
\`\`\`

### CI/CD 流程
1. **代码提交** → 触发Pipeline
2. **代码检查** → ESLint / Prettier / TypeScript
3. **单元测试** → 自动运行测试
4. **构建** → 打包生产版本
5. **部署** → 自动部署到服务器
6. **通知** → 成功/失败通知

### 最佳实践
- 小步快跑，频繁提交
- 自动化测试覆盖率 > 80%
- 部署前必跑测试
- 支持一键回滚
- 蓝绿部署/金丝雀发布`,tags:["ci-cd","github-actions","自动化","部署","devops"],category:"DevOps",createdAt:Date.now()-864e5*17,source:"CI/CD最佳实践"},{id:"k030",title:"JWT 认证与授权机制",content:`## JWT (JSON Web Token)

### JWT 结构
\`\`\`
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.abc123...
\`\`\`

### 生成与验证 (Python)
\`\`\`python
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"

def create_token(user_id: int) -> str:
    payload = {
        "userId": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise Exception("Token已过期")
    except jwt.InvalidTokenError:
        raise Exception("无效Token")
\`\`\`

### FastAPI 集成
\`\`\`python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(credentials = Depends(security)):
    payload = verify_token(credentials.credentials)
    user = await db.get_user(payload["userId"])
    if not user:
        raise HTTPException(401, "用户不存在")
    return user

@app.get("/profile")
async def profile(user = Depends(get_current_user)):
    return {"username": user.username}
\`\`\`

### 安全要点
- 密钥不要硬编码
- 设置合理的过期时间
- HTTPS传输
- 不存敏感信息在payload
- 刷新Token机制`,tags:["jwt","认证","授权","安全","token","fastapi"],category:"后端开发",createdAt:Date.now()-864e5*17,source:"认证授权实践"},{id:"k031",title:"Linux 常用命令与运维技巧",content:`## Linux 实用命令

### 文件操作
\`\`\`bash
# 查找文件
find / -name "*.log" -mtime +7  # 7天前的日志
locate filename

# 查看大文件
du -sh /var/log/* | sort -rh | head -10

# 压缩解压
tar -czf archive.tar.gz dir/
tar -xzf archive.tar.gz
zip -r archive.zip dir/
\`\`\`

### 进程管理
\`\`\`bash
# 查看进程
ps aux | grep nginx
top  # 实时监控
htop  # 增强版top

# 后台运行
nohup node server.js &
systemctl start nginx
systemctl enable nginx  # 开机启动
\`\`\`

### 网络工具
\`\`\`bash
# 查看端口
netstat -tlnp
ss -tlnp
lsof -i :8080

# 网络诊断
ping example.com
curl -I https://example.com
traceroute example.com
dig example.com
\`\`\`

### 日志查看
\`\`\`bash
# 实时日志
tail -f /var/log/syslog
journalctl -u nginx -f

# 搜索日志
grep "ERROR" /var/log/app.log
grep -rn "keyword" /var/log/
\`\`\`

### 性能分析
\`\`\`bash
# 磁盘
df -h
iostat -x 1

# 内存
free -h
vmstat 1

# 网络
iftop
nethogs
\`\`\``,tags:["linux","运维","命令行","shell","devops"],category:"DevOps",createdAt:Date.now()-864e5*18,source:"Linux运维手册"},{id:"k032",title:"Nginx 反向代理与负载均衡",content:`## Nginx 配置

### 反向代理
\`\`\`nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket支持
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态文件
    location /static/ {
        root /var/www/app;
        expires 30d;
    }
}
\`\`\`

### 负载均衡
\`\`\`nginx
upstream backend {
    # 轮询（默认）
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    server 127.0.0.1:8003;

    # 权重
    server 127.0.0.1:8001 weight=3;
    server 127.0.0.1:8002 weight=1;

    # IP哈希（会话保持）
    ip_hash;

    # 健康检查
    server 127.0.0.1:8001 max_fails=3 fail_timeout=30s;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
\`\`\`

### HTTPS配置
\`\`\`nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # HTTP跳转HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
}
\`\`\``,tags:["nginx","反向代理","负载均衡","https","运维"],category:"DevOps",createdAt:Date.now()-864e5*18,source:"Nginx配置手册"},{id:"k033",title:"Pydantic 数据验证与序列化",content:`## Pydantic v2 使用

### 基本模型
\`\`\`python
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\\.[^@]+$')
    password: str = Field(..., min_length=8)
    age: Optional[int] = Field(None, ge=0, le=150)

    @validator('username')
    def username_must_be_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError('用户名只能包含字母和数字')
        return v

# 自动验证
user = UserCreate(
    username="test123",
    email="test@example.com",
    password="securepass123"
)
print(user.model_dump())  # 转dict
print(user.model_dump_json())  # 转JSON
\`\`\`

### 嵌套模型
\`\`\`python
class Address(BaseModel):
    city: str
    street: str
    zip_code: str

class User(BaseModel):
    name: str
    address: Address  # 嵌套

user = User(name="张三", address={"city": "北京", "street": "长安街", "zip_code": "100000"})
\`\`\`

### FastAPI集成
\`\`\`python
@app.post("/users")
async def create_user(user: UserCreate):
    # user已自动验证
    db_user = await db.create_user(user)
    return {"id": db_user.id, "username": db_user.username}
\`\`\`

### 优势
- 类型安全
- 自动文档生成
- 性能优异（Rust内核）
- 支持复杂数据结构`,tags:["pydantic","python","数据验证","fastapi","序列化"],category:"后端开发",createdAt:Date.now()-864e5*19,source:"Pydantic文档"},{id:"k034",title:"SQLAlchemy ORM 完整指南",content:`## SQLAlchemy 2.0 异步ORM

### 模型定义
\`\`\`python
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.ext.asyncio import AsyncSession

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
\`\`\`

### 异步查询
\`\`\`python
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("sqlite+aiosqlite:///./app.db")
async_session = async_sessionmaker(engine)

async def get_users():
    async with async_session() as session:
        result = await session.execute(select(User))
        return result.scalars().all()

async def create_user(username: str, email: str):
    async with async_session() as session:
        user = User(username=username, email=email)
        session.add(user)
        await session.commit()
        return user

async def get_user_with_posts(user_id: int):
    async with async_session() as session:
        stmt = select(User).where(User.id == user_id).options(
            selectinload(User.posts)
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
\`\`\`

### 迁移管理 (Alembic)
\`\`\`bash
alembic init migrations
alembic revision --autogenerate -m "create users table"
alembic upgrade head
\`\`\``,tags:["sqlalchemy","orm","python","数据库","异步"],category:"数据库",createdAt:Date.now()-864e5*19,source:"SQLAlchemy文档"},{id:"k035",title:"Next.js 全栈框架指南",content:`## Next.js 14 App Router

### 文件路由系统
\`\`\`
app/
├── layout.tsx          # 根布局
├── page.tsx            # 首页 /
├── about/page.tsx      # /about
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/page.tsx # /blog/:slug (动态路由)
├── api/
│   └── users/route.ts  # API路由 /api/users
└── dashboard/
    ├── layout.tsx      # 嵌套布局
    └── page.tsx        # /dashboard
\`\`\`

### Server Component
\`\`\`tsx
// 默认就是Server Component，直接访问数据库
export default async function BlogPage() {
  const posts = await db.post.findMany()
  return (
    <main>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  )
}
\`\`\`

### Client Component
\`\`\`tsx
'use client'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
\`\`\`

### API路由
\`\`\`typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}
\`\`\`

### 优势
- SSR/SSG/ISR多种渲染模式
- 文件系统路由
- 内置API路由
- 图片优化
- 内置字体优化`,tags:["nextjs","react","全栈","ssr","ssg","框架"],category:"前端开发",createdAt:Date.now()-864e5*20,source:"Next.js文档"},{id:"k036",title:"Prisma 现代数据库ORM",content:`## Prisma 使用指南

### Schema定义
\`\`\`prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String?
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
\`\`\`

### 查询操作
\`\`\`typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 创建
const user = await prisma.user.create({
  data: { email: 'test@test.com', name: '张三' }
})

// 查询
const users = await prisma.user.findMany({
  where: { name: { contains: '张' } },
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
  take: 10
})

// 更新
await prisma.user.update({
  where: { id: 1 },
  data: { name: '李四' }
})

// 删除
await prisma.user.delete({ where: { id: 1 } })

// 事务
await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@test.com' } }),
  prisma.user.create({ data: { email: 'b@test.com' } }),
])
\`\`\`

### 迁移
\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio  # 可视化数据库
\`\`\``,tags:["prisma","orm","typescript","数据库","nodejs"],category:"数据库",createdAt:Date.now()-864e5*20,source:"Prisma文档"},{id:"k037",title:"Web安全防护大全",content:`## Web安全核心防护

### XSS 防护（跨站脚本）
\`\`\`typescript
// React自动转义（默认安全）
<div>{userInput}</div>

// 危险：直接插入HTML
<div dangerouslySetInnerHTML={{__html: userInput}} /> // 危险！

// 解决：使用DOMPurify
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />
\`\`\`

### CSRF 防护（跨站请求伪造）
\`\`\`python
# FastAPI中间件
@app.middleware("http")
async def csrf_check(request: Request):
    if request.method in ["POST", "PUT", "DELETE"]:
        token = request.headers.get("X-CSRF-Token")
        if token != expected_token:
            return JSONResponse(403, {"error": "CSRF token invalid"})
    return await call_next(request)
\`\`\`

### SQL注入防护
\`\`\`python
# 危险：字符串拼接
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")

# 安全：参数化查询
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))

# 安全：ORM
session.query(User).filter(User.name == name).all()
\`\`\`

### 其他安全措施
- **HTTPS**：全站强制HTTPS
- **CORS**：限制跨域来源
- **CSP**：内容安全策略
- **Rate Limit**：限流防暴力破解
- **密码加密**：bcrypt/scrypt
- **敏感信息**：环境变量管理
- **依赖安全**：定期npm audit
- **日志脱敏**：不记录密码/Token`,tags:["安全","xss","csrf","sql注入","web安全","防护"],category:"安全",createdAt:Date.now()-864e5*21,source:"Web安全实践"},{id:"k038",title:"Prompt Engineering 提示词工程",content:`## 提示词工程技巧

### 基本原则
1. **明确角色**：让AI扮演特定角色
2. **具体描述**：避免模糊指令
3. **提供示例**：用few-shot引导
4. **分步骤**：复杂任务拆解
5. **设定约束**：格式、长度、风格

### 角色提示
\`\`\`
你是一位资深Python后端工程师，精通FastAPI。
请帮我设计一个RESTful API，要求：
1. 遵循REST规范
2. 包含错误处理
3. 添加类型注解
4. 编写完整Docstring
\`\`\`

### Few-Shot 示例
\`\`\`
请将以下句子分类为"正面"或"负面"：

示例：
"这个产品很好用" → 正面
"服务态度太差了" → 负面
"质量一般般吧" → 中性

分类：
"超出预期的体验" →
\`\`\`

### Chain of Thought (思维链)
\`\`\`
请一步步分析以下问题：
1. 首先理解需求
2. 然后设计方案
3. 接着实现代码
4. 最后验证结果

问题：实现一个用户注册API
\`\`\`

### 结构化输出
\`\`\`
请以JSON格式输出，包含以下字段：
{
  "title": "功能标题",
  "description": "功能描述",
  "code": "代码实现",
  "tests": "测试用例"
}
\`\`\`

### 常用技巧
- Temperature: 0=确定性, 0.7=创造性, 1=随机
- Top-P: 控制多样性
- 最大Token: 控制输出长度
- 系统提示: 设定全局行为`,tags:["prompt","提示词","ai","llm","工程","技巧"],category:"AI/智能体",createdAt:Date.now()-864e5*21,source:"Prompt工程指南"},{id:"k039",title:"PostgreSQL 高级特性",content:`## PostgreSQL 进阶

### JSONB操作
\`\`\`sql
-- 存储JSON
INSERT INTO events (data) VALUES ('{"type":"click","page":"home"}');

-- 查询JSON字段
SELECT data->>'type' FROM events WHERE data->>'page' = 'home';

-- JSON索引
CREATE INDEX idx_events_data ON events USING gin(data);

-- 更新JSON
UPDATE events SET data = jsonb_set(data, '{time}', 'now()');
\`\`\`

### 窗口函数
\`\`\`sql
-- 排名
SELECT name, score,
  RANK() OVER (ORDER BY score DESC) as rank,
  DENSE_RANK() OVER (ORDER BY score DESC) as dense_rank,
  ROW_NUMBER() OVER (ORDER BY score DESC) as row_num
FROM students;

-- 分组排名
SELECT name, class, score,
  RANK() OVER (PARTITION BY class ORDER BY score DESC) as class_rank
FROM students;

-- 累计求和
SELECT date, revenue,
  SUM(revenue) OVER (ORDER BY date) as cumulative
FROM daily_sales;
\`\`\`

### CTE递归查询
\`\`\`sql
-- 组织架构树
WITH RECURSIVE org_tree AS (
  -- 基础查询：顶层
  SELECT id, name, parent_id, 0 as level
  FROM departments WHERE parent_id IS NULL

  UNION ALL

  -- 递归：子节点
  SELECT d.id, d.name, d.parent_id, ot.level + 1
  FROM departments d
  JOIN org_tree ot ON d.parent_id = ot.id
)
SELECT * FROM org_tree ORDER BY level;
\`\`\`

### 全文搜索
\`\`\`sql
-- 创建全文索引
CREATE INDEX idx_articles_fts ON articles USING gin(to_tsvector('chinese', content));

-- 搜索
SELECT * FROM articles
WHERE to_tsvector('chinese', content) @@ to_tsquery('chinese', '关键词');
\`\`\``,tags:["postgresql","postgres","数据库","sql","jsonb","窗口函数"],category:"数据库",createdAt:Date.now()-864e5*22,source:"PostgreSQL文档"},{id:"k040",title:"React 性能优化全攻略",content:`## React 性能优化

### 1. 组件优化
\`\`\`tsx
// React.memo 避免不必要重渲染
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>
})

// useMemo 缓存计算结果
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.id - b.id)
}, [data])

// useCallback 缓存函数
const handleClick = useCallback((id) => {
  setSelected(id)
}, [])
\`\`\`

### 2. 虚拟列表
\`\`\`tsx
import { FixedSizeList } from 'react-window'

// 渲染10000条数据不卡
<FixedSizeList height={600} itemCount={10000} itemSize={50} width="100%">
  {({ index, style }) => (
    <div style={style}>Item {index}</div>
  )}
</FixedSizeList>
\`\`\`

### 3. 代码分割
\`\`\`tsx
// 路由级懒加载
const Dashboard = lazy(() => import('./Dashboard'))
const Settings = lazy(() => import('./Settings'))

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
\`\`\`

### 4. 状态优化
\`\`\`tsx
// Zustand选择器：只订阅需要的字段
const userName = useUserStore(state => state.name)
// 不是：const user = useUserStore(state => state) // 订阅整个store

// 拆分store：避免大store导致重渲染
\`\`\`

### 5. 其他技巧
- 图片懒加载: loading="lazy"
- 防抖/节流: lodash.debounce
- Web Worker: 耗时计算放后台
- requestIdleCallback: 空闲时执行
- CSS containment: contain属性`,tags:["react","性能优化","虚拟列表","懒加载","memo"],category:"前端开发",createdAt:Date.now()-864e5*22,source:"React性能优化"},{id:"k041",title:"GraphQL API 设计与实现",content:`## GraphQL 核心

### Schema定义
\`\`\`graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

type Query {
  user(id: ID!): User
  users(limit: Int = 10): [User!]!
  posts(authorId: ID): [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String): User!
  deleteUser(id: ID!): Boolean!
}
\`\`\`

### 查询示例
\`\`\`graphql
# 精确获取需要的字段
query {
  user(id: 1) {
    name
    email
    posts {
      title
    }
  }
}

# 批量查询
query {
  users(limit: 5) {
    name
  }
  posts {
    title
    author {
      name
    }
  }
}
\`\`\`

### Python实现 (Strawberry)
\`\`\`python
import strawberry

@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str

@strawberry.type
class Query:
    @strawberry.field
    def user(self, id: strawberry.ID) -> User:
        return db.get_user(id)

schema = strawberry.Schema(query=Query)
\`\`\`

### vs REST
- GraphQL: 客户端精确获取所需字段，一次请求多个资源
- REST: 固定字段，可能过度获取或不足
- GraphQL适合复杂数据关系，REST适合简单CRUD`,tags:["graphql","api","查询语言","schema","strawberry"],category:"后端开发",createdAt:Date.now()-864e5*23,source:"GraphQL文档"},{id:"k042",title:"微服务架构设计模式",content:`## 微服务架构

### 核心模式

#### 1. 服务拆分
\`\`\`
单体应用 → 按业务领域拆分
├── 用户服务 (User Service)
├── 订单服务 (Order Service)
├── 商品服务 (Product Service)
├── 支付服务 (Payment Service)
└── 通知服务 (Notification Service)
\`\`\`

#### 2. API网关
\`\`\`python
# API网关统一入口
@app.route("/api/users/<user_id>")
async def get_user(user_id):
    return await user_service.get(user_id)

@app.route("/api/orders")
async def create_order():
    # 调用多个服务
    order = await order_service.create()
    await notification_service.send(order)
    return order
\`\`\`

#### 3. 服务发现
\`\`\`yaml
# Consul / Eureka 注册中心
services:
  user-service:
    instances:
      - host: 10.0.0.1
        port: 8001
      - host: 10.0.0.2
        port: 8001
\`\`\`

#### 4. 消息队列 (异步通信)
\`\`\`python
# 发布事件
await redis.publish("order_created", order_data)

# 订阅处理
@redis.subscribe("order_created")
async def handle_order(order_data):
    await send_email(order_data)
    await update_inventory(order_data)
\`\`\`

#### 5. 熔断器模式
\`\`\`python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=30)
async def call_payment_service():
    # 连续失败5次后熔断30秒
    return await payment_api.charge()
\`\`\`

### 优势
- 独立部署和扩展
- 技术栈灵活
- 故障隔离
- 团队自治

### 挑战
- 分布式事务复杂
- 运维成本高
- 网络延迟
- 数据一致性`,tags:["微服务","架构","分布式","api网关","服务发现"],category:"架构设计",createdAt:Date.now()-864e5*23,source:"微服务架构"},{id:"k043",title:"Framer Motion 动画库使用",content:`## Framer Motion 动画

### 基础动画
\`\`\`tsx
import { motion } from 'framer-motion'

// 淡入
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  淡入内容
</motion.div>

// 弹性
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  点击我
</motion.button>
\`\`\`

### 列表动画
\`\`\`tsx
import { AnimatePresence } from 'framer-motion'

const list = items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ delay: i * 0.1 }}
  >
    {item.name}
  </motion.div>
))

<AnimatePresence>
  {list}
</AnimatePresence>
\`\`\`

### 拖拽
\`\`\`tsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  whileDrag={{ scale: 1.1 }}
>
  拖拽我
</motion.div>
\`\`\`

### 手势识别
\`\`\`tsx
<motion.div
  onPan={(e, info) => console.log(info.offset.x, info.offset.y)}
  onHoverStart={() => console.log('hover')}
  onTap={() => console.log('tap')}
>
  手势区域
</motion.div>
\`\`\`

### 滚动动画
\`\`\`tsx
import { useScroll, useTransform } from 'framer-motion'

const { scrollY } = useScroll()
const opacity = useTransform(scrollY, [0, 200], [1, 0])

<motion.div style={{ opacity }}>
  随滚动淡出
</motion.div>
\`\`\``,tags:["framer-motion","动画","react","交互","ui"],category:"前端开发",createdAt:Date.now()-864e5*24,source:"Framer Motion文档"},{id:"k044",title:"Electron 桌面应用开发",content:`## Electron 桌面应用

### 项目结构
\`\`\`
my-app/
├── main.js          # 主进程
├── preload.js       # 预加载脚本
├── renderer/        # 渲染进程（前端）
│   ├── index.html
│   └── app.tsx
└── package.json
\`\`\`

### 主进程
\`\`\`javascript
const { app, BrowserWindow, ipcMain } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadFile('renderer/index.html')
  // 或加载开发服务器
  // win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)
\`\`\`

### IPC通信
\`\`\`javascript
// preload.js - 桥接
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  readFile: () => ipcRenderer.invoke('read-file')
})

// main.js - 处理
ipcMain.handle('save-file', async (event, data) => {
  await fs.writeFile('data.json', JSON.stringify(data))
  return true
})
\`\`\`

### 打包发布
\`\`\`bash
# 使用electron-builder
npx electron-builder --mac --win --linux

# 或使用electron-forge
npx electron-forge make
\`\`\`

### 知名应用
- VS Code
- Discord
- Slack
- Figma (桌面版)`,tags:["electron","桌面应用","nodejs","跨平台","native"],category:"前端开发",createdAt:Date.now()-864e5*24,source:"Electron文档"},{id:"k045",title:"Embedding 向量化与语义搜索",content:`## 文本向量化

### 什么是Embedding
将文本转为高维向量，使语义相近的文本在向量空间中距离更近。

### OpenAI Embedding
\`\`\`python
from openai import OpenAI
client = OpenAI()

# 生成向量
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="React是一个UI框架"
)
vector = response.data[0].embedding  # 1536维向量
\`\`\`

### 开源Embedding模型
\`\`\`python
# 使用 sentence-transformers (本地运行)
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
vectors = model.encode([
    "React是UI框架",
    "Vue是渐进式框架",
    "Python是编程语言"
])
# vectors[0] 和 vectors[1] 距离近，和 vectors[2] 距离远
\`\`\`

### 相似度计算
\`\`\`python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# 余弦相似度
sim = cosine_similarity([vec1], [vec2])[0][0]
# 0-1之间，越接近1越相似

# 点积（归一化后等价于余弦）
dot = np.dot(vec1, vec2)
\`\`\`

### 语义搜索实现
\`\`\`python
class SemanticSearch:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.documents = []
        self.vectors = []

    def add(self, doc: str):
        vec = self.model.encode(doc)
        self.documents.append(doc)
        self.vectors.append(vec)

    def search(self, query: str, top_k: int = 3):
        q_vec = self.model.encode(query)
        sims = cosine_similarity([q_vec], self.vectors)[0]
        top_idx = np.argsort(sims)[-top_k:][::-1]
        return [(self.documents[i], sims[i]) for i in top_idx]
\`\`\`

### 应用场景
- 语义搜索（比关键词更智能）
- 推荐系统
- 去重
- 聚类分析
- RAG检索增强`,tags:["embedding","向量化","语义搜索","ai","nlp","相似度"],category:"AI/智能体",createdAt:Date.now()-864e5*25,source:"向量化技术"},{id:"k046",title:"测试驱动开发TDD实践",content:`## TDD (Test-Driven Development)

### 核心循环：红-绿-重构
1. **红**：先写测试（会失败，因为功能还没实现）
2. **绿**：写最少代码让测试通过
3. **重构**：优化代码，保持测试通过

### 示例：开发一个计算器
\`\`\`python
# 第1步：红 - 写测试
def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

# 第2步：绿 - 实现
def add(a, b):
    return a + b

# 第3步：重构 - 已是最简，无需重构
\`\`\`

### pytest 完整示例
\`\`\`python
import pytest

class TestBankAccount:
    def setup_method(self):
        self.account = BankAccount(100)

    def test_deposit(self):
        self.account.deposit(50)
        assert self.account.balance == 150

    def test_withdraw(self):
        self.account.withdraw(30)
        assert self.account.balance == 70

    def test_insufficient_funds(self):
        with pytest.raises(InsufficientFundsError):
            self.account.withdraw(200)

    @pytest.mark.parametrize("amount,expected", [
        (10, 90), (50, 50), (100, 0)
    ])
    def test_withdraw_amounts(self, amount, expected):
        self.account.withdraw(amount)
        assert self.account.balance == expected
\`\`\`

### Vitest (前端)
\`\`\`typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Counter', () => {
  it('should increment', () => {
    render(<Counter />)
    const button = screen.getByText('Click')
    fireEvent.click(button)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
\`\`\`

### 测试金字塔
\`\`\`
      /  E2E  \\      少量（端到端测试）
     /--------\\
    /Integration\\    适量（集成测试）
   /------------\\
  /    Unit     \\   大量（单元测试）
 /----------------\\
\`\`\``,tags:["tdd","测试","pytest","vitest","最佳实践"],category:"工程化",createdAt:Date.now()-864e5*25,source:"TDD实践"},{id:"k047",title:"RESTful API vs GraphQL vs gRPC",content:`## 三种API风格对比

### RESTful API
\`\`\`
GET    /api/users          # 列表
GET    /api/users/1        # 详情
POST   /api/users          # 创建
PUT    /api/users/1        # 更新
DELETE /api/users/1        # 删除

# 优点：简单、缓存友好、成熟
# 缺点：过度获取/不足获取、多请求
\`\`\`

### GraphQL
\`\`\`graphql
# 客户端精确指定字段
query {
  user(id: 1) {
    name
    email
    posts(limit: 3) {
      title
    }
  }
}

# 优点：精确获取、一次请求
# 缺点：复杂、缓存难、N+1问题
\`\`\`

### gRPC
\`\`\`protobuf
// 定义服务
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc ListUsers (ListRequest) returns (stream UserResponse);
}

// 优点：高性能、强类型、流式
// 缺点：浏览器不支持（需gRPC-Web）、学习曲线
\`\`\`

### 选择建议

| 场景 | 推荐 |
|------|------|
| 公开API | REST |
| 内部微服务 | gRPC |
| 复杂查询 | GraphQL |
| 实时通信 | WebSocket |
| 简单CRUD | REST |
| 移动端 | REST + BFF |

### 混合架构
\`\`\`
客户端 → GraphQL BFF → REST/gRPC 微服务
\`\`\`
- BFF层聚合多个微服务
- 内部用gRPC高性能通信
- 对外暴露GraphQL灵活查询`,tags:["rest","graphql","grpc","api","对比","架构"],category:"架构设计",createdAt:Date.now()-864e5*26,source:"API设计对比"},{id:"k048",title:"开源免费AI服务汇总",content:`## 免费AI服务资源

### 大语言模型 (免费额度)
1. **Google Gemini** - 免费API
   - gemini-1.5-flash: 免费
   - 注册：https://aistudio.google.com/

2. **Groq** - 超快推理
   - Llama 3 / Mixtral 免费
   - 注册：https://console.groq.com/

3. **Cohere** - 免费额度
   - Command R / Command R+
   - 注册：https://dashboard.cohere.com/

4. **Together AI** - 开源模型
   - 每月$1免费额度
   - 注册：https://api.together.xyz/

5. **OpenRouter** - 聚合平台
   - 部分模型免费
   - 注册：https://openrouter.ai/

### Embedding模型 (开源免费)
\`\`\`python
# 本地运行，完全免费
from sentence_transformers import SentenceTransformer

# 轻量级模型
model = SentenceTransformer('all-MiniLM-L6-v2')  # 384维, 80MB

# 多语言模型
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# 高质量模型
model = SentenceTransformer('bge-large-en-v1.5')  # 1024维
\`\`\`

### 向量数据库 (开源免费)
1. **ChromaDB** - 轻量级，本地部署
   \`\`\`bash
   pip install chromadb
   \`\`\`

2. **Qdrant** - 高性能，Docker部署
   \`\`\`bash
   docker run -p 6333:6333 qdrant/qdrant
   \`\`\`

3. **Milvus** - 大规模，Docker部署
   \`\`\`bash
   docker compose up milvus-standalone
   \`\`\`

4. **FAISS** - Facebook开源向量搜索库
   \`\`\`bash
   pip install faiss-cpu
   \`\`\`

### 搜索API
1. **Tavily** - AI搜索API，免费1000次/月
2. **Serper.dev** - Google搜索API，免费2500次/月
3. **DuckDuckGo** - 完全免费
   \`\`\`python
   from duckduckgo_search import DDGS
   results = DDGS().text("query", max_results=5)
   \`\`\`

### 代码执行沙箱
1. **E2B** - 免费沙箱，每月100小时
2. **Judge0** - 开源代码执行引擎
3. **Docker** - 自建沙箱`,tags:["免费","开源","ai","api","gemini","groq","资源"],category:"AI/智能体",createdAt:Date.now()-864e5*26,source:"开源社区汇总"},{id:"k049",title:"Project Genesis - Nexus-1 智能体框架",content:`## Nexus-1 核心智能体后端框架

### 项目定位
Nexus-1 是高度模块化的"任务路由与记忆中枢"，解决LLM两大痛点：
1. 长对话记忆丢失
2. 无法自主执行复杂多步操作

### 技术栈
- **后端**: Python + FastAPI
- **AI编排**: LangChain / AutoGen
- **向量数据库**: ChromaDB / Milvus
- **前端**: Streamlit → Next.js

### 核心算法
1. **ReAct算法**：思考→行动→观察闭环
2. **RAG检索**：向量化存储+语义检索
3. **动态上下文管理**：自动压缩旧对话

### API接入
- LLM: OpenRouter / DeepSeek
- 搜索: Tavily / Serper.dev
- 沙箱: E2B / Docker

### 核心交付文件
- main.py: 启动入口
- agent_core.py: ReAct引擎 + 任务拆解
- memory_store.py: 向量记忆存储

### 设计规范
- 配置中心化（.env）
- 插件化架构
- 全链路日志监控`,tags:["nexus-1","project-genesis","智能体","fastapi","react","rag"],category:"AI/智能体",createdAt:Date.now()-864e5*27,source:"项目需求文档"}],be=re()($t(e=>({entries:ue,selectedEntry:null,searchQuery:"",addEntry:r=>e(a=>a.entries.some(s=>s.id===r.id)?a:{entries:[r,...a.entries]}),deleteEntry:r=>e(a=>({entries:a.entries.filter(s=>s.id!==r)})),selectEntry:r=>e({selectedEntry:r}),setSearch:r=>e({searchQuery:r}),resetToDefault:()=>e({entries:ue})}),{name:"hopeai-knowledge-store",storage:He(()=>localStorage),version:2,partialize:e=>({entries:e.entries}),merge:(e,r)=>{const a=e,s=(a==null?void 0:a.entries)||[],o=new Set(ue.map(i=>i.id)),n=s.filter(i=>!o.has(i.id));return{...r,entries:[...n,...ue]}}})),we=re()($t(e=>({theme:"cyber",fontSize:14,animationsEnabled:!0,selfLearning:!0,autoKnowledge:!0,workflowSpeed:2,setTheme:r=>e({theme:r}),setFontSize:r=>e({fontSize:r}),toggleAnimations:()=>e(r=>({animationsEnabled:!r.animationsEnabled})),toggleSelfLearning:()=>e(r=>({selfLearning:!r.selfLearning})),toggleAutoKnowledge:()=>e(r=>({autoKnowledge:!r.autoKnowledge})),setWorkflowSpeed:r=>e({workflowSpeed:r})}),{name:"hopeai-theme-store",storage:He(()=>localStorage)})),U=e=>new Promise(r=>setTimeout(r,e));function Le(e,r=3){try{const a=be.getState().entries;if(!a||a.length===0)return"";const s=e.toLowerCase(),o=s.split(/[\s,，。、！？]+/).filter(p=>p.length>1),i=a.map(p=>{let l=0;const m=p.title.toLowerCase(),x=p.content.toLowerCase(),y=p.tags.map(u=>u.toLowerCase()).join(" ");for(const u of o)m.includes(u)&&(l+=3),y.includes(u)&&(l+=2),x.includes(u)&&(l+=1);for(const u of p.tags)s.includes(u.toLowerCase())&&u.length>1&&(l+=2);return{entry:p,score:l}}).filter(p=>p.score>0).sort((p,l)=>l.score-p.score).slice(0,r);return i.length===0?"":i.map((p,l)=>`【参考${l+1}】${p.entry.title}
${p.entry.content.slice(0,500)}...`).join(`

`)}catch{return""}}const Ds={id:"analyst",name:"分析员",role:"需求分析师",avatar:"🔍",description:"接收命令后生成分析报告，拆解需求、提出方案、列出步骤",generateResponse:async e=>{await U(800+Math.random()*1200);const r=G(e),a=Le(e,3),o=(()=>{const y=e.match(/[\u4e00-\u9fa5a-zA-Z_]{2,}/g)??[],u=new Set(["需求","设计","方案","系统","功能","实现","一个","我们","帮我","开发","请","the","a","an","of","and","to","for","with"]),v=y.filter(_=>!u.has(_.toLowerCase()));return v.length>0?v.slice(0,5):["核心功能"]})(),n={"python-backend":{stack:["FastAPI - 现代 async Web 框架","SQLAlchemy 2.0 - 异步 ORM","Pydantic - 类型校验与序列化","Uvicorn - ASGI 高性能服务器","Alembic - 数据库迁移"],architecture:"分层架构：Router → Service → Repository，配合依赖注入与异步 IO",riskFocus:"异步上下文传播、数据库连接池耗尽、Pydantic 模型校验遗漏"},"ai-agent":{stack:["LangChain - LLM 编排框架","ChromaDB - 向量记忆库","OpenAI API - 大语言模型","ReAct 算法 - 推理-行动循环","Tavily - 联网搜索工具"],architecture:"ReAct 闭环 + RAG 检索增强，配合长期记忆与工具调度器",riskFocus:"ReAct 死循环、Token 超限、记忆污染、工具调用安全性"},"react-frontend":{stack:["React 18 - UI 视图框架","TypeScript - 类型安全","TailwindCSS - 原子化样式","Vite - 极速构建工具","Zustand - 轻量状态管理"],architecture:"组件化设计 + Hooks 复用，按页面/组件/Hook/Store 分层",riskFocus:"状态管理复杂度、首屏加载性能、可访问性、SSR/CSR 一致性"},database:{stack:["MySQL 8 / PostgreSQL 16 - 关系型数据库","Redis 7 - 缓存与会话","Prisma / SQLAlchemy - ORM","Flyway - 版本化迁移","pgvector - 向量扩展"],architecture:"主从读写分离 + 分库分表，配合 Redis 缓存层与慢查询监控",riskFocus:"索引设计、SQL 注入、事务隔离级别、数据一致性"},general:{stack:["TypeScript - 类型安全基础","Vite - 构建工具","ESLint + Prettier - 代码规范","Vitest - 单元测试","Docker - 容器化部署"],architecture:"模块化 + 配置中心化，遵循 SOLID 原则与单一职责",riskFocus:"需求变更频繁、依赖版本升级、配置管理混乱"}},i=n[r]??n.general,c=Math.max(3,Math.min(o.length+1,6)),p=(y,u)=>y*u,l=o.map((y,u)=>`${u+1}. ${y} 模块 - 围绕「${y}」的核心业务逻辑与数据流`).join(`
`),m=[{task:"需求确认与方案设计",time:p(10,1)},{task:"核心功能开发",time:p(15,c)},{task:"接口联调与代码审查",time:p(8,c)},{task:"测试与部署上线",time:p(12,1)}],x=m.reduce((y,u)=>y+u.time,0);return`## 需求分析报告

### 一、需求拆解
**原始需求**：${e}

**项目类型识别**：\`${r}\`

**核心目标**：
- 目标1：解析「${o[0]??"核心功能"}」相关的核心诉求
- 目标2：界定功能边界，识别 ${o.length} 个关键模块
- 目标3：制定与「${e.slice(0,30)}」相匹配的可执行路径

**功能模块**（基于指令关键词提取）：
${l}

### 二、技术方案
**推荐技术栈**（适配 ${r} 类型）：
${i.stack.map(y=>`- ${y}`).join(`
`)}

**架构设计**：
${i.architecture}

### 三、实施步骤
| 阶段 | 任务 | 预计耗时 |
|------|------|----------|
| 1 | ${m[0].task} | ${m[0].time}min |
| 2 | ${m[1].task} | ${m[1].time}min |
| 3 | ${m[2].task} | ${m[2].time}min |
| 4 | ${m[3].task} | ${m[3].time}min |

**总预计耗时**：约 ${x}min

### 四、风险评估
- 潜在风险：${i.riskFocus}
- 需求相关风险：实现「${o[0]??"核心功能"}」时可能涉及外部依赖与边界情况
- 应对措施：采用迭代开发模式，先实现 MVP 再逐步完善；针对上述风险编写回归测试

---
*请确认以上分析是否符合「${e.slice(0,20)}」的预期，或提出调整意见。*${a?`

---
📚 **知识库参考**（RAG检索）

${a}`:""}`}};function G(e){const r=e.toLowerCase();return r.includes("python")||r.includes("fastapi")||r.includes("flask")||r.includes("django")||r.includes("后端")||r.includes("backend")||r.includes("api接口")||r.includes("main.py")||r.includes("agent_core")||r.includes("memory_store")?"python-backend":r.includes("react")||r.includes("vue")||r.includes("前端")||r.includes("frontend")||r.includes("组件")||r.includes("ui界面")||r.includes("tsx")||r.includes("next.js")||r.includes("tailwind")?"react-frontend":r.includes("sql")||r.includes("数据库")||r.includes("database")||r.includes("建表")||r.includes("mysql")||r.includes("postgres")||r.includes("create table")?"database":r.includes("ai")||r.includes("智能体")||r.includes("agent")||r.includes("langchain")||r.includes("autogen")||r.includes("llm")||r.includes("rag")||r.includes("react算法")||r.includes("向量")||r.includes("chromadb")||r.includes("记忆库")?"ai-agent":"general"}const Ss={id:"coder-a",name:"代码员A",role:"核心架构工程师",avatar:"🎨",description:"根据需求类型生成完整的核心架构代码",generateResponse:async e=>{await U(1e3+Math.random()*1500);const r=G(e);let a="";return r==="python-backend"?a=`\`\`\`python
# main.py - 系统统一启动入口
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from agent_core import AgentCore
from memory_store import MemoryStore
from routers import task_router, memory_router, plugin_router

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 全局实例
agent_core: AgentCore = None
memory_store: MemoryStore = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    global agent_core, memory_store
    logger.info("正在初始化 Nexus-1 核心系统...")

    # 初始化记忆存储
    memory_store = MemoryStore(
        db_path=os.getenv("CHROMA_DB_PATH", "./data/chroma"),
        collection_name="nexus_memory"
    )
    await memory_store.initialize()

    # 初始化核心智能体
    agent_core = AgentCore(
        llm_api_key=os.getenv("OPENROUTER_API_KEY"),
        llm_model=os.getenv("LLM_MODEL", "deepseek/deepseek-chat"),
        memory_store=memory_store,
        search_api_key=os.getenv("TAVILY_API_KEY"),
        sandbox_enabled=os.getenv("SANDBOX_ENABLED", "true").lower() == "true"
    )
    await agent_core.initialize()

    logger.info("Nexus-1 核心系统初始化完成")
    yield

    # 清理资源
    if memory_store:
        await memory_store.close()
    logger.info("Nexus-1 系统已关闭")

# 创建 FastAPI 应用
app = FastAPI(
    title="Nexus-1 Core Agent Framework",
    description="Project Genesis - 下一代智能体后端框架",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(task_router.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(memory_router.router, prefix="/api/memory", tags=["memory"])
app.include_router(plugin_router.router, prefix="/api/plugins", tags=["plugins"])

@app.get("/")
async def root():
    return {"status": "running", "service": "Nexus-1", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "agents_ready": agent_core is not None}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"未处理的异常: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "internal_server_error", "detail": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "false").lower() == "true"
    )
\`\`\`

\`\`\`python
# agent_core.py - 核心大脑逻辑
import json
import logging
from typing import Optional
from dataclasses import dataclass, field

from memory_store import MemoryStore

logger = logging.getLogger(__name__)

@dataclass
class Thought:
    """ReAct 思考节点"""
    step: int
    thought: str
    action: Optional[str] = None
    action_input: Optional[str] = None
    observation: Optional[str] = None

@dataclass
class TaskDecomposition:
    """任务拆解结果"""
    main_task: str
    subtasks: list = field(default_factory=list)
    required_tools: list = field(default_factory=list)
    estimated_steps: int = 0

class AgentCore:
    """Nexus-1 核心智能体"""

    def __init__(
        self,
        llm_api_key: str,
        llm_model: str,
        memory_store: MemoryStore,
        search_api_key: Optional[str] = None,
        sandbox_enabled: bool = True
    ):
        self.llm_api_key = llm_api_key
        self.llm_model = llm_model
        self.memory = memory_store
        self.search_api_key = search_api_key
        self.sandbox_enabled = sandbox_enabled
        self.plugins = {}  # 插件注册表
        self.max_react_iterations = 10

    async def initialize(self):
        """初始化核心组件"""
        logger.info(f"初始化 AgentCore，模型: {self.llm_model}")
        await self._register_default_plugins()

    async def _register_default_plugins(self):
        """注册默认插件"""
        from plugins.search_plugin import SearchPlugin
        from plugins.code_sandbox import CodeSandboxPlugin

        self.plugins["search"] = SearchPlugin(api_key=self.search_api_key)
        if self.sandbox_enabled:
            self.plugins["code_sandbox"] = CodeSandboxPlugin()
        logger.info(f"已注册 {len(self.plugins)} 个插件")

    def register_plugin(self, name: str, plugin):
        """动态注册插件"""
        self.plugins[name] = plugin
        logger.info(f"插件已注册: {name}")

    async def decompose_task(self, user_input: str) -> TaskDecomposition:
        """将模糊指令拆解为可执行的子任务"""
        prompt = f"""请将以下用户指令拆解为具体的子任务步骤。
用户指令: {user_input}

返回JSON格式:
{{
  "main_task": "主要任务描述",
  "subtasks": ["步骤1", "步骤2", "步骤3"],
  "required_tools": ["search", "code_sandbox"],
  "estimated_steps": 3
}}"""
        response = await self._call_llm(prompt)
        try:
            data = json.loads(response)
            return TaskDecomposition(**data)
        except json.JSONDecodeError:
            return TaskDecomposition(main_task=user_input, subtasks=[user_input])

    async def react_loop(self, user_input: str) -> str:
        """ReAct 算法主循环: 思考→行动→观察"""
        thoughts: list[Thought] = []

        # RAG: 检索相关记忆
        context = await self.memory.retrieve(user_input, top_k=5)

        for step in range(self.max_react_iterations):
            # Thought: 思考
            thought = await self._generate_thought(user_input, context, thoughts, step)

            if thought.action == "final_answer":
                # 生成最终回答
                answer = thought.observation or ""
                # 存入记忆库
                await self.memory.store(user_input, answer)
                return answer

            # Action: 执行工具
            if thought.action and thought.action in self.plugins:
                plugin = self.plugins[thought.action]
                thought.observation = await plugin.execute(thought.action_input)
            else:
                thought.observation = "工具不存在或无需调用"

            thoughts.append(thought)

        return "已达最大迭代次数，请重新描述需求。"

    async def _generate_thought(self, query, context, history, step) -> Thought:
        """生成单步思考"""
        history_str = "\\n".join([f"步骤{t.step}: 思考={t.thought}, 行动={t.action}, 观察={t.observation}" for t in history])
        prompt = f"""ReAct 第 {step} 步。
用户需求: {query}
相关记忆: {context}
历史步骤: {history_str}

请输出JSON: {{"thought":"...", "action":"search|code_sandbox|final_answer", "action_input":"..."}}"""
        response = await self._call_llm(prompt)
        try:
            data = json.loads(response)
            return Thought(step=step, **data)
        except json.JSONDecodeError:
            return Thought(step=step, thought=response, action="final_answer")

    async def _call_llm(self, prompt: str) -> str:
        """调用大语言模型"""
        from openai import AsyncOpenAI
        client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.llm_api_key
        )
        response = await client.chat.completions.create(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2000
        )
        return response.choices[0].message.content
\`\`\``:r==="ai-agent"?a=`\`\`\`python
# memory_store.py - 记忆存储与检索逻辑
import logging
from typing import Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class MemoryEntry:
    """记忆条目"""
    id: str
    content: str
    embedding: list
    metadata: dict
    score: float = 0.0

class MemoryStore:
    """向量记忆存储 - 基于 ChromaDB"""

    def __init__(self, db_path: str, collection_name: str = "nexus_memory"):
        self.db_path = db_path
        self.collection_name = collection_name
        self.client = None
        self.collection = None
        self._embedding_fn = None

    async def initialize(self):
        """初始化向量数据库连接"""
        import chromadb
        from chromadb.utils import embedding_functions

        self.client = chromadb.PersistentClient(path=self.db_path)
        self._embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            embedding_function=self._embedding_fn,
            metadata={"hnsw:space": "cosine"}
        )
        logger.info(f"记忆库初始化完成: {self.collection_name}")

    async def store(self, query: str, response: str, metadata: Optional[dict] = None):
        """存储对话记忆"""
        entry_id = f"mem_{hash(query) & 0xFFFFFFFF:08x}"
        content = f"用户: {query}\\nAI: {response}"
        self.collection.add(
            documents=[content],
            ids=[entry_id],
            metadatas=[metadata or {"type": "conversation"}]
        )
        logger.info(f"记忆已存储: {entry_id}")

    async def retrieve(self, query: str, top_k: int = 5) -> list[MemoryEntry]:
        """RAG 检索: 根据查询返回最相关的记忆"""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        entries = []
        for i, doc in enumerate(results["documents"][0]):
            entries.append(MemoryEntry(
                id=results["ids"][0][i],
                content=doc,
                embedding=[],
                metadata=results["metadatas"][0][i],
                score=1.0 - results["distances"][0][i]
            ))
        logger.info(f"检索到 {len(entries)} 条相关记忆")
        return entries

    async def compress_context(self, messages: list, max_tokens: int = 4000):
        """动态上下文窗口管理: 压缩旧对话为摘要"""
        if len(messages) <= 4:
            return messages

        # 保留最近2轮对话
        recent = messages[-4:]
        old = messages[:-4]

        # 调用LLM压缩旧对话
        summary_prompt = "请将以下对话历史压缩为结构化摘要，保留关键实体和决策:\\n\\n"
        for msg in old:
            summary_prompt += f"{msg.get('role','user')}: {msg.get('content','')}\\n"

        # 返回: [摘要] + [最近对话]
        return [{"role": "system", "content": f"历史摘要: {summary_prompt[:2000]}"}] + recent

    async def close(self):
        """关闭连接"""
        if self.client:
            self.client = None
        logger.info("记忆库连接已关闭")
\`\`\``:r==="database"?a=`\`\`\`sql
-- Nexus-1 核心数据库设计
-- 用户表
CREATE TABLE users (
  id          VARCHAR(36) PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  avatar      VARCHAR(255),
  status      TINYINT DEFAULT 1 COMMENT '0:禁用 1:正常',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 任务表
CREATE TABLE tasks (
  id          VARCHAR(36) PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  content     TEXT,
  status      ENUM('pending','processing','completed','failed') DEFAULT 'pending',
  priority    TINYINT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 记忆条目表
CREATE TABLE memories (
  id          VARCHAR(36) PRIMARY KEY,
  user_id     VARCHAR(36) NOT NULL,
  task_id     VARCHAR(36),
  content     TEXT NOT NULL,
  summary     VARCHAR(500),
  embedding_id VARCHAR(100) COMMENT '向量数据库中的ID',
  metadata    JSON,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_task (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插件注册表
CREATE TABLE plugins (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(100) UNIQUE NOT NULL,
  version     VARCHAR(20) NOT NULL,
  description TEXT,
  config      JSON,
  status      ENUM('active','inactive','error') DEFAULT 'inactive',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- API调用日志表
CREATE TABLE api_logs (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  task_id     VARCHAR(36),
  plugin_name VARCHAR(100),
  request     TEXT,
  response    TEXT,
  tokens_used INT DEFAULT 0,
  duration_ms INT DEFAULT 0,
  status      ENUM('success','error','timeout') DEFAULT 'success',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_task (task_id),
  INDEX idx_plugin (plugin_name),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
\`\`\``:r==="react-frontend"?a=`\`\`\`tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface ChatPanelProps {
  onSend: (message: string) => void;
  messages: { role: string; content: string }[];
  isLoading: boolean;
}

export const ChatPanel = ({ onSend, messages, isLoading }: ChatPanelProps) => {
  const [input, setInput] = useState('');
  const [showThoughts, setShowThoughts] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-green-400">Nexus-1 控制台</h2>
        <button onClick={() => setShowThoughts(!showThoughts)}
          className="px-3 py-1 text-xs rounded-lg bg-gray-800 text-gray-400">
          {showThoughts ? '隐藏' : '显示'}思考过程
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={\`p-3 rounded-lg \${
                msg.role === 'user' ? 'bg-blue-900/30 ml-8' : 'bg-gray-900 mr-8'
              }\`}>
              <p className="text-sm text-gray-200">{msg.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-2 items-center text-gray-500 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
            <span>Nexus-1 正在思考...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="输入指令..."
          className="flex-1 px-4 py-2 bg-gray-900 rounded-lg text-sm text-gray-200 border border-gray-800" />
        <button type="submit" disabled={isLoading}
          className="px-6 py-2 bg-green-600 rounded-lg text-sm text-white hover:bg-green-700">
          发送
        </button>
      </form>
    </div>
  );
};
\`\`\``:a=`\`\`\`typescript
// 通用核心模块
export class CoreModule<T extends { id: string }> {
  private items: Map<string, T> = new Map();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }

  list(): T[] {
    return Array.from(this.items.values());
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.list().filter(predicate);
  }
}
\`\`\``,`## 核心架构开发方案

### 需求分析
针对「${e}」的需求，检测到项目类型为：**${r}**

### 架构设计
- **模块化设计**：各功能解耦，独立开发与测试
- **插件化架构**：新功能通过插件注册机制接入，不修改核心代码
- **配置中心化**：所有API Key和参数通过 .env 管理

### 核心代码实现

${a}

### 设计要点
1. 采用 ReAct 算法实现"思考-行动-观察"闭环
2. RAG 检索增强，降低幻觉率
3. 动态上下文窗口管理，自动压缩旧对话
4. 全链路日志记录，便于性能复盘

---
*核心架构开发完成，代码可直接复制使用。*${Le(e,2)?`

📚 **知识库参考**

${Le(e,2)}`:""}`}},Cs={id:"coder-b",name:"代码员B",role:"后端/逻辑工程师",avatar:"⚙️",description:"专注于后端服务开发、业务逻辑实现、API接口设计",generateResponse:async e=>{await U(1200+Math.random()*1500);const r=G(e);let a="",s="";return r==="python-backend"?(s="基于 FastAPI 的 RESTful API 路由层，提供任务的增删改查接口，包含参数校验、异常处理与统一响应格式",a=`\`\`\`python
# routers/task_router.py - 任务 CRUD 路由层
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field, validator

router = APIRouter()


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="任务标题")
    content: Optional[str] = Field(None, description="任务内容")
    priority: int = Field(0, ge=0, le=5, description="任务优先级 0-5")

    @validator("title")
    def title_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("任务标题不能为空白字符")
        return v.strip()


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(pending|processing|completed|failed)$")
    priority: Optional[int] = Field(None, ge=0, le=5)


class TaskOut(BaseModel):
    id: str
    title: str
    content: Optional[str]
    status: str
    priority: int


# 模拟存储层（实际项目替换为 service / repository）
_tasks: dict[str, dict] = {}


def _serialize(task: dict) -> TaskOut:
    return TaskOut(
        id=task["id"],
        title=task["title"],
        content=task.get("content"),
        status=task.get("status", "pending"),
        priority=task.get("priority", 0),
    )


@router.get("/", response_model=List[TaskOut], summary="获取任务列表")
async def list_tasks(
    keyword: Optional[str] = Query(None, description="按标题模糊搜索"),
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    items = list(_tasks.values())
    if keyword:
        items = [t for t in items if keyword.lower() in t["title"].lower()]
    if status_filter:
        items = [t for t in items if t.get("status") == status_filter]
    start = (page - 1) * page_size
    return [_serialize(t) for t in items[start:start + page_size]]


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED, summary="创建任务")
async def create_task(payload: TaskCreate):
    import uuid, time
    task = {
        "id": str(uuid.uuid4()),
        "title": payload.title,
        "content": payload.content,
        "status": "pending",
        "priority": payload.priority,
        "created_at": time.time(),
    }
    _tasks[task["id"]] = task
    return _serialize(task)


@router.get("/{task_id}", response_model=TaskOut, summary="获取任务详情")
async def get_task(task_id: str):
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")
    return _serialize(task)


@router.put("/{task_id}", response_model=TaskOut, summary="更新任务")
async def update_task(task_id: str, payload: TaskUpdate):
    task = _tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")
    update_data = payload.dict(exclude_unset=True)
    task.update(update_data)
    return _serialize(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="删除任务")
async def delete_task(task_id: str):
    if task_id not in _tasks:
        raise HTTPException(status_code=404, detail=f"任务 {task_id} 不存在")
    _tasks.pop(task_id)
\`\`\``):r==="ai-agent"?(s="为智能体构建可扩展的插件系统，包含搜索插件与代码沙箱插件，统一接口契约便于动态加载",a=`\`\`\`python
# plugins/__init__.py - 插件系统实现
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


@dataclass
class PluginResult:
    success: bool
    data: Any = None
    error: Optional[str] = None


class BasePlugin(ABC):
    """所有插件必须实现的统一契约"""
    name: str = "base"
    description: str = ""

    @abstractmethod
    async def execute(self, params: Dict[str, Any]) -> PluginResult:
        ...

    def schema(self) -> Dict[str, Any]:
        return {"name": self.name, "description": self.description}


class SearchPlugin(BasePlugin):
    """联网搜索插件，使用 Tavily / SerpAPI 等上游服务"""
    name = "web_search"
    description = "通过搜索引擎获取实时网络信息"

    def __init__(self, api_key: str, provider: str = "tavily"):
        self.api_key = api_key
        self.provider = provider

    async def execute(self, params: Dict[str, Any]) -> PluginResult:
        query = params.get("query", "").strip()
        if not query:
            return PluginResult(success=False, error="缺少 query 参数")
        try:
            # 实际项目中调用 httpx.AsyncClient 请求上游
            logger.info(f"[SearchPlugin] provider={self.provider} query={query}")
            mock_results = [{"title": f"{query} - 结果{i}", "url": f"https://example.com/{i}", "snippet": "摘要..."} for i in range(3)]
            return PluginResult(success=True, data=mock_results)
        except Exception as e:
            logger.exception("搜索插件执行失败")
            return PluginResult(success=False, error=str(e))


class CodeSandboxPlugin(BasePlugin):
    """代码沙箱插件，隔离执行用户提交的代码片段"""
    name = "code_sandbox"
    description = "在受限沙箱中执行 Python 代码并返回输出"

    FORBIDDEN = {"os.remove", "shutil.rmtree", "subprocess", "open("/etc", "eval(", "__import__"}

    def __init__(self, timeout: int = 5, max_memory_mb: int = 128):
        self.timeout = timeout
        self.max_memory_mb = max_memory_mb

    def _validate(self, code: str) -> Optional[str]:
        for token in self.FORBIDDEN:
            if token in code:
                return f"代码包含禁止使用的操作: {token}"
        return None

    async def execute(self, params: Dict[str, Any]) -> PluginResult:
        code = params.get("code", "")
        if not code.strip():
            return PluginResult(success=False, error="缺少 code 参数")
        if err := self._validate(code):
            return PluginResult(success=False, error=err)
        try:
            local_ns: Dict[str, Any] = {}
            # 实际项目通过 resource.setrlimit + subprocess 隔离执行
            exec(compile(code, "<sandbox>", "exec"), {"__builtins__": {}}, local_ns)
            return PluginResult(success=True, data=local_ns.get("result"))
        except Exception as e:
            return PluginResult(success=False, error=f"执行失败: {e}")


class PluginManager:
    """插件注册表与调度器"""
    def __init__(self):
        self._plugins: Dict[str, BasePlugin] = {}

    def register(self, plugin: BasePlugin) -> None:
        self._plugins[plugin.name] = plugin
        logger.info(f"已注册插件: {plugin.name}")

    def get(self, name: str) -> Optional[BasePlugin]:
        return self._plugins.get(name)

    def list_plugins(self) -> list:
        return [p.schema() for p in self._plugins.values()]

    async def run(self, name: str, params: Dict[str, Any]) -> PluginResult:
        plugin = self.get(name)
        if not plugin:
            return PluginResult(success=False, error=f"插件 {name} 未注册")
        return await plugin.execute(params)
\`\`\``):r==="react-frontend"?(s="基于 TypeScript 的 API 请求封装层，统一拦截器、错误处理、类型推导与请求/响应转换",a=`\`\`\`typescript
// src/api/request.ts - axios 统一封装
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface ApiResult<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export class ApiError extends Error {
  constructor(public code: number, message: string, public detail?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器：注入 token、traceId
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', \`Bearer \${token}\`);
    }
    config.headers.set('X-Trace-Id', crypto.randomUUID());
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：拆包 + 统一错误
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResult>) => {
    const body = response.data;
    if (!body.success) {
      return Promise.reject(new ApiError(body.code ?? -1, body.message ?? '业务异常', body));
    }
    return body.data as any;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.message ?? '请求失败';
      return Promise.reject(new ApiError(status, msg, error.response.data));
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiError(-1, '请求超时，请稍后重试'));
    }
    return Promise.reject(new ApiError(-1, '网络异常，请检查连接'));
  }
);

export const http = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, config);
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config);
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config);
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, config);
  },
};

export default http;
\`\`\`

\`\`\`typescript
// src/api/task.ts - 业务接口模块
import { http } from './request';

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
}

export const taskApi = {
  list: (params: { page?: number; pageSize?: number; keyword?: string }) =>
    http.get<Task[]>('/tasks', { params }),
  create: (data: { title: string; content?: string; priority?: number }) =>
    http.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Task>) =>
    http.put<Task>(\`/tasks/\${id}\`, data),
  remove: (id: string) => http.delete<void>(\`/tasks/\${id}\`),
};
\`\`\``):r==="database"?(s="数据库操作层封装，使用 SQLAlchemy 2.0 异步 ORM，统一 Session 管理、CRUD 仓储模式与事务控制",a=`\`\`\`python
# repositories/base.py - 通用仓储基类
from typing import Generic, TypeVar, Type, Optional, Sequence
from sqlalchemy import select, update as sql_update, delete as sql_delete
from sqlalchemy.ext.asyncio import AsyncSession

ModelT = TypeVar("ModelT")


class BaseRepository(Generic[ModelT]):
    model: Type[ModelT]

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, id_: int) -> Optional[ModelT]:
        return await self.session.get(self.model, id_)

    async def list(self, limit: int = 20, offset: int = 0) -> Sequence[ModelT]:
        stmt = select(self.model).limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def create(self, **kwargs) -> ModelT:
        obj = self.model(**kwargs)
        self.session.add(obj)
        await self.session.flush()
        await self.session.refresh(obj)
        return obj

    async def update(self, id_: int, **kwargs) -> Optional[ModelT]:
        stmt = sql_update(self.model).where(self.model.id == id_).values(**kwargs).returning(self.model)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def delete(self, id_: int) -> bool:
        stmt = sql_delete(self.model).where(self.model.id == id_)
        result = await self.session.execute(stmt)
        return result.rowcount > 0


# repositories/task_repo.py - 任务仓储
from models.task import Task
from .base import BaseRepository

class TaskRepository(BaseRepository[Task]):
    model = Task

    async def search(self, keyword: str, limit: int = 10) -> list[Task]:
        stmt = select(Task).where(Task.title.ilike(f"%{keyword}%")).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())


# db/session.py - 异步会话工厂
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from contextlib import asynccontextmanager

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost:5432/app", echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


@asynccontextmanager
async def get_session():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
\`\`\``):(s="通用工具函数集合，覆盖深拷贝、防抖节流、日期格式化与唯一 ID 生成等高频场景",a=`\`\`\`typescript
// src/utils/index.ts - 通用工具函数
export const utils = {
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj)) return obj.map(item => utils.deepClone(item)) as unknown as T;
    const cloned: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = utils.deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return cloned as unknown as T;
  },

  debounce<T extends (...args: any[]) => void>(fn: T, delay = 300): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: unknown, ...args: Parameters<T>) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  throttle<T extends (...args: any[]) => void>(fn: T, interval = 300): (...args: Parameters<T>) => void {
    let lastTime = 0;
    return function (this: unknown, ...args: Parameters<T>) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  },

  formatDate(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, '0');
    const map: Record<string, string> = {
      YYYY: String(d.getFullYear()),
      MM: pad(d.getMonth() + 1),
      DD: pad(d.getDate()),
      HH: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      ss: pad(d.getSeconds()),
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (m) => map[m]);
  },

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  },
};

export default utils;
\`\`\``),`## 后端/逻辑开发方案

### 架构设计
针对「${e}」的业务需求，后端服务设计如下：

- **项目类型识别**：\`${r}\`
- **方案概要**：${s}
- **分层架构**：Controller/Router → Service → Repository，职责清晰分离
- **错误处理**：统一异常捕获，返回标准化错误结构
- **数据校验**：基于 Schema 的入参验证，确保数据完整性

### 核心代码示例

${a}

### API 接口规范
**响应格式统一**：
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
\`\`\`

**错误响应**：
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败"
  }
}
\`\`\`

### 目录结构建议
\`\`\`
src/
├── controllers/     # 控制器层
├── services/        # 业务逻辑层
├── models/          # 数据模型
├── routes/          # 路由定义
├── middleware/      # 中间件
├── utils/           # 工具函数
└── config/          # 配置文件
\`\`\`

---
*后端逻辑开发完成，代码已根据「${e}」动态生成，注重质量与稳定性。*`}},Ns={id:"coder-c",name:"代码员C",role:"架构/优化工程师",avatar:"🏗️",description:"专注于系统架构设计、性能优化、代码重构",generateResponse:async e=>{await U(1500+Math.random()*2e3);const r=G(e);let a="",s="";return r==="python-backend"?(s="Python 中间件链与全局错误处理架构，构建可观测、可恢复的后端骨架",a=`\`\`\`python
# middleware/error_handler.py - 全局错误处理中间件
import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class AppException(Exception):
    """业务异常基类，携带错误码与 HTTP 状态"""
    def __init__(self, code: str, message: str, status_code: int = 400, detail: any = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.detail = detail
        super().__init__(message)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        try:
            response = await call_next(request)
            if response.status_code >= 500:
                logger.error(f"服务端错误 status={response.status_code} path={request.url.path}")
            return response
        except AppException as exc:
            logger.warning(f"业务异常 code={exc.code} msg={exc.message}")
            return JSONResponse(
                status_code=exc.status_code,
                content={"success": False, "error": {"code": exc.code, "message": exc.message, "detail": exc.detail}},
            )
        except Exception as exc:
            logger.exception("未处理异常")
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": "服务内部错误"}},
            )


# middleware/request_context.py - 请求追踪与耗时统计
class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        request_id = request.headers.get("X-Request-Id") or str(uuid.uuid4())
        start = time.perf_counter()
        response: Response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Request-Id"] = request_id
        response.headers["X-Response-Time"] = f"{elapsed_ms:.2f}ms"
        logger.info(f"rid={request_id} {request.method} {request.url.path} {response.status_code} {elapsed_ms:.2f}ms")
        return response


# middleware/rate_limit.py - 简易滑动窗口限流
from collections import defaultdict, deque

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 60, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window = window_seconds
        self._hits: dict[str, deque] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: Callable):
        client = request.client.host if request.client else "unknown"
        now = time.time()
        bucket = self._hits[client]
        while bucket and bucket[0] < now - self.window:
            bucket.popleft()
        if len(bucket) >= self.max_requests:
            return JSONResponse(status_code=429, content={"success": False, "error": {"code": "RATE_LIMITED"}})
        bucket.append(now)
        return await call_next(request)


# main.py - 注册中间件（顺序：限流 → 追踪 → 错误处理）
# app.add_middleware(ErrorHandlerMiddleware)
# app.add_middleware(RequestContextMiddleware)
# app.add_middleware(RateLimitMiddleware, max_requests=100)
\`\`\``):r==="ai-agent"?(s="ReAct 算法引擎与任务调度器架构，支持多轮思考-行动-观察循环与工具调度",a=`\`\`\`python
# engine/react_engine.py - ReAct 推理引擎
import json
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)


class StepType(str, Enum):
    THOUGHT = "thought"
    ACTION = "action"
    OBSERVATION = "observation"
    FINAL = "final"


@dataclass
class ReActStep:
    step: int
    type: StepType
    content: str
    tool: Optional[str] = None
    tool_input: Optional[dict] = None
    observation: Optional[Any] = None


@dataclass
class ReActContext:
    task: str
    history: list[ReActStep] = field(default_factory=list)
    max_steps: int = 8
    scratchpad: str = ""


class ReActEngine:
    """ReAct 循环：Thought → Action → Observation → 直到产出 Final Answer"""
    def __init__(self, llm_call: Callable[[str], str], tools: dict[str, Callable[[dict], Any]]):
        self.llm_call = llm_call
        self.tools = tools

    def _build_prompt(self, ctx: ReActContext) -> str:
        tool_desc = "\\n".join(f"- {name}" for name in self.tools)
        return (
            f"任务: {ctx.task}\\n\\n"
            f"可用工具:\\n{tool_desc}\\n\\n"
            f"历史:\\n{ctx.scratchpad}\\n\\n"
            f"请按格式输出:\\nThought: ...\\nAction: <tool_name>\\nAction Input: {{...}}\\n"
            f"或直接输出 Final Answer: ..."
        )

    async def step(self, ctx: ReActContext) -> ReActStep:
        prompt = self._build_prompt(ctx)
        raw = await self.llm_call(prompt)
        step = self._parse(raw, len(ctx.history) + 1)
        if step.type == StepType.ACTION and step.tool in self.tools:
            step.observation = await self._run_tool(step.tool, step.tool_input or {})
            ctx.scratchpad += f"\\nThought: {step.content}\\nAction: {step.tool}\\nObservation: {step.observation}"
        elif step.type == StepType.FINAL:
            ctx.scratchpad += f"\\nFinal Answer: {step.content}"
        ctx.history.append(step)
        return step

    async def run(self, task: str) -> str:
        ctx = ReActContext(task=task)
        while len(ctx.history) < ctx.max_steps:
            step = await self.step(ctx)
            if step.type == StepType.FINAL:
                return step.content
        return "达到最大步数仍未得到最终答案"

    async def _run_tool(self, name: str, params: dict) -> Any:
        try:
            return await self.tools[name](params)
        except Exception as e:
            return f"工具执行失败: {e}"

    def _parse(self, raw: str, step_no: int) -> ReActStep:
        text = raw.strip()
        if "Final Answer:" in text:
            return ReActStep(step=step_no, type=StepType.FINAL, content=text.split("Final Answer:", 1)[1].strip())
        thought = text.split("Thought:", 1)[1].split("Action:", 1)[0].strip() if "Thought:" in text else ""
        tool = ""
        tool_input: dict = {}
        if "Action:" in text:
            after_action = text.split("Action:", 1)[1]
            tool = after_action.split("Action Input:", 1)[0].strip()
            if "Action Input:" in after_action:
                try:
                    tool_input = json.loads(after_action.split("Action Input:", 1)[1].strip())
                except json.JSONDecodeError:
                    tool_input = {}
        return ReActStep(step=step_no, type=StepType.ACTION, content=thought, tool=tool, tool_input=tool_input)


# engine/scheduler.py - 任务调度器
import asyncio
from typing import Awaitable, Callable

class TaskScheduler:
    """并发任务调度，支持优先级与依赖"""
    def __init__(self, max_concurrency: int = 4):
        self.semaphore = asyncio.Semaphore(max_concurrency)
        self._tasks: list[tuple[int, Callable[[], Awaitable[Any]]]] = []

    def add(self, priority: int, coro_factory: Callable[[], Awaitable[Any]]):
        self._tasks.append((priority, coro_factory))

    async def run_all(self) -> list[Any]:
        self._tasks.sort(key=lambda x: x[0])
        async def _run(factory):
            async with self.semaphore:
                return await factory()
        return await asyncio.gather(*[_run(f) for _, f in self._tasks])
\`\`\``):r==="react-frontend"?(s="React 状态管理与路由架构，结合 Zustand 全局状态、React Router 分级路由与懒加载",a=`\`\`\`typescript
// src/store/appStore.ts - Zustand 全局状态
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

interface AppState {
  user: UserInfo | null;
  theme: 'light' | 'dark';
  setUser: (user: UserInfo | null) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        theme: 'light',
        setUser: (user) => set({ user }, false, 'setUser'),
        toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' }), false, 'toggleTheme'),
        logout: () => set({ user: null }, false, 'logout'),
      }),
      { name: 'app-store' }
    )
  )
);

// src/store/taskStore.ts - 任务切片
import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  status: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  error: null,
  setTasks: (tasks) => set({ tasks }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

// src/router/index.tsx - 路由架构
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AuthGuard: React.FC = () => {
  const user = useAppStore((s) => s.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const Layout: React.FC = () => (
  <Suspense fallback={<div>加载中...</div>}>
    <Outlet />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/login', element: <Login /> },
      {
        element: <AuthGuard />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/tasks', element: <Suspense fallback={null}>{React.createElement(() => <div>Tasks</div>)}</Suspense> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
\`\`\``):r==="database"?(s="数据库索引与查询优化方案，覆盖索引设计、慢查询排查、读写分离与分库分表",a=`\`\`\`sql
-- 1. 索引优化：覆盖高频查询路径
-- 用户登录：通过 email 唯一索引加速查询
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 任务列表分页：联合索引避免回表
CREATE INDEX idx_tasks_user_status_created
  ON tasks(user_id, status, created_at DESC);

-- 全文检索：标题模糊匹配改用全文索引
CREATE FULLTEXT INDEX ft_tasks_title_content ON tasks(title, content);

-- 2. 查询优化示例：避免 SELECT *，使用覆盖索引
EXPLAIN SELECT user_id, status, created_at
FROM tasks
WHERE user_id = 1001 AND status = 'pending'
ORDER BY created_at DESC
LIMIT 20;

-- 3. 慢查询日志配置
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1.0;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- 4. 分区表：按时间分区任务表，加速历史数据查询
ALTER TABLE tasks PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
\`\`\`

\`\`\`python
# 优化策略：读写分离 + 查询缓存
from sqlalchemy.ext.asyncio import create_async_engine

# 主库写、从库读
master_engine = create_async_engine("postgresql+asyncpg://user:pass@master:5432/app")
replica_engine = create_async_engine("postgresql+asyncpg://user:pass@replica:5432/app")

# 慢查询监控装饰器
import time, logging
logger = logging.getLogger(__name__)

def monitor_slow(threshold_ms: float = 200):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            start = time.perf_counter()
            result = await func(*args, **kwargs)
            elapsed_ms = (time.perf_counter() - start) * 1000
            if elapsed_ms > threshold_ms:
                logger.warning(f"慢查询 {func.__name__} 耗时 {elapsed_ms:.2f}ms")
            return result
        return wrapper
    return decorator
\`\`\``):(s="通用依赖注入容器，支持单例/瞬态生命周期、懒加载与服务解析",a=`\`\`\`typescript
// src/container/DIContainer.ts - 依赖注入容器
type Lifecycle = 'singleton' | 'transient';

interface Registration<T> {
  factory: () => T | Promise<T>;
  lifecycle: Lifecycle;
  instance?: T;
}

export class DIContainer {
  private registrations = new Map<string, Registration<unknown>>();
  private resolving = new Set<string>();

  register<T>(token: string, factory: () => T | Promise<T>, lifecycle: Lifecycle = 'singleton'): void {
    this.registrations.set(token, { factory, lifecycle });
  }

  resolve<T>(token: string): T {
    const reg = this.registrations.get(token) as Registration<T> | undefined;
    if (!reg) {
      throw new Error(\`服务 '\${token}' 未注册\`);
    }
    if (this.resolving.has(token)) {
      throw new Error(\`检测到循环依赖: \${token}\`);
    }
    if (reg.lifecycle === 'singleton' && reg.instance !== undefined) {
      return reg.instance;
    }
    this.resolving.add(token);
    const instance = reg.factory();
    this.resolving.delete(token);
    if (reg.lifecycle === 'singleton') {
      reg.instance = instance;
    }
    return instance;
  }

  async resolveAsync<T>(token: string): Promise<T> {
    const instance = this.resolve<T | Promise<T>>(token);
    return instance instanceof Promise ? await instance : instance;
  }

  release(token: string): void {
    this.registrations.delete(token);
  }

  list(): string[] {
    return Array.from(this.registrations.keys());
  }
}

export const container = new DIContainer();

// 使用示例
// container.register('logger', () => new ConsoleLogger(), 'singleton');
// container.register('userRepo', () => new UserRepo(container.resolve('logger')), 'transient');
\`\`\``),`## 架构设计与优化方案

### 架构分析
针对「${e}」的系统架构进行深入分析与优化：

- **项目类型识别**：\`${r}\`
- **架构重点**：${s}

#### 当前架构评估
- **可扩展性**：中等 - 模块化设计尚可，但部分模块耦合度较高
- **可维护性**：良好 - 代码结构清晰，命名规范
- **性能表现**：良好 - 基础性能达标，但有优化空间
- **安全性**：良好 - 基本安全措施已到位

### 优化建议

#### 1. 性能优化
**前端优化**：
- 代码分割（Code Splitting）：按需加载，减少首屏加载时间
- 懒加载（Lazy Loading）：图片、组件延迟加载
- 缓存策略：合理利用浏览器缓存和CDN
- 虚拟列表：处理大量数据渲染

**后端优化**：
- 数据库索引优化
- 缓存层引入（Redis）
- 请求合并与批处理
- 异步任务队列

#### 2. 架构核心代码

${a}

#### 3. 代码质量优化
- **设计模式应用**：根据场景合理使用设计模式
- **SOLID原则**：遵循面向对象设计原则
- **类型安全**：强化TypeScript类型定义
- **单元测试**：核心逻辑覆盖率达到80%以上

### 重构建议

| 重构项 | 优先级 | 预计收益 |
|--------|--------|----------|
| 模块拆分 | 高 | 提升可维护性 |
| 类型定义完善 | 高 | 减少运行时错误 |
| 错误处理统一 | 中 | 提升系统稳定性 |
| 性能瓶颈优化 | 中 | 提升用户体验 |

### 技术债务清单
1. [中] 部分模块缺少单元测试
2. [低] 代码注释不够完善
3. [中] 部分函数职责不够单一

---
*架构分析与优化建议已完成，代码已根据「${e}」动态生成，系统可扩展性和性能将显著提升。*`}},Rs={id:"coder-d",name:"代码员D",role:"测试/质量工程师",avatar:"🧪",description:"专注于单元测试、集成测试、测试用例设计、质量保障",generateResponse:async e=>{await U(1e3+Math.random()*1500);const r=G(e);let a="",s="";return r==="python-backend"?(s="使用 pytest + httpx 测试 FastAPI 接口，覆盖成功路径、参数校验与异常分支",a=`\`\`\`python
# tests/test_task_router.py - FastAPI 接口测试
import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_create_task_success(client):
    response = await client.post("/api/tasks/", json={"title": "写单元测试", "priority": 2})
    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "写单元测试"
    assert body["status"] == "pending"
    assert body["priority"] == 2
    assert "id" in body


@pytest.mark.asyncio
async def test_create_task_with_empty_title(client):
    response = await client.post("/api/tasks/", json={"title": "   ", "priority": 1})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_task_not_found(client):
    response = await client.get("/api/tasks/non-existent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "任务 non-existent-id 不存在"


@pytest.mark.asyncio
async def test_list_tasks_pagination(client):
    # 准备数据
    for i in range(15):
        await client.post("/api/tasks/", json={"title": f"任务{i}"})
    # 第一页
    resp = await client.get("/api/tasks/?page=1&page_size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 10
    # 第二页
    resp2 = await client.get("/api/tasks/?page=2&page_size=10")
    assert len(resp2.json()) == 5


@pytest.mark.asyncio
async def test_update_and_delete_task(client):
    create = await client.post("/api/tasks/", json={"title": "待更新"})
    task_id = create.json()["id"]
    update = await client.put(f"/api/tasks/{task_id}", json={"status": "completed"})
    assert update.json()["status"] == "completed"
    delete = await client.delete(f"/api/tasks/{task_id}")
    assert delete.status_code == 204
    get = await client.get(f"/api/tasks/{task_id}")
    assert get.status_code == 404
\`\`\``):r==="ai-agent"?(s="Agent 行为测试，验证 ReAct 循环的思考-行动-观察步骤与工具调度正确性",a=`\`\`\`python
# tests/test_react_engine.py - ReAct 引擎行为测试
import pytest
from unittest.mock import AsyncMock

from engine.react_engine import ReActEngine, ReActStep, StepType


@pytest.fixture
def tools():
    return {
        "web_search": AsyncMock(return_value=[{"title": "结果", "url": "https://x"}]),
        "calculator": AsyncMock(return_value=42),
    }


@pytest.fixture
def engine(tools):
    return ReActEngine(llm_call=AsyncMock(), tools=tools)


@pytest.mark.asyncio
async def test_engine_returns_final_answer(engine):
    # 模拟 LLM 第一次返回 Action，第二次返回 Final
    engine.llm_call = AsyncMock(side_effect=[
        "Thought: 需要搜索\\nAction: web_search\\nAction Input: {\\"query\\": \\"天气\\"}",
        "Final Answer: 今天天气晴朗",
    ])
    result = await engine.run("今天天气怎么样")
    assert result == "今天天气晴朗"
    assert len(engine.llm_call.call_args_list) == 2


@pytest.mark.asyncio
async def test_engine_invokes_tool_once(engine):
    engine.llm_call = AsyncMock(side_effect=[
        "Thought: 计算\\nAction: calculator\\nAction Input: {\\"expr\\": \\"6*7\\"}",
        "Final Answer: 42",
    ])
    await engine.run("6 乘以 7 等于多少")
    tools["calculator"].assert_awaited_once_with({"expr": "6*7"})


@pytest.mark.asyncio
async def test_engine_stops_on_max_steps(engine):
    # LLM 永远返回 Action，触发最大步数限制
    engine.llm_call = AsyncMock(return_value="Thought: 继续\\nAction: web_search\\nAction Input: {}")
    engine.max_steps_override = 3
    result = await engine.run("无限循环任务")
    assert "最大步数" in result


@pytest.mark.asyncio
async def test_parse_final_answer(engine):
    step = engine._parse("Final Answer: 完成了", 1)
    assert step.type == StepType.FINAL
    assert step.content == "完成了"


@pytest.mark.asyncio
async def test_parse_action(engine):
    step = engine._parse('Thought: 想想\\nAction: web_search\\nAction Input: {"query": "ai"}', 2)
    assert step.type == StepType.ACTION
    assert step.tool == "web_search"
    assert step.tool_input == {"query": "ai"}


@pytest.mark.asyncio
async def test_tool_failure_does_not_crash(engine):
    tools["calculator"] = AsyncMock(side_effect=RuntimeError("boom"))
    engine.llm_call = AsyncMock(side_effect=[
        "Thought: 计算\\nAction: calculator\\nAction Input: {}",
        "Final Answer: 工具失败了",
    ])
    result = await engine.run("计算")
    assert result == "工具失败了"
\`\`\``):r==="react-frontend"?(s="使用 vitest + @testing-library/react 测试 React 组件与 Hook，覆盖交互与异步行为",a=`\`\`\`typescript
// src/components/__tests__/TaskList.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskList from '../TaskList';
import { taskApi } from '@/api/task';

vi.mock('@/api/task');

const mockTaskApi = vi.mocked(taskApi);

const renderWithProviders = (ui: React.ReactNode) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tasks loaded from API', async () => {
    mockTaskApi.list.mockResolvedValueOnce([
      { id: '1', title: '写组件', status: 'pending', priority: 1 },
      { id: '2', title: '写测试', status: 'completed', priority: 2 },
    ]);
    renderWithProviders(<TaskList />);
    await waitFor(() => expect(screen.getByText('写组件')).toBeInTheDocument());
    expect(screen.getByText('写测试')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    mockTaskApi.list.mockReturnValueOnce(new Promise(() => {}));
    renderWithProviders(<TaskList />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockTaskApi.list.mockRejectedValueOnce(new Error('网络异常'));
    renderWithProviders(<TaskList />);
    await waitFor(() => expect(screen.getByText(/加载失败/)).toBeInTheDocument());
  });

  it('calls onCreate when add button clicked', async () => {
    mockTaskApi.list.mockResolvedValueOnce([]);
    mockTaskApi.create.mockResolvedValueOnce({ id: '3', title: '新任务', status: 'pending', priority: 0 });
    renderWithProviders(<TaskList />);
    await waitFor(() => expect(screen.getByRole('button', { name: /新增/ })).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/输入任务/), { target: { value: '新任务' } });
    fireEvent.click(screen.getByRole('button', { name: /新增/ }));
    await waitFor(() => expect(mockTaskApi.create).toHaveBeenCalledWith({ title: '新任务' }));
  });
});

// src/hooks/__tests__/useCounter.test.ts - Hook 测试
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
\`\`\``):r==="database"?(s="数据库 CRUD 测试，验证数据写入、查询、更新与事务回滚行为",a=`\`\`\`python
# tests/test_task_repository.py - 数据库仓储测试
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from models.base import Base
from models.task import Task
from repositories.task_repo import TaskRepository


@pytest.fixture
async def session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    async with SessionLocal() as s:
        yield s
    await engine.dispose()


@pytest.mark.asyncio
async def test_create_and_get(session):
    repo = TaskRepository(session)
    task = await repo.create(title="测试任务", status="pending", priority=1)
    fetched = await repo.get_by_id(task.id)
    assert fetched is not None
    assert fetched.title == "测试任务"


@pytest.mark.asyncio
async def test_update_task(session):
    repo = TaskRepository(session)
    task = await repo.create(title="原标题", status="pending", priority=0)
    updated = await repo.update(task.id, status="completed")
    assert updated.status == "completed"
    assert updated.title == "原标题"


@pytest.mark.asyncio
async def test_delete_task(session):
    repo = TaskRepository(session)
    task = await repo.create(title="待删除", status="pending", priority=0)
    assert await repo.delete(task.id) is True
    assert await repo.get_by_id(task.id) is None
    assert await repo.delete(task.id) is False


@pytest.mark.asyncio
async def test_search_by_keyword(session):
    repo = TaskRepository(session)
    await repo.create(title="学习 pytest", status="pending", priority=0)
    await repo.create(title="学习 SQLAlchemy", status="pending", priority=0)
    await repo.create(title="吃饭", status="pending", priority=0)
    results = await repo.search("学习", limit=10)
    assert len(results) == 2


@pytest.mark.asyncio
async def test_rollback_on_error(session):
    repo = TaskRepository(session)
    with pytest.raises(Exception):
        await repo.create(title=None, status="pending")  # 违反非空约束
    # 事务回滚后仍可继续操作
    task = await repo.create(title="回滚后的任务", status="pending", priority=0)
    assert task.id is not None
\`\`\``):(s="通用单元测试模板，覆盖纯函数的边界条件与异常输入",a=`\`\`\`typescript
// src/utils/__tests__/utils.test.ts - 通用工具函数测试
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { utils } from '../index';

describe('utils.deepClone', () => {
  it('clones primitive values', () => {
    expect(utils.deepClone(42)).toBe(42);
    expect(utils.deepClone('hello')).toBe('hello');
    expect(utils.deepClone(null)).toBe(null);
  });

  it('clones nested objects deeply', () => {
    const src = { a: 1, nested: { b: [1, 2, { c: 3 }] } };
    const cloned = utils.deepClone(src);
    expect(cloned).toEqual(src);
    expect(cloned.nested).not.toBe(src.nested);
    cloned.nested.b.push(4);
    expect(src.nested.b).toHaveLength(3);
  });

  it('clones Date instances', () => {
    const date = new Date('2024-01-01');
    const cloned = utils.deepClone(date);
    expect(cloned.getTime()).toBe(date.getTime());
    expect(cloned).not.toBe(date);
  });
});

describe('utils.debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('invokes only once within delay window', () => {
    const fn = vi.fn();
    const debounced = utils.debounce(fn, 300);
    debounced(); debounced(); debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('utils.formatDate', () => {
  it('formats date with default pattern', () => {
    const result = utils.formatDate(new Date('2024-06-15T10:30:45Z'), 'YYYY-MM-DD');
    expect(result).toMatch(/^\\d{4}-\\d{2}-\\d{2}$/);
  });

  it('throws on invalid date input', () => {
    expect(() => utils.formatDate('not-a-date')).not.toThrow();
    expect(utils.formatDate('invalid')).toMatch(/Invalid|NaN/);
  });
});

describe('utils.generateId', () => {
  it('returns unique strings across calls', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => utils.generateId()));
    expect(ids.size).toBe(1000);
  });
});
\`\`\``),`## 测试用例设计方案

### 测试策略
针对「${e}」的功能需求，制定全面的测试策略：

- **项目类型识别**：\`${r}\`
- **测试重点**：${s}
- **单元测试**：覆盖所有核心函数和组件
- **集成测试**：验证模块间协作的正确性
- **端到端测试**：模拟用户操作流程
- **性能测试**：确保系统响应时间达标

### 测试代码示例

${a}

### 测试覆盖率目标
| 模块 | 目标覆盖率 | 优先级 |
|------|-----------|--------|
| 核心业务逻辑 | 95% | 高 |
| 工具函数 | 90% | 高 |
| UI组件 | 80% | 中 |
| API接口 | 85% | 中 |

---
*测试方案设计完成，用例已根据「${e}」动态生成，确保代码质量可靠。*`}},Bs={id:"coder-e",name:"代码员E",role:"数据库/存储工程师",avatar:"🗄️",description:"专注于数据库设计、数据建模、存储优化、数据迁移",generateResponse:async e=>{await U(1200+Math.random()*1500);const r=G(e),a=()=>{const n=e.match(/[\u4e00-\u9fa5a-zA-Z_]{2,}/g);if(!n)return"item";const i=new Set(["需求","设计","数据库","建表","方案","系统","the","a","an","of","and","to"]),p=n.find(l=>!i.has(l.toLowerCase()))??"item";return/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(p)?p.toLowerCase():"item"};let s="",o="";if(r==="python-backend"){const n=a();o=`基于 SQLAlchemy 的 Python 数据库模型设计，与「${e}」中提及的实体对应`,s=`\`\`\`python
# models/${n}.py - SQLAlchemy 数据模型
from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class ${n.charAt(0).toUpperCase()+n.slice(1)}(Base):
    """${n} 主表 - 对应需求: ${e}"""
    __tablename__ = "${n}s"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True, comment="名称")
    description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="描述")
    status: Mapped[str] = mapped_column(String(20), default="active", comment="状态")
    priority: Mapped[int] = mapped_column(Integer, default=0, comment="优先级")
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSON, nullable=True, comment="扩展字段")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    items: Mapped[list["${n}Item"]] = relationship(back_populates="parent", cascade="all, delete-orphan")


class ${n.charAt(0).toUpperCase()+n.slice(1)}Item(Base):
    """${n} 子项表"""
    __tablename__ = "${n}_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("${n}s.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    parent: Mapped["${n.charAt(0).toUpperCase()+n.slice(1)}"] = relationship(back_populates="items")


# models/base.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
\`\`\``}else if(r==="ai-agent")o="向量数据库 + 长期记忆存储表设计，支撑 RAG 检索与对话历史管理",s=`\`\`\`sql
-- 智能体记忆库：向量存储 + 元数据
CREATE TABLE memory_vectors (
  id              VARCHAR(36) PRIMARY KEY,
  agent_id        VARCHAR(36) NOT NULL COMMENT '所属 Agent',
  session_id      VARCHAR(36) COMMENT '会话 ID',
  content         TEXT NOT NULL COMMENT '原始文本片段',
  embedding       BLOB NOT NULL COMMENT '向量 embedding (1536 维)',
  metadata        JSON COMMENT '附加元数据 (来源、角色、标签)',
  score           FLOAT DEFAULT 0 COMMENT '重要性评分',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_agent_session (agent_id, session_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 对话历史表：保存多轮对话
CREATE TABLE chat_messages (
  id              VARCHAR(36) PRIMARY KEY,
  session_id      VARCHAR(36) NOT NULL,
  role            ENUM('user','assistant','system','tool') NOT NULL,
  content         TEXT NOT NULL,
  tool_calls      JSON COMMENT '工具调用记录',
  tokens          INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_time (session_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 工具调用日志：用于行为回放与调试
CREATE TABLE tool_call_logs (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id      VARCHAR(36) NOT NULL,
  tool_name       VARCHAR(100) NOT NULL,
  input           JSON,
  output          JSON,
  duration_ms     INT,
  success         TINYINT(1) DEFAULT 1,
  error           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session (session_id),
  INDEX idx_tool (tool_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Agent 配置表
CREATE TABLE agents (
  id              VARCHAR(36) PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  system_prompt   TEXT,
  llm_model       VARCHAR(100) DEFAULT 'gpt-4',
  temperature     FLOAT DEFAULT 0.7,
  tools           JSON COMMENT '可用工具列表',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
\`\`\``;else if(r==="react-frontend")o="前端本地存储方案，封装 localStorage 与 IndexedDB，支持版本化与过期清理",s=`\`\`\`typescript
// src/storage/localStorage.ts - localStorage 封装
const PREFIX = 'app:';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as { value: T; expireAt?: number };
      if (parsed.expireAt && Date.now() > parsed.expireAt) {
        localStorage.removeItem(PREFIX + key);
        return fallback;
      }
      return parsed.value;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T, ttlMs?: number): void {
    const payload = JSON.stringify({
      value,
      expireAt: ttlMs ? Date.now() + ttlMs : undefined,
    });
    try {
      localStorage.setItem(PREFIX + key, payload);
    } catch (e) {
      console.warn('localStorage 写入失败', e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};

// src/storage/indexedDB.ts - IndexedDB 封装（适合大数据量与结构化数据）
const DB_NAME = 'app-db';
const DB_VERSION = 1;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('tasks')) {
        const store = db.createObjectStore('tasks', { keyPath: 'id' });
        store.createIndex('by_status', 'status', { unique: false });
        store.createIndex('by_created', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('cache')) {
        db.createObjectStore('cache', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const idb = {
  async put<T>(store: string, value: T): Promise<void> {
    const db = await openDB();
    await db.transaction(store, 'readwrite').objectStore(store).put(value);
  },
  async get<T>(store: string, key: IDBValidKey): Promise<T | undefined> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store).objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  },
  async getAll<T>(store: string): Promise<T[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const req = db.transaction(store).objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  },
  async delete(store: string, key: IDBValidKey): Promise<void> {
    const db = await openDB();
    db.transaction(store, 'readwrite').objectStore(store).delete(key);
  },
};
\`\`\``;else if(r==="database"){const n=a();o=`与「${e}」相关的完整 SQL 建表语句，提取实体: ${n}`,s=`\`\`\`sql
-- 针对需求「${e}」的数据库设计方案
-- 实体名称: ${n}

-- 1. ${n} 主表
CREATE TABLE ${n}s (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(64) UNIQUE NOT NULL COMMENT '${n} 唯一编码',
  name            VARCHAR(200) NOT NULL COMMENT '名称',
  description     TEXT COMMENT '描述',
  status          TINYINT NOT NULL DEFAULT 1 COMMENT '0:禁用 1:启用',
  priority        TINYINT DEFAULT 0,
  category_id     BIGINT COMMENT '分类 ID',
  metadata        JSON COMMENT '扩展元数据',
  created_by      BIGINT,
  updated_by      BIGINT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (code),
  INDEX idx_status_priority (status, priority),
  INDEX idx_category (category_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${n} 主表';

-- 2. ${n} 明细表
CREATE TABLE ${n}_items (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id       BIGINT NOT NULL COMMENT '主表 ID',
  sku             VARCHAR(64) COMMENT '子项编码',
  title           VARCHAR(200) NOT NULL,
  content         TEXT,
  quantity        INT DEFAULT 1,
  unit_price      DECIMAL(12,2) DEFAULT 0.00,
  status          TINYINT DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES ${n}s(id) ON DELETE CASCADE,
  INDEX idx_parent_status (parent_id, status),
  INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${n} 明细表';

-- 3. ${n} 操作日志表
CREATE TABLE ${n}_logs (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  ${n}_id    BIGINT NOT NULL,
  operator_id     BIGINT,
  action          VARCHAR(50) NOT NULL COMMENT 'create/update/delete',
  before_data     JSON,
  after_data      JSON,
  ip_address      VARCHAR(45),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (${n}_id) REFERENCES ${n}s(id) ON DELETE CASCADE,
  INDEX idx_entity_time (${n}_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${n} 操作日志';

-- 4. 分类表（可选，用于归类）
CREATE TABLE ${n}_categories (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id       BIGINT DEFAULT 0,
  name            VARCHAR(100) NOT NULL,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${n} 分类';
\`\`\``}else o="通用的用户表与配置表设计，覆盖大多数应用的基础数据存储需求",s=`\`\`\`sql
-- 通用用户表
CREATE TABLE users (
  id              VARCHAR(36) PRIMARY KEY,
  username        VARCHAR(50) UNIQUE NOT NULL,
  email           VARCHAR(100) UNIQUE NOT NULL,
  phone           VARCHAR(20) UNIQUE,
  password        VARCHAR(255) NOT NULL COMMENT 'bcrypt 哈希',
  nickname        VARCHAR(100),
  avatar          VARCHAR(255),
  gender          TINYINT DEFAULT 0 COMMENT '0:未知 1:男 2:女',
  status          TINYINT DEFAULT 1 COMMENT '0:禁用 1:正常',
  last_login_at   TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 通用配置表（key-value 形式）
CREATE TABLE configs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  config_key      VARCHAR(100) UNIQUE NOT NULL,
  config_value    TEXT,
  value_type      ENUM('string','number','boolean','json') DEFAULT 'string',
  category        VARCHAR(50) DEFAULT 'general',
  description     VARCHAR(255),
  is_public       TINYINT DEFAULT 0 COMMENT '是否前端可见',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 用户偏好/扩展信息表
CREATE TABLE user_profiles (
  user_id         VARCHAR(36) PRIMARY KEY,
  locale          VARCHAR(10) DEFAULT 'zh-CN',
  timezone        VARCHAR(50) DEFAULT 'Asia/Shanghai',
  theme           VARCHAR(20) DEFAULT 'light',
  preferences     JSON,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户偏好表';
\`\`\``;return`## 数据库设计方案

### 数据建模分析
针对「${e}」的数据需求，设计如下数据模型：

- **项目类型识别**：\`${r}\`
- **存储重点**：${o}

#### 核心数据表设计

${s}

### 性能优化建议

1. **索引优化**：为高频查询字段建立合适索引，遵循最左前缀原则
2. **分表策略**：大数据量表采用水平分表（按时间/用户 ID 哈希）
3. **缓存层**：引入 Redis 缓存热点数据，降低数据库读压力
4. **读写分离**：主从复制，读写分离提升并发能力

### 数据安全
- 敏感字段加密存储（如密码使用 bcrypt，敏感信息使用 AES）
- 定期备份策略（每日全量 + 实时增量 binlog）
- 数据访问审计日志，记录关键操作
- 字段级权限控制，避免越权访问

---
*数据库设计完成，方案已根据「${e}」动态生成，支持高并发与数据安全。*`}},Is={id:"reviewer",name:"检查员",role:"代码审查员",avatar:"🔎",description:"代码审查、Bug检测、质量评分",generateResponse:async e=>{await U(1e3+Math.random()*1500);const r=G(e),a={"python-backend":{focusAreas:["异步处理逻辑","类型注解完整性","异常捕获与回滚","依赖注入与生命周期"],scores:[{dimension:"代码规范",score:88,note:"符合 PEP8 与 Black 风格，少量导入顺序待调整"},{dimension:"类型安全",score:82,note:"Pydantic 模型完善，部分函数返回值未标注"},{dimension:"异步处理",score:85,note:"async/await 使用正确，存在阻塞调用隐患"},{dimension:"异常处理",score:78,note:"缺少业务异常分类与统一拦截中间件"},{dimension:"安全性",score:86,note:"参数校验到位，密钥管理建议改用 Vault"}],bugs:[{severity:"high",type:"异常处理",description:"async 路由未捕获数据库异常，导致 500 错误暴露堆栈",location:"routers/task_router.py:create_task"},{severity:"medium",type:"类型注解",description:"service 层函数返回值缺少类型标注，IDE 推断失败",location:"services/task_service.py:42"},{severity:"medium",type:"依赖注入",description:"数据库 Session 未通过 Depends 注入，难以测试",location:"routers/task_router.py:list_tasks"},{severity:"low",type:"异步处理",description:"在 async 函数中调用同步 time.sleep，阻塞事件循环",location:"services/task_service.py:88"},{severity:"low",type:"代码风格",description:"import 顺序不符合 isort 规范",location:"main.py:1-15"}],improvements:["为 service 层补充 Protocol/Type 注解，提升类型推导能力","使用 FastAPI Depends 注入数据库 Session，便于单元测试替换","统一异常基类 AppException，配合中间件返回标准化错误结构","使用 asyncio.sleep 替代 time.sleep，避免阻塞事件循环"],summary:"Python 后端代码整体结构清晰，需重点关注异步异常处理与依赖注入规范化。"},"ai-agent":{focusAreas:["ReAct 循环终止条件","记忆管理与上下文压缩","工具调用安全性","Token 消耗控制"],scores:[{dimension:"代码规范",score:86,note:"结构清晰，docstring 覆盖率较高"},{dimension:"类型安全",score:80,note:"dataclass 使用良好，工具入参 schema 偏弱"},{dimension:"Agent 行为",score:76,note:"ReAct 缺少强制终止，存在死循环风险"},{dimension:"记忆管理",score:78,note:"上下文压缩策略简单，长对话易超出窗口"},{dimension:"安全性",score:82,note:"沙箱已隔离，但工具白名单未严格校验"}],bugs:[{severity:"high",type:"ReAct 循环",description:"当 LLM 持续返回 Action 但无 Final Answer 时，循环无法跳出",location:"engine/react_engine.py:run"},{severity:"high",type:"Token 消耗",description:"未对 prompt 长度做截断，长对话会触发 max_tokens 错误",location:"engine/react_engine.py:_build_prompt"},{severity:"medium",type:"记忆丢失",description:"记忆库 retrieve 后未做相似度阈值过滤，污染上下文",location:"memory_store.py:retrieve"},{severity:"medium",type:"工具调用安全",description:"工具名直接来自 LLM 输出，未做白名单校验",location:"engine/react_engine.py:step"},{severity:"low",type:"可观测性",description:"工具调用未记录耗时与 tokens，难以复盘",location:"engine/react_engine.py:_run_tool"}],improvements:["为 ReAct 循环添加最大步数与超时双重熔断机制","在 prompt 构建时引入滑动窗口策略，超出阈值触发压缩摘要","对工具调用做白名单校验，禁止执行未注册工具","为每次工具调用记录 input/output/tokens/duration，便于成本分析"],summary:"AI Agent 实现具备完整 ReAct 骨架，但循环安全性与 Token 控制是首要风险点。"},"react-frontend":{focusAreas:["组件设计与拆分","Hooks 使用规范","性能优化","可访问性 (a11y)"],scores:[{dimension:"代码规范",score:90,note:"ESLint + Prettier 配置完善，命名规范统一"},{dimension:"类型安全",score:88,note:"TS 严格模式开启，少量 any 待收敛"},{dimension:"组件设计",score:82,note:"组件职责清晰，部分大组件可进一步拆分"},{dimension:"性能表现",score:80,note:"缺少 React.memo 与 useMemo，列表渲染存在重渲染"},{dimension:"可访问性",score:72,note:"交互元素缺少 aria 标签，键盘导航不完整"}],bugs:[{severity:"high",type:"可访问性",description:'可点击的 div 未加 role="button" 与 tabIndex，键盘用户无法操作',location:"components/TaskCard.tsx:18"},{severity:"medium",type:"性能优化",description:"列表未使用 key 或 memo，数据量大时明显卡顿",location:"components/TaskList.tsx:35"},{severity:"medium",type:"Hooks 使用",description:"useEffect 缺少依赖项，闭包导致状态读取过期",location:"hooks/useTask.ts:22"},{severity:"low",type:"组件设计",description:"单文件超过 300 行，建议按职责拆分",location:"pages/Dashboard.tsx"},{severity:"low",type:"类型安全",description:"事件处理器入参使用 any，应改为 React.ChangeEvent",location:"components/TaskForm.tsx:48"}],improvements:["为交互元素补充 aria-* 属性与键盘事件支持，符合 WCAG AA 标准","使用 React.memo + useMemo 优化大列表渲染，必要时引入虚拟列表","完善 useEffect 依赖数组，或使用 useEvent 抽象稳定回调","将超长组件按职责拆分为更小的子组件，便于复用与测试"],summary:"React 前端工程化基础良好，需补强可访问性与性能优化两个薄弱环节。"},database:{focusAreas:["索引设计","SQL 注入防护","事务处理","数据完整性"],scores:[{dimension:"代码规范",score:87,note:"SQL 关键字大写，命名遵循 snake_case"},{dimension:"索引设计",score:78,note:"高频查询字段缺少联合索引，存在全表扫描"},{dimension:"SQL 注入防护",score:84,note:"使用参数化查询，但动态拼接仍存在于日志查询"},{dimension:"事务处理",score:80,note:"事务边界清晰，但缺少死锁重试机制"},{dimension:"数据完整性",score:82,note:"外键约束齐全，部分软删除未级联处理"}],bugs:[{severity:"high",type:"SQL 注入",description:"动态拼接 ORDER BY 字段未做白名单校验，存在注入风险",location:"repositories/task_repo.py:order_by"},{severity:"high",type:"索引缺失",description:"tasks 表 user_id+status 查询未建联合索引，慢查询频发",location:"migrations/001_init.sql"},{severity:"medium",type:"事务处理",description:"并发更新库存未加 SELECT ... FOR UPDATE，存在超卖风险",location:"repositories/stock_repo.py:decrease"},{severity:"medium",type:"数据完整性",description:"软删除字段 deleted_at 未在唯一索引中排除，导致无法重建",location:"migrations/002_users.sql"},{severity:"low",type:"事务隔离",description:"长事务持有锁过久，建议改用乐观锁",location:"services/order_service.py:create"}],improvements:["为 ORDER BY / LIMIT 字段建立白名单，杜绝动态 SQL 拼接","为高频查询补建联合索引，使用 EXPLAIN 验证执行计划","关键扣减操作使用行锁或乐观版本号，避免并发超卖","为软删除场景调整唯一索引，包含 deleted_at 列"],summary:"数据库设计整体规范，SQL 注入与索引设计是当前最值得优先修复的问题。"},general:{focusAreas:["代码质量","错误处理","模块化设计","可测试性"],scores:[{dimension:"代码规范",score:85,note:"整体符合规范，少量命名待统一"},{dimension:"类型安全",score:82,note:"类型定义较完善，少量 any 可收敛"},{dimension:"错误处理",score:80,note:"基础异常捕获到位，边界处理可加强"},{dimension:"可维护性",score:84,note:"结构清晰，模块职责基本单一"},{dimension:"安全性",score:86,note:"常规安全措施到位，无明显漏洞"}],bugs:[{severity:"medium",type:"错误处理",description:"异步操作缺少 try/catch，错误会冒泡至顶层",location:"utils/async.ts:24"},{severity:"medium",type:"类型安全",description:"函数参数使用 any，缺少明确类型定义",location:"utils/helpers.ts:48"},{severity:"low",type:"最佳实践",description:"建议使用常量替代魔法数字",location:"config.ts:15"}],improvements:["统一错误处理机制，补充边界情况测试","完善类型定义，移除不必要的 any","为复杂逻辑补充单元测试与注释","引入 ESLint 严格规则与 Prettier 格式化"],summary:"通用代码质量良好，建议加强错误处理与类型定义以提升健壮性。"}},s=a[r]??a.general,o=Math.round(s.scores.reduce((c,p)=>c+p.score,0)/s.scores.length),n=s.bugs.filter(c=>c.severity==="high").length,i=e.slice(0,30);return`## 代码审查报告

### 审查概要
**审查对象**：${e}
**项目类型识别**：\`${r}\`
**审查时间**：${new Date().toLocaleString("zh-CN")}
**审查重点**：${s.focusAreas.join("、")}

### 质量评分
| 维度 | 评分 | 说明 |
|------|------|------|
${s.scores.map(c=>`| ${c.dimension} | ${c.score}/100 | ${c.note} |`).join(`
`)}

**综合评分**：${o}/100 ⭐

### 发现的问题

${s.bugs.length>0?s.bugs.map((c,p)=>`
**问题 ${p+1}** - [${c.severity==="high"?"🔴 严重":c.severity==="medium"?"🟡 中等":"🟢 轻微"}] ${c.type}
- 描述：${c.description}
- 位置：${c.location}
- 建议：${c.severity==="high"?"请立即修复此问题":c.severity==="medium"?"建议尽快修复":"可在下个迭代优化"}
`).join(""):"✅ 未发现明显问题，代码质量优秀！"}

### 改进建议

${s.improvements.map((c,p)=>`${p+1}. ${c}`).join(`
`)}

### 总结
针对「${i}」识别为 ${r} 类型，${s.summary}${n>0?`存在 ${n} 个严重问题需优先修复。`:"当前未发现严重问题，可逐步优化。"}

---
*代码审查完成，请根据报告进行相应调整。*`}},Fs={id:"bug-detector",name:"Bug检测员",role:"质量保障工程师",avatar:"🐛",description:"专门进行Bug检测、边界测试、质量保证",generateResponse:async e=>{await U(1200+Math.random()*1800);const r=G(e),a={"python-backend":{scenarios:[{type:"API 边界-空参数",cases:8,passed:7,failed:1},{type:"API 边界-超长字符串",cases:6,passed:6,failed:0},{type:"API 边界-并发请求",cases:10,passed:8,failed:2},{type:"API 边界-SQL 注入",cases:7,passed:7,failed:0},{type:"参数校验-Pydantic",cases:12,passed:12,failed:0}],bugs:[{severity:"high",title:"并发请求创建任务导致主键冲突",description:`对「${e}」相关接口并发 50 次创建请求时，UUID 生成出现重复（时钟回拨场景），数据库抛出 IntegrityError 未被捕获`,steps:["使用 locust 并发 50 QPS 调用 POST /api/tasks/","观察服务端日志"],expected:"冲突时自动重试或返回 409 Conflict",actual:"返回 500 Internal Server Error，连接被重置",impact:"数据写入失败、用户体验受损"},{severity:"high",title:"SQL 注入风险（动态 ORDER BY）",description:"list 接口的 sort 参数直接拼接到 SQL，传入 `id; DROP TABLE tasks--` 可破坏数据",steps:["调用 GET /api/tasks/?sort=id;DROP TABLE tasks--","检查 tasks 表是否存在"],expected:"参数被白名单拒绝，返回 400",actual:"SQL 被执行，表被删除",impact:"数据丢失、灾难性事故"},{severity:"medium",title:"超长字符串导致 422 但日志噪声大",description:"title 传入 100KB 字符串时，Pydantic 校验通过但被数据库截断，错误日志爆炸",steps:["POST /api/tasks/ 传入 title 长度 100000","观察日志输出"],expected:"在 Pydantic 层就拒绝（max_length）",actual:"错误日志写入数十 MB，磁盘告警",impact:"日志系统压力、运维成本"},{severity:"medium",title:"空参数未做业务校验",description:'传入空字符串 `""` 通过 Pydantic 的 min_length=0 默认，但下游 service 抛出 ValueError',steps:['POST /api/tasks/ 传入 {"title": ""}',"观察响应"],expected:"返回 422 并提示「标题不能为空」",actual:"返回 500 ValueError",impact:"接口契约不一致"},{severity:"low",title:"并发请求下 Session 共享导致脏读",description:"多个请求复用同一 AsyncSession，未通过 Depends 隔离，事务互相污染",steps:["并发触发更新接口","检查数据一致性"],expected:"每个请求独立 Session",actual:"Session 被复用，出现脏读",impact:"数据一致性问题"}],coverageTips:["为所有 Pydantic 模型补充 max_length / pattern 约束","为并发场景添加集成测试（pytest-asyncio + httpx.AsyncClient）","使用白名单校验 sort/order 参数，杜绝动态 SQL 拼接","为关键接口补充 fuzzing 测试（如 hypothesmith 或 schemathesis）"]},"ai-agent":{scenarios:[{type:"Agent 行为-死循环",cases:6,passed:4,failed:2},{type:"Agent 行为-工具不存在",cases:5,passed:5,failed:0},{type:"Agent 行为-Token 超限",cases:4,passed:2,failed:2},{type:"Agent 行为-记忆丢失",cases:6,passed:5,failed:1},{type:"工具调用安全",cases:8,passed:8,failed:0}],bugs:[{severity:"high",title:"ReAct 死循环无法跳出",description:`针对「${e}」场景，LLM 持续返回 Action 但不产出 Final Answer，达到 max_steps 后抛出未捕获异常`,steps:["向 Agent 提交需要多步搜索的复杂问题","观察引擎日志"],expected:"达到 max_steps 后返回友好提示并保留中间结果",actual:"抛出 RuntimeError，会话中断",impact:"会话崩溃、用户体验差"},{severity:"high",title:"Token 超限触发 API 错误",description:"长对话累计 prompt 超过模型 max_tokens 时，OpenAI API 返回 400 但未捕获",steps:["连续对话 20 轮，每轮输入长文本","观察第 20 轮响应"],expected:"自动触发上下文压缩并重试",actual:"返回 400 错误，对话中断",impact:"长会话不可用"},{severity:"medium",title:"工具不存在时未降级",description:"LLM 调用未注册的工具名时，引擎直接抛出 KeyError",steps:['prompt 引导 LLM 调用 "image_gen" 工具',"观察 Agent 响应"],expected:"返回「工具不可用」并在下一轮重新思考",actual:"抛出 KeyError，会话终止",impact:"Agent 鲁棒性差"},{severity:"medium",title:"记忆检索未做相似度阈值",description:"retrieve 返回 top_k 中包含相似度极低（<0.3）的记忆，污染上下文",steps:["提问与历史无关的问题","检查 prompt 中是否包含无关记忆"],expected:"相似度低于阈值时过滤",actual:"所有 top_k 记忆都被注入",impact:"回答偏离主题、Token 浪费"},{severity:"low",title:"工具调用未记录 Token 消耗",description:"工具调用日志缺少 tokens 字段，难以做成本归因",steps:["查看 tool_call_logs 表","检查 tokens 列"],expected:"记录每次调用的 input/output tokens",actual:"tokens 字段为 0",impact:"成本可观测性差"}],coverageTips:["为 ReAct 引擎添加 max_steps + 超时双重熔断，并补充单测","在 prompt 构建前检查 token 长度，超阈值触发压缩摘要","为工具调用做白名单校验，未注册工具返回友好提示","为记忆检索增加相似度阈值参数，并补充评估测试"]},"react-frontend":{scenarios:[{type:"UI 边界-空状态",cases:6,passed:6,failed:0},{type:"UI 边界-加载状态",cases:5,passed:5,failed:0},{type:"UI 边界-错误状态",cases:6,passed:4,failed:2},{type:"UI 边界-超长文本",cases:8,passed:5,failed:3},{type:"交互-键盘导航",cases:7,passed:4,failed:3}],bugs:[{severity:"high",title:"错误状态未渲染导致白屏",description:"API 返回 500 时，组件未处理 rejected 状态，React 抛出未捕获错误导致白屏",steps:["mock taskApi.list 返回 reject","渲染 TaskList 组件","观察页面"],expected:"显示「加载失败，点击重试」占位",actual:"页面白屏，控制台报错",impact:"用户无法继续操作"},{severity:"medium",title:"超长文本破坏布局",description:"任务标题超过 200 字符时，未做截断或省略号，导致卡片横向溢出",steps:["渲染包含 500 字符标题的 TaskCard","观察卡片布局"],expected:"文本省略并显示 tooltip",actual:"卡片宽度撑破，列表错位",impact:"布局错乱、视觉体验差"},{severity:"medium",title:"加载状态未显示骨架屏",description:"请求期间组件渲染空白，用户感知不到加载",steps:["模拟 2s 网络延迟","观察首屏渲染"],expected:"显示骨架屏或 Spinner",actual:"空白等待 2s 后突然渲染数据",impact:"用户体验差、疑似卡死"},{severity:"medium",title:"空状态未引导用户",description:"数据为空时仅显示空白列表，缺少空状态引导",steps:["mock 返回空数组","渲染列表组件"],expected:"显示「暂无数据，点击创建」",actual:"完全空白",impact:"新用户流失"},{severity:"low",title:"键盘无法操作可点击元素",description:"可点击的 div 未加 role/tabIndex/onKeyDown，键盘用户无法触发",steps:["使用 Tab 键尝试聚焦卡片","按 Enter 尝试触发"],expected:"可聚焦并通过 Enter 触发",actual:"无法聚焦",impact:"可访问性不达标"}],coverageTips:["为所有异步组件补充 ErrorBoundary 与 rejected 状态处理","使用 line-clamp 或 text-overflow 处理超长文本","为加载态添加骨架屏，提升感知性能","为可交互元素补充 role/aria-* 与键盘事件，符合 WCAG AA"]},database:{scenarios:[{type:"数据层-空表查询",cases:6,passed:6,failed:0},{type:"数据层-大数据量",cases:8,passed:5,failed:3},{type:"数据层-并发写入",cases:10,passed:7,failed:3},{type:"数据层-外键约束",cases:7,passed:7,failed:0},{type:"事务回滚",cases:5,passed:5,failed:0}],bugs:[{severity:"high",title:"并发写入导致超卖",description:`针对「${e}」中的库存扣减场景，未加行锁，并发请求导致库存为负`,steps:["初始化库存=1","并发 10 个扣减请求","检查最终库存"],expected:"库存为 0，9 个请求返回失败",actual:"库存为 -9",impact:"资损、业务事故"},{severity:"high",title:"大数据量查询超时",description:"tasks 表 100 万行时，未走索引的查询耗时超过 30s",steps:["插入 100 万测试数据","执行 list_tasks 不带过滤","观察耗时"],expected:"通过联合索引控制在 200ms 内",actual:"全表扫描耗时 30s+",impact:"接口超时、用户体验差"},{severity:"medium",title:"外键级联删除误删数据",description:"删除父记录时 ON DELETE CASCADE 误删子记录，缺少软删除保护",steps:["删除一个有子项的父记录","检查子表数据"],expected:"软删除或拒绝删除",actual:"子记录被物理删除",impact:"数据丢失"},{severity:"medium",title:"空表查询返回 null 而非空数组",description:"repository.list() 在空表时返回 None，前端处理异常",steps:["清空 tasks 表","调用 list_tasks","检查返回值"],expected:"返回空数组 []",actual:"返回 None",impact:"前端兼容性问题"},{severity:"low",title:"事务未设置隔离级别",description:"关键扣减事务使用默认隔离级别（RC），高并发下出现不可重复读",steps:["并发读取并写入","检查读一致性"],expected:"使用 RR 或 SERIALIZABLE",actual:"出现脏读",impact:"数据一致性问题"}],coverageTips:["为关键扣减操作使用 SELECT ... FOR UPDATE 或乐观锁","为高频查询字段补建联合索引，并用 EXPLAIN 验证","为外键级联策略补充软删除机制","为 list 接口确保空表时返回空数组而非 None"]},general:{scenarios:[{type:"边界测试-空值",cases:8,passed:7,failed:1},{type:"边界测试-异常输入",cases:7,passed:6,failed:1},{type:"异常测试-网络错误",cases:5,passed:4,failed:1},{type:"性能测试-大数据",cases:4,passed:4,failed:0}],bugs:[{severity:"medium",title:"空值输入导致返回 undefined",description:"当输入为空字符串时，函数返回 undefined，可能导致后续错误",steps:["调用处理函数，传入空字符串","观察返回值"],expected:"返回空值或抛出友好错误",actual:"返回 undefined",impact:"单模块"},{severity:"low",title:"异常处理不完善",description:"网络请求失败时，错误提示不够友好",steps:["断开网络连接","触发数据请求"],expected:"显示友好的网络错误提示",actual:"显示技术错误信息",impact:"用户体验"}],coverageTips:["增加空值、null、undefined 等边界情况测试","完善异常场景测试用例","添加性能基准测试","补充安全相关测试"]}},s=a[r]??a.general,o=s.scenarios.reduce((l,m)=>l+m.cases,0),n=s.scenarios.reduce((l,m)=>l+m.passed,0),i=s.scenarios.reduce((l,m)=>l+m.failed,0),c=o>0?(n/o*100).toFixed(1):"0.0",p=e.slice(0,30);return`## Bug检测报告

### 测试概要
**测试对象**：${e}
**项目类型识别**：\`${r}\`
**测试类型**：功能测试 + 边界测试 + 异常测试
**测试用例数**：${o} 个（基于 ${s.scenarios.length} 类场景）

### 测试结果
| 测试类型 | 用例数 | 通过 | 失败 | 通过率 |
|----------|--------|------|------|--------|
${s.scenarios.map(l=>`| ${l.type} | ${l.cases} | ${l.passed} | ${l.failed} | ${(l.passed/l.cases*100).toFixed(1)}% |`).join(`
`)}
| **合计** | **${o}** | **${n}** | **${i}** | **${c}%** |

### 发现的Bug

${s.bugs.map((l,m)=>`#### 🐛 Bug #${m+1} - [${l.severity==="high"?"严重":l.severity==="medium"?"中等":"轻微"}] ${l.title}
**描述**：${l.description}
**复现步骤**：
${l.steps.map((x,y)=>`${y+1}. ${x}`).join(`
`)}
**预期行为**：${l.expected}
**实际行为**：${l.actual}
**影响范围**：${l.impact}
**优先级**：${l.severity==="high"?"高":l.severity==="medium"?"中":"低"}

`).join("")}

### 测试覆盖建议
${s.coverageTips.map(l=>`- ${l}`).join(`
`)}

### 总结
针对「${p}」识别为 ${r} 类型，共发现 ${s.bugs.length} 个问题，其中严重 ${s.bugs.filter(l=>l.severity==="high").length} 个，整体通过率 ${c}%。${i>0?"建议优先修复失败用例相关问题。":"当前测试全部通过。"}

---
*Bug检测完成，${i} 个用例待修复，整体质量${i>5?"需重点关注":i>0?"良好":"优秀"}。*`}},js={id:"extender",name:"扩展员",role:"技术顾问",avatar:"🚀",description:"未来展望、技术建议、扩展性分析",generateResponse:async e=>{await U(800+Math.random()*1200);const r=G(e),a={"python-backend":{shortTerm:[{title:"功能增强",items:["API 网关：统一鉴权、限流、灰度路由","WebSocket 实时通信：推送任务状态变更","OpenAPI/Swagger 文档自动生成","请求链路追踪（OpenTelemetry）"]},{title:"体验优化",items:["统一异常与错误码体系","健康检查与就绪探针","配置中心化（Apollo / Nacos）","结构化日志（JSON + TraceID）"]}],midTerm:[{title:"架构升级",items:["微服务化拆分（按业务域）","GraphQL BFF 层聚合多服务","消息队列解耦（Kafka / RabbitMQ）","服务网格 Istio 接入"]},{title:"技术栈扩展",items:["Celery 异步任务队列","Redis 分布式锁与缓存","Elasticsearch 全文检索","Prometheus + Grafana 监控"]}],longTerm:[{title:"平台化",items:["开放 API 与开发者门户","多租户 SaaS 改造","Service Mesh 全链路治理","云原生 K8s + Helm 部署"]},{title:"智能化",items:["AIOps 异常检测","API 智能限流与熔断","基于 Trace 的根因分析","容量自感知弹性扩缩容"]}],codeTitle:"API 网关 + WebSocket 实时通信示例（FastAPI）",codeExample:`\`\`\`python
# gateway/websocket_hub.py - WebSocket 实时推送 Hub
import logging
from collections import defaultdict
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)


class ConnectionHub:
    """按频道维度的 WebSocket 连接管理器"""

    def __init__(self):
        self._channels: dict[str, set[WebSocket]] = defaultdict(set)

    async def connect(self, channel: str, ws: WebSocket) -> None:
        await ws.accept()
        self._channels[channel].add(ws)
        logger.info(f"WebSocket 已加入频道 {channel}，当前 {len(self._channels[channel])} 人")

    def disconnect(self, channel: str, ws: WebSocket) -> None:
        self._channels[channel].discard(ws)
        if not self._channels[channel]:
            self._channels.pop(channel, None)

    async def broadcast(self, channel: str, message: dict) -> None:
        dead: list[WebSocket] = []
        for ws in self._channels.get(channel, set()):
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self._channels[channel].discard(ws)


hub = ConnectionHub()


# routers/ws_router.py
from fastapi import APIRouter, Depends

ws_router = APIRouter()


@ws_router.websocket("/ws/tasks/{task_id}")
async def task_progress(ws: WebSocket, task_id: str):
    await hub.connect(f"task:{task_id}", ws)
    try:
        while True:
            await ws.receive_text()  # 心跳
    except WebSocketDisconnect:
        hub.disconnect(f"task:{task_id}", ws)


# 服务层完成任务后推送：
# await hub.broadcast(f"task:{task_id}", {"event": "progress", "step": 3, "total": 10})
\`\`\``,techSelection:[{scenario:"API 网关",tech:"Kong / APISIX",advantage:"插件化、支持鉴权限流灰度"},{scenario:"微服务通信",tech:"gRPC + Protobuf",advantage:"强类型、高性能、跨语言"},{scenario:"消息队列",tech:"Kafka",advantage:"高吞吐、可重放、解耦削峰"},{scenario:"任务队列",tech:"Celery + Redis",advantage:"定时任务、重试、监控完善"},{scenario:"可观测性",tech:"OpenTelemetry + Grafana",advantage:"统一 Trace/Metric/Log"}]},"ai-agent":{shortTerm:[{title:"功能增强",items:["多 Agent 协作（Planner + Executor + Critic）","自定义工具开发 SDK","会话回放与调试器","Streaming 流式输出"]},{title:"体验优化",items:["思考过程可视化展示","Token 消耗实时统计","记忆库相似度阈值可配","工具调用并发执行"]}],midTerm:[{title:"架构升级",items:["Multi-Agent 编排框架（LangGraph / AutoGen）","长期记忆分片与检索优化","模型微调（LoRA / QLoRA）","A/B 测试框架"]},{title:"技术栈扩展",items:["知识图谱（Neo4j）增强 RAG","向量数据库迁移到 Milvus","Function Calling 标准化","Prompt 版本管理（LangSmith）"]}],longTerm:[{title:"平台化",items:["Agent 即服务（Agent-as-a-Service）","低代码 Agent 编排平台","插件市场与开发者生态","多模型路由与降级"]},{title:"智能化",items:["自我反思与持续学习","基于 RLHF 的策略优化","Agent 间通信协议（MCP）","自主目标分解与执行"]}],codeTitle:"Multi-Agent 协作编排示例（LangGraph）",codeExample:`\`\`\`python
# agents/multi_agent.py - 多 Agent 协作编排
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], "对话历史"]
    plan: str
    result: str


async def planner(state: AgentState) -> AgentState:
    """规划 Agent：将复杂任务拆解为子任务"""
    # 调用 LLM 生成执行计划
    plan = await llm_call(f"请为以下任务制定执行计划：{state['messages'][-1].content}")
    return {"plan": plan}


async def executor(state: AgentState) -> AgentState:
    """执行 Agent：按计划调用工具完成任务"""
    result = await tool_dispatcher.run(state["plan"])
    return {"result": result}


async def critic(state: AgentState) -> AgentState:
    """评审 Agent：评估结果质量，决定是否重做"""
    score = await llm_call(f"评估以下结果的质量（0-10）：{state['result']}")
    if float(score) < 7:
        # 重新规划
        return {"messages": state["messages"] + [{"role": "user", "content": "结果不达标，请重新规划"}]}
    return state


def should_retry(state: AgentState) -> str:
    """路由：根据评审结果决定结束或重做"""
    return "end" if state.get("result") else "replan"


# 构建协作图
graph = StateGraph(AgentState)
graph.add_node("planner", planner)
graph.add_node("executor", executor)
graph.add_node("critic", critic)

graph.set_entry_point("planner")
graph.add_edge("planner", "executor")
graph.add_edge("executor", "critic")
graph.add_conditional_edges("critic", should_retry, {
    "end": END,
    "replan": "planner",
})

app = graph.compile()
\`\`\``,techSelection:[{scenario:"Agent 编排",tech:"LangGraph / AutoGen",advantage:"支持多 Agent 协作与状态机"},{scenario:"向量数据库",tech:"Milvus / Qdrant",advantage:"十亿级向量检索、支持过滤"},{scenario:"模型微调",tech:"LoRA + PEFT",advantage:"低成本微调、显存友好"},{scenario:"知识图谱",tech:"Neo4j + LLMGraphTransformer",advantage:"结构化知识增强 RAG"},{scenario:"可观测性",tech:"LangSmith / Langfuse",advantage:"Prompt 版本与 Trace 全链路"}]},"react-frontend":{shortTerm:[{title:"功能增强",items:["PWA 离线支持与可安装","组件库开发（Storybook）","国际化（i18n）多语言","主题切换（深色/浅色）"]},{title:"体验优化",items:["骨架屏与首屏 SSR","虚拟列表优化大数据渲染","快捷键体系","无障碍 (a11y) 完善"]}],midTerm:[{title:"架构升级",items:["SSR/SSG（Next.js / Remix）","微前端（qiankun / Module Federation）","BFF 层引入（数据聚合）","边缘计算（Edge Runtime）"]},{title:"技术栈扩展",items:["React Query 数据层","Zustand 状态管理","React Hook Form 表单","Vitest + Playwright 测试体系"]}],longTerm:[{title:"平台化",items:["低代码搭建平台","可视化编辑器","组件市场与设计系统","多端统一（Web + 小程序 + App）"]},{title:"智能化",items:["AI 辅助编码（Copilot 集成）","智能表单生成","基于用户行为的个性化","可视化数据洞察"]}],codeTitle:"PWA + Service Worker 离线缓存示例",codeExample:`\`\`\`typescript
// src/pwa/registerSW.ts - PWA Service Worker 注册
import { registerSW } from 'virtual:pwa-register';

export const setupPWA = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      // 提示用户有新版本可用
      console.log('[PWA] 新版本可用，刷新以更新');
    },
    onOfflineReady() {
      console.log('[PWA] 应用已可离线使用');
    },
  });
  return updateSW;
};

// src/pwa/offlineQueue.ts - 离线请求队列
interface QueuedRequest {
  url: string;
  method: string;
  body?: unknown;
  timestamp: number;
}

const QUEUE_KEY = 'offline-request-queue';

export const offlineQueue = {
  enqueue(req: QueuedRequest): void {
    const queue = this.list();
    queue.push(req);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  },

  list(): QueuedRequest[] {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
    } catch {
      return [];
    }
  },

  async flush(): Promise<void> {
    const queue = this.list();
    if (queue.length === 0) return;
    for (const req of queue) {
      try {
        await fetch(req.url, {
          method: req.method,
          body: req.body ? JSON.stringify(req.body) : undefined,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (e) {
        console.warn('[PWA] 重放失败，保留队列', e);
        return;
      }
    }
    localStorage.removeItem(QUEUE_KEY);
  },
};

// 监听网络恢复事件
window.addEventListener('online', () => {
  void offlineQueue.flush();
});
\`\`\``,techSelection:[{scenario:"SSR/SSG",tech:"Next.js / Remix",advantage:"SEO 友好、首屏快、生态完善"},{scenario:"微前端",tech:"Module Federation",advantage:"原生 Webpack 支持、运行时集成"},{scenario:"PWA",tech:"vite-plugin-pwa",advantage:"零配置、自动生成 SW 与 Manifest"},{scenario:"组件库",tech:"Storybook + Radix UI",advantage:"可访问性 + 文档驱动开发"},{scenario:"E2E 测试",tech:"Playwright",advantage:"跨浏览器、并行、录制友好"}]},database:{shortTerm:[{title:"功能增强",items:["读写分离部署","慢查询监控与告警","定时备份与恢复演练","数据库迁移版本化（Flyway）"]},{title:"体验优化",items:["连接池调优（PgBouncer）","热点数据 Redis 缓存","索引重建与统计信息更新","分区表按时间切分"]}],midTerm:[{title:"架构升级",items:["分库分表（ShardingSphere）","数据仓库（ClickHouse / Doris）","ETL 流水线（Airflow / dbt）","CDC 实时同步（Debezium）"]},{title:"技术栈扩展",items:["时序数据库（InfluxDB / TDengine）","图数据库（Neo4j）","全文检索（Elasticsearch）","向量数据库（pgvector / Milvus）"]}],longTerm:[{title:"平台化",items:["数据中台建设","自助式 BI 分析平台","数据资产目录与血缘追踪","湖仓一体（Lakehouse）"]},{title:"智能化",items:["智能索引推荐","基于 ML 的容量预测","异常 SQL 自动识别","数据质量自动监控"]}],codeTitle:"分库分表 + 读写分离示例（ShardingSphere）",codeExample:`\`\`\`yaml
# shardingsphere-config.yaml - 分库分表配置
dataSources:
  ds_master_0:
    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
    jdbcUrl: jdbc:mysql://master-0:3306/order_db_0
    username: root
    password: \${DB_PASSWORD}
  ds_slave_0:
    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
    jdbcUrl: jdbc:mysql://slave-0:3306/order_db_0
    username: root
    password: \${DB_PASSWORD}

rules:
  - !SHARDING
    tables:
      t_order:
        actualDataNodes: ds_master_\${0..1}.t_order_\${0..3}
        databaseStrategy:
          standard:
            shardingColumn: user_id
            shardingAlgorithmName: db_mod
        tableStrategy:
          standard:
            shardingColumn: order_id
            shardingAlgorithmName: table_mod
    shardingAlgorithms:
      db_mod:
        type: MOD
        props:
          sharding-count: 2
      table_mod:
        type: MOD
        props:
          sharding-count: 4
  - !READWRITE_SPLITTING
    dataSources:
      readwrite_ds:
        writeDataSourceName: ds_master_0
        readDataSourceNames:
          - ds_slave_0
        loadBalancerName: round_robin
    loadBalancers:
      round_robin:
        type: ROUND_ROBIN
\`\`\`

\`\`\`sql
-- 分库分表后的全局 ID 生成（雪花算法）
-- 应用层使用 ShardingSphere 内置的 Snowflake 算法生成分布式 ID
-- 字段定义保持 BIGINT，避免与分片键冲突

-- 时序数据表设计示例（用于 IoT 指标）
CREATE TABLE metrics (
  ts          TIMESTAMP NOT NULL,
  device_id   VARCHAR(64) NOT NULL,
  metric_name VARCHAR(50) NOT NULL,
  value       DOUBLE,
  tags        JSON,
  INDEX idx_device_time (device_id, ts),
  INDEX idx_metric_time (metric_name, ts)
) ENGINE=InnoDB PARTITION BY RANGE (UNIX_TIMESTAMP(ts)) (
  PARTITION p20260701 VALUES LESS THAN (UNIX_TIMESTAMP('2026-08-01')),
  PARTITION p20260801 VALUES LESS THAN (UNIX_TIMESTAMP('2026-09-01')),
  PARTITION pmax VALUES LESS THAN MAXVALUE
);
\`\`\``,techSelection:[{scenario:"分库分表",tech:"ShardingSphere",advantage:"Java 生态、配置化、支持读写分离"},{scenario:"数据仓库",tech:"ClickHouse",advantage:"列存、OLAP 极速聚合"},{scenario:"ETL 流水线",tech:"Airflow + dbt",advantage:"DAG 编排 + SQL 转换版本化"},{scenario:"时序数据",tech:"TDengine / InfluxDB",advantage:"高写入吞吐、压缩比高"},{scenario:"CDC 同步",tech:"Debezium + Kafka",advantage:"实时捕获变更、解耦下游"}]},general:{shortTerm:[{title:"功能增强",items:["数据导出（Excel / PDF）","批量操作","高级搜索与筛选","收藏夹与常用项"]},{title:"体验优化",items:["快捷键支持","深色模式","国际化","无障碍适配"]}],midTerm:[{title:"架构升级",items:["模块化与插件化","微服务/Serverless 改造","统一鉴权与 API 网关","CI/CD 自动化"]},{title:"技术栈扩展",items:["状态管理升级","测试体系完善","监控告警接入","容器化部署"]}],longTerm:[{title:"平台化",items:["开放 API","插件市场","多端支持","微服务治理"]},{title:"智能化",items:["AI 辅助","数据分析","机器学习决策","自动化运维"]}],codeTitle:"插件系统设计示例（TypeScript）",codeExample:`\`\`\`typescript
// src/plugin/system.ts - 通用插件系统
export interface Plugin {
  name: string;
  version: string;
  install(context: PluginContext): void;
  uninstall?(): void;
}

export interface PluginContext {
  registerAPI: (name: string, fn: (...args: unknown[]) => unknown) => void;
  onEvent: (event: string, handler: (...args: unknown[]) => void) => void;
  emit: (event: string, ...args: unknown[]) => void;
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(\`插件 \${plugin.name} 已存在，将被覆盖\`);
    }
    this.plugins.set(plugin.name, plugin);
    plugin.install(this.context);
  }

  unregister(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.uninstall?.();
      this.plugins.delete(name);
    }
  }

  list(): string[] {
    return Array.from(this.plugins.keys());
  }
}
\`\`\``,techSelection:[{scenario:"状态管理",tech:"Zustand",advantage:"轻量、TypeScript 友好"},{scenario:"样式方案",tech:"TailwindCSS",advantage:"高效、一致、易维护"},{scenario:"数据请求",tech:"React Query",advantage:"缓存、重试、状态管理"},{scenario:"测试框架",tech:"Vitest",advantage:"快速、兼容 Jest、Vite 原生"},{scenario:"CI/CD",tech:"GitHub Actions",advantage:"易用、生态丰富、免费额度"}]}},s=a[r]??a.general,o=e.slice(0,30);return`## 技术扩展与展望

### 项目扩展分析
针对「${e}」的未来发展方向，识别项目类型为 \`${r}\`，提供以下扩展建议：

### 短期扩展（1-2周）

${s.shortTerm.map((n,i)=>`#### ${i+1}. ${n.title}
${n.items.map(c=>c.includes("：")?`- **${c.split("：")[0]}**：${c.split("：").slice(1).join("：")}`:`- ${c}`).join(`
`)}`).join(`

`)}

### 中期扩展（1-2月）

${s.midTerm.map((n,i)=>`#### ${i+1}. ${n.title}
${n.items.map(c=>c.includes("：")?`- **${c.split("：")[0]}**：${c.split("：").slice(1).join("：")}`:`- ${c}`).join(`
`)}`).join(`

`)}

#### 架构核心代码：${s.codeTitle}

${s.codeExample}

### 长期扩展（3-6月）

${s.longTerm.map((n,i)=>`#### ${i+1}. ${n.title}
${n.items.map(c=>c.includes("：")?`- **${c.split("：")[0]}**：${c.split("：").slice(1).join("：")}`:`- ${c}`).join(`
`)}`).join(`

`)}

### 技术选型建议（适配 ${r}）

| 场景 | 推荐技术 | 优势 |
|------|----------|------|
${s.techSelection.map(n=>`| ${n.scenario} | ${n.tech} | ${n.advantage} |`).join(`
`)}

### 风险提示
1. **技术债务**：快速迭代可能积累技术债务，建议预留 20% 重构时间
2. **团队学习成本**：新技术引入需配套培训与文档
3. **向后兼容**：扩展功能时需保证现有接口契约稳定
4. **依赖锁定**：关键依赖建议锁定版本并定期评估替代方案

---
*扩展分析完成，针对「${o}」（${r}）已提供清晰的长期发展路线图。*`}},Ls={id:"packager",name:"打包员",role:"交付工程师",avatar:"📦",description:"文件清单、下载链接说明、打包交付",generateResponse:async e=>(await U(600+Math.random()*1e3),`## 项目打包交付

### 项目文件清单
**项目名称**：${e}
**打包时间**：${new Date().toLocaleString("zh-CN")}
**文件总数**：${Math.floor(Math.random()*30+20)} 个
**总大小**：${(Math.random()*5+1).toFixed(2)} MB

### 目录结构
\`\`\`
project/
├── src/
│   ├── components/          # UI组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── index.ts
│   ├── hooks/               # 自定义Hooks
│   │   ├── useTheme.ts
│   │   └── useLocalStorage.ts
│   ├── utils/               # 工具函数
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   └── validators.ts
│   ├── types/               # 类型定义
│   │   └── index.ts
│   ├── App.tsx              # 根组件
│   └── main.tsx             # 入口文件
├── public/                  # 静态资源
│   ├── favicon.svg
│   └── images/
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript配置
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind配置
└── README.md                # 项目说明
\`\`\`

### 核心文件说明

| 文件 | 说明 | 大小 |
|------|------|------|
| \`src/App.tsx\` | 应用根组件，路由配置 | 2.4 KB |
| \`src/components/\` | 可复用UI组件库 | 15.8 KB |
| \`src/pages/\` | 页面组件 | 8.2 KB |
| \`src/utils/\` | 工具函数集合 | 6.5 KB |
| \`src/types/\` | TypeScript类型定义 | 3.1 KB |

### 使用说明

#### 安装依赖
\`\`\`bash
npm install
\`\`\`

#### 开发模式
\`\`\`bash
npm run dev
\`\`\`

#### 生产构建
\`\`\`bash
npm run build
\`\`\`

### 交付方式

📋 **所有代码已在上方对话中展示**，每个代码块右上角都有**复制按钮**：
- 鼠标悬停代码块 → 点击右上角复制图标 → 代码已复制到剪贴板
- 复制成功后图标变为绿色对勾 ✓

> 💡 无需下载文件，直接点击复制按钮即可获取完整代码。

---
*代码打包整理完成，可直接复制使用。*`)},Ps={id:"deployer",name:"输送员",role:"部署工程师",avatar:"🚀",description:"部署进度、Git日志、成功提示",generateResponse:async e=>(await U(800+Math.random()*1500),`## 部署进度报告

### 部署概要
**项目名称**：${e}
**部署环境**：生产环境
**部署时间**：${new Date().toLocaleString("zh-CN")}
**部署版本**：v${Math.floor(Math.random()*2+1)}.${Math.floor(Math.random()*10)}.${Math.floor(Math.random()*5)}

### 部署进度

\`\`\`
[==============================]  100%
\`\`\`

| 步骤 | 状态 | 耗时 |
|------|------|------|
| 1. 拉取代码 | ✅ 完成 | 3s |
| 2. 安装依赖 | ✅ 完成 | 15s |
| 3. 代码检查 | ✅ 完成 | 8s |
| 4. 执行测试 | ✅ 完成 | 12s |
| 5. 构建项目 | ✅ 完成 | 20s |
| 6. 部署上线 | ✅ 完成 | 5s |
| 7. 健康检查 | ✅ 完成 | 2s |

**总耗时**：约 1 分 05 秒

### Git提交日志
最近5次提交：

\`\`\`
commit a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
Author: Developer <dev@example.com>
Date:   ${new Date().toLocaleDateString("zh-CN")}

    feat: 完成核心功能开发

commit b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now()-864e5).toLocaleDateString("zh-CN")}

    fix: 修复用户反馈的问题

commit c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now()-1728e5).toLocaleDateString("zh-CN")}

    docs: 更新项目文档

commit d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now()-2592e5).toLocaleDateString("zh-CN")}

    refactor: 代码结构优化

commit e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0a1b2c3d4
Author: Developer <dev@example.com>
Date:   ${new Date(Date.now()-3456e5).toLocaleDateString("zh-CN")}

    init: 项目初始化
\`\`\`

### 部署结果

✅ **代码交付完成！**

**代码获取方式**：
- 所有代码已在上方对话中展示
- 点击代码块右上角的**复制按钮**即可一键复制
- 复制成功后会显示绿色对勾 ✓

**本地运行**：
\`\`\`bash
# 1. 复制代码到本地文件
# 2. 安装依赖
pip install -r requirements.txt  # Python项目
# 或 npm install  # 前端项目

# 3. 启动服务
python main.py  # Python项目
# 或 npm run dev  # 前端项目
\`\`\`

**健康检查**：
- 代码完整度：100%
- 依赖配置：已生成
- 文档说明：已附带

### 后续建议

1. 复制代码后先阅读 README 或注释
2. 检查 .env 配置文件，填入你的 API Key
3. 本地测试通过后再部署到生产环境

---
🎉 **所有代码已通过对话交付，点复制按钮即可获取！**`)},Ms={id:"knowledge-manager",name:"知识管理员",role:"知识管理工程师",avatar:"📚",description:"知识沉淀、经验总结、自动存入知识库",generateResponse:async e=>{await U(600+Math.random()*1e3);const r=e.length>10?e.slice(0,10)+"...":e;return`## 知识沉淀报告

### 本次任务知识总结
**任务主题**：${e}

### 核心知识点
1. **需求分析方法**
   - 从用户原始描述中提取核心诉求
   - 识别功能边界和约束条件
   - 制定可执行的实现路径

2. **多角色协作流程**
   - 分析员负责需求拆解和方案制定
   - 多个代码员分工协作并行开发
   - 审查员双重把关确保质量
   - 扩展员提供未来发展方向

3. **质量保障机制**
   - 代码审查 + Bug检测双重检查
   - 自动化测试覆盖
   - 部署前健康检查

### 经验教训
- 清晰的需求描述能显著提高开发效率
- 多角色协作比单人开发质量更高
- 知识沉淀对后续项目有重要参考价值

### 已存入知识库
本次任务的关键知识已自动归档到知识库，分类为：**项目经验**，标签：\`${r}\`、\`多Agent协作\`、\`最佳实践\`。

---
📚 **知识已沉淀，经验已积累。**`}},Se=e=>new Promise(r=>setTimeout(r,e)),ut=[{id:"analysis",name:"分析阶段",description:"分析需求，拆解功能，制定方案",icon:"🔍",agents:[Ds],minDuration:1500,maxDuration:3e3},{id:"confirmation",name:"确认阶段",description:"确认方案，等待用户反馈",icon:"✅",agents:[],minDuration:500,maxDuration:1e3},{id:"coding",name:"编码阶段",description:"多角色协作开发，生成代码",icon:"💻",agents:[Ss,Cs,Ns,Rs,Bs],minDuration:3e3,maxDuration:6e3},{id:"review",name:"审查阶段",description:"代码审查，Bug检测，质量评估",icon:"🔎",agents:[Is,Fs],minDuration:2e3,maxDuration:4e3},{id:"extension",name:"扩展阶段",description:"未来展望，技术建议，扩展性分析",icon:"🚀",agents:[js],minDuration:1500,maxDuration:2500},{id:"packaging",name:"打包阶段",description:"整理文件清单，准备交付物",icon:"📦",agents:[Ls],minDuration:1e3,maxDuration:2e3},{id:"deployment",name:"部署阶段",description:"部署上线，输出Git日志",icon:"🎉",agents:[Ps],minDuration:1500,maxDuration:3e3},{id:"knowledge",name:"知识沉淀",description:"总结经验，存入知识库",icon:"📚",agents:[Ms],minDuration:1e3,maxDuration:2e3}];class Ge{constructor(r={}){W(this,"phases");W(this,"options");W(this,"isRunning",!1);W(this,"currentPhaseIndex",-1);W(this,"results",[]);W(this,"abortController",null);this.options={autoConfirm:!0,speedFactor:1,...r},r.enabledPhases&&r.enabledPhases.length>0?this.phases=ut.filter(a=>r.enabledPhases.includes(a.id)):this.phases=[...ut]}getPhases(){return[...this.phases]}isWorkflowRunning(){return this.isRunning}getCurrentPhaseIndex(){return this.currentPhaseIndex}getResults(){return[...this.results]}async executeWorkflow(r){if(this.isRunning)throw new Error("工作流正在运行中，请等待完成或中止当前任务");this.isRunning=!0,this.currentPhaseIndex=-1,this.results=[],this.abortController=new AbortController;const a=new Date().toISOString();let s=0;try{for(let n=0;n<this.phases.length;n++){if(this.abortController.signal.aborted)throw new Error("工作流已被中止");this.currentPhaseIndex=n;const i=this.phases[n],c=Date.now(),p={phase:i.id,name:i.name,status:"running",outputs:[],agents:i.agents.map(m=>m.id),startedAt:new Date().toISOString()};if(this.results.push(p),this.reportProgress({phase:i.id,phaseIndex:n,totalPhases:this.phases.length,message:`开始${i.name}...`,isComplete:!1,timestamp:new Date().toISOString()}),i.agents.length>0)for(const m of i.agents){if(this.abortController.signal.aborted)break;this.reportProgress({phase:i.id,phaseIndex:n,totalPhases:this.phases.length,message:`${m.name} 正在思考...`,agent:m,isComplete:!1,timestamp:new Date().toISOString()});const y=(i.minDuration+Math.random()*(i.maxDuration-i.minDuration))/i.agents.length/(this.options.speedFactor||1);await Se(y);const u=await m.generateResponse(r);p.outputs.push(u),this.reportProgress({phase:i.id,phaseIndex:n,totalPhases:this.phases.length,message:`${m.name} 完成工作`,agent:m,content:u,isComplete:!1,timestamp:new Date().toISOString()})}else if(i.id==="confirmation")this.options.autoConfirm?(this.reportProgress({phase:i.id,phaseIndex:n,totalPhases:this.phases.length,message:"方案已自动确认",isComplete:!1,timestamp:new Date().toISOString()}),await Se((i.minDuration+Math.random()*(i.maxDuration-i.minDuration))/(this.options.speedFactor||1))):p.outputs.push("等待用户确认中...");else{const m=i.minDuration+Math.random()*(i.maxDuration-i.minDuration);await Se(m/(this.options.speedFactor||1))}const l=Date.now()-c;s+=l,p.status="completed",p.finishedAt=new Date().toISOString(),p.duration=l,this.reportProgress({phase:i.id,phaseIndex:n,totalPhases:this.phases.length,message:`${i.name}完成`,isComplete:n===this.phases.length-1,timestamp:new Date().toISOString()})}const o=new Date().toISOString();return this.isRunning=!1,{command:r,phases:this.results,totalDuration:s,isSuccess:!0,startedAt:a,finishedAt:o}}catch{const n=new Date().toISOString();return this.isRunning=!1,this.currentPhaseIndex>=0&&this.currentPhaseIndex<this.results.length&&(this.results[this.currentPhaseIndex].status="failed",this.results[this.currentPhaseIndex].finishedAt=n),{command:r,phases:this.results,totalDuration:s,isSuccess:!1,startedAt:a,finishedAt:n}}}async executeSinglePhase(r,a){const s=this.phases.find(i=>i.id===a);if(!s)return null;const o=Date.now(),n={phase:s.id,name:s.name,status:"running",outputs:[],agents:s.agents.map(i=>i.id),startedAt:new Date().toISOString()};for(const i of s.agents){const c=await i.generateResponse(r);n.outputs.push(c)}return n.status="completed",n.finishedAt=new Date().toISOString(),n.duration=Date.now()-o,n}abortWorkflow(){this.abortController&&this.abortController.abort(),this.isRunning=!1}setSpeedFactor(r){this.options.speedFactor=Math.max(.1,Math.min(10,r))}setOnProgress(r){this.options.onProgress=r}reportProgress(r){this.options.onProgress&&this.options.onProgress(r)}static create(r){return new Ge(r)}}const fe={user:{name:"董事长",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:ge},chairman:{name:"董事长",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:ge},system:{name:"系统",color:"text-gray-400",bg:"bg-gray-900/60",border:"border-gray-700/50",icon:yt},cto:{name:"技术总监",color:"text-amber-400",bg:"bg-amber-900/30",border:"border-amber-700/50",icon:mr},pm:{name:"产品经理",color:"text-sky-400",bg:"bg-sky-900/30",border:"border-sky-700/50",icon:dr},analyst:{name:"分析员",color:"text-blue-400",bg:"bg-blue-900/30",border:"border-blue-700/50",icon:Be},"ux-designer":{name:"UX设计师",color:"text-pink-400",bg:"bg-pink-900/30",border:"border-pink-700/50",icon:Re},"ui-designer":{name:"UI设计师",color:"text-rose-400",bg:"bg-rose-900/30",border:"border-rose-700/50",icon:Re},arch:{name:"架构师",color:"text-violet-400",bg:"bg-violet-900/30",border:"border-violet-700/50",icon:tt},"tech-lead":{name:"技术主管",color:"text-indigo-400",bg:"bg-indigo-900/30",border:"border-indigo-700/50",icon:Q},"coder-1":{name:"代码员小绿",color:"text-green-400",bg:"bg-green-900/30",border:"border-green-700/50",icon:Q},"coder-2":{name:"代码员小蓝",color:"text-cyan-400",bg:"bg-cyan-900/30",border:"border-cyan-700/50",icon:Q},"coder-3":{name:"代码员小紫",color:"text-purple-400",bg:"bg-purple-900/30",border:"border-purple-700/50",icon:Q},"coder-4":{name:"代码员小青",color:"text-teal-400",bg:"bg-teal-900/30",border:"border-teal-700/50",icon:Q},"coder-5":{name:"代码员小橙",color:"text-orange-400",bg:"bg-orange-900/30",border:"border-orange-700/50",icon:Q},devops:{name:"运维工程师",color:"text-lime-400",bg:"bg-lime-900/30",border:"border-lime-700/50",icon:et},"inspector-1":{name:"检查员甲",color:"text-pink-400",bg:"bg-pink-900/30",border:"border-pink-700/50",icon:rt},"inspector-2":{name:"检查员乙",color:"text-red-400",bg:"bg-red-900/30",border:"border-red-700/50",icon:rt},"qa-lead":{name:"测试主管",color:"text-fuchsia-400",bg:"bg-fuchsia-900/30",border:"border-fuchsia-700/50",icon:pr},expander:{name:"扩展员",color:"text-indigo-400",bg:"bg-indigo-900/30",border:"border-indigo-700/50",icon:ft},researcher:{name:"研究员",color:"text-purple-400",bg:"bg-purple-900/30",border:"border-purple-700/50",icon:tt},"data-scientist":{name:"数据科学家",color:"text-violet-400",bg:"bg-violet-900/30",border:"border-violet-700/50",icon:Ne},packer:{name:"打包员",color:"text-amber-400",bg:"bg-amber-900/30",border:"border-amber-700/50",icon:lr},deliverer:{name:"输送员",color:"text-emerald-400",bg:"bg-emerald-900/30",border:"border-emerald-700/50",icon:cr},"doc-writer":{name:"文档工程师",color:"text-slate-400",bg:"bg-slate-900/30",border:"border-slate-700/50",icon:ir},hr:{name:"人事专员",color:"text-rose-400",bg:"bg-rose-900/30",border:"border-rose-700/50",icon:or},finance:{name:"财务专员",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:nr},marketing:{name:"市场专员",color:"text-orange-400",bg:"bg-orange-900/30",border:"border-orange-700/50",icon:ar},"customer-service":{name:"客服专员",color:"text-sky-400",bg:"bg-sky-900/30",border:"border-sky-700/50",icon:sr},security:{name:"安全工程师",color:"text-red-400",bg:"bg-red-900/30",border:"border-red-700/50",icon:rr},legal:{name:"法务顾问",color:"text-blue-400",bg:"bg-blue-900/30",border:"border-blue-700/50",icon:tr},"sys-admin":{name:"系统管理员",color:"text-gray-400",bg:"bg-gray-900/60",border:"border-gray-700/50",icon:et}},gt={idle:{label:"空闲",color:"text-gray-500",dot:"bg-gray-600"},thinking:{label:"思考中",color:"text-yellow-400",dot:"bg-yellow-500 animate-pulse"},working:{label:"工作中",color:"text-green-400",dot:"bg-green-500 animate-pulse"},done:{label:"已完成",color:"text-blue-400",dot:"bg-blue-500"},error:{label:"错误",color:"text-red-400",dot:"bg-red-500"}};function Os({message:e}){const r=e.role||"system",a=fe[r]||fe.system,s=r==="user",o=a.icon;return t.jsxs("div",{"trae-inspector-start-line":"61","trae-inspector-start-column":"4","trae-inspector-end-line":"87","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("flex gap-2 px-3 py-2",s&&"flex-row-reverse"),children:[t.jsx("div",{"trae-inspector-start-line":"63","trae-inspector-start-column":"6","trae-inspector-end-line":"68","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border",a.bg,a.border),children:t.jsx(o,{className:f("w-4 h-4",a.color)})}),t.jsxs("div",{"trae-inspector-start-line":"71","trae-inspector-start-column":"6","trae-inspector-end-line":"86","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("flex-1 min-w-0 max-w-[78%]",s&&"flex flex-col items-end"),children:[t.jsxs("div",{"trae-inspector-start-line":"72","trae-inspector-start-column":"8","trae-inspector-end-line":"77","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-1.5 mb-0.5",children:[t.jsx("span",{"trae-inspector-start-line":"73","trae-inspector-start-column":"10","trae-inspector-end-line":"73","trae-inspector-end-column":"90","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-[11px] font-mono",a.color),children:a.name}),t.jsx("span",{"trae-inspector-start-line":"74","trae-inspector-start-column":"10","trae-inspector-end-line":"76","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[9px] font-mono text-gray-600",children:new Date(e.timestamp).toLocaleTimeString("zh-CN",{hour12:!1})})]}),t.jsx("div",{"trae-inspector-start-line":"78","trae-inspector-start-column":"8","trae-inspector-end-line":"85","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("rounded-xl px-3 py-2 text-[13px] leading-relaxed break-words",s?"bg-yellow-900/30 border border-yellow-700/40 text-yellow-100":f(a.bg,a.border,"text-gray-100 border")),children:t.jsx(Us,{content:e.content})})]})]})}function Us({content:e}){const[r,a]=R.useState(null),s=e.split(/(```[\s\S]*?```)/g),o=async(n,i)=>{try{await navigator.clipboard.writeText(n),a(i),setTimeout(()=>a(null),1500)}catch{const c=document.createElement("textarea");c.value=n,document.body.appendChild(c),c.select(),document.execCommand("copy"),document.body.removeChild(c),a(i),setTimeout(()=>a(null),1500)}};return t.jsx("div",{"trae-inspector-start-line":"114","trae-inspector-start-column":"4","trae-inspector-end-line":"147","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"whitespace-pre-wrap",children:s.map((n,i)=>{if(n.startsWith("```")){const c=n.replace(/^```\w*\n?/,"").replace(/```$/,"");return t.jsxs("div",{"trae-inspector-start-line":"119","trae-inspector-start-column":"12","trae-inspector-end-line":"142","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"my-1.5 relative group",children:[t.jsx("pre",{"trae-inspector-start-line":"120","trae-inspector-start-column":"14","trae-inspector-end-line":"122","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"my-0 p-3 bg-gray-950/90 border border-gray-800 rounded-xl overflow-x-auto text-[11px] font-mono text-green-300",children:t.jsx("code",{"trae-inspector-start-line":"121","trae-inspector-start-column":"16","trae-inspector-end-line":"121","trae-inspector-end-column":"35","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:c})}),t.jsx("button",{"trae-inspector-start-line":"123","trae-inspector-start-column":"14","trae-inspector-end-line":"141","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>o(c,i),className:f("absolute top-2 right-2 p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-all",r===i?"opacity-100 text-green-400 bg-green-900/30":"opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-400"),children:r===i?t.jsx("svg",{"trae-inspector-start-line":"133","trae-inspector-start-column":"18","trae-inspector-end-line":"135","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}):t.jsx("svg",{"trae-inspector-start-line":"137","trae-inspector-start-column":"18","trae-inspector-end-line":"139","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})})})]},i)}return t.jsx("span",{"trae-inspector-start-line":"145","trae-inspector-start-column":"15","trae-inspector-end-line":"145","trae-inspector-end-column":"42","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:n},i)})})}function $s(){return t.jsxs("div",{"trae-inspector-start-line":"154","trae-inspector-start-column":"4","trae-inspector-end-line":"165","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex gap-2 px-3 py-2",children:[t.jsx("div",{"trae-inspector-start-line":"155","trae-inspector-start-column":"6","trae-inspector-end-line":"161","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/60 border border-gray-700/50 flex items-center justify-center",children:t.jsxs("div",{"trae-inspector-start-line":"156","trae-inspector-start-column":"8","trae-inspector-end-line":"160","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex gap-0.5",children:[t.jsx("span",{"trae-inspector-start-line":"157","trae-inspector-start-column":"10","trae-inspector-end-line":"157","trae-inspector-end-column":"113","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-1 h-1 bg-green-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),t.jsx("span",{"trae-inspector-start-line":"158","trae-inspector-start-column":"10","trae-inspector-end-line":"158","trae-inspector-end-column":"115","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-1 h-1 bg-green-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),t.jsx("span",{"trae-inspector-start-line":"159","trae-inspector-start-column":"10","trae-inspector-end-line":"159","trae-inspector-end-column":"115","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-1 h-1 bg-green-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})}),t.jsx("div",{"trae-inspector-start-line":"162","trae-inspector-start-column":"6","trae-inspector-end-line":"164","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9B%A2%E9%98%9F%E6%AD%A3%E5%9C%A8%E5%8D%8F%E4%BD%9C%E5%A4%84%E7%90%86...%22%2C%22textStartLine%22%3A%22162%22%2C%22textStartColumn%22%3A%22126%22%2C%22textEndLine%22%3A%22164%22%2C%22textEndColumn%22%3A%226%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center px-3 py-2 rounded-xl bg-gray-900/60 border border-gray-800 text-[12px] text-gray-400",children:"团队正在协作处理..."})]})}function qs({agent:e}){const r=fe[e.id]||fe.system,a=gt[e.status]||gt.idle,s=r.icon;return t.jsx("div",{"trae-inspector-start-line":"176","trae-inspector-start-column":"4","trae-inspector-end-line":"208","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("p-3 rounded-xl border transition-all",e.status==="idle"?"bg-gray-900/40 border-gray-800":f(r.bg,r.border)),children:t.jsxs("div",{"trae-inspector-start-line":"180","trae-inspector-start-column":"6","trae-inspector-end-line":"207","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-3",children:[t.jsxs("div",{"trae-inspector-start-line":"181","trae-inspector-start-column":"8","trae-inspector-end-line":"189","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("relative w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0",r.bg,r.border),children:[t.jsx(s,{className:f("w-5 h-5",r.color)}),e.status!=="idle"&&t.jsx("div",{"trae-inspector-start-line":"187","trae-inspector-start-column":"12","trae-inspector-end-line":"187","trae-inspector-end-column":"127","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950",a.dot)})]}),t.jsxs("div",{"trae-inspector-start-line":"190","trae-inspector-start-column":"8","trae-inspector-end-line":"206","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 min-w-0",children:[t.jsxs("div",{"trae-inspector-start-line":"191","trae-inspector-start-column":"10","trae-inspector-end-line":"194","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between",children:[t.jsx("span",{"trae-inspector-start-line":"192","trae-inspector-start-column":"12","trae-inspector-end-line":"192","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-sm font-mono",r.color),children:e.name}),t.jsx("span",{"trae-inspector-start-line":"193","trae-inspector-start-column":"12","trae-inspector-end-line":"193","trae-inspector-end-column":"93","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-[10px] font-mono",a.color),children:a.label})]}),t.jsx("div",{"trae-inspector-start-line":"195","trae-inspector-start-column":"10","trae-inspector-end-line":"197","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] text-gray-500 mt-0.5 truncate",children:e.currentTask||"待命中..."}),e.status!=="idle"&&t.jsx("div",{"trae-inspector-start-line":"199","trae-inspector-start-column":"12","trae-inspector-end-line":"204","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"mt-1.5 h-1 bg-gray-800 rounded-full overflow-hidden",children:t.jsx("div",{"trae-inspector-start-line":"200","trae-inspector-start-column":"14","trae-inspector-end-line":"203","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("h-full transition-all duration-500",r.color.replace("text-","bg-")),style:{width:`${e.progress}%`}})})]})]})})}function Hs(){const{agents:e}=se(),r=e.filter(o=>o.status==="working"||o.status==="thinking").length,a=e.filter(o=>o.status==="done").length,s=[{name:"决策层",color:"text-yellow-400"},{name:"产品部",color:"text-sky-400"},{name:"设计部",color:"text-pink-400"},{name:"技术部",color:"text-green-400"},{name:"质量部",color:"text-fuchsia-400"},{name:"研发部",color:"text-purple-400"},{name:"运维部",color:"text-lime-400"},{name:"战略部",color:"text-indigo-400"},{name:"文档部",color:"text-slate-400"},{name:"人事部",color:"text-rose-400"},{name:"财务部",color:"text-amber-400"},{name:"市场部",color:"text-orange-400"},{name:"客服部",color:"text-cyan-400"},{name:"安全部",color:"text-red-400"},{name:"法务部",color:"text-blue-400"}];return t.jsxs("div",{"trae-inspector-start-line":"237","trae-inspector-start-column":"4","trae-inspector-end-line":"278","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"min-h-full flex flex-col",children:[t.jsx("div",{"trae-inspector-start-line":"239","trae-inspector-start-column":"6","trae-inspector-end-line":"255","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:t.jsxs("div",{"trae-inspector-start-line":"240","trae-inspector-start-column":"8","trae-inspector-end-line":"254","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between",children:[t.jsxs("div",{"trae-inspector-start-line":"241","trae-inspector-start-column":"10","trae-inspector-end-line":"246","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2",children:[t.jsx(xt,{className:"w-5 h-5 text-blue-400"}),t.jsx("h1",{"trae-inspector-start-line":"243","trae-inspector-start-column":"12","trae-inspector-end-line":"245","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9B%A2%E9%98%9F%22%2C%22textStartLine%22%3A%22243%22%2C%22textStartColumn%22%3A%22127%22%2C%22textEndLine%22%3A%22245%22%2C%22textEndColumn%22%3A%2212%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-base font-mono font-bold text-blue-400",style:{textShadow:"0 0 8px rgba(59,130,246,0.5)"},children:"团队"})]}),t.jsxs("div",{"trae-inspector-start-line":"247","trae-inspector-start-column":"10","trae-inspector-end-line":"253","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2 text-[11px] font-mono",children:[t.jsxs("span",{"trae-inspector-start-line":"248","trae-inspector-start-column":"12","trae-inspector-end-line":"248","trae-inspector-end-column":"68","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-green-400",children:[r," 活跃"]}),t.jsx("span",{"trae-inspector-start-line":"249","trae-inspector-start-column":"12","trae-inspector-end-line":"249","trae-inspector-end-column":"52","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%7C%22%2C%22textStartLine%22%3A%22249%22%2C%22textStartColumn%22%3A%2244%22%2C%22textEndLine%22%3A%22249%22%2C%22textEndColumn%22%3A%2245%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-gray-600",children:"|"}),t.jsxs("span",{"trae-inspector-start-line":"250","trae-inspector-start-column":"12","trae-inspector-end-line":"250","trae-inspector-end-column":"65","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-blue-400",children:[a," 完成"]}),t.jsx("span",{"trae-inspector-start-line":"251","trae-inspector-start-column":"12","trae-inspector-end-line":"251","trae-inspector-end-column":"52","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%7C%22%2C%22textStartLine%22%3A%22251%22%2C%22textStartColumn%22%3A%2244%22%2C%22textEndLine%22%3A%22251%22%2C%22textEndColumn%22%3A%2245%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-gray-600",children:"|"}),t.jsxs("span",{"trae-inspector-start-line":"252","trae-inspector-start-column":"12","trae-inspector-end-line":"252","trae-inspector-end-column":"69","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-gray-500",children:["共 ",e.length,"人"]})]})]})}),t.jsx("div",{"trae-inspector-start-line":"258","trae-inspector-start-column":"6","trae-inspector-end-line":"277","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 p-3 space-y-4 max-w-md mx-auto w-full pb-20",children:s.map(o=>{const n=e.filter(i=>i.department===o.name);return n.length===0?null:t.jsxs("div",{"trae-inspector-start-line":"263","trae-inspector-start-column":"12","trae-inspector-end-line":"274","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsxs("div",{"trae-inspector-start-line":"264","trae-inspector-start-column":"14","trae-inspector-end-line":"268","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-[11px] font-mono px-1 mb-2 tracking-wider flex items-center gap-2",o.color),children:[t.jsx("span",{"trae-inspector-start-line":"265","trae-inspector-start-column":"16","trae-inspector-end-line":"265","trae-inspector-end-column":"105","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-1.5 h-1.5 rounded-full",style:{backgroundColor:"currentColor"}}),o.name,t.jsxs("span",{"trae-inspector-start-line":"267","trae-inspector-start-column":"16","trae-inspector-end-line":"267","trae-inspector-end-column":"89","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-gray-600 text-[10px]",children:["(",n.length,"人)"]})]}),t.jsx("div",{"trae-inspector-start-line":"269","trae-inspector-start-column":"14","trae-inspector-end-line":"273","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"space-y-2",children:n.map(i=>t.jsx(qs,{agent:i},i.id))})]},o.name)})})]})}function Gs({onStartChat:e}){var p,l,m;const{agents:r}=se(),{entries:a}=be(),{messages:s}=Ut(),o=r.length,n=r.filter(x=>x.status==="working"||x.status==="thinking").length,i=[...new Set(r.map(x=>x.department).filter(Boolean))],c=[{label:"团队成员",value:o,unit:"人",color:"text-green-400",bg:"bg-green-900/20",border:"border-green-800/40"},{label:"活跃中",value:n,unit:"人",color:"text-yellow-400",bg:"bg-yellow-900/20",border:"border-yellow-800/40"},{label:"知识库",value:a.length,unit:"条",color:"text-purple-400",bg:"bg-purple-900/20",border:"border-purple-800/40"},{label:"部门数",value:i.length,unit:"个",color:"text-blue-400",bg:"bg-blue-900/20",border:"border-blue-800/40"}];return t.jsx("div",{"trae-inspector-start-line":"458","trae-inspector-start-column":"4","trae-inspector-end-line":"537","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 overflow-y-auto py-2",children:t.jsxs("div",{"trae-inspector-start-line":"459","trae-inspector-start-column":"6","trae-inspector-end-line":"536","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-3 space-y-3 max-w-md mx-auto w-full",children:[t.jsxs("div",{"trae-inspector-start-line":"461","trae-inspector-start-column":"8","trae-inspector-end-line":"475","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-4 rounded-2xl bg-gradient-to-br from-green-900/30 via-gray-900/50 to-blue-900/20 border border-green-800/40",children:[t.jsx("p",{"trae-inspector-start-line":"462","trae-inspector-start-column":"10","trae-inspector-end-line":"462","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%91%A3%E4%BA%8B%E9%95%BF%EF%BC%8C%E6%82%A8%E5%A5%BD%22%2C%22textStartLine%22%3A%22462%22%2C%22textStartColumn%22%3A%2266%22%2C%22textEndLine%22%3A%22462%22%2C%22textEndColumn%22%3A%2272%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-400 mb-1",children:"董事长，您好"}),t.jsx("p",{"trae-inspector-start-line":"463","trae-inspector-start-column":"10","trae-inspector-end-line":"465","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AC%A2%E8%BF%8E%E6%9D%A5%E5%88%B0%E6%B8%85%E9%B8%A2AI%E5%85%AC%E5%8F%B8%22%2C%22textStartLine%22%3A%22463%22%2C%22textStartColumn%22%3A%22114%22%2C%22textEndLine%22%3A%22465%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-base font-mono text-green-400",style:{textShadow:"0 0 8px rgba(34,197,94,0.3)"},children:"欢迎来到清鸢AI公司"}),t.jsxs("p",{"trae-inspector-start-line":"466","trae-inspector-start-column":"10","trae-inspector-end-line":"468","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] text-gray-500 mt-2 leading-relaxed",children:[o,"名员工随时待命，",i.length,"个部门高效运转。"]}),t.jsx("button",{"trae-inspector-start-line":"469","trae-inspector-start-column":"10","trae-inspector-end-line":"474","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E2%86%92%20%E4%B8%8B%E8%BE%BE%E6%96%B0%E6%8C%87%E4%BB%A4%22%2C%22textStartLine%22%3A%22472%22%2C%22textStartColumn%22%3A%2211%22%2C%22textEndLine%22%3A%22474%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:e,className:"mt-3 w-full py-2 rounded-xl bg-green-900/40 border border-green-700/50 text-green-400 text-[12px] font-mono hover:bg-green-900/60 transition-all",children:"→ 下达新指令"})]}),t.jsx("div",{"trae-inspector-start-line":"478","trae-inspector-start-column":"8","trae-inspector-end-line":"488","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"grid grid-cols-2 gap-2",children:c.map(x=>t.jsxs("div",{"trae-inspector-start-line":"480","trae-inspector-start-column":"12","trae-inspector-end-line":"486","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("p-3 rounded-xl border",x.bg,x.border),children:[t.jsxs("div",{"trae-inspector-start-line":"481","trae-inspector-start-column":"14","trae-inspector-end-line":"484","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-baseline gap-1 mb-0.5",children:[t.jsx("span",{"trae-inspector-start-line":"482","trae-inspector-start-column":"16","trae-inspector-end-line":"482","trae-inspector-end-column":"99","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-xl font-mono font-bold",x.color),children:x.value}),t.jsx("span",{"trae-inspector-start-line":"483","trae-inspector-start-column":"16","trae-inspector-end-line":"483","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-500",children:x.unit})]}),t.jsx("div",{"trae-inspector-start-line":"485","trae-inspector-start-column":"14","trae-inspector-end-line":"485","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-400",children:x.label})]},x.label))}),t.jsxs("div",{"trae-inspector-start-line":"491","trae-inspector-start-column":"8","trae-inspector-end-line":"517","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsxs("div",{"trae-inspector-start-line":"492","trae-inspector-start-column":"10","trae-inspector-end-line":"495","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2",children:[t.jsx("span",{"trae-inspector-start-line":"493","trae-inspector-start-column":"12","trae-inspector-end-line":"493","trae-inspector-end-column":"65","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-1 h-1 bg-blue-400 rounded-full"}),"部门概览"]}),t.jsx("div",{"trae-inspector-start-line":"496","trae-inspector-start-column":"10","trae-inspector-end-line":"516","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"space-y-1.5",children:i.slice(0,8).map(x=>{const y=r.filter(_=>_.department===x),u=y.filter(_=>_.status==="working"||_.status==="thinking").length,v=y.length>0?Math.round(u/y.length*100):0;return t.jsxs("div",{"trae-inspector-start-line":"502","trae-inspector-start-column":"16","trae-inspector-end-line":"513","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[t.jsxs("div",{"trae-inspector-start-line":"503","trae-inspector-start-column":"18","trae-inspector-end-line":"506","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between mb-1",children:[t.jsx("span",{"trae-inspector-start-line":"504","trae-inspector-start-column":"20","trae-inspector-end-line":"504","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-300",children:x}),t.jsxs("span",{"trae-inspector-start-line":"505","trae-inspector-start-column":"20","trae-inspector-end-line":"505","trae-inspector-end-column":"91","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-500",children:[y.length,"人"]})]}),t.jsx("div",{"trae-inspector-start-line":"507","trae-inspector-start-column":"18","trae-inspector-end-line":"512","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-1 bg-gray-800 rounded-full overflow-hidden",children:t.jsx("div",{"trae-inspector-start-line":"508","trae-inspector-start-column":"20","trae-inspector-end-line":"511","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500",style:{width:`${v}%`}})})]},x)})})]}),s.length>0&&t.jsxs("div",{"trae-inspector-start-line":"521","trae-inspector-start-column":"10","trae-inspector-end-line":"534","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsxs("div",{"trae-inspector-start-line":"522","trae-inspector-start-column":"12","trae-inspector-end-line":"525","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2",children:[t.jsx("span",{"trae-inspector-start-line":"523","trae-inspector-start-column":"14","trae-inspector-end-line":"523","trae-inspector-end-column":"69","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-1 h-1 bg-purple-400 rounded-full"}),"最近动态"]}),t.jsxs("div",{"trae-inspector-start-line":"526","trae-inspector-start-column":"12","trae-inspector-end-line":"533","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-3 rounded-xl bg-gray-900/50 border border-gray-800",children:[t.jsxs("p",{"trae-inspector-start-line":"527","trae-inspector-start-column":"14","trae-inspector-end-line":"529","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] text-gray-400 line-clamp-2",children:[(l=(p=s[s.length-1])==null?void 0:p.content)==null?void 0:l.slice(0,60),"..."]}),t.jsx("div",{"trae-inspector-start-line":"530","trae-inspector-start-column":"14","trae-inspector-end-line":"532","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"mt-1.5 text-[10px] text-gray-500 font-mono",children:new Date(((m=s[s.length-1])==null?void 0:m.timestamp)||Date.now()).toLocaleString("zh-CN")})]})]})]})})}function zs(){const{messages:e,isStreaming:r,addMessage:a,setStreaming:s}=Ut(),{resetAllAgents:o,updateAgentStatus:n,setAgentProgress:i}=se(),{workflowSpeed:c}=we(),{addEntry:p}=be(),[l,m]=R.useState(""),[x,y]=R.useState("idle"),[u,v]=R.useState("dashboard"),_=R.useRef(null),b=R.useRef(null),T=R.useRef(new Set);R.useEffect(()=>{var k;(k=_.current)==null||k.scrollTo({top:_.current.scrollHeight,behavior:"smooth"})},[e,r]),R.useEffect(()=>{b.current=new Ge({speedFactor:c})},[c]);const B={analyst:"analyst","coder-a":"coder-1","coder-b":"coder-2","coder-c":"coder-3","coder-d":"coder-4","coder-e":"coder-5",reviewer:"inspector-1","bug-detector":"inspector-2",extender:"expander",packager:"packer",deployer:"deliverer","knowledge-manager":"doc-writer"},I=async()=>{const k=l.trim();if(!(!k||r)){m(""),T.current.clear(),o(),a({id:Date.now().toString(),role:"user",content:k,timestamp:Date.now(),type:"text"}),s(!0),n("chairman","working"),i("chairman",30,"下达指令"),a({id:(Date.now()+1).toString(),role:"system",content:`📋 指令已接收，正在分发给分析员...

"${k}"`,timestamp:Date.now()+100,type:"text"});try{if(b.current){b.current.setOnProgress(D=>{if(y(D.phase),i("chairman",Math.min(100,(D.phaseIndex+1)/D.totalPhases*100),"监督工作流"),D.agent&&D.content&&!T.current.has(D.agent.id)){T.current.add(D.agent.id);const d=B[D.agent.id]||D.agent.id;n(d,"working"),i(d,50,D.message),setTimeout(()=>{n(d,"done"),i(d,100)},1500),a({id:`${Date.now()}-${D.agent.id}`,role:d,content:D.content,timestamp:Date.now(),type:"text",metadata:{agentId:d,phase:D.phase}})}});const S=await b.current.executeWorkflow(k);try{const D=S.phases.flatMap(O=>O.outputs).join(`

`).slice(0,3e3),d=k.replace(/[，。、！？\s]+/g," ").split(" ").filter(O=>O.length>1).slice(0,5),A=k.toLowerCase();let N="任务经验";A.includes("python")||A.includes("fastapi")||A.includes("后端")?N="后端开发":A.includes("react")||A.includes("前端")||A.includes("组件")?N="前端开发":A.includes("ai")||A.includes("智能体")||A.includes("agent")?N="AI/智能体":A.includes("sql")||A.includes("数据库")?N="数据库":(A.includes("部署")||A.includes("docker"))&&(N="DevOps");const M=`auto-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;p({id:M,title:`任务经验：${k.slice(0,40)}${k.length>40?"...":""}`,content:`## 任务记录

### 用户指令
${k}

### 执行结果摘要
${D.slice(0,2e3)}

### 执行统计
- 阶段数：${S.phases.length}
- 耗时：${(S.totalDuration/1e3).toFixed(1)}秒
- 状态：${S.isSuccess?"✅ 成功":"❌ 失败"}
- 生成时间：${new Date().toLocaleString("zh-CN")}

---
*此条目由自我学习系统自动生成*`,tags:[...d,"自动生成","任务经验",N],category:N,createdAt:Date.now(),source:"自我学习系统"})}catch(D){console.error("知识沉淀失败:",D)}a({id:(Date.now()+999).toString(),role:"system",content:S.isSuccess?`✅ 任务完成！

📊 执行统计：
• 共 ${S.phases.length} 个阶段
• 耗时 ${(S.totalDuration/1e3).toFixed(1)} 秒
• 全部Agent协作完成

📚 本次任务经验已自动存入知识库

结果已交付，请查阅。`:`⚠️ 任务执行结束（部分阶段可能异常）

📊 执行统计：
• 共 ${S.phases.length} 个阶段
• 耗时 ${(S.totalDuration/1e3).toFixed(1)} 秒

📚 本次任务经验已自动存入知识库

结果已交付，请查阅。`,timestamp:Date.now(),type:"text"}),n("chairman","done"),i("chairman",100,"任务完成")}}catch(S){a({id:(Date.now()+998).toString(),role:"system",content:`❌ 错误: ${S instanceof Error?S.message:"未知错误"}`,timestamp:Date.now(),type:"text"})}finally{s(!1),y("idle")}}},C=[{label:"分析",cmd:"分析一下用户管理系统的需求"},{label:"开发",cmd:"开发一个待办清单应用"},{label:"优化",cmd:"优化现有代码的性能"},{label:"部署",cmd:"部署到GitHub Pages"}];return t.jsxs("div",{"trae-inspector-start-line":"733","trae-inspector-start-column":"4","trae-inspector-end-line":"856","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-full flex flex-col",children:[t.jsxs("div",{"trae-inspector-start-line":"735","trae-inspector-start-column":"6","trae-inspector-end-line":"779","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 pt-2.5 pb-1",children:[t.jsxs("div",{"trae-inspector-start-line":"736","trae-inspector-start-column":"8","trae-inspector-end-line":"752","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between mb-2",children:[t.jsxs("div",{"trae-inspector-start-line":"737","trae-inspector-start-column":"10","trae-inspector-end-line":"747","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2",children:[t.jsx("div",{"trae-inspector-start-line":"738","trae-inspector-start-column":"12","trae-inspector-end-line":"740","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-7 h-7 rounded-lg bg-green-900/30 border border-green-700/50 flex items-center justify-center",children:t.jsx(ge,{className:"w-4 h-4 text-yellow-400"})}),t.jsxs("div",{"trae-inspector-start-line":"741","trae-inspector-start-column":"12","trae-inspector-end-line":"746","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("h1",{"trae-inspector-start-line":"742","trae-inspector-start-column":"14","trae-inspector-end-line":"744","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22HOPEAI%22%2C%22textStartLine%22%3A%22742%22%2C%22textStartColumn%22%3A%22127%22%2C%22textEndLine%22%3A%22744%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono font-bold text-green-400",style:{textShadow:"0 0 8px rgba(34,197,94,0.5)"},children:"HOPEAI"}),t.jsx("p",{"trae-inspector-start-line":"745","trae-inspector-start-column":"14","trae-inspector-end-line":"745","trae-inspector-end-column":"82","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%B8%85%E9%B8%A2AI%E5%85%AC%E5%8F%B8%22%2C%22textStartLine%22%3A%22745%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22745%22%2C%22textEndColumn%22%3A%2278%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[9px] font-mono text-gray-500 -mt-0.5",children:"清鸢AI公司"})]})]}),t.jsxs("div",{"trae-inspector-start-line":"748","trae-inspector-start-column":"10","trae-inspector-end-line":"751","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-1.5",children:[t.jsx("div",{"trae-inspector-start-line":"749","trae-inspector-start-column":"12","trae-inspector-end-line":"749","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"}),t.jsx("span",{"trae-inspector-start-line":"750","trae-inspector-start-column":"12","trae-inspector-end-line":"750","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9C%A8%E7%BA%BF%22%2C%22textStartLine%22%3A%22750%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%22750%22%2C%22textEndColumn%22%3A%2269%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] font-mono text-green-400",children:"在线"})]})]}),t.jsxs("div",{"trae-inspector-start-line":"755","trae-inspector-start-column":"8","trae-inspector-end-line":"778","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex gap-1 mb-1",children:[t.jsx("button",{"trae-inspector-start-line":"756","trae-inspector-start-column":"10","trae-inspector-end-line":"766","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%8E%A7%E5%88%B6%E4%B8%AD%E5%BF%83%22%2C%22textStartLine%22%3A%22764%22%2C%22textStartColumn%22%3A%2211%22%2C%22textEndLine%22%3A%22766%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>v("dashboard"),className:f("flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all",u==="dashboard"?"bg-green-900/40 text-green-400 border border-green-800/50":"text-gray-500 hover:text-gray-300"),children:"控制中心"}),t.jsx("button",{"trae-inspector-start-line":"767","trae-inspector-start-column":"10","trae-inspector-end-line":"777","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%B8%8B%E8%BE%BE%E6%8C%87%E4%BB%A4%22%2C%22textStartLine%22%3A%22775%22%2C%22textStartColumn%22%3A%2211%22%2C%22textEndLine%22%3A%22777%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>v("chat"),className:f("flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all",u==="chat"?"bg-green-900/40 text-green-400 border border-green-800/50":"text-gray-500 hover:text-gray-300"),children:"下达指令"})]})]}),u==="dashboard"?t.jsx(Gs,{onStartChat:()=>v("chat")}):t.jsxs(t.Fragment,{children:[t.jsx("div",{"trae-inspector-start-line":"787","trae-inspector-start-column":"10","trae-inspector-end-line":"816","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",ref:_,className:"flex-1 overflow-y-auto py-2",children:e.length===0?t.jsxs("div",{"trae-inspector-start-line":"789","trae-inspector-start-column":"14","trae-inspector-end-line":"809","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-full flex flex-col items-center justify-center px-6 text-center",children:[t.jsx("div",{"trae-inspector-start-line":"790","trae-inspector-start-column":"16","trae-inspector-end-line":"792","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-16 h-16 rounded-2xl bg-green-900/20 border border-green-700/40 flex items-center justify-center mb-4",children:t.jsx(ge,{className:"w-8 h-8 text-yellow-400 opacity-70"})}),t.jsx("h2",{"trae-inspector-start-line":"793","trae-inspector-start-column":"16","trae-inspector-end-line":"793","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AC%A2%E8%BF%8E%EF%BC%8C%E8%91%A3%E4%BA%8B%E9%95%BF%22%2C%22textStartLine%22%3A%22793%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22793%22%2C%22textEndColumn%22%3A%2278%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-base font-mono text-green-400 mb-1",children:"欢迎，董事长"}),t.jsxs("p",{"trae-inspector-start-line":"794","trae-inspector-start-column":"16","trae-inspector-end-line":"797","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[12px] text-gray-500 leading-relaxed",children:["下达您的指令，团队将自动协作完成",t.jsx("br",{"trae-inspector-start-line":"795","trae-inspector-start-column":"34","trae-inspector-end-line":"795","trae-inspector-end-column":"40","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D"}),"分析 → 编码 → 审查 → 扩展 → 打包 → 部署"]}),t.jsx("div",{"trae-inspector-start-line":"798","trae-inspector-start-column":"16","trae-inspector-end-line":"808","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"mt-6 grid grid-cols-2 gap-2 w-full max-w-xs",children:C.map(k=>t.jsx("button",{"trae-inspector-start-line":"800","trae-inspector-start-column":"20","trae-inspector-end-line":"806","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>m(k.cmd),className:"px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-800 hover:border-green-700/50 text-[11px] font-mono text-gray-400 hover:text-green-400 transition-all",children:k.label},k.label))})]}):t.jsxs(t.Fragment,{children:[e.map(k=>t.jsx(Os,{message:k},k.id)),r&&t.jsx($s,{})]})}),t.jsx("div",{"trae-inspector-start-line":"819","trae-inspector-start-column":"10","trae-inspector-end-line":"853","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-t border-green-900/30 p-2.5",children:t.jsxs("div",{"trae-inspector-start-line":"820","trae-inspector-start-column":"12","trae-inspector-end-line":"852","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-end gap-2 max-w-md mx-auto",children:[t.jsx("div",{"trae-inspector-start-line":"821","trae-inspector-start-column":"14","trae-inspector-end-line":"839","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 relative",children:t.jsxs("div",{"trae-inspector-start-line":"822","trae-inspector-start-column":"16","trae-inspector-end-line":"838","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center bg-gray-900/80 border border-gray-800 rounded-2xl focus-within:border-green-700/50 transition-colors",children:[t.jsx("span",{"trae-inspector-start-line":"823","trae-inspector-start-column":"18","trae-inspector-end-line":"823","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"pl-3 text-green-500 font-mono text-sm",children:">"}),t.jsx("textarea",{"trae-inspector-start-line":"824","trae-inspector-start-column":"18","trae-inspector-end-line":"837","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",value:l,onChange:k=>m(k.target.value),onKeyDown:k=>{k.key==="Enter"&&!k.shiftKey&&(k.preventDefault(),I())},placeholder:"下达指令...",rows:1,className:"flex-1 bg-transparent px-2 py-2.5 text-[13px] text-gray-100 placeholder-gray-600 font-mono resize-none outline-none max-h-24",disabled:r})]})}),t.jsx("button",{"trae-inspector-start-line":"840","trae-inspector-start-column":"14","trae-inspector-end-line":"851","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:I,disabled:!l.trim()||r,className:f("flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all",l.trim()&&!r?"bg-green-600 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)] hover:bg-green-500":"bg-gray-800 text-gray-600"),children:t.jsx(er,{className:"w-4 h-4"})})]})})]})]})}function qt({initialView:e="chat"}){return e==="team"?t.jsx(Hs,{}):t.jsx(zs,{})}const Ht=[{owner:"facebook",repo:"react",category:"前端开发",tags:["react","前端","facebook"]},{owner:"vuejs",repo:"vue",category:"前端开发",tags:["vue","前端","渐进式"]},{owner:"vitejs",repo:"vite",category:"前端开发",tags:["vite","构建工具","esbuild"]},{owner:"tailwindlabs",repo:"tailwindcss",category:"前端开发",tags:["tailwindcss","css","原子化"]},{owner:"pmndrs",repo:"zustand",category:"前端开发",tags:["zustand","状态管理","react"]},{owner:"remix-run",repo:"react-router",category:"前端开发",tags:["react-router","路由","spa"]},{owner:"framer",repo:"motion",category:"前端开发",tags:["framer-motion","动画","react"]},{owner:"tiangolo",repo:"fastapi",category:"后端开发",tags:["fastapi","python","api"]},{owner:"encode",repo:"starlette",category:"后端开发",tags:["starlette","asgi","python"]},{owner:"pydantic",repo:"pydantic",category:"后端开发",tags:["pydantic","数据验证","python"]},{owner:"sqlalchemy",repo:"sqlalchemy",category:"后端开发",tags:["sqlalchemy","orm","python"]},{owner:"encode",repo:"uvicorn",category:"后端开发",tags:["uvicorn","asgi","服务器"]},{owner:"langchain-ai",repo:"langchain",category:"AI/智能体",tags:["langchain","ai","agent"]},{owner:"chroma-core",repo:"chroma",category:"AI/智能体",tags:["chromadb","向量数据库","ai"]},{owner:"microsoft",repo:"autogen",category:"AI/智能体",tags:["autogen","multi-agent","microsoft"]},{owner:"openai",repo:"openai-python",category:"AI/智能体",tags:["openai","api","python"]},{owner:"huggingface",repo:"transformers",category:"AI/智能体",tags:["transformers","nlp","huggingface"]},{owner:"sentence-transformers",repo:"sentence-transformers",category:"AI/智能体",tags:["embedding","向量化","nlp"]},{owner:"prisma",repo:"prisma",category:"数据库",tags:["prisma","orm","typescript"]},{owner:"redis",repo:"redis",category:"数据库",tags:["redis","缓存","nosql"]},{owner:"postgres",repo:"postgres",category:"数据库",tags:["postgresql","数据库","sql"]},{owner:"nginx",repo:"nginx",category:"DevOps",tags:["nginx","反向代理","负载均衡"]},{owner:"docker",repo:"compose",category:"DevOps",tags:["docker","compose","容器"]},{owner:"actions",repo:"actions",category:"DevOps",tags:["github-actions","ci-cd","自动化"]},{owner:"microsoft",repo:"TypeScript",category:"编程语言",tags:["typescript","类型系统","microsoft"]},{owner:"microsoft",repo:"vscode",category:"工具",tags:["vscode","编辑器","ide"]},{owner:"electron",repo:"electron",category:"工具",tags:["electron","桌面应用","跨平台"]},{owner:"qingluan-studio",repo:"hopeai",category:"项目规划",tags:["hopeai","希望AI","AI助手","董事长项目"]},{owner:"qingluan-studio",repo:"hopeai-v20",category:"项目规划",tags:["hopeai-v20","希望AI","极简助手","董事长项目"]},{owner:"qingluan-studio",repo:"Mingyuan-Assistant",category:"AI/智能体",tags:["mingyuan","助手","AI","董事长项目"]}],ze="https://api.github.com";async function Ks(e,r){try{const a=await fetch(`${ze}/repos/${e}/${r}/readme`,{headers:{Accept:"application/vnd.github.v3.raw"}});return a.ok?(await a.text()).slice(0,8e3):null}catch{return null}}async function Vs(e,r){var a;try{const s=await fetch(`${ze}/repos/${e}/${r}`);if(!s.ok)return null;const o=await s.json();return{description:o.description||"",stars:o.stargazers_count||0,language:o.language||"",topics:o.topics||[],license:((a=o.license)==null?void 0:a.spdx_id)||""}}catch{return null}}function Ws(e){const r=[],a=/```(\w+)?\n([\s\S]*?)```/g;let s;for(;(s=a.exec(e))!==null;){const o=s[1]||"text",n=s[2].trim();n.length>50&&n.length<5e3&&r.push({language:o,code:n})}return r.slice(0,3)}async function Ke(e){const[r,a]=await Promise.all([Ks(e.owner,e.repo),Vs(e.owner,e.repo)]);if(!r)return null;const s=Ws(r),o=s.length>0?`

### 代码示例

${s.map((c,p)=>`\`\`\`${c.language}
${c.code}
\`\`\``).join(`

`)}`:"",n=a!=null&&a.license?`
- 许可证: ${a.license}`:"",i=a!=null&&a.stars?`
- Stars: ${a.stars.toLocaleString()}`:"";return{id:`gh-${e.owner}-${e.repo}`,title:`${e.owner}/${e.repo} - 开源项目文档`,content:`## ${e.owner}/${e.repo}

${(a==null?void 0:a.description)||""}

### 项目信息
- 语言: ${(a==null?void 0:a.language)||"未知"}${i}${n}
- GitHub: https://github.com/${e.owner}/${e.repo}

### README 摘要

${r.slice(0,3e3)}
${o}

---
*来源: GitHub 开源项目 (公开可商用)*`,tags:[...e.tags,"开源","github",e.owner],category:e.category,createdAt:Date.now(),source:"GitHub开源导入"}}async function Ys(e,r=10){const s=[...Ht].sort(()=>Math.random()-.5).slice(0,r),o=[];for(let n=0;n<s.length;n++){const i=s[n];e==null||e(n+1,s.length,`${i.owner}/${i.repo}`);const c=await Ke(i);c&&o.push(c),n<s.length-1&&await new Promise(p=>setTimeout(p,200))}return o}async function Qs(e="python",r){const a=Ht.filter(o=>e==="python"?o.tags.includes("python")||o.tags.includes("fastapi"):e==="typescript"||e==="react"?o.tags.includes("react")||o.tags.includes("typescript"):!0).slice(0,5),s=[];for(let o=0;o<a.length;o++){r==null||r(o+1,a.length);const n=await Ke(a[o]);n&&(n.id=`code-${a[o].owner}-${a[o].repo}-${Date.now()}`,n.title=`[代码片段] ${a[o].owner}/${a[o].repo}`,n.category="代码示例",s.push(n)),await new Promise(i=>setTimeout(i,200))}return s}async function Xs(e){const r="qingluan-studio",a=[];let s=[];try{const o=await fetch(`${ze}/users/${r}/repos?per_page=50&sort=updated&type=public`);o.ok&&(s=(await o.json()).filter(i=>!i.fork).map(i=>i.name))}catch{s=["hopeai","hopeai-v20","Mingyuan-Assistant"]}s.length===0&&(s=["hopeai","hopeai-v20","Mingyuan-Assistant"]);for(let o=0;o<s.length;o++){const n=s[o];e==null||e(o+1,s.length,`${r}/${n}`);const i=await Ke({owner:r,repo:n,category:"董事长项目",tags:["自有项目","董事长",r,n]});i&&(i.id=`my-${r}-${n}-${Date.now()}`,i.title=`[董事长项目] ${n}`,i.source="董事长GitHub仓库",a.push(i)),o<s.length-1&&await new Promise(c=>setTimeout(c,200))}return a}const Js=[{id:"all",name:"全部"},{id:"项目规划",name:"规划"},{id:"前端开发",name:"前端"},{id:"后端开发",name:"后端"},{id:"编程语言",name:"语言"},{id:"运维部署",name:"运维"},{id:"架构设计",name:"架构"}],ht=["text-green-400 border-green-500/50 bg-green-500/10","text-blue-400 border-blue-500/50 bg-blue-500/10","text-purple-400 border-purple-500/50 bg-purple-500/10","text-yellow-400 border-yellow-500/50 bg-yellow-500/10","text-pink-400 border-pink-500/50 bg-pink-500/10","text-cyan-400 border-cyan-500/50 bg-cyan-500/10"];function Ve(e){return ht[e%ht.length]}function Zs({entry:e,onClick:r}){const a=s=>new Date(s).toLocaleDateString("zh-CN",{month:"2-digit",day:"2-digit"});return t.jsxs("div",{"trae-inspector-start-line":"66","trae-inspector-start-column":"4","trae-inspector-end-line":"103","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:r,className:f("p-3 rounded-xl border bg-gray-900/60 border-gray-800","active:scale-[0.98] transition-transform cursor-pointer"),children:[t.jsxs("div",{"trae-inspector-start-line":"73","trae-inspector-start-column":"6","trae-inspector-end-line":"78","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-start justify-between mb-2",children:[t.jsx("h3",{"trae-inspector-start-line":"74","trae-inspector-start-column":"8","trae-inspector-end-line":"76","trae-inspector-end-column":"13","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-gray-200 font-medium flex-1 mr-2 line-clamp-1",children:e.title}),t.jsx(Oe,{className:"w-4 h-4 text-gray-600 flex-shrink-0"})]}),t.jsx("p",{"trae-inspector-start-line":"80","trae-inspector-start-column":"6","trae-inspector-end-line":"82","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs text-gray-500 mb-2.5 line-clamp-2 font-mono leading-relaxed",children:e.content}),t.jsxs("div",{"trae-inspector-start-line":"84","trae-inspector-start-column":"6","trae-inspector-end-line":"102","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between",children:[t.jsx("div",{"trae-inspector-start-line":"85","trae-inspector-start-column":"8","trae-inspector-end-line":"97","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex flex-wrap gap-1",children:e.tags.slice(0,2).map((s,o)=>t.jsxs("span",{"trae-inspector-start-line":"87","trae-inspector-start-column":"12","trae-inspector-end-line":"95","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("px-1.5 py-0.5 text-[10px] font-mono rounded border",Ve(o)),children:["#",s]},s))}),t.jsxs("div",{"trae-inspector-start-line":"98","trae-inspector-start-column":"8","trae-inspector-end-line":"101","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-1 text-[10px] font-mono text-gray-600",children:[t.jsx(Ie,{className:"w-3 h-3"}),t.jsx("span",{"trae-inspector-start-line":"100","trae-inspector-start-column":"10","trae-inspector-end-line":"100","trae-inspector-end-column":"52","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:a(e.createdAt)})]})]})]})}function ea({entry:e,onBack:r}){const a=s=>new Date(s).toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"});return t.jsxs("div",{"trae-inspector-start-line":"125","trae-inspector-start-column":"4","trae-inspector-end-line":"251","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"fixed inset-0 z-50 bg-gray-950 flex flex-col",children:[t.jsx("div",{"trae-inspector-start-line":"126","trae-inspector-start-column":"6","trae-inspector-end-line":"146","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:t.jsxs("div",{"trae-inspector-start-line":"127","trae-inspector-start-column":"8","trae-inspector-end-line":"145","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-3 max-w-md mx-auto",children:[t.jsx("button",{"trae-inspector-start-line":"128","trae-inspector-start-column":"10","trae-inspector-end-line":"133","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:r,className:"p-1.5 -ml-1.5 rounded-lg hover:bg-gray-800/80 transition-colors",children:t.jsx(fr,{className:"w-5 h-5 text-green-400"})}),t.jsxs("div",{"trae-inspector-start-line":"134","trae-inspector-start-column":"10","trae-inspector-end-line":"144","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 min-w-0",children:[t.jsx("h1",{"trae-inspector-start-line":"135","trae-inspector-start-column":"12","trae-inspector-end-line":"137","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-green-400 font-bold line-clamp-1",style:{textShadow:"0 0 8px rgba(34,197,94,0.5)"},children:e.title}),t.jsxs("div",{"trae-inspector-start-line":"138","trae-inspector-start-column":"12","trae-inspector-end-line":"143","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2 text-[10px] font-mono text-gray-500 mt-0.5",children:[t.jsx(yr,{className:"w-3 h-3"}),t.jsx("span",{"trae-inspector-start-line":"140","trae-inspector-start-column":"14","trae-inspector-end-line":"140","trae-inspector-end-column":"43","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:e.category}),t.jsx("span",{"trae-inspector-start-line":"141","trae-inspector-start-column":"14","trae-inspector-end-line":"141","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%C2%B7%22%2C%22textStartLine%22%3A%22141%22%2C%22textStartColumn%22%3A%2220%22%2C%22textEndLine%22%3A%22141%22%2C%22textEndColumn%22%3A%2221%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",children:"·"}),t.jsx("span",{"trae-inspector-start-line":"142","trae-inspector-start-column":"14","trae-inspector-end-line":"142","trae-inspector-end-column":"56","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:a(e.createdAt)})]})]})]})}),t.jsx("div",{"trae-inspector-start-line":"148","trae-inspector-start-column":"6","trae-inspector-end-line":"163","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 px-4 py-2 border-b border-green-900/20 bg-gray-950/50",children:t.jsx("div",{"trae-inspector-start-line":"149","trae-inspector-start-column":"8","trae-inspector-end-line":"162","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex flex-wrap gap-1.5 max-w-md mx-auto",children:e.tags.map((s,o)=>t.jsxs("span",{"trae-inspector-start-line":"151","trae-inspector-start-column":"12","trae-inspector-end-line":"160","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("px-2 py-0.5 text-[10px] font-mono rounded border",Ve(o)),children:[t.jsx(br,{className:"w-3 h-3 inline mr-1"}),s]},s))})}),t.jsx("div",{"trae-inspector-start-line":"165","trae-inspector-start-column":"6","trae-inspector-end-line":"250","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 overflow-y-auto px-4 py-4 safe-area-bottom",children:t.jsx("article",{"trae-inspector-start-line":"166","trae-inspector-start-column":"8","trae-inspector-end-line":"249","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"max-w-md mx-auto",children:t.jsx(Vt,{remarkPlugins:[Wt],components:{h1:({children:s})=>t.jsx("h1",{"trae-inspector-start-line":"171","trae-inspector-start-column":"16","trae-inspector-end-line":"173","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-lg font-mono text-green-400 mb-3 mt-5 first:mt-0",style:{textShadow:"0 0 8px rgba(34,197,94,0.4)"},children:s}),h2:({children:s})=>t.jsx("h2",{"trae-inspector-start-line":"176","trae-inspector-start-column":"16","trae-inspector-end-line":"178","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-base font-mono text-green-300 mb-2.5 mt-4",style:{textShadow:"0 0 6px rgba(34,197,94,0.3)"},children:s}),h3:({children:s})=>t.jsx("h3",{"trae-inspector-start-line":"181","trae-inspector-start-column":"16","trae-inspector-end-line":"183","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-green-300/80 mb-2 mt-3",children:s}),p:({children:s})=>t.jsx("p",{"trae-inspector-start-line":"186","trae-inspector-start-column":"16","trae-inspector-end-line":"188","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs text-gray-300 mb-3 leading-relaxed font-mono",children:s}),ul:({children:s})=>t.jsx("ul",{"trae-inspector-start-line":"191","trae-inspector-start-column":"16","trae-inspector-end-line":"193","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"list-disc list-inside mb-3 text-xs text-gray-300 font-mono space-y-1",children:s}),ol:({children:s})=>t.jsx("ol",{"trae-inspector-start-line":"196","trae-inspector-start-column":"16","trae-inspector-end-line":"198","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"list-decimal list-inside mb-3 text-xs text-gray-300 font-mono space-y-1",children:s}),code:({className:s,children:o})=>s?t.jsx("code",{"trae-inspector-start-line":"210","trae-inspector-start-column":"18","trae-inspector-end-line":"212","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"block bg-gray-900/80 border border-gray-700 rounded-lg p-3 text-[11px] font-mono text-gray-300 overflow-x-auto mb-3",children:o}):t.jsx("code",{"trae-inspector-start-line":"204","trae-inspector-start-column":"20","trae-inspector-end-line":"206","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded text-[11px] font-mono border border-green-800/50",children:o}),blockquote:({children:s})=>t.jsx("blockquote",{"trae-inspector-start-line":"216","trae-inspector-start-column":"16","trae-inspector-end-line":"218","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"border-l-2 border-green-500 pl-3 py-1.5 my-3 bg-green-900/10 text-gray-400 text-xs font-mono italic",children:s}),a:({href:s,children:o})=>t.jsx("a",{"trae-inspector-start-line":"221","trae-inspector-start-column":"16","trae-inspector-end-line":"226","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",href:s,className:"text-cyan-400 hover:text-cyan-300 underline underline-offset-2",children:o}),table:({children:s})=>t.jsx("div",{"trae-inspector-start-line":"229","trae-inspector-start-column":"16","trae-inspector-end-line":"233","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"overflow-x-auto mb-3 -mx-1",children:t.jsx("table",{"trae-inspector-start-line":"230","trae-inspector-start-column":"18","trae-inspector-end-line":"232","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-full text-xs font-mono border border-gray-700 rounded-lg overflow-hidden",children:s})}),th:({children:s})=>t.jsx("th",{"trae-inspector-start-line":"236","trae-inspector-start-column":"16","trae-inspector-end-line":"238","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"px-2 py-1.5 bg-gray-800/80 border-b border-gray-700 text-left text-green-400",children:s}),td:({children:s})=>t.jsx("td",{"trae-inspector-start-line":"241","trae-inspector-start-column":"16","trae-inspector-end-line":"243","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"px-2 py-1.5 border-b border-gray-800 text-gray-300",children:s})},children:e.content})})})]})}function ta(){const{entries:e,searchQuery:r,setSearch:a,selectEntry:s,selectedEntry:o,addEntry:n}=be(),[i,c]=R.useState("all"),[p,l]=R.useState(null),[m,x]=R.useState(!1),[y,u]=R.useState(!1),[v,_]=R.useState({current:0,total:0,name:""}),[b,T]=R.useState(null),B=R.useMemo(()=>{const d=new Set;return e.forEach(A=>A.tags.forEach(N=>d.add(N))),Array.from(d)},[e]),I=R.useMemo(()=>{let d=e;if(i!=="all"&&(d=d.filter(A=>A.category===i)),p&&(d=d.filter(A=>A.tags.includes(p))),r.trim()){const A=r.toLowerCase();d=d.filter(N=>N.title.toLowerCase().includes(A)||N.content.toLowerCase().includes(A)||N.tags.some(M=>M.toLowerCase().includes(A)))}return d},[e,i,p,r]),C=e.find(d=>d.id===o)||null,k=async()=>{u(!0),T(null);try{const d=await Ys((N,M,O)=>_({current:N,total:M,name:O}),8);let A=0;for(const N of d)e.some(M=>M.id===N.id)||(n(N),A++);T(`✅ 成功导入 ${A} 条开源知识`)}catch(d){T(`❌ 导入失败: ${d instanceof Error?d.message:"未知错误"}`)}finally{u(!1),_({current:0,total:0,name:""}),setTimeout(()=>T(null),5e3)}},S=async()=>{u(!0),T(null);try{const d=await Qs("python",(N,M)=>_({current:N,total:M,name:"代码片段"}));let A=0;for(const N of d)n(N),A++;T(`✅ 成功导入 ${A} 条代码片段`)}catch(d){T(`❌ 导入失败: ${d instanceof Error?d.message:"未知错误"}`)}finally{u(!1),_({current:0,total:0,name:""}),setTimeout(()=>T(null),5e3)}},D=async()=>{u(!0),T(null);try{const d=await Xs((N,M,O)=>_({current:N,total:M,name:O}));let A=0;for(const N of d)n(N),A++;T(`✅ 成功导入 ${A} 个董事长项目`)}catch(d){T(`❌ 导入失败: ${d instanceof Error?d.message:"未知错误"}`)}finally{u(!1),_({current:0,total:0,name:""}),setTimeout(()=>T(null),5e3)}};return t.jsxs("div",{"trae-inspector-start-line":"371","trae-inspector-start-column":"4","trae-inspector-end-line":"584","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-full flex flex-col",children:[t.jsx("div",{"trae-inspector-start-line":"372","trae-inspector-start-column":"6","trae-inspector-end-line":"559","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:t.jsxs("div",{"trae-inspector-start-line":"373","trae-inspector-start-column":"8","trae-inspector-end-line":"558","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"max-w-md mx-auto",children:[t.jsxs("div",{"trae-inspector-start-line":"374","trae-inspector-start-column":"10","trae-inspector-end-line":"382","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2 mb-3",children:[t.jsx(bt,{className:"w-5 h-5 text-purple-400",style:{filter:"drop-shadow(0 0 6px rgba(168,85,247,0.5))"}}),t.jsx("h1",{"trae-inspector-start-line":"376","trae-inspector-start-column":"12","trae-inspector-end-line":"378","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%9F%A5%E8%AF%86%E5%BA%93%22%2C%22textStartLine%22%3A%22376%22%2C%22textStartColumn%22%3A%22129%22%2C%22textEndLine%22%3A%22378%22%2C%22textEndColumn%22%3A%2212%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-base font-mono font-bold text-purple-400",style:{textShadow:"0 0 8px rgba(168,85,247,0.5)"},children:"知识库"}),t.jsxs("span",{"trae-inspector-start-line":"379","trae-inspector-start-column":"12","trae-inspector-end-line":"381","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"ml-auto text-[10px] font-mono text-gray-500",children:["共 ",I.length," 条"]})]}),t.jsxs("div",{"trae-inspector-start-line":"384","trae-inspector-start-column":"10","trae-inspector-end-line":"412","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2",children:[t.jsxs("div",{"trae-inspector-start-line":"385","trae-inspector-start-column":"12","trae-inspector-end-line":"400","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 relative",children:[t.jsx(Be,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"}),t.jsx("input",{"trae-inspector-start-line":"387","trae-inspector-start-column":"14","trae-inspector-end-line":"399","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",type:"text",value:r,onChange:d=>a(d.target.value),placeholder:"搜索知识...",className:f("w-full pl-9 pr-3 py-2 rounded-xl border text-sm font-mono","bg-gray-900/80 border-gray-800 text-gray-200","placeholder:text-gray-600","focus:outline-none focus:border-purple-500/70","transition-colors")})]}),t.jsx("button",{"trae-inspector-start-line":"401","trae-inspector-start-column":"12","trae-inspector-end-line":"411","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>x(!m),className:f("p-2 rounded-xl border transition-colors",m?"bg-purple-900/30 border-purple-700/50 text-purple-400":"bg-gray-900/80 border-gray-800 text-gray-500 hover:text-gray-400"),children:t.jsx(ur,{className:"w-4 h-4"})})]}),t.jsxs("div",{"trae-inspector-start-line":"415","trae-inspector-start-column":"10","trae-inspector-end-line":"467","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"grid grid-cols-3 gap-1.5 mt-2",children:[t.jsxs("button",{"trae-inspector-start-line":"416","trae-inspector-start-column":"12","trae-inspector-end-line":"432","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:k,disabled:y,className:f("flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all",y?"bg-gray-800 border-gray-700 text-gray-500":"bg-green-900/20 border-green-700/40 text-green-400 hover:bg-green-900/40 active:scale-95"),children:[y?t.jsx(ve,{className:"w-3 h-3 animate-spin"}):t.jsx(gr,{className:"w-3 h-3"}),"开源知识"]}),t.jsxs("button",{"trae-inspector-start-line":"433","trae-inspector-start-column":"12","trae-inspector-end-line":"449","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:S,disabled:y,className:f("flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all",y?"bg-gray-800 border-gray-700 text-gray-500":"bg-blue-900/20 border-blue-700/40 text-blue-400 hover:bg-blue-900/40 active:scale-95"),children:[y?t.jsx(ve,{className:"w-3 h-3 animate-spin"}):t.jsx(Q,{className:"w-3 h-3"}),"代码片段"]}),t.jsxs("button",{"trae-inspector-start-line":"450","trae-inspector-start-column":"12","trae-inspector-end-line":"466","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:D,disabled:y,className:f("flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all",y?"bg-gray-800 border-gray-700 text-gray-500":"bg-purple-900/20 border-purple-700/40 text-purple-400 hover:bg-purple-900/40 active:scale-95"),children:[y?t.jsx(ve,{className:"w-3 h-3 animate-spin"}):t.jsx(hr,{className:"w-3 h-3"}),"我的项目"]})]}),y&&v.total>0&&t.jsxs("div",{"trae-inspector-start-line":"471","trae-inspector-start-column":"12","trae-inspector-end-line":"482","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"mt-2 p-2 rounded-lg bg-gray-900/80 border border-green-800/30",children:[t.jsxs("div",{"trae-inspector-start-line":"472","trae-inspector-start-column":"14","trae-inspector-end-line":"475","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1",children:[t.jsx("span",{"trae-inspector-start-line":"473","trae-inspector-start-column":"16","trae-inspector-end-line":"473","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"truncate flex-1",children:v.name}),t.jsxs("span",{"trae-inspector-start-line":"474","trae-inspector-start-column":"16","trae-inspector-end-line":"474","trae-inspector-end-column":"93","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"ml-2",children:[v.current,"/",v.total]})]}),t.jsx("div",{"trae-inspector-start-line":"476","trae-inspector-start-column":"14","trae-inspector-end-line":"481","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-1 bg-gray-800 rounded-full overflow-hidden",children:t.jsx("div",{"trae-inspector-start-line":"477","trae-inspector-start-column":"16","trae-inspector-end-line":"480","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300",style:{width:`${v.current/v.total*100}%`}})})]}),b&&t.jsxs("div",{"trae-inspector-start-line":"487","trae-inspector-start-column":"12","trae-inspector-end-line":"499","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("mt-2 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5",b.startsWith("✅")?"bg-green-900/20 border border-green-700/40 text-green-400":"bg-red-900/20 border border-red-700/40 text-red-400"),children:[b.startsWith("✅")?t.jsx(xr,{className:"w-3.5 h-3.5 flex-shrink-0"}):t.jsx(wt,{className:"w-3.5 h-3.5 flex-shrink-0"}),t.jsx("span",{"trae-inspector-start-line":"498","trae-inspector-start-column":"14","trae-inspector-end-line":"498","trae-inspector-end-column":"62","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"truncate",children:b})]}),m&&t.jsxs("div",{"trae-inspector-start-line":"503","trae-inspector-start-column":"12","trae-inspector-end-line":"556","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"mt-3 space-y-3 animate-in slide-in-from-top-2",children:[t.jsxs("div",{"trae-inspector-start-line":"504","trae-inspector-start-column":"14","trae-inspector-end-line":"525","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("div",{"trae-inspector-start-line":"505","trae-inspector-start-column":"16","trae-inspector-end-line":"505","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%88%86%E7%B1%BB%22%2C%22textStartLine%22%3A%22505%22%2C%22textStartColumn%22%3A%2276%22%2C%22textEndLine%22%3A%22505%22%2C%22textEndColumn%22%3A%2278%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] font-mono text-gray-600 mb-1.5",children:"分类"}),t.jsx("div",{"trae-inspector-start-line":"506","trae-inspector-start-column":"16","trae-inspector-end-line":"524","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex flex-wrap gap-1.5",children:Js.map(d=>{const A=i===d.id;return t.jsx("button",{"trae-inspector-start-line":"510","trae-inspector-start-column":"22","trae-inspector-end-line":"521","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>c(d.id),className:f("px-2.5 py-1 rounded-lg text-xs font-mono border transition-all",A?"bg-purple-900/30 text-purple-400 border-purple-700/50":"bg-gray-900/60 text-gray-500 border-gray-800 hover:text-gray-400"),children:d.name},d.id)})})]}),B.length>0&&t.jsxs("div",{"trae-inspector-start-line":"528","trae-inspector-start-column":"16","trae-inspector-end-line":"554","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("div",{"trae-inspector-start-line":"529","trae-inspector-start-column":"18","trae-inspector-end-line":"529","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%A0%87%E7%AD%BE%22%2C%22textStartLine%22%3A%22529%22%2C%22textStartColumn%22%3A%2278%22%2C%22textEndLine%22%3A%22529%22%2C%22textEndColumn%22%3A%2280%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] font-mono text-gray-600 mb-1.5",children:"标签"}),t.jsx("div",{"trae-inspector-start-line":"530","trae-inspector-start-column":"18","trae-inspector-end-line":"545","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex flex-wrap gap-1.5",children:B.map((d,A)=>t.jsxs("button",{"trae-inspector-start-line":"532","trae-inspector-start-column":"22","trae-inspector-end-line":"543","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>l(p===d?null:d),className:f("px-2 py-0.5 text-[10px] font-mono rounded border transition-all",p===d?Ve(A):"text-gray-500 border-gray-700/50 hover:border-gray-600"),children:["#",d]},d))}),p&&t.jsx("button",{"trae-inspector-start-line":"547","trae-inspector-start-column":"20","trae-inspector-end-line":"552","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%B8%85%E9%99%A4%E6%A0%87%E7%AD%BE%E7%AD%9B%E9%80%89%22%2C%22textStartLine%22%3A%22550%22%2C%22textStartColumn%22%3A%2221%22%2C%22textEndLine%22%3A%22552%22%2C%22textEndColumn%22%3A%2220%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>l(null),className:"mt-2 text-[10px] font-mono text-purple-400 hover:text-purple-300",children:"清除标签筛选"})]})]})]})}),t.jsx("div",{"trae-inspector-start-line":"561","trae-inspector-start-column":"6","trae-inspector-end-line":"579","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 safe-area-bottom",children:t.jsx("div",{"trae-inspector-start-line":"562","trae-inspector-start-column":"8","trae-inspector-end-line":"578","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"max-w-md mx-auto space-y-2",children:I.length===0?t.jsxs("div",{"trae-inspector-start-line":"564","trae-inspector-start-column":"12","trae-inspector-end-line":"568","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-center py-16 text-gray-600",children:[t.jsx(Be,{className:"w-10 h-10 mx-auto mb-3 opacity-30"}),t.jsx("p",{"trae-inspector-start-line":"566","trae-inspector-start-column":"14","trae-inspector-end-line":"566","trae-inspector-end-column":"63","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9C%AA%E6%89%BE%E5%88%B0%E7%9B%B8%E5%85%B3%E7%9F%A5%E8%AF%86%22%2C%22textStartLine%22%3A%22566%22%2C%22textStartColumn%22%3A%2252%22%2C%22textEndLine%22%3A%22566%22%2C%22textEndColumn%22%3A%2259%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"font-mono text-sm mb-1",children:"未找到相关知识"}),t.jsx("p",{"trae-inspector-start-line":"567","trae-inspector-start-column":"14","trae-inspector-end-line":"567","trae-inspector-end-column":"74","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9B%B4%E6%8D%A2%E5%85%B3%E9%94%AE%E8%AF%8D%E6%88%96%E7%AD%9B%E9%80%89%E6%9D%A1%E4%BB%B6%E8%AF%95%E8%AF%95%22%2C%22textStartLine%22%3A%22567%22%2C%22textStartColumn%22%3A%2258%22%2C%22textEndLine%22%3A%22567%22%2C%22textEndColumn%22%3A%2270%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"font-mono text-xs opacity-60",children:"更换关键词或筛选条件试试"})]}):I.map(d=>t.jsx(Zs,{entry:d,onClick:()=>s(d.id)},d.id))})}),C&&t.jsx(ea,{entry:C,onBack:()=>s(null)})]})}const ra=[{id:"1",title:"完善多Agent协作系统",description:"继续优化多Agent协作流程，增加更多角色和部门，完善工作流引擎。",status:"in-progress",priority:"high",assignee:"tech-lead",department:"技术部",createdAt:Date.now()-864e5*2,dueDate:Date.now()+864e5*5,tags:["核心功能","Agent"],subtasks:[{id:"s1",title:"扩充角色到30人",done:!0},{id:"s2",title:"按部门分组展示",done:!0},{id:"s3",title:"完善工作流引擎",done:!1},{id:"s4",title:"增加任务管理系统",done:!0}],comments:[{id:"c1",author:"chairman",content:"这个是核心，一定要做好。",time:Date.now()-864e5}]},{id:"2",title:"知识库系统建设",description:"建立完善的知识库系统，支持分类、搜索、标签、自我学习沉淀。",status:"in-progress",priority:"high",assignee:"researcher",department:"研发部",createdAt:Date.now()-864e5*3,dueDate:Date.now()+864e5*7,tags:["知识库","学习"],subtasks:[{id:"s1",title:"知识库基础功能",done:!0},{id:"s2",title:"分类和标签系统",done:!0},{id:"s3",title:"搜索功能",done:!0},{id:"s4",title:"自我学习机制",done:!1}],comments:[]},{id:"3",title:"手机端UI优化",description:"优化手机端界面体验，确保滚动流畅、操作便捷、无bug。",status:"review",priority:"medium",assignee:"ux-designer",department:"设计部",createdAt:Date.now()-864e5,dueDate:Date.now()+864e5*3,tags:["UI","手机端"],subtasks:[{id:"s1",title:"底部Tab导航",done:!0},{id:"s2",title:"单栏布局",done:!0},{id:"s3",title:"滚动优化",done:!0},{id:"s4",title:"极客主题细节",done:!1}],comments:[]},{id:"4",title:"GitHub Pages部署自动化",description:"实现一键部署到GitHub Pages，支持历史记录和日志查看。",status:"done",priority:"medium",assignee:"devops",department:"运维部",createdAt:Date.now()-864e5*5,dueDate:Date.now()-864e5,tags:["部署","自动化"],subtasks:[{id:"s1",title:"部署配置界面",done:!0},{id:"s2",title:"一键部署功能",done:!0},{id:"s3",title:"部署日志",done:!0},{id:"s4",title:"历史记录",done:!0}],comments:[]},{id:"5",title:"项目发展路线图",description:"制定公司长期发展规划，分阶段实现目标。",status:"todo",priority:"low",assignee:"expander",department:"战略部",createdAt:Date.now(),dueDate:Date.now()+864e5*30,tags:["规划","战略"],subtasks:[{id:"s1",title:"第一阶段：基础搭建",done:!1},{id:"s2",title:"第二阶段：功能增强",done:!1},{id:"s3",title:"第三阶段：智能化",done:!1},{id:"s4",title:"第四阶段：生态扩展",done:!1},{id:"s5",title:"第五阶段：商业化",done:!1}],comments:[]}],Gt=re(e=>({tasks:ra,selectedTask:null,filterStatus:"all",filterPriority:"all",addTask:r=>e(a=>({tasks:[{...r,id:Date.now().toString(),createdAt:Date.now()},...a.tasks]})),updateTask:(r,a)=>e(s=>({tasks:s.tasks.map(o=>o.id===r?{...o,...a}:o)})),deleteTask:r=>e(a=>({tasks:a.tasks.filter(s=>s.id!==r)})),selectTask:r=>e({selectedTask:r}),setFilterStatus:r=>e({filterStatus:r}),setFilterPriority:r=>e({filterPriority:r}),toggleSubtask:(r,a)=>e(s=>({tasks:s.tasks.map(o=>o.id===r?{...o,subtasks:o.subtasks.map(n=>n.id===a?{...n,done:!n.done}:n)}:o)})),addComment:(r,a,s)=>e(o=>({tasks:o.tasks.map(n=>n.id===r?{...n,comments:[...n.comments,{id:Date.now().toString(),author:a,content:s,time:Date.now()}]}:n)}))})),te={all:{label:"全部",color:"text-gray-400",bg:"bg-gray-900/40",border:"border-gray-700/50",icon:he},todo:{label:"待办",color:"text-gray-400",bg:"bg-gray-900/40",border:"border-gray-700/50",icon:Ie},"in-progress":{label:"进行中",color:"text-blue-400",bg:"bg-blue-900/30",border:"border-blue-700/50",icon:Ie},review:{label:"审查中",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:At},done:{label:"已完成",color:"text-green-400",bg:"bg-green-900/30",border:"border-green-700/50",icon:Ue}},ye={low:{label:"低",color:"text-gray-500"},medium:{label:"中",color:"text-blue-400"},high:{label:"高",color:"text-orange-400"},urgent:{label:"紧急",color:"text-red-400"}};function sa({task:e,onClick:r}){const a=te[e.status]||te.todo,s=ye[e.priority]||ye.medium,{agents:o}=se(),n=o.find(l=>l.id===e.assignee),i=e.subtasks.filter(l=>l.done).length,c=e.subtasks.length,p=c>0?Math.round(i/c*100):0;return t.jsx("div",{"trae-inspector-start-line":"32","trae-inspector-start-column":"4","trae-inspector-end-line":"74","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:r,className:f("p-3.5 rounded-xl border transition-all active:scale-[0.98] cursor-pointer",a.bg,a.border),children:t.jsxs("div",{"trae-inspector-start-line":"39","trae-inspector-start-column":"6","trae-inspector-end-line":"73","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-start gap-3",children:[t.jsx("div",{"trae-inspector-start-line":"40","trae-inspector-start-column":"8","trae-inspector-end-line":"42","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("p-1.5 rounded-lg flex-shrink-0",a.bg,a.border),children:t.jsx(kt,{className:f("w-4 h-4",a.color)})}),t.jsxs("div",{"trae-inspector-start-line":"43","trae-inspector-start-column":"8","trae-inspector-end-line":"71","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 min-w-0",children:[t.jsxs("div",{"trae-inspector-start-line":"44","trae-inspector-start-column":"10","trae-inspector-end-line":"49","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-start justify-between gap-2 mb-1",children:[t.jsx("h3",{"trae-inspector-start-line":"45","trae-inspector-start-column":"12","trae-inspector-end-line":"45","trae-inspector-end-column":"102","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[13px] font-mono text-gray-100 font-medium truncate",children:e.title}),t.jsx("span",{"trae-inspector-start-line":"46","trae-inspector-start-column":"12","trae-inspector-end-line":"48","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-[10px] font-mono flex-shrink-0",s.color),children:s.label})]}),t.jsx("p",{"trae-inspector-start-line":"50","trae-inspector-start-column":"10","trae-inspector-end-line":"50","trae-inspector-end-column":"91","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] text-gray-500 line-clamp-2 mb-2",children:e.description}),t.jsxs("div",{"trae-inspector-start-line":"51","trae-inspector-start-column":"10","trae-inspector-end-line":"62","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between",children:[t.jsxs("div",{"trae-inspector-start-line":"52","trae-inspector-start-column":"12","trae-inspector-end-line":"57","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2",children:[t.jsx("span",{"trae-inspector-start-line":"53","trae-inspector-start-column":"14","trae-inspector-end-line":"53","trae-inspector-end-column":"82","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-500",children:e.department}),n&&t.jsxs("span",{"trae-inspector-start-line":"55","trae-inspector-start-column":"16","trae-inspector-end-line":"55","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-400",children:["· ",n.name]})]}),t.jsxs("div",{"trae-inspector-start-line":"58","trae-inspector-start-column":"12","trae-inspector-end-line":"61","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-1",children:[t.jsx(Ue,{className:"w-3 h-3 text-green-500"}),t.jsxs("span",{"trae-inspector-start-line":"60","trae-inspector-start-column":"14","trae-inspector-end-line":"60","trae-inspector-end-column":"105","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-500 font-mono",children:[i,"/",c]})]})]}),c>0&&t.jsx("div",{"trae-inspector-start-line":"64","trae-inspector-start-column":"12","trae-inspector-end-line":"69","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"mt-2 h-1 bg-gray-800 rounded-full overflow-hidden",children:t.jsx("div",{"trae-inspector-start-line":"65","trae-inspector-start-column":"14","trae-inspector-end-line":"68","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("h-full transition-all",e.status==="done"?"bg-green-500":"bg-blue-500"),style:{width:`${p}%`}})})]}),t.jsx(Oe,{className:"w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5"})]})})}function aa({task:e,onClose:r}){const{toggleSubtask:a,addComment:s}=Gt(),{agents:o}=se(),[n,i]=R.useState(""),c=o.find(u=>u.id===e.assignee),p=te[e.status]||te.todo,l=ye[e.priority]||ye.medium,m=e.subtasks.filter(u=>u.done).length,x=e.subtasks.length>0?Math.round(m/e.subtasks.length*100):0,y=()=>{n.trim()&&(s(e.id,"chairman",n.trim()),i(""))};return t.jsx("div",{"trae-inspector-start-line":"95","trae-inspector-start-column":"4","trae-inspector-end-line":"255","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm",onClick:r,children:t.jsxs("div",{"trae-inspector-start-line":"96","trae-inspector-start-column":"6","trae-inspector-end-line":"254","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-full max-w-md bg-gray-950 border-t border-green-900/40 rounded-t-2xl max-h-[85vh] flex flex-col",onClick:u=>u.stopPropagation(),children:[t.jsx("div",{"trae-inspector-start-line":"101","trae-inspector-start-column":"8","trae-inspector-end-line":"103","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 flex justify-center py-2",children:t.jsx("div",{"trae-inspector-start-line":"102","trae-inspector-start-column":"10","trae-inspector-end-line":"102","trae-inspector-end-column":"63","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-10 h-1 bg-gray-700 rounded-full"})}),t.jsxs("div",{"trae-inspector-start-line":"106","trae-inspector-start-column":"8","trae-inspector-end-line":"122","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 px-4 pb-3 border-b border-gray-800",children:[t.jsxs("div",{"trae-inspector-start-line":"107","trae-inspector-start-column":"10","trae-inspector-end-line":"112","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-start justify-between mb-2",children:[t.jsx("h2",{"trae-inspector-start-line":"108","trae-inspector-start-column":"12","trae-inspector-end-line":"108","trae-inspector-end-column":"102","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-base font-mono text-green-400 font-bold flex-1 pr-2",children:e.title}),t.jsx("button",{"trae-inspector-start-line":"109","trae-inspector-start-column":"12","trae-inspector-end-line":"111","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:r,className:"p-1 rounded-lg hover:bg-gray-800",children:t.jsx(wt,{className:"w-5 h-5 text-gray-500"})})]}),t.jsxs("div",{"trae-inspector-start-line":"113","trae-inspector-start-column":"10","trae-inspector-end-line":"121","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-3 flex-wrap",children:[t.jsx("span",{"trae-inspector-start-line":"114","trae-inspector-start-column":"12","trae-inspector-end-line":"116","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("px-2 py-0.5 rounded-md text-[10px] font-mono",p.bg,p.border,p.color),children:p.label}),t.jsxs("span",{"trae-inspector-start-line":"117","trae-inspector-start-column":"12","trae-inspector-end-line":"120","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-[10px] font-mono flex items-center gap-1",l.color),children:[t.jsx(kt,{className:"w-3 h-3"}),l.label,"优先级"]})]})]}),t.jsxs("div",{"trae-inspector-start-line":"125","trae-inspector-start-column":"8","trae-inspector-end-line":"253","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 overflow-y-auto p-4 space-y-4",children:[t.jsxs("div",{"trae-inspector-start-line":"127","trae-inspector-start-column":"10","trae-inspector-end-line":"130","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("h4",{"trae-inspector-start-line":"128","trae-inspector-start-column":"12","trae-inspector-end-line":"128","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BB%BB%E5%8A%A1%E6%8F%8F%E8%BF%B0%22%2C%22textStartLine%22%3A%22128%22%2C%22textStartColumn%22%3A%2271%22%2C%22textEndLine%22%3A%22128%22%2C%22textEndColumn%22%3A%2275%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-500 mb-1.5",children:"任务描述"}),t.jsx("p",{"trae-inspector-start-line":"129","trae-inspector-start-column":"12","trae-inspector-end-line":"129","trae-inspector-end-column":"91","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[12px] text-gray-300 leading-relaxed",children:e.description})]}),t.jsxs("div",{"trae-inspector-start-line":"133","trae-inspector-start-column":"10","trae-inspector-end-line":"142","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"grid grid-cols-2 gap-2",children:[t.jsxs("div",{"trae-inspector-start-line":"134","trae-inspector-start-column":"12","trae-inspector-end-line":"137","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[t.jsx("div",{"trae-inspector-start-line":"135","trae-inspector-start-column":"14","trae-inspector-end-line":"135","trae-inspector-end-column":"72","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%B4%9F%E8%B4%A3%E9%83%A8%E9%97%A8%22%2C%22textStartLine%22%3A%22135%22%2C%22textStartColumn%22%3A%2262%22%2C%22textEndLine%22%3A%22135%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-500 mb-1",children:"负责部门"}),t.jsx("div",{"trae-inspector-start-line":"136","trae-inspector-start-column":"14","trae-inspector-end-line":"136","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[12px] text-gray-300",children:e.department})]}),t.jsxs("div",{"trae-inspector-start-line":"138","trae-inspector-start-column":"12","trae-inspector-end-line":"141","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[t.jsx("div",{"trae-inspector-start-line":"139","trae-inspector-start-column":"14","trae-inspector-end-line":"139","trae-inspector-end-column":"71","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%B4%9F%E8%B4%A3%E4%BA%BA%22%2C%22textStartLine%22%3A%22139%22%2C%22textStartColumn%22%3A%2262%22%2C%22textEndLine%22%3A%22139%22%2C%22textEndColumn%22%3A%2265%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-500 mb-1",children:"负责人"}),t.jsx("div",{"trae-inspector-start-line":"140","trae-inspector-start-column":"14","trae-inspector-end-line":"140","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[12px] text-gray-300",children:(c==null?void 0:c.name)||"未分配"})]})]}),e.subtasks.length>0&&t.jsxs("div",{"trae-inspector-start-line":"146","trae-inspector-start-column":"12","trae-inspector-end-line":"182","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsxs("div",{"trae-inspector-start-line":"147","trae-inspector-start-column":"14","trae-inspector-end-line":"150","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between mb-2",children:[t.jsx("h4",{"trae-inspector-start-line":"148","trae-inspector-start-column":"16","trae-inspector-end-line":"148","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%AD%90%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22148%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22148%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-500",children:"子任务"}),t.jsxs("span",{"trae-inspector-start-line":"149","trae-inspector-start-column":"16","trae-inspector-end-line":"149","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] text-gray-500 font-mono",children:[x,"%"]})]}),t.jsx("div",{"trae-inspector-start-line":"151","trae-inspector-start-column":"14","trae-inspector-end-line":"156","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2",children:t.jsx("div",{"trae-inspector-start-line":"152","trae-inspector-start-column":"16","trae-inspector-end-line":"155","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("h-full transition-all",e.status==="done"?"bg-green-500":"bg-blue-500"),style:{width:`${x}%`}})}),t.jsx("div",{"trae-inspector-start-line":"157","trae-inspector-start-column":"14","trae-inspector-end-line":"181","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"space-y-1.5",children:e.subtasks.map(u=>t.jsxs("button",{"trae-inspector-start-line":"159","trae-inspector-start-column":"18","trae-inspector-end-line":"179","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>a(e.id,u.id),className:f("w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all",u.done?"bg-green-900/20 border border-green-800/30":"bg-gray-900/50 border border-gray-800"),children:[t.jsx("div",{"trae-inspector-start-line":"167","trae-inspector-start-column":"20","trae-inspector-end-line":"172","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",u.done?"bg-green-500 border-green-500":"border-gray-600"),children:u.done&&t.jsx(Ue,{className:"w-3 h-3 text-white"})}),t.jsx("span",{"trae-inspector-start-line":"173","trae-inspector-start-column":"20","trae-inspector-end-line":"178","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-[12px] flex-1",u.done?"text-gray-500 line-through":"text-gray-300"),children:u.title})]},u.id))})]}),e.tags.length>0&&t.jsxs("div",{"trae-inspector-start-line":"187","trae-inspector-start-column":"12","trae-inspector-end-line":"199","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("h4",{"trae-inspector-start-line":"188","trae-inspector-start-column":"14","trae-inspector-end-line":"188","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%A0%87%E7%AD%BE%22%2C%22textStartLine%22%3A%22188%22%2C%22textStartColumn%22%3A%2271%22%2C%22textEndLine%22%3A%22188%22%2C%22textEndColumn%22%3A%2273%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-500 mb-2",children:"标签"}),t.jsx("div",{"trae-inspector-start-line":"189","trae-inspector-start-column":"14","trae-inspector-end-line":"198","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex flex-wrap gap-1.5",children:e.tags.map(u=>t.jsxs("span",{"trae-inspector-start-line":"191","trae-inspector-start-column":"18","trae-inspector-end-line":"196","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"px-2 py-0.5 rounded-md bg-gray-800/60 border border-gray-700/50 text-[10px] text-gray-400 font-mono",children:["#",u]},u))})]}),t.jsxs("div",{"trae-inspector-start-line":"203","trae-inspector-start-column":"10","trae-inspector-end-line":"252","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsxs("h4",{"trae-inspector-start-line":"204","trae-inspector-start-column":"12","trae-inspector-end-line":"207","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-gray-500 mb-2 flex items-center gap-1.5",children:[t.jsx(_t,{className:"w-3.5 h-3.5"}),"评论 (",e.comments.length,")"]}),e.comments.length>0?t.jsx("div",{"trae-inspector-start-line":"209","trae-inspector-start-column":"14","trae-inspector-end-line":"226","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"space-y-2 mb-3",children:e.comments.map(u=>{const v=o.find(_=>_.id===u.author);return t.jsxs("div",{"trae-inspector-start-line":"213","trae-inspector-start-column":"20","trae-inspector-end-line":"223","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[t.jsxs("div",{"trae-inspector-start-line":"214","trae-inspector-start-column":"22","trae-inspector-end-line":"221","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between mb-1",children:[t.jsx("span",{"trae-inspector-start-line":"215","trae-inspector-start-column":"24","trae-inspector-end-line":"217","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] font-mono text-green-400",children:(v==null?void 0:v.name)||u.author}),t.jsx("span",{"trae-inspector-start-line":"218","trae-inspector-start-column":"24","trae-inspector-end-line":"220","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[9px] text-gray-600 font-mono",children:new Date(u.time).toLocaleString("zh-CN")})]}),t.jsx("p",{"trae-inspector-start-line":"222","trae-inspector-start-column":"22","trae-inspector-end-line":"222","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] text-gray-300",children:u.content})]},u.id)})}):t.jsx("p",{"trae-inspector-start-line":"228","trae-inspector-start-column":"14","trae-inspector-end-line":"228","trae-inspector-end-column":"68","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9A%82%E6%97%A0%E8%AF%84%E8%AE%BA%22%2C%22textStartLine%22%3A%22228%22%2C%22textStartColumn%22%3A%2260%22%2C%22textEndLine%22%3A%22228%22%2C%22textEndColumn%22%3A%2264%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] text-gray-600 mb-3",children:"暂无评论"}),t.jsxs("div",{"trae-inspector-start-line":"230","trae-inspector-start-column":"12","trae-inspector-end-line":"251","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex gap-2",children:[t.jsx("input",{"trae-inspector-start-line":"231","trae-inspector-start-column":"14","trae-inspector-end-line":"238","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",type:"text",value:n,onChange:u=>i(u.target.value),onKeyDown:u=>u.key==="Enter"&&y(),placeholder:"添加评论...",className:"flex-1 px-3 py-2 rounded-xl bg-gray-900/80 border border-gray-800 text-[12px] text-gray-200 placeholder-gray-600 outline-none focus:border-green-700/50 transition-colors"}),t.jsx("button",{"trae-inspector-start-line":"239","trae-inspector-start-column":"14","trae-inspector-end-line":"250","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%8F%91%E9%80%81%22%2C%22textStartLine%22%3A%22248%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22250%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:y,disabled:!n.trim(),className:f("px-3 py-2 rounded-xl text-[11px] font-mono transition-all",n.trim()?"bg-green-600 text-white hover:bg-green-500":"bg-gray-800 text-gray-600"),children:"发送"})]})]})]})]})})}function na(){const{tasks:e,selectedTask:r,selectTask:a,filterStatus:s,setFilterStatus:o}=Gt(),[n,i]=R.useState(!1),c=e.filter(m=>!(s!=="all"&&m.status!==s)),p=e.find(m=>m.id===r),l=["all","todo","in-progress","review","done"];return t.jsxs("div",{"trae-inspector-start-line":"273","trae-inspector-start-column":"4","trae-inspector-end-line":"348","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"min-h-full flex flex-col pb-20",children:[t.jsxs("div",{"trae-inspector-start-line":"275","trae-inspector-start-column":"6","trae-inspector-end-line":"323","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 pt-3 pb-1",children:[t.jsxs("div",{"trae-inspector-start-line":"276","trae-inspector-start-column":"8","trae-inspector-end-line":"294","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between mb-3",children:[t.jsxs("div",{"trae-inspector-start-line":"277","trae-inspector-start-column":"10","trae-inspector-end-line":"287","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-2",children:[t.jsx("div",{"trae-inspector-start-line":"278","trae-inspector-start-column":"12","trae-inspector-end-line":"280","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-8 h-8 rounded-lg bg-orange-900/30 border border-orange-700/50 flex items-center justify-center",children:t.jsx(he,{className:"w-4.5 h-4.5 text-orange-400"})}),t.jsxs("div",{"trae-inspector-start-line":"281","trae-inspector-start-column":"12","trae-inspector-end-line":"286","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("h1",{"trae-inspector-start-line":"282","trae-inspector-start-column":"14","trae-inspector-end-line":"284","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BB%BB%E5%8A%A1%E4%B8%AD%E5%BF%83%22%2C%22textStartLine%22%3A%22282%22%2C%22textStartColumn%22%3A%22129%22%2C%22textEndLine%22%3A%22284%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono font-bold text-orange-400",style:{textShadow:"0 0 8px rgba(251,146,60,0.5)"},children:"任务中心"}),t.jsx("p",{"trae-inspector-start-line":"285","trae-inspector-start-column":"14","trae-inspector-end-line":"285","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%20%C2%B7%20%E8%BF%9B%E5%BA%A6%E8%BF%BD%E8%B8%AA%22%2C%22textStartLine%22%3A%22285%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22285%22%2C%22textEndColumn%22%3A%2283%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[9px] font-mono text-gray-500 -mt-0.5",children:"项目管理 · 进度追踪"})]})]}),t.jsx("button",{"trae-inspector-start-line":"288","trae-inspector-start-column":"10","trae-inspector-end-line":"293","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>i(!0),className:"p-2 rounded-lg bg-orange-900/30 border border-orange-700/50 hover:bg-orange-900/50 transition-all",children:t.jsx(wr,{className:"w-4 h-4 text-orange-400"})})]}),t.jsx("div",{"trae-inspector-start-line":"297","trae-inspector-start-column":"8","trae-inspector-end-line":"322","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1",children:l.map(m=>{const x=te[m],y=m==="all"?e.length:e.filter(u=>u.status===m).length;return t.jsxs("button",{"trae-inspector-start-line":"302","trae-inspector-start-column":"14","trae-inspector-end-line":"319","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>o(m),className:f("flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5",s===m?f(x.bg,x.border,x.color,"border"):"text-gray-500 hover:text-gray-300"),children:[x.label,t.jsx("span",{"trae-inspector-start-line":"313","trae-inspector-start-column":"16","trae-inspector-end-line":"318","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("px-1.5 py-0.5 rounded text-[9px]",s===m?"bg-black/20":"bg-gray-800/60"),children:y})]},m)})})]}),t.jsx("div",{"trae-inspector-start-line":"326","trae-inspector-start-column":"6","trae-inspector-end-line":"342","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 p-3 space-y-2.5 max-w-md mx-auto w-full",children:c.length===0?t.jsxs("div",{"trae-inspector-start-line":"328","trae-inspector-start-column":"10","trae-inspector-end-line":"332","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-full flex flex-col items-center justify-center py-20 text-center",children:[t.jsx(he,{className:"w-12 h-12 text-gray-700 mb-3"}),t.jsx("p",{"trae-inspector-start-line":"330","trae-inspector-start-column":"12","trae-inspector-end-line":"330","trae-inspector-end-column":"61","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9A%82%E6%97%A0%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22330%22%2C%22textStartColumn%22%3A%2253%22%2C%22textEndLine%22%3A%22330%22%2C%22textEndColumn%22%3A%2257%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[13px] text-gray-500",children:"暂无任务"}),t.jsx("p",{"trae-inspector-start-line":"331","trae-inspector-start-column":"12","trae-inspector-end-line":"331","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%82%B9%E5%87%BB%E5%8F%B3%E4%B8%8A%E8%A7%92%20%2B%20%E5%88%9B%E5%BB%BA%E6%96%B0%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22331%22%2C%22textStartColumn%22%3A%2258%22%2C%22textEndLine%22%3A%22331%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[11px] text-gray-600 mt-1",children:"点击右上角 + 创建新任务"})]}):c.map(m=>t.jsx(sa,{task:m,onClick:()=>a(m.id)},m.id))}),p&&t.jsx(aa,{task:p,onClose:()=>a(null)})]})}const oa=[{id:"cyber",name:"赛博朋克",icon:yt,color:"text-green-400 border-green-500/50 bg-green-500/10",glow:"shadow-[0_0_20px_rgba(34,197,94,0.4)]"},{id:"matrix",name:"矩阵雨",icon:Ar,color:"text-cyan-400 border-cyan-500/50 bg-cyan-500/10",glow:"shadow-[0_0_20px_rgba(34,211,238,0.4)]"},{id:"retro",name:"复古像素",icon:kr,color:"text-yellow-400 border-yellow-500/50 bg-yellow-500/10",glow:"shadow-[0_0_20px_rgba(234,179,8,0.4)]"}],Ce=[{id:"analyst",name:"分析员",role:"ANALYST",defaultSpeed:50,defaultDetail:70},{id:"coder1",name:"代码员1",role:"CODER-01",defaultSpeed:60,defaultDetail:80},{id:"coder2",name:"代码员2",role:"CODER-02",defaultSpeed:55,defaultDetail:75},{id:"inspector",name:"检查员",role:"INSPECTOR",defaultSpeed:40,defaultDetail:90},{id:"deployer",name:"部署员",role:"DEPLOYER",defaultSpeed:70,defaultDetail:60}];function ae({icon:e,title:r,description:a,children:s}){return t.jsxs("div",{"trae-inspector-start-line":"65","trae-inspector-start-column":"4","trae-inspector-end-line":"83","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"bg-gray-950/80 border border-green-900/30 rounded-lg backdrop-blur-sm overflow-hidden",children:[t.jsxs("div",{"trae-inspector-start-line":"66","trae-inspector-start-column":"6","trae-inspector-end-line":"79","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-4 border-b border-green-900/30 flex items-center gap-3",children:[t.jsx("div",{"trae-inspector-start-line":"67","trae-inspector-start-column":"8","trae-inspector-end-line":"69","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-2 bg-green-900/30 rounded-lg border border-green-700/50",children:t.jsx(e,{className:"w-5 h-5 text-green-400",style:{filter:"drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))"}})}),t.jsxs("div",{"trae-inspector-start-line":"70","trae-inspector-start-column":"8","trae-inspector-end-line":"78","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("h2",{"trae-inspector-start-line":"71","trae-inspector-start-column":"10","trae-inspector-end-line":"76","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-green-400 font-mono text-sm tracking-widest",style:{textShadow:"0 0 10px rgba(34, 197, 94, 0.5)"},children:r}),t.jsx("p",{"trae-inspector-start-line":"77","trae-inspector-start-column":"10","trae-inspector-end-line":"77","trae-inspector-end-column":"74","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs text-gray-500 font-mono",children:a})]})]}),t.jsx("div",{"trae-inspector-start-line":"80","trae-inspector-start-column":"6","trae-inspector-end-line":"82","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-4",children:s})]})}function Pe({enabled:e,onChange:r,label:a,description:s}){return t.jsxs("div",{"trae-inspector-start-line":"96","trae-inspector-start-column":"4","trae-inspector-end-line":"123","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between py-3",children:[t.jsxs("div",{"trae-inspector-start-line":"97","trae-inspector-start-column":"6","trae-inspector-end-line":"102","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("p",{"trae-inspector-start-line":"98","trae-inspector-start-column":"8","trae-inspector-end-line":"98","trae-inspector-end-column":"66","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-gray-300",children:a}),s&&t.jsx("p",{"trae-inspector-start-line":"100","trae-inspector-start-column":"10","trae-inspector-end-line":"100","trae-inspector-end-column":"81","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs font-mono text-gray-500 mt-0.5",children:s})]}),t.jsx("button",{"trae-inspector-start-line":"103","trae-inspector-start-column":"6","trae-inspector-end-line":"122","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>r(!e),className:f("relative w-14 h-7 rounded-full transition-all duration-300","border",e?"bg-green-500/20 border-green-500/70":"bg-gray-800/50 border-gray-700/50"),style:e?{boxShadow:"0 0 15px rgba(34, 197, 94, 0.3)"}:void 0,children:t.jsx("div",{"trae-inspector-start-line":"114","trae-inspector-start-column":"8","trae-inspector-end-line":"121","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("absolute top-1 w-5 h-5 rounded-full transition-all duration-300",e?"left-8 bg-green-400":"left-1 bg-gray-600"),style:e?{boxShadow:"0 0 10px rgba(34, 197, 94, 0.8)"}:void 0})})]})}function Me({value:e,onChange:r,label:a,min:s=0,max:o=100,step:n=1,unit:i="%",ticks:c}){return t.jsxs("div",{"trae-inspector-start-line":"140","trae-inspector-start-column":"4","trae-inspector-end-line":"168","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"py-3",children:[t.jsxs("div",{"trae-inspector-start-line":"141","trae-inspector-start-column":"6","trae-inspector-end-line":"146","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between mb-2",children:[t.jsx("p",{"trae-inspector-start-line":"142","trae-inspector-start-column":"8","trae-inspector-end-line":"142","trae-inspector-end-column":"66","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-gray-300",children:a}),t.jsxs("span",{"trae-inspector-start-line":"143","trae-inspector-start-column":"8","trae-inspector-end-line":"145","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-green-400",style:{textShadow:"0 0 5px rgba(34, 197, 94, 0.5)"},children:[e,i]})]}),t.jsxs("div",{"trae-inspector-start-line":"147","trae-inspector-start-column":"6","trae-inspector-end-line":"167","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"relative",children:[t.jsx("input",{"trae-inspector-start-line":"148","trae-inspector-start-column":"8","trae-inspector-end-line":"156","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",type:"range",min:s,max:o,step:n,value:e,onChange:p=>r(Number(p.target.value)),className:"w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer slider-green"}),c&&t.jsx("div",{"trae-inspector-start-line":"158","trae-inspector-start-column":"10","trae-inspector-end-line":"165","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex justify-between px-1 mt-1",children:c.map(p=>t.jsxs("div",{"trae-inspector-start-line":"160","trae-inspector-start-column":"14","trae-inspector-end-line":"163","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex flex-col items-center",children:[t.jsx("div",{"trae-inspector-start-line":"161","trae-inspector-start-column":"16","trae-inspector-end-line":"161","trae-inspector-end-column":"58","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"w-px h-1.5 bg-gray-700"}),t.jsxs("span",{"trae-inspector-start-line":"162","trae-inspector-start-column":"16","trae-inspector-end-line":"162","trae-inspector-end-column":"95","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[9px] font-mono text-gray-600 mt-0.5",children:[p,i]})]},p))})]})]})}function ia(){const{theme:e,setTheme:r}=we();return t.jsx(ae,{icon:Re,title:"主题设置",description:"选择你喜欢的界面主题风格",children:t.jsx("div",{"trae-inspector-start-line":"177","trae-inspector-start-column":"6","trae-inspector-end-line":"200","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"grid grid-cols-3 gap-3",children:oa.map(a=>{const s=a.icon,o=e===a.id;return t.jsxs("button",{"trae-inspector-start-line":"182","trae-inspector-start-column":"12","trae-inspector-end-line":"197","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>r(a.id),className:f("relative p-4 rounded-lg border transition-all duration-300 flex flex-col items-center gap-2",o?a.color+" "+a.glow:"bg-gray-900/60 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-400"),children:[t.jsx(s,{className:"w-6 h-6"}),t.jsx("span",{"trae-inspector-start-line":"193","trae-inspector-start-column":"14","trae-inspector-end-line":"193","trae-inspector-end-column":"70","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs font-mono",children:a.name}),o&&t.jsx("div",{"trae-inspector-start-line":"195","trae-inspector-start-column":"16","trae-inspector-end-line":"195","trae-inspector-end-column":"119","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_#22c55e]"})]},a.id)})})})}function ca(){const{fontSize:e,setFontSize:r,animationsEnabled:a,toggleAnimations:s}=we();return t.jsxs(ae,{icon:_r,title:"外观设置",description:"调整字体大小和动画效果",children:[t.jsx(Me,{value:e,onChange:r,label:"字体大小",min:12,max:20,step:1,unit:"px",ticks:[12,14,16,18,20]}),t.jsx("div",{"trae-inspector-start-line":"221","trae-inspector-start-column":"6","trae-inspector-end-line":"221","trae-inspector-end-column":"47","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-px bg-gray-800 my-2"}),t.jsx(Pe,{enabled:a,onChange:s,label:"动画效果",description:"启用/禁用界面动画和过渡效果"})]})}function la(){const[e,r]=R.useState(Object.fromEntries(Ce.map(i=>[i.id,i.defaultSpeed]))),[a,s]=R.useState(Object.fromEntries(Ce.map(i=>[i.id,i.defaultDetail]))),[o,n]=R.useState(null);return t.jsx(ae,{icon:Ne,title:"Agent 配置",description:"调整各 Agent 的行为参数",children:t.jsx("div",{"trae-inspector-start-line":"244","trae-inspector-start-column":"6","trae-inspector-end-line":"295","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"space-y-2",children:Ce.map(i=>{const c=o===i.id;return t.jsxs("div",{"trae-inspector-start-line":"248","trae-inspector-start-column":"12","trae-inspector-end-line":"292","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("rounded-lg border transition-all duration-300 overflow-hidden",c?"border-green-700/50 bg-green-900/10":"border-gray-800 bg-gray-900/40 hover:border-gray-700"),children:[t.jsxs("button",{"trae-inspector-start-line":"257","trae-inspector-start-column":"14","trae-inspector-end-line":"274","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>n(c?null:i.id),className:"w-full p-3 flex items-center justify-between",children:[t.jsxs("div",{"trae-inspector-start-line":"261","trae-inspector-start-column":"16","trae-inspector-end-line":"269","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center gap-3",children:[t.jsx("div",{"trae-inspector-start-line":"262","trae-inspector-start-column":"18","trae-inspector-end-line":"264","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-1.5 bg-gray-800 rounded border border-gray-700",children:t.jsx(Ne,{className:"w-4 h-4 text-green-400"})}),t.jsxs("div",{"trae-inspector-start-line":"265","trae-inspector-start-column":"18","trae-inspector-end-line":"268","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-left",children:[t.jsx("p",{"trae-inspector-start-line":"266","trae-inspector-start-column":"20","trae-inspector-end-line":"266","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-gray-300",children:i.name}),t.jsx("p",{"trae-inspector-start-line":"267","trae-inspector-start-column":"20","trae-inspector-end-line":"267","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] font-mono text-gray-600",children:i.role})]})]}),t.jsx(Oe,{className:f("w-4 h-4 text-gray-500 transition-transform duration-300",c&&"rotate-90 text-green-400")})]}),c&&t.jsxs("div",{"trae-inspector-start-line":"277","trae-inspector-start-column":"16","trae-inspector-end-line":"290","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"px-3 pb-3 border-t border-green-900/20",children:[t.jsx(Me,{value:e[i.id],onChange:p=>r(l=>({...l,[i.id]:p})),label:"响应速度",ticks:[0,25,50,75,100]}),t.jsx(Me,{value:a[i.id],onChange:p=>s(l=>({...l,[i.id]:p})),label:"详细程度",ticks:[0,25,50,75,100]})]})]},i.id)})})})}function pa(){const{selfLearning:e,autoKnowledge:r,workflowSpeed:a,toggleSelfLearning:s,toggleAutoKnowledge:o,setWorkflowSpeed:n}=we();return t.jsx(ae,{icon:ft,title:"自我学习",description:"知识沉淀与自动学习配置",children:t.jsxs("div",{"trae-inspector-start-line":"305","trae-inspector-start-column":"6","trae-inspector-end-line":"341","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"space-y-1",children:[t.jsx(Pe,{enabled:e,onChange:s,label:"自我学习",description:"任务完成后自动总结经验并学习"}),t.jsx(Pe,{enabled:r,onChange:o,label:"自动知识沉淀",description:"自动将任务经验存入知识库"}),t.jsxs("div",{"trae-inspector-start-line":"318","trae-inspector-start-column":"8","trae-inspector-end-line":"340","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"py-3",children:[t.jsxs("div",{"trae-inspector-start-line":"319","trae-inspector-start-column":"10","trae-inspector-end-line":"325","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-between mb-2",children:[t.jsxs("div",{"trae-inspector-start-line":"320","trae-inspector-start-column":"12","trae-inspector-end-line":"323","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("p",{"trae-inspector-start-line":"321","trae-inspector-start-column":"14","trae-inspector-end-line":"321","trae-inspector-end-column":"70","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E9%80%9F%E5%BA%A6%22%2C%22textStartLine%22%3A%22321%22%2C%22textStartColumn%22%3A%2261%22%2C%22textEndLine%22%3A%22321%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-gray-300",children:"工作流速度"}),t.jsx("p",{"trae-inspector-start-line":"322","trae-inspector-start-column":"14","trae-inspector-end-line":"322","trae-inspector-end-column":"85","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%B0%83%E6%95%B4Agent%E5%8D%8F%E4%BD%9C%E6%89%A7%E8%A1%8C%E9%80%9F%E5%BA%A6%22%2C%22textStartLine%22%3A%22322%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22322%22%2C%22textEndColumn%22%3A%2281%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs font-mono text-gray-500 mt-0.5",children:"调整Agent协作执行速度"})]}),t.jsxs("span",{"trae-inspector-start-line":"324","trae-inspector-start-column":"12","trae-inspector-end-line":"324","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-green-400",children:[a,"x"]})]}),t.jsx("input",{"trae-inspector-start-line":"326","trae-inspector-start-column":"10","trae-inspector-end-line":"334","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",type:"range",min:"0.5",max:"5",step:"0.5",value:a,onChange:i=>n(parseFloat(i.target.value)),className:"w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"}),t.jsxs("div",{"trae-inspector-start-line":"335","trae-inspector-start-column":"10","trae-inspector-end-line":"339","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex justify-between text-[10px] font-mono text-gray-600 mt-1",children:[t.jsx("span",{"trae-inspector-start-line":"336","trae-inspector-start-column":"12","trae-inspector-end-line":"336","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%220.5x%22%2C%22textStartLine%22%3A%22336%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22336%22%2C%22textEndColumn%22%3A%2222%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",children:"0.5x"}),t.jsx("span",{"trae-inspector-start-line":"337","trae-inspector-start-column":"12","trae-inspector-end-line":"337","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AD%A3%E5%B8%B8%22%2C%22textStartLine%22%3A%22337%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22337%22%2C%22textEndColumn%22%3A%2220%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",children:"正常"}),t.jsx("span",{"trae-inspector-start-line":"338","trae-inspector-start-column":"12","trae-inspector-end-line":"338","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%225x%22%2C%22textStartLine%22%3A%22338%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22338%22%2C%22textEndColumn%22%3A%2220%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",children:"5x"})]})]})]})})}function da(){const[e,r]=R.useState(!1),a=()=>{const n={exportedAt:new Date().toISOString(),version:"1.0.0"},i=new Blob([JSON.stringify(n,null,2)],{type:"application/json"}),c=URL.createObjectURL(i),p=document.createElement("a");p.href=c,p.download=`settings-backup-${Date.now()}.json`,p.click(),URL.revokeObjectURL(c)},s=()=>{const n=document.createElement("input");n.type="file",n.accept=".json",n.onchange=i=>{var p;const c=(p=i.target.files)==null?void 0:p[0];if(c){const l=new FileReader;l.onload=m=>{var x;try{JSON.parse((x=m.target)==null?void 0:x.result),alert("导入成功！")}catch{alert("文件格式错误")}},l.readAsText(c)}},n.click()},o=()=>{r(!1),alert("数据已清空")};return t.jsx(ae,{icon:Er,title:"数据管理",description:"导出、导入或清空应用数据",children:t.jsxs("div",{"trae-inspector-start-line":"392","trae-inspector-start-column":"6","trae-inspector-end-line":"445","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"space-y-3",children:[t.jsxs("div",{"trae-inspector-start-line":"393","trae-inspector-start-column":"8","trae-inspector-end-line":"408","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex gap-3",children:[t.jsxs("button",{"trae-inspector-start-line":"394","trae-inspector-start-column":"10","trae-inspector-end-line":"400","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:a,className:"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blue-700/50 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 transition-all duration-200",children:[t.jsx(Tr,{className:"w-4 h-4"}),t.jsx("span",{"trae-inspector-start-line":"399","trae-inspector-start-column":"12","trae-inspector-end-line":"399","trae-inspector-end-column":"59","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%AF%BC%E5%87%BA%E6%95%B0%E6%8D%AE%22%2C%22textStartLine%22%3A%22399%22%2C%22textStartColumn%22%3A%2248%22%2C%22textEndLine%22%3A%22399%22%2C%22textEndColumn%22%3A%2252%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs font-mono",children:"导出数据"})]}),t.jsxs("button",{"trae-inspector-start-line":"401","trae-inspector-start-column":"10","trae-inspector-end-line":"407","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:s,className:"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-700/50 bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 transition-all duration-200",children:[t.jsx(vr,{className:"w-4 h-4"}),t.jsx("span",{"trae-inspector-start-line":"406","trae-inspector-start-column":"12","trae-inspector-end-line":"406","trae-inspector-end-column":"59","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE%22%2C%22textStartLine%22%3A%22406%22%2C%22textStartColumn%22%3A%2248%22%2C%22textEndLine%22%3A%22406%22%2C%22textEndColumn%22%3A%2252%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs font-mono",children:"导入数据"})]})]}),t.jsx("div",{"trae-inspector-start-line":"410","trae-inspector-start-column":"8","trae-inspector-end-line":"410","trae-inspector-end-column":"44","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-px bg-gray-800"}),e?t.jsxs("div",{"trae-inspector-start-line":"413","trae-inspector-start-column":"10","trae-inspector-end-line":"435","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"p-3 rounded-lg border border-red-700/50 bg-red-900/20",children:[t.jsxs("div",{"trae-inspector-start-line":"414","trae-inspector-start-column":"12","trae-inspector-end-line":"420","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-start gap-2 mb-3",children:[t.jsx(At,{className:"w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"}),t.jsxs("div",{"trae-inspector-start-line":"416","trae-inspector-start-column":"14","trae-inspector-end-line":"419","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:[t.jsx("p",{"trae-inspector-start-line":"417","trae-inspector-start-column":"16","trae-inspector-end-line":"417","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%A1%AE%E8%AE%A4%E6%B8%85%E7%A9%BA%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE%EF%BC%9F%22%2C%22textStartLine%22%3A%22417%22%2C%22textStartColumn%22%3A%2262%22%2C%22textEndLine%22%3A%22417%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-sm font-mono text-red-400",children:"确认清空所有数据？"}),t.jsx("p",{"trae-inspector-start-line":"418","trae-inspector-start-column":"16","trae-inspector-end-line":"418","trae-inspector-end-column":"96","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AD%A4%E6%93%8D%E4%BD%9C%E4%B8%8D%E5%8F%AF%E6%92%A4%E9%94%80%EF%BC%8C%E6%89%80%E6%9C%89%E9%85%8D%E7%BD%AE%E5%92%8C%E6%95%B0%E6%8D%AE%E5%B0%86%E8%A2%AB%E6%B0%B8%E4%B9%85%E5%88%A0%E9%99%A4%E3%80%82%22%2C%22textStartLine%22%3A%22418%22%2C%22textStartColumn%22%3A%2270%22%2C%22textEndLine%22%3A%22418%22%2C%22textEndColumn%22%3A%2292%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs font-mono text-red-300/60 mt-1",children:"此操作不可撤销，所有配置和数据将被永久删除。"})]})]}),t.jsxs("div",{"trae-inspector-start-line":"421","trae-inspector-start-column":"12","trae-inspector-end-line":"434","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex gap-2",children:[t.jsx("button",{"trae-inspector-start-line":"422","trae-inspector-start-column":"14","trae-inspector-end-line":"427","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%A1%AE%E8%AE%A4%E6%B8%85%E7%A9%BA%22%2C%22textStartLine%22%3A%22425%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22427%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:o,className:"flex-1 py-2 rounded-lg bg-red-500/30 border border-red-500/70 text-red-400 text-xs font-mono hover:bg-red-500/40 transition-colors",children:"确认清空"}),t.jsx("button",{"trae-inspector-start-line":"428","trae-inspector-start-column":"14","trae-inspector-end-line":"433","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%8F%96%E6%B6%88%22%2C%22textStartLine%22%3A%22431%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22433%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>r(!1),className:"flex-1 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 text-xs font-mono hover:bg-gray-800 transition-colors",children:"取消"})]})]}):t.jsxs("button",{"trae-inspector-start-line":"437","trae-inspector-start-column":"10","trae-inspector-end-line":"443","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",onClick:()=>r(!0),className:"w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-700/50 bg-red-900/10 text-red-400 hover:bg-red-900/20 transition-all duration-200",children:[t.jsx(Dr,{className:"w-4 h-4"}),t.jsx("span",{"trae-inspector-start-line":"442","trae-inspector-start-column":"12","trae-inspector-end-line":"442","trae-inspector-end-column":"59","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%B8%85%E7%A9%BA%E6%95%B0%E6%8D%AE%22%2C%22textStartLine%22%3A%22442%22%2C%22textStartColumn%22%3A%2248%22%2C%22textEndLine%22%3A%22442%22%2C%22textEndColumn%22%3A%2252%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-xs font-mono",children:"清空数据"})]})]})})}function ma(){return t.jsxs("div",{"trae-inspector-start-line":"452","trae-inspector-start-column":"4","trae-inspector-end-line":"520","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"h-full flex flex-col",children:[t.jsx("div",{"trae-inspector-start-line":"453","trae-inspector-start-column":"6","trae-inspector-end-line":"460","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:t.jsxs("div",{"trae-inspector-start-line":"454","trae-inspector-start-column":"8","trae-inspector-end-line":"459","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"max-w-md mx-auto flex items-center gap-2",children:[t.jsx(Et,{className:"w-5 h-5 text-yellow-400",style:{filter:"drop-shadow(0 0 6px rgba(250,204,21,0.5))"}}),t.jsx("h1",{"trae-inspector-start-line":"456","trae-inspector-start-column":"10","trae-inspector-end-line":"458","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%88%91%E7%9A%84%E8%AE%BE%E7%BD%AE%22%2C%22textStartLine%22%3A%22456%22%2C%22textStartColumn%22%3A%22127%22%2C%22textEndLine%22%3A%22458%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-base font-mono font-bold text-yellow-400",style:{textShadow:"0 0 8px rgba(250,204,21,0.5)"},children:"我的设置"})]})}),t.jsx("div",{"trae-inspector-start-line":"462","trae-inspector-start-column":"6","trae-inspector-end-line":"476","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 space-y-3 safe-area-bottom custom-scrollbar",children:t.jsxs("div",{"trae-inspector-start-line":"463","trae-inspector-start-column":"8","trae-inspector-end-line":"475","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"max-w-md mx-auto space-y-3",children:[t.jsx(ia,{}),t.jsx(ca,{}),t.jsx(la,{}),t.jsx(pa,{}),t.jsx(da,{}),t.jsx("div",{"trae-inspector-start-line":"470","trae-inspector-start-column":"10","trae-inspector-end-line":"474","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"pt-4 pb-2 text-center",children:t.jsx("p",{"trae-inspector-start-line":"471","trae-inspector-start-column":"12","trae-inspector-end-line":"473","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22v2.4.1%20%C2%B7%20%E6%9E%81%E5%AE%A2%E9%A3%8E%E6%A0%BC%E5%A4%9A%20Agent%20%E5%8D%8F%E4%BD%9C%E5%BC%80%E5%8F%91%E7%B3%BB%E7%BB%9F%22%2C%22textStartLine%22%3A%22471%22%2C%22textStartColumn%22%3A%2263%22%2C%22textEndLine%22%3A%22473%22%2C%22textEndColumn%22%3A%2212%22%2C%22cwd%22%3A%22%2Fworkspace%22%7D",className:"text-[10px] font-mono text-gray-600",children:"v2.4.1 · 极客风格多 Agent 协作开发系统"})})]})}),t.jsx("style",{"trae-inspector-start-line":"478","trae-inspector-start-column":"6","trae-inspector-end-line":"519","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",children:`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.5);
        }

        .slider-green::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
          border: 2px solid #166534;
          transition: all 0.2s ease;
        }

        .slider-green::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(34, 197, 94, 1);
        }

        .slider-green::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
          border: 2px solid #166534;
        }
      `})]})}const ua=[{path:"/",label:"首页",icon:_t,color:"text-green-400",glow:"rgba(34, 197, 94, 0.5)"},{path:"/team",label:"团队",icon:xt,color:"text-blue-400",glow:"rgba(59, 130, 246, 0.5)"},{path:"/knowledge",label:"知识",icon:bt,color:"text-purple-400",glow:"rgba(168, 85, 247, 0.5)"},{path:"/tasks",label:"任务",icon:he,color:"text-orange-400",glow:"rgba(251, 146, 60, 0.5)"},{path:"/settings",label:"我的",icon:Et,color:"text-yellow-400",glow:"rgba(250, 204, 21, 0.5)"}];function ga(){const e=Jt();return t.jsx("nav",{"trae-inspector-start-line":"22","trae-inspector-start-column":"4","trae-inspector-end-line":"55","trae-inspector-end-column":"10","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-shrink-0 bg-gray-950/95 backdrop-blur-md border-t border-green-900/40 px-1 py-1.5 safe-area-bottom",children:t.jsx("div",{"trae-inspector-start-line":"23","trae-inspector-start-column":"6","trae-inspector-end-line":"54","trae-inspector-end-column":"12","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex items-center justify-around max-w-md mx-auto",children:ua.map(r=>{const a=e.pathname===r.path,s=r.icon;return t.jsxs(Zt,{to:r.path,className:f("flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[56px]",a?"scale-105":"opacity-60 hover:opacity-100"),children:[t.jsx("div",{"trae-inspector-start-line":"36","trae-inspector-start-column":"14","trae-inspector-end-line":"44","trae-inspector-end-column":"20","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("p-1 rounded-lg transition-all",a?"bg-gray-800/80":""),style:a?{boxShadow:`0 0 12px ${r.glow}`}:{},children:t.jsx(s,{className:f("w-5 h-5",a?r.color:"text-gray-500"),style:a?{filter:`drop-shadow(0 0 4px ${r.glow})`}:{}})}),t.jsx("span",{"trae-inspector-start-line":"45","trae-inspector-start-column":"14","trae-inspector-end-line":"50","trae-inspector-end-column":"21","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:f("text-[10px] font-mono tracking-wide",a?r.color:"text-gray-600"),children:r.label})]},r.path)})})})}function ha(){return t.jsx(qt,{initialView:"team"})}function xa(){return t.jsxs("div",{"trae-inspector-start-line":"65","trae-inspector-start-column":"4","trae-inspector-end-line":"79","trae-inspector-end-column":"10","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"relative h-screen w-screen overflow-hidden flex flex-col bg-gray-950",children:[t.jsx(ks,{opacity:.06,speed:80}),t.jsx("main",{"trae-inspector-start-line":"68","trae-inspector-start-column":"6","trae-inspector-end-line":"76","trae-inspector-end-column":"13","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fworkspace%22%7D",className:"flex-1 overflow-y-auto relative z-10 overscroll-contain",children:t.jsxs(Xt,{children:[t.jsx(Z,{path:"/",element:t.jsx(qt,{})}),t.jsx(Z,{path:"/team",element:t.jsx(ha,{})}),t.jsx(Z,{path:"/knowledge",element:t.jsx(ta,{})}),t.jsx(Z,{path:"/tasks",element:t.jsx(na,{})}),t.jsx(Z,{path:"/settings",element:t.jsx(ma,{})})]})}),t.jsx(ga,{})]})}function fa(){return t.jsx(Qt,{children:t.jsx(xa,{})})}Cr.createRoot(document.getElementById("root")).render(t.jsx(R.StrictMode,{children:t.jsx(fa,{})}));
