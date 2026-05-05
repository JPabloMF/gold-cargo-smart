<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Peso y Dimensiones de la Carga</b>
    </Divider>
    <div class="flex flex-wrap justify-center items-center gap-5">
      <FloatLabel class="w-full lg:w-[32%] md:w-full sm:w-full" variant="on">
        <IconField>
          <InputNumber id="weight" class="w-full" size="large" v-model="store.weight" showClear />
          <InputIcon>
            <font-awesome-icon icon="fa-solid fa-weight-hanging" />
          </InputIcon>
        </IconField>
        <label for="weight" class="text-base">Peso en Kg</label>
      </FloatLabel>
      <div class="flex flex-col gap-1 w-full lg:w-[32%] md:w-full sm:w-full">
        <FloatLabel variant="on">
          <IconField>
            <InputMask
              id="dimensions"
              class="w-full"
              size="large"
              v-model="store.dimensions"
              mask="9.9 x 9.9 x 9.9"
              showClear
            />
            <InputIcon>
              <font-awesome-icon icon="fa-solid fa-ruler-vertical" />
            </InputIcon>
          </IconField>
          <label for="dimensions" class="text-base">Dimensiones: Ancho (m) x Largo (m) x Alto (m)</label>
        </FloatLabel>
        <small class="text-surface-400 text-s text-yellow-500">
          <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
          Las dimensiones deben ser dadas en metros.
        </small>
      </div>
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
import InputMask from "primevue/inputmask";
import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();
</script>
