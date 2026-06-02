<script setup lang="ts">
import { appInfo, createGreeting, listCapabilities } from "@uniframe/core";

const greeting = createGreeting("Example Project");
const capabilities = listCapabilities().slice(0, 5);
</script>

<template>
  <main class="example-shell">
    <section class="intro">
      <p class="eyebrow">Example project</p>
      <h1>{{ greeting.title }}</h1>
      <p>{{ appInfo.promise }}</p>
    </section>

    <section class="capabilities">
      <article v-for="item in capabilities" :key="item">
        <strong>{{ item }}</strong>
        <span>Library import ile kullaniliyor.</span>
      </article>
    </section>
  </main>
</template>
