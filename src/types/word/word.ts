export interface WordType {
    userWordId: number
    wordId: number
    wordText: string,
    nextReviewDate: Date,
    lastReviewed: Date,
    reviewCount: number,

}

export interface WordRequest {
    wordText: string,
}
