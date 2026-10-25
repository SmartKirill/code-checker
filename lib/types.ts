export interface Language {
  id: number;
  name: string;
  iconPath: string;
  defaultTemplate: string;
}

export interface Task {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string }[];
}
