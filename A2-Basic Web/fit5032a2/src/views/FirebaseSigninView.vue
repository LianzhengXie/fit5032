<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">🗄️ Library Login</h1>
          <p class="text-center">
            Let's build some more advanced features into our form.
          </p>
          <form @submit.prevent="signInUser">
            <div class="row mb-3">
              <div class="col-md-6 offset-md-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="email"
                  placeholder="Email"
                  required
                />
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6 offset-md-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="Password"
                  required
                />
              </div>
            </div>
  
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Sign In</button>
              <p v-if="currentUser">
                Logged in as: {{ currentUser.email }} (Role: {{ userRole }})
              </p>
              <button v-if="currentUser" @click="logout" class="btn btn-secondary">Logout</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
  import { doc, getDoc } from "firebase/firestore";
  import db from '../firebase/init';
  import { useToast } from 'vue-toastification';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        currentUser: null,
        userRole: ''
      };
    },
    methods: {
      async signInUser() {
        const auth = getAuth();
        const toast = useToast();
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          this.currentUser = userCredential.user;
  
          // Fetch the user's role from Firestore
          await this.fetchUserRole();
          toast.success('Signed in successfully!');
        } catch (error) {
          toast.error('Error signing in. Please try again.');
          console.error('Error signing in: ', error);
        }
      },
      async fetchUserRole() {
        const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role;
          console.log(`User logged in as ${this.currentUser.email} with role: ${this.userRole}`);
        } else {
          console.log('No such document');
        }
      },
      async logout() {
        const auth = getAuth();
        const toast = useToast();
        try {
          await signOut(auth);
          this.currentUser = null;
          this.userRole = '';
          toast.info('Logged out successfully!');
          console.log('User logged out');
        } catch (error) {
          toast.error('Error logging out. Please try again.');
          console.error('Error logging out: ', error);
        }
      }
    },
    mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          await this.fetchUserRole();
        } else {
          this.currentUser = null;
          this.userRole = '';
        }
      });
    }
  };
  </script>
  
  