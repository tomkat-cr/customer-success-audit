// Define the types for the data we'll receive from the component
export interface UserInfo {
    name: string;
    company: string;
    [key: string]: string;
}

export interface Score {
    percentage: number;
    points: number;
    maxPoints: number;
}

export interface Recommendations {
    level: string;
    title: string;
    description: string;
    nextSteps: string[];
}

export interface Question {
    id: string;
    question: string;
    options: { text: string; points: number }[];
}

export interface Section {
    title: string;
    questions: Question[];
}

export interface Answers {
    [key: string]: number;
}
