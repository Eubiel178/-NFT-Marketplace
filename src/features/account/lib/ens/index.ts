export const ensSuffix = '.eth'

// O frame separa o nome do sufixo; a API guarda o ENS completo ("ana.kurio.eth").
export function splitEns(ens: string) {
  return ens.endsWith(ensSuffix) ? ens.slice(0, -ensSuffix.length) : ens
}

export function joinEns(name: string) {
  const trimmed = name.trim()
  return trimmed ? `${trimmed}${ensSuffix}` : ''
}

// Os erros do ENS aparecem no campo do nome.
export function formField(field: string) {
  return field === 'ens' ? 'ensName' : field
}
