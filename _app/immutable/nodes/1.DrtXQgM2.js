import{b as v,t as h}from"../chunks/disclose-version.CDFaQKQs.js";import{a2 as $,a3 as i,_ as x,a4 as f,w,a5 as k,d,a6 as y,a7 as u,a8 as E,F,c as S,Y,$ as Z,a9 as j,Z as q,aa as b,ab as p,ac as z}from"../chunks/runtime.B5iBlMNN.js";import{s as l}from"../chunks/render.CCdZdc1B.js";import{s as A}from"../chunks/entry.B6GIzmWt.js";function B(){const s=x,e=s.l.u;e&&(e.b.length&&$(()=>{g(s),f(e.b)}),i(()=>{const t=w(()=>e.m.map(k));return()=>{for(const r of t)typeof r=="function"&&r()}}),e.a.length&&i(()=>{g(s),f(e.a)}))}function g(s){if(s.l.s)for(const e of s.l.s)d(e);y(s.s)}function C(s,e,t){if(s==null)return e(void 0),u;const r=s.subscribe(e,t);return r.unsubscribe?()=>r.unsubscribe():r}function D(s,e,t){const r=t[e]??(t[e]={store:null,source:F(void 0,null),unsubscribe:u});if(r.store!==s)if(r.unsubscribe(),r.store=s??null,s==null)r.source.v=void 0,r.unsubscribe=u;else{var a=!0;r.unsubscribe=C(s,n=>{a?r.source.v=n:S(r.source,n)}),a=!1}return d(r.source)}function G(){const s={};return E(()=>{for(var e in s)s[e].unsubscribe()}),s}const H=()=>{const s=A;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},I={subscribe(s){return H().page.subscribe(s)}};var J=h("<h1> </h1> <p> </p>",1);function O(s,e){Y(e,!1);const t=G(),r=()=>D(I,"$page",t);B();var a=J(),n=Z(a),m=b(n);p(n);var o=z(n,2),_=b(o);p(o),j(()=>{var c;l(m,r().status),l(_,(c=r().error)==null?void 0:c.message)}),v(s,a),q()}export{O as component};