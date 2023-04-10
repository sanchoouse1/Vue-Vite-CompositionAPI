<template>
    <div>
        <ul class="list-group">
            <task-item v-for="(task, index) in tasks" :task="task" :index="index" @delete="deleteTask" @toggle="toggleCompleted" @edit="editTaskDescription"/>
        </ul>
    </div>
    </template>

    <script lang="ts">
    import { defineComponent } from 'vue';
    import TaskItem from "./TaskItem.vue";

    interface Task {
        id: string;
        text?: string;
        description?: string;
        completed?: boolean;
        deadline: Date;
    }

    export default defineComponent({
        components: { TaskItem },
        // принимаем пропсы (как аргумент) из корневого элемента.
        props: {
            tasks: {
                type: Array as () => Task[], // массив объектов типа Task, типы ключей которого заданы в интерфейсе выше
                required: true
            }
        },
        methods: {
            deleteTask(index: number, taskId: string): void {
                this.$emit("delete", index, taskId);
            },
            toggleCompleted(index: number, taskId: string): void {
                this.$emit("toggle", index, taskId);
            },
            editTaskDescription(index: number, taskId: string): void {
                this.$emit("edit", index, taskId, taskId);
            }
        }
    })
    </script>

    <style scoped>

    </style>