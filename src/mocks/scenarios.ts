export const scenarios = ['default', 'empty', 'slow', 'variable-latency', 'network-error', 'http-500', 'unauthorized'] as const
export type Scenario = typeof scenarios[number]
const key = 'nft-marketplace:scenario'
export function getScenario(): Scenario {
  const value = localStorage.getItem(key)
  return scenarios.find((scenario) => scenario === value) || 'default'
}
export function setScenario(scenario: Scenario) { localStorage.setItem(key, scenario) }
