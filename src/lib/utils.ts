import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// O tailwind-merge só conhece a escala padrão do Tailwind. Sem estes nomes do
// @theme (src/css/styles.css), ele trata text-body-14 como cor e descarta o
// tamanho quando a classe aparece junto de text-text-secondary.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'tiny-9', 'tiny-10', 'caption-12', 'caption-13', 'body-14', 'body-15', 'body-large-16', 'body-large-17',
        'body-large-18', 'title-20', 'title-21', 'title-22', 'heading-24', 'heading-28', 'display-32', 'display-43',
      ],
      color: [
        'ink', 'foreground', 'primary', 'secondary', 'surface-card', 'surface-dark', 'surface-raised', 'border',
        'border-soft', 'text-accent', 'text-secondary', 'error',
      ],
      radius: [
        '3', '4', '5', '6', '7', '8', '10', '11', '12', '13', '14', '15', '16', '17', '17-5', '18', '20', '22', '24',
        '25', '29', '31', '32', '40',
      ],
      shadow: ['cart-focus', 'buy-bar', 'wallet-selected', 'coinbase-selected'],
      'drop-shadow': ['tab-bar'],
      leading: ['10', '15', '16', '18', '20', '22', '24', '30', '40', '45', 'auto'],
      tracking: ['tight', 'wide'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
