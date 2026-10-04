export function PendingFeature({ name }: { name: string }) {
  return (
    <section>
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="mt-4">
        Rota preparada. Este fluxo ainda não foi implementado.
      </p>
    </section>
  )
}
