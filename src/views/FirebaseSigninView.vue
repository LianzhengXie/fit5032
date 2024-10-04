<template>
  <!-- 🗄️ W5. Login page -->
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
              <label for="email">Email address</label>
              <input type="email" class="form-control" id="email" v-model="email" placeholder="Email" required>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 offset-md-3">
              <label for="password">Password</label>
              <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required>
            </div>

          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Sign In</button>
            <p v-if="currentUser">
              Logged in as: {{ currentUser.email }} (Role: {{ userRole }})
            </p>
            <button @click="logout" class="btn btn-primary">Logout</button>
          </div>
        </form>
      </div>
    </div>
  </div>


 
</template>

<script>
  import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
  import { doc, getDoc } from "firebase/firestore"; // Firestore imports
  import db from '../firebase/init';
  
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
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          this.currentUser = userCredential.user;
  
          // Fetch the user's role from Firestore
          const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
          if (userDoc.exists()) {
            this.userRole = userDoc.data().role;
            console.log(`User logged in as ${this.currentUser.email} with role: ${this.userRole}`);
          } else {
            console.log('No such document');
          }
        } catch (error) {
          console.error('Error signing in: ', error);
        }
      },
      async logout() {
        const auth = getAuth();
        await signOut(auth);
        this.currentUser = null;
        this.userRole = '';
        console.log('User logged out');
      }
    },
    mounted() {
      const auth = getAuth();
      this.currentUser = auth.currentUser;
      if (this.currentUser) {
        console.log('Current user:', this.currentUser.email);
      }
    }
  };
  </script>
  