<script setup>
import { ref, computed, onMounted } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import { storeToRefs } from 'pinia';
import { useQuoteHistoryStore } from '@/stores/quoteHistory';

const API_URL = import.meta.env.VITE_API_URL;

const totalQuotes = ref('...');
const activeRates = ref('...');

const historyStore = useQuoteHistoryStore();
const { entries: quotes } = storeToRefs(historyStore);

// --- Donut: load type breakdown ---
const typeChartData = computed(() => {
  const counts = {};
  for (const q of quotes.value) {
    const t = q.type ?? 'OTRO';
    counts[t] = (counts[t] ?? 0) + 1;
  }
  const labels = Object.keys(counts);
  const data = labels.map(l => counts[l]);
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'],
      hoverOffset: 6,
    }],
  };
});

const typeChartOptions = {
  cutout: '65%',
  plugins: {
    legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16 } },
    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}` } },
  },
};

// --- Bar: top 5 destinations ---
const destChartData = computed(() => {
  const counts = {};
  for (const q of quotes.value) {
    const d = q.destination ?? 'Desconocido';
    counts[d] = (counts[d] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  return {
    labels: sorted.map(([k]) => k),
    datasets: [{
      label: 'Cotizaciones',
      data: sorted.map(([, v]) => v),
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      barThickness: 28,
    }],
  };
});

const destChartOptions = {
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { precision: 0 }, grid: { color: '#f1f5f9' } },
    y: { ticks: { font: { size: 12 } }, grid: { display: false } },
  },
};

onMounted(async () => {
  historyStore.fetchEntries();

  const [quotesRes, ratesRes] = await Promise.allSettled([
    fetch(`${API_URL}/quotes/count`),
    fetch(`${API_URL}/rates`),
  ]);

  if (quotesRes.status === 'fulfilled' && quotesRes.value.ok) {
    const data = await quotesRes.value.json();
    totalQuotes.value = data.totalQuotes ?? 0;
  } else {
    totalQuotes.value = '–';
  }

  if (ratesRes.status === 'fulfilled' && ratesRes.value.ok) {
    const data = await ratesRes.value.json();
    const count = data.data?.length ?? 0;
    activeRates.value = count === 1 ? '1 Continente' : `${count} Continentes`;
  } else {
    activeRates.value = '–';
  }
});

</script>

<template>
  <div class="dashboard-overview">
    <div class="header">
      <h1>Resumen del Tablero</h1>
      <p>¡Bienvenido de nuevo! Esto es lo que está sucediendo con sus cotizaciones hoy.</p>
    </div>

    <div class="stats-grid">
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" :style="{ color: '#3b82f6', backgroundColor: '#eff6ff' }">
              <font-awesome-icon :icon="['fas', 'file-pen']" />
            </div>
            <div class="stat-info">
              <span class="label">Total Cotizaciones</span>
              <span class="value">{{ totalQuotes }}</span>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="stat-content">
            <div class="stat-icon" :style="{ color: '#8b5cf6', backgroundColor: '#f5f3ff' }">
              <font-awesome-icon :icon="['fas', 'globe']" />
            </div>
            <div class="stat-info">
              <span class="label">Tarifas Activas</span>
              <span class="value">{{ activeRates }}</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="charts-grid mt-8">
      <Card class="chart-card">
        <template #title>
          <div class="flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'chart-pie']" class="text-blue-500" />
            <span>Tipos de Carga</span>
          </div>
        </template>
        <template #content>
          <div v-if="quotes.length === 0" class="chart-empty">
            <font-awesome-icon :icon="['fas', 'chart-pie']" class="empty-icon" />
            <p>Sin datos aún</p>
          </div>
          <div v-else class="chart-wrapper">
            <Chart type="doughnut" :data="typeChartData" :options="typeChartOptions" />
          </div>
        </template>
      </Card>

      <Card class="chart-card">
        <template #title>
          <div class="flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'chart-bar']" class="text-purple-500" />
            <span>Top Destinos</span>
          </div>
        </template>
        <template #content>
          <div v-if="quotes.length === 0" class="chart-empty">
            <font-awesome-icon :icon="['fas', 'chart-bar']" class="empty-icon" />
            <p>Sin datos aún</p>
          </div>
          <div v-else class="chart-wrapper">
            <Chart type="bar" :data="destChartData" :options="destChartOptions" />
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
    font-size: 1.8rem;
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

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  gap: 1.2rem;
}

.chart-card {
  border-radius: 0.8rem;
  border: 0.1rem solid #e2e8f0;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.05);

  :deep(.p-card-title) {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1e293b;
  }
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  max-height: 22rem;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #94a3b8;
  gap: 0.8rem;

  .empty-icon {
    font-size: 2.5rem;
  }

  p {
    font-size: 1.2rem;
  }
}

.mt-8 {
  margin-top: 2rem;
}
</style>