<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Servicios Adicionales</b>
    </Divider>
    <p class="text-center mb-3">
      ¿Necesitas servicios adicionales para tu carga?
    </p>
    <div class="card flex flex-wrap justify-center gap-4">
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="store.loadEnsurance"
          name="seguro"
          value="loadEnsurance"
        />
        <label for="ingredient1">Seguro de Carga</label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="store.originPickup"
          name="recogida"
          value="originPickup"
        />
        <label for="ingredient2">Recogida en Origen</label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox
          v-model="store.destinationDelivery"
          name="destino"
          value="destinationDelivery"
        />
        <label for="ingredient3">Entrega en Destino</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import Divider from "primevue/divider";
import Checkbox from "primevue/checkbox";
import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();
</script>
