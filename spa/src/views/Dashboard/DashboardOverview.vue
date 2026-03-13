<script setup>
import Card from 'primevue/card';

const stats = [
  { label: 'Total Cotizaciones', value: '124', icon: 'pi pi-file-edit', color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Pendientes', value: '12', icon: 'pi pi-clock', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Completadas', value: '108', icon: 'pi pi-check-circle', color: '#10b981', bg: '#ecfdf5' },
  { label: 'Tarifas Activas', value: '4 Continentes', icon: 'pi pi-globe', color: '#8b5cf6', bg: '#f5f3ff' }
];
</script>

<template>
  <div class="dashboard-overview">
    <div class="header">
      <h1>Resumen del Tablero</h1>
      <p>¡Bienvenido de nuevo! Esto es lo que está sucediendo con sus cotizaciones hoy.</p>
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
            <span class="text-lg font-bold">Estado del Sistema</span>
          </div>
        </template>
        <template #content>
          <div class="status-placeholder">
            <i class="pi pi-shield-check text-green-500 mb-2"></i>
            <h3>Todos los Servicios Operativos</h3>
            <p>Los sistemas de Base de Datos y Gestión de Tarifas están funcionando normalmente.</p>
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
      font-size: 1.8rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.3rem;
    }
    p {
      font-size: 1.2rem;
      color: #64748b;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.2rem;
}

.stat-card {
  border-radius: 0.8rem;
  border: 0.1rem solid #e2e8f0;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.05);

  .stat-content {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .stat-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
      font-size: 1.8rem;
    }
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 1.1rem;
      color: #64748b;
      font-weight: 500;
    }

    .value {
      font-size: 1.6rem;
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
  padding: 3rem 0;
  text-align: center;

  i {
    font-size: 3rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 1.2rem;
    color: #64748b;
  }
}

.mt-8 {
  margin-top: 2rem;
}
</style>