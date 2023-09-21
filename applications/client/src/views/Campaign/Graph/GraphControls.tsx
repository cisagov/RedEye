import { Button, ButtonGroup, Classes, Divider } from '@blueprintjs/core';
import {
	Add16,
	CenterSquare16,
	Close16,
	Export16,
	Harbor16,
	Help16,
	StringText16,
	Subtract16,
} from '@carbon/icons-react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CarbonIcon } from '@redeye/client/components';
import { RedEyeGraphClassNames as GCN } from '@redeye/graph';
import { CoreTokens, Header, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { graphStyles } from './graph-styles';

export type GraphControlFunctions = {
	zoomIn: () => void;
	zoomOut: () => void;
	zoomToFit: () => void;
	exportSVG: () => void;
	isSimpleForces?: boolean;
	toggleSimpleForces: (on: boolean) => void;
	showMoreLabels?: boolean;
	setShowMoreLabels: (on: boolean) => void;
};

export const GraphControls = observer<GraphControlFunctions & ComponentProps<'div'>>(
	({
		zoomIn,
		zoomOut,
		zoomToFit,
		exportSVG,
		isSimpleForces = false,
		toggleSimpleForces,
		showMoreLabels = false,
		setShowMoreLabels,
		...props
	}) => {
		const [isOpen, setIsOpen] = useState(false);

		return (
			<div css={rootStyle} {...props}>
				{isOpen ? (
					<div cy-test="legend-box" css={[controlGroupStyle, settingsWrapperStyle]}>
						<Button
							icon={<CarbonIcon icon={Close16} />}
							css={settingsCloseStyle}
							onClick={() => {
								setIsOpen(false);
							}}
							minimal
							small
						/>
						<Header small css={legendTitle}>
							Legend
						</Header>
						{(
							[
								['Selected', [GCN.selectedFocus], [GCN.selected], [GCN.selected]],
								['Preview', [GCN.previewed], [GCN.previewed]],
								['Active', [GCN.present], [GCN.present]],
								['Exited', [GCN.past], [GCN.past]],
								['Future', [GCN.future], [GCN.future]],
							] as [string, string[], string[], string[]?][]
						).map((legendItem) => (
							<div css={legendItemStyle}>
								<svg height={svgStyle.height} width={svgStyle.width} css={graphStyles}>
									<line
										x1={svgStyle.center}
										y1={svgStyle.center}
										x2={svgStyle.width - svgStyle.center}
										y2={svgStyle.center}
										css={[legendLineStyle]}
										className={[GCN.siblingLink, ...legendItem[2]].join(' ')}
									/>
									<circle
										r={svgStyle.radius}
										cx={svgStyle.center}
										cy={svgStyle.center}
										css={[legendNodeStyle]}
										className={[GCN.subNode, GCN.softwareNode, ...legendItem[1]].join(' ')}
									/>
									<circle
										r={svgStyle.radius}
										cx={svgStyle.width - svgStyle.center}
										cy={svgStyle.center}
										css={[legendNodeStyle]}
										className={[GCN.subNode, GCN.softwareNode, ...(legendItem[3] ?? legendItem[1])].join(' ')}
									/>
								</svg>
								<Txt css={[legendLabelStyle]}>{legendItem[0]}</Txt>
							</div>
						))}
					</div>
				) : (
					<GraphControlButtonGroup vertical hidden={isOpen}>
						<Button
							cy-test="graph-legend"
							icon={<CarbonIcon icon={Help16} />}
							onClick={() => {
								setIsOpen(true);
							}}
							title="Settings"
							minimal
						/>
					</GraphControlButtonGroup>
				)}
				<GraphControlButtonGroup vertical>
					<Button
						active={isSimpleForces}
						intent={isSimpleForces ? 'primary' : 'none'}
						rightIcon={<CarbonIcon icon={Harbor16} />}
						onClick={() => toggleSimpleForces(!isSimpleForces)}
						title="Anchor Nodes on Drag"
						text={isOpen && 'Anchor Drag'}
						minimal
						alignText="left"
					/>
					<GraphControlDivider />
					<Button
						active={showMoreLabels}
						intent={showMoreLabels ? 'primary' : 'none'}
						rightIcon={<CarbonIcon icon={StringText16} />}
						onClick={() => setShowMoreLabels(!showMoreLabels)}
						title="Show Labels"
						alignText="left"
						text={isOpen && 'Show Labels'}
						minimal
					/>
					<GraphControlDivider />
					<Button
						cy-test="export-graph"
						rightIcon={<CarbonIcon icon={Export16} />}
						onClick={exportSVG}
						title="Export Graph"
						text={isOpen && 'Export Graph'}
						alignText="left"
						minimal
					/>
				</GraphControlButtonGroup>
				<GraphControlButtonGroup vertical>
					<Button
						cy-test="zoom-in"
						rightIcon={<CarbonIcon icon={Add16} />}
						onClick={zoomIn}
						title="Zoom In"
						text={isOpen && 'Zoom In'}
						alignText="left"
						minimal
					/>
					<GraphControlDivider />
					<Button
						cy-test="zoom-out"
						rightIcon={<CarbonIcon icon={Subtract16} />}
						onClick={zoomOut}
						title="Zoom Out"
						text={isOpen && 'Zoom Out'}
						alignText="left"
						minimal
					/>
					<GraphControlDivider />
					<Button
						cy-test="center-graph"
						rightIcon={<CarbonIcon icon={CenterSquare16} />}
						onClick={zoomToFit}
						title="Zoom To Fit"
						text={isOpen && 'Zoom To Fit'}
						alignText="left"
						minimal
					/>
				</GraphControlButtonGroup>
			</div>
		);
	}
);

const rootStyle = css`
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`;

const controlGroupStyle = css`
	margin-bottom: 0.5rem;
	background-color: ${CoreTokens.Background1};
	box-shadow: ${CoreTokens.Elevation2};
`;
const GraphControlButtonGroup = styled(ButtonGroup)`
	${controlGroupStyle}
	.${Classes.BUTTON} {
		margin-bottom: 0 !important;
	}
`;
const GraphControlDivider = styled(Divider)`
	margin: 0;
`;

// SettingsStyle
const settingsWrapperStyle = css`
	padding: 0.75rem;
	min-width: 120px;
	position: relative;
`;
const settingsCloseStyle = css`
	position: absolute;
	top: 0;
	right: 0;
	margin: 0.5rem;
`;

// LegendStyle
const svgStyle = {
	height: 24,
	width: 56,
	center: 12,
	radius: 6,
};
const legendTitle = css`
	margin-bottom: 0.5rem;
`;
const legendItemStyle = css`
	display: flex;
	align-items: center;
	gap: 0.25rem;

	&:not(:last-child) {
		margin-bottom: 0.25rem;
	}
`;
const legendLabelStyle = css``;
const legendNodeStyle = css``;
const legendLineStyle = css``;
