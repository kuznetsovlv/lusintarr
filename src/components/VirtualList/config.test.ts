import {describe, expect, it} from 'vitest';

import {list, viewport} from './config';

describe('viewport', () => {
  it('enables native scrolling', () => {
    expect(viewport()).toContain('ltw:overflow-auto');
  });
});

describe('list', () => {
  it('applies the base layout styles', () => {
    const className = list();

    expect(className).toContain('ltw:relative');
    expect(className).toContain('ltw:box-border');
    expect(className).toContain('ltw:min-w-full');
    expect(className).toContain('ltw:w-fit');
    expect(className).toContain('ltw:h-fit');
  });

  it.each([
    ['none', 'ltw:list-none'],
    ['disc', 'ltw:list-disc'],
    ['circle', 'ltw:list-[circle]'],
    ['square', 'ltw:list-[square]'],
    ['1', 'ltw:list-decimal'],
    ['A', 'ltw:list-[upper-alpha]'],
    ['a', 'ltw:list-[lower-alpha]'],
    ['I', 'ltw:list-[upper-roman]'],
    ['i', 'ltw:list-[lower-roman]'],
  ] as const)('applies the "%s" list type', (type, expectedClass) => {
    expect(list({type})).toContain(expectedClass);
  });

  it('removes inline padding when markers are disabled', () => {
    expect(list({type: 'none', position: 'outside'})).toContain('ltw:ps-0');
  });

  it('removes inline padding for inside markers', () => {
    expect(list({type: 'disc', position: 'inside'})).toContain('ltw:ps-0');
  });

  it('preserves browser inline padding for outside markers', () => {
    expect(list({type: 'disc', position: 'outside'})).not.toContain('ltw:ps-0');
  });

  it.each([
    ['inside', 'ltw:list-inside'],
    ['outside', 'ltw:list-outside'],
  ] as const)('applies the "%s" marker position', (position, expectedClass) => {
    expect(list({position})).toContain(expectedClass);
  });

  it('preserves marker space for an outside custom marker', () => {
    const className = list({
      type: 'custom',
      position: 'outside',
    });

    expect(className).toContain('ltw:list-none');
    expect(className).toContain('ltw:list-outside');
    expect(className).not.toContain('ltw:ps-0');
  });

  it('removes marker space for an inside custom marker', () => {
    const className = list({
      type: 'custom',
      position: 'inside',
    });

    expect(className).toContain('ltw:list-none');
    expect(className).toContain('ltw:list-inside');
    expect(className).toContain('ltw:ps-0');
  });
});
