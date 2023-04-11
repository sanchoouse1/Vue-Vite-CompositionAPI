<template>
  <div class="container">
      <header-manager />
      <task-form @add="addTask"/>
      <ul class="list-group">
        <task-item v-for="(task, index) in tasks" :task="task" :index="index" @delete="deleteTask" @toggle="toggleCompleted" @edit="editTaskDescription"/>
      </ul>
      <!-- <task-list @delete="deleteTask" @toggle="toggleCompleted" @edit="editTaskDescription" :tasks="tasks"/> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import HeaderManager from "./components/HeaderManager.vue";
import TaskForm from "./components/TaskForm.vue";
import TaskItem from "./components/TaskItem.vue";
import type { Task } from './assets/task'; // импортируем интерфейс Task из файла task.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface FetchTasksResponse {
  data: Task[];
}

// interface FetchTasksError {
//   message: string;
// }

export default defineComponent({
  components: {
    HeaderManager, TaskForm, TaskItem
  },

  setup() {
    const tasks = ref<Task[]>([]);

    const addTask = async (newTaskText: string, newTaskDescription: string, dueDate: Date) => { // EDITED
      const newTask: Task = {
        id: uuidv4(), // генерирую уникальный идентификатор для новой задачи
        text: newTaskText.trim(),
        description: newTaskDescription.trim(),
        completed: false,
        deadline: dueDate,
      };

      try {
        const response = await axios.post('/api/addTasks', newTask);
        // добавляем добавленную задачу в список задач на странице и сортируем список по дате.
        const addedTask: Task = response.data;
        tasks.value.push(addedTask);
        tasks.value.sort((a, b) => (new Date(a.deadline) as any) - (new Date(b.deadline) as any));
      }
      catch (error) {
        console.error(error);
      }
    }

    const fetchTasks = async () => {
      console.log('Хотя бы начало работать');
      try {
        const response = await axios.get<FetchTasksResponse>('/api/getTasks') // ответ с сервера - массив объектов типа Task
        tasks.value = response.data.data; // обновляем список задач в компоненте
        tasks.value.sort((a, b) => (new Date(a.deadline) as any) - (new Date(b.deadline) as any));
      } catch (error: any) {
        console.error(error.message);
      }
    }

    const toggleCompleted = async (index: number, taskId: string) => {
      const task = tasks.value[index];
      task.completed = !task.completed;
      try {
        const response = await axios.put(`/api/toggle/${task.id}`, { completed: task.completed });
        console.log('Task updated successfully!');
      } catch (error) {
        console.log('Произошла ошибка обновления задач на сервере:', error);
          // отменяю изменение, если завершилось неудачей
          task.completed = !task.completed;
      }
    }

    const editTaskDescription = async (index: number, taskId: string) => {
      const newDescription = prompt('Enter new description', tasks.value[index].description);
      console.log(newDescription);
      if (newDescription !== null && newDescription !== undefined) {
        try {
          const response = await axios.put(`/api/editTasks/${taskId}`, { description: newDescription }, { headers: { 'Content-Type': 'application/json' } });
          // Обновляю локальный список задач
          tasks.value.splice(index, 1, response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }

    const deleteTask = async (index: number, taskId: string) => {
      try {
        const response = await axios.delete(`/api/deleteTask/${taskId}`);
        console.log('Задача успешно удалена');
        const indexCheck = tasks.value.findIndex(task => task.id === taskId);
        if (indexCheck !== -1) {
          tasks.value.splice(indexCheck, 1);
        }
      } catch (error) {
        console.error('Произошла ошибка удаления задачи', error);
      }
    }

    onMounted(fetchTasks);

    return { tasks, fetchTasks, addTask, deleteTask, editTaskDescription, toggleCompleted };

  }
})
</script>

<style>

</style>