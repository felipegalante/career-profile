import { composeRenderProps } from "react-aria-components";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Prepends library classes to a React Aria `className`, which may be a string or a render-prop function. */
export function withClassName<T>(className: string | ((renderProps: T) => string) | undefined, base: string | ((renderProps: T) => string)) {
  return composeRenderProps<string | undefined, T, string>(className, (userClass, renderProps) => cx(typeof base === "function" ? base(renderProps) : base, userClass));
}
