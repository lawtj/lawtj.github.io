import{ai as $,Y as I,Z as P,z as j,_ as q,w as b,aa as R,aj as B,ak as F,h as m,f,$ as T,a as C,s as M,al as O,am as U,af as W,an as S,c as w,ab as z,ao as G,ap as J,a7 as Z,a1 as K,aq as Q,e as X,J as x,M as ee,C as re}from"./runtime.Du4Jtm2h.js";const te=["touchstart","touchmove"];function ae(e){return te.includes(e)}const V=new Set,A=new Set;function fe(e){for(var r=0;r<e.length;r++)V.add(e[r]);for(var t of A)t(e)}function E(e){var D;var r=this,t=r.ownerDocument,c=e.type,n=((D=e.composedPath)==null?void 0:D.call(e))||[],a=n[0]||e.target,s=0,_=e.__root;if(_){var d=n.indexOf(_);if(d!==-1&&(r===document||r===window)){e.__root=r;return}var p=n.indexOf(r);if(p===-1)return;d<=p&&(s=d)}if(a=n[s]||e.target,a!==r){$(e,"currentTarget",{configurable:!0,get(){return a||t}});var N=q,u=b;I(null),P(null);try{for(var o,i=[];a!==null;){var l=a.assignedSlot||a.parentNode||a.host||null;try{var h=a["__"+c];if(h!==void 0&&!a.disabled)if(j(h)){var[H,...Y]=h;H.apply(a,[e,...Y])}else h.call(a,e)}catch(g){o?i.push(g):o=g}if(e.cancelBubble||l===r||l===null)break;a=l}if(o){for(let g of i)queueMicrotask(()=>{throw g});throw o}}finally{e.__root=r,delete e.currentTarget,I(N),P(u)}}}function ne(e){var r=document.createElement("template");return r.innerHTML=e,r.content}function v(e,r){var t=b;t.nodes_start===null&&(t.nodes_start=e,t.nodes_end=r)}function ue(e,r){var t=(r&B)!==0,c=(r&F)!==0,n,a=!e.startsWith("<!>");return()=>{if(m)return v(f,null),f;n===void 0&&(n=ne(a?e:"<!>"+e),t||(n=R(n)));var s=c?document.importNode(n,!0):n.cloneNode(!0);if(t){var _=R(s),d=s.lastChild;v(_,d)}else v(s,s);return s}}function de(e=""){if(!m){var r=T(e+"");return v(r,r),r}var t=f;return t.nodeType!==3&&(t.before(t=T()),M(t)),v(t,t),t}function le(){if(m)return v(f,null),f;var e=document.createDocumentFragment(),r=document.createComment(""),t=T();return e.append(r,t),v(r,t),e}function ce(e,r){if(m){b.nodes_end=f,C();return}e!==null&&e.before(r)}function _e(e,r){var t=r==null?"":typeof r=="object"?r+"":r;t!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=t,e.nodeValue=t==null?"":t+"")}function oe(e,r){return k(e,r)}function ve(e,r){O(),r.intro=r.intro??!1;const t=r.target,c=m,n=f;try{for(var a=R(t);a&&(a.nodeType!==8||a.data!==U);)a=W(a);if(!a)throw S;w(!0),M(a),C();const s=k(e,{...r,anchor:a});if(f===null||f.nodeType!==8||f.data!==z)throw G(),S;return w(!1),s}catch(s){if(s===S)return r.recover===!1&&J(),O(),Z(t),w(!1),oe(e,r);throw s}finally{w(c),M(n)}}const y=new Map;function k(e,{target:r,anchor:t,props:c={},events:n,context:a,intro:s=!0}){O();var _=new Set,d=u=>{for(var o=0;o<u.length;o++){var i=u[o];if(!_.has(i)){_.add(i);var l=ae(i);r.addEventListener(i,E,{passive:l});var h=y.get(i);h===void 0?(document.addEventListener(i,E,{passive:l}),y.set(i,1)):y.set(i,h+1)}}};d(K(V)),A.add(d);var p=void 0,N=Q(()=>{var u=t??r.appendChild(T());return X(()=>{if(a){x({});var o=re;o.c=a}n&&(c.$$events=n),m&&v(u,null),p=e(u,c)||{},m&&(b.nodes_end=f),a&&ee()}),()=>{var l;for(var o of _){r.removeEventListener(o,E);var i=y.get(o);--i===0?(document.removeEventListener(o,E),y.delete(o)):y.set(o,i)}A.delete(d),u!==t&&((l=u.parentNode)==null||l.removeChild(u))}});return L.set(p,N),p}let L=new WeakMap;function he(e,r){const t=L.get(e);return t?(L.delete(e),t(r)):Promise.resolve()}const se="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(se);export{ce as a,de as b,le as c,fe as d,ve as h,oe as m,_e as s,ue as t,he as u};