// 获取所有必选属性
type FilterOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? K : never;
    }[keyof T],
    undefined
  >
>;

// 获取所有可选属性
type FilterNotOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    }[keyof T],
    undefined
  >
>;

type PartialEither<T, K extends keyof any> = {
  [P in Exclude<keyof FilterOptional<T>, K>]-?: T[P];
} & { [P in Exclude<keyof FilterNotOptional<T>, K>]?: T[P] } & {
  [P in Extract<keyof T, K>]?: undefined;
};

type PlainObject = {
  [name: string]: any;
};

export type EitherOr<O extends PlainObject, L extends string, R extends string> = (
  | PartialEither<Pick<O, L | R>, L>
  | PartialEither<Pick<O, L | R>, R>
) &
  Omit<O, L | R>;
