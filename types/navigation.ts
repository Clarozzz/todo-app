export type RootStackParamList = {
  Home: undefined;
  Todo: { 
    id: number;
    title: string;
    completed: string;
    description: string;
    due_date: string;
    created_at: string;
   };
};