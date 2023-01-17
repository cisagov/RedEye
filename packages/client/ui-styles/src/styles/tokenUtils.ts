/** extracts --var-name from var(--var-name) */
export const tokenToName = (token: string): string => token.slice(4, token.length - 1);
export const t2n = tokenToName;

/** wraps --var-name in var(--var-name) */
export const nameToToken = (name: string): string => `var(${name})`;
export const n2t = nameToToken;

/** declare a token like `--var-name: value;` from the token value */
export const declareCssVar = (cssVar: string, value: string) => `${t2n(cssVar)}: ${value};`;

export const declareCssVars = (cssVars: [cssVar: string, value: string][]) =>
	cssVars.map(([cssVar, value]) => declareCssVar(cssVar, value)).join('\n');
