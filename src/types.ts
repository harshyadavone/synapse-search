export interface WebSearchResult {
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  thumbnailUrl?: string;
  thumbnailWidth?: string;
  thumbnailHeight?: string;
  imageUrl?: string;
  datePublished?: string;
  author?: string;
  description?: string;
  site_name?: string;
  metadata?: WebsiteMetadata;
  hcard?: Hcard;
}

type WebsiteMetadata = {
  title: string;
  description: string | undefined;
  ogImage: string | undefined;
};

export type Hcard = {
  url_text?: string;
  bday?: string;
  fn?: string;
  nickname?: string;
  label?: string;
  url?: string;
  role?: string;
};

export interface ImageSearchResult {
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  mime: string;
  fileFormat: string;
  contextLink: string;
  imageHeight: number;
  imageWidth: number;
  byteSize: number;
  thumbnailLink: string;
  thumbnailHeight: number;
  thumbnailWidth: number;
  snippet?: string;
}

export interface SearchInformation {
  searchTime: number;
  formattedSearchTime: string;
  totalResults: string;
  formattedTotalResults: string;
}

export interface SearchData<T> {
  searchInformation: SearchInformation;
  items: T[];
}

export interface InfiniteSearchData<T> {
  pages: SearchData<T>[];
  pageParams: number[];
}

// Weather types
export interface City {
  name: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  location: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDeg: number;
  clouds: number;
  visibility: number;
  condition: string;
  description: string;
  icon: string;
  sunrise: string;
  sunset: string;
}


export interface WeatherData {
  currentWeather: CurrentWeather;
}
