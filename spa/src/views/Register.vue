<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

// Component State
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Plugins
const router = useRouter();
const authStore = useAuthStore();

// Methods
const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  
  const result = await authStore.register(email.value, password.value);
  
  if (result.success) {
    router.push('/dashboard');
  } else {
    errorMessage.value = result.message || 'Registro fallido. Por favor intente de nuevo.';
  }
  
  isLoading.value = false;
};
</script>

<template>
  <div class="auth-container">
    <Card class="auth-card">
      <template #header>
        <div class="auth-header">
          <img src="/gold_cargo.png" alt="Logo de Gold Cargo" class="auth-logo" />
          <h1>Gold Cargo Smart</h1>
          <p class="subtitle">Cree su cuenta</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="field">
            <label for="email">Correo Electrónico</label>
            <InputText 
              id="email" 
              v-model="email" 
              type="email" 
              placeholder="Ingrese su correo"
              fluid
              required 
            />
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <Password 
              id="password" 
              v-model="password" 
              toggleMask 
              placeholder="Cree una contraseña"
              fluid
              required 
            >
              <template #footer>
                <ul class="password-hints">
                  <li>Al menos una minúscula</li>
                  <li>Al menos una mayúscula</li>
                  <li>Al menos un número</li>
                  <li>Mínimo 8 caracteres</li>
                </ul>
              </template>
            </Password>
          </div>

          <div class="field">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <Password 
              id="confirmPassword" 
              v-model="confirmPassword" 
              :feedback="false" 
              toggleMask 
              placeholder="Confirme su contraseña"
              fluid
              required 
            />
          </div>

          <Message v-if="errorMessage" severity="error" variant="simple" size="1.4rem">{{ errorMessage }}</Message>

          <Button 
            type="submit" 
            :label="isLoading ? 'Creando Cuenta...' : 'Registrarse'" 
            :loading="isLoading" 
            icon="pi pi-user-plus"
            fluid
          />

          <div class="auth-footer">
            <p>
              ¿Ya tiene una cuenta? 
              <router-link to="/login" class="login-link">Inicie sesión aquí</router-link>
            </p>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 35rem;
  box-shadow: 0 0.4rem 2rem rgba(0, 0, 0, 0.08);
  border-radius: 1.2rem;
}

.auth-header {
  text-align: center;
  padding: 2rem 1.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .auth-logo {
    width: 8rem;
    height: auto;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    color: #1e293b;
    font-weight: 700;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    color: #64748b;
    font-size: 1.2rem;
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0.5rem;

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: #334155;
      font-size: 1.2rem;
    }
  }
}

.password-hints {
  margin: 0;
  padding: 1rem 0 0 1.5rem;
  list-style-type: disc;
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.5;
}

.auth-footer {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1.2rem;
  color: #64748b;

  .login-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }
}

:deep(.p-password-input) {
  width: 100%;
}
</style>