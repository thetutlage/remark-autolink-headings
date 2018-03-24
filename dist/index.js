'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = attacher;

var _unistUtilVisit = require('unist-util-visit');

var _unistUtilVisit2 = _interopRequireDefault(_unistUtilVisit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var icon = 'icon';
var link = 'link';
var wrap = 'wrap';

var methodMap = {
    prepend: 'unshift',
    append: 'push'
};

var base = function base(node, callback) {
    var data = node.data;

    if (!data || !data.hProperties || !data.hProperties.id) {
        return;
    }

    return callback('#' + data.hProperties.id);
};

var contentDefaults = {
    type: 'element',
    tagName: 'span',
    properties: { className: [icon, icon + '-' + link] }
};

function attacher() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _behaviour$content$op = _extends({
        behaviour: 'prepend',
        content: contentDefaults
    }, opts),
        linkProperties = _behaviour$content$op.linkProperties,
        behaviour = _behaviour$content$op.behaviour,
        content = _behaviour$content$op.content;

    if (behaviour !== wrap && !linkProperties) {
        linkProperties = { 'aria-hidden': true };
    }

    function injectNode(node) {
        return base(node, function (url) {
            if (!Array.isArray(content)) {
                content = [content];
            }
            node.children[methodMap[behaviour]]({
                type: link,
                url: url,
                title: null,
                data: {
                    hProperties: linkProperties,
                    hChildren: content
                }
            });
        });
    }

    function wrapNode(node) {
        return base(node, function (url) {
            var children = node.children;


            node.children = [{
                type: link,
                url: url,
                title: null,
                children: children,
                data: {
                    hProperties: linkProperties
                }
            }];
        });
    }

    return function (ast) {
        return (0, _unistUtilVisit2.default)(ast, 'heading', behaviour === wrap ? wrapNode : injectNode);
    };
}
module.exports = exports['default'];
