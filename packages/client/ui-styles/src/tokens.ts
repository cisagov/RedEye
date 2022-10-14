import { Tokens as BpTokens, TokensAll as BpTokensAll } from 'blueprint-styler/base/tokens';

const CoreTokens = {
	// TODO: this will work for dark theme only,
	// ...but we will need custom vars for light theme alt in ./tokens.css
	// Background1: 'var(--background1)',

	BackgroundColor1: BpTokens.Colors.DarkGray1, // BpTokens.LayoutColors.PtAppTopBackgroundColor,
	BackgroundColor1b: `hsla(${BpTokens.ColorsHsl.DarkGray1Hsl}, 40%)`, // BpTokens.LayoutColors.PtAppBackgroundColor,
	BackgroundColor2: BpTokens.Colors.DarkGray2, // BpTokens.LayoutColors.PtAppBackgroundColor,
	BackgroundColor3: BpTokens.Colors.DarkGray3, // BpTokens.Colors.DarkGray3,

	BorderColorEmphasis: BpTokens.Colors.Black,
	BorderColorNormal: BpTokens.Colors.DarkGray1,
	BorderColorMuted: BpTokens.LayoutColors.PtDividerBlack,
	BorderColorInvert: BpTokens.Colors.Gray4,

	ForegroundColorEmphasis: BpTokens.TextColors.PtHeadingColor, // 1
	ForegroundColorNormal: BpTokens.TextColors.PtTextColor, // 2
	ForegroundColorMuted: BpTokens.TextColors.PtTextColorMuted, // 3
	ForegroundColorDisabled: BpTokens.TextColors.PtTextColorDisabled, // 4

	BeaconDead: BpTokens.Colors.DarkGray5,
	BeaconAlive: BpTokens.Colors.Gray2,
	BeaconFuture: BpTokens.Colors.Black,
	BeaconSelected: BpTokens.Colors.White,

	FontWeightBold: '700',
	FontWeightNormal: '400',

	FontSizeSmall: '12px',
	FontSize: '14px',
	FontSizeLarge: '18px',

	ColumnSize: '32rem',

	ShadowGradient: `rgba(0,0,0,0.2), rgba(0,0,0,0)`,
	// Add more color aliases here
};

export const Tokens = {
	...BpTokens,
	CoreTokens,
};

export const TokensAll = {
	...BpTokensAll,
	...CoreTokens,
};
