# css-builder

Build CSS in Javascript!

## Example

    var builder = require('css-builder');

    var b = builder();

    b.rule('div.foo', function() {
        b.rule('a', function() {
            b.rule('&.red', {backgroundColor: 'red'});
            b.rule('&.blue', {backgroundColor: 'blue'});
        });
    });

    console.log(b.toString());

    // =>
    // div.foo a.red { background-color: red; }
    // div.foo a.blue { background-color: blue; }

## Options

  * `append`: function called to append CSS to buffer. If you override this, the builder's `toString()` function will always return an empty string.
  * `builder`: base builder object, to which `attrib`, `attribs`, `rule` and `commit` methods will be added. Defaults to empty object. Allows you to pass in your own object/prototype chain, possibly including macro functions for defining more complex rules.