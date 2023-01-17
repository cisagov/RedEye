import { Tokens as BpTokens, TokensAll as BpTokensAll } from 'blueprint-styler/base/tokens';

const BeaconColors = {
	BeaconDead: BpTokens.Colors.DarkGray5,
	BeaconAlive: BpTokens.Colors.Gray2,
	BeaconFuture: BpTokens.Colors.Black,
	BeaconSelected: BpTokens.Colors.White,
	BeaconInteracted: BpTokens.Colors.Black,
};

export const CoreTokens = {
	// TODO: this will work for dark theme only,
	// ...but we will need custom vars for light theme alt in ./tokens.css
	// Background1: 'var(--background1)',

	Background0: BpTokens.Colors.DarkGray1, // BpTokens.LayoutColors.PtAppTopBackgroundColor,
	Background0b: `hsla(${BpTokens.ColorsHsl.DarkGray1Hsl}, 40%)`,
	Background1: BpTokens.Colors.DarkGray2, // BpTokens.LayoutColors.PtAppBackgroundColor,
	Background2: BpTokens.Colors.DarkGray3,
	Background3: BpTokens.Colors.DarkGray4,

	TextHeading: BpTokens.TextColors.PtHeadingColor, // 1
	TextBody: BpTokens.TextColors.PtTextColor, // 2
	TextMuted: BpTokens.TextColors.PtTextColorMuted, // 3
	TextDisabled: BpTokens.TextColors.PtTextColorDisabled, // 4

	/** color of <a/> links */
	TextLink: BpTokensAll.PtLinkColor,
	/** color of blueprint icons, typically TextMuted */
	TextIcon: BpTokensAll.PtIconColor,
	/** foreground color of text with a intent background-color (White) */
	OnIntent: BpTokensAll.White,

	/** primary text color  */
	TextIntentPrimary: BpTokensAll.PtIntentPrimaryTextColor,
	/** success text color (green) */
	TextIntentSuccess: BpTokensAll.PtIntentSuccessTextColor,
	/** primary text color (yellow/orange)  */
	TextIntentWarning: BpTokensAll.PtIntentWarningTextColor,
	/** primary text color (red)  */
	TextIntentDanger: BpTokensAll.PtIntentDangerTextColor,

	BorderEmphasis: BpTokens.Colors.Black,
	BorderNormal: BpTokens.Colors.DarkGray1,
	BorderMuted: BpTokens.LayoutColors.PtDividerBlack,
	BorderInvert: BpTokens.Colors.Gray4, // BpTokens.LayoutColors.PtDividerWhite, ?

	FontWeightBold: '700',
	FontWeightNormal: '400',

	FontSizeSmall: '12px',
	FontSize: '14px',
	FontSizeLarge: '18px',

	ShadowGradient: `rgba(0,0,0,0.2), rgba(0,0,0,0)`,
	// Add more color aliases here

	ColumnSize: '32rem',
	...BeaconColors,
};

export const Tokens = {
	...BpTokens,
	CoreTokens,
};

export const TokensAll = {
	...BpTokensAll,
	...CoreTokens,
};
