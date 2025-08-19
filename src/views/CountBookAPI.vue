<template>
    <div v-if="apiResponse" class="api-response">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const authorsCount = ref(0)
const totalBooks = ref(0)

// 优先从云函数获取，如果没有配置则回退到本地 JSON
const cloudFunctionUrl = import.meta.env.VITE_CLOUD_FUNCTION_URL || ''

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}


const getApiData = async () => {
  loading.value = true
  error.value = null

  // 1) 若配置了云函数 URL，则优先调用云函数
  if (cloudFunctionUrl) {
    try {
      const res = await fetch(cloudFunctionUrl, { method: 'GET' })
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const cloudData = await res.json()
      // 期望云函数返回与本地一致的数据结构
      apiResponse.value = cloudData
      loading.value = false
      return
    } catch (err) {
      console.error('Cloud function failed, fallback to local JSON.', err)
      error.value = `Cloud function error: ${err.message}. Fallback to local data.`
      // 继续回退到本地 JSON
    }
  }

  // 2) 回退到本地 JSON（使用动态导入，保证打包后路径正确）
  try {
    const module = await import('@/assets/json/authors.json')
    const data = module.default
    authors.value = data
    calculateStats()
    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authorsCount.value,
        totalBooks: totalBooks.value,
        authors: authors.value.map(author => ({
          name: author.name,
          bookCount: author.famousWorks.length,
        }))
      },
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`
    console.error('Error loading authors data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getApiData();
})

defineExpose({
  getApiData
})
</script>
<style scoped>
.api-response {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 15px;
  margin: 15px;
  border-radius: 5px;
  font-family: 'Courier New', Courier, monospace;
}
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>


