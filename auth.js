// src/router/auth.js
import { ref, onMounted } from 'vue';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import db from '../firebase/init'; // Update path as needed
import { useToast } from 'vue-toastification';

// Authentication state
const isAuthenticated = ref(false);
const userRole = ref(null);

export const useAuth = () => {
  const auth = getAuth();

  // Monitor authentication state changes
  onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        isAuthenticated.value = true;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          userRole.value = userDoc.data().role;
        } else {
          userRole.value = 'user';
        }
      } else {
        isAuthenticated.value = false;
        userRole.value = null;
      }
    });
  });

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      isAuthenticated.value = true;

      // Retrieve the role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role;
      } else {
        userRole.value = 'user';
      }

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async (router) => {
    const toast = useToast(); // Initialize toast within the function
    try {
      await signOut(auth);
      isAuthenticated.value = false;
      userRole.value = null;
      router.push({ name: 'Login' });
      toast.info('Logged out successfully!');
      console.log('User logged out');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return { isAuthenticated, userRole, login, logout };
};