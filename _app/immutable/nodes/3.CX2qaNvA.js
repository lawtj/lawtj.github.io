import{a as ie,t as _e}from"../chunks/disclose-version.UOsgpHKX.js";import{y as se,z as ve,A as he,f as Z,R as qe,X as Fe,q as I,G as U,I as Me,j as Ne,P as xe,a7 as Oe,a8 as de,F as Q,J as V,a9 as W,aa as pe,T as me,ab as Ve,ac as De,ad as He,O as Be,ae as Le,_ as We,C as Xe,K as Ye,af as $e,s as oe,ag as ze,ah as Ge,ai as Je,D as Ke,m as Ue,aj as Qe,ak as be,t as T,c as fe,d as s,p as h,n as c,r as o,al as ue,a4 as F}from"../chunks/runtime.7FN0t8l-.js";import{s as C}from"../chunks/render.BZUJIRRg.js";import{a as Ze,r as je}from"../chunks/attributes.C3NfhgFn.js";import{i as et}from"../chunks/proxy.S91YzDlx.js";function tt(t){var e=he,a=Z;se(null),ve(null);try{return t()}finally{se(e),ve(a)}}function ge(t,e,a,r=a){t.addEventListener(e,()=>tt(a));const n=t.__on_r;n?t.__on_r=()=>{n(),r(!0)}:t.__on_r=()=>r(!0),Ze()}function at(t,e){return e}function rt(t,e,a,r){for(var n=[],i=e.length,d=0;d<i;d++)He(e[d].e,n,!0);var p=i>0&&n.length===0&&a!==null;if(p){var b=a.parentNode;Be(b),b.append(a),r.clear(),S(t,e[0].prev,e[i-1].next)}Le(n,()=>{for(var m=0;m<i;m++){var _=e[m];p||(r.delete(_.k),S(t,_.prev,_.next)),We(_.e,!p)}})}function lt(t,e,a,r,n,i=null){var d=t,p={flags:e,items:new Map,first:null};{var b=t;d=I?U(Xe(b)):b.appendChild(qe())}I&&Me();var m=null,_=!1;Fe(()=>{var l=a(),x=Ne(l)?l:l==null?[]:xe(l),v=x.length;if(_&&v===0)return;_=v===0;let f=!1;if(I){var y=d.data===Oe;y!==(v===0)&&(d=de(),U(d),Q(!1),f=!0)}if(I){for(var E=null,k,u=0;u<v;u++){if(V.nodeType===8&&V.data===Ye){d=V,f=!0,Q(!1);break}var g=x[u],P=r(g,u);k=ye(V,p,E,null,g,P,u,n,e),p.items.set(P,k),E=k}v>0&&U(de())}if(!I){var A=he;nt(x,p,d,n,e,(A.f&W)!==0,r)}i!==null&&(v===0?m?pe(m):m=me(()=>i(d)):m!==null&&Ve(m,()=>{m=null})),f&&Q(!0)}),I&&(d=V)}function nt(t,e,a,r,n,i,d,p){var b=t.length,m=e.items,_=e.first,l=_,x,v=null,f=[],y=[],E,k,u,g;for(g=0;g<b;g+=1){if(E=t[g],k=d(E,g),u=m.get(k),u===void 0){var P=l?l.e.nodes_start:a;v=ye(P,e,v,v===null?e.first:v.next,E,k,g,r,n),m.set(k,v),f=[],y=[],l=v.next;continue}if(it(u,E,g),u.e.f&W&&pe(u.e),u!==l){if(x!==void 0&&x.has(u)){if(f.length<y.length){var A=y[0],w;v=A.prev;var M=f[0],N=f[f.length-1];for(w=0;w<f.length;w+=1)ce(f[w],A,a);for(w=0;w<y.length;w+=1)x.delete(y[w]);S(e,M.prev,N.next),S(e,v,M),S(e,N,A),l=A,v=N,g-=1,f=[],y=[]}else x.delete(u),ce(u,l,a),S(e,u.prev,u.next),S(e,u,v===null?e.first:v.next),S(e,v,u),v=u;continue}for(f=[],y=[];l!==null&&l.k!==k;)(i||!(l.e.f&W))&&(x??(x=new Set)).add(l),y.push(l),l=l.next;if(l===null)continue;u=l}f.push(u),v=u,l=u.next}if(l!==null||x!==void 0){for(var q=x===void 0?[]:xe(x);l!==null;)(i||!(l.e.f&W))&&q.push(l),l=l.next;var H=q.length;if(H>0){var B=b===0?a:null;rt(e,q,B,m)}}Z.first=e.first&&e.first.e,Z.last=v&&v.e}function it(t,e,a,r){De(t.v,e),t.i=a}function ye(t,e,a,r,n,i,d,p,b,m){var _=(b&Ge)!==0,l=(b&Je)===0,x=_?l?$e(n):oe(n):n,v=b&ze?oe(d):d,f={i:v,v:x,k:i,a:null,e:null,prev:a,next:r};try{return f.e=me(()=>p(t,x,v),I),f.e.prev=a&&a.e,f.e.next=r&&r.e,a===null?e.first=f:(a.next=f,a.e.next=f.e),r!==null&&(r.prev=f,r.e.prev=f.e),f}finally{}}function ce(t,e,a){for(var r=t.next?t.next.e.nodes_start:a,n=e?e.e.nodes_start:a,i=t.e.nodes_start;i!==r;){var d=Ke(i);n.before(i),i=d}}function S(t,e,a){e===null?t.first=a:(e.next=a,e.e.next=a&&a.e),a!==null&&(a.prev=e,a.e.prev=e&&e.e)}function st(t,e,a=e){ge(t,"change",r=>{var n=r?t.defaultChecked:t.checked;a(n)}),(I&&t.defaultChecked!==t.checked||Ue(e)==null)&&a(t.checked),Qe(()=>{var r=e();t.checked=!!r})}function ke(t,e,a){if(t.multiple)return ot(t,e);for(var r of t.options){var n=D(r);if(et(n,e)){r.selected=!0;return}}(!a||e!==void 0)&&(t.selectedIndex=-1)}function vt(t,e){be(()=>{var a=new MutationObserver(()=>{var r=t.__value;ke(t,r)});return a.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{a.disconnect()}})}function dt(t,e,a=e){var r=!0;ge(t,"change",n=>{var i=n?"[selected]":":checked",d;if(t.multiple)d=[].map.call(t.querySelectorAll(i),D);else{var p=t.querySelector(i)??t.querySelector("option:not([disabled])");d=p&&D(p)}a(d)}),be(()=>{var n=e();if(ke(t,n,r),r&&n===void 0){var i=t.querySelector(":checked");i!==null&&(n=D(i),a(n))}t.__value=n,r=!1}),vt(t)}function ot(t,e){for(var a of t.options)a.selected=~e.indexOf(D(a))}function D(t){return"__value"in t?t.__value:t.value}var ft=_e("<option> </option>"),ut=_e('<div class="mx-auto flex max-w-screen-2xl flex-col items-center gap-2 p-10"><h1 class="mb-4 text-2xl font-bold">Coffee Brewing Calculator</h1> <div class="flex w-full flex-col items-center justify-center gap-6 space-x-2 md:flex-row"><div class="flex flex-col gap-2 space-y-2"><div class="mx-auto flex w-fit flex-col gap-2"><div class="form-control"><label class="label"><span class="label-text">Total Volume</span></label> <select class="select select-bordered"></select></div> <div class="font-bold">Coffee/Water ratio:</div> <div class="form-control"><label class="label cursor-pointer"><span class="label-text"> </span> <input type="checkbox" class="toggle"></label></div> <div class="flex flex-col items-center border-2 border-gray-300 rounded-md p-2"><div class="text-lg">Coffee dose:</div> <div class="text-lg"> </div></div></div></div> <div class="flex flex-col gap-2 rounded-md p-2"><div class="overflow-x-auto"><table class="table"><thead class="text-center"><tr><th>Step</th><th>Volume</th><th>Scale Weight</th></tr></thead><tbody class="text-center"><tr><td>Bloom</td><td> </td><td> </td></tr><tr><td>First Pour</td><td> </td><td> </td></tr><tr><td>Second Pour</td><td> </td><td> </td></tr><tr><td>Third Pour</td><td> </td><td> </td></tr></tbody></table></div></div></div></div>');function mt(t){let e=ue(500),a=ue(!0),r=F(()=>s(a)?15:17),n=F(()=>s(e)/s(r)),i=F(()=>s(n)*3),d=F(()=>(s(e)-s(i))*(1/2)),p=F(()=>(s(e)-s(i))*(1/4)),b=F(()=>(s(e)-s(i))*(1/4)),m=[200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1e3];const _=R=>R.toFixed(0);var l=ut(),x=h(c(l),2),v=c(x),f=c(v),y=c(f),E=h(c(y),2);lt(E,21,()=>m,at,(R,L)=>{var O=ft(),ne={},Pe=c(O);o(O),T(()=>{ne!==(ne=s(L))&&(O.value=(O.__value=s(L))==null?"":s(L)),C(Pe,`${s(L)??""}ml`)}),ie(R,O)}),o(E),o(y);var k=h(y,4),u=c(k),g=c(u),P=c(g,!0);o(g);var A=h(g,2);je(A),o(u),o(k);var w=h(k,2),M=h(c(w),2),N=c(M);T(()=>C(N,`${s(n).toFixed(1)??""}g`)),o(M),o(w),o(f),o(v);var q=h(v,2),H=c(q),B=c(H),j=h(c(B)),X=c(j),Y=h(c(X)),Ee=c(Y,!0);T(()=>C(Ee,_(s(i)))),o(Y);var ee=h(Y),we=c(ee,!0);T(()=>C(we,_(s(i)))),o(ee),o(X);var $=h(X),z=h(c($)),Te=c(z,!0);T(()=>C(Te,_(s(d)))),o(z);var te=h(z),Ce=c(te,!0);T(()=>C(Ce,_(s(i)+s(d)))),o(te),o($);var G=h($),J=h(c(G)),Ae=c(J,!0);T(()=>C(Ae,_(s(p)))),o(J);var ae=h(J),Ie=c(ae,!0);T(()=>C(Ie,_(s(i)+s(d)+s(p)))),o(ae),o(G);var re=h(G),K=h(c(re)),Se=c(K,!0);T(()=>C(Se,_(s(b)))),o(K);var le=h(K),Re=c(le,!0);T(()=>C(Re,_(s(i)+s(d)+s(p)+s(b)))),o(le),o(re),o(j),o(B),o(H),o(q),o(x),o(l),T(()=>C(P,s(a)?"15ml/g":"17ml/g")),dt(E,()=>s(e),R=>fe(e,R)),st(A,()=>s(a),R=>fe(a,R)),ie(t,l)}export{mt as component};