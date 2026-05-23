export type EpisodeEntry = {
  Title: string
  BaseUrl: string
  ImagesUrl: string[]
  Index: number | string
}

export type Episode = {
  index: number | string
  title: string
  imageUrls: string[]
}
