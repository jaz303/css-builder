var builder = require('../');

var b = builder();

b.rule('div.foo', function() {
    b.attrib('webkitBoxSizing', 'border-box');
    b.rule('a', function() {
        this.rule('&.red', {backgroundColor: 'red'});
        b.rule('&.blue', {backgroundColor: 'blue'});
    });
});

b.rule('a', {
    span: {
        backgroundColor: "red"
    },
    b: {
        fontSize: '22px'
    }
});

b.rules({
    'div.a': { color: 'green' },
    'div.b': { color: 'red' }
});

console.log(b.toString());