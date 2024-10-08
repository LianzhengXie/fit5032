// src/store/index.js
import { createStore } from 'vuex';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import db from '../firebase/init'; // Firestore initialization
import { useToast } from 'vue-toastification';

const store = createStore({
  state: {
    isAuthenticated: false,
    userRole: null,
    currentUser: null
  },
  mutations: {
    setAuthState(state, status) {
      state.isAuthenticated = status;
    },
    setUserRole(state, role) {
      state.userRole = role;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    }
  },
  actions: {
    initializeAuth({ commit }) {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          commit('setAuthState', true);
          commit('setCurrentUser', user);
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const role = userDoc.exists() ? userDoc.data().role : 'user';
            commit('setUserRole', role);
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        } else {
          commit('setAuthState', false);
          commit('setUserRole', null);
          commit('setCurrentUser', null);
        }
      });
    },

    async register({ commit }, { username, email, password, gender }) {
      const auth = getAuth();
      const toast = useToast();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional user info to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
          gender,
          role: 'user'
        });

        commit('setAuthState', true);
        commit('setUserRole', 'user');
        commit('setCurrentUser', user);
        toast.success('Registration successful!');
        return true;
      } catch (error) {
        console.error('Error registering user:', error);
        
        if (error.code === 'auth/email-already-in-use') {
          toast.error('Email already in use.');
        } else if (error.code === 'auth/weak-password') {
          toast.error('Password is too weak.');
        } else {
          toast.error('Registration failed. Please try again.');
        }
        return false;
      }
    },

    async login({ commit }, { email, password }) {
      const auth = getAuth();
      const toast = useToast();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        commit('setAuthState', true);
        commit('setCurrentUser', user);

        // Retrieve role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'user';
        commit('setUserRole', role);
        
        toast.success('Login successful!');
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        toast.error('Login failed. Please try again.');
        return false;
      }
    },

    async logout({ commit }) {
      const auth = getAuth();
      const toast = useToast();
      try {
        await signOut(auth);
        commit('setAuthState', false);
        commit('setUserRole', null);
        commit('setCurrentUser', null);
        toast.info('Logged out successfully!');
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error('Logout failed. Please try again.');
      }
    }
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    userRole: (state) => state.userRole,
    currentUser: (state) => state.currentUser
  }
});

export default store;
