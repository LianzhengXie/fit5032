import { createStore } from 'vuex';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import db from '../firebase/init';

const store = createStore({
  state: {
    isAuthenticated: false,
    userRole: null
  },
  mutations: {
    setAuthState(state, status) {
      state.isAuthenticated = status;
    },
    setUserRole(state, role) {
      state.userRole = role;
    }
  },
  actions: {
    initializeAuth({ commit }) {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          commit('setAuthState', true);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const role = userDoc.exists() ? userDoc.data().role : 'user';
          commit('setUserRole', role);
        } else {
          commit('setAuthState', false);
          commit('setUserRole', null);
        }
      });
    },
    async login({ commit }, { email, password }) {
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        commit('setAuthState', true);

        // Retrieve the role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'user';
        commit('setUserRole', role);
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },
    async logout({ commit }) {
      const auth = getAuth();
      try {
        await signOut(auth);
        commit('setAuthState', false);
        commit('setUserRole', null);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    userRole: (state) => state.userRole
  }
});

export default store;