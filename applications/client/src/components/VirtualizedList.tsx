import { ErrorFallback } from '@redeye/client/components';
import { observer } from 'mobx-react-lite';
import { ErrorBoundary } from 'react-error-boundary';
import type { ListProps, VirtuosoProps } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { useStore } from '../store';
import { createState } from './mobx-create-state';

type VirtualizedListProps = VirtuosoProps<ListProps, any> & {
	paddingBottom?: number;
	listRef?: any;
	initialIndex?: number;
};

export const VirtualizedList = observer<VirtualizedListProps>(
	({ children, paddingBottom = 200, listRef, initialIndex, itemsRendered, ...props }) => {
		const store = useStore();
		const flatChildren = Array.isArray(children) ? children?.flat() : children;
		const state = createState({
			clearGraphHover() {
				setTimeout(() => {
					store.campaign?.interactionState.onHoverOut({
						beacon: undefined,
						host: undefined,
						server: undefined,
					});
				}, 75);
			},
			updateScrollIndex(items) {
				store.router.replaceState({
					scrollKey: items[0]?.index,
				});
			},
		});

		return Array.isArray(flatChildren) ? (
			<Virtuoso
				onMouseLeave={state.clearGraphHover}
				initialTopMostItemIndex={initialIndex ?? (store.router.location.state?.scrollKey || 0)}
				itemsRendered={(items) => {
					if (itemsRendered) {
						itemsRendered(items);
					} else {
						state.updateScrollIndex(items);
					}
				}}
				itemContent={(index) => flatChildren[index]}
				totalCount={flatChildren.length}
				css={{ height: '100%' }}
				ref={listRef}
				overscan={100} // in px
				components={{ Footer: () => <div css={{ height: paddingBottom }} /> }}
				{...props}
			/>
		) : (
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<div>{children}</div>
			</ErrorBoundary>
		);
	}
);
