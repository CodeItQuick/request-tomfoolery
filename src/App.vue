<template>
  <div>
    <h1>Welcome to Vue 3!</h1>
    <form @submit.prevent="register">
      <h2>Register</h2>
      <input v-model="registerUsername" placeholder="Username" required />
      <input v-model="registerPassword" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <form @submit.prevent="login">
      <h2>Login</h2>
      <input v-model="loginUsername" placeholder="Username" required />
      <input v-model="loginPassword" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <button @click="fetchMessage">Get Server Message (make-request)</button>
    <button @click="fetchAxiosMessage">Get Server Message (make-axios)</button>
    <button @click="fetchPromisifiedAxiosMessage">Get Server Message (make-promisified-axios)</button>
    <button @click="getProtected" v-if="token">Get Protected Message</button>
    <div v-if="message">Server says: {{ message }}</div>
    <div v-if="error" style="color: red">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      error: '',
      registerUsername: '',
      registerPassword: '',
      loginUsername: '',
      loginPassword: '',
      token: ''
    };
  },
  methods: {
    async register() {
      this.error = '';
      try {
        const res = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.registerUsername, password: this.registerPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        this.message = 'Registration successful!';
      } catch (err) {
        this.error = err.message;
      }
    },
    async login() {
      this.error = '';
      try {
        const res = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.loginUsername, password: this.loginPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        this.token = data.token;
        this.message = 'Login successful!';
      } catch (err) {
        this.error = err.message;
      }
    },
    async getProtected() {
      this.error = '';
      try {
        const res = await fetch('http://localhost:3000/protected', {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch protected message');
        this.message = data.message;
      } catch (err) {
        this.error = err.message;
      }
    },
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
    },
    async fetchAxiosMessage() {
      this.message = '';
      this.error = '';
      try {
        const response = await fetch('http://localhost:3000/make-axios');
        if (!response.ok) {
          this.error = 'Network response was not ok';
          return;
        }
        const data = await response.json();
        this.message = data.message;
      } catch (err) {
        this.error = 'Request failed: ' + err.message;
      }
    },
    async fetchPromisifiedAxiosMessage() {
      this.message = '';
      this.error = '';
      try {
        const response = await fetch('http://localhost:3000/make-promisified-axios');
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
