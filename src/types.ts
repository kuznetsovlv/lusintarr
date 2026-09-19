/**
 * Re-exports public shared types for convenient internal imports.
 *
 * Additional types declared in this module are internal to the project and are
 * not exported from the package entry point.
 */
export type * from './publicTypes';

/**
 * Layout modes used by internal Storybook helpers.
 *
 * This type is not part of the public package API.
 */
export type Layout = 'inline' | 'block';
