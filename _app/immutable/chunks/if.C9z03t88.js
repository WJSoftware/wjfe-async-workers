import{S as R,o as k,a as L,s as q,b as y,c as _,U as l,g as T,d as w,e as F,f as H,h as K,i as M,j as U,k as E,l as Y,H as B,r as C,m as Z,n as I,p as O,q as S,t as D,u as z,E as G}from"./runtime.DT-UpLof.js";function g(s,b=null,P){if(typeof s!="object"||s===null||R in s)return s;const c=K(s);if(c!==k&&c!==L)return s;var i=new Map,v=M(s),d=y(0),u;return new Proxy(s,{defineProperty(n,e,t){(!("value"in t)||t.configurable===!1||t.enumerable===!1||t.writable===!1)&&q();var r=i.get(e);return r===void 0?(r=y(t.value),i.set(e,r)):_(r,g(t.value,u)),!0},deleteProperty(n,e){var t=i.get(e),r=t!==void 0?t.v!==l:e in n;return t!==void 0&&_(t,l),r&&j(d),r},get(n,e,t){var o;if(e===R)return s;var r=i.get(e),f=e in n;if(r===void 0&&(!f||(o=T(n,e))!=null&&o.writable)&&(r=y(g(f?n[e]:l,u),null),i.set(e,r)),r!==void 0){var a=w(r);return a===l?void 0:a}return Reflect.get(n,e,t)},getOwnPropertyDescriptor(n,e){var t=Reflect.getOwnPropertyDescriptor(n,e);if(t&&"value"in t){var r=i.get(e);r&&(t.value=w(r))}else if(t===void 0){var f=i.get(e),a=f==null?void 0:f.v;if(f!==void 0&&a!==l)return{enumerable:!0,configurable:!0,value:a,writable:!0}}return t},has(n,e){var a;if(e===R)return!0;var t=i.get(e),r=t!==void 0&&t.v!==l||Reflect.has(n,e);if(t!==void 0||F!==null&&(!r||(a=T(n,e))!=null&&a.writable)){t===void 0&&(t=y(r?g(n[e],u):l,null),i.set(e,t));var f=w(t);if(f===l)return!1}return r},set(n,e,t,r){var A;var f=i.get(e),a=e in n;if(f===void 0?(!a||(A=T(n,e))!=null&&A.writable)&&(f=y(void 0),_(f,g(t,u)),i.set(e,f)):(a=f.v!==l,_(f,g(t,u))),v&&e==="length")for(var o=t;o<n.length;o+=1){var N=i.get(o+"");N!==void 0&&_(N,l)}var h=Reflect.getOwnPropertyDescriptor(n,e);if(h!=null&&h.set&&h.set.call(r,t),!a){if(v&&typeof e=="string"){var m=i.get("length");if(m!==void 0){var x=Number(e);Number.isInteger(x)&&x>=m.v&&_(m,x+1)}}j(d)}return!0},ownKeys(n){w(d);var e=Reflect.ownKeys(n).filter(f=>{var a=i.get(f);return a===void 0||a.v!==l});for(var[t,r]of i)r.v!==l&&!(t in n)&&e.push(t);return e},setPrototypeOf(){H()}})}function j(s,b=1){_(s,s.v+b)}function Q(s,b,P,c=null,i=!1){E&&Y();var v=s,d=null,u=null,n=null,e=i?G:0;U(()=>{if(n===(n=!!b()))return;let t=!1;if(E){const r=v.data===B;n===r&&(v=C(),Z(v),I(!1),t=!0)}n?(d?O(d):d=S(()=>P(v)),u&&D(u,()=>{u=null})):(u?O(u):c&&(u=S(()=>c(v))),d&&D(d,()=>{d=null})),t&&I(!0)},e),E&&(v=z)}export{Q as i,g as p};
