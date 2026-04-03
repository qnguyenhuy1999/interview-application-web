export interface KnowledgeGap {
  id: string;
  noteId: string;
  topic: string;
  description: string;
  resolved: boolean;
  weaknessLevel: number;
  createdAt: Date;
}

export interface KnowledgeGapImprovement {
  gapTopic: string;
  whyImportant: string;
  correctExplanation: string;
  recommendedFocus: string;
}
