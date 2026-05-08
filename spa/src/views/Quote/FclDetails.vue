<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Dimensiones del Contenedor</b>
    </Divider>
    <div class="flex flex-wrap justify-center items-center gap-5">
      <FloatLabel class="w-full lg:w-[32%] md:w-full sm:w-full" variant="on">
        <Select
          v-model="store.selectedContainerType"
          :options="containerTypes"
          inputId="container_type"
          optionLabel="name"
          class="w-full"
          size="large"
        />
        <label for="container_type" class="text-base">Tipo de Contenedor</label>
      </FloatLabel>
      <FloatLabel class="w-full lg:w-[32%] md:w-full sm:w-full" variant="on">
        <IconField>
          <InputNumber id="weight" class="w-full" size="large" v-model="store.weight" showClear />
          <InputIcon>
            <font-awesome-icon icon="fa-solid fa-weight-hanging" />
          </InputIcon>
        </IconField>
        <label for="weight" class="text-base">Peso en Kg (máx. 28 000 kg)</label>
      </FloatLabel>
      <Fieldset class="w-full lg:w-[32%] md:w-full sm:w-full" legend="IMO">
        <RadioButtonGroup name="ingredient" class="flex flex-wrap gap-4">
          <div class="flex items-center gap-2">
            <RadioButton inputId="cheese" value="Cheese" size="large" />
            <label for="cheese" class="text-base">Si</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioButton inputId="mushroom" value="Mushroom" size="large" />
            <label for="mushroom" class="text-base">No</label>
          </div>
        </RadioButtonGroup>
      </Fieldset>
    </div>
  </div>
</template>

<script setup>
import Divider from "primevue/divider";
import FloatLabel from "primevue/floatlabel";
import InputNumber from "primevue/inputnumber";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Fieldset from "primevue/fieldset";
import RadioButton from "primevue/radiobutton";
import RadioButtonGroup from "primevue/radiobuttongroup";
import Select from "primevue/select";
import { useQuoteStore } from "@/stores/quote";
import { CONTAINER_TYPES } from "@/utils/constants";

const store = useQuoteStore();
const containerTypes = CONTAINER_TYPES;
</script>
