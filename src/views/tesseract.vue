<template>
    <div class="pa-3">
        {{ scanning }}
        <v-file-input label="Add Image to Scan" variant="outlined" density="compact" v-model="file" :multiple="false" />
        <v-row no-gutters>
            <v-col :cols="6" class="pa-1">
                <v-card>
                    <v-card-title>Scanned Image</v-card-title>

                    <v-card-text>
                        <img :src="filePreview.image" style="width: 100%" />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="6" class="pa-1">
                <v-card>
                    <v-card-title>Result</v-card-title>

                    <v-card-text>
                        <v-slide-x-transition>
                            <div class="d-flex justify-center" style="height: 100%" v-if="scanning">
                                <v-progress-circular :size="50" color="primary" indeterminate class="align-self-center"></v-progress-circular>
                            </div>

                            <span class="text-h7" v-else>{{ textPreview }} </span>
                        </v-slide-x-transition>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import Tesseract from 'tesseract.js'

const file = ref()
const filePreview = reactive({}) as { image: any; file: any }
const textPreview = ref('')
const scanning = ref(false)

async function scanImage(image: any) {
    scanning.value = true

    const worker = await Tesseract.createWorker('eng')

    const {
        data: { text },
    } = await worker.recognize(image)

    textPreview.value = text

    await worker.terminate()

    scanning.value = false
}

watch(file, () => {
    if (file.value.length) {
        const reader = new FileReader()

        reader.onload = (event) => {
            Object.assign(filePreview, {
                image: event?.target?.result,
                file: file.value[0],
            })
        }

        reader.onloadend = () => {
            scanImage(reader?.result)
        }

        reader.readAsDataURL(file.value[0])
    }
})
</script>
