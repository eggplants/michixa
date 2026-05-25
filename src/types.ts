export type EpisodeEntry = {
  Title: string
  BaseUrl: string
  ImagesUrl: string[]
  Index: number | 'ri'
}

export type Episode = {
  index: number | 'ri'
  title: string
  imageUrls: string[]
}
