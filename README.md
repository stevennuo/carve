# Recarve

minimal invasion for hybrid structure of nested array-object

[![Build Status](https://travis-ci.org/stevennuo/recarve.svg?branch=master)](https://travis-ci.org/stevennuo/recarve)

## Example
``` javascript
recarve({}, {
    "a.b.c": (c)=> {
        c.d = 1;
        return c
    }
});
// {a: {b: {c: {d: 1}}}}

recarve({a: {b: [{c: true, d: 1}, {c: false, d: 2}]}},{"a.b": (b)=> b.filter((i)=>i.c === true)});
// {a: {b: [{c: true, d: 1}]}}
```

## To begin
* install
``` bash
$ npm install recarve --save
```
* require & use
``` javascript
const recarve = require('recarve')
const obj = recarve([{a: [{b: 1}]}], {'a': (a)=>a.filter((i)=> i.b !== 1)})
```