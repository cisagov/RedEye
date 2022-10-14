import type { ComponentProps, FC } from 'react';
import LogoDark from './Logo-Dark.svg';

type LogoProps = ComponentProps<'img'> & {};

export const Logo: FC<LogoProps> = ({ ...props }) => (
	// switching logo based on dark theme is currently disabled
	<>
		<img
			{...props}
			src={LogoDark}
			alt="RedEye Dark Logo"
			// css={css`
			//   display: none;
			//   .${Classes.DARK} & {
			//     display: block;
			//   }
			// `}
		/>
		{/* <img
        {...props}
        src="/logos/Logo-Light.svg"
        alt={'RedEye Light Logo'}
        css={css`
          display: block;
          .${Classes.DARK} & {
            display: none;
          }
        `}
      /> */}
	</>
);
