<template>
    <form @submit.prevent>
        <div class="input-group mb-3">
            <input v-model="newTaskText" placeholder="Enter a new task" class="form-control"/>
            <input v-model="newTaskDescription" placeholder="Enter a description" class="form-control"/> <!-- ДОБАВЛЕНО -->
            <input v-model="dueDate" type="date" class="form-control"/>
            <button @click="addTask" type="submit" class="btn btn-primary">Add Task</button>
        </div>
    </form>
    </template>

    <script lang="ts">
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        emits: ['add'],

        setup(_, { emit }) {
            const newTaskText = ref('');
            const newTaskDescription = ref('');
            const dueDate = ref<string | null>(null);

            function addTask() {
                if (newTaskText.value.trim()) {
                    //генерируем событие
                    emit('add', newTaskText.value, newTaskDescription.value, dueDate.value); // EDITED
                    newTaskText.value = '';
                    newTaskDescription.value = ''; // ДОБАВЛЕНО
                    dueDate.value = null;
                }
            }

            return { newTaskText, newTaskDescription, dueDate, addTask };
        }
    })
    </script>

    <style scoped>

    </style>