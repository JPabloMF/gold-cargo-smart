<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';

const router = useRouter();
const authStore = useAuthStore();
const mobileMenuVisible = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const menuItems = [
  { label: 'Resumen', icon: 'house', to: '/dashboard' },
  { label: 'Historial de Cotizaciones', icon: 'clock-rotate-left', to: '/dashboard/history' },
  { label: 'Gestión de Tarifas', icon: 'file-excel', to: '/dashboard/rates' },
  { label: 'Ingresos', icon: 'hand-holding-dollar', to: '/dashboard/income' }
];

const closeMobileMenu = () => {
  mobileMenuVisible.value = false;
};
</script>

<template>
  <div class="admin-layout">
    <!-- Desktop Sidebar (Visible on large screens) -->
    <aside class="sidebar desktop-only">
      <div class="brand">
        <img src="/gold_cargo.png" alt="Logo" class="sidebar-logo" />
        <h2>Gold Cargo</h2>
      </div>
      
      <nav class="nav-links flex-grow">
        <router-link 
          v-for="item in menuItems" 
          :key="item.to" 
          :to="item.to" 
          class="nav-item"
          active-class="active"
          exact-active-class="exact-active"
        >
          <font-awesome-icon :icon="['fas', item.icon]" class="nav-icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <font-awesome-icon icon="user" class="footer-icon" />
          <span class="email" :title="authStore.user?.email">{{ authStore.user?.email }}</span>
        </div>
        <Button 
          severity="danger" 
          variant="text" 
          class="logout-btn" 
          @click="handleLogout" 
          fluid
        >
          <font-awesome-icon icon="power-off" class="mr-3" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </aside>

    <!-- Mobile Header & Drawer -->
    <div class="mobile-header mobile-only">
      <Button @click="mobileMenuVisible = true" variant="text" severity="secondary">
        <font-awesome-icon icon="bars" />
      </Button>
      <div class="mobile-brand">
        <img src="/gold_cargo.png" alt="Logo" class="mobile-logo" />
        <span>Gold Cargo</span>
      </div>
      <div class="spacer"></div>
    </div>

    <Drawer v-model:visible="mobileMenuVisible" header="Menú" class="mobile-drawer">
      <template #header>
        <div class="brand-drawer">
          <img src="/gold_cargo.png" alt="Logo" class="sidebar-logo" />
          <span>Gold Cargo</span>
        </div>
      </template>
      
      <nav class="nav-links flex-grow">
        <router-link 
          v-for="item in menuItems" 
          :key="item.to" 
          :to="item.to" 
          class="nav-item"
          active-class="active"
          exact-active-class="exact-active"
          @click="closeMobileMenu"
        >
          <font-awesome-icon :icon="['fas', item.icon]" class="nav-icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <template #footer>
        <div class="sidebar-footer">
          <div class="user-info">
            <font-awesome-icon icon="user" class="footer-icon" />
            <span class="email">{{ authStore.user?.email }}</span>
          </div>
          <Button 
            severity="danger" 
            variant="text" 
            class="logout-btn" 
            @click="handleLogout" 
            fluid
          >
            <font-awesome-icon icon="power-off" class="mr-3" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </template>
    </Drawer>

    <!-- Main Content -->
    <main class="content-area">
      <router-view></router-view>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: #f1f5f9;
  flex-direction: row;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
}

// Reusable Nav Styles
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0 0.6rem;

  &.flex-grow {
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    color: #64748b;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 600;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    .nav-icon {
      font-size: 1.4rem;
      width: 1.8rem;
      text-align: center;
    }

    &:hover {
      background-color: #f8fafc;
      color: #3b82f6;
    }

    &.active, &.exact-active {
      background-color: #eff6ff;
      color: #2563eb;
      .nav-icon { color: #2563eb; }
    }
  }
}

.sidebar-footer {
  padding: 1.2rem;
  border-top: 0.1rem solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #475569;
    font-size: 1.1rem;
    
    .footer-icon {
      font-size: 1.1rem;
      width: 1.4rem;
    }

    .email {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .logout-btn { 
    font-size: 1.1rem; 
    font-weight: 600; 
    padding: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}

.mr-3 {
  margin-right: 0.8rem;
}

// Desktop Specific
.sidebar {
  width: 20rem;
  height: 100vh;
  background-color: #ffffff;
  border-right: 0.1rem solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1.2rem 0;
  box-shadow: 0.4rem 0 1rem rgba(0, 0, 0, 0.02);

  .brand {
    padding: 0 1.2rem;
    margin-bottom: 2.5rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;

    .sidebar-logo { width: 2.8rem; height: auto; }
    h2 { margin: 0; font-size: 1.6rem; font-weight: 700; color: #1e293b; }
  }
}

// Mobile Specific
.mobile-header {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 0.6rem 1.2rem;
  border-bottom: 0.1rem solid #e2e8f0;
  gap: 0.8rem;

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 700;
    font-size: 1.4rem;
    color: #1e293b;

    .mobile-logo { width: 2rem; height: auto; }
  }
  .spacer { flex: 1; }
}

.brand-drawer {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 700;
  font-size: 1.4rem;
  color: #1e293b;
  .sidebar-logo { width: 2.4rem; height: auto; }
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background-color: #f8fafc;

  @media (max-width: 640px) {
    padding: 1.2rem;
  }
}

// Utility Visibility Classes
.desktop-only {
  @media (max-width: 1024px) { display: none; }
}

.mobile-only {
  @media (min-width: 1025px) { display: none; }
}

:deep(.mobile-drawer) {
  height: 100vh !important;
  display: flex;
  flex-direction: column;
  
  .p-drawer-content { 
    flex: 1; 
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
  }
}

// Global active class fix for the "Overview" link
.nav-item[href="/dashboard"].active:not(.exact-active) {
  background-color: transparent;
  color: #64748b;
  .nav-icon { color: #64748b; }
}
</style>