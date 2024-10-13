<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Patient list</h1>
        <p class="text-center">
          Patient lists support sorting, searching, and paging (10 lines per page) to export data.
        </p>
      </div>
    </div>
  </div>
  <div class="table-container">
    <div class="col-md-8 offset-md-2">
      <input
        type="text"
        v-model="globalSearch"
        placeholder="Search..."
        class="form-control"
      />
      <div class="pagination-options">
        <label for="itemsPerPage">Rows per page:</label>
        <select v-model="itemsPerPage" @change="filterData">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
    
    <table ref="dataTable" class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column" @click="sortBy(column)">
            {{ column }}
            <span v-if="sortColumn === column">
              {{ sortDirection === 'asc' ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            <input
              type="text"
              v-model="columnSearch[index]"
              @input="filterColumn(index)"
              placeholder="Search {{ column }}"
              class="form-control"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in paginatedData" :key="row.ID">
          <td v-for="column in columns" :key="column">{{ row[column] }}</td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <div class="export-buttons">
      <button @click="exportToCSV">Export to CSV</button>
      <button @click="exportToPDF">Export to PDF</button>
    </div>
  </div>
</template>

<script>
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import mockData1 from '../assets/mockData1.json';

export default {
  props: ['title', 'data'],
  data() {
    return {
      columns: Object.keys(mockData1[0]), // Dynamic columns based on data
      globalSearch: '',
      columnSearch: Array(Object.keys(mockData1[0]).length).fill(''), // Search array per column
      currentPage: 1,
      itemsPerPage: 10,
      sortColumn: '',
      sortDirection: 'asc',
      originalData: mockData1,
      filteredData: []
    };
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }
  },
  methods: {
    // Sort the data by column
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortDirection = 'asc';
      }
      this.sortColumn = column;
      this.filteredData.sort((a, b) => {
        if (this.sortDirection === 'asc') {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
    },
    // Filter the data based on global and column search
    filterData() {
      this.filteredData = this.originalData.filter((row) => {
        return (
          Object.keys(row).some((key) => {
            return (
              row[key]
                .toString()
                .toLowerCase()
                .includes(this.globalSearch.toLowerCase())
            );
          }) &&
          this.columnSearch.every((search, index) => {
            if (!search) return true;
            const key = this.columns[index];
            return (
              row[key]
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase())
            );
          })
        );
      });
      this.currentPage = 1;
    },
    filterColumn(index) {
      this.filterData();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    exportToCSV() {
      const csv = Papa.unparse(this.filteredData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${this.title}_data.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportToPDF() {
      const doc = new jsPDF();
      doc.text(`${this.title}`, 20, 10);
      const data = this.filteredData.map(row => this.columns.map(column => row[column]));
      doc.autoTable({
        head: [this.columns],
        body: data,
      });
      doc.save(`${this.title}_data.pdf`);
    }
  },
  watch: {
    globalSearch() {
      this.filterData();
    }
  },
  created() {
    this.filteredData = [...this.originalData];
  }
};
</script>

<style scoped>
.table-container {
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.data-table {
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
}
.pagination button {
  margin: 0 5px;
  padding: 0.5em 1em;
}
.export-buttons {
  margin-top: 1em;
}
</style>