import { Classes } from '@blueprintjs/core';
import { AddComment16, Chat16, List16, Tag16, User16 } from '@carbon/icons-react';
import type { CarbonIconType } from '@carbon/icons-react';
import type { ComponentProps, FC } from 'react';

export type CarbonIconProps = ComponentProps<'span'> & {
	icon: CarbonIconType | CustomIcon;
	size?: number;
	// SEARCH FOR ICONS HERE: https://www.carbondesignsystem.com/guidelines/icons/library/
};

/** Maps CarbonIcons to Blueprint <Icon/> */
export const CarbonIcon: FC<CarbonIconProps> = ({ icon, size = 16, className, ...props }) => {
	const CarbonIconComponent =
		typeof icon === 'string'
			? () => (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						// xmlns:xlink="http://www.w3.org/1999/xlink"
						width={size}
						height={size}
						viewBox={`0 0 ${size} ${size}`}
					>
						<path d={icon} />
					</svg>
			  )
			: icon; // CarbonIconType

	return (
		<span {...props} className={[Classes.ICON, className].join(' ')}>
			<CarbonIconComponent />
		</span>
	);
};

/** the d="" attribute for an svg <path d={string} /> */
export type SvgPathD = string; // ComponentProps<'path'>['d'];
export type CustomIcon = string; // keyof typeof customIconPaths;

/** custom icon paths for use in <CarbonIcon icon={customIconPaths.icon} /> */
export const customIconPaths = {
	multiComment16:
		'M9,15.5l2-3.5h3c0.6,0,1-0.4,1-1V5c0-0.6-0.4-1-1-1h-2V3h2c1.1,0,2,0.9,2,2v6c0,1.1-0.9,2-2,2c0,0,0,0,0,0h-2.4l-1.7,3 L9,15.5z M4,13c-1.1,0-2-0.9-2-2v-1h1v1c0,0.6,0.4,1,1,1h4.5v1H4z M3,9V7h8v2H3z M0,9V7h2v2H0z M3,6V4h8v2H3z M0,6V4h2v2H0z M3,3V1 h8v2H3z M0,3V1h2v2H0z',
	beacon16:
		'M12.1,12.8l-2.4-2.4c-1.2,0.8-2.8,0.7-3.9-0.3c-1-1-1.2-2.7-0.3-3.9L3.1,3.8C3.1,3.8,3,3.6,3,3.5c0-0.1,0.1-0.3,0.2-0.4 C3.2,3,3.4,3,3.5,3C3.6,3,3.8,3,3.9,3.1l2.4,2.4c1.2-0.8,2.8-0.7,3.9,0.3c1,1,1.2,2.7,0.3,3.9l2.4,2.4c0.2,0.2,0.2,0.5,0,0.7 c0,0,0,0,0,0c-0.1,0.1-0.2,0.1-0.4,0.1C12.4,13,12.2,12.9,12.1,12.8z M6.6,6.6c-0.8,0.8-0.8,2,0,2.8c0,0,0,0,0,0 c0.8,0.8,2,0.8,2.8,0c0.8-0.8,0.8-2,0-2.8C9,6.2,8.5,6,8,6C7.5,6,7,6.2,6.6,6.6L6.6,6.6z',
	host16:
		'M2,8c0-3.3,2.7-6,6-6s6,2.7,6,6s-2.7,6-6,6S2,11.3,2,8z M3,8c0,2.8,2.2,5,5,5c2.8,0,5-2.2,5-5s-2.2-5-5-5C5.2,3,3,5.2,3,8z M7,10.5C7,9.7,7.7,9,8.5,9S10,9.7,10,10.5S9.3,12,8.5,12S7,11.3,7,10.5z M8,10.5C8,10.8,8.2,11,8.5,11S9,10.8,9,10.5S8.8,10,8.5,10 S8,10.2,8,10.5z M4,8.5C4,7.7,4.7,7,5.5,7S7,7.7,7,8.5S6.3,10,5.5,10S4,9.3,4,8.5z M5,8.5C5,8.8,5.2,9,5.5,9S6,8.8,6,8.5 S5.8,8,5.5,8S5,8.2,5,8.5z M9,7.5C9,6.7,9.7,6,10.5,6S12,6.7,12,7.5S11.3,9,10.5,9S9,8.3,9,7.5z M10,7.5C10,7.8,10.2,8,10.5,8 S11,7.8,11,7.5S10.8,7,10.5,7S10,7.2,10,7.5z M6,5.5C6,4.7,6.7,4,7.5,4S9,4.7,9,5.5S8.3,7,7.5,7S6,6.3,6,5.5z M7,5.5 C7,5.8,7.2,6,7.5,6S8,5.8,8,5.5S7.8,5,7.5,5S7,5.2,7,5.5z',
	link16:
		'M9,12c0-0.6,0.2-1.2,0.6-1.7L5.7,6.4C5.2,6.8,4.6,7,4,7C2.3,7,1,5.7,1,4s1.3-3,3-3s3,1.3,3,3c0,0.6-0.2,1.2-0.6,1.7l3.8,3.8 C10.8,9.2,11.4,9,12,9c1.7,0,3,1.3,3,3s-1.3,3-3,3S9,13.7,9,12z M10,12c0,1.1,0.9,2,2,2s2-0.9,2-2s-0.9-2-2-2S10,10.9,10,12z M2,4 c0,1.1,0.9,2,2,2c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2C2.9,2,2,2.9,2,4z',
	teamServer16:
		'M12,6.1c0-0.4-0.2-0.7-0.5-0.9l-3-1.8c-0.3-0.2-0.7-0.2-1,0l-3,1.8C4.2,5.5,4,5.8,4,6.1v3.7c0,0.4,0.2,0.7,0.5,0.9l3,1.8 c0.3,0.2,0.7,0.2,1,0l3-1.8c0.3-0.2,0.5-0.5,0.5-0.9V6.1 M13,6.1v3.7c0,0.7-0.4,1.4-1,1.7l-3,1.8c-0.6,0.4-1.4,0.4-2.1,0l-3-1.8 c-0.6-0.4-1-1-1-1.7V6.1c0-0.7,0.4-1.4,1-1.7l3-1.8c0.6-0.4,1.4-0.4,2.1,0l3,1.8C12.6,4.8,13,5.4,13,6.1z',
};

/** Mapping for icons that are used in several locations */
export const semanticIcons = {
	commands: List16,
	comment: Chat16,
	addComment: AddComment16,
	operator: User16,
	beacon: customIconPaths.beacon16,
	host: customIconPaths.host16,
	link: customIconPaths.link16,
	teamServer: customIconPaths.teamServer16,
	tags: Tag16,
};
