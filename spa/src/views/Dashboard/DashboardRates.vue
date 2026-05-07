<template>
  <div class="rates-management">
    <div class="header">
      <h1>Gestión de Tarifas</h1>
      <p>Suba tarifas de importación/exportación desde archivos Excel</p>
    </div>

    <Tabs :value="activeRateType" @update:value="activeRateType = $event">
      <TabList>
        <Tab value="lcl">
          <i class="pi pi-box mr-2"></i>
          Tarifas LCL
        </Tab>
        <Tab value="fcl">
          <i class="pi pi-truck mr-2"></i>
          Tarifas FCL
        </Tab>
      </TabList>

      <TabPanels>
        <!-- ─── LCL ─── -->
        <TabPanel value="lcl">
          <Tabs :value="activeContinent" @update:value="onTabChange" class="mt-3">
            <TabList>
              <Tab v-for="continent in CONTINENTS" :key="continent.value" :value="continent.value">
                <i :class="getContinentIcon(continent.value)" class="mr-2"></i>
                {{ getSpanishContinentName(continent.value) }}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel v-for="continent in CONTINENTS" :key="continent.value" :value="continent.value">
                <div class="continent-content mt-3">
                  <div class="upload-section card">
                    <div class="upload-header">
                      <h3>Actualizar Tarifas LCL de {{ getSpanishContinentName(continent.value) }}</h3>
                      <p>Seleccione un archivo Excel (.xlsx, .xls) para subir nuevos datos.</p>
                    </div>

                    <div class="flex items-center gap-3">
                      <FileUpload
                        mode="basic"
                        name="demo[]"
                        accept=".xlsx, .xls"
                        :maxFileSize="1000000"
                        customUpload
                        @select="(event) => onFileSelect(event, continent.value)"
                        auto
                        chooseLabel="Seleccionar Archivo"
                        class="p-button-outlined"
                      />
                      <Button
                        v-if="lclStates[continent.value]?.rawFileData"
                        label="Limpiar"
                        icon="pi pi-times"
                        severity="secondary"
                        variant="text"
                        @click="clearFile(continent.value)"
                      />
                    </div>

                    <div v-if="lclStates[continent.value]?.fileName" class="selected-file">
                      <i class="pi pi-file-excel mr-2"></i>
                      <strong>Seleccionado:</strong> {{ lclStates[continent.value].fileName }}
                    </div>
                  </div>

                  <div v-if="lclStates[continent.value]?.loading" class="loading-state card mt-3">
                    <i class="pi pi-spin pi-spinner"></i>
                    <span>Procesando datos...</span>
                  </div>

                  <div v-else-if="lclStates[continent.value]?.ratesData.length > 0" class="results-section mt-3">
                    <div class="table-header card">
                      <div class="info">
                        <h2>Base de Datos LCL – {{ getSpanishContinentName(continent.value) }}</h2>
                        <p>{{ lclStates[continent.value].ratesData.length }} filas totales encontradas</p>
                      </div>
                      <div class="actions">
                        <Button
                          v-if="lclStates[continent.value].hasChanges"
                          label="Guardar Cambios"
                          icon="pi pi-save"
                          severity="success"
                          @click="saveLclData(continent.value)"
                        />
                      </div>
                    </div>

                    <DataTable
                      :value="lclStates[continent.value].ratesData"
                      responsiveLayout="scroll"
                      stripedRows
                      paginator
                      :rows="10"
                      :rowsPerPageOptions="[10, 20, 50]"
                      class="mt-3 custom-table"
                    >
                      <Column
                        v-for="col of lclStates[continent.value].columns"
                        :key="col.field"
                        :field="col.field"
                        :header="col.header"
                        sortable
                      />
                    </DataTable>
                  </div>

                  <div v-else-if="lclStates[continent.value]?.fileName" class="no-data-state card mt-3">
                    <i class="pi pi-exclamation-circle mb-2"></i>
                    <p>No se encontraron datos válidos en el archivo seleccionado. Por favor, verifique la estructura del Excel.</p>
                  </div>

                  <div v-else class="empty-state card mt-3">
                    <i class="pi pi-cloud-upload mb-2"></i>
                    <h3>No hay tarifas LCL almacenadas para {{ getSpanishContinentName(continent.value) }}</h3>
                    <p>Por favor, suba un archivo Excel para poblar la base de datos de este continente.</p>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </TabPanel>

        <!-- ─── FCL ─── -->
        <TabPanel value="fcl">
          <div class="continent-content mt-3">
            <div class="upload-section card">
              <div class="upload-header">
                <h3>Actualizar Tarifas FCL</h3>
                <p>Seleccione un archivo Excel (.xlsx, .xls). Columnas esperadas: Origen, Destino, Flete 20', Flete 40', Emisión BL, Días Libres, Naviera, Vigencia, Agente.</p>
              </div>

              <div class="flex items-center gap-3">
                <FileUpload
                  mode="basic"
                  name="fcl[]"
                  accept=".xlsx, .xls"
                  :maxFileSize="1000000"
                  customUpload
                  @select="onFclFileSelect"
                  auto
                  chooseLabel="Seleccionar Archivo"
                  class="p-button-outlined"
                />
                <Button
                  v-if="fclState.rawFileData"
                  label="Limpiar"
                  icon="pi pi-times"
                  severity="secondary"
                  variant="text"
                  @click="clearFclFile"
                />
              </div>

              <div v-if="fclState.fileName" class="selected-file">
                <i class="pi pi-file-excel mr-2"></i>
                <strong>Seleccionado:</strong> {{ fclState.fileName }}
              </div>
            </div>

            <div v-if="fclState.loading" class="loading-state card mt-3">
              <i class="pi pi-spin pi-spinner"></i>
              <span>Procesando datos...</span>
            </div>

            <div v-else-if="fclState.ratesData.length > 0" class="results-section mt-3">
              <div class="table-header card">
                <div class="info">
                  <h2>Base de Datos FCL</h2>
                  <p>{{ fclState.ratesData.length }} filas totales encontradas</p>
                </div>
                <div class="actions">
                  <Button
                    v-if="fclState.hasChanges"
                    label="Guardar Cambios"
                    icon="pi pi-save"
                    severity="success"
                    @click="saveFclData"
                  />
                </div>
              </div>

              <DataTable
                :value="fclState.ratesData"
                responsiveLayout="scroll"
                stripedRows
                paginator
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                class="mt-3 custom-table"
              >
                <Column v-for="col of FCL_COLUMNS" :key="col.field" :field="col.field" :header="col.header" sortable />
              </DataTable>
            </div>

            <div v-else-if="fclState.fileName" class="no-data-state card mt-3">
              <i class="pi pi-exclamation-circle mb-2"></i>
              <p>No se encontraron datos válidos en el archivo seleccionado. Por favor, verifique la estructura del Excel.</p>
            </div>

            <div v-else class="empty-state card mt-3">
              <i class="pi pi-cloud-upload mb-2"></i>
              <h3>No hay tarifas FCL almacenadas</h3>
              <p>Por favor, suba un archivo Excel para poblar la base de datos FCL.</p>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import { CONTINENTS } from '@/utils/constants';
import { useAuthStore } from '@/stores/auth';
import { apiFetch } from '@/utils/api';

const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL;

// ─── Top-level tab ───────────────────────────────────────────────────────────
const activeRateType = ref('lcl');

// ─── FCL fixed columns ───────────────────────────────────────────────────────
const FCL_COLUMNS = [
  { field: 'origen',     header: 'Origen' },
  { field: 'destino',    header: 'Destino' },
  { field: 'flete20',    header: "Flete 20'" },
  { field: 'flete40',    header: "Flete 40'" },
  { field: 'emisionbl',  header: 'Emisión BL' },
  { field: 'diaslibres', header: 'Días Libres' },
  { field: 'naviera',    header: 'Naviera' },
  { field: 'vigencia',   header: 'Vigencia' },
  { field: 'agente',     header: 'Agente' },
];

// ─── LCL state ───────────────────────────────────────────────────────────────
const activeContinent = ref(CONTINENTS[0].value);
const lclStates = reactive({});

CONTINENTS.forEach(c => {
  lclStates[c.value] = {
    ratesData: [],
    columns: [],
    fileName: '',
    rawFileData: null,
    loading: false,
    hasChanges: false,
  };
});

// ─── FCL state ───────────────────────────────────────────────────────────────
const fclState = reactive({
  ratesData: [],
  fileName: '',
  rawFileData: null,
  loading: false,
  hasChanges: false,
});

// ─── Lifecycle ───────────────────────────────────────────────────────────────
onMounted(() => {
  fetchLclRates(activeContinent.value);
  fetchFclRates();
});

// ─── LCL helpers ─────────────────────────────────────────────────────────────
const onTabChange = (value) => {
  activeContinent.value = value;
  if (lclStates[value].ratesData.length === 0 && !lclStates[value].fileName) {
    fetchLclRates(value);
  }
};

const getContinentIcon = (val) => {
  const icons = {
    'asia': 'pi pi-map-marker',
    'america': 'pi pi-compass',
    'europe': 'pi pi-flag',
    'oceania': 'pi pi-globe',
  };
  return icons[val] || 'pi pi-map';
};

const getSpanishContinentName = (val) => {
  const names = {
    'asia': 'Asia',
    'america': 'América',
    'europe': 'Europa',
    'oceania': 'Oceanía',
  };
  return names[val] || val;
};

const formatHeader = (key) =>
  key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const fetchLclRates = async (continentValue) => {
  lclStates[continentValue].loading = true;
  try {
    const response = await apiFetch(`${API_URL}/rates/${continentValue}`);
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      lclStates[continentValue].ratesData = result.data;
      lclStates[continentValue].columns = Object.keys(result.data[0]).map(key => ({
        field: key,
        header: formatHeader(key),
      }));
    }
  } catch (error) {
    console.error(`Failed to fetch LCL rates for ${continentValue}`, error);
  } finally {
    lclStates[continentValue].loading = false;
  }
};

const onFileSelect = (event, continentValue) => {
  const file = event.files[0];
  if (!file) return;

  lclStates[continentValue].fileName = file.name;
  lclStates[continentValue].rawFileData = file;
  lclStates[continentValue].loading = true;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length > 0) {
      lclStates[continentValue].ratesData = jsonData;
      lclStates[continentValue].hasChanges = true;
      lclStates[continentValue].columns = Object.keys(jsonData[0]).map(key => ({
        field: key,
        header: formatHeader(key),
      }));
    }
    lclStates[continentValue].loading = false;
  };
  reader.onerror = () => { lclStates[continentValue].loading = false; };
  reader.readAsArrayBuffer(file);
};

const clearFile = (continentValue) => {
  lclStates[continentValue].fileName = '';
  lclStates[continentValue].rawFileData = null;
  lclStates[continentValue].hasChanges = false;
  fetchLclRates(continentValue);
};

const saveLclData = async (continentValue) => {
  lclStates[continentValue].loading = true;
  try {
    const response = await apiFetch(`${API_URL}/rates/${continentValue}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ data: lclStates[continentValue].ratesData }),
    });
    const result = await response.json();
    if (result.success) {
      lclStates[continentValue].hasChanges = false;
      alert(`Tarifas LCL de ${getSpanishContinentName(continentValue)} guardadas exitosamente.`);
    } else {
      alert(`Error al guardar: ${result.message || 'Error de servidor o no autorizado'}`);
    }
  } catch (error) {
    console.error('Save LCL failed', error);
    alert('Ocurrió un error al guardar.');
  } finally {
    lclStates[continentValue].loading = false;
  }
};

// ─── FCL helpers ─────────────────────────────────────────────────────────────
const fetchFclRates = async () => {
  fclState.loading = true;
  try {
    const response = await apiFetch(`${API_URL}/fclrates`);
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      fclState.ratesData = result.data;
    }
  } catch (error) {
    console.error('Failed to fetch FCL rates', error);
  } finally {
    fclState.loading = false;
  }
};

const onFclFileSelect = (event) => {
  const file = event.files[0];
  if (!file) return;

  fclState.fileName = file.name;
  fclState.rawFileData = file;
  fclState.loading = true;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length > 0) {
      // Normalize keys to lowercase without spaces to match FCL_COLUMNS fields
      fclState.ratesData = jsonData.map(row => {
        const normalized = {};
        for (const [k, v] of Object.entries(row)) {
          normalized[k.toLowerCase().replace(/\s+/g, '')] = v;
        }
        return normalized;
      });
      fclState.hasChanges = true;
    }
    fclState.loading = false;
  };
  reader.onerror = () => { fclState.loading = false; };
  reader.readAsArrayBuffer(file);
};

const clearFclFile = () => {
  fclState.fileName = '';
  fclState.rawFileData = null;
  fclState.hasChanges = false;
  fetchFclRates();
};

const saveFclData = async () => {
  fclState.loading = true;
  try {
    const response = await apiFetch(`${API_URL}/fclrates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ data: fclState.ratesData }),
    });
    const result = await response.json();
    if (result.success) {
      fclState.hasChanges = false;
      alert('Tarifas FCL guardadas exitosamente.');
    } else {
      alert(`Error al guardar: ${result.message || 'Error de servidor o no autorizado'}`);
    }
  } catch (error) {
    console.error('Save FCL failed', error);
    alert('Ocurrió un error al guardar.');
  } finally {
    fclState.loading = false;
  }
};
</script>

<style lang="scss" scoped>
.rates-management {
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

.card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.8rem;
  box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.05);
  border: 0.1rem solid #e2e8f0;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  .upload-header {
    h3 {
      font-size: 1.4rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 0.2rem;
    }
    p {
      font-size: 1.1rem;
      color: #94a3b8;
    }
  }

  .selected-file {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    color: #10b981;
    background-color: #ecfdf5;
    padding: 0.6rem 1rem;
    border-radius: 0.5rem;
    width: fit-content;

    i {
      font-size: 1.2rem;
    }
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;

  .info {
    h2 {
      font-size: 1.6rem;
      font-weight: 600;
      color: #1e293b;
    }
    p {
      font-size: 1.1rem;
      color: #64748b;
    }
  }
}

.loading-state, .empty-state, .no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;

  i {
    font-size: 2.8rem;
    color: #cbd5e1;
    margin-bottom: 0.8rem;
  }

  h3 {
    font-size: 1.6rem;
    color: #475569;
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 1.2rem;
    color: #94a3b8;
    max-width: 40rem;
  }

  span {
    font-size: 1.2rem;
    color: #64748b;
  }
}

.loading-state i {
  color: #3b82f6;
}

:deep(.custom-table) {
  .p-datatable-header {
    background: #ffffff;
    padding: 0.6rem 1.2rem;
  }

  .p-column-title {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .p-datatable-tbody > tr > td {
    font-size: 1.1rem;
    padding: 0.8rem 1.2rem;
  }

  .p-paginator {
    background: #ffffff;
    border-top: 0.1rem solid #e2e8f0;
    padding: 0.6rem;
    font-size: 1.1rem;
  }
}

:deep(.p-tablist-tab-list) {
  background: transparent;
  border-bottom: 0.2rem solid #e2e8f0;
}

:deep(.p-tab) {
  font-size: 1.2rem;
  padding: 1rem 1.5rem;
  font-weight: 600;
}

:deep(.p-button) {
  font-size: 1.2rem;
}
</style>
