
interface NewsData{
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

interface ArticleInterface{
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


interface NewsInterface{
    title: string,
    description: string,
    content: string,
    source: string,
    date: string
}
export {NewsData, NewsInterface, ArticleInterface};