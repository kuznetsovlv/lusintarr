import {tv} from 'tailwind-variants';

export const viewport = tv({
  base: 'ltw:overflow-auto',
});

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
