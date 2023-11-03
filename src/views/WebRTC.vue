<template>
  <div>WebRTC 内容测试</div>
  <video
    id="localVideo"
    autoplay
    playsinline
    muted
    width="100"
    height="100"
  ></video>
  <canvas></canvas>
  <div v-for="(item, index) in imgList" :key="index" class="item">
    <img :src="item" alt="" />
  </div>
  <div><button @click="takePhoto">拍照</button></div>
  <div>
    <button @click="switchCamera(cameraType === 1 ? 0 : 1)">
      切换前后摄像头
    </button>
  </div>
  <div>
    <button @click="shareScreen">分享屏幕</button>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
export default {
  name: "dashboard",
  setup() {
    const imgList = reactive([]);
    const cameraType = ref(1);
    // 获取本地音视频流(获取电脑设备中的音频/视频)
    async function getLocalStream(constraints) {
      // 获取媒体流
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // 将媒体流设置到 video 标签上播放
      playLocalStream(stream);
    }

    // 播放本地视频流
    function playLocalStream(stream) {
      const videoEl = document.getElementById("localVideo");
      videoEl.srcObject = stream;
    }

    // 拍照
    function takePhoto() {
      const videoEl = document.getElementById("localVideo");
      const canvas = document.createElement("canvas");
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      console.log(imgList);
      imgList.push(canvas.toDataURL("image/png"));
      console.log("🚀🚀🚀 / imgList", imgList);

      // 添加滤镜
      const filterList = [
        "blur(5px)", // 模糊
        "brightness(0.5)", // 亮度
        "contrast(200%)", // 对比度
        "grayscale(100%)", // 灰度
        "hue-rotate(90deg)", // 色相旋转
        "invert(100%)", // 反色
        "opacity(90%)", // 透明度
        "saturate(200%)", // 饱和度
        "saturate(20%)", // 饱和度
        "sepia(100%)", // 褐色
        "drop-shadow(4px 4px 8px blue)", // 阴影
      ];

      for (let i = 0; i < filterList.length; i++) {
        ctx.filter = filterList[i];
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        imgList.push(canvas.toDataURL("image/png"));
      }
    }

    // 获取所有视频输入设备
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("🚀🚀🚀 / devices", devices);
      let videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log(videoDevices, "videoDevices");
    }

    // 切换设备
    async function handleDeviceChange(deviceId) {
      getLocalStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          deviceId: { exact: deviceId },
        },
      });
    }

    // 切换前后摄像头
    function switchCamera(val) {
      let constraints = {
        video: true, // 开启默认摄像头
        audio: true,
      };
      constraints.video = {
        // 强制切换前后摄像头时，当摄像头不支持时，会报一个OverconstrainedError［无法满足要求的错误］
        facingMode: { exact: val === 1 ? "user" : "environment" },
        // 也可以这样当前后摄像头不支持切换时，会继续使用当前摄像头，好处是不会报错
        // facingMode: val === 1 ? 'user' : 'environment',
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log("切换成功");
          playLocalStream(stream);
        })
        .catch((err) => {
          console.log("你的设备不支持切换前后摄像头");
        });
    }

    // 获取屏幕共享的媒体流: getDisplayMedia
    async function shareScreen() {
      let localStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });
      // 播放本地视频流
      playLocalStream(localStream);
    }

    onMounted(() => {
      getLocalStream({
        audio: false,
        video: true,
      });
      getDevices();
    });

    return {
      imgList,
      cameraType,
      takePhoto,
      switchCamera,
      shareScreen,
    };
  },
};
</script>

<style scoped lang="less"></style>
