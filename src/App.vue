<template>
  <div>
    <h1>Welcome to Vue 3!</h1>
    <p>This is your new Vue app inside the using-request project.</p>
    <button @click="fetchMessage">Get Server Message</button>
    <div v-if="message">Server says: {{ message }}</div>
    <div v-if="error" style="color: red">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      error: ''
    };
  },
  methods: {
    async fetchMessage() {
      this.message = '';
      this.error = '';
      try {
        const response = await fetch('http://localhost:3000/make-request');
        if (!response.ok) {
          this.error = 'Network response was not ok';
          return;
        }
        const data = await response.json();
        this.message = data.message;
      } catch (err) {
        this.error = 'Request failed: ' + err.message;
      }
    }
  }
};
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
