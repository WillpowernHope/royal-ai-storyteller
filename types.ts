
export interface StoryInput {
  protagonist: string;
  setting: string;
  theme: string;
  tone: string;
}

export interface GeneratedStory {
  title: string;
  content: string;
  coverUrl: string;
}

export const SETTINGS = ["Enchanted Forest", "Cloud Kingdom", "Undersea Palace", "Mystic Library", "Starry Desert"];
export const THEMES = ["A Lost Treasure", "A Secret Magic", "A Royal Ball", "A Brave Quest", "A Midnight Mystery"];
export const TONES = ["Whimsical", "Epic", "Cozy", "Dramatic", "Legendary"];
