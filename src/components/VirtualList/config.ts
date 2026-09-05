import {tv} from 'tailwind-variants';

export const list = tv({
  variants: {
    type: {
      none: 'ltw:list-none',
      disc: 'ltw:list-disc',
      circle: 'ltw:list-[circle]',
      square: 'ltw:list-[square]',
      '1': 'ltw:list-decimal',
      A: 'ltw:list-[upper-alpha]',
      a: 'ltw:list-[lower-alpha]',
      I: 'ltw:list-[upper-roman]',
      i: 'ltw:list-[lower-roman]',
    },
  },
});
