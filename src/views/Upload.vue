<template>
  <input type="file" id="file" v-on:change="getFiles($event)"/>

  <div>
    <div style="display: inline-block">
      校验进度：<a-progress :percent="validateNum" status="active" />
    </div>
    <div>
      上传进度：<a-progress :percent="uploadNum" status="active" />
    </div>
  </div>

</template>

<script>
import { reactive, toRefs } from 'vue'
const SparkMD5 = require('@/assets/libs/spark-md5.min')
let chunkSize = 2 * 1024 * 1024
let fileSize = 0
let file = null
let hasUploaded = 0
let chunks = 0
import { checkFileMD5, uploadPic, finishUpload } from '@/utils/upload'
export default {
  name: "Upload",
  setup() {
    const data = reactive({
      validateNum: 10,
      uploadNum: 70
    })
    return {
      ...toRefs(data)
    }
  },
  mounted() {},
  methods: {
    getFiles(e) {
      file = e.target.files[0]
      fileSize = file.size;
      this.$options.methods.responseChange(e.target.files[0])
    },
    async responseChange(e) {
      // 第一步：按照 修改时间+文件名称+最后修改时间-->MD5
      // 开始校验
      let fileMd5Value = await this.md5File(e)
      // 第二步：校验文件的MD5
      let result = await this.checkFileMD5(e.name, fileMd5Value)
      if (result.file) {
        this.$Message.info('文件已秒传')
        return
      }
      // 第三步：检查并上传MD5
      await this.checkAndUploadChunk(fileMd5Value, result.chunkList)
      // 第四步: 通知服务器所有分片已上传完成
      await this.notifyServer(fileMd5Value)
    },
    md5File(file) {
      let _this = this
      return new Promise((resolve, reject) => {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            //chunkSize = 2097152, // Read in chunks of 2MB
            chunkSize = file.size / 100,
            //chunks = Math.ceil(file.size / chunkSize),
            chunks = 100,
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = function (e) {
          spark.append(e.target.result); // Append array buffer
          currentChunk++;
          _this.validateNum = currentChunk
          console.log('校验进度', _this.validateNum)
          if (currentChunk < chunks) {
            loadNext();
          } else {
            console.log('finished loading');
            let result = spark.end()
            resolve(result)
          }
        };

        fileReader.onerror = function () {
          console.warn('oops, something went wrong.');
        };

        function loadNext() {
          let start = currentChunk * chunkSize,
              end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext();
      })
    },
    checkFileMD5(fileName, fileMd5Value) {
      return checkFileMD5({fileName, fileMd5Value})
    },
    async checkAndUploadChunk(fileMd5Value, chunkList) {
      chunks = Math.ceil(fileSize / chunkSize)
      hasUploaded = chunkList.length
      for (let i = 0; i < chunks; i++) {
        let exit = chunkList.indexOf(i + "") > -1
        // 如果已经存在, 则不用再上传当前块
        if (!exit) {
          await this.upload(i, fileMd5Value, chunks)
          hasUploaded++
          this.uploadNum = Math.floor((hasUploaded / chunks) * 100)
          console.log('进度纷纷比', this.validateNum, this.uploadNum)
        }
      }
    },
    // 3-2. 上传chunk
    upload(i, fileMd5Value, chunks) {
      return new Promise((resolve, reject) => {
        //构造一个表单，FormData是HTML5新增的
        let end = (i + 1) * chunkSize >= file.size ? file.size : (i + 1) * chunkSize
        let form = new FormData()
        form.append("data", file.slice(i * chunkSize, end)) //file对象的slice方法用于切出文件的一部分
        form.append("total", chunks) //总片数
        form.append("index", i) //当前是第几片
        form.append("fileMd5Value", fileMd5Value)
        uploadPic(form).then(data => resolve(data.desc))
      })
    },

    // 第四步: 通知服务器所有分片已上传完成
    notifyServer(fileMd5Value) {
      finishUpload({md5: fileMd5Value, fileName: file.name, size: file.size}).then(() => alert('上传成功'))
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
