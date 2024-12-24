// Coffee API types

export interface Coffee {
    id: string;
    title: string;
    description: string;
    ingredients: string[];
    image: string;
    type: string;
    isTasted: boolean;
}

export interface CoffeeContextType {
    id: string;
    title: string;
    image: string;
}

export interface CoffeeProviderProps {
    children: React.ReactNode;
}