export interface Product {
    name: string;
    price: number; // in site currency format as number (parsed)
    href?: string;
}