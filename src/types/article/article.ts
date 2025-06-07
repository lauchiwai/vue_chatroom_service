export interface AiArticleRequest {
    prompt: string,
}

export interface articleRequest {
    articleTitle: string,
    articleContent: string,
}

export interface ArticleList {
    articleId: string;
    articleTitle: string;
}

export interface Article {
    articleId: string;
    articleTitle: string;
    articleContent: string;
}