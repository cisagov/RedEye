import { ExtendedModel, model } from 'mobx-keystone';
import { BeaconMetaModelBase } from './BeaconMetaModel.base';

/* A graphql query fragment builders for BeaconMetaModel */
export { selectFromBeaconMeta, beaconMetaModelPrimitives, BeaconMetaModelSelector } from './BeaconMetaModel.base';

/**
 * BeaconMetaModel
 *
 * Data derived from the Beacon metadata line
 */
@model('BeaconMeta')
export class BeaconMetaModel extends ExtendedModel(BeaconMetaModelBase, {}) {}
