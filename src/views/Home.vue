<template>
  <!-- <link rel="stylesheet" href="build/vanilla-calendar.min.css" />
  <script src="build/vanilla-calendar.min.js"></script> -->
  <div id="home_ctn">
    <div id="content_ctn">
      <div class="ctn_image">
        <img v-show="1" :src="path.cover4" alt="">
        <img v-show="1" :src="path.cover5" alt="">
        <img v-show="1" :src="path.cover6" alt="">
      </div>
      <div class="title_box">
        <!-- <span>CHIANG MAI UNIVERSITY </span>  -->
        <span>WANORNLY UNIVERSITY </span> 
        <span>LIBRARY</span>
      </div>
      <div class="box_logo" v-on:click="openWanornly()">
        Monkey Racer Team
        <span class="monkey_icon">
          <img :src="path.monkey_Icon" alt="">
        </span>
      </div>
      <!-- <img id="cover_img" :src="path.coverPath" alt=""> -->

      <div class="calendar_box">
            <div class="container">
              <div class="left">
                <div class="calendar">
                  <div class="month">
                    <i class="fas fa-angle-left prev"></i>
                    <div class="date">december 2015</div>
                    <i class="fas fa-angle-right next"></i>
                  </div>
                  <div class="weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                  </div>
                  <div class="days"></div>
                  <div class="goto-today">
                    <div class="goto">
                      <input type="text" placeholder="mm/yyyy" class="date-input" />
                      <button class="goto-btn">Go</button>
                    </div>
                    <button class="today-btn">Today</button>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="today-date">
                  <div class="event-day">wed</div>
                  <div class="event-date">12th december 2022</div>
                </div>
                <div class="events"></div>
                <div class="add-event-wrapper">
                  <div class="add-event-header">
                    <div class="title">Add Event</div>
                    <i class="fas fa-times close"></i>
                  </div>
                  <div class="add-event-body">
                    <div class="add-event-input">
                      <input type="text" placeholder="Event Name" class="event-name" />
                    </div>
                    <div class="add-event-input">
                      <input
                        type="text"
                        placeholder="Event Time From"
                        class="event-time-from"
                      />
                    </div>
                    <div class="add-event-input">
                      <input
                        type="text"
                        placeholder="Event Time To"
                        class="event-time-to"
                      />
                    </div>
                  </div>
                  <div class="add-event-footer">
                    <button class="add-event-btn">Add Event</button>
                  </div>
                </div>
              </div>
              <button class="add-event">
                <i class="fas fa-plus"></i>
              </button>
            </div>

            <!-- <div class="credits">
              <p>
                Watch Tutorial on Youtube
                <a href="https://youtu.be/6EVgmpm4z5U" target="_blank">Open Source Coding</a>
              </p>
            </div> -->
      </div>
      <div class="boardcase_box">
        <h1>Coming soon :P</h1>
      </div>
      <div class="footer">
        <div>ABOUT</div>
        <div>INFORMATION FOR</div>
        <div>CONTACT</div>
        <div>| LINE</div>
        <div>| FACKBOOK</div>
        <div>| TWITTER</div>
        <!-- <br>
        <hr> -->
      </div>


    </div>
  </div>
</template>

<script>
// import VanillaCalendar from '@uvarov.frontend/vanilla-calendar';

export default {
  name: 'homePage',
  components: {
    // Searchbar
  },
  data() {
    return {
      path: {
        cover1: require('../assets/images/bg3.jpg'),
        cover2: require('../assets/images/bg1.jpg'),
        cover3: require('../assets/images/bg2.jpg'), 
        monkey_Icon: require('../assets/images/monkey_icon2.png'), 
        cover4: require('../assets/images/bgw1.jpg'), 
        cover5: require('../assets/images/bgw2.jpg'), 
        cover6: require('../assets/images/bgw3.jpg'), 
      },
      state: 0,
      ctn_image_all: null
    }
  },
  methods : {
    openWanornly() {
      console.log('asd'); 
      window.open('https://testsoftware-26edd.web.app', '_blank')
    },
    timeoutFunc() {
      let ctn_image = this.ctn_image_all
      // console.log(' ctn_image: ',  ctn_image.childNodes[this.state])
      ctn_image.childNodes[(this.state) % 3].classList.add('cover_fade_active')
      setTimeout(() => {
        ctn_image.childNodes[(this.state) % 3].style.zIndex = '0'
        ctn_image.childNodes[(this.state) % 3].classList.remove('cover_fade_active')
        ctn_image.childNodes[((this.state)+1) % 3].style.zIndex = '2'
        ctn_image.childNodes[((this.state)+2) % 3].style.zIndex = '1'
        this.state += 1
      }, 2100)
      setTimeout(this.timeoutFunc, 8000);
    }
  },
  mounted() {
    let init = () => {
      let title_box = document.getElementsByClassName('title_box')[0]
      title_box.style.top = `calc(50vh - ${title_box.clientHeight/2}px)`

      setTimeout(() => {
        let box_logo = document.getElementsByClassName('box_logo')[0]
        box_logo.style.top = `${title_box.getBoundingClientRect().y + title_box.clientHeight * 1.2}px`
      }, 200)
      
      let ctn_image = document.getElementsByClassName('ctn_image')[0]
      this.ctn_image_all = ctn_image
      ctn_image.childNodes[0].style.zIndex = '2'
      ctn_image.childNodes[1].style.zIndex = '1'
      ctn_image.childNodes[2].style.zIndex = '0'

      let calendar_box = document.getElementsByClassName('calendar_box')[0]
      calendar_box.height = `${calendar_box.clientWidth * 0.8}px`
      let boardcase_box = document.getElementsByClassName('boardcase_box')[0]
      boardcase_box.style.height = `${calendar_box.clientHeight}px`
    }


    setTimeout(() => {
      init()
      setTimeout(() => {
        this.timeoutFunc()
      }, 8000);
    }, 290);
  }
}
</script>
  
<style>
  @import '../assets/css/home.css';
</style>