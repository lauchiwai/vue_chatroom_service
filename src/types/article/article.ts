export const DEFAULTCOLLECTION = "articles";

export interface AiArticleRequest {
    prompt: string,
}

export interface articleRequest {
    articleTitle: string,
    articleContent: string,
}

export interface vectorizeArticleRequest {
    articleId: number,
    collectionName: string,
}

export interface ArticleList {
    articleId: number;
    articleTitle: string;
}

export interface Article {
    articleId: number;
    articleTitle: string;
    articleContent: string;
}