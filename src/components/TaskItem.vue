<template>
    <li class="list-group-item">
        <div class="form-check">
            <input @click="toggleCompleted" type="checkbox" v-model="task.completed" class="form-check-input"/>
            <label class="form-check-label" :class="{ 'text-decoration-line-through': task.completed }">{{ task.text }}</label>
            <span class="badge bg-info ms-3" v-if="task.description">{{ task.description }}</span>     <!-- ДОБАВЛЕНО -->
            <span class="badge bg-dark ms-3" v-if="task.deadline">{{ task.deadline }}</span>
            <button @click="deleteTask" type="button" class="btn btn-danger ms-2 float-end">Delete</button>
            <button @click="editTaskDescription" type="button" class="btn btn-info me-2 float-end">Edit</button>
        </div>
    </li>
    </template>

    <script lang="ts">
    import { defineComponent } from 'vue';
    import type { PropType } from 'vue';
    import type { Task } from '../assets/task'; // импортируем интерфейс Task из файла task.ts

    export default defineComponent({
        props: {
            task: {
                type: Object as PropType<Task>, // PropType - тип, используемый для определения типов пропсов
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },

        emits: ['delete', 'toggle', 'edit'],

        setup(props, { emit }) {
            const deleteTask = (): void => {
                emit('delete', props.index, props.task.id);
            };

            const toggleCompleted = (): void => {
                emit('toggle', props.index, props.task.id);
            };

            const editTaskDescription = (): void => {
                emit('edit', props.index, props.task.id);
            };

            return { deleteTask, toggleCompleted, editTaskDescription };

            // если я планирую изменять значение пропса task в родительском компоненте, то нужно будет делать его реактивным
        }
    })
    </script>

    <style scoped>

    </style>