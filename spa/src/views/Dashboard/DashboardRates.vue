<template>
  <div class="rates-management">
    <div class="header">
      <h1>Gestión de Tarifas</h1>
      <p>Suba tarifas de importación/exportación desde archivos Excel por continente</p>
    </div>

    <Tabs :value="activeContinent" @update:value="onTabChange">
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
                <h3>Actualizar Tarifas de {{ getSpanishContinentName(continent.value) }}</h3>
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
                  v-if="states[continent.value]?.rawFileData" 
                  label="Limpiar" 
                  icon="pi pi-times" 
                  severity="secondary" 
                  variant="text"
                  @click="clearFile(continent.value)" 
                />
              </div>
              
              <div v-if="states[continent.value]?.fileName" class="selected-file">
                <i class="pi pi-file-excel mr-2"></i>
                <strong>Seleccionado:</strong> {{ states[continent.value].fileName }}
              </div>
            </div>

            <div v-if="states[continent.value]?.loading" class="loading-state card">
              <i class="pi pi-spin pi-spinner"></i>
              <span>Procesando datos...</span>
            </div>

            <div v-else-if="states[continent.value]?.ratesData.length > 0" class="results-section mt-3">
              <div class="table-header card">
                <div class="info">
                  <h2>Base de Datos de {{ getSpanishContinentName(continent.value) }}</h2>
                  <p>{{ states[continent.value].ratesData.length }} filas totales encontradas</p>
                </div>
                <div class="actions">
                  <Button 
                    v-if="states[continent.value].hasChanges"
                    label="Guardar Cambios" 
                    icon="pi pi-save" 
                    severity="success" 
                    @click="saveData(continent.value)" 
                  />
                </div>
              </div>

              <DataTable 
                :value="states[continent.value].ratesData" 
                responsiveLayout="scroll" 
                stripedRows 
                paginator 
                :rows="10" 
                :rowsPerPageOptions="[10, 20, 50]"
                class="mt-3 custom-table"
              >
                <Column v-for="col of states[continent.value].columns" :key="col.field" :field="col.field" :header="col.header" sortable></Column>
              </DataTable>
            </div>
            
            <div v-else-if="states[continent.value]?.fileName" class="no-data-state card">
              <i class="pi pi-exclamation-circle mb-2"></i>
              <p>No se encontraron datos válidos en el archivo seleccionado. Por favor, verifique la estructura del Excel.</p>
            </div>

            <div v-else class="empty-state card">
              <i class="pi pi-cloud-upload mb-2"></i>
              <h3>No hay tarifas almacenadas para {{ getSpanishContinentName(continent.value) }}</h3>
              <p>Por favor, suba un archivo Excel para poblar la base de datos de este continente.</p>
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

const authStore = useAuthStore();
const activeContinent = ref(CONTINENTS[0].value);
const states = reactive({});
const API_URL = import.meta.env.VITE_API_URL;

// Initialize state for each continent
CONTINENTS.forEach(c => {
  states[c.value] = {
    ratesData: [],
    columns: [],
    fileName: '',
    rawFileData: null,
    loading: false,
    hasChanges: false
  };
});

onMounted(() => {
  fetchRates(activeContinent.value);
});

const onTabChange = (value) => {
  activeContinent.value = value;
  if (states[value].ratesData.length === 0 && !states[value].fileName) {
    fetchRates(value);
  }
};

const getContinentIcon = (val) => {
  const icons = {
    'asia': 'pi pi-map-marker',
    'america': 'pi pi-compass',
    'europe': 'pi pi-flag',
    'oceania': 'pi pi-globe'
  };
  return icons[val] || 'pi pi-map';
};

const getSpanishContinentName = (val) => {
  const names = {
    'asia': 'Asia',
    'america': 'América',
    'europe': 'Europa',
    'oceania': 'Oceanía'
  };
  return names[val] || val;
};

const fetchRates = async (continentValue) => {
  states[continentValue].loading = true;
  try {
    const response = await fetch(`${API_URL}/rates/${continentValue}`);
    const result = await response.json();
    
    if (result.success && result.data.length > 0) {
      states[continentValue].ratesData = result.data;
      
      const firstRow = result.data[0];
      states[continentValue].columns = Object.keys(firstRow).map(key => ({
        field: key,
        header: formatHeader(key)
      }));
    }
  } catch (error) {
    console.error(`Failed to fetch rates for ${continentValue}`, error);
  } finally {
    states[continentValue].loading = false;
  }
};

const onFileSelect = (event, continentValue) => {
  const file = event.files[0];
  if (!file) return;

  states[continentValue].fileName = file.name;
  states[continentValue].rawFileData = file;
  states[continentValue].loading = true;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    if (jsonData.length > 0) {
      states[continentValue].ratesData = jsonData;
      states[continentValue].hasChanges = true;
      
      const firstRow = jsonData[0];
      states[continentValue].columns = Object.keys(firstRow).map(key => ({
        field: key,
        header: formatHeader(key)
      }));
    }
    states[continentValue].loading = false;
  };
  reader.onerror = () => {
    states[continentValue].loading = false;
  };
  reader.readAsArrayBuffer(file);
};

const formatHeader = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const clearFile = (continentValue) => {
  states[continentValue].fileName = '';
  states[continentValue].rawFileData = null;
  states[continentValue].hasChanges = false;
  // Reload from DB if we cleared an unsaved upload
  fetchRates(continentValue);
};

const saveData = async (continentValue) => {
  states[continentValue].loading = true;
  try {
    const response = await fetch(`${API_URL}/rates/${continentValue}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ data: states[continentValue].ratesData }),
    });

    const result = await response.json();

    if (result.success) {
      states[continentValue].hasChanges = false;
      alert(`Tarifas de ${getSpanishContinentName(continentValue)} guardadas exitosamente.`);
    } else {
      alert(`Error al guardar: ${result.message || 'Error de servidor o no autorizado'}`);
    }
  } catch (error) {
    console.error("Save failed", error);
    alert("Ocurrió un error al guardar.");
  } finally {
    states[continentValue].loading = false;
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