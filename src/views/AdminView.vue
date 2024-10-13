<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Admin Dashboard</h1>
        <p class="text-center">
          Only administrators can access this page. Here, you can view all user details, manage users, and perform administrative tasks.
        </p>
      </div>
    </div>
    <div class="buttons mt-4">
      <button @click="showTable = true" class="btn btn-info me-2">View Users</button>
      <button @click="showTable = false" class="btn btn-secondary">View Role Distribution</button>
    </div>
    <!-- User Table View -->
    <div class="user-table mt-4" v-if="showTable">
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
      <div class="export-buttons mt-3">
        <button @click="exportToCSV" class="btn btn-secondary me-2">Export to CSV</button>
        <button @click="exportToPDF" class="btn btn-secondary">Export to PDF</button>
      </div>
    </div>

    <!-- Role Distribution Pie Chart View -->
    <div class="user-table mt-4" v-else>
      <canvas id="userRolesChart" width="400" height="400"></canvas>
    </div>
    


  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';

export default {
  setup() {
    const router = useRouter();
    const db = getFirestore();
    
    const users = ref([]);
    const columns = ['Username', 'Email', 'Status', 'Role'];
    const globalSearch = ref('');
    const columnSearch = ref(Array(columns.length).fill(''));
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const filteredData = ref([]);
    const selectedUsers = ref([]);
    const showTable = ref(true);
    const totalUsers = ref(0);
    const userRoleCounts = ref({ admin: 0, user: 0, viewer: 0 });

    let chartInstance = null;

    // Fetch users from Firestore
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

    // Fetch user stats for chart
    const fetchUserStats = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      totalUsers.value = querySnapshot.size;
      userRoleCounts.value = { admin: 0, user: 0, viewer: 0 }; // Reset counts

      querySnapshot.forEach((doc) => {
        const role = doc.data().role;
        if (userRoleCounts.value[role] !== undefined) {
          userRoleCounts.value[role]++;
        }
      });

      renderChart();
    };

    const renderChart = () => {
      const ctx = document.getElementById('userRolesChart').getContext('2d');
      
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(userRoleCounts.value),
          datasets: [{
            data: Object.values(userRoleCounts.value),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    };

    // Watch showTable to render chart when needed
    watch(showTable, (newValue) => {
      if (!newValue) {
        fetchUserStats();
      }
    });

    // Watch globalsearch to render chart when needed
    watch(globalSearch, () => {
      filterData();
    });

    onMounted(() => {
      fetchUsers();
    });

    // Computed properties for pagination
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredData.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredData.value.length / itemsPerPage.value);
    });

    // Filter data based on search
    const filterData = () => {
      filteredData.value = users.value.filter((user) => {
        return (
          Object.keys(user).some((key) => {
            return (
              user[key]
                .toString()
                .toLowerCase()
                .includes(globalSearch.value.toLowerCase())
            );
          }) &&
          columnSearch.value.every((search, index) => {
            if (!search) return true;
            const key = columns[index].toLowerCase();
            return (
              user[key]
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase())
            );
          })
        );
      });
      currentPage.value = 1;
    };

    const filterColumn = (index) => {
      filterData();
    };

    // Pagination controls
    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    // Export to CSV
    const exportToCSV = () => {
      const csv = Papa.unparse(filteredData.value);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'User_Data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Export to PDF
    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.text('User Management', 20, 10);
      const data = filteredData.value.map(user => columns.map(column => user[column.toLowerCase()]));
      doc.autoTable({
        head: [columns],
        body: data,
      });
      doc.save('User_Data.pdf');
    };

    return {
      columns,
      globalSearch,
      columnSearch,
      currentPage,
      itemsPerPage,
      paginatedData,
      totalPages,
      filterColumn,
      filterData,
      nextPage,
      prevPage,
      exportToCSV,
      exportToPDF,
      showTable,
      totalUsers,
      userRoleCounts,
      navigateToBulkEmail,
      selectAllUsers,
      selectedUsers
    };

  }
};
</script>

<style scoped>
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}
.user-table {
  margin-top: 20px;
}
.search-box, .column-search {
  margin: 0.5em;
  padding: 0.3em;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}
th, td {
  padding: 0.5em;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  cursor: pointer;
}
.pagination {
  text-align: center;
  margin-top: 10px;
}
.pagination button {
  margin: 0 5px;
  padding: 0.5em 1em;
}
.export-buttons {
  text-align: center;
}
</style>
