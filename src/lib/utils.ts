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
        'display-43-bold', 'display-32-bold', 'heading-28-bold', 'heading-24-bold', 'title-22-bold', 'title-22-regular',
        'title-21-regular', 'title-20-bold', 'title-20-medium', 'title-20-regular', 'body-large-18-bold',
        'body-large-18-medium', 'body-large-18-regular', 'body-large-17-bold', 'body-large-17-regular',
        'body-large-16-bold', 'body-large-16-medium', 'body-large-16-regular', 'body-15-bold', 'body-15-medium',
        'body-15-regular', 'body-14-bold', 'body-14-medium', 'body-14-regular', 'caption-13-medium',
        'caption-13-regular', 'caption-12-bold', 'caption-12-regular', 'tiny-10-medium', 'tiny-9-bold',
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
