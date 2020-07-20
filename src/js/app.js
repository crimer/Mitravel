import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'

const headerSlider = document.querySelector('#headerSlider')
const videosSlider = document.querySelector('#featuredVideosSlider')
const burger = document.querySelector('#budger')
const burgerClose = document.querySelector('#budger-close')
const menu = document.querySelector('#menu')
const videoPlayButtons = document.querySelectorAll('#videoPlayBtn')

var headerSwiper = new Swiper(headerSlider, {
	direction: 'horizontal',
	loop: true,
	width: 500,
	slidesPerView: 'auto',
	centeredSlides: true,
	spaceBetween: 20,
	autoplay: true,
	effect: 'fade',
	navigation: {
		nextEl: '#control-right',
		prevEl: '#control-left',
	},
	fadeEffect: { crossFade: true },
})
var featuredVideosSwiper = new Swiper(videosSlider, {
	direction: 'horizontal',
	loop: true,
	slidesPerView: 'auto',
	centeredSlides: true,
	spaceBetween: 100,
	autoplay: true,
})

burger.addEventListener('click', () => {
	menu.classList.add('menu--visible')
})
burgerClose.addEventListener('click', () => {
	menu.classList.remove('menu--visible')
})
videoPlayButtons.forEach(el => {
	el.addEventListener('click', e => {
		let video = e.currentTarget
			.closest('.main-slider__media')
			.querySelector('video')
		video.play()
		e.currentTarget.style.display = 'none'
		setTimeout(() => {
			video.volume = 1
		}, 1000)
	})
})
headerSwiper.on('transitionEnd', () => {
	let videos = document.querySelectorAll('.main-slider__media video')
	videos.forEach(el => {
		el.pause()
	})
	videoPlayButtons.forEach(el => {
		el.style.display = 'block'
	})
})
