import{a as Z,t as at,s as o}from"../chunks/disclose-version.DhAXOiJU.js";import{i as rt,L as u,n as B,v as t,R as tt,P as l,N as a,O as e,I as b}from"../chunks/runtime.Du4Jtm2h.js";import{l as mt,e as xt,b as gt,a as ht,i as yt}from"../chunks/input.B8BEm7xJ.js";import{r as et}from"../chunks/attributes.CMbef_X_.js";import{i as wt}from"../chunks/proxy.BbtvnAqk.js";function lt(r,s,d){if(r.multiple)return qt(r,s);for(var n of r.options){var i=x(n);if(wt(i,s)){n.selected=!0;return}}(!d||s!==void 0)&&(r.selectedIndex=-1)}function Pt(r,s){rt(()=>{var d=new MutationObserver(()=>{var n=r.__value;lt(r,n)});return d.observe(r,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),()=>{d.disconnect()}})}function St(r,s,d=s){var n=!0;mt(r,"change",i=>{var v=i?"[selected]":":checked",f;if(r.multiple)f=[].map.call(r.querySelectorAll(v),x);else{var p=r.querySelector(v)??r.querySelector("option:not([disabled])");f=p&&x(p)}d(f)}),rt(()=>{var i=s();if(lt(r,i,n),n&&i===void 0){var v=r.querySelector(":checked");v!==null&&(i=x(v),d(i))}r.__value=i,n=!1}),Pt(r)}function qt(r,s){for(var d of r.options)d.selected=~s.indexOf(x(d))}function x(r){return"__value"in r?r.__value:r.value}var Ft=at("<option> </option>"),kt=at('<div class="flex flex-col items-center gap-2 p-10 "><h1 class="mb-4 text-2xl font-bold">Coffee Brewing Calculator</h1> <div class="flex w-full flex-col items-center justify-center gap-6 space-x-2 md:flex-row"><div class="flex flex-col gap-6 max-w-md p-6 bg-base-200 rounded-lg"><div class="form-control"><label class="label"><span class="label-text font-medium">Total Volume (ml)</span></label> <div class="flex gap-2"><input type="number" class="input input-bordered w-24"> <select class="select select-bordered flex-1"></select></div></div> <div class="form-control"><label class="label"><span class="label-text font-medium">Coffee/Water Ratio</span></label> <label class="label cursor-pointer justify-start gap-4"><input type="checkbox" class="toggle"> <span class="label-text"> </span></label></div> <div class="stats bg-base-100 shadow"><div class="stat"><div class="stat-title">Coffee Dose</div> <div class="stat-value text-2xl"> </div></div></div></div> <div class="flex flex-col gap-2 rounded-md p-2"><div class="overflow-x-auto"><table class="table"><thead class="text-center"><tr><th>Step</th><th>Volume</th><th>Scale Weight</th></tr></thead><tbody class="text-center"><tr><td>Bloom</td><td> </td><td> </td></tr><tr><td>First Pour</td><td> </td><td> </td></tr><tr><td>Second Pour</td><td> </td><td> </td></tr><tr><td>Third Pour</td><td> </td><td> </td></tr></tbody></table></div></div></div></div>');function jt(r){let s=tt(500),d=tt(!0),n=b(()=>t(d)?15:17),i=b(()=>t(s)/t(n)),v=b(()=>t(i)*3),f=b(()=>(t(s)-t(v))*(1/2)),p=b(()=>(t(s)-t(v))*(1/4)),I=b(()=>(t(s)-t(v))*(1/4)),st=[200,250,300,350,400,450,500,550,600,650,700,750,800,850,900,950,1e3];const _=c=>c.toFixed(0);var h=kt(),L=l(a(h),2),y=a(L),w=a(y),T=l(a(w),2),P=a(T);et(P);var S=l(P,2);xt(S,21,()=>st,yt,(c,g)=>{var m=Ft(),Y={},bt=a(m);e(m),u(()=>{Y!==(Y=t(g))&&(m.value=(m.__value=t(g))==null?"":t(g)),o(bt,`${t(g)??""}ml`)}),Z(c,m)}),e(S),e(T),e(w);var q=l(w,2),$=l(a(q),2),F=a($);et(F);var A=l(F,2),dt=a(A,!0);e(A),e($),e(q);var D=l(q,2),M=a(D),N=l(a(M),2),vt=a(N);u(()=>o(vt,`${t(i).toFixed(1)??""}g`)),e(N),e(M),e(D),e(y);var z=l(y,2),E=a(z),G=a(E),H=l(a(G)),k=a(H),C=l(a(k)),it=a(C,!0);u(()=>o(it,_(t(v)))),e(C);var J=l(C),ot=a(J,!0);u(()=>o(ot,_(t(v)))),e(J),e(k);var O=l(k),V=l(a(O)),ut=a(V,!0);u(()=>o(ut,_(t(f)))),e(V);var K=l(V),nt=a(K,!0);u(()=>o(nt,_(t(v)+t(f)))),e(K),e(O);var W=l(O),R=l(a(W)),ct=a(R,!0);u(()=>o(ct,_(t(p)))),e(R);var Q=l(R),ft=a(Q,!0);u(()=>o(ft,_(t(v)+t(f)+t(p)))),e(Q),e(W);var U=l(W),j=l(a(U)),_t=a(j,!0);u(()=>o(_t,_(t(I)))),e(j);var X=l(j),pt=a(X,!0);u(()=>o(pt,_(t(v)+t(f)+t(p)+t(I)))),e(X),e(U),e(H),e(G),e(E),e(z),e(L),e(h),u(()=>o(dt,t(d)?"15ml/g":"17ml/g")),gt(P,()=>t(s),c=>B(s,c)),St(S,()=>t(s),c=>B(s,c)),ht(F,()=>t(d),c=>B(d,c)),Z(r,h)}export{jt as component};
