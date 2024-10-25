export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface NavLinkProps {
    href: string;
    name: string;
}