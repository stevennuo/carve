const string2tree = require('string2tree');
const lrd = 'post';
const dlr = 'pre';

module.exports = function recarve(obj, desc, order) {
    if (!obj || !desc)return obj;
    order = order || 'post';
    const tree = string2tree(desc);
    trav(tree, obj, order === 'post');
    return obj;
};

//{a:1,b:1}, {}
//{a:1,b:1}, [{},{}]
//{a:{b:1,c:2}}, //{a:{b:2,c:2}}
//{a:{b:1,_v:2}}, //{a:[{b:2}]}
function trav(carv, target, LRD) {
    //console.log('carv:'+JSON.stringify(carv));
    //console.log('target:'+JSON.stringify(target));
    if (target instanceof Array) {
        // array
        for (item of target) {
            trav(carv, item, LRD);
        }
    } else {
        // object
        for (key in carv) {
            // init
            target[key] = target[key] || {};

            //const count = counter();

            // keep the scene
            const _v = carv[key]['_v'];
            const _k = key;
            if (_v) delete carv[_k]._v;

            //console.log("count " + count + "_v:"+_v + " key:" + _k);

            // traverse
            if (!LRD) exec(_k, _v, target); // DLR
            trav(carv[_k], target[_k], LRD);
            if (LRD) exec(_k, _v, target);  // LRD

            //console.log("count " + count + "_v:"+_v + " key:" + _k);
        }
    }
}

const exec = function (key, v, target) {
    if (!v) return;
    target[key] = typeof v === "function" ? v(target[key]) : v;
};

const counter = () => {
    global.counter = global.counter || 0;
    global.counter = global.counter + 1;
    return global.counter;
};