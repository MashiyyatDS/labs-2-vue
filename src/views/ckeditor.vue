<template>
    <div class="mb-1">
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" />
    </div>

    <v-btn text="Save Editor" color="blue" variant="flat" @click="saveEditor" />
</template>

<script setup lang="ts">
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import { ref, reactive } from 'vue'

const editor = ref(ClassicEditor)
const editorData = ref('<p><strong>Working Naman</strong></p><p>&nbsp;</p><p><strong>ASDASD</strong></p>')
const editorConfig = reactive({})

function saveEditor() {
    console.log(editorData.value)
}
</script>
