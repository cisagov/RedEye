import { Button, Classes } from '@blueprintjs/core';
import { CarouselHorizontal32, Maximize16, Warning20 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, DialogCustom } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandModel, ModelType } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { NavBreadcrumbs } from '@redeye/client/views';
import { Spacer, Tokens, TokensAll, Txt } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type ScreenshotCommandProps = ComponentProps<'div'> & {
	command: CommandModel;
};

export const ScreenShotCommand = observer<ScreenshotCommandProps>(({ command }) => {
	const store = useStore();
	const { data, isLoading } = useQuery(
		['images', store.campaign.id, command.id],
		async () =>
			await store.graphqlStore.queryImages({
				campaignId: store.campaign?.id!,
				beaconId: command.beacon.id,
			})
	);
	const state = createState({
		get modalOpen(): boolean {
			return !!store.router.queryParams.screenshots;
		},
		get item() {
			const firstDelimiter = store.router.queryParams.screenshots?.indexOf('-');
			const modelType: ModelType = store.router.queryParams.screenshots?.substring(0, firstDelimiter) as ModelType;
			const id = store.router.queryParams.screenshots?.substring(firstDelimiter + 1);
			return store.campaign.interactionState.getModel(modelType, id);
		},
		get selectedImage() {
			return store.graphqlStore.images.get(store.router.queryParams.screenshot);
		},
		get isMultiImageResult() {
			return data?.images?.length ? data?.images?.length > 1 : false;
		},
		openModal(screenshotId?: string) {
			const queryParams: { screenshots: string; screenshot?: string } = {
				screenshots: `command-${command.id}`,
				screenshot: screenshotId,
			};
			store.router.updateQueryParams({ queryParams });
		},
		closeModal() {
			store.router.updateQueryParams({ queryParams: { screenshots: undefined, screenshot: undefined } });
		},
	});
	return (
		<>
			<div
				css={[
					isLoading ? imgDimensions : null,
					css`
						margin: 0.5rem 0;
					`,
				]}
				className={isLoading ? Classes.SKELETON : ''}
			>
				{!isLoading &&
					(data?.images?.length ? (
						<div tabIndex={-1} role="button" css={[imgDimensions, imgWrapperStyles]} onClick={() => state.openModal()}>
							{data.images?.[0]?.url && (
								<img
									cy-test="screenshot"
									src={`${store.auth.serverUrl}${data.images[0].url}`}
									css={[imgDimensions, imgStyles]}
									alt="Command Screenshot"
								/>
							)}
							{state.isMultiImageResult && (
								<div css={overlayMessageStyles}>
									<CarbonIcon icon={CarouselHorizontal32} />
									Multiple images found.
								</div>
							)}
							<Button
								icon={<CarbonIcon icon={Maximize16} />}
								css={buttonStyles}
								style={{ position: 'absolute', right: 0, top: 0 }}
								onClick={() => state.openModal()}
							/>
						</div>
					) : (
						<div
							css={css`
								color: ${Tokens.IntentColors.PtIntentDangerTextColor};
								display: flex;
								align-items: center;
							`}
						>
							<CarbonIcon icon={Warning20} />
							<Spacer />
							<Txt muted italic>
								Images not found
							</Txt>
						</div>
					))}
			</div>
			{/* Main Dialog */}
			<DialogCustom
				css={dialogOverrideStyles}
				isOpen={state.modalOpen}
				onClose={state.closeModal}
				title={<NavBreadcrumbs command={command} onNavigate={state.closeModal} showCurrent />}
			>
				{/* <DetailedDialogHeader
            close={s.closeRoot}
            command={command}
            title={`Screenshot${isMultiImageResult ? 's' : ''}`}
          /> */}
				{(data?.images?.length || 0) > 1 ? (
					<div css={multiImageWrapperStyles}>
						{data?.images?.map((image) => (
							<Button key={image.id} onClick={() => state.openModal(image.id)} css={imgButtonStyles}>
								<img css={[imgDimensions, imgStyles]} src={`${store.auth.serverUrl}${image.url}`} alt="Command Screenshot" />
							</Button>
						))}
						{/* Secondary dialog (if multiple images are found) */}
						<DialogCustom
							css={dialogOverrideStyles}
							isOpen={!!state.selectedImage}
							onClose={() => state.openModal()}
							title={
								// Add TODO: command name
								<NavBreadcrumbs command={command} onNavigate={state.closeModal} showCurrent />
							}
						>
							{!!state.selectedImage && (
								<img css={largeImgStyles} src={`${store.auth.serverUrl}${state.selectedImage.url}`} alt="Command Screenshot" />
							)}
						</DialogCustom>
					</div>
				) : (
					data?.images?.[0]?.url && (
						<img
							cy-test="large-screenshot"
							css={largeImgStyles}
							src={`${store.auth.serverUrl}${data?.images[0].url}`}
							alt="Command Screenshot"
						/>
					)
				)}
			</DialogCustom>
		</>
	);
});

const imgDimensions = css`
	max-width: 320px;
`;

const imgStyles = css`
	/* object-fit: cover; */
`;

const largeImgStyles = css`
	max-width: 90vw;
	max-height: 90vh;
`;

const buttonStyles = css`
	position: absolute;
	right: 0;
	/* background-color: ${Tokens.CoreTokens.Background2}; */
`;

const imgWrapperStyles = css`
	position: relative;
	cursor: pointer;
`;

const dialogOverrideStyles = css`
	margin: auto;
	width: auto;
	max-width: unset;
	padding: 0;
`;

const overlayMessageStyles = css`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: hsla(${TokensAll.BlackHsl}, 70%);
	font-family: ${Tokens.Variables.PtFontFamily};
	font-weight: 700;
`;

const multiImageWrapperStyles = css`
	margin: 1rem;
	display: grid;
	grid-gap: 1rem;
	justify-content: center;
	grid-template-columns: repeat(2, auto);
`;

const imgButtonStyles = css`
	padding: 0;

	img {
		display: block;
	}

	&:hover {
		opacity: 0.75;
	}
`;
