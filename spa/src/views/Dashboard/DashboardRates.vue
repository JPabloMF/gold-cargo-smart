<template>
  <div class="rates-management">
    <div class="header">
      <h1>Rates Management</h1>
      <p>Upload import/export rates from Excel files per continent</p>
    </div>

    <Tabs :value="activeContinent" @update:value="onTabChange">
      <TabList>
        <Tab v-for="continent in CONTINENTS" :key="continent.value" :value="continent.value">
          {{ continent.name }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="continent in CONTINENTS" :key="continent.value" :value="continent.value">
          <div class="continent-content mt-4">
            <div class="upload-section card">
              <div class="flex flex-col gap-2 mb-4">
                <label>Choose Excel File for {{ continent.name }} (.xlsx, .xls)</label>
                <div class="flex gap-2">
                  <FileUpload 
                    mode="basic" 
                    name="demo[]" 
                    accept=".xlsx, .xls" 
                    :maxFileSize="1000000" 
                    customUpload 
                    @select="(event) => onFileSelect(event, continent.value)" 
                    auto 
                    chooseLabel="Select File"
                  />
                  <Button 
                    v-if="states[continent.value]?.rawFileData" 
                    label="Clear" 
                    icon="pi pi-times" 
                    severity="secondary" 
                    @click="clearFile(continent.value)" 
                  />
                </div>
              </div>
              
              <div v-if="states[continent.value]?.fileName" class="mb-3">
                <strong>Selected file:</strong> {{ states[continent.value].fileName }}
              </div>
            </div>

            <div v-if="states[continent.value]?.loading" class="mt-4 card flex justify-center py-8">
              <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            </div>

            <div v-else-if="states[continent.value]?.ratesData.length > 0" class="results-section mt-4">
              <div class="flex justify-between items-center mb-3">
                <h2>Data: {{ continent.name }} ({{ states[continent.value].ratesData.length }} rows)</h2>
                <div class="flex gap-2">
                  <Button 
                    v-if="states[continent.value].hasChanges"
                    label="Save Changes" 
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
                tableStyle="min-width: 50rem"
              >
                <Column v-for="col of states[continent.value].columns" :key="col.field" :field="col.field" :header="col.header" sortable></Column>
              </DataTable>
            </div>
            
            <div v-else-if="states[continent.value]?.fileName" class="no-data mt-4 card">
              <p>Processing file or no data found in the selected file.</p>
            </div>

            <div v-else class="mt-4 card">
              <p>No rates stored for {{ continent.name }}. Upload an Excel file to get started.</p>
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
      alert(`Rates for ${CONTINENTS.find(c => c.value === continentValue)?.name} saved successfully.`);
    } else {
      alert(`Failed to save: ${result.message || 'Unauthorized or server error'}`);
    }
  } catch (error) {
    console.error("Save failed", error);
    alert("An error occurred while saving.");
  } finally {
    states[continentValue].loading = false;
  }
};
</script>

<style scoped>
.rates-management {
  padding: 1rem;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header p {
  color: #666;
  margin: 0.5rem 0 0 0;
}

.card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.flex-col {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>