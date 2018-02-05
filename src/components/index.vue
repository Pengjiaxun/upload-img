<template>
    <div class="container">
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__hd">
                    <label class="weui-label">图片上传</label>
                </div>
                <div class="weui-cell__bd">
                    <div class="image-upload-container">
                        <span class="image-container"
                            v-for="(src, index) in baseSrc"
                            :key="index">
                            <img :src="src"
                                v-show="src"
                                class="images"
                                @click="preview(index)">
                            <i @click="delImg(index)">-</i>
                        </span>
                        <span class="add-btn-container">
                            <input type="file"
                                accept="image/*"
                                @change="imgUpload"
                                id="file-input">
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 大图预览 -->
        <div class="swiper-container"
            v-show="previewShow">
            <div class="swiper-wrapper">
                <div class="swiper-slide"
                    v-for="(img, index) in baseSrc"
                    :key="index"
                    @click="previewShow = false">
                    <img :src="img"
                        class="swiper-lazy">
                </div>
            </div>
            <p class="return-tips">轻触返回</p>
            <div class="swiper-pagination swiper-pagination-white"></div>
        </div>
    </div>
</template>

<script>
import weui from 'weui.js'
import lrz from 'lrz/dist/lrz.all.bundle'
import $ from 'n-zepto'

export default {
    data() {
        return {
            baseSrc: [],
            imgUrls: [],
            imgCount: 0,
            previewShow: false,
            swiper: ''
        }
    },
    methods: {
        preview(imgIndex) {
            console.log(imgIndex, 'INDEX')
            this.previewShow = true
            this.$nextTick(() => {
                this.swiper.update()
                this.swiper.slideTo(imgIndex)
            })
        },
        delImg(index) {
            this.baseSrc.splice(index, 1)
            this.imgUrls.splice(index, 1)
        },
        imgUpload(e) {
            var _this = this
            _this.imgCount++;
            if (_this.imgCount > 9) {
                weui.alert('只能上传9张图片哦！')
                return
            }
            if (e.target.files[0]) {
                var loading = weui.loading('图片上传中...')
            } else {
                return
            }
            lrz(e.target.files[0], {
                width: 500,
                height: 500,
                quality: 0.7
            })
                .then(function (rst) {
                    // 处理成功会执行
                    _this.baseSrc.push(rst.base64);
                    _this.swiper.update()
                    $.post('/api/1/picture?method=upload', {
                        content: rst.base64,
                        encode: 'base64'
                    }, function (response) {
                        var response = JSON.parse(response)
                        if (response.errcode == 0) {
                            _this.imgUrls.push(response.data.img_path);
                            loading.hide()
                        } else {
                            weui.alert('图片传输失败，请重试')
                        }
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
                .always(function () { });
        },
        initSwiper() {
            this.swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                zoom: true,
                zoomToggle: false
            });
        }
    },
    mounted() {
        this.initSwiper()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.image-upload-container {
  flex: 1;
  flex-wrap: wrap;
  text-align: left;
  .image-container {
    position: relative;
    display: inline-block;
    width: 3rem;
    height: 3rem;
    margin-right: 5px;
    img {
      width: 100%;
      height: 100%;
    }
    i {
      position: absolute;
      width: 14px;
      height: 14px;
      line-height: 14px;
      border-radius: 50%;
      text-align: center;
      background-color: red;
      top: -0.3rem;
      right: -0.2rem;
      color: #fff;
      font-size: 1rem;
    }
  }
  .add-btn-container {
    position: relative;
    display: inline-block;
    width: 3rem;
    height: 3rem;
    line-height: 40px;
    color: #a7a7a7;
    font-size: 35px;
    font-style: normal;
    font-weight: 100;
    text-align: center;
    vertical-align: top;
    background: url("../assets/add-btn.png") center no-repeat;
    background-size: contain;
    #file-input {
      position: absolute;
      left: 0;
      top: 0;
      width: 45px;
      height: 45px;
      opacity: 0;
      z-index: 10;
    }
  }
}
.swiper-container {
  background: #000;
  position: fixed;
  z-index: 1000;
  background-color: #000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .swiper-slide {
    text-align: center;
    background: #000;
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      -ms-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      position: absolute;
      left: 50%;
      top: 50%;
    }
  }
  p {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translate(-50%);
    font-size: 0.6rem;
    z-index: 1001;
  }
}
</style>
