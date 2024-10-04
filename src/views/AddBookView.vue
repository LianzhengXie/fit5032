<template>
    <!-- 🗄️ W9. Add Book -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">🗄️ Add Book</h1>
          <p class="text-center">
            Adding new book data in uppercase and storing it in the Firestore
          </p>
          <form @submit.prevent="addBook">
            <div class="row mb-3">
              <div class="col-md-6 offset-md-3">
                <label for="isbn">ISBN:</label>
                <input type="isbn" class="form-control" id="isbn" v-model="isbn" placeholder="isbn" required>
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6 offset-md-3">
                <label for="name">Name: </label>
                <input type="name" class="form-control" id="name" v-model="name" placeholder="name" required>
              </div>
  
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Add book</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  
  
   
  </template>
  
<script>
import { ref } from 'vue';
import db from '../firebase/init'; 
import { collection, addDoc } from 'firebase/firestore'; 
import BookList from '../components/BookList.vue';

export default {
    setup() {
        const isbn = ref('');
        const name = ref('');

        const addBook = async () => {
            try {
                const isbnNumber = Number(isbn.value);
                if (isNaN(isbnNumber)) {
                    alert('ISBN must be a valid number');
                    return;
                }

                await addDoc(collection(db, 'books'), {
                    isbn: isbnNumber,
                    name: name.value
                });

                isbn.value = '';
                name.value = '';
                alert('Book added successfully!');
            } catch (error) {
                console.error('Error adding book: ', error);
                alert('Failed to add book, please check the console for errors.');
            }
        };

        return {
            isbn,
            name,
            addBook,
        };
    },
    components: {
        BookList,
    },
};
</script>
