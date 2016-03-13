'use strict';


module.exports = [

    {
        message: 'Description',
        name: 'description',
        validate: function (str) {
            return !!str;
        }
    },

    {
        message: 'Author',
        name: 'author',
        validate: function (str) {
            return !!str;
        }
    },

    {
        message: 'Is it a static website or a Koa API ?',
        type: 'list',
        name: 'appKind',
        choices: [
            {
                name: 'A static website',
                value: 'static'
            },
            {
                name: 'A Koa API',
                value: 'api'
            }
        ]
    }

];
