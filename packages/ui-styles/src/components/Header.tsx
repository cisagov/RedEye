import type { FC, HTMLAttributes } from 'react';
import { useMemo } from 'react';

import { H1, H2, H3, H4, H5, H6 } from '@blueprintjs/core';

export type HeaderProps = HTMLAttributes<HTMLOrSVGElement> & {
	large?: boolean;
	medium?: boolean;
	small?: boolean;
	/** h1 - h6 */
	h?: number;
	// hTag?: number; // just change the <h0/> number
	/** use the default header margin */
	withMargin?: boolean;
};

/** A utility header component for declarative styling */
export const Header: FC<HeaderProps> = ({
	large = false,
	medium = false,
	small = false,
	h,
	withMargin = false,
	...props
}) => {
	const HeaderComponent = useMemo(() => {
		const headerComponent = large
			? H3
			: medium
			? H4
			: small
			? H5
			: h != null
			? [H1, H2, H3, H4, H5, H6][clampInt(h, 1, 6) - 1]
			: H3;
		return headerComponent == null ? H3 : headerComponent;
	}, [h, large, medium, small]);

	const margin = useMemo(() => !withMargin && { margin: 0 }, [withMargin]);

	return <HeaderComponent css={margin} {...props} />;
};

const clampInt = (number: number, min: number, max: number) => Math.round(Math.min(Math.max(number, min), max));
