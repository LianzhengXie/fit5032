<template>
  <div class="container mt-5">
    <h1 class="text-center">Admin Dashboard</h1>
    <div class="user-table mt-4">
      <h2>User Management</h2>
      <input
        type="text"
        v-model="globalSearch"
        placeholder="Search all columns..."
        class="search-box"
      />
      <table class="display" style="width:100%">
        <thead>
          <tr>
            <th><input type="checkbox" @click="selectAllUsers" /> All</th>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedData" :key="user.email">
            <td><input type="checkbox" v-model="selectedUsers" :value="user.email" /></td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.status }}</td>
            <td>{{ user.role }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
      <div class="mt-3">
        <button @click="navigateToBulkEmail" class="btn btn-primary" :disabled="selectedUsers.length === 0">Send Bulk Email</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  setup() {
    const db = getFirestore();
    const router = useRouter();

    const users = ref([]);
    const columns = ['Username', 'Email', 'Status', 'Role'];
    const globalSearch = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const filteredData = ref([]);
    const selectedUsers = ref([]);

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      users.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      filteredData.value = [...users.value];
    };

    const navigateToBulkEmail = () => {
      router.push({ name: 'SendBulkEmail', query: { emails: selectedUsers.value } });
    };

    const selectAllUsers = () => {
      if (selectedUsers.value.length === filteredData.value.length) {
        selectedUsers.value = [];
      } else {
        selectedUsers.value = filteredData.value.map(user => user.email);
      }
    };

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredData.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

    onMounted(fetchUsers);

    return {
      columns,
      globalSearch,
      currentPage,
      itemsPerPage,
      paginatedData,
      totalPages,
      selectedUsers,
      selectAllUsers,
      navigateToBulkEmail,
    };
  }
};
</script>
