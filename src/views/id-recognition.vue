<template>
    <div class="ma-5">
        <h1>ID Recognition</h1>

        <v-file-input label="Select ID to Scan" variant="outlined" density="compact" v-model="file" />
        <v-text-field label="Enter Label" variant="outlined" density="compact" v-model="label" />

        <div class="id-container">
            <vue-cropper v-if="idPreview" ref="cropper" :src="idPreview" preview=".preview" :responsive="true" :drag-mode="`move`" :movable="false" />
            <template v-for="(coordinate, key) in idCoordinates">
                <span
                    class="font-weight-bold"
                    :style="{
                        position: 'absolute',
                        top: `${coordinate.top - 25}px`,
                        fontSize: '15px',
                        color: 'white',
                        left: `${coordinate.left}px`,
                        backgroundColor: 'red',
                    }"
                    >{{ key }}</span
                >
                <v-card
                    variant="outlined"
                    class="rounded-0 id-label-box"
                    color="red"
                    :style="{
                        top: `${coordinate.top}px`,
                        left: `${coordinate.left}px`,
                        width: `${coordinate.width}px`,
                        height: `${coordinate.height}px`,
                    }">
                </v-card>
            </template>
        </div>

        <!-- <img :src="`${idPreview}`" v-if="idPreview" /> -->

        <!-- <v-btn text="Scan Image" variant="flat" color="blue" size="large" class="rounded-0 text-capitalize" @click="scanImage" />
        <v-btn text="Save Coordinates" variant="flat" color="blue" size="large" class="rounded-0 text-capitalize" @click="saveCroppedArea" /> -->

        <v-btn text="Save Label" variant="flat" color="blue" size="large" class="rounded-0 text-capitalize mr-1" @click="saveLabel" />
        <v-btn text="Scan ID" variant="flat" color="blue" size="large" class="rounded-0 text-capitalize mr-1" @click="scanId" />

        <ul>
            <li v-for="(detail, key) in userDetails">
                <span class="font-weight-bold"> {{ key }} </span>: {{ detail }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import VueCropper from 'vue-cropperjs'
import Tesseract from 'tesseract.js'
import 'cropperjs/dist/cropper.css'
import { ref, watch, reactive } from 'vue'
import { nextTick } from 'vue'

const file = ref<File[]>()

const idPreview = ref<string | ArrayBuffer | null>('')
watch(file, () => {
    if (file.value?.length) {
        const [idImage] = file.value

        const reader = new FileReader()

        reader.onload = (event) => (idPreview.value = event.target!.result)

        reader.readAsDataURL(idImage)
    } else {
        idPreview.value = ''
    }
})

async function scanImage(image: File) {
    const worker = await Tesseract.createWorker('eng')

    const {
        data: { text },
    } = await worker.recognize(image)

    await worker.terminate()

    return text
}

const idCoordinates = reactive<{ [key: string]: { top: number; left: number; width: number; height: number } }>({})

const cropper = ref()
const croppedImage = ref('')
async function saveCroppedArea() {
    croppedImage.value = cropper.value.getCroppedCanvas().toDataURL()

    /* Convert base64 to binary array */
    const binaryData = atob(croppedImage.value.split(',')[1])

    /* Create Blog from binary data */
    const uint8Array = new Uint8Array(Array.from(binaryData, (char) => char.charCodeAt(0)))

    const blob = new Blob([uint8Array], { type: 'png' })

    /* Create File Object */
    const file = new File([blob], 'avatar', { type: 'png' })

    const textResult = await scanImage(file)

    return textResult
}

const label = ref('')
function saveLabel() {
    const boxData = cropper.value.getCropBoxData()

    Object.assign(idCoordinates, {
        [label.value]: boxData,
    })

    label.value = ''

    localStorage.setItem('idCoordinates', JSON.stringify(idCoordinates))

    cropper.value.reset()
}

const userDetails = reactive({})
async function scanId() {
    const coordinates = JSON.parse(`${localStorage.getItem('idCoordinates')}`)

    Object.assign(idCoordinates, coordinates)

    cropper.value.setCropBoxData(coordinates['TIN'])

    Promise.all(
        Object.keys(coordinates).map(async (key) => {
            cropper.value.setCropBoxData(coordinates[key])

            const textResult = await saveCroppedArea()

            Object.assign(userDetails, {
                [key]: textResult.replace('\n', ''),
            })
        })
    )

    cropper.value.destroy()

    console.log(cropper.value)
}
</script>

<style>
.id-container {
    position: relative;
    height: 100%;
    width: 100%;
}

.id-label-box {
    position: absolute;
    z-index: 1;
}
</style>
