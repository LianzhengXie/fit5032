<script setup>
    import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter()
    const goToLogin = () => {
      router.push({ name: 'Login' });
    };

  // Example Project Data
  const projects = ref([
    {
      title: 'Mindfulness Program',
      description: 'Learn techniques to stay present and reduce stress.',
      // link: '/projects/mindfulness'
    },
    {
      title: 'Support Groups',
      description: 'Join a community of people who understand your struggles.',
      // link: '/projects/support-groups'
    },
    {
      title: 'Therapy Resources',
      description: 'Find the right therapy options for you.',
      // link: '/projects/therapy-resources'
    }
  ]);
</script>

<template>
  <div class="home-container">
    <header class="hero-section">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1>Welcome to Mental Health Support</h1>
        <p>Your journey to better mental health starts here.</p>
        <div class="text-center">
                    <button type="button" @click="goToLogin" class="btn btn-primary me-2">Go to Login</button>
        </div>
      </div>
    </header>

    <section class="projects-section">
      <h2>Our Projects & Resources</h2>
      <div class="projects-container">
        <div class="project-card" v-for="(project, index) in projects" :key="index">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <!-- <router-link :to="project.link" class="btn btn-primary">Learn More</router-link> -->
        </div>
      </div>
    </section>
  </div>
</template>



<style scoped>
.hero-section {
  position: relative;
  background-image: url('../assets/mental-health-background.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 100px 20px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(37, 37, 37, 0.5); 
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
  color: #fff;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 1.5rem;
}

.projects-section {
  padding: 60px 20px;
  text-align: center;
}

.projects-section h2 {
  font-size: 2.5rem;
  margin-bottom: 40px;
}

.projects-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.project-card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 15px;
  width: 280px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.project-card h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.project-card p {
  font-size: 1rem;
  margin-bottom: 15px;
}

.project-card .btn {
  background-color: #007bff;
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  display: inline-block;
}

.project-card .btn:hover {
  background-color: #0056b3;
}
</style>
