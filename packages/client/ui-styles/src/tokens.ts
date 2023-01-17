import { Tokens as BpTokens, TokensAll as BpTokensAll } from 'blueprint-styler/base/tokens';

const BeaconColors = {
	BeaconDead: BpTokens.Colors.DarkGray5,
	BeaconAlive: BpTokens.Colors.Gray2,
	BeaconFuture: BpTokens.Colors.Black,
	BeaconSelected: BpTokens.Colors.White,
	BeaconInteracted: BpTokens.Colors.Black,
};

const transparentWhite = (opacity: number) => `hsla(${BpTokens.ColorsHsl.WhiteHsl}, ${opacity})`;
const transparentBlack = (opacity: number) => `hsla(${BpTokens.ColorsHsl.BlackHsl}, ${opacity})`;

export const CoreTokens = {
	// TODO: this will work for dark theme only,
	// ...but we will need custom vars for light theme alt in ./tokens.css
	// Background1: 'var(--background1)',

	Background0: BpTokens.Colors.DarkGray1, // BpTokens.LayoutColors.PtAppTopBackgroundColor,
	Background0b: `hsla(${BpTokens.ColorsHsl.DarkGray1Hsl}, 40%)`, // transparentBlack(0.3)
	Background1: BpTokens.Colors.DarkGray2, // BpTokens.LayoutColors.PtAppBackgroundColor,
	Background2: BpTokens.Colors.DarkGray3,
	Background3: BpTokens.Colors.DarkGray4,

	TextHeading: BpTokens.TextColors.PtHeadingColor, // 1
	TextBody: BpTokens.TextColors.PtTextColor, // 2
	TextMuted: BpTokens.TextColors.PtTextColorMuted, // 3
	TextDisabled: BpTokens.TextColors.PtTextColorDisabled, // 4

	TextLink: BpTokensAll.PtLinkColor,
	TextIcon: BpTokensAll.PtIconColor,
	OnIntent: BpTokensAll.White,

	TextIntentPrimary: BpTokensAll.PtIntentPrimaryTextColor,
	TextIntentSuccess: BpTokensAll.PtIntentSuccessTextColor,
	TextIntentWarning: BpTokensAll.PtIntentWarningTextColor,
	TextIntentDanger: BpTokensAll.PtIntentDangerTextColor,

	BorderEmphasis: BpTokens.Colors.Black,
	BorderNormal: BpTokens.Colors.DarkGray1,
	BorderMuted: BpTokens.LayoutColors.PtDividerBlack,
	BorderInvert: BpTokens.Colors.Gray4, // BpTokensAll.PtDividerWhite, // doesn't exist?

	Elevation0: BpTokensAll.PtElevationShadow0,
	Elevation1: BpTokensAll.PtElevationShadow1,
	Elevation2: BpTokensAll.PtElevationShadow2,
	Elevation3: BpTokensAll.PtElevationShadow3,
	Elevation4: BpTokensAll.PtElevationShadow4,

	FontWeightBold: BpTokensAll.FontWeightBold, // 700
	/** normal font-weight */
	FontWeightNormal: BpTokensAll.FontWeightNormal, // 400

	/** standard, default typeface */
	FontFamilySans: BpTokensAll.PtFontFamilySans,
	/** typeface used for code and numbers */
	FontFamilyMonospace: BpTokensAll.PtFontFamilyMonospace,
	/** typeface used for display only (Times New Roman) */
	FontFamilySerif: BpTokensAll.PtFontFamilySerif,

	FontSizeSmall: BpTokensAll.PtFontSizeSmall, // '12px',
	FontSizeMedium: BpTokensAll.PtFontSize, // '14px',
	FontSizeLarge: BpTokensAll.PtFontSizeLarge, // '18px',

	ShadowGradient: `rgba(0,0,0,0.2), rgba(0,0,0,0)`,

	/** Directly access the intent color scales. 1 is darkest, 5 lightest */
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

	/** Directly access raw colors */
	Colors: { ...BpTokens.Colors },

	transparentWhite,
	transparentBlack,

	ColumnSize: '32rem',
	...BeaconColors,
};

// export const Tokens = {
// 	...BpTokens,
// 	CoreTokens,
// };

export const AdvancedTokens = {
	...BpTokensAll,
	...CoreTokens,
};