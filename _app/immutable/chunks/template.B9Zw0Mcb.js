import{v as i,w as u,e as f,T as v,x as p,n as d,y as o,z as h,A as T}from"./runtime.BMK0vxtm.js";function E(r){var t=document.createElement("template");return t.innerHTML=r,t.content}function n(r,t){var e=f;e.nodes_start===null&&(e.nodes_start=r,e.nodes_end=t)}function y(r,t){var e=(t&v)!==0,_=(t&p)!==0,a,c=!r.startsWith("<!>");return()=>{if(d)return n(o,null),o;a===void 0&&(a=E(c?r:"<!>"+r),e||(a=u(a)));var s=_?document.importNode(a,!0):a.cloneNode(!0);if(e){var m=u(s),l=s.lastChild;n(m,l)}else n(s,s);return s}}function x(r=""){if(!d){var t=i(r+"");return n(t,t),t}var e=o;return e.nodeType!==3&&(e.before(e=i()),T(e)),n(e,e),e}function M(){if(d)return n(o,null),o;var r=document.createDocumentFragment(),t=document.createComment(""),e=i();return r.append(t,e),n(t,e),r}function A(r,t){if(d){f.nodes_end=o,h();return}r!==null&&r.before(t)}export{A as a,n as b,M as c,x as d,y as t};
