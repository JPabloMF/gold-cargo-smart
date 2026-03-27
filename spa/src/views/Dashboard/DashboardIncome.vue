<template>
  <div class="income-management">
    <div class="header">
      <h1>Ingresos de la Empresa</h1>
      <p>Registre los ingresos asociados a cada operación</p>
    </div>

    <div class="card">
      <h3>Nuevo Ingreso</h3>
      <div class="flex flex-wrap gap-6 mt-4">
        <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
          <IconField>
            <InputNumber
              id="radicacion_bl"
              v-model="form.radicacionBL"
              class="w-full"
              :min="0"
              :minFractionDigits="0"
              :maxFractionDigits="2"
            />
            <InputIcon>
              <font-awesome-icon class="text-base" icon="fa-solid fa-file-circle-check" />
            </InputIcon>
          </IconField>
          <label class="text-base" for="radicacion_bl">Radicación del BL</label>
        </FloatLabel>

        <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
          <IconField>
            <InputNumber
              id="gastos_destino"
              v-model="form.gastosEnDestino"
              class="w-full"
              :min="0"
              :minFractionDigits="0"
              :maxFractionDigits="2"
            />
            <InputIcon>
              <font-awesome-icon class="text-base" icon="fa-solid fa-wallet" />
            </InputIcon>
          </IconField>
          <label class="text-base" for="gastos_destino">Gastos en Destino</label>
        </FloatLabel>

        <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
          <IconField>
            <InputNumber
              id="collect_fee"
              v-model="form.collectFee"
              class="w-full"
              :min="0"
              :minFractionDigits="0"
              :maxFractionDigits="2"
            />
            <InputIcon>
              <font-awesome-icon class="text-base" icon="fa-solid fa-coins" />
            </InputIcon>
          </IconField>
          <label class="text-base" for="collect_fee">Collect Fee</label>
        </FloatLabel>

        <FloatLabel class="w-full lg:w-56 md:w-full sm:w-full" variant="on">
          <IconField>
            <InputNumber
              id="emision_bl"
              v-model="form.emisionEnDestinoBL"
              class="w-full"
              :min="0"
              :minFractionDigits="0"
              :maxFractionDigits="2"
            />
            <InputIcon>
              <font-awesome-icon class="text-base" icon="fa-solid fa-file-circle-check" />
            </InputIcon>
          </IconField>
          <label class="text-base" for="emision_bl">Emisión en Destino BL</label>
        </FloatLabel>
      </div>

      <div class="flex justify-end mt-6">
        <Button
          label="Guardar Ingreso"
          icon="pi pi-save"
          :loading="saving"
          :disabled="!isFormValid"
          @click="save"
        />
      </div>

      <Message v-if="successMsg" severity="success" class="mt-4">{{ successMsg }}</Message>
      <Message v-if="errorMsg" severity="error" class="mt-4">{{ errorMsg }}</Message>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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

const form = ref({
  radicacionBL: null,
  gastosEnDestino: null,
  collectFee: null,
  emisionEnDestinoBL: null,
});

const currentId = ref(null);
const saving = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

onMounted(async () => {
  try {
    const response = await apiFetch(`${API_URL}/income`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      const latest = result.data[0];
      currentId.value = latest._id;
      form.value = {
        radicacionBL: latest.radicacionBL,
        gastosEnDestino: latest.gastosEnDestino,
        collectFee: latest.collectFee,
        emisionEnDestinoBL: latest.emisionEnDestinoBL,
      };
    }
  } catch (error) {
    console.error("[DashboardIncome] Error loading income:", error);
  }
});

const isFormValid = computed(() =>
  form.value.radicacionBL !== null &&
  form.value.gastosEnDestino !== null &&
  form.value.collectFee !== null &&
  form.value.emisionEnDestinoBL !== null
);

const save = async () => {
  saving.value = true;
  successMsg.value = "";
  errorMsg.value = "";

  try {
    const url = currentId.value ? `${API_URL}/income/${currentId.value}` : `${API_URL}/income`;
    const method = currentId.value ? "PUT" : "POST";

    const response = await apiFetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(form.value),
    });

    const result = await response.json();

    if (result.success) {
      currentId.value = result.data._id;
      successMsg.value = "Ingreso guardado exitosamente.";
    } else {
      errorMsg.value = result.message || "Error al guardar el ingreso.";
    }
  } catch (error) {
    console.error("[DashboardIncome] Error saving income:", error);
    errorMsg.value = "Ocurrió un error al guardar.";
  } finally {
    saving.value = false;
  }
};
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

  h3 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #334155;
    margin-bottom: 0;
  }
}
</style>
