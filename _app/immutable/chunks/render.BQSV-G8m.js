import{q as I,d as O,i as V,c as M,a as T,g as H,H as W,b as q,e as v,s as E,f as L,h as B,j as p,k as Y,l as C,m as P,n as $,o as j,p as z,r as G,t as U,u as b,v as x,w as F,x as J}from"./runtime.DnJ25dge.js";import{a as K}from"./disclose-version.BbTG94Gn.js";const R=new Set,S=new Set;function nt(t,r,a,i){function n(e){if(i.capture||y.call(r,e),!e.cancelBubble)return a.call(this,e)}return t.startsWith("pointer")||t.startsWith("touch")||t==="wheel"?I(()=>{r.addEventListener(t,n,i)}):r.addEventListener(t,n,i),n}function ot(t){for(var r=0;r<t.length;r++)R.add(t[r]);for(var a of S)a(t)}function y(t){var A;var r=this,a=r.ownerDocument,i=t.type,n=((A=t.composedPath)==null?void 0:A.call(t))||[],e=n[0]||t.target,c=0,f=t.__root;if(f){var d=n.indexOf(f);if(d!==-1&&(r===document||r===window)){t.__root=r;return}var l=n.indexOf(r);if(l===-1)return;d<=l&&(c=d)}if(e=n[c]||t.target,e!==r){O(t,"currentTarget",{configurable:!0,get(){return e||a}});try{for(var _,o=[];e!==null;){var u=e.parentNode||e.host||null;try{var s=e["__"+i];if(s!==void 0&&!e.disabled)if(V(s)){var[g,...w]=s;g.apply(e,[t,...w])}else s.call(e,t)}catch(m){_?o.push(m):_=m}if(t.cancelBubble||u===r||u===null)break;e=u}if(_){for(let m of o)queueMicrotask(()=>{throw m});throw _}}finally{t.__root=r,delete t.currentTarget}}}function st(t){return t.endsWith("capture")&&t!=="gotpointercapture"&&t!=="lostpointercapture"}const Q=["beforeinput","click","change","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"];function it(t){return Q.includes(t)}const X={formnovalidate:"formNoValidate",ismap:"isMap",nomodule:"noModule",playsinline:"playsInline",readonly:"readOnly"};function ut(t){return t=t.toLowerCase(),X[t]??t}const Z=["wheel","mousewheel","touchstart","touchmove"];function tt(t){return Z.includes(t)}let N=!0;function ct(t,r){r!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=r,t.nodeValue=r==null?"":r+"")}function rt(t,r){const a=r.anchor??r.target.appendChild(M());return D(t,{...r,anchor:a})}function dt(t,r){T(),r.intro=r.intro??!1;const a=r.target,i=b,n=p;try{for(var e=H(a);e&&(e.nodeType!==8||e.data!==W);)e=q(e);if(!e)throw v;E(!0),L(e),B();const c=D(t,{...r,anchor:e});if(p===null||p.nodeType!==8||p.data!==Y)throw C(),v;return E(!1),c}catch(c){if(c===v)return r.recover===!1&&P(),T(),$(a),E(!1),rt(t,r);throw c}finally{E(i),L(n)}}const h=new Map;function D(t,{target:r,anchor:a,props:i={},events:n,context:e,intro:c=!0}){T();var f=new Set,d=o=>{for(var u=0;u<o.length;u++){var s=o[u];if(!f.has(s)){f.add(s);var g=tt(s);r.addEventListener(s,y,{passive:g});var w=h.get(s);w===void 0?(document.addEventListener(s,y,{passive:g}),h.set(s,1)):h.set(s,w+1)}}};d(j(R)),S.add(d);var l=void 0,_=z(()=>(G(()=>{if(e){U({});var o=J;o.c=e}n&&(i.$$events=n),b&&K(a,null),N=c,l=t(a,i)||{},N=!0,b&&(x.nodes_end=p),e&&F()}),()=>{for(var o of f){r.removeEventListener(o,y);var u=h.get(o);--u===0?(document.removeEventListener(o,y),h.delete(o)):h.set(o,u)}S.delete(d),k.delete(l)}));return k.set(l,_),l}let k=new WeakMap;function lt(t){const r=k.get(t);r&&r()}export{it as a,N as b,nt as c,ot as d,dt as h,st as i,rt as m,ut as n,ct as s,lt as u};
