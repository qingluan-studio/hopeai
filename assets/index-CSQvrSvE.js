var ee=Object.defineProperty;var te=(s,e,t)=>e in s?ee(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var T=(s,e,t)=>te(s,typeof e!="symbol"?e+"":e,t);import{j as jsxRuntimeExports,M as Markdown,r as remarkGfm}from"./markdown-vendor-QgW8DKCn.js";import{b as requireReactDom,r as reactExports,R as React,H as HashRouter,c as Routes,d as Route,u as useLocation,N as NavLink}from"./react-vendor-BrMZ_TUQ.js";import{S as Sparkles,C as Cpu,a as Square,L as ListChecks,P as Package,F as FileText,b as Folder,D as Download,B as Bot,Z as Zap,c as LoaderCircle,d as Play,e as ChevronDown,f as ChevronRight,X,g as CircleCheckBig,h as Check,i as CircleAlert,W as Wrench,j as Clock,U as Users,k as Crown,l as Send,m as Settings2,n as Scale,o as ShieldAlert,H as Headphones,M as Megaphone,p as Landmark,q as UsersRound,R as Rocket,r as Lightbulb,s as FlaskConical,t as Shield,u as CodeXml,v as Palette,w as Search,x as ClipboardList,y as BookOpen,z as Funnel,G as Github,A as User,E as RefreshCw,T as TriangleAlert,I as Database,J as ArrowLeft,K as Tag,N as ListTodo,O as Plus,Q as CircleCheck,V as Flag,Y as MessageSquare,_ as Settings$1,$ as Moon,a0 as Sun,a1 as Type,a2 as Link,a3 as Unlink,a4 as Brain,a5 as EyeOff,a6 as Eye,a7 as Key,a8 as Trash2,a9 as Upload,aa as Image,ab as ZoomOut,ac as ZoomIn,ad as RotateCcw,ae as FileCode,af as Copy,ag as Terminal,ah as Languages,ai as ArrowRight,aj as Globe,ak as Star,al as BookmarkPlus,am as PenLine}from"./ui-vendor-KtkFPlen.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();var client={},hasRequiredClient;function requireClient(){if(hasRequiredClient)return client;hasRequiredClient=1;var s=requireReactDom();return client.createRoot=s.createRoot,client.hydrateRoot=s.hydrateRoot,client}var clientExports=requireClient();function r(s){var e,t,n="";if(typeof s=="string"||typeof s=="number")n+=s;else if(typeof s=="object")if(Array.isArray(s)){var a=s.length;for(e=0;e<a;e++)s[e]&&(t=r(s[e]))&&(n&&(n+=" "),n+=t)}else for(t in s)s[t]&&(n&&(n+=" "),n+=t);return n}function clsx(){for(var s,e,t=0,n="",a=arguments.length;t<a;t++)(s=arguments[t])&&(e=r(s))&&(n&&(n+=" "),n+=e);return n}const concatArrays=(s,e)=>{const t=new Array(s.length+e.length);for(let n=0;n<s.length;n++)t[n]=s[n];for(let n=0;n<e.length;n++)t[s.length+n]=e[n];return t},createClassValidatorObject=(s,e)=>({classGroupId:s,validator:e}),createClassPartObject=(s=new Map,e=null,t)=>({nextPart:s,validators:e,classGroupId:t}),CLASS_PART_SEPARATOR="-",EMPTY_CONFLICTS=[],ARBITRARY_PROPERTY_PREFIX="arbitrary..",createClassGroupUtils=s=>{const e=createClassMap(s),{conflictingClassGroups:t,conflictingClassGroupModifiers:n}=s;return{getClassGroupId:i=>{if(i.startsWith("[")&&i.endsWith("]"))return getGroupIdForArbitraryProperty(i);const c=i.split(CLASS_PART_SEPARATOR),l=c[0]===""&&c.length>1?1:0;return getGroupRecursive(c,l,e)},getConflictingClassGroupIds:(i,c)=>{if(c){const l=n[i],p=t[i];return l?p?concatArrays(p,l):l:p||EMPTY_CONFLICTS}return t[i]||EMPTY_CONFLICTS}}},getGroupRecursive=(s,e,t)=>{if(s.length-e===0)return t.classGroupId;const a=s[e],o=t.nextPart.get(a);if(o){const p=getGroupRecursive(s,e+1,o);if(p)return p}const i=t.validators;if(i===null)return;const c=e===0?s.join(CLASS_PART_SEPARATOR):s.slice(e).join(CLASS_PART_SEPARATOR),l=i.length;for(let p=0;p<l;p++){const m=i[p];if(m.validator(c))return m.classGroupId}},getGroupIdForArbitraryProperty=s=>s.slice(1,-1).indexOf(":")===-1?void 0:(()=>{const e=s.slice(1,-1),t=e.indexOf(":"),n=e.slice(0,t);return n?ARBITRARY_PROPERTY_PREFIX+n:void 0})(),createClassMap=s=>{const{theme:e,classGroups:t}=s;return processClassGroups(t,e)},processClassGroups=(s,e)=>{const t=createClassPartObject();for(const n in s){const a=s[n];processClassesRecursively(a,t,n,e)}return t},processClassesRecursively=(s,e,t,n)=>{const a=s.length;for(let o=0;o<a;o++){const i=s[o];processClassDefinition(i,e,t,n)}},processClassDefinition=(s,e,t,n)=>{if(typeof s=="string"){processStringDefinition(s,e,t);return}if(typeof s=="function"){processFunctionDefinition(s,e,t,n);return}processObjectDefinition(s,e,t,n)},processStringDefinition=(s,e,t)=>{const n=s===""?e:getPart(e,s);n.classGroupId=t},processFunctionDefinition=(s,e,t,n)=>{if(isThemeGetter(s)){processClassesRecursively(s(n),e,t,n);return}e.validators===null&&(e.validators=[]),e.validators.push(createClassValidatorObject(t,s))},processObjectDefinition=(s,e,t,n)=>{const a=Object.entries(s),o=a.length;for(let i=0;i<o;i++){const[c,l]=a[i];processClassesRecursively(l,getPart(e,c),t,n)}},getPart=(s,e)=>{let t=s;const n=e.split(CLASS_PART_SEPARATOR),a=n.length;for(let o=0;o<a;o++){const i=n[o];let c=t.nextPart.get(i);c||(c=createClassPartObject(),t.nextPart.set(i,c)),t=c}return t},isThemeGetter=s=>"isThemeGetter"in s&&s.isThemeGetter===!0,createLruCache=s=>{if(s<1)return{get:()=>{},set:()=>{}};let e=0,t=Object.create(null),n=Object.create(null);const a=(o,i)=>{t[o]=i,e++,e>s&&(e=0,n=t,t=Object.create(null))};return{get(o){let i=t[o];if(i!==void 0)return i;if((i=n[o])!==void 0)return a(o,i),i},set(o,i){o in t?t[o]=i:a(o,i)}}},IMPORTANT_MODIFIER="!",MODIFIER_SEPARATOR=":",EMPTY_MODIFIERS=[],createResultObject=(s,e,t,n,a)=>({modifiers:s,hasImportantModifier:e,baseClassName:t,maybePostfixModifierPosition:n,isExternal:a}),createParseClassName=s=>{const{prefix:e,experimentalParseClassName:t}=s;let n=a=>{const o=[];let i=0,c=0,l=0,p;const m=a.length;for(let u=0;u<m;u++){const f=a[u];if(i===0&&c===0){if(f===MODIFIER_SEPARATOR){o.push(a.slice(l,u)),l=u+1;continue}if(f==="/"){p=u;continue}}f==="["?i++:f==="]"?i--:f==="("?c++:f===")"&&c--}const d=o.length===0?a:a.slice(l);let x=d,h=!1;d.endsWith(IMPORTANT_MODIFIER)?(x=d.slice(0,-1),h=!0):d.startsWith(IMPORTANT_MODIFIER)&&(x=d.slice(1),h=!0);const F=p&&p>l?p-l:void 0;return createResultObject(o,h,x,F)};if(e){const a=e+MODIFIER_SEPARATOR,o=n;n=i=>i.startsWith(a)?o(i.slice(a.length)):createResultObject(EMPTY_MODIFIERS,!1,i,void 0,!0)}if(t){const a=n;n=o=>t({className:o,parseClassName:a})}return n},createSortModifiers=s=>{const e=new Map;return s.orderSensitiveModifiers.forEach((t,n)=>{e.set(t,1e6+n)}),t=>{const n=[];let a=[];for(let o=0;o<t.length;o++){const i=t[o],c=i[0]==="[",l=e.has(i);c||l?(a.length>0&&(a.sort(),n.push(...a),a=[]),n.push(i)):a.push(i)}return a.length>0&&(a.sort(),n.push(...a)),n}},createConfigUtils=s=>({cache:createLruCache(s.cacheSize),parseClassName:createParseClassName(s),sortModifiers:createSortModifiers(s),postfixLookupClassGroupIds:createPostfixLookupClassGroupIds(s),...createClassGroupUtils(s)}),createPostfixLookupClassGroupIds=s=>{const e=Object.create(null),t=s.postfixLookupClassGroups;if(t)for(let n=0;n<t.length;n++)e[t[n]]=!0;return e},SPLIT_CLASSES_REGEX=/\s+/,mergeClassList=(s,e)=>{const{parseClassName:t,getClassGroupId:n,getConflictingClassGroupIds:a,sortModifiers:o,postfixLookupClassGroupIds:i}=e,c=[],l=s.trim().split(SPLIT_CLASSES_REGEX);let p="";for(let m=l.length-1;m>=0;m-=1){const d=l[m],{isExternal:x,modifiers:h,hasImportantModifier:F,baseClassName:u,maybePostfixModifierPosition:f}=t(d);if(x){p=d+(p.length>0?" "+p:p);continue}let k=!!f,y;if(k){const j=u.substring(0,f);y=n(j);const w=y&&i[y]?n(u):void 0;w&&w!==y&&(y=w,k=!1)}else y=n(u);if(!y){if(!k){p=d+(p.length>0?" "+p:p);continue}if(y=n(u),!y){p=d+(p.length>0?" "+p:p);continue}k=!1}const g=h.length===0?"":h.length===1?h[0]:o(h).join(":"),b=F?g+IMPORTANT_MODIFIER:g,C=b+y;if(c.indexOf(C)>-1)continue;c.push(C);const R=a(y,k);for(let j=0;j<R.length;++j){const w=R[j];c.push(b+w)}p=d+(p.length>0?" "+p:p)}return p},twJoin=(...s)=>{let e=0,t,n,a="";for(;e<s.length;)(t=s[e++])&&(n=toValue(t))&&(a&&(a+=" "),a+=n);return a},toValue=s=>{if(typeof s=="string")return s;let e,t="";for(let n=0;n<s.length;n++)s[n]&&(e=toValue(s[n]))&&(t&&(t+=" "),t+=e);return t},createTailwindMerge=(s,...e)=>{let t,n,a,o;const i=l=>{const p=e.reduce((m,d)=>d(m),s());return t=createConfigUtils(p),n=t.cache.get,a=t.cache.set,o=c,c(l)},c=l=>{const p=n(l);if(p)return p;const m=mergeClassList(l,t);return a(l,m),m};return o=i,(...l)=>o(twJoin(...l))},fallbackThemeArr=[],fromTheme=s=>{const e=t=>t[s]||fallbackThemeArr;return e.isThemeGetter=!0,e},arbitraryValueRegex=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,arbitraryVariableRegex=/^\((?:(\w[\w-]*):)?(.+)\)$/i,fractionRegex=/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,tshirtUnitRegex=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,lengthUnitRegex=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,colorFunctionRegex=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,shadowRegex=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,imageRegex=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,isFraction=s=>fractionRegex.test(s),isNumber=s=>!!s&&!Number.isNaN(Number(s)),isInteger=s=>!!s&&Number.isInteger(Number(s)),isPercent=s=>s.endsWith("%")&&isNumber(s.slice(0,-1)),isTshirtSize=s=>tshirtUnitRegex.test(s),isAny=()=>!0,isLengthOnly=s=>lengthUnitRegex.test(s)&&!colorFunctionRegex.test(s),isNever=()=>!1,isShadow=s=>shadowRegex.test(s),isImage=s=>imageRegex.test(s),isAnyNonArbitrary=s=>!isArbitraryValue(s)&&!isArbitraryVariable(s),isNamedContainerQuery=s=>s.startsWith("@container")&&(s[10]==="/"&&s[11]!==void 0||s[11]==="s"&&s[16]!==void 0&&s.startsWith("-size/",10)||s[11]==="n"&&s[18]!==void 0&&s.startsWith("-normal/",10)),isArbitrarySize=s=>getIsArbitraryValue(s,isLabelSize,isNever),isArbitraryValue=s=>arbitraryValueRegex.test(s),isArbitraryLength=s=>getIsArbitraryValue(s,isLabelLength,isLengthOnly),isArbitraryNumber=s=>getIsArbitraryValue(s,isLabelNumber,isNumber),isArbitraryWeight=s=>getIsArbitraryValue(s,isLabelWeight,isAny),isArbitraryFamilyName=s=>getIsArbitraryValue(s,isLabelFamilyName,isNever),isArbitraryPosition=s=>getIsArbitraryValue(s,isLabelPosition,isNever),isArbitraryImage=s=>getIsArbitraryValue(s,isLabelImage,isImage),isArbitraryShadow=s=>getIsArbitraryValue(s,isLabelShadow,isShadow),isArbitraryVariable=s=>arbitraryVariableRegex.test(s),isArbitraryVariableLength=s=>getIsArbitraryVariable(s,isLabelLength),isArbitraryVariableFamilyName=s=>getIsArbitraryVariable(s,isLabelFamilyName),isArbitraryVariablePosition=s=>getIsArbitraryVariable(s,isLabelPosition),isArbitraryVariableSize=s=>getIsArbitraryVariable(s,isLabelSize),isArbitraryVariableImage=s=>getIsArbitraryVariable(s,isLabelImage),isArbitraryVariableShadow=s=>getIsArbitraryVariable(s,isLabelShadow,!0),isArbitraryVariableWeight=s=>getIsArbitraryVariable(s,isLabelWeight,!0),getIsArbitraryValue=(s,e,t)=>{const n=arbitraryValueRegex.exec(s);return n?n[1]?e(n[1]):t(n[2]):!1},getIsArbitraryVariable=(s,e,t=!1)=>{const n=arbitraryVariableRegex.exec(s);return n?n[1]?e(n[1]):t:!1},isLabelPosition=s=>s==="position"||s==="percentage",isLabelImage=s=>s==="image"||s==="url",isLabelSize=s=>s==="length"||s==="size"||s==="bg-size",isLabelLength=s=>s==="length",isLabelNumber=s=>s==="number",isLabelFamilyName=s=>s==="family-name",isLabelWeight=s=>s==="number"||s==="weight",isLabelShadow=s=>s==="shadow",getDefaultConfig=()=>{const s=fromTheme("color"),e=fromTheme("font"),t=fromTheme("text"),n=fromTheme("font-weight"),a=fromTheme("tracking"),o=fromTheme("leading"),i=fromTheme("breakpoint"),c=fromTheme("container"),l=fromTheme("spacing"),p=fromTheme("radius"),m=fromTheme("shadow"),d=fromTheme("inset-shadow"),x=fromTheme("text-shadow"),h=fromTheme("drop-shadow"),F=fromTheme("blur"),u=fromTheme("perspective"),f=fromTheme("aspect"),k=fromTheme("ease"),y=fromTheme("animate"),g=()=>["auto","avoid","all","avoid-page","page","left","right","column"],b=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],C=()=>[...b(),isArbitraryVariable,isArbitraryValue],R=()=>["auto","hidden","clip","visible","scroll"],j=()=>["auto","contain","none"],w=()=>[isArbitraryVariable,isArbitraryValue,l],S=()=>[isFraction,"full","auto",...w()],B=()=>[isInteger,"none","subgrid",isArbitraryVariable,isArbitraryValue],v=()=>["auto",{span:["full",isInteger,isArbitraryVariable,isArbitraryValue]},isInteger,isArbitraryVariable,isArbitraryValue],_=()=>[isInteger,"auto",isArbitraryVariable,isArbitraryValue],U=()=>["auto","min","max","fr",isArbitraryVariable,isArbitraryValue],$=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],V=()=>["start","end","center","stretch","center-safe","end-safe"],P=()=>["auto",...w()],O=()=>[isFraction,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...w()],z=()=>[isFraction,"screen","full","dvw","lvw","svw","min","max","fit",...w()],E=()=>[isFraction,"screen","full","lh","dvh","lvh","svh","min","max","fit",...w()],A=()=>[s,isArbitraryVariable,isArbitraryValue],D=()=>[...b(),isArbitraryVariablePosition,isArbitraryPosition,{position:[isArbitraryVariable,isArbitraryValue]}],M=()=>["no-repeat",{repeat:["","x","y","space","round"]}],G=()=>["auto","cover","contain",isArbitraryVariableSize,isArbitrarySize,{size:[isArbitraryVariable,isArbitraryValue]}],J=()=>[isPercent,isArbitraryVariableLength,isArbitraryLength],I=()=>["","none","full",p,isArbitraryVariable,isArbitraryValue],L=()=>["",isNumber,isArbitraryVariableLength,isArbitraryLength],q=()=>["solid","dashed","dotted","double"],Y=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],N=()=>[isNumber,isPercent,isArbitraryVariablePosition,isArbitraryPosition],Z=()=>["","none",F,isArbitraryVariable,isArbitraryValue],K=()=>["none",isNumber,isArbitraryVariable,isArbitraryValue],H=()=>["none",isNumber,isArbitraryVariable,isArbitraryValue],Q=()=>[isNumber,isArbitraryVariable,isArbitraryValue],W=()=>[isFraction,"full",...w()];return{cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[isTshirtSize],breakpoint:[isTshirtSize],color:[isAny],container:[isTshirtSize],"drop-shadow":[isTshirtSize],ease:["in","out","in-out"],font:[isAnyNonArbitrary],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[isTshirtSize],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[isTshirtSize],shadow:[isTshirtSize],spacing:["px",isNumber],text:[isTshirtSize],"text-shadow":[isTshirtSize],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",isFraction,isArbitraryValue,isArbitraryVariable,f]}],container:["container"],"container-type":[{"@container":["","normal","size",isArbitraryVariable,isArbitraryValue]}],"container-named":[isNamedContainerQuery],columns:[{columns:[isNumber,isArbitraryValue,isArbitraryVariable,c]}],"break-after":[{"break-after":g()}],"break-before":[{"break-before":g()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:C()}],overflow:[{overflow:R()}],"overflow-x":[{"overflow-x":R()}],"overflow-y":[{"overflow-y":R()}],overscroll:[{overscroll:j()}],"overscroll-x":[{"overscroll-x":j()}],"overscroll-y":[{"overscroll-y":j()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:S()}],"inset-x":[{"inset-x":S()}],"inset-y":[{"inset-y":S()}],start:[{"inset-s":S(),start:S()}],end:[{"inset-e":S(),end:S()}],"inset-bs":[{"inset-bs":S()}],"inset-be":[{"inset-be":S()}],top:[{top:S()}],right:[{right:S()}],bottom:[{bottom:S()}],left:[{left:S()}],visibility:["visible","invisible","collapse"],z:[{z:[isInteger,"auto",isArbitraryVariable,isArbitraryValue]}],basis:[{basis:[isFraction,"full","auto",c,...w()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[isNumber,isFraction,"auto","initial","none",isArbitraryValue]}],grow:[{grow:["",isNumber,isArbitraryVariable,isArbitraryValue]}],shrink:[{shrink:["",isNumber,isArbitraryVariable,isArbitraryValue]}],order:[{order:[isInteger,"first","last","none",isArbitraryVariable,isArbitraryValue]}],"grid-cols":[{"grid-cols":B()}],"col-start-end":[{col:v()}],"col-start":[{"col-start":_()}],"col-end":[{"col-end":_()}],"grid-rows":[{"grid-rows":B()}],"row-start-end":[{row:v()}],"row-start":[{"row-start":_()}],"row-end":[{"row-end":_()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":U()}],"auto-rows":[{"auto-rows":U()}],gap:[{gap:w()}],"gap-x":[{"gap-x":w()}],"gap-y":[{"gap-y":w()}],"justify-content":[{justify:[...$(),"normal"]}],"justify-items":[{"justify-items":[...V(),"normal"]}],"justify-self":[{"justify-self":["auto",...V()]}],"align-content":[{content:["normal",...$()]}],"align-items":[{items:[...V(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...V(),{baseline:["","last"]}]}],"place-content":[{"place-content":$()}],"place-items":[{"place-items":[...V(),"baseline"]}],"place-self":[{"place-self":["auto",...V()]}],p:[{p:w()}],px:[{px:w()}],py:[{py:w()}],ps:[{ps:w()}],pe:[{pe:w()}],pbs:[{pbs:w()}],pbe:[{pbe:w()}],pt:[{pt:w()}],pr:[{pr:w()}],pb:[{pb:w()}],pl:[{pl:w()}],m:[{m:P()}],mx:[{mx:P()}],my:[{my:P()}],ms:[{ms:P()}],me:[{me:P()}],mbs:[{mbs:P()}],mbe:[{mbe:P()}],mt:[{mt:P()}],mr:[{mr:P()}],mb:[{mb:P()}],ml:[{ml:P()}],"space-x":[{"space-x":w()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":w()}],"space-y-reverse":["space-y-reverse"],size:[{size:O()}],"inline-size":[{inline:["auto",...z()]}],"min-inline-size":[{"min-inline":["auto",...z()]}],"max-inline-size":[{"max-inline":["none",...z()]}],"block-size":[{block:["auto",...E()]}],"min-block-size":[{"min-block":["auto",...E()]}],"max-block-size":[{"max-block":["none",...E()]}],w:[{w:[c,"screen",...O()]}],"min-w":[{"min-w":[c,"screen","none",...O()]}],"max-w":[{"max-w":[c,"screen","none","prose",{screen:[i]},...O()]}],h:[{h:["screen","lh",...O()]}],"min-h":[{"min-h":["screen","lh","none",...O()]}],"max-h":[{"max-h":["screen","lh",...O()]}],"font-size":[{text:["base",t,isArbitraryVariableLength,isArbitraryLength]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[n,isArbitraryVariableWeight,isArbitraryWeight]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",isPercent,isArbitraryValue]}],"font-family":[{font:[isArbitraryVariableFamilyName,isArbitraryFamilyName,e]}],"font-features":[{"font-features":[isArbitraryValue]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[a,isArbitraryVariable,isArbitraryValue]}],"line-clamp":[{"line-clamp":[isNumber,"none",isArbitraryVariable,isArbitraryNumber]}],leading:[{leading:[o,...w()]}],"list-image":[{"list-image":["none",isArbitraryVariable,isArbitraryValue]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",isArbitraryVariable,isArbitraryValue]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:A()}],"text-color":[{text:A()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...q(),"wavy"]}],"text-decoration-thickness":[{decoration:[isNumber,"from-font","auto",isArbitraryVariable,isArbitraryLength]}],"text-decoration-color":[{decoration:A()}],"underline-offset":[{"underline-offset":[isNumber,"auto",isArbitraryVariable,isArbitraryValue]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:w()}],"tab-size":[{tab:[isInteger,isArbitraryVariable,isArbitraryValue]}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",isArbitraryVariable,isArbitraryValue]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",isArbitraryVariable,isArbitraryValue]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:D()}],"bg-repeat":[{bg:M()}],"bg-size":[{bg:G()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},isInteger,isArbitraryVariable,isArbitraryValue],radial:["",isArbitraryVariable,isArbitraryValue],conic:[isInteger,isArbitraryVariable,isArbitraryValue]},isArbitraryVariableImage,isArbitraryImage]}],"bg-color":[{bg:A()}],"gradient-from-pos":[{from:J()}],"gradient-via-pos":[{via:J()}],"gradient-to-pos":[{to:J()}],"gradient-from":[{from:A()}],"gradient-via":[{via:A()}],"gradient-to":[{to:A()}],rounded:[{rounded:I()}],"rounded-s":[{"rounded-s":I()}],"rounded-e":[{"rounded-e":I()}],"rounded-t":[{"rounded-t":I()}],"rounded-r":[{"rounded-r":I()}],"rounded-b":[{"rounded-b":I()}],"rounded-l":[{"rounded-l":I()}],"rounded-ss":[{"rounded-ss":I()}],"rounded-se":[{"rounded-se":I()}],"rounded-ee":[{"rounded-ee":I()}],"rounded-es":[{"rounded-es":I()}],"rounded-tl":[{"rounded-tl":I()}],"rounded-tr":[{"rounded-tr":I()}],"rounded-br":[{"rounded-br":I()}],"rounded-bl":[{"rounded-bl":I()}],"border-w":[{border:L()}],"border-w-x":[{"border-x":L()}],"border-w-y":[{"border-y":L()}],"border-w-s":[{"border-s":L()}],"border-w-e":[{"border-e":L()}],"border-w-bs":[{"border-bs":L()}],"border-w-be":[{"border-be":L()}],"border-w-t":[{"border-t":L()}],"border-w-r":[{"border-r":L()}],"border-w-b":[{"border-b":L()}],"border-w-l":[{"border-l":L()}],"divide-x":[{"divide-x":L()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":L()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...q(),"hidden","none"]}],"divide-style":[{divide:[...q(),"hidden","none"]}],"border-color":[{border:A()}],"border-color-x":[{"border-x":A()}],"border-color-y":[{"border-y":A()}],"border-color-s":[{"border-s":A()}],"border-color-e":[{"border-e":A()}],"border-color-bs":[{"border-bs":A()}],"border-color-be":[{"border-be":A()}],"border-color-t":[{"border-t":A()}],"border-color-r":[{"border-r":A()}],"border-color-b":[{"border-b":A()}],"border-color-l":[{"border-l":A()}],"divide-color":[{divide:A()}],"outline-style":[{outline:[...q(),"none","hidden"]}],"outline-offset":[{"outline-offset":[isNumber,isArbitraryVariable,isArbitraryValue]}],"outline-w":[{outline:["",isNumber,isArbitraryVariableLength,isArbitraryLength]}],"outline-color":[{outline:A()}],shadow:[{shadow:["","none",m,isArbitraryVariableShadow,isArbitraryShadow]}],"shadow-color":[{shadow:A()}],"inset-shadow":[{"inset-shadow":["none",d,isArbitraryVariableShadow,isArbitraryShadow]}],"inset-shadow-color":[{"inset-shadow":A()}],"ring-w":[{ring:L()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:A()}],"ring-offset-w":[{"ring-offset":[isNumber,isArbitraryLength]}],"ring-offset-color":[{"ring-offset":A()}],"inset-ring-w":[{"inset-ring":L()}],"inset-ring-color":[{"inset-ring":A()}],"text-shadow":[{"text-shadow":["none",x,isArbitraryVariableShadow,isArbitraryShadow]}],"text-shadow-color":[{"text-shadow":A()}],opacity:[{opacity:[isNumber,isArbitraryVariable,isArbitraryValue]}],"mix-blend":[{"mix-blend":[...Y(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":Y()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[isNumber]}],"mask-image-linear-from-pos":[{"mask-linear-from":N()}],"mask-image-linear-to-pos":[{"mask-linear-to":N()}],"mask-image-linear-from-color":[{"mask-linear-from":A()}],"mask-image-linear-to-color":[{"mask-linear-to":A()}],"mask-image-t-from-pos":[{"mask-t-from":N()}],"mask-image-t-to-pos":[{"mask-t-to":N()}],"mask-image-t-from-color":[{"mask-t-from":A()}],"mask-image-t-to-color":[{"mask-t-to":A()}],"mask-image-r-from-pos":[{"mask-r-from":N()}],"mask-image-r-to-pos":[{"mask-r-to":N()}],"mask-image-r-from-color":[{"mask-r-from":A()}],"mask-image-r-to-color":[{"mask-r-to":A()}],"mask-image-b-from-pos":[{"mask-b-from":N()}],"mask-image-b-to-pos":[{"mask-b-to":N()}],"mask-image-b-from-color":[{"mask-b-from":A()}],"mask-image-b-to-color":[{"mask-b-to":A()}],"mask-image-l-from-pos":[{"mask-l-from":N()}],"mask-image-l-to-pos":[{"mask-l-to":N()}],"mask-image-l-from-color":[{"mask-l-from":A()}],"mask-image-l-to-color":[{"mask-l-to":A()}],"mask-image-x-from-pos":[{"mask-x-from":N()}],"mask-image-x-to-pos":[{"mask-x-to":N()}],"mask-image-x-from-color":[{"mask-x-from":A()}],"mask-image-x-to-color":[{"mask-x-to":A()}],"mask-image-y-from-pos":[{"mask-y-from":N()}],"mask-image-y-to-pos":[{"mask-y-to":N()}],"mask-image-y-from-color":[{"mask-y-from":A()}],"mask-image-y-to-color":[{"mask-y-to":A()}],"mask-image-radial":[{"mask-radial":[isArbitraryVariable,isArbitraryValue]}],"mask-image-radial-from-pos":[{"mask-radial-from":N()}],"mask-image-radial-to-pos":[{"mask-radial-to":N()}],"mask-image-radial-from-color":[{"mask-radial-from":A()}],"mask-image-radial-to-color":[{"mask-radial-to":A()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":b()}],"mask-image-conic-pos":[{"mask-conic":[isNumber]}],"mask-image-conic-from-pos":[{"mask-conic-from":N()}],"mask-image-conic-to-pos":[{"mask-conic-to":N()}],"mask-image-conic-from-color":[{"mask-conic-from":A()}],"mask-image-conic-to-color":[{"mask-conic-to":A()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:D()}],"mask-repeat":[{mask:M()}],"mask-size":[{mask:G()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",isArbitraryVariable,isArbitraryValue]}],filter:[{filter:["","none",isArbitraryVariable,isArbitraryValue]}],blur:[{blur:Z()}],brightness:[{brightness:[isNumber,isArbitraryVariable,isArbitraryValue]}],contrast:[{contrast:[isNumber,isArbitraryVariable,isArbitraryValue]}],"drop-shadow":[{"drop-shadow":["","none",h,isArbitraryVariableShadow,isArbitraryShadow]}],"drop-shadow-color":[{"drop-shadow":A()}],grayscale:[{grayscale:["",isNumber,isArbitraryVariable,isArbitraryValue]}],"hue-rotate":[{"hue-rotate":[isNumber,isArbitraryVariable,isArbitraryValue]}],invert:[{invert:["",isNumber,isArbitraryVariable,isArbitraryValue]}],saturate:[{saturate:[isNumber,isArbitraryVariable,isArbitraryValue]}],sepia:[{sepia:["",isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-filter":[{"backdrop-filter":["","none",isArbitraryVariable,isArbitraryValue]}],"backdrop-blur":[{"backdrop-blur":Z()}],"backdrop-brightness":[{"backdrop-brightness":[isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-contrast":[{"backdrop-contrast":[isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-grayscale":[{"backdrop-grayscale":["",isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-invert":[{"backdrop-invert":["",isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-opacity":[{"backdrop-opacity":[isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-saturate":[{"backdrop-saturate":[isNumber,isArbitraryVariable,isArbitraryValue]}],"backdrop-sepia":[{"backdrop-sepia":["",isNumber,isArbitraryVariable,isArbitraryValue]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":w()}],"border-spacing-x":[{"border-spacing-x":w()}],"border-spacing-y":[{"border-spacing-y":w()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",isArbitraryVariable,isArbitraryValue]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[isNumber,"initial",isArbitraryVariable,isArbitraryValue]}],ease:[{ease:["linear","initial",k,isArbitraryVariable,isArbitraryValue]}],delay:[{delay:[isNumber,isArbitraryVariable,isArbitraryValue]}],animate:[{animate:["none",y,isArbitraryVariable,isArbitraryValue]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[u,isArbitraryVariable,isArbitraryValue]}],"perspective-origin":[{"perspective-origin":C()}],rotate:[{rotate:K()}],"rotate-x":[{"rotate-x":K()}],"rotate-y":[{"rotate-y":K()}],"rotate-z":[{"rotate-z":K()}],scale:[{scale:H()}],"scale-x":[{"scale-x":H()}],"scale-y":[{"scale-y":H()}],"scale-z":[{"scale-z":H()}],"scale-3d":["scale-3d"],skew:[{skew:Q()}],"skew-x":[{"skew-x":Q()}],"skew-y":[{"skew-y":Q()}],transform:[{transform:[isArbitraryVariable,isArbitraryValue,"","none","gpu","cpu"]}],"transform-origin":[{origin:C()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:W()}],"translate-x":[{"translate-x":W()}],"translate-y":[{"translate-y":W()}],"translate-z":[{"translate-z":W()}],"translate-none":["translate-none"],zoom:[{zoom:[isInteger,isArbitraryVariable,isArbitraryValue]}],accent:[{accent:A()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:A()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",isArbitraryVariable,isArbitraryValue]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scrollbar-thumb-color":[{"scrollbar-thumb":A()}],"scrollbar-track-color":[{"scrollbar-track":A()}],"scrollbar-gutter":[{"scrollbar-gutter":["auto","stable","both"]}],"scrollbar-w":[{scrollbar:["auto","thin","none"]}],"scroll-m":[{"scroll-m":w()}],"scroll-mx":[{"scroll-mx":w()}],"scroll-my":[{"scroll-my":w()}],"scroll-ms":[{"scroll-ms":w()}],"scroll-me":[{"scroll-me":w()}],"scroll-mbs":[{"scroll-mbs":w()}],"scroll-mbe":[{"scroll-mbe":w()}],"scroll-mt":[{"scroll-mt":w()}],"scroll-mr":[{"scroll-mr":w()}],"scroll-mb":[{"scroll-mb":w()}],"scroll-ml":[{"scroll-ml":w()}],"scroll-p":[{"scroll-p":w()}],"scroll-px":[{"scroll-px":w()}],"scroll-py":[{"scroll-py":w()}],"scroll-ps":[{"scroll-ps":w()}],"scroll-pe":[{"scroll-pe":w()}],"scroll-pbs":[{"scroll-pbs":w()}],"scroll-pbe":[{"scroll-pbe":w()}],"scroll-pt":[{"scroll-pt":w()}],"scroll-pr":[{"scroll-pr":w()}],"scroll-pb":[{"scroll-pb":w()}],"scroll-pl":[{"scroll-pl":w()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",isArbitraryVariable,isArbitraryValue]}],fill:[{fill:["none",...A()]}],"stroke-w":[{stroke:[isNumber,isArbitraryVariableLength,isArbitraryLength,isArbitraryNumber]}],stroke:[{stroke:["none",...A()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{"container-named":["container-type"],overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","inset-bs","inset-be","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pbs","pbe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mbs","mbe","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-bs","border-w-be","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-bs","border-color-be","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mbs","scroll-mbe","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pbs","scroll-pbe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},postfixLookupClassGroups:["container-type"],orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}},twMerge=createTailwindMerge(getDefaultConfig);function cn(...s){return twMerge(clsx(s))}function MatrixBackground({opacity:s=.15,speed:e=50,fontSize:t=14,charColor:n="#22c55e",className:a=""}){const o=reactExports.useRef(null),i=reactExports.useRef(),c=reactExports.useRef([]),l=reactExports.useRef([]);return reactExports.useEffect(()=>{const p=o.current;if(!p)return;const m=p.getContext("2d");if(!m)return;const x="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()".split("");l.current=x;const h=()=>{p.width=window.innerWidth,p.height=window.innerHeight;const f=Math.floor(p.width/t);c.current=Array(f).fill(0).map(()=>Math.random()*-100)};h(),window.addEventListener("resize",h);let F=0;const u=f=>{if(f-F<e){i.current=requestAnimationFrame(u);return}F=f,m.fillStyle="rgba(0, 0, 0, 0.05)",m.fillRect(0,0,p.width,p.height),m.font=`${t}px monospace`;const k=c.current,y=l.current;for(let g=0;g<k.length;g++){const b=y[Math.floor(Math.random()*y.length)],C=g*t,R=k[g]*t,j=m.createRadialGradient(C,R,0,C,R,t*2);j.addColorStop(0,n),j.addColorStop(1,"transparent"),m.fillStyle=n,m.globalAlpha=s,m.fillText(b,C,R),m.globalAlpha=s*.3,m.fillText(b,C,R-t),m.globalAlpha=1,R>p.height&&Math.random()>.975&&(k[g]=0),k[g]++}i.current=requestAnimationFrame(u)};return i.current=requestAnimationFrame(u),()=>{window.removeEventListener("resize",h),i.current&&cancelAnimationFrame(i.current)}},[s,e,t,n]),jsxRuntimeExports.jsx("canvas",{"trae-inspector-start-line":"99","trae-inspector-start-column":"4","trae-inspector-end-line":"103","trae-inspector-end-column":"6","trae-inspector-file-path":"src/components/MatrixBackground.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",ref:o,className:`fixed inset-0 pointer-events-none ${a}`,style:{zIndex:0}})}const createStoreImpl=s=>{let e;const t=new Set,n=(p,m)=>{const d=typeof p=="function"?p(e):p;if(!Object.is(d,e)){const x=e;e=m??(typeof d!="object"||d===null)?d:Object.assign({},e,d),t.forEach(h=>h(e,x))}},a=()=>e,c={setState:n,getState:a,getInitialState:()=>l,subscribe:p=>(t.add(p),()=>t.delete(p))},l=e=s(n,a,c);return c},createStore=(s=>s?createStoreImpl(s):createStoreImpl),identity=s=>s;function useStore(s,e=identity){const t=React.useSyncExternalStore(s.subscribe,React.useCallback(()=>e(s.getState()),[s,e]),React.useCallback(()=>e(s.getInitialState()),[s,e]));return React.useDebugValue(t),t}const createImpl=s=>{const e=createStore(s),t=n=>useStore(e,n);return Object.assign(t,e),t},create=(s=>s?createImpl(s):createImpl),chatStyles=[{id:"professional",name:"专业",emoji:"💼",description:"严谨专业的回答风格"},{id:"warm",name:"温暖共情",emoji:"❤️",description:"亲切温暖的沟通方式"},{id:"humorous",name:"幽默",emoji:"😄",description:"轻松幽默的表达方式"},{id:"minimal",name:"极简",emoji:"⚡",description:"简洁高效的回答风格"},{id:"creative",name:"创意",emoji:"🎨",description:"富有创意的思考方式"}],useChatStore=create(s=>({messages:[],isStreaming:!1,chatStyle:"professional",addMessage:e=>s(t=>({messages:[...t.messages,e]})),updateMessage:(e,t)=>s(n=>({messages:n.messages.map(a=>a.id===e?{...a,...t}:a)})),clearMessages:()=>s({messages:[]}),setStreaming:e=>s({isStreaming:e}),setChatStyle:e=>s({chatStyle:e})})),initialAgents=[{id:"chairman",name:"董事长",role:"CEO / 最高决策者",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"决策层"},{id:"cto",name:"技术总监",role:"CTO / 技术负责人",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"决策层"},{id:"pm",name:"产品经理",role:"Product Manager",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"产品部"},{id:"analyst",name:"分析员",role:"Business Analyst",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"产品部"},{id:"ux-designer",name:"UX设计师",role:"UX/UI Designer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"设计部"},{id:"ui-designer",name:"UI设计师",role:"UI Designer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"设计部"},{id:"arch",name:"架构师",role:"System Architect",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"tech-lead",name:"技术主管",role:"Tech Lead",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-1",name:"代码员小绿",role:"前端工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-2",name:"代码员小蓝",role:"后端工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-3",name:"代码员小紫",role:"全栈工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-4",name:"代码员小青",role:"测试工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"coder-5",name:"代码员小橙",role:"数据库工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"devops",name:"运维工程师",role:"DevOps Engineer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"技术部"},{id:"inspector-1",name:"检查员甲",role:"代码审查员",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"质量部"},{id:"inspector-2",name:"检查员乙",role:"质量保证员",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"质量部"},{id:"qa-lead",name:"测试主管",role:"QA Lead",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"质量部"},{id:"expander",name:"扩展员",role:"战略规划师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"战略部"},{id:"researcher",name:"研究员",role:"AI Researcher",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"研发部"},{id:"data-scientist",name:"数据科学家",role:"Data Scientist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"研发部"},{id:"packer",name:"打包员",role:"构建工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"运维部"},{id:"deliverer",name:"输送员",role:"部署工程师",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"运维部"},{id:"doc-writer",name:"文档工程师",role:"Technical Writer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"文档部"},{id:"hr",name:"人事专员",role:"HR Specialist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"人事部"},{id:"finance",name:"财务专员",role:"Finance Specialist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"财务部"},{id:"marketing",name:"市场专员",role:"Marketing Specialist",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"市场部"},{id:"customer-service",name:"客服专员",role:"Customer Service",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"客服部"},{id:"security",name:"安全工程师",role:"Security Engineer",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"安全部"},{id:"legal",name:"法务顾问",role:"Legal Counsel",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"法务部"},{id:"sys-admin",name:"系统管理员",role:"System Admin",status:"idle",progress:0,currentTask:"",lastActive:Date.now(),department:"运维部"}],useAgentStore=create(s=>({agents:initialAgents,updateAgentStatus:(e,t)=>s(n=>({agents:n.agents.map(a=>a.id===e?{...a,status:t,lastActive:Date.now()}:a)})),setAgentProgress:(e,t,n)=>s(a=>({agents:a.agents.map(o=>o.id===e?{...o,progress:t,currentTask:n??o.currentTask,lastActive:Date.now()}:o)})),resetAllAgents:()=>s({agents:initialAgents.map(e=>({...e,status:"idle",progress:0,currentTask:"",lastActive:Date.now()}))})}));function createJSONStorage(s,e){let t;try{t=s()}catch{return}return{getItem:a=>{var o;const i=l=>l===null?null:JSON.parse(l,void 0),c=(o=t.getItem(a))!=null?o:null;return c instanceof Promise?c.then(i):i(c)},setItem:(a,o)=>t.setItem(a,JSON.stringify(o,void 0)),removeItem:a=>t.removeItem(a)}}const toThenable=s=>e=>{try{const t=s(e);return t instanceof Promise?t:{then(n){return toThenable(n)(t)},catch(n){return this}}}catch(t){return{then(n){return this},catch(n){return toThenable(n)(t)}}}},persistImpl=(s,e)=>(t,n,a)=>{let o={storage:createJSONStorage(()=>window.localStorage),partialize:f=>f,version:0,merge:(f,k)=>({...k,...f}),...e},i=!1,c=0;const l=new Set,p=new Set;let m=o.storage;if(!m)return s((...f)=>{console.warn(`[zustand persist middleware] Unable to update item '${o.name}', the given storage is currently unavailable.`),t(...f)},n,a);const d=()=>{const f=o.partialize({...n()});return m.setItem(o.name,{state:f,version:o.version})},x=a.setState;a.setState=(f,k)=>(x(f,k),d());const h=s((...f)=>(t(...f),d()),n,a);a.getInitialState=()=>h;let F;const u=()=>{var f,k;if(!m)return;const y=++c;i=!1,l.forEach(b=>{var C;return b((C=n())!=null?C:h)});const g=((k=o.onRehydrateStorage)==null?void 0:k.call(o,(f=n())!=null?f:h))||void 0;return toThenable(m.getItem.bind(m))(o.name).then(b=>{if(b)if(typeof b.version=="number"&&b.version!==o.version){if(o.migrate){const C=o.migrate(b.state,b.version);return C instanceof Promise?C.then(R=>[!0,R]):[!0,C]}console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,b.state];return[!1,void 0]}).then(b=>{var C;if(y!==c)return;const[R,j]=b;if(F=o.merge(j,(C=n())!=null?C:h),t(F,!0),R)return d()}).then(()=>{y===c&&(g==null||g(n(),void 0),F=n(),i=!0,p.forEach(b=>b(F)))}).catch(b=>{y===c&&(g==null||g(void 0,b))})};return a.persist={setOptions:f=>{o={...o,...f},f.storage&&(m=f.storage)},clearStorage:()=>{m==null||m.removeItem(o.name)},getOptions:()=>o,rehydrate:()=>u(),hasHydrated:()=>i,onHydrate:f=>(l.add(f),()=>{l.delete(f)}),onFinishHydration:f=>(p.add(f),()=>{p.delete(f)})},o.skipHydration||u(),F||h},persist=persistImpl,sampleEntries=[{id:"supreme-command",title:"最高用户指令",content:`## 给TRAE的一封指令

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
- 全链路日志监控`,tags:["nexus-1","project-genesis","智能体","fastapi","react","rag"],category:"AI/智能体",createdAt:Date.now()-864e5*27,source:"项目需求文档"}],useKnowledgeStore=create()(persist((s,e)=>({entries:sampleEntries,selectedEntry:null,searchQuery:"",isLoadingBackend:!1,backendTotal:0,backendError:null,addEntry:t=>s(n=>n.entries.some(a=>a.id===t.id)?n:{entries:[t,...n.entries]}),deleteEntry:t=>s(n=>({entries:n.entries.filter(a=>a.id!==t)})),selectEntry:t=>s({selectedEntry:t}),setSearch:t=>s({searchQuery:t}),resetToDefault:()=>s({entries:sampleEntries}),loadFromBackend:async()=>{var t,n;s({isLoadingBackend:!0,backendError:null});try{const a=await fetch("/api/knowledge");if(!a.ok)throw new Error(`后端知识库加载失败: ${a.status}`);const o=await a.json();if(!o.success)throw new Error("后端返回数据格式错误");const i=Array.isArray(o.data)?o.data:((t=o.data)==null?void 0:t.entries)||[],c=Array.isArray(o.data)?o.data.length:((n=o.data)==null?void 0:n.total)||i.length,l=i.map(d=>({id:d.id||Date.now().toString(36)+Math.random().toString(36).slice(2,9),title:d.title||"未命名",content:d.content||"",category:d.category||"未分类",tags:Array.isArray(d.tags)?d.tags:[],importance:typeof d.importance=="number"?d.importance:5,source:d.source||"backend",createdAt:typeof d.createdAt=="number"?d.createdAt:new Date(d.createdAt||Date.now()).getTime()})),p=new Set(e().entries.map(d=>d.id)),m=l.filter(d=>!p.has(d.id));s(d=>({entries:[...d.entries,...m],backendTotal:c,isLoadingBackend:!1}))}catch(a){s({isLoadingBackend:!1,backendError:a instanceof Error?a.message:"未知错误"})}}}),{name:"hopeai-knowledge-store",storage:createJSONStorage(()=>localStorage),version:2,partialize:s=>({entries:s.entries}),merge:(s,e)=>{const t=s,n=(t==null?void 0:t.entries)||[],a=new Set(sampleEntries.map(i=>i.id)),o=n.filter(i=>!a.has(i.id));return{...e,entries:[...o,...sampleEntries]}}})),useKnowledgeStore$1=Object.freeze(Object.defineProperty({__proto__:null,useKnowledgeStore},Symbol.toStringTag,{value:"Module"})),useThemeStore=create()(persist(s=>({theme:"cyber",fontSize:14,animationsEnabled:!0,selfLearning:!0,autoKnowledge:!0,workflowSpeed:2,setTheme:e=>s({theme:e}),setFontSize:e=>s({fontSize:e}),toggleAnimations:()=>s(e=>({animationsEnabled:!e.animationsEnabled})),toggleSelfLearning:()=>s(e=>({selfLearning:!e.selfLearning})),toggleAutoKnowledge:()=>s(e=>({autoKnowledge:!e.autoKnowledge})),setWorkflowSpeed:e=>s({workflowSpeed:e})}),{name:"hopeai-theme-store",storage:createJSONStorage(()=>localStorage)}));class VirtualFileSystem{constructor(){T(this,"files",new Map);T(this,"STORAGE_KEY","hopeai_vfs");this.loadFromStorage()}loadFromStorage(){try{const e=localStorage.getItem(this.STORAGE_KEY);if(e){const t=JSON.parse(e);Object.entries(t).forEach(([n,a])=>{this.files.set(n,a)})}}catch{}}saveToStorage(){try{const e={};this.files.forEach((t,n)=>{e[n]=t}),localStorage.setItem(this.STORAGE_KEY,JSON.stringify(e))}catch{}}readFile(e){const t=this.files.get(this.normalizePath(e));return t?t.content:null}writeFile(e,t){const n=this.normalizePath(e),a=Date.now(),o=this.files.get(n);this.files.set(n,{path:n,content:t,createdAt:(o==null?void 0:o.createdAt)||a,updatedAt:a}),this.saveToStorage()}fileExists(e){return this.files.has(this.normalizePath(e))}listFiles(e="/"){const t=this.normalizePath(e),n=t==="/"?"/":t+"/",a=new Map;return this.files.forEach((o,i)=>{if(i.startsWith(n)&&i!==t){const l=i.slice(n.length).split("/"),p=l[0];l.length===1?a.set(p,{type:"file",size:o.content.length}):a.has(p)||a.set(p,{type:"directory",size:0})}}),Array.from(a.entries()).map(([o,i])=>({name:o,...i})).sort((o,i)=>o.type!==i.type?o.type==="directory"?-1:1:o.name.localeCompare(i.name))}deleteFile(e){const t=this.normalizePath(e),n=this.files.delete(t);return n&&this.saveToStorage(),n}searchFiles(e,t,n){const a=this.normalizePath(e),o=[];let i;try{i=new RegExp(t)}catch{return o}const c=n?this.globToRegex(n):null;return this.files.forEach((l,p)=>{if(!p.startsWith(a==="/"?"/":a+"/")||c&&!c.test(p.split("/").pop()||""))return;l.content.split(`
`).forEach((d,x)=>{i.test(d)&&o.push({file:p,line:x+1,match:d.trim()})})}),o.slice(0,100)}normalizePath(e){return e.startsWith("/")||(e="/"+e),e=e.replace(/\/+/g,"/"),e.length>1&&e.endsWith("/")&&(e=e.slice(0,-1)),e}globToRegex(e){const t=e.replace(/\./g,"\\.").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp("^"+t+"$")}getAllFilesCount(){return this.files.size}clear(){this.files.clear(),this.saveToStorage()}}const vfs=new VirtualFileSystem,MAX_OUTPUT_LINES=200,MAX_OUTPUT_CHARS=1e4;function truncateOutput(s){const e=s.split(`
`);return e.length>MAX_OUTPUT_LINES?e.slice(0,MAX_OUTPUT_LINES).join(`
`)+`

... (输出已截断，共 ${e.length} 行，仅显示前 ${MAX_OUTPUT_LINES} 行)`:s.length>MAX_OUTPUT_CHARS?s.slice(0,MAX_OUTPUT_CHARS)+`

... (输出已截断，总长度 ${s.length} 字符)`:s}function formatWithLineNumbers(s,e=1){const t=s.split(`
`),n=String(e+t.length-1).length;return t.map((a,o)=>`${String(e+o).padStart(n," ")}│ ${a}`).join(`
`)}function checkSyntax(s,e){var n;const t=(n=e.split(".").pop())==null?void 0:n.toLowerCase();if(t==="json")try{return JSON.parse(s),{valid:!0}}catch(a){return{valid:!1,error:`JSON 语法错误: ${a instanceof Error?a.message:"未知错误"}`}}if(t==="js"||t==="ts"||t==="jsx"||t==="tsx"||t==="mjs"||t==="cjs")try{return new Function(s),{valid:!0}}catch(a){const o=a instanceof Error?a.message:"未知错误";return o.includes("Unexpected")||o.includes("SyntaxError")?{valid:!1,error:`JavaScript 语法错误: ${o}`}:{valid:!0}}if(t==="html"){const a=s.match(/<[a-z][^>]*>/gi)||[],o=s.match(/<\/[a-z][^>]*>/gi)||[];return a.length-o.length>5?{valid:!1,error:"HTML 标签不匹配，可能存在未闭合标签"}:{valid:!0}}if(t==="css"){const a=(s.match(/\{/g)||[]).length,o=(s.match(/\}/g)||[]).length;return a!==o?{valid:!1,error:`CSS 大括号不匹配: { ${a} 个, } ${o} 个`}:{valid:!0}}return{valid:!0}}class ToolEngine{constructor(){T(this,"tools",new Map);this.registerBuiltinTools()}registerBuiltinTools(){this.registerTool({id:"aci_view",name:"ACI 文件查看",description:"查看文件内容，自动带行号，支持范围读取",category:"aci",parameters:[{name:"path",type:"string",required:!0,description:"文件路径"},{name:"start_line",type:"number",required:!1,description:"起始行号",defaultValue:"1"},{name:"end_line",type:"number",required:!1,description:"结束行号"}],execute:async e=>await aciView(e.path,parseInt(e.start_line||"1"),e.end_line?parseInt(e.end_line):void 0)}),this.registerTool({id:"aci_edit",name:"ACI 精确编辑",description:"通过 old/new 字符串匹配精确替换代码，自动语法检查",category:"aci",parameters:[{name:"path",type:"string",required:!0,description:"文件路径"},{name:"old_str",type:"string",required:!0,description:"要替换的原始字符串"},{name:"new_str",type:"string",required:!0,description:"新的字符串"}],execute:async e=>await aciEdit(e.path,e.old_str,e.new_str)}),this.registerTool({id:"aci_create",name:"ACI 创建文件",description:"创建新文件，自动语法检查",category:"aci",parameters:[{name:"path",type:"string",required:!0,description:"文件路径"},{name:"content",type:"string",required:!0,description:"文件内容"},{name:"overwrite",type:"boolean",required:!1,description:"是否覆盖已有文件",defaultValue:"false"}],execute:async e=>await aciCreate(e.path,e.content,e.overwrite==="true")}),this.registerTool({id:"aci_search",name:"ACI 代码搜索",description:"在文件系统中搜索代码，支持正则和文件类型过滤",category:"aci",parameters:[{name:"path",type:"string",required:!1,description:"搜索起始路径",defaultValue:"/"},{name:"pattern",type:"string",required:!0,description:"搜索模式（正则表达式）"},{name:"file_pattern",type:"string",required:!1,description:"文件名过滤（支持通配符，如 *.ts）"}],execute:async e=>await aciSearch(e.path||"/",e.pattern,e.file_pattern)}),this.registerTool({id:"aci_list",name:"ACI 目录列表",description:"列出目录下的文件和子目录",category:"aci",parameters:[{name:"path",type:"string",required:!1,description:"目录路径",defaultValue:"/"}],execute:async e=>await aciList(e.path||"/")}),this.registerTool({id:"aci_delete",name:"ACI 删除文件",description:"删除指定文件（危险操作，需确认）",category:"aci",parameters:[{name:"path",type:"string",required:!0,description:"文件路径"}],execute:async e=>await aciDelete(e.path)}),this.registerTool({id:"code_executor",name:"代码执行器",description:"执行JavaScript代码片段",category:"code",parameters:[{name:"code",type:"string",required:!0,description:"要执行的代码"}],execute:async e=>await executeCode(e.code)}),this.registerTool({id:"calculator",name:"计算器",description:"执行数学计算",category:"calculator",parameters:[{name:"expression",type:"string",required:!0,description:"数学表达式"}],execute:async e=>await calculateExpression(e.expression)}),this.registerTool({id:"json_parser",name:"JSON解析器",description:"解析和格式化JSON数据",category:"other",parameters:[{name:"json_string",type:"string",required:!0,description:"JSON字符串"}],execute:async e=>await parseJson(e.json_string)}),this.registerTool({id:"regex_test",name:"正则表达式测试",description:"测试正则表达式匹配",category:"other",parameters:[{name:"pattern",type:"string",required:!0,description:"正则表达式"},{name:"text",type:"string",required:!0,description:"测试文本"}],execute:async e=>await testRegex(e.pattern,e.text)})}registerTool(e){this.tools.set(e.id,e)}getTool(e){return this.tools.get(e)}getAllTools(){return Array.from(this.tools.values())}getToolsByCategory(e){return Array.from(this.tools.values()).filter(t=>t.category===e)}async executeTool(e,t){const n=this.tools.get(e);if(!n)return{success:!1,output:`工具 ${e} 未找到`,error:`工具 ${e} 不存在`,type:"text"};const a=n.parameters.filter(o=>o.required&&!(o.name in t)).map(o=>o.name);if(a.length>0)return{success:!1,output:`缺少必需参数: ${a.join(", ")}`,error:`缺少参数 ${a.join(", ")}`,type:"text"};try{return await n.execute(t)}catch(o){return{success:!1,output:`执行失败: ${o instanceof Error?o.message:"未知错误"}`,error:o instanceof Error?o.message:"未知错误",type:"text"}}}}async function aciView(s,e,t){const n=vfs.readFile(s);if(n===null)return{success:!1,output:`文件不存在: ${s}`,error:"File not found",type:"text"};const a=n.split(`
`),o=Math.max(1,e),i=t?Math.min(a.length,t):a.length;if(o>a.length)return{success:!1,output:`起始行号 ${o} 超出文件范围（共 ${a.length} 行）`,error:"Line out of range",type:"text"};const c=a.slice(o-1,i).join(`
`);return{success:!0,output:formatWithLineNumbers(c,o),type:"code"}}async function aciEdit(s,e,t){const n=vfs.readFile(s);if(n===null)return{success:!1,output:`文件不存在: ${s}`,error:"File not found",type:"text"};const a=(n.match(new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))||[]).length;if(a===0){const l=n.slice(0,200);return{success:!1,output:`未找到匹配的字符串！

要查找的字符串:
${e}

文件开头预览:
${l}...`,error:"No match found",type:"text"}}if(a>1)return{success:!1,output:`找到 ${a} 处匹配，无法确定替换哪一处。请提供更精确的字符串（包含更多上下文）。`,error:"Multiple matches",type:"text"};const o=n.replace(e,t),i=checkSyntax(o,s);return i.valid?(vfs.writeFile(s,o),{success:!0,output:`✓ 替换成功（约第 ${n.split(`
`).findIndex((l,p)=>n.split(`
`).slice(0,p).join(`
`).length+l.length>=n.indexOf(e))+1} 行）

替换前:
${e}

替换后:
${t}`,type:"code"}):{success:!1,output:`编辑被拒绝！${i.error}

为了保证代码完整性，本次修改未保存。`,error:i.error,type:"text"}}async function aciCreate(s,e,t){const n=vfs.fileExists(s);if(n&&!t)return{success:!1,output:`文件已存在: ${s}
如需覆盖，请设置 overwrite=true`,error:"File already exists",type:"text"};const a=checkSyntax(e,s);if(!a.valid)return{success:!1,output:`创建被拒绝！${a.error}`,error:a.error,type:"text"};vfs.writeFile(s,e);const o=e.split(`
`).length;return{success:!0,output:`✓ 文件${n?"覆盖":"创建"}成功: ${s}
文件大小: ${e.length} 字节 / ${o} 行`,type:"text"}}async function aciSearch(s,e,t){let n;try{n=new RegExp(e)}catch(c){return{success:!1,output:`正则表达式错误: ${c instanceof Error?c.message:"未知错误"}`,error:"Invalid regex",type:"text"}}const a=vfs.searchFiles(s,e,t);if(a.length===0)return{success:!0,output:`未找到匹配项。
搜索路径: ${s}
搜索模式: ${e}${t?`
文件过滤: ${t}`:""}`,type:"text"};const o=new Map;a.forEach(c=>{o.has(c.file)||o.set(c.file,[]),o.get(c.file).push(c)});let i=`找到 ${a.length} 处匹配（来自 ${o.size} 个文件）:

`;return o.forEach((c,l)=>{i+=`📄 ${l}
`,c.forEach(p=>{const m=p.match.length>80?p.match.slice(0,80)+"...":p.match;i+=`  ${p.line}: ${m}
`}),i+=`
`}),i=truncateOutput(i),{success:!0,output:i,type:"text"}}async function aciList(s){const e=vfs.listFiles(s);if(e.length===0)return!vfs.fileExists(s)&&s!=="/"?{success:!1,output:`目录不存在: ${s}`,error:"Directory not found",type:"text"}:{success:!0,output:`目录为空: ${s}`,type:"text"};let t=`目录: ${s}

`;return e.forEach(n=>{const a=n.type==="directory"?"📁":"📄",o=n.type==="file"?` (${n.size} B)`:"";t+=`${a} ${n.name}${o}
`}),{success:!0,output:t,type:"text"}}async function aciDelete(s){return s==="/"||s===""?{success:!1,output:"🚫 危险操作！不能删除根目录",error:"Dangerous operation blocked",type:"text"}:vfs.fileExists(s)?(vfs.deleteFile(s),{success:!0,output:`✓ 已删除: ${s}`,type:"text"}):{success:!1,output:`文件不存在: ${s}`,error:"File not found",type:"text"}}async function executeCode(code){try{const sanitizedCode=sanitizeCode(code);let result;typeof window<"u"&&window.eval?result=await eval(`(async () => { ${sanitizedCode} })()`):result=new Function(sanitizedCode)();let output="";return result!=null&&(output=typeof result=="object"?JSON.stringify(result,null,2):String(result)),{success:!0,output:output||"代码执行完成，无返回值",type:"code"}}catch(s){return{success:!1,output:`执行错误: ${s instanceof Error?s.message:"未知错误"}`,error:s instanceof Error?s.message:"未知错误",type:"text"}}}function sanitizeCode(s){return[/(eval|Function)\s*\(/g,/(document\.|window\.)/g,/(localStorage|sessionStorage)/g,/(XMLHttpRequest|fetch)\s*\(/g].reduce((t,n)=>t.replace(n,"[安全限制]"),s)}async function calculateExpression(s){try{const e=s.replace(/[^0-9+\-*/().%^√πe\s]/g,""),t={pi:Math.PI,e:Math.E,sqrt:Math.sqrt,pow:Math.pow,abs:Math.abs,sin:Math.sin,cos:Math.cos,tan:Math.tan,log:Math.log,log10:Math.log10,exp:Math.exp},n=new Function(...Object.keys(t),`return ${e};`)(...Object.values(t));return{success:!0,output:`${s} = ${n}`,type:"text"}}catch(e){return{success:!1,output:`计算错误: ${e instanceof Error?e.message:"未知错误"}`,error:e instanceof Error?e.message:"未知错误",type:"text"}}}async function parseJson(s){try{const e=JSON.parse(s);return{success:!0,output:JSON.stringify(e,null,2),type:"json"}}catch(e){return{success:!1,output:`JSON解析错误: ${e instanceof Error?e.message:"未知错误"}`,error:e instanceof Error?e.message:"未知错误",type:"text"}}}async function testRegex(s,e){try{const t=new RegExp(s),n=e.match(t),a=t.test(e),o={pattern:s,found:a,matches:n||[],matchCount:n?n.length:0};return{success:!0,output:JSON.stringify(o,null,2),type:"json"}}catch(t){return{success:!1,output:`正则表达式错误: ${t instanceof Error?t.message:"未知错误"}`,error:t instanceof Error?t.message:"未知错误",type:"text"}}}new ToolEngine;const delay$2=s=>new Promise(e=>setTimeout(e,s));function searchKnowledge$1(s,e=3){try{const t=useKnowledgeStore.getState().entries;if(!t||t.length===0)return"";const n=s.toLowerCase(),a=n.split(/[\s,，。、！？]+/).filter(l=>l.length>1),i=t.map(l=>{let p=0;const m=l.title.toLowerCase(),d=l.content.toLowerCase(),x=l.tags.map(h=>h.toLowerCase()).join(" ");for(const h of a)m.includes(h)&&(p+=3),x.includes(h)&&(p+=2),d.includes(h)&&(p+=1);for(const h of l.tags)n.includes(h.toLowerCase())&&h.length>1&&(p+=2);return{entry:l,score:p}}).filter(l=>l.score>0).sort((l,p)=>p.score-l.score).slice(0,e);return i.length===0?"":i.map((l,p)=>`【参考${p+1}】${l.entry.title}
${l.entry.content.slice(0,500)}...`).join(`

`)}catch{return""}}const analystTemplate={id:"analyst",name:"分析员",role:"需求分析师",avatar:"🔍",description:"接收命令后生成分析报告，拆解需求、提出方案、列出步骤",tools:["aci_view","aci_search","aci_list","calculator","json_parser"],generateResponse:async s=>{await delay$2(800+Math.random()*1200);const e=detectProjectType(s),t=searchKnowledge$1(s,3),a=(()=>{const x=s.match(/[\u4e00-\u9fa5a-zA-Z_]{2,}/g)??[],h=new Set(["需求","设计","方案","系统","功能","实现","一个","我们","帮我","开发","请","the","a","an","of","and","to","for","with"]),F=x.filter(u=>!h.has(u.toLowerCase()));return F.length>0?F.slice(0,5):["核心功能"]})(),o={"python-backend":{stack:["FastAPI - 现代 async Web 框架","SQLAlchemy 2.0 - 异步 ORM","Pydantic - 类型校验与序列化","Uvicorn - ASGI 高性能服务器","Alembic - 数据库迁移"],architecture:"分层架构：Router → Service → Repository，配合依赖注入与异步 IO",riskFocus:"异步上下文传播、数据库连接池耗尽、Pydantic 模型校验遗漏"},"ai-agent":{stack:["LangChain - LLM 编排框架","ChromaDB - 向量记忆库","OpenAI API - 大语言模型","ReAct 算法 - 推理-行动循环","Tavily - 联网搜索工具"],architecture:"ReAct 闭环 + RAG 检索增强，配合长期记忆与工具调度器",riskFocus:"ReAct 死循环、Token 超限、记忆污染、工具调用安全性"},"react-frontend":{stack:["React 18 - UI 视图框架","TypeScript - 类型安全","TailwindCSS - 原子化样式","Vite - 极速构建工具","Zustand - 轻量状态管理"],architecture:"组件化设计 + Hooks 复用，按页面/组件/Hook/Store 分层",riskFocus:"状态管理复杂度、首屏加载性能、可访问性、SSR/CSR 一致性"},database:{stack:["MySQL 8 / PostgreSQL 16 - 关系型数据库","Redis 7 - 缓存与会话","Prisma / SQLAlchemy - ORM","Flyway - 版本化迁移","pgvector - 向量扩展"],architecture:"主从读写分离 + 分库分表，配合 Redis 缓存层与慢查询监控",riskFocus:"索引设计、SQL 注入、事务隔离级别、数据一致性"},general:{stack:["TypeScript - 类型安全基础","Vite - 构建工具","ESLint + Prettier - 代码规范","Vitest - 单元测试","Docker - 容器化部署"],architecture:"模块化 + 配置中心化，遵循 SOLID 原则与单一职责",riskFocus:"需求变更频繁、依赖版本升级、配置管理混乱"}},i=o[e]??o.general,c=Math.max(3,Math.min(a.length+1,6)),l=(x,h)=>x*h,p=a.map((x,h)=>`${h+1}. ${x} 模块 - 围绕「${x}」的核心业务逻辑与数据流`).join(`
`),m=[{task:"需求确认与方案设计",time:l(10,1)},{task:"核心功能开发",time:l(15,c)},{task:"接口联调与代码审查",time:l(8,c)},{task:"测试与部署上线",time:l(12,1)}],d=m.reduce((x,h)=>x+h.time,0);return`## 需求分析报告

### 一、需求拆解
**原始需求**：${s}

**项目类型识别**：\`${e}\`

**核心目标**：
- 目标1：解析「${a[0]??"核心功能"}」相关的核心诉求
- 目标2：界定功能边界，识别 ${a.length} 个关键模块
- 目标3：制定与「${s.slice(0,30)}」相匹配的可执行路径

**功能模块**（基于指令关键词提取）：
${p}

### 二、技术方案
**推荐技术栈**（适配 ${e} 类型）：
${i.stack.map(x=>`- ${x}`).join(`
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

**总预计耗时**：约 ${d}min

### 四、风险评估
- 潜在风险：${i.riskFocus}
- 需求相关风险：实现「${a[0]??"核心功能"}」时可能涉及外部依赖与边界情况
- 应对措施：采用迭代开发模式，先实现 MVP 再逐步完善；针对上述风险编写回归测试

---
*请确认以上分析是否符合「${s.slice(0,20)}」的预期，或提出调整意见。*${t?`

---
📚 **知识库参考**（RAG检索）

${t}`:""}`}};function detectProjectType(s){const e=s.toLowerCase();return e.includes("python")||e.includes("fastapi")||e.includes("flask")||e.includes("django")||e.includes("后端")||e.includes("backend")||e.includes("api接口")||e.includes("main.py")||e.includes("agent_core")||e.includes("memory_store")?"python-backend":e.includes("react")||e.includes("vue")||e.includes("前端")||e.includes("frontend")||e.includes("组件")||e.includes("ui界面")||e.includes("tsx")||e.includes("next.js")||e.includes("tailwind")?"react-frontend":e.includes("sql")||e.includes("数据库")||e.includes("database")||e.includes("建表")||e.includes("mysql")||e.includes("postgres")||e.includes("create table")?"database":e.includes("ai")||e.includes("智能体")||e.includes("agent")||e.includes("langchain")||e.includes("autogen")||e.includes("llm")||e.includes("rag")||e.includes("react算法")||e.includes("向量")||e.includes("chromadb")||e.includes("记忆库")?"ai-agent":"general"}const coderATemplate={id:"coder-a",name:"代码员A",role:"核心架构工程师",avatar:"🎨",description:"根据需求类型生成完整的核心架构代码",tools:["aci_view","aci_edit","aci_create","aci_search","aci_list","aci_delete","code_executor","calculator","regex_test"],generateResponse:async s=>{await delay$2(1e3+Math.random()*1500);const e=detectProjectType(s);let t="";return e==="python-backend"?t=`\`\`\`python
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
\`\`\``:e==="ai-agent"?t=`\`\`\`python
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
\`\`\``:e==="database"?t=`\`\`\`sql
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
\`\`\``:e==="react-frontend"?t=`\`\`\`tsx
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
\`\`\``:t=`\`\`\`typescript
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
针对「${s}」的需求，检测到项目类型为：**${e}**

### 架构设计
- **模块化设计**：各功能解耦，独立开发与测试
- **插件化架构**：新功能通过插件注册机制接入，不修改核心代码
- **配置中心化**：所有API Key和参数通过 .env 管理

### 核心代码实现

${t}

### 设计要点
1. 采用 ReAct 算法实现"思考-行动-观察"闭环
2. RAG 检索增强，降低幻觉率
3. 动态上下文窗口管理，自动压缩旧对话
4. 全链路日志记录，便于性能复盘

---
*核心架构开发完成，代码可直接复制使用。*${searchKnowledge$1(s,2)?`

📚 **知识库参考**

${searchKnowledge$1(s,2)}`:""}`}},coderBTemplate={id:"coder-b",name:"代码员B",role:"后端/逻辑工程师",avatar:"⚙️",description:"专注于后端服务开发、业务逻辑实现、API接口设计",tools:["aci_view","aci_edit","aci_create","aci_search","aci_list","aci_delete","code_executor","json_parser","calculator"],generateResponse:async s=>{await delay$2(1200+Math.random()*1500);const e=detectProjectType(s);let t="",n="";return e==="python-backend"?(n="基于 FastAPI 的 RESTful API 路由层，提供任务的增删改查接口，包含参数校验、异常处理与统一响应格式",t=`\`\`\`python
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
\`\`\``):e==="ai-agent"?(n="为智能体构建可扩展的插件系统，包含搜索插件与代码沙箱插件，统一接口契约便于动态加载",t=`\`\`\`python
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
\`\`\``):e==="react-frontend"?(n="基于 TypeScript 的 API 请求封装层，统一拦截器、错误处理、类型推导与请求/响应转换",t=`\`\`\`typescript
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
\`\`\``):e==="database"?(n="数据库操作层封装，使用 SQLAlchemy 2.0 异步 ORM，统一 Session 管理、CRUD 仓储模式与事务控制",t=`\`\`\`python
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
\`\`\``):(n="通用工具函数集合，覆盖深拷贝、防抖节流、日期格式化与唯一 ID 生成等高频场景",t=`\`\`\`typescript
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
针对「${s}」的业务需求，后端服务设计如下：

- **项目类型识别**：\`${e}\`
- **方案概要**：${n}
- **分层架构**：Controller/Router → Service → Repository，职责清晰分离
- **错误处理**：统一异常捕获，返回标准化错误结构
- **数据校验**：基于 Schema 的入参验证，确保数据完整性

### 核心代码示例

${t}

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
*后端逻辑开发完成，代码已根据「${s}」动态生成，注重质量与稳定性。*`}},coderCTemplate={id:"coder-c",name:"代码员C",role:"架构/优化工程师",avatar:"🏗️",description:"专注于系统架构设计、性能优化、代码重构",tools:["aci_view","aci_edit","aci_create","aci_search","aci_list","aci_delete","code_executor","calculator","regex_test"],generateResponse:async s=>{await delay$2(1500+Math.random()*2e3);const e=detectProjectType(s);let t="",n="";return e==="python-backend"?(n="Python 中间件链与全局错误处理架构，构建可观测、可恢复的后端骨架",t=`\`\`\`python
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
\`\`\``):e==="ai-agent"?(n="ReAct 算法引擎与任务调度器架构，支持多轮思考-行动-观察循环与工具调度",t=`\`\`\`python
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
\`\`\``):e==="react-frontend"?(n="React 状态管理与路由架构，结合 Zustand 全局状态、React Router 分级路由与懒加载",t=`\`\`\`typescript
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
\`\`\``):e==="database"?(n="数据库索引与查询优化方案，覆盖索引设计、慢查询排查、读写分离与分库分表",t=`\`\`\`sql
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
\`\`\``):(n="通用依赖注入容器，支持单例/瞬态生命周期、懒加载与服务解析",t=`\`\`\`typescript
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
针对「${s}」的系统架构进行深入分析与优化：

- **项目类型识别**：\`${e}\`
- **架构重点**：${n}

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

${t}

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
*架构分析与优化建议已完成，代码已根据「${s}」动态生成，系统可扩展性和性能将显著提升。*`}},coderDTemplate={id:"coder-d",name:"代码员D",role:"测试/质量工程师",avatar:"🧪",description:"专注于单元测试、集成测试、测试用例设计、质量保障",tools:["code_executor","calculator"],generateResponse:async s=>{await delay$2(1e3+Math.random()*1500);const e=detectProjectType(s);let t="",n="";return e==="python-backend"?(n="使用 pytest + httpx 测试 FastAPI 接口，覆盖成功路径、参数校验与异常分支",t=`\`\`\`python
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
\`\`\``):e==="ai-agent"?(n="Agent 行为测试，验证 ReAct 循环的思考-行动-观察步骤与工具调度正确性",t=`\`\`\`python
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
\`\`\``):e==="react-frontend"?(n="使用 vitest + @testing-library/react 测试 React 组件与 Hook，覆盖交互与异步行为",t=`\`\`\`typescript
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
\`\`\``):e==="database"?(n="数据库 CRUD 测试，验证数据写入、查询、更新与事务回滚行为",t=`\`\`\`python
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
\`\`\``):(n="通用单元测试模板，覆盖纯函数的边界条件与异常输入",t=`\`\`\`typescript
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
针对「${s}」的功能需求，制定全面的测试策略：

- **项目类型识别**：\`${e}\`
- **测试重点**：${n}
- **单元测试**：覆盖所有核心函数和组件
- **集成测试**：验证模块间协作的正确性
- **端到端测试**：模拟用户操作流程
- **性能测试**：确保系统响应时间达标

### 测试代码示例

${t}

### 测试覆盖率目标
| 模块 | 目标覆盖率 | 优先级 |
|------|-----------|--------|
| 核心业务逻辑 | 95% | 高 |
| 工具函数 | 90% | 高 |
| UI组件 | 80% | 中 |
| API接口 | 85% | 中 |

---
*测试方案设计完成，用例已根据「${s}」动态生成，确保代码质量可靠。*`}},coderETemplate={id:"coder-e",name:"代码员E",role:"数据库/存储工程师",avatar:"🗄️",description:"专注于数据库设计、数据建模、存储优化、数据迁移",tools:["aci_view","aci_list","calculator","json_parser"],generateResponse:async s=>{await delay$2(1200+Math.random()*1500);const e=detectProjectType(s),t=()=>{const o=s.match(/[\u4e00-\u9fa5a-zA-Z_]{2,}/g);if(!o)return"item";const i=new Set(["需求","设计","数据库","建表","方案","系统","the","a","an","of","and","to"]),l=o.find(p=>!i.has(p.toLowerCase()))??"item";return/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(l)?l.toLowerCase():"item"};let n="",a="";if(e==="python-backend"){const o=t();a=`基于 SQLAlchemy 的 Python 数据库模型设计，与「${s}」中提及的实体对应`,n=`\`\`\`python
# models/${o}.py - SQLAlchemy 数据模型
from datetime import datetime
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class ${o.charAt(0).toUpperCase()+o.slice(1)}(Base):
    """${o} 主表 - 对应需求: ${s}"""
    __tablename__ = "${o}s"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True, comment="名称")
    description: Mapped[str | None] = mapped_column(Text, nullable=True, comment="描述")
    status: Mapped[str] = mapped_column(String(20), default="active", comment="状态")
    priority: Mapped[int] = mapped_column(Integer, default=0, comment="优先级")
    metadata_: Mapped[dict | None] = mapped_column("metadata", JSON, nullable=True, comment="扩展字段")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    items: Mapped[list["${o}Item"]] = relationship(back_populates="parent", cascade="all, delete-orphan")


class ${o.charAt(0).toUpperCase()+o.slice(1)}Item(Base):
    """${o} 子项表"""
    __tablename__ = "${o}_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey("${o}s.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    parent: Mapped["${o.charAt(0).toUpperCase()+o.slice(1)}"] = relationship(back_populates="items")


# models/base.py
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass
\`\`\``}else if(e==="ai-agent")a="向量数据库 + 长期记忆存储表设计，支撑 RAG 检索与对话历史管理",n=`\`\`\`sql
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
\`\`\``;else if(e==="react-frontend")a="前端本地存储方案，封装 localStorage 与 IndexedDB，支持版本化与过期清理",n=`\`\`\`typescript
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
\`\`\``;else if(e==="database"){const o=t();a=`与「${s}」相关的完整 SQL 建表语句，提取实体: ${o}`,n=`\`\`\`sql
-- 针对需求「${s}」的数据库设计方案
-- 实体名称: ${o}

-- 1. ${o} 主表
CREATE TABLE ${o}s (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(64) UNIQUE NOT NULL COMMENT '${o} 唯一编码',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${o} 主表';

-- 2. ${o} 明细表
CREATE TABLE ${o}_items (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id       BIGINT NOT NULL COMMENT '主表 ID',
  sku             VARCHAR(64) COMMENT '子项编码',
  title           VARCHAR(200) NOT NULL,
  content         TEXT,
  quantity        INT DEFAULT 1,
  unit_price      DECIMAL(12,2) DEFAULT 0.00,
  status          TINYINT DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES ${o}s(id) ON DELETE CASCADE,
  INDEX idx_parent_status (parent_id, status),
  INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${o} 明细表';

-- 3. ${o} 操作日志表
CREATE TABLE ${o}_logs (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  ${o}_id    BIGINT NOT NULL,
  operator_id     BIGINT,
  action          VARCHAR(50) NOT NULL COMMENT 'create/update/delete',
  before_data     JSON,
  after_data      JSON,
  ip_address      VARCHAR(45),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (${o}_id) REFERENCES ${o}s(id) ON DELETE CASCADE,
  INDEX idx_entity_time (${o}_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${o} 操作日志';

-- 4. 分类表（可选，用于归类）
CREATE TABLE ${o}_categories (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  parent_id       BIGINT DEFAULT 0,
  name            VARCHAR(100) NOT NULL,
  sort_order      INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='${o} 分类';
\`\`\``}else a="通用的用户表与配置表设计，覆盖大多数应用的基础数据存储需求",n=`\`\`\`sql
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
针对「${s}」的数据需求，设计如下数据模型：

- **项目类型识别**：\`${e}\`
- **存储重点**：${a}

#### 核心数据表设计

${n}

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
*数据库设计完成，方案已根据「${s}」动态生成，支持高并发与数据安全。*`}},reviewerTemplate={id:"reviewer",name:"检查员",role:"代码审查员",avatar:"🔎",description:"代码审查、Bug检测、质量评分",tools:["regex_test","calculator"],generateResponse:async s=>{await delay$2(1e3+Math.random()*1500);const e=detectProjectType(s),t={"python-backend":{focusAreas:["异步处理逻辑","类型注解完整性","异常捕获与回滚","依赖注入与生命周期"],scores:[{dimension:"代码规范",score:88,note:"符合 PEP8 与 Black 风格，少量导入顺序待调整"},{dimension:"类型安全",score:82,note:"Pydantic 模型完善，部分函数返回值未标注"},{dimension:"异步处理",score:85,note:"async/await 使用正确，存在阻塞调用隐患"},{dimension:"异常处理",score:78,note:"缺少业务异常分类与统一拦截中间件"},{dimension:"安全性",score:86,note:"参数校验到位，密钥管理建议改用 Vault"}],bugs:[{severity:"high",type:"异常处理",description:"async 路由未捕获数据库异常，导致 500 错误暴露堆栈",location:"routers/task_router.py:create_task"},{severity:"medium",type:"类型注解",description:"service 层函数返回值缺少类型标注，IDE 推断失败",location:"services/task_service.py:42"},{severity:"medium",type:"依赖注入",description:"数据库 Session 未通过 Depends 注入，难以测试",location:"routers/task_router.py:list_tasks"},{severity:"low",type:"异步处理",description:"在 async 函数中调用同步 time.sleep，阻塞事件循环",location:"services/task_service.py:88"},{severity:"low",type:"代码风格",description:"import 顺序不符合 isort 规范",location:"main.py:1-15"}],improvements:["为 service 层补充 Protocol/Type 注解，提升类型推导能力","使用 FastAPI Depends 注入数据库 Session，便于单元测试替换","统一异常基类 AppException，配合中间件返回标准化错误结构","使用 asyncio.sleep 替代 time.sleep，避免阻塞事件循环"],summary:"Python 后端代码整体结构清晰，需重点关注异步异常处理与依赖注入规范化。"},"ai-agent":{focusAreas:["ReAct 循环终止条件","记忆管理与上下文压缩","工具调用安全性","Token 消耗控制"],scores:[{dimension:"代码规范",score:86,note:"结构清晰，docstring 覆盖率较高"},{dimension:"类型安全",score:80,note:"dataclass 使用良好，工具入参 schema 偏弱"},{dimension:"Agent 行为",score:76,note:"ReAct 缺少强制终止，存在死循环风险"},{dimension:"记忆管理",score:78,note:"上下文压缩策略简单，长对话易超出窗口"},{dimension:"安全性",score:82,note:"沙箱已隔离，但工具白名单未严格校验"}],bugs:[{severity:"high",type:"ReAct 循环",description:"当 LLM 持续返回 Action 但无 Final Answer 时，循环无法跳出",location:"engine/react_engine.py:run"},{severity:"high",type:"Token 消耗",description:"未对 prompt 长度做截断，长对话会触发 max_tokens 错误",location:"engine/react_engine.py:_build_prompt"},{severity:"medium",type:"记忆丢失",description:"记忆库 retrieve 后未做相似度阈值过滤，污染上下文",location:"memory_store.py:retrieve"},{severity:"medium",type:"工具调用安全",description:"工具名直接来自 LLM 输出，未做白名单校验",location:"engine/react_engine.py:step"},{severity:"low",type:"可观测性",description:"工具调用未记录耗时与 tokens，难以复盘",location:"engine/react_engine.py:_run_tool"}],improvements:["为 ReAct 循环添加最大步数与超时双重熔断机制","在 prompt 构建时引入滑动窗口策略，超出阈值触发压缩摘要","对工具调用做白名单校验，禁止执行未注册工具","为每次工具调用记录 input/output/tokens/duration，便于成本分析"],summary:"AI Agent 实现具备完整 ReAct 骨架，但循环安全性与 Token 控制是首要风险点。"},"react-frontend":{focusAreas:["组件设计与拆分","Hooks 使用规范","性能优化","可访问性 (a11y)"],scores:[{dimension:"代码规范",score:90,note:"ESLint + Prettier 配置完善，命名规范统一"},{dimension:"类型安全",score:88,note:"TS 严格模式开启，少量 any 待收敛"},{dimension:"组件设计",score:82,note:"组件职责清晰，部分大组件可进一步拆分"},{dimension:"性能表现",score:80,note:"缺少 React.memo 与 useMemo，列表渲染存在重渲染"},{dimension:"可访问性",score:72,note:"交互元素缺少 aria 标签，键盘导航不完整"}],bugs:[{severity:"high",type:"可访问性",description:'可点击的 div 未加 role="button" 与 tabIndex，键盘用户无法操作',location:"components/TaskCard.tsx:18"},{severity:"medium",type:"性能优化",description:"列表未使用 key 或 memo，数据量大时明显卡顿",location:"components/TaskList.tsx:35"},{severity:"medium",type:"Hooks 使用",description:"useEffect 缺少依赖项，闭包导致状态读取过期",location:"hooks/useTask.ts:22"},{severity:"low",type:"组件设计",description:"单文件超过 300 行，建议按职责拆分",location:"pages/Dashboard.tsx"},{severity:"low",type:"类型安全",description:"事件处理器入参使用 any，应改为 React.ChangeEvent",location:"components/TaskForm.tsx:48"}],improvements:["为交互元素补充 aria-* 属性与键盘事件支持，符合 WCAG AA 标准","使用 React.memo + useMemo 优化大列表渲染，必要时引入虚拟列表","完善 useEffect 依赖数组，或使用 useEvent 抽象稳定回调","将超长组件按职责拆分为更小的子组件，便于复用与测试"],summary:"React 前端工程化基础良好，需补强可访问性与性能优化两个薄弱环节。"},database:{focusAreas:["索引设计","SQL 注入防护","事务处理","数据完整性"],scores:[{dimension:"代码规范",score:87,note:"SQL 关键字大写，命名遵循 snake_case"},{dimension:"索引设计",score:78,note:"高频查询字段缺少联合索引，存在全表扫描"},{dimension:"SQL 注入防护",score:84,note:"使用参数化查询，但动态拼接仍存在于日志查询"},{dimension:"事务处理",score:80,note:"事务边界清晰，但缺少死锁重试机制"},{dimension:"数据完整性",score:82,note:"外键约束齐全，部分软删除未级联处理"}],bugs:[{severity:"high",type:"SQL 注入",description:"动态拼接 ORDER BY 字段未做白名单校验，存在注入风险",location:"repositories/task_repo.py:order_by"},{severity:"high",type:"索引缺失",description:"tasks 表 user_id+status 查询未建联合索引，慢查询频发",location:"migrations/001_init.sql"},{severity:"medium",type:"事务处理",description:"并发更新库存未加 SELECT ... FOR UPDATE，存在超卖风险",location:"repositories/stock_repo.py:decrease"},{severity:"medium",type:"数据完整性",description:"软删除字段 deleted_at 未在唯一索引中排除，导致无法重建",location:"migrations/002_users.sql"},{severity:"low",type:"事务隔离",description:"长事务持有锁过久，建议改用乐观锁",location:"services/order_service.py:create"}],improvements:["为 ORDER BY / LIMIT 字段建立白名单，杜绝动态 SQL 拼接","为高频查询补建联合索引，使用 EXPLAIN 验证执行计划","关键扣减操作使用行锁或乐观版本号，避免并发超卖","为软删除场景调整唯一索引，包含 deleted_at 列"],summary:"数据库设计整体规范，SQL 注入与索引设计是当前最值得优先修复的问题。"},general:{focusAreas:["代码质量","错误处理","模块化设计","可测试性"],scores:[{dimension:"代码规范",score:85,note:"整体符合规范，少量命名待统一"},{dimension:"类型安全",score:82,note:"类型定义较完善，少量 any 可收敛"},{dimension:"错误处理",score:80,note:"基础异常捕获到位，边界处理可加强"},{dimension:"可维护性",score:84,note:"结构清晰，模块职责基本单一"},{dimension:"安全性",score:86,note:"常规安全措施到位，无明显漏洞"}],bugs:[{severity:"medium",type:"错误处理",description:"异步操作缺少 try/catch，错误会冒泡至顶层",location:"utils/async.ts:24"},{severity:"medium",type:"类型安全",description:"函数参数使用 any，缺少明确类型定义",location:"utils/helpers.ts:48"},{severity:"low",type:"最佳实践",description:"建议使用常量替代魔法数字",location:"config.ts:15"}],improvements:["统一错误处理机制，补充边界情况测试","完善类型定义，移除不必要的 any","为复杂逻辑补充单元测试与注释","引入 ESLint 严格规则与 Prettier 格式化"],summary:"通用代码质量良好，建议加强错误处理与类型定义以提升健壮性。"}},n=t[e]??t.general,a=Math.round(n.scores.reduce((c,l)=>c+l.score,0)/n.scores.length),o=n.bugs.filter(c=>c.severity==="high").length,i=s.slice(0,30);return`## 代码审查报告

### 审查概要
**审查对象**：${s}
**项目类型识别**：\`${e}\`
**审查时间**：${new Date().toLocaleString("zh-CN")}
**审查重点**：${n.focusAreas.join("、")}

### 质量评分
| 维度 | 评分 | 说明 |
|------|------|------|
${n.scores.map(c=>`| ${c.dimension} | ${c.score}/100 | ${c.note} |`).join(`
`)}

**综合评分**：${a}/100 ⭐

### 发现的问题

${n.bugs.length>0?n.bugs.map((c,l)=>`
**问题 ${l+1}** - [${c.severity==="high"?"🔴 严重":c.severity==="medium"?"🟡 中等":"🟢 轻微"}] ${c.type}
- 描述：${c.description}
- 位置：${c.location}
- 建议：${c.severity==="high"?"请立即修复此问题":c.severity==="medium"?"建议尽快修复":"可在下个迭代优化"}
`).join(""):"✅ 未发现明显问题，代码质量优秀！"}

### 改进建议

${n.improvements.map((c,l)=>`${l+1}. ${c}`).join(`
`)}

### 总结
针对「${i}」识别为 ${e} 类型，${n.summary}${o>0?`存在 ${o} 个严重问题需优先修复。`:"当前未发现严重问题，可逐步优化。"}

---
*代码审查完成，请根据报告进行相应调整。*`}},bugDetectorTemplate={id:"bug-detector",name:"Bug检测员",role:"质量保障工程师",avatar:"🐛",description:"专门进行Bug检测、边界测试、质量保证",tools:["code_executor","calculator"],generateResponse:async s=>{await delay$2(1200+Math.random()*1800);const e=detectProjectType(s),t={"python-backend":{scenarios:[{type:"API 边界-空参数",cases:8,passed:7,failed:1},{type:"API 边界-超长字符串",cases:6,passed:6,failed:0},{type:"API 边界-并发请求",cases:10,passed:8,failed:2},{type:"API 边界-SQL 注入",cases:7,passed:7,failed:0},{type:"参数校验-Pydantic",cases:12,passed:12,failed:0}],bugs:[{severity:"high",title:"并发请求创建任务导致主键冲突",description:`对「${s}」相关接口并发 50 次创建请求时，UUID 生成出现重复（时钟回拨场景），数据库抛出 IntegrityError 未被捕获`,steps:["使用 locust 并发 50 QPS 调用 POST /api/tasks/","观察服务端日志"],expected:"冲突时自动重试或返回 409 Conflict",actual:"返回 500 Internal Server Error，连接被重置",impact:"数据写入失败、用户体验受损"},{severity:"high",title:"SQL 注入风险（动态 ORDER BY）",description:"list 接口的 sort 参数直接拼接到 SQL，传入 `id; DROP TABLE tasks--` 可破坏数据",steps:["调用 GET /api/tasks/?sort=id;DROP TABLE tasks--","检查 tasks 表是否存在"],expected:"参数被白名单拒绝，返回 400",actual:"SQL 被执行，表被删除",impact:"数据丢失、灾难性事故"},{severity:"medium",title:"超长字符串导致 422 但日志噪声大",description:"title 传入 100KB 字符串时，Pydantic 校验通过但被数据库截断，错误日志爆炸",steps:["POST /api/tasks/ 传入 title 长度 100000","观察日志输出"],expected:"在 Pydantic 层就拒绝（max_length）",actual:"错误日志写入数十 MB，磁盘告警",impact:"日志系统压力、运维成本"},{severity:"medium",title:"空参数未做业务校验",description:'传入空字符串 `""` 通过 Pydantic 的 min_length=0 默认，但下游 service 抛出 ValueError',steps:['POST /api/tasks/ 传入 {"title": ""}',"观察响应"],expected:"返回 422 并提示「标题不能为空」",actual:"返回 500 ValueError",impact:"接口契约不一致"},{severity:"low",title:"并发请求下 Session 共享导致脏读",description:"多个请求复用同一 AsyncSession，未通过 Depends 隔离，事务互相污染",steps:["并发触发更新接口","检查数据一致性"],expected:"每个请求独立 Session",actual:"Session 被复用，出现脏读",impact:"数据一致性问题"}],coverageTips:["为所有 Pydantic 模型补充 max_length / pattern 约束","为并发场景添加集成测试（pytest-asyncio + httpx.AsyncClient）","使用白名单校验 sort/order 参数，杜绝动态 SQL 拼接","为关键接口补充 fuzzing 测试（如 hypothesmith 或 schemathesis）"]},"ai-agent":{scenarios:[{type:"Agent 行为-死循环",cases:6,passed:4,failed:2},{type:"Agent 行为-工具不存在",cases:5,passed:5,failed:0},{type:"Agent 行为-Token 超限",cases:4,passed:2,failed:2},{type:"Agent 行为-记忆丢失",cases:6,passed:5,failed:1},{type:"工具调用安全",cases:8,passed:8,failed:0}],bugs:[{severity:"high",title:"ReAct 死循环无法跳出",description:`针对「${s}」场景，LLM 持续返回 Action 但不产出 Final Answer，达到 max_steps 后抛出未捕获异常`,steps:["向 Agent 提交需要多步搜索的复杂问题","观察引擎日志"],expected:"达到 max_steps 后返回友好提示并保留中间结果",actual:"抛出 RuntimeError，会话中断",impact:"会话崩溃、用户体验差"},{severity:"high",title:"Token 超限触发 API 错误",description:"长对话累计 prompt 超过模型 max_tokens 时，OpenAI API 返回 400 但未捕获",steps:["连续对话 20 轮，每轮输入长文本","观察第 20 轮响应"],expected:"自动触发上下文压缩并重试",actual:"返回 400 错误，对话中断",impact:"长会话不可用"},{severity:"medium",title:"工具不存在时未降级",description:"LLM 调用未注册的工具名时，引擎直接抛出 KeyError",steps:['prompt 引导 LLM 调用 "image_gen" 工具',"观察 Agent 响应"],expected:"返回「工具不可用」并在下一轮重新思考",actual:"抛出 KeyError，会话终止",impact:"Agent 鲁棒性差"},{severity:"medium",title:"记忆检索未做相似度阈值",description:"retrieve 返回 top_k 中包含相似度极低（<0.3）的记忆，污染上下文",steps:["提问与历史无关的问题","检查 prompt 中是否包含无关记忆"],expected:"相似度低于阈值时过滤",actual:"所有 top_k 记忆都被注入",impact:"回答偏离主题、Token 浪费"},{severity:"low",title:"工具调用未记录 Token 消耗",description:"工具调用日志缺少 tokens 字段，难以做成本归因",steps:["查看 tool_call_logs 表","检查 tokens 列"],expected:"记录每次调用的 input/output tokens",actual:"tokens 字段为 0",impact:"成本可观测性差"}],coverageTips:["为 ReAct 引擎添加 max_steps + 超时双重熔断，并补充单测","在 prompt 构建前检查 token 长度，超阈值触发压缩摘要","为工具调用做白名单校验，未注册工具返回友好提示","为记忆检索增加相似度阈值参数，并补充评估测试"]},"react-frontend":{scenarios:[{type:"UI 边界-空状态",cases:6,passed:6,failed:0},{type:"UI 边界-加载状态",cases:5,passed:5,failed:0},{type:"UI 边界-错误状态",cases:6,passed:4,failed:2},{type:"UI 边界-超长文本",cases:8,passed:5,failed:3},{type:"交互-键盘导航",cases:7,passed:4,failed:3}],bugs:[{severity:"high",title:"错误状态未渲染导致白屏",description:"API 返回 500 时，组件未处理 rejected 状态，React 抛出未捕获错误导致白屏",steps:["mock taskApi.list 返回 reject","渲染 TaskList 组件","观察页面"],expected:"显示「加载失败，点击重试」占位",actual:"页面白屏，控制台报错",impact:"用户无法继续操作"},{severity:"medium",title:"超长文本破坏布局",description:"任务标题超过 200 字符时，未做截断或省略号，导致卡片横向溢出",steps:["渲染包含 500 字符标题的 TaskCard","观察卡片布局"],expected:"文本省略并显示 tooltip",actual:"卡片宽度撑破，列表错位",impact:"布局错乱、视觉体验差"},{severity:"medium",title:"加载状态未显示骨架屏",description:"请求期间组件渲染空白，用户感知不到加载",steps:["模拟 2s 网络延迟","观察首屏渲染"],expected:"显示骨架屏或 Spinner",actual:"空白等待 2s 后突然渲染数据",impact:"用户体验差、疑似卡死"},{severity:"medium",title:"空状态未引导用户",description:"数据为空时仅显示空白列表，缺少空状态引导",steps:["mock 返回空数组","渲染列表组件"],expected:"显示「暂无数据，点击创建」",actual:"完全空白",impact:"新用户流失"},{severity:"low",title:"键盘无法操作可点击元素",description:"可点击的 div 未加 role/tabIndex/onKeyDown，键盘用户无法触发",steps:["使用 Tab 键尝试聚焦卡片","按 Enter 尝试触发"],expected:"可聚焦并通过 Enter 触发",actual:"无法聚焦",impact:"可访问性不达标"}],coverageTips:["为所有异步组件补充 ErrorBoundary 与 rejected 状态处理","使用 line-clamp 或 text-overflow 处理超长文本","为加载态添加骨架屏，提升感知性能","为可交互元素补充 role/aria-* 与键盘事件，符合 WCAG AA"]},database:{scenarios:[{type:"数据层-空表查询",cases:6,passed:6,failed:0},{type:"数据层-大数据量",cases:8,passed:5,failed:3},{type:"数据层-并发写入",cases:10,passed:7,failed:3},{type:"数据层-外键约束",cases:7,passed:7,failed:0},{type:"事务回滚",cases:5,passed:5,failed:0}],bugs:[{severity:"high",title:"并发写入导致超卖",description:`针对「${s}」中的库存扣减场景，未加行锁，并发请求导致库存为负`,steps:["初始化库存=1","并发 10 个扣减请求","检查最终库存"],expected:"库存为 0，9 个请求返回失败",actual:"库存为 -9",impact:"资损、业务事故"},{severity:"high",title:"大数据量查询超时",description:"tasks 表 100 万行时，未走索引的查询耗时超过 30s",steps:["插入 100 万测试数据","执行 list_tasks 不带过滤","观察耗时"],expected:"通过联合索引控制在 200ms 内",actual:"全表扫描耗时 30s+",impact:"接口超时、用户体验差"},{severity:"medium",title:"外键级联删除误删数据",description:"删除父记录时 ON DELETE CASCADE 误删子记录，缺少软删除保护",steps:["删除一个有子项的父记录","检查子表数据"],expected:"软删除或拒绝删除",actual:"子记录被物理删除",impact:"数据丢失"},{severity:"medium",title:"空表查询返回 null 而非空数组",description:"repository.list() 在空表时返回 None，前端处理异常",steps:["清空 tasks 表","调用 list_tasks","检查返回值"],expected:"返回空数组 []",actual:"返回 None",impact:"前端兼容性问题"},{severity:"low",title:"事务未设置隔离级别",description:"关键扣减事务使用默认隔离级别（RC），高并发下出现不可重复读",steps:["并发读取并写入","检查读一致性"],expected:"使用 RR 或 SERIALIZABLE",actual:"出现脏读",impact:"数据一致性问题"}],coverageTips:["为关键扣减操作使用 SELECT ... FOR UPDATE 或乐观锁","为高频查询字段补建联合索引，并用 EXPLAIN 验证","为外键级联策略补充软删除机制","为 list 接口确保空表时返回空数组而非 None"]},general:{scenarios:[{type:"边界测试-空值",cases:8,passed:7,failed:1},{type:"边界测试-异常输入",cases:7,passed:6,failed:1},{type:"异常测试-网络错误",cases:5,passed:4,failed:1},{type:"性能测试-大数据",cases:4,passed:4,failed:0}],bugs:[{severity:"medium",title:"空值输入导致返回 undefined",description:"当输入为空字符串时，函数返回 undefined，可能导致后续错误",steps:["调用处理函数，传入空字符串","观察返回值"],expected:"返回空值或抛出友好错误",actual:"返回 undefined",impact:"单模块"},{severity:"low",title:"异常处理不完善",description:"网络请求失败时，错误提示不够友好",steps:["断开网络连接","触发数据请求"],expected:"显示友好的网络错误提示",actual:"显示技术错误信息",impact:"用户体验"}],coverageTips:["增加空值、null、undefined 等边界情况测试","完善异常场景测试用例","添加性能基准测试","补充安全相关测试"]}},n=t[e]??t.general,a=n.scenarios.reduce((p,m)=>p+m.cases,0),o=n.scenarios.reduce((p,m)=>p+m.passed,0),i=n.scenarios.reduce((p,m)=>p+m.failed,0),c=a>0?(o/a*100).toFixed(1):"0.0",l=s.slice(0,30);return`## Bug检测报告

### 测试概要
**测试对象**：${s}
**项目类型识别**：\`${e}\`
**测试类型**：功能测试 + 边界测试 + 异常测试
**测试用例数**：${a} 个（基于 ${n.scenarios.length} 类场景）

### 测试结果
| 测试类型 | 用例数 | 通过 | 失败 | 通过率 |
|----------|--------|------|------|--------|
${n.scenarios.map(p=>`| ${p.type} | ${p.cases} | ${p.passed} | ${p.failed} | ${(p.passed/p.cases*100).toFixed(1)}% |`).join(`
`)}
| **合计** | **${a}** | **${o}** | **${i}** | **${c}%** |

### 发现的Bug

${n.bugs.map((p,m)=>`#### 🐛 Bug #${m+1} - [${p.severity==="high"?"严重":p.severity==="medium"?"中等":"轻微"}] ${p.title}
**描述**：${p.description}
**复现步骤**：
${p.steps.map((d,x)=>`${x+1}. ${d}`).join(`
`)}
**预期行为**：${p.expected}
**实际行为**：${p.actual}
**影响范围**：${p.impact}
**优先级**：${p.severity==="high"?"高":p.severity==="medium"?"中":"低"}

`).join("")}

### 测试覆盖建议
${n.coverageTips.map(p=>`- ${p}`).join(`
`)}

### 总结
针对「${l}」识别为 ${e} 类型，共发现 ${n.bugs.length} 个问题，其中严重 ${n.bugs.filter(p=>p.severity==="high").length} 个，整体通过率 ${c}%。${i>0?"建议优先修复失败用例相关问题。":"当前测试全部通过。"}

---
*Bug检测完成，${i} 个用例待修复，整体质量${i>5?"需重点关注":i>0?"良好":"优秀"}。*`}},extenderTemplate={id:"extender",name:"扩展员",role:"技术顾问",avatar:"🚀",description:"未来展望、技术建议、扩展性分析",tools:["aci_view","aci_list","calculator","json_parser"],generateResponse:async s=>{await delay$2(800+Math.random()*1200);const e=detectProjectType(s),t={"python-backend":{shortTerm:[{title:"功能增强",items:["API 网关：统一鉴权、限流、灰度路由","WebSocket 实时通信：推送任务状态变更","OpenAPI/Swagger 文档自动生成","请求链路追踪（OpenTelemetry）"]},{title:"体验优化",items:["统一异常与错误码体系","健康检查与就绪探针","配置中心化（Apollo / Nacos）","结构化日志（JSON + TraceID）"]}],midTerm:[{title:"架构升级",items:["微服务化拆分（按业务域）","GraphQL BFF 层聚合多服务","消息队列解耦（Kafka / RabbitMQ）","服务网格 Istio 接入"]},{title:"技术栈扩展",items:["Celery 异步任务队列","Redis 分布式锁与缓存","Elasticsearch 全文检索","Prometheus + Grafana 监控"]}],longTerm:[{title:"平台化",items:["开放 API 与开发者门户","多租户 SaaS 改造","Service Mesh 全链路治理","云原生 K8s + Helm 部署"]},{title:"智能化",items:["AIOps 异常检测","API 智能限流与熔断","基于 Trace 的根因分析","容量自感知弹性扩缩容"]}],codeTitle:"API 网关 + WebSocket 实时通信示例（FastAPI）",codeExample:`\`\`\`python
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
\`\`\``,techSelection:[{scenario:"状态管理",tech:"Zustand",advantage:"轻量、TypeScript 友好"},{scenario:"样式方案",tech:"TailwindCSS",advantage:"高效、一致、易维护"},{scenario:"数据请求",tech:"React Query",advantage:"缓存、重试、状态管理"},{scenario:"测试框架",tech:"Vitest",advantage:"快速、兼容 Jest、Vite 原生"},{scenario:"CI/CD",tech:"GitHub Actions",advantage:"易用、生态丰富、免费额度"}]}},n=t[e]??t.general,a=s.slice(0,30);return`## 技术扩展与展望

### 项目扩展分析
针对「${s}」的未来发展方向，识别项目类型为 \`${e}\`，提供以下扩展建议：

### 短期扩展（1-2周）

${n.shortTerm.map((o,i)=>`#### ${i+1}. ${o.title}
${o.items.map(c=>c.includes("：")?`- **${c.split("：")[0]}**：${c.split("：").slice(1).join("：")}`:`- ${c}`).join(`
`)}`).join(`

`)}

### 中期扩展（1-2月）

${n.midTerm.map((o,i)=>`#### ${i+1}. ${o.title}
${o.items.map(c=>c.includes("：")?`- **${c.split("：")[0]}**：${c.split("：").slice(1).join("：")}`:`- ${c}`).join(`
`)}`).join(`

`)}

#### 架构核心代码：${n.codeTitle}

${n.codeExample}

### 长期扩展（3-6月）

${n.longTerm.map((o,i)=>`#### ${i+1}. ${o.title}
${o.items.map(c=>c.includes("：")?`- **${c.split("：")[0]}**：${c.split("：").slice(1).join("：")}`:`- ${c}`).join(`
`)}`).join(`

`)}

### 技术选型建议（适配 ${e}）

| 场景 | 推荐技术 | 优势 |
|------|----------|------|
${n.techSelection.map(o=>`| ${o.scenario} | ${o.tech} | ${o.advantage} |`).join(`
`)}

### 风险提示
1. **技术债务**：快速迭代可能积累技术债务，建议预留 20% 重构时间
2. **团队学习成本**：新技术引入需配套培训与文档
3. **向后兼容**：扩展功能时需保证现有接口契约稳定
4. **依赖锁定**：关键依赖建议锁定版本并定期评估替代方案

---
*扩展分析完成，针对「${a}」（${e}）已提供清晰的长期发展路线图。*`}},packagerTemplate={id:"packager",name:"打包员",role:"交付工程师",avatar:"📦",description:"文件清单、下载链接说明、打包交付",tools:["file_list","json_parser"],generateResponse:async s=>(await delay$2(600+Math.random()*1e3),`## 项目打包交付

### 项目文件清单
**项目名称**：${s}
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
*代码打包整理完成，可直接复制使用。*`)},deployerTemplate={id:"deployer",name:"输送员",role:"部署工程师",avatar:"🚀",description:"部署进度、Git日志、成功提示",tools:["json_parser","calculator"],generateResponse:async s=>(await delay$2(800+Math.random()*1500),`## 部署进度报告

### 部署概要
**项目名称**：${s}
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
🎉 **所有代码已通过对话交付，点复制按钮即可获取！**`)},knowledgeManagerTemplate={id:"knowledge-manager",name:"知识管理员",role:"知识管理工程师",avatar:"📚",description:"知识沉淀、经验总结、自动存入知识库",tools:["json_parser","calculator"],generateResponse:async s=>{await delay$2(600+Math.random()*1e3);const e=s.length>10?s.slice(0,10)+"...":s;return`## 知识沉淀报告

### 本次任务知识总结
**任务主题**：${s}

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
本次任务的关键知识已自动归档到知识库，分类为：**项目经验**，标签：\`${e}\`、\`多Agent协作\`、\`最佳实践\`。

---
📚 **知识已沉淀，经验已积累。**`}},KIMI_API_URL="https://api.moonshot.cn/v1/chat/completions",agents=[{id:"chief-orchestrator",name:"Chief Orchestrator",emoji:"🎯",role:"统一调度与任务编排",layer:"L1",layerName:"编排",tools:["语义意图分类","DAG任务图","Token计量","记忆检索"]},{id:"ui-flow-designer",name:"UI Flow Designer",emoji:"🎨",role:"界面流程设计",layer:"L1",layerName:"编排",tools:["Vue3/Svelte","shadcn/ui","动画库","PWA"]},{id:"deputy-orchestrator",name:"Deputy Orchestrator",emoji:"🤝",role:"副调度与并发监控",layer:"L1",layerName:"编排",tools:["并发控制","任务队列","状态监控"]},{id:"token-gatekeeper",name:"Token Gatekeeper",emoji:"💰",role:"Token配额管理",layer:"L1",layerName:"编排",tools:["配额计量","断路器","免费模型路由"]},{id:"ab-experimenter",name:"A/B Experimenter",emoji:"🔬",role:"实验设计与策略评估",layer:"L1",layerName:"编排",tools:["实验框架","统计分析","报告生成"]},{id:"intent-analyst",name:"Intent Analyst",emoji:"🔍",role:"深度语义分析与用户画像",layer:"L1",layerName:"编排",tools:["NLU引擎","用户画像","消歧树"]},{id:"code-artisan",name:"Code Artisan",emoji:"💻",role:"全栈代码编写与审查",layer:"L2",layerName:"交付",tools:["Node/Python/Bun","Vitest/pytest","CI/CD","版本控制"]},{id:"copy-master",name:"Copy Master",emoji:"✍️",role:"高级文案写作",layer:"L2",layerName:"交付",tools:["风格库","可读性检查","AI检测规避","GEO优化"]},{id:"mobile-architect",name:"Mobile Architect",emoji:"📱",role:"移动端UI设计",layer:"L2",layerName:"交付",tools:["VitePWA","触摸手势","Lighthouse性能"]},{id:"frontend-designer",name:"Frontend Designer",emoji:"🖼️",role:"高保真UI设计",layer:"L2",layerName:"交付",tools:["Figma插件","组件库","动画引擎","CSS框架"]},{id:"backend-engineer",name:"Backend Engineer",emoji:"⚙️",role:"后端架构设计",layer:"L2",layerName:"交付",tools:["Express/FastAPI","DB ORM","消息队列","缓存"]},{id:"devops-deployer",name:"DevOps Deployer",emoji:"🚀",role:"CI/CD与容器化部署",layer:"L2",layerName:"交付",tools:["Docker","K8s","GitHub Actions","监控"]},{id:"api-architect",name:"API Architect",emoji:"🔌",role:"RESTful/GraphQL设计",layer:"L2",layerName:"交付",tools:["OpenAPI","GraphQL","API网关","限流"]},{id:"test-engineer",name:"Test Engineer",emoji:"🧪",role:"单元/集成/E2E测试",layer:"L2",layerName:"交付",tools:["Vitest","Playwright","Cypress","覆盖率工具"]},{id:"security-auditor",name:"Security Auditor",emoji:"🔐",role:"代码安全审查",layer:"L2",layerName:"交付",tools:["SAST","DAST","依赖扫描","渗透测试"]},{id:"performance-optimizer",name:"Performance Optimizer",emoji:"⚡",role:"性能优化",layer:"L2",layerName:"交付",tools:["Lighthouse","Bundle分析","Profiler","缓存策略"]},{id:"microservices-architect",name:"Microservices Architect",emoji:"🏗️",role:"微服务架构设计",layer:"L2",layerName:"交付",tools:["服务网格","注册中心","配置中心","链路追踪"]},{id:"dataviz-designer",name:"Dataviz Designer",emoji:"📊",role:"数据可视化设计",layer:"L2",layerName:"交付",tools:["D3/ECharts","Canvas/SVG","动画","响应式图表"]},{id:"animation-designer",name:"Animation Designer",emoji:"✨",role:"微交互与动效设计",layer:"L2",layerName:"交付",tools:["GSAP","Framer Motion","Lottie","Three.js"]},{id:"media-processor",name:"Media Processor",emoji:"🎬",role:"音视频处理",layer:"L2",layerName:"交付",tools:["ffmpeg","WebRTC","MediaSource","音频分析"]},{id:"game-dev-engineer",name:"Game Dev Engineer",emoji:"🎮",role:"2D/3D游戏开发",layer:"L2",layerName:"交付",tools:["Unity/Godot","Phaser","物理引擎","游戏AI"]},{id:"embedded-engineer",name:"Embedded Engineer",emoji:"🔧",role:"嵌入式开发",layer:"L2",layerName:"交付",tools:["C/C++","RTOS","通信协议","硬件调试"]},{id:"blockchain-developer",name:"Blockchain Developer",emoji:"⛓️",role:"智能合约与DApp",layer:"L2",layerName:"交付",tools:["Solidity","Web3.js","Hardhat","链上索引"]},{id:"cloud-native-architect",name:"Cloud Native Architect",emoji:"☁️",role:"Serverless与多云架构",layer:"L2",layerName:"交付",tools:["K8s","Serverless框架","服务网格","Terraform"]},{id:"prompt-engineer",name:"Prompt Engineer",emoji:"🎯",role:"Prompt设计与优化",layer:"L2",layerName:"交付",tools:["Prompt库","评估框架","A/B测试","版本控制"]},{id:"pm-assistant",name:"PM Assistant",emoji:"📋",role:"产品经理助手",layer:"L2",layerName:"交付",tools:["PRD模板","故事地图","竞品分析框架"]},{id:"marketing-strategist",name:"Marketing Strategist",emoji:"📈",role:"营销策略规划",layer:"L2",layerName:"交付",tools:["营销模型","数据分析","内容日历"]},{id:"social-media-operator",name:"Social Media Operator",emoji:"📱",role:"社交媒体运营",layer:"L2",layerName:"交付",tools:["多平台API","定时发布","情感分析"]},{id:"technical-writer",name:"Technical Writer",emoji:"📝",role:"技术文档写作",layer:"L2",layerName:"交付",tools:["Markdown引擎","代码示例生成","多语言翻译"]},{id:"ux-researcher",name:"UX Researcher",emoji:"🔬",role:"用户研究与可用性测试",layer:"L2",layerName:"交付",tools:["热力图","会话录制","问卷","A/B统计"]},{id:"illustration-designer",name:"Illustration Designer",emoji:"🎨",role:"品牌插画设计",layer:"L2",layerName:"交付",tools:["SVG/Canvas","色彩系统","风格迁移","图标库"]},{id:"3d-modeler",name:"3D Modeler",emoji:"🧊",role:"3D模型创建",layer:"L2",layerName:"交付",tools:["Three.js","Babylon.js","GLTF","材质系统"]},{id:"video-editor",name:"Video Editor",emoji:"🎥",role:"视频后期制作",layer:"L2",layerName:"交付",tools:["ffmpeg","字幕引擎","转场效果","合成"]},{id:"podcast-producer",name:"Podcast Producer",emoji:"🎙️",role:"播客制作",layer:"L2",layerName:"交付",tools:["音频处理","RSS生成","分发API","章节"]},{id:"education-designer",name:"Education Designer",emoji:"📚",role:"课程设计",layer:"L2",layerName:"交付",tools:["课程框架","评估引擎","自适应学习"]},{id:"lakehouse-architect",name:"Lakehouse Architect",emoji:"🗄️",role:"湖仓一体架构",layer:"L3",layerName:"底座",tools:["Cloudflare R2","Iceberg表","ETL","多模态索引"]},{id:"rag-specialist",name:"RAG Specialist",emoji:"🔎",role:"向量检索与混合搜索",layer:"L3",layerName:"底座",tools:["Chroma","嵌入模型","BGE重排序","LlamaIndex"]},{id:"geo-optimizer",name:"GEO Optimizer",emoji:"🌐",role:"AI优先SEO优化",layer:"L3",layerName:"底座",tools:["JSON-LD生成","schema.org","AI爬虫监控","新鲜度"]},{id:"vector-db-operator",name:"VectorDB Operator",emoji:"🗃️",role:"向量数据库运维",layer:"L3",layerName:"底座",tools:["Milvus/Qdrant运维","索引策略","分片","备份"]},{id:"etl-engineer",name:"ETL Engineer",emoji:"🔧",role:"数据抽取与转换",layer:"L3",layerName:"底座",tools:["Dagster/Airflow","数据验证","增量同步"]},{id:"data-quality-monitor",name:"Data Quality Monitor",emoji:"📋",role:"数据质量监控",layer:"L3",layerName:"底座",tools:["质量规则引擎","异常检测","漂移监控"]},{id:"knowledge-graph-builder",name:"Knowledge Graph Builder",emoji:"🕸️",role:"知识图谱构建",layer:"L3",layerName:"底座",tools:["NER","关系抽取","图数据库","SPARQL"]},{id:"embedding-tuner",name:"Embedding Tuner",emoji:"🎛️",role:"嵌入模型微调",layer:"L3",layerName:"底座",tools:["微调流水线","评估数据集","模型压缩","ONNX"]},{id:"fulltext-engineer",name:"Full-text Engineer",emoji:"📖",role:"全文检索优化",layer:"L3",layerName:"底座",tools:["Elasticsearch/Meilisearch","分词器","BM25调优"]},{id:"cache-strategist",name:"Cache Strategist",emoji:"⚡",role:"多级缓存策略",layer:"L3",layerName:"底座",tools:["Redis/Memcached","CDN","本地缓存","穿透防护"]},{id:"log-analyst",name:"Log Analyst",emoji:"📊",role:"日志分析",layer:"L3",layerName:"底座",tools:["日志收集","模式挖掘","告警规则","可视化"]},{id:"data-annotation-manager",name:"Data Annotation Manager",emoji:"🏷️",role:"数据标注管理",layer:"L3",layerName:"底座",tools:["标注平台","一致性检查","主动学习"]},{id:"model-evaluator",name:"Model Evaluator",emoji:"📐",role:"模型性能评估",layer:"L3",layerName:"底座",tools:["评估框架","基准数据集","统计测试"]},{id:"feature-engineer",name:"Feature Engineer",emoji:"🔬",role:"特征工程",layer:"L3",layerName:"底座",tools:["特征存储","自动特征工程","特征重要性"]},{id:"pipeline-scheduler",name:"Pipeline Scheduler",emoji:"⏰",role:"任务调度",layer:"L3",layerName:"底座",tools:["Cron调度","DAG依赖","告警","回填"]},{id:"harness-engineer",name:"Harness Engineer",emoji:"🛡️",role:"运行时外骨骼",layer:"L4",layerName:"治理",tools:["进程沙箱","OpenTelemetry","检查点恢复","审计"]},{id:"self-evolution-mentor",name:"Self-Evolution Mentor",emoji:"🧠",role:"经验蒸馏与终身学习",layer:"L4",layerName:"治理",tools:["经验蒸馏","错误日志","技能注册表","自动回归"]},{id:"compliance-officer",name:"Compliance Officer",emoji:"🔒",role:"AI安全护栏",layer:"L4",layerName:"治理",tools:["实时语义分析","审计API","规则引擎"]},{id:"privacy-officer",name:"Privacy Officer",emoji:"🔏",role:"数据隐私合规",layer:"L4",layerName:"治理",tools:["脱敏引擎","差分隐私","GDPR工具"]},{id:"content-moderator",name:"Content Moderator",emoji:"🕵️",role:"多模态内容审核",layer:"L4",layerName:"治理",tools:["文本审核","图片审核","水印"]},{id:"watermark-tracer",name:"Watermark Tracer",emoji:"💧",role:"隐形水印追踪",layer:"L4",layerName:"治理",tools:["水印算法","可追溯性","盲检测"]},{id:"circuit-breaker",name:"Circuit Breaker",emoji:"⚡",role:"熔断策略",layer:"L4",layerName:"治理",tools:["熔断模式","降级策略","健康检查"]},{id:"sandbox-isolator",name:"Sandbox Isolator",emoji:"📦",role:"代码执行隔离",layer:"L4",layerName:"治理",tools:["进程隔离","seccomp","资源限制","安全策略"]},{id:"audit-trail-officer",name:"Audit Trail Officer",emoji:"📋",role:"全链路审计",layer:"L4",layerName:"治理",tools:["审计日志","操作回放","合规检查","报告"]},{id:"error-diagnostician",name:"Error Diagnostician",emoji:"🔍",role:"根因分析",layer:"L4",layerName:"治理",tools:["日志分析","调用链追踪","根因定位","知识图谱"]},{id:"capacity-planner",name:"Capacity Planner",emoji:"📈",role:"容量规划",layer:"L4",layerName:"治理",tools:["负载预测","弹性伸缩","成本模型"]},{id:"cost-optimizer",name:"Cost Optimizer",emoji:"💰",role:"云成本优化",layer:"L4",layerName:"治理",tools:["成本分析","资源优化","预算告警"]},{id:"sla-monitor",name:"SLA Monitor",emoji:"📊",role:"服务级别监控",layer:"L4",layerName:"治理",tools:["可用性监控","延迟追踪","SLA报告"]},{id:"disaster-recovery",name:"Disaster Recovery",emoji:"🔄",role:"灾难恢复",layer:"L4",layerName:"治理",tools:["备份策略","异地灾备","RPO/RTO"]},{id:"vulnerability-scanner",name:"Vulnerability Scanner",emoji:"🛡️",role:"漏洞扫描",layer:"L4",layerName:"治理",tools:["SCA扫描","CVE数据库","修复建议","自动补丁"]},{id:"dependency-manager",name:"Dependency Manager",emoji:"📦",role:"依赖管理",layer:"L4",layerName:"治理",tools:["版本矩阵","兼容性测试","升级路径","SBOM"]},{id:"license-compliance",name:"License Compliance",emoji:"📜",role:"开源许可合规",layer:"L4",layerName:"治理",tools:["许可扫描","合规矩阵","风险评估"]},{id:"i18n-adapter",name:"i18n Adapter",emoji:"🌍",role:"多语言适配",layer:"L4",layerName:"治理",tools:["i18n框架","翻译管理","本地化测试","RTL"]},{id:"accessibility-officer",name:"Accessibility Officer",emoji:"♿",role:"无障碍合规",layer:"L4",layerName:"治理",tools:["a11y检测","ARIA标签","对比度检查","键盘导航"]},{id:"carbon-monitor",name:"Carbon Monitor",emoji:"🌱",role:"碳排放估算",layer:"L4",layerName:"治理",tools:["碳模型","能源分析","绿色建议"]},{id:"ux-evaluator",name:"UX Evaluator",emoji:"⭐",role:"UX质量评估",layer:"L4",layerName:"治理",tools:["体验指标","用户反馈","启发式评估"]},{id:"feedback-loop-manager",name:"Feedback Loop Manager",emoji:"🔄",role:"反馈闭环管理",layer:"L4",layerName:"治理",tools:["反馈收集","自动分类","优先级排序"]},{id:"knowledge-deposition",name:"Knowledge Deposition",emoji:"📚",role:"知识沉淀",layer:"L4",layerName:"治理",tools:["内容捕获","质量评分","模板生成","向量化"]},{id:"ci-guardian",name:"CI Guardian",emoji:"🏛️",role:"CI守护者",layer:"L4",layerName:"治理",tools:["CI监控","质量门禁","安全扫描","发布审批"]}];function getAgentById(s){return agents.find(e=>e.id===s)}function getAgentPrompt(s){const e=getAgentById(s);if(!e)return"你是一位专业的AI助手。";const t=e.tools.join("、");return`你是一位${e.role}专家，代号${e.name}。
你的专长领域：${t}

请根据你的专业知识，为用户提供专业的${e.role}服务。
输出格式：先分析需求，然后给出专业的解决方案和具体建议。`}const agentPrompts={analyst:`你是一位资深的需求分析师，专长是将模糊的用户需求拆解为可执行的开发任务。
你的工作流程：
1. 仔细理解用户的原始需求
2. 识别核心功能点和隐含需求
3. 分析技术可行性和风险
4. 制定详细的实现方案和步骤
5. 评估工作量和优先级
输出格式：先用简洁的语言总结需求，然后分点列出技术方案、开发步骤、风险提示。最后请用户确认方案。`,"coder-a":`你是一位资深后端工程师，代号Coder-A，专长是Python和FastAPI后端开发。
你的任务：根据需求设计并编写后端核心代码。
要求：
- 代码结构清晰，模块化设计
- 包含完整的类型注解和Docstring
- 遵循PEP8规范
- 提供可直接运行的代码
- 包含错误处理和边界情况处理
输出格式：先说明设计思路，然后给出完整代码，最后说明使用方法。`,"coder-b":`你是一位资深全栈工程师，代号Coder-B，专长是API设计和数据库架构。
你的任务：根据需求设计API接口和数据库Schema。
要求：
- RESTful API设计规范
- 数据库表结构合理，索引优化
- 包含完整的增删改查接口
- 统一的响应格式和错误处理
输出格式：先说明设计思路，然后给出API列表、数据库Schema和示例代码。`,"coder-c":`你是一位资深前端工程师，代号Coder-C，专长是React + TypeScript前端开发。
你的任务：根据需求开发前端界面和交互逻辑。
要求：
- React函数式组件 + Hooks
- TypeScript类型安全
- 响应式设计，适配移动端
- 优雅的UI和动画效果
输出格式：先说明组件设计，然后给出完整代码，最后说明使用方法。`,"coder-d":`你是一位测试工程师，代号Coder-D，专长是单元测试和集成测试。
你的任务：为已开发的代码编写测试用例。
要求：
- 覆盖核心功能和边界情况
- 测试用例命名清晰
- 包含正常场景和异常场景
- 测试代码可直接运行
输出格式：先说明测试策略，然后给出完整测试代码，最后说明运行方式。`,"coder-e":`你是一位数据库工程师，代号Coder-E，专长是SQL和数据库优化。
你的任务：设计数据库表结构、索引和优化方案。
要求：
- 符合范式设计
- 合理的索引策略
- 性能优化建议
- 完整的建表SQL
输出格式：先说明设计思路，然后给出完整SQL，最后说明优化建议。`,reviewer:`你是一位资深代码审查员，专长是代码质量和最佳实践。
你的任务：审查前面代码员提交的代码。
审查维度：
1. 功能正确性 - 是否实现了需求
2. 代码质量 - 可读性、可维护性
3. 性能 - 有无明显性能问题
4. 安全 - 有无安全隐患
5. 规范性 - 是否符合编码规范
输出格式：逐项评分（1-10分），列出优点和改进建议，最后给出总体评价。`,"bug-detector":`你是一位资深Bug检测工程师，专长是发现代码中的潜在问题。
你的任务：深入分析代码，找出可能存在的Bug。
检查项：
- 空指针/未定义异常
- 边界条件处理
- 错误处理完整性
- 并发安全问题
- 内存泄漏风险
- 逻辑错误
输出格式：列出每个发现的Bug，包含：问题描述、影响程度、触发条件、修复建议。`,extender:`你是一位技术战略规划师，专长是技术选型和未来扩展规划。
你的任务：为当前项目提供未来发展方向和扩展建议。
建议维度：
1. 功能扩展 - 还可以增加什么功能
2. 技术升级 - 可以引入什么新技术
3. 性能优化 - 如何提升系统性能
4. 架构演进 - 未来架构如何发展
5. 商业化 - 如何变现和运营
输出格式：分短期、中期、长期三个阶段给出建议，每个阶段列出具体方向和理由。`,packager:`你是一位项目打包交付工程师，专长是代码整合和文档生成。
你的任务：将前面各阶段的产出整理成完整的交付物。
输出内容：
1. 项目概述和技术栈说明
2. 核心代码文件清单
3. 部署和运行说明
4. 注意事项和已知问题
输出格式：结构化的交付文档，清晰易懂。`,deployer:`你是一位运维部署工程师，专长是自动化部署和运维。
你的任务：提供项目的部署方案。
部署方案包括：
1. 环境要求
2. 部署步骤
3. 配置说明
4. 监控和日志
5. 故障排查
输出格式：清晰的操作步骤和命令，确保用户能按步骤完成部署。`,"knowledge-manager":`你是一位知识管理工程师，专长是知识沉淀和经验总结。
你的任务：从本次任务中提炼核心知识点，存入知识库。
总结维度：
1. 核心技术点 - 用到了哪些关键技术
2. 最佳实践 - 有什么值得复用的经验
3. 踩坑记录 - 遇到了什么问题，如何解决
4. 相关知识 - 关联的技术领域
输出格式：结构化的知识条目，包含标题、内容摘要、关键词标签。`};function getConfig(){try{const s=localStorage.getItem("hopeai-llm-config");if(s)return JSON.parse(s)}catch{}return null}function saveLLMConfig(s){localStorage.setItem("hopeai-llm-config",JSON.stringify(s))}function clearLLMConfig(){localStorage.removeItem("hopeai-llm-config")}async function searchBackendKnowledge(s,e=3){try{const t=await fetch(`/api/knowledge/search?q=${encodeURIComponent(s)}&limit=${e}`);if(!t.ok)return[];const n=await t.json();return!n.success||!Array.isArray(n.data)?[]:n.data.map(a=>({title:a.title||"",content:a.content||"",score:a.score||0}))}catch{return[]}}async function getRAGContext(s,e=3){try{const t=useKnowledgeStore.getState().entries,n=await searchBackendKnowledge(s,e),a=s.toLowerCase(),o=a.split(/[\s,，。、！？]+/).filter(d=>d.length>1),i=t.map(d=>{let x=0;const h=d.title.toLowerCase(),F=d.content.toLowerCase(),u=d.tags.map(f=>f.toLowerCase()).join(" ");for(const f of o)h.includes(f)&&(x+=3),u.includes(f)&&(x+=2),F.includes(f)&&(x+=1);for(const f of d.tags)a.includes(f.toLowerCase())&&f.length>1&&(x+=2);return{title:d.title,content:d.content,score:x}}).filter(d=>d.score>0),c=new Set,l=[];for(const d of n)c.has(d.title)||(c.add(d.title),l.push(d));for(const d of i.sort((x,h)=>h.score-x.score))!c.has(d.title)&&l.length<e*2&&(c.add(d.title),l.push(d));const p=l.slice(0,e);return p.length===0?"":`

以下是知识库中的相关资料，供你参考：
${p.map((d,x)=>`参考资料${x+1}（${d.title}）：
${d.content.slice(0,800)}`).join(`

`)}
`}catch{return""}}async function callKimi(s,e,t,n="professional"){var x,h,F,u;const a=getConfig();if(!a||!a.apiKey)throw new Error('未配置Kimi API Key，请在"我的"页面设置');let o=agentPrompts[s];o||(o=getAgentPrompt(s));const i=await getRAGContext(e,3),c={professional:"请使用专业、严谨的语气回答，保持技术专业性，语言简练准确。",warm:"请使用亲切、温暖、共情的语气回答，让用户感受到关怀和支持。",humorous:"请使用轻松、幽默、风趣的语气回答，可以适当加入幽默元素和表情。",minimal:"请使用极简、高效的方式回答，直接给出要点和关键信息，避免冗长。",creative:"请使用富有创意和想象力的方式回答，可以提出新颖的思路和方案。"},l=[{role:"system",content:o+`

`+(c[n]||c.professional)+i}];t&&l.push({role:"system",content:`上下文信息：
${t}`}),l.push({role:"user",content:e});const p=await fetch(KIMI_API_URL,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a.apiKey}`},body:JSON.stringify({model:a.model||"moonshot-v1-8k",messages:l,temperature:a.temperature??.7,max_tokens:a.maxTokens||2e3})});if(!p.ok){const f=await p.json().catch(()=>({})),k=((x=f==null?void 0:f.error)==null?void 0:x.message)||`API调用失败 (${p.status})`;throw new Error(k)}return((u=(F=(h=(await p.json()).choices)==null?void 0:h[0])==null?void 0:F.message)==null?void 0:u.content)||""}function isLLMEnabled(){try{return localStorage.getItem("hopeai-use-llm")==="true"}catch{return!1}}function buildContext(s,e=3e3){if(s.length===0)return"";const t=s.join(`

---

`);return t.length<=e?t:t.slice(0,e)+`
...（内容已截断）`}const delay$1=s=>new Promise(e=>setTimeout(e,s)),defaultPhases=[{id:"analysis",name:"分析阶段",description:"分析需求，拆解功能，制定方案",icon:"🔍",agents:[analystTemplate],minDuration:1500,maxDuration:3e3},{id:"confirmation",name:"确认阶段",description:"确认方案，等待用户反馈",icon:"✅",agents:[],minDuration:500,maxDuration:1e3},{id:"coding",name:"编码阶段",description:"多角色协作开发，生成代码",icon:"💻",agents:[coderATemplate,coderBTemplate,coderCTemplate,coderDTemplate,coderETemplate],minDuration:3e3,maxDuration:6e3},{id:"review",name:"审查阶段",description:"代码审查，Bug检测，质量评估",icon:"🔎",agents:[reviewerTemplate,bugDetectorTemplate],minDuration:2e3,maxDuration:4e3},{id:"extension",name:"扩展阶段",description:"未来展望，技术建议，扩展性分析",icon:"🚀",agents:[extenderTemplate],minDuration:1500,maxDuration:2500},{id:"packaging",name:"打包阶段",description:"整理文件清单，准备交付物",icon:"📦",agents:[packagerTemplate],minDuration:1e3,maxDuration:2e3},{id:"deployment",name:"部署阶段",description:"部署上线，输出Git日志",icon:"🎉",agents:[deployerTemplate],minDuration:1500,maxDuration:3e3},{id:"knowledge",name:"知识沉淀",description:"总结经验，存入知识库",icon:"📚",agents:[knowledgeManagerTemplate],minDuration:1e3,maxDuration:2e3}];class WorkflowEngine{constructor(e={}){T(this,"phases");T(this,"options");T(this,"isRunning",!1);T(this,"currentPhaseIndex",-1);T(this,"results",[]);T(this,"abortController",null);this.options={autoConfirm:!0,speedFactor:1,executionMode:"mixed",maxParallelAgents:4,chatStyle:"professional",...e},e.enabledPhases&&e.enabledPhases.length>0?this.phases=defaultPhases.filter(t=>e.enabledPhases.includes(t.id)):this.phases=[...defaultPhases]}getPhases(){return[...this.phases]}isWorkflowRunning(){return this.isRunning}getCurrentPhaseIndex(){return this.currentPhaseIndex}getResults(){return[...this.results]}async executeWorkflow(e){var a;if(this.isRunning)throw new Error("工作流正在运行中，请等待完成或中止当前任务");this.isRunning=!0,this.currentPhaseIndex=-1,this.results=[],this.abortController=new AbortController;const t=new Date().toISOString();let n=0;try{for(let i=0;i<this.phases.length;i++){if(this.abortController.signal.aborted)throw new Error("工作流已被中止");this.currentPhaseIndex=i;const c=this.phases[i],l=Date.now(),p={phase:c.id,name:c.name,status:"running",outputs:[],agents:c.agents.map(d=>d.id),startedAt:new Date().toISOString()};if(this.results.push(p),this.reportProgress({phase:c.id,phaseIndex:i,totalPhases:this.phases.length,message:`开始${c.name}...`,isComplete:!1,timestamp:new Date().toISOString()}),c.agents.length>0){const d=[];for(let F=0;F<i;F++)(a=this.results[F])!=null&&a.outputs&&d.push(...this.results[F].outputs);const x=this.options.executionMode;x==="parallel"||x==="mixed"&&c.agents.length>1?await this.executeAgentsParallel(c,e,d,p):await this.executeAgentsSequential(c,e,d,p)}else if(c.id==="confirmation")this.options.autoConfirm?(this.reportProgress({phase:c.id,phaseIndex:i,totalPhases:this.phases.length,message:"方案已自动确认",isComplete:!1,timestamp:new Date().toISOString()}),await delay$1((c.minDuration+Math.random()*(c.maxDuration-c.minDuration))/(this.options.speedFactor||1))):p.outputs.push("等待用户确认中...");else{const d=c.minDuration+Math.random()*(c.maxDuration-c.minDuration);await delay$1(d/(this.options.speedFactor||1))}const m=Date.now()-l;n+=m,p.status="completed",p.finishedAt=new Date().toISOString(),p.duration=m,this.reportProgress({phase:c.id,phaseIndex:i,totalPhases:this.phases.length,message:`${c.name}完成`,isComplete:i===this.phases.length-1,timestamp:new Date().toISOString()})}const o=new Date().toISOString();return this.isRunning=!1,{command:e,phases:this.results,totalDuration:n,isSuccess:!0,startedAt:t,finishedAt:o}}catch{const i=new Date().toISOString();return this.isRunning=!1,this.currentPhaseIndex>=0&&this.currentPhaseIndex<this.results.length&&(this.results[this.currentPhaseIndex].status="failed",this.results[this.currentPhaseIndex].finishedAt=i),{command:e,phases:this.results,totalDuration:n,isSuccess:!1,startedAt:t,finishedAt:i}}}async executeSinglePhase(e,t){const n=this.phases.find(i=>i.id===t);if(!n)return null;const a=Date.now(),o={phase:n.id,name:n.name,status:"running",outputs:[],agents:n.agents.map(i=>i.id),startedAt:new Date().toISOString()};for(const i of n.agents){const c=await i.generateResponse(e);o.outputs.push(c)}return o.status="completed",o.finishedAt=new Date().toISOString(),o.duration=Date.now()-a,o}abortWorkflow(){this.abortController&&this.abortController.abort(),this.isRunning=!1}setSpeedFactor(e){this.options.speedFactor=Math.max(.1,Math.min(10,e))}setOnProgress(e){this.options.onProgress=e}reportProgress(e){this.options.onProgress&&this.options.onProgress(e)}async executeAgent(e,t,n,a){const o=Date.now();this.reportProgress({phase:a.id,phaseIndex:this.currentPhaseIndex,totalPhases:this.phases.length,message:`${e.name} 正在思考...`,agent:e,isComplete:!1,timestamp:new Date().toISOString()});const c=(a.minDuration+Math.random()*(a.maxDuration-a.minDuration))/a.agents.length/(this.options.speedFactor||1);let l;const p=isLLMEnabled();try{if(p)try{l=await callKimi(e.id,t,n,this.options.chatStyle),await delay$1(Math.min(c,800))}catch(m){const d=await e.generateResponse(t);l=`⚠️ AI模型调用失败，使用本地模板生成

原因：${m instanceof Error?m.message:"未知错误"}

---

${d}`}else await delay$1(c),l=await e.generateResponse(t);return{agent:e,content:l,duration:Date.now()-o,success:!0}}catch(m){return{agent:e,content:`❌ ${e.name} 执行失败: ${m instanceof Error?m.message:"未知错误"}`,duration:Date.now()-o,success:!1,error:m instanceof Error?m.message:"未知错误"}}}async executeAgentsSequential(e,t,n,a){for(const o of e.agents){if(this.abortController.signal.aborted)break;const i=buildContext(n),c=await this.executeAgent(o,t,i,e);a.outputs.push(c.content),n.push(c.content),this.reportProgress({phase:e.id,phaseIndex:this.currentPhaseIndex,totalPhases:this.phases.length,message:`${o.name} 完成工作`,agent:o,content:c.content,isComplete:!1,timestamp:new Date().toISOString()})}}async executeAgentsParallel(e,t,n,a){const o=buildContext(n),i=this.options.maxParallelAgents||4,c=[];for(let l=0;l<e.agents.length;l+=i)c.push(e.agents.slice(l,l+i));for(const l of c){if(this.abortController.signal.aborted)break;const p=l.map(d=>this.executeAgent(d,t,o,e));(await Promise.all(p)).forEach(d=>{a.outputs.push(d.content),n.push(d.content),this.reportProgress({phase:e.id,phaseIndex:this.currentPhaseIndex,totalPhases:this.phases.length,message:`${d.agent.name} 完成工作`,agent:d.agent,content:d.content,isComplete:!1,timestamp:new Date().toISOString()})})}}static create(e){return new WorkflowEngine(e)}}class TemplateStore{constructor(){T(this,"templates",new Map);T(this,"keywordIndex",new Map);T(this,"categoryIndex",new Map);T(this,"STORAGE_KEY","hopeai_templates");this.loadFromStorage(),this.initBuiltinTemplates()}initBuiltinTemplates(){[{name:"React组件模板",description:"React函数组件基础模板",category:"react",keywords:["react","component","function","组件"],language:"tsx",tags:["react","typescript","frontend"],content:`import React from 'react';

interface Props {
  title: string;
}

const ComponentName: React.FC<Props> = ({ title }) => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};

export default ComponentName;`},{name:"Vue组件模板",description:"Vue3组合式API组件模板",category:"vue",keywords:["vue","component","composition","组件"],language:"vue",tags:["vue","frontend"],content:`<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
}>();

const count = ref(0);

const increment = () => {
  count.value++;
};
<\/script>`},{name:"Express路由模板",description:"Express.js路由处理模板",category:"backend",keywords:["express","route","api","路由"],language:"ts",tags:["express","nodejs","backend","api"],content:`import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await fetchData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await createData(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;`},{name:"TypeScript类模板",description:"TypeScript类定义模板",category:"typescript",keywords:["typescript","class","oop","类"],language:"ts",tags:["typescript","oop"],content:`class ClassName {
  private property: string;
  public readonly id: number;

  constructor(id: number, property: string) {
    this.id = id;
    this.property = property;
  }

  public getProperty(): string {
    return this.property;
  }

  public setProperty(value: string): void {
    this.property = value;
  }

  public async process(): Promise<void> {
    // 处理逻辑
  }
}

export default ClassName;`},{name:"Dockerfile模板",description:"Node.js项目Dockerfile模板",category:"devops",keywords:["docker","dockerfile","container","容器"],language:"dockerfile",tags:["docker","devops"],content:`FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "dist/index.js"]`},{name:"GitHub Action CI模板",description:"GitHub Actions持续集成工作流模板",category:"devops",keywords:["github","action","ci","workflow"],language:"yaml",tags:["github","ci","devops"],content:`name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - run: npm ci
      - run: npm run build
      - run: npm test`},{name:"Jest测试模板",description:"Jest单元测试模板",category:"testing",keywords:["jest","test","unit","测试"],language:"ts",tags:["jest","testing"],content:`import { describe, it, expect } from '@jest/globals';
import functionToTest from '../src/function';

describe('Function Name', () => {
  it('should return correct result', () => {
    const result = functionToTest('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    const result = functionToTest('');
    expect(result).toBe('');
  });

  it('should throw error for invalid input', () => {
    expect(() => functionToTest(null as any)).toThrow();
  });
});`},{name:"HTTP请求封装",description:"基于fetch的HTTP请求封装",category:"frontend",keywords:["http","fetch","api","request"],language:"ts",tags:["http","api","frontend"],content:`const BASE_URL = process.env.API_URL || 'http://localhost:3000';

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(\`\${BASE_URL}\${url}\`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    throw new Error(error.message || '请求失败');
  }

  return response.json();
}

export const get = <T>(url: string) => request<T>(url);
export const post = <T>(url: string, data: unknown) => 
  request<T>(url, { method: 'POST', body: JSON.stringify(data) });
export const put = <T>(url: string, data: unknown) => 
  request<T>(url, { method: 'PUT', body: JSON.stringify(data) });
export const del = <T>(url: string) => request<T>(url, { method: 'DELETE' });`},{name:"CSS动画模板",description:"CSS关键帧动画模板",category:"css",keywords:["css","animation","keyframes","动画"],language:"css",tags:["css","animation"],content:`.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}`},{name:"WebSocket连接模板",description:"WebSocket客户端连接模板",category:"websocket",keywords:["websocket","ws","realtime","实时"],language:"ts",tags:["websocket","realtime"],content:`class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(message: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(data: unknown): void {
    console.log('Received message:', data);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}`}].forEach(t=>{this.templates.get(t.name)||this.addTemplate(t)})}addTemplate(e){const t=new Date().toISOString(),n=`${e.category}-${e.name.toLowerCase().replace(/\s+/g,"-")}-${Date.now()}`,a={...e,id:n,createdAt:t,updatedAt:t,usageCount:0};return this.templates.set(n,a),this.updateIndexes(a),this.saveToStorage(),a}updateIndexes(e){e.keywords.forEach(t=>{const n=t.toLowerCase();this.keywordIndex.has(n)||this.keywordIndex.set(n,new Set),this.keywordIndex.get(n).add(e.id)}),this.categoryIndex.has(e.category)||this.categoryIndex.set(e.category,new Set),this.categoryIndex.get(e.category).add(e.id)}search(e,t={}){const{topK:n=5,category:a,minScore:o=.3}=t,i=e.toLowerCase().split(/\s+/).filter(m=>m.length>1);if(i.length===0)return[];const c=new Map;i.forEach(m=>{const d=new Set;this.keywordIndex.forEach((x,h)=>{(h.includes(m)||m.includes(h))&&x.forEach(F=>d.add(F))}),d.forEach(x=>{const h=c.get(x)||{score:0,matchedKeywords:[]};h.score+=1/i.length;const F=this.templates.get(x);if(F){const u=F.keywords.find(f=>f.toLowerCase()===m||m===f.toLowerCase());u&&(h.score+=.5,h.matchedKeywords.includes(u)||h.matchedKeywords.push(u))}c.set(x,h)})});const l=Array.from(c.entries()).map(([m,{score:d,matchedKeywords:x}])=>({template:this.templates.get(m),score:d,matchedKeywords:x})).filter(m=>m.score>=o).sort((m,d)=>d.score-m.score);return(a?l.filter(m=>m.template.category===a):l).slice(0,n)}getById(e){return this.templates.get(e)}getByCategory(e){const t=this.categoryIndex.get(e);return t?Array.from(t).map(n=>this.templates.get(n)).filter(Boolean):[]}getAll(){return Array.from(this.templates.values())}updateTemplate(e,t){const n=this.templates.get(e);if(!n)return;const a={...n,...t,updatedAt:new Date().toISOString()};return this.templates.set(e,a),this.saveToStorage(),a}deleteTemplate(e){const t=this.templates.get(e);if(!t)return!1;t.keywords.forEach(a=>{const o=this.keywordIndex.get(a.toLowerCase());o&&o.delete(e)});const n=this.categoryIndex.get(t.category);return n&&n.delete(e),this.templates.delete(e),this.saveToStorage(),!0}useTemplate(e){const t=this.templates.get(e);if(!t)return;const n={...t,usageCount:t.usageCount+1,lastUsedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return this.templates.set(e,n),this.saveToStorage(),n}saveToStorage(){if(typeof window<"u")try{localStorage.setItem(this.STORAGE_KEY,JSON.stringify(Array.from(this.templates.values())))}catch(e){console.warn("Failed to save templates to localStorage:",e)}}loadFromStorage(){if(typeof window<"u")try{const e=localStorage.getItem(this.STORAGE_KEY);e&&JSON.parse(e).forEach(n=>{this.templates.set(n.id,n),this.updateIndexes(n)})}catch(e){console.warn("Failed to load templates from localStorage:",e)}}importTemplates(e){let t=0;return e.forEach(n=>{Array.from(this.templates.values()).find(o=>o.name===n.name&&o.category===n.category)||(this.addTemplate(n),t++)}),t}exportTemplates(){return this.getAll()}}new TemplateStore;const DEFAULT_CONFIG={provider:"api",apiBase:"https://api.moonshot.cn/v1",model:"embedding-v1",dimensions:1536},STORAGE_KEY$1="hopeai_embedding_config";class EmbeddingService{constructor(){T(this,"config");this.config=this.loadConfig()}loadConfig(){try{const e=localStorage.getItem(STORAGE_KEY$1);if(e)return{...DEFAULT_CONFIG,...JSON.parse(e)}}catch{}return{...DEFAULT_CONFIG}}saveConfig(e){this.config={...this.config,...e};try{localStorage.setItem(STORAGE_KEY$1,JSON.stringify(this.config))}catch{}}getConfig(){return{...this.config}}async embed(e){return this.embedViaAPI(e)}async embedBatch(e){return this.embedBatchViaAPI(e)}async embedViaAPI(e){var i;if(!this.config.apiKey)throw new Error("请先配置 Embedding API Key");const t=((i=this.config.apiBase)==null?void 0:i.replace(/\/$/,""))||DEFAULT_CONFIG.apiBase,n=this.config.model||DEFAULT_CONFIG.model,a=await fetch(`${t}/embeddings`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.config.apiKey}`},body:JSON.stringify({model:n,input:e})});if(!a.ok){const c=await a.text();throw new Error(`Embedding API 错误 (${a.status}): ${c}`)}return(await a.json()).data[0].embedding}async embedBatchViaAPI(e){var i;if(!this.config.apiKey)throw new Error("请先配置 Embedding API Key");const t=((i=this.config.apiBase)==null?void 0:i.replace(/\/$/,""))||DEFAULT_CONFIG.apiBase,n=this.config.model||DEFAULT_CONFIG.model,a=20,o=[];for(let c=0;c<e.length;c+=a){const l=e.slice(c,c+a),p=await fetch(`${t}/embeddings`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.config.apiKey}`},body:JSON.stringify({model:n,input:l})});if(!p.ok){const x=await p.text();throw new Error(`Embedding API 错误 (${p.status}): ${x}`)}const d=(await p.json()).data.sort((x,h)=>x.index-h.index).map(x=>x.embedding);o.push(...d)}return o}cosineSimilarity(e,t){if(e.length!==t.length)return 0;let n=0,a=0,o=0;for(let i=0;i<e.length;i++)n+=e[i]*t[i],a+=e[i]*e[i],o+=t[i]*t[i];return a=Math.sqrt(a),o=Math.sqrt(o),a===0||o===0?0:n/(a*o)}}const embeddingService=new EmbeddingService,embeddingService$1=Object.freeze(Object.defineProperty({__proto__:null,EmbeddingService,embeddingService},Symbol.toStringTag,{value:"Module"})),scriptRel="modulepreload",assetsURL=function(s){return"/hopeai/company/"+s},seen={},__vitePreload=function s(e,t,n){let a=Promise.resolve();if(t&&t.length>0){let i=function(p){return Promise.all(p.map(m=>Promise.resolve(m).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),l=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));a=i(t.map(p=>{if(p=assetsURL(p),p in seen)return;seen[p]=!0;const m=p.endsWith(".css"),d=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${d}`))return;const x=document.createElement("link");if(x.rel=m?"stylesheet":scriptRel,m||(x.as="script"),x.crossOrigin="",x.href=p,l&&x.setAttribute("nonce",l),document.head.appendChild(x),m)return new Promise((h,F)=>{x.addEventListener("load",h),x.addEventListener("error",()=>F(new Error(`Unable to preload CSS for ${p}`)))})}))}function o(i){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=i,window.dispatchEvent(c),!c.defaultPrevented)throw i}return a.then(i=>{for(const c of i||[])c.status==="rejected"&&o(c.reason);return e().catch(o)})};function generateId$2(){return Date.now().toString(36)+Math.random().toString(36).substr(2,9)}const now=new Date().toISOString(),extendedKnowledge=[{id:generateId$2(),title:"React useState Hook 使用",content:"useState 是 React 中用于管理组件状态的 Hook。调用 useState 会返回一个状态值和一个更新函数。初始值只在组件首次渲染时生效。",source:"React Docs",tags:["react","hooks","usestate","状态管理"],category:"前端开发",createdAt:now,updatedAt:now,importance:9,references:["https://react.dev/reference/react/useState"]},{id:generateId$2(),title:"React useEffect 依赖数组",content:"useEffect 的依赖数组决定了何时执行副作用。空数组 [] 表示只在挂载时执行一次；不传依赖数组表示每次渲染都执行；传入特定值则只在这些值变化时执行。",source:"React Docs",tags:["react","hooks","useeffect","副作用"],category:"前端开发",createdAt:now,updatedAt:now,importance:9,references:["https://react.dev/reference/react/useEffect"]},{id:generateId$2(),title:"TypeScript 泛型函数",content:"泛型函数允许在函数参数和返回值之间建立类型关系。使用 <T> 语法定义泛型参数，例如 function identity<T>(arg: T): T { return arg; }",source:"TypeScript Docs",tags:["typescript","泛型","函数"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://www.typescriptlang.org/docs/handbook/2/generics.html"]},{id:generateId$2(),title:"Vue3 Composition API ref",content:"ref 用于创建响应式引用，适用于基本类型。通过 .value 访问和修改值，模板中自动解包。例如 const count = ref(0); count.value++",source:"Vue Docs",tags:["vue","composition","ref","响应式"],category:"前端开发",createdAt:now,updatedAt:now,importance:9,references:["https://vuejs.org/api/reactivity-core.html#ref"]},{id:generateId$2(),title:"Vue3 reactive",content:"reactive 用于创建响应式对象，适用于复杂类型。直接访问属性无需 .value，但不能重新赋值整个对象。例如 const state = reactive({ count: 0 }); state.count++",source:"Vue Docs",tags:["vue","composition","reactive","响应式"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://vuejs.org/api/reactivity-core.html#reactive"]},{id:generateId$2(),title:"JavaScript Promise 链式调用",content:"Promise 链式调用使用 .then() 处理成功结果，.catch() 处理错误，.finally() 无论成功失败都会执行。链式调用会按顺序执行。",source:"MDN",tags:["javascript","promise","async","异步"],category:"前端开发",createdAt:now,updatedAt:now,importance:9,references:["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"]},{id:generateId$2(),title:"async/await 错误处理",content:"使用 try/catch 包裹 await 调用可以捕获异步错误。也可以使用 .catch() 在 await 表达式后直接捕获。避免未处理的 Promise 拒绝。",source:"MDN",tags:["javascript","async","await","错误处理"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"]},{id:generateId$2(),title:"CSS Flexbox 主轴与交叉轴",content:"Flexbox 有主轴(main axis)和交叉轴(cross axis)。flex-direction 决定主轴方向。justify-content 控制主轴对齐，align-items 控制交叉轴对齐。",source:"CSS-Tricks",tags:["css","flexbox","布局"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://css-tricks.com/snippets/css/a-guide-to-flexbox/"]},{id:generateId$2(),title:"CSS Grid 网格布局",content:"CSS Grid 使用 grid-template-columns 和 grid-template-rows 定义网格轨道。使用 grid-column 和 grid-row 控制元素位置。fr 单位表示剩余空间的比例。",source:"CSS-Tricks",tags:["css","grid","布局"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://css-tricks.com/snippets/css/complete-guide-grid/"]},{id:generateId$2(),title:"Git 分支管理策略",content:"常用 Git 分支策略包括 Git Flow 和 Trunk Based Development。Git Flow 使用 develop、feature、release、hotfix 分支；Trunk Based 使用主干分支配合短生命周期特性分支。",source:"Atlassian",tags:["git","分支","版本控制"],category:"工具链",createdAt:now,updatedAt:now,importance:8,references:["https://www.atlassian.com/git/tutorials/comparing-workflows"]},{id:generateId$2(),title:"Node.js 事件循环",content:"Node.js 事件循环分为六个阶段：timers、pending callbacks、idle/prepare、poll、check、close callbacks。setTimeout 在 timers 阶段执行，setImmediate 在 check 阶段执行。",source:"Node.js Docs",tags:["node.js","事件循环","异步"],category:"后端开发",createdAt:now,updatedAt:now,importance:9,references:["https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/"]},{id:generateId$2(),title:"Express 中间件顺序",content:"Express 中间件按定义顺序执行。路由匹配后不再继续执行后续中间件。使用 next() 调用下一个中间件。错误处理中间件需要四个参数 (err, req, res, next)。",source:"Express Docs",tags:["express","中间件","node.js"],category:"后端开发",createdAt:now,updatedAt:now,importance:8,references:["https://expressjs.com/en/guide/using-middleware.html"]},{id:generateId$2(),title:"RESTful API 设计原则",content:"RESTful API 使用 HTTP 方法表示操作：GET 获取、POST 创建、PUT 更新、DELETE 删除。资源使用名词复数。状态码使用标准 HTTP 状态码。版本化通过 URL 或 Accept 头实现。",source:"REST API Tutorial",tags:["api","rest","设计"],category:"后端开发",createdAt:now,updatedAt:now,importance:9,references:["https://restfulapi.net/"]},{id:generateId$2(),title:"JWT 认证流程",content:"JWT 认证流程：用户登录获取 token，后续请求在 Authorization 头携带 Bearer token。服务端验证签名和过期时间。JWT 包含 header、payload、signature 三部分，使用 base64url 编码。",source:"JWT.io",tags:["jwt","认证","安全"],category:"安全",createdAt:now,updatedAt:now,importance:9,references:["https://jwt.io/introduction"]},{id:generateId$2(),title:"OAuth2.0 授权码流程",content:"OAuth2.0 授权码流程：用户重定向到授权服务器，获取授权码，交换令牌，使用令牌访问资源。适用于服务端应用，安全性最高。",source:"OAuth.net",tags:["oauth","认证","安全"],category:"安全",createdAt:now,updatedAt:now,importance:8,references:["https://oauth.net/2/grant-types/authorization-code/"]},{id:generateId$2(),title:"MySQL 索引优化",content:"MySQL 索引使用 B+Tree 结构。合理创建索引可以大幅提升查询性能。避免在大表上创建过多索引。复合索引遵循最左前缀原则。使用 EXPLAIN 分析查询计划。",source:"MySQL Docs",tags:["mysql","索引","性能优化"],category:"数据库",createdAt:now,updatedAt:now,importance:9,references:["https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html"]},{id:generateId$2(),title:"Redis 缓存策略",content:"Redis 常用缓存策略：Cache-Aside、Write-Through、Write-Behind。使用 TTL 设置过期时间。设置合理的淘汰策略：LRU、LFU、Random。避免缓存穿透、缓存击穿、缓存雪崩问题。",source:"Redis Docs",tags:["redis","缓存","性能优化"],category:"数据库",createdAt:now,updatedAt:now,importance:9,references:["https://redis.io/docs/manual/eviction/"]},{id:generateId$2(),title:"MongoDB 查询优化",content:"MongoDB 使用索引加速查询。使用 explain() 分析查询性能。复合索引遵循前缀原则。使用投影减少返回字段。避免全集合扫描。适当使用聚合管道。",source:"MongoDB Docs",tags:["mongodb","查询优化","数据库"],category:"数据库",createdAt:now,updatedAt:now,importance:8,references:["https://www.mongodb.com/docs/manual/tutorial/optimize-query-performance/"]},{id:generateId$2(),title:"Docker 镜像分层",content:"Docker 镜像采用分层存储。每层只读，容器在顶层添加可写层。使用多阶段构建减小镜像体积。合理使用 .dockerignore 文件排除不必要文件。",source:"Docker Docs",tags:["docker","镜像","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://docs.docker.com/storage/storagedriver/"]},{id:generateId$2(),title:"Kubernetes Pod 生命周期",content:"Kubernetes Pod 生命周期包括 Pending、Running、Succeeded、Failed、Unknown 阶段。使用 init containers 在主容器启动前执行初始化。探针包括 liveness、readiness、startup。",source:"Kubernetes Docs",tags:["kubernetes","pod","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/"]},{id:generateId$2(),title:"CI/CD 流水线设计",content:"CI/CD 流水线通常包含：构建、测试、代码质量检查、部署阶段。使用并行任务加速构建。设置合适的缓存策略。使用矩阵构建测试多环境。",source:"GitHub Actions",tags:["ci/cd","github actions","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://docs.github.com/en/actions/using-workflows"]},{id:generateId$2(),title:"微服务架构设计原则",content:"微服务架构设计原则：单一职责、自治性、无状态、API 优先、去中心化数据管理。使用服务发现和负载均衡。实现断路器模式处理故障。",source:"Microservices.io",tags:["微服务","架构","设计模式"],category:"架构设计",createdAt:now,updatedAt:now,importance:9,references:["https://microservices.io/patterns/index.html"]},{id:generateId$2(),title:"设计模式：工厂模式",content:"工厂模式通过工厂方法创建对象，隐藏实例化逻辑。简单工厂、工厂方法、抽象工厂三种变体。适用于对象创建复杂或需要解耦的场景。",source:"Refactoring Guru",tags:["设计模式","工厂模式","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/factory-method"]},{id:generateId$2(),title:"设计模式：观察者模式",content:"观察者模式定义对象间一对多依赖，当主题状态变化时自动通知所有观察者。适用于事件系统、消息通知等场景。",source:"Refactoring Guru",tags:["设计模式","观察者模式","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/observer"]},{id:generateId$2(),title:"设计模式：策略模式",content:"策略模式定义算法家族，封装每个算法，使它们可以互换。运行时动态选择算法。适用于需要多种算法变体的场景。",source:"Refactoring Guru",tags:["设计模式","策略模式","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/strategy"]},{id:generateId$2(),title:"前端性能优化：代码分割",content:"代码分割通过动态 import() 实现按需加载，减小首屏体积。Webpack 和 Vite 都支持。React 使用 React.lazy 和 Suspense。Vue 使用 defineAsyncComponent。",source:"Webpack Docs",tags:["性能优化","代码分割","前端"],category:"性能优化",createdAt:now,updatedAt:now,importance:8,references:["https://webpack.js.org/guides/code-splitting/"]},{id:generateId$2(),title:"前端性能优化：图片优化",content:'图片优化策略：使用现代格式 WebP/AVIF；响应式图片使用 srcset 和 sizes；懒加载使用 loading="lazy"；压缩图片；使用 CDN 加速。',source:"Web.dev",tags:["性能优化","图片","前端"],category:"性能优化",createdAt:now,updatedAt:now,importance:8,references:["https://web.dev/fast/optimize-images/"]},{id:generateId$2(),title:"前端性能优化：缓存策略",content:"浏览器缓存策略：使用 Cache-Control 设置缓存过期；ETag 和 Last-Modified 实现协商缓存；Service Worker 实现离线缓存；HTTP/2 多路复用。",source:"Web.dev",tags:["性能优化","缓存","前端"],category:"性能优化",createdAt:now,updatedAt:now,importance:8,references:["https://web.dev/http-cache/"]},{id:generateId$2(),title:"XSS 攻击防护",content:"XSS 防护措施：对用户输入进行转义；使用安全的 DOM API；设置 CSP 策略；使用 HttpOnly 和 Secure Cookie；避免使用 eval()。",source:"OWASP",tags:["安全","xss","防护"],category:"安全",createdAt:now,updatedAt:now,importance:9,references:["https://owasp.org/www-community/attacks/xss/"]},{id:generateId$2(),title:"CSRF 攻击防护",content:"CSRF 防护措施：使用 CSRF Token；验证 Referer 头；使用 SameSite Cookie；对敏感操作使用 POST 方法。",source:"OWASP",tags:["安全","csrf","防护"],category:"安全",createdAt:now,updatedAt:now,importance:8,references:["https://owasp.org/www-community/attacks/csrf"]},{id:generateId$2(),title:"SQL 注入防护",content:"SQL 注入防护措施：使用参数化查询/预编译语句；使用 ORM 框架；对用户输入进行验证和过滤；最小化数据库用户权限。",source:"OWASP",tags:["安全","sql注入","防护"],category:"安全",createdAt:now,updatedAt:now,importance:9,references:["https://owasp.org/www-community/attacks/SQL_Injection"]},{id:generateId$2(),title:"Jest Mock 函数",content:"Jest Mock 函数用于模拟依赖。使用 jest.fn() 创建模拟函数；使用 jest.mock() 模拟模块；使用 .mockReturnValue() 设置返回值；使用 .toHaveBeenCalled() 断言调用。",source:"Jest Docs",tags:["jest","测试","mock"],category:"测试",createdAt:now,updatedAt:now,importance:8,references:["https://jestjs.io/docs/mock-functions"]},{id:generateId$2(),title:"测试金字塔",content:"测试金字塔包含三层：单元测试（底层，数量最多）、集成测试（中层）、端到端测试（顶层，数量最少）。合理分配测试类型可以提高效率和可靠性。",source:"Martin Fowler",tags:["测试","单元测试","集成测试"],category:"测试",createdAt:now,updatedAt:now,importance:8,references:["https://martinfowler.com/articles/practical-test-pyramid.html"]},{id:generateId$2(),title:"TDD 测试驱动开发",content:"TDD 流程：先写失败的测试，再写通过测试的最小代码，最后重构。红-绿-重构循环。优点：更好的测试覆盖率，更清晰的设计。",source:"Martin Fowler",tags:["测试","tdd","开发流程"],category:"测试",createdAt:now,updatedAt:now,importance:7,references:["https://martinfowler.com/bliki/TestDrivenDevelopment.html"]},{id:generateId$2(),title:"ESLint 配置",content:"ESLint 使用配置文件（.eslintrc）管理规则。extends 继承预设配置；rules 自定义规则；plugins 添加额外规则。使用 --fix 自动修复问题。",source:"ESLint Docs",tags:["eslint","工具链","代码质量"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://eslint.org/docs/user-guide/configuring/"]},{id:generateId$2(),title:"Prettier 配置",content:"Prettier 使用 .prettierrc 配置格式化规则。printWidth 设置换行宽度；tabWidth 设置缩进；semi 是否加分号；singleQuote 是否使用单引号。",source:"Prettier Docs",tags:["prettier","工具链","代码格式化"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://prettier.io/docs/en/configuration.html"]},{id:generateId$2(),title:"pnpm 工作区",content:"pnpm 使用 workspace 管理多包项目。在根目录创建 pnpm-workspace.yaml，定义 packages 路径。使用 pnpm add --workspace 添加依赖。共享依赖提升到根 node_modules。",source:"pnpm Docs",tags:["pnpm","工具链","monorepo"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://pnpm.io/workspaces"]},{id:generateId$2(),title:"Solid 原则",content:"SOLID 原则包括：单一职责、开闭原则、里氏替换、接口隔离、依赖倒置。遵循这些原则可以提高代码的可维护性和可扩展性。",source:"Robert Martin",tags:["solid","设计原则","最佳实践"],category:"最佳实践",createdAt:now,updatedAt:now,importance:9,references:["https://en.wikipedia.org/wiki/SOLID"]},{id:generateId$2(),title:"Clean Code 原则",content:"Clean Code 原则：有意义的命名、保持函数短小、避免重复代码、使用描述性变量名、注释解释为什么而非怎么做。可读性比性能更重要。",source:"Robert Martin",tags:["clean code","代码质量","最佳实践"],category:"最佳实践",createdAt:now,updatedAt:now,importance:8,references:["https://www.oreilly.com/library/view/clean-code/9780136083238/"]},{id:generateId$2(),title:"代码审查检查清单",content:"代码审查要点：逻辑正确性、代码风格、性能考虑、安全隐患、错误处理、文档注释、测试覆盖、命名规范。使用检查清单确保审查质量。",source:"Google",tags:["代码审查","最佳实践","团队协作"],category:"最佳实践",createdAt:now,updatedAt:now,importance:7,references:["https://google.github.io/eng-practices/review/checklist/"]},{id:generateId$2(),title:"React Context 使用",content:"React Context 用于跨组件传递数据，避免 props 层层传递。创建 Context 使用 createContext()；提供值使用 Provider；消费值使用 useContext() 或 Consumer。",source:"React Docs",tags:["react","context","状态管理"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://react.dev/reference/react/createContext"]},{id:generateId$2(),title:"React useReducer Hook",content:"useReducer 用于管理复杂状态逻辑。接收 reducer 函数和初始状态，返回状态和 dispatch 函数。reducer 是纯函数，根据 action 更新状态。",source:"React Docs",tags:["react","hooks","usereducer","状态管理"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://react.dev/reference/react/useReducer"]},{id:generateId$2(),title:"TypeScript 类型守卫",content:"类型守卫用于在运行时缩小类型范围。typeof 检查基本类型；instanceof 检查类实例；in 检查属性存在；自定义类型守卫使用 is 关键字。",source:"TypeScript Docs",tags:["typescript","类型守卫","类型"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://www.typescriptlang.org/docs/handbook/2/narrowing.html"]},{id:generateId$2(),title:"TypeScript 条件类型",content:"条件类型根据类型关系选择类型。语法：T extends U ? X : Y。常用工具类型如 ReturnType、Parameters、Exclude、Extract 都是条件类型实现。",source:"TypeScript Docs",tags:["typescript","条件类型","高级类型"],category:"前端开发",createdAt:now,updatedAt:now,importance:7,references:["https://www.typescriptlang.org/docs/handbook/2/conditional-types.html"]},{id:generateId$2(),title:"Vue3 provide/inject",content:"provide/inject 用于跨层级组件通信。父组件使用 provide 提供值，子孙组件使用 inject 注入值。适用于深度嵌套场景。",source:"Vue Docs",tags:["vue","provide","inject","组件通信"],category:"前端开发",createdAt:now,updatedAt:now,importance:7,references:["https://vuejs.org/api/component-options.html#provide"]},{id:generateId$2(),title:"Vue3 watch 和 watchEffect",content:"watch 需要明确指定依赖，只在依赖变化时执行。watchEffect 自动追踪依赖，在初始化时立即执行。watch 可以访问旧值和新值。",source:"Vue Docs",tags:["vue","watch","响应式"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://vuejs.org/api/reactivity-core.html#watch"]},{id:generateId$2(),title:"JavaScript 闭包",content:"闭包是函数能够访问其词法作用域外的变量。创建闭包的方式：返回内部函数、传递函数作为参数。闭包常用于数据封装和函数柯里化。",source:"MDN",tags:["javascript","闭包","基础"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures"]},{id:generateId$2(),title:"JavaScript 事件委托",content:"事件委托利用事件冒泡，将事件处理程序绑定到父元素而非每个子元素。减少内存占用，支持动态添加元素。使用 event.target 判断触发元素。",source:"MDN",tags:["javascript","事件委托","dom"],category:"前端开发",createdAt:now,updatedAt:now,importance:7,references:["https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation"]},{id:generateId$2(),title:"CSS 伪元素 ::before 和 ::after",content:"::before 和 ::after 创建元素的子伪元素。必须设置 content 属性。常用于添加装饰性内容、清除浮动、创建图标。",source:"MDN",tags:["css","伪元素","样式"],category:"前端开发",createdAt:now,updatedAt:now,importance:7,references:["https://developer.mozilla.org/en-US/docs/Web/CSS/::before"]},{id:generateId$2(),title:"CSS 媒体查询",content:"媒体查询用于响应式设计。语法：@media (条件) { 样式 }。常用条件：max-width、min-width、orientation。使用移动优先或桌面优先策略。",source:"MDN",tags:["css","媒体查询","响应式"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"]},{id:generateId$2(),title:"Git Rebase 与 Merge",content:"Merge 保留完整历史，创建合并提交。Rebase 将提交移动到新的基础上，产生线性历史。本地分支使用 rebase，公共分支使用 merge。",source:"Git Docs",tags:["git","rebase","merge"],category:"工具链",createdAt:now,updatedAt:now,importance:8,references:["https://git-scm.com/docs/git-rebase"]},{id:generateId$2(),title:"Node.js Stream",content:"Stream 用于处理大量数据，避免一次性加载到内存。四种类型：Readable、Writable、Duplex、Transform。使用 pipe() 连接流。",source:"Node.js Docs",tags:["node.js","stream","性能"],category:"后端开发",createdAt:now,updatedAt:now,importance:8,references:["https://nodejs.org/docs/latest/api/stream.html"]},{id:generateId$2(),title:"Express 错误处理",content:"Express 错误处理中间件需要四个参数 (err, req, res, next)。使用 try/catch 捕获同步错误。异步错误需要调用 next(err)。设置统一的错误响应格式。",source:"Express Docs",tags:["express","错误处理","node.js"],category:"后端开发",createdAt:now,updatedAt:now,importance:8,references:["https://expressjs.com/en/guide/error-handling.html"]},{id:generateId$2(),title:"GraphQL 与 REST 对比",content:"REST 使用多个端点获取不同资源，GraphQL 使用单一端点按需获取数据。GraphQL 减少过度获取和多次请求，但需要额外的学习成本和缓存策略。",source:"GraphQL Docs",tags:["graphql","api","rest"],category:"后端开发",createdAt:now,updatedAt:now,importance:7,references:["https://graphql.org/learn/"]},{id:generateId$2(),title:"Cookie 安全标志",content:"Cookie 安全标志：HttpOnly 防止 JS 访问；Secure 只在 HTTPS 传输；SameSite 防止 CSRF；Max-Age 设置过期时间。",source:"OWASP",tags:["安全","cookie","http"],category:"安全",createdAt:now,updatedAt:now,importance:8,references:["https://owasp.org/www-community/attacks/csrf"]},{id:generateId$2(),title:"HTTPS 证书管理",content:"HTTPS 使用 TLS/SSL 证书加密通信。使用 Let's Encrypt 获取免费证书。定期更新证书。配置正确的 TLS 版本和加密套件。",source:"Let's Encrypt",tags:["安全","https","tls"],category:"安全",createdAt:now,updatedAt:now,importance:8,references:["https://letsencrypt.org/"]},{id:generateId$2(),title:"MySQL 事务隔离级别",content:"MySQL 事务隔离级别：READ UNCOMMITTED（脏读）、READ COMMITTED（不可重复读）、REPEATABLE READ（幻读）、SERIALIZABLE。InnoDB 默认 REPEATABLE READ。",source:"MySQL Docs",tags:["mysql","事务","数据库"],category:"数据库",createdAt:now,updatedAt:now,importance:8,references:["https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html"]},{id:generateId$2(),title:"Redis 数据类型",content:"Redis 支持五种基本数据类型：String（字符串）、Hash（哈希）、List（列表）、Set（集合）、ZSet（有序集合）。选择合适的数据类型可以提高效率。",source:"Redis Docs",tags:["redis","数据类型","数据库"],category:"数据库",createdAt:now,updatedAt:now,importance:8,references:["https://redis.io/docs/data-types/"]},{id:generateId$2(),title:"MongoDB 副本集",content:"MongoDB 副本集提供高可用性。包含一个主节点（Primary）和多个从节点（Secondary）。主节点处理写操作，从节点复制数据。故障时自动选举新主节点。",source:"MongoDB Docs",tags:["mongodb","副本集","高可用"],category:"数据库",createdAt:now,updatedAt:now,importance:8,references:["https://www.mongodb.com/docs/manual/replication/"]},{id:generateId$2(),title:"Docker Compose",content:"Docker Compose 使用 YAML 文件定义多容器应用。services 定义服务；volumes 定义卷；networks 定义网络。使用 docker-compose up 启动应用。",source:"Docker Docs",tags:["docker","compose","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://docs.docker.com/compose/"]},{id:generateId$2(),title:"Kubernetes Service",content:"Kubernetes Service 提供 Pod 的稳定访问地址。ClusterIP 内部访问；NodePort 暴露到节点端口；LoadBalancer 云厂商负载均衡；ExternalName 映射外部服务。",source:"Kubernetes Docs",tags:["kubernetes","service","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://kubernetes.io/docs/concepts/services-networking/service/"]},{id:generateId$2(),title:"Nginx 反向代理",content:"Nginx 反向代理接收客户端请求，转发到后端服务器。配置 upstream 定义后端服务器组。使用 location 匹配 URL。支持负载均衡和缓存。",source:"Nginx Docs",tags:["nginx","反向代理","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://nginx.org/en/docs/http/ngx_http_proxy_module.html"]},{id:generateId$2(),title:"设计模式：单例模式",content:"单例模式确保类只有一个实例。实现方式：私有构造函数、静态获取方法。注意线程安全问题。适用于全局状态管理、日志器等场景。",source:"Refactoring Guru",tags:["设计模式","单例模式","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/singleton"]},{id:generateId$2(),title:"设计模式：适配器模式",content:"适配器模式将一个类的接口转换成客户端期望的另一个接口。适用于集成已有代码或第三方库。分为类适配器和对象适配器。",source:"Refactoring Guru",tags:["设计模式","适配器模式","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/adapter"]},{id:generateId$2(),title:"设计模式：装饰器模式",content:"装饰器模式动态给对象添加额外功能。使用组合而非继承。适用于需要灵活扩展功能的场景。",source:"Refactoring Guru",tags:["设计模式","装饰器模式","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/decorator"]},{id:generateId$2(),title:"前端性能优化：首屏优化",content:"首屏优化策略：减小 HTML 体积；内联关键 CSS；使用 Critical CSS；预加载关键资源；延迟加载非关键资源；使用 CDN。",source:"Web.dev",tags:["性能优化","首屏","前端"],category:"性能优化",createdAt:now,updatedAt:now,importance:9,references:["https://web.dev/fast/"]},{id:generateId$2(),title:"前端性能优化：内存泄漏",content:"常见内存泄漏原因：意外的全局变量、闭包引用、DOM 引用未清理、定时器未清除、事件监听器未移除。使用 Chrome DevTools Memory 面板检测。",source:"Web.dev",tags:["性能优化","内存泄漏","前端"],category:"性能优化",createdAt:now,updatedAt:now,importance:8,references:["https://developer.chrome.com/docs/devtools/memory-problems/"]},{id:generateId$2(),title:"前端性能优化：Web Worker",content:"Web Worker 在后台线程执行脚本，不阻塞主线程。适用于计算密集型任务。使用 postMessage 通信。注意不能访问 DOM。",source:"MDN",tags:["性能优化","web worker","前端"],category:"性能优化",createdAt:now,updatedAt:now,importance:7,references:["https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API"]},{id:generateId$2(),title:"安全：依赖漏洞检测",content:"依赖漏洞检测工具：npm audit、Snyk、Dependabot。定期更新依赖。设置自动化检测。关注安全公告。",source:"npm",tags:["安全","依赖","漏洞"],category:"安全",createdAt:now,updatedAt:now,importance:8,references:["https://docs.npmjs.com/cli/v9/commands/npm-audit"]},{id:generateId$2(),title:"安全：输入验证",content:"输入验证策略：服务端验证为主，客户端验证为辅。使用白名单验证。对特殊字符进行转义。使用验证库如 Joi、Zod。",source:"OWASP",tags:["安全","输入验证","防护"],category:"安全",createdAt:now,updatedAt:now,importance:8,references:["https://owasp.org/www-community/attacks/Input_Validation"]},{id:generateId$2(),title:"Vitest 测试框架",content:"Vitest 是新一代测试框架，与 Vite 无缝集成。支持 ESM 原生模块。内置 TypeScript 支持。运行速度快。兼容 Jest API。",source:"Vitest Docs",tags:["vitest","测试","工具链"],category:"测试",createdAt:now,updatedAt:now,importance:7,references:["https://vitest.dev/"]},{id:generateId$2(),title:"Cypress E2E 测试",content:"Cypress 是端到端测试框架。直接在浏览器中运行。自动等待元素出现。内置网络请求拦截。提供时间旅行调试。",source:"Cypress Docs",tags:["cypress","e2e","测试"],category:"测试",createdAt:now,updatedAt:now,importance:7,references:["https://docs.cypress.io/"]},{id:generateId$2(),title:"npm 脚本使用",content:"npm 脚本定义在 package.json 的 scripts 字段。使用 npm run <script> 执行。支持预/post 钩子（prebuild、postbuild）。可以使用 && 连接多个命令。",source:"npm Docs",tags:["npm","脚本","工具链"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://docs.npmjs.com/cli/v9/using-npm/scripts"]},{id:generateId$2(),title:"Babel 配置",content:"Babel 将 ES6+ 代码转译为兼容代码。使用 @babel/preset-env 自动根据目标环境选择转换。使用插件添加特定功能。配置文件可以是 .babelrc 或 babel.config.json。",source:"Babel Docs",tags:["babel","工具链","转译"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://babeljs.io/docs/en/configuration"]},{id:generateId$2(),title:"代码重构技巧",content:"重构技巧：提取函数、提取变量、拆分长函数、消除重复代码、简化条件判断、重命名变量和函数。每次小步修改，确保测试通过。",source:"Refactoring",tags:["重构","最佳实践","代码质量"],category:"最佳实践",createdAt:now,updatedAt:now,importance:8,references:["https://refactoring.guru/"]},{id:generateId$2(),title:"代码注释规范",content:"注释规范：函数注释使用 JSDoc/TSDoc；行内注释解释复杂逻辑；避免冗余注释；TODO 标记待完成任务；FIXME 标记需要修复的问题。",source:"Google",tags:["注释","最佳实践","代码质量"],category:"最佳实践",createdAt:now,updatedAt:now,importance:7,references:["https://google.github.io/styleguide/"]},{id:generateId$2(),title:"React 自定义 Hook",content:"自定义 Hook 以 use 开头，封装可复用逻辑。可以调用其他 Hook。返回值灵活，可以是数组或对象。例如 useFetch、useLocalStorage。",source:"React Docs",tags:["react","hooks","自定义hook"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://react.dev/reference/react#custom-hooks"]},{id:generateId$2(),title:"React 性能优化：React.memo",content:"React.memo 是高阶组件，对组件的 props 进行浅比较，避免不必要的重渲染。适用于纯展示组件。配合 useMemo 和 useCallback 使用效果更好。",source:"React Docs",tags:["react","性能优化","memo"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://react.dev/reference/react/memo"]},{id:generateId$2(),title:"TypeScript 接口与类型别名",content:"接口使用 interface 定义，类型别名使用 type 定义。接口可以扩展和合并声明，类型别名可以表示联合类型和交叉类型。推荐优先使用接口。",source:"TypeScript Docs",tags:["typescript","interface","type"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"]},{id:generateId$2(),title:"TypeScript 类型断言",content:"类型断言告诉编译器某个值的类型。使用 as 语法：value as Type。使用尖括号语法：<Type>value（JSX 中不适用）。避免过度使用，优先使用类型守卫。",source:"TypeScript Docs",tags:["typescript","类型断言","类型"],category:"前端开发",createdAt:now,updatedAt:now,importance:7,references:["https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions"]},{id:generateId$2(),title:"Vue3 组合式函数",content:"组合式函数以 use 开头，封装可复用逻辑。可以调用其他组合式函数和响应式 API。返回响应式状态和方法。例如 useMouse、useFetch。",source:"Vue Docs",tags:["vue","composition","组合式函数"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://vuejs.org/guide/reusability/composables.html"]},{id:generateId$2(),title:"Vue3 自定义指令",content:"自定义指令使用 defineDirective 定义。支持 mounted、updated、unmounted 钩子。可以接收参数和修饰符。适用于 DOM 操作场景。",source:"Vue Docs",tags:["vue","指令","自定义"],category:"前端开发",createdAt:now,updatedAt:now,importance:7,references:["https://vuejs.org/guide/reusability/custom-directives.html"]},{id:generateId$2(),title:"JavaScript Promise.all 与 Promise.allSettled",content:"Promise.all 所有 Promise 成功才成功，任一失败则全部失败。Promise.allSettled 等待所有 Promise 完成，返回每个的结果状态（fulfilled/rejected）。",source:"MDN",tags:["javascript","promise","async"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"]},{id:generateId$2(),title:"JavaScript 可选链和空值合并",content:"可选链 ?. 安全访问嵌套属性，避免空值错误。空值合并 ?? 仅在值为 null 或 undefined 时返回默认值。组合使用：obj?.prop ?? defaultValue。",source:"MDN",tags:["javascript","可选链","空值合并"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining"]},{id:generateId$2(),title:"CSS 变量",content:"CSS 变量使用 -- 定义，var() 使用。可以在 :root 中定义全局变量。支持继承和级联。可以通过 JavaScript 动态修改。",source:"MDN",tags:["css","变量","样式"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties"]},{id:generateId$2(),title:"CSS Flexbox gap 属性",content:"gap 属性设置 flex 子元素之间的间距。row-gap 设置行间距，column-gap 设置列间距。gap 是简写形式。适用于 Flexbox 和 Grid。",source:"MDN",tags:["css","flexbox","gap"],category:"前端开发",createdAt:now,updatedAt:now,importance:7,references:["https://developer.mozilla.org/en-US/docs/Web/CSS/gap"]},{id:generateId$2(),title:"Git 工作流：GitHub Flow",content:"GitHub Flow 简化的分支策略：从 main 分支创建 feature 分支，提交更改，创建 Pull Request，审查通过后合并回 main。适用于持续部署场景。",source:"GitHub",tags:["git","工作流","github flow"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://docs.github.com/en/get-started/quickstart/github-flow"]},{id:generateId$2(),title:"Node.js 模块化",content:'Node.js 支持 CommonJS 和 ES Modules。使用 require() 和 module.exports 是 CommonJS；使用 import 和 export 是 ES Modules。package.json 中设置 "type": "module" 使用 ES Modules。',source:"Node.js Docs",tags:["node.js","模块化","commonjs"],category:"后端开发",createdAt:now,updatedAt:now,importance:8,references:["https://nodejs.org/docs/latest/api/modules.html"]},{id:generateId$2(),title:"Express 路由参数",content:"Express 路由参数使用 :param 定义。通过 req.params 访问。支持正则表达式约束。例如 /users/:id([0-9]+) 只匹配数字 ID。",source:"Express Docs",tags:["express","路由","node.js"],category:"后端开发",createdAt:now,updatedAt:now,importance:7,references:["https://expressjs.com/en/guide/routing.html"]},{id:generateId$2(),title:"REST API 分页设计",content:"分页策略：基于偏移量（offset/limit）或基于游标（cursor）。偏移量简单但大数据量时性能差。游标分页使用唯一标识，性能更好。返回 total、page、perPage 等元数据。",source:"REST API Tutorial",tags:["api","分页","设计"],category:"后端开发",createdAt:now,updatedAt:now,importance:7,references:["https://restfulapi.net/pagination/"]},{id:generateId$2(),title:"安全：CORS 配置",content:"CORS（跨域资源共享）控制浏览器是否允许跨域请求。服务端设置 Access-Control-Allow-Origin、Access-Control-Allow-Methods、Access-Control-Allow-Headers。使用预检请求（OPTIONS）。",source:"MDN",tags:["安全","cors","跨域"],category:"安全",createdAt:now,updatedAt:now,importance:8,references:["https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"]},{id:generateId$2(),title:"安全：速率限制",content:"速率限制防止 API 被滥用。使用中间件如 express-rate-limit。限制请求频率（如每分钟 100 次）。使用 Redis 存储跨实例的请求计数。",source:"OWASP",tags:["安全","速率限制","api"],category:"安全",createdAt:now,updatedAt:now,importance:7,references:["https://owasp.org/www-community/attacks/Denial_of_Service"]},{id:generateId$2(),title:"MySQL 锁机制",content:"MySQL 锁包括表级锁和行级锁。InnoDB 使用行级锁，MyISAM 使用表级锁。行级锁基于索引。死锁可能发生在交叉更新场景。使用 SHOW PROCESSLIST 查看锁状态。",source:"MySQL Docs",tags:["mysql","锁","数据库"],category:"数据库",createdAt:now,updatedAt:now,importance:8,references:["https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html"]},{id:generateId$2(),title:"Redis 事务",content:"Redis 事务使用 MULTI、EXEC、DISCARD 命令。MULTI 开始事务，EXEC 执行，DISCARD 取消。Redis 事务保证原子性但不支持回滚。使用 WATCH 监控键变化。",source:"Redis Docs",tags:["redis","事务","数据库"],category:"数据库",createdAt:now,updatedAt:now,importance:7,references:["https://redis.io/docs/manual/transactions/"]},{id:generateId$2(),title:"MongoDB 聚合管道",content:"MongoDB 聚合管道由多个阶段组成：$match（过滤）、$group（分组）、$project（投影）、$sort（排序）、$limit（限制）。阶段按顺序执行，前一阶段的输出作为后一阶段的输入。",source:"MongoDB Docs",tags:["mongodb","聚合","数据库"],category:"数据库",createdAt:now,updatedAt:now,importance:8,references:["https://www.mongodb.com/docs/manual/aggregation/"]},{id:generateId$2(),title:"Docker 多阶段构建",content:"多阶段构建使用多个 FROM 指令。第一阶段构建应用，第二阶段复制产物。减小最终镜像体积。示例：builder 阶段编译，runtime 阶段运行。",source:"Docker Docs",tags:["docker","多阶段构建","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://docs.docker.com/build/building/multi-stage/"]},{id:generateId$2(),title:"Kubernetes ConfigMap 和 Secret",content:"ConfigMap 存储非敏感配置，Secret 存储敏感信息（如密码、API Key）。Secret 使用 Base64 编码。通过 volume 或环境变量注入到 Pod。",source:"Kubernetes Docs",tags:["kubernetes","configmap","secret"],category:"DevOps",createdAt:now,updatedAt:now,importance:8,references:["https://kubernetes.io/docs/concepts/configuration/configmap/"]},{id:generateId$2(),title:"Prometheus 监控",content:"Prometheus 是开源监控系统。使用指标（metrics）收集数据。支持四种指标类型：Counter（计数器）、Gauge（仪表盘）、Histogram（直方图）、Summary（摘要）。使用 Grafana 可视化。",source:"Prometheus Docs",tags:["prometheus","监控","devops"],category:"DevOps",createdAt:now,updatedAt:now,importance:7,references:["https://prometheus.io/docs/introduction/overview/"]},{id:generateId$2(),title:"设计模式：策略模式实现",content:"策略模式实现：定义策略接口，实现多个策略类，上下文类持有策略引用。运行时切换策略。适用于支付方式、排序算法等场景。",source:"Refactoring Guru",tags:["设计模式","策略模式","实现"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/strategy/typescript/example"]},{id:generateId$2(),title:"设计模式：模板方法模式",content:"模板方法模式定义算法骨架，子类实现具体步骤。抽象类定义模板方法和抽象方法。适用于框架设计、算法变体场景。",source:"Refactoring Guru",tags:["设计模式","模板方法","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/template-method"]},{id:generateId$2(),title:"设计模式：状态模式",content:"状态模式封装对象状态，使对象行为随状态变化而变化。状态类实现状态接口，上下文类委托给当前状态对象。适用于有限状态机场景。",source:"Refactoring Guru",tags:["设计模式","状态模式","oop"],category:"架构设计",createdAt:now,updatedAt:now,importance:7,references:["https://refactoring.guru/design-patterns/state"]},{id:generateId$2(),title:"前端性能优化：Lazy Loading",content:'懒加载延迟加载非关键资源。图片使用 loading="lazy" 属性。组件使用 React.lazy 或 Vue 的 defineAsyncComponent。路由级别的代码分割。',source:"Web.dev",tags:["性能优化","懒加载","前端"],category:"性能优化",createdAt:now,updatedAt:now,importance:8,references:["https://web.dev/lazy-loading/"]},{id:generateId$2(),title:"前端性能优化：Code Splitting 实践",content:"代码分割实践：路由级别分割、组件级别分割、按需加载第三方库。使用 React.lazy + Suspense。使用 webpackChunkName 命名 chunks。分析打包体积。",source:"Webpack Docs",tags:["性能优化","代码分割","webpack"],category:"性能优化",createdAt:now,updatedAt:now,importance:8,references:["https://webpack.js.org/guides/code-splitting/"]},{id:generateId$2(),title:"前端性能优化：Service Worker",content:"Service Worker 在浏览器后台运行。拦截网络请求，实现离线缓存。使用 Cache API 存储资源。使用 Workbox 简化开发。",source:"MDN",tags:["性能优化","service worker","pwa"],category:"性能优化",createdAt:now,updatedAt:now,importance:7,references:["https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"]},{id:generateId$2(),title:"安全：SQL 注入防护实践",content:"SQL 注入防护：使用参数化查询；避免字符串拼接；使用 ORM；输入验证；最小权限原则；使用存储过程时注意安全。",source:"OWASP",tags:["安全","sql注入","实践"],category:"安全",createdAt:now,updatedAt:now,importance:9,references:["https://owasp.org/www-community/attacks/SQL_Injection"]},{id:generateId$2(),title:"安全：XSS 防护实践",content:"XSS 防护：转义输出；使用 textContent 而非 innerHTML；设置 CSP；使用 HttpOnly Cookie；过滤用户输入；使用模板引擎自动转义。",source:"OWASP",tags:["安全","xss","实践"],category:"安全",createdAt:now,updatedAt:now,importance:9,references:["https://owasp.org/www-community/attacks/xss/"]},{id:generateId$2(),title:"测试覆盖率",content:"测试覆盖率指标：语句覆盖率、分支覆盖率、函数覆盖率、行覆盖率。目标不是 100%，而是覆盖关键路径。使用 jest --coverage 或 vitest --coverage 生成报告。",source:"Jest Docs",tags:["测试","覆盖率","工具"],category:"测试",createdAt:now,updatedAt:now,importance:7,references:["https://jestjs.io/docs/coverage"]},{id:generateId$2(),title:"Mock 与 Stub",content:'Mock 验证交互行为，Stub 提供预设返回值。Mock 关注"是否调用"，Stub 关注"返回什么"。在测试中合理使用两者。',source:"Martin Fowler",tags:["测试","mock","stub"],category:"测试",createdAt:now,updatedAt:now,importance:7,references:["https://martinfowler.com/articles/mocksArentStubs.html"]},{id:generateId$2(),title:"npm 依赖管理",content:"npm 依赖管理：使用 ^ 和 ~ 控制版本范围；定期更新依赖（npm update）；使用 npm audit 检测漏洞；使用 pnpm 提升安装速度和节省空间。",source:"npm Docs",tags:["npm","依赖","工具链"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://docs.npmjs.com/cli/v9/commands/npm-install"]},{id:generateId$2(),title:"Git Hooks",content:"Git Hooks 是在特定 Git 事件时执行的脚本。常用钩子：pre-commit（提交前）、commit-msg（提交信息校验）、pre-push（推送前）。使用 Husky 管理钩子。",source:"Git Docs",tags:["git","hooks","工具链"],category:"工具链",createdAt:now,updatedAt:now,importance:7,references:["https://git-scm.com/docs/githooks"]},{id:generateId$2(),title:"代码风格指南",content:"代码风格指南：统一缩进（空格/制表符）；代码行长度限制；大括号位置；分号使用；变量命名规范（驼峰/下划线）。使用 ESLint 和 Prettier 强制执行。",source:"Google",tags:["代码风格","最佳实践","规范"],category:"最佳实践",createdAt:now,updatedAt:now,importance:7,references:["https://google.github.io/styleguide/"]},{id:generateId$2(),title:"错误处理最佳实践",content:"错误处理：明确错误类型；提供有用的错误信息；使用 try/catch 捕获异常；不要吞掉异常；使用统一的错误处理中间件；记录错误日志。",source:"OWASP",tags:["错误处理","最佳实践","调试"],category:"最佳实践",createdAt:now,updatedAt:now,importance:8,references:["https://owasp.org/www-community/Improper_Error_Handling"]},{id:generateId$2(),title:"React useEffect 清理函数",content:"useEffect 返回的函数在组件卸载前执行，用于清理副作用。清理定时器、取消订阅、移除事件监听器。避免内存泄漏。",source:"React Docs",tags:["react","hooks","useeffect","清理"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://react.dev/reference/react/useEffect#cleaning-up-an-effect"]},{id:generateId$2(),title:"React useMemo Hook",content:"useMemo 缓存计算结果，避免昂贵计算在每次渲染时重复执行。依赖数组变化时重新计算。用于优化渲染性能。",source:"React Docs",tags:["react","hooks","usememo","性能"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://react.dev/reference/react/useMemo"]},{id:generateId$2(),title:"React useCallback Hook",content:"useCallback 缓存函数引用，避免子组件不必要的重渲染。与 React.memo 配合使用效果更好。依赖数组变化时重新创建函数。",source:"React Docs",tags:["react","hooks","usecallback","性能"],category:"前端开发",createdAt:now,updatedAt:now,importance:8,references:["https://react.dev/reference/react/useCallback"]}],techKeywords={前端开发:["react","vue","angular","javascript","typescript","css","html","webpack","vite","组件","界面","ui","前端","浏览器","dom","状态管理","redux","zustand"],后端开发:["node.js","express","nestjs","api","接口","后端","服务器","中间件","路由","数据库","redis","mongodb","mysql","postgresql"],数据库:["sql","nosql","mongodb","mysql","postgresql","redis","索引","查询优化","事务","数据库","缓存","orm"],DevOps:["docker","kubernetes","ci/cd","部署","运维","自动化","linux","nginx","监控","日志","容器","微服务"],架构设计:["架构","设计模式","微服务","单体","分布式","高可用","可扩展","ddd","领域驱动","分层架构","依赖注入"],性能优化:["性能","优化","缓存","懒加载","预加载","代码分割","压缩","首屏","加载速度","内存泄漏","性能瓶颈"],安全:["安全","xss","csrf","sql注入","认证","授权","jwt","oauth","加密","脱敏","漏洞","防护"],测试:["测试","单元测试","集成测试","e2e","jest","vitest","测试用例","覆盖率","mock","断言","tdd"],工具链:["git","npm","yarn","pnpm","eslint","prettier","typescript","babel","构建工具","脚手架","插件"],最佳实践:["最佳实践","规范","代码质量","可维护性","可读性","重构","clean code","solid","设计原则"]};function generateId$1(){return Date.now().toString(36)+Math.random().toString(36).substr(2,9)}function extractKnowledge(s,e="conversation"){const t=[],n=[],a=new Set;s.split(/[。！？.!?\n]/).filter(l=>l.trim().length>10).forEach((l,p)=>{const m=l.trim(),d=[];let x="最佳实践";for(const[u,f]of Object.entries(techKeywords))for(const k of f)m.toLowerCase().includes(k.toLowerCase())&&(d.push(k),a.add(u),x=u);const h=m.includes("```")||m.includes("function")||m.includes("const"),F=m.includes("重要")||m.includes("关键")||m.includes("必须")||m.includes("注意");if(m.endsWith("?")||m.endsWith("？"),d.length>0||h||F){const u=F?9:(h?7:5)+d.length,f=m.slice(0,50).replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g,"").trim(),k={id:generateId$1(),title:f+(f.length<50?"":"..."),content:m,source:e,tags:[...new Set(d)],category:x,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),importance:Math.min(u,10),references:[]};t.push(k),n.push(...d)}});const i=extractKeywords(s),c=[...new Set([...n,...i])];return{points:t.sort((l,p)=>p.importance-l.importance).slice(0,20),keywords:c,categories:Array.from(a)}}function extractKeywords(s){const e=[],t=s.toLowerCase();for(const a of Object.values(techKeywords))for(const o of a)t.includes(o.toLowerCase())&&e.push(o);const n=[/```(\w+)/g,/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,/const\s+(\w+)\s*=/g,/function\s+(\w+)\s*\(/g];for(const a of n){let o;for(;(o=a.exec(s))!==null;)o[1]&&o[1].length>2&&e.push(o[1].toLowerCase())}return[...new Set(e)].slice(0,30)}function searchKnowledge(s,e,t={}){const{limit:n=10,minScore:a=.2,categories:o,tags:i}=t,c=s.toLowerCase(),l=c.split(/\s+/).filter(d=>d.length>0);let p=e;return o&&o.length>0&&(p=p.filter(d=>o.includes(d.category))),i&&i.length>0&&(p=p.filter(d=>d.tags.some(x=>i.includes(x)))),p.map(d=>{let x=0;const h=[],F=[d.title.toLowerCase(),d.content.toLowerCase(),d.tags.join(" ").toLowerCase(),d.category.toLowerCase()].join(" ");for(const u of l)if(F.includes(u)){const f=(F.match(new RegExp(u,"g"))||[]).length;x+=f*.1,h.push(u)}return d.title.toLowerCase().includes(c)&&(x+=.5),d.tags.some(u=>u.toLowerCase()===c)&&(x+=.4),x+=d.importance*.05,{point:d,score:Math.min(x,1),matchedTerms:h}}).filter(d=>d.score>=a).sort((d,x)=>x.score-d.score).slice(0,n)}class KnowledgeEngine{constructor(e=[]){T(this,"knowledgeBase",new Map);T(this,"tagIndex",new Map);T(this,"categoryIndex",new Map);e.forEach(t=>this.addKnowledgePoint(t))}addKnowledgePoint(e){const t=generateId$1(),n=new Date().toISOString(),a={...e,id:t,createdAt:n,updatedAt:n};return this.knowledgeBase.set(t,a),this.updateIndexes(a),a}updateKnowledgePoint(e,t){const n=this.knowledgeBase.get(e);if(!n)return null;const a={...n,...t,updatedAt:new Date().toISOString()};return this.removeFromIndexes(n),this.knowledgeBase.set(e,a),this.updateIndexes(a),a}deleteKnowledgePoint(e){const t=this.knowledgeBase.get(e);return t?(this.removeFromIndexes(t),this.knowledgeBase.delete(e)):!1}getKnowledgePoint(e){return this.knowledgeBase.get(e)}getAllKnowledge(){return Array.from(this.knowledgeBase.values()).sort((e,t)=>new Date(t.updatedAt).getTime()-new Date(e.updatedAt).getTime())}search(e,t={}){return searchKnowledge(e,this.getAllKnowledge(),t)}async vectorSearch(e,t={}){const{useFallback:n=!0,limit:a=10,minScore:o=.3,categories:i,tags:c}=t;let l=this.getAllKnowledge();i&&i.length>0&&(l=l.filter(p=>i.includes(p.category))),c&&c.length>0&&(l=l.filter(p=>p.tags.some(m=>c.includes(m))));try{const{embeddingService:p}=await __vitePreload(async()=>{const{embeddingService:h}=await Promise.resolve().then(()=>embeddingService$1);return{embeddingService:h}},void 0),m=await p.embed(e),d=l.filter(h=>!h.embedding);if(d.length>0){const h=d.map(u=>`${u.title}
${u.content.slice(0,1e3)}`),F=await p.embedBatch(h);d.forEach((u,f)=>{u.embedding=F[f],this.knowledgeBase.set(u.id,u)})}return l.filter(h=>h.embedding).map(h=>{const u=p.cosineSimilarity(m,h.embedding)+h.importance*.02;return{point:h,score:Math.min(u,1),matchedTerms:[]}}).filter(h=>h.score>=o).sort((h,F)=>F.score-h.score).slice(0,a)}catch(p){if(n)return console.warn("向量搜索失败，回退到关键词搜索:",p),this.search(e,t);throw p}}async buildAllEmbeddings(e){const n=this.getAllKnowledge().filter(o=>!o.embedding),a=n.length;if(a===0)return{success:0,failed:0};try{const{embeddingService:o}=await __vitePreload(async()=>{const{embeddingService:p}=await Promise.resolve().then(()=>embeddingService$1);return{embeddingService:p}},void 0);let i=0,c=0;const l=10;for(let p=0;p<n.length;p+=l){const m=n.slice(p,p+l),d=m.map(x=>`${x.title}
${x.content.slice(0,1e3)}`);try{const x=await o.embedBatch(d);m.forEach((h,F)=>{h.embedding=x[F],this.knowledgeBase.set(h.id,h),i++})}catch{c+=m.length}e==null||e(Math.min(p+l,a),a)}return{success:i,failed:c}}catch(o){throw console.error("构建向量索引失败:",o),o}}getEmbeddingStats(){const e=this.getAllKnowledge(),t=e.filter(n=>n.embedding).length;return{total:e.length,withEmbedding:t,withoutEmbedding:e.length-t,progress:e.length>0?t/e.length:0}}extractAndStore(e,t="conversation"){const n=extractKnowledge(e,t);return n.points.forEach(a=>{this.knowledgeBase.set(a.id,a),this.updateIndexes(a)}),n}getByCategory(e){const t=this.categoryIndex.get(e)||new Set;return Array.from(t).map(n=>this.knowledgeBase.get(n)).filter(n=>!!n).sort((n,a)=>a.importance-n.importance)}getByTag(e){const t=this.tagIndex.get(e.toLowerCase())||new Set;return Array.from(t).map(n=>this.knowledgeBase.get(n)).filter(n=>!!n).sort((n,a)=>a.importance-n.importance)}getCategories(){return Array.from(this.categoryIndex.keys()).sort()}getTags(){return Array.from(this.tagIndex.keys()).sort()}getStats(){return{total:this.knowledgeBase.size,categories:this.categoryIndex.size,tags:this.tagIndex.size,byCategory:Object.fromEntries(Array.from(this.categoryIndex.entries()).map(([e,t])=>[e,t.size]))}}updateIndexes(e){this.categoryIndex.has(e.category)||this.categoryIndex.set(e.category,new Set),this.categoryIndex.get(e.category).add(e.id),e.tags.forEach(t=>{const n=t.toLowerCase();this.tagIndex.has(n)||this.tagIndex.set(n,new Set),this.tagIndex.get(n).add(e.id)})}removeFromIndexes(e){var t,n;(t=this.categoryIndex.get(e.category))==null||t.delete(e.id),((n=this.categoryIndex.get(e.category))==null?void 0:n.size)===0&&this.categoryIndex.delete(e.category),e.tags.forEach(a=>{var i,c;const o=a.toLowerCase();(i=this.tagIndex.get(o))==null||i.delete(e.id),((c=this.tagIndex.get(o))==null?void 0:c.size)===0&&this.tagIndex.delete(o)})}exportJSON(){return JSON.stringify(this.getAllKnowledge(),null,2)}importJSON(e){try{const t=JSON.parse(e);let n=0;return t.forEach(a=>{a.id&&a.title&&a.content&&(this.knowledgeBase.set(a.id,a),this.updateIndexes(a),n++)}),n}catch(t){return console.error("Import failed:",t),0}}}new KnowledgeEngine(extendedKnowledge);const MAX_ITERATIONS=50,MAX_SWARM_AGENTS=6;function generateId(){return Math.random().toString(36).slice(2,10)}function delay(s){return new Promise(e=>setTimeout(e,s))}class TaskEngine{constructor(e={}){T(this,"tasks",new Map);T(this,"abortControllers",new Map);T(this,"options");this.options={maxIterations:MAX_ITERATIONS,autoPlan:!0,useSwarm:!1,maxSwarmAgents:MAX_SWARM_AGENTS,...e}}setOptions(e){this.options={...this.options,...e}}createTask(e,t){const n={id:generateId(),title:e,description:t,status:"pending",steps:[],createdAt:new Date().toISOString(),deliverables:[],logs:[],currentStepIndex:-1,maxIterations:this.options.maxIterations||MAX_ITERATIONS,iterationCount:0};return this.tasks.set(n.id,n),this.addLog(n.id,{type:"info",message:`任务已创建: ${e}`}),n}async planTask(e){const t=this.tasks.get(e);if(!t)throw new Error("任务不存在");t.status="planning",this.notifyProgress(t),this.addLog(e,{type:"thinking",message:"正在分析需求，规划任务步骤..."}),await delay(1200+Math.random()*800);const n=this.autoPlanSteps(t.description);return t.steps=n,this.addLog(e,{type:"success",message:`规划完成，共 ${n.length} 个步骤`,detail:n.map((a,o)=>`${o+1}. ${a.title}`).join(`
`)}),t.status="pending",this.notifyProgress(t),t}autoPlanSteps(e){const t=e.toLowerCase(),n=[];n.push({id:generateId(),title:"需求分析与技术选型",description:"分析任务需求，确定技术方案和实现路径",status:"pending",agentRole:"analyst"});const a=t.includes("网站")||t.includes("web")||t.includes("网页")||t.includes("页面")||t.includes("前端"),o=t.includes("代码")||t.includes("开发")||t.includes("程序")||t.includes("脚本")||t.includes("软件"),i=t.includes("数据")||t.includes("分析")||t.includes("报表")||t.includes("统计"),c=t.includes("设计")||t.includes("ui")||t.includes("界面")||t.includes("原型"),l=t.includes("文档")||t.includes("报告")||t.includes("方案")||t.includes("prd");return(c||a)&&(n.push({id:generateId(),title:"产品设计与交互规划",description:"设计产品结构、用户流程和交互方案",status:"pending",agentRole:"pm"}),n.push({id:generateId(),title:"UI设计与视觉方案",description:"设计界面风格、配色方案和视觉元素",status:"pending",agentRole:"designer"})),(o||a)&&(n.push({id:generateId(),title:"架构设计与核心代码",description:"搭建项目架构，编写核心功能代码",status:"pending",agentRole:"coder-a"}),n.push({id:generateId(),title:"功能实现与细节打磨",description:"实现具体功能，打磨交互细节",status:"pending",agentRole:"coder-b"})),i&&(n.push({id:generateId(),title:"数据收集与清洗",description:"收集数据源，进行数据清洗和预处理",status:"pending",agentRole:"data-engineer"}),n.push({id:generateId(),title:"数据分析与可视化",description:"进行深度分析，生成可视化报告",status:"pending",agentRole:"data-scientist"})),l&&n.push({id:generateId(),title:"文档撰写与整理",description:"撰写完整文档，整理结构和内容",status:"pending",agentRole:"technical-writer"}),n.push({id:generateId(),title:"质量检测与优化",description:"检查代码质量，进行优化和修复",status:"pending",agentRole:"qa"}),n.push({id:generateId(),title:"交付物整理与输出",description:"整理所有产出，打包交付最终成果",status:"pending",agentRole:"devops"}),n}async executeTask(e){const t=this.tasks.get(e);if(!t)throw new Error("任务不存在");const n=new AbortController;this.abortControllers.set(e,n);try{t.steps.length===0&&this.options.autoPlan&&await this.planTask(e),t.status="running",t.startedAt=new Date().toISOString(),this.notifyProgress(t),this.addLog(e,{type:"info",message:"任务开始执行"});for(let a=0;a<t.steps.length&&!n.signal.aborted;a++){t.currentStepIndex=a;const o=t.steps[a];o.status="running",o.startedAt=new Date().toISOString(),this.addLog(e,{type:"agent",message:`[${a+1}/${t.steps.length}] ${o.title}`,agentName:o.agentRole}),this.notifyProgress(t);try{this.options.useSwarm&&this.isDecomposableStep(o)?await this.executeSwarmStep(t,o,n.signal):await this.executeStep(t,o,n.signal),o.status="completed",o.completedAt=new Date().toISOString(),this.addLog(e,{type:"success",message:`✓ ${o.title} 完成`,detail:o.output})}catch(i){if(o.status="failed",o.error=i instanceof Error?i.message:"未知错误",o.completedAt=new Date().toISOString(),this.addLog(e,{type:"error",message:`✗ ${o.title} 失败`,detail:o.error}),t.iterationCount++,t.iterationCount<t.maxIterations){this.addLog(e,{type:"thinking",message:`尝试自动修复 (${t.iterationCount}/${t.maxIterations})...`}),a--,o.status="pending",await delay(500);continue}else throw t.status="failed",this.notifyProgress(t),i}this.notifyProgress(t)}return n.signal.aborted?(t.status="cancelled",this.addLog(e,{type:"info",message:"任务已取消"})):(t.status="completed",t.completedAt=new Date().toISOString(),await this.generateDeliverables(t),this.addLog(e,{type:"success",message:`🎉 任务全部完成！共 ${t.steps.length} 个步骤`})),this.notifyProgress(t),t}finally{this.abortControllers.delete(e)}}isDecomposableStep(e){return["coder-a","coder-b","data-engineer","data-scientist"].includes(e.agentRole||"")}async executeStep(e,t,n){if(await delay(800+Math.random()*1500),n.aborted)return;const a=t.agentRole||"coder-a",o=this.generateStepOutput(t,a,e.id);t.output=o.output,o.filePath&&o.fileContent&&(vfs.writeFile(o.filePath,o.fileContent),this.addLog(e.id,{type:"tool",message:`创建文件: ${o.filePath}`,toolName:"aci_create"})),e.iterationCount++}async executeSwarmStep(e,t,n){const a=Math.min(3+Math.floor(Math.random()*3),this.options.maxSwarmAgents||MAX_SWARM_AGENTS);this.addLog(e.id,{type:"thinking",message:`启动 Agent 集群模式，拆分 ${a} 个子任务并行执行`});const o=[];for(let l=0;l<a;l++)o.push({id:generateId(),title:`子任务 ${l+1}: ${this.getSubtaskTitle(t,l)}`,description:`并行执行的子任务 ${l+1}`,status:"pending",agentRole:t.agentRole});t.subtasks=o,this.notifyProgress(e);const i=this.options.maxSwarmAgents||MAX_SWARM_AGENTS;for(let l=0;l<o.length&&!n.aborted;l+=i){const p=o.slice(l,l+i);p.forEach(m=>{m.status="running",m.startedAt=new Date().toISOString()}),this.notifyProgress(e),await Promise.all(p.map(async m=>{if(await delay(600+Math.random()*1200),n.aborted)return;const d=this.generateStepOutput(m,m.agentRole||"coder-a",e.id);m.output=d.output,m.status="completed",m.completedAt=new Date().toISOString(),d.filePath&&d.fileContent&&vfs.writeFile(d.filePath,d.fileContent)})),this.notifyProgress(e)}const c=o.filter(l=>l.status==="completed").length;t.output=`集群执行完成：${c}/${o.length} 个子任务成功

合并结果：
`+o.map((l,p)=>{var m;return`[子任务${p+1}] ${l.title}
${((m=l.output)==null?void 0:m.slice(0,200))||""}...`}).join(`

`)}getSubtaskTitle(e,t){const n=["数据结构定义","核心逻辑实现","工具函数封装","错误处理完善","测试用例编写","代码优化重构","文档注释补充"];return n[t%n.length]}generateStepOutput(e,t,n){const a={analyst:[`## 需求分析报告

### 核心需求
- 功能完整性：支持主要业务场景
- 用户体验：简洁直观的交互设计
- 技术可行性：基于现有技术栈可实现

### 技术方案
- 前端：React + TypeScript + TailwindCSS
- 状态管理：Zustand
- 构建工具：Vite

### 风险评估
- 低风险：UI 组件开发
- 中风险：复杂交互逻辑
- 建议：分阶段迭代交付`],pm:[`## 产品设计方案

### 目标用户
- 主要用户群体：开发者和产品经理
- 使用场景：快速原型开发

### 核心功能
1. 任务管理
2. 实时协作
3. 数据可视化

### 用户流程
输入需求 → 自动规划 → 执行生成 → 预览调整 → 导出交付`],designer:[`## UI设计方案

### 设计风格
- 暗色主题，科技感
- 渐变色彩，层次分明
- 圆角卡片，柔和阴影

### 配色方案
- 主色：蓝紫渐变
- 辅助色：青色、粉色
- 中性色：深灰到浅灰

### 布局结构
- 左侧导航 + 右侧内容区
- 卡片式信息展示
- 流式响应式布局`],"coder-a":[`## 核心架构代码

项目结构已搭建完成，包含：
- 组件目录结构
- 状态管理配置
- 路由配置
- 工具函数封装

核心模块：
1. 布局组件（Sidebar、Header、Main）
2. 业务组件（Card、Button、Modal）
3. 数据层（API封装、类型定义）

代码采用 TypeScript 严格模式，确保类型安全。`],"coder-b":[`## 功能实现代码

已实现功能：
- 完整的增删改查逻辑
- 表单验证与错误提示
- 加载状态与空状态处理
- 响应式布局适配

交互细节：
- 悬停效果与点击反馈
- 过渡动画与缓动曲线
- 键盘快捷键支持
- 无障碍访问优化`],qa:[`## 质量检测报告

### 代码质量
- 代码规范：✓ 通过
- 类型安全：✓ 完整覆盖
- 错误处理：✓ 完善
- 性能优化：✓ 良好

### 功能测试
- 主流程：✓ 通过
- 边界情况：✓ 覆盖
- 异常处理：✓ 正常

### 优化建议
- 可进一步优化首屏加载速度
- 建议添加更多单元测试`],devops:[`## 交付部署方案

### 构建配置
- 构建工具：Vite
- 产物优化：代码分割、压缩
- 资源优化：图片压缩、懒加载

### 部署方式
- 静态托管：GitHub Pages / Vercel
- CI/CD：GitHub Actions 自动部署
- 域名配置：支持自定义域名

### 监控运维
- 错误监控：Sentry
- 性能监控：Web Vitals
- 用户行为：埋点分析`],"data-engineer":[`## 数据处理方案

数据源已接入，完成以下处理：
- 数据清洗：去重、补全、格式统一
- 数据转换：类型转换、单位统一
- 数据聚合：按维度分组统计
- 数据质量：完整性、一致性校验

处理后数据质量：✓ 良好，可用于分析`],"data-scientist":[`## 数据分析报告

### 核心发现
1. 整体趋势：持续增长态势
2. 关键指标：主要指标均达标
3. 异常点：已识别并标注

### 可视化图表
- 趋势折线图
- 占比饼图
- 对比柱状图
- 分布直方图

### 建议
- 重点关注增长较快的领域
- 优化瓶颈环节提升效率`],"technical-writer":[`## 技术文档

### 项目简介
这是一个完整的全栈项目，包含前端界面和后端服务...

### 快速开始
1. 安装依赖：npm install
2. 启动开发：npm run dev
3. 构建生产：npm run build

### API 文档
详细描述了每个接口的参数和返回值...

### 常见问题
收集了开发过程中常见的问题和解决方案...`]},o=a[t]||a["coder-a"],i=o[Math.floor(Math.random()*o.length)];let c,l;if(t==="coder-a"||t==="coder-b"){const p=e.title.includes("架构")?"src/App.tsx":e.title.includes("功能")?"src/components/Main.tsx":`src/components/${generateId()}.tsx`;c=`/${n}/${p}`,l=this.generateSampleCode(e.title)}return t==="technical-writer"&&(c=`/${n}/README.md`,l=i),{output:i,filePath:c,fileContent:l}}generateSampleCode(e){return`import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Component: React.FC<Props> = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800"
    >
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
      <button
        onClick={() => setIsActive(!isActive)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isActive ? '已激活' : '点击激活'}
      </button>
    </motion.div>
  );
};

export default Component;
`}async generateDeliverables(e){const t=vfs.listFiles(`/${e.id}`);t.length>0&&e.deliverables.push({id:generateId(),name:`${e.title}-源码文件`,type:"archive",path:`/${e.id}`,size:t.reduce((o,i)=>o+i.size,0),createdAt:new Date().toISOString(),description:`包含 ${t.length} 个文件的完整源码`});const n=`/${e.id}/任务报告.md`,a=this.generateTaskReport(e);vfs.writeFile(n,a),e.deliverables.push({id:generateId(),name:"任务执行报告",type:"report",path:n,size:a.length,createdAt:new Date().toISOString(),description:"完整的任务执行过程和结果报告"})}generateTaskReport(e){const t=e.steps.filter(a=>a.status==="completed").length,n=e.startedAt&&e.completedAt?((new Date(e.completedAt).getTime()-new Date(e.startedAt).getTime())/1e3).toFixed(1):"未知";return`# ${e.title} 执行报告

## 任务信息
- **任务描述**: ${e.description}
- **创建时间**: ${new Date(e.createdAt).toLocaleString()}
- **完成时间**: ${e.completedAt?new Date(e.completedAt).toLocaleString():"未完成"}
- **耗时**: ${n} 秒
- **状态**: ${e.status==="completed"?"✓ 成功完成":e.status}

## 执行步骤
${e.steps.map((a,o)=>{const i=a.status==="completed"?"✓":a.status==="failed"?"✗":a.status==="running"?"▶":"○";return`
### ${o+1}. ${i} ${a.title}
- 负责人: ${a.agentRole||"未指定"}
- 状态: ${a.status}`}).join("")}

## 交付物
${e.deliverables.length>0?e.deliverables.map(a=>`- [${a.type}] ${a.name} (${a.size?(a.size/1024).toFixed(1)+" KB":"未知大小"})`).join(`
`):"无"}

## 统计
- 总步骤数: ${e.steps.length}
- 完成步骤: ${t}
- 迭代次数: ${e.iterationCount}
- 交付物数量: ${e.deliverables.length}

---
*由 HopeAgent Pro 多 Agent 协作系统生成*
`}cancelTask(e){const t=this.abortControllers.get(e);return t?(t.abort(),!0):!1}getTask(e){return this.tasks.get(e)}getAllTasks(){return Array.from(this.tasks.values()).sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime())}addLog(e,t){var o,i;const n=this.tasks.get(e);if(!n)return;const a={...t,timestamp:new Date().toISOString()};n.logs.push(a),(i=(o=this.options).onLog)==null||i.call(o,a)}notifyProgress(e){var t,n;(n=(t=this.options).onProgress)==null||n.call(t,e)}downloadDeliverable(e,t){const n=this.tasks.get(e);if(!n)return;const a=n.deliverables.find(o=>o.id===t);if(!(!a||!a.path))if(a.type==="archive")this.downloadFolder(a.path,a.name);else{const o=vfs.readFile(a.path);o&&this.downloadFile(a.name,o)}}downloadFolder(e,t){const n=[];this.collectFiles(e,n);const a=n.map(i=>`${i.path} (${i.content.length} bytes)`).join(`
`),o=`# ${t}

文件列表:
${a}

---

`+n.map(i=>`
===== ${i.path} =====
${i.content}`).join(`
`);this.downloadFile(`${t}.md`,o)}collectFiles(e,t){vfs.listFiles(e).forEach(a=>{const o=e==="/"?`/${a.name}`:`${e}/${a.name}`;if(a.type==="file"){const i=vfs.readFile(o);i&&t.push({path:o,content:i})}else this.collectFiles(o,t)})}downloadFile(e,t){if(typeof window>"u")return;const n=new Blob([t],{type:"text/plain;charset=utf-8"}),a=URL.createObjectURL(n),o=document.createElement("a");o.href=a,o.download=e,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(a)}}const taskEngine=new TaskEngine;function AgentConsoleView(){const[s,e]=reactExports.useState(()=>taskEngine.getAllTasks()),[t,n]=reactExports.useState(null),[a,o]=reactExports.useState(""),[i,c]=reactExports.useState(!1),l=reactExports.useRef(null),[p,m]=reactExports.useState(!1),d=t?s.find(y=>y.id===t):null;reactExports.useEffect(()=>{const y=setInterval(()=>{e(taskEngine.getAllTasks())},500);return()=>clearInterval(y)},[]),reactExports.useEffect(()=>{var y;(y=l.current)==null||y.scrollIntoView({behavior:"smooth"})},[d==null?void 0:d.logs.length]);const x=async()=>{if(!a.trim()||p)return;const y=a.trim().slice(0,50),g=a.trim();o(""),m(!0),taskEngine.setOptions({useSwarm:i});const b=taskEngine.createTask(y,g);n(b.id),e(taskEngine.getAllTasks()),taskEngine.executeTask(b.id).finally(()=>{m(!1),e(taskEngine.getAllTasks())})},h=y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),x())},F=()=>{t&&taskEngine.cancelTask(t)},u=(d==null?void 0:d.steps.filter(y=>y.status==="completed").length)||0,f=(d==null?void 0:d.steps.length)||0,k=f>0?u/f*100:0;return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"65","trae-inspector-start-column":"4","trae-inspector-end-line":"286","trae-inspector-end-column":"10","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"67","trae-inspector-start-column":"6","trae-inspector-end-line":"91","trae-inspector-end-column":"12","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between px-4 py-3 border-b border-gray-800/50",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"68","trae-inspector-start-column":"8","trae-inspector-end-line":"76","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"69","trae-inspector-start-column":"10","trae-inspector-end-line":"71","trae-inspector-end-column":"16","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center",children:jsxRuntimeExports.jsx(Sparkles,{className:"w-4 h-4 text-white"})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"72","trae-inspector-start-column":"10","trae-inspector-end-line":"75","trae-inspector-end-column":"16","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("h2",{"trae-inspector-start-line":"73","trae-inspector-start-column":"12","trae-inspector-end-line":"73","trae-inspector-end-column":"71","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22Agent%20%E6%8E%A7%E5%88%B6%E5%8F%B0%22%2C%22textStartLine%22%3A%2273%22%2C%22textStartColumn%22%3A%2257%22%2C%22textEndLine%22%3A%2273%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-bold text-white",children:"Agent 控制台"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"74","trae-inspector-start-column":"12","trae-inspector-end-line":"74","trae-inspector-end-column":"80","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%87%AA%E4%B8%BB%E8%A7%84%E5%88%92%20%C2%B7%20%E5%A4%9AAgent%E5%8D%8F%E4%BD%9C%20%C2%B7%20%E7%AB%AF%E5%88%B0%E7%AB%AF%E4%BA%A4%E4%BB%98%22%2C%22textStartLine%22%3A%2274%22%2C%22textStartColumn%22%3A%2253%22%2C%22textEndLine%22%3A%2274%22%2C%22textEndColumn%22%3A%2276%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500",children:"自主规划 · 多Agent协作 · 端到端交付"})]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"77","trae-inspector-start-column":"8","trae-inspector-end-line":"90","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"78","trae-inspector-start-column":"10","trae-inspector-end-line":"89","trae-inspector-end-column":"19","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>c(!i),className:cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono border transition-all",i?"bg-purple-900/30 text-purple-400 border-purple-700/40":"bg-gray-900/50 text-gray-400 border-gray-700/40 hover:bg-gray-800/50"),children:[jsxRuntimeExports.jsx(Cpu,{className:"w-3 h-3"}),"集群模式"]})})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"93","trae-inspector-start-column":"6","trae-inspector-end-line":"285","trae-inspector-end-column":"12","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 flex overflow-hidden",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"95","trae-inspector-start-column":"8","trae-inspector-end-line":"128","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-56 border-r border-gray-800/50 overflow-y-auto",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"96","trae-inspector-start-column":"10","trae-inspector-end-line":"127","trae-inspector-end-column":"16","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"97","trae-inspector-start-column":"12","trae-inspector-end-line":"97","trae-inspector-end-column":"80","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BB%BB%E5%8A%A1%E5%8E%86%E5%8F%B2%22%2C%22textStartLine%22%3A%2297%22%2C%22textStartColumn%22%3A%2270%22%2C%22textEndLine%22%3A%2297%22%2C%22textEndColumn%22%3A%2274%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"任务历史"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"98","trae-inspector-start-column":"12","trae-inspector-end-line":"126","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-1.5",children:[s.length===0&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"100","trae-inspector-start-column":"16","trae-inspector-end-line":"102","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9A%82%E6%97%A0%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22100%22%2C%22textStartColumn%22%3A%2276%22%2C%22textEndLine%22%3A%22102%22%2C%22textEndColumn%22%3A%2216%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-600 text-center py-6",children:"暂无任务"}),s.map(y=>jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"105","trae-inspector-start-column":"16","trae-inspector-end-line":"124","trae-inspector-end-column":"25","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>n(y.id),className:cn("w-full text-left p-2.5 rounded-lg border transition-all",t===y.id?"bg-gray-800/50 border-gray-700/60":"bg-gray-900/30 border-gray-800/40 hover:bg-gray-800/30"),children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"115","trae-inspector-start-column":"18","trae-inspector-end-line":"117","trae-inspector-end-column":"24","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-white font-medium truncate",children:y.title}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"118","trae-inspector-start-column":"18","trae-inspector-end-line":"123","trae-inspector-end-column":"24","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1.5 mt-1",children:[jsxRuntimeExports.jsx(StatusBadge,{status:y.status}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"120","trae-inspector-start-column":"20","trae-inspector-end-line":"122","trae-inspector-end-column":"27","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-600",children:formatTime(y.createdAt)})]})]},y.id))]})]})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"131","trae-inspector-start-column":"8","trae-inspector-end-line":"284","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 flex flex-col overflow-hidden",children:[d?jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"135","trae-inspector-start-column":"14","trae-inspector-end-line":"162","trae-inspector-end-column":"20","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-4 py-3 border-b border-gray-800/50",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"136","trae-inspector-start-column":"16","trae-inspector-end-line":"150","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"137","trae-inspector-start-column":"18","trae-inspector-end-line":"140","trae-inspector-end-column":"24","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("h3",{"trae-inspector-start-line":"138","trae-inspector-start-column":"20","trae-inspector-end-line":"138","trae-inspector-end-column":"88","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-bold text-white",children:d.title}),jsxRuntimeExports.jsx(StatusBadge,{status:d.status})]}),d.status==="running"&&jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"142","trae-inspector-start-column":"20","trae-inspector-end-line":"148","trae-inspector-end-column":"29","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:F,className:"flex items-center gap-1 px-2 py-1 text-[10px] text-red-400 border border-red-800/40 rounded-lg hover:bg-red-900/20 transition-all",children:[jsxRuntimeExports.jsx(Square,{className:"w-3 h-3"}),"停止"]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"151","trae-inspector-start-column":"16","trae-inspector-end-line":"161","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-3",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"152","trae-inspector-start-column":"18","trae-inspector-end-line":"157","trae-inspector-end-column":"24","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"153","trae-inspector-start-column":"20","trae-inspector-end-line":"156","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-500",style:{width:`${k}%`}})}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"158","trae-inspector-start-column":"18","trae-inspector-end-line":"160","trae-inspector-end-column":"25","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500 font-mono",children:[u,"/",f," 步"]})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"164","trae-inspector-start-column":"14","trae-inspector-end-line":"216","trae-inspector-end-column":"20","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 flex overflow-hidden",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"166","trae-inspector-start-column":"16","trae-inspector-end-line":"205","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-64 border-r border-gray-800/50 overflow-y-auto p-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"167","trae-inspector-start-column":"18","trae-inspector-end-line":"170","trae-inspector-end-column":"24","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2 flex items-center gap-1.5",children:[jsxRuntimeExports.jsx(ListChecks,{className:"w-3 h-3"}),"任务步骤"]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"171","trae-inspector-start-column":"18","trae-inspector-end-line":"175","trae-inspector-end-column":"24","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-1",children:d.steps.map((y,g)=>jsxRuntimeExports.jsx(StepItem,{step:y,index:g+1},y.id))}),d.deliverables.length>0&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"178","trae-inspector-start-column":"20","trae-inspector-end-line":"203","trae-inspector-end-column":"26","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-4 pt-3 border-t border-gray-800/50",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"179","trae-inspector-start-column":"22","trae-inspector-end-line":"182","trae-inspector-end-column":"28","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2 flex items-center gap-1.5",children:[jsxRuntimeExports.jsx(Package,{className:"w-3 h-3"}),"交付物"]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"183","trae-inspector-start-column":"22","trae-inspector-end-line":"202","trae-inspector-end-column":"28","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-1",children:d.deliverables.map(y=>jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"185","trae-inspector-start-column":"26","trae-inspector-end-line":"200","trae-inspector-end-column":"35","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>taskEngine.downloadDeliverable(d.id,y.id),className:"w-full flex items-center gap-2 p-2 rounded-lg bg-gray-900/50 border border-gray-800/50 hover:bg-gray-800/50 transition-all text-left",children:[y.type==="file"?jsxRuntimeExports.jsx(FileText,{className:"w-3.5 h-3.5 text-cyan-400"}):y.type==="archive"?jsxRuntimeExports.jsx(Folder,{className:"w-3.5 h-3.5 text-purple-400"}):jsxRuntimeExports.jsx(FileText,{className:"w-3.5 h-3.5 text-green-400"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"193","trae-inspector-start-column":"28","trae-inspector-end-line":"198","trae-inspector-end-column":"34","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 min-w-0",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"194","trae-inspector-start-column":"30","trae-inspector-end-line":"194","trae-inspector-end-column":"93","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-white truncate",children:y.name}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"195","trae-inspector-start-column":"30","trae-inspector-end-line":"197","trae-inspector-end-column":"36","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-500",children:y.size?(y.size/1024).toFixed(1)+" KB":"-"})]}),jsxRuntimeExports.jsx(Download,{className:"w-3 h-3 text-gray-500"})]},y.id))})]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"208","trae-inspector-start-column":"16","trae-inspector-end-line":"215","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto bg-black/30",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"209","trae-inspector-start-column":"18","trae-inspector-end-line":"214","trae-inspector-end-column":"24","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 space-y-2",children:[d.logs.map((y,g)=>jsxRuntimeExports.jsx(LogItem,{log:y},g)),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"213","trae-inspector-start-column":"20","trae-inspector-end-line":"213","trae-inspector-end-column":"44","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",ref:l})]})})]})]}):jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"219","trae-inspector-start-column":"12","trae-inspector-end-line":"244","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 flex flex-col items-center justify-center p-8",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"220","trae-inspector-start-column":"14","trae-inspector-end-line":"222","trae-inspector-end-column":"20","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center mb-4",children:jsxRuntimeExports.jsx(Bot,{className:"w-8 h-8 text-cyan-400"})}),jsxRuntimeExports.jsx("h3",{"trae-inspector-start-line":"223","trae-inspector-start-column":"14","trae-inspector-end-line":"223","trae-inspector-end-column":"78","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22Agent%20%E6%8E%A7%E5%88%B6%E5%8F%B0%22%2C%22textStartLine%22%3A%22223%22%2C%22textStartColumn%22%3A%2264%22%2C%22textEndLine%22%3A%22223%22%2C%22textEndColumn%22%3A%2273%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-lg font-bold text-white mb-2",children:"Agent 控制台"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"224","trae-inspector-start-column":"14","trae-inspector-end-line":"226","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%8F%8F%E8%BF%B0%E4%BD%A0%E7%9A%84%E9%9C%80%E6%B1%82%EF%BC%8CAI%20%E5%B0%86%E8%87%AA%E5%8A%A8%E8%A7%84%E5%88%92%E4%BB%BB%E5%8A%A1%E3%80%81%E8%B0%83%E7%94%A8%E5%B7%A5%E5%85%B7%E3%80%81%E5%A4%9A%20Agent%20%E5%8D%8F%E4%BD%9C%E5%AE%8C%E6%88%90%22%2C%22textStartLine%22%3A%22224%22%2C%22textStartColumn%22%3A%2281%22%2C%22textEndLine%22%3A%22226%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[12px] text-gray-500 text-center max-w-xs mb-6",children:"描述你的需求，AI 将自动规划任务、调用工具、多 Agent 协作完成"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"227","trae-inspector-start-column":"14","trae-inspector-end-line":"243","trae-inspector-end-column":"20","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-3 gap-3 text-center",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"228","trae-inspector-start-column":"16","trae-inspector-end-line":"232","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/50 border border-gray-800/50",children:[jsxRuntimeExports.jsx(Zap,{className:"w-5 h-5 text-yellow-400 mx-auto mb-1.5"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"230","trae-inspector-start-column":"18","trae-inspector-end-line":"230","trae-inspector-end-column":"68","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%87%AA%E4%B8%BB%E8%A7%84%E5%88%92%22%2C%22textStartLine%22%3A%22230%22%2C%22textStartColumn%22%3A%2258%22%2C%22textEndLine%22%3A%22230%22%2C%22textEndColumn%22%3A%2262%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-white",children:"自主规划"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"231","trae-inspector-start-column":"18","trae-inspector-end-line":"231","trae-inspector-end-column":"72","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%87%AA%E5%8A%A8%E6%8B%86%E8%A7%A3%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22231%22%2C%22textStartColumn%22%3A%2260%22%2C%22textEndLine%22%3A%22231%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-500",children:"自动拆解任务"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"233","trae-inspector-start-column":"16","trae-inspector-end-line":"237","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/50 border border-gray-800/50",children:[jsxRuntimeExports.jsx(Cpu,{className:"w-5 h-5 text-purple-400 mx-auto mb-1.5"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"235","trae-inspector-start-column":"18","trae-inspector-end-line":"235","trae-inspector-end-column":"72","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%A4%9AAgent%E5%8D%8F%E4%BD%9C%22%2C%22textStartLine%22%3A%22235%22%2C%22textStartColumn%22%3A%2258%22%2C%22textEndLine%22%3A%22235%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-white",children:"多Agent协作"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"236","trae-inspector-start-column":"18","trae-inspector-end-line":"236","trae-inspector-end-column":"72","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%B8%93%E4%B8%9A%E5%88%86%E5%B7%A5%E6%89%A7%E8%A1%8C%22%2C%22textStartLine%22%3A%22236%22%2C%22textStartColumn%22%3A%2260%22%2C%22textEndLine%22%3A%22236%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-500",children:"专业分工执行"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"238","trae-inspector-start-column":"16","trae-inspector-end-line":"242","trae-inspector-end-column":"22","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/50 border border-gray-800/50",children:[jsxRuntimeExports.jsx(Package,{className:"w-5 h-5 text-cyan-400 mx-auto mb-1.5"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"240","trae-inspector-start-column":"18","trae-inspector-end-line":"240","trae-inspector-end-column":"69","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%AB%AF%E5%88%B0%E7%AB%AF%E4%BA%A4%E4%BB%98%22%2C%22textStartLine%22%3A%22240%22%2C%22textStartColumn%22%3A%2258%22%2C%22textEndLine%22%3A%22240%22%2C%22textEndColumn%22%3A%2263%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-white",children:"端到端交付"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"241","trae-inspector-start-column":"18","trae-inspector-end-line":"241","trae-inspector-end-column":"72","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%9B%B4%E6%8E%A5%E4%BA%A7%E5%87%BA%E6%96%87%E4%BB%B6%22%2C%22textStartLine%22%3A%22241%22%2C%22textStartColumn%22%3A%2260%22%2C%22textEndLine%22%3A%22241%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-500",children:"直接产出文件"})]})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"248","trae-inspector-start-column":"10","trae-inspector-end-line":"283","trae-inspector-end-column":"16","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"border-t border-gray-800/50 p-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"249","trae-inspector-start-column":"12","trae-inspector-end-line":"277","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-end gap-2",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"250","trae-inspector-start-column":"14","trae-inspector-end-line":"259","trae-inspector-end-column":"20","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 relative",children:jsxRuntimeExports.jsx("textarea",{"trae-inspector-start-line":"251","trae-inspector-start-column":"16","trae-inspector-end-line":"258","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:a,onChange:y=>o(y.target.value),onKeyDown:h,placeholder:"描述你要完成的任务...",rows:2,className:"w-full px-3 py-2.5 text-[12px] bg-gray-900/80 border border-gray-700/50 rounded-xl text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-cyan-600/50 focus:ring-1 focus:ring-cyan-600/30 resize-none"})}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"260","trae-inspector-start-column":"14","trae-inspector-end-line":"276","trae-inspector-end-column":"23","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:x,disabled:!a.trim()||p,className:cn("h-full px-4 py-2.5 rounded-xl font-mono text-[11px] flex items-center gap-1.5 transition-all",a.trim()&&!p?"bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 active:scale-95":"bg-gray-800 text-gray-600 cursor-not-allowed"),children:[p?jsxRuntimeExports.jsx(LoaderCircle,{className:"w-4 h-4 animate-spin"}):jsxRuntimeExports.jsx(Play,{className:"w-4 h-4"}),p?"执行中":"开始"]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"278","trae-inspector-start-column":"12","trae-inspector-end-line":"282","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-3 mt-2",children:jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"279","trae-inspector-start-column":"14","trae-inspector-end-line":"281","trae-inspector-end-column":"21","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%A4%BA%E4%BE%8B%EF%BC%9A%E5%81%9A%E4%B8%80%E4%B8%AA%E4%B8%AA%E4%BA%BA%E4%BD%9C%E5%93%81%E9%9B%86%E7%BD%91%E7%AB%99%20%2F%20%E5%88%86%E6%9E%90%E9%94%80%E5%94%AE%E6%95%B0%E6%8D%AE%20%2F%20%E5%86%99%E4%B8%80%E4%BB%BD%E4%BA%A7%E5%93%81%E9%9C%80%E6%B1%82%E6%96%87%E6%A1%A3%22%2C%22textStartLine%22%3A%22279%22%2C%22textStartColumn%22%3A%2257%22%2C%22textEndLine%22%3A%22281%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-600",children:"示例：做一个个人作品集网站 / 分析销售数据 / 写一份产品需求文档"})})]})]})]})]})}function StepItem({step:s,index:e}){const[t,n]=reactExports.useState(!1),a=s.subtasks&&s.subtasks.length>0;return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"295","trae-inspector-start-column":"4","trae-inspector-end-line":"340","trae-inspector-end-column":"10","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"rounded-lg border border-gray-800/40 overflow-hidden",children:[jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"296","trae-inspector-start-column":"6","trae-inspector-end-line":"323","trae-inspector-end-column":"15","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>a&&n(!t),className:cn("w-full flex items-center gap-2 p-2 text-left transition-all",s.status==="running"?"bg-gray-800/40":"hover:bg-gray-800/20"),children:[jsxRuntimeExports.jsx(StepStatusIcon,{status:s.status}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"304","trae-inspector-start-column":"8","trae-inspector-end-line":"318","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 min-w-0",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"305","trae-inspector-start-column":"10","trae-inspector-end-line":"312","trae-inspector-end-column":"16","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[11px] truncate",s.status==="completed"?"text-gray-400 line-through":s.status==="failed"?"text-red-400":s.status==="running"?"text-white":"text-gray-500"),children:[e,". ",s.title]}),s.agentRole&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"314","trae-inspector-start-column":"12","trae-inspector-end-line":"316","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-600 font-mono",children:s.agentRole})]}),a&&(t?jsxRuntimeExports.jsx(ChevronDown,{className:"w-3 h-3 text-gray-600 flex-shrink-0"}):jsxRuntimeExports.jsx(ChevronRight,{className:"w-3 h-3 text-gray-600 flex-shrink-0"}))]}),a&&t&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"325","trae-inspector-start-column":"8","trae-inspector-end-line":"338","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-2 pb-2 space-y-1",children:s.subtasks.map((o,i)=>jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"327","trae-inspector-start-column":"12","trae-inspector-end-line":"336","trae-inspector-end-column":"18","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1.5 pl-4",children:[jsxRuntimeExports.jsx(StepStatusIcon,{status:o.status,size:"sm"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"329","trae-inspector-start-column":"14","trae-inspector-end-line":"335","trae-inspector-end-column":"21","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[10px] truncate",o.status==="completed"?"text-gray-500 line-through":o.status==="running"?"text-gray-300":"text-gray-600"),children:o.title})]},o.id))})]})}function StepStatusIcon({status:s,size:e="md"}){const t=e==="sm"?"w-3 h-3":"w-3.5 h-3.5";switch(s){case"completed":return jsxRuntimeExports.jsx(CircleCheckBig,{className:`${t} text-green-500 flex-shrink-0`});case"running":return jsxRuntimeExports.jsx(LoaderCircle,{className:`${t} text-cyan-400 animate-spin flex-shrink-0`});case"failed":return jsxRuntimeExports.jsx(X,{className:`${t} text-red-500 flex-shrink-0`});case"skipped":return jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"355","trae-inspector-start-column":"13","trae-inspector-end-line":"355","trae-inspector-end-column":"97","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:`${t} rounded-full border border-gray-600 flex-shrink-0`});default:return jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"357","trae-inspector-start-column":"13","trae-inspector-end-line":"357","trae-inspector-end-column":"99","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:`${t} rounded-full border-2 border-gray-700 flex-shrink-0`})}}function StatusBadge({status:s}){const e={pending:{label:"等待中",className:"bg-gray-800 text-gray-500 border-gray-700"},planning:{label:"规划中",className:"bg-yellow-900/30 text-yellow-400 border-yellow-800/40"},running:{label:"执行中",className:"bg-cyan-900/30 text-cyan-400 border-cyan-800/40"},completed:{label:"已完成",className:"bg-green-900/30 text-green-400 border-green-800/40"},failed:{label:"失败",className:"bg-red-900/30 text-red-400 border-red-800/40"},cancelled:{label:"已取消",className:"bg-gray-800 text-gray-500 border-gray-700"}},{label:t,className:n}=e[s]||e.pending;return jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"374","trae-inspector-start-column":"4","trae-inspector-end-line":"379","trae-inspector-end-column":"11","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[9px] px-1.5 py-0.5 rounded border font-mono",n),children:t})}function LogItem({log:s}){const e={info:jsxRuntimeExports.jsx(Clock,{className:"w-3 h-3 text-gray-500"}),thinking:jsxRuntimeExports.jsx(Sparkles,{className:"w-3 h-3 text-purple-400"}),tool:jsxRuntimeExports.jsx(Wrench,{className:"w-3 h-3 text-cyan-400"}),agent:jsxRuntimeExports.jsx(Bot,{className:"w-3 h-3 text-yellow-400"}),error:jsxRuntimeExports.jsx(CircleAlert,{className:"w-3 h-3 text-red-400"}),success:jsxRuntimeExports.jsx(Check,{className:"w-3 h-3 text-green-400"})},t={info:"text-gray-400",thinking:"text-purple-300",tool:"text-cyan-300",agent:"text-yellow-300",error:"text-red-300",success:"text-green-300"};return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"403","trae-inspector-start-column":"4","trae-inspector-end-line":"418","trae-inspector-end-column":"10","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"404","trae-inspector-start-column":"6","trae-inspector-end-line":"404","trae-inspector-end-column":"67","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-0.5",children:e[s.type]||e.info}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"405","trae-inspector-start-column":"6","trae-inspector-end-line":"417","trae-inspector-end-column":"12","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 min-w-0",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"406","trae-inspector-start-column":"8","trae-inspector-end-line":"408","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[11px]",t[s.type]||t.info),children:s.message}),s.detail&&jsxRuntimeExports.jsx("pre",{"trae-inspector-start-line":"410","trae-inspector-start-column":"10","trae-inspector-end-line":"412","trae-inspector-end-column":"16","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-1 p-2 text-[10px] text-gray-500 bg-gray-900/50 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap",children:s.detail.slice(0,500)}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"414","trae-inspector-start-column":"8","trae-inspector-end-line":"416","trae-inspector-end-column":"14","trae-inspector-file-path":"src/components/AgentConsole.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-700 mt-0.5 font-mono",children:formatTime(s.timestamp)})]})]})}function formatTime(s){const e=new Date(s),n=new Date().getTime()-e.getTime();return n<6e4?"刚刚":n<36e5?`${Math.floor(n/6e4)} 分钟前`:n<864e5?`${Math.floor(n/36e5)} 小时前`:e.toLocaleDateString()}const roleConfig={user:{name:"董事长",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:Crown},chairman:{name:"董事长",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:Crown},system:{name:"系统",color:"text-gray-400",bg:"bg-gray-900/60",border:"border-gray-700/50",icon:Zap},cto:{name:"技术总监",color:"text-amber-400",bg:"bg-amber-900/30",border:"border-amber-700/50",icon:Cpu},pm:{name:"产品经理",color:"text-sky-400",bg:"bg-sky-900/30",border:"border-sky-700/50",icon:ClipboardList},analyst:{name:"分析员",color:"text-blue-400",bg:"bg-blue-900/30",border:"border-blue-700/50",icon:Search},"ux-designer":{name:"UX设计师",color:"text-pink-400",bg:"bg-pink-900/30",border:"border-pink-700/50",icon:Palette},"ui-designer":{name:"UI设计师",color:"text-rose-400",bg:"bg-rose-900/30",border:"border-rose-700/50",icon:Palette},arch:{name:"架构师",color:"text-violet-400",bg:"bg-violet-900/30",border:"border-violet-700/50",icon:Lightbulb},"tech-lead":{name:"技术主管",color:"text-indigo-400",bg:"bg-indigo-900/30",border:"border-indigo-700/50",icon:CodeXml},"coder-1":{name:"代码员小绿",color:"text-green-400",bg:"bg-green-900/30",border:"border-green-700/50",icon:CodeXml},"coder-2":{name:"代码员小蓝",color:"text-cyan-400",bg:"bg-cyan-900/30",border:"border-cyan-700/50",icon:CodeXml},"coder-3":{name:"代码员小紫",color:"text-purple-400",bg:"bg-purple-900/30",border:"border-purple-700/50",icon:CodeXml},"coder-4":{name:"代码员小青",color:"text-teal-400",bg:"bg-teal-900/30",border:"border-teal-700/50",icon:CodeXml},"coder-5":{name:"代码员小橙",color:"text-orange-400",bg:"bg-orange-900/30",border:"border-orange-700/50",icon:CodeXml},devops:{name:"运维工程师",color:"text-lime-400",bg:"bg-lime-900/30",border:"border-lime-700/50",icon:Settings2},"inspector-1":{name:"检查员甲",color:"text-pink-400",bg:"bg-pink-900/30",border:"border-pink-700/50",icon:Shield},"inspector-2":{name:"检查员乙",color:"text-red-400",bg:"bg-red-900/30",border:"border-red-700/50",icon:Shield},"qa-lead":{name:"测试主管",color:"text-fuchsia-400",bg:"bg-fuchsia-900/30",border:"border-fuchsia-700/50",icon:FlaskConical},expander:{name:"扩展员",color:"text-indigo-400",bg:"bg-indigo-900/30",border:"border-indigo-700/50",icon:Sparkles},researcher:{name:"研究员",color:"text-purple-400",bg:"bg-purple-900/30",border:"border-purple-700/50",icon:Lightbulb},"data-scientist":{name:"数据科学家",color:"text-violet-400",bg:"bg-violet-900/30",border:"border-violet-700/50",icon:Bot},packer:{name:"打包员",color:"text-amber-400",bg:"bg-amber-900/30",border:"border-amber-700/50",icon:Package},deliverer:{name:"输送员",color:"text-emerald-400",bg:"bg-emerald-900/30",border:"border-emerald-700/50",icon:Rocket},"doc-writer":{name:"文档工程师",color:"text-slate-400",bg:"bg-slate-900/30",border:"border-slate-700/50",icon:FileText},hr:{name:"人事专员",color:"text-rose-400",bg:"bg-rose-900/30",border:"border-rose-700/50",icon:UsersRound},finance:{name:"财务专员",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:Landmark},marketing:{name:"市场专员",color:"text-orange-400",bg:"bg-orange-900/30",border:"border-orange-700/50",icon:Megaphone},"customer-service":{name:"客服专员",color:"text-sky-400",bg:"bg-sky-900/30",border:"border-sky-700/50",icon:Headphones},security:{name:"安全工程师",color:"text-red-400",bg:"bg-red-900/30",border:"border-red-700/50",icon:ShieldAlert},legal:{name:"法务顾问",color:"text-blue-400",bg:"bg-blue-900/30",border:"border-blue-700/50",icon:Scale},"sys-admin":{name:"系统管理员",color:"text-gray-400",bg:"bg-gray-900/60",border:"border-gray-700/50",icon:Settings2}},statusConfig$1={idle:{label:"空闲",color:"text-gray-500",dot:"bg-gray-600"},thinking:{label:"思考中",color:"text-yellow-400",dot:"bg-yellow-500 animate-pulse"},working:{label:"工作中",color:"text-green-400",dot:"bg-green-500 animate-pulse"},done:{label:"已完成",color:"text-blue-400",dot:"bg-blue-500"},error:{label:"错误",color:"text-red-400",dot:"bg-red-500"}};function MobileMessage({message:s}){const e=s.role||"system",t=roleConfig[e]||roleConfig.system,n=e==="user",a=t.icon;return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"67","trae-inspector-start-column":"4","trae-inspector-end-line":"93","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("flex gap-2 px-3 py-2",n&&"flex-row-reverse"),children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"69","trae-inspector-start-column":"6","trae-inspector-end-line":"74","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border",t.bg,t.border),children:jsxRuntimeExports.jsx(a,{className:cn("w-4 h-4",t.color)})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"77","trae-inspector-start-column":"6","trae-inspector-end-line":"92","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("flex-1 min-w-0 max-w-[78%]",n&&"flex flex-col items-end"),children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"78","trae-inspector-start-column":"8","trae-inspector-end-line":"83","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1.5 mb-0.5",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"79","trae-inspector-start-column":"10","trae-inspector-end-line":"79","trae-inspector-end-column":"90","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[11px] font-mono",t.color),children:t.name}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"80","trae-inspector-start-column":"10","trae-inspector-end-line":"82","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-600",children:new Date(s.timestamp).toLocaleTimeString("zh-CN",{hour12:!1})})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"84","trae-inspector-start-column":"8","trae-inspector-end-line":"91","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("rounded-xl px-3 py-2 text-[13px] leading-relaxed break-words",n?"bg-yellow-900/30 border border-yellow-700/40 text-yellow-100":cn(t.bg,t.border,"text-gray-100 border")),children:jsxRuntimeExports.jsx(MessageContent,{content:s.content})})]})]})}function CodePreviewModal({code:s,language:e,onClose:t}){const[n,a]=reactExports.useState(!1);reactExports.useEffect(()=>(a(!0),()=>a(!1)),[s]);const o=e==="html"||e==="svg",i=e==="markdown"||e==="md";return jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"109","trae-inspector-start-column":"4","trae-inspector-end-line":"153","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4",onClick:t,children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"110","trae-inspector-start-column":"6","trae-inspector-end-line":"152","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-full max-w-4xl max-h-[85vh] bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden",onClick:c=>c.stopPropagation(),children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"111","trae-inspector-start-column":"8","trae-inspector-end-line":"125","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"112","trae-inspector-start-column":"10","trae-inspector-end-line":"116","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"113","trae-inspector-start-column":"12","trae-inspector-end-line":"113","trae-inspector-end-column":"47","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%F0%9F%93%84%22%2C%22textStartLine%22%3A%22113%22%2C%22textStartColumn%22%3A%2238%22%2C%22textEndLine%22%3A%22113%22%2C%22textEndColumn%22%3A%2240%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-lg",children:"📄"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"114","trae-inspector-start-column":"12","trae-inspector-end-line":"114","trae-inspector-end-column":"73","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BB%A3%E7%A0%81%E9%A2%84%E8%A7%88%22%2C%22textStartLine%22%3A%22114%22%2C%22textStartColumn%22%3A%2262%22%2C%22textEndLine%22%3A%22114%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300",children:"代码预览"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"115","trae-inspector-start-column":"12","trae-inspector-end-line":"115","trae-inspector-end-column":"132","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 px-2 py-0.5 rounded bg-gray-800/50",children:e.toUpperCase()})]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"117","trae-inspector-start-column":"10","trae-inspector-end-line":"124","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:t,className:"p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-gray-200 transition-all",children:jsxRuntimeExports.jsx("svg",{"trae-inspector-start-line":"121","trae-inspector-start-column":"12","trae-inspector-end-line":"123","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:jsxRuntimeExports.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"127","trae-inspector-start-column":"8","trae-inspector-end-line":"151","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-auto p-4",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"128","trae-inspector-start-column":"10","trae-inspector-end-line":"150","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-2 gap-4",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"129","trae-inspector-start-column":"12","trae-inspector-end-line":"134","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"bg-gray-900/50 border border-gray-800 rounded-xl p-3",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"130","trae-inspector-start-column":"14","trae-inspector-end-line":"130","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%F0%9F%93%9D%20%E6%BA%90%E4%BB%A3%E7%A0%81%22%2C%22textStartLine%22%3A%22130%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22130%22%2C%22textEndColumn%22%3A%2278%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"📝 源代码"}),jsxRuntimeExports.jsx("pre",{"trae-inspector-start-line":"131","trae-inspector-start-column":"14","trae-inspector-end-line":"133","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-green-300 overflow-x-auto max-h-[60vh] whitespace-pre-wrap",children:s})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"136","trae-inspector-start-column":"12","trae-inspector-end-line":"149","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"bg-white/5 border border-gray-800 rounded-xl p-3",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"137","trae-inspector-start-column":"14","trae-inspector-end-line":"137","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%F0%9F%91%81%EF%B8%8F%20%E6%B8%B2%E6%9F%93%E7%BB%93%E6%9E%9C%22%2C%22textStartLine%22%3A%22137%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22137%22%2C%22textEndColumn%22%3A%2280%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"👁️ 渲染结果"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"138","trae-inspector-start-column":"14","trae-inspector-end-line":"148","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-[60vh] overflow-auto bg-white/5 rounded-lg p-2",children:o?jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"140","trae-inspector-start-column":"18","trae-inspector-end-line":"140","trae-inspector-end-column":"68","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",dangerouslySetInnerHTML:{__html:s}}):i?jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"142","trae-inspector-start-column":"18","trae-inspector-end-line":"144","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[13px] text-gray-200 whitespace-pre-wrap",children:s}):jsxRuntimeExports.jsx("pre",{"trae-inspector-start-line":"146","trae-inspector-start-column":"18","trae-inspector-end-line":"146","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-300",children:s})})]})]})})]})})}function MessageContent({content:s}){const[e,t]=reactExports.useState(null),[n,a]=reactExports.useState(null),o=s.split(/(```[\s\S]*?```)/g),i=async(p,m)=>{try{await navigator.clipboard.writeText(p),t(m),setTimeout(()=>t(null),1500)}catch{const d=document.createElement("textarea");d.value=p,document.body.appendChild(d),d.select(),document.execCommand("copy"),document.body.removeChild(d),t(m),setTimeout(()=>t(null),1500)}},c=p=>{const m=p.match(/^```(\w+)/);return m?m[1]:"text"},l=p=>["html","svg","markdown","md"].includes(p.toLowerCase());return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"189","trae-inspector-start-column":"4","trae-inspector-end-line":"245","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"whitespace-pre-wrap",children:[o.map((p,m)=>{if(p.startsWith("```")){const d=p.replace(/^```\w*\n?/,"").replace(/```$/,""),x=c(p);return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"195","trae-inspector-start-column":"12","trae-inspector-end-line":"232","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"my-1.5 relative group",children:[jsxRuntimeExports.jsx("pre",{"trae-inspector-start-line":"196","trae-inspector-start-column":"14","trae-inspector-end-line":"198","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"my-0 p-3 bg-gray-950/90 border border-gray-800 rounded-xl overflow-x-auto text-[11px] font-mono text-green-300",children:jsxRuntimeExports.jsx("code",{"trae-inspector-start-line":"197","trae-inspector-start-column":"16","trae-inspector-end-line":"197","trae-inspector-end-column":"35","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:d})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"199","trae-inspector-start-column":"14","trae-inspector-end-line":"231","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"absolute top-2 right-2 flex gap-1",children:[l(x)&&jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"201","trae-inspector-start-column":"18","trae-inspector-end-line":"210","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>a({code:d,language:x}),className:"p-1.5 rounded-lg bg-gray-800/80 hover:bg-purple-900/50 transition-all opacity-0 group-hover:opacity-100 text-gray-400 hover:text-purple-400",title:"预览",children:jsxRuntimeExports.jsxs("svg",{"trae-inspector-start-line":"206","trae-inspector-start-column":"20","trae-inspector-end-line":"209","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[jsxRuntimeExports.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),jsxRuntimeExports.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"212","trae-inspector-start-column":"16","trae-inspector-end-line":"230","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>i(d,m),className:cn("p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-all",e===m?"opacity-100 text-green-400 bg-green-900/30":"opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-400"),children:e===m?jsxRuntimeExports.jsx("svg",{"trae-inspector-start-line":"222","trae-inspector-start-column":"20","trae-inspector-end-line":"224","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:jsxRuntimeExports.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 13l4 4L19 7"})}):jsxRuntimeExports.jsx("svg",{"trae-inspector-start-line":"226","trae-inspector-start-column":"20","trae-inspector-end-line":"228","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:jsxRuntimeExports.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"})})})]})]},m)}return jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"235","trae-inspector-start-column":"15","trae-inspector-end-line":"235","trae-inspector-end-column":"42","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:p},m)}),n&&jsxRuntimeExports.jsx(CodePreviewModal,{code:n.code,language:n.language,onClose:()=>a(null)})]})}function TypingIndicator(){return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"252","trae-inspector-start-column":"4","trae-inspector-end-line":"263","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2 px-3 py-2",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"253","trae-inspector-start-column":"6","trae-inspector-end-line":"259","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/60 border border-gray-700/50 flex items-center justify-center",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"254","trae-inspector-start-column":"8","trae-inspector-end-line":"258","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-0.5",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"255","trae-inspector-start-column":"10","trae-inspector-end-line":"255","trae-inspector-end-column":"113","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-1 h-1 bg-green-400 rounded-full animate-bounce",style:{animationDelay:"0ms"}}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"256","trae-inspector-start-column":"10","trae-inspector-end-line":"256","trae-inspector-end-column":"115","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-1 h-1 bg-green-400 rounded-full animate-bounce",style:{animationDelay:"150ms"}}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"257","trae-inspector-start-column":"10","trae-inspector-end-line":"257","trae-inspector-end-column":"115","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-1 h-1 bg-green-400 rounded-full animate-bounce",style:{animationDelay:"300ms"}})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"260","trae-inspector-start-column":"6","trae-inspector-end-line":"262","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9B%A2%E9%98%9F%E6%AD%A3%E5%9C%A8%E5%8D%8F%E4%BD%9C%E5%A4%84%E7%90%86...%22%2C%22textStartLine%22%3A%22260%22%2C%22textStartColumn%22%3A%22126%22%2C%22textEndLine%22%3A%22262%22%2C%22textEndColumn%22%3A%226%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center px-3 py-2 rounded-xl bg-gray-900/60 border border-gray-800 text-[12px] text-gray-400",children:"团队正在协作处理..."})]})}function TeamMemberCard({agent:s}){const e=roleConfig[s.id]||roleConfig.system,t=statusConfig$1[s.status]||statusConfig$1.idle,n=e.icon;return jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"274","trae-inspector-start-column":"4","trae-inspector-end-line":"306","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("p-3 rounded-xl border transition-all",s.status==="idle"?"bg-gray-900/40 border-gray-800":cn(e.bg,e.border)),children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"278","trae-inspector-start-column":"6","trae-inspector-end-line":"305","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"279","trae-inspector-start-column":"8","trae-inspector-end-line":"287","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("relative w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0",e.bg,e.border),children:[jsxRuntimeExports.jsx(n,{className:cn("w-5 h-5",e.color)}),s.status!=="idle"&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"285","trae-inspector-start-column":"12","trae-inspector-end-line":"285","trae-inspector-end-column":"127","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950",t.dot)})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"288","trae-inspector-start-column":"8","trae-inspector-end-line":"304","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 min-w-0",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"289","trae-inspector-start-column":"10","trae-inspector-end-line":"292","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"290","trae-inspector-start-column":"12","trae-inspector-end-line":"290","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-sm font-mono",e.color),children:s.name}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"291","trae-inspector-start-column":"12","trae-inspector-end-line":"291","trae-inspector-end-column":"93","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[10px] font-mono",t.color),children:t.label})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"293","trae-inspector-start-column":"10","trae-inspector-end-line":"295","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-500 mt-0.5 truncate",children:s.currentTask||"待命中..."}),s.status!=="idle"&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"297","trae-inspector-start-column":"12","trae-inspector-end-line":"302","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-1.5 h-1 bg-gray-800 rounded-full overflow-hidden",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"298","trae-inspector-start-column":"14","trae-inspector-end-line":"301","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("h-full transition-all duration-500",e.color.replace("text-","bg-")),style:{width:`${s.progress}%`}})})]})]})})}function TeamView(){const{agents:s}=useAgentStore(),e=s.filter(a=>a.status==="working"||a.status==="thinking").length,t=s.filter(a=>a.status==="done").length,n=[{name:"决策层",color:"text-yellow-400"},{name:"产品部",color:"text-sky-400"},{name:"设计部",color:"text-pink-400"},{name:"技术部",color:"text-green-400"},{name:"质量部",color:"text-fuchsia-400"},{name:"研发部",color:"text-purple-400"},{name:"运维部",color:"text-lime-400"},{name:"战略部",color:"text-indigo-400"},{name:"文档部",color:"text-slate-400"},{name:"人事部",color:"text-rose-400"},{name:"财务部",color:"text-amber-400"},{name:"市场部",color:"text-orange-400"},{name:"客服部",color:"text-cyan-400"},{name:"安全部",color:"text-red-400"},{name:"法务部",color:"text-blue-400"}];return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"335","trae-inspector-start-column":"4","trae-inspector-end-line":"376","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"min-h-full flex flex-col",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"337","trae-inspector-start-column":"6","trae-inspector-end-line":"353","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"338","trae-inspector-start-column":"8","trae-inspector-end-line":"352","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"339","trae-inspector-start-column":"10","trae-inspector-end-line":"344","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx(Users,{className:"w-5 h-5 text-blue-400"}),jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"341","trae-inspector-start-column":"12","trae-inspector-end-line":"343","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9B%A2%E9%98%9F%22%2C%22textStartLine%22%3A%22341%22%2C%22textStartColumn%22%3A%22127%22%2C%22textEndLine%22%3A%22343%22%2C%22textEndColumn%22%3A%2212%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono font-bold text-blue-400",style:{textShadow:"0 0 8px rgba(59,130,246,0.5)"},children:"团队"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"345","trae-inspector-start-column":"10","trae-inspector-end-line":"351","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 text-[11px] font-mono",children:[jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"346","trae-inspector-start-column":"12","trae-inspector-end-line":"346","trae-inspector-end-column":"68","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-green-400",children:[e," 活跃"]}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"347","trae-inspector-start-column":"12","trae-inspector-end-line":"347","trae-inspector-end-column":"52","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%7C%22%2C%22textStartLine%22%3A%22347%22%2C%22textStartColumn%22%3A%2244%22%2C%22textEndLine%22%3A%22347%22%2C%22textEndColumn%22%3A%2245%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-gray-600",children:"|"}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"348","trae-inspector-start-column":"12","trae-inspector-end-line":"348","trae-inspector-end-column":"65","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-blue-400",children:[t," 完成"]}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"349","trae-inspector-start-column":"12","trae-inspector-end-line":"349","trae-inspector-end-column":"52","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%7C%22%2C%22textStartLine%22%3A%22349%22%2C%22textStartColumn%22%3A%2244%22%2C%22textEndLine%22%3A%22349%22%2C%22textEndColumn%22%3A%2245%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-gray-600",children:"|"}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"350","trae-inspector-start-column":"12","trae-inspector-end-line":"350","trae-inspector-end-column":"69","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-gray-500",children:["共 ",s.length,"人"]})]})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"356","trae-inspector-start-column":"6","trae-inspector-end-line":"375","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 p-3 space-y-4 max-w-md mx-auto w-full pb-20",children:n.map(a=>{const o=s.filter(i=>i.department===a.name);return o.length===0?null:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"361","trae-inspector-start-column":"12","trae-inspector-end-line":"372","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"362","trae-inspector-start-column":"14","trae-inspector-end-line":"366","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[11px] font-mono px-1 mb-2 tracking-wider flex items-center gap-2",a.color),children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"363","trae-inspector-start-column":"16","trae-inspector-end-line":"363","trae-inspector-end-column":"105","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-1.5 h-1.5 rounded-full",style:{backgroundColor:"currentColor"}}),a.name,jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"365","trae-inspector-start-column":"16","trae-inspector-end-line":"365","trae-inspector-end-column":"89","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-gray-600 text-[10px]",children:["(",o.length,"人)"]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"367","trae-inspector-start-column":"14","trae-inspector-end-line":"371","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-2",children:o.map(i=>jsxRuntimeExports.jsx(TeamMemberCard,{agent:i},i.id))})]},a.name)})})]})}function DashboardMiniView({onStartChat:s}){var l,p,m;const{agents:e}=useAgentStore(),{entries:t}=useKnowledgeStore(),{messages:n}=useChatStore(),a=e.length,o=e.filter(d=>d.status==="working"||d.status==="thinking").length,i=[...new Set(e.map(d=>d.department).filter(Boolean))],c=[{label:"AI角色",value:agents.length,unit:"个",color:"text-green-400",bg:"bg-green-900/20",border:"border-green-800/40"},{label:"活跃中",value:o,unit:"人",color:"text-yellow-400",bg:"bg-yellow-900/20",border:"border-yellow-800/40"},{label:"知识库",value:t.length,unit:"条",color:"text-purple-400",bg:"bg-purple-900/20",border:"border-purple-800/40"},{label:"部门数",value:i.length,unit:"个",color:"text-blue-400",bg:"bg-blue-900/20",border:"border-blue-800/40"}];return jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"649","trae-inspector-start-column":"4","trae-inspector-end-line":"728","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto py-2",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"650","trae-inspector-start-column":"6","trae-inspector-end-line":"727","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 space-y-3 max-w-md mx-auto w-full",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"652","trae-inspector-start-column":"8","trae-inspector-end-line":"666","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-4 rounded-2xl bg-gradient-to-br from-green-900/30 via-gray-900/50 to-blue-900/20 border border-green-800/40",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"653","trae-inspector-start-column":"10","trae-inspector-end-line":"653","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%91%A3%E4%BA%8B%E9%95%BF%EF%BC%8C%E6%82%A8%E5%A5%BD%22%2C%22textStartLine%22%3A%22653%22%2C%22textStartColumn%22%3A%2266%22%2C%22textEndLine%22%3A%22653%22%2C%22textEndColumn%22%3A%2272%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-400 mb-1",children:"董事长，您好"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"654","trae-inspector-start-column":"10","trae-inspector-end-line":"656","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AC%A2%E8%BF%8E%E6%9D%A5%E5%88%B0%E6%B8%85%E9%B8%A2AI%E5%85%AC%E5%8F%B8%22%2C%22textStartLine%22%3A%22654%22%2C%22textStartColumn%22%3A%22114%22%2C%22textEndLine%22%3A%22656%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono text-green-400",style:{textShadow:"0 0 8px rgba(34,197,94,0.3)"},children:"欢迎来到清鸢AI公司"}),jsxRuntimeExports.jsxs("p",{"trae-inspector-start-line":"657","trae-inspector-start-column":"10","trae-inspector-end-line":"659","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-500 mt-2 leading-relaxed",children:[a,"名员工随时待命，",i.length,"个部门高效运转。"]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"660","trae-inspector-start-column":"10","trae-inspector-end-line":"665","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E2%86%92%20%E4%B8%8B%E8%BE%BE%E6%96%B0%E6%8C%87%E4%BB%A4%22%2C%22textStartLine%22%3A%22663%22%2C%22textStartColumn%22%3A%2211%22%2C%22textEndLine%22%3A%22665%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:s,className:"mt-3 w-full py-2 rounded-xl bg-green-900/40 border border-green-700/50 text-green-400 text-[12px] font-mono hover:bg-green-900/60 transition-all",children:"→ 下达新指令"})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"669","trae-inspector-start-column":"8","trae-inspector-end-line":"679","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-2 gap-2",children:c.map(d=>jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"671","trae-inspector-start-column":"12","trae-inspector-end-line":"677","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("p-3 rounded-xl border",d.bg,d.border),children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"672","trae-inspector-start-column":"14","trae-inspector-end-line":"675","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-baseline gap-1 mb-0.5",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"673","trae-inspector-start-column":"16","trae-inspector-end-line":"673","trae-inspector-end-column":"99","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-xl font-mono font-bold",d.color),children:d.value}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"674","trae-inspector-start-column":"16","trae-inspector-end-line":"674","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500",children:d.unit})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"676","trae-inspector-start-column":"14","trae-inspector-end-line":"676","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-400",children:d.label})]},d.label))}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"682","trae-inspector-start-column":"8","trae-inspector-end-line":"708","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"683","trae-inspector-start-column":"10","trae-inspector-end-line":"686","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"684","trae-inspector-start-column":"12","trae-inspector-end-line":"684","trae-inspector-end-column":"65","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-1 h-1 bg-blue-400 rounded-full"}),"部门概览"]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"687","trae-inspector-start-column":"10","trae-inspector-end-line":"707","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-1.5",children:i.slice(0,8).map(d=>{const x=e.filter(u=>u.department===d),h=x.filter(u=>u.status==="working"||u.status==="thinking").length,F=x.length>0?Math.round(h/x.length*100):0;return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"693","trae-inspector-start-column":"16","trae-inspector-end-line":"704","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"694","trae-inspector-start-column":"18","trae-inspector-end-line":"697","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-1",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"695","trae-inspector-start-column":"20","trae-inspector-end-line":"695","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-300",children:d}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"696","trae-inspector-start-column":"20","trae-inspector-end-line":"696","trae-inspector-end-column":"91","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500",children:[x.length,"人"]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"698","trae-inspector-start-column":"18","trae-inspector-end-line":"703","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-1 bg-gray-800 rounded-full overflow-hidden",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"699","trae-inspector-start-column":"20","trae-inspector-end-line":"702","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500",style:{width:`${F}%`}})})]},d)})})]}),n.length>0&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"712","trae-inspector-start-column":"10","trae-inspector-end-line":"725","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"713","trae-inspector-start-column":"12","trae-inspector-end-line":"716","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-400 px-1 mb-2 flex items-center gap-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"714","trae-inspector-start-column":"14","trae-inspector-end-line":"714","trae-inspector-end-column":"69","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-1 h-1 bg-purple-400 rounded-full"}),"最近动态"]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"717","trae-inspector-start-column":"12","trae-inspector-end-line":"724","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/50 border border-gray-800",children:[jsxRuntimeExports.jsxs("p",{"trae-inspector-start-line":"718","trae-inspector-start-column":"14","trae-inspector-end-line":"720","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-400 line-clamp-2",children:[(p=(l=n[n.length-1])==null?void 0:l.content)==null?void 0:p.slice(0,60),"..."]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"721","trae-inspector-start-column":"14","trae-inspector-end-line":"723","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-1.5 text-[10px] text-gray-500 font-mono",children:new Date(((m=n[n.length-1])==null?void 0:m.timestamp)||Date.now()).toLocaleString("zh-CN")})]})]})]})})}function ChatView(){const{messages:s,isStreaming:e,addMessage:t,setStreaming:n,chatStyle:a,setChatStyle:o}=useChatStore(),{resetAllAgents:i,updateAgentStatus:c,setAgentProgress:l}=useAgentStore(),{workflowSpeed:p}=useThemeStore(),{addEntry:m}=useKnowledgeStore(),[d,x]=reactExports.useState(""),[h,F]=reactExports.useState("idle"),[u,f]=reactExports.useState("dashboard"),k=reactExports.useRef(null),y=reactExports.useRef(null),g=reactExports.useRef(new Set);reactExports.useEffect(()=>{var j;(j=k.current)==null||j.scrollTo({top:k.current.scrollHeight,behavior:"smooth"})},[s,e]),reactExports.useEffect(()=>{y.current=new WorkflowEngine({speedFactor:p,chatStyle:a})},[p,a]);const b={analyst:"analyst","coder-a":"coder-1","coder-b":"coder-2","coder-c":"coder-3","coder-d":"coder-4","coder-e":"coder-5",reviewer:"inspector-1","bug-detector":"inspector-2",extender:"expander",packager:"packer",deployer:"deliverer","knowledge-manager":"doc-writer"},C=async()=>{const j=d.trim();if(!(!j||e)){x(""),g.current.clear(),i(),t({id:Date.now().toString(),role:"user",content:j,timestamp:Date.now(),type:"text"}),n(!0),c("chairman","working"),l("chairman",30,"下达指令"),t({id:(Date.now()+1).toString(),role:"system",content:`📋 指令已接收，正在分发给分析员...

"${j}"`,timestamp:Date.now()+100,type:"text"});try{if(y.current){y.current.setOnProgress(S=>{if(F(S.phase),l("chairman",Math.min(100,(S.phaseIndex+1)/S.totalPhases*100),"监督工作流"),S.agent&&S.content&&!g.current.has(S.agent.id)){g.current.add(S.agent.id);const B=b[S.agent.id]||S.agent.id;c(B,"working"),l(B,50,S.message),setTimeout(()=>{c(B,"done"),l(B,100)},1500),t({id:`${Date.now()}-${S.agent.id}`,role:B,content:S.content,timestamp:Date.now(),type:"text",metadata:{agentId:B,phase:S.phase}})}});const w=await y.current.executeWorkflow(j);try{const S=w.phases.flatMap($=>$.outputs).join(`

`).slice(0,3e3),B=j.replace(/[，。、！？\s]+/g," ").split(" ").filter($=>$.length>1).slice(0,5),v=j.toLowerCase();let _="任务经验";v.includes("python")||v.includes("fastapi")||v.includes("后端")?_="后端开发":v.includes("react")||v.includes("前端")||v.includes("组件")?_="前端开发":v.includes("ai")||v.includes("智能体")||v.includes("agent")?_="AI/智能体":v.includes("sql")||v.includes("数据库")?_="数据库":(v.includes("部署")||v.includes("docker"))&&(_="DevOps");const U=`auto-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;m({id:U,title:`任务经验：${j.slice(0,40)}${j.length>40?"...":""}`,content:`## 任务记录

### 用户指令
${j}

### 执行结果摘要
${S.slice(0,2e3)}

### 执行统计
- 阶段数：${w.phases.length}
- 耗时：${(w.totalDuration/1e3).toFixed(1)}秒
- 状态：${w.isSuccess?"✅ 成功":"❌ 失败"}
- 生成时间：${new Date().toLocaleString("zh-CN")}

---
*此条目由自我学习系统自动生成*`,tags:[...B,"自动生成","任务经验",_],category:_,createdAt:Date.now(),source:"自我学习系统"})}catch(S){console.error("知识沉淀失败:",S)}t({id:(Date.now()+999).toString(),role:"system",content:w.isSuccess?`✅ 任务完成！

📊 执行统计：
• 共 ${w.phases.length} 个阶段
• 耗时 ${(w.totalDuration/1e3).toFixed(1)} 秒
• 全部Agent协作完成

📚 本次任务经验已自动存入知识库

结果已交付，请查阅。`:`⚠️ 任务执行结束（部分阶段可能异常）

📊 执行统计：
• 共 ${w.phases.length} 个阶段
• 耗时 ${(w.totalDuration/1e3).toFixed(1)} 秒

📚 本次任务经验已自动存入知识库

结果已交付，请查阅。`,timestamp:Date.now(),type:"text"}),c("chairman","done"),l("chairman",100,"任务完成")}}catch(w){t({id:(Date.now()+998).toString(),role:"system",content:`❌ 错误: ${w instanceof Error?w.message:"未知错误"}`,timestamp:Date.now(),type:"text"})}finally{n(!1),F("idle")}}},R=[{label:"建网站首页",cmd:"创建一个现代化的企业官网首页，使用React + Tailwind CSS，包含导航、Hero区域、产品展示、团队介绍和联系表单",icon:"🌐"},{label:"产品文案",cmd:"为一款AI助手产品撰写产品介绍文案，包括核心卖点、功能特点、使用场景和CTA文案",icon:"✍️"},{label:"性能优化",cmd:"分析并优化前端应用性能，包括代码分割、懒加载、缓存策略、图片优化和首屏加载优化",icon:"⚡"},{label:"数据库设计",cmd:"设计一个电商平台的数据库架构，包括用户表、商品表、订单表、购物车表和支付表",icon:"🗄️"},{label:"安全审计",cmd:"对Web应用进行安全审计，包括SQL注入、XSS攻击、CSRF防护、敏感数据保护和权限控制",icon:"🔐"},{label:"API设计",cmd:"设计一套RESTful API接口，包括用户认证、数据CRUD、分页查询、权限控制和错误处理",icon:"🔌"},{label:"代码审查",cmd:"审查一段代码的质量，包括代码规范、性能问题、安全隐患、可读性和可维护性",icon:"🔍"},{label:"技术文档",cmd:"编写一份完整的技术文档，包括架构设计、API文档、部署指南和运维手册",icon:"📖"}];return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"928","trae-inspector-start-column":"4","trae-inspector-end-line":"1080","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"930","trae-inspector-start-column":"6","trae-inspector-end-line":"1000","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 pt-2.5 pb-1",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"931","trae-inspector-start-column":"8","trae-inspector-end-line":"962","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"932","trae-inspector-start-column":"10","trae-inspector-end-line":"942","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"933","trae-inspector-start-column":"12","trae-inspector-end-line":"935","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-7 h-7 rounded-lg bg-green-900/30 border border-green-700/50 flex items-center justify-center",children:jsxRuntimeExports.jsx(Crown,{className:"w-4 h-4 text-yellow-400"})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"936","trae-inspector-start-column":"12","trae-inspector-end-line":"941","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"937","trae-inspector-start-column":"14","trae-inspector-end-line":"939","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22HOPEAI%22%2C%22textStartLine%22%3A%22937%22%2C%22textStartColumn%22%3A%22127%22%2C%22textEndLine%22%3A%22939%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono font-bold text-green-400",style:{textShadow:"0 0 8px rgba(34,197,94,0.5)"},children:"HOPEAI"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"940","trae-inspector-start-column":"14","trae-inspector-end-line":"940","trae-inspector-end-column":"82","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%B8%85%E9%B8%A2AI%E5%85%AC%E5%8F%B8%22%2C%22textStartLine%22%3A%22940%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22940%22%2C%22textEndColumn%22%3A%2278%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-500 -mt-0.5",children:"清鸢AI公司"})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"943","trae-inspector-start-column":"10","trae-inspector-end-line":"961","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"944","trae-inspector-start-column":"12","trae-inspector-end-line":"944","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"945","trae-inspector-start-column":"12","trae-inspector-end-line":"945","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9C%A8%E7%BA%BF%22%2C%22textStartLine%22%3A%22945%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%22945%22%2C%22textEndColumn%22%3A%2269%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-green-400",children:"在线"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"947","trae-inspector-start-column":"12","trae-inspector-end-line":"960","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1 ml-2",children:[jsxRuntimeExports.jsx(Sparkles,{className:"w-3 h-3 text-purple-400"}),jsxRuntimeExports.jsx("select",{"trae-inspector-start-line":"949","trae-inspector-start-column":"14","trae-inspector-end-line":"959","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:a,onChange:j=>o(j.target.value),className:"text-[10px] font-mono bg-gray-900/80 border border-gray-800 rounded-lg px-2 py-1 text-gray-300 focus:outline-none focus:border-purple-600/50",children:chatStyles.map(j=>jsxRuntimeExports.jsxs("option",{"trae-inspector-start-line":"955","trae-inspector-start-column":"18","trae-inspector-end-line":"957","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:j.id,children:[j.emoji," ",j.name]},j.id))})]})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"965","trae-inspector-start-column":"8","trae-inspector-end-line":"999","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-1 mb-1",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"966","trae-inspector-start-column":"10","trae-inspector-end-line":"976","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%8E%A7%E5%88%B6%E4%B8%AD%E5%BF%83%22%2C%22textStartLine%22%3A%22974%22%2C%22textStartColumn%22%3A%2211%22%2C%22textEndLine%22%3A%22976%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>f("dashboard"),className:cn("flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all",u==="dashboard"?"bg-green-900/40 text-green-400 border border-green-800/50":"text-gray-500 hover:text-gray-300"),children:"控制中心"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"977","trae-inspector-start-column":"10","trae-inspector-end-line":"987","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%B8%8B%E8%BE%BE%E6%8C%87%E4%BB%A4%22%2C%22textStartLine%22%3A%22985%22%2C%22textStartColumn%22%3A%2211%22%2C%22textEndLine%22%3A%22987%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>f("chat"),className:cn("flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all",u==="chat"?"bg-green-900/40 text-green-400 border border-green-800/50":"text-gray-500 hover:text-gray-300"),children:"下达指令"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"988","trae-inspector-start-column":"10","trae-inspector-end-line":"998","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22Agent%20%E6%8E%A7%E5%88%B6%E5%8F%B0%22%2C%22textStartLine%22%3A%22996%22%2C%22textStartColumn%22%3A%2211%22%2C%22textEndLine%22%3A%22998%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>f("console"),className:cn("flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all",u==="console"?"bg-purple-900/40 text-purple-400 border border-purple-800/50":"text-gray-500 hover:text-gray-300"),children:"Agent 控制台"})]})]}),u==="dashboard"?jsxRuntimeExports.jsx(DashboardMiniView,{onStartChat:()=>f("chat")}):u==="console"?jsxRuntimeExports.jsx(AgentConsoleView,{}):jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"1010","trae-inspector-start-column":"10","trae-inspector-end-line":"1040","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",ref:k,className:"flex-1 overflow-y-auto py-2",children:s.length===0?jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"1012","trae-inspector-start-column":"14","trae-inspector-end-line":"1033","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col items-center justify-center px-6 text-center",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"1013","trae-inspector-start-column":"16","trae-inspector-end-line":"1015","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-16 h-16 rounded-2xl bg-green-900/20 border border-green-700/40 flex items-center justify-center mb-4",children:jsxRuntimeExports.jsx(Crown,{className:"w-8 h-8 text-yellow-400 opacity-70"})}),jsxRuntimeExports.jsx("h2",{"trae-inspector-start-line":"1016","trae-inspector-start-column":"16","trae-inspector-end-line":"1016","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AC%A2%E8%BF%8E%EF%BC%8C%E8%91%A3%E4%BA%8B%E9%95%BF%22%2C%22textStartLine%22%3A%221016%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%221016%22%2C%22textEndColumn%22%3A%2278%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono text-green-400 mb-1",children:"欢迎，董事长"}),jsxRuntimeExports.jsxs("p",{"trae-inspector-start-line":"1017","trae-inspector-start-column":"16","trae-inspector-end-line":"1020","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[12px] text-gray-500 leading-relaxed",children:["下达您的指令，团队将自动协作完成",jsxRuntimeExports.jsx("br",{"trae-inspector-start-line":"1018","trae-inspector-start-column":"34","trae-inspector-end-line":"1018","trae-inspector-end-column":"40","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D"}),"分析 → 编码 → 审查 → 扩展 → 打包 → 部署"]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"1021","trae-inspector-start-column":"16","trae-inspector-end-line":"1032","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-6 grid grid-cols-2 gap-2 w-full max-w-xs",children:R.map(j=>jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"1023","trae-inspector-start-column":"20","trae-inspector-end-line":"1030","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>x(j.cmd),className:"flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-purple-700/50 text-[11px] font-mono text-gray-400 hover:text-purple-400 transition-all active:scale-95",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"1028","trae-inspector-start-column":"22","trae-inspector-end-line":"1028","trae-inspector-end-column":"68","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-lg",children:j.icon}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"1029","trae-inspector-start-column":"22","trae-inspector-end-line":"1029","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-center line-clamp-1",children:j.label})]},j.label))})]}):jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[s.map(j=>jsxRuntimeExports.jsx(MobileMessage,{message:j},j.id)),e&&jsxRuntimeExports.jsx(TypingIndicator,{})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"1043","trae-inspector-start-column":"10","trae-inspector-end-line":"1077","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-t border-green-900/30 p-2.5",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"1044","trae-inspector-start-column":"12","trae-inspector-end-line":"1076","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-end gap-2 max-w-md mx-auto",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"1045","trae-inspector-start-column":"14","trae-inspector-end-line":"1063","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 relative",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"1046","trae-inspector-start-column":"16","trae-inspector-end-line":"1062","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center bg-gray-900/80 border border-gray-800 rounded-2xl focus-within:border-green-700/50 transition-colors",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"1047","trae-inspector-start-column":"18","trae-inspector-end-line":"1047","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"pl-3 text-green-500 font-mono text-sm",children:">"}),jsxRuntimeExports.jsx("textarea",{"trae-inspector-start-line":"1048","trae-inspector-start-column":"18","trae-inspector-end-line":"1061","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:d,onChange:j=>x(j.target.value),onKeyDown:j=>{j.key==="Enter"&&!j.shiftKey&&(j.preventDefault(),C())},placeholder:"下达指令...",rows:1,className:"flex-1 bg-transparent px-2 py-2.5 text-[13px] text-gray-100 placeholder-gray-600 font-mono resize-none outline-none max-h-24",disabled:e})]})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"1064","trae-inspector-start-column":"14","trae-inspector-end-line":"1075","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Dashboard.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:C,disabled:!d.trim()||e,className:cn("flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all",d.trim()&&!e?"bg-green-600 text-white shadow-[0_0_12px_rgba(34,197,94,0.5)] hover:bg-green-500":"bg-gray-800 text-gray-600"),children:jsxRuntimeExports.jsx(Send,{className:"w-4 h-4"})})]})})]})]})}function Dashboard({initialView:s="chat"}){return s==="team"?jsxRuntimeExports.jsx(TeamView,{}):jsxRuntimeExports.jsx(ChatView,{})}const FEATURED_REPOS=[{owner:"facebook",repo:"react",category:"前端开发",tags:["react","前端","facebook"]},{owner:"vuejs",repo:"vue",category:"前端开发",tags:["vue","前端","渐进式"]},{owner:"vitejs",repo:"vite",category:"前端开发",tags:["vite","构建工具","esbuild"]},{owner:"tailwindlabs",repo:"tailwindcss",category:"前端开发",tags:["tailwindcss","css","原子化"]},{owner:"pmndrs",repo:"zustand",category:"前端开发",tags:["zustand","状态管理","react"]},{owner:"remix-run",repo:"react-router",category:"前端开发",tags:["react-router","路由","spa"]},{owner:"framer",repo:"motion",category:"前端开发",tags:["framer-motion","动画","react"]},{owner:"tiangolo",repo:"fastapi",category:"后端开发",tags:["fastapi","python","api"]},{owner:"encode",repo:"starlette",category:"后端开发",tags:["starlette","asgi","python"]},{owner:"pydantic",repo:"pydantic",category:"后端开发",tags:["pydantic","数据验证","python"]},{owner:"sqlalchemy",repo:"sqlalchemy",category:"后端开发",tags:["sqlalchemy","orm","python"]},{owner:"encode",repo:"uvicorn",category:"后端开发",tags:["uvicorn","asgi","服务器"]},{owner:"langchain-ai",repo:"langchain",category:"AI/智能体",tags:["langchain","ai","agent"]},{owner:"chroma-core",repo:"chroma",category:"AI/智能体",tags:["chromadb","向量数据库","ai"]},{owner:"microsoft",repo:"autogen",category:"AI/智能体",tags:["autogen","multi-agent","microsoft"]},{owner:"openai",repo:"openai-python",category:"AI/智能体",tags:["openai","api","python"]},{owner:"huggingface",repo:"transformers",category:"AI/智能体",tags:["transformers","nlp","huggingface"]},{owner:"sentence-transformers",repo:"sentence-transformers",category:"AI/智能体",tags:["embedding","向量化","nlp"]},{owner:"prisma",repo:"prisma",category:"数据库",tags:["prisma","orm","typescript"]},{owner:"redis",repo:"redis",category:"数据库",tags:["redis","缓存","nosql"]},{owner:"postgres",repo:"postgres",category:"数据库",tags:["postgresql","数据库","sql"]},{owner:"nginx",repo:"nginx",category:"DevOps",tags:["nginx","反向代理","负载均衡"]},{owner:"docker",repo:"compose",category:"DevOps",tags:["docker","compose","容器"]},{owner:"actions",repo:"actions",category:"DevOps",tags:["github-actions","ci-cd","自动化"]},{owner:"microsoft",repo:"TypeScript",category:"编程语言",tags:["typescript","类型系统","microsoft"]},{owner:"microsoft",repo:"vscode",category:"工具",tags:["vscode","编辑器","ide"]},{owner:"electron",repo:"electron",category:"工具",tags:["electron","桌面应用","跨平台"]},{owner:"qingluan-studio",repo:"hopeai",category:"项目规划",tags:["hopeai","希望AI","AI助手","董事长项目"]},{owner:"qingluan-studio",repo:"hopeai-v20",category:"项目规划",tags:["hopeai-v20","希望AI","极简助手","董事长项目"]},{owner:"qingluan-studio",repo:"Mingyuan-Assistant",category:"AI/智能体",tags:["mingyuan","助手","AI","董事长项目"]}],GITHUB_API="https://api.github.com";async function fetchRepoReadme(s,e){try{const t=await fetch(`${GITHUB_API}/repos/${s}/${e}/readme`,{headers:{Accept:"application/vnd.github.v3.raw"}});return t.ok?(await t.text()).slice(0,8e3):null}catch{return null}}async function fetchRepoInfo(s,e){var t;try{const n=await fetch(`${GITHUB_API}/repos/${s}/${e}`);if(!n.ok)return null;const a=await n.json();return{description:a.description||"",stars:a.stargazers_count||0,language:a.language||"",topics:a.topics||[],license:((t=a.license)==null?void 0:t.spdx_id)||""}}catch{return null}}function extractCodeSnippets(s){const e=[],t=/```(\w+)?\n([\s\S]*?)```/g;let n;for(;(n=t.exec(s))!==null;){const a=n[1]||"text",o=n[2].trim();o.length>50&&o.length<5e3&&e.push({language:a,code:o})}return e.slice(0,3)}async function fetchRepoKnowledge(s){const[e,t]=await Promise.all([fetchRepoReadme(s.owner,s.repo),fetchRepoInfo(s.owner,s.repo)]);if(!e)return null;const n=extractCodeSnippets(e),a=n.length>0?`

### 代码示例

${n.map((c,l)=>`\`\`\`${c.language}
${c.code}
\`\`\``).join(`

`)}`:"",o=t!=null&&t.license?`
- 许可证: ${t.license}`:"",i=t!=null&&t.stars?`
- Stars: ${t.stars.toLocaleString()}`:"";return{id:`gh-${s.owner}-${s.repo}`,title:`${s.owner}/${s.repo} - 开源项目文档`,content:`## ${s.owner}/${s.repo}

${(t==null?void 0:t.description)||""}

### 项目信息
- 语言: ${(t==null?void 0:t.language)||"未知"}${i}${o}
- GitHub: https://github.com/${s.owner}/${s.repo}

### README 摘要

${e.slice(0,3e3)}
${a}

---
*来源: GitHub 开源项目 (公开可商用)*`,tags:[...s.tags,"开源","github",s.owner],category:s.category,createdAt:Date.now(),source:"GitHub开源导入"}}async function fetchOpenSourceKnowledge(s,e=10){const n=[...FEATURED_REPOS].sort(()=>Math.random()-.5).slice(0,e),a=[];for(let o=0;o<n.length;o++){const i=n[o];s==null||s(o+1,n.length,`${i.owner}/${i.repo}`);const c=await fetchRepoKnowledge(i);c&&a.push(c),o<n.length-1&&await new Promise(l=>setTimeout(l,200))}return a}async function fetchCodeSnippets(s="python",e){const t=FEATURED_REPOS.filter(a=>s==="python"?a.tags.includes("python")||a.tags.includes("fastapi"):s==="typescript"||s==="react"?a.tags.includes("react")||a.tags.includes("typescript"):!0).slice(0,5),n=[];for(let a=0;a<t.length;a++){e==null||e(a+1,t.length);const o=await fetchRepoKnowledge(t[a]);o&&(o.id=`code-${t[a].owner}-${t[a].repo}-${Date.now()}`,o.title=`[代码片段] ${t[a].owner}/${t[a].repo}`,o.category="代码示例",n.push(o)),await new Promise(i=>setTimeout(i,200))}return n}async function fetchMyProjects(s){const e="qingluan-studio",t=[];let n=[];try{const a=await fetch(`${GITHUB_API}/users/${e}/repos?per_page=50&sort=updated&type=public`);a.ok&&(n=(await a.json()).filter(i=>!i.fork).map(i=>i.name))}catch{n=["hopeai","hopeai-v20","Mingyuan-Assistant"]}n.length===0&&(n=["hopeai","hopeai-v20","Mingyuan-Assistant"]);for(let a=0;a<n.length;a++){const o=n[a];s==null||s(a+1,n.length,`${e}/${o}`);const i=await fetchRepoKnowledge({owner:e,repo:o,category:"董事长项目",tags:["自有项目","董事长",e,o]});i&&(i.id=`my-${e}-${o}-${Date.now()}`,i.title=`[董事长项目] ${o}`,i.source="董事长GitHub仓库",t.push(i)),a<n.length-1&&await new Promise(c=>setTimeout(c,200))}return t}const STORAGE_KEY="hopeai-sync-config";function getSyncConfig(){try{const s=localStorage.getItem(STORAGE_KEY);if(s)return JSON.parse(s)}catch{}return{enabled:!1,apiUrl:"https://hopeai-v20.pages.dev/api",apiKey:"",autoSync:!1,lastSyncTime:0,syncStats:{totalSynced:0,created:0,updated:0,skipped:0}}}function saveSyncConfig(s){const t={...getSyncConfig(),...s};localStorage.setItem(STORAGE_KEY,JSON.stringify(t))}function clearSyncConfig(){localStorage.removeItem(STORAGE_KEY)}async function syncToHopeAI(s,e){const t=getSyncConfig();if(!t.enabled||!t.apiUrl)return{success:!1,created:0,updated:0,skipped:0,error:"同步未启用或API地址未配置"};try{const n=t.apiUrl.replace(/\/$/,"")+"/knowledge/sync",a={items:s.map(p=>({id:p.id,title:p.title,content:p.content,category:p.category,tags:p.tags,source:p.source||"hopeagent_pro",createdAt:new Date(p.createdAt).toISOString(),updatedAt:new Date(p.createdAt).toISOString()})),since:t.lastSyncTime,source:"hopeagent_pro"},o={"Content-Type":"application/json"};t.apiKey&&(o.Authorization=`Bearer ${t.apiKey}`),e==null||e(0,s.length,"正在同步...");const c=await(await fetch(n,{method:"POST",headers:o,body:JSON.stringify(a)})).json();if(!c.success)return{success:!1,created:0,updated:0,skipped:0,error:c.error||"同步失败"};e==null||e(s.length,s.length,"同步完成");const l={totalSynced:t.syncStats.totalSynced+s.length,created:t.syncStats.created+(c.created||0),updated:t.syncStats.updated+(c.updated||0),skipped:t.syncStats.skipped+(c.skipped||0)};return saveSyncConfig({lastSyncTime:Date.now(),syncStats:l}),{success:!0,created:c.created||0,updated:c.updated||0,skipped:c.skipped||0}}catch(n){return{success:!1,created:0,updated:0,skipped:0,error:n instanceof Error?n.message:"网络错误"}}}async function testConnection(){const s=getSyncConfig();if(!s.apiUrl)return{success:!1,error:"请先配置API地址"};try{const e=s.apiUrl.replace(/\/$/,"")+"/knowledge/list?limit=1",n=await(await fetch(e)).json();return n.success?{success:!0,totalKnowledge:n.total||0}:{success:!1,error:n.error||"连接失败"}}catch(e){return{success:!1,error:e instanceof Error?e.message:"网络错误"}}}const categories$1=[{id:"all",name:"全部"},{id:"项目规划",name:"规划"},{id:"前端开发",name:"前端"},{id:"后端开发",name:"后端"},{id:"编程语言",name:"语言"},{id:"运维部署",name:"运维"},{id:"架构设计",name:"架构"}],neonTagColors=["text-green-400 border-green-500/50 bg-green-500/10","text-blue-400 border-blue-500/50 bg-blue-500/10","text-purple-400 border-purple-500/50 bg-purple-500/10","text-yellow-400 border-yellow-500/50 bg-yellow-500/10","text-pink-400 border-pink-500/50 bg-pink-500/10","text-cyan-400 border-cyan-500/50 bg-cyan-500/10"];function getTagColor(s){return neonTagColors[s%neonTagColors.length]}function KnowledgeCard({entry:s,onClick:e}){const t=n=>new Date(n).toLocaleDateString("zh-CN",{month:"2-digit",day:"2-digit"});return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"70","trae-inspector-start-column":"4","trae-inspector-end-line":"107","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:e,className:cn("p-3 rounded-xl border bg-gray-900/60 border-gray-800","active:scale-[0.98] transition-transform cursor-pointer"),children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"77","trae-inspector-start-column":"6","trae-inspector-end-line":"82","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-start justify-between mb-2",children:[jsxRuntimeExports.jsx("h3",{"trae-inspector-start-line":"78","trae-inspector-start-column":"8","trae-inspector-end-line":"80","trae-inspector-end-column":"13","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-200 font-medium flex-1 mr-2 line-clamp-1",children:s.title}),jsxRuntimeExports.jsx(ChevronRight,{className:"w-4 h-4 text-gray-600 flex-shrink-0"})]}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"84","trae-inspector-start-column":"6","trae-inspector-end-line":"86","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs text-gray-500 mb-2.5 line-clamp-2 font-mono leading-relaxed",children:s.content}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"88","trae-inspector-start-column":"6","trae-inspector-end-line":"106","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"89","trae-inspector-start-column":"8","trae-inspector-end-line":"101","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1",children:s.tags.slice(0,2).map((n,a)=>jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"91","trae-inspector-start-column":"12","trae-inspector-end-line":"99","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("px-1.5 py-0.5 text-[10px] font-mono rounded border",getTagColor(a)),children:["#",n]},n))}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"102","trae-inspector-start-column":"8","trae-inspector-end-line":"105","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1 text-[10px] font-mono text-gray-600",children:[jsxRuntimeExports.jsx(Clock,{className:"w-3 h-3"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"104","trae-inspector-start-column":"10","trae-inspector-end-line":"104","trae-inspector-end-column":"52","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:t(s.createdAt)})]})]})]})}function DetailView({entry:s,onBack:e}){const t=n=>new Date(n).toLocaleDateString("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"});return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"129","trae-inspector-start-column":"4","trae-inspector-end-line":"255","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"fixed inset-0 z-50 bg-gray-950 flex flex-col",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"130","trae-inspector-start-column":"6","trae-inspector-end-line":"150","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"131","trae-inspector-start-column":"8","trae-inspector-end-line":"149","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-3 max-w-md mx-auto",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"132","trae-inspector-start-column":"10","trae-inspector-end-line":"137","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:e,className:"p-1.5 -ml-1.5 rounded-lg hover:bg-gray-800/80 transition-colors",children:jsxRuntimeExports.jsx(ArrowLeft,{className:"w-5 h-5 text-green-400"})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"138","trae-inspector-start-column":"10","trae-inspector-end-line":"148","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 min-w-0",children:[jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"139","trae-inspector-start-column":"12","trae-inspector-end-line":"141","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-green-400 font-bold line-clamp-1",style:{textShadow:"0 0 8px rgba(34,197,94,0.5)"},children:s.title}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"142","trae-inspector-start-column":"12","trae-inspector-end-line":"147","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 text-[10px] font-mono text-gray-500 mt-0.5",children:[jsxRuntimeExports.jsx(Folder,{className:"w-3 h-3"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"144","trae-inspector-start-column":"14","trae-inspector-end-line":"144","trae-inspector-end-column":"43","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:s.category}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"145","trae-inspector-start-column":"14","trae-inspector-end-line":"145","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%C2%B7%22%2C%22textStartLine%22%3A%22145%22%2C%22textStartColumn%22%3A%2220%22%2C%22textEndLine%22%3A%22145%22%2C%22textEndColumn%22%3A%2221%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"·"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"146","trae-inspector-start-column":"14","trae-inspector-end-line":"146","trae-inspector-end-column":"56","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:t(s.createdAt)})]})]})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"152","trae-inspector-start-column":"6","trae-inspector-end-line":"167","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 px-4 py-2 border-b border-green-900/20 bg-gray-950/50",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"153","trae-inspector-start-column":"8","trae-inspector-end-line":"166","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1.5 max-w-md mx-auto",children:s.tags.map((n,a)=>jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"155","trae-inspector-start-column":"12","trae-inspector-end-line":"164","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("px-2 py-0.5 text-[10px] font-mono rounded border",getTagColor(a)),children:[jsxRuntimeExports.jsx(Tag,{className:"w-3 h-3 inline mr-1"}),n]},n))})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"169","trae-inspector-start-column":"6","trae-inspector-end-line":"254","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto px-4 py-4 safe-area-bottom",children:jsxRuntimeExports.jsx("article",{"trae-inspector-start-line":"170","trae-inspector-start-column":"8","trae-inspector-end-line":"253","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto",children:jsxRuntimeExports.jsx(Markdown,{remarkPlugins:[remarkGfm],components:{h1:({children:n})=>jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"175","trae-inspector-start-column":"16","trae-inspector-end-line":"177","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-lg font-mono text-green-400 mb-3 mt-5 first:mt-0",style:{textShadow:"0 0 8px rgba(34,197,94,0.4)"},children:n}),h2:({children:n})=>jsxRuntimeExports.jsx("h2",{"trae-inspector-start-line":"180","trae-inspector-start-column":"16","trae-inspector-end-line":"182","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono text-green-300 mb-2.5 mt-4",style:{textShadow:"0 0 6px rgba(34,197,94,0.3)"},children:n}),h3:({children:n})=>jsxRuntimeExports.jsx("h3",{"trae-inspector-start-line":"185","trae-inspector-start-column":"16","trae-inspector-end-line":"187","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-green-300/80 mb-2 mt-3",children:n}),p:({children:n})=>jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"190","trae-inspector-start-column":"16","trae-inspector-end-line":"192","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs text-gray-300 mb-3 leading-relaxed font-mono",children:n}),ul:({children:n})=>jsxRuntimeExports.jsx("ul",{"trae-inspector-start-line":"195","trae-inspector-start-column":"16","trae-inspector-end-line":"197","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"list-disc list-inside mb-3 text-xs text-gray-300 font-mono space-y-1",children:n}),ol:({children:n})=>jsxRuntimeExports.jsx("ol",{"trae-inspector-start-line":"200","trae-inspector-start-column":"16","trae-inspector-end-line":"202","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"list-decimal list-inside mb-3 text-xs text-gray-300 font-mono space-y-1",children:n}),code:({className:n,children:a})=>n?jsxRuntimeExports.jsx("code",{"trae-inspector-start-line":"214","trae-inspector-start-column":"18","trae-inspector-end-line":"216","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"block bg-gray-900/80 border border-gray-700 rounded-lg p-3 text-[11px] font-mono text-gray-300 overflow-x-auto mb-3",children:a}):jsxRuntimeExports.jsx("code",{"trae-inspector-start-line":"208","trae-inspector-start-column":"20","trae-inspector-end-line":"210","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded text-[11px] font-mono border border-green-800/50",children:a}),blockquote:({children:n})=>jsxRuntimeExports.jsx("blockquote",{"trae-inspector-start-line":"220","trae-inspector-start-column":"16","trae-inspector-end-line":"222","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"border-l-2 border-green-500 pl-3 py-1.5 my-3 bg-green-900/10 text-gray-400 text-xs font-mono italic",children:n}),a:({href:n,children:a})=>jsxRuntimeExports.jsx("a",{"trae-inspector-start-line":"225","trae-inspector-start-column":"16","trae-inspector-end-line":"230","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",href:n,className:"text-cyan-400 hover:text-cyan-300 underline underline-offset-2",children:a}),table:({children:n})=>jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"233","trae-inspector-start-column":"16","trae-inspector-end-line":"237","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"overflow-x-auto mb-3 -mx-1",children:jsxRuntimeExports.jsx("table",{"trae-inspector-start-line":"234","trae-inspector-start-column":"18","trae-inspector-end-line":"236","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-full text-xs font-mono border border-gray-700 rounded-lg overflow-hidden",children:n})}),th:({children:n})=>jsxRuntimeExports.jsx("th",{"trae-inspector-start-line":"240","trae-inspector-start-column":"16","trae-inspector-end-line":"242","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-2 py-1.5 bg-gray-800/80 border-b border-gray-700 text-left text-green-400",children:n}),td:({children:n})=>jsxRuntimeExports.jsx("td",{"trae-inspector-start-line":"245","trae-inspector-start-column":"16","trae-inspector-end-line":"247","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-2 py-1.5 border-b border-gray-800 text-gray-300",children:n})},children:s.content})})})]})}function Knowledge(){const{entries:s,searchQuery:e,setSearch:t,selectEntry:n,selectedEntry:a,addEntry:o,loadFromBackend:i,isLoadingBackend:c,backendTotal:l,backendError:p}=useKnowledgeStore(),[m,d]=reactExports.useState("all"),[x,h]=reactExports.useState(null),[F,u]=reactExports.useState(!1),[f,k]=reactExports.useState(!1),[y,g]=reactExports.useState({current:0,total:0,name:""}),[b,C]=reactExports.useState(null),[R,j]=reactExports.useState(()=>getSyncConfig()),[w,S]=reactExports.useState(!1),[B,v]=reactExports.useState(null);reactExports.useEffect(()=>{i()},[i]);const _=reactExports.useMemo(()=>{const E=new Set;return s.forEach(A=>A.tags.forEach(D=>E.add(D))),Array.from(E)},[s]),U=reactExports.useMemo(()=>{let E=s;if(m!=="all"&&(E=E.filter(A=>A.category===m)),x&&(E=E.filter(A=>A.tags.includes(x))),e.trim()){const A=e.toLowerCase();E=E.filter(D=>D.title.toLowerCase().includes(A)||D.content.toLowerCase().includes(A)||D.tags.some(M=>M.toLowerCase().includes(A)))}return E},[s,m,x,e]),$=s.find(E=>E.id===a)||null,V=async()=>{k(!0),C(null);try{const E=await fetchOpenSourceKnowledge((D,M,G)=>g({current:D,total:M,name:G}),8);let A=0;for(const D of E)s.some(M=>M.id===D.id)||(o(D),A++);C(`✅ 成功导入 ${A} 条开源知识`)}catch(E){C(`❌ 导入失败: ${E instanceof Error?E.message:"未知错误"}`)}finally{k(!1),g({current:0,total:0,name:""}),setTimeout(()=>C(null),5e3)}},P=async()=>{k(!0),C(null);try{const E=await fetchCodeSnippets("python",(D,M)=>g({current:D,total:M,name:"代码片段"}));let A=0;for(const D of E)o(D),A++;C(`✅ 成功导入 ${A} 条代码片段`)}catch(E){C(`❌ 导入失败: ${E instanceof Error?E.message:"未知错误"}`)}finally{k(!1),g({current:0,total:0,name:""}),setTimeout(()=>C(null),5e3)}},O=async()=>{k(!0),C(null);try{const E=await fetchMyProjects((D,M,G)=>g({current:D,total:M,name:G}));let A=0;for(const D of E)o(D),A++;C(`✅ 成功导入 ${A} 个董事长项目`)}catch(E){C(`❌ 导入失败: ${E instanceof Error?E.message:"未知错误"}`)}finally{k(!1),g({current:0,total:0,name:""}),setTimeout(()=>C(null),5e3)}},z=async()=>{S(!0),v(null);try{const E=await syncToHopeAI(s);E.success?(v(`✅ 同步成功！新增 ${E.created} 条，更新 ${E.updated} 条，跳过 ${E.skipped} 条`),j(getSyncConfig())):v(`❌ 同步失败：${E.error}`)}catch(E){v(`❌ 同步失败：${E instanceof Error?E.message:"未知错误"}`)}finally{S(!1),setTimeout(()=>v(null),5e3)}};return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"403","trae-inspector-start-column":"4","trae-inspector-end-line":"670","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"404","trae-inspector-start-column":"6","trae-inspector-end-line":"645","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"405","trae-inspector-start-column":"8","trae-inspector-end-line":"644","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"406","trae-inspector-start-column":"10","trae-inspector-end-line":"414","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 mb-3",children:[jsxRuntimeExports.jsx(BookOpen,{className:"w-5 h-5 text-purple-400",style:{filter:"drop-shadow(0 0 6px rgba(168,85,247,0.5))"}}),jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"408","trae-inspector-start-column":"12","trae-inspector-end-line":"410","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%9F%A5%E8%AF%86%E5%BA%93%22%2C%22textStartLine%22%3A%22408%22%2C%22textStartColumn%22%3A%22129%22%2C%22textEndLine%22%3A%22410%22%2C%22textEndColumn%22%3A%2212%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono font-bold text-purple-400",style:{textShadow:"0 0 8px rgba(168,85,247,0.5)"},children:"知识库"}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"411","trae-inspector-start-column":"12","trae-inspector-end-line":"413","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"ml-auto text-[10px] font-mono text-gray-500",children:["共 ",U.length," 条"]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"416","trae-inspector-start-column":"10","trae-inspector-end-line":"444","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"417","trae-inspector-start-column":"12","trae-inspector-end-line":"432","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 relative",children:[jsxRuntimeExports.jsx(Search,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"}),jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"419","trae-inspector-start-column":"14","trae-inspector-end-line":"431","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"text",value:e,onChange:E=>t(E.target.value),placeholder:"搜索知识...",className:cn("w-full pl-9 pr-3 py-2 rounded-xl border text-sm font-mono","bg-gray-900/80 border-gray-800 text-gray-200","placeholder:text-gray-600","focus:outline-none focus:border-purple-500/70","transition-colors")})]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"433","trae-inspector-start-column":"12","trae-inspector-end-line":"443","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>u(!F),className:cn("p-2 rounded-xl border transition-colors",F?"bg-purple-900/30 border-purple-700/50 text-purple-400":"bg-gray-900/80 border-gray-800 text-gray-500 hover:text-gray-400"),children:jsxRuntimeExports.jsx(Funnel,{className:"w-4 h-4"})})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"447","trae-inspector-start-column":"10","trae-inspector-end-line":"516","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-4 gap-1.5 mt-2",children:[jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"448","trae-inspector-start-column":"12","trae-inspector-end-line":"464","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:V,disabled:f,className:cn("flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all",f?"bg-gray-800 border-gray-700 text-gray-500":"bg-green-900/20 border-green-700/40 text-green-400 hover:bg-green-900/40 active:scale-95"),children:[f?jsxRuntimeExports.jsx(LoaderCircle,{className:"w-3 h-3 animate-spin"}):jsxRuntimeExports.jsx(Github,{className:"w-3 h-3"}),"开源知识"]}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"465","trae-inspector-start-column":"12","trae-inspector-end-line":"481","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:P,disabled:f,className:cn("flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all",f?"bg-gray-800 border-gray-700 text-gray-500":"bg-blue-900/20 border-blue-700/40 text-blue-400 hover:bg-blue-900/40 active:scale-95"),children:[f?jsxRuntimeExports.jsx(LoaderCircle,{className:"w-3 h-3 animate-spin"}):jsxRuntimeExports.jsx(CodeXml,{className:"w-3 h-3"}),"代码片段"]}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"482","trae-inspector-start-column":"12","trae-inspector-end-line":"498","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:O,disabled:f,className:cn("flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all",f?"bg-gray-800 border-gray-700 text-gray-500":"bg-purple-900/20 border-purple-700/40 text-purple-400 hover:bg-purple-900/40 active:scale-95"),children:[f?jsxRuntimeExports.jsx(LoaderCircle,{className:"w-3 h-3 animate-spin"}):jsxRuntimeExports.jsx(User,{className:"w-3 h-3"}),"我的项目"]}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"499","trae-inspector-start-column":"12","trae-inspector-end-line":"515","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:z,disabled:w||!R.enabled,className:cn("flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-mono transition-all",w||!R.enabled?"bg-gray-800 border-gray-700 text-gray-500":"bg-yellow-900/20 border-yellow-700/40 text-yellow-400 hover:bg-yellow-900/40 active:scale-95"),children:[w?jsxRuntimeExports.jsx(LoaderCircle,{className:"w-3 h-3 animate-spin"}):jsxRuntimeExports.jsx(RefreshCw,{className:"w-3 h-3"}),"同步"]})]}),f&&y.total>0&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"520","trae-inspector-start-column":"12","trae-inspector-end-line":"531","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 p-2 rounded-lg bg-gray-900/80 border border-green-800/30",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"521","trae-inspector-start-column":"14","trae-inspector-end-line":"524","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"522","trae-inspector-start-column":"16","trae-inspector-end-line":"522","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"truncate flex-1",children:y.name}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"523","trae-inspector-start-column":"16","trae-inspector-end-line":"523","trae-inspector-end-column":"93","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"ml-2",children:[y.current,"/",y.total]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"525","trae-inspector-start-column":"14","trae-inspector-end-line":"530","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-1 bg-gray-800 rounded-full overflow-hidden",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"526","trae-inspector-start-column":"16","trae-inspector-end-line":"529","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300",style:{width:`${y.current/y.total*100}%`}})})]}),b&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"536","trae-inspector-start-column":"12","trae-inspector-end-line":"548","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("mt-2 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5",b.startsWith("✅")?"bg-green-900/20 border border-green-700/40 text-green-400":"bg-red-900/20 border border-red-700/40 text-red-400"),children:[b.startsWith("✅")?jsxRuntimeExports.jsx(CircleCheckBig,{className:"w-3.5 h-3.5 flex-shrink-0"}):jsxRuntimeExports.jsx(X,{className:"w-3.5 h-3.5 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"547","trae-inspector-start-column":"14","trae-inspector-end-line":"547","trae-inspector-end-column":"62","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"truncate",children:b})]}),B&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"553","trae-inspector-start-column":"12","trae-inspector-end-line":"565","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("mt-2 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5",B.startsWith("✅")?"bg-yellow-900/20 border border-yellow-700/40 text-yellow-400":"bg-red-900/20 border border-red-700/40 text-red-400"),children:[B.startsWith("✅")?jsxRuntimeExports.jsx(CircleCheckBig,{className:"w-3.5 h-3.5 flex-shrink-0"}):jsxRuntimeExports.jsx(X,{className:"w-3.5 h-3.5 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"564","trae-inspector-start-column":"14","trae-inspector-end-line":"564","trae-inspector-end-column":"60","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"truncate",children:B})]}),c&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"570","trae-inspector-start-column":"12","trae-inspector-end-line":"573","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 p-2 rounded-lg bg-blue-900/20 border border-blue-700/40 flex items-center gap-1.5",children:[jsxRuntimeExports.jsx(LoaderCircle,{className:"w-3.5 h-3.5 animate-spin text-blue-400 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"572","trae-inspector-start-column":"14","trae-inspector-end-line":"572","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AD%A3%E5%9C%A8%E4%BB%8E%E5%90%8E%E7%AB%AF%E5%90%8C%E6%AD%A5%E7%9F%A5%E8%AF%86%E5%BA%93...%22%2C%22textStartLine%22%3A%22572%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22572%22%2C%22textEndColumn%22%3A%2281%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-blue-400",children:"正在从后端同步知识库..."})]}),p&&!c&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"576","trae-inspector-start-column":"12","trae-inspector-end-line":"579","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 p-2 rounded-lg bg-red-900/20 border border-red-700/40 flex items-center gap-1.5",children:[jsxRuntimeExports.jsx(TriangleAlert,{className:"w-3.5 h-3.5 text-red-400 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"578","trae-inspector-start-column":"14","trae-inspector-end-line":"578","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-red-400",children:p})]}),l>0&&!c&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"582","trae-inspector-start-column":"12","trae-inspector-end-line":"585","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 p-2 rounded-lg bg-green-900/20 border border-green-700/40 flex items-center gap-1.5",children:[jsxRuntimeExports.jsx(Database,{className:"w-3.5 h-3.5 text-green-400 flex-shrink-0"}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"584","trae-inspector-start-column":"14","trae-inspector-end-line":"584","trae-inspector-end-column":"102","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-green-400",children:["后端知识库已同步: ",l," 条"]})]}),F&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"589","trae-inspector-start-column":"12","trae-inspector-end-line":"642","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-3 space-y-3 animate-in slide-in-from-top-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"590","trae-inspector-start-column":"14","trae-inspector-end-line":"611","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"591","trae-inspector-start-column":"16","trae-inspector-end-line":"591","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%88%86%E7%B1%BB%22%2C%22textStartLine%22%3A%22591%22%2C%22textStartColumn%22%3A%2276%22%2C%22textEndLine%22%3A%22591%22%2C%22textEndColumn%22%3A%2278%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-600 mb-1.5",children:"分类"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"592","trae-inspector-start-column":"16","trae-inspector-end-line":"610","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1.5",children:categories$1.map(E=>{const A=m===E.id;return jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"596","trae-inspector-start-column":"22","trae-inspector-end-line":"607","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>d(E.id),className:cn("px-2.5 py-1 rounded-lg text-xs font-mono border transition-all",A?"bg-purple-900/30 text-purple-400 border-purple-700/50":"bg-gray-900/60 text-gray-500 border-gray-800 hover:text-gray-400"),children:E.name},E.id)})})]}),_.length>0&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"614","trae-inspector-start-column":"16","trae-inspector-end-line":"640","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"615","trae-inspector-start-column":"18","trae-inspector-end-line":"615","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%A0%87%E7%AD%BE%22%2C%22textStartLine%22%3A%22615%22%2C%22textStartColumn%22%3A%2278%22%2C%22textEndLine%22%3A%22615%22%2C%22textEndColumn%22%3A%2280%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-600 mb-1.5",children:"标签"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"616","trae-inspector-start-column":"18","trae-inspector-end-line":"631","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1.5",children:_.map((E,A)=>jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"618","trae-inspector-start-column":"22","trae-inspector-end-line":"629","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>h(x===E?null:E),className:cn("px-2 py-0.5 text-[10px] font-mono rounded border transition-all",x===E?getTagColor(A):"text-gray-500 border-gray-700/50 hover:border-gray-600"),children:["#",E]},E))}),x&&jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"633","trae-inspector-start-column":"20","trae-inspector-end-line":"638","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%B8%85%E9%99%A4%E6%A0%87%E7%AD%BE%E7%AD%9B%E9%80%89%22%2C%22textStartLine%22%3A%22636%22%2C%22textStartColumn%22%3A%2221%22%2C%22textEndLine%22%3A%22638%22%2C%22textEndColumn%22%3A%2220%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>h(null),className:"mt-2 text-[10px] font-mono text-purple-400 hover:text-purple-300",children:"清除标签筛选"})]})]})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"647","trae-inspector-start-column":"6","trae-inspector-end-line":"665","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 safe-area-bottom",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"648","trae-inspector-start-column":"8","trae-inspector-end-line":"664","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto space-y-2",children:U.length===0?jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"650","trae-inspector-start-column":"12","trae-inspector-end-line":"654","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-center py-16 text-gray-600",children:[jsxRuntimeExports.jsx(Search,{className:"w-10 h-10 mx-auto mb-3 opacity-30"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"652","trae-inspector-start-column":"14","trae-inspector-end-line":"652","trae-inspector-end-column":"63","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9C%AA%E6%89%BE%E5%88%B0%E7%9B%B8%E5%85%B3%E7%9F%A5%E8%AF%86%22%2C%22textStartLine%22%3A%22652%22%2C%22textStartColumn%22%3A%2252%22%2C%22textEndLine%22%3A%22652%22%2C%22textEndColumn%22%3A%2259%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"font-mono text-sm mb-1",children:"未找到相关知识"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"653","trae-inspector-start-column":"14","trae-inspector-end-line":"653","trae-inspector-end-column":"74","trae-inspector-file-path":"src/pages/Knowledge.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9B%B4%E6%8D%A2%E5%85%B3%E9%94%AE%E8%AF%8D%E6%88%96%E7%AD%9B%E9%80%89%E6%9D%A1%E4%BB%B6%E8%AF%95%E8%AF%95%22%2C%22textStartLine%22%3A%22653%22%2C%22textStartColumn%22%3A%2258%22%2C%22textEndLine%22%3A%22653%22%2C%22textEndColumn%22%3A%2270%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"font-mono text-xs opacity-60",children:"更换关键词或筛选条件试试"})]}):U.map(E=>jsxRuntimeExports.jsx(KnowledgeCard,{entry:E,onClick:()=>n(E.id)},E.id))})}),$&&jsxRuntimeExports.jsx(DetailView,{entry:$,onBack:()=>n(null)})]})}const initialTasks=[{id:"1",title:"完善多Agent协作系统",description:"继续优化多Agent协作流程，增加更多角色和部门，完善工作流引擎。",status:"in-progress",priority:"high",assignee:"tech-lead",department:"技术部",createdAt:Date.now()-864e5*2,dueDate:Date.now()+864e5*5,tags:["核心功能","Agent"],subtasks:[{id:"s1",title:"扩充角色到30人",done:!0},{id:"s2",title:"按部门分组展示",done:!0},{id:"s3",title:"完善工作流引擎",done:!1},{id:"s4",title:"增加任务管理系统",done:!0}],comments:[{id:"c1",author:"chairman",content:"这个是核心，一定要做好。",time:Date.now()-864e5}]},{id:"2",title:"知识库系统建设",description:"建立完善的知识库系统，支持分类、搜索、标签、自我学习沉淀。",status:"in-progress",priority:"high",assignee:"researcher",department:"研发部",createdAt:Date.now()-864e5*3,dueDate:Date.now()+864e5*7,tags:["知识库","学习"],subtasks:[{id:"s1",title:"知识库基础功能",done:!0},{id:"s2",title:"分类和标签系统",done:!0},{id:"s3",title:"搜索功能",done:!0},{id:"s4",title:"自我学习机制",done:!1}],comments:[]},{id:"3",title:"手机端UI优化",description:"优化手机端界面体验，确保滚动流畅、操作便捷、无bug。",status:"review",priority:"medium",assignee:"ux-designer",department:"设计部",createdAt:Date.now()-864e5,dueDate:Date.now()+864e5*3,tags:["UI","手机端"],subtasks:[{id:"s1",title:"底部Tab导航",done:!0},{id:"s2",title:"单栏布局",done:!0},{id:"s3",title:"滚动优化",done:!0},{id:"s4",title:"极客主题细节",done:!1}],comments:[]},{id:"4",title:"GitHub Pages部署自动化",description:"实现一键部署到GitHub Pages，支持历史记录和日志查看。",status:"done",priority:"medium",assignee:"devops",department:"运维部",createdAt:Date.now()-864e5*5,dueDate:Date.now()-864e5,tags:["部署","自动化"],subtasks:[{id:"s1",title:"部署配置界面",done:!0},{id:"s2",title:"一键部署功能",done:!0},{id:"s3",title:"部署日志",done:!0},{id:"s4",title:"历史记录",done:!0}],comments:[]},{id:"5",title:"项目发展路线图",description:"制定公司长期发展规划，分阶段实现目标。",status:"todo",priority:"low",assignee:"expander",department:"战略部",createdAt:Date.now(),dueDate:Date.now()+864e5*30,tags:["规划","战略"],subtasks:[{id:"s1",title:"第一阶段：基础搭建",done:!1},{id:"s2",title:"第二阶段：功能增强",done:!1},{id:"s3",title:"第三阶段：智能化",done:!1},{id:"s4",title:"第四阶段：生态扩展",done:!1},{id:"s5",title:"第五阶段：商业化",done:!1}],comments:[]}],useTaskStore=create(s=>({tasks:initialTasks,selectedTask:null,filterStatus:"all",filterPriority:"all",addTask:e=>s(t=>({tasks:[{...e,id:Date.now().toString(),createdAt:Date.now()},...t.tasks]})),updateTask:(e,t)=>s(n=>({tasks:n.tasks.map(a=>a.id===e?{...a,...t}:a)})),deleteTask:e=>s(t=>({tasks:t.tasks.filter(n=>n.id!==e)})),selectTask:e=>s({selectedTask:e}),setFilterStatus:e=>s({filterStatus:e}),setFilterPriority:e=>s({filterPriority:e}),toggleSubtask:(e,t)=>s(n=>({tasks:n.tasks.map(a=>a.id===e?{...a,subtasks:a.subtasks.map(o=>o.id===t?{...o,done:!o.done}:o)}:a)})),addComment:(e,t,n)=>s(a=>({tasks:a.tasks.map(o=>o.id===e?{...o,comments:[...o.comments,{id:Date.now().toString(),author:t,content:n,time:Date.now()}]}:o)}))})),statusConfig={all:{label:"全部",color:"text-gray-400",bg:"bg-gray-900/40",border:"border-gray-700/50",icon:ListTodo},todo:{label:"待办",color:"text-gray-400",bg:"bg-gray-900/40",border:"border-gray-700/50",icon:Clock},"in-progress":{label:"进行中",color:"text-blue-400",bg:"bg-blue-900/30",border:"border-blue-700/50",icon:Clock},review:{label:"审查中",color:"text-yellow-400",bg:"bg-yellow-900/30",border:"border-yellow-700/50",icon:TriangleAlert},done:{label:"已完成",color:"text-green-400",bg:"bg-green-900/30",border:"border-green-700/50",icon:CircleCheck}},priorityConfig={low:{label:"低",color:"text-gray-500"},medium:{label:"中",color:"text-blue-400"},high:{label:"高",color:"text-orange-400"},urgent:{label:"紧急",color:"text-red-400"}};function TaskCard({task:s,onClick:e}){const t=statusConfig[s.status]||statusConfig.todo,n=priorityConfig[s.priority]||priorityConfig.medium,{agents:a}=useAgentStore(),o=a.find(p=>p.id===s.assignee),i=s.subtasks.filter(p=>p.done).length,c=s.subtasks.length,l=c>0?Math.round(i/c*100):0;return jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"32","trae-inspector-start-column":"4","trae-inspector-end-line":"74","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:e,className:cn("p-3.5 rounded-xl border transition-all active:scale-[0.98] cursor-pointer",t.bg,t.border),children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"39","trae-inspector-start-column":"6","trae-inspector-end-line":"73","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-start gap-3",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"40","trae-inspector-start-column":"8","trae-inspector-end-line":"42","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("p-1.5 rounded-lg flex-shrink-0",t.bg,t.border),children:jsxRuntimeExports.jsx(Flag,{className:cn("w-4 h-4",t.color)})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"43","trae-inspector-start-column":"8","trae-inspector-end-line":"71","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 min-w-0",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"44","trae-inspector-start-column":"10","trae-inspector-end-line":"49","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-start justify-between gap-2 mb-1",children:[jsxRuntimeExports.jsx("h3",{"trae-inspector-start-line":"45","trae-inspector-start-column":"12","trae-inspector-end-line":"45","trae-inspector-end-column":"102","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[13px] font-mono text-gray-100 font-medium truncate",children:s.title}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"46","trae-inspector-start-column":"12","trae-inspector-end-line":"48","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[10px] font-mono flex-shrink-0",n.color),children:n.label})]}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"50","trae-inspector-start-column":"10","trae-inspector-end-line":"50","trae-inspector-end-column":"91","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-500 line-clamp-2 mb-2",children:s.description}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"51","trae-inspector-start-column":"10","trae-inspector-end-line":"62","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"52","trae-inspector-start-column":"12","trae-inspector-end-line":"57","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"53","trae-inspector-start-column":"14","trae-inspector-end-line":"53","trae-inspector-end-column":"82","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500",children:s.department}),o&&jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"55","trae-inspector-start-column":"16","trae-inspector-end-line":"55","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-400",children:["· ",o.name]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"58","trae-inspector-start-column":"12","trae-inspector-end-line":"61","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1",children:[jsxRuntimeExports.jsx(CircleCheck,{className:"w-3 h-3 text-green-500"}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"60","trae-inspector-start-column":"14","trae-inspector-end-line":"60","trae-inspector-end-column":"105","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500 font-mono",children:[i,"/",c]})]})]}),c>0&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"64","trae-inspector-start-column":"12","trae-inspector-end-line":"69","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 h-1 bg-gray-800 rounded-full overflow-hidden",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"65","trae-inspector-start-column":"14","trae-inspector-end-line":"68","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("h-full transition-all",s.status==="done"?"bg-green-500":"bg-blue-500"),style:{width:`${l}%`}})})]}),jsxRuntimeExports.jsx(ChevronRight,{className:"w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5"})]})})}function TaskDetailModal({task:s,onClose:e}){const{toggleSubtask:t,addComment:n}=useTaskStore(),{agents:a}=useAgentStore(),[o,i]=reactExports.useState(""),c=a.find(h=>h.id===s.assignee),l=statusConfig[s.status]||statusConfig.todo,p=priorityConfig[s.priority]||priorityConfig.medium,m=s.subtasks.filter(h=>h.done).length,d=s.subtasks.length>0?Math.round(m/s.subtasks.length*100):0,x=()=>{o.trim()&&(n(s.id,"chairman",o.trim()),i(""))};return jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"95","trae-inspector-start-column":"4","trae-inspector-end-line":"255","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm",onClick:e,children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"96","trae-inspector-start-column":"6","trae-inspector-end-line":"254","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-full max-w-md bg-gray-950 border-t border-green-900/40 rounded-t-2xl max-h-[85vh] flex flex-col",onClick:h=>h.stopPropagation(),children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"101","trae-inspector-start-column":"8","trae-inspector-end-line":"103","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 flex justify-center py-2",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"102","trae-inspector-start-column":"10","trae-inspector-end-line":"102","trae-inspector-end-column":"63","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-10 h-1 bg-gray-700 rounded-full"})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"106","trae-inspector-start-column":"8","trae-inspector-end-line":"122","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 px-4 pb-3 border-b border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"107","trae-inspector-start-column":"10","trae-inspector-end-line":"112","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-start justify-between mb-2",children:[jsxRuntimeExports.jsx("h2",{"trae-inspector-start-line":"108","trae-inspector-start-column":"12","trae-inspector-end-line":"108","trae-inspector-end-column":"102","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono text-green-400 font-bold flex-1 pr-2",children:s.title}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"109","trae-inspector-start-column":"12","trae-inspector-end-line":"111","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:e,className:"p-1 rounded-lg hover:bg-gray-800",children:jsxRuntimeExports.jsx(X,{className:"w-5 h-5 text-gray-500"})})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"113","trae-inspector-start-column":"10","trae-inspector-end-line":"121","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-3 flex-wrap",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"114","trae-inspector-start-column":"12","trae-inspector-end-line":"116","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("px-2 py-0.5 rounded-md text-[10px] font-mono",l.bg,l.border,l.color),children:l.label}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"117","trae-inspector-start-column":"12","trae-inspector-end-line":"120","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[10px] font-mono flex items-center gap-1",p.color),children:[jsxRuntimeExports.jsx(Flag,{className:"w-3 h-3"}),p.label,"优先级"]})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"125","trae-inspector-start-column":"8","trae-inspector-end-line":"253","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto p-4 space-y-4",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"127","trae-inspector-start-column":"10","trae-inspector-end-line":"130","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("h4",{"trae-inspector-start-line":"128","trae-inspector-start-column":"12","trae-inspector-end-line":"128","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BB%BB%E5%8A%A1%E6%8F%8F%E8%BF%B0%22%2C%22textStartLine%22%3A%22128%22%2C%22textStartColumn%22%3A%2271%22%2C%22textEndLine%22%3A%22128%22%2C%22textEndColumn%22%3A%2275%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-500 mb-1.5",children:"任务描述"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"129","trae-inspector-start-column":"12","trae-inspector-end-line":"129","trae-inspector-end-column":"91","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[12px] text-gray-300 leading-relaxed",children:s.description})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"133","trae-inspector-start-column":"10","trae-inspector-end-line":"142","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-2 gap-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"134","trae-inspector-start-column":"12","trae-inspector-end-line":"137","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"135","trae-inspector-start-column":"14","trae-inspector-end-line":"135","trae-inspector-end-column":"72","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%B4%9F%E8%B4%A3%E9%83%A8%E9%97%A8%22%2C%22textStartLine%22%3A%22135%22%2C%22textStartColumn%22%3A%2262%22%2C%22textEndLine%22%3A%22135%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500 mb-1",children:"负责部门"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"136","trae-inspector-start-column":"14","trae-inspector-end-line":"136","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[12px] text-gray-300",children:s.department})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"138","trae-inspector-start-column":"12","trae-inspector-end-line":"141","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"139","trae-inspector-start-column":"14","trae-inspector-end-line":"139","trae-inspector-end-column":"71","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%B4%9F%E8%B4%A3%E4%BA%BA%22%2C%22textStartLine%22%3A%22139%22%2C%22textStartColumn%22%3A%2262%22%2C%22textEndLine%22%3A%22139%22%2C%22textEndColumn%22%3A%2265%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500 mb-1",children:"负责人"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"140","trae-inspector-start-column":"14","trae-inspector-end-line":"140","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[12px] text-gray-300",children:(c==null?void 0:c.name)||"未分配"})]})]}),s.subtasks.length>0&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"146","trae-inspector-start-column":"12","trae-inspector-end-line":"182","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"147","trae-inspector-start-column":"14","trae-inspector-end-line":"150","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsx("h4",{"trae-inspector-start-line":"148","trae-inspector-start-column":"16","trae-inspector-end-line":"148","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%AD%90%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22148%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22148%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-500",children:"子任务"}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"149","trae-inspector-start-column":"16","trae-inspector-end-line":"149","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-500 font-mono",children:[d,"%"]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"151","trae-inspector-start-column":"14","trae-inspector-end-line":"156","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"152","trae-inspector-start-column":"16","trae-inspector-end-line":"155","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("h-full transition-all",s.status==="done"?"bg-green-500":"bg-blue-500"),style:{width:`${d}%`}})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"157","trae-inspector-start-column":"14","trae-inspector-end-line":"181","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-1.5",children:s.subtasks.map(h=>jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"159","trae-inspector-start-column":"18","trae-inspector-end-line":"179","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>t(s.id,h.id),className:cn("w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all",h.done?"bg-green-900/20 border border-green-800/30":"bg-gray-900/50 border border-gray-800"),children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"167","trae-inspector-start-column":"20","trae-inspector-end-line":"172","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",h.done?"bg-green-500 border-green-500":"border-gray-600"),children:h.done&&jsxRuntimeExports.jsx(CircleCheck,{className:"w-3 h-3 text-white"})}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"173","trae-inspector-start-column":"20","trae-inspector-end-line":"178","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[12px] flex-1",h.done?"text-gray-500 line-through":"text-gray-300"),children:h.title})]},h.id))})]}),s.tags.length>0&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"187","trae-inspector-start-column":"12","trae-inspector-end-line":"199","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("h4",{"trae-inspector-start-line":"188","trae-inspector-start-column":"14","trae-inspector-end-line":"188","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%A0%87%E7%AD%BE%22%2C%22textStartLine%22%3A%22188%22%2C%22textStartColumn%22%3A%2271%22%2C%22textEndLine%22%3A%22188%22%2C%22textEndColumn%22%3A%2273%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-500 mb-2",children:"标签"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"189","trae-inspector-start-column":"14","trae-inspector-end-line":"198","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1.5",children:s.tags.map(h=>jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"191","trae-inspector-start-column":"18","trae-inspector-end-line":"196","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-2 py-0.5 rounded-md bg-gray-800/60 border border-gray-700/50 text-[10px] text-gray-400 font-mono",children:["#",h]},h))})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"203","trae-inspector-start-column":"10","trae-inspector-end-line":"252","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsxs("h4",{"trae-inspector-start-line":"204","trae-inspector-start-column":"12","trae-inspector-end-line":"207","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-gray-500 mb-2 flex items-center gap-1.5",children:[jsxRuntimeExports.jsx(MessageSquare,{className:"w-3.5 h-3.5"}),"评论 (",s.comments.length,")"]}),s.comments.length>0?jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"209","trae-inspector-start-column":"14","trae-inspector-end-line":"226","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-2 mb-3",children:s.comments.map(h=>{const F=a.find(u=>u.id===h.author);return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"213","trae-inspector-start-column":"20","trae-inspector-end-line":"223","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-2.5 rounded-xl bg-gray-900/50 border border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"214","trae-inspector-start-column":"22","trae-inspector-end-line":"221","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-1",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"215","trae-inspector-start-column":"24","trae-inspector-end-line":"217","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] font-mono text-green-400",children:(F==null?void 0:F.name)||h.author}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"218","trae-inspector-start-column":"24","trae-inspector-end-line":"220","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] text-gray-600 font-mono",children:new Date(h.time).toLocaleString("zh-CN")})]}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"222","trae-inspector-start-column":"22","trae-inspector-end-line":"222","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-300",children:h.content})]},h.id)})}):jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"228","trae-inspector-start-column":"14","trae-inspector-end-line":"228","trae-inspector-end-column":"68","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9A%82%E6%97%A0%E8%AF%84%E8%AE%BA%22%2C%22textStartLine%22%3A%22228%22%2C%22textStartColumn%22%3A%2260%22%2C%22textEndLine%22%3A%22228%22%2C%22textEndColumn%22%3A%2264%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-600 mb-3",children:"暂无评论"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"230","trae-inspector-start-column":"12","trae-inspector-end-line":"251","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2",children:[jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"231","trae-inspector-start-column":"14","trae-inspector-end-line":"238","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"text",value:o,onChange:h=>i(h.target.value),onKeyDown:h=>h.key==="Enter"&&x(),placeholder:"添加评论...",className:"flex-1 px-3 py-2 rounded-xl bg-gray-900/80 border border-gray-800 text-[12px] text-gray-200 placeholder-gray-600 outline-none focus:border-green-700/50 transition-colors"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"239","trae-inspector-start-column":"14","trae-inspector-end-line":"250","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%8F%91%E9%80%81%22%2C%22textStartLine%22%3A%22248%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22250%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:x,disabled:!o.trim(),className:cn("px-3 py-2 rounded-xl text-[11px] font-mono transition-all",o.trim()?"bg-green-600 text-white hover:bg-green-500":"bg-gray-800 text-gray-600"),children:"发送"})]})]})]})]})})}function Tasks(){const{tasks:s,selectedTask:e,selectTask:t,filterStatus:n,setFilterStatus:a}=useTaskStore(),[o,i]=reactExports.useState(!1),c=s.filter(m=>!(n!=="all"&&m.status!==n)),l=s.find(m=>m.id===e),p=["all","todo","in-progress","review","done"];return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"273","trae-inspector-start-column":"4","trae-inspector-end-line":"348","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"min-h-full flex flex-col pb-20",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"275","trae-inspector-start-column":"6","trae-inspector-end-line":"323","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"sticky top-0 z-20 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 pt-3 pb-1",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"276","trae-inspector-start-column":"8","trae-inspector-end-line":"294","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"277","trae-inspector-start-column":"10","trae-inspector-end-line":"287","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"278","trae-inspector-start-column":"12","trae-inspector-end-line":"280","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-8 h-8 rounded-lg bg-orange-900/30 border border-orange-700/50 flex items-center justify-center",children:jsxRuntimeExports.jsx(ListTodo,{className:"w-4.5 h-4.5 text-orange-400"})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"281","trae-inspector-start-column":"12","trae-inspector-end-line":"286","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"282","trae-inspector-start-column":"14","trae-inspector-end-line":"284","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BB%BB%E5%8A%A1%E4%B8%AD%E5%BF%83%22%2C%22textStartLine%22%3A%22282%22%2C%22textStartColumn%22%3A%22129%22%2C%22textEndLine%22%3A%22284%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono font-bold text-orange-400",style:{textShadow:"0 0 8px rgba(251,146,60,0.5)"},children:"任务中心"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"285","trae-inspector-start-column":"14","trae-inspector-end-line":"285","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%20%C2%B7%20%E8%BF%9B%E5%BA%A6%E8%BF%BD%E8%B8%AA%22%2C%22textStartLine%22%3A%22285%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22285%22%2C%22textEndColumn%22%3A%2283%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-500 -mt-0.5",children:"项目管理 · 进度追踪"})]})]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"288","trae-inspector-start-column":"10","trae-inspector-end-line":"293","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>i(!0),className:"p-2 rounded-lg bg-orange-900/30 border border-orange-700/50 hover:bg-orange-900/50 transition-all",children:jsxRuntimeExports.jsx(Plus,{className:"w-4 h-4 text-orange-400"})})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"297","trae-inspector-start-column":"8","trae-inspector-end-line":"322","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1",children:p.map(m=>{const d=statusConfig[m],x=m==="all"?s.length:s.filter(h=>h.status===m).length;return jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"302","trae-inspector-start-column":"14","trae-inspector-end-line":"319","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>a(m),className:cn("flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5",n===m?cn(d.bg,d.border,d.color,"border"):"text-gray-500 hover:text-gray-300"),children:[d.label,jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"313","trae-inspector-start-column":"16","trae-inspector-end-line":"318","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("px-1.5 py-0.5 rounded text-[9px]",n===m?"bg-black/20":"bg-gray-800/60"),children:x})]},m)})})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"326","trae-inspector-start-column":"6","trae-inspector-end-line":"342","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 p-3 space-y-2.5 max-w-md mx-auto w-full",children:c.length===0?jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"328","trae-inspector-start-column":"10","trae-inspector-end-line":"332","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col items-center justify-center py-20 text-center",children:[jsxRuntimeExports.jsx(ListTodo,{className:"w-12 h-12 text-gray-700 mb-3"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"330","trae-inspector-start-column":"12","trae-inspector-end-line":"330","trae-inspector-end-column":"61","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9A%82%E6%97%A0%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22330%22%2C%22textStartColumn%22%3A%2253%22%2C%22textEndLine%22%3A%22330%22%2C%22textEndColumn%22%3A%2257%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[13px] text-gray-500",children:"暂无任务"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"331","trae-inspector-start-column":"12","trae-inspector-end-line":"331","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Tasks.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%82%B9%E5%87%BB%E5%8F%B3%E4%B8%8A%E8%A7%92%20%2B%20%E5%88%9B%E5%BB%BA%E6%96%B0%E4%BB%BB%E5%8A%A1%22%2C%22textStartLine%22%3A%22331%22%2C%22textStartColumn%22%3A%2258%22%2C%22textEndLine%22%3A%22331%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-600 mt-1",children:"点击右上角 + 创建新任务"})]}):c.map(m=>jsxRuntimeExports.jsx(TaskCard,{task:m,onClick:()=>t(m.id)},m.id))}),l&&jsxRuntimeExports.jsx(TaskDetailModal,{task:l,onClose:()=>t(null)})]})}const themeConfigs=[{id:"cyber",name:"赛博朋克",icon:Zap,color:"text-green-400 border-green-500/50 bg-green-500/10",glow:"shadow-[0_0_20px_rgba(34,197,94,0.4)]"},{id:"matrix",name:"矩阵雨",icon:Moon,color:"text-cyan-400 border-cyan-500/50 bg-cyan-500/10",glow:"shadow-[0_0_20px_rgba(34,211,238,0.4)]"},{id:"retro",name:"复古像素",icon:Sun,color:"text-yellow-400 border-yellow-500/50 bg-yellow-500/10",glow:"shadow-[0_0_20px_rgba(234,179,8,0.4)]"}],agentConfigs=[{id:"analyst",name:"分析员",role:"ANALYST",defaultSpeed:50,defaultDetail:70},{id:"coder1",name:"代码员1",role:"CODER-01",defaultSpeed:60,defaultDetail:80},{id:"coder2",name:"代码员2",role:"CODER-02",defaultSpeed:55,defaultDetail:75},{id:"inspector",name:"检查员",role:"INSPECTOR",defaultSpeed:40,defaultDetail:90},{id:"deployer",name:"部署员",role:"DEPLOYER",defaultSpeed:70,defaultDetail:60}];function SettingSection({icon:s,title:e,description:t,children:n}){return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"74","trae-inspector-start-column":"4","trae-inspector-end-line":"92","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"bg-gray-950/80 border border-green-900/30 rounded-lg backdrop-blur-sm overflow-hidden",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"75","trae-inspector-start-column":"6","trae-inspector-end-line":"88","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-4 border-b border-green-900/30 flex items-center gap-3",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"76","trae-inspector-start-column":"8","trae-inspector-end-line":"78","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-2 bg-green-900/30 rounded-lg border border-green-700/50",children:jsxRuntimeExports.jsx(s,{className:"w-5 h-5 text-green-400",style:{filter:"drop-shadow(0 0 6px rgba(34, 197, 94, 0.5))"}})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"79","trae-inspector-start-column":"8","trae-inspector-end-line":"87","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("h2",{"trae-inspector-start-line":"80","trae-inspector-start-column":"10","trae-inspector-end-line":"85","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-green-400 font-mono text-sm tracking-widest",style:{textShadow:"0 0 10px rgba(34, 197, 94, 0.5)"},children:e}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"86","trae-inspector-start-column":"10","trae-inspector-end-line":"86","trae-inspector-end-column":"74","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs text-gray-500 font-mono",children:t})]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"89","trae-inspector-start-column":"6","trae-inspector-end-line":"91","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-4",children:n})]})}function ToggleSwitch({enabled:s,onChange:e,label:t,description:n}){return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"105","trae-inspector-start-column":"4","trae-inspector-end-line":"132","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between py-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"106","trae-inspector-start-column":"6","trae-inspector-end-line":"111","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"107","trae-inspector-start-column":"8","trae-inspector-end-line":"107","trae-inspector-end-column":"66","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300",children:t}),n&&jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"109","trae-inspector-start-column":"10","trae-inspector-end-line":"109","trae-inspector-end-column":"81","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-500 mt-0.5",children:n})]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"112","trae-inspector-start-column":"6","trae-inspector-end-line":"131","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>e(!s),className:cn("relative w-14 h-7 rounded-full transition-all duration-300","border",s?"bg-green-500/20 border-green-500/70":"bg-gray-800/50 border-gray-700/50"),style:s?{boxShadow:"0 0 15px rgba(34, 197, 94, 0.3)"}:void 0,children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"123","trae-inspector-start-column":"8","trae-inspector-end-line":"130","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("absolute top-1 w-5 h-5 rounded-full transition-all duration-300",s?"left-8 bg-green-400":"left-1 bg-gray-600"),style:s?{boxShadow:"0 0 10px rgba(34, 197, 94, 0.8)"}:void 0})})]})}function Slider({value:s,onChange:e,label:t,min:n=0,max:a=100,step:o=1,unit:i="%",ticks:c}){return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"149","trae-inspector-start-column":"4","trae-inspector-end-line":"177","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"py-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"150","trae-inspector-start-column":"6","trae-inspector-end-line":"155","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"151","trae-inspector-start-column":"8","trae-inspector-end-line":"151","trae-inspector-end-column":"66","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300",children:t}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"152","trae-inspector-start-column":"8","trae-inspector-end-line":"154","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-green-400",style:{textShadow:"0 0 5px rgba(34, 197, 94, 0.5)"},children:[s,i]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"156","trae-inspector-start-column":"6","trae-inspector-end-line":"176","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"relative",children:[jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"157","trae-inspector-start-column":"8","trae-inspector-end-line":"165","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"range",min:n,max:a,step:o,value:s,onChange:l=>e(Number(l.target.value)),className:"w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer slider-green"}),c&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"167","trae-inspector-start-column":"10","trae-inspector-end-line":"174","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex justify-between px-1 mt-1",children:c.map(l=>jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"169","trae-inspector-start-column":"14","trae-inspector-end-line":"172","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-col items-center",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"170","trae-inspector-start-column":"16","trae-inspector-end-line":"170","trae-inspector-end-column":"58","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-px h-1.5 bg-gray-700"}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"171","trae-inspector-start-column":"16","trae-inspector-end-line":"171","trae-inspector-end-column":"95","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-600 mt-0.5",children:[l,i]})]},l))})]})]})}function ThemeSettings(){const{theme:s,setTheme:e}=useThemeStore();return jsxRuntimeExports.jsx(SettingSection,{icon:Palette,title:"主题设置",description:"选择你喜欢的界面主题风格",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"186","trae-inspector-start-column":"6","trae-inspector-end-line":"209","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-3 gap-3",children:themeConfigs.map(t=>{const n=t.icon,a=s===t.id;return jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"191","trae-inspector-start-column":"12","trae-inspector-end-line":"206","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>e(t.id),className:cn("relative p-4 rounded-lg border transition-all duration-300 flex flex-col items-center gap-2",a?t.color+" "+t.glow:"bg-gray-900/60 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-400"),children:[jsxRuntimeExports.jsx(n,{className:"w-6 h-6"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"202","trae-inspector-start-column":"14","trae-inspector-end-line":"202","trae-inspector-end-column":"70","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono",children:t.name}),a&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"204","trae-inspector-start-column":"16","trae-inspector-end-line":"204","trae-inspector-end-column":"119","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_#22c55e]"})]},t.id)})})})}function AppearanceSettings(){const{fontSize:s,setFontSize:e,animationsEnabled:t,toggleAnimations:n}=useThemeStore();return jsxRuntimeExports.jsxs(SettingSection,{icon:Type,title:"外观设置",description:"调整字体大小和动画效果",children:[jsxRuntimeExports.jsx(Slider,{value:s,onChange:e,label:"字体大小",min:12,max:20,step:1,unit:"px",ticks:[12,14,16,18,20]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"230","trae-inspector-start-column":"6","trae-inspector-end-line":"230","trae-inspector-end-column":"47","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-px bg-gray-800 my-2"}),jsxRuntimeExports.jsx(ToggleSwitch,{enabled:t,onChange:n,label:"动画效果",description:"启用/禁用界面动画和过渡效果"})]})}function AgentSettings(){const[s,e]=reactExports.useState(Object.fromEntries(agentConfigs.map(i=>[i.id,i.defaultSpeed]))),[t,n]=reactExports.useState(Object.fromEntries(agentConfigs.map(i=>[i.id,i.defaultDetail]))),[a,o]=reactExports.useState(null);return jsxRuntimeExports.jsx(SettingSection,{icon:Bot,title:"Agent 配置",description:"调整各 Agent 的行为参数",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"253","trae-inspector-start-column":"6","trae-inspector-end-line":"304","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-2",children:agentConfigs.map(i=>{const c=a===i.id;return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"257","trae-inspector-start-column":"12","trae-inspector-end-line":"301","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("rounded-lg border transition-all duration-300 overflow-hidden",c?"border-green-700/50 bg-green-900/10":"border-gray-800 bg-gray-900/40 hover:border-gray-700"),children:[jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"266","trae-inspector-start-column":"14","trae-inspector-end-line":"283","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>o(c?null:i.id),className:"w-full p-3 flex items-center justify-between",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"270","trae-inspector-start-column":"16","trae-inspector-end-line":"278","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-3",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"271","trae-inspector-start-column":"18","trae-inspector-end-line":"273","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-1.5 bg-gray-800 rounded border border-gray-700",children:jsxRuntimeExports.jsx(Bot,{className:"w-4 h-4 text-green-400"})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"274","trae-inspector-start-column":"18","trae-inspector-end-line":"277","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-left",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"275","trae-inspector-start-column":"20","trae-inspector-end-line":"275","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300",children:i.name}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"276","trae-inspector-start-column":"20","trae-inspector-end-line":"276","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-600",children:i.role})]})]}),jsxRuntimeExports.jsx(ChevronRight,{className:cn("w-4 h-4 text-gray-500 transition-transform duration-300",c&&"rotate-90 text-green-400")})]}),c&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"286","trae-inspector-start-column":"16","trae-inspector-end-line":"299","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-3 pb-3 border-t border-green-900/20",children:[jsxRuntimeExports.jsx(Slider,{value:s[i.id],onChange:l=>e(p=>({...p,[i.id]:l})),label:"响应速度",ticks:[0,25,50,75,100]}),jsxRuntimeExports.jsx(Slider,{value:t[i.id],onChange:l=>n(p=>({...p,[i.id]:l})),label:"详细程度",ticks:[0,25,50,75,100]})]})]},i.id)})})})}function LearningSettings(){const{selfLearning:s,autoKnowledge:e,workflowSpeed:t,toggleSelfLearning:n,toggleAutoKnowledge:a,setWorkflowSpeed:o}=useThemeStore();return jsxRuntimeExports.jsx(SettingSection,{icon:Sparkles,title:"自我学习",description:"知识沉淀与自动学习配置",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"314","trae-inspector-start-column":"6","trae-inspector-end-line":"350","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-1",children:[jsxRuntimeExports.jsx(ToggleSwitch,{enabled:s,onChange:n,label:"自我学习",description:"任务完成后自动总结经验并学习"}),jsxRuntimeExports.jsx(ToggleSwitch,{enabled:e,onChange:a,label:"自动知识沉淀",description:"自动将任务经验存入知识库"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"327","trae-inspector-start-column":"8","trae-inspector-end-line":"349","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"py-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"328","trae-inspector-start-column":"10","trae-inspector-end-line":"334","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"329","trae-inspector-start-column":"12","trae-inspector-end-line":"332","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"330","trae-inspector-start-column":"14","trae-inspector-end-line":"330","trae-inspector-end-column":"70","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%B7%A5%E4%BD%9C%E6%B5%81%E9%80%9F%E5%BA%A6%22%2C%22textStartLine%22%3A%22330%22%2C%22textStartColumn%22%3A%2261%22%2C%22textEndLine%22%3A%22330%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300",children:"工作流速度"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"331","trae-inspector-start-column":"14","trae-inspector-end-line":"331","trae-inspector-end-column":"85","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%B0%83%E6%95%B4Agent%E5%8D%8F%E4%BD%9C%E6%89%A7%E8%A1%8C%E9%80%9F%E5%BA%A6%22%2C%22textStartLine%22%3A%22331%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22331%22%2C%22textEndColumn%22%3A%2281%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-500 mt-0.5",children:"调整Agent协作执行速度"})]}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"333","trae-inspector-start-column":"12","trae-inspector-end-line":"333","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-green-400",children:[t,"x"]})]}),jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"335","trae-inspector-start-column":"10","trae-inspector-end-line":"343","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"range",min:"0.5",max:"5",step:"0.5",value:t,onChange:i=>o(parseFloat(i.target.value)),className:"w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"344","trae-inspector-start-column":"10","trae-inspector-end-line":"348","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex justify-between text-[10px] font-mono text-gray-600 mt-1",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"345","trae-inspector-start-column":"12","trae-inspector-end-line":"345","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%220.5x%22%2C%22textStartLine%22%3A%22345%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22345%22%2C%22textEndColumn%22%3A%2222%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"0.5x"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"346","trae-inspector-start-column":"12","trae-inspector-end-line":"346","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AD%A3%E5%B8%B8%22%2C%22textStartLine%22%3A%22346%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22346%22%2C%22textEndColumn%22%3A%2220%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"正常"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"347","trae-inspector-start-column":"12","trae-inspector-end-line":"347","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%225x%22%2C%22textStartLine%22%3A%22347%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22347%22%2C%22textEndColumn%22%3A%2220%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"5x"})]})]})]})})}function LLMSettings(){const[s,e]=reactExports.useState(""),[t,n]=reactExports.useState("moonshot-v1-8k"),[a,o]=reactExports.useState(.7),[i,c]=reactExports.useState(2e3),[l,p]=reactExports.useState(!1),[m,d]=reactExports.useState(!1),[x,h]=reactExports.useState("idle"),[F,u]=reactExports.useState(!1),[f,k]=reactExports.useState(!1);reactExports.useEffect(()=>{try{const R=localStorage.getItem("hopeai-llm-config");if(R){const w=JSON.parse(R);e(w.apiKey||""),n(w.model||"moonshot-v1-8k"),o(w.temperature??.7),c(w.maxTokens||2e3),u(!0)}localStorage.getItem("hopeai-use-llm")==="true"&&k(!0)}catch{}},[]);const y=()=>{if(!s.trim()){alert("请输入API Key");return}saveLLMConfig({apiKey:s.trim(),model:t,temperature:a,maxTokens:i}),u(!0),h("idle")},g=()=>{confirm("确定要清除API配置吗？")&&(clearLLMConfig(),e(""),n("moonshot-v1-8k"),o(.7),c(2e3),u(!1),h("idle"))},b=async()=>{if(!s.trim()){alert("请先输入API Key");return}d(!0),h("idle");try{const R=await callKimi("analyst","用一句话介绍你自己");R&&R.length>0?h("success"):h("fail")}catch{h("fail")}finally{d(!1)}},C=R=>{k(R),localStorage.setItem("hopeai-use-llm",R?"true":"false")};return jsxRuntimeExports.jsx(SettingSection,{icon:Brain,title:"大模型配置",description:"Kimi AI 大模型接口设置",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"434","trae-inspector-start-column":"6","trae-inspector-end-line":"553","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-3",children:[jsxRuntimeExports.jsx(ToggleSwitch,{enabled:f,onChange:C,label:"启用AI大模型",description:"使用Kimi大模型生成Agent回答（需配置API Key）"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"442","trae-inspector-start-column":"8","trae-inspector-end-line":"552","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"pt-2 border-t border-gray-800/50",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"443","trae-inspector-start-column":"10","trae-inspector-end-line":"460","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mb-2",children:[jsxRuntimeExports.jsx("label",{"trae-inspector-start-line":"444","trae-inspector-start-column":"12","trae-inspector-end-line":"444","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22API%20Key%22%2C%22textStartLine%22%3A%22444%22%2C%22textStartColumn%22%3A%2263%22%2C%22textEndLine%22%3A%22444%22%2C%22textEndColumn%22%3A%2270%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-400",children:"API Key"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"445","trae-inspector-start-column":"12","trae-inspector-end-line":"459","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"relative mt-1",children:[jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"446","trae-inspector-start-column":"14","trae-inspector-end-line":"452","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:l?"text":"password",value:s,onChange:R=>{e(R.target.value),u(!1),h("idle")},placeholder:"sk-xxxxxxxxxxxxxxxxxxxx",className:"w-full px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 pr-10"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"453","trae-inspector-start-column":"14","trae-inspector-end-line":"458","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>p(!l),className:"absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300",children:l?jsxRuntimeExports.jsx(EyeOff,{className:"w-4 h-4"}):jsxRuntimeExports.jsx(Eye,{className:"w-4 h-4"})})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"462","trae-inspector-start-column":"10","trae-inspector-end-line":"473","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mb-2",children:[jsxRuntimeExports.jsx("label",{"trae-inspector-start-line":"463","trae-inspector-start-column":"12","trae-inspector-end-line":"463","trae-inspector-end-column":"73","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%A8%A1%E5%9E%8B%22%2C%22textStartLine%22%3A%22463%22%2C%22textStartColumn%22%3A%2263%22%2C%22textEndLine%22%3A%22463%22%2C%22textEndColumn%22%3A%2265%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-400",children:"模型"}),jsxRuntimeExports.jsxs("select",{"trae-inspector-start-line":"464","trae-inspector-start-column":"12","trae-inspector-end-line":"472","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:t,onChange:R=>{n(R.target.value),u(!1)},className:"w-full mt-1 px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500",children:[jsxRuntimeExports.jsx("option",{"trae-inspector-start-line":"469","trae-inspector-start-column":"14","trae-inspector-end-line":"469","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22moonshot-v1-8k%EF%BC%888K%E4%B8%8A%E4%B8%8B%E6%96%87%EF%BC%89%22%2C%22textStartLine%22%3A%22469%22%2C%22textStartColumn%22%3A%2245%22%2C%22textEndLine%22%3A%22469%22%2C%22textEndColumn%22%3A%2266%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:"moonshot-v1-8k",children:"moonshot-v1-8k（8K上下文）"}),jsxRuntimeExports.jsx("option",{"trae-inspector-start-line":"470","trae-inspector-start-column":"14","trae-inspector-end-line":"470","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22moonshot-v1-32k%EF%BC%8832K%E4%B8%8A%E4%B8%8B%E6%96%87%EF%BC%89%22%2C%22textStartLine%22%3A%22470%22%2C%22textStartColumn%22%3A%2246%22%2C%22textEndLine%22%3A%22470%22%2C%22textEndColumn%22%3A%2269%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:"moonshot-v1-32k",children:"moonshot-v1-32k（32K上下文）"}),jsxRuntimeExports.jsx("option",{"trae-inspector-start-line":"471","trae-inspector-start-column":"14","trae-inspector-end-line":"471","trae-inspector-end-column":"81","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22moonshot-v1-128k%EF%BC%88128K%E4%B8%8A%E4%B8%8B%E6%96%87%EF%BC%89%22%2C%22textStartLine%22%3A%22471%22%2C%22textStartColumn%22%3A%2247%22%2C%22textEndLine%22%3A%22471%22%2C%22textEndColumn%22%3A%2272%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:"moonshot-v1-128k",children:"moonshot-v1-128k（128K上下文）"})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"475","trae-inspector-start-column":"10","trae-inspector-end-line":"489","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mb-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"476","trae-inspector-start-column":"12","trae-inspector-end-line":"479","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsx("label",{"trae-inspector-start-line":"477","trae-inspector-start-column":"14","trae-inspector-end-line":"477","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22Temperature%22%2C%22textStartLine%22%3A%22477%22%2C%22textStartColumn%22%3A%2265%22%2C%22textEndLine%22%3A%22477%22%2C%22textEndColumn%22%3A%2276%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-400",children:"Temperature"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"478","trae-inspector-start-column":"14","trae-inspector-end-line":"478","trae-inspector-end-column":"85","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-green-400",children:a})]}),jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"480","trae-inspector-start-column":"12","trae-inspector-end-line":"488","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"range",min:"0",max:"1",step:"0.1",value:a,onChange:R=>{o(parseFloat(R.target.value)),u(!1)},className:"w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500 mt-1"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"491","trae-inspector-start-column":"10","trae-inspector-end-line":"505","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mb-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"492","trae-inspector-start-column":"12","trae-inspector-end-line":"495","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsx("label",{"trae-inspector-start-line":"493","trae-inspector-start-column":"14","trae-inspector-end-line":"493","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22Max%20Tokens%22%2C%22textStartLine%22%3A%22493%22%2C%22textStartColumn%22%3A%2265%22%2C%22textEndLine%22%3A%22493%22%2C%22textEndColumn%22%3A%2275%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-400",children:"Max Tokens"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"494","trae-inspector-start-column":"14","trae-inspector-end-line":"494","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-green-400",children:i})]}),jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"496","trae-inspector-start-column":"12","trae-inspector-end-line":"504","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"range",min:"500",max:"8000",step:"500",value:i,onChange:R=>{c(parseInt(R.target.value)),u(!1)},className:"w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500 mt-1"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"507","trae-inspector-start-column":"10","trae-inspector-end-line":"533","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2",children:[jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"508","trae-inspector-start-column":"12","trae-inspector-end-line":"514","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:y,className:"flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5",children:[jsxRuntimeExports.jsx(Key,{className:"w-3.5 h-3.5"}),"保存配置"]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"515","trae-inspector-start-column":"12","trae-inspector-end-line":"526","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:b,disabled:m,className:"flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5",children:m?"测试中...":jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Zap,{className:"w-3.5 h-3.5"}),"测试连接"]})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"527","trae-inspector-start-column":"12","trae-inspector-end-line":"532","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:g,className:"px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-300 text-xs font-mono rounded-lg transition-colors",children:jsxRuntimeExports.jsx(Trash2,{className:"w-3.5 h-3.5"})})]}),x==="success"&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"536","trae-inspector-start-column":"12","trae-inspector-end-line":"539","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 px-3 py-2 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-2",children:[jsxRuntimeExports.jsx(Check,{className:"w-4 h-4 text-green-400 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"538","trae-inspector-start-column":"14","trae-inspector-end-line":"538","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22API%E8%BF%9E%E6%8E%A5%E6%88%90%E5%8A%9F%EF%BC%81%22%2C%22textStartLine%22%3A%22538%22%2C%22textStartColumn%22%3A%2265%22%2C%22textEndLine%22%3A%22538%22%2C%22textEndColumn%22%3A%2273%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-green-300",children:"API连接成功！"})]}),x==="fail"&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"542","trae-inspector-start-column":"12","trae-inspector-end-line":"545","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 px-3 py-2 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-2",children:[jsxRuntimeExports.jsx(X,{className:"w-4 h-4 text-red-400 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"544","trae-inspector-start-column":"14","trae-inspector-end-line":"544","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22API%E8%BF%9E%E6%8E%A5%E5%A4%B1%E8%B4%A5%EF%BC%8C%E8%AF%B7%E6%A3%80%E6%9F%A5Key%E6%98%AF%E5%90%A6%E6%AD%A3%E7%A1%AE%22%2C%22textStartLine%22%3A%22544%22%2C%22textStartColumn%22%3A%2263%22%2C%22textEndLine%22%3A%22544%22%2C%22textEndColumn%22%3A%2281%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-red-300",children:"API连接失败，请检查Key是否正确"})]}),F&&x==="idle"&&jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"548","trae-inspector-start-column":"12","trae-inspector-end-line":"550","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E9%85%8D%E7%BD%AE%E5%B7%B2%E4%BF%9D%E5%AD%98%E5%9C%A8%E6%9C%AC%E5%9C%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%22%2C%22textStartLine%22%3A%22548%22%2C%22textStartColumn%22%3A%2280%22%2C%22textEndLine%22%3A%22550%22%2C%22textEndColumn%22%3A%2212%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-2 text-[10px] font-mono text-gray-500 text-center",children:"配置已保存在本地浏览器中"})]})]})})}function HopeAISyncSettings(){const[s,e]=reactExports.useState(()=>getSyncConfig()),[t,n]=reactExports.useState(!1),[a,o]=reactExports.useState("idle"),[i,c]=reactExports.useState(""),[l,p]=reactExports.useState(!1),[m,d]=reactExports.useState(null),x=g=>{saveSyncConfig({enabled:g}),e(b=>({...b,enabled:g}))},h=g=>{saveSyncConfig({autoSync:g}),e(b=>({...b,autoSync:g}))},F=()=>{saveSyncConfig({apiUrl:s.apiUrl,apiKey:s.apiKey}),o("idle"),d(null)},u=async()=>{n(!0),o("idle"),c("");try{const g=await testConnection();g.success?(o("success"),c(`连接成功！远端知识库共 ${g.totalKnowledge} 条`)):(o("fail"),c(g.error||"连接失败"))}catch(g){o("fail"),c(g instanceof Error?g.message:"未知错误")}finally{n(!1)}},f=async()=>{p(!0),d(null);try{const{useKnowledgeStore:g}=await __vitePreload(async()=>{const{useKnowledgeStore:R}=await Promise.resolve().then(()=>useKnowledgeStore$1);return{useKnowledgeStore:R}},void 0),b=g.getState(),C=await syncToHopeAI(b.entries);C.success?(d(`✅ 同步成功！新增 ${C.created} 条，更新 ${C.updated} 条，跳过 ${C.skipped} 条`),e(R=>({...R,lastSyncTime:Date.now()}))):d(`❌ 同步失败：${C.error}`)}catch(g){d(`❌ 同步失败：${g instanceof Error?g.message:"未知错误"}`)}finally{p(!1)}},k=()=>{confirm("确定要清除希望AI同步配置吗？")&&(clearSyncConfig(),e(getSyncConfig()),o("idle"),d(null))},y=g=>g?new Date(g).toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):"从未同步";return jsxRuntimeExports.jsx(SettingSection,{icon:Link,title:"希望AI 同步",description:"将知识库同步到希望AI 平台",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"648","trae-inspector-start-column":"6","trae-inspector-end-line":"779","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-3",children:[jsxRuntimeExports.jsx(ToggleSwitch,{enabled:s.enabled,onChange:x,label:"启用同步",description:"将Agent产出的知识同步到希望AI知识库"}),s.enabled&&jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"658","trae-inspector-start-column":"12","trae-inspector-end-line":"658","trae-inspector-end-column":"51","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-px bg-gray-800/50"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"660","trae-inspector-start-column":"12","trae-inspector-end-line":"670","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("label",{"trae-inspector-start-line":"661","trae-inspector-start-column":"14","trae-inspector-end-line":"661","trae-inspector-end-column":"79","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22API%20%E5%9C%B0%E5%9D%80%22%2C%22textStartLine%22%3A%22661%22%2C%22textStartColumn%22%3A%2265%22%2C%22textEndLine%22%3A%22661%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-400",children:"API 地址"}),jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"662","trae-inspector-start-column":"14","trae-inspector-end-line":"668","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"text",value:s.apiUrl,onChange:g=>{e(b=>({...b,apiUrl:g.target.value})),o("idle")},placeholder:"https://hopeai-v20.pages.dev/api",className:"w-full mt-1 px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"669","trae-inspector-start-column":"14","trae-inspector-end-line":"669","trae-inspector-end-column":"90","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%B8%8C%E6%9C%9BAI%20%E5%B9%B3%E5%8F%B0%E7%9A%84%20API%20%E6%A0%B9%E8%B7%AF%E5%BE%84%22%2C%22textStartLine%22%3A%22669%22%2C%22textStartColumn%22%3A%2270%22%2C%22textEndLine%22%3A%22669%22%2C%22textEndColumn%22%3A%2286%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-600 mt-1",children:"希望AI 平台的 API 根路径"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"672","trae-inspector-start-column":"12","trae-inspector-end-line":"681","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("label",{"trae-inspector-start-line":"673","trae-inspector-start-column":"14","trae-inspector-end-line":"673","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22API%20Key%EF%BC%88%E5%8F%AF%E9%80%89%EF%BC%89%22%2C%22textStartLine%22%3A%22673%22%2C%22textStartColumn%22%3A%2265%22%2C%22textEndLine%22%3A%22673%22%2C%22textEndColumn%22%3A%2276%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-400",children:"API Key（可选）"}),jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"674","trae-inspector-start-column":"14","trae-inspector-end-line":"680","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"password",value:s.apiKey,onChange:g=>{e(b=>({...b,apiKey:g.target.value})),o("idle")},placeholder:"如果配置了访问密钥",className:"w-full mt-1 px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"683","trae-inspector-start-column":"12","trae-inspector-end-line":"713","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"684","trae-inspector-start-column":"14","trae-inspector-end-line":"689","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BF%9D%E5%AD%98%E9%85%8D%E7%BD%AE%22%2C%22textStartLine%22%3A%22687%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22689%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:F,className:"flex-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5",children:"保存配置"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"690","trae-inspector-start-column":"14","trae-inspector-end-line":"706","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:u,disabled:t,className:"flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5",children:t?jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(RefreshCw,{className:"w-3.5 h-3.5 animate-spin"}),"测试中"]}):jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Link,{className:"w-3.5 h-3.5"}),"测试连接"]})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"707","trae-inspector-start-column":"14","trae-inspector-end-line":"712","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:k,className:"px-3 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-300 text-xs font-mono rounded-lg transition-colors",children:jsxRuntimeExports.jsx(Unlink,{className:"w-3.5 h-3.5"})})]}),a==="success"&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"716","trae-inspector-start-column":"14","trae-inspector-end-line":"719","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-3 py-2 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-2",children:[jsxRuntimeExports.jsx(Check,{className:"w-4 h-4 text-green-400 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"718","trae-inspector-start-column":"16","trae-inspector-end-line":"718","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-green-300",children:i})]}),a==="fail"&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"722","trae-inspector-start-column":"14","trae-inspector-end-line":"725","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-3 py-2 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-2",children:[jsxRuntimeExports.jsx(X,{className:"w-4 h-4 text-red-400 flex-shrink-0"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"724","trae-inspector-start-column":"16","trae-inspector-end-line":"724","trae-inspector-end-column":"81","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-red-300",children:i})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"728","trae-inspector-start-column":"12","trae-inspector-end-line":"728","trae-inspector-end-column":"51","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-px bg-gray-800/50"}),jsxRuntimeExports.jsx(ToggleSwitch,{enabled:s.autoSync,onChange:h,label:"自动同步",description:"新知识产生后自动同步到希望AI"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"737","trae-inspector-start-column":"12","trae-inspector-end-line":"753","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:f,disabled:l,className:"w-full py-2.5 rounded-lg border border-purple-700/50 bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 transition-all flex items-center justify-center gap-2 text-xs font-mono disabled:opacity-50",children:l?jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(RefreshCw,{className:"w-4 h-4 animate-spin"}),"同步中..."]}):jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(RefreshCw,{className:"w-4 h-4"}),"立即同步全部知识"]})}),m&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"756","trae-inspector-start-column":"14","trae-inspector-end-line":"764","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5",m.startsWith("✅")?"bg-green-900/20 border border-green-700/40 text-green-400":"bg-red-900/20 border border-red-700/40 text-red-400"),children:[m.startsWith("✅")?jsxRuntimeExports.jsx(Check,{className:"w-3.5 h-3.5"}):jsxRuntimeExports.jsx(X,{className:"w-3.5 h-3.5"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"763","trae-inspector-start-column":"16","trae-inspector-end-line":"763","trae-inspector-end-column":"62","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"truncate",children:m})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"767","trae-inspector-start-column":"12","trae-inspector-end-line":"776","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-2 gap-2 pt-1",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"768","trae-inspector-start-column":"14","trae-inspector-end-line":"771","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"bg-gray-900/60 rounded-lg p-2 border border-gray-800",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"769","trae-inspector-start-column":"16","trae-inspector-end-line":"769","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%B8%8A%E6%AC%A1%E5%90%8C%E6%AD%A5%22%2C%22textStartLine%22%3A%22769%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%22769%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:"上次同步"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"770","trae-inspector-start-column":"16","trae-inspector-end-line":"770","trae-inspector-end-column":"107","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-gray-300 mt-0.5",children:y(s.lastSyncTime)})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"772","trae-inspector-start-column":"14","trae-inspector-end-line":"775","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"bg-gray-900/60 rounded-lg p-2 border border-gray-800",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"773","trae-inspector-start-column":"16","trae-inspector-end-line":"773","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%B4%AF%E8%AE%A1%E5%90%8C%E6%AD%A5%22%2C%22textStartLine%22%3A%22773%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%22773%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:"累计同步"}),jsxRuntimeExports.jsxs("p",{"trae-inspector-start-line":"774","trae-inspector-start-column":"16","trae-inspector-end-line":"774","trae-inspector-end-column":"107","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-green-400 mt-0.5",children:[s.syncStats.totalSynced," 条"]})]})]})]})]})})}function DataSettings(){const[s,e]=reactExports.useState(!1),t=()=>{const o={exportedAt:new Date().toISOString(),version:"1.0.0"},i=new Blob([JSON.stringify(o,null,2)],{type:"application/json"}),c=URL.createObjectURL(i),l=document.createElement("a");l.href=c,l.download=`settings-backup-${Date.now()}.json`,l.click(),URL.revokeObjectURL(c)},n=()=>{const o=document.createElement("input");o.type="file",o.accept=".json",o.onchange=i=>{var l;const c=(l=i.target.files)==null?void 0:l[0];if(c){const p=new FileReader;p.onload=m=>{var d;try{JSON.parse((d=m.target)==null?void 0:d.result),alert("导入成功！")}catch{alert("文件格式错误")}},p.readAsText(c)}},o.click()},a=()=>{e(!1),alert("数据已清空")};return jsxRuntimeExports.jsx(SettingSection,{icon:Database,title:"数据管理",description:"导出、导入或清空应用数据",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"830","trae-inspector-start-column":"6","trae-inspector-end-line":"883","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"831","trae-inspector-start-column":"8","trae-inspector-end-line":"846","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-3",children:[jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"832","trae-inspector-start-column":"10","trae-inspector-end-line":"838","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:t,className:"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blue-700/50 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 transition-all duration-200",children:[jsxRuntimeExports.jsx(Download,{className:"w-4 h-4"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"837","trae-inspector-start-column":"12","trae-inspector-end-line":"837","trae-inspector-end-column":"59","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%AF%BC%E5%87%BA%E6%95%B0%E6%8D%AE%22%2C%22textStartLine%22%3A%22837%22%2C%22textStartColumn%22%3A%2248%22%2C%22textEndLine%22%3A%22837%22%2C%22textEndColumn%22%3A%2252%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono",children:"导出数据"})]}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"839","trae-inspector-start-column":"10","trae-inspector-end-line":"845","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:n,className:"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-purple-700/50 bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 transition-all duration-200",children:[jsxRuntimeExports.jsx(Upload,{className:"w-4 h-4"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"844","trae-inspector-start-column":"12","trae-inspector-end-line":"844","trae-inspector-end-column":"59","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%AF%BC%E5%85%A5%E6%95%B0%E6%8D%AE%22%2C%22textStartLine%22%3A%22844%22%2C%22textStartColumn%22%3A%2248%22%2C%22textEndLine%22%3A%22844%22%2C%22textEndColumn%22%3A%2252%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono",children:"导入数据"})]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"848","trae-inspector-start-column":"8","trae-inspector-end-line":"848","trae-inspector-end-column":"44","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-px bg-gray-800"}),s?jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"851","trae-inspector-start-column":"10","trae-inspector-end-line":"873","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-lg border border-red-700/50 bg-red-900/20",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"852","trae-inspector-start-column":"12","trae-inspector-end-line":"858","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-start gap-2 mb-3",children:[jsxRuntimeExports.jsx(TriangleAlert,{className:"w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"854","trae-inspector-start-column":"14","trae-inspector-end-line":"857","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:[jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"855","trae-inspector-start-column":"16","trae-inspector-end-line":"855","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%A1%AE%E8%AE%A4%E6%B8%85%E7%A9%BA%E6%89%80%E6%9C%89%E6%95%B0%E6%8D%AE%EF%BC%9F%22%2C%22textStartLine%22%3A%22855%22%2C%22textStartColumn%22%3A%2262%22%2C%22textEndLine%22%3A%22855%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-red-400",children:"确认清空所有数据？"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"856","trae-inspector-start-column":"16","trae-inspector-end-line":"856","trae-inspector-end-column":"96","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%AD%A4%E6%93%8D%E4%BD%9C%E4%B8%8D%E5%8F%AF%E6%92%A4%E9%94%80%EF%BC%8C%E6%89%80%E6%9C%89%E9%85%8D%E7%BD%AE%E5%92%8C%E6%95%B0%E6%8D%AE%E5%B0%86%E8%A2%AB%E6%B0%B8%E4%B9%85%E5%88%A0%E9%99%A4%E3%80%82%22%2C%22textStartLine%22%3A%22856%22%2C%22textStartColumn%22%3A%2270%22%2C%22textEndLine%22%3A%22856%22%2C%22textEndColumn%22%3A%2292%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-red-300/60 mt-1",children:"此操作不可撤销，所有配置和数据将被永久删除。"})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"859","trae-inspector-start-column":"12","trae-inspector-end-line":"872","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"860","trae-inspector-start-column":"14","trae-inspector-end-line":"865","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%A1%AE%E8%AE%A4%E6%B8%85%E7%A9%BA%22%2C%22textStartLine%22%3A%22863%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22865%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:a,className:"flex-1 py-2 rounded-lg bg-red-500/30 border border-red-500/70 text-red-400 text-xs font-mono hover:bg-red-500/40 transition-colors",children:"确认清空"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"866","trae-inspector-start-column":"14","trae-inspector-end-line":"871","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%8F%96%E6%B6%88%22%2C%22textStartLine%22%3A%22869%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22871%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>e(!1),className:"flex-1 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 text-xs font-mono hover:bg-gray-800 transition-colors",children:"取消"})]})]}):jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"875","trae-inspector-start-column":"10","trae-inspector-end-line":"881","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>e(!0),className:"w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-700/50 bg-red-900/10 text-red-400 hover:bg-red-900/20 transition-all duration-200",children:[jsxRuntimeExports.jsx(Trash2,{className:"w-4 h-4"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"880","trae-inspector-start-column":"12","trae-inspector-end-line":"880","trae-inspector-end-column":"59","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%B8%85%E7%A9%BA%E6%95%B0%E6%8D%AE%22%2C%22textStartLine%22%3A%22880%22%2C%22textStartColumn%22%3A%2248%22%2C%22textEndLine%22%3A%22880%22%2C%22textEndColumn%22%3A%2252%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono",children:"清空数据"})]})]})})}function Settings(){return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"890","trae-inspector-start-column":"4","trae-inspector-end-line":"960","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"891","trae-inspector-start-column":"6","trae-inspector-end-line":"898","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-green-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"892","trae-inspector-start-column":"8","trae-inspector-end-line":"897","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto flex items-center gap-2",children:[jsxRuntimeExports.jsx(Settings$1,{className:"w-5 h-5 text-yellow-400",style:{filter:"drop-shadow(0 0 6px rgba(250,204,21,0.5))"}}),jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"894","trae-inspector-start-column":"10","trae-inspector-end-line":"896","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%88%91%E7%9A%84%E8%AE%BE%E7%BD%AE%22%2C%22textStartLine%22%3A%22894%22%2C%22textStartColumn%22%3A%22127%22%2C%22textEndLine%22%3A%22896%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono font-bold text-yellow-400",style:{textShadow:"0 0 8px rgba(250,204,21,0.5)"},children:"我的设置"})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"900","trae-inspector-start-column":"6","trae-inspector-end-line":"916","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 space-y-3 safe-area-bottom custom-scrollbar",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"901","trae-inspector-start-column":"8","trae-inspector-end-line":"915","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto space-y-3",children:[jsxRuntimeExports.jsx(ThemeSettings,{}),jsxRuntimeExports.jsx(AppearanceSettings,{}),jsxRuntimeExports.jsx(AgentSettings,{}),jsxRuntimeExports.jsx(LearningSettings,{}),jsxRuntimeExports.jsx(HopeAISyncSettings,{}),jsxRuntimeExports.jsx(LLMSettings,{}),jsxRuntimeExports.jsx(DataSettings,{}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"910","trae-inspector-start-column":"10","trae-inspector-end-line":"914","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"pt-4 pb-2 text-center",children:jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"911","trae-inspector-start-column":"12","trae-inspector-end-line":"913","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22v2.4.1%20%C2%B7%20%E6%9E%81%E5%AE%A2%E9%A3%8E%E6%A0%BC%E5%A4%9A%20Agent%20%E5%8D%8F%E4%BD%9C%E5%BC%80%E5%8F%91%E7%B3%BB%E7%BB%9F%22%2C%22textStartLine%22%3A%22911%22%2C%22textStartColumn%22%3A%2263%22%2C%22textEndLine%22%3A%22913%22%2C%22textEndColumn%22%3A%2212%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-600",children:"v2.4.1 · 极客风格多 Agent 协作开发系统"})})]})}),jsxRuntimeExports.jsx("style",{"trae-inspector-start-line":"918","trae-inspector-start-column":"6","trae-inspector-end-line":"959","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Settings.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:`
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
      `})]})}function ImageAnalyzer(){const[s,e]=reactExports.useState(null),[t,n]=reactExports.useState(null),[a,o]=reactExports.useState(!1),[i,c]=reactExports.useState(null),[l,p]=reactExports.useState(1),m=reactExports.useRef(null),d=F=>{var f;const u=(f=F.target.files)==null?void 0:f[0];if(u){if(!u.type.startsWith("image/")){c("请选择图片文件");return}const k=new FileReader;k.onload=y=>{var g;e((g=y.target)==null?void 0:g.result),n(null),c(null),p(1)},k.readAsDataURL(u)}},x=async()=>{if(!s)return;o(!0),c(null),await new Promise(u=>setTimeout(u,2e3)),n({description:"这是一张展示现代科技办公环境的图片，包含一台笔记本电脑、显示器、键盘和鼠标。桌面上摆放着咖啡杯和书籍，背景是简洁的白色墙壁和绿植，整体氛围明亮专业。",objects:["笔记本电脑","显示器","键盘","鼠标","咖啡杯","书籍","植物","办公椅"],colors:["白色","银色","黑色","绿色","棕色"],text:"屏幕上显示代码编辑器界面，包含JavaScript代码",sentiment:"积极、专业、整洁"}),o(!1)},h=()=>{e(null),n(null),c(null),p(1),m.current&&(m.current.value="")};return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"70","trae-inspector-start-column":"4","trae-inspector-end-line":"228","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col bg-gray-950",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"71","trae-inspector-start-column":"6","trae-inspector-end-line":"78","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-pink-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"72","trae-inspector-start-column":"8","trae-inspector-end-line":"77","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto flex items-center gap-2",children:[jsxRuntimeExports.jsx(Image,{className:"w-5 h-5 text-pink-400",style:{filter:"drop-shadow(0 0 6px rgba(236,72,153,0.5))"}}),jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"74","trae-inspector-start-column":"10","trae-inspector-end-line":"76","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9B%BE%E7%89%87%E7%90%86%E8%A7%A3%22%2C%22textStartLine%22%3A%2274%22%2C%22textStartColumn%22%3A%22125%22%2C%22textEndLine%22%3A%2276%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono font-bold text-pink-400",style:{textShadow:"0 0 8px rgba(236,72,153,0.5)"},children:"图片理解"})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"80","trae-inspector-start-column":"6","trae-inspector-end-line":"227","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 safe-area-bottom",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"81","trae-inspector-start-column":"8","trae-inspector-end-line":"226","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto space-y-3",children:[s?jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"96","trae-inspector-start-column":"12","trae-inspector-end-line":"203","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"97","trae-inspector-start-column":"14","trae-inspector-end-line":"121","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900/50",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"98","trae-inspector-start-column":"16","trae-inspector-end-line":"112","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between p-2 bg-gray-900/80 border-b border-gray-800",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"99","trae-inspector-start-column":"18","trae-inspector-end-line":"99","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%22%2C%22textStartLine%22%3A%2299%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%2299%22%2C%22textEndColumn%22%3A%2276%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:"图片预览"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"100","trae-inspector-start-column":"18","trae-inspector-end-line":"111","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"101","trae-inspector-start-column":"20","trae-inspector-end-line":"103","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>p(F=>Math.max(.5,F-.25)),className:"p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300",children:jsxRuntimeExports.jsx(ZoomOut,{className:"w-3.5 h-3.5"})}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"104","trae-inspector-start-column":"20","trae-inspector-end-line":"104","trae-inspector-end-column":"105","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-600",children:[Math.round(l*100),"%"]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"105","trae-inspector-start-column":"20","trae-inspector-end-line":"107","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>p(F=>Math.min(2,F+.25)),className:"p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300",children:jsxRuntimeExports.jsx(ZoomIn,{className:"w-3.5 h-3.5"})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"108","trae-inspector-start-column":"20","trae-inspector-end-line":"110","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>p(1),className:"p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300",children:jsxRuntimeExports.jsx(RotateCcw,{className:"w-3.5 h-3.5"})})]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"113","trae-inspector-start-column":"16","trae-inspector-end-line":"120","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"overflow-auto max-h-[300px]",children:jsxRuntimeExports.jsx("img",{"trae-inspector-start-line":"114","trae-inspector-start-column":"18","trae-inspector-end-line":"119","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",src:s,alt:"Uploaded",className:"mx-auto transition-transform duration-200",style:{transform:`scale(${l})`,transformOrigin:"center"}})})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"123","trae-inspector-start-column":"14","trae-inspector-end-line":"153","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"124","trae-inspector-start-column":"16","trae-inspector-end-line":"145","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:x,disabled:a,className:cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all",a?"bg-gray-800/50 border-gray-700 text-gray-500":"bg-pink-900/30 border-pink-700/50 text-pink-400 hover:bg-pink-900/50"),children:a?jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(LoaderCircle,{className:"w-4 h-4 animate-spin"}),"分析中..."]}):jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Sparkles,{className:"w-4 h-4"}),"开始分析"]})}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"146","trae-inspector-start-column":"16","trae-inspector-end-line":"152","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:h,className:"flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-700/50 text-gray-400 hover:bg-gray-800/50 transition-all",children:[jsxRuntimeExports.jsx(X,{className:"w-4 h-4"}),"清除"]})]}),t&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"156","trae-inspector-start-column":"16","trae-inspector-end-line":"201","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"157","trae-inspector-start-column":"18","trae-inspector-end-line":"163","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-4 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"158","trae-inspector-start-column":"20","trae-inspector-end-line":"161","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 mb-2",children:[jsxRuntimeExports.jsx(Sparkles,{className:"w-4 h-4 text-pink-400"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"160","trae-inspector-start-column":"22","trae-inspector-end-line":"160","trae-inspector-end-column":"83","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%9B%BE%E5%83%8F%E6%8F%8F%E8%BF%B0%22%2C%22textStartLine%22%3A%22160%22%2C%22textStartColumn%22%3A%2272%22%2C%22textEndLine%22%3A%22160%22%2C%22textEndColumn%22%3A%2276%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-pink-400",children:"图像描述"})]}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"162","trae-inspector-start-column":"20","trae-inspector-end-line":"162","trae-inspector-end-column":"99","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm text-gray-300 leading-relaxed",children:t.description})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"165","trae-inspector-start-column":"18","trae-inspector-end-line":"186","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-2 gap-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"166","trae-inspector-start-column":"20","trae-inspector-end-line":"175","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"167","trae-inspector-start-column":"22","trae-inspector-end-line":"167","trae-inspector-end-column":"90","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%AF%86%E5%88%AB%E5%AF%B9%E8%B1%A1%22%2C%22textStartLine%22%3A%22167%22%2C%22textStartColumn%22%3A%2280%22%2C%22textEndLine%22%3A%22167%22%2C%22textEndColumn%22%3A%2284%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"识别对象"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"168","trae-inspector-start-column":"22","trae-inspector-end-line":"174","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1",children:t.objects.map(F=>jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"170","trae-inspector-start-column":"26","trae-inspector-end-line":"172","trae-inspector-end-column":"33","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-700/30",children:F},F))})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"176","trae-inspector-start-column":"20","trae-inspector-end-line":"185","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"177","trae-inspector-start-column":"22","trae-inspector-end-line":"177","trae-inspector-end-column":"90","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%B8%BB%E8%A6%81%E9%A2%9C%E8%89%B2%22%2C%22textStartLine%22%3A%22177%22%2C%22textStartColumn%22%3A%2280%22%2C%22textEndLine%22%3A%22177%22%2C%22textEndColumn%22%3A%2284%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"主要颜色"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"178","trae-inspector-start-column":"22","trae-inspector-end-line":"184","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1",children:t.colors.map(F=>jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"180","trae-inspector-start-column":"26","trae-inspector-end-line":"182","trae-inspector-end-column":"33","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] px-1.5 py-0.5 rounded bg-green-900/30 text-green-400 border border-green-700/30",children:F},F))})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"188","trae-inspector-start-column":"18","trae-inspector-end-line":"193","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"189","trae-inspector-start-column":"20","trae-inspector-end-line":"191","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 mb-2",children:jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"190","trae-inspector-start-column":"22","trae-inspector-end-line":"190","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%8F%90%E5%8F%96%E6%96%87%E6%9C%AC%22%2C%22textStartLine%22%3A%22190%22%2C%22textStartColumn%22%3A%2276%22%2C%22textEndLine%22%3A%22190%22%2C%22textEndColumn%22%3A%2280%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:"提取文本"})}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"192","trae-inspector-start-column":"20","trae-inspector-end-line":"192","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs text-gray-400",children:t.text})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"195","trae-inspector-start-column":"18","trae-inspector-end-line":"200","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"196","trae-inspector-start-column":"20","trae-inspector-end-line":"198","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 mb-2",children:jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"197","trae-inspector-start-column":"22","trae-inspector-end-line":"197","trae-inspector-end-column":"87","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%83%85%E6%84%9F%E5%88%86%E6%9E%90%22%2C%22textStartLine%22%3A%22197%22%2C%22textStartColumn%22%3A%2276%22%2C%22textEndLine%22%3A%22197%22%2C%22textEndColumn%22%3A%2280%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:"情感分析"})}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"199","trae-inspector-start-column":"20","trae-inspector-end-line":"199","trae-inspector-end-column":"88","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm text-amber-400",children:t.sentiment})]})]})]}):jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"83","trae-inspector-start-column":"12","trae-inspector-end-line":"94","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"border-2 border-dashed border-gray-800 rounded-2xl p-8 text-center bg-gray-900/50 hover:border-pink-700/50 transition-colors cursor-pointer",onClick:()=>{var F;return(F=m.current)==null?void 0:F.click()},children:[jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"84","trae-inspector-start-column":"14","trae-inspector-end-line":"84","trae-inspector-end-column":"118","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",ref:m,type:"file",accept:"image/*",onChange:d,className:"hidden"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"85","trae-inspector-start-column":"14","trae-inspector-end-line":"87","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-16 h-16 rounded-xl bg-pink-900/20 border border-pink-700/40 flex items-center justify-center mx-auto mb-4",children:jsxRuntimeExports.jsx(Upload,{className:"w-8 h-8 text-pink-400"})}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"88","trae-inspector-start-column":"14","trae-inspector-end-line":"88","trae-inspector-end-column":"74","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%22%2C%22textStartLine%22%3A%2288%22%2C%22textStartColumn%22%3A%2266%22%2C%22textEndLine%22%3A%2288%22%2C%22textEndColumn%22%3A%2270%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300 mb-1",children:"上传图片"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"89","trae-inspector-start-column":"14","trae-inspector-end-line":"89","trae-inspector-end-column":"73","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%94%AF%E6%8C%81%20JPG%E3%80%81PNG%E3%80%81GIF%20%E7%AD%89%E6%A0%BC%E5%BC%8F%22%2C%22textStartLine%22%3A%2289%22%2C%22textStartColumn%22%3A%2251%22%2C%22textEndLine%22%3A%2289%22%2C%22textEndColumn%22%3A%2269%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs text-gray-500",children:"支持 JPG、PNG、GIF 等格式"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"90","trae-inspector-start-column":"14","trae-inspector-end-line":"93","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-mono",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"91","trae-inspector-start-column":"16","trae-inspector-end-line":"91","trae-inspector-end-column":"78","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0%22%2C%22textStartLine%22%3A%2291%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%2291%22%2C%22textEndColumn%22%3A%2271%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-2 py-1 rounded bg-gray-800/50",children:"拖拽上传"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"92","trae-inspector-start-column":"16","trae-inspector-end-line":"92","trae-inspector-end-column":"81","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9C%80%E5%A4%A7%2010MB%22%2C%22textStartLine%22%3A%2292%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%2292%22%2C%22textEndColumn%22%3A%2274%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"px-2 py-1 rounded bg-gray-800/50",children:"最大 10MB"})]})]}),i&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"207","trae-inspector-start-column":"12","trae-inspector-end-line":"210","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-red-900/30 border border-red-700/50 flex items-center gap-2",children:[jsxRuntimeExports.jsx(X,{className:"w-4 h-4 text-red-400"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"209","trae-inspector-start-column":"14","trae-inspector-end-line":"209","trae-inspector-end-column":"77","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-red-400",children:i})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"213","trae-inspector-start-column":"10","trae-inspector-end-line":"225","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-4 rounded-xl bg-gradient-to-br from-pink-900/20 via-gray-900/50 to-purple-900/20 border border-pink-800/30",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"214","trae-inspector-start-column":"12","trae-inspector-end-line":"217","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 mb-2",children:[jsxRuntimeExports.jsx(Sparkles,{className:"w-4 h-4 text-pink-400"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"216","trae-inspector-start-column":"14","trae-inspector-end-line":"216","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%8A%9F%E8%83%BD%E8%AF%B4%E6%98%8E%22%2C%22textStartLine%22%3A%22216%22%2C%22textStartColumn%22%3A%2264%22%2C%22textEndLine%22%3A%22216%22%2C%22textEndColumn%22%3A%2268%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-pink-400",children:"功能说明"})]}),jsxRuntimeExports.jsxs("ul",{"trae-inspector-start-line":"218","trae-inspector-start-column":"12","trae-inspector-end-line":"224","trae-inspector-end-column":"17","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[11px] text-gray-500 space-y-1",children:[jsxRuntimeExports.jsx("li",{"trae-inspector-start-line":"219","trae-inspector-start-column":"14","trae-inspector-end-line":"219","trae-inspector-end-column":"33","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E2%80%A2%20%E6%94%AF%E6%8C%81%E5%9B%BE%E5%83%8F%E5%86%85%E5%AE%B9%E6%8F%8F%E8%BF%B0%22%2C%22textStartLine%22%3A%22219%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22219%22%2C%22textEndColumn%22%3A%2228%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"• 支持图像内容描述"}),jsxRuntimeExports.jsx("li",{"trae-inspector-start-line":"220","trae-inspector-start-column":"14","trae-inspector-end-line":"220","trae-inspector-end-column":"32","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E2%80%A2%20%E7%89%A9%E4%BD%93%E8%AF%86%E5%88%AB%E4%B8%8E%E5%88%86%E7%B1%BB%22%2C%22textStartLine%22%3A%22220%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22220%22%2C%22textEndColumn%22%3A%2227%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"• 物体识别与分类"}),jsxRuntimeExports.jsx("li",{"trae-inspector-start-line":"221","trae-inspector-start-column":"14","trae-inspector-end-line":"221","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E2%80%A2%20%E9%A2%9C%E8%89%B2%E6%8F%90%E5%8F%96%E5%88%86%E6%9E%90%22%2C%22textStartLine%22%3A%22221%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22221%22%2C%22textEndColumn%22%3A%2226%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"• 颜色提取分析"}),jsxRuntimeExports.jsx("li",{"trae-inspector-start-line":"222","trae-inspector-start-column":"14","trae-inspector-end-line":"222","trae-inspector-end-column":"32","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E2%80%A2%20%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB%E4%B8%8E%E6%8F%90%E5%8F%96%22%2C%22textStartLine%22%3A%22222%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22222%22%2C%22textEndColumn%22%3A%2227%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"• 文字识别与提取"}),jsxRuntimeExports.jsx("li",{"trae-inspector-start-line":"223","trae-inspector-start-column":"14","trae-inspector-end-line":"223","trae-inspector-end-column":"32","trae-inspector-file-path":"src/pages/ImageAnalyzer.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E2%80%A2%20%E6%83%85%E6%84%9F%E4%B8%8E%E6%B0%9B%E5%9B%B4%E5%88%86%E6%9E%90%22%2C%22textStartLine%22%3A%22223%22%2C%22textStartColumn%22%3A%2218%22%2C%22textEndLine%22%3A%22223%22%2C%22textEndColumn%22%3A%2227%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:"• 情感与氛围分析"})]})]})]})})]})}const languages$1=[{id:"javascript",name:"JavaScript",icon:"JS",color:"text-yellow-400",bg:"bg-yellow-900/30"},{id:"typescript",name:"TypeScript",icon:"TS",color:"text-blue-400",bg:"bg-blue-900/30"},{id:"python",name:"Python",icon:"PY",color:"text-green-400",bg:"bg-green-900/30"},{id:"java",name:"Java",icon:"JV",color:"text-orange-400",bg:"bg-orange-900/30"},{id:"rust",name:"Rust",icon:"RS",color:"text-red-400",bg:"bg-red-900/30"},{id:"go",name:"Go",icon:"GO",color:"text-cyan-400",bg:"bg-cyan-900/30"},{id:"cpp",name:"C++",icon:"C++",color:"text-purple-400",bg:"bg-purple-900/30"},{id:"html",name:"HTML",icon:"HT",color:"text-amber-400",bg:"bg-amber-900/30"},{id:"css",name:"CSS",icon:"CS",color:"text-blue-400",bg:"bg-blue-900/30"},{id:"react",name:"React",icon:"RE",color:"text-cyan-400",bg:"bg-cyan-900/30"},{id:"vue",name:"Vue",icon:"VU",color:"text-green-400",bg:"bg-green-900/30"},{id:"node",name:"Node.js",icon:"ND",color:"text-green-400",bg:"bg-green-900/30"}],templates=[{id:"api",name:"REST API",desc:"创建 RESTful API 服务"},{id:"crud",name:"CRUD",desc:"创建增删改查功能"},{id:"auth",name:"认证",desc:"用户认证与权限"},{id:"ui",name:"UI组件",desc:"React/Vue 组件"},{id:"db",name:"数据库",desc:"数据库操作代码"},{id:"algo",name:"算法",desc:"数据结构与算法"}];function generateCode(s,e){var a;const t=((a=languages$1.find(o=>o.id===s))==null?void 0:a.name)||"JavaScript",n=e.replace(/[^a-zA-Z]/g,"")||"generate";return s==="javascript"?`// ${t} 代码生成结果
// 基于需求: ${e}

function ${n}() {
  const config = {
    version: '1.0.0',
    debug: true,
    timeout: 5000
  };

  async function processData(input) {
    try {
      const result = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      return result.json();
    } catch (error) {
      console.error('处理失败:', error);
      throw error;
    }
  }

  export { config, processData };
}`:s==="python"?`# ${t} 代码生成结果
# 基于需求: ${e}

def ${n}():
    """${e}"""
    config = {
        'version': '1.0.0',
        'debug': True,
        'timeout': 5000
    }

    async def process_data(input_data):
        try:
            response = await fetch('/api/data', {
                'method': 'POST',
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(input_data)
            })
            return response.json()
        except Exception as error:
            print(f'处理失败: {error}')
            raise error

    __all__ = ['config', 'process_data']`:`// ${t} 代码生成结果
// 基于需求: ${e}

public class ${n.charAt(0).toUpperCase()+n.slice(1)} {
    private static final String VERSION = "1.0.0";
    private static final boolean DEBUG = true;
    private static final int TIMEOUT = 5000;

    public static String processData(String input) {
        try {
            return "处理结果: " + input;
        } catch (Exception e) {
            System.err.println("处理失败: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
        String result = processData("测试输入");
        System.out.println(result);
    }
}`}function CodeGenerator(){const[s,e]=reactExports.useState("javascript"),[t,n]=reactExports.useState(null),[a,o]=reactExports.useState(""),[i,c]=reactExports.useState(""),[l,p]=reactExports.useState(!1),[m,d]=reactExports.useState(!1),x=async()=>{a.trim()&&(p(!0),c(""),await new Promise(u=>setTimeout(u,2e3)),c(generateCode(s,a)),p(!1))},h=async()=>{await navigator.clipboard.writeText(i),d(!0),setTimeout(()=>d(!1),2e3)},F=()=>{const f={javascript:".js",typescript:".ts",python:".py",java:".java",rust:".rs",go:".go",cpp:".cpp",html:".html",css:".css",react:".tsx",vue:".vue",node:".js"}[s]||".js",k=new Blob([i],{type:"text/plain"}),y=URL.createObjectURL(k),g=document.createElement("a");g.href=y,g.download=`generated${f}`,g.click(),URL.revokeObjectURL(y)};return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"166","trae-inspector-start-column":"4","trae-inspector-end-line":"326","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col bg-gray-950",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"167","trae-inspector-start-column":"6","trae-inspector-end-line":"174","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-cyan-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"168","trae-inspector-start-column":"8","trae-inspector-end-line":"173","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto flex items-center gap-2",children:[jsxRuntimeExports.jsx(CodeXml,{className:"w-5 h-5 text-cyan-400",style:{filter:"drop-shadow(0 0 6px rgba(34,211,238,0.5))"}}),jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"170","trae-inspector-start-column":"10","trae-inspector-end-line":"172","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8%22%2C%22textStartLine%22%3A%22170%22%2C%22textStartColumn%22%3A%22125%22%2C%22textEndLine%22%3A%22172%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono font-bold text-cyan-400",style:{textShadow:"0 0 8px rgba(34,211,238,0.5)"},children:"代码生成器"})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"176","trae-inspector-start-column":"6","trae-inspector-end-line":"325","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 safe-area-bottom",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"177","trae-inspector-start-column":"8","trae-inspector-end-line":"324","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto space-y-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"178","trae-inspector-start-column":"10","trae-inspector-end-line":"197","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"179","trae-inspector-start-column":"12","trae-inspector-end-line":"179","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E9%80%89%E6%8B%A9%E8%AF%AD%E8%A8%80%22%2C%22textStartLine%22%3A%22179%22%2C%22textStartColumn%22%3A%2270%22%2C%22textEndLine%22%3A%22179%22%2C%22textEndColumn%22%3A%2274%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"选择语言"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"180","trae-inspector-start-column":"12","trae-inspector-end-line":"196","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1.5",children:languages$1.map(u=>jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"182","trae-inspector-start-column":"16","trae-inspector-end-line":"194","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>e(u.id),className:cn("flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-mono transition-all",s===u.id?`${u.bg} ${u.color} border-current`:"bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600"),children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"192","trae-inspector-start-column":"18","trae-inspector-end-line":"192","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-bold",children:u.icon}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"193","trae-inspector-start-column":"18","trae-inspector-end-line":"193","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"truncate max-w-[60px]",children:u.name})]},u.id))})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"199","trae-inspector-start-column":"10","trae-inspector-end-line":"228","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"200","trae-inspector-start-column":"12","trae-inspector-end-line":"200","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%A8%A1%E6%9D%BF%E9%80%89%E6%8B%A9%22%2C%22textStartLine%22%3A%22200%22%2C%22textStartColumn%22%3A%2270%22%2C%22textEndLine%22%3A%22200%22%2C%22textEndColumn%22%3A%2274%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"模板选择"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"201","trae-inspector-start-column":"12","trae-inspector-end-line":"227","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1.5",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"202","trae-inspector-start-column":"14","trae-inspector-end-line":"212","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%87%AA%E5%AE%9A%E4%B9%89%22%2C%22textStartLine%22%3A%22210%22%2C%22textStartColumn%22%3A%2215%22%2C%22textEndLine%22%3A%22212%22%2C%22textEndColumn%22%3A%2214%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>n(null),className:cn("px-2 py-1 rounded-lg border text-xs font-mono transition-all",t?"bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600":"bg-cyan-900/30 text-cyan-400 border-cyan-700/50"),children:"自定义"}),templates.map(u=>jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"214","trae-inspector-start-column":"16","trae-inspector-end-line":"225","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>n(u.id),className:cn("px-2 py-1 rounded-lg border text-xs font-mono transition-all",t===u.id?"bg-cyan-900/30 text-cyan-400 border-cyan-700/50":"bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600"),children:u.name},u.id))]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"230","trae-inspector-start-column":"10","trae-inspector-end-line":"262","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"231","trae-inspector-start-column":"12","trae-inspector-end-line":"255","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"232","trae-inspector-start-column":"14","trae-inspector-end-line":"232","trae-inspector-end-column":"79","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E9%9C%80%E6%B1%82%E6%8F%8F%E8%BF%B0%22%2C%22textStartLine%22%3A%22232%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22232%22%2C%22textEndColumn%22%3A%2272%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:"需求描述"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"233","trae-inspector-start-column":"14","trae-inspector-end-line":"254","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:x,disabled:l||!a.trim(),className:cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all",l||!a.trim()?"bg-gray-800/50 text-gray-600 cursor-not-allowed":"bg-cyan-900/30 text-cyan-400 border border-cyan-700/50 hover:bg-cyan-900/50"),children:l?jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(LoaderCircle,{className:"w-3 h-3 animate-spin"}),"生成中"]}):jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Sparkles,{className:"w-3 h-3"}),"生成"]})})]}),jsxRuntimeExports.jsx("textarea",{"trae-inspector-start-line":"256","trae-inspector-start-column":"12","trae-inspector-end-line":"261","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:a,onChange:u=>o(u.target.value),placeholder:"描述你想要生成的代码...",className:"w-full h-24 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-700/50 font-mono"})]}),i&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"265","trae-inspector-start-column":"12","trae-inspector-end-line":"308","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"266","trae-inspector-start-column":"14","trae-inspector-end-line":"292","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"267","trae-inspector-start-column":"16","trae-inspector-end-line":"270","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx(FileCode,{className:"w-4 h-4 text-cyan-400"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"269","trae-inspector-start-column":"18","trae-inspector-end-line":"269","trae-inspector-end-column":"79","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%94%9F%E6%88%90%E7%BB%93%E6%9E%9C%22%2C%22textStartLine%22%3A%22269%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22269%22%2C%22textEndColumn%22%3A%2272%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-cyan-400",children:"生成结果"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"271","trae-inspector-start-column":"16","trae-inspector-end-line":"291","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1",children:[jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"272","trae-inspector-start-column":"18","trae-inspector-end-line":"283","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:h,className:cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all",m?"bg-green-900/30 text-green-400 border border-green-700/50":"bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"),children:[m?jsxRuntimeExports.jsx(Check,{className:"w-3 h-3"}):jsxRuntimeExports.jsx(Copy,{className:"w-3 h-3"}),m?"已复制":"复制"]}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"284","trae-inspector-start-column":"18","trae-inspector-end-line":"290","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:F,className:"flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600 text-[10px] font-mono transition-all",children:[jsxRuntimeExports.jsx(Download,{className:"w-3 h-3"}),"下载"]})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"293","trae-inspector-start-column":"14","trae-inspector-end-line":"307","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900/60",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"294","trae-inspector-start-column":"16","trae-inspector-end-line":"303","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 px-3 py-2 bg-gray-900/80 border-b border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"295","trae-inspector-start-column":"18","trae-inspector-end-line":"299","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-1.5",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"296","trae-inspector-start-column":"20","trae-inspector-end-line":"296","trae-inspector-end-column":"74","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-2 h-2 rounded-full bg-red-500/80"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"297","trae-inspector-start-column":"20","trae-inspector-end-line":"297","trae-inspector-end-column":"77","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-2 h-2 rounded-full bg-yellow-500/80"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"298","trae-inspector-start-column":"20","trae-inspector-end-line":"298","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-2 h-2 rounded-full bg-green-500/80"})]}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"300","trae-inspector-start-column":"18","trae-inspector-end-line":"302","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 ml-2",children:["generated.",s==="python"?"py":s==="java"?"java":"js"]})]}),jsxRuntimeExports.jsx("pre",{"trae-inspector-start-line":"304","trae-inspector-start-column":"16","trae-inspector-end-line":"306","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 text-xs font-mono text-gray-300 overflow-x-auto max-h-[300px]",children:jsxRuntimeExports.jsx("code",{"trae-inspector-start-line":"305","trae-inspector-start-column":"18","trae-inspector-end-line":"305","trae-inspector-end-column":"39","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",children:i})})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"311","trae-inspector-start-column":"10","trae-inspector-end-line":"323","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-4 rounded-xl bg-gradient-to-br from-cyan-900/20 via-gray-900/50 to-blue-900/20 border border-cyan-800/30",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"312","trae-inspector-start-column":"12","trae-inspector-end-line":"315","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 mb-2",children:[jsxRuntimeExports.jsx(Terminal,{className:"w-4 h-4 text-cyan-400"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"314","trae-inspector-start-column":"14","trae-inspector-end-line":"314","trae-inspector-end-column":"75","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%94%AF%E6%8C%81%E8%AF%AD%E8%A8%80%22%2C%22textStartLine%22%3A%22314%22%2C%22textStartColumn%22%3A%2264%22%2C%22textEndLine%22%3A%22314%22%2C%22textEndColumn%22%3A%2268%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-cyan-400",children:"支持语言"})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"316","trae-inspector-start-column":"12","trae-inspector-end-line":"322","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1",children:languages$1.map(u=>jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"318","trae-inspector-start-column":"16","trae-inspector-end-line":"320","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/CodeGenerator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[9px] px-1.5 py-0.5 rounded",u.bg,u.color,"border border-gray-700/30"),children:u.name},u.id))})]})]})})]})}const languages=[{id:"zh",name:"中文",flag:"CN"},{id:"en",name:"English",flag:"US"},{id:"ja",name:"日本語",flag:"JP"},{id:"ko",name:"한국어",flag:"KR"},{id:"fr",name:"Français",flag:"FR"},{id:"de",name:"Deutsch",flag:"DE"},{id:"es",name:"Español",flag:"ES"},{id:"ru",name:"Русский",flag:"RU"},{id:"pt",name:"Português",flag:"PT"},{id:"it",name:"Italiano",flag:"IT"},{id:"ar",name:"العربية",flag:"SA"},{id:"hi",name:"हिन्दी",flag:"IN"}];function Translator(){const[s,e]=reactExports.useState("zh"),[t,n]=reactExports.useState("en"),[a,o]=reactExports.useState(""),[i,c]=reactExports.useState([]),[l,p]=reactExports.useState(!1),[m,d]=reactExports.useState(null),x=()=>{const u=s;e(t),n(u)},h=async()=>{var k,y;if(!a.trim())return;p(!0),c([]),await new Promise(g=>setTimeout(g,1500)),(k=languages.find(g=>g.id===s))!=null&&k.name;const u=((y=languages.find(g=>g.id===t))==null?void 0:y.name)||"English",f=[{text:t==="en"?"Hello, how are you?":t==="ja"?"こんにちは、元気ですか？":t==="ko"?"안녕하세요, 어떻게 지냅니까?":t==="fr"?"Bonjour, comment ça va?":t==="de"?"Hallo, wie geht es dir?":t==="es"?"Hola, ¿cómo estás?":"Hello, how are you?",language:u,confidence:98},{text:t==="en"?"Hi there, how have you been?":t==="ja"?"こんにちは、調子はどうですか？":t==="ko"?"안녕, 잘 지냈어?":t==="fr"?"Salut, comment tu vas?":t==="de"?"Hallo, wie war es?":t==="es"?"¡Hola!, ¿cómo has estado?":"Hi there, how have you been?",language:`${u} (变体)`,confidence:92},{text:t==="en"?"Greetings, what is your state?":t==="ja"?"挨拶、あなたの状態は何ですか？":t==="ko"?"인사, 어떤 상태입니까?":t==="fr"?"Salutations, quel est votre état?":t==="de"?"Grüße, wie ist dein Zustand?":t==="es"?"Saludos, ¿cuál es tu estado?":"Greetings, what is your state?",language:`${u} (直译)`,confidence:78}];c(f),p(!1)},F=async(u,f)=>{await navigator.clipboard.writeText(u),d(f),setTimeout(()=>d(null),2e3)};return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"98","trae-inspector-start-column":"4","trae-inspector-end-line":"270","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col bg-gray-950",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"99","trae-inspector-start-column":"6","trae-inspector-end-line":"106","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-amber-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"100","trae-inspector-start-column":"8","trae-inspector-end-line":"105","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto flex items-center gap-2",children:[jsxRuntimeExports.jsx(Languages,{className:"w-5 h-5 text-amber-400",style:{filter:"drop-shadow(0 0 6px rgba(251,191,36,0.5))"}}),jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"102","trae-inspector-start-column":"10","trae-inspector-end-line":"104","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%22%2C%22textStartLine%22%3A%22102%22%2C%22textStartColumn%22%3A%22126%22%2C%22textEndLine%22%3A%22104%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono font-bold text-amber-400",style:{textShadow:"0 0 8px rgba(251,191,36,0.5)"},children:"翻译助手"})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"108","trae-inspector-start-column":"6","trae-inspector-end-line":"269","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 safe-area-bottom",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"109","trae-inspector-start-column":"8","trae-inspector-end-line":"268","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto space-y-3",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"110","trae-inspector-start-column":"10","trae-inspector-end-line":"147","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-center gap-3 p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"111","trae-inspector-start-column":"12","trae-inspector-end-line":"124","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"112","trae-inspector-start-column":"14","trae-inspector-end-line":"112","trae-inspector-end-column":"92","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%BA%90%E8%AF%AD%E8%A8%80%22%2C%22textStartLine%22%3A%22112%22%2C%22textStartColumn%22%3A%2283%22%2C%22textEndLine%22%3A%22112%22%2C%22textEndColumn%22%3A%2286%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-500 mb-1 text-center",children:"源语言"}),jsxRuntimeExports.jsx("select",{"trae-inspector-start-line":"113","trae-inspector-start-column":"14","trae-inspector-end-line":"123","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:s,onChange:u=>e(u.target.value),className:"w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 focus:outline-none focus:border-amber-700/50 appearance-none",children:languages.map(u=>jsxRuntimeExports.jsx("option",{"trae-inspector-start-line":"119","trae-inspector-start-column":"18","trae-inspector-end-line":"121","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:u.id,children:u.name},u.id))})]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"126","trae-inspector-start-column":"12","trae-inspector-end-line":"131","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:x,className:"flex items-center justify-center w-8 h-8 rounded-lg bg-amber-900/30 border border-amber-700/50 text-amber-400 hover:bg-amber-900/50 transition-all",children:jsxRuntimeExports.jsx(ArrowRight,{className:"w-4 h-4"})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"133","trae-inspector-start-column":"12","trae-inspector-end-line":"146","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"134","trae-inspector-start-column":"14","trae-inspector-end-line":"134","trae-inspector-end-column":"93","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%9B%AE%E6%A0%87%E8%AF%AD%E8%A8%80%22%2C%22textStartLine%22%3A%22134%22%2C%22textStartColumn%22%3A%2283%22%2C%22textEndLine%22%3A%22134%22%2C%22textEndColumn%22%3A%2287%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-500 mb-1 text-center",children:"目标语言"}),jsxRuntimeExports.jsx("select",{"trae-inspector-start-line":"135","trae-inspector-start-column":"14","trae-inspector-end-line":"145","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:t,onChange:u=>n(u.target.value),className:"w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 focus:outline-none focus:border-amber-700/50 appearance-none",children:languages.filter(u=>u.id!==s).map(u=>jsxRuntimeExports.jsx("option",{"trae-inspector-start-line":"141","trae-inspector-start-column":"18","trae-inspector-end-line":"143","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:u.id,children:u.name},u.id))})]})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"149","trae-inspector-start-column":"10","trae-inspector-end-line":"185","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"150","trae-inspector-start-column":"12","trae-inspector-end-line":"174","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"151","trae-inspector-start-column":"14","trae-inspector-end-line":"151","trae-inspector-end-column":"79","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E8%BE%93%E5%85%A5%E6%96%87%E6%9C%AC%22%2C%22textStartLine%22%3A%22151%22%2C%22textStartColumn%22%3A%2268%22%2C%22textEndLine%22%3A%22151%22%2C%22textEndColumn%22%3A%2272%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:"输入文本"}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"152","trae-inspector-start-column":"14","trae-inspector-end-line":"173","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:h,disabled:l||!a.trim(),className:cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all",l||!a.trim()?"bg-gray-800/50 text-gray-600 cursor-not-allowed":"bg-amber-900/30 text-amber-400 border border-amber-700/50 hover:bg-amber-900/50"),children:l?jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(LoaderCircle,{className:"w-3 h-3 animate-spin"}),"翻译中"]}):jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx(Globe,{className:"w-3 h-3"}),"翻译"]})})]}),jsxRuntimeExports.jsx("textarea",{"trae-inspector-start-line":"175","trae-inspector-start-column":"12","trae-inspector-end-line":"180","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:a,onChange:u=>o(u.target.value),placeholder:"输入要翻译的文本...",className:"w-full h-32 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-sm text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-amber-700/50"}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"181","trae-inspector-start-column":"12","trae-inspector-end-line":"184","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mt-2",children:[jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"182","trae-inspector-start-column":"14","trae-inspector-end-line":"182","trae-inspector-end-column":"90","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-600",children:[a.length," 字符"]}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"183","trae-inspector-start-column":"14","trae-inspector-end-line":"183","trae-inspector-end-column":"84","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%94%AF%E6%8C%81%E5%A4%9A%E7%A7%8D%E8%AF%AD%E8%A8%80%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B%22%2C%22textStartLine%22%3A%22183%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%22183%22%2C%22textEndColumn%22%3A%2277%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-600",children:"支持多种语言自动检测"})]})]}),i.length>0&&jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"188","trae-inspector-start-column":"12","trae-inspector-end-line":"227","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"space-y-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"189","trae-inspector-start-column":"14","trae-inspector-end-line":"192","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx(Languages,{className:"w-4 h-4 text-amber-400"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"191","trae-inspector-start-column":"16","trae-inspector-end-line":"191","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E7%BF%BB%E8%AF%91%E7%BB%93%E6%9E%9C%E5%AF%B9%E6%AF%94%22%2C%22textStartLine%22%3A%22191%22%2C%22textStartColumn%22%3A%2267%22%2C%22textEndLine%22%3A%22191%22%2C%22textEndColumn%22%3A%2273%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-amber-400",children:"翻译结果对比"})]}),i.map((u,f)=>jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"195","trae-inspector-start-column":"16","trae-inspector-end-line":"225","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-amber-700/30 transition-all",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"199","trae-inspector-start-column":"18","trae-inspector-end-line":"223","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between mb-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"200","trae-inspector-start-column":"20","trae-inspector-end-line":"200","trae-inspector-end-column":"98","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500",children:u.language}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"201","trae-inspector-start-column":"20","trae-inspector-end-line":"222","trae-inspector-end-column":"26","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"202","trae-inspector-start-column":"22","trae-inspector-end-line":"210","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"203","trae-inspector-start-column":"24","trae-inspector-end-line":"208","trae-inspector-end-column":"30","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"204","trae-inspector-start-column":"26","trae-inspector-end-line":"207","trae-inspector-end-column":"28","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full bg-amber-400 rounded-full transition-all",style:{width:`${u.confidence}%`}})}),jsxRuntimeExports.jsxs("span",{"trae-inspector-start-line":"209","trae-inspector-start-column":"24","trae-inspector-end-line":"209","trae-inspector-end-column":"104","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-500",children:[u.confidence,"%"]})]}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"211","trae-inspector-start-column":"22","trae-inspector-end-line":"221","trae-inspector-end-column":"31","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>F(u.text,f),className:cn("p-1 rounded transition-all",m===f?"bg-green-900/30 text-green-400":"bg-gray-800/50 text-gray-400 hover:text-gray-300"),children:m===f?jsxRuntimeExports.jsx(Check,{className:"w-3 h-3"}):jsxRuntimeExports.jsx(Copy,{className:"w-3 h-3"})})]})]}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"224","trae-inspector-start-column":"18","trae-inspector-end-line":"224","trae-inspector-end-column":"72","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm text-gray-300",children:u.text})]},f))]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"230","trae-inspector-start-column":"10","trae-inspector-end-line":"243","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-4 rounded-xl bg-gradient-to-br from-amber-900/20 via-gray-900/50 to-orange-900/20 border border-amber-800/30",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"231","trae-inspector-start-column":"12","trae-inspector-end-line":"234","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2 mb-2",children:[jsxRuntimeExports.jsx(Globe,{className:"w-4 h-4 text-amber-400"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"233","trae-inspector-start-column":"14","trae-inspector-end-line":"233","trae-inspector-end-column":"76","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%94%AF%E6%8C%81%E8%AF%AD%E8%A8%80%22%2C%22textStartLine%22%3A%22233%22%2C%22textStartColumn%22%3A%2265%22%2C%22textEndLine%22%3A%22233%22%2C%22textEndColumn%22%3A%2269%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs font-mono text-amber-400",children:"支持语言"})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"235","trae-inspector-start-column":"12","trae-inspector-end-line":"242","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-3 gap-1.5",children:languages.map(u=>jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"237","trae-inspector-start-column":"16","trae-inspector-end-line":"240","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-800/30",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"238","trae-inspector-start-column":"18","trae-inspector-end-line":"238","trae-inspector-end-column":"89","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-bold text-gray-400",children:u.flag}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"239","trae-inspector-start-column":"18","trae-inspector-end-line":"239","trae-inspector-end-column":"89","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] text-gray-400 truncate",children:u.name})]},u.id))})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"245","trae-inspector-start-column":"10","trae-inspector-end-line":"267","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"246","trae-inspector-start-column":"12","trae-inspector-end-line":"246","trae-inspector-end-column":"80","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%BF%AB%E6%8D%B7%E7%BF%BB%E8%AF%91%22%2C%22textStartLine%22%3A%22246%22%2C%22textStartColumn%22%3A%2270%22%2C%22textEndLine%22%3A%22246%22%2C%22textEndColumn%22%3A%2274%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono text-gray-500 mb-2",children:"快捷翻译"}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"247","trae-inspector-start-column":"12","trae-inspector-end-line":"266","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex flex-wrap gap-1.5",children:["中文","English","日本語","한국어","Français","Deutsch"].map((u,f)=>jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"249","trae-inspector-start-column":"16","trae-inspector-end-line":"264","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/Translator.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>{n(["zh","en","ja","ko","fr","de"][f]),h()},disabled:!a.trim(),className:cn("px-2 py-1 rounded-lg border text-xs font-mono transition-all",a.trim()?"bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-amber-700/50 hover:text-amber-400":"bg-gray-800/30 text-gray-600 border-gray-800 cursor-not-allowed"),children:u},u))})]})]})})]})}const initialPrompts=[{id:"1",name:"代码审查助手",category:"开发",content:`请帮我审查以下代码，找出潜在的bug、性能问题和代码风格问题，并给出具体的优化建议。

代码：
\`\`\`
[粘贴代码]
\`\`\`

请从以下几个方面进行分析：
1. 潜在bug和错误
2. 性能优化建议
3. 代码可读性改进
4. 最佳实践建议`,tags:["代码","审查","优化"],isFavorite:!0,createdAt:"2026-07-01"},{id:"2",name:"产品文案生成",category:"营销",content:`请帮我为以下产品撰写吸引人的产品文案和宣传语。

产品信息：
- 产品名称：[产品名]
- 核心卖点：[卖点]
- 目标用户：[用户群]
- 独特优势：[优势]

请生成：
1. 产品简介（50字以内）
2. 核心卖点文案
3. 社交媒体宣传语
4. 产品描述（详细版）`,tags:["文案","营销","产品"],isFavorite:!0,createdAt:"2026-07-02"},{id:"3",name:"面试问题生成器",category:"求职",content:`请帮我生成针对以下职位的面试问题。

职位信息：
- 职位名称：[职位名]
- 技术栈：[技术栈]
- 经验要求：[经验]

请生成：
1. 技术问题（5-10个）
2. 行为问题（3-5个）
3. 系统设计问题（2-3个）
4. 开放性问题（2-3个）

每个问题请附带参考答案要点。`,tags:["面试","求职","问题"],isFavorite:!1,createdAt:"2026-07-03"},{id:"4",name:"SQL查询优化",category:"数据库",content:`请帮我优化以下SQL查询语句。

原始查询：
\`\`\`sql
[粘贴SQL]
\`\`\`

表结构：
\`\`\`
[表结构信息]
\`\`\`

请提供：
1. 性能分析
2. 优化后的查询
3. 索引建议
4. 执行计划分析`,tags:["SQL","数据库","优化"],isFavorite:!1,createdAt:"2026-07-04"},{id:"5",name:"创意写作助手",category:"写作",content:`请帮我创作一个故事/文章。

主题：[主题]
风格：[风格，如科幻/悬疑/浪漫/幽默]
字数要求：[字数]
主要角色：[角色描述]
情节要点：[情节]

请开始创作，并保持情节紧凑、语言生动。`,tags:["写作","创意","故事"],isFavorite:!0,createdAt:"2026-07-05"},{id:"6",name:"API设计规范",category:"开发",content:`请帮我设计一个RESTful API接口。

需求描述：
[详细描述需求]

请设计：
1. API端点列表
2. 请求/响应格式
3. 状态码规范
4. 错误处理
5. 认证授权方案
6. 版本控制策略

请遵循RESTful最佳实践。`,tags:["API","设计","规范"],isFavorite:!1,createdAt:"2026-07-06"}],categories=["全部","开发","营销","求职","数据库","写作","其他"];function PromptLibrary(){const[s,e]=reactExports.useState(initialPrompts),[t,n]=reactExports.useState(""),[a,o]=reactExports.useState("全部"),[i,c]=reactExports.useState(!1),[l,p]=reactExports.useState(null),[m,d]=reactExports.useState(null),[x,h]=reactExports.useState(!1),F=s.filter(g=>{const b=g.name.toLowerCase().includes(t.toLowerCase())||g.content.toLowerCase().includes(t.toLowerCase())||g.tags.some(j=>j.toLowerCase().includes(t.toLowerCase())),C=a==="全部"||g.category===a,R=!i||g.isFavorite;return b&&C&&R}),u=async(g,b)=>{await navigator.clipboard.writeText(g),d(b),setTimeout(()=>d(null),2e3)},f=g=>{e(s.map(b=>b.id===g?{...b,isFavorite:!b.isFavorite}:b))},k=g=>{e(s.filter(b=>b.id!==g)),(l==null?void 0:l.id)===g&&p(null)},y=()=>{l&&(e(s.map(g=>g.id===l.id?l:g)),h(!1))};return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"121","trae-inspector-start-column":"4","trae-inspector-end-line":"328","trae-inspector-end-column":"10","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"h-full flex flex-col bg-gray-950",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"122","trae-inspector-start-column":"6","trae-inspector-end-line":"129","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/90 backdrop-blur-md border-b border-violet-900/30 px-4 py-3",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"123","trae-inspector-start-column":"8","trae-inspector-end-line":"128","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto flex items-center gap-2",children:[jsxRuntimeExports.jsx(Sparkles,{className:"w-5 h-5 text-violet-400",style:{filter:"drop-shadow(0 0 6px rgba(139,92,246,0.5))"}}),jsxRuntimeExports.jsx("h1",{"trae-inspector-start-line":"125","trae-inspector-start-column":"10","trae-inspector-end-line":"127","trae-inspector-end-column":"15","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22Prompt%20%E6%A8%A1%E6%9D%BF%E5%BA%93%22%2C%22textStartLine%22%3A%22125%22%2C%22textStartColumn%22%3A%22127%22%2C%22textEndLine%22%3A%22127%22%2C%22textEndColumn%22%3A%2210%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-base font-mono font-bold text-violet-400",style:{textShadow:"0 0 8px rgba(139,92,246,0.5)"},children:"Prompt 模板库"})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"131","trae-inspector-start-column":"6","trae-inspector-end-line":"174","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 px-3 py-2 border-b border-gray-800/50",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"132","trae-inspector-start-column":"8","trae-inspector-end-line":"173","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto space-y-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"133","trae-inspector-start-column":"10","trae-inspector-end-line":"142","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"relative",children:[jsxRuntimeExports.jsx(Search,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"}),jsxRuntimeExports.jsx("input",{"trae-inspector-start-line":"135","trae-inspector-start-column":"12","trae-inspector-end-line":"141","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",type:"text",value:t,onChange:g=>n(g.target.value),placeholder:"搜索模板...",className:"w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700/50 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-700/50"})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"143","trae-inspector-start-column":"10","trae-inspector-end-line":"172","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"144","trae-inspector-start-column":"12","trae-inspector-end-line":"159","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-1 overflow-x-auto",children:categories.map(g=>jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"146","trae-inspector-start-column":"16","trae-inspector-end-line":"157","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>o(g),className:cn("px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all",a===g?"bg-violet-900/30 text-violet-400 border border-violet-700/50":"bg-gray-800/50 text-gray-400 border border-gray-700/50"),children:g},g))}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"160","trae-inspector-start-column":"12","trae-inspector-end-line":"171","trae-inspector-end-column":"21","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>c(!i),className:cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all",i?"bg-yellow-900/30 text-yellow-400 border border-yellow-700/50":"bg-gray-800/50 text-gray-400 border border-gray-700/50"),children:[jsxRuntimeExports.jsx(Star,{className:"w-3 h-3"}),"收藏"]})]})]})}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"176","trae-inspector-start-column":"6","trae-inspector-end-line":"248","trae-inspector-end-column":"12","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto px-3 py-3 safe-area-bottom",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"177","trae-inspector-start-column":"8","trae-inspector-end-line":"247","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"max-w-md mx-auto space-y-2",children:[F.length===0?jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"179","trae-inspector-start-column":"12","trae-inspector-end-line":"183","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-8 text-center",children:[jsxRuntimeExports.jsx(Sparkles,{className:"w-12 h-12 text-gray-700 mx-auto mb-3"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"181","trae-inspector-start-column":"14","trae-inspector-end-line":"181","trae-inspector-end-column":"62","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9A%82%E6%97%A0%E5%8C%B9%E9%85%8D%E7%9A%84%E6%A8%A1%E6%9D%BF%22%2C%22textStartLine%22%3A%22181%22%2C%22textStartColumn%22%3A%2251%22%2C%22textEndLine%22%3A%22181%22%2C%22textEndColumn%22%3A%2258%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm text-gray-500",children:"暂无匹配的模板"}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"182","trae-inspector-start-column":"14","trae-inspector-end-line":"182","trae-inspector-end-column":"72","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E5%B0%9D%E8%AF%95%E6%9B%B4%E6%8D%A2%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D%E6%88%96%E5%88%86%E7%B1%BB%22%2C%22textStartLine%22%3A%22182%22%2C%22textStartColumn%22%3A%2256%22%2C%22textEndLine%22%3A%22182%22%2C%22textEndColumn%22%3A%2268%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs text-gray-600 mt-1",children:"尝试更换搜索关键词或分类"})]}):F.map(g=>jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"186","trae-inspector-start-column":"14","trae-inspector-end-line":"239","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>{p(g),h(!1)},className:"p-3 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-violet-700/30 transition-all cursor-pointer",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"194","trae-inspector-start-column":"16","trae-inspector-end-line":"227","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-start justify-between mb-2",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"195","trae-inspector-start-column":"18","trae-inspector-end-line":"200","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"196","trae-inspector-start-column":"20","trae-inspector-end-line":"198","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 border border-violet-700/30",children:g.category}),jsxRuntimeExports.jsx("h3",{"trae-inspector-start-line":"199","trae-inspector-start-column":"20","trae-inspector-end-line":"199","trae-inspector-end-column":"86","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300",children:g.name})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"201","trae-inspector-start-column":"18","trae-inspector-end-line":"226","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-1",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"202","trae-inspector-start-column":"20","trae-inspector-end-line":"213","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:b=>{b.stopPropagation(),f(g.id)},className:cn("p-1 rounded transition-all",g.isFavorite?"text-yellow-400":"text-gray-600 hover:text-gray-400"),children:jsxRuntimeExports.jsx(Star,{className:cn("w-4 h-4",g.isFavorite?"fill-current":"")})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"214","trae-inspector-start-column":"20","trae-inspector-end-line":"225","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:b=>{b.stopPropagation(),u(g.content,g.id)},className:cn("p-1 rounded transition-all",m===g.id?"text-green-400":"text-gray-600 hover:text-gray-400"),children:m===g.id?jsxRuntimeExports.jsx(Check,{className:"w-4 h-4"}):jsxRuntimeExports.jsx(Copy,{className:"w-4 h-4"})})]})]}),jsxRuntimeExports.jsx("p",{"trae-inspector-start-line":"228","trae-inspector-start-column":"16","trae-inspector-end-line":"228","trae-inspector-end-column":"91","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-xs text-gray-500 line-clamp-2 mb-2",children:g.content}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"229","trae-inspector-start-column":"16","trae-inspector-end-line":"238","trae-inspector-end-column":"22","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"230","trae-inspector-start-column":"18","trae-inspector-end-line":"236","trae-inspector-end-column":"24","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-1",children:g.tags.map(b=>jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"232","trae-inspector-start-column":"22","trae-inspector-end-line":"234","trae-inspector-end-column":"29","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] px-1 py-0.5 rounded bg-gray-800/50 text-gray-500",children:b},b))}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"237","trae-inspector-start-column":"18","trae-inspector-end-line":"237","trae-inspector-end-column":"96","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-600",children:g.createdAt})]})]},g.id)),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"243","trae-inspector-start-column":"10","trae-inspector-end-line":"246","trae-inspector-end-column":"19","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-full p-3 rounded-xl border border-dashed border-gray-700/50 text-gray-500 hover:border-violet-700/50 hover:text-violet-400 transition-all flex items-center justify-center gap-2",children:[jsxRuntimeExports.jsx(BookmarkPlus,{className:"w-4 h-4"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"245","trae-inspector-start-column":"12","trae-inspector-end-line":"245","trae-inspector-end-column":"60","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%B7%BB%E5%8A%A0%E6%96%B0%E6%A8%A1%E6%9D%BF%22%2C%22textStartLine%22%3A%22245%22%2C%22textStartColumn%22%3A%2248%22%2C%22textEndLine%22%3A%22245%22%2C%22textEndColumn%22%3A%2253%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono",children:"添加新模板"})]})]})}),l&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"251","trae-inspector-start-column":"8","trae-inspector-end-line":"326","trae-inspector-end-column":"14","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"252","trae-inspector-start-column":"10","trae-inspector-end-line":"325","trae-inspector-end-column":"16","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"w-full max-w-md bg-gray-950 rounded-t-2xl border-t border-gray-800 max-h-[80vh] flex flex-col",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"253","trae-inspector-start-column":"12","trae-inspector-end-line":"280","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between px-4 py-3 border-b border-gray-800",children:[jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"254","trae-inspector-start-column":"14","trae-inspector-end-line":"259","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"255","trae-inspector-start-column":"16","trae-inspector-end-line":"257","trae-inspector-end-column":"23","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-400 border border-violet-700/30",children:l.category}),jsxRuntimeExports.jsx("h3",{"trae-inspector-start-line":"258","trae-inspector-start-column":"16","trae-inspector-end-line":"258","trae-inspector-end-column":"90","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm font-mono text-gray-300",children:l.name})]}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"260","trae-inspector-start-column":"14","trae-inspector-end-line":"279","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center gap-2",children:[jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"261","trae-inspector-start-column":"16","trae-inspector-end-line":"266","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>h(!x),className:"p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-300",children:jsxRuntimeExports.jsx(PenLine,{className:"w-4 h-4"})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"267","trae-inspector-start-column":"16","trae-inspector-end-line":"272","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>k(l.id),className:"p-1.5 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-400",children:jsxRuntimeExports.jsx(Trash2,{className:"w-4 h-4"})}),jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"273","trae-inspector-start-column":"16","trae-inspector-end-line":"278","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>p(null),className:"p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-300",children:jsxRuntimeExports.jsx(X,{className:"w-4 h-4"})})]})]}),jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"282","trae-inspector-start-column":"12","trae-inspector-end-line":"292","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto p-4",children:x?jsxRuntimeExports.jsx("textarea",{"trae-inspector-start-line":"284","trae-inspector-start-column":"16","trae-inspector-end-line":"288","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",value:l.content,onChange:g=>p({...l,content:g.target.value}),className:"w-full h-full min-h-[300px] px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-700/50 text-sm text-gray-300 resize-none focus:outline-none focus:border-violet-700/50 font-mono"}):jsxRuntimeExports.jsx("pre",{"trae-inspector-start-line":"290","trae-inspector-start-column":"16","trae-inspector-end-line":"290","trae-inspector-end-column":"115","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-sm text-gray-300 whitespace-pre-wrap font-mono",children:l.content})}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"294","trae-inspector-start-column":"12","trae-inspector-end-line":"324","trae-inspector-end-column":"18","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-between px-4 py-3 border-t border-gray-800",children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"295","trae-inspector-start-column":"14","trae-inspector-end-line":"301","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-1",children:l.tags.map(g=>jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"297","trae-inspector-start-column":"18","trae-inspector-end-line":"299","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-500",children:g},g))}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"302","trae-inspector-start-column":"14","trae-inspector-end-line":"323","trae-inspector-end-column":"20","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex gap-2",children:[x&&jsxRuntimeExports.jsx("button",{"trae-inspector-start-line":"304","trae-inspector-start-column":"18","trae-inspector-end-line":"309","trae-inspector-end-column":"27","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E4%BF%9D%E5%AD%98%22%2C%22textStartLine%22%3A%22307%22%2C%22textStartColumn%22%3A%2219%22%2C%22textEndLine%22%3A%22309%22%2C%22textEndColumn%22%3A%2218%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:y,className:"px-3 py-1.5 rounded-lg bg-violet-900/30 text-violet-400 border border-violet-700/50 text-xs font-mono hover:bg-violet-900/50 transition-all",children:"保存"}),jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"311","trae-inspector-start-column":"16","trae-inspector-end-line":"322","trae-inspector-end-column":"25","trae-inspector-file-path":"src/pages/PromptLibrary.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>u(l.content,l.id),className:cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-all",m===l.id?"bg-green-900/30 text-green-400 border border-green-700/50":"bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600"),children:[m===l.id?jsxRuntimeExports.jsx(Check,{className:"w-3 h-3"}):jsxRuntimeExports.jsx(Copy,{className:"w-3 h-3"}),m===l.id?"已复制":"复制"]})]})]})]})})]})}const navItems=[{path:"/",label:"首页",icon:MessageSquare,color:"text-green-400",glow:"rgba(34, 197, 94, 0.5)"},{path:"/team",label:"团队",icon:Users,color:"text-blue-400",glow:"rgba(59, 130, 246, 0.5)"},{path:"/knowledge",label:"知识",icon:BookOpen,color:"text-purple-400",glow:"rgba(168, 85, 247, 0.5)"},{path:"/tasks",label:"任务",icon:ListTodo,color:"text-orange-400",glow:"rgba(251, 146, 60, 0.5)"},{path:"/image",label:"图片",icon:Image,color:"text-pink-400",glow:"rgba(236, 72, 153, 0.5)"},{path:"/code",label:"代码",icon:CodeXml,color:"text-cyan-400",glow:"rgba(34, 211, 238, 0.5)"},{path:"/translate",label:"翻译",icon:Languages,color:"text-amber-400",glow:"rgba(251, 191, 36, 0.5)"},{path:"/prompts",label:"Prompt",icon:Sparkles,color:"text-violet-400",glow:"rgba(139, 92, 246, 0.5)"},{path:"/settings",label:"我的",icon:Settings$1,color:"text-yellow-400",glow:"rgba(250, 204, 21, 0.5)"}];function BottomNav(){const s=useLocation(),[e,t]=reactExports.useState(!1),n=navItems.slice(0,5),a=navItems.slice(5,-1),o=navItems[navItems.length-1];return jsxRuntimeExports.jsx("nav",{"trae-inspector-start-line":"36","trae-inspector-start-column":"4","trae-inspector-end-line":"134","trae-inspector-end-column":"10","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-shrink-0 bg-gray-950/95 backdrop-blur-md border-t border-green-900/40 px-1 py-1.5 safe-area-bottom",children:jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"37","trae-inspector-start-column":"6","trae-inspector-end-line":"133","trae-inspector-end-column":"12","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex items-center justify-around max-w-md mx-auto",children:[n.map(i=>{const c=s.pathname===i.path,l=i.icon;return jsxRuntimeExports.jsxs(NavLink,{to:i.path,className:cn("flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px]",c?"scale-105":"opacity-60 hover:opacity-100"),children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"50","trae-inspector-start-column":"14","trae-inspector-end-line":"58","trae-inspector-end-column":"20","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("p-1 rounded-lg transition-all",c?"bg-gray-800/80":""),style:c?{boxShadow:`0 0 12px ${i.glow}`}:{},children:jsxRuntimeExports.jsx(l,{className:cn("w-5 h-5",c?i.color:"text-gray-500"),style:c?{filter:`drop-shadow(0 0 4px ${i.glow})`}:{}})}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"59","trae-inspector-start-column":"14","trae-inspector-end-line":"64","trae-inspector-end-column":"21","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[9px] font-mono tracking-wide",c?i.color:"text-gray-600"),children:i.label})]},i.path)}),jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"69","trae-inspector-start-column":"8","trae-inspector-end-line":"107","trae-inspector-end-column":"14","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"relative",children:[jsxRuntimeExports.jsxs("button",{"trae-inspector-start-line":"70","trae-inspector-start-column":"10","trae-inspector-end-line":"81","trae-inspector-end-column":"19","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",onClick:()=>t(!e),className:cn("flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px]",e?"scale-105 opacity-100":"opacity-60 hover:opacity-100"),children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"77","trae-inspector-start-column":"12","trae-inspector-end-line":"79","trae-inspector-end-column":"18","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"p-1 rounded-lg bg-gray-800/80",children:jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"78","trae-inspector-start-column":"14","trae-inspector-end-line":"78","trae-inspector-end-column":"48","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%2B%22%2C%22textStartLine%22%3A%2278%22%2C%22textStartColumn%22%3A%2240%22%2C%22textEndLine%22%3A%2278%22%2C%22textEndColumn%22%3A%2241%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-lg",children:"+"})}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"80","trae-inspector-start-column":"12","trae-inspector-end-line":"80","trae-inspector-end-column":"74","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22text%22%3A%22%E6%9B%B4%E5%A4%9A%22%2C%22textStartLine%22%3A%2280%22%2C%22textStartColumn%22%3A%2265%22%2C%22textEndLine%22%3A%2280%22%2C%22textEndColumn%22%3A%2267%22%2C%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[9px] font-mono text-gray-500",children:"更多"})]}),e&&jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"84","trae-inspector-start-column":"12","trae-inspector-end-line":"105","trae-inspector-end-column":"18","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900/95 border border-gray-800 rounded-xl p-2 shadow-xl z-50",children:jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"85","trae-inspector-start-column":"14","trae-inspector-end-line":"104","trae-inspector-end-column":"20","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"grid grid-cols-2 gap-1",children:a.map(i=>{const c=s.pathname===i.path,l=i.icon;return jsxRuntimeExports.jsxs(NavLink,{to:i.path,onClick:()=>t(!1),className:cn("flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",c?`${i.color} bg-gray-800/80`:"text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"),children:[jsxRuntimeExports.jsx(l,{className:"w-4 h-4"}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"100","trae-inspector-start-column":"22","trae-inspector-end-line":"100","trae-inspector-end-column":"81","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"text-[10px] font-mono",children:i.label})]},i.path)})})})]}),jsxRuntimeExports.jsxs(NavLink,{to:o.path,className:cn("flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[48px]",s.pathname===o.path?"scale-105":"opacity-60 hover:opacity-100"),children:[jsxRuntimeExports.jsx("div",{"trae-inspector-start-line":"117","trae-inspector-start-column":"10","trae-inspector-end-line":"125","trae-inspector-end-column":"16","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("p-1 rounded-lg transition-all",s.pathname===o.path?"bg-gray-800/80":""),style:s.pathname===o.path?{boxShadow:`0 0 12px ${o.glow}`}:{},children:jsxRuntimeExports.jsx(Settings$1,{className:cn("w-5 h-5",s.pathname===o.path?o.color:"text-gray-500"),style:s.pathname===o.path?{filter:`drop-shadow(0 0 4px ${o.glow})`}:{}})}),jsxRuntimeExports.jsx("span",{"trae-inspector-start-line":"126","trae-inspector-start-column":"10","trae-inspector-end-line":"131","trae-inspector-end-column":"17","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:cn("text-[9px] font-mono tracking-wide",s.pathname===o.path?o.color:"text-gray-600"),children:o.label})]},o.path)]})})}function TeamPage(){return jsxRuntimeExports.jsx(Dashboard,{initialView:"team"})}function AppLayout(){return jsxRuntimeExports.jsxs("div",{"trae-inspector-start-line":"144","trae-inspector-start-column":"4","trae-inspector-end-line":"162","trae-inspector-end-column":"10","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"relative h-screen w-screen overflow-hidden flex flex-col bg-gray-950",children:[jsxRuntimeExports.jsx(MatrixBackground,{opacity:.06,speed:80}),jsxRuntimeExports.jsx("main",{"trae-inspector-start-line":"147","trae-inspector-start-column":"6","trae-inspector-end-line":"159","trae-inspector-end-column":"13","trae-inspector-file-path":"src/App.tsx","trae-inspector-static-props":"%7B%22cwd%22%3A%22%2Fhome%2Frunner%2Fwork%2Fhopeai%2Fhopeai%22%7D",className:"flex-1 overflow-y-auto relative z-10 overscroll-contain",children:jsxRuntimeExports.jsxs(Routes,{children:[jsxRuntimeExports.jsx(Route,{path:"/",element:jsxRuntimeExports.jsx(Dashboard,{})}),jsxRuntimeExports.jsx(Route,{path:"/team",element:jsxRuntimeExports.jsx(TeamPage,{})}),jsxRuntimeExports.jsx(Route,{path:"/knowledge",element:jsxRuntimeExports.jsx(Knowledge,{})}),jsxRuntimeExports.jsx(Route,{path:"/tasks",element:jsxRuntimeExports.jsx(Tasks,{})}),jsxRuntimeExports.jsx(Route,{path:"/image",element:jsxRuntimeExports.jsx(ImageAnalyzer,{})}),jsxRuntimeExports.jsx(Route,{path:"/code",element:jsxRuntimeExports.jsx(CodeGenerator,{})}),jsxRuntimeExports.jsx(Route,{path:"/translate",element:jsxRuntimeExports.jsx(Translator,{})}),jsxRuntimeExports.jsx(Route,{path:"/prompts",element:jsxRuntimeExports.jsx(PromptLibrary,{})}),jsxRuntimeExports.jsx(Route,{path:"/settings",element:jsxRuntimeExports.jsx(Settings,{})})]})}),jsxRuntimeExports.jsx(BottomNav,{})]})}function App(){return jsxRuntimeExports.jsx(HashRouter,{children:jsxRuntimeExports.jsx(AppLayout,{})})}clientExports.createRoot(document.getElementById("root")).render(jsxRuntimeExports.jsx(reactExports.StrictMode,{children:jsxRuntimeExports.jsx(App,{})}));
