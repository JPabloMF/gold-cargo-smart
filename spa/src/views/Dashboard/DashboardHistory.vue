<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const filters = ref({
  global: { value: null }
});

const quotes = ref([
  { id: '1001', date: '2026-03-10', customer: 'Global Logistics Inc', origin: 'China', destination: 'Colombia', type: 'FCL', status: 'Completed' },
  { id: '1002', date: '2026-03-11', customer: 'Andes Trading', origin: 'USA', destination: 'Colombia', type: 'LCL', status: 'Pending' },
  { id: '1003', date: '2026-03-12', customer: 'Ocean Blue Co', origin: 'Spain', destination: 'Colombia', type: 'FCL', status: 'Pending' },
  { id: '1004', date: '2026-03-12', customer: 'Pacific Imports', origin: 'Vietnam', destination: 'Colombia', type: 'FCL', status: 'Cancelled' },
]);

const getSeverity = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Pending': return 'warn';
    case 'Cancelled': return 'danger';
    default: return null;
  }
};
</script>

<template>
  <div class="dashboard-history">
    <div class="header">
      <div class="info">
        <h1>Quote History</h1>
        <p>Review and manage all historical quotes requested through the system.</p>
      </div>
      <div class="actions">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <InputText v-model="filters.global.value" placeholder="Search quotes..." class="search-input" />
        </span>
      </div>
    </div>

    <div class="table-container card">
      <DataTable 
        :value="quotes" 
        paginator 
        :rows="10" 
        dataKey="id" 
        stripedRows
        responsiveLayout="scroll"
        class="custom-table"
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="date" header="Date" sortable></Column>
        <Column field="customer" header="Customer" sortable></Column>
        <Column field="origin" header="Origin" sortable></Column>
        <Column field="destination" header="Destination" sortable></Column>
        <Column field="type" header="Load Type" sortable></Column>
        <Column field="status" header="Status" sortable>
          <template #body="slotProps">
            <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
          </template>
        </Column>
        <Column header="Actions">
          <template #body>
            <Button icon="pi pi-eye" variant="text" severity="secondary" rounded />
          </template>
        </Column>
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
    margin-bottom: 1.5rem; // Reduced from 2rem

    .info {
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
}

.card {
  background: #ffffff;
  border-radius: 0.8rem; // Reduced from 1rem
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.05);
  border: 0.1rem solid #e2e8f0;
  overflow: hidden;
}

.search-input {
  font-size: 1.2rem; // Reduced from 1.3rem
  padding: 0.6rem 1rem 0.6rem 2.8rem; // Reduced padding
  width: 22rem; // Reduced from 25rem
}

:deep(.p-input-icon-left i) {
  left: 0.8rem;
  font-size: 1.1rem;
  color: #94a3b8;
}

:deep(.custom-table) {
  .p-datatable-thead > tr > th {
    background: #f8fafc;
    font-size: 1.1rem; // Reduced from 1.2rem
    font-weight: 700;
    color: #475569;
    padding: 0.8rem 1.2rem; // Reduced padding
  }

  .p-datatable-tbody > tr > td {
    font-size: 1.2rem; // Reduced from 1.3rem
    padding: 0.8rem 1.2rem; // Reduced padding
    color: #334155;
  }

  .p-tag {
    font-size: 0.9rem; // Reduced from 1rem
    padding: 0.15rem 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .p-paginator {
    padding: 0.6rem;
    font-size: 1.1rem;
  }
}

:deep(.p-button.p-button-rounded) {
  width: 2.6rem;
  height: 2.6rem;
  i {
    font-size: 1rem;
  }
}
</style>