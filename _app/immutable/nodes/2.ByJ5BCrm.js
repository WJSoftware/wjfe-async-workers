var yt=Object.defineProperty;var Qe=t=>{throw TypeError(t)};var It=(t,e,r)=>e in t?yt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var Q=(t,e,r)=>It(t,typeof e!="symbol"?e+"":e,r),Ee=(t,e,r)=>e.has(t)||Qe("Cannot "+r);var n=(t,e,r)=>(Ee(t,e,"read from private field"),r?r.call(t):e.get(t)),f=(t,e,r)=>e.has(t)?Qe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),d=(t,e,r,a)=>(Ee(t,e,"write to private field"),a?a.call(t,r):e.set(t,r),r),L=(t,e,r)=>(Ee(t,e,"access private method"),r);var qe=(t,e,r,a)=>({set _(s){d(t,e,s,r)},get _(){return n(t,e,a)}});import{c as Re,b as k,t as A,d as xt}from"../chunks/disclose-version.CDFaQKQs.js";import{k as J,l as St,ai as At,j as Et,aj as qt,c as S,q as de,af as Ct,a7 as $e,b as F,F as Ve,ak as Ze,al as Ke,am as Xe,p as Ce,t as We,ag as Wt,u as Mt,_ as jt,an as Nt,ao as Ot,ae as nt,$ as me,ac as v,aa as l,ap as ve,ab as c,Y as Pt,a3 as Tt,a9 as se,Z as Rt,d as u,aq as $t}from"../chunks/runtime.B5iBlMNN.js";import{i as ne,p as Lt,a as it}from"../chunks/props.BTOpYXkz.js";import{d as Ft,s as fe}from"../chunks/render.CCdZdc1B.js";const Me=0,he=1,je=2;function Bt(t,e,r,a,s){J&&St();var i=t,y=At(),_=jt,p,o,m,g,b=y?F(void 0):Ve(void 0),T=y?F(void 0):Ve(void 0),M=!1;function q(w,R){M=!0,R&&(Ze(j),Ke(j),Xe(_)),w===Me&&r&&(o?Ce(o):o=de(()=>r(i))),w===he&&a&&(m?Ce(m):m=de(()=>a(i,b))),w===je&&s&&(g?Ce(g):g=de(()=>s(i,T))),w!==Me&&o&&We(o,()=>o=null),w!==he&&m&&We(m,()=>m=null),w!==je&&g&&We(g,()=>g=null),R&&(Xe(null),Ke(null),Ze(null),Wt())}var j=Et(()=>{if(p!==(p=e())){if(qt(p)){var w=p;M=!1,w.then(R=>{w===p&&(S(b,R),q(he,!0))},R=>{w===p&&(S(T,R),q(je,!0))}),J?r&&(o=de(()=>r(i))):Ct(()=>{M||q(Me,!0)})}else S(b,p),q(he,!1);return $e}});J&&(i=Mt)}let et=!1;function ot(){et||(et=!0,document.addEventListener("reset",t=>{Promise.resolve().then(()=>{var e;if(!t.defaultPrevented)for(const r of t.target.elements)(e=r.__on_r)==null||e.call(r)})},{capture:!0}))}function tt(t){if(J){var e=!1,r=()=>{if(!e){if(e=!0,t.hasAttribute("value")){var a=t.value;O(t,"value",null),t.value=a}if(t.hasAttribute("checked")){var s=t.checked;O(t,"checked",null),t.checked=s}}};t.__on_r=r,Ot(r),ot()}}function O(t,e,r,a){r=r==null?null:r+"";var s=t.__attributes??(t.__attributes={});J&&(s[e]=t.getAttribute(e),e==="src"||e==="href"||e==="srcset")||s[e]!==(s[e]=r)&&(e==="loading"&&(t[Nt]=r),r===null?t.removeAttribute(e):t.setAttribute(e,r))}function rt(t,e){var r=t.__className,a=Dt(e);J&&t.className===a?t.__className=a:(r!==a||J&&t.className!==a)&&(e==null?t.removeAttribute("class"):t.className=a,t.__className=a)}function Dt(t){return t??""}function lt(t,e,r,a=r){t.addEventListener(e,r);const s=t.__on_r;s?t.__on_r=()=>{s(),a()}:t.__on_r=a,ot()}function Ut(t,e,r){lt(t,"input",()=>{r(at(t)?st(t.value):t.value)}),nt(()=>{var a=e();if(J&&t.defaultValue!==t.value){r(t.value);return}at(t)&&a===st(t.value)||t.type==="date"&&!a&&!t.value||(t.value=a??"")})}function Gt(t,e,r){lt(t,"change",()=>{var a=t.checked;r(a)}),e()==null&&r(!1),nt(()=>{var a=e();t.checked=!!a})}function at(t){var e=t.type;return e==="number"||e==="range"}function st(t){return t===""?null:+t}var zt=A(`<div class="row"><div class="col"><div class="alert alert-warning"><h3><i class="bi bi-house-lock-fill"></i>&nbsp;Cross-Origin Not Isolated</h3> <p>Unfortunately, cross-origin isolation requirements are not fulfilled.  This means that synchronization 
                    objects cannot be used as they depend on <code>SharedArrayBuffer</code>.</p> <p>Without the possiblity of using <code>SharedArrayBuffer</code>, the only way to cancel a work item 
                    (task) is by cancelling it before it starts.  Generally speaking, the following cannot be used:</p> <ul><li><code>ManualResetEvent</code></li> <li><code>AutoResetEvent</code></li> <li><code>CancellationSource</code></li></ul> <p>In order to solve this problem in your own project/site, <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">read about the security requirements in the MDN website</a>.</p></div></div></div>`);function Ht(t){var e=Re(),r=me(e);ne(r,()=>!crossOriginIsolated,a=>{var s=zt();k(a,s)}),k(t,e)}var Jt=A(`<p>Since cross origin is isolated (see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">the requirements</a> here), you may pause or cancel the worker at any time.</p> <p><strong>NOTE:</strong> Notice how significant the pause wait is in terms of performance.  Waiting on the 
            token is expensive for sure, so do this only on well-thought-out scenarios.</p>`,1),Yt=A('Since cross origin is not isolated (see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements" target="_blank">the requirements</a> here), you may only cancel the worker before it starts.  Furthermore, you cannot pause the worker.',1),Qt=A(`<div class="alert alert-info"><h3><i class="bi bi-journal-text"></i>&nbsp;Instructions</h3> <p>Play around with the three work items below.  Each will run the same example worker, which is a worker that 
        calculates prime numbers using a not-so-good algorithm that runs up to the shown number.  All three work items 
        use the same worker object, so they run serially between each other.</p> <!></div>`);function Vt(t){var e=Qt(),r=v(l(e),4);ne(r,()=>crossOriginIsolated,a=>{var s=Jt();ve(2),k(a,s)},a=>{var s=Yt();ve(2),k(a,s)}),c(e),k(t,e)}var ie,V,_e;class Zt{constructor(e){f(this,ie);f(this,V);f(this,_e);if(!crossOriginIsolated)throw new Error("Cannot operate:  Cross origin is not isolated. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements for details.");d(this,ie,new SharedArrayBuffer(8)),d(this,V,new Int32Array(n(this,ie))),d(this,_e,e),Atomics.store(n(this,V),1,e)}get token(){return n(this,V)}signal(){Atomics.store(n(this,V),0,1)}}ie=new WeakMap,V=new WeakMap,_e=new WeakMap;function Ne(t,e,r,a){if(Atomics.load(t,1)!==e)throw new Error(`The provided token is not that of ${a} ${r}.`)}const ct=1,Oe=[ct,"manually-reset event","a"];class Be extends Zt{constructor(){super(ct)}signal(){super.signal(),Atomics.notify(super.token,0)}reset(){Atomics.store(super.token,0,0)}static isSignalled(e){return Ne(e,...Oe),Atomics.load(e,0)===1}static wait(e,r){return Ne(e,...Oe),Atomics.wait(e,0,0,r)}static async waitAsync(e,r){Ne(e,...Oe);const a=Atomics.waitAsync(e,0,0,r);return a.async?await a.value:a.value}}class ut extends Error{constructor(e,r){super(e,r)}}class pe extends Be{reset(){throw new Error("Cancellation tokens cannot be reset.")}static throwIfSignalled(e){if(e&&this.isSignalled(e))throw new ut}}var oe;class ue{constructor(e){f(this,oe);d(this,oe,e)}get cancelledBeforeStarted(){return n(this,oe)}}oe=new WeakMap;var D,U,Z;class Kt{constructor(){f(this,D);f(this,U);f(this,Z);d(this,D,{}),d(this,U,0),d(this,Z,0)}get length(){return n(this,Z)-n(this,U)}get isEmpty(){return this.length===0}enqueue(e){return n(this,D)[n(this,Z)]=e,qe(this,Z)._++}dequeue(){if(this.isEmpty)throw new Error("Cannot dequeue from an empty queue.");const e=n(this,D)[n(this,U)];return delete n(this,D)[qe(this,U)._++],e}peek(){if(this.isEmpty)throw new Error("Cannot peek on an empty queue.");return n(this,D)[n(this,U)]}}D=new WeakMap,U=new WeakMap,Z=new WeakMap;let Xt=0;function er(){return++Xt}function tr(t){var e;return((e=t==null?void 0:t.payload)==null?void 0:e._$cancelled)===!0&&typeof t.workItemId=="number"}function rr(t){return typeof t.workItemId=="number"}var C,K,ge,dt;class ar{constructor(e){f(this,ge);f(this,C);f(this,K);d(this,C,e),d(this,K,new Map)}connect(e,r,a,s){const i=L(this,ge,dt).call(this,e,r,a);return n(this,C).port.addEventListener("message",i),n(this,C).port.start(),n(this,C).addEventListener("error",s),n(this,K).set(e,s),()=>{n(this,C).removeEventListener("error",s),n(this,C).port.removeEventListener("message",i),n(this,K).delete(e)}}post(e,r){n(this,C).port.postMessage(e,{transfer:r})}terminate(){throw new Error("Shared workers cannot be terminated.")}}C=new WeakMap,K=new WeakMap,ge=new WeakSet,dt=function(e,r,a){return s=>{var i;tr(s.data)&&s.data.workItemId===e?(console.log("Received a cancellation: %o",s.data),(i=n(this,K).get(e))==null||i(new ue(!1))):rr(s.data)&&s.data.workItemId===e?r(s.data.payload)&&a(s.data.payload):console.warn("Work item ID %d:  Unidentified message event: %o",e,s)}};var le;class Le{constructor(e){f(this,le);d(this,le,e)}get id(){return n(this,le)}}le=new WeakMap;function sr(t){var e;return((e=t==null?void 0:t.payload)==null?void 0:e._$cancelled)===!0&&typeof t.workItemId=="number"}function nr(t){return typeof t.workItemId=="number"}var W,G,z,we,ft;class ir{constructor(e){f(this,we);f(this,W);f(this,G);f(this,z);d(this,W,e),d(this,G,!1),d(this,z,new Map)}connect(e,r,a,s){n(this,G)&&s(new Le(e));const i=L(this,we,ft).call(this,e,r,a);return n(this,W).addEventListener("message",i),n(this,W).addEventListener("error",s),n(this,z).set(e,s),()=>{n(this,W).removeEventListener("error",s),n(this,W).removeEventListener("message",i),n(this,z).delete(e)}}post(e,r){if(n(this,G))throw new Error("The worker has been terminated and cannot accept new messages.");n(this,W).postMessage(e,{transfer:r})}terminate(){if(n(this,G))return!1;n(this,W).terminate();for(let[e,r]of n(this,z).entries())r(new Le(e));return d(this,G,!0)}}W=new WeakMap,G=new WeakMap,z=new WeakMap,we=new WeakSet,ft=function(e,r,a){return s=>{var i;sr(s.data)&&s.data.workItemId===e?(console.log("Received a cancellation: %o",s.data),(i=n(this,z).get(e))==null||i(new ue(!1))):nr(s.data)&&s.data.workItemId===e?r(s.data.payload)&&a(s.data.payload):console.warn("Work item ID %d:  Unidentified message event: %o",e,s)}};var x;class or{constructor(e){f(this,x);d(this,x,e)}get promise(){return n(this,x).data.promise}get id(){return n(this,x).data.id}get status(){return n(this,x).status}cancel(){return n(this,x).cancellationSource&&n(this,x).cancellationSource.signal(),this.status===B.Enqueued&&n(this,x).data.reject(new ue(!0)),n(this,x).cancellationSource||!n(this,x).disconnect}}x=new WeakMap;var ke,ht;class lr{constructor(e,r,a){f(this,ke);Q(this,"worker");Q(this,"data");Q(this,"options");Q(this,"cancellationSource");Q(this,"status");Q(this,"disconnect");this.status=B.Enqueued,this.worker=e,this.data={...r,resolve:s=>{var i;r.resolve(s),(i=this.disconnect)==null||i.call(this),this.status=B.Completed},reject:s=>{var i;r.reject(s),s instanceof ue?this.status=B.Cancelled:s instanceof Le?this.status=B.Terminated:this.status=B.Completed,(i=this.disconnect)==null||i.call(this)}},this.options=a,this.cancellationSource=a!=null&&a.cancellable?new pe:void 0}start(){var r,a,s;if(this.cancellationSource&&pe.isSignalled(this.cancellationSource.token))return;this.disconnect=this.worker.connect(this.data.id,((r=this.options)==null?void 0:r.processMessage)??L(this,ke,ht).bind(this),this.data.resolve,this.data.reject),this.status=B.Started;const e={workItemId:this.data.id,task:this.data.task,cancelToken:(a=this.cancellationSource)==null?void 0:a.token,payload:this.data.payload};this.worker.post(e,(s=this.options)==null?void 0:s.transferables)}}ke=new WeakSet,ht=function(e){return!0};const B=Object.freeze({Enqueued:0,Started:1,Cancelled:2,Terminated:3,Completed:4});var re,X,H,ce,P,mt,vt,Fe;class cr{constructor(e,r){f(this,P);f(this,re);f(this,X);f(this,H);f(this,ce);d(this,re,e instanceof Worker?new ir(e):new ar(e)),d(this,X,new Kt),d(this,H,!1),d(this,ce,Object.keys(r).reduce((a,s)=>(a[s]=L(this,P,vt).bind(this,s),a),{}))}get enqueue(){return n(this,ce)}terminate(){return n(this,re).terminate()}}re=new WeakMap,X=new WeakMap,H=new WeakMap,ce=new WeakMap,P=new WeakSet,mt=function(){let e,r;const a=new Promise((s,i)=>{e=s,r=i});return{resolve:e,reject:r,promise:a}},vt=function(e,r,a){const s=er(),{resolve:i,reject:y,promise:_}=L(this,P,mt).call(this),p={id:s,task:e,promise:_,resolve:i,reject:y,payload:r},o=new lr(n(this,re),p,a);return n(this,H)&&!(a!=null&&a.outOfOrder)?n(this,X).enqueue(o):(a!=null&&a.outOfOrder||(d(this,H,!0),_.finally(L(this,P,Fe).bind(this))),o.start()),new or(o)},Fe=function(){if(n(this,X).isEmpty)d(this,H,!1);else{const e=n(this,X).dequeue();e.data.promise.finally(L(this,P,Fe).bind(this)),d(this,H,!0),e.start()}};function ur(t){return typeof t.workItemId=="number"&&t.task&&typeof t.task=="string"}function Pe(t,e,r){self.postMessage({workItemId:t,payload:e},r)}function dr(t){return e=>{if(!ur(e.data))return;const r=t[e.data.task];if(typeof r!="function"){console.warn('Async message with task "$s" yields no task function.');return}try{const a=r(e.data.payload,Pe.bind(null,e.data.workItemId),e.data.cancelToken);Pe(e.data.workItemId,a)}catch(a){a instanceof ut&&Pe(e.data.workItemId,{_$cancelled:!0})}}}let fr=0;function hr(t){return`control-${++fr}`}function mr(t,e,r,a,s,i,y,_,p,o,m){var g;if(((g=u(e))==null?void 0:g.status)===B.Started){S(r,!u(r));return}S(a,0),S(s,0),S(i,!0),S(e,it(y.worker.enqueue.calculatePrimes({to:_(),pause:u(p)?o==null?void 0:o.token:void 0},{processMessage:m,cancellable:crossOriginIsolated})))}function vr(t,e,r){var a;(a=u(e))==null||a.cancel(),S(r,!1)}var pr=A('<div><span class="display-2"><!></span> <span class="fs-6">Total primes: <!></span></div>'),_r=A('<span class="badge text-bg-secondary ms-auto"> </span>'),gr=A('<p>Press <span class="badge text-bg-primary">Start</span> to discover primes.</p>'),wr=A('<div class="class alert alert-danger"><h3>An Error Occurred</h3> <details><summary>Details</summary> <pre> </pre></details></div>'),kr=A('<span class="display-2"><!></span>'),br=A('<div class="card h-100"><div class="card-header d-flex flex-row flex-nowrap align-items-baseline"><h5>Primes to <!></h5> <!></div> <div class="card-body text-center d-flex flex-column justify-content-center align-items-center"><div class="row w-100"><div class="col"><input type="range" class="form-range"></div></div> <!></div> <ul class="list-group list-group-flush"><li class="list-group-item"><input type="checkbox" class="form-check-input"> <label>Run as pausable</label></li> <li class="list-group-item d-flex flex-row flex-nowrap gap-2"><button type="button"> </button> <button type="button" class="btn btn-warning">Cancel process</button></li></ul></div>');function Te(t,e){Pt(e,!0);const r=(h,I=$e)=>{ve();var E=xt();se(()=>fe(E,i.format(I()))),k(h,E)},a=(h,I=$e)=>{var E=pr(),N=l(E),$=l(N);r($,()=>u(p)),c(N);var Y=v(N,2),xe=v(l(Y));r(xe,()=>u(y)),c(Y),c(E),se(()=>rt(E,`alert alert-${I()??""} d-flex flex-column justify-content-center`)),k(h,E)};let s=Lt(e,"toNumber",7),i=new Intl.NumberFormat(navigator.languages,{maximumFractionDigits:0}),y=F(0),_=F(void 0),p=F(0),o=F(!1),m=F(!1),g=F(!1),b=crossOriginIsolated?new Be:void 0;const T=hr();Tt(()=>{u(g)?b==null||b.reset():b==null||b.signal()});function M(h){if(typeof h=="number")$t(y),S(p,it(h));else{if(h===void 0)return S(o,!1),!0;console.warn("Unknown message from prime worker: %o",h)}return!1}var q=br(),j=l(q),w=l(j),R=v(l(w));r(R,s),c(w);var _t=v(w,2);ne(_t,()=>{var h;return(h=u(_))==null?void 0:h.id},h=>{var I=_r(),E=l(I);c(I),se(()=>fe(E,`ID: ${u(_).id??""}`)),k(h,I)}),c(j);var be=v(j,2),ye=l(be),De=l(ye),ee=l(De);tt(ee),O(ee,"id",`${T??""}_toNumber`),O(ee,"min",1e4),O(ee,"max",1e6),O(ee,"step",1e4),c(De),c(ye);var gt=v(ye,2);ne(gt,()=>!u(_),h=>{var I=gr();k(h,I)},h=>{var I=Re(),E=me(I);Bt(E,()=>u(_).promise,N=>{var $=kr(),Y=l($);r(Y,()=>u(p)),c($),k(N,$)},N=>{a(N,()=>"success")},(N,$)=>{var Y=Re(),xe=me(Y);ne(xe,()=>u($)instanceof ue,Se=>{a(Se,()=>"danger")},Se=>{var Ae=wr(),He=v(l(Ae),2),Je=v(l(He),2),bt=l(Je);se(()=>{var Ye;return fe(bt,(Ye=u($))==null?void 0:Ye.toString())}),c(Je),c(He),c(Ae),k(Se,Ae)}),k(N,Y)}),k(h,I)}),c(be);var Ue=v(be,2),Ie=l(Ue),ae=l(Ie);tt(ae),O(ae,"id",T);var wt=v(ae,2);O(wt,"for",T),c(Ie);var Ge=v(Ie,2),te=l(Ge);te.__click=[mr,_,g,p,y,o,e,s,m,b,M];var kt=l(te);c(te);var ze=v(te,2);ze.__click=[vr,_,o],c(Ge),c(Ue),c(q),se(()=>{ae.disabled=!crossOriginIsolated||u(o),rt(te,`btn btn-${(u(o)&&u(m)?"info":"primary")??""}`),te.disabled=u(o)&&!u(m),fe(kt,u(o)?u(m)&&u(g)?"Resume":u(m)?"Pause":"Running":"Start"),ze.disabled=!u(o)}),Ut(ee,s,h=>s(h)),Gt(ae,()=>u(m),h=>S(m,h)),k(t,q),Rt()}Ft(["click"]);var yr=A('<div class="banner px-5 py-3 text-bg-primary fs-5 svelte-dnojh8"><p class="svelte-dnojh8">Cast your vote @ <a href="https://devhunt.org/tool/wjfeasync-workers" target="_blank" class="svelte-dnojh8">devhunt.org</a> on <strong>March the 4<sup>th</sup>, 2025.</strong></p></div>');function Ir(t){var e=yr();k(t,e)}const xr="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='26.6'%20height='32'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20308'%3e%3cpath%20fill='%23FF3E00'%20d='M239.682%2040.707C211.113-.182%20154.69-12.301%20113.895%2013.69L42.247%2059.356a82.198%2082.198%200%200%200-37.135%2055.056a86.566%2086.566%200%200%200%208.536%2055.576a82.425%2082.425%200%200%200-12.296%2030.719a87.596%2087.596%200%200%200%2014.964%2066.244c28.574%2040.893%2084.997%2053.007%20125.787%2027.016l71.648-45.664a82.182%2082.182%200%200%200%2037.135-55.057a86.601%2086.601%200%200%200-8.53-55.577a82.409%2082.409%200%200%200%2012.29-30.718a87.573%2087.573%200%200%200-14.963-66.244'%3e%3c/path%3e%3cpath%20fill='%23FFF'%20d='M106.889%20270.841c-23.102%206.007-47.497-3.036-61.103-22.648a52.685%2052.685%200%200%201-9.003-39.85a49.978%2049.978%200%200%201%201.713-6.693l1.35-4.115l3.671%202.697a92.447%2092.447%200%200%200%2028.036%2014.007l2.663.808l-.245%202.659a16.067%2016.067%200%200%200%202.89%2010.656a17.143%2017.143%200%200%200%2018.397%206.828a15.786%2015.786%200%200%200%204.403-1.935l71.67-45.672a14.922%2014.922%200%200%200%206.734-9.977a15.923%2015.923%200%200%200-2.713-12.011a17.156%2017.156%200%200%200-18.404-6.832a15.78%2015.78%200%200%200-4.396%201.933l-27.35%2017.434a52.298%2052.298%200%200%201-14.553%206.391c-23.101%206.007-47.497-3.036-61.101-22.649a52.681%2052.681%200%200%201-9.004-39.849a49.428%2049.428%200%200%201%2022.34-33.114l71.664-45.677a52.218%2052.218%200%200%201%2014.563-6.398c23.101-6.007%2047.497%203.036%2061.101%2022.648a52.685%2052.685%200%200%201%209.004%2039.85a50.559%2050.559%200%200%201-1.713%206.692l-1.35%204.116l-3.67-2.693a92.373%2092.373%200%200%200-28.037-14.013l-2.664-.809l.246-2.658a16.099%2016.099%200%200%200-2.89-10.656a17.143%2017.143%200%200%200-18.398-6.828a15.786%2015.786%200%200%200-4.402%201.935l-71.67%2045.674a14.898%2014.898%200%200%200-6.73%209.975a15.9%2015.9%200%200%200%202.709%2012.012a17.156%2017.156%200%200%200%2018.404%206.832a15.841%2015.841%200%200%200%204.402-1.935l27.345-17.427a52.147%2052.147%200%200%201%2014.552-6.397c23.101-6.006%2047.497%203.037%2061.102%2022.65a52.681%2052.681%200%200%201%209.003%2039.848a49.453%2049.453%200%200%201-22.34%2033.12l-71.664%2045.673a52.218%2052.218%200%200%201-14.563%206.398'%3e%3c/path%3e%3c/svg%3e";function Sr(t,e){for(let r=2;r<=t/2;++r)if(pe.throwIfSignalled(e),t%r===0)return!1;return!0}function Ar(t,e,r){for(let a=2;a<=t/2;++a)if(pe.throwIfSignalled(r),Be.wait(e),t%a===0)return!1;return!0}function Er(t,e,r,a){let s=e?i=>Ar(i,e,a):i=>Sr(i,a);for(let i=1;i<t;++i)s(i)&&r(i)}const pt={sayHello(t){console.log("Hello, %s!",t.name)},calculatePrimes(t,e,r){Er(t.to,t.pause,e,r)}};self.onmessage=dr(pt);function qr(t){return new Worker(""+new URL("../workers/exampleWorker-C2jNqMiH.js",import.meta.url).href,{name:t==null?void 0:t.name})}var Cr=A('<!> <main><div class="container pt-5"><h1><a href="https://svelte.dev" target="_blank" rel="noreferrer"><img alt="Svelte Logo"></a> Prime Workers</h1> <!> <!> <div class="row row-cols-sm-2 row-cols-md-3"><div class="col"><!></div> <div class="col"><!></div> <div class="col"><!></div></div></div></main>',1);function Pr(t){const e=new cr(new qr,pt);var r=Cr(),a=me(r);Ir(a);var s=v(a,2),i=l(s),y=l(i),_=l(y),p=l(_);O(p,"src",xr),c(_),ve(),c(y);var o=v(y,2);Ht(o);var m=v(o,2);Vt(m);var g=v(m,2),b=l(g),T=l(b);Te(T,{toNumber:2e5,worker:e}),c(b);var M=v(b,2),q=l(M);Te(q,{toNumber:25e4,worker:e}),c(M);var j=v(M,2),w=l(j);Te(w,{toNumber:3e5,worker:e}),c(j),c(g),c(i),c(s),k(t,r)}export{Pr as component};
