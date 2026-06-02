<script setup lang="ts">
import { createGreeting, listCapabilities } from "@uniframe/core";

const greeting = createGreeting("Desktop Renderer");
const capabilities = listCapabilities().slice(0, 6);
</script>

<template>
  <main class="desktop-shell">
    <section class="workspace">
      <p class="eyebrow">Desktop UI</p>
      <h1>{{ greeting.title }}</h1>
      <p>{{ greeting.message }}</p>
    </section>

    <section class="panel-grid">
      <article v-for="item in capabilities" :key="item">
        <strong>{{ item }}</strong>
        <span>Desktop renderer icinden calisiyor.</span>
      </article>
    </section>
  </main>
</template>
