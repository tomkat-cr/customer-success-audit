// Define the types for the data we'll receive from the component
export interface UserInfo {
    name: string;
    email: string;
    company: string;
    role: string;
    customers: string;
    phone: string;
    industry: string;
    // The rest...
    // [key: string]: string;
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
