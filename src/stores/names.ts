import { acceptHMRUpdate, defineStore } from 'pinia'

export const useNamesStore = defineStore('names', () => {
  let currentName = $ref('')
  const previousNames = $ref(new Set<string>())

  const usedNames = $computed(() => [...previousNames].sort())
  const otherNames = $computed(() =>
    usedNames.filter((name) => name !== currentName)
  )

  const pushName = (name: string) => {
    if (name === currentName) {
      return
    }

    if (currentName) {
      previousNames.add(currentName)
    }

    currentName = name
  }

  return $$({ currentName, otherNames, pushName })
})

// STARTER_DOCS: https://pinia.vuejs.org/cookbook/hot-module-replacement.html
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNamesStore, import.meta.hot))
}
