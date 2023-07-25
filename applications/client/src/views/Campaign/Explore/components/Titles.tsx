import type { FC } from 'react';
import type { HeaderProps } from '@redeye/ui-styles';
import { Header } from '@redeye/ui-styles';

export const PanelHeader: FC<HeaderProps> = ({ ...props }) => <Header cy-test="panel-header" {...props} />;
