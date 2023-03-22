import type { HeaderProps } from '@redeye/ui-styles';
import { Header } from '@redeye/ui-styles';

export const PanelHeader = ({ ...props }: HeaderProps) => <Header cy-test="panel-header" {...props} />;
