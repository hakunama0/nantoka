export interface App {
  id: string;
  name: string;
  description: string;
  icon?: string;
  tags: string[];
  links: {
    appStore?: string;
    github?: string;
    web?: string;
  };
  date: string;
  featured?: boolean;
}

export interface Note {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  tags?: string[];
}
