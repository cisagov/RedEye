import { css } from '@emotion/react';
import { AppTitle, ErrorFallback, LoginForm } from '@redeye/client/components';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type LoginProps = ComponentProps<'div'> & {};

const Login = observer<LoginProps>(({ ...props }) => (
	<div css={wrapperStyle} {...props}>
		<div css={containerStyle}>
			<AppTitle css={{ marginBottom: '2.5rem' }} />
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<LoginForm />
			</ErrorBoundary>
		</div>
	</div>
));

const wrapperStyle = css`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
`;
const containerStyle = css`
	margin: 2rem;
	width: 18rem;
`;

// eslint-disable-next-line import/no-default-export
export default Login;
