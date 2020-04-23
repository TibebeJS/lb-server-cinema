const path = require('path');

exports.importModel = async function (name, instance) {
    const module = await (require([__dirname, name ].join('/'))(instance));
    return module.model;
}
