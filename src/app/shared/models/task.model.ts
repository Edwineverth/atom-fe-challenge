export interface Task {
    id?: string;
    title: string;
    description: string;
    userId: string;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}
