<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { createGreeting, fetchHealth, listCapabilities, type HealthResponse } from "@uniframe/core";

const greeting = createGreeting("Vue Web");
const health = ref<HealthResponse>({ ok: false, service: "api" });
const capabilities = computed(() => listCapabilities());

onMounted(async () => {
  health.value = await fetchHealth();
});
</script>

<template>
  <main class="shell">
    <section class="hero">
      <p class="eyebrow">Vue hedefi</p>
      <h1>{{ greeting.title }}</h1>
      <p>{{ greeting.message }}</p>
      <span :class="health.ok ? 'status good' : 'status'">
        {{ health.ok ? "API bagli" : "API bekleniyor" }}
      </span>
    </section>

    <section class="grid">
      <article v-for="item in capabilities" :key="item">
        <span />
        <h2>{{ item }}</h2>
        <p>Bu yetenek Vue hedefinde de ayni core library uzerinden gelir.</p>
      </article>
    </section>
  </main>
</template>
