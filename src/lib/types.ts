export type Category =
  | "All Categories"
  | "Web Dev"
  | "Machine Learning"
  | "DevOps"
  | "Cybersecurity"
  | "Cloud Computing"
  | "Mobile Dev";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type SortOption = "stars" | "newest" | "title" | "difficulty";

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Exclude<Category, "All Categories">;
  difficulty: Difficulty;
  tags: string[];
  createdAt: string; // ISO 8601
  stars?: number;
  author?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}
