// StyleBlock.prototype.macro = function(name, fn) {
//     this._macros[name] = fn;
// }

// StyleBlock.prototype.expand = function(macro) {
//     var m = this._lookupMacro(macro);
//     var args = slice.call(arguments, 0);
//     args[0] = this;
//     m.apply(null, args);
// }

// StyleBlock.prototype._lookupMacro = function(macro) {
//     var m = this._macros[macro];
//     if (!m) throw new Error("unknown macro: " + macro);
//     return m;
// }

module.exports = function(options) {

    options = options || {};

    var buffer          = '',
        _append         = options.append || function(str) { buffer += str; },
        path            = [],
        currSelector    = null,
        lastSelector    = null,
        b               = options.builder || {},
        frozen          = false;

    function attrib(name, value) {
        frozen && throwFrozen();
        append(currSelector, translateKey(name) + ': ' + value);
        return this;
    }

    function attribs(as) {
        frozen && throwFrozen();
        for (var k in as) {
            b.attrib(k, as[k]);
        }
        return this;
    }

    function rule(selector, rs) {

        frozen && throwFrozen();

        if (Array.isArray(rs)) {
            rs.forEach(function(r) { b.rule(selector, r); });
            return;
        }

        var oldSelector = currSelector;
        path.push(selector);
        currSelector = path.join(' ').replace(/\s+\&/g, '');

        if (typeof rs === 'string') {
            append(currSelector, rs);
        } else if (typeof rs === 'function') {
            rs.call(b, b);
        } else if (typeof rs === 'object') {
            for (var cssKey in rs) {
                var cssValue = rs[cssKey];
                if (typeof cssValue === 'object') {
                    b.rule(cssKey, cssValue);
                } else {
                    b.attrib(cssKey, cssValue);
                }
            }
        } else {
            throw new TypeError("rule must be string, function or object");
        }

        path.pop();
        currSelector = oldSelector;

        return this;

    }

    function rules(rs) {
        for (var k in rs) {
            b.rule(k, rs[k]);
        }
    }

    function append(sel, css) {
        if (lastSelector === sel) {
            _append(' ' + css + ';');
        } else {
            if (lastSelector !== null) {
                _append(" }\n");
            }
            _append(sel + ' { ' + css + ';');
            lastSelector = sel;
        }
    }

    function commit() {
        if (!frozen) {
            if (lastSelector) {
                _append(" }\n");
            }
            frozen = true;
        }
    }

    function translateKey(k) {
        k = k.replace(/[A-Z]/g, function(m) {
            return '-' + m[0].toLowerCase();
        });

        if (k.match(/^(webkit|moz|ms|o|khtml)-/)) {
            k = '-' + k;
        }

        return k;
    }

    function throwFrozen() {
        throw new Error("can't modify CSS builder - is frozen");
    }

    b.attrib        = attrib;
    b.attribs       = attribs;
    b.rule          = rule;
    b.rules         = rules;
    b.commit        = commit;
    b.toString      = function() { commit(); return buffer; }

    return b;

}

