<template>
    <div>
      <h1>Books with ISBN > 1000</h1>
      <ul>
        <li v-for="book in books" :key="book.id">
          {{ book.name }} - ISBN: {{ book.isbn }}
          <button @click="deleteBook(book.id)">Delete</button>
          <button @click="editBook(book)">Edit</button>
        </li>
      </ul>
  
      <!-- Form for updating the selected book -->
      <div v-if="editingBook">
        <h2>Edit Book</h2>
        <form @submit.prevent="updateBook(editingBook.id)">
          <div>
            <label for="isbn">ISBN:</label>
            <input v-model="editingBook.isbn" type="text" id="isbn" />
          </div>
          <div>
            <label for="name">Name:</label>
            <input v-model="editingBook.name" type="text" id="name" />
          </div>
          <button type="submit">Update Book</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import db from '../firebase/init';
  import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
  
  export default {
    setup() {
      const books = ref([]);
      const editingBook = ref(null);
  
      const fetchBooks = async () => {
        try {
          // Query to fetch books with ISBN > 1000, ordered by ISBN, and limited to 10 books
          const q = query(
            collection(db, 'books'),
            where('isbn', '>', 1000),
            orderBy('isbn', 'asc'),
            limit(10) 
          );
          const querySnapshot = await getDocs(q);
          const booksArray = [];
          querySnapshot.forEach((doc) => {
            booksArray.push({ id: doc.id, ...doc.data() });
          });
          books.value = booksArray;
        } catch (error) {
          console.error('Error fetching books: ', error);
        }
      };
  
      const deleteBook = async (id) => {
        try {
          const bookRef = doc(db, 'books', id);
          await deleteDoc(bookRef);
          books.value = books.value.filter((book) => book.id !== id);
          alert('Book deleted successfully!');
        } catch (error) {
          console.error('Error deleting book: ', error);
        }
      };
  
      const editBook = (book) => {
        editingBook.value = { ...book }; // Create a copy of the book to edit
      };
  
      const updateBook = async (id) => {
        try {
          const bookRef = doc(db, 'books', id);
          await updateDoc(bookRef, {
            isbn: Number(editingBook.value.isbn),
            name: editingBook.value.name,
          });
  
          const updatedBookIndex = books.value.findIndex((book) => book.id === id);
          books.value[updatedBookIndex] = { ...editingBook.value }; // Update the local book list
          editingBook.value = null; // Reset the edit form
          alert('Book updated successfully!');
        } catch (error) {
          console.error('Error updating book: ', error);
        }
      };
  
      const cancelEdit = () => {
        editingBook.value = null;
      };
  
      onMounted(() => {
        fetchBooks();
      });
  
      return {
        books,
        editingBook,
        deleteBook,
        editBook,
        updateBook,
        cancelEdit,
      };
    },
  };
  </script>
  