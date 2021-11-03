const axios = require('axios');

const getItemsQuery = async (query = '') => {

    const url = encodeURI(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`);
    const { data } = await axios.get(url);
    const items = data.results.map(item => {

        const { id, title, thumbnail:picture, condition, shipping, category_id } = item;
        const price = {
            currency: item.currency_id,
            amount: item.price,
            decimals: 0
        }
        const free_shipping = shipping.free_shipping;
        return { id, title, price, picture, condition, free_shipping, category_id }
    
    })

    const author = getAuthor()
    const categories = await getCategoriesSorted(items);

    return {
        author, categories, items
    };
}

const getItemById = async (id) => { 

    try {
        const item = await getItemInfo(id);
        const description = await getItemDescription(id);
        return {
            ...item,
            description
        };
        
    } catch (error) {
        return {
            status: 404,
            message: error.message
        }
    }
}

const getItemInfo = async (id) => { 

    try {
        
        const url = `${process.env.BASE_ML_API}/items/${id}`;
        const { data } = await axios.get(url);
        const { title, thumbnail:picture, condition, shipping, sold_quantity, category_id } = data;
        
        const price = {
            currency: data.currency_id,
            amount: data.price,
            decimals: 0
        }
    
        const free_shipping = shipping.free_shipping;
        const item = { id, title, price, picture, condition, free_shipping, sold_quantity, category_id }
        const author = getAuthor()
        const categories = await getCategoriesSorted([item]);
    
        return {
            author, categories, item
        };
    } catch (error) {
        return error;
    }
}

const getItemDescription = async (id) => { 
    const url = `${process.env.BASE_ML_API}/items/${id}/description`;
    const { data } = await axios.get(url);
    const { plain_text:description } = data;
    return description;
}

const getAuthor = () => {
    return {
        name: process.env.AUTHOR_NAME,
        lastname: process.env.AUTHOR_LASTNAME,
    };
}

const getCategoriesSorted = async (items) => {   

    const categories = items.map(item => item.category_id);

    const categoriesCount = categories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const categoriesSorted = Object.keys(categoriesCount).sort((a, b) => {
        return categoriesCount[b] - categoriesCount[a];
    });

    const categoriesInfo = await Promise.all(categoriesSorted.map(async category => {
        const url = `${process.env.BASE_ML_API}/categories/${category}`;
        const { data } = await axios.get(url);
        const { id, name, path_from_root } = data;
        return {
            id, name, path_from_root
        };
    }));

    return categoriesInfo;
}

module.exports = {
    getItemById,
    getItemsQuery
}

