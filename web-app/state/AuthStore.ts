import { makeAutoObservable } from "mobx";
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';

class AuthStore {
    requiresAuth: boolean
    constructor() {
        makeAutoObservable(this)
        this.requiresAuth = false
    }
    setAuthRequirement (requiresAuth) {
        this.requiresAuth = requiresAuth
    }
}

const authStore = new AuthStore()

export { authStore }
