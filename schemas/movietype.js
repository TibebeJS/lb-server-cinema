const schema = {
    $id: 'movietype',
    type: 'object',
    properties: {
        id: { type: 'integer' },
        description: { type: 'string' },
        name: { type: 'string' },
        title: { type: 'string' },
    }
};

module.exports = schema