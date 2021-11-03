const { request, response } = require('express');
const { getItemById, getItemsQuery } = require('../providers/ml-api-request');

const getItems = async (req = request, res = response) => { 
    const { q } = req.query;
    const items = await getItemsQuery(q);
    res.json(items);
}

const getItem = async (req, res = response) => { 
    const { id } = req.params;
    const item = await getItemById(id);
    res.json(item);
}

module.exports = {
    getItems,
    getItem
}