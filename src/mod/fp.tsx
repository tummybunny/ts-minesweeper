export type Nullable<T> = T | null

export function mapNotNull<T, U>(n: Nullable<T>, func: (t: T) => U): Nullable<U> {
    if (n === null) return null
    return func(n)
}