import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'

var mySwiper = new Swiper('.slider__container', {
	direction: 'horizontal',
  loop: true,
  slidesPerView:'auto',
	centeredSlides: true,
  spaceBetween: 100,
  autoplay: true,
})
