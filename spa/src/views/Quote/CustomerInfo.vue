<template>
  <div>
    <Divider align="center" type="dotted">
      <b>Información del Cliente</b>
    </Divider>
    <div class="flex flex-wrap justify-center gap-5">
      <div class="w-full lg:w-1/4 md:w-full sm:w-full flex flex-col gap-1">
        <FloatLabel variant="on">
          <IconField>
            <InputText
              id="customer_name"
              class="w-full"
              size="large"
              v-model="store.customerName"
              :invalid="touched.name && !store.customerName.trim()"
              @blur="touched.name = true"
            />
            <InputIcon>
              <font-awesome-icon icon="fa-solid fa-user" />
            </InputIcon>
          </IconField>
          <label for="customer_name" class="text-base">Nombre *</label>
        </FloatLabel>
        <small v-if="touched.name && !store.customerName.trim()" class="text-red-500 text-base">
          El nombre es obligatorio.
        </small>
      </div>

      <div class="w-full lg:w-1/4 md:w-full sm:w-full flex flex-col gap-1">
        <FloatLabel variant="on">
          <IconField>
            <InputText
              id="customer_phone"
              class="w-full"
              size="large"
              v-model="store.customerPhone"
              :invalid="touched.phone && !!phoneError"
              @blur="touched.phone = true"
            />
            <InputIcon>
              <font-awesome-icon icon="fa-solid fa-phone" />
            </InputIcon>
          </IconField>
          <label for="customer_phone" class="text-base">Teléfono</label>
        </FloatLabel>
        <small v-if="touched.phone && phoneError" class="text-red-500 text-base">
          {{ phoneError }}
        </small>
      </div>

      <div class="w-full lg:w-1/4 md:w-full sm:w-full flex flex-col gap-1">
        <FloatLabel variant="on">
          <IconField>
            <InputText
              id="customer_email"
              class="w-full"
              size="large"
              v-model="store.customerEmail"
              :invalid="touched.email && !!emailError"
              @blur="touched.email = true"
            />
            <InputIcon>
              <font-awesome-icon icon="fa-solid fa-envelope" />
            </InputIcon>
          </IconField>
          <label for="customer_email" class="text-base">Correo Electrónico</label>
        </FloatLabel>
        <small v-if="touched.email && emailError" class="text-red-500 text-base">
          {{ emailError }}
        </small>
      </div>
    </div>
    <Message severity="info" :closable="false" class="mt-5">
      Le solicitamos su nombre, correo electrónico y número de teléfono con el fin de poder contactarlo y brindarle mayor información sobre la cotización marítima realizada.
    </Message>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import Divider from "primevue/divider";
import Message from "primevue/message";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useQuoteStore } from "@/stores/quote";

const store = useQuoteStore();

const touched = reactive({ name: false, phone: false, email: false });

const phoneRegex = /^[+]?[\d\s\-().]{7,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneError = computed(() => {
  if (!store.customerPhone) return "";
  return phoneRegex.test(store.customerPhone) ? "" : "Ingrese un número de teléfono válido.";
});

const emailError = computed(() => {
  if (!store.customerEmail) return "";
  return emailRegex.test(store.customerEmail) ? "" : "Ingrese un correo electrónico válido.";
});
</script>

<style>
.p-message-text {
  font-size: 1rem;
}
</style>
