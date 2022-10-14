import { Classes } from '@blueprintjs/core';
import { useMemo } from 'react';

interface Props extends React.HTMLProps<HTMLSpanElement> {
	minChar?: number;
	maxChar?: number;
}

export const SkeletonTxt = ({ minChar = 20, maxChar = 100, children, className, ...props }: Props) => {
	const text = useMemo(() => children || randomString(minChar, maxChar), [children, minChar, maxChar]);
	return (
		<span className={[className, Classes.SKELETON].join(' ')} {...props}>
			{text}
		</span>
	);
};

function randomString(length: number, range?: number) {
	length = Math.abs(Math.round(length));
	if (range) length = mathRandomRangeInt(length, range);
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function mathRandomRangeInt(min: number, max: number) {
	return Math.round(Math.random() * (max - min) + min);
}
