<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { useQuoteHistoryStore } from '@/stores/quoteHistory';

const filters = ref({
  global: { value: null }
});

const historyStore = useQuoteHistoryStore();
const quotes = historyStore.entries;

onMounted(() => historyStore.fetchEntries());
</script>

<template>
  <div class="dashboard-history">
    <div class="header">
      <div class="info">
        <h1>Historial de Cotizaciones</h1>
        <p>Revise y gestione todas las cotizaciones históricas solicitadas a través del sistema.</p>
      </div>
      <div class="actions">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <InputText v-model="filters.global.value" placeholder="Buscar cotizaciones..." class="search-input" />
        </span>
      </div>
    </div>

    <div class="table-container card">
      <DataTable
        :value="quotes"
        :loading="historyStore.loading"
        paginator
        :rows="10"
        dataKey="_id"
        stripedRows
        responsiveLayout="scroll"
        class="custom-table"
        :filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['customer', 'origin', 'destination', 'type']"
      >
        <Column field="_id" header="ID" sortable></Column>
        <Column header="Fecha" sortable sortField="createdAt">
          <template #body="slotProps">
            {{ slotProps.data.createdAt?.slice(0, 10) }}
          </template>
        </Column>
        <Column field="customer" header="Cliente" sortable></Column>
        <Column field="origin" header="Origen" sortable></Column>
        <Column field="destination" header="Destino" sortable></Column>
        <Column field="type" header="Tipo de Carga" sortable></Column>
      </DataTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-history {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 1.5rem;

    .info {
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
}

.card {
  background: #ffffff;
  border-radius: 0.8rem;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.05);
  border: 0.1rem solid #e2e8f0;
  overflow: hidden;
}

.search-input {
  font-size: 1.2rem;
  padding: 0.6rem 1rem 0.6rem 2.8rem;
  width: 22rem;
}

:deep(.p-input-icon-left i) {
  left: 0.8rem;
  font-size: 1.1rem;
  color: #94a3b8;
}

:deep(.custom-table) {
  .p-datatable-thead > tr > th {
    background: #f8fafc;
    font-size: 1.1rem;
    font-weight: 700;
    color: #475569;
    padding: 0.8rem 1.2rem;
  }

  .p-datatable-tbody > tr > td {
    font-size: 1.2rem;
    padding: 0.8rem 1.2rem;
    color: #334155;
  }

  .p-paginator {
    padding: 0.6rem;
    font-size: 1.1rem;
  }
}

</style>