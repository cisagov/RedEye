import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { Tokens as BpTokens, TokensAll as BpTokensAll } from 'blueprint-styler/base/tokens';
import { declareCssVars } from './tokenUtils';

const transparentWhite = (opacity: number) => `hsla(${BpTokens.ColorsHsl.WhiteHsl}, ${opacity})`;
const transparentBlack = (opacity: number) => `hsla(${BpTokens.ColorsHsl.BlackHsl}, ${opacity})`;

const CustomTokens = {
	Background1: `var(--Background1)`,
	Background2: `var(--Background2)`,
	Background3: `var(--Background3)`,
	Background3b: `var(--Background3b)`,

	TextHeading: `var(--TextHeading)`,
	TextBody: `var(--TextBody)`,
	TextMuted: `var(--TextMuted)`,
	TextDisabled: `var(--TextDisabled)`,
	TextLink: `var(--TextLink)`,
	TextIcon: `var(--TextIcon)`,
	OnIntent: `var(--OnIntent)`,
	TextIntentPrimary: `var(--TextIntentPrimary)`,
	TextIntentSuccess: `var(--TextIntentSuccess)`,
	TextIntentWarning: `var(--TextIntentWarning)`,
	TextIntentDanger: `var(--TextIntentDanger)`,
	BorderEmphasis: `var(--BorderEmphasis)`,
	BorderNormal: `var(--BorderNormal)`,
	BorderMuted: `var(--BorderMuted)`,
	BorderInvert: `var(--BorderInvert)`,

	ShadowGradient: `var(--ShadowGradient)`,

	ColumnSize: '32rem',
};

export const CoreTokens = {
	...CustomTokens,

	Elevation0: BpTokensAll.PtElevationShadow0,
	Elevation1: BpTokensAll.PtElevationShadow1,
	Elevation2: BpTokensAll.PtElevationShadow2,
	Elevation3: BpTokensAll.PtElevationShadow3,
	Elevation4: BpTokensAll.PtElevationShadow4,

	FontWeightBold: BpTokensAll.FontWeightBold, // 700
	FontWeightNormal: BpTokensAll.FontWeightNormal, // 400

	FontFamilySans: BpTokensAll.PtFontFamilySans,
	FontFamilyMonospace: BpTokensAll.PtFontFamilyMonospace,
	FontFamilySerif: BpTokensAll.PtFontFamilySerif,

	FontSizeSmall: BpTokensAll.PtFontSizeSmall, // '12px',
	FontSizeMedium: BpTokensAll.PtFontSize, // '14px',
	FontSizeLarge: BpTokensAll.PtFontSizeLarge, // '18px',

	Intent: {
		Primary1: BpTokensAll.Primary1,
		Primary2: BpTokensAll.Primary2,
		Primary3: BpTokensAll.Primary3,
		Primary4: BpTokensAll.Primary4,
		Primary5: BpTokensAll.Primary5,
		Success1: BpTokensAll.Success1,
		Success2: BpTokensAll.Success2,
		Success3: BpTokensAll.Success3,
		Success4: BpTokensAll.Success4,
		Success5: BpTokensAll.Success5,
		Warning1: BpTokensAll.Warning1,
		Warning2: BpTokensAll.Warning2,
		Warning3: BpTokensAll.Warning3,
		Warning4: BpTokensAll.Warning4,
		Warning5: BpTokensAll.Warning5,
		Danger1: BpTokensAll.Danger1,
		Danger2: BpTokensAll.Danger2,
		Danger3: BpTokensAll.Danger3,
		Danger4: BpTokensAll.Danger4,
		Danger5: BpTokensAll.Danger5,
	},

	Colors: { ...BpTokens.Colors },

	transparentWhite,
	transparentBlack,

	// ...BeaconColors,
};

export const AdvancedTokens = {
	...BpTokensAll,
	...CoreTokens,
};

const lightThemeCssVars = declareCssVars([
	[BpTokensAll.PtAppTopBackgroundColor, BpTokensAll.White],
	[BpTokensAll.PtAppBackgroundColor, BpTokensAll.White],

	[CustomTokens.Background1, BpTokensAll.PtAppTopBackgroundColor],
	[CustomTokens.Background2, BpTokensAll.PtAppBackgroundColor],
	[CustomTokens.Background3, BpTokensAll.LightGray5],
	[CustomTokens.Background3b, transparentBlack(0.025)],

	[CustomTokens.TextHeading, BpTokens.TextColors.PtHeadingColor],
	[CustomTokens.TextBody, BpTokens.TextColors.PtTextColor],
	[CustomTokens.TextMuted, BpTokens.TextColors.PtTextColorMuted],
	[CustomTokens.TextDisabled, BpTokens.TextColors.PtTextColorDisabled],

	[CustomTokens.TextLink, BpTokensAll.PtLinkColor],
	[CustomTokens.TextIcon, BpTokensAll.PtIconColor],

	[CustomTokens.OnIntent, BpTokensAll.White],

	[CustomTokens.TextIntentPrimary, BpTokensAll.PtIntentPrimaryTextColor],
	[CustomTokens.TextIntentSuccess, BpTokensAll.PtIntentSuccessTextColor],
	[CustomTokens.TextIntentWarning, BpTokensAll.PtIntentWarningTextColor],
	[CustomTokens.TextIntentDanger, BpTokensAll.PtIntentDangerTextColor],

	[CustomTokens.BorderEmphasis, BpTokensAll.LightGray1],
	[CustomTokens.BorderNormal, BpTokensAll.PtDividerBlack],
	[CustomTokens.BorderMuted, BpTokensAll.LightGray2],
	[CustomTokens.BorderInvert, BpTokensAll.LightGray3],

	[CustomTokens.ShadowGradient, `${transparentBlack(0.05)}, ${transparentBlack(0)}`],
]);

const darkThemeCssVars = declareCssVars([
	[BpTokensAll.PtAppTopBackgroundColor, BpTokensAll.DarkGray2],
	[BpTokensAll.PtAppBackgroundColor, BpTokensAll.DarkGray2],

	[CustomTokens.Background1, BpTokensAll.PtAppTopBackgroundColor],
	[CustomTokens.Background2, BpTokensAll.PtAppBackgroundColor],
	[CustomTokens.Background3, BpTokensAll.DarkGray1],
	[CustomTokens.Background3b, transparentBlack(0.3)],

	[CustomTokens.OnIntent, BpTokensAll.White],

	[CustomTokens.BorderEmphasis, BpTokens.Colors.Black],
	[CustomTokens.BorderNormal, BpTokens.Colors.Black],
	[CustomTokens.BorderMuted, BpTokens.LayoutColors.PtDividerBlack],
	[CustomTokens.BorderInvert, BpTokens.Colors.Gray4],

	[CustomTokens.ShadowGradient, `${transparentBlack(0.2)}, ${transparentBlack(0)}`],
]);

export const TimelineTokens = {
	PastBgTimeline: `var(--PastBgTimeline)`,
	PresentBgTimeline: `var(--PresentBgTimeline)`,
	FutureBgTimeline: `var(--FutureBgTimeline)`,
	SelectedBgTimeline: `var(--SelectedBgTimeline)`,
	PreviewBgTimeline: `var(--PreviewBgTimeline)`,
};

export const GraphTokens = {
	PastFgColor: `var(--PastFgColor)`,
	PastBgColor: `var(--PastBgColor)`,
	PastDasharray: '4px 4.5px', // Dashed

	PresentFgColor: `var(--PresentFgColor)`,
	PresentBgColor: `var(--PresentBgColor)`,
	// PresentDasharray: // none,

	FutureFgColor: `var(--FutureFgColor)`,
	FutureBgColor: `var(--FutureBgColor)`,
	FutureDasharray: '0px 6px', // Dotted

	SelectedFgColor: `var(--SelectedFgColor)`,
	SelectedThickness: '3px',

	PreviewFgColor: `var(--PreviewFgColor)`,
	PreviewThickness: '2px',

	SelectedFocusFgColor: `var(--SelectedFocusFgColor)`,
	SelectedFocusBgColor: `var(--SelectedFocusBgColor)`,

	GroupNodeStrokeColor: `var(--GroupNodeStrokeColor)`,
};

const lightThemeGraphAndTimelineCssVars = declareCssVars([
	[TimelineTokens.PresentBgTimeline, CoreTokens.Colors.Gray2],
	[TimelineTokens.PastBgTimeline, CoreTokens.Colors.LightGray2],
	[TimelineTokens.FutureBgTimeline, CoreTokens.Colors.LightGray4],
	[TimelineTokens.SelectedBgTimeline, CoreTokens.Intent.Primary3],
	[TimelineTokens.PreviewBgTimeline, CoreTokens.transparentBlack(0.1)],

	[GraphTokens.PresentFgColor, CoreTokens.Colors.LightGray1],
	[GraphTokens.PresentBgColor, CoreTokens.Colors.White],
	[GraphTokens.PastFgColor, CoreTokens.Colors.LightGray2],
	[GraphTokens.PastBgColor, CoreTokens.Colors.LightGray4],
	[GraphTokens.FutureFgColor, CoreTokens.Colors.LightGray5], 
	[GraphTokens.FutureBgColor, CoreTokens.Colors.LightGray5], 
	[GraphTokens.SelectedFgColor, CoreTokens.Colors.DarkGray4],
	[GraphTokens.PreviewFgColor, CoreTokens.Colors.Black],
	[GraphTokens.SelectedFocusFgColor, CoreTokens.Intent.Primary4],
	[GraphTokens.SelectedFocusBgColor, CoreTokens.Intent.Primary5],
	[GraphTokens.GroupNodeStrokeColor, CoreTokens.transparentBlack(0.03)],
]);

const darkThemeGraphAndTimelineCssVars = declareCssVars([
	[TimelineTokens.PresentBgTimeline, CoreTokens.Colors.Gray2],
	[TimelineTokens.PastBgTimeline, CoreTokens.Colors.DarkGray5],
	[TimelineTokens.FutureBgTimeline, CoreTokens.Colors.Black],
	[TimelineTokens.SelectedBgTimeline, CoreTokens.Intent.Primary3],
	[TimelineTokens.PreviewBgTimeline, CoreTokens.transparentBlack(0.5)],

	[GraphTokens.PresentFgColor, CoreTokens.Colors.Gray3],
	[GraphTokens.PresentBgColor, CoreTokens.Colors.DarkGray3],
	[GraphTokens.PastFgColor, CoreTokens.Colors.DarkGray5],
	[GraphTokens.PastBgColor, CoreTokens.Colors.DarkGray2],
	[GraphTokens.FutureFgColor, CoreTokens.Colors.Black], // Black?
	[GraphTokens.FutureBgColor, CoreTokens.Colors.DarkGray2], // DarkGray2?
	[GraphTokens.SelectedFgColor, CoreTokens.Colors.LightGray2],
	[GraphTokens.PreviewFgColor, CoreTokens.Colors.White],
	[GraphTokens.SelectedFocusFgColor, CoreTokens.Intent.Primary3],
	[GraphTokens.SelectedFocusBgColor, CoreTokens.Intent.Primary1],
	[GraphTokens.GroupNodeStrokeColor, CoreTokens.transparentWhite(0.03)],
]);

export const customCssVars = css`
	:root {
		${lightThemeCssVars}
		${lightThemeGraphAndTimelineCssVars}
	}
	.${Classes.DARK} {
		${darkThemeCssVars}
		${darkThemeGraphAndTimelineCssVars}
	}
`;
