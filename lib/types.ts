// Minimal shapes for the WP REST API entities we consume.

export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPMedia {
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPEmbedded {
  "wp:featuredmedia"?: WPMedia[];
  "wp:term"?: WPTerm[][];
  author?: { name: string }[];
}

export interface WPBase {
  id: number;
  slug: string;
  status: string;
  link: string;
  date: string;
  modified: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  _embedded?: WPEmbedded;
}

export type WPPost = WPBase;
export type WPPage = WPBase;

// Normalized view model the layouts render from.
export interface ArticleView {
  id: number;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  date: string;
  category: string;
  featuredImage: string | null;
  featuredAlt: string;
}
