export function* splitEvery<T>(arr: T[], n: number) {
  let doneSoFar = 0
  for (; ;) {
    const subarr = arr.slice(doneSoFar, doneSoFar + n)
    yield subarr
    doneSoFar += subarr.length
    if (doneSoFar >= arr.length) break
  }
}
