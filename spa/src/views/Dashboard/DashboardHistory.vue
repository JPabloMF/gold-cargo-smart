<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useQuoteHistoryStore } from '@/stores/quoteHistory';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const filters = ref({
  global: { value: null }
});

const historyStore = useQuoteHistoryStore();
const { entries: quotes, loading } = storeToRefs(historyStore);

onMounted(() => historyStore.fetchEntries());

const exportPdf = () => {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(16);
  doc.setTextColor(44, 61, 105); // brand navy
  doc.text('Historial de Cotizaciones', 14, 16);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, 14, 22);

  const columns = [
    { header: 'Fecha',         dataKey: 'date' },
    { header: 'Cliente',       dataKey: 'customer' },
    { header: 'Teléfono',      dataKey: 'phone' },
    { header: 'Correo',        dataKey: 'email' },
    { header: 'Origen',        dataKey: 'origin' },
    { header: 'Destino',       dataKey: 'destination' },
    { header: 'Tipo de Carga', dataKey: 'type' },
    { header: 'Total (USD)',         dataKey: 'grandTotal' },
    { header: 'Servicios Adic.',     dataKey: 'additionalServices' },
    { header: 'Observaciones',       dataKey: 'annotations' },
  ];

  const rows = quotes.value.map(q => {
    const services = [];
    if (q.loadEnsurance)       services.push('Seguro');
    if (q.originPickup)        services.push('Recogida');
    if (q.destinationDelivery) services.push('Entrega');
    return {
      date:               q.createdAt?.slice(0, 10) ?? '—',
      customer:           q.customer   ?? '—',
      phone:              q.phone      || '—',
      email:              q.email      || '—',
      origin:             q.origin     ?? '—',
      destination:        q.destination ?? '—',
      type:               q.type       ?? '—',
      grandTotal:         q.grandTotal != null ? `USD ${Number(q.grandTotal).toFixed(2)}` : '—',
      additionalServices: services.length ? services.join(', ') : '—',
      annotations:        q.annotations || '—',
    };
  });

  autoTable(doc, {
    startY: 27,
    columns,
    body: rows,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [44, 61, 105], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: { annotations: { cellWidth: 50 } },
  });

  doc.save(`cotizaciones_${new Date().toISOString().slice(0, 10)}.pdf`);
};
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
        <Button
          icon="pi pi-file-pdf"
          label="Exportar PDF"
          :disabled="!quotes.length"
          @click="exportPdf"
          class="export-btn"
        />
      </div>
    </div>

    <div class="table-container card">
      <DataTable
        :value="quotes"
        :loading="loading"
        paginator
        :rows="10"
        dataKey="_id"
        stripedRows
        responsiveLayout="scroll"
        class="custom-table"
        :filters="filters"
        filterDisplay="menu"
        :globalFilterFields="['customer', 'phone', 'email', 'origin', 'destination', 'type', 'annotations']"
      >
        <Column header="Fecha" sortable sortField="createdAt">
          <template #body="slotProps">
            {{ slotProps.data.createdAt?.slice(0, 10) }}
          </template>
        </Column>
        <Column field="customer" header="Cliente" sortable></Column>
        <Column field="phone" header="Teléfono" sortable></Column>
        <Column field="email" header="Correo" sortable></Column>
        <Column field="origin" header="Origen" sortable></Column>
        <Column field="destination" header="Destino" sortable></Column>
        <Column field="type" header="Tipo de Carga" sortable>
          <template #body="slotProps">
            <span :class="['type-badge', slotProps.data.type?.toLowerCase()]">
              {{ slotProps.data.type ?? '—' }}
            </span>
          </template>
        </Column>
        <Column field="grandTotal" header="Total (USD)" sortable>
          <template #body="slotProps">
            <span v-if="slotProps.data.grandTotal != null" class="total-amount">
              USD {{ Number(slotProps.data.grandTotal).toFixed(2) }}
            </span>
            <span v-else class="text-surface-300">—</span>
          </template>
        </Column>
        <Column header="Servicios Adicionales">
          <template #body="slotProps">
            <div class="service-badges">
              <span v-if="slotProps.data.loadEnsurance" class="service-badge ensurance">Seguro</span>
              <span v-if="slotProps.data.originPickup" class="service-badge pickup">Recogida</span>
              <span v-if="slotProps.data.destinationDelivery" class="service-badge delivery">Entrega</span>
              <span v-if="!slotProps.data.loadEnsurance && !slotProps.data.originPickup && !slotProps.data.destinationDelivery" class="text-surface-300">—</span>
            </div>
          </template>
        </Column>
        <Column field="annotations" header="Observaciones">
          <template #body="slotProps">
            <span v-if="slotProps.data.annotations" v-tooltip.top="slotProps.data.annotations" class="decoration-dotted">
              {{ slotProps.data.annotations.length > 40 ? slotProps.data.annotations.slice(0, 40) + '…' : slotProps.data.annotations }}
            </span>
            <span v-else class="text-surface-300">—</span>
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

.actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.search-input {
  font-size: 1.2rem;
  padding: 0.6rem 1rem 0.6rem 2.8rem;
  width: 22rem;
}

.export-btn {
  font-size: 1.2rem;
  white-space: nowrap;
}

:deep(.p-input-icon-left i) {
  left: 0.8rem;
  font-size: 1.1rem;
  color: #94a3b8;
}

.total-amount {
  font-weight: 700;
  color: #1e293b;
}

.type-badge {
  display: inline-block;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &.lcl {
    background-color: #dbeafe;
    color: #1d4ed8;
  }

  &.fcl {
    background-color: #fef9c3;
    color: #854d0e;
  }
}

.service-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.service-badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;

  &.ensurance {
    background-color: #dcfce7;
    color: #15803d;
  }

  &.pickup {
    background-color: #fce7f3;
    color: #9d174d;
  }

  &.delivery {
    background-color: #ede9fe;
    color: #6d28d9;
  }
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