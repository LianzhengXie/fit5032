<template>
    <div class="container">
        <h2>Register</h2>
        <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" class="form-control" id="email" v-model="email" placeholder="Email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required>
        </div>
        <select v-model="role">
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
    </div>
</template>




  <script>
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { doc, setDoc } from "firebase/firestore"; // Firestore imports
  import db from '../firebase/init';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        role: 'viewer' // Default role
      };
    },
    methods: {
      async registerUser() {
        const auth = getAuth();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;
  
          // Save user role in Firestore
          await setDoc(doc(db, 'users', user.uid), {
            email: this.email,
            role: this.role
          });
  
          console.log('User registered successfully with role:', this.role);
        } catch (error) {
          console.error('Error registering user:', error);
        }
      }
    }
  };
  </script>
  