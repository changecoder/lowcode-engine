var A = Object.defineProperty;
var P = (n, e, t) => e in n ? A(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var d = (n, e, t) => (P(n, typeof e != "symbol" ? e + "" : e, t), t);
import { createVNode as W, h as T, render as F } from "vue";
var h = { exports: {} }, c = typeof Reflect == "object" ? Reflect : null, y = c && typeof c.apply == "function" ? c.apply : function(e, t, r) {
  return Function.prototype.apply.call(e, t, r);
}, p;
c && typeof c.ownKeys == "function" ? p = c.ownKeys : Object.getOwnPropertySymbols ? p = function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : p = function(e) {
  return Object.getOwnPropertyNames(e);
};
function I(n) {
  console && console.warn && console.warn(n);
}
var _ = Number.isNaN || function(e) {
  return e !== e;
};
function s() {
  s.init.call(this);
}
h.exports = s;
h.exports.once = H;
s.EventEmitter = s;
s.prototype._events = void 0;
s.prototype._eventsCount = 0;
s.prototype._maxListeners = void 0;
var L = 10;
function v(n) {
  if (typeof n != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof n);
}
Object.defineProperty(s, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return L;
  },
  set: function(n) {
    if (typeof n != "number" || n < 0 || _(n))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + n + ".");
    L = n;
  }
});
s.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
s.prototype.setMaxListeners = function(e) {
  if (typeof e != "number" || e < 0 || _(e))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
  return this._maxListeners = e, this;
};
function w(n) {
  return n._maxListeners === void 0 ? s.defaultMaxListeners : n._maxListeners;
}
s.prototype.getMaxListeners = function() {
  return w(this);
};
s.prototype.emit = function(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t.push(arguments[r]);
  var i = e === "error", f = this._events;
  if (f !== void 0)
    i = i && f.error === void 0;
  else if (!i)
    return !1;
  if (i) {
    var o;
    if (t.length > 0 && (o = t[0]), o instanceof Error)
      throw o;
    var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
    throw u.context = o, u;
  }
  var a = f[e];
  if (a === void 0)
    return !1;
  if (typeof a == "function")
    y(a, this, t);
  else
    for (var m = a.length, M = O(a, m), r = 0; r < m; ++r)
      y(M[r], this, t);
  return !0;
};
function x(n, e, t, r) {
  var i, f, o;
  if (v(t), f = n._events, f === void 0 ? (f = n._events = /* @__PURE__ */ Object.create(null), n._eventsCount = 0) : (f.newListener !== void 0 && (n.emit(
    "newListener",
    e,
    t.listener ? t.listener : t
  ), f = n._events), o = f[e]), o === void 0)
    o = f[e] = t, ++n._eventsCount;
  else if (typeof o == "function" ? o = f[e] = r ? [t, o] : [o, t] : r ? o.unshift(t) : o.push(t), i = w(n), i > 0 && o.length > i && !o.warned) {
    o.warned = !0;
    var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    u.name = "MaxListenersExceededWarning", u.emitter = n, u.type = e, u.count = o.length, I(u);
  }
  return n;
}
s.prototype.addListener = function(e, t) {
  return x(this, e, t, !1);
};
s.prototype.on = s.prototype.addListener;
s.prototype.prependListener = function(e, t) {
  return x(this, e, t, !0);
};
function K() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function E(n, e, t) {
  var r = { fired: !1, wrapFn: void 0, target: n, type: e, listener: t }, i = K.bind(r);
  return i.listener = t, r.wrapFn = i, i;
}
s.prototype.once = function(e, t) {
  return v(t), this.on(e, E(this, e, t)), this;
};
s.prototype.prependOnceListener = function(e, t) {
  return v(t), this.prependListener(e, E(this, e, t)), this;
};
s.prototype.removeListener = function(e, t) {
  var r, i, f, o, u;
  if (v(t), i = this._events, i === void 0)
    return this;
  if (r = i[e], r === void 0)
    return this;
  if (r === t || r.listener === t)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t));
  else if (typeof r != "function") {
    for (f = -1, o = r.length - 1; o >= 0; o--)
      if (r[o] === t || r[o].listener === t) {
        u = r[o].listener, f = o;
        break;
      }
    if (f < 0)
      return this;
    f === 0 ? r.shift() : U(r, f), r.length === 1 && (i[e] = r[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || t);
  }
  return this;
};
s.prototype.off = s.prototype.removeListener;
s.prototype.removeAllListeners = function(e) {
  var t, r, i;
  if (r = this._events, r === void 0)
    return this;
  if (r.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : r[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete r[e]), this;
  if (arguments.length === 0) {
    var f = Object.keys(r), o;
    for (i = 0; i < f.length; ++i)
      o = f[i], o !== "removeListener" && this.removeAllListeners(o);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (t = r[e], typeof t == "function")
    this.removeListener(e, t);
  else if (t !== void 0)
    for (i = t.length - 1; i >= 0; i--)
      this.removeListener(e, t[i]);
  return this;
};
function C(n, e, t) {
  var r = n._events;
  if (r === void 0)
    return [];
  var i = r[e];
  return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? $(i) : O(i, i.length);
}
s.prototype.listeners = function(e) {
  return C(this, e, !0);
};
s.prototype.rawListeners = function(e) {
  return C(this, e, !1);
};
s.listenerCount = function(n, e) {
  return typeof n.listenerCount == "function" ? n.listenerCount(e) : k.call(n, e);
};
s.prototype.listenerCount = k;
function k(n) {
  var e = this._events;
  if (e !== void 0) {
    var t = e[n];
    if (typeof t == "function")
      return 1;
    if (t !== void 0)
      return t.length;
  }
  return 0;
}
s.prototype.eventNames = function() {
  return this._eventsCount > 0 ? p(this._events) : [];
};
function O(n, e) {
  for (var t = new Array(e), r = 0; r < e; ++r)
    t[r] = n[r];
  return t;
}
function U(n, e) {
  for (; e + 1 < n.length; e++)
    n[e] = n[e + 1];
  n.pop();
}
function $(n) {
  for (var e = new Array(n.length), t = 0; t < e.length; ++t)
    e[t] = n[t].listener || n[t];
  return e;
}
function H(n, e) {
  return new Promise(function(t, r) {
    function i(o) {
      n.removeListener(e, f), r(o);
    }
    function f() {
      typeof n.removeListener == "function" && n.removeListener("error", i), t([].slice.call(arguments));
    }
    N(n, e, f, { once: !0 }), e !== "error" && V(n, i, { once: !0 });
  });
}
function V(n, e, t) {
  typeof n.on == "function" && N(n, "error", e, t);
}
function N(n, e, t, r) {
  if (typeof n.on == "function")
    r.once ? n.once(e, t) : n.on(e, t);
  else if (typeof n.addEventListener == "function")
    n.addEventListener(e, function i(f) {
      r.once && n.removeEventListener(e, i), t(f);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof n);
}
var q = h.exports;
class z extends q.EventEmitter {
}
const b = Symbol("skeleton"), B = Symbol("skeletonCabin");
class j {
  constructor(e) {
    d(this, "editor");
    this.editor = e;
  }
}
const g = (n) => {
  const {
    className: e
  } = n;
  return W("div", {
    class: `lc-workbench ${e || ""}`
  }, null);
};
class D {
  constructor(e) {
    this[b] = e, this[B] = {
      Workbench: g,
      Skeleton: j
    };
  }
  get Workbench() {
    const e = this[b];
    return (t) => T(g, { ...t, skeleton: e });
  }
}
class G {
  constructor(e, t) {
    d(this, "__skeletonCabin");
    d(this, "editor");
    this.editor = e, this.__skeletonCabin = new D(t);
  }
  get skeletonCabin() {
    return this.__skeletonCabin;
  }
}
const J = "1.0.0";
let l;
const R = new z(), S = new j(R), Q = new G(R, S), Z = async (n) => {
  n ? l = n : (l = document.createElement("div"), l.id = "engine", document.body.appendChild(l));
  const { Workbench: e } = Q.skeletonCabin;
  F(e({
    skeleton: S,
    className: "engine-main"
  }), l);
};
console.log(
  `%c ChangeCoderCodeEngine %c v${J} `,
  "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;",
  "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;"
);
export {
  Z as init,
  J as version
};
//# sourceMappingURL=index.esm.js.map
