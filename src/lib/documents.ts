export interface PolicyDocument {
  id: string;
  title: string;
  version: string;
  lastUpdated: string;
  sections: {
    id: string;
    title: string;
  }[];
}

// This would ideally come from a CMS or document management system
export const policyDocuments: Record<string, PolicyDocument> = {
  "HR-POL-001": {
    id: "HR-POL-001",
    title: "Business Expenses Policy",
    version: "2024.1",
    lastUpdated: "2024-01-15",
    sections: [
      { id: "1", title: "General Principles" },
      { id: "2", title: "Travel Expenses" },
      { id: "3", title: "Accommodation" },
      { id: "4", title: "Subsistence" }
    ]
  },
  "HR-POL-002": {
    id: "HR-POL-002",
    title: "Travel and Accommodation Policy",
    version: "2024.1",
    lastUpdated: "2024-02-01",
    sections: [
      { id: "1", title: "Booking Procedures" },
      { id: "2", title: "Class of Travel" },
      { id: "3", title: "Accommodation Standards" }
    ]
  }
};

export function formatCitation(docId: string, sectionId: string): string {
  const doc = policyDocuments[docId];
  if (!doc) return `[Unknown Document §${sectionId}]`;
  
  const section = doc.sections.find(s => s.id === sectionId);
  return `[${doc.title} §${sectionId}${section ? `: ${section.title}` : ''}]`;
}