import { FC, HTMLAttributes, useMemo } from 'react';
import { Classes } from '@blueprintjs/core';
import { UtilityStyles } from '../styles/utility-styles';
import { CoreTokens as Tkn } from '../styles/tokens';

export type TxtProps = HTMLAttributes<HTMLOrSVGElement> & {
	// COLOR
	emphasis?: boolean;
	regular?: boolean;
	muted?: boolean;
	disabled?: boolean;

	// SIZE
	large?: boolean;
	medium?: boolean;
	small?: boolean;

	// FONT STYLE
	bold?: boolean;
	normal?: boolean;
	italic?: boolean;
	// underline?: boolean;

	// FAMILY
	sans?: boolean;
	monospace?: boolean;
	serif?: boolean;

	// UTILITY
	meta?: boolean;
	running?: boolean;
	skeleton?: boolean;
	block?: boolean;

	// from TextProps
	ellipsize?: boolean;
	tagName?: keyof JSX.IntrinsicElements;
};

/** A utility text component for declarative styling */
export const Txt: FC<TxtProps> = ({
	tagName,

	emphasis = false,
	regular = false,
	muted = false,
	disabled = false,

	large = false,
	medium = false,
	small = false,

	bold = false,
	normal = false,
	italic = false,

	sans = false,
	monospace: mono = false,
	serif = false,

	meta = false,
	running = false,
	skeleton = false,
	block = false,

	ellipsize = false,
	className,
	...props
}) => {
	const txtCss = useMemo(
		() => [
			{
				color: emphasis
					? Tkn.TextHeading
					: muted
					? Tkn.TextMuted
					: disabled
					? Tkn.TextDisabled
					: regular
					? Tkn.TextBody
					: undefined,
			},
			{
				fontSize: large ? Tkn.FontSizeLarge : small ? Tkn.FontSizeSmall : medium ? Tkn.FontSizeMedium : undefined,
			},
			{
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				fontWeight: bold ? (Tkn.FontWeightBold as any) : normal ? (Tkn.FontWeightNormal as any) : undefined,
			},
			{
				fontStyle: italic ? 'italic' : normal ? 'normal' : undefined,
			},
			{
				fontFamily: sans
					? Tkn.FontFamilySans
					: mono
					? Tkn.FontFamilyMonospace
					: serif
					? Tkn.FontFamilySerif
					: undefined,
			},
			{
				display: block ? 'block' : undefined,
			},
			meta && UtilityStyles.textMeta,
			running && UtilityStyles.textRunning,
			ellipsize && UtilityStyles.textEllipsis,
		],
		[
			block,
			bold,
			disabled,
			ellipsize,
			emphasis,
			italic,
			large,
			medium,
			meta,
			mono,
			muted,
			normal,
			regular,
			running,
			sans,
			serif,
			small,
		]
	);

	const _className = useMemo(() => {
		const classNames: string[] = [];
		if (skeleton) classNames.push(Classes.SKELETON);
		if (className) classNames.push(className);
		return classNames.length > 0 ? classNames.join(' ') : undefined;
	}, [className, skeleton]);

	const RootTag = useMemo(() => {
		return tagName || running ? 'p' : 'span';
	}, [running, tagName]);

	return <RootTag css={txtCss} className={_className} {...props} />;
};
