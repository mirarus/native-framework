<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { appInfo, createGreeting, type HealthResponse } from "@uniframe/core";

interface TaskItem {
  id: string;
  title: string;
  done: boolean;
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4300";
const greeting = createGreeting("Fullstack Example");
const health = ref<HealthResponse>({ ok: false, service: "api" });
const tasks = ref<TaskItem[]>([]);
const completedTasks = computed(() => tasks.value.filter((task) => task.done).length);

onMounted(async () => {
  health.value = await fetchJson<HealthResponse>("/health", { ok: false, service: "api" });
  const response = await fetchJson<{ items: TaskItem[] }>("/tasks", { items: [] });
  tasks.value = response.items;
});

async function fetchJson<TValue>(path: string, fallback: TValue): Promise<TValue> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`);
    return (await response.json()) as TValue;
  } catch {
    return fallback;
  }
}
</script>

<template>
  <main class="shell">
    <section class="hero">
      <p class="eyebrow">API + Web + Desktop + Android</p>
      <h1>{{ greeting.title }}</h1>
      <p>{{ appInfo.promise }}</p>
      <div class="actions">
        <span :class="health.ok ? 'status good' : 'status'">
          {{ health.ok ? "API bagli" : "API bekleniyor" }}
        </span>
        <span class="status">{{ completedTasks }} / {{ tasks.length }} hazir</span>
      </div>
    </section>

    <section class="grid">
      <article v-for="task in tasks" :key="task.id">
        <strong>{{ task.title }}</strong>
        <span>{{ task.done ? "Hazir" : "Gelistirme adimi" }}</span>
      </article>
    </section>
  </main>
</template>
