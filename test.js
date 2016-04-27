const chai = require('chai');
const expect = chai.expect;
const chaiDeepMatch = require('chai-deep-match');
chai.use(chaiDeepMatch);

const recarve = require('./');

describe('', () => {

    it('normal', () => {
        expect(recarve({}, {
            "a.b.c": (c)=> {
                c.d = 1;
                return c
            }
        })).to.deep.match({a: {b: {c: {d: 1}}}});
        expect(recarve({a: {b: [{c: true, d: 1}, {c: false, d: 2}]}}, {
            "a.b": (b)=> b.filter((i)=>i.c === true)
        })).to.deep.match({a: {b: [{c: true, d: 1}]}});
    });

    it('param undefined', () => {
        expect(recarve(undefined, undefined)).to.be.an('undefined');
        expect(recarve({}, undefined)).to.deep.match({});
        expect(recarve(undefined, {'x': (x)=>1})).to.be.an('undefined');
    });

    it('array', () => {
        const test = recarve([{a: [{b: 1}]}], {'a': (a)=>a.filter((i)=> i.b !== 1)});
        expect(recarve([{a: [{b: 1}]}], {'a': (a)=>a.filter((i)=> i.b !== 1)})).to.deep.match([{a: []}]);
    });
    it('object', () => {
        expect(recarve({a: [{b: 1}]}, {'a': (a)=>a.filter((i)=> i.b !== 1)})).to.deep.match({});
    });

    it('same recarve will overwrite', () => {
        expect(recarve({
            a: [{
                b: [{c: 1, d: true}, {c: 2, d: false}, {c: 1, d: false}, {c: 2, d: true}]
            }]
        }, {
            'a.b': (b)=>b.filter((i)=>i.c === 1),
            'a.b': (b)=>b.map((i)=> {
                i.e = 1;
                return i;
            })
        })).to.deep.match({
            a: [{
                b: [{c: 1, d: true, e: 1}, {c: 2, d: false, e: 1}, {c: 1, d: false, e: 1}, {c: 2, d: true, e: 1}]
            }]
        });
    });

    it('parent-child', () => {
        expect(recarve({
            a: [{b: [{c: 1}, {c: 2}]}, {b: [{c: 1}, {c: 2}]}]
        }, {
            'a': (a)=>a.map((i)=> {
                i.e = 1;
                return i
            }),
            'a.b': (b)=>b.filter((i)=>i.c === 1)
        })).to.deep.match({
            a: [{b: [{c: 1}], e: 1}, {b: [{c: 1}], e: 1}]
        });
    });

    it('preorder', () => {
        // DLR
        expect(recarve({
            a: [{b: [{c: 1}, {c: 2}]},
                {b: [{c: 3}]}]
        }, {
            'a': (a)=>a.filter((i)=>i.b.length === 1),
            'a.b': (b)=>b.filter((i)=> i.c !== 2)
        })).to.deep.match({
            a: [{b: [{c: 3}]}]
        });
    });

    it('postorder', () => {
        expect(recarve({
            a: [{b: [{c: 1}, {c: 2}]},
                {b: [{c: 3}]}]
        }, {
            'a': (a)=>a.filter((i)=>i.b.length === 1),
            'a.b': (b)=>b.filter((i)=> i.c !== 2)
        }), 'LRD').to.deep.match({
            a: [{b: [{c: 1}]},
                {b: [{c: 3}]}]
        });
    });

});