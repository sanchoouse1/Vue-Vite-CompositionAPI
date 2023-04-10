export interface Task {
    id: string;
    text?: string;
    description?: string;
    completed?: boolean;
    deadline: Date;
}