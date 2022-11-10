import { makeStyles } from "tss-react/mui";
import { Css, CSSObject, Cx } from "tss-react/types";
import { EdtTheme } from "./edt-theme";

type MakeStylesParams =
    | {
          name?: string | Record<string, unknown> | undefined;
          uniqId?: string | undefined;
      }
    | undefined;
type MakeStyleEdt<Params = void, RuleNameSubsetReferencableInNestedSelectors extends string = never> = <
    RuleName extends string,
>(
    cssObjectByRuleNameOrGetCssObjectByRuleName:
        | Record<RuleName, CSSObject>
        | ((
              theme: EdtTheme,
              params: Params,
              classes: Record<RuleNameSubsetReferencableInNestedSelectors, string>,
          ) => Record<RuleNameSubsetReferencableInNestedSelectors | RuleName, CSSObject>),
) => (
    params: Params,
    styleOverrides?:
        | {
              props: {
                  classes?: Record<string, string> | undefined;
              } & Record<string, unknown>;
              ownerState?: Record<string, unknown> | undefined;
          }
        | undefined,
) => {
    classes: Record<RuleName, string>;
    theme: EdtTheme;
    css: Css;
    cx: Cx;
};
const makeStylesEdt = function <
    Params = void,
    RuleNameSubsetReferencableInNestedSelectors extends string = never,
>(params?: MakeStylesParams) {
    return makeStyles(params) as MakeStyleEdt<Params, RuleNameSubsetReferencableInNestedSelectors>;
};
export { makeStylesEdt, EdtTheme, MakeStylesParams, MakeStyleEdt };
