var n0=Object.defineProperty;var r0=(e,t,n)=>t in e?n0(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var vd=(e,t,n)=>(r0(e,typeof t!="symbol"?t+"":t,n),n);import{g as l0,W as s0,a as o0,b as i0,c as a0,_ as wo}from"./monaco-4a3c78e8.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();var Nf={exports:{}},wi={},kf={exports:{}},Ne={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Es=Symbol.for("react.element"),c0=Symbol.for("react.portal"),u0=Symbol.for("react.fragment"),d0=Symbol.for("react.strict_mode"),m0=Symbol.for("react.profiler"),f0=Symbol.for("react.provider"),p0=Symbol.for("react.context"),h0=Symbol.for("react.forward_ref"),g0=Symbol.for("react.suspense"),x0=Symbol.for("react.memo"),y0=Symbol.for("react.lazy"),bd=Symbol.iterator;function v0(e){return e===null||typeof e!="object"?null:(e=bd&&e[bd]||e["@@iterator"],typeof e=="function"?e:null)}var Sf={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},jf=Object.assign,Cf={};function xl(e,t,n){this.props=e,this.context=t,this.refs=Cf,this.updater=n||Sf}xl.prototype.isReactComponent={};xl.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};xl.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Ef(){}Ef.prototype=xl.prototype;function tu(e,t,n){this.props=e,this.context=t,this.refs=Cf,this.updater=n||Sf}var nu=tu.prototype=new Ef;nu.constructor=tu;jf(nu,xl.prototype);nu.isPureReactComponent=!0;var wd=Array.isArray,Tf=Object.prototype.hasOwnProperty,ru={current:null},Mf={key:!0,ref:!0,__self:!0,__source:!0};function _f(e,t,n){var r,s={},o=null,i=null;if(t!=null)for(r in t.ref!==void 0&&(i=t.ref),t.key!==void 0&&(o=""+t.key),t)Tf.call(t,r)&&!Mf.hasOwnProperty(r)&&(s[r]=t[r]);var a=arguments.length-2;if(a===1)s.children=n;else if(1<a){for(var c=Array(a),u=0;u<a;u++)c[u]=arguments[u+2];s.children=c}if(e&&e.defaultProps)for(r in a=e.defaultProps,a)s[r]===void 0&&(s[r]=a[r]);return{$$typeof:Es,type:e,key:o,ref:i,props:s,_owner:ru.current}}function b0(e,t){return{$$typeof:Es,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function lu(e){return typeof e=="object"&&e!==null&&e.$$typeof===Es}function w0(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Nd=/\/+/g;function aa(e,t){return typeof e=="object"&&e!==null&&e.key!=null?w0(""+e.key):t.toString(36)}function No(e,t,n,r,s){var o=typeof e;(o==="undefined"||o==="boolean")&&(e=null);var i=!1;if(e===null)i=!0;else switch(o){case"string":case"number":i=!0;break;case"object":switch(e.$$typeof){case Es:case c0:i=!0}}if(i)return i=e,s=s(i),e=r===""?"."+aa(i,0):r,wd(s)?(n="",e!=null&&(n=e.replace(Nd,"$&/")+"/"),No(s,t,n,"",function(u){return u})):s!=null&&(lu(s)&&(s=b0(s,n+(!s.key||i&&i.key===s.key?"":(""+s.key).replace(Nd,"$&/")+"/")+e)),t.push(s)),1;if(i=0,r=r===""?".":r+":",wd(e))for(var a=0;a<e.length;a++){o=e[a];var c=r+aa(o,a);i+=No(o,t,n,c,s)}else if(c=v0(e),typeof c=="function")for(e=c.call(e),a=0;!(o=e.next()).done;)o=o.value,c=r+aa(o,a++),i+=No(o,t,n,c,s);else if(o==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return i}function Ys(e,t,n){if(e==null)return e;var r=[],s=0;return No(e,r,"","",function(o){return t.call(n,o,s++)}),r}function N0(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Tt={current:null},ko={transition:null},k0={ReactCurrentDispatcher:Tt,ReactCurrentBatchConfig:ko,ReactCurrentOwner:ru};function Rf(){throw Error("act(...) is not supported in production builds of React.")}Ne.Children={map:Ys,forEach:function(e,t,n){Ys(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Ys(e,function(){t++}),t},toArray:function(e){return Ys(e,function(t){return t})||[]},only:function(e){if(!lu(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};Ne.Component=xl;Ne.Fragment=u0;Ne.Profiler=m0;Ne.PureComponent=tu;Ne.StrictMode=d0;Ne.Suspense=g0;Ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=k0;Ne.act=Rf;Ne.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=jf({},e.props),s=e.key,o=e.ref,i=e._owner;if(t!=null){if(t.ref!==void 0&&(o=t.ref,i=ru.current),t.key!==void 0&&(s=""+t.key),e.type&&e.type.defaultProps)var a=e.type.defaultProps;for(c in t)Tf.call(t,c)&&!Mf.hasOwnProperty(c)&&(r[c]=t[c]===void 0&&a!==void 0?a[c]:t[c])}var c=arguments.length-2;if(c===1)r.children=n;else if(1<c){a=Array(c);for(var u=0;u<c;u++)a[u]=arguments[u+2];r.children=a}return{$$typeof:Es,type:e.type,key:s,ref:o,props:r,_owner:i}};Ne.createContext=function(e){return e={$$typeof:p0,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:f0,_context:e},e.Consumer=e};Ne.createElement=_f;Ne.createFactory=function(e){var t=_f.bind(null,e);return t.type=e,t};Ne.createRef=function(){return{current:null}};Ne.forwardRef=function(e){return{$$typeof:h0,render:e}};Ne.isValidElement=lu;Ne.lazy=function(e){return{$$typeof:y0,_payload:{_status:-1,_result:e},_init:N0}};Ne.memo=function(e,t){return{$$typeof:x0,type:e,compare:t===void 0?null:t}};Ne.startTransition=function(e){var t=ko.transition;ko.transition={};try{e()}finally{ko.transition=t}};Ne.unstable_act=Rf;Ne.useCallback=function(e,t){return Tt.current.useCallback(e,t)};Ne.useContext=function(e){return Tt.current.useContext(e)};Ne.useDebugValue=function(){};Ne.useDeferredValue=function(e){return Tt.current.useDeferredValue(e)};Ne.useEffect=function(e,t){return Tt.current.useEffect(e,t)};Ne.useId=function(){return Tt.current.useId()};Ne.useImperativeHandle=function(e,t,n){return Tt.current.useImperativeHandle(e,t,n)};Ne.useInsertionEffect=function(e,t){return Tt.current.useInsertionEffect(e,t)};Ne.useLayoutEffect=function(e,t){return Tt.current.useLayoutEffect(e,t)};Ne.useMemo=function(e,t){return Tt.current.useMemo(e,t)};Ne.useReducer=function(e,t,n){return Tt.current.useReducer(e,t,n)};Ne.useRef=function(e){return Tt.current.useRef(e)};Ne.useState=function(e){return Tt.current.useState(e)};Ne.useSyncExternalStore=function(e,t,n){return Tt.current.useSyncExternalStore(e,t,n)};Ne.useTransition=function(){return Tt.current.useTransition()};Ne.version="18.3.1";kf.exports=Ne;var f=kf.exports;const zl=l0(f);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var S0=f,j0=Symbol.for("react.element"),C0=Symbol.for("react.fragment"),E0=Object.prototype.hasOwnProperty,T0=S0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,M0={key:!0,ref:!0,__self:!0,__source:!0};function Lf(e,t,n){var r,s={},o=null,i=null;n!==void 0&&(o=""+n),t.key!==void 0&&(o=""+t.key),t.ref!==void 0&&(i=t.ref);for(r in t)E0.call(t,r)&&!M0.hasOwnProperty(r)&&(s[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)s[r]===void 0&&(s[r]=t[r]);return{$$typeof:j0,type:e,key:o,ref:i,props:s,_owner:T0.current}}wi.Fragment=C0;wi.jsx=Lf;wi.jsxs=Lf;Nf.exports=wi;var l=Nf.exports;window.MonacoEnvironment={getWorker(e,t){return t==="json"?new s0:t==="css"||t==="scss"||t==="less"?new o0:t==="typescript"||t==="javascript"?new i0:new a0}};var Ja={},If={exports:{}},Vt={},Of={exports:{}},Af={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(R,P){var L=R.length;R.push(P);e:for(;0<L;){var z=L-1>>>1,ue=R[z];if(0<s(ue,P))R[z]=P,R[L]=ue,L=z;else break e}}function n(R){return R.length===0?null:R[0]}function r(R){if(R.length===0)return null;var P=R[0],L=R.pop();if(L!==P){R[0]=L;e:for(var z=0,ue=R.length,ye=ue>>>1;z<ye;){var ae=2*(z+1)-1,Ze=R[ae],Ie=ae+1,S=R[Ie];if(0>s(Ze,L))Ie<ue&&0>s(S,Ze)?(R[z]=S,R[Ie]=L,z=Ie):(R[z]=Ze,R[ae]=L,z=ae);else if(Ie<ue&&0>s(S,L))R[z]=S,R[Ie]=L,z=Ie;else break e}}return P}function s(R,P){var L=R.sortIndex-P.sortIndex;return L!==0?L:R.id-P.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;e.unstable_now=function(){return o.now()}}else{var i=Date,a=i.now();e.unstable_now=function(){return i.now()-a}}var c=[],u=[],d=1,p=null,m=3,h=!1,g=!1,v=!1,w=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,y=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function b(R){for(var P=n(u);P!==null;){if(P.callback===null)r(u);else if(P.startTime<=R)r(u),P.sortIndex=P.expirationTime,t(c,P);else break;P=n(u)}}function k(R){if(v=!1,b(R),!g)if(n(c)!==null)g=!0,ge(N);else{var P=n(u);P!==null&&fe(k,P.startTime-R)}}function N(R,P){g=!1,v&&(v=!1,x(C),C=-1),h=!0;var L=m;try{for(b(P),p=n(c);p!==null&&(!(p.expirationTime>P)||R&&!Y());){var z=p.callback;if(typeof z=="function"){p.callback=null,m=p.priorityLevel;var ue=z(p.expirationTime<=P);P=e.unstable_now(),typeof ue=="function"?p.callback=ue:p===n(c)&&r(c),b(P)}else r(c);p=n(c)}if(p!==null)var ye=!0;else{var ae=n(u);ae!==null&&fe(k,ae.startTime-P),ye=!1}return ye}finally{p=null,m=L,h=!1}}var E=!1,j=null,C=-1,D=5,M=-1;function Y(){return!(e.unstable_now()-M<D)}function B(){if(j!==null){var R=e.unstable_now();M=R;var P=!0;try{P=j(!0,R)}finally{P?I():(E=!1,j=null)}}else E=!1}var I;if(typeof y=="function")I=function(){y(B)};else if(typeof MessageChannel<"u"){var O=new MessageChannel,V=O.port2;O.port1.onmessage=B,I=function(){V.postMessage(null)}}else I=function(){w(B,0)};function ge(R){j=R,E||(E=!0,I())}function fe(R,P){C=w(function(){R(e.unstable_now())},P)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(R){R.callback=null},e.unstable_continueExecution=function(){g||h||(g=!0,ge(N))},e.unstable_forceFrameRate=function(R){0>R||125<R?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<R?Math.floor(1e3/R):5},e.unstable_getCurrentPriorityLevel=function(){return m},e.unstable_getFirstCallbackNode=function(){return n(c)},e.unstable_next=function(R){switch(m){case 1:case 2:case 3:var P=3;break;default:P=m}var L=m;m=P;try{return R()}finally{m=L}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(R,P){switch(R){case 1:case 2:case 3:case 4:case 5:break;default:R=3}var L=m;m=R;try{return P()}finally{m=L}},e.unstable_scheduleCallback=function(R,P,L){var z=e.unstable_now();switch(typeof L=="object"&&L!==null?(L=L.delay,L=typeof L=="number"&&0<L?z+L:z):L=z,R){case 1:var ue=-1;break;case 2:ue=250;break;case 5:ue=1073741823;break;case 4:ue=1e4;break;default:ue=5e3}return ue=L+ue,R={id:d++,callback:P,priorityLevel:R,startTime:L,expirationTime:ue,sortIndex:-1},L>z?(R.sortIndex=L,t(u,R),n(c)===null&&R===n(u)&&(v?(x(C),C=-1):v=!0,fe(k,L-z))):(R.sortIndex=ue,t(c,R),g||h||(g=!0,ge(N))),R},e.unstable_shouldYield=Y,e.unstable_wrapCallback=function(R){var P=m;return function(){var L=m;m=P;try{return R.apply(this,arguments)}finally{m=L}}}})(Af);Of.exports=Af;var _0=Of.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R0=f,qt=_0;function A(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Df=new Set,is={};function Or(e,t){il(e,t),il(e+"Capture",t)}function il(e,t){for(is[e]=t,e=0;e<t.length;e++)Df.add(t[e])}var Dn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Za=Object.prototype.hasOwnProperty,L0=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,kd={},Sd={};function I0(e){return Za.call(Sd,e)?!0:Za.call(kd,e)?!1:L0.test(e)?Sd[e]=!0:(kd[e]=!0,!1)}function O0(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function A0(e,t,n,r){if(t===null||typeof t>"u"||O0(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Mt(e,t,n,r,s,o,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=s,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=i}var yt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){yt[e]=new Mt(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];yt[t]=new Mt(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){yt[e]=new Mt(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){yt[e]=new Mt(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){yt[e]=new Mt(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){yt[e]=new Mt(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){yt[e]=new Mt(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){yt[e]=new Mt(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){yt[e]=new Mt(e,5,!1,e.toLowerCase(),null,!1,!1)});var su=/[\-:]([a-z])/g;function ou(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(su,ou);yt[t]=new Mt(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(su,ou);yt[t]=new Mt(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(su,ou);yt[t]=new Mt(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){yt[e]=new Mt(e,1,!1,e.toLowerCase(),null,!1,!1)});yt.xlinkHref=new Mt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){yt[e]=new Mt(e,1,!1,e.toLowerCase(),null,!0,!0)});function iu(e,t,n,r){var s=yt.hasOwnProperty(t)?yt[t]:null;(s!==null?s.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(A0(t,n,s,r)&&(n=null),r||s===null?I0(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):s.mustUseProperty?e[s.propertyName]=n===null?s.type===3?!1:"":n:(t=s.attributeName,r=s.attributeNamespace,n===null?e.removeAttribute(t):(s=s.type,n=s===3||s===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var zn=R0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Xs=Symbol.for("react.element"),qr=Symbol.for("react.portal"),Vr=Symbol.for("react.fragment"),au=Symbol.for("react.strict_mode"),ec=Symbol.for("react.profiler"),Pf=Symbol.for("react.provider"),Ff=Symbol.for("react.context"),cu=Symbol.for("react.forward_ref"),tc=Symbol.for("react.suspense"),nc=Symbol.for("react.suspense_list"),uu=Symbol.for("react.memo"),Yn=Symbol.for("react.lazy"),$f=Symbol.for("react.offscreen"),jd=Symbol.iterator;function _l(e){return e===null||typeof e!="object"?null:(e=jd&&e[jd]||e["@@iterator"],typeof e=="function"?e:null)}var Je=Object.assign,ca;function ql(e){if(ca===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ca=t&&t[1]||""}return`
`+ca+e}var ua=!1;function da(e,t){if(!e||ua)return"";ua=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var r=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){r=u}e.call(t.prototype)}else{try{throw Error()}catch(u){r=u}e()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var s=u.stack.split(`
`),o=r.stack.split(`
`),i=s.length-1,a=o.length-1;1<=i&&0<=a&&s[i]!==o[a];)a--;for(;1<=i&&0<=a;i--,a--)if(s[i]!==o[a]){if(i!==1||a!==1)do if(i--,a--,0>a||s[i]!==o[a]){var c=`
`+s[i].replace(" at new "," at ");return e.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",e.displayName)),c}while(1<=i&&0<=a);break}}}finally{ua=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?ql(e):""}function D0(e){switch(e.tag){case 5:return ql(e.type);case 16:return ql("Lazy");case 13:return ql("Suspense");case 19:return ql("SuspenseList");case 0:case 2:case 15:return e=da(e.type,!1),e;case 11:return e=da(e.type.render,!1),e;case 1:return e=da(e.type,!0),e;default:return""}}function rc(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Vr:return"Fragment";case qr:return"Portal";case ec:return"Profiler";case au:return"StrictMode";case tc:return"Suspense";case nc:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ff:return(e.displayName||"Context")+".Consumer";case Pf:return(e._context.displayName||"Context")+".Provider";case cu:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case uu:return t=e.displayName||null,t!==null?t:rc(e.type)||"Memo";case Yn:t=e._payload,e=e._init;try{return rc(e(t))}catch{}}return null}function P0(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return rc(t);case 8:return t===au?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function mr(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Gf(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function F0(e){var t=Gf(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var s=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(i){r=""+i,o.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Js(e){e._valueTracker||(e._valueTracker=F0(e))}function zf(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=Gf(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Fo(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function lc(e,t){var n=t.checked;return Je({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Cd(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=mr(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function qf(e,t){t=t.checked,t!=null&&iu(e,"checked",t,!1)}function sc(e,t){qf(e,t);var n=mr(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?oc(e,t.type,n):t.hasOwnProperty("defaultValue")&&oc(e,t.type,mr(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Ed(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function oc(e,t,n){(t!=="number"||Fo(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Vl=Array.isArray;function tl(e,t,n,r){if(e=e.options,t){t={};for(var s=0;s<n.length;s++)t["$"+n[s]]=!0;for(n=0;n<e.length;n++)s=t.hasOwnProperty("$"+e[n].value),e[n].selected!==s&&(e[n].selected=s),s&&r&&(e[n].defaultSelected=!0)}else{for(n=""+mr(n),t=null,s=0;s<e.length;s++){if(e[s].value===n){e[s].selected=!0,r&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function ic(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(A(91));return Je({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Td(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(A(92));if(Vl(n)){if(1<n.length)throw Error(A(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:mr(n)}}function Vf(e,t){var n=mr(t.value),r=mr(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Md(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Uf(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ac(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Uf(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Zs,Bf=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,s){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,s)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Zs=Zs||document.createElement("div"),Zs.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Zs.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function as(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Ql={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},$0=["Webkit","ms","Moz","O"];Object.keys(Ql).forEach(function(e){$0.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Ql[t]=Ql[e]})});function Hf(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Ql.hasOwnProperty(e)&&Ql[e]?(""+t).trim():t+"px"}function Wf(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,s=Hf(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,s):e[n]=s}}var G0=Je({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function cc(e,t){if(t){if(G0[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(A(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(A(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(A(61))}if(t.style!=null&&typeof t.style!="object")throw Error(A(62))}}function uc(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var dc=null;function du(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var mc=null,nl=null,rl=null;function _d(e){if(e=_s(e)){if(typeof mc!="function")throw Error(A(280));var t=e.stateNode;t&&(t=Ci(t),mc(e.stateNode,e.type,t))}}function Kf(e){nl?rl?rl.push(e):rl=[e]:nl=e}function Qf(){if(nl){var e=nl,t=rl;if(rl=nl=null,_d(e),t)for(e=0;e<t.length;e++)_d(t[e])}}function Yf(e,t){return e(t)}function Xf(){}var ma=!1;function Jf(e,t,n){if(ma)return e(t,n);ma=!0;try{return Yf(e,t,n)}finally{ma=!1,(nl!==null||rl!==null)&&(Xf(),Qf())}}function cs(e,t){var n=e.stateNode;if(n===null)return null;var r=Ci(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(A(231,t,typeof n));return n}var fc=!1;if(Dn)try{var Rl={};Object.defineProperty(Rl,"passive",{get:function(){fc=!0}}),window.addEventListener("test",Rl,Rl),window.removeEventListener("test",Rl,Rl)}catch{fc=!1}function z0(e,t,n,r,s,o,i,a,c){var u=Array.prototype.slice.call(arguments,3);try{t.apply(n,u)}catch(d){this.onError(d)}}var Yl=!1,$o=null,Go=!1,pc=null,q0={onError:function(e){Yl=!0,$o=e}};function V0(e,t,n,r,s,o,i,a,c){Yl=!1,$o=null,z0.apply(q0,arguments)}function U0(e,t,n,r,s,o,i,a,c){if(V0.apply(this,arguments),Yl){if(Yl){var u=$o;Yl=!1,$o=null}else throw Error(A(198));Go||(Go=!0,pc=u)}}function Ar(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Zf(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Rd(e){if(Ar(e)!==e)throw Error(A(188))}function B0(e){var t=e.alternate;if(!t){if(t=Ar(e),t===null)throw Error(A(188));return t!==e?null:e}for(var n=e,r=t;;){var s=n.return;if(s===null)break;var o=s.alternate;if(o===null){if(r=s.return,r!==null){n=r;continue}break}if(s.child===o.child){for(o=s.child;o;){if(o===n)return Rd(s),e;if(o===r)return Rd(s),t;o=o.sibling}throw Error(A(188))}if(n.return!==r.return)n=s,r=o;else{for(var i=!1,a=s.child;a;){if(a===n){i=!0,n=s,r=o;break}if(a===r){i=!0,r=s,n=o;break}a=a.sibling}if(!i){for(a=o.child;a;){if(a===n){i=!0,n=o,r=s;break}if(a===r){i=!0,r=o,n=s;break}a=a.sibling}if(!i)throw Error(A(189))}}if(n.alternate!==r)throw Error(A(190))}if(n.tag!==3)throw Error(A(188));return n.stateNode.current===n?e:t}function ep(e){return e=B0(e),e!==null?tp(e):null}function tp(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=tp(e);if(t!==null)return t;e=e.sibling}return null}var np=qt.unstable_scheduleCallback,Ld=qt.unstable_cancelCallback,H0=qt.unstable_shouldYield,W0=qt.unstable_requestPaint,rt=qt.unstable_now,K0=qt.unstable_getCurrentPriorityLevel,mu=qt.unstable_ImmediatePriority,rp=qt.unstable_UserBlockingPriority,zo=qt.unstable_NormalPriority,Q0=qt.unstable_LowPriority,lp=qt.unstable_IdlePriority,Ni=null,bn=null;function Y0(e){if(bn&&typeof bn.onCommitFiberRoot=="function")try{bn.onCommitFiberRoot(Ni,e,void 0,(e.current.flags&128)===128)}catch{}}var cn=Math.clz32?Math.clz32:Z0,X0=Math.log,J0=Math.LN2;function Z0(e){return e>>>=0,e===0?32:31-(X0(e)/J0|0)|0}var eo=64,to=4194304;function Ul(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function qo(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,s=e.suspendedLanes,o=e.pingedLanes,i=n&268435455;if(i!==0){var a=i&~s;a!==0?r=Ul(a):(o&=i,o!==0&&(r=Ul(o)))}else i=n&~s,i!==0?r=Ul(i):o!==0&&(r=Ul(o));if(r===0)return 0;if(t!==0&&t!==r&&!(t&s)&&(s=r&-r,o=t&-t,s>=o||s===16&&(o&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-cn(t),s=1<<n,r|=e[n],t&=~s;return r}function ex(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function tx(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,s=e.expirationTimes,o=e.pendingLanes;0<o;){var i=31-cn(o),a=1<<i,c=s[i];c===-1?(!(a&n)||a&r)&&(s[i]=ex(a,t)):c<=t&&(e.expiredLanes|=a),o&=~a}}function hc(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function sp(){var e=eo;return eo<<=1,!(eo&4194240)&&(eo=64),e}function fa(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ts(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-cn(t),e[t]=n}function nx(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var s=31-cn(n),o=1<<s;t[s]=0,r[s]=-1,e[s]=-1,n&=~o}}function fu(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-cn(n),s=1<<r;s&t|e[r]&t&&(e[r]|=t),n&=~s}}var De=0;function op(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var ip,pu,ap,cp,up,gc=!1,no=[],lr=null,sr=null,or=null,us=new Map,ds=new Map,Jn=[],rx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Id(e,t){switch(e){case"focusin":case"focusout":lr=null;break;case"dragenter":case"dragleave":sr=null;break;case"mouseover":case"mouseout":or=null;break;case"pointerover":case"pointerout":us.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ds.delete(t.pointerId)}}function Ll(e,t,n,r,s,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:o,targetContainers:[s]},t!==null&&(t=_s(t),t!==null&&pu(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function lx(e,t,n,r,s){switch(t){case"focusin":return lr=Ll(lr,e,t,n,r,s),!0;case"dragenter":return sr=Ll(sr,e,t,n,r,s),!0;case"mouseover":return or=Ll(or,e,t,n,r,s),!0;case"pointerover":var o=s.pointerId;return us.set(o,Ll(us.get(o)||null,e,t,n,r,s)),!0;case"gotpointercapture":return o=s.pointerId,ds.set(o,Ll(ds.get(o)||null,e,t,n,r,s)),!0}return!1}function dp(e){var t=Sr(e.target);if(t!==null){var n=Ar(t);if(n!==null){if(t=n.tag,t===13){if(t=Zf(n),t!==null){e.blockedOn=t,up(e.priority,function(){ap(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function So(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=xc(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);dc=r,n.target.dispatchEvent(r),dc=null}else return t=_s(n),t!==null&&pu(t),e.blockedOn=n,!1;t.shift()}return!0}function Od(e,t,n){So(e)&&n.delete(t)}function sx(){gc=!1,lr!==null&&So(lr)&&(lr=null),sr!==null&&So(sr)&&(sr=null),or!==null&&So(or)&&(or=null),us.forEach(Od),ds.forEach(Od)}function Il(e,t){e.blockedOn===t&&(e.blockedOn=null,gc||(gc=!0,qt.unstable_scheduleCallback(qt.unstable_NormalPriority,sx)))}function ms(e){function t(s){return Il(s,e)}if(0<no.length){Il(no[0],e);for(var n=1;n<no.length;n++){var r=no[n];r.blockedOn===e&&(r.blockedOn=null)}}for(lr!==null&&Il(lr,e),sr!==null&&Il(sr,e),or!==null&&Il(or,e),us.forEach(t),ds.forEach(t),n=0;n<Jn.length;n++)r=Jn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<Jn.length&&(n=Jn[0],n.blockedOn===null);)dp(n),n.blockedOn===null&&Jn.shift()}var ll=zn.ReactCurrentBatchConfig,Vo=!0;function ox(e,t,n,r){var s=De,o=ll.transition;ll.transition=null;try{De=1,hu(e,t,n,r)}finally{De=s,ll.transition=o}}function ix(e,t,n,r){var s=De,o=ll.transition;ll.transition=null;try{De=4,hu(e,t,n,r)}finally{De=s,ll.transition=o}}function hu(e,t,n,r){if(Vo){var s=xc(e,t,n,r);if(s===null)ka(e,t,r,Uo,n),Id(e,r);else if(lx(s,e,t,n,r))r.stopPropagation();else if(Id(e,r),t&4&&-1<rx.indexOf(e)){for(;s!==null;){var o=_s(s);if(o!==null&&ip(o),o=xc(e,t,n,r),o===null&&ka(e,t,r,Uo,n),o===s)break;s=o}s!==null&&r.stopPropagation()}else ka(e,t,r,null,n)}}var Uo=null;function xc(e,t,n,r){if(Uo=null,e=du(r),e=Sr(e),e!==null)if(t=Ar(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Zf(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Uo=e,null}function mp(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(K0()){case mu:return 1;case rp:return 4;case zo:case Q0:return 16;case lp:return 536870912;default:return 16}default:return 16}}var er=null,gu=null,jo=null;function fp(){if(jo)return jo;var e,t=gu,n=t.length,r,s="value"in er?er.value:er.textContent,o=s.length;for(e=0;e<n&&t[e]===s[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===s[o-r];r++);return jo=s.slice(e,1<r?1-r:void 0)}function Co(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ro(){return!0}function Ad(){return!1}function Ut(e){function t(n,r,s,o,i){this._reactName=n,this._targetInst=s,this.type=r,this.nativeEvent=o,this.target=i,this.currentTarget=null;for(var a in e)e.hasOwnProperty(a)&&(n=e[a],this[a]=n?n(o):o[a]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?ro:Ad,this.isPropagationStopped=Ad,this}return Je(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ro)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ro)},persist:function(){},isPersistent:ro}),t}var yl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},xu=Ut(yl),Ms=Je({},yl,{view:0,detail:0}),ax=Ut(Ms),pa,ha,Ol,ki=Je({},Ms,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:yu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ol&&(Ol&&e.type==="mousemove"?(pa=e.screenX-Ol.screenX,ha=e.screenY-Ol.screenY):ha=pa=0,Ol=e),pa)},movementY:function(e){return"movementY"in e?e.movementY:ha}}),Dd=Ut(ki),cx=Je({},ki,{dataTransfer:0}),ux=Ut(cx),dx=Je({},Ms,{relatedTarget:0}),ga=Ut(dx),mx=Je({},yl,{animationName:0,elapsedTime:0,pseudoElement:0}),fx=Ut(mx),px=Je({},yl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),hx=Ut(px),gx=Je({},yl,{data:0}),Pd=Ut(gx),xx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},yx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},vx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function bx(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=vx[e])?!!t[e]:!1}function yu(){return bx}var wx=Je({},Ms,{key:function(e){if(e.key){var t=xx[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Co(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?yx[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:yu,charCode:function(e){return e.type==="keypress"?Co(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Co(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Nx=Ut(wx),kx=Je({},ki,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Fd=Ut(kx),Sx=Je({},Ms,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:yu}),jx=Ut(Sx),Cx=Je({},yl,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ex=Ut(Cx),Tx=Je({},ki,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Mx=Ut(Tx),_x=[9,13,27,32],vu=Dn&&"CompositionEvent"in window,Xl=null;Dn&&"documentMode"in document&&(Xl=document.documentMode);var Rx=Dn&&"TextEvent"in window&&!Xl,pp=Dn&&(!vu||Xl&&8<Xl&&11>=Xl),$d=String.fromCharCode(32),Gd=!1;function hp(e,t){switch(e){case"keyup":return _x.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function gp(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Ur=!1;function Lx(e,t){switch(e){case"compositionend":return gp(t);case"keypress":return t.which!==32?null:(Gd=!0,$d);case"textInput":return e=t.data,e===$d&&Gd?null:e;default:return null}}function Ix(e,t){if(Ur)return e==="compositionend"||!vu&&hp(e,t)?(e=fp(),jo=gu=er=null,Ur=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return pp&&t.locale!=="ko"?null:t.data;default:return null}}var Ox={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function zd(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Ox[e.type]:t==="textarea"}function xp(e,t,n,r){Kf(r),t=Bo(t,"onChange"),0<t.length&&(n=new xu("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Jl=null,fs=null;function Ax(e){Tp(e,0)}function Si(e){var t=Wr(e);if(zf(t))return e}function Dx(e,t){if(e==="change")return t}var yp=!1;if(Dn){var xa;if(Dn){var ya="oninput"in document;if(!ya){var qd=document.createElement("div");qd.setAttribute("oninput","return;"),ya=typeof qd.oninput=="function"}xa=ya}else xa=!1;yp=xa&&(!document.documentMode||9<document.documentMode)}function Vd(){Jl&&(Jl.detachEvent("onpropertychange",vp),fs=Jl=null)}function vp(e){if(e.propertyName==="value"&&Si(fs)){var t=[];xp(t,fs,e,du(e)),Jf(Ax,t)}}function Px(e,t,n){e==="focusin"?(Vd(),Jl=t,fs=n,Jl.attachEvent("onpropertychange",vp)):e==="focusout"&&Vd()}function Fx(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Si(fs)}function $x(e,t){if(e==="click")return Si(t)}function Gx(e,t){if(e==="input"||e==="change")return Si(t)}function zx(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var mn=typeof Object.is=="function"?Object.is:zx;function ps(e,t){if(mn(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var s=n[r];if(!Za.call(t,s)||!mn(e[s],t[s]))return!1}return!0}function Ud(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Bd(e,t){var n=Ud(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ud(n)}}function bp(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?bp(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function wp(){for(var e=window,t=Fo();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Fo(e.document)}return t}function bu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function qx(e){var t=wp(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&bp(n.ownerDocument.documentElement,n)){if(r!==null&&bu(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=n.textContent.length,o=Math.min(r.start,s);r=r.end===void 0?o:Math.min(r.end,s),!e.extend&&o>r&&(s=r,r=o,o=s),s=Bd(n,o);var i=Bd(n,r);s&&i&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),o>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Vx=Dn&&"documentMode"in document&&11>=document.documentMode,Br=null,yc=null,Zl=null,vc=!1;function Hd(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;vc||Br==null||Br!==Fo(r)||(r=Br,"selectionStart"in r&&bu(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Zl&&ps(Zl,r)||(Zl=r,r=Bo(yc,"onSelect"),0<r.length&&(t=new xu("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Br)))}function lo(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Hr={animationend:lo("Animation","AnimationEnd"),animationiteration:lo("Animation","AnimationIteration"),animationstart:lo("Animation","AnimationStart"),transitionend:lo("Transition","TransitionEnd")},va={},Np={};Dn&&(Np=document.createElement("div").style,"AnimationEvent"in window||(delete Hr.animationend.animation,delete Hr.animationiteration.animation,delete Hr.animationstart.animation),"TransitionEvent"in window||delete Hr.transitionend.transition);function ji(e){if(va[e])return va[e];if(!Hr[e])return e;var t=Hr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Np)return va[e]=t[n];return e}var kp=ji("animationend"),Sp=ji("animationiteration"),jp=ji("animationstart"),Cp=ji("transitionend"),Ep=new Map,Wd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function pr(e,t){Ep.set(e,t),Or(t,[e])}for(var ba=0;ba<Wd.length;ba++){var wa=Wd[ba],Ux=wa.toLowerCase(),Bx=wa[0].toUpperCase()+wa.slice(1);pr(Ux,"on"+Bx)}pr(kp,"onAnimationEnd");pr(Sp,"onAnimationIteration");pr(jp,"onAnimationStart");pr("dblclick","onDoubleClick");pr("focusin","onFocus");pr("focusout","onBlur");pr(Cp,"onTransitionEnd");il("onMouseEnter",["mouseout","mouseover"]);il("onMouseLeave",["mouseout","mouseover"]);il("onPointerEnter",["pointerout","pointerover"]);il("onPointerLeave",["pointerout","pointerover"]);Or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Or("onBeforeInput",["compositionend","keypress","textInput","paste"]);Or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Hx=new Set("cancel close invalid load scroll toggle".split(" ").concat(Bl));function Kd(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,U0(r,t,void 0,e),e.currentTarget=null}function Tp(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],s=r.event;r=r.listeners;e:{var o=void 0;if(t)for(var i=r.length-1;0<=i;i--){var a=r[i],c=a.instance,u=a.currentTarget;if(a=a.listener,c!==o&&s.isPropagationStopped())break e;Kd(s,a,u),o=c}else for(i=0;i<r.length;i++){if(a=r[i],c=a.instance,u=a.currentTarget,a=a.listener,c!==o&&s.isPropagationStopped())break e;Kd(s,a,u),o=c}}}if(Go)throw e=pc,Go=!1,pc=null,e}function Ve(e,t){var n=t[Sc];n===void 0&&(n=t[Sc]=new Set);var r=e+"__bubble";n.has(r)||(Mp(t,e,2,!1),n.add(r))}function Na(e,t,n){var r=0;t&&(r|=4),Mp(n,e,r,t)}var so="_reactListening"+Math.random().toString(36).slice(2);function hs(e){if(!e[so]){e[so]=!0,Df.forEach(function(n){n!=="selectionchange"&&(Hx.has(n)||Na(n,!1,e),Na(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[so]||(t[so]=!0,Na("selectionchange",!1,t))}}function Mp(e,t,n,r){switch(mp(t)){case 1:var s=ox;break;case 4:s=ix;break;default:s=hu}n=s.bind(null,t,n,e),s=void 0,!fc||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),r?s!==void 0?e.addEventListener(t,n,{capture:!0,passive:s}):e.addEventListener(t,n,!0):s!==void 0?e.addEventListener(t,n,{passive:s}):e.addEventListener(t,n,!1)}function ka(e,t,n,r,s){var o=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var a=r.stateNode.containerInfo;if(a===s||a.nodeType===8&&a.parentNode===s)break;if(i===4)for(i=r.return;i!==null;){var c=i.tag;if((c===3||c===4)&&(c=i.stateNode.containerInfo,c===s||c.nodeType===8&&c.parentNode===s))return;i=i.return}for(;a!==null;){if(i=Sr(a),i===null)return;if(c=i.tag,c===5||c===6){r=o=i;continue e}a=a.parentNode}}r=r.return}Jf(function(){var u=o,d=du(n),p=[];e:{var m=Ep.get(e);if(m!==void 0){var h=xu,g=e;switch(e){case"keypress":if(Co(n)===0)break e;case"keydown":case"keyup":h=Nx;break;case"focusin":g="focus",h=ga;break;case"focusout":g="blur",h=ga;break;case"beforeblur":case"afterblur":h=ga;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":h=Dd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":h=ux;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":h=jx;break;case kp:case Sp:case jp:h=fx;break;case Cp:h=Ex;break;case"scroll":h=ax;break;case"wheel":h=Mx;break;case"copy":case"cut":case"paste":h=hx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":h=Fd}var v=(t&4)!==0,w=!v&&e==="scroll",x=v?m!==null?m+"Capture":null:m;v=[];for(var y=u,b;y!==null;){b=y;var k=b.stateNode;if(b.tag===5&&k!==null&&(b=k,x!==null&&(k=cs(y,x),k!=null&&v.push(gs(y,k,b)))),w)break;y=y.return}0<v.length&&(m=new h(m,g,null,n,d),p.push({event:m,listeners:v}))}}if(!(t&7)){e:{if(m=e==="mouseover"||e==="pointerover",h=e==="mouseout"||e==="pointerout",m&&n!==dc&&(g=n.relatedTarget||n.fromElement)&&(Sr(g)||g[Pn]))break e;if((h||m)&&(m=d.window===d?d:(m=d.ownerDocument)?m.defaultView||m.parentWindow:window,h?(g=n.relatedTarget||n.toElement,h=u,g=g?Sr(g):null,g!==null&&(w=Ar(g),g!==w||g.tag!==5&&g.tag!==6)&&(g=null)):(h=null,g=u),h!==g)){if(v=Dd,k="onMouseLeave",x="onMouseEnter",y="mouse",(e==="pointerout"||e==="pointerover")&&(v=Fd,k="onPointerLeave",x="onPointerEnter",y="pointer"),w=h==null?m:Wr(h),b=g==null?m:Wr(g),m=new v(k,y+"leave",h,n,d),m.target=w,m.relatedTarget=b,k=null,Sr(d)===u&&(v=new v(x,y+"enter",g,n,d),v.target=b,v.relatedTarget=w,k=v),w=k,h&&g)t:{for(v=h,x=g,y=0,b=v;b;b=$r(b))y++;for(b=0,k=x;k;k=$r(k))b++;for(;0<y-b;)v=$r(v),y--;for(;0<b-y;)x=$r(x),b--;for(;y--;){if(v===x||x!==null&&v===x.alternate)break t;v=$r(v),x=$r(x)}v=null}else v=null;h!==null&&Qd(p,m,h,v,!1),g!==null&&w!==null&&Qd(p,w,g,v,!0)}}e:{if(m=u?Wr(u):window,h=m.nodeName&&m.nodeName.toLowerCase(),h==="select"||h==="input"&&m.type==="file")var N=Dx;else if(zd(m))if(yp)N=Gx;else{N=Fx;var E=Px}else(h=m.nodeName)&&h.toLowerCase()==="input"&&(m.type==="checkbox"||m.type==="radio")&&(N=$x);if(N&&(N=N(e,u))){xp(p,N,n,d);break e}E&&E(e,m,u),e==="focusout"&&(E=m._wrapperState)&&E.controlled&&m.type==="number"&&oc(m,"number",m.value)}switch(E=u?Wr(u):window,e){case"focusin":(zd(E)||E.contentEditable==="true")&&(Br=E,yc=u,Zl=null);break;case"focusout":Zl=yc=Br=null;break;case"mousedown":vc=!0;break;case"contextmenu":case"mouseup":case"dragend":vc=!1,Hd(p,n,d);break;case"selectionchange":if(Vx)break;case"keydown":case"keyup":Hd(p,n,d)}var j;if(vu)e:{switch(e){case"compositionstart":var C="onCompositionStart";break e;case"compositionend":C="onCompositionEnd";break e;case"compositionupdate":C="onCompositionUpdate";break e}C=void 0}else Ur?hp(e,n)&&(C="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(C="onCompositionStart");C&&(pp&&n.locale!=="ko"&&(Ur||C!=="onCompositionStart"?C==="onCompositionEnd"&&Ur&&(j=fp()):(er=d,gu="value"in er?er.value:er.textContent,Ur=!0)),E=Bo(u,C),0<E.length&&(C=new Pd(C,e,null,n,d),p.push({event:C,listeners:E}),j?C.data=j:(j=gp(n),j!==null&&(C.data=j)))),(j=Rx?Lx(e,n):Ix(e,n))&&(u=Bo(u,"onBeforeInput"),0<u.length&&(d=new Pd("onBeforeInput","beforeinput",null,n,d),p.push({event:d,listeners:u}),d.data=j))}Tp(p,t)})}function gs(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Bo(e,t){for(var n=t+"Capture",r=[];e!==null;){var s=e,o=s.stateNode;s.tag===5&&o!==null&&(s=o,o=cs(e,n),o!=null&&r.unshift(gs(e,o,s)),o=cs(e,t),o!=null&&r.push(gs(e,o,s))),e=e.return}return r}function $r(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Qd(e,t,n,r,s){for(var o=t._reactName,i=[];n!==null&&n!==r;){var a=n,c=a.alternate,u=a.stateNode;if(c!==null&&c===r)break;a.tag===5&&u!==null&&(a=u,s?(c=cs(n,o),c!=null&&i.unshift(gs(n,c,a))):s||(c=cs(n,o),c!=null&&i.push(gs(n,c,a)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var Wx=/\r\n?/g,Kx=/\u0000|\uFFFD/g;function Yd(e){return(typeof e=="string"?e:""+e).replace(Wx,`
`).replace(Kx,"")}function oo(e,t,n){if(t=Yd(t),Yd(e)!==t&&n)throw Error(A(425))}function Ho(){}var bc=null,wc=null;function Nc(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var kc=typeof setTimeout=="function"?setTimeout:void 0,Qx=typeof clearTimeout=="function"?clearTimeout:void 0,Xd=typeof Promise=="function"?Promise:void 0,Yx=typeof queueMicrotask=="function"?queueMicrotask:typeof Xd<"u"?function(e){return Xd.resolve(null).then(e).catch(Xx)}:kc;function Xx(e){setTimeout(function(){throw e})}function Sa(e,t){var n=t,r=0;do{var s=n.nextSibling;if(e.removeChild(n),s&&s.nodeType===8)if(n=s.data,n==="/$"){if(r===0){e.removeChild(s),ms(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=s}while(n);ms(t)}function ir(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Jd(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var vl=Math.random().toString(36).slice(2),vn="__reactFiber$"+vl,xs="__reactProps$"+vl,Pn="__reactContainer$"+vl,Sc="__reactEvents$"+vl,Jx="__reactListeners$"+vl,Zx="__reactHandles$"+vl;function Sr(e){var t=e[vn];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Pn]||n[vn]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Jd(e);e!==null;){if(n=e[vn])return n;e=Jd(e)}return t}e=n,n=e.parentNode}return null}function _s(e){return e=e[vn]||e[Pn],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Wr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(A(33))}function Ci(e){return e[xs]||null}var jc=[],Kr=-1;function hr(e){return{current:e}}function Ue(e){0>Kr||(e.current=jc[Kr],jc[Kr]=null,Kr--)}function ze(e,t){Kr++,jc[Kr]=e.current,e.current=t}var fr={},kt=hr(fr),At=hr(!1),Mr=fr;function al(e,t){var n=e.type.contextTypes;if(!n)return fr;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var s={},o;for(o in n)s[o]=t[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function Dt(e){return e=e.childContextTypes,e!=null}function Wo(){Ue(At),Ue(kt)}function Zd(e,t,n){if(kt.current!==fr)throw Error(A(168));ze(kt,t),ze(At,n)}function _p(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var s in r)if(!(s in t))throw Error(A(108,P0(e)||"Unknown",s));return Je({},n,r)}function Ko(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||fr,Mr=kt.current,ze(kt,e),ze(At,At.current),!0}function em(e,t,n){var r=e.stateNode;if(!r)throw Error(A(169));n?(e=_p(e,t,Mr),r.__reactInternalMemoizedMergedChildContext=e,Ue(At),Ue(kt),ze(kt,e)):Ue(At),ze(At,n)}var _n=null,Ei=!1,ja=!1;function Rp(e){_n===null?_n=[e]:_n.push(e)}function ey(e){Ei=!0,Rp(e)}function gr(){if(!ja&&_n!==null){ja=!0;var e=0,t=De;try{var n=_n;for(De=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}_n=null,Ei=!1}catch(s){throw _n!==null&&(_n=_n.slice(e+1)),np(mu,gr),s}finally{De=t,ja=!1}}return null}var Qr=[],Yr=0,Qo=null,Yo=0,Qt=[],Yt=0,_r=null,Rn=1,Ln="";function br(e,t){Qr[Yr++]=Yo,Qr[Yr++]=Qo,Qo=e,Yo=t}function Lp(e,t,n){Qt[Yt++]=Rn,Qt[Yt++]=Ln,Qt[Yt++]=_r,_r=e;var r=Rn;e=Ln;var s=32-cn(r)-1;r&=~(1<<s),n+=1;var o=32-cn(t)+s;if(30<o){var i=s-s%5;o=(r&(1<<i)-1).toString(32),r>>=i,s-=i,Rn=1<<32-cn(t)+s|n<<s|r,Ln=o+e}else Rn=1<<o|n<<s|r,Ln=e}function wu(e){e.return!==null&&(br(e,1),Lp(e,1,0))}function Nu(e){for(;e===Qo;)Qo=Qr[--Yr],Qr[Yr]=null,Yo=Qr[--Yr],Qr[Yr]=null;for(;e===_r;)_r=Qt[--Yt],Qt[Yt]=null,Ln=Qt[--Yt],Qt[Yt]=null,Rn=Qt[--Yt],Qt[Yt]=null}var zt=null,Gt=null,He=!1,on=null;function Ip(e,t){var n=Xt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function tm(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,zt=e,Gt=ir(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,zt=e,Gt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=_r!==null?{id:Rn,overflow:Ln}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Xt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,zt=e,Gt=null,!0):!1;default:return!1}}function Cc(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Ec(e){if(He){var t=Gt;if(t){var n=t;if(!tm(e,t)){if(Cc(e))throw Error(A(418));t=ir(n.nextSibling);var r=zt;t&&tm(e,t)?Ip(r,n):(e.flags=e.flags&-4097|2,He=!1,zt=e)}}else{if(Cc(e))throw Error(A(418));e.flags=e.flags&-4097|2,He=!1,zt=e}}}function nm(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;zt=e}function io(e){if(e!==zt)return!1;if(!He)return nm(e),He=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Nc(e.type,e.memoizedProps)),t&&(t=Gt)){if(Cc(e))throw Op(),Error(A(418));for(;t;)Ip(e,t),t=ir(t.nextSibling)}if(nm(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(A(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){Gt=ir(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}Gt=null}}else Gt=zt?ir(e.stateNode.nextSibling):null;return!0}function Op(){for(var e=Gt;e;)e=ir(e.nextSibling)}function cl(){Gt=zt=null,He=!1}function ku(e){on===null?on=[e]:on.push(e)}var ty=zn.ReactCurrentBatchConfig;function Al(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(A(309));var r=n.stateNode}if(!r)throw Error(A(147,e));var s=r,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(i){var a=s.refs;i===null?delete a[o]:a[o]=i},t._stringRef=o,t)}if(typeof e!="string")throw Error(A(284));if(!n._owner)throw Error(A(290,e))}return e}function ao(e,t){throw e=Object.prototype.toString.call(t),Error(A(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function rm(e){var t=e._init;return t(e._payload)}function Ap(e){function t(x,y){if(e){var b=x.deletions;b===null?(x.deletions=[y],x.flags|=16):b.push(y)}}function n(x,y){if(!e)return null;for(;y!==null;)t(x,y),y=y.sibling;return null}function r(x,y){for(x=new Map;y!==null;)y.key!==null?x.set(y.key,y):x.set(y.index,y),y=y.sibling;return x}function s(x,y){return x=dr(x,y),x.index=0,x.sibling=null,x}function o(x,y,b){return x.index=b,e?(b=x.alternate,b!==null?(b=b.index,b<y?(x.flags|=2,y):b):(x.flags|=2,y)):(x.flags|=1048576,y)}function i(x){return e&&x.alternate===null&&(x.flags|=2),x}function a(x,y,b,k){return y===null||y.tag!==6?(y=La(b,x.mode,k),y.return=x,y):(y=s(y,b),y.return=x,y)}function c(x,y,b,k){var N=b.type;return N===Vr?d(x,y,b.props.children,k,b.key):y!==null&&(y.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Yn&&rm(N)===y.type)?(k=s(y,b.props),k.ref=Al(x,y,b),k.return=x,k):(k=Io(b.type,b.key,b.props,null,x.mode,k),k.ref=Al(x,y,b),k.return=x,k)}function u(x,y,b,k){return y===null||y.tag!==4||y.stateNode.containerInfo!==b.containerInfo||y.stateNode.implementation!==b.implementation?(y=Ia(b,x.mode,k),y.return=x,y):(y=s(y,b.children||[]),y.return=x,y)}function d(x,y,b,k,N){return y===null||y.tag!==7?(y=Tr(b,x.mode,k,N),y.return=x,y):(y=s(y,b),y.return=x,y)}function p(x,y,b){if(typeof y=="string"&&y!==""||typeof y=="number")return y=La(""+y,x.mode,b),y.return=x,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Xs:return b=Io(y.type,y.key,y.props,null,x.mode,b),b.ref=Al(x,null,y),b.return=x,b;case qr:return y=Ia(y,x.mode,b),y.return=x,y;case Yn:var k=y._init;return p(x,k(y._payload),b)}if(Vl(y)||_l(y))return y=Tr(y,x.mode,b,null),y.return=x,y;ao(x,y)}return null}function m(x,y,b,k){var N=y!==null?y.key:null;if(typeof b=="string"&&b!==""||typeof b=="number")return N!==null?null:a(x,y,""+b,k);if(typeof b=="object"&&b!==null){switch(b.$$typeof){case Xs:return b.key===N?c(x,y,b,k):null;case qr:return b.key===N?u(x,y,b,k):null;case Yn:return N=b._init,m(x,y,N(b._payload),k)}if(Vl(b)||_l(b))return N!==null?null:d(x,y,b,k,null);ao(x,b)}return null}function h(x,y,b,k,N){if(typeof k=="string"&&k!==""||typeof k=="number")return x=x.get(b)||null,a(y,x,""+k,N);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case Xs:return x=x.get(k.key===null?b:k.key)||null,c(y,x,k,N);case qr:return x=x.get(k.key===null?b:k.key)||null,u(y,x,k,N);case Yn:var E=k._init;return h(x,y,b,E(k._payload),N)}if(Vl(k)||_l(k))return x=x.get(b)||null,d(y,x,k,N,null);ao(y,k)}return null}function g(x,y,b,k){for(var N=null,E=null,j=y,C=y=0,D=null;j!==null&&C<b.length;C++){j.index>C?(D=j,j=null):D=j.sibling;var M=m(x,j,b[C],k);if(M===null){j===null&&(j=D);break}e&&j&&M.alternate===null&&t(x,j),y=o(M,y,C),E===null?N=M:E.sibling=M,E=M,j=D}if(C===b.length)return n(x,j),He&&br(x,C),N;if(j===null){for(;C<b.length;C++)j=p(x,b[C],k),j!==null&&(y=o(j,y,C),E===null?N=j:E.sibling=j,E=j);return He&&br(x,C),N}for(j=r(x,j);C<b.length;C++)D=h(j,x,C,b[C],k),D!==null&&(e&&D.alternate!==null&&j.delete(D.key===null?C:D.key),y=o(D,y,C),E===null?N=D:E.sibling=D,E=D);return e&&j.forEach(function(Y){return t(x,Y)}),He&&br(x,C),N}function v(x,y,b,k){var N=_l(b);if(typeof N!="function")throw Error(A(150));if(b=N.call(b),b==null)throw Error(A(151));for(var E=N=null,j=y,C=y=0,D=null,M=b.next();j!==null&&!M.done;C++,M=b.next()){j.index>C?(D=j,j=null):D=j.sibling;var Y=m(x,j,M.value,k);if(Y===null){j===null&&(j=D);break}e&&j&&Y.alternate===null&&t(x,j),y=o(Y,y,C),E===null?N=Y:E.sibling=Y,E=Y,j=D}if(M.done)return n(x,j),He&&br(x,C),N;if(j===null){for(;!M.done;C++,M=b.next())M=p(x,M.value,k),M!==null&&(y=o(M,y,C),E===null?N=M:E.sibling=M,E=M);return He&&br(x,C),N}for(j=r(x,j);!M.done;C++,M=b.next())M=h(j,x,C,M.value,k),M!==null&&(e&&M.alternate!==null&&j.delete(M.key===null?C:M.key),y=o(M,y,C),E===null?N=M:E.sibling=M,E=M);return e&&j.forEach(function(B){return t(x,B)}),He&&br(x,C),N}function w(x,y,b,k){if(typeof b=="object"&&b!==null&&b.type===Vr&&b.key===null&&(b=b.props.children),typeof b=="object"&&b!==null){switch(b.$$typeof){case Xs:e:{for(var N=b.key,E=y;E!==null;){if(E.key===N){if(N=b.type,N===Vr){if(E.tag===7){n(x,E.sibling),y=s(E,b.props.children),y.return=x,x=y;break e}}else if(E.elementType===N||typeof N=="object"&&N!==null&&N.$$typeof===Yn&&rm(N)===E.type){n(x,E.sibling),y=s(E,b.props),y.ref=Al(x,E,b),y.return=x,x=y;break e}n(x,E);break}else t(x,E);E=E.sibling}b.type===Vr?(y=Tr(b.props.children,x.mode,k,b.key),y.return=x,x=y):(k=Io(b.type,b.key,b.props,null,x.mode,k),k.ref=Al(x,y,b),k.return=x,x=k)}return i(x);case qr:e:{for(E=b.key;y!==null;){if(y.key===E)if(y.tag===4&&y.stateNode.containerInfo===b.containerInfo&&y.stateNode.implementation===b.implementation){n(x,y.sibling),y=s(y,b.children||[]),y.return=x,x=y;break e}else{n(x,y);break}else t(x,y);y=y.sibling}y=Ia(b,x.mode,k),y.return=x,x=y}return i(x);case Yn:return E=b._init,w(x,y,E(b._payload),k)}if(Vl(b))return g(x,y,b,k);if(_l(b))return v(x,y,b,k);ao(x,b)}return typeof b=="string"&&b!==""||typeof b=="number"?(b=""+b,y!==null&&y.tag===6?(n(x,y.sibling),y=s(y,b),y.return=x,x=y):(n(x,y),y=La(b,x.mode,k),y.return=x,x=y),i(x)):n(x,y)}return w}var ul=Ap(!0),Dp=Ap(!1),Xo=hr(null),Jo=null,Xr=null,Su=null;function ju(){Su=Xr=Jo=null}function Cu(e){var t=Xo.current;Ue(Xo),e._currentValue=t}function Tc(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function sl(e,t){Jo=e,Su=Xr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Ot=!0),e.firstContext=null)}function en(e){var t=e._currentValue;if(Su!==e)if(e={context:e,memoizedValue:t,next:null},Xr===null){if(Jo===null)throw Error(A(308));Xr=e,Jo.dependencies={lanes:0,firstContext:e}}else Xr=Xr.next=e;return t}var jr=null;function Eu(e){jr===null?jr=[e]:jr.push(e)}function Pp(e,t,n,r){var s=t.interleaved;return s===null?(n.next=n,Eu(t)):(n.next=s.next,s.next=n),t.interleaved=n,Fn(e,r)}function Fn(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Xn=!1;function Tu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Fp(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function An(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function ar(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,Me&2){var s=r.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),r.pending=t,Fn(e,n)}return s=r.interleaved,s===null?(t.next=t,Eu(r)):(t.next=s.next,s.next=t),r.interleaved=t,Fn(e,n)}function Eo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,fu(e,n)}}function lm(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var s=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?s=o=i:o=o.next=i,n=n.next}while(n!==null);o===null?s=o=t:o=o.next=t}else s=o=t;n={baseState:r.baseState,firstBaseUpdate:s,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Zo(e,t,n,r){var s=e.updateQueue;Xn=!1;var o=s.firstBaseUpdate,i=s.lastBaseUpdate,a=s.shared.pending;if(a!==null){s.shared.pending=null;var c=a,u=c.next;c.next=null,i===null?o=u:i.next=u,i=c;var d=e.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==i&&(a===null?d.firstBaseUpdate=u:a.next=u,d.lastBaseUpdate=c))}if(o!==null){var p=s.baseState;i=0,d=u=c=null,a=o;do{var m=a.lane,h=a.eventTime;if((r&m)===m){d!==null&&(d=d.next={eventTime:h,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var g=e,v=a;switch(m=t,h=n,v.tag){case 1:if(g=v.payload,typeof g=="function"){p=g.call(h,p,m);break e}p=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=v.payload,m=typeof g=="function"?g.call(h,p,m):g,m==null)break e;p=Je({},p,m);break e;case 2:Xn=!0}}a.callback!==null&&a.lane!==0&&(e.flags|=64,m=s.effects,m===null?s.effects=[a]:m.push(a))}else h={eventTime:h,lane:m,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(u=d=h,c=p):d=d.next=h,i|=m;if(a=a.next,a===null){if(a=s.shared.pending,a===null)break;m=a,a=m.next,m.next=null,s.lastBaseUpdate=m,s.shared.pending=null}}while(1);if(d===null&&(c=p),s.baseState=c,s.firstBaseUpdate=u,s.lastBaseUpdate=d,t=s.shared.interleaved,t!==null){s=t;do i|=s.lane,s=s.next;while(s!==t)}else o===null&&(s.shared.lanes=0);Lr|=i,e.lanes=i,e.memoizedState=p}}function sm(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],s=r.callback;if(s!==null){if(r.callback=null,r=n,typeof s!="function")throw Error(A(191,s));s.call(r)}}}var Rs={},wn=hr(Rs),ys=hr(Rs),vs=hr(Rs);function Cr(e){if(e===Rs)throw Error(A(174));return e}function Mu(e,t){switch(ze(vs,t),ze(ys,e),ze(wn,Rs),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:ac(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=ac(t,e)}Ue(wn),ze(wn,t)}function dl(){Ue(wn),Ue(ys),Ue(vs)}function $p(e){Cr(vs.current);var t=Cr(wn.current),n=ac(t,e.type);t!==n&&(ze(ys,e),ze(wn,n))}function _u(e){ys.current===e&&(Ue(wn),Ue(ys))}var Ye=hr(0);function ei(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ca=[];function Ru(){for(var e=0;e<Ca.length;e++)Ca[e]._workInProgressVersionPrimary=null;Ca.length=0}var To=zn.ReactCurrentDispatcher,Ea=zn.ReactCurrentBatchConfig,Rr=0,Xe=null,ut=null,ft=null,ti=!1,es=!1,bs=0,ny=0;function vt(){throw Error(A(321))}function Lu(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!mn(e[n],t[n]))return!1;return!0}function Iu(e,t,n,r,s,o){if(Rr=o,Xe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,To.current=e===null||e.memoizedState===null?oy:iy,e=n(r,s),es){o=0;do{if(es=!1,bs=0,25<=o)throw Error(A(301));o+=1,ft=ut=null,t.updateQueue=null,To.current=ay,e=n(r,s)}while(es)}if(To.current=ni,t=ut!==null&&ut.next!==null,Rr=0,ft=ut=Xe=null,ti=!1,t)throw Error(A(300));return e}function Ou(){var e=bs!==0;return bs=0,e}function xn(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ft===null?Xe.memoizedState=ft=e:ft=ft.next=e,ft}function tn(){if(ut===null){var e=Xe.alternate;e=e!==null?e.memoizedState:null}else e=ut.next;var t=ft===null?Xe.memoizedState:ft.next;if(t!==null)ft=t,ut=e;else{if(e===null)throw Error(A(310));ut=e,e={memoizedState:ut.memoizedState,baseState:ut.baseState,baseQueue:ut.baseQueue,queue:ut.queue,next:null},ft===null?Xe.memoizedState=ft=e:ft=ft.next=e}return ft}function ws(e,t){return typeof t=="function"?t(e):t}function Ta(e){var t=tn(),n=t.queue;if(n===null)throw Error(A(311));n.lastRenderedReducer=e;var r=ut,s=r.baseQueue,o=n.pending;if(o!==null){if(s!==null){var i=s.next;s.next=o.next,o.next=i}r.baseQueue=s=o,n.pending=null}if(s!==null){o=s.next,r=r.baseState;var a=i=null,c=null,u=o;do{var d=u.lane;if((Rr&d)===d)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),r=u.hasEagerState?u.eagerState:e(r,u.action);else{var p={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(a=c=p,i=r):c=c.next=p,Xe.lanes|=d,Lr|=d}u=u.next}while(u!==null&&u!==o);c===null?i=r:c.next=a,mn(r,t.memoizedState)||(Ot=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=c,n.lastRenderedState=r}if(e=n.interleaved,e!==null){s=e;do o=s.lane,Xe.lanes|=o,Lr|=o,s=s.next;while(s!==e)}else s===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ma(e){var t=tn(),n=t.queue;if(n===null)throw Error(A(311));n.lastRenderedReducer=e;var r=n.dispatch,s=n.pending,o=t.memoizedState;if(s!==null){n.pending=null;var i=s=s.next;do o=e(o,i.action),i=i.next;while(i!==s);mn(o,t.memoizedState)||(Ot=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Gp(){}function zp(e,t){var n=Xe,r=tn(),s=t(),o=!mn(r.memoizedState,s);if(o&&(r.memoizedState=s,Ot=!0),r=r.queue,Au(Up.bind(null,n,r,e),[e]),r.getSnapshot!==t||o||ft!==null&&ft.memoizedState.tag&1){if(n.flags|=2048,Ns(9,Vp.bind(null,n,r,s,t),void 0,null),pt===null)throw Error(A(349));Rr&30||qp(n,t,s)}return s}function qp(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Xe.updateQueue,t===null?(t={lastEffect:null,stores:null},Xe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Vp(e,t,n,r){t.value=n,t.getSnapshot=r,Bp(t)&&Hp(e)}function Up(e,t,n){return n(function(){Bp(t)&&Hp(e)})}function Bp(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!mn(e,n)}catch{return!0}}function Hp(e){var t=Fn(e,1);t!==null&&un(t,e,1,-1)}function om(e){var t=xn();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ws,lastRenderedState:e},t.queue=e,e=e.dispatch=sy.bind(null,Xe,e),[t.memoizedState,e]}function Ns(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Xe.updateQueue,t===null?(t={lastEffect:null,stores:null},Xe.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Wp(){return tn().memoizedState}function Mo(e,t,n,r){var s=xn();Xe.flags|=e,s.memoizedState=Ns(1|t,n,void 0,r===void 0?null:r)}function Ti(e,t,n,r){var s=tn();r=r===void 0?null:r;var o=void 0;if(ut!==null){var i=ut.memoizedState;if(o=i.destroy,r!==null&&Lu(r,i.deps)){s.memoizedState=Ns(t,n,o,r);return}}Xe.flags|=e,s.memoizedState=Ns(1|t,n,o,r)}function im(e,t){return Mo(8390656,8,e,t)}function Au(e,t){return Ti(2048,8,e,t)}function Kp(e,t){return Ti(4,2,e,t)}function Qp(e,t){return Ti(4,4,e,t)}function Yp(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Xp(e,t,n){return n=n!=null?n.concat([e]):null,Ti(4,4,Yp.bind(null,t,e),n)}function Du(){}function Jp(e,t){var n=tn();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Lu(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Zp(e,t){var n=tn();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Lu(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function eh(e,t,n){return Rr&21?(mn(n,t)||(n=sp(),Xe.lanes|=n,Lr|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Ot=!0),e.memoizedState=n)}function ry(e,t){var n=De;De=n!==0&&4>n?n:4,e(!0);var r=Ea.transition;Ea.transition={};try{e(!1),t()}finally{De=n,Ea.transition=r}}function th(){return tn().memoizedState}function ly(e,t,n){var r=ur(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},nh(e))rh(t,n);else if(n=Pp(e,t,n,r),n!==null){var s=Et();un(n,e,r,s),lh(n,t,r)}}function sy(e,t,n){var r=ur(e),s={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(nh(e))rh(t,s);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var i=t.lastRenderedState,a=o(i,n);if(s.hasEagerState=!0,s.eagerState=a,mn(a,i)){var c=t.interleaved;c===null?(s.next=s,Eu(t)):(s.next=c.next,c.next=s),t.interleaved=s;return}}catch{}finally{}n=Pp(e,t,s,r),n!==null&&(s=Et(),un(n,e,r,s),lh(n,t,r))}}function nh(e){var t=e.alternate;return e===Xe||t!==null&&t===Xe}function rh(e,t){es=ti=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function lh(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,fu(e,n)}}var ni={readContext:en,useCallback:vt,useContext:vt,useEffect:vt,useImperativeHandle:vt,useInsertionEffect:vt,useLayoutEffect:vt,useMemo:vt,useReducer:vt,useRef:vt,useState:vt,useDebugValue:vt,useDeferredValue:vt,useTransition:vt,useMutableSource:vt,useSyncExternalStore:vt,useId:vt,unstable_isNewReconciler:!1},oy={readContext:en,useCallback:function(e,t){return xn().memoizedState=[e,t===void 0?null:t],e},useContext:en,useEffect:im,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Mo(4194308,4,Yp.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Mo(4194308,4,e,t)},useInsertionEffect:function(e,t){return Mo(4,2,e,t)},useMemo:function(e,t){var n=xn();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=xn();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=ly.bind(null,Xe,e),[r.memoizedState,e]},useRef:function(e){var t=xn();return e={current:e},t.memoizedState=e},useState:om,useDebugValue:Du,useDeferredValue:function(e){return xn().memoizedState=e},useTransition:function(){var e=om(!1),t=e[0];return e=ry.bind(null,e[1]),xn().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Xe,s=xn();if(He){if(n===void 0)throw Error(A(407));n=n()}else{if(n=t(),pt===null)throw Error(A(349));Rr&30||qp(r,t,n)}s.memoizedState=n;var o={value:n,getSnapshot:t};return s.queue=o,im(Up.bind(null,r,o,e),[e]),r.flags|=2048,Ns(9,Vp.bind(null,r,o,n,t),void 0,null),n},useId:function(){var e=xn(),t=pt.identifierPrefix;if(He){var n=Ln,r=Rn;n=(r&~(1<<32-cn(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=bs++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=ny++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},iy={readContext:en,useCallback:Jp,useContext:en,useEffect:Au,useImperativeHandle:Xp,useInsertionEffect:Kp,useLayoutEffect:Qp,useMemo:Zp,useReducer:Ta,useRef:Wp,useState:function(){return Ta(ws)},useDebugValue:Du,useDeferredValue:function(e){var t=tn();return eh(t,ut.memoizedState,e)},useTransition:function(){var e=Ta(ws)[0],t=tn().memoizedState;return[e,t]},useMutableSource:Gp,useSyncExternalStore:zp,useId:th,unstable_isNewReconciler:!1},ay={readContext:en,useCallback:Jp,useContext:en,useEffect:Au,useImperativeHandle:Xp,useInsertionEffect:Kp,useLayoutEffect:Qp,useMemo:Zp,useReducer:Ma,useRef:Wp,useState:function(){return Ma(ws)},useDebugValue:Du,useDeferredValue:function(e){var t=tn();return ut===null?t.memoizedState=e:eh(t,ut.memoizedState,e)},useTransition:function(){var e=Ma(ws)[0],t=tn().memoizedState;return[e,t]},useMutableSource:Gp,useSyncExternalStore:zp,useId:th,unstable_isNewReconciler:!1};function ln(e,t){if(e&&e.defaultProps){t=Je({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Mc(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:Je({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Mi={isMounted:function(e){return(e=e._reactInternals)?Ar(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Et(),s=ur(e),o=An(r,s);o.payload=t,n!=null&&(o.callback=n),t=ar(e,o,s),t!==null&&(un(t,e,s,r),Eo(t,e,s))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Et(),s=ur(e),o=An(r,s);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=ar(e,o,s),t!==null&&(un(t,e,s,r),Eo(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Et(),r=ur(e),s=An(n,r);s.tag=2,t!=null&&(s.callback=t),t=ar(e,s,r),t!==null&&(un(t,e,r,n),Eo(t,e,r))}};function am(e,t,n,r,s,o,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,i):t.prototype&&t.prototype.isPureReactComponent?!ps(n,r)||!ps(s,o):!0}function sh(e,t,n){var r=!1,s=fr,o=t.contextType;return typeof o=="object"&&o!==null?o=en(o):(s=Dt(t)?Mr:kt.current,r=t.contextTypes,o=(r=r!=null)?al(e,s):fr),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Mi,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=o),t}function cm(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Mi.enqueueReplaceState(t,t.state,null)}function _c(e,t,n,r){var s=e.stateNode;s.props=n,s.state=e.memoizedState,s.refs={},Tu(e);var o=t.contextType;typeof o=="object"&&o!==null?s.context=en(o):(o=Dt(t)?Mr:kt.current,s.context=al(e,o)),s.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(Mc(e,t,o,n),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&Mi.enqueueReplaceState(s,s.state,null),Zo(e,n,s,r),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function ml(e,t){try{var n="",r=t;do n+=D0(r),r=r.return;while(r);var s=n}catch(o){s=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:s,digest:null}}function _a(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Rc(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var cy=typeof WeakMap=="function"?WeakMap:Map;function oh(e,t,n){n=An(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){li||(li=!0,zc=r),Rc(e,t)},n}function ih(e,t,n){n=An(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var s=t.value;n.payload=function(){return r(s)},n.callback=function(){Rc(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){Rc(e,t),typeof r!="function"&&(cr===null?cr=new Set([this]):cr.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function um(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new cy;var s=new Set;r.set(t,s)}else s=r.get(t),s===void 0&&(s=new Set,r.set(t,s));s.has(n)||(s.add(n),e=ky.bind(null,e,t,n),t.then(e,e))}function dm(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function mm(e,t,n,r,s){return e.mode&1?(e.flags|=65536,e.lanes=s,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=An(-1,1),t.tag=2,ar(n,t,1))),n.lanes|=1),e)}var uy=zn.ReactCurrentOwner,Ot=!1;function Ct(e,t,n,r){t.child=e===null?Dp(t,null,n,r):ul(t,e.child,n,r)}function fm(e,t,n,r,s){n=n.render;var o=t.ref;return sl(t,s),r=Iu(e,t,n,r,o,s),n=Ou(),e!==null&&!Ot?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,$n(e,t,s)):(He&&n&&wu(t),t.flags|=1,Ct(e,t,r,s),t.child)}function pm(e,t,n,r,s){if(e===null){var o=n.type;return typeof o=="function"&&!Uu(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,ah(e,t,o,r,s)):(e=Io(n.type,null,r,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!(e.lanes&s)){var i=o.memoizedProps;if(n=n.compare,n=n!==null?n:ps,n(i,r)&&e.ref===t.ref)return $n(e,t,s)}return t.flags|=1,e=dr(o,r),e.ref=t.ref,e.return=t,t.child=e}function ah(e,t,n,r,s){if(e!==null){var o=e.memoizedProps;if(ps(o,r)&&e.ref===t.ref)if(Ot=!1,t.pendingProps=r=o,(e.lanes&s)!==0)e.flags&131072&&(Ot=!0);else return t.lanes=e.lanes,$n(e,t,s)}return Lc(e,t,n,r,s)}function ch(e,t,n){var r=t.pendingProps,s=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ze(Zr,$t),$t|=n;else{if(!(n&1073741824))return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ze(Zr,$t),$t|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:n,ze(Zr,$t),$t|=r}else o!==null?(r=o.baseLanes|n,t.memoizedState=null):r=n,ze(Zr,$t),$t|=r;return Ct(e,t,s,n),t.child}function uh(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Lc(e,t,n,r,s){var o=Dt(n)?Mr:kt.current;return o=al(t,o),sl(t,s),n=Iu(e,t,n,r,o,s),r=Ou(),e!==null&&!Ot?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,$n(e,t,s)):(He&&r&&wu(t),t.flags|=1,Ct(e,t,n,s),t.child)}function hm(e,t,n,r,s){if(Dt(n)){var o=!0;Ko(t)}else o=!1;if(sl(t,s),t.stateNode===null)_o(e,t),sh(t,n,r),_c(t,n,r,s),r=!0;else if(e===null){var i=t.stateNode,a=t.memoizedProps;i.props=a;var c=i.context,u=n.contextType;typeof u=="object"&&u!==null?u=en(u):(u=Dt(n)?Mr:kt.current,u=al(t,u));var d=n.getDerivedStateFromProps,p=typeof d=="function"||typeof i.getSnapshotBeforeUpdate=="function";p||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(a!==r||c!==u)&&cm(t,i,r,u),Xn=!1;var m=t.memoizedState;i.state=m,Zo(t,r,i,s),c=t.memoizedState,a!==r||m!==c||At.current||Xn?(typeof d=="function"&&(Mc(t,n,d,r),c=t.memoizedState),(a=Xn||am(t,n,a,r,m,c,u))?(p||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=c),i.props=r,i.state=c,i.context=u,r=a):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,Fp(e,t),a=t.memoizedProps,u=t.type===t.elementType?a:ln(t.type,a),i.props=u,p=t.pendingProps,m=i.context,c=n.contextType,typeof c=="object"&&c!==null?c=en(c):(c=Dt(n)?Mr:kt.current,c=al(t,c));var h=n.getDerivedStateFromProps;(d=typeof h=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(a!==p||m!==c)&&cm(t,i,r,c),Xn=!1,m=t.memoizedState,i.state=m,Zo(t,r,i,s);var g=t.memoizedState;a!==p||m!==g||At.current||Xn?(typeof h=="function"&&(Mc(t,n,h,r),g=t.memoizedState),(u=Xn||am(t,n,u,r,m,g,c)||!1)?(d||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,g,c),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,g,c)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=g),i.props=r,i.state=g,i.context=c,r=u):(typeof i.componentDidUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||a===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),r=!1)}return Ic(e,t,n,r,o,s)}function Ic(e,t,n,r,s,o){uh(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return s&&em(t,n,!1),$n(e,t,o);r=t.stateNode,uy.current=t;var a=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=ul(t,e.child,null,o),t.child=ul(t,null,a,o)):Ct(e,t,a,o),t.memoizedState=r.state,s&&em(t,n,!0),t.child}function dh(e){var t=e.stateNode;t.pendingContext?Zd(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Zd(e,t.context,!1),Mu(e,t.containerInfo)}function gm(e,t,n,r,s){return cl(),ku(s),t.flags|=256,Ct(e,t,n,r),t.child}var Oc={dehydrated:null,treeContext:null,retryLane:0};function Ac(e){return{baseLanes:e,cachePool:null,transitions:null}}function mh(e,t,n){var r=t.pendingProps,s=Ye.current,o=!1,i=(t.flags&128)!==0,a;if((a=i)||(a=e!==null&&e.memoizedState===null?!1:(s&2)!==0),a?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),ze(Ye,s&1),e===null)return Ec(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(i=r.children,e=r.fallback,o?(r=t.mode,o=t.child,i={mode:"hidden",children:i},!(r&1)&&o!==null?(o.childLanes=0,o.pendingProps=i):o=Li(i,r,0,null),e=Tr(e,r,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=Ac(n),t.memoizedState=Oc,e):Pu(t,i));if(s=e.memoizedState,s!==null&&(a=s.dehydrated,a!==null))return dy(e,t,i,r,a,s,n);if(o){o=r.fallback,i=t.mode,s=e.child,a=s.sibling;var c={mode:"hidden",children:r.children};return!(i&1)&&t.child!==s?(r=t.child,r.childLanes=0,r.pendingProps=c,t.deletions=null):(r=dr(s,c),r.subtreeFlags=s.subtreeFlags&14680064),a!==null?o=dr(a,o):(o=Tr(o,i,n,null),o.flags|=2),o.return=t,r.return=t,r.sibling=o,t.child=r,r=o,o=t.child,i=e.child.memoizedState,i=i===null?Ac(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},o.memoizedState=i,o.childLanes=e.childLanes&~n,t.memoizedState=Oc,r}return o=e.child,e=o.sibling,r=dr(o,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Pu(e,t){return t=Li({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function co(e,t,n,r){return r!==null&&ku(r),ul(t,e.child,null,n),e=Pu(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function dy(e,t,n,r,s,o,i){if(n)return t.flags&256?(t.flags&=-257,r=_a(Error(A(422))),co(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=r.fallback,s=t.mode,r=Li({mode:"visible",children:r.children},s,0,null),o=Tr(o,s,i,null),o.flags|=2,r.return=t,o.return=t,r.sibling=o,t.child=r,t.mode&1&&ul(t,e.child,null,i),t.child.memoizedState=Ac(i),t.memoizedState=Oc,o);if(!(t.mode&1))return co(e,t,i,null);if(s.data==="$!"){if(r=s.nextSibling&&s.nextSibling.dataset,r)var a=r.dgst;return r=a,o=Error(A(419)),r=_a(o,r,void 0),co(e,t,i,r)}if(a=(i&e.childLanes)!==0,Ot||a){if(r=pt,r!==null){switch(i&-i){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=s&(r.suspendedLanes|i)?0:s,s!==0&&s!==o.retryLane&&(o.retryLane=s,Fn(e,s),un(r,e,s,-1))}return Vu(),r=_a(Error(A(421))),co(e,t,i,r)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=Sy.bind(null,e),s._reactRetry=t,null):(e=o.treeContext,Gt=ir(s.nextSibling),zt=t,He=!0,on=null,e!==null&&(Qt[Yt++]=Rn,Qt[Yt++]=Ln,Qt[Yt++]=_r,Rn=e.id,Ln=e.overflow,_r=t),t=Pu(t,r.children),t.flags|=4096,t)}function xm(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Tc(e.return,t,n)}function Ra(e,t,n,r,s){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:s}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=s)}function fh(e,t,n){var r=t.pendingProps,s=r.revealOrder,o=r.tail;if(Ct(e,t,r.children,n),r=Ye.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&xm(e,n,t);else if(e.tag===19)xm(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(ze(Ye,r),!(t.mode&1))t.memoizedState=null;else switch(s){case"forwards":for(n=t.child,s=null;n!==null;)e=n.alternate,e!==null&&ei(e)===null&&(s=n),n=n.sibling;n=s,n===null?(s=t.child,t.child=null):(s=n.sibling,n.sibling=null),Ra(t,!1,s,n,o);break;case"backwards":for(n=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&ei(e)===null){t.child=s;break}e=s.sibling,s.sibling=n,n=s,s=e}Ra(t,!0,n,null,o);break;case"together":Ra(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function _o(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function $n(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Lr|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(A(153));if(t.child!==null){for(e=t.child,n=dr(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=dr(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function my(e,t,n){switch(t.tag){case 3:dh(t),cl();break;case 5:$p(t);break;case 1:Dt(t.type)&&Ko(t);break;case 4:Mu(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,s=t.memoizedProps.value;ze(Xo,r._currentValue),r._currentValue=s;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(ze(Ye,Ye.current&1),t.flags|=128,null):n&t.child.childLanes?mh(e,t,n):(ze(Ye,Ye.current&1),e=$n(e,t,n),e!==null?e.sibling:null);ze(Ye,Ye.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return fh(e,t,n);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),ze(Ye,Ye.current),r)break;return null;case 22:case 23:return t.lanes=0,ch(e,t,n)}return $n(e,t,n)}var ph,Dc,hh,gh;ph=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Dc=function(){};hh=function(e,t,n,r){var s=e.memoizedProps;if(s!==r){e=t.stateNode,Cr(wn.current);var o=null;switch(n){case"input":s=lc(e,s),r=lc(e,r),o=[];break;case"select":s=Je({},s,{value:void 0}),r=Je({},r,{value:void 0}),o=[];break;case"textarea":s=ic(e,s),r=ic(e,r),o=[];break;default:typeof s.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Ho)}cc(n,r);var i;n=null;for(u in s)if(!r.hasOwnProperty(u)&&s.hasOwnProperty(u)&&s[u]!=null)if(u==="style"){var a=s[u];for(i in a)a.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(is.hasOwnProperty(u)?o||(o=[]):(o=o||[]).push(u,null));for(u in r){var c=r[u];if(a=s!=null?s[u]:void 0,r.hasOwnProperty(u)&&c!==a&&(c!=null||a!=null))if(u==="style")if(a){for(i in a)!a.hasOwnProperty(i)||c&&c.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in c)c.hasOwnProperty(i)&&a[i]!==c[i]&&(n||(n={}),n[i]=c[i])}else n||(o||(o=[]),o.push(u,n)),n=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,a=a?a.__html:void 0,c!=null&&a!==c&&(o=o||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(o=o||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(is.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&Ve("scroll",e),o||a===c||(o=[])):(o=o||[]).push(u,c))}n&&(o=o||[]).push("style",n);var u=o;(t.updateQueue=u)&&(t.flags|=4)}};gh=function(e,t,n,r){n!==r&&(t.flags|=4)};function Dl(e,t){if(!He)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function bt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var s=e.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags&14680064,r|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)n|=s.lanes|s.childLanes,r|=s.subtreeFlags,r|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function fy(e,t,n){var r=t.pendingProps;switch(Nu(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return bt(t),null;case 1:return Dt(t.type)&&Wo(),bt(t),null;case 3:return r=t.stateNode,dl(),Ue(At),Ue(kt),Ru(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(io(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,on!==null&&(Uc(on),on=null))),Dc(e,t),bt(t),null;case 5:_u(t);var s=Cr(vs.current);if(n=t.type,e!==null&&t.stateNode!=null)hh(e,t,n,r,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(A(166));return bt(t),null}if(e=Cr(wn.current),io(t)){r=t.stateNode,n=t.type;var o=t.memoizedProps;switch(r[vn]=t,r[xs]=o,e=(t.mode&1)!==0,n){case"dialog":Ve("cancel",r),Ve("close",r);break;case"iframe":case"object":case"embed":Ve("load",r);break;case"video":case"audio":for(s=0;s<Bl.length;s++)Ve(Bl[s],r);break;case"source":Ve("error",r);break;case"img":case"image":case"link":Ve("error",r),Ve("load",r);break;case"details":Ve("toggle",r);break;case"input":Cd(r,o),Ve("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},Ve("invalid",r);break;case"textarea":Td(r,o),Ve("invalid",r)}cc(n,o),s=null;for(var i in o)if(o.hasOwnProperty(i)){var a=o[i];i==="children"?typeof a=="string"?r.textContent!==a&&(o.suppressHydrationWarning!==!0&&oo(r.textContent,a,e),s=["children",a]):typeof a=="number"&&r.textContent!==""+a&&(o.suppressHydrationWarning!==!0&&oo(r.textContent,a,e),s=["children",""+a]):is.hasOwnProperty(i)&&a!=null&&i==="onScroll"&&Ve("scroll",r)}switch(n){case"input":Js(r),Ed(r,o,!0);break;case"textarea":Js(r),Md(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=Ho)}r=s,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Uf(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[vn]=t,e[xs]=r,ph(e,t,!1,!1),t.stateNode=e;e:{switch(i=uc(n,r),n){case"dialog":Ve("cancel",e),Ve("close",e),s=r;break;case"iframe":case"object":case"embed":Ve("load",e),s=r;break;case"video":case"audio":for(s=0;s<Bl.length;s++)Ve(Bl[s],e);s=r;break;case"source":Ve("error",e),s=r;break;case"img":case"image":case"link":Ve("error",e),Ve("load",e),s=r;break;case"details":Ve("toggle",e),s=r;break;case"input":Cd(e,r),s=lc(e,r),Ve("invalid",e);break;case"option":s=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},s=Je({},r,{value:void 0}),Ve("invalid",e);break;case"textarea":Td(e,r),s=ic(e,r),Ve("invalid",e);break;default:s=r}cc(n,s),a=s;for(o in a)if(a.hasOwnProperty(o)){var c=a[o];o==="style"?Wf(e,c):o==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&Bf(e,c)):o==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&as(e,c):typeof c=="number"&&as(e,""+c):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(is.hasOwnProperty(o)?c!=null&&o==="onScroll"&&Ve("scroll",e):c!=null&&iu(e,o,c,i))}switch(n){case"input":Js(e),Ed(e,r,!1);break;case"textarea":Js(e),Md(e);break;case"option":r.value!=null&&e.setAttribute("value",""+mr(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?tl(e,!!r.multiple,o,!1):r.defaultValue!=null&&tl(e,!!r.multiple,r.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=Ho)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return bt(t),null;case 6:if(e&&t.stateNode!=null)gh(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(A(166));if(n=Cr(vs.current),Cr(wn.current),io(t)){if(r=t.stateNode,n=t.memoizedProps,r[vn]=t,(o=r.nodeValue!==n)&&(e=zt,e!==null))switch(e.tag){case 3:oo(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&oo(r.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[vn]=t,t.stateNode=r}return bt(t),null;case 13:if(Ue(Ye),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(He&&Gt!==null&&t.mode&1&&!(t.flags&128))Op(),cl(),t.flags|=98560,o=!1;else if(o=io(t),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(A(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(A(317));o[vn]=t}else cl(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;bt(t),o=!1}else on!==null&&(Uc(on),on=null),o=!0;if(!o)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||Ye.current&1?dt===0&&(dt=3):Vu())),t.updateQueue!==null&&(t.flags|=4),bt(t),null);case 4:return dl(),Dc(e,t),e===null&&hs(t.stateNode.containerInfo),bt(t),null;case 10:return Cu(t.type._context),bt(t),null;case 17:return Dt(t.type)&&Wo(),bt(t),null;case 19:if(Ue(Ye),o=t.memoizedState,o===null)return bt(t),null;if(r=(t.flags&128)!==0,i=o.rendering,i===null)if(r)Dl(o,!1);else{if(dt!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(i=ei(e),i!==null){for(t.flags|=128,Dl(o,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)o=n,e=r,o.flags&=14680066,i=o.alternate,i===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=i.childLanes,o.lanes=i.lanes,o.child=i.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=i.memoizedProps,o.memoizedState=i.memoizedState,o.updateQueue=i.updateQueue,o.type=i.type,e=i.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ze(Ye,Ye.current&1|2),t.child}e=e.sibling}o.tail!==null&&rt()>fl&&(t.flags|=128,r=!0,Dl(o,!1),t.lanes=4194304)}else{if(!r)if(e=ei(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Dl(o,!0),o.tail===null&&o.tailMode==="hidden"&&!i.alternate&&!He)return bt(t),null}else 2*rt()-o.renderingStartTime>fl&&n!==1073741824&&(t.flags|=128,r=!0,Dl(o,!1),t.lanes=4194304);o.isBackwards?(i.sibling=t.child,t.child=i):(n=o.last,n!==null?n.sibling=i:t.child=i,o.last=i)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=rt(),t.sibling=null,n=Ye.current,ze(Ye,r?n&1|2:n&1),t):(bt(t),null);case 22:case 23:return qu(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?$t&1073741824&&(bt(t),t.subtreeFlags&6&&(t.flags|=8192)):bt(t),null;case 24:return null;case 25:return null}throw Error(A(156,t.tag))}function py(e,t){switch(Nu(t),t.tag){case 1:return Dt(t.type)&&Wo(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return dl(),Ue(At),Ue(kt),Ru(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return _u(t),null;case 13:if(Ue(Ye),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(A(340));cl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ue(Ye),null;case 4:return dl(),null;case 10:return Cu(t.type._context),null;case 22:case 23:return qu(),null;case 24:return null;default:return null}}var uo=!1,Nt=!1,hy=typeof WeakSet=="function"?WeakSet:Set,Q=null;function Jr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){tt(e,t,r)}else n.current=null}function Pc(e,t,n){try{n()}catch(r){tt(e,t,r)}}var ym=!1;function gy(e,t){if(bc=Vo,e=wp(),bu(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var s=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var i=0,a=-1,c=-1,u=0,d=0,p=e,m=null;t:for(;;){for(var h;p!==n||s!==0&&p.nodeType!==3||(a=i+s),p!==o||r!==0&&p.nodeType!==3||(c=i+r),p.nodeType===3&&(i+=p.nodeValue.length),(h=p.firstChild)!==null;)m=p,p=h;for(;;){if(p===e)break t;if(m===n&&++u===s&&(a=i),m===o&&++d===r&&(c=i),(h=p.nextSibling)!==null)break;p=m,m=p.parentNode}p=h}n=a===-1||c===-1?null:{start:a,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(wc={focusedElem:e,selectionRange:n},Vo=!1,Q=t;Q!==null;)if(t=Q,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Q=e;else for(;Q!==null;){t=Q;try{var g=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var v=g.memoizedProps,w=g.memoizedState,x=t.stateNode,y=x.getSnapshotBeforeUpdate(t.elementType===t.type?v:ln(t.type,v),w);x.__reactInternalSnapshotBeforeUpdate=y}break;case 3:var b=t.stateNode.containerInfo;b.nodeType===1?b.textContent="":b.nodeType===9&&b.documentElement&&b.removeChild(b.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(A(163))}}catch(k){tt(t,t.return,k)}if(e=t.sibling,e!==null){e.return=t.return,Q=e;break}Q=t.return}return g=ym,ym=!1,g}function ts(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var s=r=r.next;do{if((s.tag&e)===e){var o=s.destroy;s.destroy=void 0,o!==void 0&&Pc(t,n,o)}s=s.next}while(s!==r)}}function _i(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Fc(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function xh(e){var t=e.alternate;t!==null&&(e.alternate=null,xh(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[vn],delete t[xs],delete t[Sc],delete t[Jx],delete t[Zx])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function yh(e){return e.tag===5||e.tag===3||e.tag===4}function vm(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||yh(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function $c(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ho));else if(r!==4&&(e=e.child,e!==null))for($c(e,t,n),e=e.sibling;e!==null;)$c(e,t,n),e=e.sibling}function Gc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Gc(e,t,n),e=e.sibling;e!==null;)Gc(e,t,n),e=e.sibling}var gt=null,sn=!1;function Bn(e,t,n){for(n=n.child;n!==null;)vh(e,t,n),n=n.sibling}function vh(e,t,n){if(bn&&typeof bn.onCommitFiberUnmount=="function")try{bn.onCommitFiberUnmount(Ni,n)}catch{}switch(n.tag){case 5:Nt||Jr(n,t);case 6:var r=gt,s=sn;gt=null,Bn(e,t,n),gt=r,sn=s,gt!==null&&(sn?(e=gt,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):gt.removeChild(n.stateNode));break;case 18:gt!==null&&(sn?(e=gt,n=n.stateNode,e.nodeType===8?Sa(e.parentNode,n):e.nodeType===1&&Sa(e,n),ms(e)):Sa(gt,n.stateNode));break;case 4:r=gt,s=sn,gt=n.stateNode.containerInfo,sn=!0,Bn(e,t,n),gt=r,sn=s;break;case 0:case 11:case 14:case 15:if(!Nt&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){s=r=r.next;do{var o=s,i=o.destroy;o=o.tag,i!==void 0&&(o&2||o&4)&&Pc(n,t,i),s=s.next}while(s!==r)}Bn(e,t,n);break;case 1:if(!Nt&&(Jr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(a){tt(n,t,a)}Bn(e,t,n);break;case 21:Bn(e,t,n);break;case 22:n.mode&1?(Nt=(r=Nt)||n.memoizedState!==null,Bn(e,t,n),Nt=r):Bn(e,t,n);break;default:Bn(e,t,n)}}function bm(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new hy),t.forEach(function(r){var s=jy.bind(null,e,r);n.has(r)||(n.add(r),r.then(s,s))})}}function rn(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var s=n[r];try{var o=e,i=t,a=i;e:for(;a!==null;){switch(a.tag){case 5:gt=a.stateNode,sn=!1;break e;case 3:gt=a.stateNode.containerInfo,sn=!0;break e;case 4:gt=a.stateNode.containerInfo,sn=!0;break e}a=a.return}if(gt===null)throw Error(A(160));vh(o,i,s),gt=null,sn=!1;var c=s.alternate;c!==null&&(c.return=null),s.return=null}catch(u){tt(s,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)bh(t,e),t=t.sibling}function bh(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(rn(t,e),hn(e),r&4){try{ts(3,e,e.return),_i(3,e)}catch(v){tt(e,e.return,v)}try{ts(5,e,e.return)}catch(v){tt(e,e.return,v)}}break;case 1:rn(t,e),hn(e),r&512&&n!==null&&Jr(n,n.return);break;case 5:if(rn(t,e),hn(e),r&512&&n!==null&&Jr(n,n.return),e.flags&32){var s=e.stateNode;try{as(s,"")}catch(v){tt(e,e.return,v)}}if(r&4&&(s=e.stateNode,s!=null)){var o=e.memoizedProps,i=n!==null?n.memoizedProps:o,a=e.type,c=e.updateQueue;if(e.updateQueue=null,c!==null)try{a==="input"&&o.type==="radio"&&o.name!=null&&qf(s,o),uc(a,i);var u=uc(a,o);for(i=0;i<c.length;i+=2){var d=c[i],p=c[i+1];d==="style"?Wf(s,p):d==="dangerouslySetInnerHTML"?Bf(s,p):d==="children"?as(s,p):iu(s,d,p,u)}switch(a){case"input":sc(s,o);break;case"textarea":Vf(s,o);break;case"select":var m=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!o.multiple;var h=o.value;h!=null?tl(s,!!o.multiple,h,!1):m!==!!o.multiple&&(o.defaultValue!=null?tl(s,!!o.multiple,o.defaultValue,!0):tl(s,!!o.multiple,o.multiple?[]:"",!1))}s[xs]=o}catch(v){tt(e,e.return,v)}}break;case 6:if(rn(t,e),hn(e),r&4){if(e.stateNode===null)throw Error(A(162));s=e.stateNode,o=e.memoizedProps;try{s.nodeValue=o}catch(v){tt(e,e.return,v)}}break;case 3:if(rn(t,e),hn(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{ms(t.containerInfo)}catch(v){tt(e,e.return,v)}break;case 4:rn(t,e),hn(e);break;case 13:rn(t,e),hn(e),s=e.child,s.flags&8192&&(o=s.memoizedState!==null,s.stateNode.isHidden=o,!o||s.alternate!==null&&s.alternate.memoizedState!==null||(Gu=rt())),r&4&&bm(e);break;case 22:if(d=n!==null&&n.memoizedState!==null,e.mode&1?(Nt=(u=Nt)||d,rn(t,e),Nt=u):rn(t,e),hn(e),r&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!d&&e.mode&1)for(Q=e,d=e.child;d!==null;){for(p=Q=d;Q!==null;){switch(m=Q,h=m.child,m.tag){case 0:case 11:case 14:case 15:ts(4,m,m.return);break;case 1:Jr(m,m.return);var g=m.stateNode;if(typeof g.componentWillUnmount=="function"){r=m,n=m.return;try{t=r,g.props=t.memoizedProps,g.state=t.memoizedState,g.componentWillUnmount()}catch(v){tt(r,n,v)}}break;case 5:Jr(m,m.return);break;case 22:if(m.memoizedState!==null){Nm(p);continue}}h!==null?(h.return=m,Q=h):Nm(p)}d=d.sibling}e:for(d=null,p=e;;){if(p.tag===5){if(d===null){d=p;try{s=p.stateNode,u?(o=s.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(a=p.stateNode,c=p.memoizedProps.style,i=c!=null&&c.hasOwnProperty("display")?c.display:null,a.style.display=Hf("display",i))}catch(v){tt(e,e.return,v)}}}else if(p.tag===6){if(d===null)try{p.stateNode.nodeValue=u?"":p.memoizedProps}catch(v){tt(e,e.return,v)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===e)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===e)break e;for(;p.sibling===null;){if(p.return===null||p.return===e)break e;d===p&&(d=null),p=p.return}d===p&&(d=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:rn(t,e),hn(e),r&4&&bm(e);break;case 21:break;default:rn(t,e),hn(e)}}function hn(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(yh(n)){var r=n;break e}n=n.return}throw Error(A(160))}switch(r.tag){case 5:var s=r.stateNode;r.flags&32&&(as(s,""),r.flags&=-33);var o=vm(e);Gc(e,o,s);break;case 3:case 4:var i=r.stateNode.containerInfo,a=vm(e);$c(e,a,i);break;default:throw Error(A(161))}}catch(c){tt(e,e.return,c)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function xy(e,t,n){Q=e,wh(e)}function wh(e,t,n){for(var r=(e.mode&1)!==0;Q!==null;){var s=Q,o=s.child;if(s.tag===22&&r){var i=s.memoizedState!==null||uo;if(!i){var a=s.alternate,c=a!==null&&a.memoizedState!==null||Nt;a=uo;var u=Nt;if(uo=i,(Nt=c)&&!u)for(Q=s;Q!==null;)i=Q,c=i.child,i.tag===22&&i.memoizedState!==null?km(s):c!==null?(c.return=i,Q=c):km(s);for(;o!==null;)Q=o,wh(o),o=o.sibling;Q=s,uo=a,Nt=u}wm(e)}else s.subtreeFlags&8772&&o!==null?(o.return=s,Q=o):wm(e)}}function wm(e){for(;Q!==null;){var t=Q;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Nt||_i(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Nt)if(n===null)r.componentDidMount();else{var s=t.elementType===t.type?n.memoizedProps:ln(t.type,n.memoizedProps);r.componentDidUpdate(s,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&sm(t,o,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}sm(t,i,n)}break;case 5:var a=t.stateNode;if(n===null&&t.flags&4){n=a;var c=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var p=d.dehydrated;p!==null&&ms(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(A(163))}Nt||t.flags&512&&Fc(t)}catch(m){tt(t,t.return,m)}}if(t===e){Q=null;break}if(n=t.sibling,n!==null){n.return=t.return,Q=n;break}Q=t.return}}function Nm(e){for(;Q!==null;){var t=Q;if(t===e){Q=null;break}var n=t.sibling;if(n!==null){n.return=t.return,Q=n;break}Q=t.return}}function km(e){for(;Q!==null;){var t=Q;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{_i(4,t)}catch(c){tt(t,n,c)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var s=t.return;try{r.componentDidMount()}catch(c){tt(t,s,c)}}var o=t.return;try{Fc(t)}catch(c){tt(t,o,c)}break;case 5:var i=t.return;try{Fc(t)}catch(c){tt(t,i,c)}}}catch(c){tt(t,t.return,c)}if(t===e){Q=null;break}var a=t.sibling;if(a!==null){a.return=t.return,Q=a;break}Q=t.return}}var yy=Math.ceil,ri=zn.ReactCurrentDispatcher,Fu=zn.ReactCurrentOwner,Jt=zn.ReactCurrentBatchConfig,Me=0,pt=null,at=null,xt=0,$t=0,Zr=hr(0),dt=0,ks=null,Lr=0,Ri=0,$u=0,ns=null,It=null,Gu=0,fl=1/0,Tn=null,li=!1,zc=null,cr=null,mo=!1,tr=null,si=0,rs=0,qc=null,Ro=-1,Lo=0;function Et(){return Me&6?rt():Ro!==-1?Ro:Ro=rt()}function ur(e){return e.mode&1?Me&2&&xt!==0?xt&-xt:ty.transition!==null?(Lo===0&&(Lo=sp()),Lo):(e=De,e!==0||(e=window.event,e=e===void 0?16:mp(e.type)),e):1}function un(e,t,n,r){if(50<rs)throw rs=0,qc=null,Error(A(185));Ts(e,n,r),(!(Me&2)||e!==pt)&&(e===pt&&(!(Me&2)&&(Ri|=n),dt===4&&Zn(e,xt)),Pt(e,r),n===1&&Me===0&&!(t.mode&1)&&(fl=rt()+500,Ei&&gr()))}function Pt(e,t){var n=e.callbackNode;tx(e,t);var r=qo(e,e===pt?xt:0);if(r===0)n!==null&&Ld(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Ld(n),t===1)e.tag===0?ey(Sm.bind(null,e)):Rp(Sm.bind(null,e)),Yx(function(){!(Me&6)&&gr()}),n=null;else{switch(op(r)){case 1:n=mu;break;case 4:n=rp;break;case 16:n=zo;break;case 536870912:n=lp;break;default:n=zo}n=Mh(n,Nh.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Nh(e,t){if(Ro=-1,Lo=0,Me&6)throw Error(A(327));var n=e.callbackNode;if(ol()&&e.callbackNode!==n)return null;var r=qo(e,e===pt?xt:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=oi(e,r);else{t=r;var s=Me;Me|=2;var o=Sh();(pt!==e||xt!==t)&&(Tn=null,fl=rt()+500,Er(e,t));do try{wy();break}catch(a){kh(e,a)}while(1);ju(),ri.current=o,Me=s,at!==null?t=0:(pt=null,xt=0,t=dt)}if(t!==0){if(t===2&&(s=hc(e),s!==0&&(r=s,t=Vc(e,s))),t===1)throw n=ks,Er(e,0),Zn(e,r),Pt(e,rt()),n;if(t===6)Zn(e,r);else{if(s=e.current.alternate,!(r&30)&&!vy(s)&&(t=oi(e,r),t===2&&(o=hc(e),o!==0&&(r=o,t=Vc(e,o))),t===1))throw n=ks,Er(e,0),Zn(e,r),Pt(e,rt()),n;switch(e.finishedWork=s,e.finishedLanes=r,t){case 0:case 1:throw Error(A(345));case 2:wr(e,It,Tn);break;case 3:if(Zn(e,r),(r&130023424)===r&&(t=Gu+500-rt(),10<t)){if(qo(e,0)!==0)break;if(s=e.suspendedLanes,(s&r)!==r){Et(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=kc(wr.bind(null,e,It,Tn),t);break}wr(e,It,Tn);break;case 4:if(Zn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,s=-1;0<r;){var i=31-cn(r);o=1<<i,i=t[i],i>s&&(s=i),r&=~o}if(r=s,r=rt()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*yy(r/1960))-r,10<r){e.timeoutHandle=kc(wr.bind(null,e,It,Tn),r);break}wr(e,It,Tn);break;case 5:wr(e,It,Tn);break;default:throw Error(A(329))}}}return Pt(e,rt()),e.callbackNode===n?Nh.bind(null,e):null}function Vc(e,t){var n=ns;return e.current.memoizedState.isDehydrated&&(Er(e,t).flags|=256),e=oi(e,t),e!==2&&(t=It,It=n,t!==null&&Uc(t)),e}function Uc(e){It===null?It=e:It.push.apply(It,e)}function vy(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var s=n[r],o=s.getSnapshot;s=s.value;try{if(!mn(o(),s))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Zn(e,t){for(t&=~$u,t&=~Ri,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-cn(t),r=1<<n;e[n]=-1,t&=~r}}function Sm(e){if(Me&6)throw Error(A(327));ol();var t=qo(e,0);if(!(t&1))return Pt(e,rt()),null;var n=oi(e,t);if(e.tag!==0&&n===2){var r=hc(e);r!==0&&(t=r,n=Vc(e,r))}if(n===1)throw n=ks,Er(e,0),Zn(e,t),Pt(e,rt()),n;if(n===6)throw Error(A(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,wr(e,It,Tn),Pt(e,rt()),null}function zu(e,t){var n=Me;Me|=1;try{return e(t)}finally{Me=n,Me===0&&(fl=rt()+500,Ei&&gr())}}function Ir(e){tr!==null&&tr.tag===0&&!(Me&6)&&ol();var t=Me;Me|=1;var n=Jt.transition,r=De;try{if(Jt.transition=null,De=1,e)return e()}finally{De=r,Jt.transition=n,Me=t,!(Me&6)&&gr()}}function qu(){$t=Zr.current,Ue(Zr)}function Er(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Qx(n)),at!==null)for(n=at.return;n!==null;){var r=n;switch(Nu(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Wo();break;case 3:dl(),Ue(At),Ue(kt),Ru();break;case 5:_u(r);break;case 4:dl();break;case 13:Ue(Ye);break;case 19:Ue(Ye);break;case 10:Cu(r.type._context);break;case 22:case 23:qu()}n=n.return}if(pt=e,at=e=dr(e.current,null),xt=$t=t,dt=0,ks=null,$u=Ri=Lr=0,It=ns=null,jr!==null){for(t=0;t<jr.length;t++)if(n=jr[t],r=n.interleaved,r!==null){n.interleaved=null;var s=r.next,o=n.pending;if(o!==null){var i=o.next;o.next=s,r.next=i}n.pending=r}jr=null}return e}function kh(e,t){do{var n=at;try{if(ju(),To.current=ni,ti){for(var r=Xe.memoizedState;r!==null;){var s=r.queue;s!==null&&(s.pending=null),r=r.next}ti=!1}if(Rr=0,ft=ut=Xe=null,es=!1,bs=0,Fu.current=null,n===null||n.return===null){dt=1,ks=t,at=null;break}e:{var o=e,i=n.return,a=n,c=t;if(t=xt,a.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,d=a,p=d.tag;if(!(d.mode&1)&&(p===0||p===11||p===15)){var m=d.alternate;m?(d.updateQueue=m.updateQueue,d.memoizedState=m.memoizedState,d.lanes=m.lanes):(d.updateQueue=null,d.memoizedState=null)}var h=dm(i);if(h!==null){h.flags&=-257,mm(h,i,a,o,t),h.mode&1&&um(o,u,t),t=h,c=u;var g=t.updateQueue;if(g===null){var v=new Set;v.add(c),t.updateQueue=v}else g.add(c);break e}else{if(!(t&1)){um(o,u,t),Vu();break e}c=Error(A(426))}}else if(He&&a.mode&1){var w=dm(i);if(w!==null){!(w.flags&65536)&&(w.flags|=256),mm(w,i,a,o,t),ku(ml(c,a));break e}}o=c=ml(c,a),dt!==4&&(dt=2),ns===null?ns=[o]:ns.push(o),o=i;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var x=oh(o,c,t);lm(o,x);break e;case 1:a=c;var y=o.type,b=o.stateNode;if(!(o.flags&128)&&(typeof y.getDerivedStateFromError=="function"||b!==null&&typeof b.componentDidCatch=="function"&&(cr===null||!cr.has(b)))){o.flags|=65536,t&=-t,o.lanes|=t;var k=ih(o,a,t);lm(o,k);break e}}o=o.return}while(o!==null)}Ch(n)}catch(N){t=N,at===n&&n!==null&&(at=n=n.return);continue}break}while(1)}function Sh(){var e=ri.current;return ri.current=ni,e===null?ni:e}function Vu(){(dt===0||dt===3||dt===2)&&(dt=4),pt===null||!(Lr&268435455)&&!(Ri&268435455)||Zn(pt,xt)}function oi(e,t){var n=Me;Me|=2;var r=Sh();(pt!==e||xt!==t)&&(Tn=null,Er(e,t));do try{by();break}catch(s){kh(e,s)}while(1);if(ju(),Me=n,ri.current=r,at!==null)throw Error(A(261));return pt=null,xt=0,dt}function by(){for(;at!==null;)jh(at)}function wy(){for(;at!==null&&!H0();)jh(at)}function jh(e){var t=Th(e.alternate,e,$t);e.memoizedProps=e.pendingProps,t===null?Ch(e):at=t,Fu.current=null}function Ch(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=py(n,t),n!==null){n.flags&=32767,at=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{dt=6,at=null;return}}else if(n=fy(n,t,$t),n!==null){at=n;return}if(t=t.sibling,t!==null){at=t;return}at=t=e}while(t!==null);dt===0&&(dt=5)}function wr(e,t,n){var r=De,s=Jt.transition;try{Jt.transition=null,De=1,Ny(e,t,n,r)}finally{Jt.transition=s,De=r}return null}function Ny(e,t,n,r){do ol();while(tr!==null);if(Me&6)throw Error(A(327));n=e.finishedWork;var s=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(A(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(nx(e,o),e===pt&&(at=pt=null,xt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||mo||(mo=!0,Mh(zo,function(){return ol(),null})),o=(n.flags&15990)!==0,n.subtreeFlags&15990||o){o=Jt.transition,Jt.transition=null;var i=De;De=1;var a=Me;Me|=4,Fu.current=null,gy(e,n),bh(n,e),qx(wc),Vo=!!bc,wc=bc=null,e.current=n,xy(n),W0(),Me=a,De=i,Jt.transition=o}else e.current=n;if(mo&&(mo=!1,tr=e,si=s),o=e.pendingLanes,o===0&&(cr=null),Y0(n.stateNode),Pt(e,rt()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)s=t[n],r(s.value,{componentStack:s.stack,digest:s.digest});if(li)throw li=!1,e=zc,zc=null,e;return si&1&&e.tag!==0&&ol(),o=e.pendingLanes,o&1?e===qc?rs++:(rs=0,qc=e):rs=0,gr(),null}function ol(){if(tr!==null){var e=op(si),t=Jt.transition,n=De;try{if(Jt.transition=null,De=16>e?16:e,tr===null)var r=!1;else{if(e=tr,tr=null,si=0,Me&6)throw Error(A(331));var s=Me;for(Me|=4,Q=e.current;Q!==null;){var o=Q,i=o.child;if(Q.flags&16){var a=o.deletions;if(a!==null){for(var c=0;c<a.length;c++){var u=a[c];for(Q=u;Q!==null;){var d=Q;switch(d.tag){case 0:case 11:case 15:ts(8,d,o)}var p=d.child;if(p!==null)p.return=d,Q=p;else for(;Q!==null;){d=Q;var m=d.sibling,h=d.return;if(xh(d),d===u){Q=null;break}if(m!==null){m.return=h,Q=m;break}Q=h}}}var g=o.alternate;if(g!==null){var v=g.child;if(v!==null){g.child=null;do{var w=v.sibling;v.sibling=null,v=w}while(v!==null)}}Q=o}}if(o.subtreeFlags&2064&&i!==null)i.return=o,Q=i;else e:for(;Q!==null;){if(o=Q,o.flags&2048)switch(o.tag){case 0:case 11:case 15:ts(9,o,o.return)}var x=o.sibling;if(x!==null){x.return=o.return,Q=x;break e}Q=o.return}}var y=e.current;for(Q=y;Q!==null;){i=Q;var b=i.child;if(i.subtreeFlags&2064&&b!==null)b.return=i,Q=b;else e:for(i=y;Q!==null;){if(a=Q,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:_i(9,a)}}catch(N){tt(a,a.return,N)}if(a===i){Q=null;break e}var k=a.sibling;if(k!==null){k.return=a.return,Q=k;break e}Q=a.return}}if(Me=s,gr(),bn&&typeof bn.onPostCommitFiberRoot=="function")try{bn.onPostCommitFiberRoot(Ni,e)}catch{}r=!0}return r}finally{De=n,Jt.transition=t}}return!1}function jm(e,t,n){t=ml(n,t),t=oh(e,t,1),e=ar(e,t,1),t=Et(),e!==null&&(Ts(e,1,t),Pt(e,t))}function tt(e,t,n){if(e.tag===3)jm(e,e,n);else for(;t!==null;){if(t.tag===3){jm(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(cr===null||!cr.has(r))){e=ml(n,e),e=ih(t,e,1),t=ar(t,e,1),e=Et(),t!==null&&(Ts(t,1,e),Pt(t,e));break}}t=t.return}}function ky(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Et(),e.pingedLanes|=e.suspendedLanes&n,pt===e&&(xt&n)===n&&(dt===4||dt===3&&(xt&130023424)===xt&&500>rt()-Gu?Er(e,0):$u|=n),Pt(e,t)}function Eh(e,t){t===0&&(e.mode&1?(t=to,to<<=1,!(to&130023424)&&(to=4194304)):t=1);var n=Et();e=Fn(e,t),e!==null&&(Ts(e,t,n),Pt(e,n))}function Sy(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Eh(e,n)}function jy(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,s=e.memoizedState;s!==null&&(n=s.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(A(314))}r!==null&&r.delete(t),Eh(e,n)}var Th;Th=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||At.current)Ot=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return Ot=!1,my(e,t,n);Ot=!!(e.flags&131072)}else Ot=!1,He&&t.flags&1048576&&Lp(t,Yo,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;_o(e,t),e=t.pendingProps;var s=al(t,kt.current);sl(t,n),s=Iu(null,t,r,e,s,n);var o=Ou();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Dt(r)?(o=!0,Ko(t)):o=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,Tu(t),s.updater=Mi,t.stateNode=s,s._reactInternals=t,_c(t,r,e,n),t=Ic(null,t,r,!0,o,n)):(t.tag=0,He&&o&&wu(t),Ct(null,t,s,n),t=t.child),t;case 16:r=t.elementType;e:{switch(_o(e,t),e=t.pendingProps,s=r._init,r=s(r._payload),t.type=r,s=t.tag=Ey(r),e=ln(r,e),s){case 0:t=Lc(null,t,r,e,n);break e;case 1:t=hm(null,t,r,e,n);break e;case 11:t=fm(null,t,r,e,n);break e;case 14:t=pm(null,t,r,ln(r.type,e),n);break e}throw Error(A(306,r,""))}return t;case 0:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:ln(r,s),Lc(e,t,r,s,n);case 1:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:ln(r,s),hm(e,t,r,s,n);case 3:e:{if(dh(t),e===null)throw Error(A(387));r=t.pendingProps,o=t.memoizedState,s=o.element,Fp(e,t),Zo(t,r,null,n);var i=t.memoizedState;if(r=i.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){s=ml(Error(A(423)),t),t=gm(e,t,r,n,s);break e}else if(r!==s){s=ml(Error(A(424)),t),t=gm(e,t,r,n,s);break e}else for(Gt=ir(t.stateNode.containerInfo.firstChild),zt=t,He=!0,on=null,n=Dp(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(cl(),r===s){t=$n(e,t,n);break e}Ct(e,t,r,n)}t=t.child}return t;case 5:return $p(t),e===null&&Ec(t),r=t.type,s=t.pendingProps,o=e!==null?e.memoizedProps:null,i=s.children,Nc(r,s)?i=null:o!==null&&Nc(r,o)&&(t.flags|=32),uh(e,t),Ct(e,t,i,n),t.child;case 6:return e===null&&Ec(t),null;case 13:return mh(e,t,n);case 4:return Mu(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=ul(t,null,r,n):Ct(e,t,r,n),t.child;case 11:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:ln(r,s),fm(e,t,r,s,n);case 7:return Ct(e,t,t.pendingProps,n),t.child;case 8:return Ct(e,t,t.pendingProps.children,n),t.child;case 12:return Ct(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,s=t.pendingProps,o=t.memoizedProps,i=s.value,ze(Xo,r._currentValue),r._currentValue=i,o!==null)if(mn(o.value,i)){if(o.children===s.children&&!At.current){t=$n(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var a=o.dependencies;if(a!==null){i=o.child;for(var c=a.firstContext;c!==null;){if(c.context===r){if(o.tag===1){c=An(-1,n&-n),c.tag=2;var u=o.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?c.next=c:(c.next=d.next,d.next=c),u.pending=c}}o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),Tc(o.return,n,t),a.lanes|=n;break}c=c.next}}else if(o.tag===10)i=o.type===t.type?null:o.child;else if(o.tag===18){if(i=o.return,i===null)throw Error(A(341));i.lanes|=n,a=i.alternate,a!==null&&(a.lanes|=n),Tc(i,n,t),i=o.sibling}else i=o.child;if(i!==null)i.return=o;else for(i=o;i!==null;){if(i===t){i=null;break}if(o=i.sibling,o!==null){o.return=i.return,i=o;break}i=i.return}o=i}Ct(e,t,s.children,n),t=t.child}return t;case 9:return s=t.type,r=t.pendingProps.children,sl(t,n),s=en(s),r=r(s),t.flags|=1,Ct(e,t,r,n),t.child;case 14:return r=t.type,s=ln(r,t.pendingProps),s=ln(r.type,s),pm(e,t,r,s,n);case 15:return ah(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,s=t.pendingProps,s=t.elementType===r?s:ln(r,s),_o(e,t),t.tag=1,Dt(r)?(e=!0,Ko(t)):e=!1,sl(t,n),sh(t,r,s),_c(t,r,s,n),Ic(null,t,r,!0,e,n);case 19:return fh(e,t,n);case 22:return ch(e,t,n)}throw Error(A(156,t.tag))};function Mh(e,t){return np(e,t)}function Cy(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xt(e,t,n,r){return new Cy(e,t,n,r)}function Uu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ey(e){if(typeof e=="function")return Uu(e)?1:0;if(e!=null){if(e=e.$$typeof,e===cu)return 11;if(e===uu)return 14}return 2}function dr(e,t){var n=e.alternate;return n===null?(n=Xt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Io(e,t,n,r,s,o){var i=2;if(r=e,typeof e=="function")Uu(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case Vr:return Tr(n.children,s,o,t);case au:i=8,s|=8;break;case ec:return e=Xt(12,n,t,s|2),e.elementType=ec,e.lanes=o,e;case tc:return e=Xt(13,n,t,s),e.elementType=tc,e.lanes=o,e;case nc:return e=Xt(19,n,t,s),e.elementType=nc,e.lanes=o,e;case $f:return Li(n,s,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Pf:i=10;break e;case Ff:i=9;break e;case cu:i=11;break e;case uu:i=14;break e;case Yn:i=16,r=null;break e}throw Error(A(130,e==null?e:typeof e,""))}return t=Xt(i,n,t,s),t.elementType=e,t.type=r,t.lanes=o,t}function Tr(e,t,n,r){return e=Xt(7,e,r,t),e.lanes=n,e}function Li(e,t,n,r){return e=Xt(22,e,r,t),e.elementType=$f,e.lanes=n,e.stateNode={isHidden:!1},e}function La(e,t,n){return e=Xt(6,e,null,t),e.lanes=n,e}function Ia(e,t,n){return t=Xt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Ty(e,t,n,r,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=fa(0),this.expirationTimes=fa(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=fa(0),this.identifierPrefix=r,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function Bu(e,t,n,r,s,o,i,a,c){return e=new Ty(e,t,n,a,c),t===1?(t=1,o===!0&&(t|=8)):t=0,o=Xt(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Tu(o),e}function My(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:qr,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function _h(e){if(!e)return fr;e=e._reactInternals;e:{if(Ar(e)!==e||e.tag!==1)throw Error(A(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Dt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(A(171))}if(e.tag===1){var n=e.type;if(Dt(n))return _p(e,n,t)}return t}function Rh(e,t,n,r,s,o,i,a,c){return e=Bu(n,r,!0,e,s,o,i,a,c),e.context=_h(null),n=e.current,r=Et(),s=ur(n),o=An(r,s),o.callback=t??null,ar(n,o,s),e.current.lanes=s,Ts(e,s,r),Pt(e,r),e}function Ii(e,t,n,r){var s=t.current,o=Et(),i=ur(s);return n=_h(n),t.context===null?t.context=n:t.pendingContext=n,t=An(o,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=ar(s,t,i),e!==null&&(un(e,s,i,o),Eo(e,s,i)),i}function ii(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Cm(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Hu(e,t){Cm(e,t),(e=e.alternate)&&Cm(e,t)}function _y(){return null}var Lh=typeof reportError=="function"?reportError:function(e){console.error(e)};function Wu(e){this._internalRoot=e}Oi.prototype.render=Wu.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(A(409));Ii(e,t,null,null)};Oi.prototype.unmount=Wu.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ir(function(){Ii(null,e,null,null)}),t[Pn]=null}};function Oi(e){this._internalRoot=e}Oi.prototype.unstable_scheduleHydration=function(e){if(e){var t=cp();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Jn.length&&t!==0&&t<Jn[n].priority;n++);Jn.splice(n,0,e),n===0&&dp(e)}};function Ku(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ai(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Em(){}function Ry(e,t,n,r,s){if(s){if(typeof r=="function"){var o=r;r=function(){var u=ii(i);o.call(u)}}var i=Rh(t,r,e,0,null,!1,!1,"",Em);return e._reactRootContainer=i,e[Pn]=i.current,hs(e.nodeType===8?e.parentNode:e),Ir(),i}for(;s=e.lastChild;)e.removeChild(s);if(typeof r=="function"){var a=r;r=function(){var u=ii(c);a.call(u)}}var c=Bu(e,0,!1,null,null,!1,!1,"",Em);return e._reactRootContainer=c,e[Pn]=c.current,hs(e.nodeType===8?e.parentNode:e),Ir(function(){Ii(t,c,n,r)}),c}function Di(e,t,n,r,s){var o=n._reactRootContainer;if(o){var i=o;if(typeof s=="function"){var a=s;s=function(){var c=ii(i);a.call(c)}}Ii(t,i,e,s)}else i=Ry(n,t,e,s,r);return ii(i)}ip=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Ul(t.pendingLanes);n!==0&&(fu(t,n|1),Pt(t,rt()),!(Me&6)&&(fl=rt()+500,gr()))}break;case 13:Ir(function(){var r=Fn(e,1);if(r!==null){var s=Et();un(r,e,1,s)}}),Hu(e,1)}};pu=function(e){if(e.tag===13){var t=Fn(e,134217728);if(t!==null){var n=Et();un(t,e,134217728,n)}Hu(e,134217728)}};ap=function(e){if(e.tag===13){var t=ur(e),n=Fn(e,t);if(n!==null){var r=Et();un(n,e,t,r)}Hu(e,t)}};cp=function(){return De};up=function(e,t){var n=De;try{return De=e,t()}finally{De=n}};mc=function(e,t,n){switch(t){case"input":if(sc(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var s=Ci(r);if(!s)throw Error(A(90));zf(r),sc(r,s)}}}break;case"textarea":Vf(e,n);break;case"select":t=n.value,t!=null&&tl(e,!!n.multiple,t,!1)}};Yf=zu;Xf=Ir;var Ly={usingClientEntryPoint:!1,Events:[_s,Wr,Ci,Kf,Qf,zu]},Pl={findFiberByHostInstance:Sr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Iy={bundleType:Pl.bundleType,version:Pl.version,rendererPackageName:Pl.rendererPackageName,rendererConfig:Pl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:zn.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=ep(e),e===null?null:e.stateNode},findFiberByHostInstance:Pl.findFiberByHostInstance||_y,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var fo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!fo.isDisabled&&fo.supportsFiber)try{Ni=fo.inject(Iy),bn=fo}catch{}}Vt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ly;Vt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ku(t))throw Error(A(200));return My(e,t,null,n)};Vt.createRoot=function(e,t){if(!Ku(e))throw Error(A(299));var n=!1,r="",s=Lh;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=Bu(e,1,!1,null,null,n,!1,r,s),e[Pn]=t.current,hs(e.nodeType===8?e.parentNode:e),new Wu(t)};Vt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(A(188)):(e=Object.keys(e).join(","),Error(A(268,e)));return e=ep(t),e=e===null?null:e.stateNode,e};Vt.flushSync=function(e){return Ir(e)};Vt.hydrate=function(e,t,n){if(!Ai(t))throw Error(A(200));return Di(null,e,t,!0,n)};Vt.hydrateRoot=function(e,t,n){if(!Ku(e))throw Error(A(405));var r=n!=null&&n.hydratedSources||null,s=!1,o="",i=Lh;if(n!=null&&(n.unstable_strictMode===!0&&(s=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Rh(t,null,e,1,n??null,s,!1,o,i),e[Pn]=t.current,hs(e),r)for(e=0;e<r.length;e++)n=r[e],s=n._getVersion,s=s(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,s]:t.mutableSourceEagerHydrationData.push(n,s);return new Oi(t)};Vt.render=function(e,t,n){if(!Ai(t))throw Error(A(200));return Di(null,e,t,!1,n)};Vt.unmountComponentAtNode=function(e){if(!Ai(e))throw Error(A(40));return e._reactRootContainer?(Ir(function(){Di(null,null,e,!1,function(){e._reactRootContainer=null,e[Pn]=null})}),!0):!1};Vt.unstable_batchedUpdates=zu;Vt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Ai(n))throw Error(A(200));if(e==null||e._reactInternals===void 0)throw Error(A(38));return Di(e,t,n,!1,r)};Vt.version="18.3.1-next-f1338f8080-20240426";function Ih(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ih)}catch(e){console.error(e)}}Ih(),If.exports=Vt;var Oy=If.exports,Tm=Oy;Ja.createRoot=Tm.createRoot,Ja.hydrateRoot=Tm.hydrateRoot;var Qu=/^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i,Oh=/^[\\/]{2}/;function Ay(e,t){return t+e.replace(/\\/g,"/")}var Mm="popstate";function _m(e){return typeof e=="object"&&e!=null&&"pathname"in e&&"search"in e&&"hash"in e&&"state"in e&&"key"in e}function Dy(e={}){function t(r,s){var u;let o=(u=s.state)==null?void 0:u.masked,{pathname:i,search:a,hash:c}=o||r.location;return Bc("",{pathname:i,search:a,hash:c},s.state&&s.state.usr||null,s.state&&s.state.key||"default",o?{pathname:r.location.pathname,search:r.location.search,hash:r.location.hash}:void 0)}function n(r,s){return typeof s=="string"?s:Ss(s)}return Fy(t,n,null,e)}function We(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function fn(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function Py(){return Math.random().toString(36).substring(2,10)}function Rm(e,t){return{usr:e.state,key:e.key,idx:t,masked:e.mask?{pathname:e.pathname,search:e.search,hash:e.hash}:void 0}}function Bc(e,t,n=null,r,s){return{pathname:typeof e=="string"?e:e.pathname,search:"",hash:"",...typeof t=="string"?bl(t):t,state:n,key:t&&t.key||r||Py(),mask:s}}function Ss({pathname:e="/",search:t="",hash:n=""}){return t&&t!=="?"&&(e+=t.charAt(0)==="?"?t:"?"+t),n&&n!=="#"&&(e+=n.charAt(0)==="#"?n:"#"+n),e}function bl(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substring(n),e=e.substring(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substring(r),e=e.substring(0,r)),e&&(t.pathname=e)}return t}function Fy(e,t,n,r={}){let{window:s=document.defaultView,v5Compat:o=!1}=r,i=s.history,a="POP",c=null,u=d();u==null&&(u=0,i.replaceState({...i.state,idx:u},""));function d(){return(i.state||{idx:null}).idx}function p(){a="POP";let w=d(),x=w==null?null:w-u;u=w,c&&c({action:a,location:v.location,delta:x})}function m(w,x){a="PUSH";let y=_m(w)?w:Bc(v.location,w,x);n&&n(y,w),u=d()+1;let b=Rm(y,u),k=v.createHref(y.mask||y);try{i.pushState(b,"",k)}catch(N){if(N instanceof DOMException&&N.name==="DataCloneError")throw N;s.location.assign(k)}o&&c&&c({action:a,location:v.location,delta:1})}function h(w,x){a="REPLACE";let y=_m(w)?w:Bc(v.location,w,x);n&&n(y,w),u=d();let b=Rm(y,u),k=v.createHref(y.mask||y);i.replaceState(b,"",k),o&&c&&c({action:a,location:v.location,delta:0})}function g(w){return $y(s,w)}let v={get action(){return a},get location(){return e(s,i)},listen(w){if(c)throw new Error("A history only accepts one active listener");return s.addEventListener(Mm,p),c=w,()=>{s.removeEventListener(Mm,p),c=null}},createHref(w){return t(s,w)},createURL:g,encodeLocation(w){let x=g(w);return{pathname:x.pathname,search:x.search,hash:x.hash}},push:m,replace:h,go(w){return i.go(w)}};return v}function $y(e,t,n=!1){let r="http://localhost";e&&(r=e.location.origin!=="null"?e.location.origin:e.location.href),We(r,"No window.location.(origin|href) available to create URL");let s=typeof t=="string"?t:Ss(t);return s=s.replace(/ $/,"%20"),!n&&Oh.test(s)&&(s=r+s),new URL(s,r)}function Ah(e,t,n="/"){return Gy(e,t,n,!1)}function Gy(e,t,n,r,s){let o=typeof t=="string"?bl(t):t,i=Gn(o.pathname||"/",n);if(i==null)return null;let a=s??zy(e),c=null,u=Jy(i);for(let d=0;c==null&&d<a.length;++d)c=Xy(a[d],u,r);return c}function zy(e){let t=Dh(e);return qy(t),t}function Dh(e,t=[],n=[],r="",s=!1){let o=(i,a,c=s,u)=>{let d={relativePath:u===void 0?i.path||"":u,caseSensitive:i.caseSensitive===!0,childrenIndex:a,route:i};if(d.relativePath.startsWith("/")){if(!d.relativePath.startsWith(r)&&c)return;We(d.relativePath.startsWith(r),`Absolute route path "${d.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),d.relativePath=d.relativePath.slice(r.length)}let p=dn([r,d.relativePath]),m=n.concat(d);i.children&&i.children.length>0&&(We(i.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${p}".`),Dh(i.children,t,m,p,c)),!(i.path==null&&!i.index)&&t.push({path:p,score:Qy(p,i.index),routesMeta:m.map((h,g)=>{let[v,w]=$h(h.relativePath,h.caseSensitive,g===m.length-1);return{...h,matcher:v,compiledParams:w}})})};return e.forEach((i,a)=>{var c;if(i.path===""||!((c=i.path)!=null&&c.includes("?")))o(i,a);else for(let u of Ph(i.path))o(i,a,!0,u)}),t}function Ph(e){let t=e.split("/");if(t.length===0)return[];let[n,...r]=t,s=n.endsWith("?"),o=n.replace(/\?$/,"");if(r.length===0)return s?[o,""]:[o];let i=Ph(r.join("/")),a=[];return a.push(...i.map(c=>c===""?o:[o,c].join("/"))),s&&a.push(...i),a.map(c=>e.startsWith("/")&&c===""?"/":c)}function qy(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Yy(t.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}var Vy=/^:[\w-]+$/,Uy=3,By=2,Hy=1,Wy=10,Ky=-2,Lm=e=>e==="*";function Qy(e,t){let n=e.split("/"),r=n.length;return n.some(Lm)&&(r+=Ky),t&&(r+=By),n.filter(s=>!Lm(s)).reduce((s,o)=>s+(Vy.test(o)?Uy:o===""?Hy:Wy),r)}function Yy(e,t){return e.length===t.length&&e.slice(0,-1).every((r,s)=>r===t[s])?e[e.length-1]-t[t.length-1]:0}function Xy(e,t,n=!1){let{routesMeta:r}=e,s={},o="/",i=[];for(let a=0;a<r.length;++a){let c=r[a],u=a===r.length-1,d=o==="/"?t:t.slice(o.length)||"/",p={path:c.relativePath,caseSensitive:c.caseSensitive,end:u},m=c.matcher&&c.compiledParams?Fh(p,d,c.matcher,c.compiledParams):ai(p,d),h=c.route;if(!m&&u&&n&&!r[r.length-1].route.index&&(m=ai({path:c.relativePath,caseSensitive:c.caseSensitive,end:!1},d)),!m)return null;Object.assign(s,m.params),i.push({params:s,pathname:dn([o,m.pathname]),pathnameBase:tv(dn([o,m.pathnameBase])),route:h}),m.pathnameBase!=="/"&&(o=dn([o,m.pathnameBase]))}return i}function ai(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=$h(e.path,e.caseSensitive,e.end);return Fh(e,t,n,r)}function Fh(e,t,n,r){let s=t.match(n);if(!s)return null;let o=s[0],i=o.replace(/(.)\/+$/,"$1"),a=s.slice(1);return{params:r.reduce((u,{paramName:d,isOptional:p},m)=>{if(d==="*"){let g=a[m]||"";i=o.slice(0,o.length-g.length).replace(/(.)\/+$/,"$1")}const h=a[m];return p&&!h?u[d]=void 0:u[d]=(h||"").replace(/%2F/g,"/"),u},{}),pathname:o,pathnameBase:i,pattern:e}}function $h(e,t=!1,n=!0){fn(e==="*"||!e.endsWith("*")||e.endsWith("/*"),`Route path "${e}" will be treated as if it were "${e.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/,"/*")}".`);let r=[],s="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(i,a,c,u,d)=>{if(r.push({paramName:a,isOptional:c!=null}),c){let p=d.charAt(u+i.length);return p&&p!=="/"?"/([^\\/]*)":"(?:/([^\\/]*))?"}return"/([^\\/]+)"}).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return e.endsWith("*")?(r.push({paramName:"*"}),s+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?s+="\\/*$":e!==""&&e!=="/"&&(s+="(?:(?=\\/|$))"),[new RegExp(s,t?void 0:"i"),r]}function Jy(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return fn(!1,`The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`),e}}function Gn(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}function Zy(e,t="/"){let{pathname:n,search:r="",hash:s=""}=typeof e=="string"?bl(e):e,o;return n?(n=Gh(n),n.startsWith("/")?o=Im(n.substring(1),"/"):o=Im(n,t)):o=t,{pathname:o,search:nv(r),hash:rv(s)}}function Im(e,t){let n=ci(t).split("/");return e.split("/").forEach(s=>{s===".."?n.length>1&&n.pop():s!=="."&&n.push(s)}),n.length>1?n.join("/"):"/"}function Oa(e,t,n,r){return`Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(r)}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function ev(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Yu(e){let t=ev(e);return t.map((n,r)=>r===t.length-1?n.pathname:n.pathnameBase)}function Pi(e,t,n,r=!1){let s;typeof e=="string"?s=bl(e):(s={...e},We(!s.pathname||!s.pathname.includes("?"),Oa("?","pathname","search",s)),We(!s.pathname||!s.pathname.includes("#"),Oa("#","pathname","hash",s)),We(!s.search||!s.search.includes("#"),Oa("#","search","hash",s)));let o=e===""||s.pathname==="",i=o?"/":s.pathname,a;if(i==null)a=n;else{let p=t.length-1;if(!r&&i.startsWith("..")){let m=i.split("/");for(;m[0]==="..";)m.shift(),p-=1;s.pathname=m.join("/")}a=p>=0?t[p]:"/"}let c=Zy(s,a),u=i&&i!=="/"&&i.endsWith("/"),d=(o||i===".")&&n.endsWith("/");return!c.pathname.endsWith("/")&&(u||d)&&(c.pathname+="/"),c}var Gh=e=>e.replace(/[\\/]{2,}/g,"/"),dn=e=>Gh(e.join("/")),ci=e=>e.replace(/\/+$/,""),tv=e=>ci(e).replace(/^\/*/,"/"),nv=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,rv=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e,lv=class{constructor(e,t,n,r=!1){this.status=e,this.statusText=t||"",this.internal=r,n instanceof Error?(this.data=n.toString(),this.error=n):this.data=n}};function sv(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}function ov(e){let t=e.map(n=>n.route.path).filter(Boolean);return dn(t)||"/"}var zh=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function qh(e,t){let n=e;if(typeof n!="string"||!Qu.test(n))return{absoluteURL:void 0,isExternal:!1,to:n};let r=n,s=!1;if(zh)try{let o=new URL(window.location.href),i=Oh.test(n)?new URL(Ay(n,o.protocol)):new URL(n),a=Gn(i.pathname,t);i.origin===o.origin&&a!=null?n=a+i.search+i.hash:s=!0}catch{fn(!1,`<Link to="${n}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:r,isExternal:s,to:n}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var Vh=["POST","PUT","PATCH","DELETE"];new Set(Vh);var iv=["GET",...Vh];new Set(iv);var av=["about:","blob:","chrome:","chrome-untrusted:","content:","data:","devtools:","file:","filesystem:","javascript:"];function cv(e){try{return av.includes(new URL(e).protocol)}catch{return!1}}var wl=f.createContext(null);wl.displayName="DataRouter";var Fi=f.createContext(null);Fi.displayName="DataRouterState";var Uh=f.createContext(!1);function uv(){return f.useContext(Uh)}var Bh=f.createContext({isTransitioning:!1});Bh.displayName="ViewTransition";var dv=f.createContext(new Map);dv.displayName="Fetchers";var mv=f.createContext(null);mv.displayName="Await";var Bt=f.createContext(null);Bt.displayName="Navigation";var Ls=f.createContext(null);Ls.displayName="Location";var pn=f.createContext({outlet:null,matches:[],isDataRoute:!1});pn.displayName="Route";var Xu=f.createContext(null);Xu.displayName="RouteError";var Hh="REACT_ROUTER_ERROR",fv="REDIRECT",pv="ROUTE_ERROR_RESPONSE";function hv(e){if(e.startsWith(`${Hh}:${fv}:{`))try{let t=JSON.parse(e.slice(28));if(typeof t=="object"&&t&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.location=="string"&&typeof t.reloadDocument=="boolean"&&typeof t.replace=="boolean")return t}catch{}}function gv(e){if(e.startsWith(`${Hh}:${pv}:{`))try{let t=JSON.parse(e.slice(40));if(typeof t=="object"&&t&&typeof t.status=="number"&&typeof t.statusText=="string")return new lv(t.status,t.statusText,t.data)}catch{}}function xv(e,{relative:t}={}){We(Nl(),"useHref() may be used only in the context of a <Router> component.");let{basename:n,navigator:r}=f.useContext(Bt),{hash:s,pathname:o,search:i}=Os(e,{relative:t}),a=o;return n!=="/"&&(a=o==="/"?n:dn([n,o])),r.createHref({pathname:a,search:i,hash:s})}function Nl(){return f.useContext(Ls)!=null}function Ft(){return We(Nl(),"useLocation() may be used only in the context of a <Router> component."),f.useContext(Ls).location}var Wh="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function Kh(e){f.useContext(Bt).static||f.useLayoutEffect(e)}function Is(){let{isDataRoute:e}=f.useContext(pn);return e?Rv():yv()}function yv(){We(Nl(),"useNavigate() may be used only in the context of a <Router> component.");let e=f.useContext(wl),{basename:t,navigator:n}=f.useContext(Bt),{matches:r}=f.useContext(pn),{pathname:s}=Ft(),o=JSON.stringify(Yu(r)),i=f.useRef(!1);return Kh(()=>{i.current=!0}),f.useCallback((c,u={})=>{if(fn(i.current,Wh),!i.current)return;if(typeof c=="number"){n.go(c);return}let d=Pi(c,JSON.parse(o),s,u.relative==="path");e==null&&t!=="/"&&(d.pathname=d.pathname==="/"?t:dn([t,d.pathname])),(u.replace?n.replace:n.push)(d,u.state,u)},[t,n,o,s,e])}f.createContext(null);function vv(){let{matches:e}=f.useContext(pn),t=e[e.length-1];return(t==null?void 0:t.params)??{}}function Os(e,{relative:t}={}){let{matches:n}=f.useContext(pn),{pathname:r}=Ft(),s=JSON.stringify(Yu(n));return f.useMemo(()=>Pi(e,JSON.parse(s),r,t==="path"),[e,s,r,t])}function bv(e,t){return Qh(e,t)}function Qh(e,t,n){var w;We(Nl(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:r}=f.useContext(Bt),{matches:s}=f.useContext(pn),o=s[s.length-1],i=o?o.params:{},a=o?o.pathname:"/",c=o?o.pathnameBase:"/",u=o&&o.route;{let x=u&&u.path||"";Xh(a,!u||x.endsWith("*")||x.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${a}" (under <Route path="${x}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${x}"> to <Route path="${x==="/"?"*":`${x}/*`}">.`)}let d=Ft(),p;if(t){let x=typeof t=="string"?bl(t):t;We(c==="/"||((w=x.pathname)==null?void 0:w.startsWith(c)),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${c}" but pathname "${x.pathname}" was given in the \`location\` prop.`),p=x}else p=d;let m=p.pathname||"/",h=m;if(c!=="/"){let x=c.replace(/^\//,"").split("/");h="/"+m.replace(/^\//,"").split("/").slice(x.length).join("/")}let g=n&&n.state.matches.length?n.state.matches.map(x=>Object.assign(x,{route:n.manifest[x.route.id]||x.route})):Ah(e,{pathname:h});fn(u||g!=null,`No routes matched location "${p.pathname}${p.search}${p.hash}" `),fn(g==null||g[g.length-1].route.element!==void 0||g[g.length-1].route.Component!==void 0||g[g.length-1].route.lazy!==void 0,`Matched leaf route at location "${p.pathname}${p.search}${p.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let v=jv(g&&g.map(x=>Object.assign({},x,{params:Object.assign({},i,x.params),pathname:dn([c,r.encodeLocation?r.encodeLocation(x.pathname.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:x.pathname]),pathnameBase:x.pathnameBase==="/"?c:dn([c,r.encodeLocation?r.encodeLocation(x.pathnameBase.replace(/%/g,"%25").replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:x.pathnameBase])})),s,n);return t&&v?f.createElement(Ls.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",mask:void 0,...p},navigationType:"POP"}},v):v}function wv(){let e=_v(),t=sv(e)?`${e.status} ${e.statusText}`:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,r="rgba(200,200,200, 0.5)",s={padding:"0.5rem",backgroundColor:r},o={padding:"2px 4px",backgroundColor:r},i=null;return console.error("Error handled by React Router default ErrorBoundary:",e),i=f.createElement(f.Fragment,null,f.createElement("p",null,"💿 Hey developer 👋"),f.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",f.createElement("code",{style:o},"ErrorBoundary")," or"," ",f.createElement("code",{style:o},"errorElement")," prop on your route.")),f.createElement(f.Fragment,null,f.createElement("h2",null,"Unexpected Application Error!"),f.createElement("h3",{style:{fontStyle:"italic"}},t),n?f.createElement("pre",{style:s},n):null,i)}var Nv=f.createElement(wv,null),Yh=class extends f.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location||t.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:t.error,location:t.location,revalidation:e.revalidation||t.revalidation}}componentDidCatch(e,t){this.props.onError?this.props.onError(e,t):console.error("React Router caught the following error during render",e)}render(){let e=this.state.error;if(this.context&&typeof e=="object"&&e&&"digest"in e&&typeof e.digest=="string"){const n=gv(e.digest);n&&(e=n)}let t=e!==void 0?f.createElement(pn.Provider,{value:this.props.routeContext},f.createElement(Xu.Provider,{value:e,children:this.props.component})):this.props.children;return this.context?f.createElement(kv,{error:e},t):t}};Yh.contextType=Uh;var Aa=new WeakMap;function kv({children:e,error:t}){let{basename:n}=f.useContext(Bt);if(typeof t=="object"&&t&&"digest"in t&&typeof t.digest=="string"){let r=hv(t.digest);if(r){let s=Aa.get(t);if(s)throw s;let o=qh(r.location,n),i=o.absoluteURL||o.to;if(cv(i))throw new Error("Invalid redirect location");if(zh&&!Aa.get(t))if(o.isExternal||r.reloadDocument)window.location.href=i;else{const a=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(o.to,{replace:r.replace}));throw Aa.set(t,a),a}return f.createElement("meta",{httpEquiv:"refresh",content:`0;url=${i}`})}}return e}function Sv({routeContext:e,match:t,children:n}){let r=f.useContext(wl);return r&&r.static&&r.staticContext&&(t.route.errorElement||t.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=t.route.id),f.createElement(pn.Provider,{value:e},n)}function jv(e,t=[],n){let r=n==null?void 0:n.state;if(e==null){if(!r)return null;if(r.errors)e=r.matches;else if(t.length===0&&!r.initialized&&r.matches.length>0)e=r.matches;else return null}let s=e,o=r==null?void 0:r.errors;if(o!=null){let d=s.findIndex(p=>p.route.id&&(o==null?void 0:o[p.route.id])!==void 0);We(d>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(o).join(",")}`),s=s.slice(0,Math.min(s.length,d+1))}let i=!1,a=-1;if(n&&r){i=r.renderFallback;for(let d=0;d<s.length;d++){let p=s[d];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(a=d),p.route.id){let{loaderData:m,errors:h}=r,g=p.route.loader&&!m.hasOwnProperty(p.route.id)&&(!h||h[p.route.id]===void 0);if(p.route.lazy||g){n.isStatic&&(i=!0),a>=0?s=s.slice(0,a+1):s=[s[0]];break}}}}let c=n==null?void 0:n.onError,u=r&&c?(d,p)=>{var m,h;c(d,{location:r.location,params:((h=(m=r.matches)==null?void 0:m[0])==null?void 0:h.params)??{},pattern:ov(r.matches),errorInfo:p})}:void 0;return s.reduceRight((d,p,m)=>{let h,g=!1,v=null,w=null;r&&(h=o&&p.route.id?o[p.route.id]:void 0,v=p.route.errorElement||Nv,i&&(a<0&&m===0?(Xh("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),g=!0,w=null):a===m&&(g=!0,w=p.route.hydrateFallbackElement||null)));let x=t.concat(s.slice(0,m+1)),y=()=>{let b;return h?b=v:g?b=w:p.route.Component?b=f.createElement(p.route.Component,null):p.route.element?b=p.route.element:b=d,f.createElement(Sv,{match:p,routeContext:{outlet:d,matches:x,isDataRoute:r!=null},children:b})};return r&&(p.route.ErrorBoundary||p.route.errorElement||m===0)?f.createElement(Yh,{location:r.location,revalidation:r.revalidation,component:v,error:h,children:y(),routeContext:{outlet:null,matches:x,isDataRoute:!0},onError:u}):y()},null)}function Ju(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Cv(e){let t=f.useContext(wl);return We(t,Ju(e)),t}function Ev(e){let t=f.useContext(Fi);return We(t,Ju(e)),t}function Tv(e){let t=f.useContext(pn);return We(t,Ju(e)),t}function Zu(e){let t=Tv(e),n=t.matches[t.matches.length-1];return We(n.route.id,`${e} can only be used on routes that contain a unique "id"`),n.route.id}function Mv(){return Zu("useRouteId")}function _v(){var r;let e=f.useContext(Xu),t=Ev("useRouteError"),n=Zu("useRouteError");return e!==void 0?e:(r=t.errors)==null?void 0:r[n]}function Rv(){let{router:e}=Cv("useNavigate"),t=Zu("useNavigate"),n=f.useRef(!1);return Kh(()=>{n.current=!0}),f.useCallback(async(s,o={})=>{fn(n.current,Wh),n.current&&(typeof s=="number"?await e.navigate(s):await e.navigate(s,{fromRouteId:t,...o}))},[e,t])}var Om={};function Xh(e,t,n){!t&&!Om[e]&&(Om[e]=!0,fn(!1,n))}f.memo(Lv);function Lv({routes:e,manifest:t,future:n,state:r,isStatic:s,onError:o}){return Qh(e,void 0,{manifest:t,state:r,isStatic:s,onError:o,future:n})}function Nr({to:e,replace:t,state:n,relative:r}){We(Nl(),"<Navigate> may be used only in the context of a <Router> component.");let{static:s}=f.useContext(Bt);fn(!s,"<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");let{matches:o}=f.useContext(pn),{pathname:i}=Ft(),a=Is(),c=Pi(e,Yu(o),i,r==="path"),u=JSON.stringify(c);return f.useEffect(()=>{a(JSON.parse(u),{replace:t,state:n,relative:r})},[a,u,r,t,n]),null}function nt(e){We(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function Iv({basename:e="/",children:t=null,location:n,navigationType:r="POP",navigator:s,static:o=!1,useTransitions:i}){We(!Nl(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let a=e.replace(/^\/*/,"/"),c=f.useMemo(()=>({basename:a,navigator:s,static:o,useTransitions:i,future:{}}),[a,s,o,i]);typeof n=="string"&&(n=bl(n));let{pathname:u="/",search:d="",hash:p="",state:m=null,key:h="default",mask:g}=n,v=f.useMemo(()=>{let w=Gn(u,a);return w==null?null:{location:{pathname:w,search:d,hash:p,state:m,key:h,mask:g},navigationType:r}},[a,u,d,p,m,h,r,g]);return fn(v!=null,`<Router basename="${a}"> is not able to match the URL "${u}${d}${p}" because it does not start with the basename, so the <Router> won't render anything.`),v==null?null:f.createElement(Bt.Provider,{value:c},f.createElement(Ls.Provider,{children:t,value:v}))}function Ov({children:e,location:t}){return bv(Hc(e),t)}function Hc(e,t=[]){let n=[];return f.Children.forEach(e,(r,s)=>{if(!f.isValidElement(r))return;let o=[...t,s];if(r.type===f.Fragment){n.push.apply(n,Hc(r.props.children,o));return}We(r.type===nt,`[${typeof r.type=="string"?r.type:r.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),We(!r.props.index||!r.props.children,"An index route cannot have child routes.");let i={id:r.props.id||o.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,middleware:r.props.middleware,loader:r.props.loader,action:r.props.action,hydrateFallbackElement:r.props.hydrateFallbackElement,HydrateFallback:r.props.HydrateFallback,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.hasErrorBoundary===!0||r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(i.children=Hc(r.props.children,o)),n.push(i)}),n}var Oo="get",Ao="application/x-www-form-urlencoded";function $i(e){return typeof HTMLElement<"u"&&e instanceof HTMLElement}function Av(e){return $i(e)&&e.tagName.toLowerCase()==="button"}function Dv(e){return $i(e)&&e.tagName.toLowerCase()==="form"}function Pv(e){return $i(e)&&e.tagName.toLowerCase()==="input"}function Fv(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function $v(e,t){return e.button===0&&(!t||t==="_self")&&!Fv(e)}var po=null;function Gv(){if(po===null)try{new FormData(document.createElement("form"),0),po=!1}catch{po=!0}return po}var zv=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function Da(e){return e!=null&&!zv.has(e)?(fn(!1,`"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Ao}"`),null):e}function qv(e,t){let n,r,s,o,i;if(Dv(e)){let a=e.getAttribute("action");r=a?Gn(a,t):null,n=e.getAttribute("method")||Oo,s=Da(e.getAttribute("enctype"))||Ao,o=new FormData(e)}else if(Av(e)||Pv(e)&&(e.type==="submit"||e.type==="image")){let a=e.form;if(a==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let c=e.getAttribute("formaction")||a.getAttribute("action");if(r=c?Gn(c,t):null,n=e.getAttribute("formmethod")||a.getAttribute("method")||Oo,s=Da(e.getAttribute("formenctype"))||Da(a.getAttribute("enctype"))||Ao,o=new FormData(a,e),!Gv()){let{name:u,type:d,value:p}=e;if(d==="image"){let m=u?`${u}.`:"";o.append(`${m}x`,"0"),o.append(`${m}y`,"0")}else u&&o.append(u,p)}}else{if($i(e))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');n=Oo,r=null,s=Ao,i=e}return o&&s==="text/plain"&&(i=o,o=void 0),{action:r,method:n.toLowerCase(),encType:s,formData:o,body:i}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function ed(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function Jh(e,t,n,r){let s=typeof e=="string"?new URL(e,typeof window>"u"?"server://singlefetch/":window.location.origin):e;return n?s.pathname.endsWith("/")?s.pathname=`${s.pathname}_.${r}`:s.pathname=`${s.pathname}.${r}`:s.pathname==="/"?s.pathname=`_root.${r}`:t&&Gn(s.pathname,t)==="/"?s.pathname=`${ci(t)}/_root.${r}`:s.pathname=`${ci(s.pathname)}.${r}`,s}async function Vv(e,t){if(e.id in t)return t[e.id];try{let n=await wo(()=>import(e.module),[]);return t[e.id]=n,n}catch(n){return console.error(`Error loading route module \`${e.module}\`, reloading page...`),console.error(n),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function Uv(e){return e!=null&&typeof e.page=="string"}function Bv(e){return e==null?!1:e.href==null?e.rel==="preload"&&typeof e.imageSrcSet=="string"&&typeof e.imageSizes=="string":typeof e.rel=="string"&&typeof e.href=="string"}async function Hv(e,t,n){let r=await Promise.all(e.map(async s=>{let o=t.routes[s.route.id];if(o){let i=await Vv(o,n);return i.links?i.links():[]}return[]}));return Yv(r.flat(1).filter(Bv).filter(s=>s.rel==="stylesheet"||s.rel==="preload").map(s=>s.rel==="stylesheet"?{...s,rel:"prefetch",as:"style"}:{...s,rel:"prefetch"}))}function Am(e,t,n,r,s,o){let i=(c,u)=>n[u]?c.route.id!==n[u].route.id:!0,a=(c,u)=>{var d;return n[u].pathname!==c.pathname||((d=n[u].route.path)==null?void 0:d.endsWith("*"))&&n[u].params["*"]!==c.params["*"]};return o==="assets"?t.filter((c,u)=>i(c,u)||a(c,u)):o==="data"?t.filter((c,u)=>{var p;let d=r.routes[c.route.id];if(!d||!d.hasLoader)return!1;if(i(c,u)||a(c,u))return!0;if(c.route.shouldRevalidate){let m=c.route.shouldRevalidate({currentUrl:new URL(s.pathname+s.search+s.hash,window.origin),currentParams:((p=n[0])==null?void 0:p.params)||{},nextUrl:new URL(e,window.origin),nextParams:c.params,defaultShouldRevalidate:!0});if(typeof m=="boolean")return m}return!0}):[]}function Wv(e,t,{includeHydrateFallback:n}={}){return Kv(e.map(r=>{let s=t.routes[r.route.id];if(!s)return[];let o=[s.module];return s.clientActionModule&&(o=o.concat(s.clientActionModule)),s.clientLoaderModule&&(o=o.concat(s.clientLoaderModule)),n&&s.hydrateFallbackModule&&(o=o.concat(s.hydrateFallbackModule)),s.imports&&(o=o.concat(s.imports)),o}).flat(1))}function Kv(e){return[...new Set(e)]}function Qv(e){let t={},n=Object.keys(e).sort();for(let r of n)t[r]=e[r];return t}function Yv(e,t){let n=new Set,r=new Set(t);return e.reduce((s,o)=>{if(t&&!Uv(o)&&o.as==="script"&&o.href&&r.has(o.href))return s;let a=JSON.stringify(Qv(o));return n.has(a)||(n.add(a),s.push({key:a,link:o})),s},[])}function td(){let e=f.useContext(wl);return ed(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function Xv(){let e=f.useContext(Fi);return ed(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}var nd=f.createContext(void 0);nd.displayName="FrameworkContext";function Gi(){let e=f.useContext(nd);return ed(e,"You must render this element inside a <HydratedRouter> element"),e}function Jv(e,t){let n=f.useContext(nd),[r,s]=f.useState(!1),[o,i]=f.useState(!1),{onFocus:a,onBlur:c,onMouseEnter:u,onMouseLeave:d,onTouchStart:p}=t,m=f.useRef(null);f.useEffect(()=>{if(e==="render"&&i(!0),e==="viewport"){let v=x=>{x.forEach(y=>{i(y.isIntersecting)})},w=new IntersectionObserver(v,{threshold:.5});return m.current&&w.observe(m.current),()=>{w.disconnect()}}},[e]),f.useEffect(()=>{if(r){let v=setTimeout(()=>{i(!0)},100);return()=>{clearTimeout(v)}}},[r]);let h=()=>{s(!0)},g=()=>{s(!1),i(!1)};return n?e!=="intent"?[o,m,{}]:[o,m,{onFocus:Fl(a,h),onBlur:Fl(c,g),onMouseEnter:Fl(u,h),onMouseLeave:Fl(d,g),onTouchStart:Fl(p,h)}]:[!1,m,{}]}function Fl(e,t){return n=>{e&&e(n),n.defaultPrevented||t(n)}}function Zv({page:e,...t}){let n=uv(),{nonce:r}=Gi(),{router:s}=td(),o=f.useMemo(()=>Ah(s.routes,e,s.basename),[s.routes,e,s.basename]);return o?(t.nonce==null&&r&&(t={...t,nonce:r}),n?f.createElement(tb,{page:e,matches:o,...t}):f.createElement(nb,{page:e,matches:o,...t})):null}function eb(e){let{manifest:t,routeModules:n}=Gi(),[r,s]=f.useState([]);return f.useEffect(()=>{let o=!1;return Hv(e,t,n).then(i=>{o||s(i)}),()=>{o=!0}},[e,t,n]),r}function tb({page:e,matches:t,...n}){let r=Ft(),{future:s}=Gi(),{basename:o}=td(),i=f.useMemo(()=>{if(e===r.pathname+r.search+r.hash)return[];let a=Jh(e,o,s.v8_trailingSlashAwareDataRequests,"rsc"),c=!1,u=[];for(let d of t)typeof d.route.shouldRevalidate=="function"?c=!0:u.push(d.route.id);return c&&u.length>0&&a.searchParams.set("_routes",u.join(",")),[a.pathname+a.search]},[o,s.v8_trailingSlashAwareDataRequests,e,r,t]);return f.createElement(f.Fragment,null,i.map(a=>f.createElement("link",{key:a,rel:"prefetch",as:"fetch",href:a,...n})))}function nb({page:e,matches:t,...n}){let r=Ft(),{future:s,manifest:o,routeModules:i}=Gi(),{basename:a}=td(),{loaderData:c,matches:u}=Xv(),d=f.useMemo(()=>Am(e,t,u,o,r,"data"),[e,t,u,o,r]),p=f.useMemo(()=>Am(e,t,u,o,r,"assets"),[e,t,u,o,r]),m=f.useMemo(()=>{if(e===r.pathname+r.search+r.hash)return[];let v=new Set,w=!1;if(t.forEach(y=>{var k;let b=o.routes[y.route.id];!b||!b.hasLoader||(!d.some(N=>N.route.id===y.route.id)&&y.route.id in c&&((k=i[y.route.id])!=null&&k.shouldRevalidate)||b.hasClientLoader?w=!0:v.add(y.route.id))}),v.size===0)return[];let x=Jh(e,a,s.v8_trailingSlashAwareDataRequests,"data");return w&&v.size>0&&x.searchParams.set("_routes",t.filter(y=>v.has(y.route.id)).map(y=>y.route.id).join(",")),[x.pathname+x.search]},[a,s.v8_trailingSlashAwareDataRequests,c,r,o,d,t,e,i]),h=f.useMemo(()=>Wv(p,o),[p,o]),g=eb(p);return f.createElement(f.Fragment,null,m.map(v=>f.createElement("link",{key:v,rel:"prefetch",as:"fetch",href:v,...n})),h.map(v=>f.createElement("link",{key:v,rel:"modulepreload",href:v,...n})),g.map(({key:v,link:w})=>f.createElement("link",{key:v,nonce:n.nonce,...w,crossOrigin:w.crossOrigin??n.crossOrigin})))}function rb(...e){return t=>{e.forEach(n=>{typeof n=="function"?n(t):n!=null&&(n.current=t)})}}var lb=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{lb&&(window.__reactRouterVersion="7.18.1")}catch{}function sb({basename:e,children:t,useTransitions:n,window:r}){let s=f.useRef();s.current==null&&(s.current=Dy({window:r,v5Compat:!0}));let o=s.current,[i,a]=f.useState({action:o.action,location:o.location}),c=f.useCallback(u=>{n===!1?a(u):f.startTransition(()=>a(u))},[n]);return f.useLayoutEffect(()=>o.listen(c),[o,c]),f.createElement(Iv,{basename:e,children:t,location:i.location,navigationType:i.action,navigator:o,useTransitions:n})}var Zh=f.forwardRef(function({onClick:t,discover:n="render",prefetch:r="none",relative:s,reloadDocument:o,replace:i,mask:a,state:c,target:u,to:d,preventScrollReset:p,viewTransition:m,defaultShouldRevalidate:h,...g},v){let{basename:w,navigator:x,useTransitions:y}=f.useContext(Bt),b=typeof d=="string"&&Qu.test(d),k=qh(d,w);d=k.to;let N=xv(d,{relative:s}),E=Ft(),j=null;if(a){let V=Pi(a,[],E.mask?E.mask.pathname:"/",!0);w!=="/"&&(V.pathname=V.pathname==="/"?w:dn([w,V.pathname])),j=x.createHref(V)}let[C,D,M]=Jv(r,g),Y=cb(d,{replace:i,mask:a,state:c,target:u,preventScrollReset:p,relative:s,viewTransition:m,defaultShouldRevalidate:h,useTransitions:y});function B(V){t&&t(V),V.defaultPrevented||Y(V)}let I=!(k.isExternal||o),O=f.createElement("a",{...g,...M,href:(I?j:void 0)||k.absoluteURL||N,onClick:I?B:t,ref:rb(v,D),target:u,"data-discover":!b&&n==="render"?"true":void 0});return C&&!b?f.createElement(f.Fragment,null,O,f.createElement(Zv,{page:N})):O});Zh.displayName="Link";var ob=f.forwardRef(function({"aria-current":t="page",caseSensitive:n=!1,className:r="",end:s=!1,style:o,to:i,viewTransition:a,children:c,...u},d){let p=Os(i,{relative:u.relative}),m=Ft(),h=f.useContext(Fi),{navigator:g,basename:v}=f.useContext(Bt),w=h!=null&&pb(p)&&a===!0,x=g.encodeLocation?g.encodeLocation(p).pathname:p.pathname,y=m.pathname,b=h&&h.navigation&&h.navigation.location?h.navigation.location.pathname:null;n||(y=y.toLowerCase(),b=b?b.toLowerCase():null,x=x.toLowerCase()),b&&v&&(b=Gn(b,v)||b);const k=x!=="/"&&x.endsWith("/")?x.length-1:x.length;let N=y===x||!s&&y.startsWith(x)&&y.charAt(k)==="/",E=b!=null&&(b===x||!s&&b.startsWith(x)&&b.charAt(x.length)==="/"),j={isActive:N,isPending:E,isTransitioning:w},C=N?t:void 0,D;typeof r=="function"?D=r(j):D=[r,N?"active":null,E?"pending":null,w?"transitioning":null].filter(Boolean).join(" ");let M=typeof o=="function"?o(j):o;return f.createElement(Zh,{...u,"aria-current":C,className:D,ref:d,style:M,to:i,viewTransition:a},typeof c=="function"?c(j):c)});ob.displayName="NavLink";var ib=f.forwardRef(({discover:e="render",fetcherKey:t,navigate:n,reloadDocument:r,replace:s,state:o,method:i=Oo,action:a,onSubmit:c,relative:u,preventScrollReset:d,viewTransition:p,defaultShouldRevalidate:m,...h},g)=>{let{useTransitions:v}=f.useContext(Bt),w=mb(),x=fb(a,{relative:u}),y=i.toLowerCase()==="get"?"get":"post",b=typeof a=="string"&&Qu.test(a),k=N=>{if(c&&c(N),N.defaultPrevented)return;N.preventDefault();let E=N.nativeEvent.submitter,j=(E==null?void 0:E.getAttribute("formmethod"))||i,C=()=>w(E||N.currentTarget,{fetcherKey:t,method:j,navigate:n,replace:s,state:o,relative:u,preventScrollReset:d,viewTransition:p,defaultShouldRevalidate:m});v&&n!==!1?f.startTransition(()=>C()):C()};return f.createElement("form",{ref:g,method:y,action:x,onSubmit:r?c:k,...h,"data-discover":!b&&e==="render"?"true":void 0})});ib.displayName="Form";function ab(e){return`${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function eg(e){let t=f.useContext(wl);return We(t,ab(e)),t}function cb(e,{target:t,replace:n,mask:r,state:s,preventScrollReset:o,relative:i,viewTransition:a,defaultShouldRevalidate:c,useTransitions:u}={}){let d=Is(),p=Ft(),m=Os(e,{relative:i});return f.useCallback(h=>{if($v(h,t)){h.preventDefault();let g=n!==void 0?n:Ss(p)===Ss(m),v=()=>d(e,{replace:g,mask:r,state:s,preventScrollReset:o,relative:i,viewTransition:a,defaultShouldRevalidate:c});u?f.startTransition(()=>v()):v()}},[p,d,m,n,r,s,t,e,o,i,a,c,u])}var ub=0,db=()=>`__${String(++ub)}__`;function mb(){let{router:e}=eg("useSubmit"),{basename:t}=f.useContext(Bt),n=Mv(),r=e.fetch,s=e.navigate;return f.useCallback(async(o,i={})=>{let{action:a,method:c,encType:u,formData:d,body:p}=qv(o,t);if(i.navigate===!1){let m=i.fetcherKey||db();await r(m,n,i.action||a,{defaultShouldRevalidate:i.defaultShouldRevalidate,preventScrollReset:i.preventScrollReset,formData:d,body:p,formMethod:i.method||c,formEncType:i.encType||u,flushSync:i.flushSync})}else await s(i.action||a,{defaultShouldRevalidate:i.defaultShouldRevalidate,preventScrollReset:i.preventScrollReset,formData:d,body:p,formMethod:i.method||c,formEncType:i.encType||u,replace:i.replace,state:i.state,fromRouteId:n,flushSync:i.flushSync,viewTransition:i.viewTransition})},[r,s,t,n])}function fb(e,{relative:t}={}){let{basename:n}=f.useContext(Bt),r=f.useContext(pn);We(r,"useFormAction must be used inside a RouteContext");let[s]=r.matches.slice(-1),o={...Os(e||".",{relative:t})},i=Ft();if(e==null){o.search=i.search;let a=new URLSearchParams(o.search),c=a.getAll("index");if(c.some(d=>d==="")){a.delete("index"),c.filter(p=>p).forEach(p=>a.append("index",p));let d=a.toString();o.search=d?`?${d}`:""}}return(!e||e===".")&&s.route.index&&(o.search=o.search?o.search.replace(/^\?/,"?index&"):"?index"),n!=="/"&&(o.pathname=o.pathname==="/"?n:dn([n,o.pathname])),Ss(o)}function pb(e,{relative:t}={}){let n=f.useContext(Bh);We(n!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:r}=eg("useViewTransitionState"),s=Os(e,{relative:t});if(!n.isTransitioning)return!1;let o=Gn(n.currentLocation.pathname,r)||n.currentLocation.pathname,i=Gn(n.nextLocation.pathname,r)||n.nextLocation.pathname;return ai(s.pathname,i)!=null||ai(s.pathname,o)!=null}const kn=[{category:"Global",question:"open help for `keyword`",solution:[":help keyword",":h keyword"],id:"028a059af5a5",level:1},{category:"Global",question:"save `file` as",solution:[":saveas file"],id:"2214b54e8bc2",level:2},{category:"Global",question:"close current pane",solution:[":close"],id:"f03b2d24c084",level:2},{category:"Global",question:"open man page for word under the cursor",solution:["K"],id:"048610ad1e1c",level:5},{category:"Global",question:"open file under cursor (goto file)",solution:["gf"],id:"662cbbac88cc",level:5},{category:"Cursor movement",question:"move cursor left",solution:["h"],id:"1b1699bf636a",level:0},{category:"Cursor movement",question:"move cursor down",solution:["j"],id:"e47a5c82c865",level:0},{category:"Cursor movement",question:"move cursor up",solution:["k"],id:"41b422b91f9f",level:0},{category:"Cursor movement",question:"move cursor right",solution:["l"],id:"38729f14817f",level:0},{category:"Cursor movement",question:"move to top of screen",solution:["H"],id:"348cf10a140e",level:2},{category:"Cursor movement",question:"move to middle of screen",solution:["M"],id:"a27a1914b737",level:2},{category:"Cursor movement",question:"move to bottom of screen",solution:["L"],id:"6fb0a32d01fd",level:2},{category:"Cursor movement",question:"jump forwards to the start of a word",solution:["w"],id:"76b4b6684acd",level:1},{category:"Cursor movement",question:"jump forwards to the start of a word (words can contain punctuation)",solution:["W"],id:"9cbe77e8a108",level:2},{category:"Cursor movement",question:"jump forwards to the end of a word",solution:["e"],id:"0f807296462e",level:1},{category:"Cursor movement",question:"jump forwards to the end of a word (words can contain punctuation)",solution:["E"],id:"cef9d5eb3485",level:2},{category:"Cursor movement",question:"jump backward to the end of a word",solution:["ge"],id:"40020e559c60",level:3},{category:"Cursor movement",question:"jump backward to the end of a word (words can contain punctuation)",solution:["gE"],id:"1723920c2788",level:4},{category:"Cursor movement",question:"jump backward to the start of a word",solution:["b"],id:"0d91583f2bf8",level:1},{category:"Cursor movement",question:"jump backward to the start of a word (words can contain punctuation)",solution:["B"],id:"abd88172297c",level:2},{category:"Cursor movement",question:"move to matching character (default supported pairs: '()', '{}', '[]'; use *:h matchpairs* in vim for more info). It jumps to the one it finds in the current line",solution:["%"],id:"1ea49a3ab075",level:2},{category:"Cursor movement",question:"jump to the start of the line",solution:["0"],id:"ab8198b97931",level:1},{category:"Cursor movement",question:"jump to the first non-blank character of the line",solution:["^"],id:"fa0f368d35ca",level:2},{category:"Cursor movement",question:"jump to the end of the line",solution:["$"],id:"06301c0d17da",level:1},{category:"Cursor movement",question:"jump to the first non-blank character of the line",solution:["_"],id:"56820d49985d",level:1},{category:"Cursor movement",question:"jump to the last non-blank character of the line",solution:["g_"],id:"c535b0f98a5d",level:3},{category:"Cursor movement",question:"go to the first line of the document",solution:["gg"],id:"7a49572fe6e1",level:1},{category:"Cursor movement",question:"go to the last line of the document",solution:["G"],id:"0c7bb9bf550d",level:1},{category:"Cursor movement",question:"go to line `5`",solution:["5G"],id:"87d63c7ed342",level:2},{category:"Cursor movement",question:"go to line `5` with command",solution:[":5"],id:"2db4e1c9417f",level:2},{category:"Cursor movement",question:"jump to next occurrence of character `x` in this line",solution:["fx"],id:"65598dca12da",level:3},{category:"Cursor movement",question:"jump to before next occurrence of character `x` in this line",solution:["tx"],id:"352d97c8e944",level:3},{category:"Cursor movement",question:"jump to previous occurence of character `x` in this line",solution:["Fx"],id:"5d7c47f5d1af",level:3},{category:"Cursor movement",question:"jump to after previous occurence of character `x` in this line",solution:["Tx"],id:"ff04930c455c",level:4},{category:"Cursor movement",question:"repeat previous f, t, F or T movement",solution:[";"],id:"745e0eabfd7d",level:4},{category:"Cursor movement",question:"repeat previous f, t, F or T movement, backward",solution:[","],id:"2622e8221b8e",level:4},{category:"Cursor movement",question:"jump to next paragraph (or function/block, when editing code)",solution:["}"],id:"c938a1f66bc3",level:3},{category:"Cursor movement",question:"jump to previous paragraph (or function/block, when editing code)",solution:["{"],id:"7c58b5942806",level:3},{category:"Cursor movement",question:"jump to the previous sentence",solution:["("],id:"01121d2f55cd",level:4},{category:"Cursor movement",question:"jump to the next sentence",solution:[")"],id:"47920d381b07",level:4},{category:"Cursor movement",question:"cursor on screen to the center",solution:["zz"],id:"9e001619107a",level:3},{category:"Cursor movement",question:"cursor on screen to top",solution:["zt"],id:"75f35e9a6eb0",level:3},{category:"Cursor movement",question:"cursor on screen to bottom",solution:["zb"],id:"932fed577a15",level:3},{category:"Cursor movement",question:"move screen down one line (without moving cursor), same as `+` symbol",solution:["ctrl-e"],id:"5f5f91356b10",level:3},{category:"Cursor movement",question:"move screen up one line (without moving cursor), same as `-` symbol",solution:["ctrl-y"],id:"a7b42f642d9c",level:3},{category:"Cursor movement",question:"move back one full screen (back full page)",solution:["ctrl-b"],id:"dc0ded7a550f",level:2},{category:"Cursor movement",question:"move forward one full screen (forward full page)",solution:["ctrl-f"],id:"b11ffb6be668",level:2},{category:"Cursor movement",question:"move forward 1/2 a screen (down half page)",solution:["ctrl-d"],id:"50c214083200",level:2},{category:"Cursor movement",question:"move back 1/2 a screen (up half page)",solution:["ctrl-u"],id:"db29bc279d4d",level:2},{category:"Cursor movement",question:"retrace previous cursor position",solution:["ctrl-o"],id:"04787d9eb23e",level:4},{category:"Cursor movement",question:"retrace next cursor position",solution:["ctrl-i"],id:"fe9d6d345d8d",level:4},{category:"Cursor movement",question:"move down by display line (useful with wrapped lines)",solution:["gj"],id:"17927c0c58f2",level:3},{category:"Cursor movement",question:"move up by display line (useful with wrapped lines)",solution:["gk"],id:"39660be90ec2",level:3},{category:"Cursor movement",question:"jump to previous change position (change list)",solution:["g;"],id:"648bc811bd0f",level:5},{category:"Cursor movement",question:"jump to next change position (change list)",solution:["g,"],id:"519aa2b85fc1",level:5},{category:"Insert mode, inserting/appending text",question:"insert before the cursor",solution:["i"],id:"3a20556dbb75",level:0},{category:"Insert mode, inserting/appending text",question:"insert at the beginning of the line",solution:["I"],id:"996e549ca656",level:1},{category:"Insert mode, inserting/appending text",question:"insert (append) after the cursor",solution:["a"],id:"77fb3215fa01",level:1},{category:"Insert mode, inserting/appending text",question:"insert (append) at the end of the line",solution:["A"],id:"92b23595895b",level:1},{category:"Insert mode, inserting/appending text",question:"append (open) a new line below the current line",solution:["o"],id:"0a1df80d3cbf",level:1},{category:"Insert mode, inserting/appending text",question:"append (open) a new line above the current line",solution:["O"],id:"fdafd1797cc7",level:2},{category:"Insert mode, inserting/appending text",question:"insert (append) at the end of the word (so they can be chained with moves)",solution:["ea"],id:"665d9937ffe0",level:3},{category:"Insert mode, inserting/appending text",question:"exit insert mode",solution:["Esc"],id:"4f67d4849636",level:0},{category:"Insert mode, inserting/appending text",question:"delete word before cursor",solution:["ctrl-w"],id:"190ad4ed8729",level:4},{category:"Insert mode, inserting/appending text",question:"delete to start of line",solution:["ctrl-u"],id:"544c43f29b7c",level:4},{category:"Insert mode, inserting/appending text",question:"indent current line one shiftwidth",solution:["ctrl-t"],id:"4cf41b967f86",level:5},{category:"Insert mode, inserting/appending text",question:"dedent current line one shiftwidth",solution:["ctrl-d"],id:"b3dd6d96f0ef",level:5},{category:"Insert mode, inserting/appending text",question:"go to the last place where insert mode was finished",solution:["gi"],id:"4ae221fb18b0",level:4},{category:"Insert mode, inserting/appending text",question:"insert the contents of `REG` register in insert mode.",solution:["ctrl-r REG"],id:"0c06dfe13a63",level:6},{category:"Editing",question:"replace a single character",solution:["r"],id:"098c3bf8d4f6",level:2},{category:"Editing",question:"start replace mode, similar to insert, but overwrites the characters underneath",solution:["R"],id:"ec7b3978f852",level:3},{category:"Editing",question:"join line below to the current one with one space in between",solution:["J"],id:"3caad1b4ff16",level:3},{category:"Editing",question:"join line below to the current one without space in between",solution:["gJ"],id:"cae4a97e7594",level:4},{category:"Editing",question:"reflow paragraph",solution:["gwip"],id:"cb5898dca46f",level:6},{category:"Editing",question:"change (replace) entire line",solution:["cc"],id:"2e8bba5c789e",level:2},{category:"Editing",question:"change (replace) to the end of the line",solution:["C","c$"],id:"9315312b068c",level:2},{category:"Editing",question:"change (replace) entire word",solution:["ciw"],id:"fb0095c117fb",level:3},{category:"Editing",question:"change (replace) to the end of the word",solution:["cw"],id:"61f3ed52fcd8",level:2},{category:"Editing",question:'change (replace) until next occurrance of "hello"',solution:["c/hello"],id:"fbb340ee624d",level:5},{category:"Editing",question:"delete character and substitute text",solution:["s"],id:"a3895dc86a05",level:3},{category:"Editing",question:"transpose two letters (delete and paste)",solution:["xp"],id:"23c9d8770f0c",level:4},{category:"Editing",question:"undo",solution:["u"],id:"d5a5f370e59f",level:1},{category:"Editing",question:"undo in command mode",solution:[":u"],id:"b736cc3384a8",level:2},{category:"Editing",question:"undo all latest changes on one line",solution:["U"],id:"72f62392a48f",level:3},{category:"Editing",question:"redo",solution:["ctrl-r"],id:"a628156e12c2",level:2},{category:"Editing",question:"redo in command mode",solution:[":red"],id:"d7574ad38bf3",level:3},{category:"Editing",question:"repeat last command",solution:["."],id:"21ea54f7b5f1",level:2},{category:"Editing",question:"indent line one shiftwidth",solution:[">>"],id:"b51412f2df33",level:3},{category:"Editing",question:"dedent line one shiftwidth",solution:["<<"],id:"8899cbe3278e",level:3},{category:"Editing",question:"auto-indent `motion` (e.g. `=ip` for current paragraph)",solution:["= + motion"],id:"b4d2127e3729",level:4},{category:"Editing",question:"auto-indent the entire file",solution:["gg=G"],id:"6ad3ae9520bf",level:5},{category:"Editing",question:"increase a number",solution:["ctrl-a"],id:"65c9d8c501b7",level:4},{category:"Editing",question:"decrease a number (practice: 4)",solution:["ctrl-x"],id:"91e2233493c3",level:4},{category:"Editing",question:"make `movement` lowercase",solution:["gu + movement"],id:"a7c8a3f50a15",level:5},{category:"Editing",question:"make `movement` uppercase",solution:["gU + movement"],id:"9ddaf623d22a",level:5},{category:"Editing",question:"toggle case of `movement`",solution:["g~ + movement"],id:"624441cc3354",level:5},{category:"Editing",question:"undo branch forward",solution:["g+"],id:"ed04678b8455",level:7},{category:"Editing",question:"undo branch backward",solution:["g-"],id:"3fa30ec46b8e",level:7},{category:"Editing",question:"undo changes in the last 4 hours",solution:["ea 4h"],id:"84c2e21977fe",level:8},{category:"Editing",question:"undo last 2 file states (last 2 buffer writes)",solution:["ea 2f"],id:"e7c0e1599c6f",level:8},{category:"Editing",question:"redo changes in last 8 minutes",solution:["lat 8m"],id:"b3b50759fbf7",level:8},{category:"Marking text (visual mode)",question:"start visual mode. (you can mark text, then do a command (like y-yank))",solution:["v"],id:"595b9f96f536",level:2},{category:"Marking text (visual mode)",question:"start linewise visual mode",solution:["V"],id:"ef509160599b",level:2},{category:"Marking text (visual mode)",question:"move to other end of marked area",solution:["o"],id:"b40330109fa1",level:4},{category:"Marking text (visual mode)",question:"start visual block mode",solution:["ctrl-v"],id:"4725ff77daec",level:3},{category:"Marking text (visual mode)",question:"move to other corner of block",solution:["O"],id:"55dcd023308f",level:5},{category:"Marking text (visual mode)",question:"mark a word",solution:["aw"],id:"3a35d9b5ee40",level:3},{category:"Marking text (visual mode)",question:"mark a sentence",solution:["as"],id:"d0599ae8aee0",level:4},{category:"Marking text (visual mode)",question:"mark a paragraph",solution:["ap"],id:"1aa1e20407f8",level:4},{category:"Marking text (visual mode)",question:"mark a block with ()",solution:["ab"],id:"ba29201af661",level:4},{category:"Marking text (visual mode)",question:"mark a block with {}",solution:["aB"],id:"5ecc016eb5d3",level:4},{category:"Marking text (visual mode)",question:"mark inner block with ()",solution:["ib"],id:"3ff2a688d0f1",level:4},{category:"Marking text (visual mode)",question:"mark inner block with {}",solution:["iB"],id:"eab070492ba4",level:4},{category:"Marking text (visual mode)",question:"exit visual mode",solution:["Esc"],id:"f5b097060852",level:2},{category:"Marking text (visual mode)",question:"reselect the last visual selection",solution:["gv"],id:"666d85500dce",level:4},{category:"Visual commands",question:"shift text right",solution:[">"],id:"a7860b6e0331",level:3},{category:"Visual commands",question:"shift text left",solution:["<"],id:"7a293089fdc9",level:3},{category:"Visual commands",question:"yank (copy) marked text",solution:["y"],id:"017379d8b8ec",level:3},{category:"Visual commands",question:"delete marked text",solution:["d"],id:"dbfd0623d894",level:3},{category:"Visual commands",question:"switch case",solution:["~"],id:"6cad0fd66898",level:4},{category:"Text objects",question:"inner word / around word (includes surrounding space)",solution:["iw","aw"],id:"7c789a3bfd4d",level:3},{category:"Text objects",question:"inner sentence / around sentence",solution:["is","as"],id:"ed8ae2c72e71",level:3},{category:"Text objects",question:"inner paragraph / around paragraph",solution:["ip","ap"],id:"4a25793c1eea",level:4},{category:"Text objects",question:"inside / around double quotes",solution:['i"','a"'],id:"f8c981c1fe61",level:3},{category:"Text objects",question:"inside / around single quotes",solution:["i'","a'"],id:"5595af025bb6",level:3},{category:"Text objects",question:"inside / around backticks",solution:["i`","a`"],id:"5f2890b682d9",level:4},{category:"Text objects",question:"inside / around parentheses (also `ib`, `ab`)",solution:["i)","a)"],id:"c19b7b167b06",level:3},{category:"Text objects",question:"inside / around square brackets",solution:["i]","a]"],id:"c1e76782d647",level:3},{category:"Text objects",question:"inside / around curly braces (also `iB`, `aB`)",solution:["i}","a}"],id:"6b2906bbf00a",level:3},{category:"Text objects",question:"inside / around angle brackets",solution:["i>","a>"],id:"b8a084b54eb4",level:4},{category:"Text objects",question:"inside / around HTML/XML tag",solution:["it","at"],id:"473fd857f139",level:4},{category:"Registers",question:"show registers content (can append selectors of which registers to show)",solution:[":reg"],id:"b8f8ed6c62e2",level:5},{category:"Registers",question:"yank into register `x`",solution:['"xy'],id:"e7012b84ec87",level:6},{category:"Registers",question:"paste contents of register `x`",solution:['"xp'],id:"ae1dded39224",level:6},{category:"Registers",question:"append contents to register `x`",solution:['"Xp'],id:"b392288492d3",level:7},{category:"Registers",question:"yank into system clipboard",solution:['"+y'],id:"822fd4338b28",level:4},{category:"Registers",question:"paste from system clipboard",solution:['"+p'],id:"dc9cfd80fe69",level:4},{category:"Registers",question:"yank/paste using primary selection (X11 middle-click buffer)",solution:['"*y','"*p'],id:"3dea21922a0a",level:5},{category:"Registers",question:"delete into black hole register (does not affect clipboard or other registers)",solution:['"_d'],id:"9eb4ffb1dae3",level:4},{category:"Marks",question:"list of marks",solution:[":marks"],id:"66922e3607a1",level:4},{category:"Marks",question:"set current position for mark `a`",solution:["ma"],id:"50f02ddabc4b",level:5},{category:"Marks",question:"jump to position of mark `a`",solution:["`a"],id:"05e6fd2fdd4d",level:5},{category:"Marks",question:"jump to the first non-blank character in the line of mark `a`",solution:["'a"],id:"c3f2a5672d9a",level:5},{category:"Marks",question:"yank text to position of mark `a`",solution:["y`a"],id:"31b1771eb0b7",level:6},{category:"Marks",question:"delete marks. `<pattern>` can be 1 lowercase letter, any number of characters, range of letters or numbers",solution:[":delm <pattern>"],id:"9d6c14ffa6f0",level:7},{category:"Macros",question:"record macro `a` (it empties that register and appends the keystrokes to it)",solution:["qa"],id:"1fa795f10141",level:7},{category:"Macros",question:"stop recording macro",solution:["q"],id:"1d7316d000b2",level:7},{category:"Macros",question:"run macro `a`",solution:["@a"],id:"01b238fa249c",level:7},{category:"Macros",question:"rerun last run macro",solution:["@@"],id:"4e0e5438822b",level:8},{category:"Cut and paste",question:"yank (copy) a line",solution:["yy"],id:"b4221ae791e0",level:1},{category:"Cut and paste",question:"yank (copy) `2` lines",solution:["2yy"],id:"101af1084b65",level:2},{category:"Cut and paste",question:"yank (copy) the characters of the word from the cursor position to the start of the next word",solution:["yw"],id:"8bd1a0400b8c",level:2},{category:"Cut and paste",question:"yank (copy) to end of line",solution:["y$"],id:"b5575f87e5bd",level:2},{category:"Cut and paste",question:"put (paste) the clipboard after cursor",solution:["p"],id:"51bbb705a45f",level:1},{category:"Cut and paste",question:"put (paste) before cursor",solution:["P"],id:"fae5440d0002",level:2},{category:"Cut and paste",question:"delete (cut) a line",solution:["dd"],id:"242c4ce7eba9",level:1},{category:"Cut and paste",question:"delete (cut) `2` lines",solution:["2dd"],id:"6572a3226e4b",level:2},{category:"Cut and paste",question:"delete (cut) the characters of the whole word",solution:["diw"],id:"fdc0e5dbead7",level:3},{category:"Cut and paste",question:"delete (cut) the characters of the word from the cursor position to the start of the next word",solution:["dw"],id:"baed9bf23d8c",level:2},{category:"Cut and paste",question:"delete (cut) to the end of the line",solution:["D","d$"],id:"2ed5c5b97242",level:2},{category:"Cut and paste",question:"delete (cut) character",solution:["x"],id:"c97729def9d2",level:1},{category:"Cut and paste",question:"replace (paste) content of the last used register with the word under the cursor",solution:["viwp"],id:"ecec2c82ac0c",level:5},{category:"Cut and paste",question:"paste the last search",solution:['"/p'],id:"b16a54d0c242",level:6},{category:"Exiting",question:"write (save) the file, but don't exit",solution:[":w"],id:"70b26bb2bb52",level:0},{category:"Exiting",question:"write out the current file using sudo",solution:[":w !sudo tee %"],id:"64718e52b046",level:6},{category:"Exiting",question:"write (save) and quit",solution:[":wq",":x","ZZ"],id:"41202c7741d8",level:0},{category:"Exiting",question:"quit (fails if there are unsaved changes)",solution:[":q"],id:"611b132efdaa",level:0},{category:"Exiting",question:"quit and throw away unsaved changes",solution:[":q!","ZQ"],id:"78e8eb6cd5c0",level:0},{category:"Exiting",question:"write (save) and quit on all tabs",solution:[":wqa"],id:"de7f9b7015b5",level:4},{category:"Exiting",question:"suspend vim, start up again with `fg` command (optionally `fg %jobnumber` if multiple jobs are selected). Check running suspended jobs with `jobs` command",solution:["ctrl-z",":st",":stop"],id:"e099da74803a",level:5},{category:"Search and replace",question:"search for `pattern`",solution:["/pattern"],id:"28612e1b3ee8",level:2},{category:"Search and replace",question:"search backward for `pattern`",solution:["?pattern"],id:"634276449d92",level:2},{category:"Search and replace",question:"'very magic' `pattern`: non-alphanumeric characters are interpreted as special regex symbols (no escaping needed)",solution:["/\\vpattern"],id:"dd5de5c8f000",level:6},{category:"Search and replace",question:"repeat search in same direction",solution:["n"],id:"13201c8ede84",level:2},{category:"Search and replace",question:"repeat search in opposite direction",solution:["N"],id:"5f1067ac1298",level:2},{category:"Search and replace",question:"go to first match (assuming forward search)",solution:["ggn"],id:"01cc600bee6d",level:4},{category:"Search and replace",question:"go to last match (assuming forward search)",solution:["GN"],id:"788ab752dcc6",level:4},{category:"Search and replace",question:"replace all `old` with `new` throughout file",solution:[":%s/old/new/g"],id:"9b5336199c20",level:3},{category:"Search and replace",question:"replace all `old` with `new` throughout file with confirmations",solution:[":%s/old/new/gc"],id:"401f1b0d4878",level:4},{category:"Search and replace",question:"remove highlighting of search matches",solution:[":noh"],id:"214298f2e87b",level:3},{category:"Search and replace",question:"start a search forward with the whole current word under the cursor",solution:["*"],id:"8b44147d280e",level:3},{category:"Search and replace",question:"start a search backward with the current word under the cursor",solution:["#"],id:"606716519b5f",level:3},{category:"Search and replace",question:"start a search with the word under the cursor but find occurrences that has more content in it. e.g: `rain` finds `rainbow`",solution:["g*"],id:"71a3971eb874",level:4},{category:"Search and replace",question:"start a search backward with the word under the cursor but find occurrences that has more content in it. e.g: `rain` finds `rainbow`",solution:["g#"],id:"e0d4bda2290e",level:4},{category:"Search in multiple files",question:"search for `/pattern/` in multiple `{file}`s",solution:[":vimgrep /pattern/ {file}"],id:"f0062dd2af57",level:6},{category:"Search in multiple files",question:"jump to the next match",solution:[":cn"],id:"7aceedfb2f81",level:6},{category:"Search in multiple files",question:"jump to the previous match",solution:[":cp"],id:"cc2cf34df970",level:6},{category:"Search in multiple files",question:"open a window containing the list of matches",solution:[":copen"],id:"c0eab233627b",level:6},{category:"Vim for programmers",question:"go to local declaration",solution:["gd"],id:"306d350c61a9",level:5},{category:"Vim for programmers",question:"go to global declaration",solution:["gD"],id:"0dc6e458a487",level:5},{category:"Vim for programmers",question:"jump to start of enclosing `{` block",solution:["[{"],id:"4fb84796d86a",level:5},{category:"Vim for programmers",question:"jump to end of enclosing `}` block",solution:["]}"],id:"3b2e4d290873",level:5},{category:"Vim for programmers",question:"jump to start of enclosing `(`",solution:["[("],id:"cc86968c4d15",level:5},{category:"Vim for programmers",question:"jump to end of enclosing `)`",solution:["])"],id:"c72a1df2c8b9",level:5},{category:"Vim for programmers",question:"jump to start of previous / next method (Java, C++, etc.)",solution:["[m","]m"],id:"1398cd6ae83f",level:6},{category:"Vim for programmers",question:"jump to end of previous / next method",solution:["[M","]M"],id:"ecd3eea5ba32",level:6},{category:"Vim for programmers",question:"jump to tag definition under cursor (requires ctags)",solution:["ctrl-]"],id:"51441c018171",level:6},{category:"Vim for programmers",question:"pop tag stack (jump back after `ctrl-]`)",solution:["ctrl-t"],id:"5cd53aceb0d6",level:6},{category:"Vim for programmers",question:"list and choose between matching tags",solution:[":ts {word}",":tselect {word}"],id:"4f4b83911db9",level:6},{category:"Vim for programmers",question:"jump to next / previous matching tag",solution:[":tn",":tp"],id:"0d4a79ddf6be",level:6},{category:"Vim for programmers",question:"next / previous keyword autocomplete suggestion (insert mode)",solution:["ctrl-n","ctrl-p"],id:"b34defd61569",level:5},{category:"Vim for programmers",question:"trigger omni completion (language-aware, e.g. LSP/filetype plugin)",solution:["ctrl-x ctrl-o"],id:"96cec432805e",level:6},{category:"Vim for programmers",question:"filename completion",solution:["ctrl-x ctrl-f"],id:"75b2c98558fb",level:6},{category:"Vim for programmers",question:"keyword completion from current buffer only",solution:["ctrl-x ctrl-n"],id:"22bf5c41f1dd",level:6},{category:"Vim for programmers",question:"tag-based completion",solution:["ctrl-x ctrl-]"],id:"03a47961abd9",level:6},{category:"Vim for programmers",question:"whole-line completion",solution:["ctrl-x ctrl-l"],id:"09e274cf5a30",level:6},{category:"Vim for programmers",question:"run `make` and load errors into the quickfix list",solution:[":make"],id:"d136409a4d0e",level:5},{category:"Vim for programmers",question:"set the compiler (error format) for `:make`",solution:[":compiler {name}"],id:"9c448c66b8ff",level:5},{category:"Vim for programmers",question:"jump to start of current `/* */` comment",solution:["[/"],id:"ff165b268367",level:6},{category:"Vim for programmers",question:"jump to end of current `/* */` comment",solution:["]/"],id:"4528a06a11b6",level:6},{category:"Working with multiple files",question:"reload current file",solution:[":e"],id:"de8aaba5ea28",level:3},{category:"Working with multiple files",question:"edit a `file` in a new buffer",solution:[":e file"],id:"b210740e0163",level:4},{category:"Working with multiple files",question:"insert a `file` into the current location",solution:[":r file",":read file"],id:"f5ddc1bcacaf",level:5},{category:"Working with multiple files",question:"insert a `file` before the first line",solution:[":0r file",":0read file"],id:"71cf586af011",level:5},{category:"Working with multiple files",question:"execute `{cmd}` and insert its standard output below the cursor",solution:[":r !{cmd}"],id:"5a30167fca1b",level:6},{category:"Working with multiple files",question:"go to the next buffer",solution:[":bnext",":bn"],id:"94984e73dea1",level:4},{category:"Working with multiple files",question:"go to the previous buffer",solution:[":bprev",":bp"],id:"ae3ce941a9ea",level:4},{category:"Working with multiple files",question:"delete a buffer (close a file)",solution:[":bd"],id:"6643d75cb741",level:4},{category:"Working with multiple files",question:"list all open buffers",solution:[":ls"],id:"368787c7a95d",level:4},{category:"Working with multiple files",question:"switch to the alternate (last edited) buffer",solution:["ctrl-^","ctrl-6"],id:"f7a5f3f964a5",level:4},{category:"Working with multiple files",question:"open a `file` in a new buffer and split window",solution:[":sp file"],id:"baed4066efc5",level:4},{category:"Working with multiple files",question:"open a `file` in a new buffer and vertically split window",solution:[":vsp file"],id:"99db921c4b1e",level:4},{category:"Working with multiple files",question:"open a `file` in a new buffer, but readonly",solution:[":sv file",":sview file"],id:"0a7c1b824aa5",level:5},{category:"Working with multiple files",question:"vertically open a `file` as readonly as a split",solution:[":vert sv file"],id:"3e4e02235f54",level:5},{category:"Argument list",question:"display the current argument list (active file shown in `[]`)",solution:[":args"],id:"69447cc6fd7f",level:4},{category:"Argument list",question:"set the argument list to `file1 file2`",solution:[":args file1 file2"],id:"4f149689c75e",level:5},{category:"Argument list",question:"set the argument list with a glob pattern",solution:[":args **/*.txt"],id:"94369853e513",level:5},{category:"Argument list",question:"add `file` to the argument list",solution:[":argadd file"],id:"d55244d1294a",level:5},{category:"Argument list",question:"remove `file` from the argument list",solution:[":argdelete file"],id:"694084cf53f4",level:6},{category:"Argument list",question:"go to the next file in the argument list",solution:[":next",":n"],id:"7c36ee18c26f",level:4},{category:"Argument list",question:"go to the previous file in the argument list",solution:[":prev",":previous"],id:"25f1037a0d1c",level:4},{category:"Argument list",question:"go to the first file in the argument list",solution:[":first",":rewind"],id:"1cbe01a8452e",level:5},{category:"Argument list",question:"go to the last file in the argument list",solution:[":last"],id:"c009e5b41262",level:5},{category:"Argument list",question:"write current file and move to the next in the argument list",solution:[":wnext",":wn"],id:"251e7739d991",level:5},{category:"Argument list",question:"write current file and move to the previous in the argument list",solution:[":wprevious",":wp"],id:"602e39d9ae68",level:5},{category:"Argument list",question:"write current file and go to the first in the argument list",solution:[":wfirst"],id:"e3df31406539",level:6},{category:"Argument list",question:"write current file and go to the last in the argument list",solution:[":wlast"],id:"1d36f0c871a5",level:6},{category:"Argument list",question:"run `command` on every file in the argument list (e.g. `:argdo %s/foo/bar/ge | update`)",solution:[":argdo command"],id:"5c4e0f94deca",level:6},{category:"Split window",question:"split window horizontally",solution:["ctrl-ws"],id:"3d9c187d7fa8",level:4},{category:"Split window",question:"split window vertically",solution:["ctrl-wv"],id:"72e5715206af",level:4},{category:"Split window",question:"switch windows (cycle)",solution:["ctrl-ww"],id:"eecb920ce667",level:4},{category:"Split window",question:"quit a window",solution:["ctrl-wq"],id:"da25c0440718",level:4},{category:"Split window",question:"rotate two windows (can not do it if the other one is splitted)",solution:["ctrl-wr"],id:"21a7c6c06ea2",level:5},{category:"Split window",question:"move cursor to the left window (vertical split)",solution:["ctrl-wh"],id:"57de3f620fd5",level:4},{category:"Split window",question:"move cursor to the right window (vertical split)",solution:["ctrl-wl"],id:"8cba53a610a5",level:4},{category:"Split window",question:"move cursor to the window below (horizontal split)",solution:["ctrl-wj"],id:"9a83c3d3c7ad",level:4},{category:"Split window",question:"move cursor to the window above (horizontal split)",solution:["ctrl-wk"],id:"b14526ae4242",level:4},{category:"Split window",question:"maximize current window vertically",solution:["ctrl-w_"],id:"a4aab5d46b56",level:5},{category:"Split window",question:"maximize current window horizontally",solution:["ctrl-w|"],id:"5e3f16ab60a6",level:5},{category:"Split window",question:"make all equal size vertically",solution:["ctrl-w="],id:"25499ad00214",level:5},{category:"Split window",question:"horizontally resize by `+/-num` of lines or columns",solution:[":res +/-num","numctrl-w+/-"],id:"ca87f8e8e726",level:6},{category:"Split window",question:"vertically resize by `+/-num` of lines or columns",solution:[":vert res +/-num","numctrl-w</>"],id:"9f0b8c2abe8c",level:6},{category:"Tabs",question:"open a `file` in a new tab",solution:[":tabe file",":tabnew",":tabnew file"],id:"11d65645ee79",level:4},{category:"Tabs",question:"move the current split window into its own tab",solution:["ctrl-wT"],id:"4ab4eebea846",level:5},{category:"Tabs",question:"move to the next tab",solution:["gt",":tabnext",":tabn"],id:"c150136f4667",level:4},{category:"Tabs",question:"move to the previous tab",solution:["gT",":tabprev",":tabp"],id:"2bb7fde67a22",level:4},{category:"Tabs",question:"move to tab number `NUM`",solution:["NUMgt"],id:"b1ef50c07474",level:5},{category:"Tabs",question:"move current tab to the `NUM`th position (indexed from 0)",solution:[":tabm NUM",":tabmove NUM"],id:"81fa5294ae65",level:5},{category:"Tabs",question:"close the current tab and all its windows",solution:[":tabc",":tabclose"],id:"a2ea378a808c",level:4},{category:"Tabs",question:"close all tabs except for the current one",solution:[":tabo",":tabonly"],id:"732028fd6e33",level:5},{category:"Tabs",question:"run the `command` on all tabs (e.g. `command` = q - closes all opened tabs)",solution:[":tabdo command"],id:"ccfa4951cafd",level:6},{category:"Extra",question:"in insert mode opens up autocomplete",solution:["ctrl-n"],id:"22bdd1bf617d",level:3},{category:"Extra",question:"show line info",solution:["ctrl-g"],id:"e152319ebcbc",level:4},{category:"Extra",question:"in insert mode after this key combo, you can use a command from normal mode, and immediately switch back to the starting mode",solution:["ctrl-o"],id:"77759ca1f905",level:5},{category:"Extra",question:"open terminal as a horizontal split buffer.",solution:[":term"],id:"4e4b22ec2977",level:5},{category:"Open vim specially",question:"open multiple files (`file1` `file2`) as buffer",solution:["vim file1 file2"],id:"8493cdd351c7",level:3},{category:"Open vim specially",question:"open multiple files (`file1` `file2`) as tabs",solution:["vim -p file1 file2"],id:"76674f179bd7",level:4},{category:"Open vim specially",question:"open multiple files (`file1` `file2`) as horizontal split",solution:["vim -o file1 file2"],id:"6679c9836abf",level:4},{category:"Open vim specially",question:"open multiple files (`file1` `file2`) as vertical split",solution:["vim -O file1 file2"],id:"6c5cd5956e70",level:4},{category:"Open vim specially",question:"open `file` at linenumber `number`",solution:["vim file +number"],id:"8f21f70d6f8f",level:4},{category:"Vim sessions",question:"Your current session of open tabs will be stored in a file `workproject.vim`",solution:[":mks workproject.vim",":mksession workproject.vim"],id:"f8e292921304",level:6},{category:"Vim sessions",question:"load up vim with a session called `workproject.vim`",solution:["vim -S workproject.vim"],id:"117db5434154",level:6},{category:"Vim sessions",question:"load vim session to an opened vim called `workproject.vim`",solution:[":source workproject.vim"],id:"8aae52d606e4",level:6},{category:"Vim sessions",question:"save changed session tabs while you are in the session called `workproject.vim`",solution:[":mks! workproject.vim"],id:"faca3fe0667b",level:7},{category:"Command line history",question:"show prev commands. Close with Ctrl+c",solution:["q:"],id:"21680837e78a",level:5},{category:"Command line history",question:"show prev searches. Close with Ctrl+c",solution:["q/"],id:"37c169a57cd4",level:5},{category:"Command line history",question:"type in any word and press up. It will look for the prev command that started like that",solution:[":"],id:"ce794513cd84",level:4},{category:"Folding",question:"toggle fold under cursor",solution:["za"],id:"7ff66b348d9a",level:5},{category:"Folding",question:"open fold under cursor",solution:["zo"],id:"638adfe574d2",level:5},{category:"Folding",question:"close fold under cursor",solution:["zc"],id:"9150f33d3dd9",level:5},{category:"Folding",question:"open fold under cursor recursively (all nested folds)",solution:["zO"],id:"bc11a24048bf",level:6},{category:"Folding",question:"close fold under cursor recursively (all nested folds)",solution:["zC"],id:"041c3ea5d255",level:6},{category:"Folding",question:"open all folds in buffer",solution:["zR"],id:"b991d35532f4",level:5},{category:"Folding",question:"close all folds in buffer",solution:["zM"],id:"438f00718e79",level:5},{category:"Folding",question:"reduce fold level by one (open one level of folds)",solution:["zr"],id:"b149f4077af5",level:6},{category:"Folding",question:"increase fold level by one (close one more level of folds)",solution:["zm"],id:"d647aa98fa18",level:6},{category:"Folding",question:"jump to the start of the next fold",solution:["zj"],id:"5c4f90c682e6",level:6},{category:"Folding",question:"jump to the end of the previous fold",solution:["zk"],id:"870db22d8812",level:6},{category:"Folding",question:"visualize folds. show `NUM` lines of nested folds per line",solution:[":set foldcolumn=NUM"],id:"760430c95485",level:6},{category:"Folding",question:"fold the current paragraph",solution:["zfip"],id:"34cf02d318a1",level:6},{category:"Folding",question:"fold until next occurrance of `string`",solution:["zf/string"],id:"2f7b863e53a3",level:7},{category:"Folding",question:"delete fold under cursor",solution:["zd"],id:"39dc0cb2b5bf",level:6},{category:"Folding",question:"delete all folds in buffer",solution:["zE"],id:"7786249b1f77",level:6},{category:"Folding",question:"fold the next `20` lines",solution:["zf20j"],id:"2da7c9d167ef",level:7},{category:"Folding",question:"fold until wherever mark `a` is in the document",solution:["zf`a"],id:"c94046cb8c7f",level:7},{category:"Folding",question:"save folding state",solution:[":mkview"],id:"469a28d0cfdb",level:7},{category:"Folding",question:"load prev folding state",solution:[":loadview"],id:"4687a5f517d6",level:7},{category:"Tips and tricks",question:"wrap brackets around visually selected text (select text in visual mode first)",solution:["xi()<esc>P"],id:"0fa087877699",level:8},{category:"Tips and tricks",question:"search for visually selected text (select text in visual mode first)",solution:['y/ctrl-r"'],id:"52c1567eae8a",level:8},{category:"Tips and tricks",question:"show the diffs with `diff` command since last save. (It saves the output to stdin and loads the differences between the current filename and standard input)",solution:[":w !diff % -"],id:"a84f3c57d2cd",level:7},{category:"Tips and tricks",question:"run the previously recorded `o` macro on all lines that match `pattern`",solution:[":g/pattern/norm @o"],id:"d9c029025e8e",level:8},{category:"Spell checking",question:"enable spell checking",solution:[":set spell"],id:"dda33ed4a6b2",level:5},{category:"Spell checking",question:"disable spell checking",solution:[":set nospell"],id:"eb12030ef12e",level:5},{category:"Spell checking",question:"set spell language (e.g. `en`, `en_us`, `de`)",solution:[":set spelllang=en_us"],id:"514fe84103e0",level:5},{category:"Spell checking",question:"jump to next misspelled word",solution:["]s"],id:"137e3923ea0a",level:5},{category:"Spell checking",question:"jump to previous misspelled word",solution:["[s"],id:"aee58a142ac2",level:5},{category:"Spell checking",question:"show correction suggestions for word under cursor",solution:["z="],id:"a8c78cd39fb7",level:5},{category:"Spell checking",question:"add word under cursor to spell dictionary (good word)",solution:["zg"],id:"68b47586360b",level:6},{category:"Spell checking",question:"mark word under cursor as misspelled (wrong word)",solution:["zw"],id:"064281a89dcf",level:6},{category:"Spell checking",question:"undo `zg`, `zw`",solution:["zug","zuw"],id:"bd5441ec7688",level:6}];function Nn(e){if(/\s/.test(e.trim())){const r=e.trim().split(/\s+/);if(r.every(s=>/^ctrl[-+]/i.test(s)||/^esc$/i.test(s)))return r.map(Nn).join("")}const t=/^ctrl[-+](.+)/i.exec(e);if(t){const r=t[1].toLowerCase();return r.length===1?`<C-${r}>`:`<C-${r[0]}>${r.slice(1)}`}if(/^esc$/i.test(e))return"<Esc>";const n=e.replace(/\s+\+\s+\S+.*$/,"");return n!==e?n:e}function hb(e){return e.key==="Escape"||e.ctrlKey&&!e.altKey&&!e.metaKey&&e.key==="["?"<Esc>":e.key==="Enter"?"<CR>":e.key==="Backspace"?"<BS>":e.key==="Tab"?"<C-i>":e.key==="Delete"?"<Del>":e.ctrlKey&&!e.altKey&&!e.metaKey&&(e.key.length===1||e.key==="]"||e.key==="^")?`<C-${e.key.toLowerCase()}>`:e.altKey&&!e.ctrlKey&&!e.metaKey&&e.key.length===1?`<M-${e.key}>`:e.key.length===1?e.key:""}const gb=kn,Wc=new Set,xb=/^[ai][wWbBspt"'`)([\]{}><]$/;function yb(){const e=new Set,t=new Set,n=new Set;for(const r of gb)for(const s of r.solution){if(!s)continue;const o=Nn(s);if(o.includes(" "))n.add(o);else{s!==o&&/\s+\+\s+\S+/.test(s)&&Wc.add(o),e.add(o);for(let i=1;i<=o.length;i++)t.add(o.slice(0,i));xb.test(o)&&n.add(o)}}return{solutions:e,prefixes:t,crossModeSolutions:n}}const{solutions:nr,prefixes:Dm,crossModeSolutions:vb}=yb(),Pm=(()=>{const e=new Set;for(const t of nr)for(const n of nr)if(n.length>t.length&&n.startsWith(t)){e.add(t);break}return e})();class tg{constructor(){vd(this,"buf","")}push(t){const n=this.buf+t;if(nr.has(n))return Pm.has(n)||Wc.has(n)?(this.buf=n,[]):(this.buf="",[n]);if(Dm.has(n))return this.buf=n,[];const r=this.buf;this.buf="";const s=[];return r&&nr.has(r)&&s.push(r),nr.has(t)?Pm.has(t)||Wc.has(t)?this.buf=t:s.push(t):Dm.has(t)&&(this.buf=t),s}reset(){const t=this.buf;return this.buf="",t&&nr.has(t)?t:null}}const bb=1.5,wb=.2;function ng(e,t){const n=e/t;return n<=.25?{multiplier:3,rating:"lightning"}:n<=.5?{multiplier:2,rating:"fast"}:n<=.75?{multiplier:1.5,rating:"good"}:{multiplier:1,rating:"completed"}}function Nb(e){return e>=12?3:e>=8?2.5:e>=5?2:e>=3?1.5:1}function kb(e,t,n,r=!1){const s=Math.round(e*t*n);return r?Math.max(1,Math.round(s*wb)):s}function rg(e){return 100+e*50}function Sb(e,t,n="general",r=1){const o=Math.max(0,t-e)*500,i=Math.max(3e3,1e4-o);return Math.round(i*(n==="survival"?bb:1)*r)}const jb=.75;function Cb(e,t,n,r){return e>=9?9:rd(e,t,n,r)>=jb?Math.min(9,e+1):e}function rd(e,t,n,r){const s=n.filter(i=>i.level===e);return s.length===0?1:s.filter(i=>{var a,c;return(((c=(a=t[e])==null?void 0:a.completionCounts)==null?void 0:c.get(i.id))??0)>=r}).length/s.length}function Eb(e,t){return t>0||e===0?0:Math.random()<.4?e:Math.floor(Math.random()*e)}function ld(e){return e<=1?3:e<=4?2:1}function Tb(e,t){return t>=4?!1:e>0&&e%10===0}function Mb(e,t,n,r){if(r)return!1;switch(e){case"none":return!1;case"all":return!0;case"first_only":return t===0;case"alternating":return t%2===0;case"after_failure":return n;case"first_then_failure":return t===0||n;default:return!1}}function _b(e,t,n,r){if(n.length>0){const s=n[0],o=e.find(i=>i.id===s&&!t.has(i.id));if(o)return{cmd:o,nextDrillIndex:r}}if(e.length===0)return{cmd:null,nextDrillIndex:r};for(let s=0;s<e.length;s++){const o=(r+s)%e.length,i=e[o];if(!t.has(i.id))return{cmd:i,nextDrillIndex:(o+1)%e.length}}return{cmd:null,nextDrillIndex:r}}function Rb(e,t,n,r,s,o){if(o.length>0){const p=o[0],m=e.find(h=>h.id===p&&!n.has(h.id));if(m)return m}const i=e.filter(p=>!n.has(p.id)),a=p=>{var m,h;return((h=(m=r[p.level])==null?void 0:m.completionCounts)==null?void 0:h.get(p.id))??0},c=i.filter(p=>p.level===t),u=c.filter(p=>a(p)<s);if(u.length>0){const p=Math.min(...u.map(a)),m=u.filter(h=>a(h)===p);return m[Math.floor(Math.random()*m.length)]}if(c.length>0)return c[Math.floor(Math.random()*c.length)];const d=i.filter(p=>a(p)<s);if(d.length>0){const p=Math.min(...d.map(a)),m=d.filter(h=>a(h)===p);return m[Math.floor(Math.random()*m.length)]}return i.length>0?i[Math.floor(Math.random()*i.length)]:null}function Do(e,t,n,r){return{id:crypto.randomUUID(),type:e,text:t,points:r,expiresAt:n+2500}}function ui(){return{seen:new Set,completionCounts:new Map,failureCounts:new Map}}function lg(e){const t={};for(const[n,r]of Object.entries(e))t[Number(n)]={seen:new Set(r.seen),completionCounts:new Map(r.completionCounts),failureCounts:new Map(r.failureCounts)};return t}function pl(e,t){const n=Math.min(e.startingLevel,9),r=t.length>0?Math.max(...t.map(o=>o.level)):9,s={};for(let o=0;o<=r;o++)s[o]=ui();return{status:ld(e.startingLevel)>0?"warmup":"playing",config:e,liveSettings:{guidedMode:e.guidedMode},language:e.language,startingLevel:e.startingLevel,activeChallenges:[],maxConcurrent:1,ceiling:n,score:0,combo:{count:0,multiplier:1},levelProgress:s,sessionStats:{totalChallenges:0,completed:0,failed:0,totalPoints:0,bestCombo:0,startedAt:Date.now(),expectedTimeMs:0,achievedTimeMs:0},recentNotifications:[],levelPct:0,sessionElapsedMs:0,pendingVerifications:[],drillIndex:0}}function Lb(e,t,n,r,s,o,i,a=1){var m,h,g,v,w,x;const c=Sb(e.level,t,n,a),u=((h=(m=s[e.level])==null?void 0:m.seen)!=null&&h.has(e.id)?1:0)+(((v=(g=s[e.level])==null?void 0:g.completionCounts)==null?void 0:v.get(e.id))??0),d=(((x=(w=s[e.level])==null?void 0:w.failureCounts)==null?void 0:x.get(e.id))??0)>0,p=Mb(r,u,d,o);return{id:crypto.randomUUID(),commandId:e.id,level:e.level,category:e.category,question:e.question,solution:e.solution,startedAt:i,timeLimit:c,status:"active",pointsEarned:0,showSolution:p,isVerification:o}}function Ib(e,t){return{...e,liveSettings:{...e.liveSettings,...t}}}function zi(e,t,n,r){const s=e.activeChallenges.findIndex(D=>D.status==="active"&&D.solution.some(M=>Nn(M)===t));if(s===-1)return e;const o=e.activeChallenges[s],i=r-o.startedAt,{multiplier:a,rating:c}=ng(i,o.timeLimit),u=e.combo.count+1,d=Nb(u),p=rg(o.level),m=kb(p,a,d,o.showSolution),h=lg(e.levelProgress);h[o.level]||(h[o.level]=ui());const g=h[o.level];g.seen.add(o.commandId),g.completionCounts.set(o.commandId,(g.completionCounts.get(o.commandId)??0)+1);const v=Cb(e.ceiling,h,n,e.config.repetitionTarget),w=v>e.ceiling,x=e.activeChallenges.map((D,M)=>M===s?{...D,status:"completed",pointsEarned:m,doneAt:r}:D),b=[...e.recentNotifications.filter(D=>D.expiresAt>r),Do(c,`+${m}`,r,m)];u>=3&&b.push(Do("combo",`${u}x COMBO!`,r)),w&&b.push(Do("levelup",`Level ${v}!`,r));const k=e.sessionStats.completed+1;let N=[...e.pendingVerifications];o.showSolution&&(e.liveSettings.guidedMode==="first_only"||e.liveSettings.guidedMode==="first_then_failure")&&!o.isVerification&&N.push(o.commandId);const E=rd(v,h,n,e.config.repetitionTarget)*100,j=ld(e.startingLevel),C=e.status==="warmup"&&k>=j?"playing":e.status;return{...e,activeChallenges:x,score:e.score+m,ceiling:v,combo:{count:u,multiplier:d},levelProgress:h,maxConcurrent:Tb(k,e.maxConcurrent)?e.maxConcurrent+1:e.maxConcurrent,sessionStats:{...e.sessionStats,completed:k,totalChallenges:e.sessionStats.totalChallenges+1,totalPoints:e.sessionStats.totalPoints+m,bestCombo:Math.max(e.sessionStats.bestCombo,u)},recentNotifications:b,status:C,levelPct:E,pendingVerifications:N}}function qi(e,t,n){if(e.status==="setup"||e.status==="results"||e.status==="paused")return e;const r=n-e.sessionStats.startedAt;if(e.config.mode==="timed_challenge"&&e.config.timedDurationMs&&r>=e.config.timedDurationMs)return{...e,status:"results",sessionElapsedMs:r};const o=[...e.recentNotifications.filter(C=>C.expiresAt>n)],i=e.config.dynamicAssist!==null?e.config.mode==="survival"?Math.min(100,e.config.dynamicAssist):e.config.dynamicAssist:null,a=i!==null?e.activeChallenges.map(C=>C.status==="active"&&!C.showSolution&&n-C.startedAt>=C.timeLimit*(i/100)?{...C,showSolution:!0}:C):e.activeChallenges;let c=lg(e.levelProgress),u=0;const d=a.map(C=>C.status==="active"&&n-C.startedAt>C.timeLimit?(u++,{...C,status:"failed",doneAt:n}):C);let p=e.combo,m=e.sessionStats;if(u>0){p={count:0,multiplier:1},m={...m,failed:m.failed+u,totalChallenges:m.totalChallenges+u},o.push(Do("failed","Time up!",n));for(const C of d)if(C.status==="failed"){c[C.level]||(c[C.level]=ui());const D=c[C.level];D.failureCounts.set(C.commandId,(D.failureCounts.get(C.commandId)??0)+1)}if(e.config.mode==="survival")return{...e,activeChallenges:d,combo:p,levelProgress:c,sessionStats:{...m,achievedTimeMs:r},recentNotifications:o,status:"results",sessionElapsedMs:r}}const h=600,g=d.filter(C=>C.status==="active"?!0:n-(C.doneAt??n)<h);let v=e.ceiling;const w=ld(e.startingLevel),x=e.status==="warmup"?Math.max(0,w-m.completed):0;let y=e.status==="warmup"&&x<=0?"playing":e.status;const b=g.filter(C=>C.status==="active"),k=e.maxConcurrent-b.length,N=[];let E=0;if(k>0&&t.length>0){let C=[...e.pendingVerifications],D=e.drillIndex;for(let M=0;M<k;M++){const Y=new Set([...b.map(O=>O.commandId),...N.map(O=>O.commandId)]);let B;const I=C.length>0;if(e.config.drillMode){const O=_b(t,Y,C,D);B=O.cmd,B&&!I&&(D=O.nextDrillIndex)}else{const O=x-M,V=Eb(v,O);B=Rb(t,V,Y,c,e.config.repetitionTarget,C)}if(B){I&&C[0]===B.id&&(C=C.slice(1));const O=Lb(B,v,e.config.mode,e.liveSettings.guidedMode,c,I,n,e.config.commandTimeMultiplier??1);N.push(O),E+=O.timeLimit,c[B.level]||(c[B.level]=ui()),c[B.level].seen.add(B.id)}else I&&(C=C.slice(1))}e={...e,pendingVerifications:C,drillIndex:D}}const j=rd(v,c,t,e.config.repetitionTarget)*100;return{...e,status:y,activeChallenges:[...g,...N],combo:p,ceiling:v,levelProgress:c,sessionStats:{...m,expectedTimeMs:m.expectedTimeMs+E},recentNotifications:o,levelPct:j,sessionElapsedMs:r}}const X={HIGH_SCORES:"vimarcade_high_scores",LAST_CONFIG:"vimarcade_last_config",LAST_GOAL_CONFIG:"vimarcade_last_goal_config",LAST_MOTION_CONFIG:"vimarcade_last_motion_config",SKIP_UNSUPPORTED:"vimarcade_skip_unsupported",UNSUPPORTED:"vimarcade_unsupported",DEFAULTS_VERSION:"vimarcade_defaults_version",USERNAME:"vimarcade_username",CUSTOM_VG_CHALLENGES:"vimarcade_custom_vgchallenges",EXCLUDED_VG_CHALLENGES:"vimarcade_excluded_vgchallenges",KNOWN_ITEMS:"knownItems",CATEGORY_PRESETS:"vimarcade_category_presets",VIMGOLF_SCORES:"vimarcade_vimgolf_scores",VIMGOLF_RECORDS:"vimarcade_vimgolf_records",LAST_QVIMX_CONFIG:"vimarcade_last_qvimx_config",LAST_VIMTUTOR_CONFIG:"vimarcade_last_vimtutor_config",LAST_VIMBOTS_CONFIG:"vimarcade_last_vimbots_config",LAST_VIMGOLF_HANDICAPS:"vimarcade_last_vimgolf_handicaps"},Ob=[["vim_arcade_high_scores",X.HIGH_SCORES],["vim_arcade_last_config",X.LAST_CONFIG],["vim_arcade_skip_unsupported",X.SKIP_UNSUPPORTED],["vim_arcade_unsupported",X.UNSUPPORTED],["vim_arcade_defaults_version",X.DEFAULTS_VERSION],["vim_arcade_username",X.USERNAME],["vim_arcade_custom_vgchallenges",X.CUSTOM_VG_CHALLENGES],["vim_arcade_category_presets",X.CATEGORY_PRESETS],["vim_arcade_vimgolf_scores",X.VIMGOLF_SCORES]];function Ab(){try{for(const[e,t]of Ob){if(localStorage.getItem(t)!==null)continue;const n=localStorage.getItem(e);n!==null&&(localStorage.setItem(t,n),localStorage.removeItem(e))}}catch{}}function Vi(e){try{const t=localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}}function sd(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch{}}const Fm="vim-user";function Ui(){try{const e=localStorage.getItem(X.USERNAME);return e&&/^[a-zA-Z0-9]{2,20}$/.test(e)?e:Fm}catch{return Fm}}function Db(e){if(/^[a-zA-Z0-9]{2,20}$/.test(e))try{localStorage.setItem(X.USERNAME,e)}catch{}}const od=10;function Kc(){return{general:[],timed_challenge:[],survival:[],motionrace_timed:[],motionrace_survival:[],motionrace_total_goals:[],goal:[],vimbots:[]}}function As(){try{const e=localStorage.getItem(X.HIGH_SCORES);if(!e)return Kc();const t=JSON.parse(e);return{general:t.general??[],timed_challenge:t.timed_challenge??[],survival:t.survival??[],motionrace_timed:t.motionrace_timed??[],motionrace_survival:t.motionrace_survival??[],motionrace_total_goals:t.motionrace_total_goals??[],goal:t.goal??[],vimbots:t.vimbots??[]}}catch{return Kc()}}function Bi(e){try{localStorage.setItem(X.HIGH_SCORES,JSON.stringify(e))}catch{}}function Pb(e,t,n){if(e==="survival"){const r=n.achievedTimeMs-t.achievedTimeMs;return r!==0?r:n.score-t.score}return n.score-t.score}function Fb(e,t){const n=[...e[t.mode]??[],t].sort((r,s)=>Pb(t.mode,r,s)).slice(0,od);return{...e,[t.mode]:n}}function $b(e){const t=e.sessionStats,n=t.totalChallenges>0?t.completed/t.totalChallenges:0;return{id:crypto.randomUUID(),username:Ui(),timestamp:Date.now(),score:e.score,mode:e.config.mode,language:e.config.language,startingLevel:e.config.startingLevel,repetitionTarget:e.config.repetitionTarget,guidedMode:e.liveSettings.guidedMode,challengesCompleted:t.completed,challengesFailed:t.failed,accuracy:n,sessionDurationMs:e.sessionElapsedMs,expectedTimeMs:t.expectedTimeMs,achievedTimeMs:t.achievedTimeMs}}function Gb(e,t){const n=`motionrace_${t.endGoal}`,r=[...e[n]??[],t];return r.sort((s,o)=>{if(t.endGoal==="survival"){const i=o.sessionDurationMs-s.sessionDurationMs;return i!==0?i:o.score-s.score}if(t.endGoal==="total_goals"){const i=s.sessionDurationMs-o.sessionDurationMs;return i!==0?i:o.score-s.score}return o.score-s.score}),{...e,[n]:r.slice(0,od)}}function zb(e,t){const n=[...e.goal??[],t];return n.sort((r,s)=>s.totalPoints-r.totalPoints),{...e,goal:n.slice(0,od)}}function qb(e,t){const n=[...e.vimbots??[],t];return n.sort((r,s)=>s.totalScore-r.totalScore||s.levelsCleared-r.levelsCleared),{...e,vimbots:n.slice(0,10)}}function Dr(){try{const e=localStorage.getItem(X.KNOWN_ITEMS);return new Set(e?JSON.parse(e):[])}catch{return new Set}}function sg(e){try{localStorage.setItem(X.KNOWN_ITEMS,JSON.stringify([...e]))}catch{}}function Vb(e){const t=Dr();for(const n of e)t.add(n);sg(t)}function Ub(e){const t=Dr();t.has(e)?t.delete(e):t.add(e),sg(t)}function Bb(e,t){const n=e+t;return n>=3&&e/n>=.6}function id(){try{const e=localStorage.getItem(X.CATEGORY_PRESETS);return e?JSON.parse(e):[]}catch{return[]}}function og(e){try{localStorage.setItem(X.CATEGORY_PRESETS,JSON.stringify(e))}catch{}}function Hb(e,t){const n=id().filter(r=>r.name!==e);return n.push({name:e,categories:t}),og(n),n}function Wb(e){const t=id().filter(n=>n.name!==e);return og(t),t}function nn(){try{const e=localStorage.getItem(X.UNSUPPORTED);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function Hi(e){try{localStorage.setItem(X.UNSUPPORTED,JSON.stringify([...e]))}catch{}}function ls(e){const t=nn();t.add(e),Hi(t)}function $m(e){const t=nn();t.delete(e),Hi(t)}async function Kb(){try{const e=await fetch("/learn-vim/arcade/unsupported-defaults.json");if(!e.ok)return;const{version:t,unsupported:n}=await e.json();if(localStorage.getItem(X.DEFAULTS_VERSION)===t)return;const s=nn();let o=!1;for(const i of n)s.has(i)||(s.add(i),o=!0);o&&Hi(s),localStorage.setItem(X.DEFAULTS_VERSION,t)}catch{}}function Qb(e,t){const n=new URL(`data:application/json;charset=utf-8,${encodeURIComponent(e)}`),r=document.createElement("a");r.href=n.href,r.download=t,r.click()}const Pa=kn,Yb=100;function Xb(){try{const e=localStorage.getItem(X.LAST_CONFIG);if(!e)return null;const t=JSON.parse(e);return t.dynamicAssist=t.dynamicAssist??null,t.knowledgeFilter=t.knowledgeFilter??"all",t}catch{return null}}function Jb(e){try{localStorage.setItem(X.LAST_CONFIG,JSON.stringify(e))}catch{}}function Zb(e,t){const n=Dr(),r=new Map;for(const o of t)r.set(o.id,o);const s=[];for(const[o,i]of Object.entries(e.levelProgress)){const a=new Set([...i.completionCounts.keys(),...i.failureCounts.keys()]);for(const c of a){const u=r.get(c);if(!u)continue;const d=i.completionCounts.get(c)??0,p=i.failureCounts.get(c)??0;s.push({commandId:c,question:u.question,solution:u.solution,category:u.category,level:Number(o),completions:d,failures:p,suggestKnown:Bb(d,p),alreadyKnown:n.has(c)})}}return s.sort((o,i)=>{if(o.suggestKnown!==i.suggestKnown)return o.suggestKnown?-1:1;const a=o.completions/Math.max(1,o.completions+o.failures);return i.completions/Math.max(1,i.completions+i.failures)-a})}function ig(){return{status:"setup",config:{mode:"general",language:"typescript",startingLevel:0,repetitionTarget:1,guidedMode:"none",categories:null,dynamicAssist:null,skipUnsupported:!0,knowledgeFilter:"all"},liveSettings:{guidedMode:"none"},language:"typescript",startingLevel:0,activeChallenges:[],maxConcurrent:1,ceiling:0,score:0,combo:{count:0,multiplier:1},levelProgress:{},sessionStats:{totalChallenges:0,completed:0,failed:0,totalPoints:0,bestCombo:0,startedAt:0,expectedTimeMs:0,achievedTimeMs:0},recentNotifications:[],levelPct:0,sessionElapsedMs:0,pendingVerifications:[],drillIndex:0}}function e1(e,t){switch(t.type){case"SET_GAME_STATE":return{...e,gameState:t.value};case"SET_GAME_STATE_FN":return{...e,gameState:t.fn(e.gameState)};case"SET_HIGH_SCORES":return{...e,highScores:t.value};case"SET_HIGH_SCORES_FN":return{...e,highScores:t.fn(e.highScores)};case"SET_REVIEW_ITEMS":return{...e,reviewItems:t.value};case"SET_SHOWING_HIGH_SCORES":return{...e,showingHighScores:t.value};default:return e}}function t1(){return{gameState:ig(),highScores:As(),reviewItems:[],showingHighScores:!1}}function n1(){const[e,t]=f.useReducer(e1,void 0,t1),[n]=f.useState(Xb),r=f.useRef(null),s=f.useRef(Pa),o=f.useCallback(()=>{r.current&&(clearInterval(r.current),r.current=null)},[]),i=f.useCallback(()=>{o(),r.current=setInterval(()=>{t({type:"SET_GAME_STATE_FN",fn:m=>qi(m,s.current,Date.now())})},Yb)},[o]);f.useEffect(()=>()=>o(),[o]),f.useEffect(()=>{if(e.gameState.status!=="results")return;o(),t({type:"SET_REVIEW_ITEMS",value:Zb(e.gameState,s.current)});const m=$b(e.gameState);t({type:"SET_HIGH_SCORES_FN",fn:h=>{const g=Fb(h,m);return Bi(g),g}})},[e.gameState.status]);const a=f.useCallback(m=>{if(Jb(m),s.current=m.categories?Pa.filter(g=>m.categories.includes(g.category)):Pa,m.skipUnsupported){const g=nn();s.current=s.current.filter(v=>!g.has(v.id))}if(m.knowledgeFilter!=="all"){const g=Dr();m.knowledgeFilter==="known"?s.current=s.current.filter(v=>g.has(v.id)):s.current=s.current.filter(v=>!g.has(v.id))}t({type:"SET_REVIEW_ITEMS",value:[]});const h=pl(m,s.current);t({type:"SET_GAME_STATE",value:h}),i()},[i]),c=f.useCallback(m=>{t({type:"SET_GAME_STATE_FN",fn:h=>zi(h,m,s.current,Date.now())})},[]),u=f.useCallback(()=>{o(),t({type:"SET_REVIEW_ITEMS",value:[]}),t({type:"SET_GAME_STATE",value:ig()})},[o]),d=f.useCallback(m=>{t({type:"SET_GAME_STATE_FN",fn:h=>Ib(h,m)})},[]),p=f.useCallback(m=>{ls(m),t({type:"SET_GAME_STATE_FN",fn:h=>({...h,activeChallenges:h.activeChallenges.map(g=>g.commandId===m?{...g,status:"failed"}:g)})})},[]);return{state:e.gameState,lastConfig:n,reviewItems:e.reviewItems,startGame:a,onCommandExecuted:c,resetGame:u,updateSettings:d,highScores:e.highScores,showingHighScores:e.showingHighScores,openHighScores:()=>t({type:"SET_SHOWING_HIGH_SCORES",value:!0}),closeHighScores:()=>t({type:"SET_SHOWING_HIGH_SCORES",value:!1}),markChallengeUnsupported:p}}const r1=kn,an=[...new Set(r1.map(e=>e.category))].sort();function Wi(e){const t=an.length,n=an.indexOf(e);return t===0||n===-1?"hsl(0, 0%, 50%)":`hsl(${Math.round(n/t*360)}, 70%, 52%)`}const Gm=["Cursor movement","Editing","Insert mode, inserting/appending text","Cut and paste","Search and replace","Text objects"],ad=an.length>0?an.filter(e=>Gm.includes(e)):Gm,hl=3;function ag({selected:e,onChange:t}){const[n,r]=f.useState(id),[s,o]=f.useState(""),[i,a]=f.useState(!1),c=new Set(e),u=e.length===an.length,d=e.length<hl;function p(v){c.has(v)?t(e.filter(w=>w!==v)):t([...e,v])}function m(v){t(v)}function h(){if(!s.trim()||e.length===0)return;const v=Hb(s.trim(),[...e]);r(v),o(""),a(!1)}function g(v){const w=Wb(v);r(w)}return an.length===0?l.jsx("p",{className:"text-gray-600 font-mono text-xs italic",children:"No categories yet — generate data.json first."}):l.jsxs("div",{className:"space-y-3",children:[l.jsxs("div",{className:"flex flex-wrap gap-2 items-center",children:[l.jsx("button",{onClick:()=>t([...an]),className:`px-3 py-1 rounded font-mono text-xs border transition-all ${u?"bg-gray-600 border-gray-500 text-white":"bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400"}`,children:"All"}),l.jsx("button",{onClick:()=>t([]),className:"px-3 py-1 rounded font-mono text-xs border border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400 transition-all",children:"None"}),l.jsx("button",{onClick:()=>t([...ad]),className:"px-3 py-1 rounded font-mono text-xs border border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400 transition-all",children:"Defaults"}),l.jsx("span",{className:"text-gray-700 font-mono text-xs",children:"·"}),n.map(v=>l.jsxs("div",{className:"flex items-center gap-0.5",children:[l.jsx("button",{onClick:()=>m(v.categories),className:"px-3 py-1 rounded-l font-mono text-xs border border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-400 hover:text-white transition-all",children:v.name}),l.jsx("button",{onClick:()=>g(v.name),className:"px-1.5 py-1 rounded-r font-mono text-xs border border-l-0 border-gray-600 bg-gray-800 text-gray-600 hover:text-red-400 hover:border-red-700 transition-all focus-visible:ring-2 focus-visible:ring-red-500",title:`Delete preset "${v.name}"`,"aria-label":`Delete preset "${v.name}"`,children:"×"})]},v.name)),i?l.jsxs("div",{className:"flex items-center gap-1",children:[l.jsx("input",{autoFocus:!0,value:s,onChange:v=>o(v.target.value),onKeyDown:v=>{v.key==="Enter"&&h(),v.key==="Escape"&&(a(!1),o(""))},placeholder:"Preset name…",className:"px-2 py-1 rounded font-mono text-xs bg-gray-700 border border-gray-500 text-white placeholder-gray-500 w-32 focus:outline-none focus:border-green-500"}),l.jsx("button",{onClick:h,className:"px-2 py-1 rounded font-mono text-xs border border-green-700 bg-green-900/30 text-green-400 hover:bg-green-900/60 transition-all",children:"Save"}),l.jsx("button",{onClick:()=>{a(!1),o("")},className:"px-2 py-1 rounded font-mono text-xs border border-gray-600 text-gray-500 hover:text-gray-300 transition-all",children:"Cancel"})]}):l.jsx("button",{onClick:()=>a(!0),className:"px-3 py-1 rounded font-mono text-xs border border-dashed border-gray-600 text-gray-500 hover:border-gray-400 hover:text-gray-300 transition-all",title:"Save current selection as a preset",children:"+ Save preset"})]}),l.jsx("div",{className:"flex flex-wrap gap-2",children:an.map(v=>{const w=c.has(v),x=Wi(v);return l.jsxs("button",{onClick:()=>p(v),style:w?{borderColor:x,backgroundColor:`${x}28`,color:x}:{borderColor:"#374151",color:"#6b7280"},className:"px-3 py-1.5 rounded-lg border font-mono text-xs transition-all hover:opacity-90 flex items-center gap-1.5",children:[l.jsx("span",{style:{backgroundColor:w?x:"#4b5563"},className:"inline-block w-2 h-2 rounded-full flex-shrink-0"}),v]},v)})}),d&&l.jsxs("p",{className:"text-yellow-500 font-mono text-xs",children:["Select at least ",hl," categories to start",e.length>0?` (${e.length} selected)`:"","."]}),!d&&l.jsx("p",{className:"text-gray-600 font-mono text-xs",children:e.length===an.length?"All categories selected":`${e.length} of ${an.length} categories`})]})}/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cg=(...e)=>e.filter((t,n,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l1=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s1=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,n,r)=>r?r.toUpperCase():n.toLowerCase());/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zm=e=>{const t=s1(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Fa={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o1=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1},i1=f.createContext({}),a1=()=>f.useContext(i1),ug=f.forwardRef(({color:e,size:t,strokeWidth:n,absoluteStrokeWidth:r,className:s="",children:o,iconNode:i,...a},c)=>{const{size:u=24,strokeWidth:d=2,absoluteStrokeWidth:p=!1,color:m="currentColor",className:h=""}=a1()??{},g=r??p?Number(n??d)*24/Number(t??u):n??d;return f.createElement("svg",{ref:c,...Fa,width:t??u??Fa.width,height:t??u??Fa.height,stroke:e??m,strokeWidth:g,className:cg("lucide",h,s),...!o&&!o1(a)&&{"aria-hidden":"true"},...a},[...i.map(([v,w])=>f.createElement(v,w)),...Array.isArray(o)?o:[o]])});/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=(e,t)=>{const n=f.forwardRef(({className:r,...s},o)=>f.createElement(ug,{ref:o,iconNode:t,className:cg(`lucide-${l1(zm(e))}`,`lucide-${e}`,r),...s}));return n.displayName=zm(e),n};/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c1=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],Ds=le("arrow-left",c1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M4.929 4.929 19.07 19.071",key:"196cmz"}]],Hl=le("ban",u1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d1=[["path",{d:"M10 2v8l3-3 3 3V2",key:"sqw3rj"}],["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],m1=le("book-marked",d1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f1=[["path",{d:"M12 5v16",key:"1f6ucr"}],["path",{d:"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",key:"1fyvmf"}]],cd=le("book-open",f1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p1=[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]],Ps=le("bot",p1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h1=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],di=le("check",h1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g1=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],x1=le("chevron-right",g1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],Qc=le("circle-alert",y1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v1=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],mi=le("circle-check-big",v1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],qm=le("circle-check",b1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],N1=le("circle-question-mark",w1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],S1=le("circle-x",k1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],dg=le("circle",j1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C1=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],Vm=le("cpu",C1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]],T1=le("crosshair",E1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M1=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],ud=le("download",M1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _1=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],Yc=le("eye-off",_1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R1=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],mg=le("eye",R1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L1=[["path",{d:"M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z",key:"b19h5q"}],["path",{d:"M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z",key:"h7h5ge"}]],I1=le("fast-forward",L1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O1=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]],Um=le("file-braces",O1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A1=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 12.5 8 15l2 2.5",key:"1tg20x"}],["path",{d:"m14 12.5 2 2.5-2 2.5",key:"yinavb"}]],D1=le("file-code",A1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P1=[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",key:"1slcih"}]],fg=le("flame",P1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F1=[["path",{d:"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z",key:"1dudjm"}],["path",{d:"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z",key:"l2t8xc"}],["path",{d:"M16 17h4",key:"1dejxt"}],["path",{d:"M4 13h4",key:"1bwh8b"}]],$1=le("footprints",F1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G1=[["line",{x1:"6",x2:"10",y1:"11",y2:"11",key:"1gktln"}],["line",{x1:"8",x2:"8",y1:"9",y2:"13",key:"qnk9ow"}],["line",{x1:"15",x2:"15.01",y1:"12",y2:"12",key:"krot7o"}],["line",{x1:"18",x2:"18.01",y1:"10",y2:"10",key:"1lcuu1"}],["path",{d:"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",key:"mfqc10"}]],pg=le("gamepad-2",G1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z1=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],xr=le("globe",z1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q1=[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]],Ki=le("hash",q1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V1=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],hg=le("heart",V1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U1=[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]],B1=le("key-round",U1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H1=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],gg=le("layers",H1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W1=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]],dd=le("layout-grid",W1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K1=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]],Q1=le("link",K1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y1=[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]],X1=le("list",Y1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J1=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],Wl=le("map",J1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z1=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],fi=le("maximize-2",Z1);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ew=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],tw=le("pause",ew);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nw=[["path",{d:"M13 21h8",key:"1jsn5i"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],rw=le("pen-line",nw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lw=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],sw=le("pencil",lw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ow=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],iw=le("plus",ow);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aw=[["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}],["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",key:"u4xsad"}],["path",{d:"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",key:"676m9"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",key:"92ym6u"}]],cw=le("rocket",aw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uw=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],pi=le("rotate-ccw",uw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dw=[["path",{d:"M14 17H5",key:"gfn3mx"}],["path",{d:"M19 7h-9",key:"6i9tg"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]],mw=le("settings-2",dw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fw=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],pw=le("settings",fw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hw=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],Fs=le("shield",hw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gw=[["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",key:"1ailkh"}],["path",{d:"M2 6h1.972a4 4 0 0 1 3.6 2.2",key:"km57vx"}],["path",{d:"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",key:"os18l9"}]],xw=le("shuffle",gw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yw=[["path",{d:"m12.5 17-.5-1-.5 1h1z",key:"3me087"}],["path",{d:"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",key:"1o5pge"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}]],$s=le("skull",yw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vw=[["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M12 21v-9",key:"17s77i"}],["path",{d:"M12 8V3",key:"13r4qs"}],["path",{d:"M17 16h4",key:"h1uq16"}],["path",{d:"M19 12V3",key:"o1uvq1"}],["path",{d:"M19 21v-5",key:"qua636"}],["path",{d:"M3 14h4",key:"bcjad9"}],["path",{d:"M5 10V3",key:"cb8scm"}],["path",{d:"M5 21v-7",key:"1w1uti"}]],bw=le("sliders-vertical",vw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ww=[["path",{d:"m10 20-1.25-2.5L6 18",key:"18frcb"}],["path",{d:"M10 4 8.75 6.5 6 6",key:"7mghy3"}],["path",{d:"m14 20 1.25-2.5L18 18",key:"1chtki"}],["path",{d:"m14 4 1.25 2.5L18 6",key:"1b4wsy"}],["path",{d:"m17 21-3-6h-4",key:"15hhxa"}],["path",{d:"m17 3-3 6 1.5 3",key:"11697g"}],["path",{d:"M2 12h6.5L10 9",key:"kv9z4n"}],["path",{d:"m20 10-1.5 2 1.5 2",key:"1swlpi"}],["path",{d:"M22 12h-6.5L14 15",key:"1mxi28"}],["path",{d:"m4 10 1.5 2L4 14",key:"k9enpj"}],["path",{d:"m7 21 3-6-1.5-3",key:"j8hb9u"}],["path",{d:"m7 3 3 6h4",key:"1otusx"}]],Nw=le("snowflake",ww);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kw=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],Sw=le("sparkles",kw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jw=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],Gr=le("star",jw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cw=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],Gs=le("target",Cw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ew=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],yr=le("timer",Ew);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tw=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],Mw=le("trash-2",Tw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _w=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],xg=le("trending-up",_w);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rw=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]],Qi=le("trophy",Rw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lw=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],yg=le("users",Lw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Iw=[["path",{d:"M2 12q2.5 2 5 0t5 0 5 0 5 0",key:"8ddzzs"}],["path",{d:"M2 19q2.5 2 5 0t5 0 5 0 5 0",key:"1wj4st"}],["path",{d:"M2 5q2.5 2 5 0t5 0 5 0 5 0",key:"69x50u"}]],$a=le("waves-horizontal",Iw);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ow=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],hi=le("x",Ow);/**
 * @license lucide-react v1.26.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Aw=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],Zt=le("zap",Aw),Dw=[{id:"go",label:"Go",abbr:"go",badgeCls:"text-teal-300   bg-teal-900/50   border border-teal-800"},{id:"rust",label:"Rust",abbr:"rs",badgeCls:"text-orange-300 bg-orange-900/50 border border-orange-800"},{id:"python",label:"Python",abbr:"py",badgeCls:"text-yellow-300 bg-yellow-900/50 border border-yellow-800"},{id:"typescript",label:"TypeScript",abbr:"ts",badgeCls:"text-blue-300   bg-blue-900/50   border border-blue-800"},{id:"c",label:"C",abbr:"c",badgeCls:"text-gray-300   bg-gray-700/50   border border-gray-600"},{id:"cpp",label:"C++",abbr:"c++",badgeCls:"text-purple-300 bg-purple-900/50 border border-purple-800"},{id:"lorem",label:"Lorem Ipsum",abbr:"txt",badgeCls:"text-pink-300   bg-pink-900/50   border border-pink-800"}],F={pill:e=>`px-4 py-2 rounded border text-sm font-mono transition-colors ${e?"bg-blue-700 border-blue-500 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`,lang:e=>`flex items-center px-3 py-2 rounded border text-xs font-mono transition-colors ${e?"bg-green-900/30 border-green-500 text-green-300 font-bold":"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`,modeCard:e=>`py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left w-full ${e?"bg-blue-700 border-blue-500 text-white":"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`};function qn({value:e,onChange:t}){return l.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:Dw.map(n=>l.jsxs("button",{onClick:()=>t(n.id),className:F.lang(e===n.id),children:[l.jsx("span",{className:`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${n.badgeCls}`,children:n.abbr}),l.jsx("span",{className:"ml-1.5 truncate",children:n.label})]},n.id))})}function W({label:e,icon:t,defaultOpen:n=!1,badge:r,children:s}){const[o,i]=f.useState(n);return l.jsxs("div",{className:"border-b border-gray-800 last:border-0",children:[l.jsxs("button",{type:"button",onClick:()=>i(a=>!a),className:"w-full flex items-center justify-between py-3 text-left group",children:[l.jsxs("span",{className:"flex items-center gap-1.5",children:[t&&l.jsx(t,{className:"w-3.5 h-3.5 text-gray-500 flex-shrink-0"}),l.jsx("span",{className:"text-xs font-mono uppercase tracking-wider text-gray-400 group-hover:text-gray-300 transition-colors",children:e})]}),l.jsxs("span",{className:"flex items-center gap-2 flex-shrink-0",children:[!o&&r&&l.jsx("span",{className:"text-xs text-gray-500",children:r}),l.jsx("span",{className:`text-gray-600 text-xs transition-transform duration-150 ${o?"rotate-90":""}`,children:"▶"})]})]}),o&&l.jsx("div",{className:"pb-4",children:s})]})}function kl({title:e,subtitle:t,children:n,actions:r}){return l.jsx("div",{className:"min-h-screen bg-gray-900 overflow-y-auto font-mono",children:l.jsxs("div",{className:"max-w-lg mx-auto py-10 px-5",children:[l.jsxs("div",{className:"text-center mb-8",children:[l.jsx("h1",{className:"text-3xl font-bold text-white mb-1",children:e}),l.jsx("p",{className:"text-gray-400 text-sm",children:t})]}),l.jsx("div",{className:"bg-gray-800/40 border border-gray-700 rounded-xl px-5 divide-y divide-gray-800",children:n}),l.jsx("div",{className:"mt-6",children:r})]})})}function vr({enabled:e,onToggle:t,children:n}){return l.jsxs(W,{label:"Challenge Mode",icon:Zt,defaultOpen:e,badge:e?l.jsx("span",{className:"text-green-400 font-bold text-[10px]",children:"ON"}):void 0,children:[l.jsxs("button",{type:"button",onClick:t,className:`w-full py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left mb-3 ${e?"bg-green-800 border-green-600 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"}`,children:[e?"✓ Enabled":"○ Disabled",l.jsx("span",{className:`text-xs font-normal ml-2 ${e?"text-green-300":"text-gray-600"}`,children:e?"Earning bonus points for completed challenges":"Enable to practice commands alongside navigation"})]}),e&&n&&l.jsx("div",{className:"space-y-3 pl-1 border-l border-gray-700",children:n})]})}const Pw=[{id:"none",label:"None",desc:"No hints — type from memory"},{id:"all",label:"Always",desc:"Solution always visible"},{id:"first_only",label:"First only",desc:"Show once, then test blindly"},{id:"after_failure",label:"After failure",desc:"Hint appears after a miss"},{id:"first_then_failure",label:"First + on failure",desc:"Show once, re-show after misses"},{id:"alternating",label:"Alternating",desc:"Show on every other occurrence"}],Fw=[{value:1,label:"1×",desc:"Each command once"},{value:2,label:"2×",desc:"Reinforce twice"},{value:3,label:"3×",desc:"Build muscle memory"},{value:5,label:"5×",desc:"Deep mastery"}];function Sl({onClick:e,disabled:t=!1,label:n="Start",disabledLabel:r}){return l.jsx("button",{type:"button",onClick:e,disabled:t,className:`w-full py-3.5 font-mono font-bold text-base rounded-xl uppercase tracking-wider transition-colors ${t?"bg-gray-700 text-gray-500 cursor-not-allowed":"bg-green-600 hover:bg-green-500 text-white"}`,children:t&&r?r:n})}function zs({onClick:e,summary:t}){return l.jsxs("button",{type:"button",onClick:e,className:"w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 font-mono text-sm rounded-xl border border-gray-700 transition-colors flex items-center justify-center gap-1.5",children:[l.jsx(pi,{className:"w-3.5 h-3.5 flex-shrink-0"}),l.jsxs("span",{className:"truncate",children:["Repeat last: ",t]})]})}const vg=[{value:1,label:"1×",desc:"Default pace"},{value:1.5,label:"1.5×",desc:"Slower"},{value:2,label:"2×",desc:"Relaxed"},{value:3,label:"3×",desc:"No rush"}];function gn({children:e}){return l.jsx("p",{className:"text-gray-500 text-[11px] font-mono uppercase tracking-wider mb-2",children:e})}function Vn({guidedMode:e,onGuidedMode:t,startingLevel:n,onStartingLevel:r,repetition:s,onRepetition:o,timeMultiplier:i,onTimeMultiplier:a,concurrent:c,onConcurrent:u,dynamicAssistEnabled:d,dynamicAssistPct:p,onDynamicAssistToggle:m,onDynamicAssistPct:h,knowledgeFilter:g,onKnowledgeFilter:v,solvedFilter:w,onSolvedFilter:x,selectableCategories:y,selectedCategories:b,onToggleCategory:k,drillMode:N,onDrillMode:E}){return l.jsxs("div",{className:"space-y-5 text-xs font-mono",children:[E!==void 0&&l.jsxs("div",{children:[l.jsx(gn,{children:"Command order"}),l.jsxs("div",{className:"flex gap-2 flex-wrap",children:[l.jsx("button",{type:"button",onClick:()=>E(!1),className:F.pill(N===!1||N===void 0),children:"Randomize"}),l.jsxs("button",{type:"button",onClick:()=>E(!0),className:F.pill(N===!0),children:["Drill",l.jsx("span",{className:"text-xs font-normal opacity-60 ml-1",children:"in order"})]})]})]}),l.jsxs("div",{children:[l.jsx(gn,{children:"Solution hints"}),l.jsx("div",{className:"space-y-1",children:Pw.map(j=>l.jsxs("button",{type:"button",onClick:()=>t(j.id),className:`w-full text-left px-3 py-1.5 rounded border transition-colors ${e===j.id?"bg-purple-900/40 border-purple-700 text-white font-bold":"bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600"}`,children:[l.jsx("span",{className:"text-white text-xs",children:j.label}),l.jsx("span",{className:"text-gray-500 ml-2",children:j.desc})]},j.id))})]}),l.jsxs("div",{children:[l.jsxs(gn,{children:["Starting level:"," ",l.jsx("span",{className:"text-yellow-400",children:n===0?"Beginner":`Lv ${n}`})]}),l.jsx("input",{type:"range",min:0,max:9,step:1,value:n,onChange:j=>r(Number(j.target.value)),className:"w-full accent-purple-500"}),l.jsxs("div",{className:"flex justify-between text-gray-600 mt-1",children:[l.jsx("span",{children:"Beginner"}),l.jsx("span",{children:"Expert"})]})]}),l.jsxs("div",{children:[l.jsx(gn,{children:"Repetitions per command"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:Fw.map(j=>l.jsxs("button",{type:"button",onClick:()=>o(j.value),className:F.pill(s===j.value),children:[j.label,l.jsx("span",{className:"text-xs font-normal opacity-60 ml-1",children:j.desc})]},j.value))})]}),l.jsxs("div",{children:[l.jsx(gn,{children:"Time per challenge"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:vg.map(j=>l.jsxs("button",{type:"button",onClick:()=>a(j.value),className:F.pill(i===j.value),children:[j.label,l.jsx("span",{className:"text-xs font-normal opacity-60 ml-1",children:j.desc})]},j.value))})]}),u!==void 0&&c!==void 0&&l.jsxs("div",{children:[l.jsxs(gn,{children:["Concurrent challenges: ",l.jsx("span",{className:"text-yellow-400",children:c})]}),l.jsx("input",{type:"range",min:1,max:10,step:1,value:c,onChange:j=>u(Number(j.target.value)),className:"w-full accent-purple-500"}),l.jsxs("div",{className:"flex justify-between text-gray-600 mt-1",children:[l.jsx("span",{children:"1"}),l.jsx("span",{children:"10"})]})]}),m!==void 0&&l.jsxs("div",{children:[l.jsx(gn,{children:"Dynamic assist"}),l.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[l.jsx("button",{type:"button",role:"switch","aria-checked":d,onClick:m,className:`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${d?"bg-orange-600":"bg-gray-700"}`,children:l.jsx("span",{className:`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${d?"translate-x-4":"translate-x-0.5"}`})}),l.jsx("span",{className:"text-gray-400",children:d?`Show hint after ${p??100}% of time`:"Off"})]}),d&&h!==void 0&&l.jsx("input",{type:"range",min:10,max:100,step:5,value:p??100,onChange:j=>h(Number(j.target.value)),className:"w-full accent-orange-500"})]}),v!==void 0&&g!==void 0&&l.jsxs("div",{children:[l.jsx(gn,{children:"Practice focus"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:["all","unknown","known"].map(j=>l.jsx("button",{type:"button",onClick:()=>v(j),className:F.pill(g===j),children:j==="all"?"All commands":j==="unknown"?"Unknown only":"Known only"},j))})]}),x!==void 0&&w!==void 0&&l.jsxs("div",{children:[l.jsx(gn,{children:"Focus"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[{id:"all",label:"All challenges"},{id:"unsolved",label:"Unsolved only"},{id:"solved",label:"Solved only"},{id:"mixed",label:"Mixed (70% new)"}].map(j=>l.jsx("button",{type:"button",onClick:()=>x(j.id),className:F.pill(w===j.id),children:j.label},j.id))})]}),y&&b&&k&&l.jsxs("div",{children:[l.jsxs(gn,{children:["Focus areas ",l.jsx("span",{className:"text-gray-600 normal-case",children:"(select at least one)"})]}),l.jsx("div",{className:"flex flex-wrap gap-2",children:y.map(j=>{const C=b.includes(j),D=C&&b.length===1,M=Wi(j);return l.jsx("button",{type:"button",onClick:()=>{D||k(j)},title:D?"At least one category required":void 0,style:C?{borderColor:M,color:M,backgroundColor:M.replace("52%)","18%)").replace("70%,","60%,")}:void 0,className:`px-3 py-1.5 rounded border text-xs font-mono transition-colors font-bold ${C?"":"bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"} ${D?"opacity-60 cursor-default":""}`,children:j},j)})})]})]})}function Pr(e,t){return{...e,...t.payload}}function md(e,t){return e.includes(t)?e.length>1?e.filter(n=>n!==t):e:[...e,t]}function qs({config:e,onPatch:t,extras:n}){const r=[{key:"snowEffect",icon:Nw,label:"Snow",desc:"Snowflakes overlay",value:e.snowEffect,onToggle:()=>t({snowEffect:!e.snowEffect})},{key:"opacityFade",icon:mg,label:"Opacity fade",desc:"Dims text far from cursor",value:e.opacityFade,onToggle:()=>t({opacityFade:!e.opacityFade})}],s=n?[...r,...n]:r,o=[e.snowEffect,e.opacityFade].filter(Boolean).length+((n==null?void 0:n.filter(i=>i.value).length)??0)+(e.hjklOnly?1:0)+(e.noHjkl?1:0);return l.jsx(W,{label:"Handicaps",icon:bw,defaultOpen:!1,badge:o>0?l.jsxs("span",{className:"bg-yellow-800 text-yellow-300 text-xs px-1.5 py-0.5 rounded font-bold",children:[o," active"]}):void 0,children:l.jsxs("div",{className:"space-y-2",children:[e.snowEffect&&l.jsx("p",{className:"text-xs text-yellow-400 bg-yellow-900/30 border border-yellow-700 rounded px-2 py-1.5",children:"Epilepsy warning: flashing / moving visuals enabled."}),l.jsx("div",{className:"grid grid-cols-2 gap-2",children:s.map(i=>{const a=i.value,c=i.activeClasses??"bg-yellow-800 border-yellow-600 text-white font-bold",u=i.activeClasses?"text-blue-200":"text-yellow-300";return l.jsxs("button",{onClick:i.onToggle,className:`py-2.5 px-3 rounded border text-left text-sm font-mono transition-colors ${a?c:"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`,children:[l.jsxs("div",{className:"font-bold flex items-center gap-1.5",children:[l.jsx(i.icon,{className:"w-3.5 h-3.5"}),i.label]}),l.jsx("div",{className:`text-xs font-normal mt-0.5 ${a?u:"text-gray-500"}`,children:i.desc})]},i.key)})}),l.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Key restrictions (mutually exclusive):"}),l.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[l.jsxs("button",{onClick:()=>{t({hjklOnly:!e.hjklOnly,noHjkl:e.hjklOnly?e.noHjkl:!1})},className:`py-2.5 px-3 rounded border text-left text-sm font-mono transition-colors ${e.hjklOnly?"bg-blue-700 border-blue-500 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`,children:[l.jsxs("div",{className:"font-bold flex items-center gap-1.5",children:[l.jsx(Qc,{className:"w-3.5 h-3.5"}),"hjkl only"]}),l.jsx("div",{className:`text-xs font-normal mt-0.5 ${e.hjklOnly?"text-blue-200":"text-gray-500"}`,children:"Only basic moves allowed"})]}),l.jsxs("button",{onClick:()=>{t({noHjkl:!e.noHjkl,hjklOnly:e.noHjkl?e.hjklOnly:!1})},className:`py-2.5 px-3 rounded border text-left text-sm font-mono transition-colors ${e.noHjkl?"bg-red-800 border-red-600 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`,children:[l.jsxs("div",{className:"font-bold flex items-center gap-1.5",children:[l.jsx(Qc,{className:"w-3.5 h-3.5"}),"No hjkl"]}),l.jsx("div",{className:`text-xs font-normal mt-0.5 ${e.noHjkl?"text-red-300":"text-gray-500"}`,children:"Must use word/search motions"})]})]})]})})}const Bm=kn,$w={general:10,timed_challenge:10,survival:5},Gw=[{id:"general",label:"General",desc:"Practice endlessly, level up naturally"},{id:"timed_challenge",label:"Timed Challenge",desc:"Race the clock for a fixed session"},{id:"survival",label:"Survival",desc:"One miss ends it — longer limits, no mercy"}],zw=[1,2,5,10,15];function qw(e,t){switch(t.type){case"SET_LANG":return{...e,lang:t.value};case"SET_LEVEL":return{...e,level:t.value};case"SET_MODE":return{...e,mode:t.value};case"SET_DURATION":return{...e,duration:t.value};case"SET_REPETITION":return{...e,repetition:t.value};case"SET_GUIDED":return{...e,guided:t.value};case"SET_CATEGORIES":return{...e,categories:t.value};case"SET_ASSIST_PCT":return{...e,assistPct:t.value};case"SET_KNOWLEDGE_FILTER":return{...e,knowledgeFilter:t.value};case"SET_TIME_MULT":return{...e,commandTimeMultiplier:t.value};case"SET_DRILL_MODE":return{...e,drillMode:t.value};case"PATCH_HANDICAPS":return{...e,handicaps:{...e.handicaps,...t.patch}};case"TOGGLE_ASSIST":return{...e,assistEnabled:!e.assistEnabled};case"TOGGLE_SKIP_UNSUPPORTED":{const n=!e.skipUnsupported;try{localStorage.setItem(X.SKIP_UNSUPPORTED,String(n))}catch{}return{...e,skipUnsupported:n}}default:return e}}function Vw(e){return{lang:(e==null?void 0:e.language)??"typescript",level:(e==null?void 0:e.startingLevel)??0,mode:(e==null?void 0:e.mode)??"timed_challenge",duration:e!=null&&e.timedDurationMs?e.timedDurationMs/6e4:1,repetition:(e==null?void 0:e.repetitionTarget)??2,guided:(e==null?void 0:e.guidedMode)??"none",categories:(e==null?void 0:e.categories)??[...ad],assistEnabled:e?e.dynamicAssist!==null&&e.dynamicAssist!==void 0:!0,assistPct:(e==null?void 0:e.dynamicAssist)??100,skipUnsupported:(()=>{try{const t=localStorage.getItem(X.SKIP_UNSUPPORTED);return t===null?!0:t==="true"}catch{return!0}})(),knowledgeFilter:(e==null?void 0:e.knowledgeFilter)??"all",commandTimeMultiplier:(e==null?void 0:e.commandTimeMultiplier)??1,drillMode:(e==null?void 0:e.drillMode)??!1,handicaps:{hjklOnly:(e==null?void 0:e.hjklOnly)??!1,noHjkl:(e==null?void 0:e.noHjkl)??!1,opacityFade:(e==null?void 0:e.opacityFade)??!1,snowEffect:(e==null?void 0:e.snowEffect)??!1}}}function Uw({onStart:e,onHighScores:t,lastConfig:n}){const[r,s]=f.useReducer(qw,n,Vw),o=nn().size,i=f.useMemo(()=>{let g=r.categories.length<an.length?Bm.filter(v=>r.categories.includes(v.category)):Bm;if(r.skipUnsupported){const v=nn();g=g.filter(w=>!v.has(w.id))}if(r.knowledgeFilter!=="all"){const v=Dr();g=r.knowledgeFilter==="known"?g.filter(w=>v.has(w.id)):g.filter(w=>!v.has(w.id))}return g.length},[r.categories,r.skipUnsupported,r.knowledgeFilter]),a=$w[r.mode],c=i>=a,u=r.categories.length>=hl&&c,d=r.mode==="survival"?Math.min(100,r.assistPct):r.assistPct;function p(){const g={mode:r.mode,language:r.lang,startingLevel:r.level,repetitionTarget:r.repetition,guidedMode:r.guided,categories:r.categories.length===0?null:r.categories,timedDurationMs:r.mode==="timed_challenge"?r.duration*6e4:void 0,dynamicAssist:r.assistEnabled?d:null,skipUnsupported:r.skipUnsupported,knowledgeFilter:r.knowledgeFilter,commandTimeMultiplier:r.commandTimeMultiplier,drillMode:r.drillMode,...r.handicaps};e(g)}const m=f.useRef(p);m.current=p,f.useEffect(()=>{function g(v){const w=v.target;v.key==="Enter"&&w.tagName!=="INPUT"&&w.tagName!=="TEXTAREA"&&u&&m.current()}return document.addEventListener("keydown",g),()=>document.removeEventListener("keydown",g)},[u]);const h=l.jsxs("div",{className:"space-y-3",children:[l.jsx(Sl,{onClick:p,disabled:!u,disabledLabel:`Too few commands (${i}/${a})`}),n&&l.jsx(zs,{onClick:()=>e(n),summary:`${n.mode} · ${n.language} · Lv${n.startingLevel}`})]});return l.jsxs(kl,{title:"VIM ARCADE",subtitle:"Practice vim commands in real code",actions:h,children:[l.jsx(W,{label:"Language",icon:xr,defaultOpen:!0,children:l.jsx(qn,{value:r.lang,onChange:g=>s({type:"SET_LANG",value:g})})}),l.jsxs(W,{label:"Game Mode",icon:pg,defaultOpen:!0,children:[l.jsx("div",{className:"space-y-2",children:Gw.map(g=>l.jsxs("button",{onClick:()=>s({type:"SET_MODE",value:g.id}),className:F.modeCard(r.mode===g.id),children:[l.jsx("div",{className:"font-bold",children:g.label}),l.jsx("div",{className:"text-xs text-gray-400",children:g.desc})]},g.id))}),r.mode==="timed_challenge"&&l.jsxs("div",{className:"mt-3",children:[l.jsx("p",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"Duration"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:zw.map(g=>l.jsxs("button",{onClick:()=>s({type:"SET_DURATION",value:g}),className:F.pill(r.duration===g),children:[g,"m"]},g))})]})]}),l.jsx(W,{label:"Challenge Options",icon:Zt,defaultOpen:!1,children:l.jsx(Vn,{guidedMode:r.guided,onGuidedMode:g=>s({type:"SET_GUIDED",value:g}),startingLevel:r.level,onStartingLevel:g=>s({type:"SET_LEVEL",value:g}),repetition:r.repetition,onRepetition:g=>s({type:"SET_REPETITION",value:g}),timeMultiplier:r.commandTimeMultiplier,onTimeMultiplier:g=>s({type:"SET_TIME_MULT",value:g}),dynamicAssistEnabled:r.assistEnabled,onDynamicAssistToggle:()=>s({type:"TOGGLE_ASSIST"}),dynamicAssistPct:r.assistEnabled?d:void 0,onDynamicAssistPct:g=>s({type:"SET_ASSIST_PCT",value:g}),knowledgeFilter:r.knowledgeFilter,onKnowledgeFilter:g=>s({type:"SET_KNOWLEDGE_FILTER",value:g}),drillMode:r.drillMode,onDrillMode:g=>s({type:"SET_DRILL_MODE",value:g})})}),l.jsx(W,{label:l.jsxs(l.Fragment,{children:["Focus areas ",l.jsxs("span",{className:"text-gray-600 normal-case",children:["(min ",hl,")"]})]}),defaultOpen:!1,children:l.jsx(ag,{selected:r.categories,onChange:g=>s({type:"SET_CATEGORIES",value:g})})}),l.jsx(W,{label:"Skip Unsupported Commands",icon:Hl,defaultOpen:!1,badge:r.skipUnsupported?"On":"Off",children:l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",onClick:()=>s({type:"TOGGLE_SKIP_UNSUPPORTED"}),children:[l.jsx("div",{className:`relative w-10 h-6 rounded-full transition-colors ${r.skipUnsupported?"bg-green-600":"bg-gray-700"}`,children:l.jsx("span",{className:`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${r.skipUnsupported?"translate-x-5":"translate-x-1"}`})}),l.jsx("span",{className:"font-mono text-sm text-gray-300",children:r.skipUnsupported?"On — skip marked commands":"Off — include all commands"})]}),o>0&&l.jsxs("span",{className:"text-gray-500 font-mono text-xs",children:["(",o," marked)"]})]})}),l.jsx(qs,{config:r.handicaps,onPatch:g=>s({type:"PATCH_HANDICAPS",patch:g})})]})}const Hn={wordWrap:"on",fontSize:14,lineNumbers:"on",renderWhitespace:"all",minimap:!1,disableMouse:!0},bg="vimarcade_monaco_prefs";function wg(){try{const e=localStorage.getItem(bg);if(!e)return{...Hn};const t=JSON.parse(e);return{wordWrap:t.wordWrap??Hn.wordWrap,fontSize:t.fontSize??Hn.fontSize,lineNumbers:t.lineNumbers??Hn.lineNumbers,renderWhitespace:t.renderWhitespace??Hn.renderWhitespace,minimap:t.minimap??Hn.minimap,disableMouse:t.disableMouse??Hn.disableMouse}}catch{return{...Hn}}}function Bw(e){try{localStorage.setItem(bg,JSON.stringify(e))}catch{}}function Un(e={}){const{language:t="plaintext"}=e,n=f.useRef(e.onCommandExecuted);f.useEffect(()=>{n.current=e.onCommandExecuted},[e.onCommandExecuted]);const r=f.useRef(e.onEditorCreated);f.useEffect(()=>{r.current=e.onEditorCreated},[e.onEditorCreated]);const s=f.useRef(e.onAnyKey);f.useEffect(()=>{s.current=e.onAnyKey},[e.onAnyKey]);const o=f.useRef(e.onKeyDisplay);f.useEffect(()=>{o.current=e.onKeyDisplay},[e.onKeyDisplay]);const i=f.useRef(e.onCursorChange);f.useEffect(()=>{i.current=e.onCursorChange},[e.onCursorChange]);const a=f.useRef(e.onReady);f.useEffect(()=>{a.current=e.onReady},[e.onReady]);const c=f.useRef(e.onContentChange);f.useEffect(()=>{c.current=e.onContentChange},[e.onContentChange]);const u=f.useRef(e.monacoActions??[]);f.useEffect(()=>{u.current=e.monacoActions??[]},[e.monacoActions]);const d=f.useRef(e.defaultValue??""),p=f.useRef(e.targetContent??""),m=f.useRef(null),h=f.useRef(null),g=f.useRef(null),v=f.useRef(null),w=f.useRef(null),x=f.useRef(null),y=f.useRef(null),b=f.useRef(null),k=f.useCallback(I=>{var O;(O=g.current)==null||O.setValue(I)},[]),N=f.useCallback(()=>{const I=g.current;I&&(I.setPosition({lineNumber:1,column:1}),I.revealPosition({lineNumber:1,column:1}))},[]),E=f.useCallback(()=>{var I;return((I=g.current)==null?void 0:I.getValue())??""},[]),j=f.useCallback(()=>{var I;(I=g.current)==null||I.focus()},[]),C=f.useCallback(I=>{const O=g.current;O&&(O.setPosition(I),O.revealPositionInCenter(I))},[]),D=f.useCallback(I=>{const O=x.current,V=w.current,ge=g.current;if(!O||!V||!ge)return;if(!I){O.set([]);return}const fe=ge.getModel(),R=fe&&I.lineNumber<=fe.getLineCount()?fe.getLineMaxColumn(I.lineNumber):1;let P=I.column,L=I.column+1;const z=P>=R;P>R&&(P=R),L>R&&(L=R),O.set([{range:new V.Range(I.lineNumber,P,I.lineNumber,L),options:{inlineClassName:z?void 0:"motion-race-target",linesDecorationsClassName:"motion-race-target-gutter",description:"motion-race-target",...z?{after:{content:" ",inlineClassName:"motion-race-target"}}:{}}}])},[]),M=f.useCallback(I=>{const O=x.current,V=b.current,ge=w.current,fe=g.current;if(!ge||!fe)return;if(I.length===0){O==null||O.set([]),V==null||V.set([]);return}const R=fe.getModel();R&&(O&&O.set(I.map(P=>{const L=P.lineNumber<=R.getLineCount()?R.getLineMaxColumn(P.lineNumber):1;let z=P.column,ue=P.column+1;const ye=z>=L;return z>L&&(z=L),ue>L&&(ue=L),{range:new ge.Range(P.lineNumber,z,P.lineNumber,ue),options:{inlineClassName:ye?void 0:"motion-race-target",linesDecorationsClassName:"motion-race-target-gutter",description:"motion-race-target",...ye?{after:{content:" ",inlineClassName:"motion-race-target"}}:{}}}})),V&&V.set([]))},[]),Y=f.useCallback(I=>{const O=y.current,V=w.current,ge=g.current;if(!O||!V||!ge)return;const fe=ge.getModel();if(!fe)return;const R=I.map(P=>{const L=P.isSolid?3:8,z=Math.min(P.age,L),ue=P.type==="user"?`trail-user-${z}`:`trail-ec${P.colorIdx??0}-${z}`,ye=P.lineNumber<=fe.getLineCount()?fe.getLineMaxColumn(P.lineNumber):1;let ae=P.column,Ze=P.column+1;const Ie=ae>=ye;return ae>ye&&(ae=ye),Ze>ye&&(Ze=ye),{range:new V.Range(P.lineNumber,ae,P.lineNumber,Ze),options:{inlineClassName:Ie?void 0:ue,description:"motion-race-trail",...Ie?{after:{content:" ",inlineClassName:ue}}:{}}}});O.set(R)},[]),B=f.useCallback(()=>{const I=g.current;if(!I)return null;const O=I.getVisibleRanges();return O.length?{startLine:O[0].startLineNumber,endLine:O[O.length-1].endLineNumber}:null},[]);return f.useEffect(()=>{d.current=e.defaultValue??"";const I=g.current;I&&(I.setValue(d.current),I.setPosition({lineNumber:1,column:1}))},[e.defaultValue]),f.useEffect(()=>{var O,V;p.current=e.targetContent??"";const I=(V=(O=e.targetEditorRef)==null?void 0:O.current)==null?void 0:V.__monacoEditor;I&&I.setValue(p.current)},[e.targetContent,e.targetEditorRef]),f.useEffect(()=>{if(!m.current)return;let I=!1,O=null,V=null;async function ge(){var fe,R,P;try{let L=function(){const G=ke.querySelector('input[type="text"]');return G?":"+G.value:(ke.textContent??"").trim()};const z=await wo(()=>import("./monaco-4a3c78e8.js").then(G=>G.e),["assets/monaco-4a3c78e8.js","assets/monaco-15d13aa5.css"]),{initVimMode:ue}=await wo(()=>import("./monaco-4a3c78e8.js").then(G=>G.m),["assets/monaco-4a3c78e8.js","assets/monaco-15d13aa5.css"]);if(I||!m.current)return;const ye=wg(),ae=z.editor.create(m.current,{value:d.current,language:t,theme:"vs-dark",fontSize:ye.fontSize,fontFamily:"'JetBrains Mono', 'Fira Code', Consolas, monospace",minimap:{enabled:ye.minimap},scrollBeyondLastLine:!1,lineNumbers:ye.lineNumbers,renderLineHighlight:"all",automaticLayout:!0,wordWrap:e.wordWrapOverride??ye.wordWrap,inlineSuggest:{enabled:!1},renderWhitespace:ye.renderWhitespace,readOnly:e.readOnly??!1});if(g.current=ae,e.enableMouseOverride!==!0&&ye.disableMouse){let G=ae.getPosition();ae.onDidChangeCursorPosition(me=>{me.source==="mouse"?ae.setPosition(G):G=me.position})}let Ie=null;const S=(fe=e.targetEditorRef)==null?void 0:fe.current;S&&(Ie=z.editor.create(S,{value:p.current,language:t,theme:"vs-dark",readOnly:!0,fontSize:ye.fontSize,fontFamily:"'JetBrains Mono', 'Fira Code', Consolas, monospace",minimap:{enabled:!1},scrollBeyondLastLine:!1,lineNumbers:ye.lineNumbers,renderLineHighlight:"none",automaticLayout:!0,wordWrap:e.wordWrapOverride??ye.wordWrap,domReadOnly:!0,scrollbar:{vertical:"hidden",horizontal:"hidden"},overviewRulerBorder:!1,hideCursorInOverviewRuler:!0,renderWhitespace:ye.renderWhitespace}),S.__monacoEditor=Ie);const _=ae.createDecorationsCollection([]),ee=Ie?Ie.createDecorationsCollection([]):null,de=()=>{const G=p.current,me=ae.getModel();if(!G||!me){_.set([]),ee==null||ee.set([]);return}const _e=me.getValue().split(`
`),Re=G.split(`
`),T=Math.max(_e.length,Re.length),q=[],U=[];for(let Z=0;Z<T;Z++){const se=_e[Z],ne=Re[Z];if(se===ne)continue;const $=Z+1;if($>me.getLineCount())continue;let ie;se===void 0?ie="goal-diff-added":ne===void 0?ie="goal-diff-removed":ie="goal-diff-changed";const $e={linesDecorationsClassName:ie,description:"goal-diff"},Be=new z.Range($,1,$,1);q.push({range:Be,options:$e}),U.push({range:new z.Range($,1,$,1),options:$e})}if(_.set(q),ee&&Ie){const Z=Ie.getModel(),se=U.filter(ne=>ne.range.startLineNumber<=((Z==null?void 0:Z.getLineCount())??0));ee.set(se)}};p.current&&de();const Oe=ae.onDidChangeModelContent(de);w.current=z,x.current=ae.createDecorationsCollection([]),y.current=ae.createDecorationsCollection([]),b.current=ae.createDecorationsCollection([]),(R=r.current)==null||R.call(r,z,ae);const re=ae.onDidChangeCursorPosition(G=>{var me;(me=i.current)==null||me.call(i,G.position)}),pe=ae.onDidChangeModelContent(()=>{var G;(G=c.current)==null||G.call(c,ae.getValue())}),ke=h.current??document.createElement("div"),lt=ue(ae,ke);v.current=lt;let J="normal",te="";const oe=new tg,Pe={za:"editor.toggleFold",zo:"editor.unfold",zc:"editor.fold",zO:"editor.unfoldRecursively",zC:"editor.foldRecursively",zR:"editor.unfoldAll",zM:"editor.foldAll",zr:"editor.unfoldRecursively",zm:"editor.foldAll"},ce=G=>{var _e,Re;if(!nr.has(G))return;(_e=n.current)==null||_e.call(n,G);const me=Pe[G];me&&((Re=ae.getAction(me))==null||Re.run())},Ke=new MutationObserver(G=>{for(const _e of G)for(const Re of Array.from(_e.removedNodes)){const T=Re instanceof HTMLInputElement?Re:Re instanceof Element?Re.querySelector('input[type="text"]'):null;if(T){const q=T.value??"",U=q?":"+q:te.trim();U.startsWith(":")&&ce(U),te="",J="normal";return}}const me=L();if(me!==te)if(te.startsWith(":")&&me===""&&ce(te.trim()),te=me,me.includes("INSERT")||me.includes("REPLACE")||me.includes("VISUAL")||me.startsWith(":")||me.startsWith("/")||me.startsWith("?")){const _e=oe.reset();_e&&ce(_e),J="other"}else J="normal"});Ke.observe(ke,{childList:!0,subtree:!0,characterData:!0});const ve=G=>{const me=G.target;ke.contains(me)&&(te=":"+me.value,J="other")};ke.addEventListener("input",ve);const he=12,Ae=[],Qe=ae.getDomNode(),st=G=>{var Z,se;const me=document.activeElement,_e=!!(Qe!=null&&Qe.contains(me)),Re=!!ke.contains(me);if(!_e&&!Re||G.key==="Enter"&&(G.metaKey||G.ctrlKey))return;const T=hb(G);if(T){(Z=s.current)==null||Z.call(s),(se=o.current)==null||se.call(o,{display:T,vimMode:J,inSolutions:nr.has(T)}),Ae.push(T),Ae.length>he&&Ae.shift();for(const ne of vb)if(Ae.length>=ne.length&&Ae.slice(-ne.length).join("")===ne){ce(ne),Ae.length=0;break}}if(G.key==="Escape"||G.ctrlKey&&!G.altKey&&!G.metaKey&&G.key==="["){Ae.length=0;const ne=oe.reset();ne&&ce(ne),ce("<Esc>");return}if(J!=="normal"||G.altKey||G.metaKey)return;let q;if(G.ctrlKey)if(G.key.length===1||G.key==="]"||G.key==="^")q=`<C-${G.key.toLowerCase()}>`;else return;else if(G.key.length===1)q=G.key;else return;const U=oe.push(q);for(const ne of U)ce(ne)};document.addEventListener("keydown",st,{capture:!0}),O=()=>{var G,me,_e,Re;if(document.removeEventListener("keydown",st,{capture:!0}),ke.removeEventListener("input",ve),re.dispose(),pe.dispose(),Oe.dispose(),_.clear(),ee==null||ee.clear(),(G=x.current)==null||G.clear(),x.current=null,(me=y.current)==null||me.clear(),y.current=null,(_e=b.current)==null||_e.clear(),b.current=null,w.current=null,Ie){try{Ie.dispose()}catch{}(Re=e.targetEditorRef)!=null&&Re.current&&delete e.targetEditorRef.current.__monacoEditor}},V=()=>Ke.disconnect();for(const G of u.current){const me=G.id;ae.addAction({id:me,label:G.label,contextMenuGroupId:"vim-arcade",run:()=>{var _e;return(_e=u.current.find(Re=>Re.id===me))==null?void 0:_e.run()}})}(P=a.current)==null||P.call(a),ae.focus()}catch(L){console.error("[useMonacoEditor] init failed — vim mode will not work:",L)}}return ge(),()=>{if(I=!0,O==null||O(),V==null||V(),v.current){try{v.current.dispose()}catch{}v.current=null}if(g.current){try{g.current.dispose()}catch{}g.current=null}}},[]),f.useEffect(()=>{const I=g.current;I&&wo(()=>import("./monaco-4a3c78e8.js").then(O=>O.e),["assets/monaco-4a3c78e8.js","assets/monaco-15d13aa5.css"]).then(O=>{const V=I.getModel();V&&O.editor.setModelLanguage(V,t)})},[t]),{editorRef:m,statusRef:h,setContent:k,resetCursor:N,getContent:E,focusEditor:j,positionCursor:C,setTargetHighlight:D,setGoalHighlights:M,setTrailDecorations:Y,getVisibleRange:B}}const Hm=new Set(["h","j","k","l"]);function jl(e,t){const n=(e==null?void 0:e.hjklOnly)??!1,r=(e==null?void 0:e.noHjkl)??!1;f.useEffect(()=>{if(!n&&!r)return;function s(o){t&&(o.ctrlKey||o.altKey||o.metaKey||o.key.length===1&&(r&&Hm.has(o.key)?(o.preventDefault(),o.stopPropagation()):n&&!Hm.has(o.key)&&(":0123456789".includes(o.key)||(o.preventDefault(),o.stopPropagation()))))}return document.addEventListener("keydown",s,{capture:!0}),()=>document.removeEventListener("keydown",s,{capture:!0})},[t,n,r])}function Cl(){const[e]=f.useState(()=>Array.from({length:25},(t,n)=>{const r=Math.floor(Math.random()*100),s=8+Math.random()*8,o=-(Math.random()*16),i=10+Math.floor(Math.random()*5),a=.4+Math.random()*.4,c=Math.random()>.5?"❄":"*";return{i:n,left:r,duration:s,delay:o,fontSize:i,opacity:a,char:c}}));return l.jsx("div",{style:{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:5},children:e.map(t=>l.jsx("span",{className:"snow-flake",style:{left:`${t.left}%`,animationDuration:`${t.duration}s`,animationDelay:`${t.delay}s`,fontSize:`${t.fontSize}px`,opacity:t.opacity,color:"rgba(255,255,255,0.6)"},children:t.char},t.i))})}function El({cursorLine:e,getVisibleRange:t}){let n=50;const r=t();if(r){const s=Math.max(1,r.endLine-r.startLine);n=Math.round((e-r.startLine)/s*100),n=Math.max(0,Math.min(100,n))}return l.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",zIndex:3,background:`radial-gradient(ellipse 80% 40% at 50% ${n}%, transparent 0%, rgba(0,0,0,0.75) 100%)`}})}const Wm=["#f43f5e","#fb923c","#fbbf24","#4ade80","#60a5fa","#c084fc","#f472b6"];function Hw({isActive:e,onDone:t}){if(f.useEffect(()=>{if(!e)return;const r=setTimeout(t,1500);return()=>clearTimeout(r)},[e,t]),!e)return null;const n=Array.from({length:30},(r,s)=>{const o=Math.floor(Math.random()*100),i=Math.floor(Math.random()*60),a=Math.floor(Math.random()*360),c=Wm[Math.floor(Math.random()*Wm.length)],u=Math.random()*.3;return{i:s,left:o,top:i,rotation:a,color:c,delay:u}});return l.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",zIndex:6,overflow:"hidden"},children:n.map(r=>l.jsx("div",{style:{position:"absolute",left:`${r.left}%`,top:`${r.top}%`,width:"4px",height:"8px",background:r.color,"--r":`${r.rotation}deg`,animation:`confetti-fall 1.5s ease-out ${r.delay}s forwards`}},r.i))})}function Ww({isActive:e}){return e?l.jsx("div",{className:"penalty-flash-anim",style:{position:"absolute",inset:0,background:"rgba(220, 38, 38, 0.45)",pointerEvents:"none",zIndex:4}}):null}const Kw=`package utils

import (
	"errors"
	"sync"
)

// ErrEmpty is returned when operating on an empty collection.
var ErrEmpty = errors.New("empty")

// Stack is a generic thread-safe LIFO data structure.
type Stack[T any] struct {
	mu    sync.Mutex
	items []T
}

// Push adds an element to the top of the stack.
func (s *Stack[T]) Push(item T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items = append(s.items, item)
}

// Pop removes and returns the top element of the stack.
func (s *Stack[T]) Pop() (T, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	var zero T
	if len(s.items) == 0 {
		return zero, ErrEmpty
	}
	top := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return top, nil
}

// Len returns the current number of items.
func (s *Stack[T]) Len() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.items)
}
`,Ng=`package utils

import (
	"bufio"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"math"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"
)

// ErrNotFound is returned when a requested item is not found.
var ErrNotFound = errors.New("not found")

// Stack is a generic LIFO data structure.
type Stack[T any] struct {
	mu    sync.Mutex
	items []T
}

// Push adds an element to the top of the stack.
func (s *Stack[T]) Push(item T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items = append(s.items, item)
}

// Pop removes and returns the top element of the stack.
func (s *Stack[T]) Pop() (T, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	var zero T
	if len(s.items) == 0 {
		return zero, ErrNotFound
	}
	top := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return top, nil
}

// Peek returns the top element without removing it.
func (s *Stack[T]) Peek() (T, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	var zero T
	if len(s.items) == 0 {
		return zero, ErrNotFound
	}
	return s.items[len(s.items)-1], nil
}

// Len returns the number of items in the stack.
func (s *Stack[T]) Len() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.items)
}

// HashFile computes the SHA-256 hash of a file at the given path.
func HashFile(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", fmt.Errorf("open %s: %w", path, err)
	}
	defer f.Close()

	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return "", fmt.Errorf("hash %s: %w", path, err)
	}
	return hex.EncodeToString(h.Sum(nil)), nil
}

// WalkFiles calls fn for each regular file under root.
func WalkFiles(root string, fn func(path string, info os.FileInfo) error) error {
	return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			return fn(path, info)
		}
		return nil
	})
}

// WordCount counts the frequency of each word in the reader.
func WordCount(r io.Reader) (map[string]int, error) {
	counts := make(map[string]int)
	scanner := bufio.NewScanner(r)
	scanner.Split(bufio.ScanWords)
	for scanner.Scan() {
		word := strings.ToLower(strings.TrimFunc(scanner.Text(), unicode.IsPunct))
		if word != "" {
			counts[word]++
		}
	}
	return counts, scanner.Err()
}

// TopN returns the n most frequent words from the count map.
func TopN(counts map[string]int, n int) []string {
	type pair struct {
		word  string
		count int
	}
	pairs := make([]pair, 0, len(counts))
	for w, c := range counts {
		pairs = append(pairs, pair{w, c})
	}
	sort.Slice(pairs, func(i, j int) bool {
		if pairs[i].count != pairs[j].count {
			return pairs[i].count > pairs[j].count
		}
		return pairs[i].word < pairs[j].word
	})
	result := make([]string, 0, n)
	for i := 0; i < n && i < len(pairs); i++ {
		result = append(result, pairs[i].word)
	}
	return result
}

// Retry calls fn up to maxAttempts times with exponential backoff.
func Retry(maxAttempts int, initial time.Duration, fn func() error) error {
	delay := initial
	var lastErr error
	for i := 0; i < maxAttempts; i++ {
		if err := fn(); err != nil {
			lastErr = err
			time.Sleep(delay)
			delay = time.Duration(float64(delay) * 1.5)
			continue
		}
		return nil
	}
	return fmt.Errorf("after %d attempts: %w", maxAttempts, lastErr)
}

// ParseCSVLine parses a single CSV line respecting quoted fields.
func ParseCSVLine(line string) []string {
	var fields []string
	var buf strings.Builder
	inQuote := false
	for i := 0; i < len(line); i++ {
		ch := line[i]
		switch {
		case ch == '"':
			if inQuote && i+1 < len(line) && line[i+1] == '"' {
				buf.WriteByte('"')
				i++
			} else {
				inQuote = !inQuote
			}
		case ch == ',' && !inQuote:
			fields = append(fields, buf.String())
			buf.Reset()
		default:
			buf.WriteByte(ch)
		}
	}
	fields = append(fields, buf.String())
	return fields
}

// Clamp restricts v to the range [lo, hi].
func Clamp(v, lo, hi float64) float64 {
	return math.Min(math.Max(v, lo), hi)
}

// FormatDuration formats a duration as a human-readable string.
func FormatDuration(d time.Duration) string {
	if d < time.Minute {
		return strconv.FormatFloat(d.Seconds(), 'f', 1, 64) + "s"
	}
	if d < time.Hour {
		return fmt.Sprintf("%dm%02ds", int(d.Minutes()), int(d.Seconds())%60)
	}
	return fmt.Sprintf("%dh%02dm", int(d.Hours()), int(d.Minutes())%60)
}

// Must panics if err is non-nil, otherwise returns v.
func Must[T any](v T, err error) T {
	if err != nil {
		panic(err)
	}
	return v
}
`,Qw=Ng,Yw=`package utils

import (
	"context"
	"sync"
	"sync/atomic"
)

// Set is a generic unordered collection of unique elements.
type Set[T comparable] struct {
	mu    sync.RWMutex
	items map[T]struct{}
}

// NewSet creates an empty Set.
func NewSet[T comparable]() *Set[T] {
	return &Set[T]{items: make(map[T]struct{})}
}

// Add inserts v into the set.
func (s *Set[T]) Add(v T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.items[v] = struct{}{}
}

// Has reports whether v is in the set.
func (s *Set[T]) Has(v T) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	_, ok := s.items[v]
	return ok
}

// Remove deletes v from the set.
func (s *Set[T]) Remove(v T) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.items, v)
}

// Len returns the number of elements in the set.
func (s *Set[T]) Len() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.items)
}

// Slice returns the set elements as an unsorted slice.
func (s *Set[T]) Slice() []T {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]T, 0, len(s.items))
	for v := range s.items {
		out = append(out, v)
	}
	return out
}

// WorkerPool runs tasks concurrently with a bounded number of goroutines.
type WorkerPool struct {
	workers int
	tasks   chan func()
	wg      sync.WaitGroup
	once    sync.Once
	quit    chan struct{}
	active  atomic.Int64
}

// NewWorkerPool creates and starts a pool with the given number of workers.
func NewWorkerPool(workers int) *WorkerPool {
	p := &WorkerPool{
		workers: workers,
		tasks:   make(chan func(), workers*2),
		quit:    make(chan struct{}),
	}
	p.start()
	return p
}

func (p *WorkerPool) start() {
	for i := 0; i < p.workers; i++ {
		p.wg.Add(1)
		go func() {
			defer p.wg.Done()
			for {
				select {
				case task, ok := <-p.tasks:
					if !ok {
						return
					}
					p.active.Add(1)
					task()
					p.active.Add(-1)
				case <-p.quit:
					return
				}
			}
		}()
	}
}

// Submit enqueues a task. Blocks if the pool queue is full.
func (p *WorkerPool) Submit(task func()) {
	p.tasks <- task
}

// TrySubmit enqueues a task without blocking. Returns false if the queue is full.
func (p *WorkerPool) TrySubmit(task func()) bool {
	select {
	case p.tasks <- task:
		return true
	default:
		return false
	}
}

// Stop signals the pool to stop after pending tasks complete.
// Returns ctx.Err() if the context is cancelled before all tasks finish.
func (p *WorkerPool) Stop(ctx context.Context) error {
	p.once.Do(func() { close(p.tasks) })
	done := make(chan struct{})
	go func() {
		p.wg.Wait()
		close(done)
	}()
	select {
	case <-done:
		return nil
	case <-ctx.Done():
		close(p.quit)
		return ctx.Err()
	}
}

// Active returns the number of currently executing tasks.
func (p *WorkerPool) Active() int64 {
	return p.active.Load()
}

// MapConcurrent applies fn to each element concurrently and returns the results.
func MapConcurrent[T, R any](items []T, workers int, fn func(T) R) []R {
	results := make([]R, len(items))
	var wg sync.WaitGroup
	sem := make(chan struct{}, workers)
	for i, item := range items {
		wg.Add(1)
		go func(idx int, v T) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			results[idx] = fn(v)
		}(i, item)
	}
	wg.Wait()
	return results
}

// Keys returns the keys of a map as a slice.
func Keys[K comparable, V any](m map[K]V) []K {
	out := make([]K, 0, len(m))
	for k := range m {
		out = append(out, k)
	}
	return out
}

// Values returns the values of a map as a slice.
func Values[K comparable, V any](m map[K]V) []V {
	out := make([]V, 0, len(m))
	for _, v := range m {
		out = append(out, v)
	}
	return out
}

// Filter returns the elements of items for which fn returns true.
func Filter[T any](items []T, fn func(T) bool) []T {
	out := make([]T, 0)
	for _, v := range items {
		if fn(v) {
			out = append(out, v)
		}
	}
	return out
}

// Map transforms each element of items using fn and returns the results.
func Map[T, R any](items []T, fn func(T) R) []R {
	out := make([]R, len(items))
	for i, v := range items {
		out[i] = fn(v)
	}
	return out
}
`,Xw=`/// Clamp a value between lo and hi (inclusive).
pub fn clamp<T: PartialOrd>(value: T, lo: T, hi: T) -> T {
    if value < lo {
        lo
    } else if value > hi {
        hi
    } else {
        value
    }
}

/// Retry a fallible closure up to \`attempts\` times, returning the last error.
pub fn retry<T, E, F>(attempts: usize, mut f: F) -> Result<T, E>
where
    F: FnMut() -> Result<T, E>,
{
    let mut last_err = None;
    for _ in 0..attempts {
        match f() {
            Ok(v) => return Ok(v),
            Err(e) => last_err = Some(e),
        }
    }
    Err(last_err.unwrap())
}

/// Return the Levenshtein edit distance between two strings.
pub fn levenshtein(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect();
    let b: Vec<char> = b.chars().collect();
    let (m, n) = (a.len(), b.len());
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 0..=m { dp[i][0] = i; }
    for j in 0..=n { dp[0][j] = j; }
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1]
            } else {
                1 + dp[i - 1][j].min(dp[i][j - 1]).min(dp[i - 1][j - 1])
            };
        }
    }
    dp[m][n]
}
`,kg=`use std::collections::HashMap;
use std::fmt;
use std::fs::File;
use std::io::{self, BufRead, BufReader, Write};
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

/// A simple in-memory key-value store with optional TTL.
pub struct Cache<K, V> {
    inner: Arc<Mutex<CacheInner<K, V>>>,
}

struct CacheEntry<V> {
    value: V,
    expires_at: Option<Instant>,
}

struct CacheInner<K, V> {
    store: HashMap<K, CacheEntry<V>>,
    max_size: usize,
}

impl<K: std::hash::Hash + Eq + Clone, V: Clone> Cache<K, V> {
    pub fn new(max_size: usize) -> Self {
        Cache {
            inner: Arc::new(Mutex::new(CacheInner {
                store: HashMap::new(),
                max_size,
            })),
        }
    }

    pub fn insert(&self, key: K, value: V, ttl: Option<Duration>) {
        let mut inner = self.inner.lock().unwrap();
        if inner.store.len() >= inner.max_size {
            // Evict first expired entry or oldest
            let expired_key = inner
                .store
                .iter()
                .find(|(_, e)| e.expires_at.map_or(false, |t| t < Instant::now()))
                .map(|(k, _)| k.clone());
            if let Some(k) = expired_key {
                inner.store.remove(&k);
            }
        }
        inner.store.insert(
            key,
            CacheEntry {
                value,
                expires_at: ttl.map(|d| Instant::now() + d),
            },
        );
    }

    pub fn get(&self, key: &K) -> Option<V> {
        let inner = self.inner.lock().unwrap();
        inner.store.get(key).and_then(|e| {
            if e.expires_at.map_or(false, |t| t < Instant::now()) {
                None
            } else {
                Some(e.value.clone())
            }
        })
    }

    pub fn remove(&self, key: &K) -> bool {
        let mut inner = self.inner.lock().unwrap();
        inner.store.remove(key).is_some()
    }

    pub fn len(&self) -> usize {
        self.inner.lock().unwrap().store.len()
    }

    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }
}

/// Read all lines from a file, returning them as a Vec<String>.
pub fn read_lines<P: AsRef<Path>>(path: P) -> io::Result<Vec<String>> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);
    reader.lines().collect()
}

/// Write lines to a file, one per line.
pub fn write_lines<P: AsRef<Path>>(path: P, lines: &[String]) -> io::Result<()> {
    let mut file = File::create(path)?;
    for line in lines {
        writeln!(file, "{}", line)?;
    }
    Ok(())
}

/// A retry helper that retries a fallible closure up to n times.
pub fn retry<T, E, F>(attempts: usize, mut f: F) -> Result<T, E>
where
    F: FnMut() -> Result<T, E>,
{
    let mut last_err = None;
    for _ in 0..attempts {
        match f() {
            Ok(v) => return Ok(v),
            Err(e) => last_err = Some(e),
        }
    }
    Err(last_err.unwrap())
}

/// Clamp a value between lo and hi.
pub fn clamp<T: PartialOrd>(value: T, lo: T, hi: T) -> T {
    if value < lo {
        lo
    } else if value > hi {
        hi
    } else {
        value
    }
}

/// Levenshtein edit distance between two strings.
pub fn levenshtein(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect();
    let b: Vec<char> = b.chars().collect();
    let (m, n) = (a.len(), b.len());
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 0..=m { dp[i][0] = i; }
    for j in 0..=n { dp[0][j] = j; }
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1]
            } else {
                1 + dp[i - 1][j].min(dp[i][j - 1]).min(dp[i - 1][j - 1])
            };
        }
    }
    dp[m][n]
}

/// A word-frequency counter.
#[derive(Debug, Default)]
pub struct WordCounter {
    counts: HashMap<String, usize>,
}

impl WordCounter {
    pub fn new() -> Self {
        Default::default()
    }

    pub fn add_text(&mut self, text: &str) {
        for word in text.split_whitespace() {
            let word = word.to_lowercase();
            let word = word.trim_matches(|c: char| !c.is_alphanumeric());
            if !word.is_empty() {
                *self.counts.entry(word.to_string()).or_insert(0) += 1;
            }
        }
    }

    pub fn top_n(&self, n: usize) -> Vec<(&str, usize)> {
        let mut pairs: Vec<_> = self.counts.iter().map(|(k, v)| (k.as_str(), *v)).collect();
        pairs.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(b.0)));
        pairs.into_iter().take(n).collect()
    }
}

impl fmt::Display for WordCounter {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        for (word, count) in self.top_n(10) {
            writeln!(f, "{}: {}", word, count)?;
        }
        Ok(())
    }
}
`,Jw=kg,Zw=`use std::collections::HashMap;
use std::sync::{Arc, Mutex};

/// A fixed-capacity ring buffer (FIFO queue).
pub struct RingBuffer<T> {
    data: Vec<Option<T>>,
    head: usize,
    tail: usize,
    len: usize,
    cap: usize,
}

impl<T> RingBuffer<T> {
    pub fn new(capacity: usize) -> Self {
        assert!(capacity > 0, "capacity must be positive");
        let mut data = Vec::with_capacity(capacity);
        for _ in 0..capacity {
            data.push(None);
        }
        RingBuffer { data, head: 0, tail: 0, len: 0, cap: capacity }
    }

    /// Push an item. Returns false if the buffer is full.
    pub fn push(&mut self, item: T) -> bool {
        if self.len == self.cap {
            return false;
        }
        self.data[self.head] = Some(item);
        self.head = (self.head + 1) % self.cap;
        self.len += 1;
        true
    }

    /// Pop the oldest item from the front.
    pub fn pop(&mut self) -> Option<T> {
        if self.len == 0 {
            return None;
        }
        let item = self.data[self.tail].take();
        self.tail = (self.tail + 1) % self.cap;
        self.len -= 1;
        item
    }

    /// Peek at the front item without removing it.
    pub fn peek(&self) -> Option<&T> {
        if self.len == 0 { None } else { self.data[self.tail].as_ref() }
    }

    pub fn len(&self) -> usize    { self.len }
    pub fn is_empty(&self) -> bool { self.len == 0 }
    pub fn is_full(&self) -> bool  { self.len == self.cap }
}

/// An event bus for decoupled pub/sub messaging.
pub struct EventBus<E: Clone> {
    listeners: Arc<Mutex<HashMap<String, Vec<Box<dyn Fn(E) + Send + Sync>>>>>,
}

impl<E: Clone + 'static> EventBus<E> {
    pub fn new() -> Self {
        EventBus { listeners: Arc::new(Mutex::new(HashMap::new())) }
    }

    /// Register a handler for the named event.
    pub fn subscribe<F>(&self, event: &str, handler: F)
    where
        F: Fn(E) + Send + Sync + 'static,
    {
        self.listeners
            .lock()
            .unwrap()
            .entry(event.to_string())
            .or_default()
            .push(Box::new(handler));
    }

    /// Dispatch an event to all registered handlers.
    pub fn publish(&self, event: &str, payload: E) {
        let listeners = self.listeners.lock().unwrap();
        if let Some(handlers) = listeners.get(event) {
            for handler in handlers {
                handler(payload.clone());
            }
        }
    }

    pub fn listener_count(&self, event: &str) -> usize {
        self.listeners.lock().unwrap().get(event).map_or(0, |v| v.len())
    }
}

impl<E: Clone + 'static> Default for EventBus<E> {
    fn default() -> Self { Self::new() }
}

/// A prefix-tree for efficient string prefix queries.
#[derive(Default)]
pub struct Trie {
    children: HashMap<char, Trie>,
    is_end: bool,
}

impl Trie {
    pub fn new() -> Self { Default::default() }

    /// Insert a word into the trie.
    pub fn insert(&mut self, word: &str) {
        let mut node = self;
        for ch in word.chars() {
            node = node.children.entry(ch).or_default();
        }
        node.is_end = true;
    }

    /// Return true if the trie contains exactly this word.
    pub fn contains(&self, word: &str) -> bool {
        self.find(word).map_or(false, |n| n.is_end)
    }

    /// Return true if any inserted word begins with \`prefix\`.
    pub fn starts_with(&self, prefix: &str) -> bool {
        self.find(prefix).is_some()
    }

    fn find(&self, s: &str) -> Option<&Trie> {
        let mut node = self;
        for ch in s.chars() {
            node = node.children.get(&ch)?;
        }
        Some(node)
    }
}

/// Truncate \`s\` to at most \`max_chars\` Unicode scalar values.
pub fn truncate(s: &str, max_chars: usize) -> &str {
    match s.char_indices().nth(max_chars) {
        Some((idx, _)) => &s[..idx],
        None => s,
    }
}

/// Left-pad \`s\` with \`fill\` to at least \`width\` characters.
pub fn pad_left(s: &str, width: usize, fill: char) -> String {
    let len = s.chars().count();
    if len >= width {
        return s.to_owned();
    }
    let padding: String = std::iter::repeat(fill).take(width - len).collect();
    padding + s
}

/// Return the number of leading ASCII space characters in \`s\`.
pub fn indent_level(s: &str) -> usize {
    s.len() - s.trim_start_matches(' ').len()
}
`,eN=`"""stack.py - A generic LIFO stack."""
from __future__ import annotations

from typing import Generic, TypeVar

T = TypeVar("T")


class Stack(Generic[T]):
    """A simple LIFO stack."""

    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> T:
        if not self._items:
            raise IndexError("peek at empty stack")
        return self._items[-1]

    def __len__(self) -> int:
        return len(self._items)

    def __bool__(self) -> bool:
        return bool(self._items)

    def __repr__(self) -> str:
        return f"Stack({self._items!r})"
`,Sg=`"""
utils.py - A collection of general-purpose Python utilities.
"""
from __future__ import annotations

import hashlib
import heapq
import itertools
import json
import math
import os
import re
import time
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Generator, Generic, Iterable, Iterator, TypeVar

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

class Stack(Generic[T]):
    """A thread-safe LIFO stack."""

    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> T:
        if not self._items:
            raise IndexError("peek at empty stack")
        return self._items[-1]

    def __len__(self) -> int:
        return len(self._items)

    def __bool__(self) -> bool:
        return bool(self._items)


@dataclass(order=True)
class PrioritizedItem(Generic[T]):
    priority: float
    item: T = field(compare=False)


class PriorityQueue(Generic[T]):
    """Min-heap priority queue."""

    def __init__(self) -> None:
        self._heap: list[PrioritizedItem[T]] = []

    def push(self, item: T, priority: float) -> None:
        heapq.heappush(self._heap, PrioritizedItem(priority, item))

    def pop(self) -> T:
        return heapq.heappop(self._heap).item

    def __len__(self) -> int:
        return len(self._heap)


# ---------------------------------------------------------------------------
# File utilities
# ---------------------------------------------------------------------------

def hash_file(path: str | Path, algorithm: str = "sha256") -> str:
    """Return the hex digest of a file."""
    h = hashlib.new(algorithm)
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def walk_files(root: str | Path) -> Generator[Path, None, None]:
    """Yield all regular files under *root* recursively."""
    for dirpath, _dirs, files in os.walk(root):
        for name in files:
            yield Path(dirpath) / name


def read_json(path: str | Path) -> Any:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_json(path: str | Path, data: Any, *, indent: int = 2) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=indent, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Text utilities
# ---------------------------------------------------------------------------

def word_count(text: str) -> Counter[str]:
    """Return a frequency counter of words (lowercased, punctuation stripped)."""
    words = re.findall(r"[a-zA-Z']+", text.lower())
    return Counter(words)


def camel_to_snake(name: str) -> str:
    s1 = re.sub(r"(.)([A-Z][a-z]+)", r"\\1_\\2", name)
    return re.sub(r"([a-z0-9])([A-Z])", r"\\1_\\2", s1).lower()


def snake_to_camel(name: str) -> str:
    components = name.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


def truncate(text: str, max_len: int, suffix: str = "...") -> str:
    if len(text) <= max_len:
        return text
    return text[: max_len - len(suffix)] + suffix


# ---------------------------------------------------------------------------
# Numeric utilities
# ---------------------------------------------------------------------------

def clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(value, hi))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * clamp(t, 0.0, 1.0)


def chunk(iterable: Iterable[T], size: int) -> Iterator[list[T]]:
    it = iter(iterable)
    while True:
        batch = list(itertools.islice(it, size))
        if not batch:
            break
        yield batch


# ---------------------------------------------------------------------------
# Retry helper
# ---------------------------------------------------------------------------

def retry(
    fn: Callable[[], T],
    attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple[type[Exception], ...] = (Exception,),
) -> T:
    last_exc: Exception | None = None
    current_delay = delay
    for _ in range(attempts):
        try:
            return fn()
        except exceptions as exc:
            last_exc = exc
            time.sleep(current_delay)
            current_delay *= backoff
    raise RuntimeError(f"All {attempts} attempts failed") from last_exc


# ---------------------------------------------------------------------------
# Levenshtein distance
# ---------------------------------------------------------------------------

def levenshtein(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, n + 1):
            temp = dp[j]
            if a[i - 1] == b[j - 1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j - 1])
            prev = temp
    return dp[n]
`,tN=Sg,nN=`"""
extras.py - Extended Python utilities: caching, configuration, rate limiting.
"""
from __future__ import annotations

import functools
import json
import os
import time
from collections import OrderedDict
from pathlib import Path
from typing import Any, Callable, Generic, Iterator, TypeVar

T = TypeVar("T")
K = TypeVar("K")
V = TypeVar("V")


# ---------------------------------------------------------------------------
# Memoize decorator
# ---------------------------------------------------------------------------

def memoize(fn: Callable[..., T]) -> Callable[..., T]:
    """Cache results of a function call keyed by positional arguments."""
    cache: dict[Any, T] = {}

    @functools.wraps(fn)
    def wrapper(*args: Any) -> T:
        if args not in cache:
            cache[args] = fn(*args)
        return cache[args]

    wrapper.cache = cache  # type: ignore[attr-defined]
    return wrapper


# ---------------------------------------------------------------------------
# LRU cache
# ---------------------------------------------------------------------------

class LRUCache(Generic[K, V]):
    """An LRU cache with a fixed maximum capacity."""

    def __init__(self, maxsize: int = 128) -> None:
        self._maxsize = maxsize
        self._cache: OrderedDict[K, V] = OrderedDict()

    def get(self, key: K, default: V | None = None) -> V | None:
        if key not in self._cache:
            return default
        self._cache.move_to_end(key)
        return self._cache[key]

    def put(self, key: K, value: V) -> None:
        if key in self._cache:
            self._cache.move_to_end(key)
        self._cache[key] = value
        if len(self._cache) > self._maxsize:
            self._cache.popitem(last=False)

    def __contains__(self, key: object) -> bool:
        return key in self._cache

    def __len__(self) -> int:
        return len(self._cache)


# ---------------------------------------------------------------------------
# Configuration loader
# ---------------------------------------------------------------------------

class Config:
    """Load configuration from a JSON file with environment-variable overrides."""

    def __init__(self, path: str | Path | None = None) -> None:
        self._data: dict[str, Any] = {}
        if path is not None:
            self.load(path)

    def load(self, path: str | Path) -> None:
        with open(path, encoding="utf-8") as f:
            self._data.update(json.load(f))

    def get(self, key: str, default: Any = None) -> Any:
        """Return the value for *key*, checking env vars first (uppercased, dots to underscores)."""
        env_key = key.upper().replace(".", "_")
        if env_key in os.environ:
            return os.environ[env_key]
        keys = key.split(".")
        node: Any = self._data
        for k in keys:
            if not isinstance(node, dict) or k not in node:
                return default
            node = node[k]
        return node

    def require(self, key: str) -> Any:
        value = self.get(key)
        if value is None:
            raise KeyError(f"Required config key missing: {key!r}")
        return value

    def __repr__(self) -> str:
        return f"Config({self._data!r})"


# ---------------------------------------------------------------------------
# Token-bucket rate limiter
# ---------------------------------------------------------------------------

class RateLimiter:
    """A token-bucket rate limiter.

    Args:
        rate:  tokens replenished per second.
        burst: maximum token capacity (burst size).
    """

    def __init__(self, rate: float, burst: float) -> None:
        self._rate = rate
        self._burst = burst
        self._tokens = burst
        self._last = time.monotonic()

    def _refill(self) -> None:
        now = time.monotonic()
        elapsed = now - self._last
        self._tokens = min(self._burst, self._tokens + elapsed * self._rate)
        self._last = now

    def allow(self) -> bool:
        """Return True and consume one token if available, else False."""
        self._refill()
        if self._tokens >= 1.0:
            self._tokens -= 1.0
            return True
        return False

    def wait(self) -> None:
        """Block until one token is available, then consume it."""
        self._refill()
        if self._tokens < 1.0:
            deficit = 1.0 - self._tokens
            time.sleep(deficit / self._rate)
            self._tokens = 0.0
        else:
            self._tokens -= 1.0


# ---------------------------------------------------------------------------
# Sequence utilities
# ---------------------------------------------------------------------------

def windows(seq: list[T], size: int) -> Iterator[list[T]]:
    """Yield overlapping sliding windows of *size* over *seq*."""
    for i in range(len(seq) - size + 1):
        yield seq[i : i + size]


def pairwise(seq: list[T]) -> Iterator[tuple[T, T]]:
    """Yield consecutive (a, b) pairs from *seq*."""
    for a, b in zip(seq, seq[1:]):
        yield a, b


def flatten(nested: list[Any]) -> list[Any]:
    """Recursively flatten a nested list into a single list."""
    result: list[Any] = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result
`,rN=`/**
 * stack.ts - A generic LIFO stack.
 */

export class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T {
    if (this.items.length === 0) throw new Error('Stack is empty')
    return this.items.pop()!
  }

  peek(): T {
    if (this.items.length === 0) throw new Error('Stack is empty')
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }

  clear(): void {
    this.items = []
  }
}
`,jg=`/**
 * utils.ts - General-purpose TypeScript utilities.
 */

// ---------------------------------------------------------------------------
// Data structures
// ---------------------------------------------------------------------------

export class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T {
    if (this.items.length === 0) throw new Error('Stack is empty')
    return this.items.pop()!
  }

  peek(): T {
    if (this.items.length === 0) throw new Error('Stack is empty')
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}

export class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly capacity: number

  constructor(capacity: number) {
    this.capacity = capacity
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined
    const value = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) this.cache.delete(key)
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value)
    }
    this.cache.set(key, value)
  }

  get size(): number {
    return this.cache.size
  }
}

// ---------------------------------------------------------------------------
// Functional helpers
// ---------------------------------------------------------------------------

export function groupBy<T, K extends PropertyKey>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

export function unique<T>(arr: T[], keyFn?: (item: T) => unknown): T[] {
  if (!keyFn) return [...new Set(arr)]
  const seen = new Set<unknown>()
  return arr.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function sortBy<T>(arr: T[], ...fns: Array<(item: T) => unknown>): T[] {
  return [...arr].sort((a, b) => {
    for (const fn of fns) {
      const va = fn(a)
      const vb = fn(b)
      if (va < vb) return -1
      if (va > vb) return 1
    }
    return 0
  })
}

// ---------------------------------------------------------------------------
// Async helpers
// ---------------------------------------------------------------------------

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 500,
  backoff = 2
): Promise<T> {
  let lastError: unknown
  let delay = delayMs
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < maxAttempts - 1) {
        await sleep(delay)
        delay *= backoff
      }
    }
  }
  throw lastError
}

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: T) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}

export function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  interval: number
): (...args: T) => void {
  let last = 0
  return (...args: T) => {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn(...args)
    }
  }
}

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

export function truncate(str: string, maxLen: number, suffix = '...'): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen - suffix.length) + suffix
}

export function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      dp[j] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = temp
    }
  }
  return dp[n]
}

// ---------------------------------------------------------------------------
// Number utilities
// ---------------------------------------------------------------------------

export function clamp(value: number, lo: number, hi: number): number {
  return Math.min(Math.max(value, lo), hi)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}
`,lN=jg,sN=`/**
 * extras.ts - Extended TypeScript utilities: events, deep merge, and validation.
 */

// ---------------------------------------------------------------------------
// EventEmitter
// ---------------------------------------------------------------------------

type Listener<T> = (payload: T) => void

export class EventEmitter<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<unknown>>>()

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener as Listener<unknown>)
    return () => this.off(event, listener)
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    this.listeners.get(event)?.delete(listener as Listener<unknown>)
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners.get(event)?.forEach(fn => fn(payload))
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    const wrapped: Listener<Events[K]> = payload => {
      listener(payload)
      this.off(event, wrapped)
    }
    this.on(event, wrapped)
  }

  listenerCount<K extends keyof Events>(event: K): number {
    return this.listeners.get(event)?.size ?? 0
  }
}

// ---------------------------------------------------------------------------
// Deep merge
// ---------------------------------------------------------------------------

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function deepMerge(
  base: Record<string, unknown>,
  ...overrides: Record<string, unknown>[]
): Record<string, unknown> {
  const result = { ...base }
  for (const override of overrides) {
    for (const key of Object.keys(override)) {
      const bv = result[key]
      const ov = override[key]
      if (isPlainObject(bv) && isPlainObject(ov)) {
        result[key] = deepMerge(bv, ov)
      } else if (ov !== undefined) {
        result[key] = ov
      }
    }
  }
  return result
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export type ValidationResult = { valid: true } | { valid: false; errors: string[] }

export type Validator<T> = (value: T) => ValidationResult

export function required<T>(value: T | null | undefined): ValidationResult {
  if (value === null || value === undefined) {
    return { valid: false, errors: ['Value is required'] }
  }
  if (typeof value === 'string' && value.length === 0) {
    return { valid: false, errors: ['Value is required'] }
  }
  return { valid: true }
}

export function minLength(min: number): Validator<string> {
  return value => value.length >= min
    ? { valid: true }
    : { valid: false, errors: ['Must be at least ' + min + ' characters'] }
}

export function maxLength(max: number): Validator<string> {
  return value => value.length <= max
    ? { valid: true }
    : { valid: false, errors: ['Must be at most ' + max + ' characters'] }
}

export function pattern(re: RegExp, message: string): Validator<string> {
  return value => re.test(value)
    ? { valid: true }
    : { valid: false, errors: [message] }
}

export function combine<T>(...validators: Validator<T>[]): Validator<T> {
  return value => {
    const errors: string[] = []
    for (const v of validators) {
      const r = v(value)
      if (!r.valid) errors.push(...r.errors)
    }
    return errors.length === 0 ? { valid: true } : { valid: false, errors }
  }
}

// ---------------------------------------------------------------------------
// Pipe and memoize
// ---------------------------------------------------------------------------

export function pipe<T>(value: T, ...fns: Array<(v: T) => T>): T {
  return fns.reduce((v, fn) => fn(v), value)
}

export function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  keyFn: (...args: T) => string = (...args) => JSON.stringify(args)
): (...args: T) => R {
  const cache = new Map<string, R>()
  return (...args: T): R => {
    const key = keyFn(...args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}
`,oN=`/*
 * vec.c - A minimal growable pointer array.
 */
#include <stdlib.h>
#include <stdbool.h>

typedef struct {
    void  **data;
    size_t  size;
    size_t  capacity;
} Vec;

Vec *vec_new(void) {
    Vec *v = malloc(sizeof(Vec));
    if (!v) return NULL;
    v->data = malloc(8 * sizeof(void *));
    v->size = 0;
    v->capacity = 8;
    return v;
}

bool vec_push(Vec *v, void *item) {
    if (v->size == v->capacity) {
        size_t  cap = v->capacity * 2;
        void  **d   = realloc(v->data, cap * sizeof(void *));
        if (!d) return false;
        v->data     = d;
        v->capacity = cap;
    }
    v->data[v->size++] = item;
    return true;
}

void *vec_get(const Vec *v, size_t i) {
    return i < v->size ? v->data[i] : NULL;
}

void vec_free(Vec *v) {
    free(v->data);
    free(v);
}
`,Cg=`/*
 * utils.c - General-purpose C utility library.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <assert.h>

/* -------------------------------------------------------------------------
 * Dynamic array
 * ---------------------------------------------------------------------- */

typedef struct {
    void   **data;
    size_t   size;
    size_t   capacity;
} Vec;

Vec *vec_new(void) {
    Vec *v = malloc(sizeof(Vec));
    if (!v) return NULL;
    v->data     = malloc(8 * sizeof(void *));
    v->size     = 0;
    v->capacity = 8;
    return v;
}

bool vec_push(Vec *v, void *item) {
    if (v->size == v->capacity) {
        size_t new_cap = v->capacity * 2;
        void **d = realloc(v->data, new_cap * sizeof(void *));
        if (!d) return false;
        v->data     = d;
        v->capacity = new_cap;
    }
    v->data[v->size++] = item;
    return true;
}

void *vec_get(const Vec *v, size_t i) {
    if (i >= v->size) return NULL;
    return v->data[i];
}

void vec_free(Vec *v) {
    free(v->data);
    free(v);
}

/* -------------------------------------------------------------------------
 * Hash map (open-addressing, FNV-1a hash)
 * ---------------------------------------------------------------------- */

#define MAP_INIT_CAP 16
#define MAP_LOAD     0.75

typedef struct {
    char   *key;
    void   *value;
    bool    occupied;
    bool    deleted;
} MapEntry;

typedef struct {
    MapEntry *entries;
    size_t    size;
    size_t    capacity;
} HashMap;

static uint64_t fnv1a(const char *s) {
    uint64_t h = 14695981039346656037ULL;
    for (; *s; ++s) h = (h ^ (uint8_t)*s) * 1099511628211ULL;
    return h;
}

HashMap *map_new(void) {
    HashMap *m = calloc(1, sizeof(HashMap));
    if (!m) return NULL;
    m->entries  = calloc(MAP_INIT_CAP, sizeof(MapEntry));
    m->capacity = MAP_INIT_CAP;
    return m;
}

static bool map_insert_raw(MapEntry *entries, size_t cap,
                            const char *key, void *value) {
    uint64_t idx = fnv1a(key) % cap;
    for (size_t i = 0; i < cap; ++i) {
        MapEntry *e = &entries[(idx + i) % cap];
        if (!e->occupied || e->deleted) {
            e->key      = (char *)key;
            e->value    = value;
            e->occupied = true;
            e->deleted  = false;
            return true;
        }
        if (strcmp(e->key, key) == 0) {
            e->value = value;
            return true;
        }
    }
    return false;
}

bool map_put(HashMap *m, const char *key, void *value) {
    if ((double)m->size / m->capacity >= MAP_LOAD) {
        size_t    new_cap = m->capacity * 2;
        MapEntry *new_e   = calloc(new_cap, sizeof(MapEntry));
        if (!new_e) return false;
        for (size_t i = 0; i < m->capacity; ++i) {
            if (m->entries[i].occupied && !m->entries[i].deleted)
                map_insert_raw(new_e, new_cap,
                               m->entries[i].key, m->entries[i].value);
        }
        free(m->entries);
        m->entries  = new_e;
        m->capacity = new_cap;
    }
    if (map_insert_raw(m->entries, m->capacity, key, value))
        ++m->size;
    return true;
}

void *map_get(const HashMap *m, const char *key) {
    uint64_t idx = fnv1a(key) % m->capacity;
    for (size_t i = 0; i < m->capacity; ++i) {
        MapEntry *e = &m->entries[(idx + i) % m->capacity];
        if (!e->occupied) return NULL;
        if (!e->deleted && strcmp(e->key, key) == 0) return e->value;
    }
    return NULL;
}

void map_free(HashMap *m) {
    free(m->entries);
    free(m);
}

/* -------------------------------------------------------------------------
 * String helpers
 * ---------------------------------------------------------------------- */

char *str_dup(const char *s) {
    size_t n = strlen(s) + 1;
    char  *d = malloc(n);
    if (d) memcpy(d, s, n);
    return d;
}

char *str_trim(char *s) {
    while (*s == ' ' || *s == '\\t') ++s;
    char *end = s + strlen(s) - 1;
    while (end > s && (*end == ' ' || *end == '\\t' || *end == '\\n')) --end;
    *(end + 1) = '\\0';
    return s;
}

int str_starts_with(const char *s, const char *prefix) {
    return strncmp(s, prefix, strlen(prefix)) == 0;
}

/* -------------------------------------------------------------------------
 * Simple linked list
 * ---------------------------------------------------------------------- */

typedef struct Node {
    void        *data;
    struct Node *next;
} Node;

Node *node_new(void *data) {
    Node *n = malloc(sizeof(Node));
    if (!n) return NULL;
    n->data = data;
    n->next = NULL;
    return n;
}

void list_prepend(Node **head, void *data) {
    Node *n = node_new(data);
    if (!n) return;
    n->next = *head;
    *head   = n;
}

void list_free(Node *head, void (*free_data)(void *)) {
    while (head) {
        Node *next = head->next;
        if (free_data) free_data(head->data);
        free(head);
        head = next;
    }
}

/* -------------------------------------------------------------------------
 * Math helpers
 * ---------------------------------------------------------------------- */

int clamp_i(int v, int lo, int hi) {
    if (v < lo) return lo;
    if (v > hi) return hi;
    return v;
}

double lerp(double a, double b, double t) {
    return a + (b - a) * t;
}

uint32_t next_power_of_two(uint32_t n) {
    --n;
    n |= n >> 1;  n |= n >> 2;
    n |= n >> 4;  n |= n >> 8;
    n |= n >> 16;
    return n + 1;
}
`,iN=Cg,aN=`/*
 * alloc.c - Arena allocator, string builder, and binary search utilities.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>

/* -------------------------------------------------------------------------
 * Arena allocator — bump-pointer allocator; free everything at once.
 * ---------------------------------------------------------------------- */

typedef struct {
    uint8_t *buf;
    size_t   pos;
    size_t   cap;
} Arena;

Arena *arena_new(size_t cap) {
    Arena *a = malloc(sizeof(Arena));
    if (!a) return NULL;
    a->buf = malloc(cap);
    a->pos = 0;
    a->cap = cap;
    return a;
}

void *arena_alloc(Arena *a, size_t size) {
    size = (size + 7) & ~(size_t)7;   /* align to 8 bytes */
    if (a->pos + size > a->cap) return NULL;
    void *p = a->buf + a->pos;
    a->pos += size;
    return p;
}

void arena_reset(Arena *a) { a->pos = 0; }

void arena_free(Arena *a) {
    free(a->buf);
    free(a);
}

/* -------------------------------------------------------------------------
 * String builder — growable byte buffer with a null terminator.
 * ---------------------------------------------------------------------- */

typedef struct {
    char  *buf;
    size_t len;
    size_t cap;
} StrBuf;

StrBuf *strbuf_new(void) {
    StrBuf *sb = malloc(sizeof(StrBuf));
    if (!sb) return NULL;
    sb->buf    = malloc(64);
    sb->len    = 0;
    sb->cap    = 64;
    sb->buf[0] = '\\0';
    return sb;
}

static bool strbuf_grow(StrBuf *sb, size_t need) {
    if (sb->len + need < sb->cap) return true;
    size_t new_cap = sb->cap * 2;
    while (new_cap < sb->len + need + 1) new_cap *= 2;
    char *nb = realloc(sb->buf, new_cap);
    if (!nb) return false;
    sb->buf = nb;
    sb->cap = new_cap;
    return true;
}

bool strbuf_append(StrBuf *sb, const char *s) {
    size_t n = strlen(s);
    if (!strbuf_grow(sb, n)) return false;
    memcpy(sb->buf + sb->len, s, n + 1);
    sb->len += n;
    return true;
}

bool strbuf_append_char(StrBuf *sb, char c) {
    if (!strbuf_grow(sb, 1)) return false;
    sb->buf[sb->len++] = c;
    sb->buf[sb->len]   = '\\0';
    return true;
}

const char *strbuf_str(const StrBuf *sb) { return sb->buf; }
size_t      strbuf_len(const StrBuf *sb) { return sb->len; }

void strbuf_reset(StrBuf *sb) {
    sb->len    = 0;
    sb->buf[0] = '\\0';
}

void strbuf_free(StrBuf *sb) {
    free(sb->buf);
    free(sb);
}

/* -------------------------------------------------------------------------
 * Binary search helpers (operate on sorted int arrays).
 * ---------------------------------------------------------------------- */

/* Return the leftmost index where target could be inserted to keep order. */
int bisect_left(const int *arr, int n, int target) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < target) lo = mid + 1;
        else                   hi = mid;
    }
    return lo;
}

/* Return the rightmost index where target could be inserted to keep order. */
int bisect_right(const int *arr, int n, int target) {
    int lo = 0, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] <= target) lo = mid + 1;
        else                    hi = mid;
    }
    return lo;
}

/* Reverse n bytes in-place. */
void reverse_bytes(uint8_t *buf, size_t n) {
    for (size_t i = 0, j = n - 1; i < j; ++i, --j) {
        uint8_t tmp = buf[i];
        buf[i] = buf[j];
        buf[j] = tmp;
    }
}

/* Count Unicode scalar values (not bytes) in a UTF-8 string. */
size_t count_utf8_chars(const char *s) {
    size_t n = 0;
    while (*s) {
        if ((*s & 0xC0) != 0x80) ++n;
        ++s;
    }
    return n;
}

/* Return a non-negative hash of a null-terminated string (FNV-1a). */
uint32_t str_hash32(const char *s) {
    uint32_t h = 2166136261u;
    for (; *s; ++s) h = (h ^ (uint8_t)*s) * 16777619u;
    return h;
}
`,cN=`/**
 * result.hpp - Lightweight error-or-value type.
 */
#pragma once
#include <optional>
#include <stdexcept>
#include <string>

namespace utils {

template <typename T, typename E = std::string>
class Result {
public:
    static Result Ok(T v)  { return Result(std::move(v), std::nullopt); }
    static Result Err(E e) { return Result(std::nullopt, std::move(e)); }

    bool      ok()    const { return val_.has_value(); }
    bool      err()   const { return !ok(); }
    const T&  value() const { return val_.value(); }
    const E&  error() const { return err_.value(); }

    T unwrap() {
        if (!ok()) throw std::runtime_error("called unwrap on Err result");
        return std::move(*val_);
    }

private:
    Result(std::optional<T> v, std::optional<E> e)
        : val_(std::move(v)), err_(std::move(e)) {}
    std::optional<T> val_;
    std::optional<E> err_;
};

} // namespace utils
`,Eg=`/**
 * utils.cpp - General-purpose C++ utility library.
 */

#include <algorithm>
#include <cassert>
#include <cstdint>
#include <functional>
#include <memory>
#include <optional>
#include <span>
#include <stdexcept>
#include <string>
#include <string_view>
#include <unordered_map>
#include <vector>

namespace utils {

// ---------------------------------------------------------------------------
// Result<T, E> — lightweight error-or-value type
// ---------------------------------------------------------------------------

template <typename T, typename E = std::string>
class Result {
public:
    static Result Ok(T v)  { return Result(std::move(v), std::nullopt); }
    static Result Err(E e) { return Result(std::nullopt, std::move(e)); }

    bool      ok()    const { return val_.has_value(); }
    bool      err()   const { return !ok(); }
    const T&  value() const { return val_.value(); }
    const E&  error() const { return err_.value(); }
    T         unwrap()      { if (!ok()) throw std::runtime_error(error()); return std::move(*val_); }

private:
    Result(std::optional<T> v, std::optional<E> e)
        : val_(std::move(v)), err_(std::move(e)) {}
    std::optional<T> val_;
    std::optional<E> err_;
};

// ---------------------------------------------------------------------------
// RingBuffer<T, N> — fixed-capacity circular buffer
// ---------------------------------------------------------------------------

template <typename T, std::size_t N>
class RingBuffer {
    static_assert(N > 0, "RingBuffer size must be positive");
public:
    void push(T item) {
        data_[head_] = std::move(item);
        head_ = (head_ + 1) % N;
        if (full_) tail_ = head_;
        else       full_ = head_ == tail_;
    }

    std::optional<T> pop() {
        if (empty()) return std::nullopt;
        T item = std::move(data_[tail_]);
        tail_ = (tail_ + 1) % N;
        full_ = false;
        return item;
    }

    bool   empty() const { return !full_ && head_ == tail_; }
    bool   full()  const { return full_; }
    size_t size()  const {
        if (full_) return N;
        return head_ >= tail_ ? head_ - tail_ : N + head_ - tail_;
    }

private:
    std::array<T, N> data_{};
    std::size_t      head_ = 0, tail_ = 0;
    bool             full_ = false;
};

// ---------------------------------------------------------------------------
// LRU cache
// ---------------------------------------------------------------------------

template <typename K, typename V>
class LRUCache {
public:
    explicit LRUCache(size_t cap) : cap_(cap) { assert(cap > 0); }

    std::optional<V> get(const K& key) {
        auto it = map_.find(key);
        if (it == map_.end()) return std::nullopt;
        // move to front of order list
        order_.erase(it->second.second);
        order_.push_front(key);
        it->second.second = order_.begin();
        return it->second.first;
    }

    void put(const K& key, V value) {
        auto it = map_.find(key);
        if (it != map_.end()) {
            order_.erase(it->second.second);
            map_.erase(it);
        } else if (map_.size() == cap_) {
            map_.erase(order_.back());
            order_.pop_back();
        }
        order_.push_front(key);
        map_[key] = { std::move(value), order_.begin() };
    }

    size_t size()     const { return map_.size(); }
    bool   contains(const K& k) const { return map_.count(k) > 0; }

private:
    using OrderIt = typename std::list<K>::iterator;
    size_t                                           cap_;
    std::list<K>                                     order_;
    std::unordered_map<K, std::pair<V, OrderIt>>     map_;
};

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

std::string trim(std::string_view sv) {
    const char* ws = " \\t\\n\\r";
    auto s = sv.find_first_not_of(ws);
    auto e = sv.find_last_not_of(ws);
    if (s == std::string_view::npos) return {};
    return std::string(sv.substr(s, e - s + 1));
}

std::vector<std::string> split(std::string_view sv, char delim) {
    std::vector<std::string> out;
    size_t start = 0;
    for (size_t i = 0; i <= sv.size(); ++i) {
        if (i == sv.size() || sv[i] == delim) {
            out.emplace_back(sv.substr(start, i - start));
            start = i + 1;
        }
    }
    return out;
}

std::string join(std::span<const std::string> parts, std::string_view sep) {
    if (parts.empty()) return {};
    std::string r = parts[0];
    for (size_t i = 1; i < parts.size(); ++i) { r += sep; r += parts[i]; }
    return r;
}

bool starts_with(std::string_view s, std::string_view p) { return s.substr(0, p.size()) == p; }
bool ends_with  (std::string_view s, std::string_view p) {
    return s.size() >= p.size() && s.substr(s.size() - p.size()) == p;
}

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

template <typename T>
T clamp(T v, T lo, T hi) { return std::max(lo, std::min(v, hi)); }

template <typename T>
T lerp(T a, T b, double t) { return static_cast<T>(a + (b - a) * t); }

uint32_t next_pow2(uint32_t n) {
    --n;
    n |= n >> 1;  n |= n >> 2;
    n |= n >> 4;  n |= n >> 8;
    n |= n >> 16;
    return ++n;
}

// ---------------------------------------------------------------------------
// Defer — RAII cleanup guard
// ---------------------------------------------------------------------------

template <typename F>
struct Defer {
    F fn;
    explicit Defer(F f) : fn(std::move(f)) {}
    ~Defer() { fn(); }
};
template <typename F>
Defer<F> defer(F f) { return Defer<F>(std::move(f)); }

} // namespace utils
`,uN=Eg,dN=`/**
 * concurrency.cpp - Thread pool, observable values, and scope guards.
 */

#include <condition_variable>
#include <functional>
#include <future>
#include <mutex>
#include <queue>
#include <stdexcept>
#include <string>
#include <thread>
#include <unordered_map>
#include <vector>

namespace utils {

// ---------------------------------------------------------------------------
// ThreadPool — submit tasks and receive std::future results
// ---------------------------------------------------------------------------

class ThreadPool {
public:
    explicit ThreadPool(size_t threads) : stop_(false) {
        for (size_t i = 0; i < threads; ++i) {
            workers_.emplace_back([this] {
                for (;;) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(mutex_);
                        cv_.wait(lock, [this] { return stop_ || !tasks_.empty(); });
                        if (stop_ && tasks_.empty()) return;
                        task = std::move(tasks_.front());
                        tasks_.pop();
                    }
                    task();
                }
            });
        }
    }

    template <typename F, typename... Args>
    auto submit(F&& f, Args&&... args)
        -> std::future<typename std::invoke_result<F, Args...>::type>
    {
        using R = typename std::invoke_result<F, Args...>::type;
        auto bound = std::bind(std::forward<F>(f), std::forward<Args>(args)...);
        auto task  = std::make_shared<std::packaged_task<R()>>(std::move(bound));
        std::future<R> fut = task->get_future();
        {
            std::lock_guard<std::mutex> lock(mutex_);
            if (stop_) throw std::runtime_error("ThreadPool is stopped");
            tasks_.emplace([task] { (*task)(); });
        }
        cv_.notify_one();
        return fut;
    }

    size_t pending() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return tasks_.size();
    }

    ~ThreadPool() {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            stop_ = true;
        }
        cv_.notify_all();
        for (auto& w : workers_) w.join();
    }

    ThreadPool(const ThreadPool&) = delete;
    ThreadPool& operator=(const ThreadPool&) = delete;

private:
    std::vector<std::thread>          workers_;
    std::queue<std::function<void()>> tasks_;
    mutable std::mutex                mutex_;
    std::condition_variable           cv_;
    bool                              stop_;
};

// ---------------------------------------------------------------------------
// Observable<T> — a value that notifies subscribers on change
// ---------------------------------------------------------------------------

template <typename T>
class Observable {
public:
    using Callback = std::function<void(const T&)>;

    explicit Observable(T initial) : value_(std::move(initial)) {}

    const T& get() const { return value_; }

    void set(T value) {
        value_ = std::move(value);
        for (auto& [id, cb] : subscribers_) {
            cb(value_);
        }
    }

    size_t subscribe(Callback cb) {
        size_t id = next_id_++;
        subscribers_.emplace(id, std::move(cb));
        return id;
    }

    void unsubscribe(size_t id) {
        subscribers_.erase(id);
    }

    size_t subscriber_count() const { return subscribers_.size(); }

private:
    T                                    value_;
    std::unordered_map<size_t, Callback> subscribers_;
    size_t                               next_id_ = 0;
};

// ---------------------------------------------------------------------------
// ScopeGuard — run a cleanup function on scope exit (dismissable)
// ---------------------------------------------------------------------------

template <typename F>
class ScopeGuard {
public:
    explicit ScopeGuard(F fn) : fn_(std::move(fn)), active_(true) {}
    ~ScopeGuard() { if (active_) fn_(); }
    void dismiss() noexcept { active_ = false; }

    ScopeGuard(const ScopeGuard&) = delete;
    ScopeGuard& operator=(const ScopeGuard&) = delete;
    ScopeGuard(ScopeGuard&&) = default;

private:
    F    fn_;
    bool active_;
};

template <typename F>
ScopeGuard<F> make_scope_guard(F f) {
    return ScopeGuard<F>(std::move(f));
}

} // namespace utils
`,mN=`Lorem Ipsum — De Finibus Bonorum et Malorum

  I. The Nature of Pleasure and Pain

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

  II. On the Pursuit of Virtue

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
sequi nesciunt.

  — Cicero, 45 BC
`,Tg=`Lorem Ipsum — De Finibus Bonorum et Malorum
Translated excerpt, formatted for practice.

══════════════════════════════════════════════════════════════════

  Part I. Introduction to Philosophy

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur.

  1.1 On the Nature of Good

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
veritatis et quasi architecto beatae vitae dicta sunt explicabo.

  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
  fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
  sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
  sit amet, consectetur, adipisci velit.

  1.2 On the Nature of Evil

Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
nisi ut aliquid ex ea commodi consequatur?

══════════════════════════════════════════════════════════════════

  Part II. The Virtuous Life

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus
qui blanditiis praesentium voluptatum deleniti atque corrupti.

  2.1 Courage and Wisdom

Quos dolores et quas molestias excepturi sint occaecati cupiditate non
provident, similique sunt in culpa qui officia deserunt mollitia animi, id
est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
distinctio.

  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
  impedit quo minus id quod maxime placeat facere possimus, omnis voluptas
  assumenda est, omnis dolor repellendus.

  2.2 Justice and Temperance

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus
saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis.

══════════════════════════════════════════════════════════════════

  — Cicero, De Finibus Bonorum et Malorum, 45 BC
`,fN=`Lorem Ipsum — De Finibus Bonorum et Malorum
A comprehensive excerpt for advanced practice sessions.

══════════════════════════════════════════════════════════════════════════

  BOOK I — The Nature of Pleasure

  Chapter 1. The Foundations of Epicurean Thought

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
est laborum et dolorum fuga.

  Chapter 2. On the Pursuit of Happiness

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
  consectetur, adipisci velit, sed quia non numquam eius modi tempora
  incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

  Chapter 3. The Role of the Senses

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem
vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
pariatur?

──────────────────────────────────────────────────────────────────────────

  BOOK II — Stoic Philosophy and Virtue

  Chapter 4. On Courage

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
praesentium voluptatum deleniti atque corrupti quos dolores et quas
molestias excepturi sint occaecati cupiditate non provident, similique sunt
in culpa qui officia deserunt mollitia animi, id est laborum et dolorum.

  Fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam
  libero tempore, cum soluta nobis est eligendi optio cumque nihil
  impedit quo minus id quod maxime placeat facere possimus.

  Chapter 5. On Wisdom and Knowledge

Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem
quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet
ut et voluptates repudiandae sint et molestiae non recusandae. Itaque
earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus
maiores alias consequatur aut perferendis doloribus asperiores repellat.

  Chapter 6. The Examined Life

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel sapien
non lectus dignissim vehicula. Vestibulum ante ipsum primis in faucibus orci
luctus et ultrices posuere cubilia curae. Aenean commodo ligula eget dolor.

  Aenean massa. Cum sociis natoque penatibus et magnis dis parturient
  montes, nascetur ridiculus mus. Donec quam felis, ultricies nec,
  pellentesque eu, pretium quis, sem.

──────────────────────────────────────────────────────────────────────────

  BOOK III — Justice and Society

  Chapter 7. The Social Contract

Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet
nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.

  Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
  vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat
  vitae, eleifend ac, enim.

  Chapter 8. Rights and Obligations

Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.

  Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum
  rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed.

  Chapter 9. The Common Good

Ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.
Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero
venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros.

──────────────────────────────────────────────────────────────────────────

  BOOK IV — Conclusions and Reflections

  Chapter 10. Synthesis

Faucibus fermentum. Pellentesque ut neque. Pellentesque habitant morbi
tristique senectus et netus et malesuada fames ac turpis egestas. In dui
magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis
tortor malesuada pretium. Pellentesque auctor neque.

  Nulla vulputate aliquam lectus. Sed augue ipsum, egestas nec, vestibulum
  et, malesuada adipiscing, dui. Vestibulum ante ipsum primis in faucibus
  orci luctus et ultrices posuere cubilia curae.

  Chapter 11. Final Meditations

Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In
porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque
at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem
venenatis eleifend. Ut nonummy.

══════════════════════════════════════════════════════════════════════════

  — Cicero, De Finibus Bonorum et Malorum, 45 BC
  Translated and formatted for educational use.
`,pN={go:Qw,rust:Jw,python:tN,typescript:lN,c:iN,cpp:uN,lorem:Tg},hN={go:{short:Kw,medium:Ng,long:Yw},rust:{short:Xw,medium:kg,long:Zw},python:{short:eN,medium:Sg,long:nN},typescript:{short:rN,medium:jg,long:sN},c:{short:oN,medium:Cg,long:aN},cpp:{short:cN,medium:Eg,long:dN},lorem:{short:mN,medium:Tg,long:fN}};function Mg(e){return pN[e]}function _g(e,t){return hN[e][t]}const gN={go:"go",rust:"rust",python:"python",typescript:"typescript",c:"c",cpp:"cpp",lorem:"plaintext"},xN={go:"utils.go",rust:"utils.rs",python:"utils.py",typescript:"utils.ts",c:"utils.c",cpp:"utils.cpp",lorem:"lorem.txt"};function yN({language:e,onCommandExecuted:t,onKeyDisplay:n,monacoActions:r,handicaps:s,isGamePlaying:o=!0}){const[i,a]=f.useState(1),{editorRef:c,statusRef:u,getVisibleRange:d}=Un({onCommandExecuted:t,onKeyDisplay:n,language:gN[e],defaultValue:Mg(e),monacoActions:r,onCursorChange:s!=null&&s.opacityFade?p=>a(p.lineNumber):void 0});return jl(s,o),l.jsxs("div",{className:"flex flex-col h-full bg-gray-950",children:[l.jsxs("div",{className:"flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700",children:[l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:xN[e]}),l.jsx("span",{className:"ml-auto text-xs text-gray-500 font-mono uppercase",children:e})]}),l.jsxs("div",{className:"flex-1 min-h-0 relative",children:[l.jsx("div",{ref:c,className:"h-full"}),(s==null?void 0:s.snowEffect)&&l.jsx(Cl,{}),(s==null?void 0:s.opacityFade)&&l.jsx(El,{cursorLine:i,getVisibleRange:d})]}),l.jsx("div",{ref:u,className:"h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs font-mono text-gray-400"})]})}function vN({startedAt:e,timeLimit:t,size:n=44}){const[r,s]=f.useState(1),o=f.useRef(null);f.useEffect(()=>{const p=()=>{const m=Date.now()-e,h=Math.max(0,1-m/t);s(h),h>0&&(o.current=requestAnimationFrame(p))};return o.current=requestAnimationFrame(p),()=>{o.current&&cancelAnimationFrame(o.current)}},[e,t]);const i=(n-4)/2,a=2*Math.PI*i,c=a*(1-r),u=r>.5?"#22c55e":r>.25?"#f59e0b":"#ef4444",d=Math.ceil(Math.max(0,(t-(Date.now()-e))/1e3));return l.jsxs("svg",{width:n,height:n,className:"flex-shrink-0 -rotate-90",children:[l.jsx("circle",{cx:n/2,cy:n/2,r:i,fill:"none",stroke:"#374151",strokeWidth:3}),l.jsx("circle",{cx:n/2,cy:n/2,r:i,fill:"none",stroke:u,strokeWidth:3,strokeDasharray:a,strokeDashoffset:c,strokeLinecap:"round",style:{transition:"stroke 0.3s"}}),l.jsx("text",{x:n/2,y:n/2,textAnchor:"middle",dominantBaseline:"central",fill:"white",fontSize:n*.28,className:"rotate-90 font-mono",transform:`rotate(90, ${n/2}, ${n/2})`,style:{fontFamily:"monospace"},children:d})]})}function bN(e){const t=Wi(e);return{color:t,backgroundColor:t.replace("52%)","14%)").replace("70%,","55%,"),borderColor:t.replace("52%)","35%)")}}function Yi({challenges:e,onMarkUnsupported:t}){const n=e.filter(s=>s.status==="active"),r=e.filter(s=>s.status!=="active");return l.jsxs("div",{className:"space-y-3",children:[l.jsxs("h2",{className:"text-gray-400 text-xs font-mono uppercase tracking-wider",children:["Active Challenges (",n.length,")"]}),n.length===0&&l.jsx("p",{className:"text-gray-600 text-sm font-mono italic",children:"Loading challenges…"}),n.map(s=>l.jsx(wN,{challenge:s,onMarkUnsupported:t},s.id)),r.length>0&&l.jsxs(l.Fragment,{children:[l.jsx("h2",{className:"text-gray-600 text-xs font-mono uppercase tracking-wider mt-4",children:"Recent"}),r.slice(-3).map(s=>l.jsx(NN,{challenge:s},s.id))]})]})}function wN({challenge:e,onMarkUnsupported:t}){const n=f.useRef(e.status),r=f.useRef(null);return f.useEffect(()=>{if(e.status!==n.current&&r.current){const s=e.status==="completed"?"challenge-completed":"challenge-failed";r.current.classList.add(s);const o=setTimeout(()=>{var i;return(i=r.current)==null?void 0:i.classList.remove(s)},500);return n.current=e.status,()=>clearTimeout(o)}},[e.status]),l.jsxs("div",{ref:r,className:"bg-gray-800 rounded-lg p-3 border border-gray-700 flex gap-3 items-start",children:[l.jsx(vN,{startedAt:e.startedAt,timeLimit:e.timeLimit,size:44}),l.jsxs("div",{className:"flex-1 min-w-0",children:[l.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap mb-1",children:[l.jsx("span",{className:"text-xs px-2 py-0.5 rounded font-mono border",style:bN(e.category),children:e.category}),l.jsxs("span",{className:"text-xs text-gray-500 font-mono",children:["Lv",e.level]}),e.isVerification&&l.jsx("span",{className:"text-xs bg-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded font-mono",children:"🔍 verify"}),e.showSolution&&l.jsx("span",{className:"text-xs bg-purple-900/50 text-purple-400 px-1.5 py-0.5 rounded font-mono",children:"guided"})]}),l.jsx("p",{className:"text-white text-sm font-mono leading-relaxed",children:e.question}),e.showSolution&&e.solution.length>0&&l.jsx("div",{className:"mt-2 flex flex-wrap gap-1",children:e.solution.map((s,o)=>l.jsx("kbd",{className:"inline-block px-2 py-1 bg-gray-700 text-yellow-300 font-mono text-xs rounded border border-gray-500 shadow-sm",children:s},o))}),l.jsx("div",{className:"mt-2 flex justify-end",children:l.jsx("button",{className:"text-xs font-mono px-1.5 py-0.5 rounded bg-transparent text-gray-600 hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-800 transition-colors",onClick:s=>{s.stopPropagation(),t(e.commandId)},children:"[✕ not supported]"})})]})]})}function NN({challenge:e}){const t=e.status==="completed";return l.jsxs("div",{className:`rounded-lg p-3 border flex gap-3 items-center opacity-60 ${t?"border-green-800 bg-green-900/20":"border-red-800 bg-red-900/20"}`,children:[l.jsx("span",{className:"text-xl flex-shrink-0",children:t?"✓":"✗"}),l.jsxs("div",{className:"flex-1 min-w-0",children:[l.jsx("p",{className:"text-sm font-mono text-gray-400 truncate",children:e.question}),t&&e.pointsEarned>0&&l.jsxs("p",{className:"text-xs text-green-400 font-mono",children:["+",e.pointsEarned," pts"]})]})]})}function Xi({score:e,combo:t}){return l.jsxs("div",{className:"flex-1",children:[l.jsx("div",{className:"text-3xl font-mono font-bold text-white",children:e.toLocaleString()}),l.jsx("div",{className:"text-xs text-gray-500 font-mono uppercase tracking-wider",children:"Score"}),t.count>=2&&l.jsxs("div",{className:"mt-1 flex items-center gap-2",children:[l.jsxs("span",{className:"text-orange-400 font-mono font-bold text-sm",children:[t.count,"x COMBO"]}),l.jsxs("span",{className:"text-xs bg-orange-900 text-orange-300 px-1.5 py-0.5 rounded font-mono",children:["×",t.multiplier.toFixed(1)]})]})]})}function Ji({ceiling:e,levelPct:t}){return l.jsxs("div",{className:"flex-1",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsxs("span",{className:"text-2xl font-mono font-bold text-yellow-400",children:["Lv",e]}),l.jsx("span",{className:"text-xs text-gray-500 font-mono",children:"ceiling"})]}),l.jsx("div",{className:"mt-1 w-full bg-gray-700 rounded-full h-2",children:l.jsx("div",{className:"bg-yellow-500 h-2 rounded-full transition-all duration-300",style:{width:`${Math.min(100,t)}%`}})}),l.jsxs("div",{className:"text-xs text-gray-500 font-mono mt-0.5",children:[Math.round(t),"% to next level"]})]})}const kN={lightning:{bg:"bg-yellow-400 text-black",icon:Zt},fast:{bg:"bg-blue-500 text-white",icon:cw},good:{bg:"bg-green-600 text-white",icon:di},completed:{bg:"bg-gray-600 text-white",icon:di},failed:{bg:"bg-red-700 text-white",icon:$s},combo:{bg:"bg-purple-600 text-white",icon:fg},levelup:{bg:"bg-cyan-400 text-black",icon:xg}};function SN({notifications:e}){const[t,n]=f.useState([]),r=f.useRef(new Set);f.useEffect(()=>{const i=e.filter(a=>!r.current.has(a.id));i.length!==0&&(i.forEach(a=>r.current.add(a.id)),n(a=>[...a,...i.map(c=>({...c,exiting:!1}))]))},[e]),f.useEffect(()=>{if(t.length===0)return;const a=Math.min(...t.map(u=>u.expiresAt))-Date.now(),c=setTimeout(()=>{const u=Date.now();n(d=>d.map(p=>p.expiresAt<=u?{...p,exiting:!0}:p)),setTimeout(()=>{n(d=>d.filter(p=>!p.exiting))},250)},Math.max(0,a));return()=>clearTimeout(c)},[t]);const s=t.filter(i=>i.type==="levelup"),o=t.filter(i=>i.type!=="levelup");return l.jsxs(l.Fragment,{children:[o.length>0&&l.jsx("div",{className:"fixed top-4 right-4 flex flex-col gap-2 pointer-events-none z-50","aria-live":"polite","aria-atomic":"false",children:o.map(i=>{const a=kN[i.type]??{bg:"bg-gray-700 text-white",icon:null},c=a.icon;return l.jsxs("div",{className:`px-3 py-2 rounded-lg font-mono font-bold text-sm shadow-xl flex items-center gap-1.5 ${a.bg} ${i.exiting?"toast-exit":"toast-enter"}`,children:[c&&l.jsx(c,{className:"w-4 h-4 flex-shrink-0"}),l.jsx("span",{children:i.text})]},i.id)})}),s.map(i=>l.jsx("div",{"aria-live":"assertive","aria-atomic":"true",className:`fixed top-1/4 left-1/2 -translate-x-1/2 z-50 pointer-events-none levelup-banner ${i.exiting?"opacity-0 transition-opacity duration-300":""}`,children:l.jsxs("div",{className:"bg-cyan-400 text-black font-mono font-extrabold text-2xl px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-2",children:[l.jsx(xg,{className:"w-7 h-7"}),i.text]})},i.id))]})}const jN=[{id:"none",label:"None"},{id:"first_only",label:"First only"},{id:"after_failure",label:"After failure"},{id:"first_then_failure",label:"First + on failure"},{id:"alternating",label:"Alternating"},{id:"all",label:"Always"}];function CN({settings:e,onUpdate:t,triggerRef:n,isOpen:r,onToggle:s}){const[o,i]=f.useState(!1),a=r!==void 0?r:o,c=d=>{r!==void 0&&s?(typeof d=="function"?d(a):d)!==a&&s():i(d)},u=f.useRef(null);return f.useEffect(()=>{function d(p){(p.metaKey||p.ctrlKey)&&p.shiftKey&&p.key==="P"&&(p.preventDefault(),c(m=>!m)),p.key==="Escape"&&c(!1)}return window.addEventListener("keydown",d),()=>window.removeEventListener("keydown",d)},[]),f.useEffect(()=>{var d,p;a?(d=u.current)==null||d.focus():(p=n==null?void 0:n.current)==null||p.focus()},[a,n]),a?l.jsxs("div",{className:"fixed inset-0 z-50 flex items-start justify-center pt-16 pointer-events-none",children:[l.jsx("div",{className:"absolute inset-0 bg-black/50 pointer-events-auto",onClick:()=>c(!1)}),l.jsxs("div",{className:"relative z-10 bg-gray-900 border border-gray-600 rounded-xl shadow-2xl w-full max-w-sm pointer-events-auto",role:"dialog","aria-modal":"true","aria-label":"Settings",children:[l.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-b border-gray-700",children:[l.jsx("span",{className:"text-white font-mono font-bold text-sm",children:"Settings"}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-gray-500 font-mono text-xs",children:"F1 palette · Esc to close"}),l.jsx("button",{"aria-label":"Close settings",onClick:()=>c(!1),className:"text-gray-400 hover:text-white font-mono text-sm px-1 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400",children:"×"})]})]}),l.jsxs("div",{className:"p-4 space-y-4",children:[l.jsxs("div",{children:[l.jsx("p",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"Guided Mode"}),l.jsx("div",{className:"space-y-1",children:jN.map((d,p)=>l.jsxs("label",{className:`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${e.guidedMode===d.id?"bg-purple-900/40 text-purple-300":"text-gray-400 hover:bg-gray-800"}`,children:[l.jsx("input",{type:"radio",name:"live-guided",ref:p===0?u:void 0,checked:e.guidedMode===d.id,onChange:()=>t({guidedMode:d.id}),className:"accent-purple-500"}),l.jsx("span",{className:"font-mono text-sm",children:d.label})]},d.id))})]}),l.jsx("hr",{className:"border-gray-700"}),l.jsxs("div",{children:[l.jsx("p",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"Keyboard Shortcuts"}),l.jsxs("div",{className:"grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-center",children:[l.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap",children:"⌘⇧P"}),l.jsx("span",{className:"font-mono text-xs text-gray-500",children:"Open / close settings"}),l.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap",children:"?"}),l.jsx("span",{className:"font-mono text-xs text-gray-500",children:"Keyboard shortcuts overlay"}),l.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap",children:"ℹ"}),l.jsx("span",{className:"font-mono text-xs text-gray-500",children:"Game info modal"}),l.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap",children:"✕ Quit"}),l.jsx("span",{className:"font-mono text-xs text-gray-500",children:"Return to setup screen"}),l.jsx("kbd",{className:"px-1.5 py-0.5 rounded bg-gray-800 border border-gray-600 font-mono text-xs text-gray-300 whitespace-nowrap",children:"Esc"}),l.jsx("span",{className:"font-mono text-xs text-gray-500",children:"Close overlays"})]})]})]})]})]}):null}function EN({log:e}){const t=f.useRef(null);return f.useEffect(()=>{const n=t.current;n&&(n.scrollLeft=n.scrollWidth)},[e]),e?l.jsx("div",{className:"fixed bottom-2 right-2 pointer-events-none select-none z-40",style:{maxWidth:"45vw"},children:l.jsx("div",{ref:t,className:"overflow-hidden whitespace-nowrap font-mono text-xs",style:{color:"rgba(148,163,184,0.35)"},children:e})}):null}function TN({onClose:e}){const t=f.useRef(null);return f.useEffect(()=>{var n;(n=t.current)==null||n.focus()},[]),f.useEffect(()=>{function n(r){r.key==="Escape"&&(r.preventDefault(),e())}return document.addEventListener("keydown",n),()=>document.removeEventListener("keydown",n)},[e]),l.jsx("div",{className:"fixed inset-0 bg-black/80 z-50 flex items-center justify-center",onClick:e,children:l.jsxs("div",{ref:t,tabIndex:-1,role:"dialog","aria-modal":"true","aria-labelledby":"shortcuts-title",className:"bg-gray-900 border border-gray-600 rounded-xl p-6 max-w-md w-full mx-4 focus:outline-none",onClick:n=>n.stopPropagation(),children:[l.jsx("h2",{id:"shortcuts-title",className:"text-white font-mono font-bold text-lg mb-5",children:"Keyboard Shortcuts"}),l.jsxs("div",{className:"space-y-5",children:[l.jsxs("div",{children:[l.jsx("p",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"General"}),l.jsx("table",{className:"w-full text-sm font-mono",children:l.jsx("tbody",{className:"space-y-1",children:[["?","Open this help overlay"],["Esc","Close overlays / Exit insert mode"],["⌘⇧P","Open settings drawer"],["Tab","Navigate between controls"],["Enter","Confirm / Submit (on setup screen)"],["← Back","Return to previous screen"]].map(([n,r])=>l.jsxs("tr",{className:"border-b border-gray-800",children:[l.jsx("td",{className:"py-1.5 pr-4 text-yellow-300 whitespace-nowrap",children:n}),l.jsx("td",{className:"py-1.5 text-gray-300",children:r})]},n))})})]}),l.jsxs("div",{children:[l.jsx("p",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"In-game"}),l.jsx("table",{className:"w-full text-sm font-mono",children:l.jsx("tbody",{children:[["F1","Monaco command palette (editor commands)"],["⌘⇧P","Toggle guided mode (live)"],["ℹ","View current game config"],["✕ Quit","Return to setup"]].map(([n,r])=>l.jsxs("tr",{className:"border-b border-gray-800",children:[l.jsx("td",{className:"py-1.5 pr-4 text-yellow-300 whitespace-nowrap",children:n}),l.jsx("td",{className:"py-1.5 text-gray-300",children:r})]},n))})})]})]}),l.jsx("p",{className:"text-gray-600 font-mono text-xs text-center mt-5",children:"Press Esc or click outside to close"})]})})}const Km=120,MN={general:"General",timed_challenge:"Timed Challenge",survival:"Survival"};function _N({state:e,onCommandExecuted:t,onUpdateSettings:n,onQuit:r,onMarkUnsupported:s}){const[o,i]=f.useReducer((y,b)=>({...y,...typeof b=="function"?b(y):b}),{showInfo:!1,showShortcuts:!1,keystrokeLog:"",settingsOpen:!1}),a=f.useRef(null),c=f.useRef(null),u=f.useRef(null),d=f.useMemo(()=>[{id:"vim-arcade.settings.open",label:"Vim Arcade: Open / Close Settings",run:()=>i(y=>({settingsOpen:!y.settingsOpen}))},{id:"vim-arcade.guided.none",label:"Vim Arcade: Guided Mode — None",run:()=>n({guidedMode:"none"})},{id:"vim-arcade.guided.first_only",label:"Vim Arcade: Guided Mode — First only",run:()=>n({guidedMode:"first_only"})},{id:"vim-arcade.guided.after_failure",label:"Vim Arcade: Guided Mode — After failure",run:()=>n({guidedMode:"after_failure"})},{id:"vim-arcade.guided.first_then_failure",label:"Vim Arcade: Guided Mode — First + on failure",run:()=>n({guidedMode:"first_then_failure"})},{id:"vim-arcade.guided.alternating",label:"Vim Arcade: Guided Mode — Alternating",run:()=>n({guidedMode:"alternating"})},{id:"vim-arcade.guided.all",label:"Vim Arcade: Guided Mode — Always",run:()=>n({guidedMode:"all"})}],[n]);f.useEffect(()=>{var y;o.showInfo&&((y=a.current)==null||y.focus())},[o.showInfo]),f.useEffect(()=>{function y(b){const k=b.target;b.key==="?"&&k.tagName!=="INPUT"&&k.tagName!=="TEXTAREA"&&i(N=>({showShortcuts:!N.showShortcuts}))}return document.addEventListener("keydown",y),()=>document.removeEventListener("keydown",y)},[]);const p=f.useCallback(y=>{y.display&&i(b=>{const k=b.keystrokeLog+y.display;return{keystrokeLog:k.length>Km?k.slice(k.length-Km):k}})},[]),m=e.config.mode==="timed_challenge",h=e.config.mode==="survival",g=m&&e.config.timedDurationMs?Math.min(100,e.sessionElapsedMs/e.config.timedDurationMs*100):0,v=m&&e.config.timedDurationMs?Math.max(0,Math.ceil((e.config.timedDurationMs-e.sessionElapsedMs)/1e3)):0,w=e.config.dynamicAssist===null?"off":`${e.config.dynamicAssist}% of limit`,x=e.config.categories===null?"All categories":e.config.categories.join(", ");return l.jsxs("div",{className:"h-full bg-gray-900 flex flex-col overflow-hidden relative",children:[m&&l.jsxs("div",{className:"w-full bg-gray-800 h-1.5 relative",children:[l.jsx("div",{className:"absolute left-0 top-0 h-full bg-blue-500 transition-all duration-100",style:{width:`${100-g}%`}}),l.jsxs("div",{className:"absolute right-2 top-0 -translate-y-full pb-0.5 text-xs text-blue-300 font-mono",children:[v,"s"]})]}),h&&l.jsx("div",{className:"bg-red-900/60 border-b border-red-700 text-center py-1",children:l.jsx("span",{className:"text-red-300 font-mono text-xs uppercase tracking-widest font-bold",children:"⚠ SURVIVAL — one miss ends it"})}),l.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[l.jsx("div",{className:"flex-[3] flex flex-col min-w-0",children:l.jsx(yN,{language:e.language,onCommandExecuted:t,onKeyDisplay:p,monacoActions:d,handicaps:{hjklOnly:e.config.hjklOnly??!1,noHjkl:e.config.noHjkl??!1,opacityFade:e.config.opacityFade??!1,snowEffect:e.config.snowEffect??!1},isGamePlaying:e.status==="playing"})}),l.jsxs("div",{className:"flex-[2] flex flex-col border-l border-gray-700 min-w-0 overflow-y-auto",children:[l.jsxs("div",{className:"p-4 border-b border-gray-700 flex gap-4 items-start",children:[l.jsx(Xi,{score:e.score,combo:e.combo}),l.jsx(Ji,{ceiling:e.ceiling,levelPct:e.levelPct})]}),l.jsxs("div",{className:"px-4 pt-3 pb-1 flex gap-2",children:[l.jsx("button",{onClick:r,className:"text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-400 hover:bg-red-900/50 hover:text-red-300 border border-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400",children:"✕ Quit"}),l.jsx("button",{ref:c,onClick:()=>i({showInfo:!0}),className:"text-xs font-mono px-2 py-1 rounded bg-gray-800 text-gray-400 hover:bg-blue-900/50 hover:text-blue-300 border border-gray-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400",children:"ℹ Info"})]}),l.jsx("div",{className:"flex-1 overflow-y-auto p-4",children:l.jsx(Yi,{challenges:e.activeChallenges,onMarkUnsupported:s})}),l.jsx("div",{className:"px-4 pb-3 text-xs text-gray-600 font-mono text-center",children:"⌘⇧P settings · ? shortcuts"})]})]}),l.jsx(SN,{notifications:e.recentNotifications}),l.jsx(CN,{settings:e.liveSettings,onUpdate:n,triggerRef:u,isOpen:o.settingsOpen,onToggle:()=>i(y=>({settingsOpen:!y.settingsOpen}))}),l.jsx(EN,{log:o.keystrokeLog}),o.showShortcuts&&l.jsx(TN,{onClose:()=>i({showShortcuts:!1})}),o.showInfo&&l.jsx("div",{className:"fixed inset-0 bg-black/70 z-50 flex items-center justify-center",onClick:()=>i({showInfo:!1}),onKeyDown:y=>{var b;y.key==="Escape"&&(i({showInfo:!1}),(b=c.current)==null||b.focus())},children:l.jsxs("div",{ref:a,tabIndex:-1,role:"dialog","aria-modal":"true","aria-labelledby":"info-modal-title",className:"bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4 space-y-3",onClick:y=>y.stopPropagation(),children:[l.jsx("h2",{id:"info-modal-title",className:"text-white font-mono font-bold text-lg mb-4",children:"Game Info"}),l.jsxs("div",{className:"grid grid-cols-2 gap-2 text-sm",children:[l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Mode"}),l.jsx("span",{className:"text-white text-sm font-mono",children:MN[e.config.mode]??e.config.mode}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Language"}),l.jsx("span",{className:"text-white text-sm font-mono",children:e.config.language}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Starting level"}),l.jsx("span",{className:"text-white text-sm font-mono",children:e.config.startingLevel}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Level ceiling"}),l.jsx("span",{className:"text-white text-sm font-mono",children:e.ceiling}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Repetition target"}),l.jsx("span",{className:"text-white text-sm font-mono",children:e.config.repetitionTarget}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Guided mode"}),l.jsx("span",{className:"text-white text-sm font-mono",children:e.config.guidedMode}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Dynamic assist"}),l.jsx("span",{className:"text-white text-sm font-mono",children:w}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Categories"}),l.jsx("span",{className:"text-white text-sm font-mono",children:x}),l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"Concurrent challenges"}),l.jsx("span",{className:"text-white text-sm font-mono",children:e.maxConcurrent})]}),l.jsx("p",{className:"text-gray-500 text-xs font-mono text-center mt-4",children:"Click anywhere to close"})]})})]})}function RN({state:e,onRestart:t,onHighScores:n,onReview:r,reviewCount:s}){const{sessionStats:o,score:i,config:a}=e,c=o.totalChallenges>0?Math.round(o.completed/o.totalChallenges*100):0;return l.jsx("div",{className:"min-h-screen bg-gray-900 flex items-center justify-center p-8",children:l.jsxs("div",{className:"max-w-md w-full space-y-6",children:[l.jsxs("div",{className:"text-center",children:[l.jsx("h1",{className:"text-4xl font-bold text-white font-mono mb-1",children:a.mode==="survival"?"ELIMINATED":"GAME OVER"}),l.jsx("p",{className:"text-gray-500 font-mono text-sm",children:LN(a.mode,e)})]}),l.jsxs("div",{className:"bg-gray-800 rounded-xl p-6 space-y-4",children:[l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"text-5xl font-mono font-bold text-yellow-400",children:i.toLocaleString()}),l.jsx("div",{className:"text-gray-400 text-sm font-mono",children:"Final Score"})]}),l.jsx("hr",{className:"border-gray-700"}),l.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[l.jsx(Wn,{label:"Completed",value:o.completed,color:"text-green-400"}),l.jsx(Wn,{label:"Failed",value:o.failed,color:"text-red-400"}),l.jsx(Wn,{label:"Accuracy",value:`${c}%`,color:"text-blue-400"}),l.jsx(Wn,{label:"Best Combo",value:`${o.bestCombo}×`,color:"text-purple-400"}),l.jsx(Wn,{label:"Duration",value:Ga(e.sessionElapsedMs),color:"text-gray-300"}),l.jsx(Wn,{label:"Level",value:`Lv${e.ceiling}`,color:"text-yellow-500"})]}),a.mode==="survival"&&o.achievedTimeMs>0&&l.jsxs(l.Fragment,{children:[l.jsx("hr",{className:"border-gray-700"}),l.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[l.jsx(Wn,{label:"Survived",value:Ga(o.achievedTimeMs),color:"text-green-300"}),l.jsx(Wn,{label:"Expected",value:Ga(o.expectedTimeMs),color:"text-gray-400"})]})]})]}),l.jsxs("div",{className:"flex gap-3",children:[l.jsx("button",{onClick:t,className:"flex-1 py-4 bg-green-600 hover:bg-green-500 text-white font-mono font-bold text-lg rounded-lg transition-colors uppercase tracking-wider",children:"Play Again"}),l.jsx("button",{onClick:n,className:"px-5 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-sm rounded-lg border border-gray-700",children:"High Scores"})]}),s>0&&l.jsxs("button",{onClick:r,className:"w-full py-3 bg-indigo-900/50 hover:bg-indigo-900/80 text-indigo-300 font-mono text-sm rounded-lg border border-indigo-700 transition-colors",children:["Review session (",s," commands) →"]})]})})}function LN(e,t){return e==="survival"?`You survived ${Math.round(t.sessionStats.achievedTimeMs/1e3)}s before your first miss`:e==="timed_challenge"&&t.config.timedDurationMs?`${t.config.timedDurationMs/6e4}-minute session complete`:"Session complete"}function Ga(e){const t=Math.round(e/1e3);return t<60?`${t}s`:`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}function Wn({label:e,value:t,color:n}){return l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:`text-xl font-mono font-bold ${n}`,children:t}),l.jsx("div",{className:"text-gray-500 text-xs font-mono",children:e})]})}function Sn(e){return{id:`bot-${e.score}-${e.mode}`,username:"vim-bot",timestamp:0,score:0,mode:"general",language:"typescript",startingLevel:3,repetitionTarget:2,guidedMode:"none",challengesCompleted:0,challengesFailed:0,accuracy:.85,sessionDurationMs:0,expectedTimeMs:0,achievedTimeMs:0,isBot:!0,...e}}const IN={general:[Sn({score:3200,accuracy:.92,challengesCompleted:64}),Sn({score:2100,accuracy:.88,challengesCompleted:42}),Sn({score:1400,accuracy:.83,challengesCompleted:28})],timed_challenge:[Sn({mode:"timed_challenge",score:2600,sessionDurationMs:3e5,accuracy:.9,challengesCompleted:52}),Sn({mode:"timed_challenge",score:1700,sessionDurationMs:3e5,accuracy:.86,challengesCompleted:34}),Sn({mode:"timed_challenge",score:1e3,sessionDurationMs:3e5,accuracy:.8,challengesCompleted:20})],survival:[Sn({mode:"survival",score:900,achievedTimeMs:18e4,expectedTimeMs:21e4,accuracy:.9,challengesCompleted:18}),Sn({mode:"survival",score:600,achievedTimeMs:12e4,expectedTimeMs:145e3,accuracy:.85,challengesCompleted:12}),Sn({mode:"survival",score:350,achievedTimeMs:6e4,expectedTimeMs:72e3,accuracy:.78,challengesCompleted:7})]};function jn(e){return{id:`bot-mr-${e.score}-${e.endGoal}`,username:"vim-bot",timestamp:0,endGoal:"timed",score:0,keystrokes:0,sessionDurationMs:0,language:"typescript",isBot:!0,...e}}const ON={timed:[jn({endGoal:"timed",score:32,sessionDurationMs:6e4,keystrokes:240}),jn({endGoal:"timed",score:21,sessionDurationMs:6e4,keystrokes:180}),jn({endGoal:"timed",score:14,sessionDurationMs:6e4,keystrokes:110})],survival:[jn({endGoal:"survival",score:45,sessionDurationMs:18e4,keystrokes:410}),jn({endGoal:"survival",score:28,sessionDurationMs:12e4,keystrokes:260}),jn({endGoal:"survival",score:15,sessionDurationMs:7e4,keystrokes:150})],total_goals:[jn({endGoal:"total_goals",score:10,sessionDurationMs:12e3,keystrokes:85}),jn({endGoal:"total_goals",score:10,sessionDurationMs:18e3,keystrokes:110}),jn({endGoal:"total_goals",score:10,sessionDurationMs:27e3,keystrokes:160})]};function za(e){return{id:`bot-goal-${e.totalPoints}`,username:"vim-bot",timestamp:0,challengeCount:5,difficulty:"medium",solved:5,totalKeystrokes:0,totalElapsedMs:0,totalPoints:0,isBot:!0,...e}}const AN=[za({totalPoints:12500,solved:5,totalElapsedMs:45e3,totalKeystrokes:65}),za({totalPoints:8200,solved:4,totalElapsedMs:72e3,totalKeystrokes:95}),za({totalPoints:4100,solved:3,totalElapsedMs:11e4,totalKeystrokes:140})];function DN(e,t){const n=[...t].sort((o,i)=>e==="survival"?i.achievedTimeMs-o.achievedTimeMs:i.score-o.score),r=IN[e],s=[...n,...r].sort((o,i)=>e==="survival"?i.achievedTimeMs-o.achievedTimeMs:i.score-o.score).slice(0,10);for(;s.length<10;)s.push(null);return s}function PN(e,t){const n=[...t].sort((o,i)=>e==="survival"?i.sessionDurationMs-o.sessionDurationMs:e==="total_goals"?o.sessionDurationMs-i.sessionDurationMs:i.score-o.score),r=ON[e],s=[...n,...r].sort((o,i)=>e==="survival"?i.sessionDurationMs-o.sessionDurationMs:e==="total_goals"?o.sessionDurationMs-i.sessionDurationMs:i.score-o.score).slice(0,10);for(;s.length<10;)s.push(null);return s}function jt(e){return{id:`bot-vimbots-${e.totalScore}`,username:"vim-bot",timestamp:0,difficulty:"medium",levelsCleared:0,totalScore:0,challengeScore:0,gridSize:"medium",isBot:!0,...e}}const FN=[jt({totalScore:800,levelsCleared:3,difficulty:"beginner",gridSize:"small"}),jt({totalScore:400,levelsCleared:1,difficulty:"beginner",gridSize:"tiny"}),jt({totalScore:150,levelsCleared:0,difficulty:"beginner",gridSize:"tiny"}),jt({totalScore:1500,levelsCleared:5,difficulty:"easy",gridSize:"small"}),jt({totalScore:800,levelsCleared:2,difficulty:"easy",gridSize:"small"}),jt({totalScore:300,levelsCleared:0,difficulty:"easy",gridSize:"medium"}),jt({totalScore:2500,levelsCleared:5,difficulty:"medium",gridSize:"medium"}),jt({totalScore:1200,levelsCleared:2,difficulty:"medium",gridSize:"medium"}),jt({totalScore:450,levelsCleared:0,difficulty:"medium",gridSize:"large"}),jt({totalScore:5e3,levelsCleared:10,difficulty:"hard",gridSize:"large"}),jt({totalScore:2200,levelsCleared:4,difficulty:"hard",gridSize:"medium"}),jt({totalScore:800,levelsCleared:1,difficulty:"hard",gridSize:"medium"}),jt({totalScore:9e3,levelsCleared:8,difficulty:"expert",gridSize:"large"}),jt({totalScore:4500,levelsCleared:3,difficulty:"expert",gridSize:"xlarge"}),jt({totalScore:1500,levelsCleared:0,difficulty:"expert",gridSize:"medium"})];function $N(e,t){const n=FN.filter(s=>s.difficulty===t),r=[...e,...n].sort((s,o)=>o.totalScore-s.totalScore||o.levelsCleared-s.levelsCleared).slice(0,10);for(;r.length<10;)r.push(null);return r}function GN(e){const n=[...[...e].sort((r,s)=>s.totalPoints-r.totalPoints),...AN].sort((r,s)=>s.totalPoints-r.totalPoints).slice(0,10);for(;n.length<10;)n.push(null);return n}function ss(e){const t=Math.round(e/1e3);return t<60?`${t}s`:`${Math.floor(t/60)}m ${t%60}s`}function Zi(e){return e===0?"—":new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"2-digit"})}const Vs=["text-yellow-400","text-gray-300","text-amber-600"];function ea({children:e}){return l.jsx("div",{className:"overflow-x-auto",children:l.jsx("table",{className:"w-full text-xs font-mono border-collapse",children:e})})}function ta({rank:e,colSpan:t}){const n=e<=3?Vs[e-1]:"text-gray-600";return l.jsxs("tr",{className:"border-b border-gray-800/50",children:[l.jsx("td",{className:`py-2.5 px-3 font-bold ${n}`,children:e}),l.jsx("td",{colSpan:t,className:"py-2.5 px-3 text-gray-700",children:"—"})]})}function zN({mode:e,rows:t,username:n}){const r=e==="survival";return l.jsxs(ea,{children:[l.jsx("thead",{children:l.jsxs("tr",{className:"border-b border-gray-700 text-gray-500 uppercase tracking-wider",children:[l.jsx("th",{className:"py-2 px-3 text-left w-8",children:"#"}),l.jsx("th",{className:"py-2 px-3 text-left",children:"Player"}),l.jsx("th",{className:"py-2 px-3 text-right",children:r?"Survived":"Score"}),l.jsx("th",{className:"py-2 px-3 text-right hidden sm:table-cell",children:r?"Expected":"Session"}),l.jsx("th",{className:"py-2 px-3 text-center hidden md:table-cell",children:"Lang"}),l.jsx("th",{className:"py-2 px-3 text-center hidden md:table-cell",children:"Lv"}),l.jsx("th",{className:"py-2 px-3 text-right hidden lg:table-cell",children:"✓/✗"}),l.jsx("th",{className:"py-2 px-3 text-right hidden lg:table-cell",children:"Acc"}),l.jsx("th",{className:"py-2 px-3 text-right hidden xl:table-cell",children:"Date"})]})}),l.jsx("tbody",{children:t.map((s,o)=>{const i=o<3?Vs[o]:"text-gray-600",a=s&&!s.isBot&&(!s.username||s.username===n);if(!s)return l.jsx(ta,{rank:o+1,colSpan:8},o);const c=!!s.isBot;return l.jsxs("tr",{className:`border-b border-gray-800 transition-colors ${a?"bg-blue-900/15":c?"bg-gray-900":"hover:bg-gray-800/40"}`,children:[l.jsx("td",{className:`py-2.5 px-3 font-bold text-sm ${i}`,children:o+1}),l.jsx("td",{className:"py-2.5 px-3",children:l.jsx("span",{className:a?"text-blue-300 font-bold":c?"text-gray-500 italic":"text-gray-300",children:s.username??n})}),l.jsx("td",{className:"py-2.5 px-3 text-right font-bold",children:r?l.jsx("span",{className:"text-green-400",children:ss(s.achievedTimeMs)}):l.jsx("span",{className:a?"text-blue-300":c?"text-gray-400":"text-yellow-400",children:s.score.toLocaleString()})}),l.jsx("td",{className:"py-2.5 px-3 text-right text-gray-500 hidden sm:table-cell",children:ss(r?s.expectedTimeMs:s.sessionDurationMs)}),l.jsx("td",{className:"py-2.5 px-3 text-center text-gray-400 hidden md:table-cell",children:s.language}),l.jsx("td",{className:"py-2.5 px-3 text-center text-gray-400 hidden md:table-cell",children:s.startingLevel}),l.jsxs("td",{className:"py-2.5 px-3 text-right text-gray-500 hidden lg:table-cell",children:[l.jsxs("span",{className:"text-green-600",children:[s.challengesCompleted,"✓"]})," ",l.jsxs("span",{className:"text-red-700",children:[s.challengesFailed,"✗"]})]}),l.jsxs("td",{className:"py-2.5 px-3 text-right text-gray-500 hidden lg:table-cell",children:[Math.round(s.accuracy*100),"%"]}),l.jsx("td",{className:"py-2.5 px-3 text-right text-gray-600 hidden xl:table-cell",children:Zi(s.timestamp)})]},s.id)})})]})}function qN({rows:e,username:t}){return l.jsxs(ea,{children:[l.jsx("thead",{children:l.jsxs("tr",{className:"border-b border-gray-700 text-gray-500 uppercase tracking-wider",children:[l.jsx("th",{className:"py-2 px-3 text-left w-8",children:"#"}),l.jsx("th",{className:"py-2 px-3 text-left",children:"Player"}),l.jsx("th",{className:"py-2 px-3 text-right",children:"Goals"}),l.jsx("th",{className:"py-2 px-3 text-right",children:"Time"}),l.jsx("th",{className:"py-2 px-3 text-center hidden md:table-cell",children:"Keystrokes"}),l.jsx("th",{className:"py-2 px-3 text-center hidden lg:table-cell",children:"Lang"}),l.jsx("th",{className:"py-2 px-3 text-right hidden lg:table-cell",children:"Date"})]})}),l.jsx("tbody",{children:e.map((n,r)=>{const s=r<3?Vs[r]:"text-gray-600",o=n&&(!n.username||n.username===t);return n?l.jsxs("tr",{className:`border-b border-gray-800 transition-colors ${o?"bg-blue-900/15":"hover:bg-gray-800/40"}`,children:[l.jsx("td",{className:`py-2.5 px-3 font-bold text-sm ${s}`,children:r+1}),l.jsx("td",{className:"py-2.5 px-3",children:l.jsx("span",{className:o?"text-blue-300 font-bold":"text-gray-300",children:n.username??t})}),l.jsx("td",{className:"py-2.5 px-3 text-right font-bold",children:l.jsx("span",{className:"text-yellow-400",children:n.score})}),l.jsx("td",{className:"py-2.5 px-3 text-right text-green-400",children:ss(n.sessionDurationMs)}),l.jsx("td",{className:"py-2.5 px-3 text-center text-gray-500 hidden md:table-cell",children:n.keystrokes}),l.jsx("td",{className:"py-2.5 px-3 text-center text-gray-500 hidden lg:table-cell",children:n.language}),l.jsx("td",{className:"py-2.5 px-3 text-right text-gray-600 hidden lg:table-cell",children:Zi(n.timestamp)})]},n.id):l.jsx(ta,{rank:r+1,colSpan:6},r)})})]})}function VN({rows:e,username:t}){return l.jsxs(ea,{children:[l.jsx("thead",{children:l.jsxs("tr",{className:"border-b border-gray-700 text-gray-500 uppercase tracking-wider",children:[l.jsx("th",{className:"py-2 px-3 text-left w-8",children:"#"}),l.jsx("th",{className:"py-2 px-3 text-left",children:"Player"}),l.jsx("th",{className:"py-2 px-3 text-right",children:"Score"}),l.jsx("th",{className:"py-2 px-3 text-center hidden md:table-cell",children:"Difficulty"}),l.jsx("th",{className:"py-2 px-3 text-center hidden md:table-cell",children:"Solved"}),l.jsx("th",{className:"py-2 px-3 text-right hidden sm:table-cell",children:"Time"}),l.jsx("th",{className:"py-2 px-3 text-right hidden lg:table-cell",children:"Keys"}),l.jsx("th",{className:"py-2 px-3 text-right hidden lg:table-cell",children:"Date"})]})}),l.jsx("tbody",{children:e.map((n,r)=>{const s=r<3?Vs[r]:"text-gray-600",o=n&&(!n.username||n.username===t);return n?l.jsxs("tr",{className:`border-b border-gray-800 transition-colors ${o?"bg-blue-900/15":"hover:bg-gray-800/40"}`,children:[l.jsx("td",{className:`py-2.5 px-3 font-bold text-sm ${s}`,children:r+1}),l.jsx("td",{className:"py-2.5 px-3",children:l.jsx("span",{className:o?"text-blue-300 font-bold":"text-gray-300",children:n.username??t})}),l.jsx("td",{className:"py-2.5 px-3 text-right font-bold",children:l.jsx("span",{className:"text-yellow-400",children:n.totalPoints})}),l.jsx("td",{className:"py-2.5 px-3 text-center text-gray-500 hidden md:table-cell",children:n.difficulty}),l.jsxs("td",{className:"py-2.5 px-3 text-center text-green-400 hidden md:table-cell",children:[n.solved," / ",n.challengeCount]}),l.jsx("td",{className:"py-2.5 px-3 text-right text-gray-500 hidden sm:table-cell",children:ss(n.totalElapsedMs)}),l.jsx("td",{className:"py-2.5 px-3 text-right text-gray-500 hidden lg:table-cell",children:n.totalKeystrokes}),l.jsx("td",{className:"py-2.5 px-3 text-right text-gray-600 hidden lg:table-cell",children:Zi(n.timestamp)})]},n.id):l.jsx(ta,{rank:r+1,colSpan:7},r)})})]})}function UN({rows:e,username:t}){return l.jsxs(ea,{children:[l.jsx("thead",{children:l.jsxs("tr",{className:"border-b border-gray-700 text-gray-500 uppercase tracking-wider",children:[l.jsx("th",{className:"py-2 px-3 text-left w-8",children:"#"}),l.jsx("th",{className:"py-2 px-3 text-left",children:"Player"}),l.jsx("th",{className:"py-2 px-3 text-right",children:"Score"}),l.jsx("th",{className:"py-2 px-3 text-center hidden md:table-cell",children:"Difficulty"}),l.jsx("th",{className:"py-2 px-3 text-center hidden md:table-cell",children:"Levels Cleared"}),l.jsx("th",{className:"py-2 px-3 text-center hidden sm:table-cell",children:"Grid Size"}),l.jsx("th",{className:"py-2 px-3 text-right hidden lg:table-cell",children:"Date"})]})}),l.jsx("tbody",{children:e.map((n,r)=>{const s=r<3?Vs[r]:"text-gray-600",o=n&&!n.isBot&&(!n.username||n.username===t);if(!n)return l.jsx(ta,{rank:r+1,colSpan:6},r);const i=!!n.isBot;return l.jsxs("tr",{className:`border-b border-gray-800 transition-colors ${o?"bg-blue-900/15":i?"bg-gray-900":"hover:bg-gray-800/40"}`,children:[l.jsx("td",{className:`py-2.5 px-3 font-bold text-sm ${s}`,children:r+1}),l.jsx("td",{className:"py-2.5 px-3",children:l.jsx("span",{className:o?"text-blue-300 font-bold":i?"text-gray-500 italic":"text-gray-300",children:n.username??t})}),l.jsx("td",{className:"py-2.5 px-3 text-right font-bold",children:l.jsx("span",{className:o?"text-blue-300":i?"text-gray-400":"text-yellow-400",children:n.totalScore.toLocaleString()})}),l.jsx("td",{className:"py-2.5 px-3 text-center text-gray-500 hidden md:table-cell",children:n.difficulty}),l.jsx("td",{className:"py-2.5 px-3 text-center text-green-400 hidden md:table-cell",children:n.levelsCleared}),l.jsx("td",{className:"py-2.5 px-3 text-center text-gray-500 hidden sm:table-cell",children:n.gridSize}),l.jsx("td",{className:"py-2.5 px-3 text-right text-gray-600 hidden lg:table-cell",children:Zi(n.timestamp)})]},n.id)})})]})}const BN=[{id:"motionrace",label:"Motion Race"},{id:"goal",label:"Goal Mode"},{id:"arcade",label:"Classic Arcade"},{id:"vimbots",label:"VimBots"}];function HN(){var g,v;const e=Ft(),t=((g=e.state)==null?void 0:g.tab)??"motionrace",n=((v=e.state)==null?void 0:v.vimbotsTab)??"medium",[r,s]=f.useState(t),[o,i]=f.useState("timed"),[a,c]=f.useState("general"),[u,d]=f.useState(n),[p,m]=f.useState(Kc()),h=Ui();return f.useEffect(()=>{m(As())},[]),l.jsx("div",{className:"min-h-screen bg-gray-900 font-mono",children:l.jsxs("div",{className:"max-w-4xl mx-auto py-8 px-4",children:[l.jsx("div",{className:"mb-6 flex justify-between items-end",children:l.jsxs("div",{children:[l.jsx("h1",{className:"text-2xl font-bold text-white tracking-tight",children:"High Scores"}),l.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:[l.jsx("span",{className:"text-blue-400",children:h})," is you"]})]})}),l.jsx("div",{className:"flex gap-2 mb-4 bg-gray-800 p-1 rounded-lg w-max",children:BN.map(w=>l.jsx("button",{onClick:()=>s(w.id),className:`px-4 py-2 text-sm font-bold rounded-md transition-colors ${r===w.id?"bg-blue-600 text-white shadow":"text-gray-400 hover:text-gray-200"}`,children:w.label},w.id))}),r==="motionrace"&&l.jsx("div",{className:"flex gap-1 mb-6 border-b border-gray-700",children:[{id:"timed",label:"Timed"},{id:"survival",label:"Survival"},{id:"total_goals",label:"Total Goals"}].map(w=>l.jsx("button",{onClick:()=>i(w.id),className:`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px ${o===w.id?"border-green-500 text-green-300":"border-transparent text-gray-500 hover:text-gray-300"}`,children:w.label},w.id))}),r==="arcade"&&l.jsx("div",{className:"flex gap-1 mb-6 border-b border-gray-700",children:[{id:"general",label:"General"},{id:"timed_challenge",label:"Timed"},{id:"survival",label:"Survival"}].map(w=>l.jsx("button",{onClick:()=>c(w.id),className:`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px ${a===w.id?"border-green-500 text-green-300":"border-transparent text-gray-500 hover:text-gray-300"}`,children:w.label},w.id))}),r==="goal"&&l.jsx("div",{className:"mb-6"})," ",r==="vimbots"&&l.jsx("div",{className:"flex gap-1 mb-6 border-b border-gray-700",children:["beginner","easy","medium","hard","expert"].map(w=>l.jsx("button",{onClick:()=>d(w),className:`px-4 py-2 text-sm font-mono transition-colors border-b-2 -mb-px capitalize ${u===w?"border-green-500 text-green-300":"border-transparent text-gray-500 hover:text-gray-300"}`,children:w},w))}),l.jsxs("div",{className:"bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden",children:[r==="motionrace"&&l.jsx(qN,{rows:PN(o,p[`motionrace_${o}`]),username:h}),r==="arcade"&&l.jsx(zN,{mode:a,rows:DN(a,p[a]),username:h}),r==="goal"&&l.jsx(VN,{rows:GN(p.goal),username:h}),r==="vimbots"&&l.jsx(UN,{rows:$N((p.vimbots??[]).filter(w=>w.difficulty===u),u),username:h})]})]})})}function WN({items:e,onDone:t}){const[n,r]=f.useState(()=>new Set(e.filter(d=>d.suggestKnown&&!d.alreadyKnown).map(d=>d.commandId))),s=e.filter(d=>d.suggestKnown&&!d.alreadyKnown),o=e.filter(d=>!d.suggestKnown||d.alreadyKnown),i=e.filter(d=>d.alreadyKnown);function a(d){r(p=>{const m=new Set(p);return m.has(d)?m.delete(d):m.add(d),m})}function c(){const d=[...n];d.length>0&&Vb(d),t()}const u=[...n].filter(d=>{var p;return!((p=e.find(m=>m.commandId===d))!=null&&p.alreadyKnown)});return l.jsx("div",{className:"min-h-screen bg-gray-900 overflow-y-auto",children:l.jsxs("div",{className:"max-w-2xl mx-auto py-10 px-6 space-y-8",children:[l.jsx("div",{className:"flex items-center justify-between",children:l.jsxs("div",{children:[l.jsx("h1",{className:"text-3xl font-bold text-white font-mono",children:"Session Review"}),l.jsxs("p",{className:"text-gray-500 font-mono text-sm mt-1",children:[e.length," commands encountered this session"]})]})}),s.length>0&&l.jsxs("section",{children:[l.jsxs("h2",{className:"text-green-400 font-mono text-xs uppercase tracking-wider mb-3 flex items-center gap-2",children:[l.jsx("span",{children:"✓ Looks learned"}),l.jsx("span",{className:"text-gray-600",children:"— mark as known?"})]}),l.jsx("div",{className:"space-y-2",children:s.map(d=>l.jsx(qa,{item:d,checked:n.has(d.commandId),onToggle:()=>a(d.commandId)},d.commandId))})]}),o.filter(d=>!d.alreadyKnown).length>0&&l.jsxs("section",{children:[l.jsx("h2",{className:"text-yellow-500 font-mono text-xs uppercase tracking-wider mb-3",children:"Still practicing"}),l.jsx("div",{className:"space-y-2",children:o.filter(d=>!d.alreadyKnown).map(d=>l.jsx(qa,{item:d,checked:n.has(d.commandId),onToggle:()=>a(d.commandId)},d.commandId))})]}),i.length>0&&l.jsxs("section",{children:[l.jsx("h2",{className:"text-gray-600 font-mono text-xs uppercase tracking-wider mb-3",children:"Already known"}),l.jsx("div",{className:"space-y-2",children:i.map(d=>l.jsx(qa,{item:d,checked:!1,onToggle:()=>{},readonly:!0},d.commandId))})]}),l.jsxs("div",{className:"flex gap-3 pt-2",children:[l.jsx("button",{onClick:c,className:"flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-mono font-bold rounded-lg transition-colors",children:u.length>0?`Mark ${u.length} as known & finish`:"Done"}),l.jsx("button",{onClick:t,className:"px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 font-mono text-sm rounded-lg border border-gray-700",children:"Skip"})]})]})})}function qa({item:e,checked:t,onToggle:n,readonly:r=!1}){const s=e.completions+e.failures,o=s>0?Math.round(e.completions/s*100):0,i=Wi(e.category),a=o>=80?"#22c55e":o>=50?"#f59e0b":"#ef4444";return l.jsx("div",{className:`bg-gray-800 rounded-lg p-3 border transition-all ${r?"border-gray-700 opacity-50":t?"border-green-700 cursor-pointer hover:border-green-500":"border-gray-700 cursor-pointer hover:border-gray-500"}`,onClick:r?void 0:n,children:l.jsxs("div",{className:"flex items-start gap-3",children:[!r&&l.jsx("div",{className:`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${t?"border-green-500 bg-green-500":"border-gray-600"}`,children:t&&l.jsx("span",{className:"text-white text-xs leading-none",children:"✓"})}),r&&l.jsx("div",{className:"mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0 text-gray-600 text-xs",children:"●"}),l.jsxs("div",{className:"flex-1 min-w-0",children:[l.jsxs("div",{className:"flex items-center gap-2 flex-wrap mb-1",children:[l.jsx("span",{className:"text-xs px-2 py-0.5 rounded font-mono",style:{color:i,borderColor:i,border:"1px solid",backgroundColor:`${i}18`},children:e.category}),l.jsxs("span",{className:"text-xs text-gray-500 font-mono",children:["Lv",e.level]})]}),l.jsx("p",{className:"text-white text-sm font-mono",children:e.question}),l.jsxs("div",{className:"flex items-center gap-3 mt-1.5",children:[l.jsx("div",{className:"flex gap-1",children:e.solution.slice(0,3).map((c,u)=>l.jsx("kbd",{className:"px-1.5 py-0.5 bg-gray-700 text-yellow-300 font-mono text-xs rounded border border-gray-600",children:c},u))}),s>0&&l.jsxs("div",{className:"flex items-center gap-2 ml-auto",children:[l.jsxs("span",{className:"text-xs font-mono",style:{color:a},children:[e.completions,"/",s," (",o,"%)"]}),l.jsx("div",{className:"w-16 bg-gray-700 rounded-full h-1.5",children:l.jsx("div",{className:"h-1.5 rounded-full transition-all",style:{width:`${o}%`,backgroundColor:a}})})]})]})]})]})})}const os=[{id:"vg_01_hello_vim",title:"Hello, Vim!",description:'Replace "World" with "Vim".',start:`Hello World!
`,end:`Hello Vim!
`,difficulty:"easy",tags:["cw","substitution"]},{id:"vg_02_semicolons",title:"Line Terminators",description:"Add a semicolon at the end of every line.",start:`const x = 1
const y = 2
const z = 3
`,end:`const x = 1;
const y = 2;
const z = 3;
`,difficulty:"easy",tags:["append","macro"]},{id:"vg_03_trailing_spaces",title:"Tidy Trailing Spaces",description:"Remove all trailing whitespace from every line.",start:`hello   
world  
   foo  
`,end:`hello
world
   foo
`,difficulty:"easy",tags:["substitution","regex"]},{id:"vg_04_uppercase",title:"SHOUT IT",description:"Convert the entire first line to uppercase.",start:`hello world
`,end:`HELLO WORLD
`,difficulty:"easy",tags:["case","visual","gU"]},{id:"vg_05_empty_parens",title:"Empty the Parens",description:"Delete everything inside the parentheses.",start:`foo(bar, baz, qux)
`,end:`foo()
`,difficulty:"easy",tags:["text-objects","di("]},{id:"vg_06_count_up",title:"Count Up",description:"Increment each number by 1.",start:`step 1
step 2
step 3
`,end:`step 2
step 3
step 4
`,difficulty:"easy",tags:["ctrl-a","macro"]},{id:"vg_07_comment_out",title:"Comment It Out",description:"Prepend // to every line.",start:`let x = 1;
let y = 2;
let z = 3;
`,end:`// let x = 1;
// let y = 2;
// let z = 3;
`,difficulty:"medium",tags:["visual-block","macro","global"]},{id:"vg_08_sort_lines",title:"Alphabetical Order",description:"Sort these lines alphabetically.",start:`banana
apple
cherry
date
`,end:`apple
banana
cherry
date
`,difficulty:"medium",tags:["sort","ex"]},{id:"vg_09_join_comma",title:"Single Line",description:'Join all three lines into one, separated by ", ".',start:`alpha
beta
gamma
`,end:`alpha, beta, gamma
`,difficulty:"medium",tags:["join","substitution"]},{id:"vg_10_duplicate_lines",title:"Mirror Lines",description:"Duplicate each line so it appears twice consecutively.",start:`foo
bar
baz
`,end:`foo
foo
bar
bar
baz
baz
`,difficulty:"medium",tags:["yank","macro"]},{id:"vg_11_blank_lines",title:"Blank Line Removal",description:"Delete all blank lines.",start:`line one

line two


line three
`,end:`line one
line two
line three
`,difficulty:"medium",tags:["global","delete","regex"]},{id:"vg_12_quote_words",title:"Quote Every Word",description:"Wrap each space-separated token in double quotes.",start:`apple orange banana
`,end:`"apple" "orange" "banana"
`,difficulty:"medium",tags:["substitution","regex"]},{id:"vg_13_swap_args",title:"Argument Shuffle",description:"Swap the first and second function arguments.",start:`doThing(alpha, beta, gamma)
`,end:`doThing(beta, alpha, gamma)
`,difficulty:"medium",tags:["motion","delete","paste"]},{id:"vg_14_camel_case",title:"camelCase",description:"Convert this snake_case identifier to camelCase.",start:`my_variable_name
`,end:`myVariableName
`,difficulty:"hard",tags:["substitution","macro","case"]},{id:"vg_15_reverse_lines",title:"Flip the Script",description:"Reverse the order of all lines.",start:`first
second
third
fourth
`,end:`fourth
third
second
first
`,difficulty:"hard",tags:["global","move"]},{id:"vg_16_extract_const",title:"Extract Constant",description:"Extract the repeated magic number into a named constant on a new first line.",start:`const area = 3.14159 * r * r;
const circ = 2 * 3.14159 * r;
`,end:`const PI = 3.14159;
const area = PI * r * r;
const circ = 2 * PI * r;
`,difficulty:"hard",tags:["yank","substitution","insert"]},{id:"vg_17_align_equals",title:"Align Assignments",description:"Pad each variable name so all = signs align to column 8.",start:`foo = 1
barbaz = 2
qux = 3
`,end:`foo    = 1
barbaz = 2
qux    = 3
`,difficulty:"hard",tags:["visual-block","insert","spaces"]},{id:"vg_18_sql_oneliner",title:"SQL Oneliner",description:"Collapse this multi-line SQL query onto a single line.",start:`SELECT
  name,
  age
FROM users
WHERE active = 1
`,end:`SELECT name, age FROM users WHERE active = 1
`,difficulty:"hard",tags:["join","substitution","regex"]},{id:"vg_19_number_lines",title:"Number the Lines",description:"Prefix each line with its 1-based line number and a period.",start:`apple
banana
cherry
date
egg
`,end:`1. apple
2. banana
3. cherry
4. date
5. egg
`,difficulty:"hard",tags:["macro","register","insert"]},{id:"vg_20_json_object",title:"CSV to JSON",description:"Convert this CSV row to a compact JSON object with the given keys.",start:`Alice,30,Engineer
`,end:`{"name":"Alice","age":"30","role":"Engineer"}
`,difficulty:"hard",tags:["substitution","complex"]}];function KN(){return new Worker("/learn-vim/arcade/assets/orgParser.worker-8fb66117.js",{type:"module"})}let In=null,ho=null;function QN(){return ho||(ho=new Promise(e=>{const t=new KN;t.onmessage=n=>{t.terminate();const r=n.data,s=new Set(os.map(i=>i.title.toLowerCase())),o=r.filter(i=>!s.has(i.title.toLowerCase()));In=[...os,...o],e(In)},t.onerror=()=>{t.terminate(),In=os,e(In)}}),ho)}function Rg(){return In??os}function Lg(){const[e,t]=f.useState(In??[]),[n,r]=f.useState(!In),s=f.useRef(!0);return f.useEffect(()=>{if(s.current=!0,In){t(In),r(!1);return}return QN().then(o=>{s.current&&(t(o),r(!1))}),()=>{s.current=!1}},[]),{challenges:e,loading:n}}const YN=10;function fd(){try{const e=localStorage.getItem(X.VIMGOLF_SCORES);return e?JSON.parse(e):{}}catch{return{}}}function Ig(e){try{localStorage.setItem(X.VIMGOLF_SCORES,JSON.stringify(e))}catch{}}function XN(e,t,n){const r=[...e[t]??[],n].sort((s,o)=>s.keystrokes!==o.keystrokes?s.keystrokes-o.keystrokes:s.timeMs-o.timeMs).slice(0,YN);return{...e,[t]:r}}function JN(e,t){var n;return((n=e[t])==null?void 0:n[0])??null}function Us(){try{const e=localStorage.getItem(X.VIMGOLF_RECORDS);return e?JSON.parse(e):{}}catch{return{}}}function Og(e){try{localStorage.setItem(X.VIMGOLF_RECORDS,JSON.stringify(e))}catch{}}function ZN(e,t){const n=Us();(n[e]===void 0||t<n[e])&&(n[e]=t,Og(n))}function ek(e){const t=fd();delete t[e],Ig(t);const n=Us();delete n[e],Og(n)}function pd(){try{const e=localStorage.getItem(X.EXCLUDED_VG_CHALLENGES);return e?JSON.parse(e):[]}catch{return[]}}function Qm(e){try{localStorage.setItem(X.EXCLUDED_VG_CHALLENGES,JSON.stringify(e))}catch{}}function gi(e){return e.endsWith(`
`)?e.slice(0,-1):e}function Ag(e,t){return gi(e)===gi(t)}function Ym(e,t){const n=gi(e).split(`
`),r=gi(t).split(`
`),s=n.length,o=r.length,i=Array.from({length:s+1},()=>new Array(o+1).fill(0));for(let d=1;d<=s;d++)for(let p=1;p<=o;p++)i[d][p]=n[d-1]===r[p-1]?i[d-1][p-1]+1:Math.max(i[d-1][p],i[d][p-1]);const a=[];let c=s,u=o;for(;c>0||u>0;)c>0&&u>0&&n[c-1]===r[u-1]?(a.unshift({type:"equal",content:n[c-1]}),c--,u--):u>0&&(c===0||i[c][u-1]>=i[c-1][u])?(a.unshift({type:"added",content:r[u-1]}),u--):(a.unshift({type:"removed",content:n[c-1]}),c--);return a}function Dg(){try{const e=localStorage.getItem(X.CUSTOM_VG_CHALLENGES);return e?JSON.parse(e):[]}catch{return[]}}const tk={easy:"text-green-400 bg-green-900/30 border border-green-800",medium:"text-yellow-400 bg-yellow-900/30 border border-yellow-800",hard:"text-red-400   bg-red-900/30   border border-red-800"},Xm={easy:0,medium:1,hard:2};function nk({onPlay:e}){const{challenges:t,loading:n}=Lg(),[r,s]=f.useReducer((m,h)=>({...m,...typeof h=="function"?h(m):h}),{records:Us(),diffFilter:"all",solvedFilter:"all",sortKey:"default",search:""}),{records:o,diffFilter:i,solvedFilter:a,sortKey:c,search:u}=r,d=f.useMemo(()=>{if(!t.length)return[];const m=Dg(),h=new Set(pd()),g=new Set(t.map(v=>v.id));return[...t.filter(v=>!h.has(v.id)),...m.filter(v=>!g.has(v.id)&&!h.has(v.id))]},[t]),p=f.useMemo(()=>{let m=d;if(i!=="all"&&(m=m.filter(h=>h.difficulty===i)),a==="solved"&&(m=m.filter(h=>o[h.id]!==void 0)),a==="unsolved"&&(m=m.filter(h=>o[h.id]===void 0)),u.trim()){const h=u.toLowerCase();m=m.filter(g=>{var v;return g.id.toLowerCase().includes(h)||g.title.toLowerCase().includes(h)||g.description.toLowerCase().includes(h)||((v=g.tags)==null?void 0:v.some(w=>w.toLowerCase().includes(h)))})}return c==="difficulty"?m=[...m].sort((h,g)=>Xm[h.difficulty]-Xm[g.difficulty]):c==="name"?m=[...m].sort((h,g)=>h.title.localeCompare(g.title)):c==="id"&&(m=[...m].sort((h,g)=>{const v=parseInt(h.id.split("_")[1]??"0",10),w=parseInt(g.id.split("_")[1]??"0",10);return isNaN(v)||isNaN(w)?h.id.localeCompare(g.id):v-w})),m},[d,i,a,c,u,o]);return l.jsxs("div",{className:"h-full bg-gray-900 flex flex-col overflow-hidden font-mono",children:[l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 flex-wrap",children:[l.jsx("span",{className:"font-bold text-yellow-400 tracking-widest text-sm",children:"VIMGOLF"}),n&&l.jsx("span",{className:"text-xs text-gray-500 animate-pulse",children:"Loading…"}),!n&&l.jsxs("span",{className:"text-xs text-gray-600",children:[p.length," / ",d.length]}),l.jsx("input",{type:"text",placeholder:"Search…",value:u,onChange:m=>s({search:m.target.value}),className:"px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-32"}),l.jsxs("div",{className:"flex gap-1 ml-auto flex-wrap",children:[["all","easy","medium","hard"].map(m=>l.jsx("button",{onClick:()=>s({diffFilter:m}),className:`px-2 py-1 rounded text-xs uppercase transition-colors ${i===m?"bg-yellow-600 text-white":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`,children:m},m)),l.jsxs("button",{onClick:()=>s(m=>({solvedFilter:m.solvedFilter==="all"?"unsolved":m.solvedFilter==="unsolved"?"solved":"all"})),className:`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${a==="solved"?"bg-green-700 text-white":a==="unsolved"?"bg-gray-600 text-white":"bg-gray-800 text-gray-400 hover:bg-gray-700"}`,title:"Filter by solved / unsolved",children:[l.jsx(qm,{className:"w-3.5 h-3.5"}),a==="all"?"all":a]}),l.jsxs("select",{value:c,onChange:m=>s({sortKey:m.target.value}),className:"px-2 py-1 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500",title:"Sort",children:[l.jsx("option",{value:"default",children:"Order: default"}),l.jsx("option",{value:"difficulty",children:"Order: difficulty"}),l.jsx("option",{value:"name",children:"Order: name A–Z"}),l.jsx("option",{value:"id",children:"Order: ID"})]})]})]}),l.jsxs("div",{className:"flex-1 overflow-y-auto",children:[n&&l.jsx("div",{className:"flex items-center justify-center h-32 text-gray-500 text-sm",children:l.jsx("span",{className:"animate-pulse",children:"Parsing challenges…"})}),!n&&p.length===0&&l.jsx("p",{className:"text-gray-600 italic text-sm px-4 py-6 text-center",children:"No challenges match."}),!n&&p.map(m=>{const h=o[m.id],g=h!==void 0;return l.jsxs("button",{onClick:()=>e(m,p),className:"w-full text-left px-4 py-2.5 border-b border-gray-800 hover:bg-gray-800 transition-colors flex items-center gap-3",children:[l.jsx(qm,{className:`w-3.5 h-3.5 flex-shrink-0 ${g?"text-green-500":"text-gray-700"}`}),l.jsx("span",{className:`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${tk[m.difficulty]}`,children:m.difficulty[0].toUpperCase()}),l.jsxs("div",{className:"flex-1 min-w-0",children:[l.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[l.jsx("span",{className:"text-sm text-white truncate",children:m.title}),l.jsx("span",{className:"text-[10px] text-gray-600 flex-shrink-0 hidden sm:inline",children:m.id})]}),m.description&&l.jsx("div",{className:"text-xs text-gray-500 truncate",children:m.description.slice(0,80)})]}),g&&l.jsxs("span",{className:"text-xs text-yellow-400 flex-shrink-0 tabular-nums flex items-center gap-1",children:[l.jsx(B1,{className:"w-3 h-3 opacity-60"}),h]})]},m.id)})]})]})}function rk(e,t){switch(t.type){case"INCREMENT_KEY":return{...e,keystrokes:e.keystrokes+1};case"SET_ELAPSED":return{...e,elapsedMs:t.ms};case"RESET":return{...e,keystrokes:0,resetCount:e.resetCount+1,status:"playing",isCorrect:null,diffLines:[],showDiff:!1};case"SOLVE":return{...e,status:"solved",diffLines:[],showDiff:!1};case"CHECK_FAILED":return{...e,isCorrect:!1,showDiff:!0,diffLines:t.diffLines};case"TOGGLE_SOLUTION":return{...e,showSolution:!e.showSolution};case"TOGGLE_DIFF":return!e.showDiff&&e.diffLines.length===0&&t.diffLines?{...e,showDiff:!0,diffLines:t.diffLines}:{...e,showDiff:!e.showDiff};case"SAVE_SCORE":{const n=XN(e.scores,t.challengeId,t.entry);return Ig(n),ZN(t.challengeId,t.entry.keystrokes),{...e,scores:n}}default:return e}}function lk(e){const[t,n]=f.useReducer(rk,void 0,()=>({keystrokes:0,elapsedMs:0,resetCount:0,status:"playing",showSolution:!0,showDiff:!1,diffLines:[],isCorrect:null,scores:fd()})),{keystrokes:r,elapsedMs:s,resetCount:o,status:i,showSolution:a,showDiff:c,diffLines:u,isCorrect:d,scores:p}=t,m=f.useRef(0),h=f.useRef(0),g=f.useRef(Date.now()),v=f.useRef(null),w=f.useRef(null),x=JN(p,e.id);f.useEffect(()=>(v.current=setInterval(()=>{w.current===null&&n({type:"SET_ELAPSED",ms:Date.now()-g.current})},100),()=>{v.current&&clearInterval(v.current)}),[]);const{editorRef:y,statusRef:b,setContent:k,getContent:N}=Un({language:"plaintext",onAnyKey:f.useCallback(()=>{m.current++,n({type:"INCREMENT_KEY"})},[])}),E=f.useRef(!1);f.useEffect(()=>{E.current=!1;const M=setInterval(()=>{k(e.start),N().length>0&&(E.current=!0,clearInterval(M))},150);return()=>clearInterval(M)},[e.id]);const j=f.useCallback(()=>{const M=N();if(Ag(M,e.end))n({type:"SOLVE"}),w.current=Date.now();else{const B=Ym(M,e.end);n({type:"CHECK_FAILED",diffLines:B})}},[N,e.end]),C=f.useCallback(()=>{n({type:"RESET"}),m.current=0,h.current++,g.current=Date.now(),w.current=null,k(e.start)},[k,e.start]),D=f.useCallback(()=>{if(w.current===null)return;const M={id:crypto.randomUUID(),timestamp:Date.now(),keystrokes:m.current,timeMs:w.current-g.current,resetCount:h.current};n({type:"SAVE_SCORE",entry:M,challengeId:e.id})},[e.id]);return f.useEffect(()=>{i==="solved"&&D()},[i]),{editorRef:y,statusRef:b,keystrokes:r,elapsedMs:s,resetCount:o,status:i,showSolution:a,showDiff:c,diffLines:u,isCorrect:d,bestEntry:x,handleCheck:j,handleReset:C,toggleSolution:f.useCallback(()=>n({type:"TOGGLE_SOLUTION"}),[]),toggleDiff:f.useCallback(()=>{if(!c&&u.length===0){const M=Ym(N(),e.end);n({type:"TOGGLE_DIFF",diffLines:M})}else n({type:"TOGGLE_DIFF"})},[c,u.length,N,e.end]),handleSubmitScore:D}}function go(e){return e?e.split("").map((t,n)=>t===" "?l.jsx("span",{className:"diff-ws",children:" "},n):t):" "}function sk({diffLines:e,onClose:t,challenge:n}){return f.useEffect(()=>{const r=s=>{s.key==="Escape"&&t()};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[t]),l.jsx("div",{className:"fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4",children:l.jsxs("div",{className:"bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden",children:[l.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-700",children:[l.jsx("h2",{className:"font-mono font-bold text-white text-lg",children:"Diff — Expected vs Current"}),l.jsx("button",{onClick:t,className:"text-gray-400 hover:text-white font-mono text-xl leading-none",children:"✕"})]}),l.jsxs("div",{className:"grid grid-cols-2 px-6 py-2 bg-gray-800 border-b border-gray-700",children:[l.jsx("span",{className:"font-mono text-xs uppercase tracking-wider text-gray-400",children:"Current"}),l.jsx("span",{className:"font-mono text-xs uppercase tracking-wider text-gray-400",children:"Expected"})]}),l.jsx("div",{className:"overflow-y-auto flex-1 font-mono text-sm",children:e.map((r,s)=>r.type==="equal"?l.jsxs("div",{className:"grid grid-cols-2 px-6 py-0.5",children:[l.jsx("span",{className:"text-gray-500 whitespace-pre truncate",children:go(r.content)}),l.jsx("span",{className:"text-gray-500 whitespace-pre truncate",children:go(r.content)})]},s):r.type==="removed"?l.jsxs("div",{className:"grid grid-cols-2 px-6 py-0.5 bg-red-900/40",children:[l.jsxs("span",{className:"text-red-300 whitespace-pre truncate",children:[l.jsx("span",{className:"text-red-500 mr-1",children:"−"}),go(r.content)]}),l.jsx("span",{className:"text-gray-600",children:"—"})]},s):l.jsxs("div",{className:"grid grid-cols-2 px-6 py-0.5 bg-green-900/40",children:[l.jsx("span",{className:"text-gray-600",children:"—"}),l.jsxs("span",{className:"text-green-300 whitespace-pre truncate",children:[l.jsx("span",{className:"text-green-500 mr-1",children:"+"}),go(r.content)]})]},s))}),l.jsxs("div",{className:"border-t border-gray-700 px-6 py-4",children:[l.jsx("p",{className:"font-mono text-xs uppercase tracking-wider text-gray-400 mb-2",children:"Expected result"}),l.jsx("pre",{className:"bg-gray-800 rounded-lg p-3 text-green-300 font-mono text-sm overflow-x-auto max-h-40 overflow-y-auto whitespace-pre",children:n.end})]}),l.jsx("div",{className:"px-6 py-3 border-t border-gray-700",children:l.jsx("button",{onClick:t,className:"px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-mono text-sm rounded-lg transition-colors",children:"Close (Esc)"})})]})})}function ok(e){const t=Math.floor(e/1e3),n=Math.floor(t/60).toString().padStart(2,"0"),r=(t%60).toString().padStart(2,"0");return`${n}:${r}`}const ik={easy:"bg-green-900/50 text-green-400 border border-green-700",medium:"bg-yellow-900/50 text-yellow-400 border border-yellow-700",hard:"bg-red-900/50 text-red-400 border border-red-700"};function ak({challenge:e,handicaps:t,onNext:n,onPrev:r,onQuit:s}){const{editorRef:o,statusRef:i,keystrokes:a,elapsedMs:c,resetCount:u,status:d,showSolution:p,showDiff:m,diffLines:h,isCorrect:g,bestEntry:v,handleCheck:w,handleReset:x,toggleSolution:y,toggleDiff:b}=lk(e);return jl(t,d==="playing"),f.useEffect(()=>{const k=o.current;if(!k)return;const N=E=>{E.key==="Enter"&&(E.metaKey||E.ctrlKey)&&(E.preventDefault(),E.stopPropagation(),d==="solved"?n&&n():w())};return k.addEventListener("keydown",N,{capture:!0}),()=>k.removeEventListener("keydown",N,{capture:!0})},[w,o,d,n]),l.jsxs("div",{className:"min-h-screen bg-gray-900 flex flex-col",children:[l.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[l.jsxs("div",{className:"flex-[6] flex flex-col min-h-0",children:[l.jsxs("div",{className:"flex-1 relative",children:[l.jsx("div",{ref:o,className:"h-full"}),(t==null?void 0:t.snowEffect)&&l.jsx(Cl,{}),(t==null?void 0:t.opacityFade)&&l.jsx(El,{cursorLine:0,getVisibleRange:()=>null})]}),l.jsx("div",{ref:i,className:"h-6 bg-gray-800 border-t border-gray-700 px-3 text-xs font-mono text-gray-400 flex items-center"})]}),l.jsxs("div",{className:"flex-[4] bg-gray-800 border-l border-gray-700 overflow-y-auto p-5 flex flex-col gap-4",children:[l.jsxs("div",{className:"flex gap-2",children:[s&&l.jsx("button",{onClick:s,className:"text-gray-400 hover:text-white font-mono text-sm transition-colors",title:"Back to List",children:"← List"}),l.jsx("div",{className:"flex-1"}),r&&l.jsx("button",{onClick:r,className:"text-gray-400 hover:text-white font-mono text-sm transition-colors",children:"Prev"}),n&&l.jsx("button",{onClick:n,className:"text-gray-400 hover:text-white font-mono text-sm transition-colors",children:"Next →"})]}),l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center gap-2 flex-wrap mb-1",children:[l.jsx("h1",{className:"font-mono font-bold text-white text-lg",children:e.title}),l.jsx("span",{className:`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${ik[e.difficulty]}`,children:e.difficulty})]}),l.jsx("div",{className:"flex flex-wrap gap-1 mt-1",children:e.tags.map(k=>l.jsx("span",{className:"px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded text-xs font-mono",children:k},k))}),e.vimgolfId&&l.jsx("a",{href:`https://www.vimgolf.com/challenges/${e.vimgolfId}`,target:"_blank",rel:"noopener noreferrer",className:"text-xs text-blue-400 hover:text-blue-300 font-mono mt-1 inline-block",children:"View on vimgolf.com ↗"})]}),l.jsx("p",{className:"text-gray-300 font-mono text-sm",children:e.description}),l.jsx("hr",{className:"border-gray-700"}),l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"text-6xl font-mono font-bold text-yellow-400",children:a}),l.jsx("div",{className:"text-xs font-mono text-gray-500 uppercase tracking-widest mt-1",children:"Keystrokes"})]}),l.jsx("div",{className:"text-center",children:l.jsx("div",{className:"text-2xl font-mono text-gray-400",children:ok(c)})}),u>0&&l.jsxs("div",{className:"text-center text-sm font-mono text-gray-600",children:["↺ ",u," reset",u>1?"s":""]}),v&&l.jsxs("div",{className:"text-center text-sm font-mono text-teal-400",children:["Best: ",v.keystrokes," keys in ",(v.timeMs/1e3).toFixed(1),"s"]}),l.jsx("hr",{className:"border-gray-700"}),l.jsxs("div",{className:"flex flex-col gap-2",children:[l.jsxs("button",{onClick:w,disabled:d==="solved",className:"w-full py-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-mono text-sm rounded-lg transition-colors flex items-center justify-center gap-2",children:["Check"," ",l.jsx("span",{className:"text-[10px] bg-green-800/50 px-1.5 py-0.5 rounded opacity-80",children:"⌘ Enter"})]}),l.jsx("button",{onClick:x,className:"w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-mono text-sm rounded-lg transition-colors",children:"Reset ↺"}),l.jsx("button",{onClick:b,className:"w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-mono text-sm rounded-lg transition-colors",children:m?"Hide Diff":"Show Diff"}),l.jsx("button",{onClick:y,className:`w-full py-2 font-mono text-sm rounded-lg transition-colors ${p?"bg-gray-700 hover:bg-gray-600 text-gray-300":"bg-purple-700 hover:bg-purple-600 text-white"}`,children:p?"Hide Expected result":"Show Expected result"})]}),p&&l.jsxs("div",{children:[l.jsx("p",{className:"text-xs font-mono text-gray-500 uppercase tracking-wider mb-1",children:"Expected result"}),l.jsx("pre",{className:"bg-gray-900 rounded-lg p-3 text-yellow-300 font-mono text-sm overflow-x-auto max-h-40 overflow-y-auto whitespace-pre border border-gray-700",children:e.end})]}),d==="solved"&&l.jsxs("div",{className:"bg-green-900/50 border border-green-700 rounded-lg p-4 text-center",children:[l.jsx("div",{className:"text-2xl font-mono font-bold text-green-400",children:"✓ SOLVED!"}),l.jsxs("div",{className:"text-sm font-mono text-green-300 mt-1",children:[a," keystroke",a!==1?"s":""]})]}),g===!1&&d!=="solved"&&l.jsx("div",{className:"bg-red-900/30 border border-red-700 rounded-lg p-3 text-center",children:l.jsx("div",{className:"text-sm font-mono text-red-400",children:"Not quite — check the diff above"})}),l.jsx("div",{className:"mt-auto pt-4 text-xs font-mono text-gray-600 text-center",children:"⌘⇧P · vim commands active"})]})]}),m&&h.length>0&&l.jsx(sk,{diffLines:h,onClose:b,challenge:e})]})}const Pg={challengeMode:!1,challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeCategories:[],challengeDrillMode:!1},na={hjklOnly:!1,noHjkl:!1,opacityFade:!1,snowEffect:!1},ck=[{value:3e4,label:"30s"},{value:6e4,label:"1m"},{value:12e4,label:"2m"},{value:0,label:"∞"}],uk=[{id:"all",label:"All"},{id:"easy",label:"Easy"},{id:"medium",label:"Medium"},{id:"hard",label:"Hard"}];function dk(e,t){switch(t.type){case"SET_COUNT":return{...e,challengeCount:t.value};case"SET_TIME":return{...e,timeLimitMs:t.value};case"TOGGLE_CMD_CHALLENGES":return{...e,commandChallengesEnabled:!e.commandChallengesEnabled};case"SET_DIFFICULTY":return{...e,difficulty:t.value};case"SET_SOLVED_FILTER":return{...e,solvedFilter:t.value};case"SET_CONCURRENT":return{...e,concurrentChallenges:t.value};case"SET_TIME_MULT":return{...e,commandTimeMultiplier:t.value};case"SET_LANGUAGE":return{...e,language:t.value};case"SET_LEVEL":return{...e,startingLevel:t.value};case"SET_REPETITION":return{...e,repetition:t.value};case"SET_GUIDED":return{...e,guidedMode:t.value};case"SET_CATEGORIES":return{...e,categories:t.value};case"SET_ASSIST_PCT":return{...e,assistPct:t.value};case"PATCH_HANDICAPS":return{...e,handicaps:{...e.handicaps,...t.patch}};case"TOGGLE_ASSIST":return{...e,assistEnabled:!e.assistEnabled};case"TOGGLE_SKIP_UNSUPPORTED":{const n=!e.skipUnsupported;try{localStorage.setItem(X.SKIP_UNSUPPORTED,String(n))}catch{}return{...e,skipUnsupported:n}}default:return e}}const mk={challengeCount:5,timeLimitMs:6e4,difficulty:"all",solvedFilter:"all",commandChallengesEnabled:!0,concurrentChallenges:5,commandTimeMultiplier:2,language:"typescript",startingLevel:0,repetition:2,guidedMode:"none",categories:[...ad],assistEnabled:!1,assistPct:100,skipUnsupported:(()=>{try{const e=localStorage.getItem(X.SKIP_UNSUPPORTED);return e===null?!0:e==="true"}catch{return!0}})(),handicaps:{...na}};function fk(){try{const e=localStorage.getItem(X.LAST_GOAL_CONFIG);return e?JSON.parse(e):null}catch{return null}}function pk(e){try{localStorage.setItem(X.LAST_GOAL_CONFIG,JSON.stringify(e))}catch{}}function hk({onStart:e,onBack:t}){const[n,r]=f.useReducer(dk,mk),[s,o]=f.useState(fk),{challenges:i}=Lg(),a=n.difficulty==="all"?i.length:i.filter(m=>m.difficulty===n.difficulty).length,c=nn().size,u=a>0&&n.categories.length>=hl;function d(){const m=Us();let h=i;if(n.difficulty!=="all"&&(h=h.filter(w=>w.difficulty===n.difficulty)),n.solvedFilter==="solved"&&(h=h.filter(w=>m[w.id]!==void 0)),n.solvedFilter==="unsolved"&&(h=h.filter(w=>m[w.id]===void 0)),n.solvedFilter==="mixed"){const w=h.filter(k=>m[k.id]!==void 0),x=h.filter(k=>m[k.id]===void 0),y=Math.ceil(n.challengeCount*.7),b=n.challengeCount-y;h=[...x.slice(0,y),...w.slice(0,b)]}const v={challengeCount:Math.min(n.challengeCount,h.length),timeLimitMs:n.timeLimitMs,difficulty:n.difficulty,solvedFilter:n.solvedFilter,concurrentChallenges:n.commandChallengesEnabled?n.concurrentChallenges:0,commandTimeMultiplier:n.commandTimeMultiplier,language:n.language,startingLevel:n.startingLevel,repetitionTarget:n.repetition,guidedMode:n.guidedMode,categories:n.categories.length===0?null:n.categories,dynamicAssist:n.assistEnabled?n.assistPct:null,skipUnsupported:n.skipUnsupported,...n.handicaps};pk(v),o(v),e(v)}const p=l.jsxs("div",{className:"space-y-3",children:[l.jsx(Sl,{onClick:d,disabled:!u}),s&&l.jsx(zs,{onClick:()=>e(s),summary:`${s.difficulty} · ${s.language}`})]});return l.jsxs(kl,{title:"Goal Mode",subtitle:"Transform the editor to match the target",actions:p,children:[l.jsx(W,{label:"Language",icon:xr,defaultOpen:!0,badge:n.language,children:l.jsx(qn,{value:n.language,onChange:m=>r({type:"SET_LANGUAGE",value:m})})}),l.jsxs(W,{label:"Text Goals",icon:Gs,defaultOpen:!0,children:[l.jsxs("div",{className:"mb-4",children:[l.jsxs("h3",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:["Challenges: ",l.jsx("span",{className:"text-yellow-400",children:n.challengeCount})]}),l.jsx("input",{type:"range",min:1,max:20,step:1,value:n.challengeCount,onChange:m=>r({type:"SET_COUNT",value:Number(m.target.value)}),className:"w-full accent-green-500"}),l.jsxs("div",{className:"flex justify-between text-xs text-gray-500 font-mono mt-1",children:[l.jsx("span",{children:"1"}),l.jsxs("span",{className:"text-gray-500",children:[a," available"]}),l.jsx("span",{children:"20"})]}),n.challengeCount>a&&l.jsxs("p",{className:"text-yellow-500 font-mono text-xs mt-1",children:["Only ",a," challenge",a!==1?"s":""," available — will use"," ",a]})]}),l.jsxs("div",{className:"mb-4",children:[l.jsx("h3",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"Difficulty"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:uk.map(m=>l.jsx("button",{onClick:()=>r({type:"SET_DIFFICULTY",value:m.id}),className:F.pill(n.difficulty===m.id),children:m.label},m.id))})]}),l.jsxs("div",{children:[l.jsx("h3",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"Time per Challenge"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:ck.map(m=>l.jsx("button",{onClick:()=>r({type:"SET_TIME",value:m.value}),className:F.pill(n.timeLimitMs===m.value),children:m.label},m.value))})]})]}),l.jsx(vr,{enabled:n.commandChallengesEnabled,onToggle:()=>r({type:"TOGGLE_CMD_CHALLENGES"}),children:l.jsx(Vn,{guidedMode:n.guidedMode,onGuidedMode:m=>r({type:"SET_GUIDED",value:m}),startingLevel:n.startingLevel,onStartingLevel:m=>r({type:"SET_LEVEL",value:m}),repetition:n.repetition,onRepetition:m=>r({type:"SET_REPETITION",value:m}),timeMultiplier:n.commandTimeMultiplier,onTimeMultiplier:m=>r({type:"SET_TIME_MULT",value:m}),concurrent:n.concurrentChallenges,onConcurrent:m=>r({type:"SET_CONCURRENT",value:m}),dynamicAssistEnabled:n.assistEnabled,onDynamicAssistToggle:()=>r({type:"TOGGLE_ASSIST"}),dynamicAssistPct:n.assistPct,onDynamicAssistPct:m=>r({type:"SET_ASSIST_PCT",value:m}),solvedFilter:n.solvedFilter,onSolvedFilter:m=>r({type:"SET_SOLVED_FILTER",value:m})})}),l.jsxs(W,{label:"Advanced Options",icon:mw,defaultOpen:!1,children:[l.jsxs("div",{className:"mb-4",children:[l.jsxs("h3",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:["Focus areas ",l.jsxs("span",{className:"text-gray-600 normal-case",children:["(min ",hl,")"]})]}),l.jsx(ag,{selected:n.categories,onChange:m=>r({type:"SET_CATEGORIES",value:m})})]}),l.jsxs("div",{children:[l.jsx("h3",{className:"text-gray-400 font-mono text-xs uppercase tracking-wider mb-2",children:"Skip Unsupported Commands"}),l.jsxs("div",{className:"flex items-center justify-between",children:[l.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",onClick:()=>r({type:"TOGGLE_SKIP_UNSUPPORTED"}),children:[l.jsx("div",{className:`relative w-10 h-6 rounded-full transition-colors ${n.skipUnsupported?"bg-green-600":"bg-gray-700"}`,children:l.jsx("span",{className:`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${n.skipUnsupported?"translate-x-5":"translate-x-1"}`})}),l.jsx("span",{className:"font-mono text-sm text-gray-300",children:n.skipUnsupported?"On — skip marked commands":"Off — include all commands"})]}),c>0&&l.jsxs("span",{className:"text-gray-500 font-mono text-xs",children:["(",c," marked)"]})]})]})]}),l.jsx(qs,{config:n.handicaps,onPatch:m=>r({type:"PATCH_HANDICAPS",patch:m})})]})}const gk={easy:"bg-green-900/50 text-green-400 border border-green-700",medium:"bg-yellow-900/50 text-yellow-400 border border-yellow-700",hard:"bg-red-900/50 text-red-400 border border-red-700"};function Xc(e){const t=Math.floor(e/1e3),n=Math.floor(t/60).toString().padStart(2,"0"),r=(t%60).toString().padStart(2,"0");return`${n}:${r}`}function xk({state:e,currentChallenge:t,editorRef:n,statusRef:r,targetEditorRef:s,onCheck:o,onSkip:i,onQuit:a,onMarkUnsupported:c=()=>{}}){var w,x,y;const u=e.challenges.length,d=e.index,p=((w=e.config)==null?void 0:w.timeLimitMs)??0,m=p>0?Math.max(0,p-e.elapsedMs):0,h=p>0&&m<1e4,g=e.results.slice(-3).reverse(),v=e.arcadeState;return jl(e.config,e.status==="playing"),l.jsxs("div",{className:"h-full bg-gray-900 flex flex-col overflow-hidden relative font-mono",children:[l.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0",children:[l.jsxs("button",{onClick:a,className:"text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1",children:[l.jsx(Ds,{className:"w-4 h-4"})," Quit"]}),l.jsxs("div",{className:"flex items-center gap-6",children:[t&&l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsxs("span",{className:"text-gray-500 text-xs uppercase tracking-widest",children:[d+1," / ",u]}),l.jsx("span",{className:"font-bold text-white text-sm",children:t.title}),l.jsx("span",{className:`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${gk[t.difficulty]}`,children:t.difficulty})]}),l.jsx("div",{className:`text-lg font-bold ${h?"text-red-400":"text-gray-300"}`,children:p>0?Xc(m):Xc(e.elapsedMs)}),l.jsxs("div",{className:"text-yellow-400 font-bold",children:[e.totalScore+((v==null?void 0:v.score)??0)," pts"]})]}),l.jsxs("div",{className:"flex gap-2",children:[l.jsxs("button",{onClick:o,className:"px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm rounded transition-colors flex items-center gap-1",children:[l.jsx(di,{className:"w-4 h-4"})," Check"]}),l.jsxs("button",{onClick:i,className:"px-4 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors flex items-center gap-1",children:["Skip ",l.jsx(x1,{className:"w-4 h-4"})]})]})]}),l.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[l.jsxs("div",{className:"flex flex-col min-w-0 border-r border-gray-700",style:{flex:"0 0 40%"},children:[l.jsxs("div",{className:"flex items-center px-3 py-1.5 bg-gray-800 border-b border-gray-700 flex-shrink-0",children:[l.jsx("span",{className:"text-gray-400 text-xs",children:"editing"}),l.jsxs("span",{className:"ml-auto text-gray-600 text-xs",children:[e.keystrokes," keys"]})]}),l.jsxs("div",{className:"flex-1 min-h-0 relative",children:[l.jsx("div",{ref:n,className:"h-full"}),((x=e.config)==null?void 0:x.snowEffect)&&l.jsx(Cl,{}),((y=e.config)==null?void 0:y.opacityFade)&&l.jsx(El,{cursorLine:0,getVisibleRange:()=>null})]}),l.jsx("div",{ref:r,className:"h-6 bg-gray-800 border-t border-gray-700 px-3 text-xs text-gray-400 flex items-center flex-shrink-0"})]}),l.jsxs("div",{className:"flex flex-col min-w-0 border-r border-gray-700",style:{flex:"0 0 35%"},children:[l.jsxs("div",{className:"flex items-center px-3 py-1.5 bg-gray-800 border-b border-gray-700 flex-shrink-0",children:[l.jsx("span",{className:"text-gray-400 text-xs",children:"target"}),t&&l.jsx("span",{className:"ml-3 text-gray-600 text-xs truncate",children:t.description})]}),l.jsx("div",{ref:s,className:"flex-1 min-h-0"}),l.jsxs("div",{className:"h-6 bg-gray-800 border-t border-gray-700 px-3 flex items-center gap-4 flex-shrink-0",children:[l.jsxs("span",{className:"flex items-center gap-1 text-xs text-gray-500",children:[l.jsx("span",{className:"inline-block w-2.5 h-2.5 rounded-sm",style:{background:"#f59e0b"}}),"changed"]}),l.jsxs("span",{className:"flex items-center gap-1 text-xs text-gray-500",children:[l.jsx("span",{className:"inline-block w-2.5 h-2.5 rounded-sm",style:{background:"#22c55e"}}),"need to add"]}),l.jsxs("span",{className:"flex items-center gap-1 text-xs text-gray-500",children:[l.jsx("span",{className:"inline-block w-2.5 h-2.5 rounded-sm",style:{background:"#ef4444"}}),"need to remove"]})]})]}),l.jsxs("div",{className:"flex flex-col min-w-0 overflow-hidden",style:{flex:"0 0 25%"},children:[l.jsx("div",{className:"flex items-center gap-3 px-3 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0",children:v?l.jsxs(l.Fragment,{children:[l.jsx(Xi,{score:v.score,combo:v.combo}),l.jsx(Ji,{ceiling:v.ceiling,levelPct:v.levelPct})]}):l.jsx("span",{className:"text-gray-500 text-xs font-mono",children:"Commands"})}),l.jsx("div",{className:"flex-1 overflow-y-auto p-3",children:l.jsx(Yi,{challenges:(v==null?void 0:v.activeChallenges)??[],onMarkUnsupported:c})})]})]}),g.length>0&&l.jsx("div",{className:"flex-shrink-0 border-t border-gray-700 bg-gray-800 px-4 py-1.5 flex gap-6 text-xs",children:g.map((b,k)=>l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-gray-500 truncate max-w-32",children:b.title}),b.solved?l.jsxs("span",{className:"text-green-400 font-bold",children:["+",b.points]}):l.jsx("span",{className:"text-red-400 font-bold",children:"FAILED"})]},k))}),e.status==="results"&&l.jsx(yk,{state:e,onQuit:a})]})}function yk({state:e,onQuit:t}){var s;const n=((s=e.arcadeState)==null?void 0:s.score)??0,r=e.totalScore+n;return l.jsx("div",{className:"absolute inset-0 bg-black/80 z-50 flex items-center justify-center overflow-auto",children:l.jsxs("div",{className:"bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-2xl w-full mx-4 font-mono",children:[l.jsx("h2",{className:"text-4xl font-bold text-white text-center mb-2",children:"COMPLETE"}),l.jsxs("div",{className:"text-center mb-4",children:[l.jsx("span",{className:"text-5xl font-bold text-yellow-400",children:r}),l.jsx("div",{className:"text-sm text-gray-400 mt-1 uppercase tracking-widest",children:"Total Score"})]}),n>0&&l.jsxs("div",{className:"flex justify-center gap-8 mb-6 text-sm font-mono",children:[l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"text-2xl font-bold text-green-400",children:e.totalScore}),l.jsx("div",{className:"text-xs text-gray-500 uppercase tracking-wider",children:"Editing"})]}),l.jsxs("div",{className:"text-center",children:[l.jsx("div",{className:"text-2xl font-bold text-blue-400",children:n}),l.jsx("div",{className:"text-xs text-gray-500 uppercase tracking-wider",children:"Commands"})]})]}),l.jsx("div",{className:"overflow-x-auto mb-6",children:l.jsxs("table",{className:"w-full text-sm",children:[l.jsx("thead",{children:l.jsxs("tr",{className:"text-gray-500 text-xs uppercase tracking-wider",children:[l.jsx("th",{className:"text-left py-2 pr-3",children:"Challenge"}),l.jsx("th",{className:"text-center py-2 px-2",children:"Result"}),l.jsx("th",{className:"text-right py-2 px-2",children:"Keys"}),l.jsx("th",{className:"text-right py-2 px-2",children:"Time"}),l.jsx("th",{className:"text-right py-2 pl-2",children:"Points"})]})}),l.jsx("tbody",{children:e.results.map((o,i)=>l.jsxs("tr",{className:"border-t border-gray-800",children:[l.jsx("td",{className:"py-2 pr-3 text-gray-300 truncate max-w-48",children:o.title}),l.jsx("td",{className:"py-2 px-2 text-center",children:o.solved?l.jsx(mi,{className:"w-4 h-4 text-green-400"}):l.jsx(S1,{className:"w-4 h-4 text-red-400"})}),l.jsx("td",{className:"py-2 px-2 text-right text-gray-400",children:o.keystrokes}),l.jsx("td",{className:"py-2 px-2 text-right text-gray-400",children:Xc(o.elapsedMs)}),l.jsx("td",{className:"py-2 pl-2 text-right font-bold",children:o.solved?l.jsxs("span",{className:"text-yellow-400",children:["+",o.points]}):l.jsx("span",{className:"text-gray-600",children:"0"})})]},i))})]})}),l.jsx("button",{onClick:t,className:"w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors",children:"Done"})]})})}const Jm=kn,Jc={status:"idle",challenges:[],index:0,elapsedMs:0,keystrokes:0,results:[],totalScore:0,config:null,arcadeState:null};function vk(e,t){switch(t.type){case"START":return{...Jc,status:"playing",challenges:t.challenges,config:t.config,arcadeState:t.arcadeState};case"TICK":return{...e,elapsedMs:t.ms};case"INCREMENT_KEY":return{...e,keystrokes:e.keystrokes+1};case"CHALLENGE_SOLVED":case"CHALLENGE_FAILED":{const n=[...e.results,t.result],r=n.reduce((o,i)=>o+i.points,0),s=e.index+1;return s>=e.challenges.length?{...e,results:n,totalScore:r,status:"results",arcadeState:t.arcadeState}:{...e,results:n,totalScore:r,index:s,elapsedMs:0,keystrokes:0,arcadeState:t.arcadeState}}case"ARCADE_TICK":case"ARCADE_COMMAND":return{...e,arcadeState:t.newState};case"RESET":return{...Jc};default:return e}}function bk(e){const t=[...e];for(let n=t.length-1;n>0;n--){const r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}return t}function wk(e){return{mode:"general",language:e.language,startingLevel:e.startingLevel,repetitionTarget:e.repetitionTarget,guidedMode:e.guidedMode,categories:e.categories,dynamicAssist:e.dynamicAssist,skipUnsupported:e.skipUnsupported,commandTimeMultiplier:e.commandTimeMultiplier,knowledgeFilter:"all",hjklOnly:e.hjklOnly??!1,noHjkl:e.noHjkl??!1,opacityFade:e.opacityFade??!1,snowEffect:e.snowEffect??!1}}function Nk(e){let t=e.categories?Jm.filter(n=>e.categories.includes(n.category)):Jm;if(e.skipUnsupported){const n=nn();t=t.filter(r=>!n.has(r.id))}return t}function kk(){const[e,t]=f.useReducer(vk,Jc),[n,r]=f.useState(void 0),s=f.useRef(Date.now()),o=f.useRef(null),i=f.useRef(0),a=f.useRef(null),c=f.useRef(0),u=f.useRef([]),d=f.useRef(0),p=f.useRef(!1),m=f.useRef(null),h=f.useRef([]),g=f.useRef(null),v=f.useRef(null),{editorRef:w,statusRef:x,setContent:y,getContent:b}=Un({language:"plaintext",targetContent:n,targetEditorRef:v,onAnyKey:f.useCallback(()=>{i.current++,t({type:"INCREMENT_KEY"})},[]),onCommandExecuted:f.useCallback(M=>{if(!m.current||!h.current.length)return;const Y=zi(m.current,M,h.current,Date.now());m.current=Y,t({type:"ARCADE_COMMAND",newState:Y})},[])}),k=f.useCallback(M=>{r(M.end);const Y=setInterval(()=>{y(M.start),b()===M.start&&clearInterval(Y)},150);return()=>clearInterval(Y)},[]);function N(M){var V;const Y=c.current>=u.current.length-1;let B=m.current;if(g.current&&h.current.length>0&&!Y){const ge={...pl(g.current,h.current),maxConcurrent:((V=a.current)==null?void 0:V.concurrentChallenges)??5};m.current=ge,B=ge}if(M.solved?t({type:"CHALLENGE_SOLVED",result:M,arcadeState:B}):t({type:"CHALLENGE_FAILED",result:M,arcadeState:B}),Y){p.current=!1;return}const I=c.current+1;c.current=I,d.current=0,s.current=Date.now(),i.current=0;const O=u.current[I];O&&k(O)}f.useEffect(()=>(o.current=setInterval(()=>{if(!p.current||a.current===null)return;const M=Date.now()-s.current;d.current=M,t({type:"TICK",ms:M});const Y=a.current.timeLimitMs;if(Y>0&&M>=Y){const B=u.current[c.current];if(!B)return;const I={challengeId:B.id,title:B.title,solved:!1,elapsedMs:M,keystrokes:i.current,points:0};N(I)}if(m.current&&h.current.length>0){const B=qi(m.current,h.current,Date.now());m.current=B,t({type:"ARCADE_TICK",newState:B})}},100),()=>{o.current&&clearInterval(o.current)}),[]),f.useEffect(()=>{if(e.status==="results"&&e.config){const M={id:crypto.randomUUID(),timestamp:Date.now(),challengeCount:e.config.challengeCount,difficulty:e.config.difficulty,solved:e.results.filter(I=>I.solved).length,totalKeystrokes:e.results.reduce((I,O)=>I+O.keystrokes,0),totalElapsedMs:e.results.reduce((I,O)=>I+O.elapsedMs,0),totalPoints:e.totalScore},Y=As(),B=zb(Y,M);Bi(B)}},[e.status]);const E=f.useCallback(M=>{const Y=Rg(),B=new Set(pd()),I=Y.filter(P=>!B.has(P.id)),O=M.difficulty==="all"?I:I.filter(P=>P.difficulty===M.difficulty),V=bk(O).slice(0,M.challengeCount),ge=wk(M),fe=Nk(M),R={...pl(ge,fe),maxConcurrent:M.concurrentChallenges};g.current=ge,h.current=fe,m.current=R,a.current=M,u.current=V,c.current=0,d.current=0,i.current=0,s.current=Date.now(),p.current=!0,t({type:"START",challenges:V,config:M,arcadeState:R}),V[0]&&k(V[0])},[k]),j=f.useCallback(()=>{const M=u.current[c.current];if(!M||a.current===null||!p.current)return;const Y=b(),B=Ag(Y,M.end),I=d.current,O=a.current.timeLimitMs||3e5;let V=0;if(B){const{multiplier:fe}=ng(I,O);V=Math.floor(rg(0)*10*fe)}const ge={challengeId:M.id,title:M.title,solved:B,elapsedMs:I,keystrokes:i.current,points:V};N(ge)},[b]),C=f.useCallback(()=>{p.current=!1,a.current=null,u.current=[],c.current=0,d.current=0,i.current=0,m.current=null,h.current=[],g.current=null,r(void 0),t({type:"RESET"})},[]),D=e.status==="playing"?e.challenges[e.index]??null:null;return{editorRef:w,statusRef:x,targetEditorRef:v,state:e,currentChallenge:D,startGame:E,checkSolution:j,resetGame:C}}const zr=kn,Sk=`The quick brown fox
jumps over the lazy dog.

function hello(name) {
  return "Hello, " + name;
}

const items = [1, 2, 3, 4, 5];
const result = items.map(x => x * 2);

// Line ten
// Line eleven
// Line twelve
`;let Zm=0;function jk(e,t){const n=t.toLowerCase();return e.id.toLowerCase().includes(n)||e.question.toLowerCase().includes(n)||e.category.toLowerCase().includes(n)||e.solution.some(r=>r.toLowerCase().includes(n))}function Ck(e,t){switch(t.type){case"SET_SEARCH":return{...e,search:t.value};case"SELECT_COMMAND":return{...e,selected:t.cmd,log:[],completed:!1};case"APPEND_LOG":{const n=[...e.log,t.entry];return{...e,log:n.length>200?n.slice(-200):n}}case"CLEAR_LOG":return{...e,log:[]};case"SET_COMPLETED":return{...e,completed:t.value};case"RELOAD_UNSUPPORTED":return{...e,unsupported:nn()};case"RELOAD_KNOWN":return{...e,known:Dr()};case"TOGGLE_UNSUPP_ONLY":return{...e,showUnsuppOnly:!e.showUnsuppOnly};case"CYCLE_KNOWN_FILTER":{const n=e.showKnownFilter==="all"?"known":e.showKnownFilter==="known"?"unknown":"all";return{...e,showKnownFilter:n}}case"START_DRILL":return{...e,isDrill:!0};case"STOP_DRILL":return{...e,isDrill:!1};case"ADVANCE_DRILL":{const n=t.commands.findIndex(s=>{var o;return s.id===((o=e.selected)==null?void 0:o.id)}),r=t.commands[n+1]??t.commands[0]??null;return{...e,selected:r,log:[],completed:!1}}case"TOGGLE_AUTO_ADVANCE":return{...e,autoAdvance:!e.autoAdvance};default:return e}}const Ek={search:"",selected:null,log:[],completed:!1,unsupported:nn(),known:Dr(),showUnsuppOnly:!1,showKnownFilter:"all",isDrill:!1,autoAdvance:!0};function Tk({unsupportedIds:e,allCmds:t,onClose:n}){const[r,s]=f.useState(!1),[o,i]=f.useState("id"),a=f.useMemo(()=>{if(o==="id")return JSON.stringify({version:"v1",unsupported:e},null,2);const d=e.map(p=>{const m=t.find(h=>h.id===p);return m?o==="command"?`${p}  // ${m.solution.join(", ")}`:`${p}  // ${m.question}`:p});return JSON.stringify({version:"v1",unsupported:d},null,2)},[e,t,o]);function c(){navigator.clipboard.writeText(a).then(()=>{s(!0),setTimeout(()=>s(!1),1500)}).catch(()=>{})}function u(){Qb(a,"unsupported-defaults.json")}return l.jsx("div",{className:"fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4",onClick:n,children:l.jsxs("div",{className:"bg-gray-900 border border-gray-600 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]",onClick:d=>d.stopPropagation(),children:[l.jsxs("div",{className:"flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0",children:[l.jsxs("span",{className:"text-white font-mono font-bold text-sm",children:["Export Unsupported (",e.length," entries)"]}),l.jsx("button",{onClick:n,className:"text-gray-400 hover:text-white font-mono text-sm px-1 transition-colors","aria-label":"Close",children:"×"})]}),l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2 border-b border-gray-700 flex-shrink-0 bg-gray-800/50",children:[l.jsx("span",{className:"text-xs text-gray-400 font-mono",children:"Export as:"}),[{id:"id",label:"ID only"},{id:"command",label:"+ Command"},{id:"description",label:"+ Description"}].map(d=>l.jsx("button",{onClick:()=>i(d.id),className:`px-2 py-1 rounded text-xs border transition-colors ${o===d.id?"bg-blue-800 border-blue-600 text-blue-200 font-bold":"bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-400"}`,children:d.label},d.id)),o!=="id"&&l.jsx("span",{className:"text-xs text-gray-500 ml-1",children:"Comments are stripped on import"})]}),l.jsx("pre",{className:"flex-1 overflow-auto p-4 text-xs text-green-300 font-mono bg-gray-950 rounded-b-none",children:a}),l.jsxs("div",{className:"flex gap-3 px-4 py-3 border-t border-gray-700 flex-shrink-0",children:[l.jsx("button",{onClick:c,className:`flex-1 py-2 rounded text-sm font-mono font-bold transition-colors border ${r?"bg-green-800 border-green-600 text-green-200":"bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"}`,children:r?l.jsxs(l.Fragment,{children:[l.jsx(mi,{className:"w-3.5 h-3.5 mr-1 inline"}),"Copied!"]}):"📋 Copy JSON"}),l.jsx("button",{onClick:u,className:"flex-1 py-2 rounded bg-blue-700 hover:bg-blue-600 text-white text-sm font-mono font-bold transition-colors border border-blue-600",children:l.jsxs(l.Fragment,{children:[l.jsx(ud,{className:"w-3.5 h-3.5 mr-1 inline"}),"Download"]})})]})]})})}function Mk({onBack:e}){const[t,n]=f.useReducer(Ck,Ek),[r,s]=f.useState(!1),[o,i]=f.useState("question"),{search:a,selected:c,log:u,completed:d,unsupported:p,known:m,showUnsuppOnly:h,showKnownFilter:g,isDrill:v,autoAdvance:w}=t,x=f.useRef(w),y=f.useRef(v),b=f.useRef(c),k=f.useRef(()=>{}),N=f.useRef(!1);f.useEffect(()=>{x.current=w},[w]),f.useEffect(()=>{y.current=v},[v]),f.useEffect(()=>{b.current=c,N.current=!1},[c]);const E=f.useRef(null),j=f.useRef(null),C=f.useRef(new tg);f.useEffect(()=>{var S;(S=E.current)==null||S.scrollIntoView({behavior:"smooth"})},[u]),f.useEffect(()=>{var S;v&&((S=j.current)==null||S.scrollIntoView({behavior:"smooth",block:"nearest"}))},[c,v]);const D=f.useMemo(()=>zr.filter(S=>!(h&&!p.has(S.id)||g==="known"&&!m.has(S.id)||g==="unknown"&&m.has(S.id)||a&&!jk(S,a))),[a,h,g,p,m]),M=f.useCallback(()=>{n({type:"ADVANCE_DRILL",commands:D}),C.current.reset(),k.current()},[D]);function Y(){const S=c&&D.some(_=>_.id===c.id)?c:D[0]??null;n({type:"SELECT_COMMAND",cmd:S}),C.current.reset(),n({type:"START_DRILL"})}function B(S){p.has(S)?$m(S):ls(S),n({type:"RELOAD_UNSUPPORTED"})}function I(S){Ub(S),n({type:"RELOAD_KNOWN"})}function O(S){ls(S),n({type:"RELOAD_UNSUPPORTED"}),v&&setTimeout(()=>M(),300)}function V(){window.confirm(`Mark all ${zr.length} commands as unsupported? This cannot be undone automatically.`)&&(zr.forEach(S=>ls(S.id)),n({type:"RELOAD_UNSUPPORTED"}))}function ge(){window.confirm(`Clear all ${p.size} unsupported marks?`)&&(Hi(new Set),n({type:"RELOAD_UNSUPPORTED"}))}const fe=f.useCallback(S=>{if(N.current)return;N.current=!0;const _=b.current;n({type:"SET_COMPLETED",value:!0}),_&&p.has(_.id)&&($m(_.id),n({type:"RELOAD_UNSUPPORTED"})),y.current&&x.current?setTimeout(()=>M(),500):setTimeout(()=>n({type:"SET_COMPLETED",value:!1}),1500)},[M]),R=f.useCallback(S=>{const _=b.current,de=((_==null?void 0:_.solution.map(re=>Nn(re)))??[]).includes(Nn(S)),Oe={id:++Zm,key:S,vimMode:"normal",inSolutions:!0,matchResult:S,matchesChallenge:de,isEmitted:!0,timestamp:Date.now()};n({type:"APPEND_LOG",entry:Oe}),de&&fe(S)},[fe]),P=f.useCallback(S=>{if(!S.display)return;S.vimMode!=="normal"&&C.current.reset();let _=null;if(S.vimMode==="normal"){const pe=C.current.push(S.display);_=pe.length>0?pe[pe.length-1]:null}const ee=b.current,de=(ee==null?void 0:ee.solution.map(pe=>Nn(pe)))??[],Oe=_!==null?de.includes(_):null,re={id:++Zm,key:S.display,vimMode:S.vimMode,inSolutions:S.inSolutions,matchResult:_,matchesChallenge:Oe,isEmitted:!1,timestamp:Date.now()};n({type:"APPEND_LOG",entry:re}),Oe&&fe(_)},[fe]),{editorRef:L,statusRef:z,focusEditor:ue}=Un({language:"plaintext",defaultValue:Sk,onKeyDisplay:P,onCommandExecuted:R});k.current=ue,f.useEffect(()=>{function S(_){v&&!w&&_.altKey&&_.key==="n"&&(_.preventDefault(),M())}return document.addEventListener("keydown",S),()=>document.removeEventListener("keydown",S)},[v,w,M]);const ye=[],ae={};for(const S of D)ae[S.category]||(ae[S.category]=[],ye.push(S.category)),ae[S.category].push(S);const Ze=p.size,Ie=D.findIndex(S=>S.id===(c==null?void 0:c.id));return l.jsxs("div",{className:"h-full bg-gray-900 flex flex-col overflow-hidden font-mono",children:[l.jsxs("div",{className:"flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 flex-wrap font-mono",children:[l.jsx("h1",{className:"text-white font-bold text-base flex-shrink-0",children:"Dev Mode"}),l.jsx("input",{type:"text",placeholder:"Search…",value:a,onChange:S=>n({type:"SET_SEARCH",value:S.target.value}),className:"px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-40"}),l.jsxs("div",{className:"flex items-center gap-2 ml-auto flex-wrap",children:[l.jsx("button",{onClick:v?()=>n({type:"STOP_DRILL"}):Y,disabled:D.length===0,className:`px-3 py-1.5 rounded text-xs font-bold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${v?"bg-orange-600 border-orange-500 text-white":"bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400"}`,children:v?l.jsxs(l.Fragment,{children:[l.jsx(Zt,{className:"w-3.5 h-3.5 mr-1 inline"}),"Drill ",Ie+1,"/",D.length]}):l.jsxs(l.Fragment,{children:[l.jsx(Zt,{className:"w-3.5 h-3.5 mr-1 inline"}),"Start Drill"]})}),v&&l.jsxs(l.Fragment,{children:[l.jsx("button",{onClick:()=>n({type:"TOGGLE_AUTO_ADVANCE"}),className:`px-3 py-1.5 rounded text-xs border transition-colors ${w?"bg-orange-900/50 border-orange-700 text-orange-300":"bg-gray-700 border-gray-600 text-gray-400"}`,title:"Toggle auto-advance on match",children:w?l.jsxs(l.Fragment,{children:[l.jsx(I1,{className:"w-3.5 h-3.5 mr-1 inline"}),"Auto"]}):l.jsxs(l.Fragment,{children:[l.jsx(tw,{className:"w-3.5 h-3.5 mr-1 inline"}),"Manual"]})}),!w&&l.jsx("button",{onClick:M,className:"px-3 py-1.5 rounded text-xs border border-gray-500 bg-gray-700 text-gray-300 hover:border-gray-300 hover:text-white transition-colors",children:"Next → ⌥N"})]}),l.jsx("button",{onClick:()=>n({type:"CYCLE_KNOWN_FILTER"}),className:`px-3 py-1.5 rounded text-xs border transition-colors ${g==="known"?"bg-yellow-900/60 border-yellow-600 text-yellow-300":g==="unknown"?"bg-blue-900/40 border-blue-700 text-blue-300":"bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"}`,children:g==="known"?l.jsxs(l.Fragment,{children:[l.jsx(Gr,{className:"w-3.5 h-3.5 mr-1 inline fill-yellow-500 text-yellow-500"}),"Known only (",[...m].filter(S=>zr.some(_=>_.id===S)).length,")"]}):g==="unknown"?l.jsxs(l.Fragment,{children:[l.jsx(Gr,{className:"w-3.5 h-3.5 mr-1 inline"}),"Unknown only"]}):l.jsxs(l.Fragment,{children:[l.jsx(Gr,{className:"w-3.5 h-3.5 mr-1 inline fill-yellow-500 text-yellow-500"}),"Known (",[...m].filter(S=>zr.some(_=>_.id===S)).length,")"]})}),l.jsx("button",{onClick:()=>n({type:"TOGGLE_UNSUPP_ONLY"}),className:`px-3 py-1.5 rounded text-xs border transition-colors ${h?"bg-red-900/60 border-red-600 text-red-300":"bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"}`,children:l.jsxs(l.Fragment,{children:[l.jsx(Hl,{className:"w-3.5 h-3.5 mr-1 inline"}),"Unsupported (",Ze,")"]})}),l.jsx("button",{onClick:V,className:"px-3 py-1.5 rounded text-xs border border-red-900 bg-red-950/30 text-red-500 hover:text-red-300 hover:border-red-700 transition-colors",title:"Mark every command as unsupported (prompts for confirmation)",children:l.jsxs(l.Fragment,{children:[l.jsx(Hl,{className:"w-3.5 h-3.5 mr-1 inline"}),"Mark all"]})}),Ze>0&&l.jsx("button",{onClick:ge,className:"px-3 py-1.5 rounded text-xs border border-gray-600 bg-gray-700 text-gray-400 hover:text-white transition-colors",title:"Remove all unsupported marks (prompts for confirmation)",children:l.jsxs(l.Fragment,{children:[l.jsx(mi,{className:"w-3.5 h-3.5 mr-1 inline"}),"Clear all"]})}),Ze>0&&l.jsx("button",{onClick:()=>s(!0),className:"px-3 py-1.5 rounded text-xs border border-gray-600 bg-gray-700 text-gray-400 hover:text-white transition-colors",title:"Export unsupported list as JSON",children:l.jsxs(l.Fragment,{children:[l.jsx(ud,{className:"w-3.5 h-3.5 mr-1 inline"}),"Export (",Ze,")"]})})]})]}),l.jsxs("div",{className:"flex flex-1 overflow-hidden",children:[l.jsxs("div",{className:"w-72 flex-shrink-0 flex flex-col border-r border-gray-700 overflow-hidden",children:[l.jsxs("div",{className:"flex items-center gap-1 px-2 py-1.5 bg-gray-800/70 border-b border-gray-700 flex-shrink-0",children:[l.jsx("span",{className:"text-gray-500 text-xs mr-1",children:"Show:"}),["question","solution","id"].map(S=>l.jsx("button",{onClick:()=>i(S),className:`px-2 py-0.5 rounded text-xs border transition-colors ${o===S?"bg-blue-800 border-blue-600 text-blue-200 font-bold":"bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-400"}`,children:S==="question"?"Desc":S==="solution"?"Cmd":"ID"},S))]}),l.jsxs("div",{className:"flex-1 overflow-y-auto text-xs",children:[D.length===0&&l.jsx("p",{className:"text-gray-600 italic px-4 py-4",children:"No commands match."}),ye.map(S=>l.jsxs("div",{children:[l.jsx("div",{className:"sticky top-0 bg-gray-800 px-3 py-1.5 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700 z-10",children:S}),ae[S].map(_=>{const ee=p.has(_.id),de=(c==null?void 0:c.id)===_.id,Oe=o==="question"?_.question:o==="solution"?_.solution.join(", "):_.id,re=o==="question"?_.solution.join(", "):_.question;return l.jsxs("div",{className:`flex items-center border-b border-gray-800 ${de?v?"bg-orange-900/40 border-orange-800":"bg-blue-900/40 border-blue-800":ee?"bg-red-950/30":"hover:bg-gray-800"}`,children:[l.jsxs("button",{ref:de?j:void 0,onClick:()=>{n({type:"SELECT_COMMAND",cmd:_}),C.current.reset(),ue()},className:"flex-1 text-left px-3 py-2 min-w-0",children:[l.jsxs("div",{className:`truncate flex items-center gap-1 ${ee?"text-red-400":de?"text-white":"text-gray-300"}`,children:[m.has(_.id)&&l.jsx(Gr,{className:"w-3 h-3 fill-yellow-500 text-yellow-500 flex-shrink-0"}),Oe]}),l.jsxs("div",{className:`text-xs truncate ${ee?"text-red-600":"text-gray-500"}`,children:[re,o!=="id"?` · Lv${_.level}`:` · ${_.id} · Lv${_.level}`]})]}),l.jsx("button",{onClick:()=>v&&de?O(_.id):B(_.id),title:ee?"Remove from unsupported":"Mark as unsupported",className:`flex-shrink-0 px-2 py-2 transition-colors ${ee?"text-red-500 hover:text-red-300":"text-gray-700 hover:text-red-500"}`,children:l.jsx(Hl,{className:"w-3.5 h-3.5"})})]},_.id)})]},S))]})]}),l.jsxs("div",{className:"flex-1 flex flex-col overflow-hidden",children:[l.jsx("div",{className:`flex-shrink-0 px-4 py-3 border-b border-gray-700 transition-colors ${d?"bg-green-900/40 border-green-700":"bg-gray-800"}`,children:c?l.jsxs("div",{className:"flex items-start justify-between gap-4",children:[l.jsxs("div",{children:[l.jsxs("p",{className:`text-sm font-bold ${p.has(c.id)?"text-red-400":"text-white"}`,children:[c.question,p.has(c.id)&&l.jsx("span",{className:"ml-2 text-xs text-red-500 font-normal",children:"(unsupported)"})]}),l.jsxs("div",{className:"flex gap-2 mt-1 flex-wrap",children:[c.solution.map((S,_)=>l.jsx("kbd",{className:"px-2 py-0.5 bg-gray-700 text-yellow-300 text-xs rounded border border-gray-600",children:S},_)),l.jsxs("span",{className:"text-gray-500 text-xs self-center",children:["· ",c.category," · Lv",c.level]})]})]}),l.jsxs("div",{className:"flex items-center gap-2 flex-shrink-0",children:[d&&l.jsx("span",{className:"text-green-400 font-bold text-sm",children:"✓ MATCHED!"}),l.jsx("button",{onClick:()=>I(c.id),className:`px-2 py-1 rounded text-xs border transition-colors ${m.has(c.id)?"bg-yellow-900/50 border-yellow-700 text-yellow-300 hover:bg-yellow-900":"bg-gray-700 border-gray-600 text-gray-400 hover:border-yellow-600 hover:text-yellow-400"}`,children:m.has(c.id)?l.jsxs(l.Fragment,{children:[l.jsx(Gr,{className:"w-3.5 h-3.5 mr-1 inline fill-yellow-500 text-yellow-500"}),"Known"]}):l.jsxs(l.Fragment,{children:[l.jsx(Gr,{className:"w-3.5 h-3.5 mr-1 inline"}),"Unknown"]})}),l.jsx("button",{onClick:()=>v?O(c.id):B(c.id),className:`px-2 py-1 rounded text-xs border transition-colors ${p.has(c.id)?"bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900":"bg-gray-700 border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-400"}`,children:p.has(c.id)?l.jsxs(l.Fragment,{children:[l.jsx(mi,{className:"w-3.5 h-3.5 mr-1 inline"}),"restore"]}):l.jsxs(l.Fragment,{children:[l.jsx(Hl,{className:"w-3.5 h-3.5 mr-1 inline"}),"unsupported"]})})]})]}):l.jsx("p",{className:"text-gray-500 text-xs",children:"← Select a command, or start Drill mode"})}),l.jsx("div",{className:"flex-1 min-h-0",children:l.jsx("div",{ref:L,className:"h-full"})}),l.jsx("div",{ref:z,className:"h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400"})]}),l.jsxs("div",{className:"w-80 flex-shrink-0 border-l border-gray-700 flex flex-col overflow-hidden",children:[l.jsxs("div",{className:"flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0",children:[l.jsx("span",{className:"text-gray-400 text-xs uppercase tracking-wider",children:"Keystroke Log"}),l.jsx("button",{onClick:()=>{n({type:"CLEAR_LOG"}),C.current.reset()},className:"text-gray-600 hover:text-gray-300 text-xs",children:"Clear"})]}),l.jsxs("div",{className:"flex-1 overflow-y-auto p-2 space-y-0.5 text-xs",children:[u.length===0&&l.jsx("p",{className:"text-gray-600 italic px-1 py-2",children:"Type in the editor…"}),u.map(S=>{const _=S.vimMode==="normal"?"N":"O",ee=S.matchesChallenge?"bg-green-900/30 border-l-2 border-green-600":S.isEmitted?"bg-blue-900/20 border-l-2 border-blue-700":S.matchResult&&!S.matchesChallenge?"bg-yellow-900/10":"";return l.jsxs("div",{className:`px-2 py-0.5 font-mono text-xs leading-5 ${ee}`,children:[l.jsxs("span",{className:S.vimMode==="normal"?"text-gray-600":"text-indigo-500",children:["[",_,"]"]})," ",l.jsx("span",{className:S.isEmitted?"text-blue-300 font-bold":S.matchesChallenge?"text-green-300 font-bold":S.vimMode==="normal"?"text-white":"text-indigo-300",children:S.key}),S.matchResult&&S.matchResult!==S.key&&l.jsxs("span",{className:S.matchesChallenge?"text-green-500":"text-yellow-600",children:[" → ",S.matchResult]}),S.inSolutions&&!S.matchResult&&l.jsx("span",{className:"text-blue-600",children:" (sol)"}),S.matchesChallenge&&l.jsx("span",{className:"text-green-400 font-bold",children:" ✓"})]},S.id)}),l.jsx("div",{ref:E})]})]})]}),r&&l.jsx(Tk,{unsupportedIds:[...p].sort(),allCmds:zr,onClose:()=>s(!1)})]})}function rr(){try{const e=localStorage.getItem(X.CUSTOM_VG_CHALLENGES);return e?JSON.parse(e):[]}catch{return[]}}function Zc(e){try{localStorage.setItem(X.CUSTOM_VG_CHALLENGES,JSON.stringify(e))}catch{}}function xo({icon:e,title:t}){return l.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[l.jsx(e,{className:"w-4 h-4 text-yellow-400"}),l.jsx("h2",{className:"text-sm font-bold text-white uppercase tracking-wider",children:t})]})}function Kn({label:e,required:t,children:n,hint:r}){return l.jsxs("div",{className:"space-y-1",children:[l.jsxs("label",{className:"text-xs text-gray-400 font-mono",children:[e,t&&l.jsx("span",{className:"text-red-400 ml-1",children:"*"})]}),n,r&&l.jsx("p",{className:"text-[11px] text-gray-600",children:r})]})}const _k={easy:"text-green-400  bg-green-900/30  border border-green-800",medium:"text-yellow-400 bg-yellow-900/30 border border-yellow-800",hard:"text-red-400    bg-red-900/30    border border-red-800"},kr="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono",eu="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono resize-y",Va={id:"",title:"",description:"",difficulty:"medium",tags:"",start:"",end:"",vimgolfId:""};function Rk(e){return{id:e.id,title:e.title,description:e.description??"",difficulty:e.difficulty,tags:(e.tags??[]).join(", "),start:e.start,end:e.end,vimgolfId:e.vimgolfId??""}}function Lk({onChanged:e}){const[t,n]=f.useState(()=>rr()),[r,s]=f.useState(null),[o,i]=f.useState(null),[a,c]=f.useReducer((N,E)=>({...N,...E}),Va),[u,d]=f.useState(""),[p,m]=f.useState(!1),h=N=>c(N),g=r!==null;function v(){const N=rr();n(N),e()}function w(N){var E;s(N.id),c(Rk(N)),d(""),m(!1),(E=document.getElementById("challenge-form"))==null||E.scrollIntoView({behavior:"smooth"})}function x(){s(null),c(Va),d("")}function y(N){const E=rr().filter(j=>j.id!==N);Zc(E),i(null),r===N&&x(),v()}function b(){if(d(""),!a.id.trim()){d("ID is required.");return}if(!a.title.trim()){d("Title is required.");return}if(!a.start.trim()){d("Starting content is required.");return}if(!a.end.trim()){d("Target content is required.");return}const N={id:a.id.trim(),title:a.title.trim(),description:a.description.trim(),difficulty:a.difficulty,tags:a.tags.split(",").map(j=>j.trim()).filter(Boolean),start:a.start,end:a.end,vimgolfId:a.vimgolfId.trim()||void 0},E=rr().filter(j=>j.id!==N.id);Zc([...E,N]),s(null),c(Va),m(!0),setTimeout(()=>m(!1),2e3),v()}function k(){const N=JSON.stringify(t,null,2),E=new Blob([N],{type:"application/json"}),j=URL.createObjectURL(E),C=document.createElement("a");C.href=j,C.download="vimgolf-custom-challenges.json",C.click(),URL.revokeObjectURL(j)}return l.jsxs("div",{className:"space-y-5",children:[t.length===0?l.jsx("p",{className:"text-xs text-gray-600 italic",children:"No custom challenges yet. Add one below."}):l.jsxs("div",{children:[l.jsxs("div",{className:"flex items-center justify-between mb-2",children:[l.jsxs("span",{className:"text-xs text-gray-500",children:[t.length," custom challenge",t.length!==1?"s":""]}),l.jsxs("button",{type:"button",onClick:k,className:"flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors font-mono",title:"Download all custom challenges as JSON",children:[l.jsx(ud,{className:"w-3.5 h-3.5"}),"Export"]})]}),l.jsx("div",{className:"space-y-1",children:t.map(N=>l.jsxs("div",{className:`flex items-center gap-2 px-3 py-2 rounded border text-xs font-mono transition-colors ${r===N.id?"bg-blue-900/30 border-blue-700":"bg-gray-800 border-gray-700"}`,children:[l.jsx("span",{className:`px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 ${_k[N.difficulty]}`,children:N.difficulty[0].toUpperCase()}),l.jsxs("div",{className:"flex-1 min-w-0",children:[l.jsx("span",{className:"text-white truncate block",children:N.title}),l.jsx("span",{className:"text-gray-600 text-[10px]",children:N.id})]}),l.jsx("button",{type:"button",onClick:()=>w(N),className:"text-gray-500 hover:text-blue-400 transition-colors p-1 flex-shrink-0",title:"Edit",children:l.jsx(sw,{className:"w-3.5 h-3.5"})}),o===N.id?l.jsxs(l.Fragment,{children:[l.jsx("button",{type:"button",onClick:()=>y(N.id),className:"text-red-400 hover:text-red-300 transition-colors text-[10px] flex-shrink-0 animate-pulse",children:"Confirm"}),l.jsx("button",{type:"button",onClick:()=>i(null),className:"text-gray-600 hover:text-gray-400 transition-colors p-1 flex-shrink-0",children:l.jsx(hi,{className:"w-3.5 h-3.5"})})]}):l.jsx("button",{type:"button",onClick:()=>i(N.id),className:"text-gray-600 hover:text-red-400 transition-colors p-1 flex-shrink-0",title:"Delete",children:l.jsx(Mw,{className:"w-3.5 h-3.5"})})]},N.id))})]}),l.jsx("hr",{className:"border-gray-700"}),l.jsxs("div",{id:"challenge-form",children:[l.jsxs("div",{className:"flex items-center justify-between mb-3",children:[l.jsx("span",{className:"text-xs font-bold text-gray-300 uppercase tracking-wider",children:g?`Editing: ${r}`:"New Challenge"}),g&&l.jsxs("button",{type:"button",onClick:x,className:"text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1",children:[l.jsx(hi,{className:"w-3.5 h-3.5"})," Cancel"]})]}),l.jsxs("div",{className:"space-y-3",children:[l.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[l.jsx(Kn,{label:"ID",required:!0,hint:"Unique identifier, e.g. my_challenge_1",children:l.jsx("input",{value:a.id,onChange:N=>h({id:N.target.value}),placeholder:"my_challenge_1",readOnly:g,className:`${kr} ${g?"opacity-60 cursor-default":""}`})}),l.jsx(Kn,{label:"Title",required:!0,children:l.jsx("input",{value:a.title,onChange:N=>h({title:N.target.value}),placeholder:"Delete trailing spaces",className:kr})})]}),l.jsx(Kn,{label:"Description",children:l.jsx("input",{value:a.description,onChange:N=>h({description:N.target.value}),placeholder:"Optional description",className:kr})}),l.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[l.jsx(Kn,{label:"Difficulty",children:l.jsx("div",{className:"flex gap-2",children:["easy","medium","hard"].map(N=>l.jsx("button",{type:"button",onClick:()=>h({difficulty:N}),className:`px-3 py-1 rounded text-xs font-mono capitalize transition-colors ${a.difficulty===N?N==="easy"?"bg-green-700 text-white":N==="medium"?"bg-yellow-700 text-white":"bg-red-700 text-white":"bg-gray-700 text-gray-400 hover:bg-gray-600"}`,children:N},N))})}),l.jsx(Kn,{label:"Tags",hint:"Comma-separated",children:l.jsx("input",{value:a.tags,onChange:N=>h({tags:N.target.value}),placeholder:"motion, delete",className:kr})})]}),l.jsx(Kn,{label:"Starting content",required:!0,children:l.jsx("textarea",{value:a.start,onChange:N=>h({start:N.target.value}),placeholder:"The text the editor starts with…",rows:4,className:eu})}),l.jsx(Kn,{label:"Target content",required:!0,children:l.jsx("textarea",{value:a.end,onChange:N=>h({end:N.target.value}),placeholder:"The text the editor must become…",rows:4,className:eu})}),l.jsx(Kn,{label:"VimGolf.com challenge ID",hint:"Optional — for attribution",children:l.jsx("input",{value:a.vimgolfId,onChange:N=>h({vimgolfId:N.target.value}),placeholder:"4d1a34cce3f1d84e5500001c",className:kr})}),u&&l.jsx("p",{className:"text-xs text-red-400",children:u}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("button",{type:"button",onClick:b,className:"px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-mono transition-colors",children:g?"Update challenge":"Save challenge"}),p&&l.jsx("span",{className:"text-xs text-green-400",children:g?"Updated!":"Saved!"})]})]})]})]})}function Ik({onSaved:e}){const[t,n]=f.useState(""),[r,s]=f.useState(""),[o,i]=f.useState(null);function a(){var c;s(""),i(null);try{const u=JSON.parse(t),d=Array.isArray(u)?u:[u],p=[];for(const g of d){if(!((c=g.id)!=null&&c.trim())){s('Every entry must have an "id" field.');return}if(!g.title||!g.start||!g.end){s(`Entry "${g.id}" is missing "title", "start", or "end".`);return}p.push({id:g.id.trim(),title:g.title,description:g.description??"",start:g.start,end:g.end,difficulty:g.difficulty??"medium",tags:g.tags??[],vimgolfId:g.vimgolfId})}const m=rr(),h=new Map(m.map(g=>[g.id,g]));for(const g of p)h.set(g.id,g);Zc([...h.values()]),n(""),i(p.length),setTimeout(()=>i(null),3e3),e()}catch{s("Invalid JSON.")}}return l.jsxs("div",{className:"space-y-2",children:[l.jsxs("p",{className:"text-xs text-gray-500",children:["Paste a JSON object or an array of objects. Required fields per entry:"," ",l.jsx("code",{className:"text-gray-300",children:"id, title, start, end"}),". Optional:"," ",l.jsx("code",{className:"text-gray-300",children:"description, difficulty, tags, vimgolfId"}),". Existing entries with the same ID are overwritten."]}),l.jsx("textarea",{value:t,onChange:c=>n(c.target.value),placeholder:`{
  "id": "my_id",
  "title": "...",
  "start": "...",
  "end": "..."
}`,rows:7,className:eu}),r&&l.jsx("p",{className:"text-xs text-red-400",children:r}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("button",{type:"button",onClick:a,className:"px-4 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded text-xs font-mono transition-colors",children:"Import"}),o!==null&&l.jsxs("span",{className:"text-xs text-green-400",children:[o," challenge",o!==1?"s":""," imported."]})]})]})}function Ok(){var x;const[e,t]=f.useState(""),[n,r]=f.useState(!1),[s,o]=f.useState(!1),[i,a]=f.useState(""),c=fd(),u=Us(),d=e.trim(),p=((x=c[d])==null?void 0:x.length)??0,m=u[d]!==void 0,h=Object.keys(c).length;function g(y){a(y),setTimeout(()=>a(""),2500)}function v(){d&&(ek(d),t(""),r(!1),g("Scores cleared."))}function w(){localStorage.removeItem(X.VIMGOLF_SCORES),localStorage.removeItem(X.VIMGOLF_RECORDS),o(!1),g("All scores cleared.")}return l.jsxs("div",{className:"space-y-5",children:[l.jsxs("div",{className:"space-y-3",children:[l.jsx("p",{className:"text-xs text-gray-500",children:"Enter a challenge ID to permanently delete its scores and personal best."}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx("input",{value:e,onChange:y=>{t(y.target.value),r(!1)},placeholder:"challenge-id",className:`${kr} flex-1`}),n?l.jsxs("div",{className:"flex gap-1 flex-shrink-0",children:[l.jsx("button",{type:"button",onClick:v,className:"px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono transition-colors animate-pulse",children:"Confirm"}),l.jsx("button",{type:"button",onClick:()=>r(!1),className:"px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-mono transition-colors",children:"Cancel"})]}):l.jsx("button",{type:"button",onClick:()=>{d&&r(!0)},disabled:!d,className:"px-3 py-1.5 bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white rounded text-xs font-mono transition-colors flex-shrink-0",children:"Reset"})]}),d&&(p>0||m)&&l.jsxs("p",{className:"text-xs text-gray-400",children:["Found:"," ",l.jsxs("span",{className:"text-white",children:[p," score",p!==1?"s":""]}),m&&l.jsxs("span",{children:[", personal best ",l.jsx("span",{className:"text-yellow-400",children:u[d]})," ","keystrokes"]})]}),d&&p===0&&!m&&l.jsx("p",{className:"text-xs text-gray-600",children:"No scores found for this ID."})]}),l.jsx("hr",{className:"border-gray-700"}),l.jsx("div",{className:"space-y-3",children:l.jsxs("div",{className:"flex items-start justify-between",children:[l.jsxs("div",{children:[l.jsx("p",{className:"text-xs text-gray-300 font-mono",children:"Reset all scores"}),l.jsxs("p",{className:"text-xs text-gray-600 mt-0.5",children:["Clears every score and personal best.",h>0&&l.jsxs("span",{className:"text-gray-500 ml-1",children:["(",h," challenge",h!==1?"s":""," currently have scores)"]})]})]}),s?l.jsxs("div",{className:"flex gap-1 flex-shrink-0",children:[l.jsx("button",{type:"button",onClick:w,className:"px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-mono transition-colors animate-pulse",children:"Yes, clear everything"}),l.jsx("button",{type:"button",onClick:()=>o(!1),className:"px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-mono transition-colors",children:"Cancel"})]}):l.jsx("button",{type:"button",onClick:()=>o(!0),disabled:h===0,className:"px-3 py-1.5 bg-red-900 hover:bg-red-800 disabled:opacity-40 text-red-300 rounded text-xs font-mono transition-colors flex-shrink-0",children:"Reset all"})]})}),i&&l.jsx("p",{className:"text-xs text-green-400",children:i})]})}function Ak(){const[e,t]=f.useState(()=>pd()),[n,r]=f.useState(""),s=f.useMemo(()=>{const a=new Map,c=Rg();for(const u of c)a.set(u.id,u.title);for(const u of rr())a.set(u.id,u.title);return a},[]);function o(){const a=n.trim();if(!a||e.includes(a)){r("");return}const c=[...e,a];Qm(c),t(c),r("")}function i(a){const c=e.filter(u=>u!==a);Qm(c),t(c)}return l.jsxs("div",{className:"space-y-3",children:[l.jsx("p",{className:"text-xs text-gray-500",children:"Excluded challenges are hidden from the VimGolf listing and not used in Goal Mode."}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx("input",{value:n,onChange:a=>r(a.target.value),onKeyDown:a=>{a.key==="Enter"&&o()},placeholder:"challenge-id",className:`${kr} flex-1`}),l.jsxs("button",{type:"button",onClick:o,className:"px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-mono transition-colors flex-shrink-0 flex items-center gap-1",children:[l.jsx(iw,{className:"w-3.5 h-3.5"})," Exclude"]})]}),e.length===0?l.jsx("p",{className:"text-xs text-gray-600 italic",children:"No challenges excluded."}):l.jsx("div",{className:"space-y-1",children:e.map(a=>{const c=s.get(a);return l.jsxs("div",{className:"flex items-center justify-between px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs font-mono",children:[l.jsx("div",{className:"min-w-0",children:c?l.jsxs(l.Fragment,{children:[l.jsx("span",{className:"text-white truncate block",children:c}),l.jsx("span",{className:"text-gray-600 text-[10px]",children:a})]}):l.jsx("span",{className:"text-gray-400",children:a})}),l.jsx("button",{type:"button",onClick:()=>i(a),className:"text-gray-600 hover:text-red-400 transition-colors ml-3 flex-shrink-0",title:"Remove from exclusion list",children:l.jsx(hi,{className:"w-3.5 h-3.5"})})]},a)})})]})}function Dk(){const[e,t]=f.useState("challenges"),[n,r]=f.useState(()=>rr().length);function s(){r(rr().length)}const o=[{id:"challenges",icon:X1,label:"Challenges"},{id:"import",icon:Um,label:"Import JSON"},{id:"reset",icon:pi,label:"Reset Scores"},{id:"exclude",icon:Yc,label:"Excluded"}];return l.jsx("div",{className:"min-h-screen bg-gray-900 font-mono text-white",children:l.jsxs("div",{className:"max-w-2xl mx-auto py-8 px-5",children:[l.jsxs("div",{className:"mb-6",children:[l.jsx("h1",{className:"text-lg font-bold text-yellow-400 tracking-wider mb-1",children:"VimGolf Management"}),l.jsxs("p",{className:"text-xs text-gray-500",children:["Manage custom challenges, scores, and visibility.",n>0&&l.jsxs("span",{className:"ml-2 text-gray-400",children:[n," custom challenge",n!==1?"s":""," stored."]})]})]}),l.jsx("div",{className:"flex gap-1 border-b border-gray-700 mb-6",children:o.map(i=>l.jsxs("button",{onClick:()=>t(i.id),className:`flex items-center gap-1.5 px-3 py-2 text-xs font-mono transition-colors border-b-2 -mb-px ${e===i.id?"border-yellow-400 text-white":"border-transparent text-gray-500 hover:text-gray-300"}`,children:[l.jsx(i.icon,{className:"w-3.5 h-3.5"}),i.label]},i.id))}),l.jsxs("div",{className:"bg-gray-800/40 border border-gray-700 rounded-xl p-5",children:[e==="challenges"&&l.jsxs(l.Fragment,{children:[l.jsx(xo,{icon:rw,title:"Custom Challenges"}),l.jsx(Lk,{onChanged:s})]}),e==="import"&&l.jsxs(l.Fragment,{children:[l.jsx(xo,{icon:Um,title:"Import from JSON"}),l.jsx(Ik,{onSaved:s})]}),e==="reset"&&l.jsxs(l.Fragment,{children:[l.jsx(xo,{icon:pi,title:"Reset Challenge Scores"}),l.jsx(Ok,{})]}),e==="exclude"&&l.jsxs(l.Fragment,{children:[l.jsx(xo,{icon:Yc,title:"Excluded Challenges"}),l.jsx(Ak,{})]})]})]})})}/**
 * @license @lucide/lab v0.1.2 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pk=[["circle",{cx:"6",cy:"9",r:"2",key:"1x7ecr"}],["path",{d:"M6 11v2",key:"dh4kw5"}],["path",{d:"m22 2-9.3 14.1c-.4.6-1 .9-1.7.9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2c1.6 0 3.1-.7 4.1-2.1l2.6-3.8",key:"162yko"}]];function Fk(e){return l.jsx(ug,{iconNode:Pk,...e})}function $k({onSelectArcade:e,onSelectVimGolf:t,onSelectGoal:n,onSelectMotionRace:r,onSelectQvimx:s,onSelectVimTutor:o,onSelectVimBots:i}){const a=[{icon:pg,name:"Arcade Mode",tagline:"Race the clock — score points for every vim command",onClick:e},{icon:cd,name:"VimTutor",tagline:"Follow the official vim tutorial — practice every lesson hands-on",onClick:o}],c=[{icon:Fk,name:"VimGolf",tagline:"Fewest keystrokes wins — transform text, pure efficiency",onClick:t},{icon:Gs,name:"Goal Mode",tagline:"Transform text under time pressure — real editing challenges",onClick:n}],u=[{icon:$1,name:"Motion Race",tagline:"Navigate to highlighted positions — pure vim movement, no editing",onClick:r},{icon:T1,name:"QVIMX",tagline:"Claim territory with vim motions — avoid the balls, beat the AI",onClick:s}],d=[{icon:Ps,name:"VimBots",tagline:"Survive the robot horde — dodge, navigate, outlast every level",onClick:i}];function p({card:m,fullWidth:h}){return l.jsxs("button",{onClick:m.onClick,className:`bg-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-6 text-left transition-all hover:bg-gray-800/80 focus:outline-none focus:border-green-500 ${h?"w-full":""}`,children:[l.jsx(m.icon,{className:"w-10 h-10 mb-3 text-gray-300"}),l.jsx("div",{className:"font-mono font-bold text-white text-lg mb-1",children:m.name}),l.jsx("div",{className:"font-mono text-gray-400 text-sm leading-snug",children:m.tagline})]},m.name)}return l.jsx("div",{className:"min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 py-12",children:l.jsxs("div",{className:"w-full max-w-2xl",children:[l.jsxs("div",{className:"text-center mb-10",children:[l.jsx("h1",{className:"text-5xl font-bold text-white font-mono mb-2",children:"VIM ARCADE"}),l.jsx("p",{className:"text-gray-400 font-mono text-sm",children:"Choose your mode"})]}),l.jsxs("div",{className:"flex flex-col gap-4",children:[l.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:a.map(m=>l.jsx(p,{card:m},m.name))}),l.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:c.map(m=>l.jsx(p,{card:m},m.name))}),l.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:u.map(m=>l.jsx(p,{card:m},m.name))}),l.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:d.map(m=>l.jsx(p,{card:m},m.name))})]})]})})}const ef=kn,mt=["Cursor movement","Marks","Search and replace","Folding"],On={lineNumber:1,column:1},Fg={status:"playing",endReason:null,config:{language:"typescript",endGoal:"timed",targetCount:10,durationMs:6e4,startFromPrevious:!0,distanceMode:"mixed",goalDisplayMode:"next",multiGoalCount:3,snakeTrail:!0,enemyCount:0,enemyTrail:!1,enemySpeed:"medium",snowEffect:!1,opacityFade:!1,confettiOnGoal:!1,penaltyFlash:!1,hjklOnly:!1,noHjkl:!1,fogOfWar:!1,enemyMultiColor:!0,showMinimap:!0,challengeMode:!1,challengeCategories:mt,challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeDrillMode:!1,padEmptyLines:!0,startAtFirstLine:!0,solidTrails:!0,trailLengthMultiplier:1,enemyTrailSolid:!0,enemyTrailMultiplier:1},from:On,goals:[On],currentPos:On,keystrokes:0,contentValid:!0,completedPaths:[],totalElapsedMs:0,pathElapsedMs:0,trail:[],userScore:0,enemies:[],enemyScore:0,activeChallenge:null,challengeScore:0,lastCollision:0};function Gk(e,t){switch(t.type){case"START":return{...Fg,status:"playing",config:t.config,from:t.from,currentPos:t.from,goals:t.goals,activeChallenge:t.firstChallenge,trail:[{...t.from,age:0}],lastCollision:0};case"CURSOR_MOVED":return{...e,currentPos:t.pos,trail:t.trail};case"CONTENT_INVALID":return{...e,contentValid:!1};case"TICK":return{...e,totalElapsedMs:t.totalMs,pathElapsedMs:t.pathMs};case"INCREMENT_KEYS":return{...e,keystrokes:e.keystrokes+1};case"NEXT_PATH":return{...e,from:t.from,goals:t.goals,currentPos:t.from,keystrokes:0,contentValid:!0,completedPaths:t.completed,totalElapsedMs:t.totalMs,pathElapsedMs:0,userScore:t.userScore};case"GOAL_REPLACED":return{...e,goals:t.goals,completedPaths:t.completed,totalElapsedMs:t.totalMs,pathElapsedMs:0,userScore:t.userScore};case"END":return{...e,status:"results",endReason:t.reason,completedPaths:t.completed,totalElapsedMs:t.totalMs};case"ENEMY_TICK":return{...e,enemies:t.enemies,enemyScore:t.enemyScore,goals:t.goals};case"CHALLENGE_DONE":return{...e,activeChallenge:t.next,challengeScore:t.challengeScore};case"TRAIL_COLLISION":return{...e,lastCollision:Date.now()};default:return e}}const Ua=8,Ba=25;function ra(e){return e.split(`
`).map((t,n)=>{const r=[];for(let s=0;s<t.length;s++){const o=t.charCodeAt(s);o>=33&&o<=126&&r.push(s+1)}return{n:n+1,cols:r}}).filter(({cols:t})=>t.length>0)}function zk(e,t){return Math.abs(e.lineNumber-t.lineNumber)}function js(e,t){return e.lineNumber===t.lineNumber&&e.column===t.column}function qk(e,t,n){const r=zk(e,t);if(r===0)return!1;switch(n){case"short":return r<=Ua;case"medium":return r>Ua&&r<=Ba;case"long":return r>Ba;case"mixed":return Math.random()<.7?r<=Ua:r>Ba}}function Cs(e,t){return t.some(n=>js(n,e))}function Kl(e,t,n,r,s=[],o){const a=(o??ra(e)).filter(({n:u})=>u!==t.lineNumber).flatMap(({n:u,cols:d})=>d.map(p=>({lineNumber:u,column:p}))).filter(u=>!Cs(u,n)&&!s.some(d=>js(d,u))),c=a.filter(u=>qk(t,u,r));return c.length>0?c[Math.floor(Math.random()*c.length)]:a.length>0?a[Math.floor(Math.random()*a.length)]:null}function tf(e,t,n){const r=n??ra(e),s=r.flatMap(({n:o,cols:i})=>i.map(a=>({lineNumber:o,column:a}))).filter(o=>!Cs(o,t));if(s.length===0){const o=r.flatMap(({n:i,cols:a})=>a.map(c=>({lineNumber:i,column:c})));return o.length>0?o[Math.floor(Math.random()*o.length)]:null}return s[Math.floor(Math.random()*s.length)]}function nf(e,t,n,r,s,o){const i=[];for(let a=0;a<n;a++){const c=Kl(e,t,r,s,i,o);c&&i.push(c)}return i}function rf(e,t){return t==="infinite"?1/0:(e>0?e+1:0)*t}function lf(e,t,n){if(n===0)return[];const r=e.map(s=>({...s,age:s.age+1}));return n===1/0?[{...t,age:1},...r]:[{...t,age:1},...r].slice(0,n)}const $l={slow:1200,medium:500,fast:200,mixed:0};function Vk(e,t){const n=t.split(`
`),r=Math.min(Math.max(e.lineNumber-1,0),n.length-1);function s(c){const u=n[c]??"",d=[];for(let p=0;p<u.length;p++)u[p].trim()!==""&&d.push(p+1);return d}let o=s(r);if(o.length===0){for(let c=1;c<n.length;c++)for(const u of[1,-1]){const d=r+u*c;if(!(d<0||d>=n.length)&&(o=s(d),o.length>0))return{lineNumber:d+1,column:o[0]}}return On}let i=o[0],a=Math.abs(e.column-i);for(const c of o){const u=Math.abs(e.column-c);u<a&&(a=u,i=c)}return{lineNumber:r+1,column:i}}const Uk=6;function Bk(e,t,n,r){const o=ra(t).flatMap(({n:a,cols:c})=>c.map(u=>({lineNumber:a,column:u}))),i=[];for(let a=0;a<e;a++){const c=o[Math.floor(Math.random()*o.length)]??On,u=r?a%Uk:0;i.push({id:a,pos:c,trail:[],score:0,colorIdx:u})}return i}function Hk(e,t,n,r){const{pos:s}=e;if(js(s,t))return s;const o=t.lineNumber-s.lineNumber,i=t.column-s.column,a=[];Math.abs(o)>=Math.abs(i)?(a.push({lineNumber:s.lineNumber+Math.sign(o),column:s.column}),a.push({lineNumber:s.lineNumber,column:s.column+Math.sign(i)})):(a.push({lineNumber:s.lineNumber,column:s.column+Math.sign(i)}),a.push({lineNumber:s.lineNumber+Math.sign(o),column:s.column}));for(const c of a)if(!(Cs(c,n)||r.some(d=>Cs(c,d))))return c;return s}function Wk(){const[e,t]=f.useReducer(Gk,Fg),n=f.useRef(null),r=f.useRef(""),s=f.useRef([]),o=f.useRef(0),i=f.useRef(0),a=f.useRef(0),c=f.useRef(!0),u=f.useRef(0),d=f.useRef([On]),p=f.useRef([]),m=f.useRef("idle"),h=f.useRef(null),g=f.useRef(!1),v=f.useRef(0),w=f.useRef([]),x=f.useRef([]),y=f.useRef(0),b=f.useRef(null),k=f.useRef(0),N=f.useRef(0),E=f.useRef([]),j=f.useRef(()=>{}),C=f.useRef(()=>{}),D=f.useRef(()=>{}),M=f.useRef(()=>{}),Y=f.useRef(()=>{}),B=f.useRef(()=>null),I=f.useRef(null);f.useEffect(()=>()=>{E.current.forEach(clearInterval),h.current&&clearTimeout(h.current)},[]),jl(n.current?{hjklOnly:n.current.hjklOnly,noHjkl:n.current.noHjkl}:null,e.status==="playing"),f.useEffect(()=>{p.current=e.completedPaths},[e.completedPaths]),f.useEffect(()=>{w.current=e.trail},[e.trail]),f.useEffect(()=>{x.current=e.enemies},[e.enemies]),f.useEffect(()=>{b.current=e.activeChallenge},[e.activeChallenge]);const O=f.useCallback((J,te)=>{const oe=n.current,Pe=!(oe!=null&&oe.fogOfWar),ce=(oe==null?void 0:oe.solidTrails)||(oe==null?void 0:oe.endGoal)==="survival",Ke=!!(oe!=null&&oe.enemyTrailSolid),ve=[...J.map(he=>({...he,type:"user",isSolid:ce})),...Pe?te.map(he=>({...he.pos,age:0,type:"enemy",colorIdx:he.colorIdx,isSolid:Ke})):[],...Pe?te.flatMap(he=>he.trail.map(Ae=>({...Ae,type:"enemy",colorIdx:he.colorIdx,isSolid:Ke}))):[]];D.current(ve)},[]),V=f.useCallback(J=>{if(m.current!=="playing")return;const te=Date.now(),oe=te-i.current,Pe=te-a.current,ce=n.current,Ke={keystrokes:u.current,elapsedMs:Pe,valid:J},ve=[...p.current,Ke],he=v.current+(J?1:0),Ae=ce.endGoal==="user_count"&&he>=ce.targetCount,Qe=ce.endGoal==="total_count"&&he+N.current>=ce.targetCount,st=ce.endGoal==="timed"&&oe>=ce.durationMs;if(Ae||Qe||st){m.current="results",C.current([]),t({type:"END",completed:ve,totalMs:oe,reason:Ae||Qe?"count":"timed"});return}const G=d.current[0],me=ce.startFromPrevious?G:void 0,_e=w.current,Re=me??tf(r.current,_e,s.current)??On,T=ce.goalDisplayMode==="all"?nf(r.current,Re,ce.multiGoalCount,_e,ce.distanceMode,s.current):(()=>{const q=Kl(r.current,Re,_e,ce.distanceMode,[],s.current);return q?[q]:[]})();T.length&&(c.current=!0,u.current=0,a.current=Date.now(),v.current=he,d.current=T,p.current=ve,J?ce.startFromPrevious||(j.current(Re),Y.current()):(g.current=!0,M.current(r.current),Promise.resolve().then(()=>{j.current(Re),g.current=!1,Y.current()})),C.current(T),t({type:"NEXT_PATH",from:Re,goals:T,completed:ve,totalMs:oe,userScore:he}))},[]),ge=f.useCallback(J=>{if(m.current!=="playing")return;const te=Date.now(),oe=te-i.current,Pe=te-a.current,ce=n.current,Ke={keystrokes:u.current,elapsedMs:Pe,valid:!0},ve=[...p.current,Ke],he=v.current+1;u.current=0,a.current=Date.now(),v.current=he;const Ae=ce.endGoal==="user_count"&&he>=ce.targetCount,Qe=ce.endGoal==="total_count"&&he+N.current>=ce.targetCount;if(Ae||Qe){m.current="results",C.current([]),t({type:"END",completed:ve,totalMs:oe,reason:"count"});return}const st=d.current[J],G=[...d.current];G.splice(J,1);const me=w.current,_e=Kl(r.current,st,me,ce.distanceMode,G,s.current);_e&&G.splice(J,0,_e),d.current=G,p.current=ve,C.current(G),t({type:"GOAL_REPLACED",goals:G,completed:ve,totalMs:oe,userScore:he})},[]),fe=f.useCallback(()=>{const J=I.current;J&&(I.current=null,g.current=!0,M.current(r.current),Promise.resolve().then(()=>{g.current=!1}),j.current(J.from),C.current(J.goals),Y.current())},[]),R=f.useRef(On),P=f.useCallback(J=>{if(m.current!=="playing")return;const te=n.current,oe=[...te.snakeTrail?w.current:[],...te.enemyTrail&&te.enemyTrailSolid?x.current.flatMap(Ae=>Ae.trail):[]],Pe=te.endGoal==="survival",ce=Cs(J,oe);if(oe.length>0&&ce){if(Pe){m.current="results";const Ae=Date.now()-i.current;C.current([]),t({type:"END",completed:p.current,totalMs:Ae,reason:"survival"});return}else if(te.solidTrails){j.current(R.current),t({type:"TRAIL_COLLISION"});return}}R.current=J;const Ke=te.snakeTrail?lf(w.current,J,rf(v.current,te.trailLengthMultiplier)):[];O(Ke,x.current),t({type:"CURSOR_MOVED",pos:J,trail:Ke});const he=d.current.findIndex(Ae=>js(Ae,J));he!==-1&&(te.goalDisplayMode==="all"?ge(he):V(c.current))},[V,ge,O]),L=f.useCallback(J=>{m.current==="playing"&&(g.current||c.current&&(c.current=!1,t({type:"CONTENT_INVALID"}),h.current&&clearTimeout(h.current),h.current=setTimeout(()=>{V(!1)},1200)))},[V]),z=f.useCallback(()=>{m.current==="playing"&&(u.current+=1,t({type:"INCREMENT_KEYS"}))},[]),ue=f.useRef(new Map),ye=f.useCallback(J=>{if(m.current!=="playing")return;const te=n.current;if(!(te!=null&&te.challengeMode))return;const oe=b.current;if(!oe||!oe.solution.map(G=>Nn(G)).includes(Nn(J)))return;const ce=ue.current,Ke=(ce.get(oe.id)??0)+1;ce.set(oe.id,Ke);const ve=te.challengeRepetition??1,he=y.current+1;y.current=he;const Ae=Ke>=ve,Qe=ef.filter(G=>te.challengeCategories.includes(G.category)&&G.level>=(te.challengeStartingLevel??0)&&(Ae?G.id!==oe.id:G.id===oe.id));let st;if(!Ae)st=oe;else if(Qe.length===0)st=null;else if(te.challengeDrillMode){const G=k.current%Qe.length;st=Qe[G],k.current=(G+1)%Qe.length}else st=Qe[Math.floor(Math.random()*Qe.length)];b.current=st,t({type:"CHALLENGE_DONE",next:st,challengeScore:he})},[]),{editorRef:ae,statusRef:Ze,setContent:Ie,positionCursor:S,setGoalHighlights:_,setTrailDecorations:ee,setTargetHighlight:de,focusEditor:Oe,getVisibleRange:re}=Un({onReady:fe,onCursorChange:P,onContentChange:L,onAnyKey:z,onCommandExecuted:ye});j.current=S,C.current=_,D.current=ee,M.current=Ie,Y.current=Oe,B.current=re;const pe=f.useCallback(J=>{if(m.current!=="playing")return;const te=n.current,oe=d.current;if(!oe.length)return;const Pe=x.current;if(J>=Pe.length)return;const ce=Pe[J],Ke=Pe.map(q=>q.trail),ve=w.current,he=oe[ce.id%oe.length],Ae=Hk(ce,he,ve,Ke),Qe=Vk(Ae,r.current),st=te.enemyTrail?rf(v.current,te.trailLengthMultiplier):0,G=st>0?lf(ce.trail,ce.pos,st):[],me=[...Pe];me[J]={...ce,pos:Qe,trail:G};let _e=N.current,Re=[...oe];const T=Re.findIndex(q=>js(q,Qe));if(T!==-1){_e++;const q=Kl(r.current,Qe,w.current,te.distanceMode,Re,s.current);q&&(Re[T]=q)}x.current=me,N.current=_e,d.current=Re,O(w.current,me),C.current(Re),t({type:"ENEMY_TICK",enemies:me,enemyScore:_e,goals:Re})},[O]),ke=f.useCallback(()=>{const J=x.current.length;for(let te=0;te<J;te++)pe(te)},[pe]);f.useEffect(()=>{if(e.status!=="playing")return;const J=setInterval(()=>{const te=Date.now(),oe=te-i.current,Pe=te-a.current;t({type:"TICK",totalMs:oe,pathMs:Pe});const ce=n.current;(ce==null?void 0:ce.endGoal)==="timed"&&oe>=ce.durationMs&&m.current==="playing"&&(m.current="results",C.current([]),t({type:"END",completed:p.current,totalMs:oe,reason:"timed"}))},100);return()=>clearInterval(J)},[e.status]),f.useEffect(()=>{if(e.status==="results"){const J={id:crypto.randomUUID(),timestamp:Date.now(),endGoal:e.config.endGoal==="user_count"?"total_goals":e.config.endGoal,score:e.userScore,keystrokes:e.keystrokes,sessionDurationMs:e.totalElapsedMs,language:e.config.language},te=As(),oe=Gb(te,J);Bi(oe)}},[e.status]);const lt=f.useCallback(J=>{h.current&&clearTimeout(h.current),E.current.forEach(clearInterval),E.current=[];let te=Mg(J.language);J.padEmptyLines&&(te=te.split(`
`).map(ve=>ve===""?" ":ve).join(`
`)),r.current=te,s.current=ra(te),o.current=te.split(`
`).length;const oe=J.startAtFirstLine?(()=>{const ve=s.current.find(he=>he.n===1);return{lineNumber:1,column:ve?ve.cols[0]:1}})():tf(te,[])??On,Pe=J.goalDisplayMode==="all"?nf(te,oe,J.multiGoalCount,[],J.distanceMode,s.current):(()=>{const ve=Kl(te,oe,[],J.distanceMode);return ve?[ve]:[]})();if(!Pe.length)return;n.current=J,m.current="playing",c.current=!0,u.current=0,p.current=[],d.current=Pe,i.current=Date.now(),a.current=Date.now(),v.current=0,w.current=[],N.current=0,y.current=0,ue.current=new Map,k.current=0;const ce=J.challengeMode?(()=>{const ve=ef.filter(he=>J.challengeCategories.includes(he.category)&&he.level>=(J.challengeStartingLevel??0));if(ve.length===0)return null;if(J.challengeDrillMode){const he=ve[0];return k.current=1%ve.length,he}return ve[Math.floor(Math.random()*ve.length)]})():null;b.current=ce;const Ke=Bk(J.enemyCount,te,[],J.enemyMultiColor);if(x.current=Ke,J.enemyCount>0)if(J.enemySpeed==="mixed"){const ve=[$l.slow,$l.medium,$l.fast];for(let he=0;he<J.enemyCount;he++){const Ae=ve[Math.floor(Math.random()*ve.length)],Qe=he,st=setInterval(()=>pe(Qe),Ae);E.current.push(st)}}else{const ve=$l[J.enemySpeed]||$l.medium,he=setInterval(ke,ve);E.current.push(he)}I.current={from:oe,goals:Pe},g.current=!0,M.current(te),Promise.resolve().then(()=>{g.current=!1}),j.current(oe),C.current(Pe),D.current([]),t({type:"START",config:J,from:oe,goals:Pe,firstChallenge:ce})},[pe,ke]);return{state:e,editorRef:ae,statusRef:Ze,startGame:lt,getVisibleRange:re,totalLines:o.current}}function la({title:e,onBack:t,backLabel:n,children:r}){return l.jsxs("div",{className:"flex items-center gap-3 px-4 py-2.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 flex-wrap font-mono",children:[l.jsx("button",{onClick:t,className:"text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors flex items-center gap-1.5",children:n??l.jsxs(l.Fragment,{children:[l.jsx(Ds,{className:"w-4 h-4"})," Back"]})}),l.jsx("span",{className:"text-white font-bold text-base",children:e}),r&&l.jsx("div",{className:"flex items-center gap-3 ml-auto flex-wrap text-sm",children:r})]})}const Kk=[3,5,10,15,20,30],Qk=[{label:"1 min",ms:6e4},{label:"2 min",ms:12e4},{label:"5 min",ms:3e5},{label:"10 min",ms:6e5}],Yk=[{id:"short",label:"Short",desc:"Stay nearby (≤8 lines)"},{id:"medium",label:"Medium",desc:"Mid-range (9–25 lines)"},{id:"long",label:"Long",desc:"Far away (26+ lines)"},{id:"mixed",label:"Mixed",desc:"Mostly short, occasional long"}],Xk=[{id:"next",label:"Next only",desc:"One goal at a time"},{id:"all",label:"All at once",desc:"Multiple visible, collect any order"}],Jk=[{id:"timed",icon:yr,label:"Timed",desc:"Play until time runs out"},{id:"user_count",icon:Ki,label:"Count (you)",desc:"Collect N goals yourself"},{id:"total_count",icon:yg,label:"Count (all)",desc:"N goals total — yours + enemies"},{id:"survival",icon:$s,label:"Survival",desc:"Survive — hitting any trail ends the game"}],xi=["hsl(30,90%,58%)","hsl(0,90%,58%)","hsl(280,90%,68%)","hsl(185,90%,50%)","hsl(330,90%,65%)","hsl(90,85%,52%)"],Zk=[0,1,3,5,10],eS=[{id:"slow",label:"Slow"},{id:"medium",label:"Medium"},{id:"fast",label:"Fast"},{id:"mixed",label:"Mixed"}],tS={lang:"typescript",endGoal:"timed",count:10,durationMs:6e4,startFromPrev:!0,distMode:"mixed",goalDisplay:"next",multiGoalCount:3,snakeTrail:!0,enemyCount:0,enemyTrail:!1,enemySpeed:"medium",snowEffect:!1,opacityFade:!1,confettiOnGoal:!1,penaltyFlash:!1,hjklOnly:!1,noHjkl:!1,fogOfWar:!1,enemyMultiColor:!0,showMinimap:!0,challengeMode:!1,challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeCategories:mt,challengeDrillMode:!1,padEmptyLines:!0,startAtFirstLine:!0,solidTrails:!0,trailLengthMultiplier:1,enemyTrailSolid:!0,enemyTrailMultiplier:1};function nS(e,t){const n={...e,...t.payload};return(n.endGoal==="user_count"||n.endGoal==="total_count")&&n.multiGoalCount>0&&n.multiGoalCount>n.count&&(n.multiGoalCount=n.count),n}function rS({onStart:e,onBack:t}){const[n,r]=f.useReducer(nS,tS),s=d=>r({type:"PATCH",payload:d}),o=Vi(X.LAST_MOTION_CONFIG),i=n.enemyCount>0;function a(){const d={language:n.lang,endGoal:n.endGoal,targetCount:n.count,durationMs:n.durationMs,startFromPrevious:n.startFromPrev,distanceMode:n.distMode,goalDisplayMode:n.goalDisplay,multiGoalCount:n.multiGoalCount===0?n.count:n.multiGoalCount,snakeTrail:n.snakeTrail,enemyCount:n.enemyCount,enemyTrail:i&&n.enemyTrail,enemySpeed:n.enemySpeed,snowEffect:n.snowEffect,opacityFade:n.opacityFade,confettiOnGoal:n.confettiOnGoal,penaltyFlash:n.penaltyFlash,hjklOnly:n.hjklOnly&&!n.noHjkl,noHjkl:n.noHjkl&&!n.hjklOnly,fogOfWar:i&&n.fogOfWar,enemyMultiColor:n.enemyMultiColor,showMinimap:n.showMinimap,challengeMode:n.challengeMode,challengeCategories:n.challengeCategories,challengeGuidedMode:n.challengeGuidedMode,challengeStartingLevel:n.challengeStartingLevel,challengeRepetition:n.challengeRepetition,challengeTimeMultiplier:n.challengeTimeMultiplier,challengeDrillMode:n.challengeDrillMode,padEmptyLines:n.padEmptyLines,startAtFirstLine:n.startAtFirstLine,solidTrails:n.solidTrails,trailLengthMultiplier:n.trailLengthMultiplier,enemyTrailSolid:n.enemyTrailSolid,enemyTrailMultiplier:n.enemyTrailMultiplier};sd(X.LAST_MOTION_CONFIG,d),e(d)}const c=[{key:"confettiOnGoal",icon:Sw,label:"Confetti",desc:"Burst on goal collect",value:n.confettiOnGoal,onToggle:()=>s({confettiOnGoal:!n.confettiOnGoal})},{key:"penaltyFlash",icon:Qc,label:"Penalty flash",desc:"Red flash on enemy goal",value:n.penaltyFlash,onToggle:()=>s({penaltyFlash:!n.penaltyFlash})},...n.endGoal!=="survival"?[{key:"solidTrails",icon:$a,label:"Solid trails",desc:"Trails block movement",value:n.solidTrails,onToggle:()=>s({solidTrails:!n.solidTrails})}]:[]],u=n.endGoal==="total_count"?"Total goals to reach":n.endGoal==="user_count"?"Number of goals":"Duration";return l.jsxs(kl,{title:"Motion Race",subtitle:"Navigate to highlighted positions — pure vim movement",actions:l.jsxs("div",{className:"flex flex-col gap-2",children:[l.jsx(Sl,{onClick:a}),o&&l.jsx(zs,{onClick:()=>e(o),summary:`${o.endGoal} · ${o.language} · ${o.distanceMode}`})]}),children:[l.jsx(W,{label:"Language",icon:xr,defaultOpen:!0,children:l.jsx(qn,{value:n.lang,onChange:d=>s({lang:d})})}),l.jsx(W,{label:"End Condition",icon:Gs,defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-col",children:Jk.map(d=>l.jsxs("button",{onClick:()=>s({endGoal:d.id}),className:`${F.modeCard(n.endGoal===d.id)} flex items-center gap-2`,children:[l.jsx(d.icon,{className:"w-4 h-4 flex-shrink-0"}),l.jsx("span",{children:d.label}),l.jsx("span",{className:`text-xs font-normal ml-1 ${n.endGoal===d.id?"text-blue-200":"text-gray-500"}`,children:d.desc})]},d.id))})}),(n.endGoal==="user_count"||n.endGoal==="total_count")&&l.jsx(W,{label:u,icon:Ki,defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:Kk.map(d=>l.jsx("button",{onClick:()=>s({count:d}),className:F.pill(n.count===d),children:d},d))})}),n.endGoal==="timed"&&l.jsx(W,{label:"Duration",icon:yr,defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:Qk.map(d=>l.jsx("button",{onClick:()=>s({durationMs:d.ms}),className:F.pill(n.durationMs===d.ms),children:d.label},d.ms))})}),l.jsxs(W,{label:"Goal Options",icon:Wl,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Distance"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:Yk.map(d=>l.jsxs("button",{onClick:()=>s({distMode:d.id}),className:F.modeCard(n.distMode===d.id),children:[l.jsx("div",{className:"font-bold",children:d.label}),l.jsx("div",{className:`text-xs font-normal mt-0.5 ${n.distMode===d.id?"text-blue-200":"text-gray-500"}`,children:d.desc})]},d.id))}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Goal Display"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-3",children:Xk.map(d=>l.jsxs("button",{onClick:()=>s({goalDisplay:d.id}),className:F.modeCard(n.goalDisplay===d.id),children:[d.label,l.jsx("div",{className:`text-xs font-normal mt-0.5 ${n.goalDisplay===d.id?"text-blue-200":"text-gray-500"}`,children:d.desc})]},d.id))}),n.goalDisplay==="all"&&l.jsxs("div",{className:"mt-2 flex items-center gap-2 mb-3",children:[l.jsx("span",{className:"text-xs text-gray-400",children:"Simultaneous goals:"}),[2,3,4,5].filter(d=>!(n.endGoal==="user_count"||n.endGoal==="total_count")||d<=n.count).map(d=>l.jsx("button",{onClick:()=>s({multiGoalCount:d}),className:F.pill(n.multiGoalCount===d),children:d},d)),(n.endGoal==="user_count"||n.endGoal==="total_count")&&l.jsx("button",{onClick:()=>s({multiGoalCount:0}),className:F.pill(n.multiGoalCount===0),children:"All"})]}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5 mt-3",children:"Initial start"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:[!0,!1].map(d=>l.jsxs("button",{onClick:()=>s({startAtFirstLine:d}),className:F.modeCard(n.startAtFirstLine===d),children:[l.jsx("span",{className:"flex items-center gap-1.5 font-bold",children:d?"Line 1":"Random position"}),l.jsx("div",{className:`text-xs font-normal mt-0.5 ${n.startAtFirstLine===d?"text-blue-200":"text-gray-500"}`,children:d?"Start at top of file":"Start anywhere"})]},String(d)))}),n.goalDisplay==="next"&&l.jsxs(l.Fragment,{children:[l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"After first path"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[!0,!1].map(d=>l.jsxs("button",{onClick:()=>s({startFromPrev:d}),className:F.modeCard(n.startFromPrev===d),children:[l.jsx("span",{className:"flex items-center gap-1.5",children:d?l.jsxs(l.Fragment,{children:[l.jsx(Q1,{className:"w-3.5 h-3.5"})," Continue from last"]}):l.jsxs(l.Fragment,{children:[l.jsx(xw,{className:"w-3.5 h-3.5"})," Random each time"]})}),l.jsx("div",{className:`text-xs font-normal mt-0.5 ${n.startFromPrev===d?"text-blue-200":"text-gray-500"}`,children:d?"Chain paths":"Jump to fresh start"})]},String(d)))})]}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5 mt-3",children:"Editor behavior"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[!0,!1].map(d=>l.jsx("button",{onClick:()=>s({padEmptyLines:d}),className:`${F.pill(n.padEmptyLines===d)} flex items-center gap-1.5`,children:d?"Pad empty lines":"Original file content"},String(d)))})]}),l.jsxs(W,{label:"Snake Trail",icon:$a,defaultOpen:!0,children:[l.jsx("div",{className:"flex gap-2 flex-wrap",children:[!0,!1].map(d=>l.jsxs("button",{onClick:()=>s({snakeTrail:d}),className:`${F.pill(n.snakeTrail===d)} flex items-center gap-1.5`,children:[l.jsx($a,{className:"w-3.5 h-3.5"}),d?"Trail on":"No trail"]},String(d)))}),n.snakeTrail&&l.jsxs("div",{className:"mt-4",children:[l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Trail length multiplier"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[1,2,3,5,10,"infinite"].map(d=>l.jsx("button",{onClick:()=>s({trailLengthMultiplier:d}),className:F.pill(n.trailLengthMultiplier===d),children:d==="infinite"?"Infinite (Experimental)":`${d}x`},String(d)))})]})]}),l.jsxs(W,{label:"Enemies",icon:Ps,defaultOpen:!1,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Count"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:Zk.map(d=>l.jsx("button",{onClick:()=>s({enemyCount:d}),className:`px-4 py-2 rounded border text-sm font-mono transition-colors ${n.enemyCount===d?"bg-orange-700 border-orange-500 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`,children:d===0?"None":d},d))}),l.jsxs("div",{className:n.enemyCount===0?"opacity-40 pointer-events-none":"",children:[l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Speed"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:eS.map(d=>l.jsx("button",{onClick:()=>s({enemySpeed:d.id}),className:F.pill(n.enemySpeed===d.id),children:d.label},d.id))}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Enemy trails"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-3",children:[!0,!1].map(d=>l.jsxs("button",{onClick:()=>s({enemyTrail:d}),className:`${F.pill(n.enemyTrail===d)} flex items-center gap-1.5`,children:[l.jsx(fg,{className:"w-3.5 h-3.5"}),d?"Trails on":"No trails"]},String(d)))}),n.enemyTrail&&l.jsxs("div",{className:"mb-4",children:[l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Enemy trail type"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-3",children:[!0,!1].map(d=>l.jsx("button",{onClick:()=>s({enemyTrailSolid:d}),className:F.pill(n.enemyTrailSolid===d),children:d?"Solid (Blocking)":"Decorative"},String(d)))}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Enemy trail length multiplier"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-3",children:[1,2,3,5,10,"infinite"].map(d=>l.jsx("button",{onClick:()=>s({enemyTrailMultiplier:d}),className:F.pill(n.enemyTrailMultiplier===d),children:d==="infinite"?"Infinite":`${d}x`},String(d)))})]}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Fog of war"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[!0,!1].map(d=>l.jsx("button",{onClick:()=>s({fogOfWar:d}),className:`${F.pill(n.fogOfWar===d)} flex items-center gap-1.5`,children:d?l.jsxs(l.Fragment,{children:[l.jsx(Yc,{className:"w-3.5 h-3.5"})," Hide enemies"]}):l.jsxs(l.Fragment,{children:[l.jsx(mg,{className:"w-3.5 h-3.5"})," Visible"]})},String(d)))}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5 mt-3",children:"Enemy colors"}),l.jsxs("div",{className:"flex gap-2 flex-wrap",children:[l.jsxs("button",{onClick:()=>s({enemyMultiColor:!0}),className:F.pill(n.enemyMultiColor),children:[xi.slice(0,4).map((d,p)=>l.jsx("span",{style:{display:"inline-block",width:"8px",height:"8px",borderRadius:"50%",background:d,marginRight:"2px",verticalAlign:"middle"}},p))," ","Multi-color"]}),l.jsxs("button",{onClick:()=>s({enemyMultiColor:!1}),className:F.pill(!n.enemyMultiColor),children:[l.jsx("span",{style:{display:"inline-block",width:"8px",height:"8px",borderRadius:"50%",background:xi[0],marginRight:"4px",verticalAlign:"middle"}}),"Single color"]})]})]})]}),l.jsx(W,{label:"Minimap",icon:Wl,defaultOpen:!1,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:[!0,!1].map(d=>l.jsx("button",{onClick:()=>s({showMinimap:d}),className:`${F.pill(n.showMinimap===d)} flex items-center gap-1.5`,children:d?l.jsxs(l.Fragment,{children:[l.jsx(Wl,{className:"w-3.5 h-3.5"})," On"]}):l.jsxs(l.Fragment,{children:[l.jsx(Wl,{className:"w-3.5 h-3.5 opacity-40"})," Off"]})},String(d)))})}),l.jsx(qs,{config:{hjklOnly:n.hjklOnly,noHjkl:n.noHjkl,opacityFade:n.opacityFade,snowEffect:n.snowEffect},onPatch:d=>s(d),extras:c}),l.jsxs(vr,{enabled:n.challengeMode,onToggle:()=>s({challengeMode:!n.challengeMode}),children:[l.jsx("p",{className:"text-xs text-gray-500 mb-4",children:"Earn bonus points by completing motion/search commands alongside navigation. Only cursor movement, search, marks, and folding commands — no editing required."}),l.jsx(Vn,{guidedMode:n.challengeGuidedMode,onGuidedMode:d=>s({challengeGuidedMode:d}),startingLevel:n.challengeStartingLevel,onStartingLevel:d=>s({challengeStartingLevel:d}),repetition:n.challengeRepetition,onRepetition:d=>s({challengeRepetition:d}),timeMultiplier:n.challengeTimeMultiplier,onTimeMultiplier:d=>s({challengeTimeMultiplier:d}),selectableCategories:mt,selectedCategories:n.challengeCategories,onToggleCategory:d=>s({challengeCategories:md(n.challengeCategories,d)}),drillMode:n.challengeDrillMode,onDrillMode:d=>s({challengeDrillMode:d})})]})]})}function Po(e){const t=Math.floor(e/1e3),n=Math.floor(t/60);return n>0?`${n}:${String(t%60).padStart(2,"0")}`:`${t}s`}function lS(e){const t=Math.max(0,e),n=Math.ceil(t/1e3),r=Math.floor(n/60),s=n%60;return`${r}:${String(s).padStart(2,"0")}`}function sf({path:e,idx:t}){return l.jsxs("div",{className:`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${e.valid?"bg-green-900/30 border-green-800 text-green-300":"bg-red-900/30 border-red-800 text-red-400"}`,children:[l.jsxs("span",{className:"text-gray-500",children:["#",t+1]}),l.jsxs("span",{children:[e.keystrokes,"k"]}),l.jsx("span",{className:"text-gray-500",children:"·"}),l.jsx("span",{children:Po(e.elapsedMs)}),!e.valid&&l.jsx("span",{title:"Text was modified",children:"⚠"})]})}function sS({goalLine:e,isVisible:t,getRange:n}){if(t)return null;const r=n();if(!r)return null;const s=e<r.startLine?"↑":"↓";return l.jsx("div",{className:`absolute right-4 ${s==="↑"?"top-2":"bottom-2"} z-20 pointer-events-none`,children:l.jsxs("span",{className:"bg-yellow-800/80 text-yellow-300 text-lg font-bold px-2 py-1 rounded shadow-lg border border-yellow-700",children:[s," Goal"]})})}function oS({config:e,onQuit:t}){const{state:n,editorRef:r,statusRef:s,startGame:o,getVisibleRange:i,totalLines:a}=Wk();f.useEffect(()=>{o(e)},[]);const[c,u]=f.useState(!0),[d,p]=f.useState(!1),[m,h]=f.useState(!1),g=f.useRef(0),v=f.useRef(0);f.useEffect(()=>{n.userScore>g.current&&p(!0),g.current=n.userScore},[n.userScore]),f.useEffect(()=>{n.enemyScore>v.current&&h(!0),v.current=n.enemyScore},[n.enemyScore]),f.useEffect(()=>{if(!m)return;const L=setTimeout(()=>h(!1),800);return()=>clearTimeout(L)},[m]);const[w,x]=f.useState(0);f.useEffect(()=>{if(n.lastCollision>0){x(n.lastCollision);const L=setTimeout(()=>x(0),1200);return()=>clearTimeout(L)}},[n.lastCollision]);const y=f.useCallback(()=>{const L=i();if(!L||!n.goals.length){u(!0);return}const z=n.goals[0];u(z.lineNumber>=L.startLine&&z.lineNumber<=L.endLine)},[i,n.goals]);f.useEffect(()=>{y()},[y]);const{goals:b,currentPos:k,keystrokes:N,contentValid:E,completedPaths:j,totalElapsedMs:C,pathElapsedMs:D,userScore:M,enemyScore:Y}=n,B=n.status==="results",I=b[0],O=!B&&I?k.lineNumber===I.lineNumber&&k.column===I.column:!1,V=e.endGoal==="timed"?Math.max(0,e.durationMs-C):null,ge=j.length,fe=j.filter(L=>L.valid).length,R=ge>0?(j.reduce((L,z)=>L+z.keystrokes,0)/ge).toFixed(1):"—",P=ge>0?Po(j.reduce((L,z)=>L+z.elapsedMs,0)/ge):"—";return l.jsxs("div",{className:"h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative",children:[w>0&&!B&&l.jsx("div",{className:"absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-900/90 border-2 border-red-500 text-red-200 font-bold px-6 py-3 rounded-lg shadow-2xl z-50 pointer-events-none animate-pulse",children:"Blocked by trail!"}),B&&l.jsx("div",{className:"absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6",children:l.jsxs("div",{className:"w-full max-w-lg bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8",children:[l.jsxs("div",{className:"text-center mb-8",children:[l.jsx("div",{className:"flex justify-center mb-3",children:n.endReason==="survival"?l.jsx($s,{className:"w-14 h-14 text-red-400"}):l.jsx(Qi,{className:"w-14 h-14 text-yellow-400"})}),l.jsx("h2",{className:"text-3xl font-bold text-white mb-1",children:n.endReason==="survival"?"You hit a trail!":"Finished!"}),l.jsxs("p",{className:"text-gray-400 text-sm",children:[Po(C)," total"]})]}),l.jsxs("div",{className:"grid grid-cols-3 gap-4 mb-4 text-center",children:[l.jsx(Ha,{value:fe,label:"Your goals",color:"text-green-400"}),l.jsx(Ha,{value:R,label:"Avg keys",color:"text-blue-400"}),l.jsx(Ha,{value:P,label:"Avg time",color:"text-purple-400"})]}),e.enemyCount>0&&l.jsxs("div",{className:"text-center mb-4 text-orange-400 text-sm",children:["Enemies scored: ",l.jsx("span",{className:"font-bold",children:Y})]}),l.jsx("div",{className:"flex flex-wrap gap-2 mb-8 max-h-32 overflow-y-auto",children:j.map((L,z)=>l.jsx(sf,{path:L,idx:z},z))}),l.jsx("div",{className:"flex gap-3",children:l.jsx("button",{onClick:()=>o(e),className:"w-full py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors",children:"Play again"})})]})}),l.jsxs(la,{title:"Motion Race",onBack:t,backLabel:l.jsxs(l.Fragment,{children:[l.jsx(Ds,{className:"w-4 h-4"})," Quit"]}),children:[e.endGoal==="timed"&&V!==null?l.jsxs("span",{className:`font-bold tabular-nums flex items-center gap-1 ${V<1e4?"text-red-400":"text-blue-300"}`,children:[l.jsx(yr,{className:"w-3.5 h-3.5"})," ",lS(V)]}):l.jsxs("span",{className:"text-gray-400 tabular-nums",children:[l.jsx("span",{className:"text-green-400 font-bold",children:M}),e.endGoal==="user_count"&&l.jsxs("span",{className:"text-gray-600",children:[" / ",e.targetCount]})," goals"]}),e.enemyCount>0&&l.jsxs("span",{className:"text-orange-400 tabular-nums text-xs",children:["enemies: ",Y]}),l.jsx("span",{className:"text-gray-500 tabular-nums",children:Po(D)}),l.jsxs("span",{className:"text-gray-500 tabular-nums",children:[N," keys"]})]}),l.jsxs("div",{className:`flex items-center gap-4 px-4 py-2.5 border-b flex-shrink-0 text-sm transition-colors ${E?O?"bg-green-900/40 border-green-700":"bg-gray-800 border-gray-700":"bg-red-900/40 border-red-700"}`,children:[e.goalDisplayMode==="next"&&I?l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-gray-400",children:"Goal"}),l.jsxs("kbd",{className:"px-2 py-0.5 bg-yellow-900/60 border border-yellow-700 rounded text-xs text-yellow-300 font-bold",children:["L",I.lineNumber," C",I.column]}),l.jsxs("span",{className:"text-gray-600 text-xs",children:["#",ge+1,e.endGoal==="user_count"?` / ${e.targetCount}`:""]})]}):l.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[l.jsx("span",{className:"text-gray-400 text-xs",children:"Goals:"}),b.slice(0,6).map((L,z)=>l.jsxs("kbd",{className:"px-1.5 py-0.5 bg-yellow-900/60 border border-yellow-700 rounded text-xs text-yellow-300 font-bold",children:["L",L.lineNumber,"C",L.column]},z)),b.length>6&&l.jsxs("span",{className:"text-gray-500 text-xs",children:["+",b.length-6]})]}),l.jsxs("div",{className:"ml-auto flex items-center gap-3",children:[!E&&l.jsx("span",{className:"text-red-400 text-xs font-bold",children:"⚠ Text modified"}),O&&E&&l.jsxs("span",{className:"text-green-400 text-xs font-bold flex items-center gap-1",children:[l.jsx(di,{className:"w-3.5 h-3.5"})," On target!"]}),l.jsxs("span",{className:"text-gray-500 text-xs tabular-nums",children:["L",k.lineNumber," C",k.column]})]})]}),e.challengeMode&&n.activeChallenge&&!B&&(()=>{const L=n.activeChallenge,z=e.challengeGuidedMode??"none",ue=z==="all"||z==="first_only"||z==="first_then_failure"||z==="alternating";return l.jsxs("div",{className:"flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono",children:[l.jsx(Zt,{className:"w-3.5 h-3.5 text-indigo-400 flex-shrink-0"}),l.jsx("span",{className:"text-white",children:L.question}),ue&&l.jsx("div",{className:"flex gap-1.5 ml-1",children:L.solution.map((ye,ae)=>l.jsx("kbd",{className:"px-1.5 py-0.5 bg-gray-700 text-yellow-300 rounded border border-gray-600",children:ye},ae))}),l.jsxs("span",{className:"ml-auto text-indigo-400 tabular-nums",children:["+",n.challengeScore]})]})})(),l.jsxs("div",{className:"flex-1 min-h-0 flex overflow-hidden",children:[l.jsxs("div",{className:"flex-1 relative min-w-0",children:[l.jsx("div",{ref:r,className:"h-full"}),e.snowEffect&&l.jsx(Cl,{}),e.confettiOnGoal&&l.jsx(Hw,{isActive:d,onDone:()=>p(!1)}),e.penaltyFlash&&l.jsx(Ww,{isActive:m}),e.opacityFade&&l.jsx(El,{cursorLine:n.currentPos.lineNumber,getVisibleRange:i}),I&&!B&&l.jsx(sS,{goalLine:I.lineNumber,isVisible:c,getRange:i})]}),e.showMinimap&&l.jsx(iS,{totalLines:a||200,goals:n.goals,enemies:n.enemies,cursorLine:n.currentPos.lineNumber,visibleRange:i()})]}),l.jsx("div",{ref:s,className:"h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"}),j.length>0&&!B&&l.jsx("div",{className:"flex items-center gap-2 px-4 py-2 bg-gray-800 border-t border-gray-700 flex-shrink-0 overflow-x-auto",children:j.slice(-8).map((L,z)=>l.jsx(sf,{path:L,idx:j.length-Math.min(8,j.length)+z},z))})]})}function Ha({value:e,label:t,color:n}){return l.jsxs("div",{className:"bg-gray-800 rounded-xl p-4 border border-gray-700",children:[l.jsx("div",{className:`text-2xl font-bold ${n}`,children:e}),l.jsx("div",{className:"text-xs text-gray-400 mt-1",children:t})]})}function iS({totalLines:e,goals:t,enemies:n,cursorLine:r,visibleRange:s}){const o=i=>`${Math.round(i/Math.max(1,e)*100)}%`;return l.jsxs("div",{className:"w-12 flex-shrink-0 border-l border-gray-700 bg-gray-950 relative overflow-hidden select-none",children:[s&&l.jsx("div",{className:"absolute inset-x-0 bg-white/8 pointer-events-none",style:{top:o(s.startLine),height:o(s.endLine-s.startLine+1)}}),t.map((i,a)=>l.jsx("div",{className:"absolute w-2 h-2 bg-yellow-400 rotate-45 pointer-events-none",style:{top:o(i.lineNumber),left:"50%",transform:"translate(-50%, -50%) rotate(45deg)"}},`gm-${a}`)),n.map(i=>l.jsx("div",{className:"absolute w-2 h-2 rounded-full pointer-events-none",style:{top:o(i.pos.lineNumber),right:"6px",transform:"translateY(-50%)",backgroundColor:xi[i.colorIdx%xi.length]}},`em-${i.id}`)),l.jsx("div",{className:"absolute w-2.5 h-2.5 rounded-full bg-blue-400 pointer-events-none",style:{top:o(r),left:"6px",transform:"translateY(-50%)"}}),l.jsx("div",{className:"absolute bottom-1 inset-x-0 text-center text-gray-600 text-[9px] leading-none select-none",children:"map"})]})}function aS({onBack:e}){const[t,n]=f.useState(null);return t?l.jsx(cS,{config:t,onQuit:()=>{n(null)},onBack:e}):l.jsx(rS,{onStart:n,onBack:e})}function cS({config:e,onQuit:t,onBack:n}){return l.jsx(oS,{config:e,onQuit:()=>{t(),n()}})}function of(e,t){return e.lineNumber===t.lineNumber&&e.column===t.column}function Wa(e,t){return["┌"+"─".repeat(t)+"┐",...e.map(n=>"│"+n.padEnd(t)+"│"),"└"+"─".repeat(t)+"┘"]}function uS(e,t){const n=e.split(`
`);if(t==="sub-rect"){const m=Math.floor(n.length*.2),h=n.slice(m,n.length-m),g=h.length>0?h:n,v=h.length>0?m:0,w=Math.max(...g.map(j=>j.length),1),x=Wa(g,w),y=w+2,b=n.slice(0,v),k=v>0?n.slice(n.length-v):[],N=[...b,...x,...k],E={minLine:v+1,maxLine:v+g.length+2,minCol:1,maxCol:y,lineWidths:Array(N.length).fill(y)};return{borderedContent:N.join(`
`),dims:E}}if(t==="rectangles"){const m=Math.max(1,Math.floor(n.length*.05)),h=n.slice(m,n.length-m),g=h.length>0?h:n,v=h.length>0?m:0,w=Math.floor(g.length/2),x=Math.max(1,Math.floor(g.length*.04)),y=g.slice(0,w),b=g.slice(w,w+x),k=g.slice(w+x),N=Math.max(...(y.length>0?y:[""]).map(L=>L.length),1),E=Math.max(...(k.length>0?k:[""]).map(L=>L.length),1),j=Wa(y,N),C=Wa(k,E),D=n.slice(0,v),M=v>0?n.slice(n.length-v):[],Y=[...D,...j,...b,...C,...M],B=v+1,I=B+y.length+1,O=I+b.length+1,V=O+k.length+1,ge=Math.max(N,E)+2,fe={minLine:B,maxLine:I,minCol:1,maxCol:N+2,lineWidths:Array(y.length+2).fill(N+2)},R={minLine:O,maxLine:V,minCol:1,maxCol:E+2,lineWidths:Array(k.length+2).fill(E+2)},P={minLine:B,maxLine:V,minCol:1,maxCol:ge,lineWidths:Array(Y.length).fill(ge)};return{borderedContent:Y.join(`
`),dims:P,allRectDims:[fe,R]}}const r=n,s=Math.max(...r.map(m=>m.length),1),o="┌"+"─".repeat(s)+"┐",i="└"+"─".repeat(s)+"┘",a=r.map(m=>"│"+m.padEnd(s)+"│"),c=s+2,u=[o,...a,i].join(`
`),d=t==="inverse-code"||t==="code-right"?r.map(m=>m.length):void 0,p={minLine:1,maxLine:r.length+2,minCol:1,maxCol:c,lineWidths:Array(r.length+2).fill(c),...d!==void 0?{lineContentWidths:d}:{}};return{borderedContent:u,dims:p}}function af(e,t){const{lineNumber:n,column:r}=e;return n<t.minLine||n>t.maxLine||r<t.minCol||r>t.maxCol?"outside":n===t.minLine||n===t.maxLine||r===t.minCol||r===t.maxCol?"border":"interior"}function Gl(e){const t=Math.floor((e.minCol+e.maxCol)/2),n=Math.floor((e.minLine+e.maxLine)/2);return[{lineNumber:e.minLine,column:t},{lineNumber:e.maxLine,column:t},{lineNumber:n,column:e.minCol},{lineNumber:n,column:e.maxCol}]}function Ka(e){const t=[];for(let n=e.minCol;n<=e.maxCol;n++)t.push({lineNumber:e.minLine,column:n}),t.push({lineNumber:e.maxLine,column:n});for(let n=e.minLine+1;n<e.maxLine;n++)t.push({lineNumber:n,column:e.minCol}),t.push({lineNumber:n,column:e.maxCol});return t}function yo(e){const t=[];for(let n=e.minLine+1;n<e.maxLine;n++)for(let r=e.minCol+1;r<e.maxCol;r++)t.push({lineNumber:n,column:r});return t}function Cn(e){return`${e.lineNumber},${e.column}`}function dS(e,t,n,r,s){if(!t.length||!s.length)return[];const o=new Set(t.map(Cn)),i=new Set(e.map(Cn));function a(x){const y=new Set,b=[];for(const N of x){const E=Cn(N);y.has(E)||o.has(E)||!i.has(E)||(y.add(E),b.push(N))}let k=0;for(;k<b.length;){const{lineNumber:N,column:E}=b[k++];for(const[j,C]of[[-1,0],[1,0],[0,-1],[0,1]]){const D={lineNumber:N+j,column:E+C},M=Cn(D);y.has(M)||o.has(M)||!i.has(M)||(y.add(M),b.push(D))}}return y}function c(x,y){const b=s.length,k=new Set,N=[];let E=x;for(;;){const j=s[E];for(const[C,D]of[[-1,0],[1,0],[0,-1],[0,1]]){const M={lineNumber:j.lineNumber+C,column:j.column+D},Y=Cn(M);!k.has(Y)&&!o.has(Y)&&i.has(Y)&&(k.add(Y),N.push(M))}if(E===y)break;E=(E+1)%b}return N}const u=s.findIndex(x=>of(x,n)),d=s.findIndex(x=>of(x,r));if(u===-1||d===-1){const x=[],y=new Set;for(const k of s)for(const[N,E]of[[-1,0],[1,0],[0,-1],[0,1]]){const j={lineNumber:k.lineNumber+N,column:k.column+E},C=Cn(j);!y.has(C)&&!o.has(C)&&i.has(C)&&(y.add(C),x.push(j))}const b=a(x);return e.filter(k=>!b.has(Cn(k)))}const p=c(u,d),m=c(d,u),h=a(p),g=a(m),v=e.filter(x=>{const y=Cn(x);return h.has(y)&&!g.has(y)}),w=e.filter(x=>{const y=Cn(x);return g.has(y)&&!h.has(y)});return v.length<=w.length?v:w}function cf(e){const{minLine:t,maxLine:n,minCol:r,maxCol:s}=e,o=[];for(let i=r;i<=s;i++)o.push({lineNumber:t,column:i});for(let i=t+1;i<=n;i++)o.push({lineNumber:i,column:s});for(let i=s-1;i>=r;i--)o.push({lineNumber:n,column:i});for(let i=n-1;i>=t+1;i--)o.push({lineNumber:i,column:r});return o}const Qa=kn,el={slow:800,medium:400,fast:200,mixed:0},uf={passive:1200,wanderer:800,hunter:500,cutter:300,unstoppable:150},yn={lineNumber:1,column:1},mS={language:"typescript",codeSize:"medium",borderShape:"full-rect",subMode:"classic",ballCount:2,ballSpeed:"medium",enemyAI:"wanderer",lives:3,timerMs:12e4,diagonalMode:!1,challengeMode:!1,challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeCategories:mt,challengeDrillMode:!1,bombCount:0,hjklOnly:!1,noHjkl:!1,opacityFade:!1,snowEffect:!1},$g={status:"setup",config:mS,dims:null,playerPos:yn,playerLives:3,playerDrawState:"on-border",playerTempLine:[],playerClaimed:[],playerScore:0,enemyPos:yn,enemyLives:3,enemyDrawState:"on-border",enemyTempLine:[],enemyClaimed:[],enemyScore:0,balls:[],bombPatrols:[],totalElapsedMs:0,level:1,activeChallenge:null,challengeScore:0,endReason:null,penaltySeq:0,penaltySource:"",catchSeq:0,catchCount:0};function fS(e,t){switch(t.type){case"START":return{...$g,status:"playing",config:t.config,dims:t.dims,playerPos:t.playerPos,playerLives:t.config.lives,playerDrawState:"on-border",enemyPos:t.enemyPos,enemyLives:t.config.lives,enemyDrawState:"on-border",balls:t.balls,bombPatrols:t.bombPatrols,activeChallenge:t.firstChallenge,endReason:null};case"CURSOR_MOVED":return{...e,playerPos:t.pos,playerDrawState:t.playerDrawState,playerTempLine:t.playerTempLine};case"CLAIM_TERRITORY":return{...e,playerClaimed:t.playerClaimed,playerScore:t.playerScore,playerTempLine:t.playerTempLine,playerDrawState:t.playerDrawState,playerPos:t.playerPos};case"BALL_TICK":return{...e,balls:t.balls};case"BOMB_TICK":return{...e,bombPatrols:t.bombPatrols};case"ENEMY_TICK":return{...e,enemyPos:t.enemyPos,enemyDrawState:t.enemyDrawState,enemyTempLine:t.enemyTempLine,enemyClaimed:t.enemyClaimed,enemyScore:t.enemyScore};case"LOSE_LIFE":{const n={...e};return t.who==="player"?(n.playerLives=e.playerLives-1,t.playerPos&&(n.playerPos=t.playerPos),n.playerTempLine=t.playerTempLine??[],n.playerDrawState="on-border",n.penaltySeq=e.penaltySeq+1,n.penaltySource=t.penaltySource??"unknown"):(n.enemyLives=e.enemyLives-1,t.enemyPos&&(n.enemyPos=t.enemyPos),n.enemyTempLine=t.enemyTempLine??[],n.enemyDrawState="on-border"),n}case"END":return{...e,status:"results",endReason:t.endReason};case"TICK":return{...e,totalElapsedMs:t.totalMs};case"CHALLENGE_DONE":return{...e,activeChallenge:t.next,challengeScore:t.challengeScore};case"BALL_CAUGHT":return{...e,balls:t.balls,catchSeq:e.catchSeq+1,catchCount:t.count};default:return e}}function Mn(e,t){return e.lineNumber===t.lineNumber&&e.column===t.column}function pS(e,t){return t.some(n=>Mn(n,e))}function df(e,t,n){const r=[el.slow,el.medium,el.fast],s=n.minLine+1,o=n.maxLine-1,i=n.minCol+1,a=n.maxCol-1,c=Math.floor((s+o)/2),u=Math.floor((i+a)/2),d=[];for(let p=0;p<e;p++){const m=Math.floor(p/2)+1,h=Math.max(s,Math.min(o,c+(p%2===0?m:-m))),g=Math.max(i,Math.min(a,u+(p%3===0?m:-m))),v=p%2===0?1:-1,w=p%3===0?1:-1,x=t==="mixed"?r[p%3]:el[t];d.push({id:p,pos:{lineNumber:h,column:g},dx:v,dy:w,speedMs:x})}return d}function hS(e,t,n){const{lineNumber:r,column:s}=e.pos,{dx:o,dy:i}=e,a=t.minLine+1,c=t.maxLine-1,u=t.minCol+1,d=t.maxCol-1;function p(w,x){return w<a||w>c||x<u||x>d?!0:n.has(`${w},${x}`)}const m=r+i,h=s+o;if(!p(m,h))return{...e,pos:{lineNumber:m,column:h}};const g=!p(m,s),v=!p(r,h);return g&&!v?{...e,pos:{lineNumber:m,column:s},dx:-o}:v&&!g?{...e,pos:{lineNumber:r,column:h},dy:-i}:{...e,dx:-o,dy:-i}}function mf(e,t){if(e===0||t.length===0)return[];const n=[],r=Math.floor(t.length/Math.max(e,1));for(let s=0;s<e;s++)n.push({id:s,borderIdx:s*r,direction:s%2===0?1:-1});return n}function gS(e,t,n,r,s,o,i,a,c){const{minLine:u,maxLine:d,minCol:p,maxCol:m}=o;function h(w){return{lineNumber:Math.max(u,Math.min(d,w.lineNumber)),column:Math.max(p,Math.min(m,w.column))}}function g(w){return pS(w,i)}function v(w){const x=i.findIndex(y=>Mn(y,w));return x===-1?i[0]??w:i[(x+1)%i.length]}switch(c){case"passive":{if(Math.random()<.8)return g(e)?v(e):i[0]??e;const w=Math.random()>.5?1:-1;return h({lineNumber:e.lineNumber+w,column:e.column})}case"wanderer":{if(Math.random()<.7)return v(e);const w=Math.random()>.5?1:-1;return h({lineNumber:e.lineNumber,column:e.column+w})}case"hunter":{if(s.length===0)return v(e);const w=s[Math.floor(Math.random()*s.length)],x=Math.sign(w.lineNumber-e.lineNumber),y=Math.sign(w.column-e.column);return Math.abs(w.lineNumber-e.lineNumber)>=Math.abs(w.column-e.column)?h({lineNumber:e.lineNumber+(x||1),column:e.column}):h({lineNumber:e.lineNumber,column:e.column+(y||1)})}case"cutter":case"unstoppable":{if(r.length>0){const w=r[Math.floor(r.length/2)],x=Math.sign(w.lineNumber-e.lineNumber),y=Math.sign(w.column-e.column);if(x!==0)return h({lineNumber:e.lineNumber+x,column:e.column});if(y!==0)return h({lineNumber:e.lineNumber,column:e.column+y})}if(s.length>0){const w=s[Math.floor(Math.random()*s.length)],x=Math.sign(w.lineNumber-e.lineNumber),y=Math.sign(w.column-e.column);if(x!==0)return h({lineNumber:e.lineNumber+x,column:e.column});if(y!==0)return h({lineNumber:e.lineNumber,column:e.column+y})}return v(e)}default:return v(e)}}function En(e,t,n,r){return{range:new e.Range(t,n,t,n+1),options:{inlineClassName:r,description:"qvimx"}}}function xS(){const[e,t]=f.useReducer(fS,$g),n=f.useRef(null),r=f.useRef(""),s=f.useRef(null),o=f.useRef([]),i=f.useRef([]),a=f.useRef(new Set),c=f.useRef(null),u=f.useRef(0),d=f.useRef("idle"),p=f.useRef(yn),m=f.useRef("on-border"),h=f.useRef([]),g=f.useRef([]),v=f.useRef(new Set),w=f.useRef(new Set),x=f.useRef(yn),y=f.useRef("on-border"),b=f.useRef([]),k=f.useRef([]),N=f.useRef(new Set),E=f.useRef(new Set),j=f.useRef(0),C=f.useRef([]),D=f.useRef(new Set),M=f.useRef([]),Y=f.useRef([]),B=f.useRef([]),I=f.useRef(null),O=f.useRef(null),V=f.useRef(null),ge=f.useRef(()=>{}),fe=f.useRef(null),R=f.useRef(0),P=f.useRef(new Map),L=f.useRef(0),z=f.useRef(new Map),ue=f.useRef(null),ye=f.useRef(null),ae=f.useRef(null),Ze=f.useRef(null),Ie=f.useRef(()=>{}),S=f.useRef(()=>{}),_=f.useRef(()=>{}),ee=f.useRef(()=>null),de=f.useRef(null);function Oe(){z.current.forEach(T=>clearInterval(T)),z.current.clear(),ue.current&&(clearInterval(ue.current),ue.current=null),ye.current&&(clearInterval(ye.current),ye.current=null),I.current&&(clearInterval(I.current),I.current=null)}f.useEffect(()=>()=>Oe(),[]);const re=f.useCallback(()=>{const T=Ze.current,q=ae.current;if(!T||!q)return;const U=[];for(const $ of o.current)U.push(En(q,$.lineNumber,$.column,"qvimx-border"));for(const $ of C.current)U.push(En(q,$.lineNumber,$.column,"qvimx-neutral"));const Z=new Set(g.current.map($=>`${$.lineNumber},${$.column}`)),se=new Set(k.current.map($=>`${$.lineNumber},${$.column}`));function ne($,ie){return[[-1,0],[1,0],[0,-1],[0,1]].some(([Be,be])=>!ie.has(`${$.lineNumber+Be},${$.column+be}`))}for(const $ of g.current){const ie=ne($,Z)?"qvimx-player-edge":"qvimx-player-claimed";U.push(En(q,$.lineNumber,$.column,ie))}for(const $ of k.current){const ie=ne($,se)?"qvimx-enemy-edge":"qvimx-enemy-claimed";U.push(En(q,$.lineNumber,$.column,ie))}for(const $ of h.current)U.push(En(q,$.lineNumber,$.column,"qvimx-temp-line"));for(const $ of b.current)U.push(En(q,$.lineNumber,$.column,"qvimx-enemy-temp-line"));for(const $ of M.current)U.push(En(q,$.pos.lineNumber,$.pos.column,"qvimx-ball-char"));U.push(En(q,x.current.lineNumber,x.current.column,"qvimx-enemy-cursor"));for(const $ of B.current){const ie=Y.current[$.borderIdx];ie&&U.push(En(q,ie.lineNumber,ie.column,"qvimx-bomb-char"))}T.set(U)},[]);function pe(T,q){q.current=new Set(T.map(U=>`${U.lineNumber},${U.column}`))}function ke(T){const q=i.current.length;if(q===0)return 0;const U=a.current,Z=T.filter(se=>U.has(`${se.lineNumber},${se.column}`)).length;return Math.min(100,Math.round(Z/q*100))}const lt=f.useCallback((T,q,U)=>{const Z=s.current;if(!Z)return;const se=T==="player"?h.current:b.current,ne=T==="player"?g.current:k.current,$=i.current,ie=$.length,$e=v.current,Be=N.current,be=$.filter(H=>{const je=`${H.lineNumber},${H.column}`;return!$e.has(je)&&!Be.has(je)}),qe=ne.length;let ct=dS(be,se,q??o.current[0]??{lineNumber:Z.minLine,column:Z.minCol},U??o.current[1]??{lineNumber:Z.minLine,column:Z.maxCol},Y.current);if(be.length>20&&ct.length>=be.length*.9){const H=new Set(ct.map(Ge=>`${Ge.lineNumber},${Ge.column}`)),je=new Set(se.map(Ge=>`${Ge.lineNumber},${Ge.column}`)),St=be.filter(Ge=>{const Fr=`${Ge.lineNumber},${Ge.column}`;return!H.has(Fr)&&!je.has(Fr)});console.warn(`[qvimx] ${T} claim sanity: ${ct.length}/${be.length} free cells — trying complement (${St.length} cells)`),St.length<ct.length&&(ct=St)}const ht=new Set(ct.map(H=>`${H.lineNumber},${H.column}`)),Ht=T==="player"?Be:$e,et=o.current.filter(H=>{const je=`${H.lineNumber},${H.column}`;return $e.has(je)||Be.has(je)?!1:ht.has(`${H.lineNumber-1},${H.column}`)||ht.has(`${H.lineNumber+1},${H.column}`)||ht.has(`${H.lineNumber},${H.column-1}`)||ht.has(`${H.lineNumber},${H.column+1}`)}),Wt=new Set(ne.map(H=>`${H.lineNumber},${H.column}`)),ot=se.filter(H=>{const je=`${H.lineNumber},${H.column}`;return!Wt.has(je)&&!Ht.has(je)}),K=[...ne,...ct,...et,...ot];if(console.log(`[qvimx] ${T} claim: ${ct.length} interior + ${et.length} border cells | before=${qe} after=${K.length} | total interior=${ie} unclaimed=${be.length} | tempLine=${se.length}`),T==="player"){g.current=K,pe(K,v),h.current=[],m.current="on-border";const H=ke(K),je=Gl(Z),St=je.find(Ge=>!N.current.has(`${Ge.lineNumber},${Ge.column}`))??je[0]??p.current;t({type:"CLAIM_TERRITORY",playerClaimed:K,playerScore:H,playerTempLine:[],playerDrawState:"on-border",playerPos:St})}else k.current=K,pe(K,N),b.current=[],y.current="on-border",j.current=ke(K);const Ee=new Set([...v.current,...N.current,...D.current]),Te=M.current.map(H=>{if(!Ee.has(`${H.pos.lineNumber},${H.pos.column}`))return H;const je=i.current.find(St=>!Ee.has(`${St.lineNumber},${St.column}`));return je?{...H,pos:je}:H}),we=Te.filter((H,je)=>H!==M.current[je]).length;we>0&&(console.log(`[qvimx] ${T} caught ${we} ball(s) in claimed territory`),M.current=Te,t({type:"BALL_CAUGHT",balls:Te,count:we})),re()},[re]),J=f.useCallback(T=>{var $e,Be;if(d.current!=="playing"||!s.current)return;const U=c.current;if(!U)return;const Z=U(T),se=m.current,ne=h.current;let $=se,ie=[...ne];if(se==="on-border"){if(Z==="interior"){const be=p.current;O.current=be,$="drawing";const qe=c.current,ct=T.lineNumber-be.lineNumber,ht=T.column-be.column;if(Math.abs(ct)+Math.abs(ht)<=1)ie=[T];else{const et=[],Wt=(($e=n.current)==null?void 0:$e.diagonalMode)??!1;let ot=be.lineNumber,K=be.column;const Ee=Math.sign(ct),Te=Math.sign(ht);if(Wt)for(;(ot!==T.lineNumber||K!==T.column)&&(ot!==T.lineNumber&&(ot+=Ee),K!==T.column&&(K+=Te),!(ot===T.lineNumber&&K===T.column));){const we={lineNumber:ot,column:K};qe(we)==="interior"&&et.push(we)}else{for(;ot!==T.lineNumber&&(ot+=Ee,!(ot===T.lineNumber&&Te===0));){const we={lineNumber:ot,column:K};qe(we)==="interior"&&et.push(we)}for(;K!==T.column&&(K+=Te,K!==T.column);){const we={lineNumber:ot,column:K};qe(we)==="interior"&&et.push(we)}}ie=[...et,T]}}}else if(se==="drawing"){if(Z==="border"||v.current.has(`${T.lineNumber},${T.column}`)){const be=ne[ne.length-1];let qe=ne;if(be){const Ht=T.lineNumber-be.lineNumber,et=T.column-be.column;if(Math.abs(Ht)+Math.abs(et)>1){const ot=c.current,K=((Be=n.current)==null?void 0:Be.diagonalMode)??!1,Ee=[];let Te=be.lineNumber,we=be.column;const H=Math.sign(Ht),je=Math.sign(et);if(K)for(;(Te!==T.lineNumber||we!==T.column)&&(Te!==T.lineNumber&&(Te+=H),we!==T.column&&(we+=je),!(Te===T.lineNumber&&we===T.column));)ot({lineNumber:Te,column:we})==="interior"&&Ee.push({lineNumber:Te,column:we});else{for(;Te!==T.lineNumber&&(Te+=H,!(Te===T.lineNumber&&je===0));)ot({lineNumber:Te,column:we})==="interior"&&Ee.push({lineNumber:Te,column:we});for(;we!==T.column&&(we+=je,we!==T.column);)ot({lineNumber:Te,column:we})==="interior"&&Ee.push({lineNumber:Te,column:we})}qe=[...ne,...Ee]}}const ct=O.current,ht=T;O.current=null,p.current=T,m.current="on-border",h.current=qe,pe(qe,w),lt("player",ct,ht);return}else if(Z==="interior"){const be=ie[ie.length-1];if(be){const qe=ne.findIndex(ct=>Mn(ct,T));if(qe!==-1)ie=ne.slice(0,qe+1);else if(Math.abs(T.lineNumber-be.lineNumber)+Math.abs(T.column-be.column)<=1)ie=[...ne,T];else{const ht=c.current,Ht=n.current,et=[];let Wt=!1;const ot=(Ht==null?void 0:Ht.diagonalMode)??!1;let K=be.lineNumber,Ee=be.column;const Te=Math.sign(T.lineNumber-K),we=Math.sign(T.column-Ee);e:if(ot)for(;(K!==T.lineNumber||Ee!==T.column)&&(K!==T.lineNumber&&(K+=Te),Ee!==T.column&&(Ee+=we),!(K===T.lineNumber&&Ee===T.column));){const H={lineNumber:K,column:Ee},je=ne.findIndex(Ge=>Mn(Ge,H));if(je!==-1){ie=ne.slice(0,je+1),Wt=!0;break e}if(ht(H)==="border"||v.current.has(`${H.lineNumber},${H.column}`)){const Ge=O.current;O.current=null,p.current=H,m.current="on-border",h.current=[...ie,...et],lt("player",Ge,H);return}et.push(H)}else{for(;K!==T.lineNumber;){K+=Te;const H={lineNumber:K,column:Ee};if(K===T.lineNumber&&we===0)break;const je=ne.findIndex(Ge=>Mn(Ge,H));if(je!==-1){ie=ne.slice(0,je+1),Wt=!0;break e}if(ht(H)==="border"||v.current.has(`${H.lineNumber},${H.column}`)){const Ge=O.current;O.current=null,p.current=H,m.current="on-border",h.current=[...ie,...et],lt("player",Ge,H);return}et.push(H)}for(;Ee!==T.column&&(Ee+=we,Ee!==T.column);){const H={lineNumber:K,column:Ee},je=ne.findIndex(Ge=>Mn(Ge,H));if(je!==-1){ie=ne.slice(0,je+1),Wt=!0;break e}if(ht(H)==="border"||v.current.has(`${H.lineNumber},${H.column}`)){const Ge=O.current;O.current=null,p.current=H,m.current="on-border",h.current=[...ie,...et],lt("player",Ge,H);return}et.push(H)}}Wt||(ie=[...ie,...et,T])}}else ie=[T]}}p.current=T,m.current=$,h.current=ie,pe(ie,w),t({type:"CURSOR_MOVED",pos:T,playerDrawState:$,playerTempLine:ie}),re()},[lt,re]),te=f.useCallback(T=>{if(d.current!=="playing")return;const q=s.current;if(!q)return;const U=M.current,Z=U.findIndex(be=>be.id===T);if(Z===-1)return;const se=[...U],ne=new Set([...v.current,...N.current,...D.current]),$=hS(se[Z],q,ne);se[Z]=$,M.current=se;const ie=`${$.pos.lineNumber},${$.pos.column}`,$e=w.current.has(ie),Be=E.current.has(ie);$e?(console.log(`[qvimx] ball ${T} hit player temp-line at (${$.pos.lineNumber},${$.pos.column}), tempLine.length=${h.current.length}`),ce("player","ball")):Be?ce("enemy","ball"):(t({type:"BALL_TICK",balls:se}),re())},[re]),oe=f.useRef(3);f.useEffect(()=>{oe.current=e.playerLives},[e.playerLives]);const Pe=f.useCallback(()=>{if(d.current!=="playing")return;const T=Y.current;if(!T.length)return;const q=B.current.map(se=>{const ne=(se.borderIdx+se.direction+T.length)%T.length;return{...se,borderIdx:ne}});B.current=q;const U=p.current,Z=O.current;for(const se of q){const ne=T[se.borderIdx];if(!ne)continue;const $=Mn(ne,U),ie=Z!==null&&Mn(ne,Z);if($||ie){const $e=ie?"bomb-stix":"bomb";console.log(`[qvimx] bomb hit player at (${ne.lineNumber},${ne.column}), reason=${$e}`),ge.current("player",$e);return}}t({type:"BOMB_TICK",bombPatrols:q}),re()},[re]),ce=f.useCallback((T,q="unknown")=>{const U=s.current;if(!U)return;const Z=Gl(U);if(T==="player"){const se=Z.find($=>!N.current.has(`${$.lineNumber},${$.column}`))??Z[2]??Z[0]??yn;p.current=se,h.current=[],w.current=new Set,m.current="on-border",O.current=null;const ne=oe.current-1;oe.current=ne,console.log(`[qvimx] player lost life (source=${q}), lives remaining=${ne}`),t({type:"LOSE_LIFE",who:"player",playerPos:se,playerTempLine:[],penaltySource:q}),S.current(se),ne<=0&&(d.current="results",Oe(),t({type:"END",endReason:"lives"}))}else{const se=Z[3]??Z[1]??yn;x.current=se,b.current=[],E.current=new Set,y.current="on-border",V.current=null,console.log(`[qvimx] enemy lost life (source=${q})`),t({type:"LOSE_LIFE",who:"enemy",enemyPos:se,enemyTempLine:[]})}re()},[re]);ge.current=ce;const Ke=f.useCallback(()=>{if(d.current!=="playing")return;const T=s.current;if(!T)return;const q=n.current,U=gS(x.current,y.current,p.current,h.current,g.current,T,o.current,k.current,q.enemyAI),Z=c.current,se=Z?Z(U):"outside";let ne=y.current,$=[...b.current];if(y.current==="on-border")se==="interior"&&(V.current=x.current,ne="drawing",$=[U]);else if(y.current==="drawing"){if(se==="border"||N.current.has(`${U.lineNumber},${U.column}`)){const ie=V.current,$e=U;V.current=null,x.current=U,y.current="on-border",b.current=$,lt("enemy",ie,$e);return}else if(se==="interior"){const ie=$.findIndex($e=>Mn($e,U));ie!==-1?$=$.slice(0,ie+1):$=[...$,U]}}x.current=U,y.current=ne,b.current=$,pe($,E),t({type:"ENEMY_TICK",enemyPos:U,enemyDrawState:ne,enemyTempLine:$,enemyClaimed:k.current,enemyScore:j.current}),re()},[lt,re]);f.useEffect(()=>{if(e.status!=="playing")return;const T=setInterval(()=>{const q=Date.now()-u.current;t({type:"TICK",totalMs:q});const U=n.current;U&&q>=U.timerMs&&d.current==="playing"&&(d.current="results",Oe(),t({type:"END",endReason:"time"}))},200);return ye.current=T,()=>clearInterval(T)},[e.status]);const ve=f.useCallback(T=>{if(d.current!=="playing")return;const q=n.current;if(!(q!=null&&q.challengeMode))return;const U=fe.current;if(!U||!U.solution.map(qe=>Nn(qe)).includes(Nn(T)))return;const se=P.current,ne=(se.get(U.id)??0)+1;se.set(U.id,ne);const $=q.challengeRepetition??1,ie=R.current+1;R.current=ie;const $e=ne>=$,Be=Qa.filter(qe=>q.challengeCategories.includes(qe.category)&&qe.level>=(q.challengeStartingLevel??0)&&($e?qe.id!==U.id:qe.id===U.id));let be;if(!$e)be=U;else if(Be.length===0)be=null;else if(q.challengeDrillMode){const qe=L.current%Be.length;be=Be[qe],L.current=(qe+1)%Be.length}else be=Be[Math.floor(Math.random()*Be.length)];fe.current=be,t({type:"CHALLENGE_DONE",next:be,challengeScore:ie})},[]),he=f.useCallback((T,q)=>{ae.current=T,Ze.current=q.createDecorationsCollection([]);const U=de.current;U&&(de.current=null,q.setValue(U.content),q.setPosition(U.playerStart),q.revealPositionInCenter(U.playerStart),q.focus(),re())},[re]),{editorRef:Ae,statusRef:Qe,setContent:st,positionCursor:G,focusEditor:me,getVisibleRange:_e}=Un({onEditorCreated:he,onCursorChange:J,onCommandExecuted:ve,readOnly:!0});Ie.current=st,S.current=G,_.current=me,ee.current=_e;const Re=f.useCallback(T=>{Oe();const q=_g(T.language,T.codeSize),{borderedContent:U,dims:Z,allRectDims:se}=uS(q,T.borderShape);r.current=U,s.current=Z;const ne=K=>af(K,Z),$=[];if(se&&se.length>1){const K=new Set;for(const Le of se){for(const _t of yo(Le))K.add(`${_t.lineNumber},${_t.column}`);for(const _t of Ka(Le))K.add(`${_t.lineNumber},${_t.column}`)}for(const Le of yo(Z))K.has(`${Le.lineNumber},${Le.column}`)||$.push(Le);C.current=$,pe($,D),c.current=Le=>{if(D.current.has(`${Le.lineNumber},${Le.column}`))return"border";for(const _t of se){const Qs=af(Le,_t);if(Qs!=="outside")return Qs}return ne(Le)},o.current=se.flatMap(Le=>Ka(Le)),i.current=se.flatMap(Le=>yo(Le)),pe(i.current,a);const Ee=Gl(se[0]),Te=Ee[0]??yn,we=Gl(se[se.length-1])[1]??Ee[0]??yn;p.current=Te,m.current="on-border",h.current=[],g.current=[],pe([],v),O.current=null,x.current=we,y.current="on-border",b.current=[],k.current=[],pe([],N),j.current=0,V.current=null,R.current=0,P.current=new Map;const H=df(T.ballCount,T.ballSpeed,Z),je=i.current[0],St=je?H.map(Le=>D.current.has(`${Le.pos.lineNumber},${Le.pos.column}`)?{...Le,pos:je}:Le):H;M.current=St;const Ge=se.flatMap(Le=>cf(Le));Y.current=Ge;const Fr=mf(T.bombCount,Ge);B.current=Fr,n.current=T,d.current="playing",u.current=Date.now(),L.current=0;const yd=T.challengeMode?(()=>{const Le=Qa.filter(_t=>T.challengeCategories.includes(_t.category)&&_t.level>=(T.challengeStartingLevel??0));if(Le.length===0)return null;if(T.challengeDrillMode){const _t=Le[0];return L.current=1%Le.length,_t}return Le[Math.floor(Math.random()*Le.length)]})():null;fe.current=yd,Ze.current?(Ie.current(U),S.current(Te),_.current()):de.current={content:U,playerStart:Te},t({type:"START",config:T,dims:Z,playerPos:Te,enemyPos:we,balls:St,bombPatrols:Fr,firstChallenge:yd});for(const Le of St){const _t=Le.speedMs||el.medium,Qs=setInterval(()=>te(Le.id),_t);z.current.set(Le.id,Qs)}const t0=uf[T.enemyAI];ue.current=setInterval(Ke,t0),Fr.length>0&&(I.current=setInterval(Pe,600));return}const ie=Z.lineContentWidths;if(ie&&(T.borderShape==="inverse-code"||T.borderShape==="code-right"))for(let K=Z.minLine+1;K<Z.maxLine;K++){const Ee=K-Z.minLine-1,Te=ie[Ee]??0;for(let we=Z.minCol+1;we<Z.maxCol;we++){const H=we-Z.minCol<=Te;(T.borderShape==="inverse-code"?H:!H)&&$.push({lineNumber:K,column:we})}}C.current=$,pe($,D),c.current=K=>D.current.has(`${K.lineNumber},${K.column}`)?"border":ne(K),o.current=Ka(Z),i.current=yo(Z).filter(K=>!D.current.has(`${K.lineNumber},${K.column}`)),pe(i.current,a);const $e=Gl(Z),Be=$e[0]??yn,be=$e[1]??$e[0]??yn;p.current=Be,m.current="on-border",h.current=[],g.current=[],pe([],v),O.current=null,x.current=be,y.current="on-border",b.current=[],k.current=[],pe([],N),j.current=0,V.current=null,R.current=0,P.current=new Map;const qe=df(T.ballCount,T.ballSpeed,Z),ct=i.current[0],ht=ct?qe.map(K=>D.current.has(`${K.pos.lineNumber},${K.pos.column}`)?{...K,pos:ct}:K):qe;M.current=ht;const Ht=cf(Z);Y.current=Ht;const et=mf(T.bombCount,Ht);B.current=et,n.current=T,d.current="playing",u.current=Date.now(),L.current=0;const Wt=T.challengeMode?(()=>{const K=Qa.filter(Ee=>T.challengeCategories.includes(Ee.category)&&Ee.level>=(T.challengeStartingLevel??0));if(K.length===0)return null;if(T.challengeDrillMode){const Ee=K[0];return L.current=1%K.length,Ee}return K[Math.floor(Math.random()*K.length)]})():null;fe.current=Wt,Ze.current?(Ie.current(U),S.current(Be),_.current()):de.current={content:U,playerStart:Be},t({type:"START",config:T,dims:Z,playerPos:Be,enemyPos:be,balls:ht,bombPatrols:et,firstChallenge:Wt});for(const K of ht){const Ee=K.speedMs||el.medium,Te=setInterval(()=>te(K.id),Ee);z.current.set(K.id,Te)}const ot=uf[T.enemyAI];ue.current=setInterval(Ke,ot),et.length>0&&(I.current=setInterval(Pe,600))},[te,Ke,Pe]);return{state:e,editorRef:Ae,statusRef:Qe,startGame:Re,getVisibleRange:_e}}const yS={lang:"typescript",codeSize:"medium",borderShape:"full-rect",subMode:"classic",ballCount:2,ballSpeed:"medium",enemyAI:"wanderer",lives:3,timerMs:12e4,diagonalMode:!1,challengeMode:!1,challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeCategories:mt,challengeDrillMode:!1,bombCount:0,...na};function vS(e,t){return Pr(e,t)}const bS=[{label:"1 min",ms:6e4},{label:"2 min",ms:12e4},{label:"5 min",ms:3e5}],wS=[{id:"short",label:"Short",desc:"~20 lines — quick games, small board"},{id:"medium",label:"Medium",desc:"~60 lines — balanced challenge"},{id:"long",label:"Long",desc:"~150 lines — large board, epic battles"}],NS=[{id:"full-rect",label:"Full Rect",desc:"Rectangle around the entire file — the classic board"},{id:"code-right",label:"Code Right",desc:"Right edge hugs each line's last character — irregular right border"},{id:"inverse-code",label:"Inverse Code",desc:"Code text is pre-claimed walls — play in the whitespace"},{id:"sub-rect",label:"Sub Rect",desc:"Inner rectangle (80% of file) — outer code visible but outside the board"},{id:"rectangles",label:"Rectangles",desc:"Two stacked bordered rectangles — top and bottom play areas"}],kS=[{id:"classic",label:"Classic",desc:"Single level — highest territory % when the timer ends wins"},{id:"championship",label:"Championship",desc:"Progress through Short → Medium → Long boards; out-claim the enemy each round to advance"},{id:"ball-escalation",label:"Ball Escalation",desc:"Start with your configured balls; +1 hazard ball each time you win a round"},{id:"combo",label:"Combo",desc:"Championship size progression AND ball escalation combined — the hardest mode"}],SS=[{id:"passive",label:"Passive",desc:"Rarely leaves the border — mostly a distraction"},{id:"wanderer",label:"Wanderer",desc:"Roams the border, occasionally claims a thin strip"},{id:"hunter",label:"Hunter",desc:"Targets your claimed territory to block expansion"},{id:"cutter",label:"Cutter",desc:"Actively intercepts your in-progress draw lines"},{id:"unstoppable",label:"Unstoppable",desc:"Cuts your lines AND hunts your territory — reacts instantly"}],jS=[{id:"slow",label:"Slow",desc:"One step every 0.8 s"},{id:"medium",label:"Medium",desc:"One step every 0.4 s"},{id:"fast",label:"Fast",desc:"One step every 0.2 s"},{id:"mixed",label:"Mixed",desc:"Each ball gets a random speed"}];function CS({onStart:e,onBack:t}){const[n,r]=f.useReducer(vS,yS),s=c=>r({type:"PATCH",payload:c}),o=Vi(X.LAST_QVIMX_CONFIG);function i(){const c={language:n.lang,codeSize:n.codeSize,borderShape:n.borderShape,subMode:n.subMode,ballCount:n.ballCount,ballSpeed:n.ballSpeed,enemyAI:n.enemyAI,lives:n.lives,timerMs:n.timerMs,diagonalMode:n.diagonalMode,challengeMode:n.challengeMode,challengeGuidedMode:n.challengeGuidedMode,challengeStartingLevel:n.challengeStartingLevel,challengeRepetition:n.challengeRepetition,challengeTimeMultiplier:n.challengeTimeMultiplier,challengeCategories:n.challengeCategories,challengeDrillMode:n.challengeDrillMode,bombCount:n.bombCount,hjklOnly:n.hjklOnly,noHjkl:n.noHjkl,opacityFade:n.opacityFade,snowEffect:n.snowEffect};sd(X.LAST_QVIMX_CONFIG,n),e(c)}function a(c){const u={language:c.lang,codeSize:c.codeSize,borderShape:c.borderShape,subMode:c.subMode,ballCount:c.ballCount,ballSpeed:c.ballSpeed,enemyAI:c.enemyAI,lives:c.lives,timerMs:c.timerMs,diagonalMode:c.diagonalMode,challengeMode:c.challengeMode,challengeGuidedMode:c.challengeGuidedMode,challengeStartingLevel:c.challengeStartingLevel,challengeRepetition:c.challengeRepetition,challengeTimeMultiplier:c.challengeTimeMultiplier,challengeCategories:c.challengeCategories,challengeDrillMode:c.challengeDrillMode??!1,bombCount:c.bombCount??1,hjklOnly:c.hjklOnly??!1,noHjkl:c.noHjkl??!1,opacityFade:c.opacityFade??!1,snowEffect:c.snowEffect??!1};e(u)}return l.jsxs(kl,{title:"QVIMX",subtitle:"Claim territory using Vim motions — draw lines to conquer the board",actions:l.jsxs("div",{className:"flex flex-col gap-2",children:[l.jsx(Sl,{onClick:i}),o&&l.jsx(zs,{onClick:()=>a(o),summary:`${o.subMode} · ${o.lang} · ${o.enemyAI}`})]}),children:[l.jsxs(W,{label:"Language",icon:xr,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Pick the source language to navigate. Lorem Ipsum is plain prose — good for practising line and word motions without syntax noise."}),l.jsx(qn,{value:n.lang,onChange:c=>s({lang:c})})]}),l.jsxs(W,{label:"Code Size",icon:gg,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Determines how many lines of code are loaded. Bigger files mean a larger board with more territory to claim — and more room for the enemy and balls to roam."}),l.jsx("div",{className:"flex flex-col gap-2",children:wS.map(c=>l.jsxs("button",{onClick:()=>s({codeSize:c.id}),className:`${F.modeCard(n.codeSize===c.id)}`,children:[l.jsx("span",{className:"font-bold",children:c.label}),l.jsx("span",{className:`text-xs font-normal ml-2 ${n.codeSize===c.id?"text-blue-200":"text-gray-500"}`,children:c.desc})]},c.id))})]}),l.jsxs(W,{label:"Sub Mode",icon:dd,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Choose the overall game structure. Classic is a single timed round. The other modes add progression: bigger boards, more balls, or both."}),l.jsx("div",{className:"flex flex-col gap-2",children:kS.map(c=>l.jsxs("button",{onClick:()=>s({subMode:c.id}),className:`${F.modeCard(n.subMode===c.id)}`,children:[l.jsx("span",{className:"font-bold",children:c.label}),l.jsx("span",{className:`text-xs font-normal ml-2 block mt-0.5 ${n.subMode===c.id?"text-blue-200":"text-gray-500"}`,children:c.desc})]},c.id))})]}),l.jsxs(W,{label:"Board Shape",icon:fi,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Controls the shape of the ASCII border drawn around the code. The border is where you start and where you must return to complete a claim."}),l.jsx("div",{className:"flex flex-col gap-2",children:NS.map(c=>l.jsxs("button",{onClick:()=>s({borderShape:c.id}),className:`${F.modeCard(n.borderShape===c.id)}`,children:[l.jsx("span",{className:"font-bold",children:c.label}),l.jsx("span",{className:`text-xs font-normal ml-2 block mt-0.5 ${n.borderShape===c.id?"text-blue-200":"text-gray-500"}`,children:c.desc})]},c.id))})]}),l.jsxs(W,{label:"Timer",icon:yr,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"How long each round lasts. When time runs out, whoever has claimed more territory wins."}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:bS.map(c=>l.jsx("button",{onClick:()=>s({timerMs:c.ms}),className:F.pill(n.timerMs===c.ms),children:c.label},c.ms))})]}),l.jsxs(W,{label:"Lives",icon:hg,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Each life lost resets your draw-line and moves you back to a border start point. Lose all lives and the game ends immediately — regardless of the timer."}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[1,3,5].map(c=>l.jsx("button",{onClick:()=>s({lives:c}),className:F.pill(n.lives===c),children:Array.from({length:c},()=>"♥").join(" ")},c))})]}),l.jsxs(W,{label:"Bombs (Border Patrol)",icon:Fs,defaultOpen:!1,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Bombs patrol the border. If one reaches you while you're on the border — or cuts across where you stepped off to start drawing — you lose a life. Based on the Sparx enemies from the original Qix arcade game."}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[0,1,2,3].map(c=>l.jsx("button",{onClick:()=>s({bombCount:c}),className:F.pill(n.bombCount===c),children:c===0?"Off":`${c} bomb${c>1?"s":""}`},c))})]}),l.jsxs(W,{label:"Enemy AI",icon:Ps,defaultOpen:!1,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"The AI opponent claims territory using the same rules as you — draw a line, return to the border, region is filled. Higher levels make it faster and more aggressive."}),l.jsx("div",{className:"flex flex-col gap-2",children:SS.map(c=>l.jsxs("button",{onClick:()=>s({enemyAI:c.id}),className:`${F.modeCard(n.enemyAI===c.id)}`,children:[l.jsx("span",{className:"font-bold",children:c.label}),l.jsx("span",{className:`text-xs font-normal ml-2 block mt-0.5 ${n.enemyAI===c.id?"text-blue-200":"text-gray-500"}`,children:c.desc})]},c.id))})]}),l.jsxs(W,{label:"Hazard Balls",icon:dg,defaultOpen:!1,children:[l.jsxs("p",{className:"text-xs text-gray-500 mb-3",children:["Balls bounce around the board and are deadly to"," ",l.jsx("span",{className:"text-gray-300",children:"both"})," you and the enemy cursor — if a ball hits either player's in-progress draw line, that player loses a life."]}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Count"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:[1,2,3,4,5].map(c=>l.jsx("button",{onClick:()=>s({ballCount:c}),className:F.pill(n.ballCount===c),children:c},c))}),l.jsx("p",{className:"text-xs text-gray-500 mb-1.5",children:"Speed"}),l.jsx("div",{className:"flex flex-col gap-2",children:jS.map(c=>l.jsxs("button",{onClick:()=>s({ballSpeed:c.id}),className:`${F.modeCard(n.ballSpeed===c.id)}`,children:[l.jsx("span",{className:"font-bold",children:c.label}),l.jsx("span",{className:`text-xs font-normal ml-2 ${n.ballSpeed===c.id?"text-blue-200":"text-gray-500"}`,children:c.desc})]},c.id))})]}),l.jsxs(W,{label:"Diagonal Mode",icon:fi,defaultOpen:!1,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Controls how your draw line is recorded when a motion moves diagonally (e.g. a search that lands several lines away and several columns over). When off, the path is snapped to the closest cardinal axis — a 45° move becomes vertical."}),l.jsx("div",{className:"flex flex-col gap-2",children:[{v:!1,label:"Axis-aligned only",desc:"Lines are always horizontal or vertical (45° → vertical)"},{v:!0,label:"Diagonal allowed",desc:"Diagonal paths are drawn as-is — more expressive but harder to predict"}].map(({v:c,label:u,desc:d})=>l.jsxs("button",{onClick:()=>s({diagonalMode:c}),className:`${F.modeCard(n.diagonalMode===c)}`,children:[l.jsx("span",{className:"font-bold",children:u}),l.jsx("span",{className:`text-xs font-normal ml-2 block mt-0.5 ${n.diagonalMode===c?"text-blue-200":"text-gray-500"}`,children:d})]},String(c)))})]}),l.jsxs(vr,{enabled:n.challengeMode,onToggle:()=>s({challengeMode:!n.challengeMode}),children:[l.jsx("p",{className:"text-xs text-gray-500 mb-4",children:"Earn bonus points by completing motion commands while claiming territory."}),l.jsx(Vn,{guidedMode:n.challengeGuidedMode,onGuidedMode:c=>s({challengeGuidedMode:c}),startingLevel:n.challengeStartingLevel,onStartingLevel:c=>s({challengeStartingLevel:c}),repetition:n.challengeRepetition,onRepetition:c=>s({challengeRepetition:c}),timeMultiplier:n.challengeTimeMultiplier,onTimeMultiplier:c=>s({challengeTimeMultiplier:c}),selectableCategories:mt,selectedCategories:n.challengeCategories,onToggleCategory:c=>s({challengeCategories:md(n.challengeCategories,c)}),drillMode:n.challengeDrillMode,onDrillMode:c=>s({challengeDrillMode:c})})]}),l.jsx(qs,{config:{hjklOnly:n.hjklOnly,noHjkl:n.noHjkl,opacityFade:n.opacityFade,snowEffect:n.snowEffect},onPatch:c=>s(c)})]})}function ES(e){const t=Math.max(0,e),n=Math.ceil(t/1e3),r=Math.floor(n/60),s=n%60;return`${r}:${String(s).padStart(2,"0")}`}function ff({count:e,max:t}){return l.jsx("div",{className:"flex gap-0.5",children:Array.from({length:t},(n,r)=>l.jsx("span",{className:r<e?"text-red-400":"text-gray-600",children:"♥"},r))})}function TS({config:e,onQuit:t}){const{state:n,editorRef:r,statusRef:s,startGame:o,getVisibleRange:i}=xS();jl(e,n.status==="playing"),f.useEffect(()=>{o(e)},[]);const[a,c]=f.useState(null),u=f.useRef(0);f.useEffect(()=>{if(n.penaltySeq>u.current){u.current=n.penaltySeq;const w=n.penaltySource==="ball"?"● Ball hit your line!":n.penaltySource==="bomb"?"◉ Bomb touched you!":n.penaltySource==="bomb-stix"?"◉ Bomb cut your line!":"⚠ Penalty!";c(w);const x=setTimeout(()=>c(null),1500);return()=>clearTimeout(x)}},[n.penaltySeq,n.penaltySource]);const[d,p]=f.useState(null),m=f.useRef(0);f.useEffect(()=>{if(n.catchSeq>m.current){m.current=n.catchSeq;const w=n.catchCount;p(w===1?"🎯 Ball caught!":`🎯 ${w} balls caught!`);const x=setTimeout(()=>p(null),1800);return()=>clearTimeout(x)}},[n.catchSeq,n.catchCount]);const h=n.status==="results",g=Math.max(0,e.timerMs-n.totalElapsedMs),v=n.playerScore>n.enemyScore?"You win!":n.enemyScore>n.playerScore?"Enemy wins!":"Draw!";return l.jsxs("div",{className:"h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative",children:[a&&!h&&l.jsx("div",{className:"absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none",children:l.jsx("div",{className:"bg-red-900/90 border-2 border-red-500 text-red-200 font-bold px-6 py-3 rounded-lg shadow-2xl animate-pulse text-base",children:a})}),d&&!h&&l.jsx("div",{className:"absolute top-2/5 left-1/2 -translate-x-1/2 z-50 pointer-events-none",children:l.jsx("div",{className:"bg-green-900/90 border-2 border-green-400 text-green-200 font-bold px-6 py-3 rounded-lg shadow-2xl text-base",children:d})}),h&&l.jsx("div",{className:"absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6",children:l.jsxs("div",{className:"w-full max-w-lg bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8",children:[l.jsxs("div",{className:"text-center mb-8",children:[l.jsx("div",{className:"flex justify-center mb-3",children:l.jsx(Qi,{className:"w-14 h-14 text-yellow-400"})}),l.jsx("h2",{className:"text-3xl font-bold text-white mb-1",children:v}),l.jsx("p",{className:"text-gray-400 text-sm",children:n.endReason==="time"?"Time up":n.endReason==="lives"?"Out of lives":"Level complete"})]}),l.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-6 text-center",children:[l.jsxs("div",{className:"bg-gray-800 rounded-xl p-4 border border-green-800",children:[l.jsxs("div",{className:"text-2xl font-bold text-green-400",children:[n.playerScore,"%"]}),l.jsx("div",{className:"text-xs text-gray-400 mt-1",children:"You claimed"})]}),l.jsxs("div",{className:"bg-gray-800 rounded-xl p-4 border border-red-800",children:[l.jsxs("div",{className:"text-2xl font-bold text-red-400",children:[n.enemyScore,"%"]}),l.jsx("div",{className:"text-xs text-gray-400 mt-1",children:"Enemy claimed"})]})]}),e.subMode==="championship"&&l.jsxs("div",{className:"text-center mb-4 text-purple-400 text-sm",children:["Level reached: ",l.jsx("span",{className:"font-bold",children:n.level})]}),n.challengeScore>0&&l.jsxs("div",{className:"text-center mb-4 text-indigo-400 text-sm",children:["Challenges solved: ",l.jsx("span",{className:"font-bold",children:n.challengeScore})]}),l.jsxs("div",{className:"flex gap-3 mt-6",children:[l.jsx("button",{onClick:()=>o(e),className:"flex-1 py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors",children:"Play again"}),l.jsx("button",{onClick:t,className:"flex-1 py-2.5 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition-colors",children:"Back to menu"})]})]})}),l.jsxs(la,{title:"QVIMX",onBack:t,backLabel:l.jsxs(l.Fragment,{children:[l.jsx(Ds,{className:"w-4 h-4"})," Quit"]}),children:[l.jsxs("span",{className:`font-bold tabular-nums flex items-center gap-1 ${g<1e4?"text-red-400":"text-blue-300"}`,children:[l.jsx(yr,{className:"w-3.5 h-3.5"})," ",ES(g)]}),l.jsxs("span",{className:"text-green-400 tabular-nums font-bold",children:["You: ",n.playerScore,"%"]}),l.jsxs("span",{className:"text-red-400 tabular-nums font-bold",children:["Enemy: ",n.enemyScore,"%"]}),e.ballCount>0&&l.jsxs("span",{className:"text-orange-400 tabular-nums text-xs",children:["● ",e.ballCount," ball",e.ballCount>1?"s":""]}),e.bombCount>0&&l.jsxs("span",{className:"text-rose-400 tabular-nums text-xs",children:["◉ ",n.bombPatrols.length," bomb",n.bombPatrols.length!==1?"s":""]})]}),l.jsxs("div",{className:"flex items-center gap-6 px-4 py-1.5 bg-gray-800 border-b border-gray-700 flex-shrink-0 text-sm",children:[l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-gray-400 text-xs",children:"You"}),l.jsx(ff,{count:n.playerLives,max:e.lives})]}),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("span",{className:"text-gray-400 text-xs",children:"Enemy"}),l.jsx(ff,{count:n.enemyLives,max:e.lives})]}),l.jsx("div",{className:"ml-auto text-xs text-gray-500 tabular-nums",children:n.playerDrawState==="drawing"?"Drawing...":"On border"})]}),e.challengeMode&&n.activeChallenge&&!h&&l.jsxs("div",{className:"flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono",children:[l.jsx(Zt,{className:"w-3.5 h-3.5 text-indigo-400 flex-shrink-0"}),l.jsx("span",{className:"text-white",children:n.activeChallenge.question}),l.jsxs("span",{className:"ml-auto text-indigo-400 tabular-nums",children:["+",n.challengeScore]})]}),l.jsxs("div",{className:"flex-1 min-h-0 relative",children:[l.jsx("div",{ref:r,className:"h-full"}),e.snowEffect&&l.jsx(Cl,{}),e.opacityFade&&l.jsx(El,{cursorLine:0,getVisibleRange:i})]}),l.jsx("div",{ref:s,className:"h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"})]})}function MS(e,t){switch(t.type){case"START":return{screen:"game",config:t.config};case"QUIT":return{screen:"setup"}}}function _S({onBack:e}){const[t,n]=f.useReducer(MS,{screen:"setup"});return t.screen==="setup"?l.jsx(CS,{onStart:r=>n({type:"START",config:r}),onBack:e}):l.jsx(TS,{config:t.config,onQuit:()=>{n({type:"QUIT"}),e()}})}const hd=[{type:"borg",name:"Borg",speed:1,minLevel:1,color:"rgba(239,68,68,0.75)",cssClass:"vimbots-borg",outline:"2px solid rgba(252,165,165,0.8)"},{type:"reaper",name:"Reaper",speed:2,minLevel:3,color:"rgba(168,85,247,0.75)",cssClass:"vimbots-reaper",outline:"2px solid rgba(216,180,254,0.8)"},{type:"phantom",name:"Phantom",speed:2,minLevel:5,color:"rgba(34,211,238,0.75)",cssClass:"vimbots-phantom",outline:"2px solid rgba(103,232,249,0.8)"},{type:"inferno",name:"Inferno",speed:3,minLevel:7,color:"rgba(251,191,36,0.75)",cssClass:"vimbots-inferno",outline:"2px solid rgba(253,224,71,0.8)"},{type:"decimator",name:"Decimator",speed:3,minLevel:9,color:"rgba(248,250,252,0.85)",cssClass:"vimbots-decimator",outline:"2px solid rgba(255,255,255,0.9)"}];function Gg(e){return hd.filter(t=>e>=t.minLevel)}function zg(e){switch(e){case"tiny":return{rows:20,cols:60};case"small":return{rows:40,cols:100};case"medium":return{rows:60,cols:140};case"large":return{rows:100,cols:200};case"xlarge":return{rows:150,cols:280};case"custom":return{rows:40,cols:100}}}const pf="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789      ";function RS(e,t){const n=[];for(let r=0;r<e;r++){let s="";for(let o=0;o<t;o++)s+=pf[Math.floor(Math.random()*pf.length)];n.push(s)}return n.join(`
`)}const Ya=["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum","at","vero","eos","accusamus","iusto","dignissimos","ducimus","blanditiis","praesentium","voluptatum","deleniti","atque","corrupti","quos","dolores","quas","molestias","excepturi","occaecati","cupiditate","provident","similique","mollitia","animi","vel","illum","quo","minus"];function LS(e,t){const n=[];let r=Math.floor(Math.random()*Ya.length);const s=()=>{const o=Ya[r%Ya.length];return r++,o};for(let o=0;o<e;o++){let i="";for(;i.length<t;){const a=s();if(i.length===0)i=a.slice(0,t);else{const c=i+" "+a;if(c.length<=t)i=c;else break}}n.push(i.padEnd(t," "))}return n.join(`
`)}const IS={beginner:8e3,easy:6e3,medium:5e3,hard:4e3,expert:3e3};function qg(e,t){return Math.max(1e4,e*IS[t])}function Vg(e){switch(e){case"beginner":return .02;case"easy":return .1;case"medium":return .2;case"hard":return .4;case"expert":return .7}}function yi(e,t){return e.row===t.row&&e.col===t.col}function OS(e,t,n){return e.row>=0&&e.row<t&&e.col>=0&&e.col<n}function hf(e){return e>0?1:e<0?-1:0}function AS(e,t){return{row:e.row+hf(t.row-e.row),col:e.col+hf(t.col-e.col)}}function Tl(e,t){return t.some(n=>yi(n,e))}function gl(e,t){return t.some(n=>yi(n.pos,e))}function DS(e,t,n){for(let r=-1;r<=1;r++)for(let s=-1;s<=1;s++){if(r===0&&s===0)continue;const o={row:e.row+r,col:e.col+s};if(gl(o,t)||Tl(o,n))return!0}return!1}function vi(e){return Math.floor(Math.random()*e)}function PS(e,t,n,r,s,o){const i=[],a=[...o];let c=0;const u=t*100;for(;i.length<t&&c<u;){c++;const d={row:vi(n),col:vi(r)};yi(d,s)||a.some(p=>yi(p,d))||(i.push({pos:d,type:e}),a.push(d))}return i}function Ug(e,t,n,r,s){const o=Gg(e),i=Math.floor(t/o.length),a=o.map((d,p)=>({type:d.type,count:p===0?t-i*(o.length-1):i})),c=[],u=[];for(const{type:d,count:p}of a){const m=PS(d,p,n,r,s,u);for(const h of m)u.push(h.pos);c.push(...m)}return c}function Bg(e){const t={};for(const n of e)t[n.type]=(t[n.type]??0)+1;return t}function FS(e,t){const n=new Map;for(const i of e){const a=`${i.pos.row},${i.pos.col}`,c=n.get(a)??[];c.push(i),n.set(a,c)}const r=[],s=[...t];let o=0;for(const[,i]of n){const a=i[0].pos,c=Tl(a,t);i.length>1||c?(o+=i.length,c||s.push(a)):r.push(i[0])}return{survivors:r,newFire:s,destroyed:o}}function $S(e){return e.split(`
`).length}function GS(e){return e.split(`
`).reduce((t,n)=>Math.max(t,n.length),0)}function Hg(e){switch(e){case"beginner":return 3;case"easy":return 2;case"medium":return 1;case"hard":return 0;case"expert":return 0}}function zS(e){switch(e){case"beginner":return 3;case"easy":return 3;case"medium":return 4;case"hard":return 5;case"expert":return 7}}function qS(e){return Math.max(3,Hg(e)*2)}function gd(e,t,n,r){const s=new Set;for(const i of e){const c=hd.find(p=>p.type===i.type).speed,{row:u,col:d}=i.pos;for(let p=-c;p<=c;p++)for(let m=-c;m<=c;m++){const h=u+p,g=d+m;h>=0&&h<n&&g>=0&&g<r&&s.add(`${h},${g}`)}}for(const i of t)s.add(`${i.row},${i.col}`);const o=[];for(let i=0;i<n;i++)for(let a=0;a<r;a++)s.has(`${i},${a}`)||o.push({row:i,col:a});return o}function VS(e){return gd(e.robots,e.fire,e.rows,e.cols)}function US(e){return gd(e.robots,e.fire,e.rows,e.cols).length}function Wg(e,t,n,r){let s=[...e];for(;s.length>0&&!(gd(s,[],t,n).length>0);){let o=1/0,i=0;s.forEach((a,c)=>{const u=Math.max(Math.abs(a.pos.row-r.row),Math.abs(a.pos.col-r.col));u<o&&(o=u,i=c)}),s=s.filter((a,c)=>c!==i)}return s}function BS(e,t){const n=$S(t),r=GS(t),s={row:Math.floor(n/2),col:Math.floor(r/2)},o=n*r,i=Vg(e.difficulty),a=Math.max(1,Math.floor(o*i)),c=Math.max(1,e.startingEnemyLevel??1),u=Wg(Ug(c,a,n,r,s),n,r,s);return{config:e,gridContent:t,rows:n,cols:r,playerPos:s,robots:u,fire:[],level:1,score:0,status:"playing",teleportsLeft:e.maxTeleports,safeTeleportsLeft:e.maxSafeTeleports,helperGridLeft:e.enableHelperGrid?Hg(e.difficulty):0,robotsDestroyedThisLevel:0,initialRobotCount:u.length,initialRobotsByType:Bg(u),message:"Level 1!",levelStartedAt:Date.now(),parMs:qg(u.length,e.difficulty),timerBonusEarned:0}}function sa(e){if(e.status!=="playing")return e;const{playerPos:t,robots:n,fire:r,level:s,score:o}=e,i=n.map(h=>{const g=hd.find(w=>w.type===h.type);let v=h.pos;for(let w=0;w<g.speed;w++)v=AS(v,t);return{pos:v,type:h.type}}),{survivors:a,newFire:c,destroyed:u}=FS(i,r);let d=o+u*10,p=e.message;u>0&&(p=`BOOM! ${u} robot${u>1?"s":""} destroyed`);const m=e.robotsDestroyedThisLevel+u;if(gl(t,a)||Tl(t,c))return{...e,robots:a,fire:c,score:d,status:"dead",robotsDestroyedThisLevel:m,message:"You were caught! Game over."};if(a.length===0){const h=s*100;d+=h;let g=0;if(e.config.timerBonus){const w=Date.now()-e.levelStartedAt,x=Math.max(0,e.parMs-w);x>0&&(g=Math.floor(x/e.parMs*s*200),d+=g)}const v=g>0?` + ⚡${g} speed`:"";return{...e,robots:a,fire:c,score:d,status:"level_cleared",robotsDestroyedThisLevel:m,timerBonusEarned:g,message:`Level ${s} cleared! +${h} pts${v}`}}return{...e,robots:a,fire:c,score:d,status:"playing",robotsDestroyedThisLevel:m,message:p}}function HS(e,t){return e.status!=="playing"||!OS(t,e.rows,e.cols)?e:Tl(t,e.fire)?{...e,playerPos:t,status:"dead",message:"You stepped into fire! Game over."}:gl(t,e.robots)?{...e,playerPos:t,status:"dead",message:"You were caught by a robot! Game over."}:sa({...e,playerPos:t})}function WS(e){return e.status!=="playing"?e:sa(e)}function KS(e){if(e.status!=="playing"||!e.config.enableTeleport||e.teleportsLeft<=0)return e;const{rows:t,cols:n,robots:r,fire:s}=e,o=[];for(let c=0;c<t;c++)for(let u=0;u<n;u++){const d={row:c,col:u};!Tl(d,s)&&!gl(d,r)&&o.push(d)}if(o.length===0)return{...e,teleportsLeft:e.teleportsLeft-1,status:"dead",message:"Nowhere to teleport! Game over."};const i=o[vi(o.length)],a={...e,playerPos:i,teleportsLeft:e.teleportsLeft-1};return gl(i,r)?{...a,status:"dead",message:"Teleported into a robot! Game over."}:sa(a)}function QS(e){if(e.status!=="playing"||!e.config.enableSafeTeleport||e.safeTeleportsLeft<=0)return e;const{rows:t,cols:n,robots:r,fire:s}=e,o=[];for(let a=0;a<t;a++)for(let c=0;c<n;c++){const u={row:a,col:c};Tl(u,s)||gl(u,r)||DS(u,r,s)||o.push(u)}if(o.length===0)return{...e,message:"No safe cell found"};const i=o[vi(o.length)];return sa({...e,playerPos:i,safeTeleportsLeft:e.safeTeleportsLeft-1,score:e.score+5})}function YS(e){if(e.status!=="level_cleared")return e;const{config:t,rows:n,cols:r,level:s,score:o}=e,i=s+1,a={row:Math.floor(n/2),col:Math.floor(r/2)},c=n*r,u=Vg(t.difficulty),d=Math.max(1,Math.floor(c*u)),p=Math.min(Math.floor(d*(1+(i-1)*.1)),Math.floor(c*.9)),m=i-1,h=Math.max(1,(t.startingEnemyLevel??1)+m),g=Wg(Ug(h,p,n,r,a),n,r,a);let v=e.helperGridLeft;if(t.enableHelperGrid){const w=zS(t.difficulty);w>0&&m>0&&m%w===0&&(v=Math.min(e.helperGridLeft+1,qS(t.difficulty)))}return{...e,playerPos:a,robots:g,fire:[],level:i,score:o,status:"playing",teleportsLeft:Math.min(e.teleportsLeft+t.maxTeleports,t.maxTeleports*2),safeTeleportsLeft:Math.min(e.safeTeleportsLeft+t.maxSafeTeleports,t.maxSafeTeleports*2),helperGridLeft:v,robotsDestroyedThisLevel:0,initialRobotCount:g.length,initialRobotsByType:Bg(g),message:`Level ${i}!`,levelStartedAt:Date.now(),parMs:qg(g.length,t.difficulty),timerBonusEarned:0}}const XS=[{id:"tiny",label:"Tiny",desc:"20 × 60"},{id:"small",label:"Small",desc:"40 × 100"},{id:"medium",label:"Medium",desc:"60 × 140"},{id:"large",label:"Large",desc:"100 × 200"},{id:"xlarge",label:"XLarge",desc:"150 × 280"},{id:"custom",label:"Custom",desc:"set rows & cols"}],JS=[{id:"short",label:"Short (~20 lines)"},{id:"medium",label:"Medium (~60 lines)"},{id:"long",label:"Long (~150 lines)"}],vo=[{id:"beginner",label:"Beginner",desc:"Very few robots, plenty of room to learn",pct:"~2%"},{id:"easy",label:"Easy",desc:"Light opposition — good for warming up",pct:"~10%"},{id:"medium",label:"Medium",desc:"Balanced challenge — the default",pct:"~20%"},{id:"hard",label:"Hard",desc:"Dense horde — high strategic pressure",pct:"~40%"},{id:"expert",label:"Expert",desc:"Near-total occupation — survive if you can",pct:"~70%"}],bo={beginner:0,easy:1,medium:2,hard:3,expert:4},ZS=["beginner","easy","medium","hard","expert"],e2={boardSource:"grid",gridPreset:"medium",customRows:50,customCols:70,codeFileSize:"medium",difficulty:"easy",enableTeleport:!0,enableSafeTeleport:!0,maxTeleports:5,maxSafeTeleports:2,animatedEffects:!0,enableHelperGrid:!1,startingEnemyLevel:1,timerBonus:!0,...Pg,challengeCategories:mt,...na};function Kg(e,t,n,r,s){if(e==="grid"||e==="lorem-grid"){const o=t==="custom"?{rows:n,cols:r}:zg(t);return e==="lorem-grid"?LS(o.rows,o.cols):RS(o.rows,o.cols)}return _g(e,s)}function t2(){return Vi(X.LAST_VIMBOTS_CONFIG)}function n2(e){sd(X.LAST_VIMBOTS_CONFIG,e)}function r2(e){return`${e.boardSource==="grid"||e.boardSource==="lorem-grid"?e.gridPreset==="custom"?`${e.customRows}×${e.customCols}`:e.gridPreset:`${e.boardSource} ${e.codeFileSize}`} · ${e.difficulty}`}function l2({onStart:e,onBack:t}){var d,p;const[n]=f.useState(()=>t2()),[r,s]=f.useReducer(Pr,n??e2),o=m=>s({type:"PATCH",payload:m});function i(m=r){const h={boardSource:m.boardSource,gridPreset:m.gridPreset,customRows:m.customRows,customCols:m.customCols,codeFileSize:m.codeFileSize,difficulty:m.difficulty,enableTeleport:m.enableTeleport,enableSafeTeleport:m.enableSafeTeleport,maxTeleports:m.maxTeleports,maxSafeTeleports:m.maxSafeTeleports,animatedEffects:m.animatedEffects,enableHelperGrid:m.enableHelperGrid,startingEnemyLevel:m.startingEnemyLevel,timerBonus:m.timerBonus??!0,challengeMode:m.challengeMode,challengeGuidedMode:m.challengeGuidedMode,challengeStartingLevel:m.challengeStartingLevel,challengeRepetition:m.challengeRepetition,challengeTimeMultiplier:m.challengeTimeMultiplier,challengeCategories:m.challengeCategories,challengeDrillMode:m.challengeDrillMode,hjklOnly:m.hjklOnly,noHjkl:m.noHjkl,opacityFade:m.opacityFade,snowEffect:m.snowEffect};n2(m);const g=Kg(h.boardSource,h.gridPreset,h.customRows,h.customCols,h.codeFileSize);e(h,g)}const a=r.boardSource==="grid"||r.boardSource==="lorem-grid",c=!a,u=r.gridPreset!=="custom"?zg(r.gridPreset):null;return l.jsxs(kl,{title:"VimBots",subtitle:"Dodge robots using Vim cursor motions — lure them into each other to destroy them",actions:l.jsxs("div",{className:"space-y-3",children:[l.jsx(Sl,{onClick:()=>i()}),n&&l.jsx(zs,{onClick:()=>i(n),summary:r2(n)})]}),children:[l.jsxs(W,{label:"Board",icon:D1,defaultOpen:!0,badge:r.boardSource==="grid"?"alphanumeric":r.boardSource==="lorem-grid"?"lorem":r.boardSource,children:[l.jsxs("div",{className:"flex border-b border-gray-700 mb-4 -mx-0",children:[l.jsx("button",{type:"button",onClick:()=>o({boardSource:"grid"}),className:`px-4 py-2 text-sm font-mono font-bold border-b-2 -mb-px transition-colors ${r.boardSource==="grid"?"border-blue-500 text-blue-300":"border-transparent text-gray-500 hover:text-gray-300"}`,children:"Alphanumeric"}),l.jsx("button",{type:"button",onClick:()=>o({boardSource:"lorem-grid"}),className:`px-4 py-2 text-sm font-mono font-bold border-b-2 -mb-px transition-colors ${r.boardSource==="lorem-grid"?"border-blue-500 text-blue-300":"border-transparent text-gray-500 hover:text-gray-300"}`,children:"Lorem"}),l.jsx("button",{type:"button",onClick:()=>o({boardSource:c?r.boardSource:"typescript"}),className:`px-4 py-2 text-sm font-mono font-bold border-b-2 -mb-px transition-colors ${c?"border-blue-500 text-blue-300":"border-transparent text-gray-500 hover:text-gray-300"}`,children:"Code file"})]}),a&&l.jsxs("div",{className:"space-y-3",children:[l.jsx("div",{className:"flex gap-2 flex-wrap",children:XS.map(m=>l.jsxs("button",{onClick:()=>o({gridPreset:m.id}),className:F.pill(r.gridPreset===m.id),children:[l.jsx("span",{className:"font-bold",children:m.label}),l.jsx("span",{className:"ml-1 opacity-60",children:m.desc})]},m.id))}),r.gridPreset!=="custom"&&u&&l.jsxs("p",{className:"text-xs text-gray-600 font-mono",children:[u.rows," rows × ",u.cols," cols —"," ",u.rows*u.cols," cells"]}),r.gridPreset==="custom"&&l.jsxs("div",{className:"flex items-center gap-3 mt-2",children:[l.jsx("label",{className:"text-xs text-gray-400",children:"Rows"}),l.jsx("input",{type:"number",min:5,max:300,value:r.customRows,onChange:m=>o({customRows:Math.max(5,Math.min(300,Number(m.target.value)))}),className:"w-20 px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-gray-300 text-sm font-mono text-center focus:outline-none focus:border-blue-500"}),l.jsx("label",{className:"text-xs text-gray-400",children:"Cols"}),l.jsx("input",{type:"number",min:5,max:300,value:r.customCols,onChange:m=>o({customCols:Math.max(5,Math.min(300,Number(m.target.value)))}),className:"w-20 px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-gray-300 text-sm font-mono text-center focus:outline-none focus:border-blue-500"}),l.jsxs("span",{className:"text-xs text-gray-600 font-mono",children:["= ",r.customRows*r.customCols," cells"]})]})]}),c&&l.jsxs("div",{className:"space-y-3",children:[l.jsx(qn,{value:r.boardSource,onChange:m=>o({boardSource:m})}),l.jsx("div",{className:"flex gap-2 flex-wrap mt-1",children:JS.map(m=>l.jsx("button",{onClick:()=>o({codeFileSize:m.id}),className:F.pill(r.codeFileSize===m.id),children:m.label},m.id))})]})]}),l.jsx(W,{label:"Difficulty",icon:Vm,defaultOpen:!0,badge:`${(d=vo[bo[r.difficulty]])==null?void 0:d.label} (${(p=vo[bo[r.difficulty]])==null?void 0:p.pct})`,children:l.jsxs("div",{className:"space-y-3",children:[l.jsx("input",{type:"range",min:0,max:4,step:1,value:bo[r.difficulty],onChange:m=>o({difficulty:ZS[Number(m.target.value)]}),className:"w-full accent-red-500"}),l.jsx("div",{className:"flex justify-between text-gray-600 text-xs -mt-1",children:vo.map(m=>l.jsx("span",{className:r.difficulty===m.id?"text-white font-bold":"",children:m.label},m.id))}),(()=>{const m=vo[bo[r.difficulty]];return m?l.jsxs("div",{className:"bg-gray-800/60 border border-gray-700 rounded p-2.5 text-xs font-mono",children:[l.jsx("span",{className:"text-white font-bold",children:m.label}),l.jsxs("span",{className:"text-gray-500 ml-1",children:[m.pct," of cells"]}),l.jsx("p",{className:"text-gray-400 mt-1",children:m.desc})]}):null})()]})}),l.jsxs(W,{label:"Teleport",icon:Zt,defaultOpen:!1,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Random teleport lands anywhere (may be dangerous). Safe teleport guarantees no adjacent hazards but is more limited."}),l.jsxs("div",{className:"flex flex-col gap-3",children:[l.jsxs("label",{className:"flex items-center gap-2 cursor-pointer",children:[l.jsx("input",{type:"checkbox",checked:r.enableTeleport,onChange:m=>o({enableTeleport:m.target.checked}),className:"accent-indigo-500"}),l.jsx("span",{className:"text-sm text-gray-300",children:"Enable random teleport"})]}),r.enableTeleport&&l.jsxs("div",{className:"ml-6 flex items-center gap-2 flex-wrap",children:[l.jsx("span",{className:"text-xs text-gray-400",children:"Max per level:"}),l.jsxs("div",{className:"flex gap-1 flex-wrap",children:[[1,3,5,8,10].map(m=>l.jsx("button",{onClick:()=>o({maxTeleports:m}),className:F.pill(r.maxTeleports===m),children:m},m)),l.jsx("input",{type:"number",min:1,max:99,value:r.maxTeleports,onChange:m=>{const h=Math.max(1,Math.min(99,Number(m.target.value)));isNaN(h)||o({maxTeleports:h})},className:"w-16 px-2 py-1.5 rounded border border-gray-700 bg-gray-800 text-gray-300 text-sm font-mono text-center focus:outline-none focus:border-blue-500"})]})]}),l.jsxs("label",{className:"flex items-center gap-2 cursor-pointer",children:[l.jsx("input",{type:"checkbox",checked:r.enableSafeTeleport,onChange:m=>o({enableSafeTeleport:m.target.checked}),className:"accent-teal-500"}),l.jsx("span",{className:"text-sm text-gray-300",children:"Enable safe teleport"})]}),r.enableSafeTeleport&&l.jsxs("div",{className:"ml-6 flex items-center gap-2",children:[l.jsx("span",{className:"text-xs text-gray-400",children:"Max per level:"}),l.jsx("div",{className:"flex gap-1",children:[1,2,3,5].map(m=>l.jsx("button",{onClick:()=>o({maxSafeTeleports:m}),className:F.pill(r.maxSafeTeleports===m),children:m},m))})]})]})]}),l.jsx(W,{label:"Visual Effects",icon:Zt,defaultOpen:!1,badge:r.animatedEffects?"on":"off",children:l.jsxs("button",{type:"button",onClick:()=>o({animatedEffects:!r.animatedEffects}),className:`w-full py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left ${r.animatedEffects?"bg-green-800 border-green-600 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"}`,children:[r.animatedEffects?"✓ Animations enabled":"○ Animations disabled",l.jsx("span",{className:`text-xs font-normal ml-2 ${r.animatedEffects?"text-green-300":"text-gray-600"}`,children:r.animatedEffects?"Fire cycles colour; robots pulse by speed":"Static colours, no animation"})]})}),l.jsxs(W,{label:"Helper Grid",icon:Fs,defaultOpen:!1,badge:r.enableHelperGrid?"on":"off",children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Highlights every cell that is safe to move to. Beginner and Easy start with a few uses; Hard and Expert start with none but gain one every few levels."}),l.jsxs("button",{type:"button",onClick:()=>o({enableHelperGrid:!r.enableHelperGrid}),className:`w-full py-2.5 px-3 rounded border text-sm font-mono transition-colors text-left ${r.enableHelperGrid?"bg-teal-800 border-teal-600 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"}`,children:[r.enableHelperGrid?"✓ Helper grid enabled":"○ Helper grid disabled",l.jsx("span",{className:`text-xs font-normal ml-2 ${r.enableHelperGrid?"text-teal-300":"text-gray-600"}`,children:r.enableHelperGrid?"Safe cells shown as teal highlights":"Enable for safe-cell hints"})]})]}),l.jsx(vr,{enabled:r.challengeMode,onToggle:()=>o({challengeMode:!r.challengeMode}),children:l.jsx(Vn,{guidedMode:r.challengeGuidedMode,onGuidedMode:m=>o({challengeGuidedMode:m}),startingLevel:r.challengeStartingLevel,onStartingLevel:m=>o({challengeStartingLevel:m}),repetition:r.challengeRepetition,onRepetition:m=>o({challengeRepetition:m}),timeMultiplier:r.challengeTimeMultiplier,onTimeMultiplier:m=>o({challengeTimeMultiplier:m}),selectableCategories:mt,selectedCategories:r.challengeCategories,onToggleCategory:m=>o({challengeCategories:md(r.challengeCategories,m)}),drillMode:r.challengeDrillMode,onDrillMode:m=>o({challengeDrillMode:m})})}),l.jsxs(W,{label:"Starting Enemy Level",icon:Vm,defaultOpen:!1,badge:r.startingEnemyLevel===1?"default":`tier ${r.startingEnemyLevel}`,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Which enemy tier appears from the very first level. Useful for debugging or spicing up a run. New tiers unlock every 2 levels normally."}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[{level:1,label:"Borg only",desc:"tier 1"},{level:3,label:"Borg + Reaper",desc:"tier 3"},{level:5,label:"+ Phantom",desc:"tier 5"},{level:7,label:"+ Inferno",desc:"tier 7"},{level:9,label:"+ Decimator",desc:"tier 9"}].map(m=>l.jsxs("button",{type:"button",onClick:()=>o({startingEnemyLevel:m.level}),className:F.pill(r.startingEnemyLevel===m.level),children:[l.jsx("span",{className:"font-bold",children:m.label}),l.jsx("span",{className:"ml-1 opacity-60",children:m.desc})]},m.level))})]}),l.jsxs(W,{label:"Speed Bonus",icon:Zt,defaultOpen:!1,badge:r.timerBonus?l.jsx("span",{className:"text-yellow-300 text-[10px] font-bold",children:"ON"}):void 0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Clear the level before the par timer runs out to earn a speed bonus. The timer is calculated from enemy count and difficulty — smaller maps give less time. The game never ends when the timer expires; you just miss the bonus."}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx("button",{type:"button",onClick:()=>o({timerBonus:!0}),className:F.pill(r.timerBonus),children:"Enabled"}),l.jsx("button",{type:"button",onClick:()=>o({timerBonus:!1}),className:F.pill(!r.timerBonus),children:"Disabled"})]})]}),l.jsx(qs,{config:{hjklOnly:r.hjklOnly,noHjkl:r.noHjkl,opacityFade:r.opacityFade,snowEffect:r.snowEffect},onPatch:m=>o(m)})]})}const gf=kn;function s2(e,t){switch(t.type){case"MOVE":return HS(e,t.pos);case"WAIT":return WS(e);case"TELEPORT":return KS(e);case"SAFE_TELEPORT":return QS(e);case"NEXT_LEVEL":return YS(e);case"USE_HELPER":return e.helperGridLeft>0?{...e,helperGridLeft:e.helperGridLeft-1}:e;case"TRAPPED":return{...e,status:"dead",message:"No safe moves — you are trapped!"}}}function o2({config:e,gridContent:t,onQuit:n,onReplay:r,onViewHighScores:s,onLevelComplete:o}){const i=BS(e,t),[a,c]=f.useReducer(s2,i);jl(e,a.status==="playing");const u=f.useRef(null),d=f.useRef(null),p=f.useRef(null),[m,h]=f.useState(0),[g,v]=f.useState(!1),[,w]=f.useState(0);f.useEffect(()=>{if(!e.timerBonus||a.status!=="playing")return;const S=setInterval(()=>w(_=>_+1),500);return()=>clearInterval(S)},[e.timerBonus,a.status]);const[x,y]=f.useState([]),b=f.useRef([]),k=f.useRef(0),N=f.useRef(null),E=f.useRef([]),j=f.useRef(null),[C,D]=f.useState(null);f.useEffect(()=>{if(!e.challengeMode)return;const S=e.challengeCategories.length>0?gf.filter(re=>e.challengeCategories.includes(re.category)):gf.filter(re=>mt.includes(re.category)),_=nn(),ee=S.filter(re=>!_.has(re.id)),de={mode:"general",language:"typescript",startingLevel:e.challengeStartingLevel,repetitionTarget:e.challengeRepetition,guidedMode:e.challengeGuidedMode,categories:null,dynamicAssist:null,commandTimeMultiplier:e.challengeTimeMultiplier,knowledgeFilter:"all",drillMode:e.challengeDrillMode,hjklOnly:e.hjklOnly??!1,noHjkl:e.noHjkl??!1,opacityFade:e.opacityFade??!1,snowEffect:e.snowEffect??!1},Oe=pl(de,ee);j.current=de,E.current=ee,N.current=Oe,D(Oe)},[]),f.useEffect(()=>{if(!e.challengeMode)return;const S=setInterval(()=>{if(!N.current||!E.current.length)return;const _=qi(N.current,E.current,Date.now());N.current=_,D(_)},100);return()=>clearInterval(S)},[e.challengeMode]);const M=f.useCallback(S=>{if(!N.current||!E.current.length)return;const _=zi(N.current,S,E.current,Date.now());N.current=_,D(_)},[]),Y=f.useRef(a);Y.current=a;const B=f.useRef(i.playerPos),I=f.useCallback(S=>{const _={row:S.lineNumber-1,col:S.column-1},ee=B.current;_.row===ee.row&&_.col===ee.col||(B.current=_,Y.current.status!=="playing")||(v(!1),c({type:"MOVE",pos:_}))},[]),O=f.useCallback((S,_)=>{d.current=S,p.current=_,u.current=_.createDecorationsCollection([]),h(ee=>ee+1)},[]),{editorRef:V,statusRef:ge,positionCursor:fe,focusEditor:R}=Un({defaultValue:t,readOnly:!0,wordWrapOverride:"off",onCommandExecuted:e.challengeMode?M:void 0,onCursorChange:I,onEditorCreated:O}),P=f.useRef(i.playerPos);f.useEffect(()=>{const S=a.playerPos,_=P.current;S.row===_.row&&S.col===_.col||(P.current=S,B.current=S,fe({lineNumber:S.row+1,column:S.col+1}))},[a.playerPos,fe]);const L=f.useMemo(()=>US(a),[a.robots,a.fire]);f.useEffect(()=>{const S=u.current,_=d.current;if(!S||!_)return;const ee=[];if(g&&e.enableHelperGrid)for(const re of VS(a))ee.push({range:new _.Range(re.row+1,re.col+1,re.row+1,re.col+2),options:{inlineClassName:"vimbots-safe",description:"vimbots-safe"}});const de=a.playerPos.row+1,Oe=a.playerPos.col+1;ee.push({range:new _.Range(de,Oe,de,Oe+1),options:{inlineClassName:"vimbots-player",description:"vimbots-player"}});for(const re of a.robots){const pe=re.pos.row+1,ke=re.pos.col+1;ee.push({range:new _.Range(pe,ke,pe,ke+1),options:{inlineClassName:re.type,description:re.type}})}if(a.fire.forEach((re,pe)=>{const ke=re.row+1,lt=re.col+1,J=pe%2===0?"vimbots-fire vimbots-fire-b":"vimbots-fire";ee.push({range:new _.Range(ke,lt,ke,lt+1),options:{inlineClassName:J,description:"vimbots-fire"}})}),S.set(ee),p.current){const re=new Set(b.current.map(ke=>`${ke.row},${ke.col}`)),pe=[];for(const ke of a.fire)if(!re.has(`${ke.row},${ke.col}`)){const lt=p.current.getScrolledVisiblePosition({lineNumber:ke.row+1,column:ke.col+1});lt&&pe.push({id:++k.current,top:lt.top,left:lt.left})}pe.length>0&&y(ke=>[...ke,...pe])}b.current=a.fire},[a.playerPos,a.robots,a.fire,m,g,L]);const z=f.useRef(a.status);f.useEffect(()=>{z.current!=="level_cleared"&&a.status==="level_cleared"&&(o==null||o(a.level,a.score)),z.current=a.status},[a.status,a.level,a.score,o]),f.useEffect(()=>{if(a.status!=="level_cleared")return;const S=_=>{["Meta","Control","Alt","Shift"].includes(_.key)||(_.preventDefault(),_.stopPropagation(),c({type:"NEXT_LEVEL"}))};return document.addEventListener("keydown",S,{capture:!0}),()=>document.removeEventListener("keydown",S,{capture:!0})},[a.status]),f.useEffect(()=>{const S=_=>{_.key!=="."||Y.current.status!=="playing"||(_.preventDefault(),_.stopPropagation(),v(!1),c({type:"WAIT"}))};return document.addEventListener("keydown",S,{capture:!0}),()=>document.removeEventListener("keydown",S,{capture:!0})},[]),f.useEffect(()=>{R()},[R]),f.useEffect(()=>{if(m===0)return;const S=i.playerPos;fe({lineNumber:S.row+1,column:S.col+1}),P.current=S,B.current=S},[m]);const ue=a.status==="dead"||a.status==="game_over",ye=a.status==="level_cleared";f.useEffect(()=>{a.status==="playing"&&L===0&&c({type:"TRAPPED"})},[a.status,L]),f.useEffect(()=>{if(!ue)return;const S=_=>{_.key==="Enter"&&(_.preventDefault(),r()),_.key==="Escape"&&(_.preventDefault(),n())};return document.addEventListener("keydown",S),()=>document.removeEventListener("keydown",S)},[ue,r,n]);const[ae,Ze]=f.useState(null),Ie=f.useRef(!1);return f.useEffect(()=>{var pe;if(!ue||Ie.current)return;Ie.current=!0;const S=e.boardSource==="grid"?e.gridPreset:e.boardSource,_={id:crypto.randomUUID(),username:Ui(),timestamp:Date.now(),difficulty:e.difficulty,levelsCleared:a.level-1,totalScore:a.score,challengeScore:((pe=N.current)==null?void 0:pe.score)??0,gridSize:S},ee=As(),de=qb(ee,_);Bi(de);const re=de.vimbots.filter(ke=>ke.difficulty===e.difficulty).findIndex(ke=>ke.id===_.id);Ze(re>=0?re+1:null)},[ue]),f.useEffect(()=>{if(x.length===0)return;const S=new Set(x.map(ee=>ee.id)),_=setTimeout(()=>{y(ee=>ee.filter(de=>!S.has(de.id)))},700);return()=>clearTimeout(_)},[x]),l.jsxs("div",{className:"h-full bg-gray-900 flex flex-col overflow-hidden font-mono relative",children:[l.jsx("style",{children:`
        .vimbots-player { background: rgba(59,130,246,0.7);  border-radius: 2px; }
        .borg           { background: rgba(239,68,68,0.75);   border-radius: 2px; }
        .reaper         { background: rgba(168,85,247,0.75);  border-radius: 2px; }
        .phantom        { background: rgba(34,211,238,0.75);  border-radius: 2px; }
        .inferno        { background: rgba(251,191,36,0.75);  border-radius: 2px; }
        .decimator      { background: rgba(248,250,252,0.85); border-radius: 2px; }
        .vimbots-fire   { background: rgba(249,115,22,0.65);  border-radius: 2px; outline: 2px solid rgba(253,186,116,0.9); outline-offset: -1px; }
        .vimbots-safe   { background: rgba(20,184,166,0.18);  border-radius: 2px; outline: 1px dashed rgba(45,212,191,0.55); outline-offset: -1px; }

        @keyframes vimbots-spark {
          0%   { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 1; }
          100% { transform: translate(calc(var(--dx) * 3), calc(var(--dy) * 3)) scale(0); opacity: 0; }
        }
        .vimbots-firework { position: absolute; pointer-events: none; z-index: 10; }
        .vimbots-spark {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          animation: vimbots-spark 0.6s ease-out forwards;
        }

        ${e.animatedEffects?(()=>{const S=Date.now()/1e3,_=`${-(S%1.4).toFixed(3)}s`,ee=`${-(S%.7).toFixed(3)}s`,de=`${-(S%1.1).toFixed(3)}s`,Oe=`${-(S%.5).toFixed(3)}s`,re=[2,1.6,1.3,1,.8].map(pe=>`${-(S%pe).toFixed(3)}s`);return`
          @keyframes vimbots-fire-color {
            0%   { background: rgba(249,115,22,0.7);  outline-color: rgba(253,186,116,0.95); }
            25%  { background: rgba(239,68,68,0.85);  outline-color: rgba(252,165,165,1.0); }
            55%  { background: rgba(251,191,36,0.9);  outline-color: rgba(253,224,71,1.0); }
            80%  { background: rgba(249,115,22,0.75); outline-color: rgba(253,186,116,0.9); }
            100% { background: rgba(249,115,22,0.7);  outline-color: rgba(253,186,116,0.95); }
          }
          @keyframes vimbots-fire-glow-pulse {
            0%, 100% { box-shadow: 0 0 4px 2px rgba(249,115,22,0.6); }
            50%       { box-shadow: 0 0 8px 4px rgba(253,186,116,0.9); }
          }
          @keyframes vimbots-fire-bright {
            0%, 100% { filter: brightness(1); }
            50%       { filter: brightness(1.45); }
          }
          .vimbots-fire {
            animation:
              vimbots-fire-color 0.35s ease-in-out infinite,
              vimbots-fire-glow-pulse 0.7s ease-in-out infinite,
              vimbots-fire-bright 0.4s ease-in-out infinite;
            animation-delay: ${_}, ${ee}, ${_};
          }
          .vimbots-fire-b {
            animation-delay: ${de}, ${Oe}, ${de};
          }

          @keyframes vimbots-pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.2; }
          }
          .borg      { animation: vimbots-pulse 2.0s ease-in-out infinite; animation-delay: ${re[0]}; }
          .reaper    { animation: vimbots-pulse 1.6s ease-in-out infinite; animation-delay: ${re[1]}; }
          .phantom   { animation: vimbots-pulse 1.3s ease-in-out infinite; animation-delay: ${re[2]}; }
          .inferno   { animation: vimbots-pulse 1.0s ease-in-out infinite; animation-delay: ${re[3]}; }
          .decimator { animation: vimbots-pulse 0.8s ease-in-out infinite; animation-delay: ${re[4]}; }
        `})():""}
      `}),l.jsxs(la,{title:"VimBots",onBack:n,backLabel:l.jsxs(l.Fragment,{children:[l.jsx(Ds,{className:"w-4 h-4"})," Quit"]}),children:[l.jsxs("span",{className:"text-yellow-300 tabular-nums font-bold",children:["Level ",a.level]}),l.jsxs("span",{className:"text-green-400 tabular-nums font-bold",children:["Score ",a.score]})]}),ue&&l.jsx("div",{className:"absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/80 flex flex-col items-center justify-center px-6",children:l.jsxs("div",{className:"w-full max-w-md bg-gray-900/90 border border-gray-600 rounded-2xl shadow-2xl p-8 text-center",children:[l.jsx(Qi,{className:"w-14 h-14 text-yellow-400 mx-auto mb-3"}),l.jsx("h2",{className:"text-3xl font-bold text-white mb-2",children:"Game Over"}),l.jsx("p",{className:"text-gray-400 text-sm mb-4",children:a.message}),l.jsxs("div",{className:"text-gray-300 text-lg font-bold mb-1",children:["Final Score: ",l.jsx("span",{className:"text-green-400",children:a.score}),l.jsx("span",{className:"text-gray-500 text-sm ml-3",children:a.level>1?`${a.level-1} level${a.level-1!==1?"s":""} cleared`:"Level 1"})]}),C&&C.score>0&&l.jsxs("div",{className:"text-sm text-indigo-400 mb-2",children:["+",C.score," challenge pts",l.jsxs("span",{className:"text-gray-500 ml-2",children:["= ",a.score+C.score," total"]})]}),ae!==null&&l.jsxs("div",{className:`mb-4 text-sm font-mono font-bold ${ae<=3?"text-yellow-400":"text-blue-300"}`,children:[ae===1?"🥇 New #1 on ":ae===2?"🥈 #2 on ":ae===3?"🥉 #3 on ":`#${ae} on `,l.jsx("span",{className:"capitalize",children:e.difficulty})," leaderboard"," · ",l.jsx("button",{onClick:()=>s(e.difficulty),className:"underline underline-offset-2 hover:text-white transition-colors",children:"view scores"})]}),l.jsxs("div",{className:"flex gap-3",children:[l.jsxs("button",{onClick:r,className:"flex-1 py-2.5 rounded bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-colors",children:["Play again",l.jsx("span",{className:"ml-1.5 text-green-300 font-normal text-xs opacity-80",children:"↵"})]}),l.jsxs("button",{onClick:n,className:"flex-1 py-2.5 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm transition-colors",children:["Back to menu",l.jsx("span",{className:"ml-1.5 text-gray-400 font-normal text-xs opacity-80",children:"Esc"})]})]})]})}),ye&&l.jsx("div",{className:"absolute inset-0 z-40 backdrop-blur-sm bg-gray-900/70 flex flex-col items-center justify-center px-6 pointer-events-none",children:l.jsxs("div",{className:"bg-gray-900/90 border border-green-700 rounded-2xl shadow-2xl p-8 text-center pointer-events-none",children:[l.jsx("div",{className:"text-4xl mb-2",children:"🎉"}),l.jsx("h2",{className:"text-2xl font-bold text-green-400 mb-2",children:a.message}),a.timerBonusEarned>0&&l.jsxs("p",{className:"text-yellow-300 text-sm font-bold mt-1",children:["⚡ Speed bonus: +",a.timerBonusEarned," pts"]}),e.timerBonus&&a.timerBonusEarned===0&&l.jsx("p",{className:"text-gray-500 text-xs mt-1",children:"No speed bonus — timer expired"}),l.jsx("p",{className:"text-gray-400 text-sm mt-3 animate-pulse",children:"Press any key to continue…"})]})}),e.challengeMode&&C&&C.activeChallenges.length>0&&!ue&&!ye&&(()=>{const S=C.activeChallenges.find(_=>_.status==="active");return S?l.jsxs("div",{className:"flex items-center gap-3 px-4 py-2 bg-indigo-950/60 border-b border-indigo-800 flex-shrink-0 text-xs font-mono",children:[l.jsx(Zt,{className:"w-3.5 h-3.5 text-indigo-400 flex-shrink-0"}),l.jsx("span",{className:"text-white",children:S.question}),S.showSolution&&S.solution.length>0&&l.jsx("div",{className:"flex gap-1 ml-1",children:S.solution.map((_,ee)=>l.jsx("kbd",{className:"px-1.5 py-0.5 bg-gray-700 text-yellow-300 rounded border border-gray-600",children:_},ee))}),l.jsxs("span",{className:"ml-auto text-indigo-400 tabular-nums",children:["+",C.score]})]}):null})(),l.jsxs("div",{className:"flex flex-1 min-h-0 overflow-hidden",children:[l.jsxs("div",{className:"flex-[3] min-w-0 min-h-0 relative",children:[l.jsx("div",{ref:V,className:"h-full"}),e.snowEffect&&l.jsx(Cl,{}),e.opacityFade&&l.jsx(El,{cursorLine:0,getVisibleRange:()=>null}),x.map(S=>{const _=["#f97316","#ef4444","#fbbf24","#fb923c","#fef08a","#f43f5e"];return l.jsx("div",{className:"vimbots-firework",style:{top:`${S.top}px`,left:`${S.left}px`,transform:"translate(-50%, -50%)"},children:[0,1,2,3,4,5].map(ee=>{const de=Math.round(8*Math.cos(ee*Math.PI/3)),Oe=Math.round(8*Math.sin(ee*Math.PI/3));return l.jsx("div",{className:"vimbots-spark",style:{"--dx":`${de}px`,"--dy":`${Oe}px`,background:_[ee]}},ee)})},S.id)})]}),l.jsxs("div",{className:"flex-[2] min-w-[200px] max-w-xs bg-gray-800 border-l border-gray-700 flex flex-col gap-0 overflow-y-auto",children:[e.challengeMode&&C&&l.jsxs("div",{className:"px-3 pt-3 pb-1 border-b border-gray-700 flex gap-2 items-start flex-shrink-0",children:[l.jsx(Xi,{score:C.score,combo:C.combo}),l.jsx(Ji,{ceiling:C.ceiling,levelPct:C.levelPct})]}),e.challengeMode&&C&&l.jsx("div",{className:"px-3 py-2 border-b border-gray-700 max-h-48 overflow-y-auto flex-shrink-0",children:l.jsx(Yi,{challenges:C.activeChallenges,onMarkUnsupported:S=>{ls(S),E.current=E.current.filter(_=>_.id!==S),N.current&&(N.current={...N.current,activeChallenges:N.current.activeChallenges.map(_=>_.commandId===S?{..._,status:"failed"}:_)},D(N.current))}})}),l.jsxs("div",{className:"px-4 py-3 border-b border-gray-700",children:[l.jsx("div",{className:"text-xs text-gray-400 uppercase tracking-wide mb-1",children:"Level"}),l.jsx("div",{className:"text-3xl font-bold text-yellow-300 tabular-nums",children:a.level})]}),l.jsxs("div",{className:"px-4 py-3 border-b border-gray-700",children:[l.jsx("div",{className:"text-xs text-gray-400 uppercase tracking-wide mb-1",children:"Score"}),l.jsx("div",{className:"text-2xl font-bold text-green-400 tabular-nums",children:a.score})]}),e.timerBonus&&(()=>{const S=Date.now()-a.levelStartedAt,_=Math.max(0,a.parMs-S),ee=_/a.parMs,de=_===0,Oe=ee<.25&&!de,re=Math.ceil(_/1e3),pe=Math.floor(re/60),ke=re%60,lt=de?"EXPIRED":`${pe}:${String(ke).padStart(2,"0")}`;return l.jsxs("div",{className:"px-4 py-3 border-b border-gray-700",children:[l.jsx("div",{className:"text-xs text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1",children:l.jsx("span",{children:"⚡ Speed bonus"})}),l.jsx("div",{className:`text-lg font-bold tabular-nums font-mono ${de?"text-gray-600":Oe?"text-red-400":"text-yellow-300"}`,children:lt}),l.jsx("div",{className:"mt-1.5 h-1 bg-gray-700 rounded-full overflow-hidden",children:l.jsx("div",{className:`h-full rounded-full transition-all duration-500 ${de?"bg-gray-700":Oe?"bg-red-500":ee<.5?"bg-yellow-400":"bg-green-400"}`,style:{width:`${ee*100}%`}})})]})})(),l.jsxs("div",{className:"px-4 py-3 border-b border-gray-700",children:[l.jsxs("div",{className:"text-xs text-gray-400 uppercase tracking-wide mb-2",children:["Enemies"," ",l.jsx("span",{className:"text-white font-bold tabular-nums",children:a.robots.length}),l.jsxs("span",{className:"text-gray-500",children:[" / ",a.initialRobotCount]})]}),Gg(Math.max(1,(e.startingEnemyLevel??1)+a.level-1)).map(S=>{const _=a.robots.filter(de=>de.type===S.type).length,ee=a.initialRobotsByType[S.type]??0;return ee===0?null:l.jsxs("div",{className:"flex items-center gap-2 mb-1.5",children:[l.jsx("span",{className:"inline-block w-3 h-3 rounded-sm flex-shrink-0",style:{background:S.color,outline:S.outline,outlineOffset:"-1px"}}),l.jsx("span",{className:"text-xs text-gray-300 flex-1",children:S.name}),l.jsx("span",{className:"flex items-center gap-0.5 mr-1",title:`Speed ${S.speed}`,children:[1,2,3].map(de=>l.jsx("span",{className:"inline-block w-1.5 h-1.5 rounded-full",style:de<=S.speed?{background:S.color,boxShadow:`0 0 3px ${S.color}`}:{background:"rgba(255,255,255,0.12)"}},de))}),l.jsxs("span",{className:"text-xs text-gray-400 tabular-nums",children:[l.jsx("span",{className:_===0?"text-gray-600 line-through":"text-white font-bold",children:_}),l.jsxs("span",{className:"text-gray-600",children:[" / ",ee]})]})]},S.type)}),l.jsxs("div",{className:"flex items-center justify-between text-sm mt-2 pt-1.5 border-t border-gray-700/60",children:[l.jsx("span",{className:"text-orange-400 text-xs",children:"🔥 Fire"}),l.jsx("span",{className:"font-bold text-white tabular-nums text-xs",children:a.fire.length})]}),l.jsxs("div",{className:"flex items-center justify-between text-sm mt-1 pt-1 border-t border-gray-700/60",children:[l.jsx("span",{className:`text-xs ${L===0?"text-red-400 font-bold":"text-teal-400"}`,children:L===0?"⚠ Safe moves":"✦ Safe moves"}),l.jsx("span",{className:`font-bold tabular-nums text-xs ${L===0?"text-red-400":L<=3?"text-yellow-400":"text-teal-300"}`,children:L})]})]}),l.jsxs("div",{className:"px-4 py-3 border-b border-gray-700 flex flex-col gap-2",children:[l.jsxs("button",{onClick:()=>{c({type:"WAIT"}),R()},disabled:a.status!=="playing",className:"flex items-center gap-2 px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-bold transition-colors w-full",title:"Pass turn — let robots advance without moving (.)",children:[l.jsx("span",{className:"text-base leading-none",children:"⏸"}),l.jsxs("span",{children:["Wait ",l.jsx("span",{className:"text-gray-400 font-normal text-xs ml-1",children:"(.)"})]})]}),e.enableTeleport&&l.jsxs("button",{onClick:()=>{v(!1),c({type:"TELEPORT"}),R()},disabled:a.teleportsLeft<=0||a.status!=="playing",className:"flex items-center gap-2 px-3 py-2 rounded bg-indigo-700 hover:bg-indigo-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-bold transition-colors w-full",children:[l.jsx(Zt,{className:"w-4 h-4 flex-shrink-0"}),l.jsxs("span",{children:["Teleport (",a.teleportsLeft," left)"]})]}),e.enableSafeTeleport&&l.jsxs("button",{onClick:()=>{v(!1),c({type:"SAFE_TELEPORT"}),R()},disabled:a.safeTeleportsLeft<=0||a.status!=="playing",className:"flex items-center gap-2 px-3 py-2 rounded bg-teal-700 hover:bg-teal-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-bold transition-colors w-full",children:[l.jsx(Fs,{className:"w-4 h-4 flex-shrink-0"}),l.jsxs("span",{children:["Safe Teleport (",a.safeTeleportsLeft," left)"]})]}),e.enableHelperGrid&&l.jsxs("button",{onClick:()=>{!g&&a.helperGridLeft>0?(c({type:"USE_HELPER"}),v(!0)):v(S=>!S),R()},disabled:!g&&a.helperGridLeft<=0,className:`flex items-center gap-2 px-3 py-2 rounded text-sm font-bold transition-colors w-full ${g?"bg-teal-600 hover:bg-teal-500 text-white":a.helperGridLeft>0?"bg-teal-900/60 hover:bg-teal-800/60 border border-teal-700 text-teal-300":"bg-gray-700 text-gray-500 cursor-not-allowed"}`,children:[l.jsx("span",{className:"text-base leading-none",children:"🔍"}),l.jsx("span",{children:g?"Hide safe cells":`Show safe cells (${a.helperGridLeft} left)`})]})]}),l.jsxs("div",{className:"px-4 py-3 border-b border-gray-700 flex-1",children:[l.jsx("div",{className:"text-xs text-gray-400 uppercase tracking-wide mb-2",children:"Status"}),l.jsx("div",{className:`text-sm font-mono leading-relaxed ${a.status==="dead"||a.status==="game_over"?"text-red-400":a.status==="level_cleared"?"text-green-400":"text-gray-300"}`,children:a.message||"Playing…"})]}),l.jsx("div",{className:"px-4 py-2 border-b border-gray-700",children:l.jsxs("div",{className:"text-xs text-gray-500",children:["Player @ row ",a.playerPos.row+1,", col ",a.playerPos.col+1]})}),l.jsxs("div",{className:"px-4 py-3 flex flex-col gap-2",children:[ue&&l.jsx("button",{onClick:r,className:"w-full px-3 py-2 rounded bg-green-700 hover:bg-green-600 text-white text-sm font-bold transition-colors",children:"Play again"}),l.jsx("button",{onClick:n,className:"w-full px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-bold transition-colors",children:ue?"Back to menu":"Quit"})]})]})]}),l.jsx("div",{ref:ge,className:"h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs text-gray-400 flex-shrink-0"})]})}function i2(e,t){switch(t.type){case"START":{const n=e.screen==="game"?e.playKey:0;return{screen:"game",config:t.config,gridContent:t.gridContent,playKey:n+1}}case"QUIT":return{screen:"setup"}}}function a2({onBack:e,onViewHighScores:t}){const[n,r]=f.useReducer(i2,{screen:"setup"});return n.screen==="setup"?l.jsx(l2,{onStart:(s,o)=>r({type:"START",config:s,gridContent:o}),onBack:e}):l.jsx(o2,{config:n.config,gridContent:n.gridContent,onQuit:()=>r({type:"QUIT"}),onReplay:()=>{const s=Kg(n.config.boardSource,n.config.gridPreset,n.config.customRows,n.config.customCols,n.config.codeFileSize);r({type:"START",config:n.config,gridContent:s})},onViewHighScores:t},n.playKey)}const Qg=[{id:"1.1",title:"Lesson 1.1",description:"Moving cursor, exiting, inserting, appending"},{id:"1.2",title:"Lesson 1.2",description:"Deletion commands and undo"},{id:"1.3",title:"Lesson 1.3",description:"Put, replace, and change"},{id:"1.4",title:"Lesson 1.4",description:"File status, search, and substitute"},{id:"1.5",title:"Lesson 1.5",description:"External commands and writing files"},{id:"1.6",title:"Lesson 1.6",description:"Open, append, replace, yank, options"},{id:"1.7",title:"Lesson 1.7",description:"Help system and command completion"}],Yg=[{id:"2.1",title:"Lesson 2.1",description:"Text objects, registers, and marks"}],Xg={1:Qg,2:Yg},xf="~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";function c2(e,t){const n=e===1?u2:d2;if(t.length===0)return n;const r=n.split(xf),s=r[0],o=r[r.length-1],a=r.slice(1,r.length-1).filter(c=>t.some(u=>new RegExp(`Lesson\\s+${u.replace(".","\\.")}[. ]`).test(c)));return[s,...a,o].join(xf)}const u2=`===============================================================================
=    W e l c o m e   t o   t h e   V I M   T u t o r    -    Version 1.7      =
===============================================================================
=			       C H A P T E R   ONE			      =
===============================================================================

     Vim is a very powerful editor that has many commands, too many to
     explain in a tutor such as this.  This tutor is designed to describe
     enough of the commands that you will be able to easily use Vim as
     an all-purpose editor.
     The approximate time required to complete the tutor is 30 minutes,
     depending upon how much time is spent with experimentation.

     ATTENTION:
     The commands in the lessons will modify the text.  Make a copy of this
     file to practice on (if you started "vimtutor" this is already a copy).

     It is important to remember that this tutor is set up to teach by
     use.  That means that you need to execute the commands to learn them
     properly.  If you only read the text, you will forget the commands!
     Now, make sure that your Caps-Lock key is NOT depressed and press
     the   j   key enough times to move the cursor so that lesson 1.1.1
     completely fills the screen.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Lesson 1.1.1:  MOVING THE CURSOR


   ** To move the cursor, press the h,j,k,l keys as indicated. **
	     ^
	     k		    Hint:  The h key is at the left and moves left.
       < h	 l >		   The l key is at the right and moves right.
	     j			   The j key looks like a down arrow.
	     v
  1. Move the cursor around the screen until you are comfortable.

  2. Hold down the down key (j) until it repeats.
     Now you know how to move to the next lesson.

  3. Using the down key, move to lesson 1.1.2.

NOTE: If you are ever unsure about something you typed, press <ESC> to place
      you in Normal mode.  Then retype the command you wanted.

NOTE: The cursor keys should also work.  But using hjkl you will be able to
      move around much faster, once you get used to it.  Really!

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    Lesson 1.1.2: EXITING VIM


  !! NOTE: Before executing any of the steps below, read this entire lesson!!

  1. Press the <ESC> key (to make sure you are in Normal mode).

  2. Type:	:q! <ENTER>.
     This exits the editor, DISCARDING any changes you have made.

  3. Get back here by executing the command that got you into this tutor. That
     might be:  vimtutor <ENTER>

  4. If you have these steps memorized and are confident, execute steps
     1 through 3 to exit and re-enter the editor.

NOTE:  :q! <ENTER>  discards any changes you made.  In a few lessons you
       will learn how to save the changes to a file.

  5. Move the cursor down to lesson 1.1.3.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			     Lesson 1.1.3: TEXT EDITING - DELETION


		   ** Press  x  to delete the character under the cursor. **

  1. Move the cursor to the line below marked --->.

  2. To fix the errors, move the cursor until it is on top of the
     character to be deleted.

  3. Press the	x  key to delete the unwanted character.

  4. Repeat steps 2 through 4 until the sentence is correct.

---> The ccow jumpedd ovverr thhe mooon.

  5. Now that the line is correct, go on to lesson 1.1.4.

NOTE: As you go through this tutor, do not try to memorize, learn by usage.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			      Lesson 1.1.4: TEXT EDITING - INSERTION


			** Press  i  to insert text. **

  1. Move the cursor to the first line below marked --->.

  2. To make the first line the same as the second, move the cursor on top
     of the character BEFORE which the text is to be inserted.

  3. Press  i  and type in the necessary additions.

  4. As each error is fixed press <ESC> to return to Normal mode.
     Repeat steps 2 through 4 to correct the sentence.

---> There is text misng this .
---> There is some text missing from this line.

  5. When you are comfortable inserting text move to lesson 1.1.5.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			     Lesson 1.1.5: TEXT EDITING - APPENDING


			** Press  A  to append text. **

  1. Move the cursor to the first line below marked --->.
     It does not matter on what character the cursor is in that line.

  2. Press  A  and type in the necessary additions.

  3. As the text has been appended press <ESC> to return to Normal mode.

  4. Move the cursor to the second line marked ---> and repeat
     steps 2 and 3 to correct this sentence.

---> There is some text missing from th
     There is some text missing from this line.
---> There is also some text miss
     There is also some text missing here.

  5. When you are comfortable appending text move to lesson 1.1.6.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			     Lesson 1.1.6: EDITING A FILE

			    ** Use  :wq  to save a file and exit. **

  !! NOTE: Before executing any of the steps below, read this entire lesson!!

  1.  If you have access to another terminal, do the following there.
      Otherwise, exit this tutor as you did in lesson 1.1.2:  :q!

  2. At the shell prompt type this command:  vim file.txt <ENTER>
     'vim' is the command to start the Vim editor, 'file.txt' is the name of
     the file you wish to edit.  Use the name of a file that you can change.

  3. Insert and delete text as you learned in the previous lessons.

  4. Save the file with changes and exit Vim with:  :wq <ENTER>

  5. If you have quit vimtutor in step 1 restart the vimtutor and move down to
     the following summary.

  6. After reading the above steps and understanding them: do it.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				       Lesson 1.1 SUMMARY


  1. The cursor is moved using either the arrow keys or the hjkl keys.
	 h (left)	j (down)       k (up)	    l (right)

  2. To start Vim from the shell prompt type:  vim FILENAME <ENTER>

  3. To exit Vim type:	   <ESC>   :q!	 <ENTER>  to trash all changes.
	     OR type:	   <ESC>   :wq	 <ENTER>  to save the changes.

  4. To delete the character at the cursor type:  x

  5. To insert or append text type:
	 i   type inserted text   <ESC>		insert before the cursor
	 A   type appended text   <ESC>         append after the line

NOTE: Pressing <ESC> will place you in Normal mode or will cancel
      an unwanted and partially completed command.

Now continue with lesson 1.2.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				Lesson 1.2.1: DELETION COMMANDS


			       ** Type  dw  to delete a word. **

  1. Press  <ESC>  to make sure you are in Normal mode.

  2. Move the cursor to the line below marked --->.

  3. Move the cursor to the beginning of a word that needs to be deleted.

  4. Type   dw	 to make the word disappear.

  NOTE: The letter  d  will appear on the last line of the screen as you type
	it.  Vim is waiting for you to type  w .  If you see another character
	than  d  you typed something wrong; press  <ESC>  and start over.

---> There are a some words fun that don't belong paper in this sentence.

  5. Repeat steps 3 and 4 until the sentence is correct and go to lesson 1.2.2.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			      Lesson 1.2.2: MORE DELETION COMMANDS


		   ** Type  d$	to delete to the end of the line. **

  1. Press  <ESC>  to make sure you are in Normal mode.

  2. Move the cursor to the line below marked --->.

  3. Move the cursor to the end of the correct line (AFTER the first . ).

  4. Type    d$    to delete to the end of the line.

---> Somebody typed the end of this line twice. end of this line twice.


  5. Move on to lesson 1.2.3 to understand what is happening.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			     Lesson 1.2.3: ON OPERATORS AND MOTIONS


  Many commands that change text are made from an operator and a motion.
  The format for a delete command with the  d  delete operator is as follows:

  	d   motion

  Where:
    d      - is the delete operator.
    motion - is what the operator will operate on (listed below).

  A short list of motions:
    w - until the start of the next word, EXCLUDING its first character.
    e - to the end of the current word, INCLUDING the last character.
    $ - to the end of the line, INCLUDING the last character.

  Thus typing  de  will delete from the cursor to the end of the word.

NOTE:  Pressing just the motion while in Normal mode without an operator will
       move the cursor as specified.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			     Lesson 1.2.4: USING A COUNT FOR A MOTION


	   ** Typing a number before a motion repeats it that many times. **

  1. Move the cursor to the start of the line below marked --->.

  2. Type  2w  to move the cursor two words forward.

  3. Type  3e  to move the cursor to the end of the third word forward.

  4. Type  0  (zero) to move to the start of the line.

  5. Repeat steps 2 and 3 with different numbers.

---> This is just a line with words you can move around in.

  6. Move on to lesson 1.2.5.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			     Lesson 1.2.5: USING A COUNT TO DELETE MORE


		   ** Typing a number with an operator repeats it that many times. **

  In the combination of the delete operator and a motion mentioned above you
  insert a count before the motion to delete more:
	 d   number   motion

  1. Move the cursor to the first UPPER CASE word in the line marked --->.

  2. Type  d2w  to delete the two UPPER CASE words.

  3. Repeat steps 1 and 2 with a different count to delete the consecutive
     UPPER CASE words with one command.

--->  this ABC DE line FGHI JK LMN OP of words is Q RS TUV cleaned up.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				 Lesson 1.2.6: OPERATING ON LINES


			   ** Type  dd   to delete a whole line. **

  Due to the frequency of whole line deletion, the designers of Vi decided
  it would be easier to simply type two d's to delete a line.

  1. Move the cursor to the second line in the phrase below.
  2. Type  dd  to delete the line.
  3. Now move to the fourth line.
  4. Type   2dd   to delete two lines.

--->  1)  Roses are red,
--->  2)  Mud is fun,
--->  3)  Violets are blue,
--->  4)  I have a car,
--->  5)  Clocks tell time,
--->  6)  Sugar is sweet
--->  7)  And so are you.

Doubling to operate on a line also works for operators mentioned below.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				 Lesson 1.2.7: THE UNDO COMMAND


		   ** Press  u	to undo the last commands,   U  to fix a whole line. **

  1. Move the cursor to the line below marked ---> and place it on the
     first error.
  2. Type  x  to delete the first unwanted character.
  3. Now type  u  to undo the last command executed.
  4. This time fix all the errors on the line using the  x  command.
  5. Now type a capital  U  to return the line to its original state.
  6. Now type  u  a few times to undo the  U  and preceding commands.
  7. Now type CTRL-R (keeping CTRL key pressed while hitting R) a few times
     to redo the commands (undo the undos).

---> Fiix the errors oon thhis line and reeplace them witth undo.

  8. These are very useful commands.  Now move on to the lesson 1.2 Summary.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				       Lesson 1.2 SUMMARY

  1. To delete from the cursor up to the next word type:        dw
  2. To delete from the cursor up to the end of the word type:  de
  3. To delete from the cursor to the end of a line type:       d$
  4. To delete a whole line type:                               dd

  5. To repeat a motion prepend it with a number:   2w
  6. The format for a change command is:
               operator   [number]   motion
     where:
       operator - is what to do, such as  d  for delete
       [number] - is an optional count to repeat the motion
       motion   - moves over the text to operate on, such as  w (word),
		  e (end of word),  $ (end of the line), etc.

  7. To move to the start of the line use a zero:  0

  8. To undo previous actions, type:           u  (lowercase u)
     To undo all the changes on a line, type:  U  (capital U)
     To undo the undos, type:                  CTRL-R

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				 Lesson 1.3.1: THE PUT COMMAND


	       ** Type	p  to put previously deleted text after the cursor. **

  1. Move the cursor to the first line below marked --->.

  2. Type  dd  to delete the line and store it in a Vim register.

  3. Move the cursor to the c) line, ABOVE where the deleted line should go.

  4. Type   p   to put the line below the cursor.

  5. Repeat steps 2 through 4 to put all the lines in correct order.

---> d) Can you learn too?
---> b) Violets are blue,
---> c) Intelligence is learned,
---> a) Roses are red,



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			       Lesson 1.3.2: THE REPLACE COMMAND


	       ** Type  rx  to replace the character at the cursor with  x . **

  1. Move the cursor to the first line below marked --->.

  2. Move the cursor so that it is on top of the first error.

  3. Type   r	and then the character which should be there.

  4. Repeat steps 2 and 3 until the first line is equal to the second one.

--->  Whan this lime was tuoed in, someone presswd some wrojg keys!
--->  When this line was typed in, someone pressed some wrong keys!

  5. Now move on to lesson 1.3.3.

NOTE: Remember that you should be learning by doing, not memorization.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				Lesson 1.3.3: THE CHANGE OPERATOR


		   ** To change until the end of a word, type  ce . **

  1. Move the cursor to the first line below marked --->.

  2. Place the cursor on the  u  in  lubw.

  3. Type  ce  and the correct word (in this case, type  ine ).

  4. Press <ESC> and move to the next character that needs to be changed.

  5. Repeat steps 3 and 4 until the first sentence is the same as the second.

---> This lubw has a few wptfd that mrrf changing usf the change operator.
---> This line has a few words that need changing using the change operator.

Notice that  ce  deletes the word and places you in Insert mode.
             cc  does the same for the whole line.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			       Lesson 1.3.4: MORE CHANGES USING c


	     ** The change operator is used with the same motions as delete. **

  1. The change operator works in the same way as delete.  The format is:

         c    [number]   motion

  2. The motions are the same, such as   w (word) and  $ (end of line).

  3. Move the cursor to the first line below marked --->.

  4. Move the cursor to the first error.

  5. Type  c$  and type the rest of the line like the second and press <ESC>.

---> The end of this line needs some help to make it like the second.
---> The end of this line needs to be corrected using the  c$  command.

NOTE:  You can use the Backspace key to correct mistakes while typing.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				       Lesson 1.3 SUMMARY


  1. To put back text that has just been deleted, type   p .  This puts the
     deleted text AFTER the cursor (if a line was deleted it will go on the
     line below the cursor).

  2. To replace the character under the cursor, type   r   and then the
     character you want to have there.

  3. The change operator allows you to change from the cursor to where the
     motion takes you.  eg. Type  ce  to change from the cursor to the end of
     the word,  c$  to change to the end of a line.

  4. The format for change is:

	 c   [number]   motion

Now go on to the next lesson.



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			  Lesson 1.4.1: CURSOR LOCATION AND FILE STATUS

  ** Type CTRL-G to show your location in the file and the file status.
     Type  G  to move to a line in the file. **

  NOTE: Read this entire lesson before executing any of the steps!!

  1. Hold down the Ctrl key and press  g .  We call this CTRL-G.
     A message will appear at the bottom of the page with the filename and the
     position in the file.  Remember the line number for Step 3.

NOTE:  You may see the cursor position in the lower right corner of the screen
       This happens when the 'ruler' option is set (see  :help 'ruler'  )

  2. Press  G  to move you to the bottom of the file.
     Type  gg  to move you to the start of the file.

  3. Type the number of the line you were on and then  G .  This will
     return you to the line you were on when you first pressed CTRL-G.

  4. If you feel confident to do this, execute steps 1 through 3.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				Lesson 1.4.2: THE SEARCH COMMAND


	     ** Type  /  followed by a phrase to search for the phrase. **

  1. In Normal mode type the  /  character.  Notice that it and the cursor
     appear at the bottom of the screen as with the  :	command.

  2. Now type 'errroor' <ENTER>.  This is the word you want to search for.

  3. To search for the same phrase again, simply type  n .
     To search for the same phrase in the opposite direction, type  N .

  4. To search for a phrase in the backward direction, use  ?  instead of  / .

  5. To go back to where you came from press  CTRL-O  (Keep Ctrl down while
     pressing the letter o).  Repeat to go back further.  CTRL-I goes forward.

--->  "errroor" is not the way to spell error;  errroor is an error.
NOTE: When the search reaches the end of the file it will continue at the
      start, unless the 'wrapscan' option has been reset.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			   Lesson 1.4.3: MATCHING PARENTHESES SEARCH


		      ** Type  %  to find a matching ),], or } . **

  1. Place the cursor on any (, [, or { in the line below marked --->.

  2. Now type the  %  character.

  3. The cursor will move to the matching parenthesis or bracket.

  4. Type  %  to move the cursor to the other matching bracket.

  5. Move the cursor to another (,),[,],{ or } and see what  %  does.

---> This ( is a test line with ('s, ['s ] and {'s } in it. ))


NOTE: This is very useful in debugging a program with unmatched parentheses!



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			      Lesson 1.4.4: THE SUBSTITUTE COMMAND


		** Type  :s/old/new/g  to substitute 'new' for 'old'. **

  1. Move the cursor to the line below marked --->.

  2. Type  :s/thee/the <ENTER>  .  Note that this command only changes the
     first occurrence of "thee" in the line.

  3. Now type  :s/thee/the/g .  Adding the  g  flag means to substitute
     globally in the line, change all occurrences of "thee" in the line.

---> thee best time to see thee flowers is in thee spring.

  4. To change every occurrence of a character string between two lines,
     type   :#,#s/old/new/g    where #,# are the line numbers of the range
                               of lines where the substitution is to be done.
     Type   :%s/old/new/g      to change every occurrence in the whole file.
     Type   :%s/old/new/gc     to find every occurrence in the whole file,
     			       with a prompt whether to substitute or not.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				       Lesson 1.4 SUMMARY


  1. CTRL-G  displays your location in the file and the file status.
             G  moves to the end of the file.
     number  G  moves to that line number.
            gg  moves to the first line.

  2. Typing  /	followed by a phrase searches FORWARD for the phrase.
     Typing  ?	followed by a phrase searches BACKWARD for the phrase.
     After a search type  n  to find the next occurrence in the same direction
     or  N  to search in the opposite direction.
     CTRL-O takes you back to older positions, CTRL-I to newer positions.

  3. Typing  %	while the cursor is on a (,),[,],{, or } goes to its match.

  4. To substitute new for the first old in a line type    :s/old/new
     To substitute new for all 'old's on a line type	   :s/old/new/g
     To substitute phrases between two line #'s type	   :#,#s/old/new/g
     To substitute all occurrences in the file type	   :%s/old/new/g
     To ask for confirmation each time add 'c'		   :%s/old/new/gc

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Lesson 1.5.1: HOW TO EXECUTE AN EXTERNAL COMMAND


		   ** Type  :!	followed by an external command to execute that command. **

  1. Type the familiar command	:  to set the cursor at the bottom of the
     screen.  This allows you to enter a command-line command.

  2. Now type the  !  (exclamation point) character.  This allows you to
     execute any external shell command.

  3. As an example type   ls   following the ! and then hit <ENTER>.  This
     will show you a listing of your directory, just as if you were at the
     shell prompt.  Or use  :!dir  if ls doesn't work.

NOTE:  It is possible to execute any external command this way, also with
       arguments.

NOTE:  All  :  commands must be finished by hitting <ENTER>
       From here on we will not always mention it.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			      Lesson 1.5.2: MORE ON WRITING FILES


	     ** To save the changes made to the text, type  :w FILENAME  **

  1. Type  :!dir  or  :!ls  to get a listing of your directory.
     You already know you must hit <ENTER> after this.

  2. Choose a filename that does not exist yet, such as TEST.

  3. Now type:	 :w TEST   (where TEST is the filename you chose.)

  4. This saves the whole file (the Vim Tutor) under the name TEST.
     To verify this, type    :!dir  or  :!ls   again to see your directory.

NOTE: If you were to exit Vim and start it again with  vim TEST , the file
      would be an exact copy of the tutor when you saved it.

  5. Now remove the file by typing (Windows):   :!del TEST
				or (Unix):	:!rm TEST


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    Lesson 1.5.3: SELECTING TEXT TO WRITE


		** To save part of the file, type  v  motion  :w FILENAME **

  1. Move the cursor to this line.

  2. Press  v  and move the cursor to the fifth item below.  Notice that the
     text is highlighted.

  3. Press the  :  character.  At the bottom of the screen  :'<,'> will appear.

  4. Type  w TEST  , where TEST is a filename that does not exist yet.  Verify
     that you see  :'<,'>w TEST  before you press <ENTER>.

  5. Vim will write the selected lines to the file TEST.  Use  :!dir  or  :!ls
     to see it.  Do not remove it yet!  We will use it in the next lesson.

NOTE:  Pressing  v  starts Visual selection.  You can move the cursor around
       to make the selection bigger or smaller.  Then you can use an operator
       to do something with the text.  For example,  d  deletes the text.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			   Lesson 1.5.4: RETRIEVING AND MERGING FILES


	       ** To insert the contents of a file, type  :r FILENAME  **

  1. Place the cursor just above this line.

NOTE:  After executing Step 2 you will see text from lesson 1.5.3.  Then move
       DOWN to see this lesson again.

  2. Now retrieve your TEST file using the command   :r TEST   where TEST is
     the name of the file you used.
     The file you retrieve is placed below the cursor line.

  3. To verify that a file was retrieved, cursor back and notice that there
     are now two copies of lesson 1.5.3, the original and the file version.

NOTE:  You can also read the output of an external command.  For example,
       :r !ls  reads the output of the ls command and puts it below the
       cursor.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				       Lesson 1.5 SUMMARY


  1.  :!command  executes an external command.

      Some useful examples are:
	 (Windows)	  (Unix)
	  :!dir		   :!ls		   -  shows a directory listing.
	  :!del FILENAME   :!rm FILENAME   -  removes file FILENAME.

  2.  :w FILENAME  writes the current Vim file to disk with name FILENAME.

  3.  v  motion  :w FILENAME  saves the Visually selected lines in file
      FILENAME.

  4.  :r FILENAME  retrieves disk file FILENAME and puts it below the
      cursor position.

  5.  :r !dir  reads the output of the dir command and puts it below the
      cursor position.


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				 Lesson 1.6.1: THE OPEN COMMAND


 ** Type  o  to open a line below the cursor and place you in Insert mode. **

  1. Move the cursor to the first line below marked --->.

  2. Type the lowercase letter  o  to open up a line BELOW the cursor and place
     you in Insert mode.

  3. Now type some text and press <ESC> to exit Insert mode.

---> After typing  o  the cursor is placed on the open line in Insert mode.

  4. To open up a line ABOVE the cursor, simply type a capital	O , rather
     than a lowercase  o.  Try this on the line below.

---> Open up a line above this by typing O while the cursor is on this line.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				Lesson 1.6.2: THE APPEND COMMAND


	     ** Type  a  to insert text AFTER the cursor. **

  1. Move the cursor to the start of the first line below marked --->.

  2. Press  e  until the cursor is on the end of  li .

  3. Type an  a  (lowercase) to append text AFTER the cursor.

  4. Complete the word like the line below it.  Press <ESC> to exit Insert
     mode.

  5. Use  e  to move to the next incomplete word and repeat steps 3 and 4.

---> This li will allow you to pract appendi text to a line.
---> This line will allow you to practice appending text to a line.

NOTE:  a, i and A all go to the same Insert mode, the only difference is where
       the characters are inserted.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			    Lesson 1.6.3: ANOTHER WAY TO REPLACE


	      ** Type a capital  R  to replace more than one character. **

  1. Move the cursor to the first line below marked --->.  Move the cursor to
     the beginning of the first  xxx .

  2. Now press  R  and type the number below it in the second line, so that it
     replaces the xxx .

  3. Press <ESC> to leave Replace mode.  Notice that the rest of the line
     remains unmodified.

  4. Repeat the steps to replace the remaining xxx.

---> Adding 123 to xxx gives you xxx.
---> Adding 123 to 456 gives you 579.

NOTE:  Replace mode is like Insert mode, but every typed character deletes an
       existing character.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				Lesson 1.6.4: COPY AND PASTE TEXT

	  ** Use the  y  operator to copy text and  p  to paste it **

  1. Move to the line below marked ---> and place the cursor after "a)".

  2. Start Visual mode with  v  and move the cursor to just before "first".

  3. Type  y  to yank (copy) the highlighted text.

  4. Move the cursor to the end of the next line:  j$

  5. Type  p  to put (paste) the text.  Then type:  a second <ESC> .

  6. Use Visual mode to select " item.", yank it with  y , move to the end of
     the next line with  j$  and put the text there with  p .

--->  a) this is the first item.
      b)

  NOTE: You can also use  y  as an operator:  yw  yanks one word,
        yy  yanks the whole line, then  p  puts that line.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				    Lesson 1.6.5: SET OPTION


	  ** Set an option so a search or substitute ignores case **

  1. Search for 'ignore' by entering:  /ignore <ENTER>
     Repeat several times by pressing  n .

  2. Set the 'ic' (Ignore case) option by entering:   :set ic

  3. Now search for 'ignore' again by pressing  n
     Notice that Ignore and IGNORE are now also found.

  4. Set the 'hlsearch' and 'incsearch' options:  :set hls is

  5. Now type the search command again and see what happens:  /ignore <ENTER>

  6. To disable ignoring case enter:  :set noic

NOTE:  To remove the highlighting of matches enter:   :nohlsearch
NOTE:  If you want to ignore case for just one search command, use  \\c
       in the phrase:  /ignore\\c <ENTER>
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				       Lesson 1.6 SUMMARY

  1. Type  o  to open a line BELOW the cursor and start Insert mode.
     Type  O  to open a line ABOVE the cursor.

  2. Type  a  to insert text AFTER the cursor.
     Type  A  to insert text after the end of the line.

  3. The  e  command moves to the end of a word.

  4. The  y  operator yanks (copies) text,  p  puts (pastes) it.

  5. Typing a capital  R  enters Replace mode until  <ESC>  is pressed.

  6. Typing ":set xxx" sets the option "xxx".  Some options are:
  	'ic' 'ignorecase'	ignore upper/lower case when searching
	'is' 'incsearch'	show partial matches for a search phrase
	'hls' 'hlsearch'	highlight all matching phrases
     You can either use the long or the short option name.

  7. Prepend "no" to switch an option off:   :set noic

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			       Lesson 1.7.1: GETTING HELP


			      ** Use the on-line help system **

  Vim has a comprehensive on-line help system.  To get started, try one of
  these three:
	- press the <HELP> key (if you have one)
	- press the <F1> key (if you have one)
	- type   :help <ENTER>

  Read the text in the help window to find out how the help works.
  Type  CTRL-W CTRL-W   to jump from one window to another.
  Type    :q <ENTER>    to close the help window.

  You can find help on just about any subject, by giving an argument to the
  ":help" command.  Try these (don't forget pressing <ENTER>):

	:help w
	:help c_CTRL-D
	:help insert-index
	:help user-manual
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			      Lesson 1.7.2: CREATE A STARTUP SCRIPT


				  ** Enable Vim features **

  Vim has many more features than Vi, but most of them are disabled by
  default.  To start using more features you should create a "vimrc" file.

  1. Start editing the "vimrc" file.  This depends on your system:
	:e ~/.vimrc		for Unix
	:e ~/_vimrc		for Windows

  2. Now read the example "vimrc" file contents:
	:r $VIMRUNTIME/vimrc_example.vim

  3. Write the file with:
	:w

  The next time you start Vim it will use syntax highlighting.
  You can add all your preferred settings to this "vimrc" file.
  For more information type  :help vimrc-intro

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				     Lesson 1.7.3: COMPLETION


		      ** Command line completion with CTRL-D and <TAB> **

  1. Make sure Vim is not in compatible mode:  :set nocp

  2. Look what files exist in the directory:  :!ls   or  :!dir

  3. Type the start of a command:  :e

  4. Press  CTRL-D  and Vim will show a list of commands that start with "e".

  5. Type  d<TAB>  and Vim will complete the command name to ":edit".

  6. Now add a space and the start of an existing file name:  :edit FIL

  7. Press <TAB>.  Vim will complete the name (if it is unique).

NOTE:  Completion works for many commands.  Just try pressing CTRL-D and
       <TAB>.  It is especially useful for  :help .

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				       Lesson 1.7 SUMMARY


  1. Type  :help  or press <F1> or <HELP>  to open a help window.

  2. Type  :help cmd  to find help on  cmd .

  3. Type  CTRL-W CTRL-W  to jump to another window.

  4. Type  :q  to close the help window.

  5. Create a vimrc startup script to keep your preferred settings.

  6. When typing a  :  command, press CTRL-D to see possible completions.
     Press <TAB> to use one completion.




~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This concludes Chapter 1 of the Vim Tutor.  Consider continuing with
  Chapter 2 which covers registers, marks and the use of text objects.

  It was intended to give a brief overview of the Vim editor, just enough to
  allow you to use the editor fairly easily. It is far from complete as Vim
  has many many more commands.

  Read the user manual next: ":help user-manual".

  For further reading and studying, this book is recommended:
	Vim - Vi Improved - by Steve Oualline
	Publisher: New Riders
  The first book completely dedicated to Vim.  Especially useful for beginners.
  There are many examples and pictures.
  See https://iccf-holland.org/click5.html

  This book is older and more about Vi than Vim, but also recommended:
	Learning the Vi Editor - by Linda Lamb
	Publisher: O'Reilly & Associates Inc.
  It is a good book to get to know almost anything you want to do with Vi.
  The sixth edition also includes information on Vim.

  This tutorial was written by Michael C. Pierce and Robert K. Ware,
  Colorado School of Mines using ideas supplied by Charles Smith,
  Colorado State University.  E-mail: bware@mines.colorado.edu.

  Modified for Vim by Bram Moolenaar.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,d2=`===============================================================================
=    W e l c o m e   t o   t h e   V I M   T u t o r    -    Version 1.7      =
===============================================================================
=			    C H A P T E R   TWO				      =
===============================================================================

     Hic Sunt Dracones: if this is your first exposure to vim and you
     intended to avail yourself of the introductory chapter, kindly type
     :q!<ENTER> and run vimtutor for Chapter 1 instead.

     The approximate time required to complete this chapter is 8-10 minutes,
     depending upon how much time is spent with experimentation.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		     Lesson 2.1.1: MASTERING TEXT OBJECTS

   ** Operate on logical text blocks with precision using text objects **

  1. Practice word operations:
     - Place cursor on any word in the line below
     - Type  diw  to delete INNER word (word without surrounding space)
     - Type  daw  to delete A WORD (including trailing whitespace)
     - Try with other operators:  ciw  (change),  yiw  (yank),  gqiw  (format)

---> Practice on: "Vim's", (text_object), and 'powerful' words here.

  2. Work with bracketed content:
     - Put cursor inside any () {} [] <> pair below
     - Type  di(  or  dib  (delete inner bracket)
     - Type  da(  or  dab  (delete around brackets)
     - Try same with  i"/a"  for quotes,  it/at  for HTML/XML tags

---> Test cases: {curly}, [square], <angle>, and "quoted" items.

  3. Paragraph and sentence manipulation:
     - Use  dip  to delete inner paragraph (cursor anywhere in paragraph)
     - Use  vap  to visually select entire paragraph
     - Try  das  to delete a sentence (works between .!? punctuation)

  4. Advanced combinations:
     - ciwnew<ESC>    - Change current word to "new"
     - yss"<ESC>      - Wrap entire line in quotes (vim-surround plugin style)
     - gUit           - Uppercase inner HTML tag content
     - va"p           - Select quoted text and paste over it

---> Final exercise: (Modify "this" text) by [applying {various} operations]<

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		     Lesson 2.1.2: THE NAMED REGISTERS


         ** Store two yanked words concurrently and then paste them **

  1. Move the cursor to the line below marked --->

  2. Navigate to any point on the word 'Edward' and type   "ayiw

MNEMONIC: into register(") named (a) (y)ank (i)nner (w)ord

  3. Navigate forward to the word 'cookie' (fk or 2fc or $2b or /co<ENTER>)
     and type   "byiw

  4. Navigate to any point on the word 'Vince' and type   ciw<CTRL-R>a<ESC>

MNEMONIC: (c)hange (i)nner (w)ord with <contents of (r)egister> named (a)

  5. Navigate to any point on the word 'cake' and type   ciw<CTRL-R>b<ESC>

--->  a) Edward will henceforth be in charge of the cookie rations
      b) In this capacity, Vince will have sole cake discretionary powers

NOTE: Delete also works into registers, i.e. "sdiw will delete the word under
      the cursor into register s.

REFERENCE: 	Registers 	:h registers
		Named Registers :h quotea
		Motion 		:h motion.txt<ENTER> /inner<ENTER>
		CTRL-R		:h insert<ENTER> /CTRL-R<ENTER>

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		     Lesson 2.1.3: THE EXPRESSION REGISTER


	     ** Insert the results of calculations on the fly **

  1. Move the cursor to the line below marked --->

  2. Navigate to any point on the supplied number

  3. Type ciw<CTRL-R> followed by  =60*60*24<ENTER>

  4. On the next line, enter insert mode and add today's date with
     <CTRL-R> followed by  =system('date')<ENTER>

NOTE: All calls to system are OS dependent, e.g. on Windows use
      system('date /t')   or  :r!date /t

---> I have forgotten the exact number of seconds in a day, is it 84600?
     Today's date is:

NOTE: the same can be achieved with :pu=system('date')
      or, with fewer keystrokes :r!date

REFERENCE: 	Expression Register 	:h quote=

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		     Lesson 2.1.4: THE NUMBERED REGISTERS


	** Press  yy and dd to witness their effect on the registers **

  1. Move the cursor to the line below marked --->

  2. yank the zeroth line, then inspect registers with :reg<ENTER>

  3. delete line 0. with "cdd, then inspect registers
     (Where do you expect line 0 to be?)

  4. continue deleting each successive line, inspecting :reg as you go

NOTE: You should notice that old full-line deletions move down the list
      as new full-line deletions are added

  5. Now (p)aste the following registers in order; c, 7, 4, 8, 2. i.e. "7p

---> 0. This
     9. wobble
     8. secret
     7. is
     6. on
     5. axis
     4. a
     3. war
     2. message
     1. tribute

NOTE: Whole line deletions (dd) are much longer lived in the numbered registers
      than whole line yanks, or deletions involving smaller movements

REFERENCE: 	Numbered Registers 	:h quote0

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		     Lesson 2.1.5: SPECIAL REGISTERS

 ** Use system clipboard and blackhole registers for advanced editing **

 Note: Clipboard use requires X11/Wayland libraries on Linux systems AND
       a Vim built with "+clipboard" (usually a Huge build). Check with
       ":version"  and ":echo has('clipboard_working')"

  1. Clipboard registers  +  and  *  :
     - "+y  - Yank to system clipboard (e.g. "+yy for current line)
     - "+p  - Paste from system clipboard
     - "* is primary selection on X11 (middle-click), "+ is clipboard

---> Try: "+yy then paste into another application with Ctrl-V or Cmd+V

  2. Blackhole register  _  discards text:
     - "_daw  - Delete word without saving to any register
     - Useful when you don't want to overwrite your default " register
     - Note this is using the "a Word" text object, introduced in a previous
       lession
     - "_dd   - Delete line without saving
     - "_dap  - Delete paragraph without saving
     - Combine with counts: 3"_dw

---> Practice: "_diw on any word to delete it without affecting yank history

  3. Combine with visual selections:
     - Select text with V then "+y
     - To paste from clipboard in insert mode: Ctrl-R +
     - Try opening another application and paste from clipboard

  4. Remember:
     - Clipboard registers work across different Vim instances
     - Clipboard register is not always working
     - Blackhole prevents accidental register overwrites
     - Default " register is still available for normal yank/paste
     - Named registers (a-z) remain private to each Vim session

  5. Clipboard troubleshooting:
     - Check support with :echo has('clipboard_working')
     - 1 means available, 0 means not compiled in
     - On Linux, may need vim-gtk or vim-x11 package
       (check :version output)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		     Lesson 2.1.6: THE BEAUTY OF MARKS

	           ** Code monkey arithmetic avoidance **

NOTE: a common conundrum when coding is moving around large chunks of code.
      The following technique helps avoid number line calculations associated
      with operations like   "a147d   or   :945,1091d a   or even worse using
      i<CTRL-R> followed by   =1091-945<ENTER>   first

  1. Move the cursor to the line below marked --->

  2. Go to the first line of the function and mark it with   ma

NOTE: exact position on line is NOT important!

  3. Navigate to the end of the line and then the end of the code block
     with   $%

  4. Delete the block into register a with   "ad'a

MNEMONIC: into register(") named (a) put the (d)eletion from the cursor to the
          LINE containing mark(') (a)

  5. Paste the block between BBB and CCC   "ap

NOTE: practice this operation multiple times to become fluent   ma$%"ad'a

---> AAA
     function itGotRealBigRealFast() {
       if ( somethingIsTrue ) {
         doIt()
       }
       // the taxonomy of our function has changed and it
       // no longer makes alphabetical sense in its current position

       // imagine hundreds of lines of code

       // naively you could navigate to the start and end and record or
       // remember each line number
     }
     BBB
     CCC

NOTE: marks and registers do not share a namespace, therefore register a is
      completely independent of mark a. This is not true of registers and
      macros.

REFERENCE: 	Marks 		:h marks
		Mark Motions 	:h mark-motions  (difference between ' and \`)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		     Lesson 2.1 SUMMARY


  1. Text objects provide precision editing:
     - iw/aw - inner/around word
     - i[/a[ - inner/around bracket
     - i"/a" - inner/around quotes
     - it/at - inner/around tag
     - ip/ap - inner/around paragraph
     - is/as - inner/around sentence

  2. To store (yank, delete) text into, and retrieve (paste) from, a total of
     26 registers (a-z)
  3. Yank a whole word from anywhere within a word:   yiw
  4. Change a whole word from anywhere within a word:   ciw
  5. Insert text directly from registers in insert mode:   (C-r)a

  6. Insert the results of simple arithmetic operations: <CTRL-R> followed by
     =60*60<ENTER>
     in insert mode
  7. Insert the results of system calls: <CTRL-R> followed by
     =system('ls -1')<ENTER>
     in insert mode

  8. Inspect registers with   :reg
  9. Learn the final destination of whole line deletions: dd in the numbered
     registers, i.e. descending from register 1 - 9.  Appreciate that whole
     line deletions are preserved in the numbered registers longer than any
     other operation
 10. Learn the final destination of all yanks in the numbered registers and
     how ephemeral they are

 11. Place marks from command mode   m[a-zA-Z0-9]
 12. Move line-wise to a mark with   '

 13. Special registers:
     - "+/*  - System clipboard (OS dependent)
     - "_    - Blackhole (discard deleted/yanked text)
     - "=    - Expression register

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This concludes chapter two of the Vim Tutor.  It is a work in progress.

  This chapter was written by Paul D. Parker.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,yf=kn;function m2(e){return{mode:"general",language:"typescript",startingLevel:e.challengeStartingLevel,repetitionTarget:e.challengeRepetition,guidedMode:e.challengeGuidedMode,categories:e.challengeCategories.length>0?e.challengeCategories:null,dynamicAssist:null,skipUnsupported:!1,commandTimeMultiplier:e.challengeTimeMultiplier,knowledgeFilter:"all",drillMode:e.challengeDrillMode}}function f2(e){let t=e.challengeCategories.length>0?yf.filter(r=>e.challengeCategories.includes(r.category)):yf;const n=nn();return t=t.filter(r=>!n.has(r.id)),e.challengeStartingLevel>0&&(t=t.filter(r=>r.level>=e.challengeStartingLevel)),t}function p2(e,t){return t.newState}function h2({content:e,chapter:t}){const{editorRef:n,statusRef:r}=Un({language:"plaintext",defaultValue:e});return l.jsxs("div",{className:"flex flex-col h-full bg-gray-950",children:[l.jsxs("div",{className:"flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700",children:[l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"vimtutor"}),l.jsxs("span",{className:"ml-auto text-xs text-gray-500 font-mono uppercase",children:["chapter ",t]})]}),l.jsx("div",{ref:n,className:"flex-1 min-h-0"}),l.jsx("div",{ref:r,className:"h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs font-mono text-gray-400"})]})}function g2({content:e,chapter:t,config:n}){const r=f.useRef(null),s=f.useRef([]),o=f.useRef(null),[i,a]=f.useReducer(p2,null,()=>{const m=m2(n),h=f2(n);r.current=m,s.current=h;const g=pl(m,h);return o.current=g,g}),c=f.useCallback(m=>{if(!o.current||!s.current.length)return;const h=zi(o.current,m,s.current,Date.now());o.current=h,a({type:"COMMAND",newState:h})},[]),{editorRef:u,statusRef:d}=Un({language:"plaintext",defaultValue:e,onCommandExecuted:c});f.useEffect(()=>{const m=setInterval(()=>{if(!o.current||!s.current.length)return;const h=qi(o.current,s.current,Date.now());o.current=h,a({type:"TICK",newState:h})},100);return()=>clearInterval(m)},[]);const p=f.useCallback(m=>{if(o.current&&(s.current=s.current.filter(h=>h.id!==m),r.current&&s.current.length>0)){const h=pl(r.current,s.current);o.current=h,a({type:"MARK_UNSUPPORTED",commandId:m,newState:h})}},[]);return l.jsxs("div",{className:"flex h-full overflow-hidden",children:[l.jsxs("div",{className:"flex-[3] flex flex-col min-w-0 bg-gray-950",children:[l.jsxs("div",{className:"flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700",children:[l.jsx("span",{className:"text-gray-400 text-xs font-mono",children:"vimtutor"}),l.jsxs("span",{className:"ml-auto text-xs text-gray-500 font-mono uppercase",children:["chapter ",t]})]}),l.jsx("div",{ref:u,className:"flex-1 min-h-0"}),l.jsx("div",{ref:d,className:"h-7 bg-gray-800 border-t border-gray-700 px-3 flex items-center text-xs font-mono text-gray-400"})]}),l.jsxs("div",{className:"flex-[2] flex flex-col border-l border-gray-700 min-w-0 overflow-hidden",children:[l.jsxs("div",{className:"p-3 border-b border-gray-700 flex gap-3 items-start flex-shrink-0",children:[l.jsx(Xi,{score:i.score,combo:i.combo}),l.jsx(Ji,{ceiling:i.ceiling,levelPct:i.levelPct})]}),l.jsx("div",{className:"flex-1 overflow-y-auto p-3",children:l.jsx(Yi,{challenges:i.activeChallenges,onMarkUnsupported:p})})]})]})}function x2({config:e,onBack:t}){const n=c2(e.chapter,e.sections),r=e.sections.length===0?"all lessons":e.sections.join(", ");return l.jsxs("div",{className:"h-full flex flex-col",children:[l.jsx(la,{title:"VimTutor",onBack:t,children:l.jsxs("div",{className:"flex items-center gap-2 text-xs font-mono text-gray-400",children:[l.jsx(cd,{className:"w-4 h-4"}),l.jsxs("span",{children:["Ch. ",e.chapter]}),l.jsx("span",{className:"text-gray-600",children:"·"}),l.jsx("span",{children:r})]})}),l.jsx("div",{className:"flex-1 min-h-0",children:e.challengeMode?l.jsx(g2,{content:n,chapter:e.chapter,config:e}):l.jsx(h2,{content:n,chapter:e.chapter})})]})}function bi(e){return Xg[e].map(t=>t.id)}const y2={challengeMode:!1,challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeCategories:mt,challengeDrillMode:!1};function v2(e,t){switch(t.type){case"SET_CHAPTER":return{...e,chapter:t.value,sections:bi(t.value)};case"TOGGLE_SECTION":{const n=e.sections.includes(t.id);if(n&&e.sections.length===1)return e;const r=n?e.sections.filter(s=>s!==t.id):[...e.sections,t.id];return{...e,sections:r}}case"SET_ALL_SECTIONS":return{...e,sections:bi(t.chapter)};case"PATCH":return{...e,...t.payload};default:return e}}function vf(){try{const e=localStorage.getItem(X.LAST_VIMTUTOR_CONFIG);return e?JSON.parse(e):null}catch{return null}}function b2(e){try{localStorage.setItem(X.LAST_VIMTUTOR_CONFIG,JSON.stringify(e))}catch{}}const w2=[{value:1,label:"Chapter 1",desc:"Basic editing — 30 min"},{value:2,label:"Chapter 2",desc:"Registers, marks, text objects — 10 min"}];function N2({onStart:e,onBack:t}){const[n,r]=f.useState(vf),[s,o]=f.useReducer(v2,null,()=>{const h=vf();if(h){const g=Xg[h.chapter].map(w=>w.id),v=h.sections.filter(w=>g.includes(w));return{chapter:h.chapter,sections:v.length>0?v:bi(h.chapter),challengeMode:h.challengeMode??!1,challengeGuidedMode:h.challengeGuidedMode??"none",challengeStartingLevel:h.challengeStartingLevel??0,challengeRepetition:h.challengeRepetition??1,challengeTimeMultiplier:h.challengeTimeMultiplier??1,challengeCategories:h.challengeCategories??mt,challengeDrillMode:h.challengeDrillMode??!1}}return{chapter:1,sections:bi(1),...y2}}),i=h=>o({type:"PATCH",payload:h}),a=s.chapter===1?Qg:Yg,c=s.sections.length===a.length,u=s.sections.length===1;function d(h){return{chapter:h.chapter,sections:h.sections,challengeMode:h.challengeMode,challengeGuidedMode:h.challengeGuidedMode,challengeStartingLevel:h.challengeStartingLevel,challengeRepetition:h.challengeRepetition,challengeTimeMultiplier:h.challengeTimeMultiplier,challengeCategories:h.challengeCategories,challengeDrillMode:h.challengeDrillMode}}function p(){const h=d(s);b2(h),r(h),e(h)}const m=l.jsxs("div",{className:"space-y-3",children:[l.jsx(Sl,{onClick:p}),n&&l.jsxs("button",{onClick:()=>e(n),className:"w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-mono text-gray-300 transition-colors",children:[l.jsx(pi,{className:"w-4 h-4"}),"Replay — Ch.",n.chapter," ",n.sections.length>0?`· ${n.sections.join(", ")}`:"· all lessons"]})]});return l.jsxs(kl,{title:"VimTutor",subtitle:"Follow the official vim tutorial — practice every lesson",actions:m,children:[l.jsx(W,{label:"Chapter",icon:cd,defaultOpen:!0,badge:`Ch. ${s.chapter}`,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:w2.map(h=>l.jsxs("button",{onClick:()=>o({type:"SET_CHAPTER",value:h.value}),className:F.modeCard(s.chapter===h.value),children:[l.jsx("span",{className:"font-bold",children:h.label}),l.jsx("span",{className:`block text-xs mt-0.5 ${s.chapter===h.value?"text-blue-200":"text-gray-500"}`,children:h.desc})]},h.value))})}),l.jsxs(W,{label:"Lessons",icon:m1,defaultOpen:!0,badge:c?"all":`${s.sections.length}/${a.length}`,children:[l.jsxs("div",{className:"flex justify-between items-center mb-3",children:[l.jsx("span",{className:"text-gray-500 font-mono text-xs",children:"Select the lessons to practice"}),c?null:l.jsx("button",{onClick:()=>o({type:"SET_ALL_SECTIONS",chapter:s.chapter}),className:"text-xs text-blue-400 hover:text-blue-300 font-mono",children:"select all"})]}),l.jsx("div",{className:"flex flex-col gap-2",children:a.map(h=>{const g=s.sections.includes(h.id),v=g&&u;return l.jsxs("button",{onClick:()=>o({type:"TOGGLE_SECTION",id:h.id}),disabled:v,className:`flex items-start gap-3 px-3 py-2.5 rounded border text-left transition-colors font-mono ${g?"bg-green-900/30 border-green-600 text-green-100":"bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"} ${v?"opacity-50 cursor-not-allowed":""}`,children:[l.jsx("span",{className:`w-4 h-4 mt-0.5 flex-shrink-0 rounded-sm border text-xs flex items-center justify-center ${g?"bg-green-600 border-green-500 text-white":"border-gray-600"}`,children:g?"✓":""}),l.jsxs("span",{children:[l.jsx("span",{className:"text-sm font-bold block",children:h.title}),l.jsx("span",{className:"text-xs text-gray-400 mt-0.5 block",children:h.description})]})]},h.id)})})]}),l.jsx(vr,{enabled:s.challengeMode,onToggle:()=>i({challengeMode:!s.challengeMode}),children:l.jsx(Vn,{guidedMode:s.challengeGuidedMode,onGuidedMode:h=>i({challengeGuidedMode:h}),startingLevel:s.challengeStartingLevel,onStartingLevel:h=>i({challengeStartingLevel:h}),repetition:s.challengeRepetition,onRepetition:h=>i({challengeRepetition:h}),timeMultiplier:s.challengeTimeMultiplier,onTimeMultiplier:h=>i({challengeTimeMultiplier:h}),selectableCategories:mt,selectedCategories:s.challengeCategories,onToggleCategory:h=>i({challengeCategories:s.challengeCategories.includes(h)?s.challengeCategories.length>1?s.challengeCategories.filter(g=>g!==h):s.challengeCategories:[...s.challengeCategories,h]}),drillMode:s.challengeDrillMode,onDrillMode:h=>i({challengeDrillMode:h})})})]})}const k2=[{path:"/help/readme",label:"Readme"},{path:"/help",label:"Dev Mode",exact:!0},{path:"/help/vimgolf",label:"VimGolf"}];function S2(){const e=Is(),t=Ft(),n=(o,i)=>i?t.pathname===o:t.pathname===o||t.pathname.startsWith(o+"/"),r=n("/help"),s=(o,i,a)=>`px-2 py-1 rounded text-xs font-mono transition-colors ${n(o)?i:a}`;return l.jsx("header",{className:"flex-shrink-0 bg-gray-900 border-b border-gray-700 z-50",children:l.jsxs("div",{className:"px-4 h-11 flex items-center gap-2 font-mono",children:[l.jsx("button",{onClick:()=>e("/"),className:"font-bold text-white text-sm tracking-tight hover:text-green-400 transition-colors flex-shrink-0",children:"VIM ARCADE"}),r&&l.jsx("div",{className:"flex items-center gap-0.5 ml-2",children:k2.map(o=>{const i=(o.exact,t.pathname===o.path);return l.jsx("button",{onClick:()=>e(o.path),className:`px-2.5 py-1 text-xs font-mono transition-colors border-b-2 ${i?"border-blue-400 text-white":"border-transparent text-gray-500 hover:text-gray-300"}`,children:o.label},o.path)})}),l.jsx("span",{className:"flex-1"}),l.jsx("button",{onClick:()=>e("/high-scores"),className:`px-2.5 py-1 rounded text-xs font-mono transition-colors ${n("/high-scores")?"bg-yellow-700/40 text-yellow-300 border border-yellow-700":"text-gray-400 hover:text-white hover:bg-gray-700"}`,children:l.jsx(Qi,{className:"w-4 h-4"})}),l.jsx("button",{onClick:()=>e("/preferences"),className:s("/preferences","text-gray-300 bg-gray-700","text-gray-500 hover:text-gray-300 hover:bg-gray-800"),title:"Preferences",children:l.jsx(pw,{className:"w-4 h-4"})}),l.jsxs("button",{onClick:()=>e("/help/readme"),className:s("/help","text-gray-300 bg-gray-700","text-gray-600 hover:text-gray-400 hover:bg-gray-800"),children:[l.jsx(N1,{className:"w-3.5 h-3.5 inline mr-1"}),"Help"]})]})})}function xe(e,t,n,r){return t.includes(e)?e:(r(),n)}function Lt(e,t,n,r,s){return typeof e=="number"&&Number.isFinite(e)&&e>=t&&e<=n?e:(s(),r)}function Ce(e,t,n){return typeof e=="boolean"?e:(n(),t)}function xd(e,t,n,r){return Array.isArray(e)&&e.length>0&&e.every(s=>typeof s=="string"&&t.includes(s))?e:(r(),[...n])}function Jg(e,t){return e==null?null:Array.isArray(e)&&e.every(n=>typeof n=="string")?e:(t(),null)}function bf(e,t,n){return e==="infinite"?"infinite":typeof e=="number"&&e>0?e:(n(),t)}const oa=["go","rust","python","typescript","c","cpp","lorem"],j2=["general","timed_challenge","survival"],Ml=["none","all","first_only","alternating","after_failure","first_then_failure"],Bs=[1,2,3,5],ia=[1,1.5,2,3],C2=[6e4,12e4,3e5,6e5,9e5],Zg=["all","known","unknown"];function Hs(e,t,n){try{const r=localStorage.getItem(e);return r?n(JSON.parse(r)):{state:t,hadInvalid:!1}}catch{return{state:t,hadInvalid:!1}}}function Ws(e,t,n,r=!1){const[s,o]=zl.useState(r),i=zl.useCallback(()=>{try{localStorage.setItem(e,JSON.stringify(t))}catch{}},[e,t]),a=zl.useCallback(()=>{i(),n()},[i,n]),c=zl.useCallback(()=>{i(),o(!1)},[i]);return{handleSave:a,handleTidy:c,showWarning:s,setShowWarning:o}}const Rt={language:"typescript",mode:"timed_challenge",timedDurationMs:6e4,startingLevel:0,repetitionTarget:2,guidedMode:"none",assistEnabled:!0,dynamicAssistPct:100,knowledgeFilter:"all",commandTimeMultiplier:1,drillMode:!1,categories:null,skipUnsupported:!0};function E2(e){if(!e||typeof e!="object")return{state:Rt,hadInvalid:!1};const t=e;let n=!1;const r=()=>{n=!0},s=t.dynamicAssist;let o,i;s===null?(o=!1,i=100):typeof s=="number"&&s>=10&&s<=100?(o=!0,i=s):(r(),o=Rt.assistEnabled,i=Rt.dynamicAssistPct);const a={language:xe(t.language,oa,Rt.language,r),mode:xe(t.mode,j2,Rt.mode,r),timedDurationMs:xe(t.timedDurationMs,C2,Rt.timedDurationMs,()=>{t.timedDurationMs!==void 0&&r()}),startingLevel:Lt(t.startingLevel,0,9,Rt.startingLevel,r),repetitionTarget:xe(t.repetitionTarget,Bs,Rt.repetitionTarget,r),guidedMode:xe(t.guidedMode,Ml,Rt.guidedMode,r),assistEnabled:o,dynamicAssistPct:i,knowledgeFilter:xe(t.knowledgeFilter,Zg,Rt.knowledgeFilter,r),commandTimeMultiplier:xe(t.commandTimeMultiplier,ia,Rt.commandTimeMultiplier,()=>{t.commandTimeMultiplier!==void 0&&r()}),categories:Jg(t.categories,r),skipUnsupported:Ce(t.skipUnsupported,Rt.skipUnsupported,()=>{t.skipUnsupported!==void 0&&r()}),drillMode:Ce(t.drillMode,Rt.drillMode,()=>{t.drillMode!==void 0&&r()})};return n&&console.warn("[GameDefaultsModal] Some saved Arcade config fields were invalid; reset to defaults."),{state:a,hadInvalid:n}}function T2(e){return{mode:e.mode,language:e.language,startingLevel:e.startingLevel,repetitionTarget:e.repetitionTarget,timedDurationMs:e.mode==="timed_challenge"?e.timedDurationMs:void 0,guidedMode:e.guidedMode,categories:e.categories,dynamicAssist:e.assistEnabled?e.dynamicAssistPct:null,skipUnsupported:e.skipUnsupported,knowledgeFilter:e.knowledgeFilter,commandTimeMultiplier:e.commandTimeMultiplier,drillMode:e.drillMode}}const M2=[{id:"general",label:"General",desc:"Practice endlessly, level up naturally"},{id:"timed_challenge",label:"Timed",desc:"Race the clock for a fixed session"},{id:"survival",label:"Survival",desc:"One miss ends it — no mercy"}],_2=[{label:"1m",ms:6e4},{label:"2m",ms:12e4},{label:"5m",ms:3e5},{label:"10m",ms:6e5},{label:"15m",ms:9e5}];function R2({onClose:e}){const[{state:t,hadInvalid:n}]=f.useState(()=>Hs(X.LAST_CONFIG,Rt,E2)),[r,s]=f.useReducer(Pr,t),o=u=>s({type:"PATCH",payload:u}),{handleSave:i,handleTidy:a,showWarning:c}=Ws(X.LAST_CONFIG,T2(r),e,n);return l.jsxs(Ks,{title:"Arcade Defaults",onClose:e,onSave:i,showWarning:c,onTidy:a,children:[l.jsx(W,{label:"Language",icon:xr,defaultOpen:!0,children:l.jsx(qn,{value:r.language,onChange:u=>o({language:u})})}),l.jsxs(W,{label:"Game Mode",defaultOpen:!0,children:[l.jsx("div",{className:"space-y-2 mb-3",children:M2.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({mode:u.id}),className:F.modeCard(r.mode===u.id),children:[l.jsx("span",{className:"font-bold",children:u.label}),l.jsx("span",{className:`text-xs font-normal ml-2 ${r.mode===u.id?"text-blue-200":"text-gray-500"}`,children:u.desc})]},u.id))}),r.mode==="timed_challenge"&&l.jsxs(l.Fragment,{children:[l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Duration"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:_2.map(u=>l.jsx("button",{type:"button",onClick:()=>o({timedDurationMs:u.ms}),className:F.pill(r.timedDurationMs===u.ms),children:u.label},u.ms))})]})]}),l.jsxs(W,{label:"Starting Level",defaultOpen:!0,children:[l.jsxs("p",{className:"text-xs text-gray-500 mb-1",children:["Level:"," ",l.jsx("span",{className:"text-yellow-400",children:r.startingLevel===0?"Beginner":`Lv ${r.startingLevel}`})]}),l.jsx("input",{type:"range",min:0,max:9,step:1,value:r.startingLevel,onChange:u=>o({startingLevel:Number(u.target.value)}),className:"w-full accent-purple-500"}),l.jsxs("div",{className:"flex justify-between text-xs text-gray-600 mt-1",children:[l.jsx("span",{children:"Beginner"}),l.jsx("span",{children:"Expert"})]})]}),l.jsx(W,{label:"Repetitions per Command",defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:[1,2,3,5].map(u=>l.jsxs("button",{type:"button",onClick:()=>o({repetitionTarget:u}),className:F.pill(r.repetitionTarget===u),children:[u,"×"]},u))})}),l.jsx(W,{label:"Guided Mode",children:l.jsx("div",{className:"space-y-1",children:Ml.map(u=>l.jsx("button",{type:"button",onClick:()=>o({guidedMode:u}),className:`w-full text-left px-3 py-1.5 rounded border text-xs font-mono transition-colors ${r.guidedMode===u?"bg-purple-900/40 border-purple-700 text-white font-bold":"bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600"}`,children:u},u))})}),l.jsx(W,{label:"Knowledge Filter",children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:Zg.map(u=>l.jsx("button",{type:"button",onClick:()=>o({knowledgeFilter:u}),className:F.pill(r.knowledgeFilter===u),children:u==="all"?"All commands":u==="unknown"?"Unknown only":"Known only"},u))})}),l.jsx(W,{label:"Command Time",children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:vg.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({commandTimeMultiplier:u.value}),className:F.pill(r.commandTimeMultiplier===u.value),children:[u.label,l.jsx("span",{className:"text-xs font-normal opacity-60 ml-1",children:u.desc})]},u.value))})}),l.jsx(W,{label:"Command Order",children:l.jsxs("div",{className:"flex gap-2 flex-wrap",children:[l.jsx("button",{type:"button",onClick:()=>o({drillMode:!1}),className:F.pill(!r.drillMode),children:"Randomize"}),l.jsxs("button",{type:"button",onClick:()=>o({drillMode:!0}),className:F.pill(r.drillMode),children:["Drill",l.jsx("span",{className:"text-xs font-normal opacity-60 ml-1",children:"in order"})]})]})}),l.jsxs(W,{label:"Dynamic Assist",children:[l.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[l.jsx("button",{type:"button",role:"switch","aria-checked":r.assistEnabled,onClick:()=>o({assistEnabled:!r.assistEnabled}),className:`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${r.assistEnabled?"bg-orange-600":"bg-gray-700"}`,children:l.jsx("span",{className:`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${r.assistEnabled?"translate-x-4":"translate-x-0.5"}`})}),l.jsx("span",{className:"text-xs text-gray-400",children:r.assistEnabled?`Show hint after ${r.dynamicAssistPct}% of time`:"Off"})]}),r.assistEnabled&&l.jsx("input",{type:"range",min:10,max:100,step:5,value:r.dynamicAssistPct,onChange:u=>o({dynamicAssistPct:Number(u.target.value)}),className:"w-full accent-orange-500"})]})]})}const wt={challengeCount:5,timeLimitMs:6e4,difficulty:"all",solvedFilter:"all",commandChallengesEnabled:!0,concurrentChallenges:5,commandTimeMultiplier:2,language:"typescript",startingLevel:0,repetitionTarget:2,guidedMode:"none",assistEnabled:!1,dynamicAssistPct:100,categories:null,skipUnsupported:!0},L2=[3e4,6e4,12e4,0],e0=["all","easy","medium","hard"],I2=["all","unsolved","solved","mixed"];function O2(e){if(!e||typeof e!="object")return{state:wt,hadInvalid:!1};const t=e;let n=!1;const r=()=>{n=!0},s=t.dynamicAssist;let o,i;s===null?(o=!1,i=100):typeof s=="number"&&s>=10&&s<=100?(o=!0,i=s):(s!==void 0&&r(),o=wt.assistEnabled,i=wt.dynamicAssistPct);const a=t.concurrentChallenges,c=typeof a=="number"&&a>=0&&a<=20;c||r();const u=c?a:wt.concurrentChallenges,d={challengeCount:Lt(t.challengeCount,1,50,wt.challengeCount,r),timeLimitMs:xe(t.timeLimitMs,L2,wt.timeLimitMs,r),difficulty:xe(t.difficulty,e0,wt.difficulty,r),solvedFilter:xe(t.solvedFilter,I2,wt.solvedFilter,()=>{t.solvedFilter!==void 0&&r()}),commandChallengesEnabled:u>0,concurrentChallenges:u>0?u:wt.concurrentChallenges,commandTimeMultiplier:xe(t.commandTimeMultiplier,ia,wt.commandTimeMultiplier,r),language:xe(t.language,oa,wt.language,r),startingLevel:Lt(t.startingLevel,0,9,wt.startingLevel,r),repetitionTarget:xe(t.repetitionTarget,Bs,wt.repetitionTarget,r),guidedMode:xe(t.guidedMode,Ml,wt.guidedMode,r),assistEnabled:o,dynamicAssistPct:i,categories:Jg(t.categories,r),skipUnsupported:Ce(t.skipUnsupported,wt.skipUnsupported,()=>{t.skipUnsupported!==void 0&&r()})};return n&&console.warn("[GameDefaultsModal] Some saved Goal Mode config fields were invalid; reset to defaults."),{state:d,hadInvalid:n}}function A2(e){return{challengeCount:e.challengeCount,timeLimitMs:e.timeLimitMs,difficulty:e.difficulty,solvedFilter:e.solvedFilter,concurrentChallenges:e.commandChallengesEnabled?e.concurrentChallenges:0,commandTimeMultiplier:e.commandTimeMultiplier,language:e.language,startingLevel:e.startingLevel,repetitionTarget:e.repetitionTarget,guidedMode:e.guidedMode,categories:e.categories,dynamicAssist:e.assistEnabled?e.dynamicAssistPct:null,skipUnsupported:e.skipUnsupported}}const D2=[{value:3e4,label:"30s"},{value:6e4,label:"1m"},{value:12e4,label:"2m"},{value:0,label:"∞"}];function P2({onClose:e}){const[{state:t,hadInvalid:n}]=f.useState(()=>Hs(X.LAST_GOAL_CONFIG,wt,O2)),[r,s]=f.useReducer(Pr,t),o=u=>s({type:"PATCH",payload:u}),{handleSave:i,handleTidy:a,showWarning:c}=Ws(X.LAST_GOAL_CONFIG,A2(r),e,n);return l.jsxs(Ks,{title:"Goal Mode Defaults",onClose:e,onSave:i,showWarning:c,onTidy:a,children:[l.jsx(W,{label:"Language",icon:xr,defaultOpen:!0,children:l.jsx(qn,{value:r.language,onChange:u=>o({language:u})})}),l.jsxs(W,{label:"Text Goals",icon:Gs,defaultOpen:!0,children:[l.jsxs("p",{className:"text-xs text-gray-500 mb-1",children:["Challenges: ",l.jsx("span",{className:"text-yellow-400",children:r.challengeCount})]}),l.jsx("input",{type:"range",min:1,max:20,step:1,value:r.challengeCount,onChange:u=>o({challengeCount:Number(u.target.value)}),className:"w-full accent-green-500 mb-3"}),l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Time per challenge"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:D2.map(u=>l.jsx("button",{type:"button",onClick:()=>o({timeLimitMs:u.value}),className:F.pill(r.timeLimitMs===u.value),children:u.label},u.value))}),l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Difficulty"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:e0.map(u=>l.jsx("button",{type:"button",onClick:()=>o({difficulty:u}),className:F.pill(r.difficulty===u),children:u==="all"?"All":u.charAt(0).toUpperCase()+u.slice(1)},u))}),l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Focus"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[{id:"all",label:"All"},{id:"unsolved",label:"Unsolved"},{id:"solved",label:"Solved"},{id:"mixed",label:"Mixed (70% new)"}].map(u=>l.jsx("button",{type:"button",onClick:()=>o({solvedFilter:u.id}),className:F.pill(r.solvedFilter===u.id),children:u.label},u.id))})]}),l.jsx(vr,{enabled:r.commandChallengesEnabled,onToggle:()=>o({commandChallengesEnabled:!r.commandChallengesEnabled}),children:l.jsx(Vn,{guidedMode:r.guidedMode,onGuidedMode:u=>o({guidedMode:u}),startingLevel:r.startingLevel,onStartingLevel:u=>o({startingLevel:u}),repetition:r.repetitionTarget,onRepetition:u=>o({repetitionTarget:u}),timeMultiplier:r.commandTimeMultiplier,onTimeMultiplier:u=>o({commandTimeMultiplier:u}),concurrent:r.concurrentChallenges,onConcurrent:u=>o({concurrentChallenges:u}),dynamicAssistEnabled:r.assistEnabled,onDynamicAssistToggle:()=>o({assistEnabled:!r.assistEnabled}),dynamicAssistPct:r.dynamicAssistPct,onDynamicAssistPct:u=>o({dynamicAssistPct:u}),solvedFilter:r.solvedFilter,onSolvedFilter:u=>o({solvedFilter:u})})})]})}const Se={language:"typescript",endGoal:"timed",targetCount:10,durationMs:6e4,startFromPrevious:!0,distanceMode:"mixed",goalDisplayMode:"next",multiGoalCount:3,snakeTrail:!0,enemyCount:0,enemyTrail:!1,enemySpeed:"medium",snowEffect:!1,opacityFade:!1,confettiOnGoal:!1,penaltyFlash:!1,hjklOnly:!1,noHjkl:!1,fogOfWar:!1,enemyMultiColor:!0,showMinimap:!0,challengeMode:!1,challengeCategories:[...mt],challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeDrillMode:!1,padEmptyLines:!0,startAtFirstLine:!0,solidTrails:!0,trailLengthMultiplier:1,enemyTrailSolid:!0,enemyTrailMultiplier:1},F2=["timed","user_count","total_count","survival"],$2=["short","medium","long","mixed"],G2=["next","all"],z2=["slow","medium","fast","mixed"],q2=[6e4,12e4,3e5,6e5],V2=[0,1,3,5,10];function U2(e){if(!e||typeof e!="object")return{state:Se,hadInvalid:!1};const t=e;let n=!1;const r=()=>{n=!0},s={language:xe(t.language,oa,Se.language,r),endGoal:xe(t.endGoal,F2,Se.endGoal,r),targetCount:Lt(t.targetCount,1,200,Se.targetCount,r),durationMs:xe(t.durationMs,q2,Se.durationMs,r),startFromPrevious:Ce(t.startFromPrevious,Se.startFromPrevious,r),distanceMode:xe(t.distanceMode,$2,Se.distanceMode,r),goalDisplayMode:xe(t.goalDisplayMode,G2,Se.goalDisplayMode,r),multiGoalCount:Lt(t.multiGoalCount,0,10,Se.multiGoalCount,r),snakeTrail:Ce(t.snakeTrail,Se.snakeTrail,r),enemyCount:xe(t.enemyCount,V2,Se.enemyCount,r),enemyTrail:Ce(t.enemyTrail,Se.enemyTrail,r),enemySpeed:xe(t.enemySpeed,z2,Se.enemySpeed,r),snowEffect:Ce(t.snowEffect,Se.snowEffect,r),opacityFade:Ce(t.opacityFade,Se.opacityFade,r),confettiOnGoal:Ce(t.confettiOnGoal,Se.confettiOnGoal,r),penaltyFlash:Ce(t.penaltyFlash,Se.penaltyFlash,r),hjklOnly:Ce(t.hjklOnly,Se.hjklOnly,r),noHjkl:Ce(t.noHjkl,Se.noHjkl,r),fogOfWar:Ce(t.fogOfWar,Se.fogOfWar,r),enemyMultiColor:Ce(t.enemyMultiColor,Se.enemyMultiColor,r),showMinimap:Ce(t.showMinimap,Se.showMinimap,r),challengeMode:Ce(t.challengeMode,Se.challengeMode,r),challengeCategories:xd(t.challengeCategories,mt,Se.challengeCategories,r),challengeGuidedMode:xe(t.challengeGuidedMode,Ml,Se.challengeGuidedMode,r),challengeStartingLevel:Lt(t.challengeStartingLevel,0,9,Se.challengeStartingLevel,r),challengeRepetition:xe(t.challengeRepetition,Bs,Se.challengeRepetition,r),challengeTimeMultiplier:xe(t.challengeTimeMultiplier,ia,Se.challengeTimeMultiplier,r),challengeDrillMode:Ce(t.challengeDrillMode,Se.challengeDrillMode??!1,()=>{t.challengeDrillMode!==void 0&&r()}),padEmptyLines:Ce(t.padEmptyLines,Se.padEmptyLines,r),startAtFirstLine:Ce(t.startAtFirstLine,Se.startAtFirstLine,r),solidTrails:Ce(t.solidTrails,Se.solidTrails,r),trailLengthMultiplier:bf(t.trailLengthMultiplier,Se.trailLengthMultiplier,r),enemyTrailSolid:Ce(t.enemyTrailSolid,Se.enemyTrailSolid,r),enemyTrailMultiplier:bf(t.enemyTrailMultiplier,Se.enemyTrailMultiplier,r)};return n&&console.warn("[GameDefaultsModal] Some saved Motion Race config fields were invalid; reset to defaults."),{state:s,hadInvalid:n}}const B2=[3,5,10,15,20,30],H2=[{label:"1 min",ms:6e4},{label:"2 min",ms:12e4},{label:"5 min",ms:3e5},{label:"10 min",ms:6e5}],W2=[{id:"short",label:"Short",desc:"≤8 lines"},{id:"medium",label:"Medium",desc:"9–25 lines"},{id:"long",label:"Long",desc:"26+ lines"},{id:"mixed",label:"Mixed",desc:"Varied"}],K2=[{id:"timed",icon:yr,label:"Timed",desc:"Play until time runs out"},{id:"user_count",icon:Ki,label:"Count (you)",desc:"Collect N goals yourself"},{id:"total_count",icon:yg,label:"Count (all)",desc:"N goals total"},{id:"survival",icon:$s,label:"Survival",desc:"Survive — hitting any trail ends it"}],Q2=[{id:"slow",label:"Slow"},{id:"medium",label:"Medium"},{id:"fast",label:"Fast"},{id:"mixed",label:"Mixed"}];function Y2({onClose:e}){const[{state:t,hadInvalid:n}]=f.useState(()=>Hs(X.LAST_MOTION_CONFIG,Se,U2)),[r,s]=f.useReducer(Pr,t),o=p=>s({type:"PATCH",payload:p}),{handleSave:i,handleTidy:a,showWarning:c}=Ws(X.LAST_MOTION_CONFIG,r,e,n),u=r.endGoal==="user_count"||r.endGoal==="total_count",d=r.enemyCount>0;return l.jsxs(Ks,{title:"Motion Race Defaults",onClose:e,onSave:i,showWarning:c,onTidy:a,children:[l.jsx(W,{label:"Language",icon:xr,defaultOpen:!0,children:l.jsx(qn,{value:r.language,onChange:p=>o({language:p})})}),l.jsx(W,{label:"End Condition",icon:Gs,defaultOpen:!0,children:l.jsx("div",{className:"flex flex-col gap-2",children:K2.map(p=>l.jsxs("button",{type:"button",onClick:()=>o({endGoal:p.id}),className:`${F.modeCard(r.endGoal===p.id)} flex items-center gap-2`,children:[l.jsx(p.icon,{className:"w-4 h-4 flex-shrink-0"}),l.jsx("span",{children:p.label}),l.jsx("span",{className:`text-xs font-normal ml-1 ${r.endGoal===p.id?"text-blue-200":"text-gray-500"}`,children:p.desc})]},p.id))})}),u&&l.jsx(W,{label:"Goal Count",icon:Ki,defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:B2.map(p=>l.jsx("button",{type:"button",onClick:()=>o({targetCount:p}),className:F.pill(r.targetCount===p),children:p},p))})}),r.endGoal==="timed"&&l.jsx(W,{label:"Duration",icon:yr,defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:H2.map(p=>l.jsx("button",{type:"button",onClick:()=>o({durationMs:p.ms}),className:F.pill(r.durationMs===p.ms),children:p.label},p.ms))})}),l.jsxs(W,{label:"Goal Options",icon:Wl,defaultOpen:!0,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Distance"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:W2.map(p=>l.jsxs("button",{type:"button",onClick:()=>o({distanceMode:p.id}),className:F.modeCard(r.distanceMode===p.id),children:[l.jsx("span",{className:"font-bold",children:p.label}),l.jsx("span",{className:`text-xs font-normal ml-1 ${r.distanceMode===p.id?"text-blue-200":"text-gray-500"}`,children:p.desc})]},p.id))}),l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Goal Display"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:[{id:"next",label:"Next only",desc:"One goal at a time"},{id:"all",label:"All at once",desc:"Multiple visible"}].map(p=>l.jsxs("button",{type:"button",onClick:()=>o({goalDisplayMode:p.id}),className:F.modeCard(r.goalDisplayMode===p.id),children:[l.jsx("span",{className:"font-bold",children:p.label}),l.jsx("span",{className:`text-xs font-normal ml-1 ${r.goalDisplayMode===p.id?"text-blue-200":"text-gray-500"}`,children:p.desc})]},p.id))})]}),l.jsxs(W,{label:"Enemies",icon:Ps,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Enemy Count"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-3",children:[0,1,3,5,10].map(p=>l.jsx("button",{type:"button",onClick:()=>o({enemyCount:p}),className:F.pill(r.enemyCount===p),children:p===0?"None":p},p))}),d&&l.jsxs(l.Fragment,{children:[l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Enemy Speed"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:Q2.map(p=>l.jsx("button",{type:"button",onClick:()=>o({enemySpeed:p.id}),className:F.pill(r.enemySpeed===p.id),children:p.label},p.id))})]})]}),l.jsx(vr,{enabled:r.challengeMode,onToggle:()=>o({challengeMode:!r.challengeMode}),children:l.jsx(Vn,{guidedMode:r.challengeGuidedMode,onGuidedMode:p=>o({challengeGuidedMode:p}),startingLevel:r.challengeStartingLevel,onStartingLevel:p=>o({challengeStartingLevel:p}),repetition:r.challengeRepetition,onRepetition:p=>o({challengeRepetition:p}),timeMultiplier:r.challengeTimeMultiplier,onTimeMultiplier:p=>o({challengeTimeMultiplier:p}),selectableCategories:mt,selectedCategories:r.challengeCategories,onToggleCategory:p=>o({challengeCategories:r.challengeCategories.includes(p)?r.challengeCategories.length>1?r.challengeCategories.filter(m=>m!==p):r.challengeCategories:[...r.challengeCategories,p]}),drillMode:r.challengeDrillMode??!1,onDrillMode:p=>o({challengeDrillMode:p})})})]})}const it={lang:"typescript",codeSize:"medium",borderShape:"full-rect",subMode:"classic",ballCount:2,ballSpeed:"medium",enemyAI:"wanderer",lives:3,timerMs:12e4,diagonalMode:!1,challengeMode:!1,challengeGuidedMode:"none",challengeStartingLevel:0,challengeRepetition:1,challengeTimeMultiplier:1,challengeCategories:[...mt],challengeDrillMode:!1,bombCount:1},X2=["short","medium","long"],J2=["full-rect","code-right","inverse-code","sub-rect","rectangles"],Z2=["classic","championship","ball-escalation","combo"],ej=["passive","wanderer","hunter","cutter","unstoppable"],tj=["slow","medium","fast","mixed"],nj=[6e4,12e4,3e5],rj=[1,3,5],lj=[0,1,2,3],sj=[1,2,3,4,5];function oj(e){if(!e||typeof e!="object")return{state:it,hadInvalid:!1};const t=e;let n=!1;const r=()=>{n=!0},s={lang:xe(t.lang,oa,it.lang,r),codeSize:xe(t.codeSize,X2,it.codeSize,r),borderShape:xe(t.borderShape,J2,it.borderShape,r),subMode:xe(t.subMode,Z2,it.subMode,r),ballCount:xe(t.ballCount,sj,it.ballCount,r),ballSpeed:xe(t.ballSpeed,tj,it.ballSpeed,r),enemyAI:xe(t.enemyAI,ej,it.enemyAI,r),lives:xe(t.lives,rj,it.lives,r),timerMs:xe(t.timerMs,nj,it.timerMs,r),diagonalMode:Ce(t.diagonalMode,it.diagonalMode,r),challengeMode:Ce(t.challengeMode,it.challengeMode,r),challengeGuidedMode:xe(t.challengeGuidedMode,Ml,it.challengeGuidedMode,r),challengeStartingLevel:Lt(t.challengeStartingLevel,0,9,it.challengeStartingLevel,r),challengeRepetition:xe(t.challengeRepetition,Bs,it.challengeRepetition,r),challengeTimeMultiplier:xe(t.challengeTimeMultiplier,ia,it.challengeTimeMultiplier,r),challengeCategories:xd(t.challengeCategories,mt,it.challengeCategories,r),challengeDrillMode:Ce(t.challengeDrillMode,it.challengeDrillMode,()=>{t.challengeDrillMode!==void 0&&r()}),bombCount:xe(t.bombCount,lj,it.bombCount,r)};return n&&console.warn("[GameDefaultsModal] Some saved QVIMX config fields were invalid; reset to defaults."),{state:s,hadInvalid:n}}const ij=[{id:"short",label:"Short",desc:"~20 lines"},{id:"medium",label:"Medium",desc:"~60 lines"},{id:"long",label:"Long",desc:"~150 lines"}],aj=[{id:"classic",label:"Classic",desc:"Single timed round"},{id:"championship",label:"Championship",desc:"Progress through board sizes"},{id:"ball-escalation",label:"Ball Escalation",desc:"+1 ball each win"},{id:"combo",label:"Combo",desc:"Championship + ball escalation"}],cj=[{id:"full-rect",label:"Full Rect",desc:"Rectangle around the entire file"},{id:"code-right",label:"Code Right",desc:"Right edge hugs last character"},{id:"inverse-code",label:"Inverse Code",desc:"Code text is walls — play in the whitespace"},{id:"sub-rect",label:"Sub Rect",desc:"Inner rectangle, outer code visible"},{id:"rectangles",label:"Rectangles",desc:"Two stacked play areas"}],uj=[{id:"passive",label:"Passive",desc:"Rarely leaves the border"},{id:"wanderer",label:"Wanderer",desc:"Roams, occasionally claims strips"},{id:"hunter",label:"Hunter",desc:"Targets your claimed territory"},{id:"cutter",label:"Cutter",desc:"Intercepts your draw lines"},{id:"unstoppable",label:"Unstoppable",desc:"Cuts lines AND hunts territory"}],dj=[{id:"slow",label:"Slow"},{id:"medium",label:"Medium"},{id:"fast",label:"Fast"},{id:"mixed",label:"Mixed"}],mj=[{label:"1 min",ms:6e4},{label:"2 min",ms:12e4},{label:"5 min",ms:3e5}];function fj({onClose:e}){const[{state:t,hadInvalid:n}]=f.useState(()=>Hs(X.LAST_QVIMX_CONFIG,it,oj)),[r,s]=f.useReducer(Pr,t),o=u=>s({type:"PATCH",payload:u}),{handleSave:i,handleTidy:a,showWarning:c}=Ws(X.LAST_QVIMX_CONFIG,r,e,n);return l.jsxs(Ks,{title:"QVIMX Defaults",onClose:e,onSave:i,showWarning:c,onTidy:a,children:[l.jsx(W,{label:"Language",icon:xr,defaultOpen:!0,children:l.jsx(qn,{value:r.lang,onChange:u=>o({lang:u})})}),l.jsx(W,{label:"Code Size",icon:gg,defaultOpen:!0,children:l.jsx("div",{className:"flex flex-col gap-2",children:ij.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({codeSize:u.id}),className:F.modeCard(r.codeSize===u.id),children:[l.jsx("span",{className:"font-bold",children:u.label}),l.jsx("span",{className:`text-xs font-normal ml-2 ${r.codeSize===u.id?"text-blue-200":"text-gray-500"}`,children:u.desc})]},u.id))})}),l.jsx(W,{label:"Sub Mode",icon:dd,defaultOpen:!0,children:l.jsx("div",{className:"flex flex-col gap-2",children:aj.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({subMode:u.id}),className:F.modeCard(r.subMode===u.id),children:[l.jsx("span",{className:"font-bold",children:u.label}),l.jsx("span",{className:`text-xs font-normal ml-2 block mt-0.5 ${r.subMode===u.id?"text-blue-200":"text-gray-500"}`,children:u.desc})]},u.id))})}),l.jsx(W,{label:"Board Shape",icon:fi,children:l.jsx("div",{className:"flex flex-col gap-2",children:cj.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({borderShape:u.id}),className:F.modeCard(r.borderShape===u.id),children:[l.jsx("span",{className:"font-bold",children:u.label}),l.jsx("span",{className:`text-xs font-normal ml-2 block mt-0.5 ${r.borderShape===u.id?"text-blue-200":"text-gray-500"}`,children:u.desc})]},u.id))})}),l.jsx(W,{label:"Timer",icon:yr,defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:mj.map(u=>l.jsx("button",{type:"button",onClick:()=>o({timerMs:u.ms}),className:F.pill(r.timerMs===u.ms),children:u.label},u.ms))})}),l.jsx(W,{label:"Lives",icon:hg,defaultOpen:!0,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:[1,3,5].map(u=>l.jsx("button",{type:"button",onClick:()=>o({lives:u}),className:F.pill(r.lives===u),children:Array.from({length:u},()=>"♥").join(" ")},u))})}),l.jsx(W,{label:"Bombs (Border Patrol)",icon:Fs,children:l.jsx("div",{className:"flex gap-2 flex-wrap",children:[0,1,2,3].map(u=>l.jsx("button",{type:"button",onClick:()=>o({bombCount:u}),className:F.pill(r.bombCount===u),children:u===0?"Off":`${u} bomb${u>1?"s":""}`},u))})}),l.jsx(W,{label:"Enemy AI",icon:Ps,children:l.jsx("div",{className:"flex flex-col gap-2",children:uj.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({enemyAI:u.id}),className:F.modeCard(r.enemyAI===u.id),children:[l.jsx("span",{className:"font-bold",children:u.label}),l.jsx("span",{className:`text-xs font-normal ml-2 block mt-0.5 ${r.enemyAI===u.id?"text-blue-200":"text-gray-500"}`,children:u.desc})]},u.id))})}),l.jsxs(W,{label:"Hazard Balls",icon:dg,children:[l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Count"}),l.jsx("div",{className:"flex gap-2 flex-wrap mb-4",children:[1,2,3,4,5].map(u=>l.jsx("button",{type:"button",onClick:()=>o({ballCount:u}),className:F.pill(r.ballCount===u),children:u},u))}),l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Speed"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:dj.map(u=>l.jsx("button",{type:"button",onClick:()=>o({ballSpeed:u.id}),className:F.pill(r.ballSpeed===u.id),children:u.label},u.id))})]}),l.jsx(vr,{enabled:r.challengeMode,onToggle:()=>o({challengeMode:!r.challengeMode}),children:l.jsx(Vn,{guidedMode:r.challengeGuidedMode,onGuidedMode:u=>o({challengeGuidedMode:u}),startingLevel:r.challengeStartingLevel,onStartingLevel:u=>o({challengeStartingLevel:u}),repetition:r.challengeRepetition,onRepetition:u=>o({challengeRepetition:u}),timeMultiplier:r.challengeTimeMultiplier,onTimeMultiplier:u=>o({challengeTimeMultiplier:u}),selectableCategories:mt,selectedCategories:r.challengeCategories,onToggleCategory:u=>o({challengeCategories:r.challengeCategories.includes(u)?r.challengeCategories.length>1?r.challengeCategories.filter(d=>d!==u):r.challengeCategories:[...r.challengeCategories,u]}),drillMode:r.challengeDrillMode,onDrillMode:u=>o({challengeDrillMode:u})})})]})}const Fe={boardSource:"grid",gridPreset:"medium",customRows:60,customCols:40,codeFileSize:"medium",difficulty:"easy",enableTeleport:!0,enableSafeTeleport:!0,maxTeleports:3,maxSafeTeleports:3,animatedEffects:!0,enableHelperGrid:!1,startingEnemyLevel:1,timerBonus:!0,...Pg,hjklOnly:!1,noHjkl:!1,opacityFade:!1,snowEffect:!1},pj=["tiny","small","medium","large","xlarge","custom"],hj=["beginner","easy","medium","hard","expert"];function gj(e){if(!e||typeof e!="object")return{state:Fe,hadInvalid:!1};const t=e;let n=!1;const r=()=>{n=!0},s={boardSource:t.boardSource??Fe.boardSource,gridPreset:xe(t.gridPreset,pj,Fe.gridPreset,r),customRows:Lt(t.customRows,5,300,Fe.customRows,r),customCols:Lt(t.customCols,5,300,Fe.customCols,r),codeFileSize:t.codeFileSize??Fe.codeFileSize,difficulty:xe(t.difficulty,hj,Fe.difficulty,r),enableTeleport:Ce(t.enableTeleport,Fe.enableTeleport,r),enableSafeTeleport:Ce(t.enableSafeTeleport,Fe.enableSafeTeleport,r),maxTeleports:Lt(t.maxTeleports,0,20,Fe.maxTeleports,r),maxSafeTeleports:Lt(t.maxSafeTeleports,0,20,Fe.maxSafeTeleports,r),animatedEffects:Ce(t.animatedEffects,Fe.animatedEffects,r),enableHelperGrid:Ce(t.enableHelperGrid,Fe.enableHelperGrid,r),startingEnemyLevel:Lt(t.startingEnemyLevel,1,9,Fe.startingEnemyLevel,r),challengeMode:Ce(t.challengeMode,Fe.challengeMode,r),challengeGuidedMode:xe(t.challengeGuidedMode,Ml,Fe.challengeGuidedMode,r),challengeStartingLevel:Lt(t.challengeStartingLevel,0,9,Fe.challengeStartingLevel,r),challengeRepetition:xe(t.challengeRepetition,Bs,Fe.challengeRepetition,r),challengeTimeMultiplier:Lt(t.challengeTimeMultiplier,.5,5,Fe.challengeTimeMultiplier,r),challengeCategories:xd(t.challengeCategories,mt,Fe.challengeCategories,r),challengeDrillMode:Ce(t.challengeDrillMode??!1,Fe.challengeDrillMode,r),hjklOnly:Ce(t.hjklOnly??!1,Fe.hjklOnly,r),noHjkl:Ce(t.noHjkl??!1,Fe.noHjkl,r),opacityFade:Ce(t.opacityFade??!1,Fe.opacityFade,r),snowEffect:Ce(t.snowEffect??!1,Fe.snowEffect,r),timerBonus:Ce(t.timerBonus??!0,Fe.timerBonus,r)};return n&&console.warn("[GameDefaultsModal] Some saved VimBots config fields were invalid; reset to defaults."),{state:s,hadInvalid:n}}const xj=[{id:"tiny",label:"Tiny",desc:"20 × 60"},{id:"small",label:"Small",desc:"40 × 100"},{id:"medium",label:"Medium",desc:"60 × 140"},{id:"large",label:"Large",desc:"100 × 200"},{id:"xlarge",label:"XLarge",desc:"150 × 280"}],yj=[{id:"beginner",label:"Beginner",desc:"~2% robots"},{id:"easy",label:"Easy",desc:"Few robots"},{id:"medium",label:"Medium",desc:"Moderate density"},{id:"hard",label:"Hard",desc:"Many robots"},{id:"expert",label:"Expert",desc:"Maximum density"}],wf=[0,1,2,3,5,10];function vj({onClose:e}){const[{state:t,hadInvalid:n}]=f.useState(()=>Hs(X.LAST_VIMBOTS_CONFIG,Fe,gj)),[r,s]=f.useReducer(Pr,t),o=u=>s({type:"PATCH",payload:u}),{handleSave:i,handleTidy:a,showWarning:c}=Ws(X.LAST_VIMBOTS_CONFIG,r,e,n);return l.jsxs(Ks,{title:"VimBots Defaults",onClose:e,onSave:i,showWarning:c,onTidy:a,children:[l.jsx(W,{label:"Grid Size",icon:dd,defaultOpen:!0,children:l.jsx("div",{className:"flex flex-col gap-2",children:xj.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({gridPreset:u.id}),className:F.modeCard(r.gridPreset===u.id),children:[l.jsx("span",{className:"font-bold",children:u.label}),l.jsx("span",{className:`text-xs font-normal ml-2 ${r.gridPreset===u.id?"text-blue-200":"text-gray-500"}`,children:u.desc})]},u.id))})}),l.jsx(W,{label:"Difficulty",icon:$s,defaultOpen:!0,children:l.jsx("div",{className:"flex flex-col gap-2",children:yj.map(u=>l.jsxs("button",{type:"button",onClick:()=>o({difficulty:u.id}),className:F.modeCard(r.difficulty===u.id),children:[l.jsx("span",{className:"font-bold",children:u.label}),l.jsx("span",{className:`text-xs font-normal ml-2 ${r.difficulty===u.id?"text-blue-200":"text-gray-500"}`,children:u.desc})]},u.id))})}),l.jsxs(W,{label:"Teleport",icon:fi,defaultOpen:!0,children:[l.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[l.jsx("button",{type:"button",role:"switch","aria-checked":r.enableTeleport,onClick:()=>o({enableTeleport:!r.enableTeleport}),className:`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${r.enableTeleport?"bg-blue-600":"bg-gray-700"}`,children:l.jsx("span",{className:`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${r.enableTeleport?"translate-x-4":"translate-x-0.5"}`})}),l.jsx("span",{className:"text-xs text-gray-400",children:r.enableTeleport?"Enabled":"Disabled"})]}),r.enableTeleport&&l.jsxs(l.Fragment,{children:[l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Max Teleports"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:wf.map(u=>l.jsx("button",{type:"button",onClick:()=>o({maxTeleports:u}),className:F.pill(r.maxTeleports===u),children:u},u))})]})]}),l.jsxs(W,{label:"Safe Teleport",icon:Fs,defaultOpen:!0,children:[l.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[l.jsx("button",{type:"button",role:"switch","aria-checked":r.enableSafeTeleport,onClick:()=>o({enableSafeTeleport:!r.enableSafeTeleport}),className:`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${r.enableSafeTeleport?"bg-blue-600":"bg-gray-700"}`,children:l.jsx("span",{className:`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${r.enableSafeTeleport?"translate-x-4":"translate-x-0.5"}`})}),l.jsx("span",{className:"text-xs text-gray-400",children:r.enableSafeTeleport?"Enabled":"Disabled"})]}),r.enableSafeTeleport&&l.jsxs(l.Fragment,{children:[l.jsx("p",{className:"text-xs text-gray-500 mb-2 uppercase tracking-wider",children:"Max Safe Teleports"}),l.jsx("div",{className:"flex gap-2 flex-wrap",children:wf.map(u=>l.jsx("button",{type:"button",onClick:()=>o({maxSafeTeleports:u}),className:F.pill(r.maxSafeTeleports===u),children:u},u))})]})]})]})}function Ks({title:e,onClose:t,onSave:n,showWarning:r,onTidy:s,children:o}){return l.jsx("div",{className:"fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4",onClick:t,children:l.jsxs("div",{className:"w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]",onClick:i=>i.stopPropagation(),children:[l.jsxs("div",{className:"flex-shrink-0 flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-700",children:[l.jsx("h2",{className:"text-base font-bold text-white font-mono",children:e}),l.jsx("button",{type:"button",onClick:t,className:"text-gray-500 hover:text-gray-300 transition-colors","aria-label":"Close",children:l.jsx(hi,{className:"w-5 h-5"})})]}),r&&l.jsxs("div",{className:"flex-shrink-0 mx-5 mt-4 p-3 bg-yellow-900/40 border border-yellow-700 rounded-lg",children:[l.jsx("p",{className:"text-yellow-300 text-xs font-mono leading-relaxed",children:"Some saved options were invalid and were reset to defaults."}),l.jsx("button",{type:"button",onClick:s,className:"mt-2 px-3 py-1 text-xs font-mono bg-yellow-700 hover:bg-yellow-600 text-white rounded transition-colors",children:"Tidy"})]}),l.jsx("div",{className:"overflow-y-auto flex-1 bg-gray-800/40 border-y border-gray-700 divide-y divide-gray-800 mx-0 px-5 my-4",children:o}),l.jsxs("div",{className:"flex-shrink-0 flex gap-3 px-5 pb-5",children:[l.jsx("button",{type:"button",onClick:t,className:"flex-1 py-2.5 text-sm font-mono bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-500 transition-colors",children:"Cancel"}),l.jsx("button",{type:"button",onClick:n,className:"flex-1 py-2.5 text-sm font-mono font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors",children:"Save as default"})]})]})})}function bj({mode:e,onClose:t}){return e==="arcade"?l.jsx(R2,{onClose:t}):e==="goal"?l.jsx(P2,{onClose:t}):e==="motion"?l.jsx(Y2,{onClose:t}):e==="qvimx"?l.jsx(fj,{onClose:t}):e==="vimbots"?l.jsx(vj,{onClose:t}):null}const wj=[{key:"arcade",label:"Arcade",storageKey:X.LAST_CONFIG},{key:"goal",label:"Goal Mode",storageKey:X.LAST_GOAL_CONFIG},{key:"motion",label:"Motion Race",storageKey:X.LAST_MOTION_CONFIG},{key:"qvimx",label:"QVIMX",storageKey:X.LAST_QVIMX_CONFIG},{key:"vimbots",label:"VimBots",storageKey:X.LAST_VIMBOTS_CONFIG}];function Kt({active:e,onClick:t,children:n}){return l.jsx("button",{type:"button",onClick:t,className:`px-3 py-1.5 rounded border text-xs font-mono transition-colors ${e?"bg-blue-700 border-blue-500 text-white font-bold":"bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"}`,children:n})}function Nj(){const[e,t]=f.useState(wg);function n(r){const s={...e,...r};t(s),Bw(s)}return l.jsxs("div",{className:"mb-6",children:[l.jsx("label",{className:"block text-xs uppercase tracking-wider text-gray-400 mb-2",children:"Editor Settings"}),l.jsx("p",{className:"text-xs text-gray-500 mb-4",children:"Applied to all Monaco editors. Reload the page after changing font size or whitespace rendering."}),l.jsxs("div",{className:"space-y-4",children:[l.jsxs("div",{children:[l.jsx("p",{className:"text-xs text-gray-400 mb-1.5",children:"Word Wrap"}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx(Kt,{active:e.wordWrap==="on",onClick:()=>n({wordWrap:"on"}),children:"On"}),l.jsx(Kt,{active:e.wordWrap==="off",onClick:()=>n({wordWrap:"off"}),children:"Off"})]})]}),l.jsxs("div",{children:[l.jsxs("p",{className:"text-xs text-gray-400 mb-1.5",children:["Font Size: ",l.jsxs("span",{className:"text-yellow-400",children:[e.fontSize,"px"]})]}),l.jsx("input",{type:"range",min:10,max:24,step:1,value:e.fontSize,onChange:r=>n({fontSize:Number(r.target.value)}),className:"w-full accent-blue-500"}),l.jsxs("div",{className:"flex justify-between text-gray-600 text-xs mt-1",children:[l.jsx("span",{children:"10"}),l.jsx("span",{children:"24"})]})]}),l.jsxs("div",{children:[l.jsx("p",{className:"text-xs text-gray-400 mb-1.5",children:"Line Numbers"}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx(Kt,{active:e.lineNumbers==="on",onClick:()=>n({lineNumbers:"on"}),children:"Absolute"}),l.jsx(Kt,{active:e.lineNumbers==="relative",onClick:()=>n({lineNumbers:"relative"}),children:"Relative"}),l.jsx(Kt,{active:e.lineNumbers==="off",onClick:()=>n({lineNumbers:"off"}),children:"Off"})]})]}),l.jsxs("div",{children:[l.jsx("p",{className:"text-xs text-gray-400 mb-1.5",children:"Render Whitespace"}),l.jsxs("div",{className:"flex gap-2 flex-wrap",children:[l.jsx(Kt,{active:e.renderWhitespace==="none",onClick:()=>n({renderWhitespace:"none"}),children:"None"}),l.jsx(Kt,{active:e.renderWhitespace==="boundary",onClick:()=>n({renderWhitespace:"boundary"}),children:"Boundary"}),l.jsx(Kt,{active:e.renderWhitespace==="all",onClick:()=>n({renderWhitespace:"all"}),children:"All"})]})]}),l.jsxs("div",{children:[l.jsx("p",{className:"text-xs text-gray-400 mb-1.5",children:"Minimap"}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx(Kt,{active:e.minimap,onClick:()=>n({minimap:!0}),children:"On"}),l.jsx(Kt,{active:!e.minimap,onClick:()=>n({minimap:!1}),children:"Off"})]})]}),l.jsxs("div",{children:[l.jsx("p",{className:"text-xs text-gray-400 mb-1.5",children:"Mouse click moves cursor"}),l.jsx("p",{className:"text-xs text-gray-600 mb-2",children:"When off, left-click no longer repositions the cursor — only keyboard motions do. Right-click context menu is unaffected."}),l.jsxs("div",{className:"flex gap-2",children:[l.jsx(Kt,{active:!e.disableMouse,onClick:()=>n({disableMouse:!1}),children:"Enabled"}),l.jsx(Kt,{active:e.disableMouse,onClick:()=>n({disableMouse:!0}),children:"Disabled"})]})]})]})]})}function kj(){const[e,t]=f.useState(Ui),[n,r]=f.useState(!1),[s,o]=f.useState(""),[i,a]=f.useState(null),[c,u]=f.useState(null),d=/^[a-zA-Z0-9]{2,20}$/.test(e);function p(g){t(g),r(!1),g.length>0&&!/^[a-zA-Z0-9]*$/.test(g)?o("Only letters and numbers allowed"):g.length>20?o("Max 20 characters"):g.length>0&&g.length<2?o("At least 2 characters"):o("")}function m(){d&&(Db(e),r(!0))}function h(g,v){if(c===g){try{localStorage.removeItem(v)}catch{}u(null)}else u(g)}return l.jsxs("div",{className:"min-h-screen bg-gray-900 font-mono flex flex-col items-center justify-start py-12 px-6",children:[l.jsxs("div",{className:"w-full max-w-sm",children:[l.jsx("h1",{className:"text-2xl font-bold text-white mb-1",children:"Preferences"}),l.jsx("p",{className:"text-gray-500 text-sm mb-8",children:"Settings are stored locally in your browser."}),l.jsxs("div",{className:"mb-6",children:[l.jsx("label",{className:"block text-xs uppercase tracking-wider text-gray-400 mb-2",children:"Username"}),l.jsx("p",{className:"text-xs text-gray-500 mb-3",children:"Shown next to your scores on the High Scores page. Letters and numbers only, 2–20 chars."}),l.jsx("input",{type:"text",value:e,onChange:g=>p(g.target.value),maxLength:20,placeholder:"vim-user",className:`w-full px-3 py-2.5 rounded border text-sm text-white bg-gray-800 focus:outline-none transition-colors ${s?"border-red-600 focus:border-red-500":d?"border-green-700 focus:border-green-500":"border-gray-700 focus:border-blue-500"}`}),s&&l.jsx("p",{className:"text-xs text-red-400 mt-1",children:s}),!s&&e.length>0&&l.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Preview: ",l.jsx("span",{className:"text-blue-300",children:e})]})]}),l.jsx("button",{onClick:m,disabled:!d,className:`w-full py-2.5 rounded border text-sm font-bold transition-colors ${n?"bg-green-800 border-green-600 text-green-200":d?"bg-blue-700 border-blue-500 text-white hover:bg-blue-600":"bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"}`,children:n?"✓ Saved":"Save"}),l.jsx("hr",{className:"border-gray-700 my-8"}),l.jsx(Nj,{}),l.jsx("hr",{className:"border-gray-700 my-8"}),l.jsxs("div",{className:"mb-6",children:[l.jsx("label",{className:"block text-xs uppercase tracking-wider text-gray-400 mb-2",children:"Game Mode Defaults"}),l.jsx("p",{className:"text-xs text-gray-500 mb-4",children:"Pre-fill each mode's setup screen with your preferred starting options. Saved configurations are loaded automatically the next time you open a mode."}),l.jsxs("div",{className:"space-y-2",children:[wj.map(({key:g,label:v,storageKey:w})=>l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("button",{type:"button",onClick:()=>{u(null),a(g)},className:"flex-1 px-3 py-2 rounded border text-sm font-mono bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white text-left transition-colors",children:v}),l.jsx("button",{type:"button",onClick:()=>h(g,w),title:c===g?"Click again to confirm reset":"Reset to original defaults",className:`px-3 py-2 rounded border text-xs font-mono transition-colors whitespace-nowrap ${c===g?"bg-red-900/40 border-red-700 text-red-300 hover:bg-red-900/60":"bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400"}`,children:c===g?"Confirm reset":"Reset"})]},g)),l.jsxs("div",{className:"flex items-center gap-2",children:[l.jsx("div",{className:"flex-1 px-3 py-2 rounded border text-sm font-mono bg-gray-800/40 border-gray-700/50 text-gray-600",children:"VimGolf"}),l.jsx("span",{className:"text-xs font-mono text-gray-600 px-2",children:"No configurable defaults"})]})]}),c&&l.jsx("p",{className:"text-xs text-yellow-500 mt-2",children:'Click "Confirm reset" to clear the saved defaults for that mode. This cannot be undone.'})]}),l.jsx("hr",{className:"border-gray-700 my-8"})]}),i&&l.jsx(bj,{mode:i,onClose:()=>a(null)})]})}const Xa=[{id:"arcade",label:"🎮 Arcade Mode"},{id:"motion-race",label:"🏃 Motion Race"},{id:"goal",label:"🎯 Goal Mode"},{id:"vimgolf",label:"⛳ VimGolf"},{id:"high-scores",label:"🏆 High Scores"},{id:"preferences",label:"⚙ Preferences"},{id:"shortcuts",label:"⌨ Shortcuts"},{id:"dev",label:"🔬 Dev Mode"}];function Sj(){const[e,t]=f.useState(Xa[0].id),n=f.useRef(null);f.useEffect(()=>{const s=n.current;if(!s)return;const o=Xa.map(a=>document.getElementById(a.id)).filter(Boolean),i=new IntersectionObserver(a=>{for(const c of a)if(c.isIntersecting){t(c.target.id);break}},{root:s,threshold:.4});return o.forEach(a=>i.observe(a)),()=>i.disconnect()},[]);function r(s){var o;(o=document.getElementById(s))==null||o.scrollIntoView({behavior:"smooth",block:"start"})}return l.jsxs("div",{className:"h-full bg-gray-900 font-mono flex overflow-hidden",children:[l.jsxs("nav",{className:"hidden md:flex flex-col w-48 flex-shrink-0 border-r border-gray-800 py-6 px-3 overflow-y-auto",children:[l.jsx("p",{className:"text-gray-600 text-xs uppercase tracking-wider mb-3 px-1",children:"Contents"}),Xa.map(s=>l.jsx("button",{onClick:()=>r(s.id),className:`text-left text-xs px-2 py-1.5 rounded transition-colors mb-0.5 ${e===s.id?"text-white bg-gray-800 border-l-2 border-blue-400 pl-1.5":"text-gray-500 hover:text-gray-300"}`,children:s.label},s.id))]}),l.jsx("div",{ref:n,className:"flex-1 overflow-y-auto",children:l.jsxs("div",{className:"max-w-2xl mx-auto py-8 px-6 space-y-10 text-sm text-gray-300",children:[l.jsxs("div",{children:[l.jsx("h1",{className:"text-2xl font-bold text-white mb-1",children:"VIM ARCADE — Feature Guide"}),l.jsxs("p",{className:"text-gray-500 text-xs",children:["A quick reference for everything the app can do. See"," ",l.jsx("code",{className:"text-blue-300",children:"README.md"})," in the repo for developer notes."]})]}),l.jsxs(Qn,{id:"arcade",title:"🎮 Arcade Mode",route:"/arcade",children:[l.jsx("p",{children:"Practice vim commands under time pressure. Commands appear as challenges; complete them to score points and advance your level ceiling."}),l.jsxs("ul",{children:[l.jsxs("li",{children:[l.jsx("b",{children:"Modes"})," — General (endless), Timed Challenge (fixed session), Survival (one miss ends it)."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Guided modes"})," — None, First-only, After-failure, First+failure, Alternating, Always. Accessible via ",l.jsx("kbd",{children:"F1"})," palette →"," ",l.jsx("code",{children:"Vim Arcade: Guided Mode: …"})]}),l.jsxs("li",{children:[l.jsx("b",{children:"Challenge time pace"})," — multiply base time limits (1× – 3×) for a slower, more deliberate pace."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Dynamic assist"})," — auto-reveal solutions after X% of the time limit."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Category + Knowledge filters"})," — practice only what you want."]})]})]}),l.jsxs(Qn,{id:"motion-race",title:"🏃 Motion Race",route:"/motion-race",children:[l.jsx("p",{children:"Navigate to highlighted positions using only vim motions. No editing allowed."}),l.jsxs("ul",{children:[l.jsxs("li",{children:[l.jsx("b",{children:"End conditions"})," — Timed, Count (your goals), Count (all incl. enemies), Survival."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Distance modes"})," — Short (≤8 lines), Medium, Long (26+), Mixed."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Goal display"})," — One at a time, or All-at-once (collect any order)."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Snake trail"})," — blue fading trail; length = current score (classic snake mechanic)."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Enemies"})," — AI cursors racing toward goals. 0/1/3/5/10 enemies, configurable speed and per-enemy SCSS HSL color palettes. Optional blocking trails."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Fog of war"})," — hides enemies in editor; they remain visible on the minimap."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Minimap sidebar"})," — goal diamonds (yellow) + color-coded enemy dots."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Handicaps"})," — Snow, Opacity fade, Confetti on goal, Penalty flash, hjkl-only, No-hjkl."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Challenge mode"})," — optional motion/search command challenges in a bar below the target."]})]})]}),l.jsxs(Qn,{id:"goal",title:"🎯 Goal Mode",route:"/goal",children:[l.jsx("p",{children:"Transform text from a start state to a target state. Think real-world editing tasks."}),l.jsxs("ul",{children:[l.jsxs("li",{children:[l.jsx("b",{children:"Text goals"})," — count, difficulty, time limit per challenge."]}),l.jsxs("li",{children:[l.jsx("b",{children:"Command challenges"})," — optional concurrent vim-command challenges. Toggle in setup (collapsible)."]}),l.jsx("li",{children:"1,000+ challenges from the bundled org-file submodule, shuffled each session."}),l.jsx("li",{children:"Difficulty auto-assigned by edit-distance percentile."})]})]}),l.jsxs(Qn,{id:"vimgolf",title:"⛳ VimGolf",route:"/vimgolf",children:[l.jsx("p",{children:"Transform text using the fewest keystrokes possible."}),l.jsxs("ul",{children:[l.jsxs("li",{children:["1,000+ challenges parsed at runtime from the bundled"," ",l.jsx("code",{children:"vim-golf-challenges/README.org"})," submodule via a Web Worker."]}),l.jsx("li",{children:"Difficulty auto-assigned by edit distance (percentile-based)."}),l.jsx("li",{children:"Inline search + Easy / Medium / Hard filter."}),l.jsx("li",{children:"Personal bests tracked. Add custom challenges via JSON paste."})]})]}),l.jsx(Qn,{id:"high-scores",title:"🏆 High Scores",route:"/high-scores",children:l.jsxs("ul",{children:[l.jsx("li",{children:"Tabbed by mode (General, Timed, Survival), always 10 rows."}),l.jsxs("li",{children:[l.jsx("b",{children:"vim-bot"})," seed entries give you targets to beat; your scores displace them when you rank higher."]}),l.jsx("li",{children:"Your display name (set in Preferences) appears in the Player column."})]})}),l.jsx(Qn,{id:"preferences",title:"⚙ Preferences",route:"/preferences",children:l.jsxs("ul",{children:[l.jsxs("li",{children:["Set a ",l.jsx("b",{children:"username"})," (alphanumeric, 2–20 chars) shown on the High Scores table."]}),l.jsxs("li",{children:["All settings stored locally in your browser under ",l.jsx("code",{children:"vimarcade_*"})," keys."]})]})}),l.jsx(Qn,{id:"shortcuts",title:"⌨ Keyboard Shortcuts",children:l.jsx("table",{className:"w-full text-xs border-collapse",children:l.jsx("tbody",{children:[["F1","Monaco command palette — search all in-game settings"],["?","In-game shortcuts overlay (Arcade mode)"],["Esc","Close overlays / return to normal mode"]].map(([s,o])=>l.jsxs("tr",{className:"border-b border-gray-800",children:[l.jsx("td",{className:"py-1.5 pr-4 w-24",children:l.jsx("kbd",{className:"px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded text-gray-200",children:s})}),l.jsx("td",{className:"py-1.5 text-gray-400",children:o})]},s))})})}),l.jsxs(Qn,{id:"dev",title:"🔬 Dev Mode",route:"/help",children:[l.jsx("p",{children:"Test and debug command detection. Not needed for normal play."}),l.jsxs("ul",{children:[l.jsx("li",{children:"Live keystroke log with solution matching and mode tracking."}),l.jsx("li",{children:"Mark commands as unsupported; export the list (ID / +Command / +Description format)."}),l.jsx("li",{children:"Drill mode — cycle through filtered commands automatically."}),l.jsx("li",{children:"Known / Unknown filter and inline search by description, command, or ID."})]})]})]})})]})}function Qn({id:e,title:t,route:n,children:r}){return l.jsxs("section",{id:e,className:"scroll-mt-4",children:[l.jsxs("h2",{className:"text-base font-bold text-white mb-2 flex items-center gap-2",children:[t,n&&l.jsx("span",{className:"text-xs text-gray-600 font-normal",children:n})]}),l.jsx("div",{className:"space-y-1.5 text-gray-400 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_b]:text-gray-200 [&_kbd]:text-xs [&_kbd]:px-1 [&_kbd]:py-0.5 [&_kbd]:bg-gray-800 [&_kbd]:border [&_kbd]:border-gray-600 [&_kbd]:rounded [&_code]:text-blue-300",children:r})]})}function jj({onBack:e}){const[t,n]=f.useState(null);return t?l.jsx(x2,{config:t,onBack:()=>{n(null),e()}}):l.jsx(N2,{onStart:n,onBack:e})}function Cj(){var u;const e=Is(),t=Ft(),{challengeId:n}=vv(),r=Vi(X.LAST_VIMGOLF_HANDICAPS)??na,s=((u=t.state)==null?void 0:u.challengeList)||[],o=s.indexOf(n||""),i=o>=0&&o<s.length-1?s[o+1]:null,a=o>0?s[o-1]:null,c=os.find(d=>d.id===n)??Dg().find(d=>d.id===n);return c?l.jsx(ak,{challenge:c,handicaps:r,onNext:i?()=>e(`/vimgolf/${i}`,{state:t.state}):void 0,onPrev:a?()=>e(`/vimgolf/${a}`,{state:t.state}):void 0,onQuit:()=>e("/vimgolf")},c.id):l.jsx(Nr,{to:"/vimgolf",replace:!0})}function Ej({onBack:e}){const[t,n]=f.useState(null);return t?l.jsx(Tj,{config:t,onQuit:()=>{n(null),e()}}):l.jsx(hk,{onStart:n,onBack:e})}function Tj({config:e,onQuit:t}){const{state:n,currentChallenge:r,editorRef:s,statusRef:o,targetEditorRef:i,startGame:a,checkSolution:c,resetGame:u}=kk();return f.useEffect(()=>{a(e)},[]),l.jsx(xk,{state:n,currentChallenge:r,editorRef:s,statusRef:o,targetEditorRef:i,onCheck:c,onSkip:()=>{c()},onQuit:()=>{u(),t()},onMarkUnsupported:()=>{}})}function Mj(){const e=Is(),t=Ft(),{state:n,lastConfig:r,reviewItems:s,startGame:o,onCommandExecuted:i,resetGame:a,updateSettings:c,markChallengeUnsupported:u}=n1();return f.useEffect(()=>{n.status==="results"&&t.pathname==="/play"&&e("/results",{replace:!0})},[n.status,t.pathname,e]),l.jsxs("div",{className:"h-screen flex flex-col overflow-hidden",children:[l.jsx(S2,{}),l.jsx("div",{className:"flex-1 min-h-0 overflow-y-auto",children:l.jsxs(Ov,{children:[l.jsx(nt,{path:"/",element:l.jsx($k,{onSelectArcade:()=>e("/arcade"),onSelectVimGolf:()=>e("/vimgolf"),onSelectGoal:()=>e("/goal"),onSelectMotionRace:()=>e("/motion-race"),onSelectQvimx:()=>e("/qvimx"),onSelectVimTutor:()=>e("/vimtutor"),onSelectVimBots:()=>e("/vimbots")})}),l.jsx(nt,{path:"/arcade",element:l.jsx(Uw,{onStart:d=>{o(d),e("/play")},onHighScores:()=>e("/high-scores"),lastConfig:r})}),l.jsx(nt,{path:"/play",element:n.status==="setup"?l.jsx(Nr,{to:"/arcade",replace:!0}):l.jsx(_N,{state:n,onCommandExecuted:i,onUpdateSettings:c,onQuit:()=>{a(),e("/")},onMarkUnsupported:u})}),l.jsx(nt,{path:"/results",element:n.status!=="results"?l.jsx(Nr,{to:"/",replace:!0}):l.jsx(RN,{state:n,onRestart:()=>{a(),e("/arcade")},onHighScores:()=>e("/high-scores"),onReview:()=>e("/review"),reviewCount:s.length})}),l.jsx(nt,{path:"/review",element:s.length===0?l.jsx(Nr,{to:"/",replace:!0}):l.jsx(WN,{items:s,onDone:()=>{a(),e("/")}})}),l.jsx(nt,{path:"/high-scores",element:l.jsx(HN,{})}),l.jsx(nt,{path:"/vimgolf",element:l.jsx(nk,{onBack:()=>e("/"),onPlay:(d,p)=>e(`/vimgolf/${d.id}`,{state:{challengeList:p.map(m=>m.id)}})})}),l.jsx(nt,{path:"/vimgolf/:challengeId",element:l.jsx(Cj,{})}),l.jsx(nt,{path:"/goal",element:l.jsx(Ej,{onBack:()=>e("/")})}),l.jsx(nt,{path:"/motion-race",element:l.jsx(aS,{onBack:()=>e("/")})}),l.jsx(nt,{path:"/qvimx",element:l.jsx(_S,{onBack:()=>e("/")})}),l.jsx(nt,{path:"/vimbots",element:l.jsx(a2,{onBack:()=>e("/"),onViewHighScores:d=>e("/high-scores",{state:{tab:"vimbots",vimbotsTab:d}})})}),l.jsx(nt,{path:"/vimtutor",element:l.jsx(jj,{onBack:()=>e("/")})}),l.jsx(nt,{path:"/help",element:l.jsx(Mk,{onBack:()=>e("/")})}),l.jsx(nt,{path:"/help/readme",element:l.jsx(Sj,{})}),l.jsx(nt,{path:"/help/vimgolf",element:l.jsx(Dk,{})}),l.jsx(nt,{path:"/dev",element:l.jsx(Nr,{to:"/help",replace:!0})}),l.jsx(nt,{path:"/dev/readme",element:l.jsx(Nr,{to:"/help/readme",replace:!0})}),l.jsx(nt,{path:"/preferences",element:l.jsx(kj,{})}),l.jsx(nt,{path:"*",element:l.jsx(Nr,{to:"/",replace:!0})})]})})]})}class _j extends zl.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,n){console.error("[AppErrorBoundary] Uncaught render error:",t,n.componentStack)}render(){return this.state.error?l.jsxs("div",{style:{background:"#0d1117",color:"#f0f6fc",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"monospace",padding:"2rem",textAlign:"center"},children:[l.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"⚠"}),l.jsx("h1",{style:{fontSize:"1.5rem",marginBottom:"0.5rem"},children:"Something went wrong"}),l.jsx("p",{style:{color:"#ef4444",fontSize:"0.85rem",marginBottom:"1.5rem",maxWidth:"40rem"},children:this.state.error.message}),l.jsx("button",{onClick:()=>window.location.reload(),style:{background:"#22c55e",color:"#fff",padding:"0.5rem 1.5rem",borderRadius:"0.5rem",border:"none",cursor:"pointer",fontFamily:"monospace",fontSize:"0.9rem"},children:"Reload"})]}):this.props.children}}Ab();Kb().finally(()=>{Ja.createRoot(document.getElementById("root")).render(l.jsx(_j,{children:l.jsx(sb,{basename:"/learn-vim/arcade",children:l.jsx(Mj,{})})}))});
