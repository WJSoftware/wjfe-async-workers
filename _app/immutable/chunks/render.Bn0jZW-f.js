import{v as I,i as L,w as k,x as T,y as M,z as V,A as H,B as E,n as m,m as D,l as Y,u as y,C as q,D as B,F as C,G as P,I as $,J as z,q as F,K as G,k as b,e as J,L as K,M as W}from"./runtime.DT-UpLof.js";import{a as j}from"./disclose-version.aPAWe3KU.js";const N=new Set,R=new Set;function rr(a){for(var r=0;r<a.length;r++)N.add(a[r]);for(var s of R)s(a)}function v(a){var A;var r=this,s=r.ownerDocument,l=a.type,i=((A=a.composedPath)==null?void 0:A.call(a))||[],t=i[0]||a.target,d=0,c=a.__root;if(c){var f=i.indexOf(c);if(f!==-1&&(r===document||r===window)){a.__root=r;return}var u=i.indexOf(r);if(u===-1)return;f<=u&&(d=f)}if(t=i[d]||a.target,t!==r){I(a,"currentTarget",{configurable:!0,get(){return t||s}});try{for(var _,e=[];t!==null;){var o=t.parentNode||t.host||null;try{var n=t["__"+l];if(n!==void 0&&!t.disabled)if(L(n)){var[g,...p]=n;g.apply(t,[a,...p])}else n.call(t,a)}catch(w){_?e.push(w):_=w}if(a.cancelBubble||o===r||o===null)break;t=o}if(_){for(let w of e)queueMicrotask(()=>{throw w});throw _}}finally{a.__root=r,t=r}}}const Q=["wheel","mousewheel","touchstart","touchmove"];function U(a){return Q.includes(a)}function ar(a,r){r!==(a.__t??(a.__t=a.nodeValue))&&(a.__t=r,a.nodeValue=r==null?"":r+"")}function X(a,r){const s=r.anchor??r.target.appendChild(k());return O(a,{...r,anchor:s})}function tr(a,r){T(),r.intro=r.intro??!1;const s=r.target,l=b,i=y;try{for(var t=M(s);t&&(t.nodeType!==8||t.data!==V);)t=H(t);if(!t)throw E;m(!0),D(t),Y();const d=O(a,{...r,anchor:t});if(y===null||y.nodeType!==8||y.data!==q)throw B(),E;return m(!1),d}catch(d){if(d===E)return r.recover===!1&&C(),T(),P(s),m(!1),X(a,r);throw d}finally{m(l),D(i)}}const h=new Map;function O(a,{target:r,anchor:s,props:l={},events:i,context:t,intro:d=!0}){T();var c=new Set,f=e=>{for(var o=0;o<e.length;o++){var n=e[o];if(!c.has(n)){c.add(n);var g=U(n);r.addEventListener(n,v,{passive:g});var p=h.get(n);p===void 0?(document.addEventListener(n,v,{passive:g}),h.set(n,1)):h.set(n,p+1)}}};f($(N)),R.add(f);var u=void 0,_=z(()=>(F(()=>{if(t){G({});var e=W;e.c=t}i&&(l.$$events=i),b&&j(s,null),u=a(s,l)||{},b&&(J.nodes_end=y),t&&K()}),()=>{for(var e of c){r.removeEventListener(e,v);var o=h.get(e);--o===0?(document.removeEventListener(e,v),h.delete(e)):h.set(e,o)}R.delete(f),S.delete(u)}));return S.set(u,_),u}let S=new WeakMap;function er(a){const r=S.get(a);r==null||r()}export{rr as d,tr as h,X as m,ar as s,er as u};
