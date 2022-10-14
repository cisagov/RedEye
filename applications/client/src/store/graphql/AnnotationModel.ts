import { ExtendedModel, model } from 'mobx-keystone';
import { AnnotationModelBase } from './AnnotationModel.base';

/* A graphql query fragment builders for AnnotationModel */
export { annotationModelPrimitives, AnnotationModelSelector, selectFromAnnotation } from './AnnotationModel.base';

/**
 * AnnotationModel
 */
@model('Annotation')
export class AnnotationModel extends ExtendedModel(AnnotationModelBase, {}) {}
