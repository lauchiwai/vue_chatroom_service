export interface WordType {
    userWordId: number
    wordId: number
    word: string
    nextReviewDate: string
    lastReviewed: string | null
    reviewCount: number
}

export interface WordRequest {
    wordText: string,
}
