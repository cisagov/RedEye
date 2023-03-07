import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { UtilityStyles } from '@redeye/ui-styles';

export const scrollBoxOuterStyle = css`
	flex: 1 1 auto;
	overflow: hidden;
	height: 100%;

	display: flex;
	flex-direction: column;

	${UtilityStyles.innerBoxShadowOverlay('vertical')};
`;
export const ScrollBox = styled.div(scrollBoxOuterStyle);

export const scrollChildStyle = css`
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
`;
export const ScrollChild = styled.div(scrollChildStyle);
