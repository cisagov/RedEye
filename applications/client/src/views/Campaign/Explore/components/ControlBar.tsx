import { Alignment, Button, Intent, MenuItem } from '@blueprintjs/core';
import type { ItemRenderer } from '@blueprintjs/select';
import { CaretDown16, CaretUp16, ChevronSort16, Minimize16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { DropdownItem } from '@redeye/client/components';
import { CarbonIcon, createSorter, customIconPaths, Dropdown } from '@redeye/client/components';
import type { SortOption } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { Tabs } from '@redeye/client/types/explore';
import { sortOptions } from '@redeye/client/views';
import { FlexSplitter, Tokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useState } from 'react';

type ControlBarProps = ComponentProps<'div'> & {
	type: Tabs;
	filter: string;
	sortBy?: SortOption | null;
	setSortBy: (sortBy: SortOption) => void;
	isCollapsible?: boolean;
	isAscending: boolean;
	toggleIsAscending: () => void;
};

// eslint-disable-next-line
const renderSort: ItemRenderer<{ key: string; label: string }> = (item, { handleClick, modifiers }) => {
	if (!modifiers.matchesPredicate) {
		return null;
	}
	return (
		<MenuItem
			css={css`
				text-transform: capitalize;
			`}
			active={modifiers.active}
			key={item.key}
			onClick={handleClick}
			text={item.label}
			cy-test={item.label}
		/>
	);
};

export const ControlBar = observer<ControlBarProps>(
	({ type, sortBy, setSortBy, filter, isCollapsible = false, isAscending, toggleIsAscending, ...props }) => {
		const store = useStore();
		// TODO: add state for Select.activeItem(s) and sort order?
		const [expandAll, setExpandAll] = useState(true);

		return (
			<div
				css={css`
					display: flex;
					border-bottom: 1px solid ${Tokens.CoreTokens.BorderColorNormal};
					padding: 2px 0.5rem;
					align-items: center;
				`}
				{...props}
			>
				{/*
          <Select // TODO: Filter things?
            popoverProps={{ minimal: true }}
            filterable={false}
            activeItem={null}
            itemRenderer={renderSort}
            items={[]}
            onItemSelect={() => null}
          >
            <Button
              icon={<CarbonIcon icon={Filter16} />}
              // rightIcon={<CarbonIcon icon={ChevronDown16} />}
              text={<Txt>
                <Txt css={labelStyle}>Filter:</Txt>
                <Txt css={valueStyle}>{filter}</Txt>
              </Txt>}
              minimal
            />
          </Select>
        */}
				{isCollapsible && (
					<Button
						icon={<CarbonIcon icon={expandAll ? ChevronSort16 : Minimize16} />}
						// TODO: replace Minimize16 with custom icon for CollapseAll
						title={expandAll ? 'Expand All' : 'Collapse All'}
						onClick={() => {
							window.console.log('TODO: expand or collapse all list items');
							setExpandAll(!expandAll);
						}}
						minimal
					/>
				)}
				<Dropdown
					cy-test="sort-by"
					activeItem={sortOptions[type]?.find((opt) => opt.key === sortBy) as DropdownItem}
					items={(sortOptions[type].slice().sort(createSorter((x) => x.label.toLowerCase())) as DropdownItem[]) || []}
					onSelect={(item: { key: string; label: string }) => setSortBy(item.key as SortOption)}
					text={sortOptions[type]?.find((opt) => opt.key === sortBy)?.label ?? sortBy}
					labelText="Sort:"
				/>
				<Button
					icon={isAscending ? <CarbonIcon icon={CaretUp16} /> : <CarbonIcon icon={CaretDown16} />}
					onClick={toggleIsAscending}
					minimal
					title="Toggle ascending descending"
					small
				/>
				<FlexSplitter />
				{type === Tabs.COMMANDS &&
					!store.appMeta.blueTeam &&
					(!store.campaign?.commentStore.groupSelect ? (
						<Button
							cy-test="multi-command-comment"
							icon={<CarbonIcon icon={customIconPaths.multiComment16} />}
							alignText={Alignment.LEFT}
							intent={Intent.PRIMARY}
							onClick={() => store.campaign?.commentStore.setGroupSelect(true)}
							minimal
							text="Multi-Command Comment"
							small
						/>
					) : (
						<Button
							alignText={Alignment.LEFT}
							onClick={() => store.campaign?.commentStore.setGroupSelect(false)}
							minimal
							text="Cancel"
							small
						/>
					))}
			</div>
		);
	}
);
