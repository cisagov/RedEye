import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { Tokens as BpTokens, TokensAll as BpTokensAll } from 'blueprint-styler/base/tokens';
import { declareCssVars } from './tokenUtils';

const BeaconColors = {
	BeaconDead: BpTokens.Colors.DarkGray5,
	BeaconAlive: BpTokens.Colors.Gray2,
	BeaconFuture: BpTokens.Colors.Black,
	BeaconSelected: BpTokens.Colors.White,
	BeaconInteracted: BpTokens.Colors.Black,
};

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

	...BeaconColors,
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

export const customCssVars = css`



	:root {
		/* --black-hsl: 0,0%,0%;
		--dark-gray1-hsl: 0,0%,9%;
		--dark-gray2-hsl: 0,0%,13%;
		--dark-gray3-hsl: 0,0%,17%;
		--dark-gray4-hsl: 0,0%,21%;
		--dark-gray5-hsl: 0,0%,26%;
		--gray1-hsl: 0,0%,32%;
		--gray2-hsl: 0,0%,38%;
		--gray3-hsl: 0,0%,45%;
		--gray4-hsl: 0,0%,52%;
		--gray5-hsl: 0,0%,59%;
		--light-gray1-hsl: 0,0%,65%;
		--light-gray2-hsl: 0,0%,73%;
		--light-gray3-hsl: 0,0%,79%;
		--light-gray4-hsl: 0,0%,92%;
		--light-gray5-hsl: 0,0%,97%;
		--white-hsl: 0,0%,100%; */

		${lightThemeCssVars}
	}

	.${Classes.DARK} {
		${darkThemeCssVars}
	}
`;
