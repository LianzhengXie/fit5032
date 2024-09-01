<script setup>
import { ref, onMounted } from 'vue';

// List of items with names and descriptions
const projects = ref([
  { name: 'Project A', description: 'Description for project A', ratings: [], userRating: 0 },
  { name: 'Project B', description: 'Description for project B', ratings: [], userRating: 0 },
  { name: 'Project C', description: 'Description for project C', ratings: [], userRating: 0 }
]);

// Currently hovering stars, using objects to manage the hover state of each item
const hoverRating = ref({});

// Loading scoring data from localStorage
onMounted(() => {
  const storedRatings = JSON.parse(localStorage.getItem('projectRatings')) || [];
  if (storedRatings.length) {
    projects.value.forEach((project, index) => {
      project.ratings = storedRatings[index]?.ratings || [];
      project.userRating = storedRatings[index]?.userRating || 0;
      hoverRating.value[index] = project.userRating; // initialisation hoverRating
    });
  }
});

// Get the style of the star
const getStarClass = (project, star, index) => {
  if (hoverRating.value[index] >= star) {
    return 'star selected';
  } else if (project.userRating >= star) {
    return 'star selected';
  } else {
    return 'star';
  }
};

// Handling functions for user ratings
const rateProject = (index, rating) => {
  const project = projects.value[index];
  if (project.userRating) {
    project.ratings = project.ratings.filter(r => r !== project.userRating);
  }
  project.userRating = rating;
  project.ratings.push(rating);

  alert('Thank you for your rating!');
  saveRatings();
};

// Calculate the average rating of the project
const calculateAverageRating = (project) => {
  if (project.ratings.length === 0) return 0;
  const sum = project.ratings.reduce((a, b) => a + b, 0);
  return (sum / project.ratings.length).toFixed(1);
};

// Calculate the average rating for all items
const calculateOverallAverageRating = () => {
  const allRatings = projects.value.flatMap(project => project.ratings);
  if (allRatings.length === 0) return 0;
  const sum = allRatings.reduce((a, b) => a + b, 0);
  return (sum / allRatings.length).toFixed(1);
};

// Saving scores to localStorage
const saveRatings = () => {
  const ratingsData = projects.value.map(project => ({
    ratings: project.ratings,
    userRating: project.userRating
  }));
  localStorage.setItem('projectRatings', JSON.stringify(ratingsData));
};
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center">Rate Our Projects</h1>
    <div v-for="(project, index) in projects" :key="index" class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">{{ project.name }}</h5>
        <p class="card-text">{{ project.description }}</p>
        
        <div class="rating">
          <span 
            v-for="star in 5" 
            :key="star" 
            :class="getStarClass(project, star, index)" 
            @click="rateProject(index, star)" 
            @mouseover="hoverRating[index] = star"
            @mouseleave="hoverRating[index] = project.userRating"
          >
            &#9733;
          </span>
        </div>
        
        <p class="mt-2">Average Rating: {{ calculateAverageRating(project) }}</p>
      </div>
    </div>
    <div class="text-center mt-5">
      <h3>Overall Average Rating: {{ calculateOverallAverageRating() }}</h3>
    </div>
  </div>
</template>


<style scoped>
.card {
  margin-bottom: 1rem;
}

.rating {
  display: inline-block;
}

.star {
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
}

.star.selected {
  color: #ffca28;
}
</style>
