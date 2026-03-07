import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useQuoteStore = defineStore("quote", () => {
  const fleteChecked = ref(true);
  const aduanaChecked = ref(false);
  const terresteChecked = ref(false);
  const selectedOriginCountry = ref(null);
  const selectedDestinationCountry = ref(null);
  const selectedLoadType = ref(null);
  const selectedContainerType = ref(null);
  const weight = ref("");
  const dimensions = ref("");
  const loadEnsurance = ref(false);
  const originPickup = ref(false);
  const destinationDelivery = ref(false);

  const summary = computed(() => {
    const summaryData = [];

    const services = [];
    if (fleteChecked.value) services.push("Flete Internacional");
    if (aduanaChecked.value) services.push("Aduana");
    if (terresteChecked.value) services.push("Transporte Terrestre");

    if (services.length > 0) {
      summaryData.push({ field: "Servicios", value: services.join(", ") });
    }

    if (selectedOriginCountry.value) {
      summaryData.push({
        field: "Origen",
        value: `${selectedOriginCountry.value.flag} ${selectedOriginCountry.value.name}`,
      });
    }

    if (selectedDestinationCountry.value) {
      summaryData.push({
        field: "Destino",
        value: `${selectedDestinationCountry.value.flag} ${selectedDestinationCountry.value.name}`,
      });
    }

    if (selectedLoadType.value) {
      summaryData.push({
        field: "Tipo de Carga",
        value: selectedLoadType.value.name,
      });
    }

    if (selectedLoadType.value?.value === "lcl") {
      if (weight.value) {
        summaryData.push({
          field: "Peso",
          value: `${weight.value} kg`,
        });
      }

      if (dimensions.value && !dimensions.value.includes("_")) {
        const parts = dimensions.value.split(" x ");
        if (parts.length === 3) {
          const width = parseFloat(parts[0]);
          const length = parseFloat(parts[1]);
          const height = parseFloat(parts[2]);
          if (!isNaN(width) && !isNaN(length) && !isNaN(height)) {
            const volume = width * length * height;
            summaryData.push({
              field: "Volumen",
              value: `${volume.toFixed(2)} m³`,
            });
          }
        }
      }
    }

    if (selectedLoadType.value?.value === "fcl") {
      if (selectedContainerType.value) {
        summaryData.push({
          field: "Tipo de Contenedor",
          value: selectedContainerType.value.name,
        });
      }
      if (weight.value) {
        summaryData.push({
          field: "Peso",
          value: `${weight.value} kg`,
        });
      }
    }

    return summaryData;
  });

  return {
    fleteChecked,
    aduanaChecked,
    terresteChecked,
    selectedOriginCountry,
    selectedDestinationCountry,
    selectedLoadType,
    selectedContainerType,
    weight,
    dimensions,
    loadEnsurance,
    originPickup,
    destinationDelivery,
    summary,
  };
});
