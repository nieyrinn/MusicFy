export interface Artist {
  id: number;
  name: string;
  description: string;
  image_url?: string;
}

export interface Album {
  id: number;
  title: string;
  artist: Artist;
  release_date: string;
  image_url?: string;
}

export interface Song {
  id: number;
  title: string;
  album: Album;
  artist: Artist;
  duration: string;
  track_number?: number;
}

export interface Lyrics {
  id: number;
  song: Song;
  content: string;
}

export interface Annotation {
  id: number;
  lyrics_id: number;
  start_index: number;
  end_index: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
}

export interface ContentType {
  id: number;
  name: string; 
}

export interface Content {
  id: number;
  title: string;
  content: string;
  content_type: ContentType;
  author?: string;
  created_at: string;
  updated_at: string;
}
