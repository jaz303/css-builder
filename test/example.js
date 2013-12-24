var builder = require('../');

var b = builder();

b.rule('div.foo', function() {
    b.rule('a', function() {
        b.rule('&.red', {backgroundColor: 'red'});
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

console.log(b.toString());