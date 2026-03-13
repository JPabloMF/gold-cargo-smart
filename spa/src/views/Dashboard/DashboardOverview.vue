<script setup>
import Card from 'primevue/card';

const stats = [
  { label: 'Total Quotes', value: '124', icon: 'pi pi-file-edit', color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Pending Quotes', value: '12', icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Completed', value: '108', icon: 'pi pi-check-circle', color: '#10b981', bg: '#ecfdf5' },
  { label: 'Active Rates', value: '4 Continents', icon: 'pi pi-globe', color: '#8b5cf6', bg: '#f5f3ff' }
];
</script>

<template>
  <div class="dashboard-overview">
    <div class="header">
      <h1>Dashboard Overview</h1>
      <p>Welcome back! Here's what's happening with your quotes today.</p>
    </div>

    <div class="stats-grid">
      <Card v-for="stat in stats" :key="stat.label" class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" :style="{ color: stat.color, backgroundColor: stat.bg }">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <span class="label">{{ stat.label }}</span>
              <span class="value">{{ stat.value }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="recent-activity mt-8">
      <Card>
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-chart-line text-blue-500 text-lg"></i>
            <span class="text-lg font-bold">System Status</span>
          </div>
        </template>
        <template #content>
          <div class="status-placeholder">
            <i class="pi pi-shield-check text-green-500 mb-2"></i>
            <h3>All Services Operational</h3>
            <p>Database and Rate Management systems are running normally.</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-overview {
  .header {
    margin-bottom: 2rem;
    h1 {
      font-size: 1.8rem; // Reduced from 2.2rem
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.3rem;
    }
    p {
      font-size: 1.2rem; // Reduced from 1.4rem
      color: #64748b;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); // Reduced from 20rem
  gap: 1.2rem; // Reduced from 1.5rem
}

.stat-card {
  border-radius: 0.8rem; // Reduced from 1rem
  border: 0.1rem solid #e2e8f0;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.05);

  .stat-content {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .stat-icon {
    width: 4rem; // Reduced from 4.8rem
    height: 4rem;
    border-radius: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
      font-size: 1.8rem; // Reduced from 2.2rem
    }
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 1.1rem; // Reduced from 1.2rem
      color: #64748b;
      font-weight: 500;
    }

    .value {
      font-size: 1.6rem; // Reduced from 2rem
      font-weight: 700;
      color: #1e293b;
    }
  }
}

.status-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0; // Reduced from 4rem
  text-align: center;

  i {
    font-size: 3rem; // Reduced from 4rem
  }

  h3 {
    font-size: 1.5rem; // Reduced from 1.8rem
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 1.2rem; // Reduced from 1.3rem
    color: #64748b;
  }
}

.mt-8 {
  margin-top: 2rem;
}
</style>