<template>
  <div class="income-management">
    <div class="header">
      <h1>Ingresos de la Empresa</h1>
      <p>Registre los ingresos asociados a cada operación</p>
    </div>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="lcl">LCL (Carga Suelta)</Tab>
        <Tab value="fcl">FCL (Contenedor Completo)</Tab>
      </TabList>

      <TabPanels>
        <!-- LCL Tab -->
        <TabPanel value="lcl">
          <div class="card">
            <h3>Ingresos LCL</h3>
            <div class="flex flex-wrap gap-6 mt-4">
              <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
                <IconField>
                  <InputNumber
                    id="lcl_radicacion_bl"
                    v-model="lclForm.radicacionBL"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                  />
                  <InputIcon>
                    <font-awesome-icon class="text-base" icon="fa-solid fa-file-circle-check" />
                  </InputIcon>
                </IconField>
                <label class="text-base" for="lcl_radicacion_bl">Radicación del BL</label>
              </FloatLabel>

              <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
                <IconField>
                  <InputNumber
                    id="lcl_gastos_destino"
                    v-model="lclForm.gastosEnDestino"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                  />
                  <InputIcon>
                    <font-awesome-icon class="text-base" icon="fa-solid fa-wallet" />
                  </InputIcon>
                </IconField>
                <label class="text-base" for="lcl_gastos_destino">Gastos en Destino</label>
              </FloatLabel>

              <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
                <IconField>
                  <InputNumber
                    id="lcl_collect_fee"
                    v-model="lclForm.collectFee"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                  />
                  <InputIcon>
                    <font-awesome-icon class="text-base" icon="fa-solid fa-coins" />
                  </InputIcon>
                </IconField>
                <label class="text-base" for="lcl_collect_fee">Collect Fee</label>
              </FloatLabel>

              <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
                <IconField>
                  <InputNumber
                    id="lcl_emision_bl"
                    v-model="lclForm.emisionEnDestinoBL"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                  />
                  <InputIcon>
                    <font-awesome-icon class="text-base" icon="fa-solid fa-file-circle-check" />
                  </InputIcon>
                </IconField>
                <label class="text-base" for="lcl_emision_bl">Emisión en Destino BL</label>
              </FloatLabel>
            </div>

            <div class="flex justify-end mt-6">
              <Button
                label="Guardar Ingreso LCL"
                icon="pi pi-save"
                :loading="lclSaving"
                :disabled="!isLclFormValid"
                @click="saveLcl"
              />
            </div>

            <Message v-if="lclSuccessMsg" severity="success" class="mt-4">{{ lclSuccessMsg }}</Message>
            <Message v-if="lclErrorMsg" severity="error" class="mt-4">{{ lclErrorMsg }}</Message>
          </div>
        </TabPanel>

        <!-- FCL Tab -->
        <TabPanel value="fcl">
          <div class="card">
            <h3>Ingresos FCL</h3>
            <div class="flex flex-wrap gap-6 mt-4">
              <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
                <IconField>
                  <InputNumber
                    id="fcl_radicacion_bl"
                    v-model="fclForm.radicacionBL"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                  />
                  <InputIcon>
                    <font-awesome-icon class="text-base" icon="fa-solid fa-file-circle-check" />
                  </InputIcon>
                </IconField>
                <label class="text-base" for="fcl_radicacion_bl">Radicación del BL</label>
              </FloatLabel>

              <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
                <IconField>
                  <InputNumber
                    id="fcl_gastos_destino"
                    v-model="fclForm.gastosEnDestino"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                  />
                  <InputIcon>
                    <font-awesome-icon class="text-base" icon="fa-solid fa-wallet" />
                  </InputIcon>
                </IconField>
                <label class="text-base" for="fcl_gastos_destino">Gastos en Destino</label>
              </FloatLabel>

              <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
                <IconField>
                  <InputNumber
                    id="fcl_emision_bl"
                    v-model="fclForm.emisionEnDestinoBL"
                    class="w-full"
                    :min="0"
                    :minFractionDigits="0"
                    :maxFractionDigits="2"
                  />
                  <InputIcon>
                    <font-awesome-icon class="text-base" icon="fa-solid fa-file-circle-check" />
                  </InputIcon>
                </IconField>
                <label class="text-base" for="fcl_emision_bl">Emisión en Destino BL</label>
              </FloatLabel>
            </div>

            <div class="flex justify-end mt-6">
              <Button
                label="Guardar Ingreso FCL"
                icon="pi pi-save"
                :loading="fclSaving"
                :disabled="!isFclFormValid"
                @click="saveFcl"
              />
            </div>

            <Message v-if="fclSuccessMsg" severity="success" class="mt-4">{{ fclSuccessMsg }}</Message>
            <Message v-if="fclErrorMsg" severity="error" class="mt-4">{{ fclErrorMsg }}</Message>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Message from "primevue/message";
import { useAuthStore } from "@/stores/auth";
import { apiFetch } from "@/utils/api";

const authStore = useAuthStore();
const API_URL = import.meta.env.VITE_API_URL;

const activeTab = ref("lcl");

// LCL state
const lclForm = ref({ radicacionBL: null, gastosEnDestino: null, collectFee: null, emisionEnDestinoBL: null });
const lclId = ref(null);
const lclSaving = ref(false);
const lclSuccessMsg = ref("");
const lclErrorMsg = ref("");

// FCL state
const fclForm = ref({ radicacionBL: null, gastosEnDestino: null, emisionEnDestinoBL: null });
const fclId = ref(null);
const fclSaving = ref(false);
const fclSuccessMsg = ref("");
const fclErrorMsg = ref("");

const loadIncome = async (type) => {
  try {
    const response = await apiFetch(`${API_URL}/income?type=${type}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      const latest = result.data[0];
      if (type === "lcl") {
        lclId.value = latest._id;
        lclForm.value = {
          radicacionBL: latest.radicacionBL,
          gastosEnDestino: latest.gastosEnDestino,
          collectFee: latest.collectFee,
          emisionEnDestinoBL: latest.emisionEnDestinoBL,
        };
      } else {
        fclId.value = latest._id;
        fclForm.value = {
          radicacionBL: latest.radicacionBL,
          gastosEnDestino: latest.gastosEnDestino,
          emisionEnDestinoBL: latest.emisionEnDestinoBL,
        };
      }
    }
  } catch (error) {
    console.error(`[DashboardIncome] Error loading ${type} income:`, error);
  }
};

onMounted(() => {
  loadIncome("lcl");
  loadIncome("fcl");
});

const isLclFormValid = computed(() =>
  lclForm.value.radicacionBL !== null &&
  lclForm.value.gastosEnDestino !== null &&
  lclForm.value.collectFee !== null &&
  lclForm.value.emisionEnDestinoBL !== null
);

const isFclFormValid = computed(() =>
  fclForm.value.radicacionBL !== null &&
  fclForm.value.gastosEnDestino !== null &&
  fclForm.value.emisionEnDestinoBL !== null
);

const saveIncome = async (type) => {
  const isLcl = type === "lcl";
  const id = isLcl ? lclId.value : fclId.value;
  const form = isLcl ? lclForm.value : fclForm.value;
  const savingRef = isLcl ? lclSaving : fclSaving;
  const successRef = isLcl ? lclSuccessMsg : fclSuccessMsg;
  const errorRef = isLcl ? lclErrorMsg : fclErrorMsg;

  savingRef.value = true;
  successRef.value = "";
  errorRef.value = "";

  try {
    const url = id ? `${API_URL}/income/${id}` : `${API_URL}/income`;
    const method = id ? "PUT" : "POST";

    const response = await apiFetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ type, ...form }),
    });

    const result = await response.json();

    if (result.success) {
      if (isLcl) lclId.value = result.data._id;
      else fclId.value = result.data._id;
      successRef.value = "Ingreso guardado exitosamente.";
    } else {
      errorRef.value = result.message || "Error al guardar el ingreso.";
    }
  } catch (error) {
    console.error(`[DashboardIncome] Error saving ${type} income:`, error);
    errorRef.value = "Ocurrió un error al guardar.";
  } finally {
    savingRef.value = false;
  }
};

const saveLcl = () => saveIncome("lcl");
const saveFcl = () => saveIncome("fcl");
</script>

<style lang="scss" scoped>
.income-management {
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
  margin-top: 1rem;

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0;
  }
}
</style>
