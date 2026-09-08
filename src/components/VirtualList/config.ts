import {tv} from 'tailwind-variants';

/**
 * Styles the VirtualList viewport.
 *
 * The viewport provides native browser scrolling on both axes. Its actual
 * available size is measured by VirtualList and used to determine which items
 * should be rendered.
 */
export const viewport = tv({
  base: 'ltw:overflow-auto',
});

/**
 * Styles the semantic `ul` or `ol` element used as the virtual list canvas.
 *
 * The list establishes a relative positioning context for virtualized items
 * while preserving the browser's inline padding for outside list markers.
 * Inline padding is removed when markers are absent or positioned inside.
 */
export const list = tv({
  base: [
    'ltw:relative',
    'ltw:box-border',
    'ltw:min-w-full',
    'ltw:w-fit',
    'ltw:h-fit',
    'ltw:m-0',
    'ltw:py-0',
    'ltw:border-0',
    'ltw:bg-transparent',
  ],
  variants: {
    type: {
      none: 'ltw:list-none ltw:ps-0',
      disc: 'ltw:list-disc',
      circle: 'ltw:list-[circle]',
      square: 'ltw:list-[square]',
      '1': 'ltw:list-decimal',
      A: 'ltw:list-[upper-alpha]',
      a: 'ltw:list-[lower-alpha]',
      I: 'ltw:list-[upper-roman]',
      i: 'ltw:list-[lower-roman]',
      custom: 'ltw:list-none',
    },
    position: {
      inside: 'ltw:list-inside',
      outside: 'ltw:list-outside',
    },
  },

  compoundVariants: [
    {
      position: 'inside',
      class: 'ltw:ps-0',
    },
  ],
});
