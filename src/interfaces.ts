
interface NewsData{ //interface for the returned result of the API
    status: string,
    totalRequests: number,
    articles: {
        source: {
            id: string,
            name: string
        },
        author: string,
        title: string,
        description: string,
        url: string,
        urlToImage: string,
        publishedAt: string,
        content: string
    }[]
}

interface ArticleInterface{ //interface for 1 article
    source: {
        id: string,
        name: string
    },
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string
}


interface NewsInterface{ //interface for the chat that will be sent
    title: string,
    description: string,
    content: string,
    source: string,
    date: string
}

interface KanyeQuoteInterface{
    quote: string
}

interface CryptoPriceInterface{
    id: string,
    symbol:string,
    name: string,
    description : {
        en: string
    },
    image : {
        thumb: string
    } ,
    genesis_date : string,
    market_cap_rank: number,
    price:{
        current_price:{
            usd: number
        }
    },

}

export {NewsData, NewsInterface, ArticleInterface, KanyeQuoteInterface,CryptoPriceInterface};