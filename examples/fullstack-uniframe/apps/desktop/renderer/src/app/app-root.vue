<script setup lang="ts">
import { createGreeting } from "@uniframe/core";

const greeting = createGreeting("Desktop App");

const panels = [
  "Native pencere",
  "Desktop renderer UI",
  "API ile ayni proje",
  "Web hedefinden bagimsiz arayuz"
];
</script>

<template>
  <main class="desktop-shell">
    <section class="hero">
      <p class="eyebrow">Fullstack desktop</p>
      <h1>{{ greeting.title }}</h1>
      <p>Bu alan desktop hedefinin kendi renderer UI dosyalarini temsil eder.</p>
    </section>

    <section class="grid">
      <article v-for="panel in panels" :key="panel">
        <strong>{{ panel }}</strong>
        <span>Desktop hedefinde gelistirilebilir.</span>
      </article>
    </section>
  </main>
</template>
