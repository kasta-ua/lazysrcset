# lazysrcset

Minuscule (<1kb) quick (IntersectionObserver-powered) self-initializing lazy loader for responsive images.


## Problem

If you ever tried to use responsive [`srcset`][1] - the one where you supply a few links to the same image, but resized to different width — you know that it doesn't automatically work like you imagine in the beginning. 

Firstly, you have to supply [`sizes` attribute][2], and it can't be relative to your container width, it should be some concrete value (like pixels or something). It supports `vw` (percentage of viewport width), but then your layout could be not as flexible.

Secondly, if you try to determine `sizes` with JavaScript, the browser will automatically download one of the images – most probably the biggest one, since the default value for `sizes` is `100vw`.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset
[2]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes


## So What

This is a solution. Instead of putting image sources into `<img src="" srcset="">`, you put them in `<img data-src="" data-srcset="">`, and then when the image comes close to a viewport:

- If browser does not support `srcset`/`sizes`, `data-src` is copied into `src` 
- If it does support them, then image width is determined and put into `sizes`, and `data-srcset` is copied into `srcset`.

"Close to a viewport" means "at least 1% of an image is closer than 400px to a viewport". This uses IntersectionObserver to be fast and light.


## Usage

See [kasta.ua](https://kasta.ua) for an example of how this works. Ideally, you load this library as early as possible to make images load earlier (unfortunately, we prevent their preloading by browser by making them lazy). We inlined the script into HTML to make sure it's always loaded as early as possible.

Then we use code like that for displaying images:

	<span class="aspect aspect--campaign">
	  <noscript>
	    <img class="aspect-inner"
	         style="aspect-ratio:20/11" 
	         src="/images/640/img.jpg">
	  </noscript>
	  <img class="aspect-inner nojs-hide"
	       style="aspect-ratio:20/11"
	       src="/images/placeholder.jpg"
	       data-src="/images/640/img.jpg"
	       data-srcset="/images/420/img.jpg 420w, /images/640/img.jpg 640w">
	</span>

Three things happen here:

- `<img src>` contains placeholder, which is the same on every image and heavily cached, to look better until real images load
- `lazysrcset` reacts to `data-srcset` on load and makes it so your images load
- in case of disabled JS, noscript is used

One gotcha is that for disabled JavaScript, we also have this bit of styling:

	<noscript>
	  <style>.nojs-hide { display: none !important; }</style>
	</noscript>

This displays only noscript version to users with disabled JS.


## Configuration

All constants (400px, 1%, etc) are intentionally hardcoded inside to make library size smaller. We found that those are generally sensible defaults, but in case you want to change something, just copy this into your codebase and change things directly in code.

If you have some way of adding HTML markup dynamically, make sure you're raising an event on the new elements and modify this library to handle this (see the end of the code). I would appreciate ideas how to handle this better.


## Acknowledgements

This library is inspired by [lazysizes](https://github.com/aFarkas/lazysizes/), but is much smaller in scope and in size.
