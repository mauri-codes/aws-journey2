import { authStore } from './AuthStore'
import { createContext } from "react"


class RootStore {
    authStore: typeof authStore
    constructor() {
        this.authStore = authStore
    }
}

const Store = new RootStore()

const StoreContext = createContext(Store)

export { Store, StoreContext }
