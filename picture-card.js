class PictureCard extends HTMLElement {
        connectedCallback() {
                const src = this.getAttribute('src');
                const width = this.getAttribute('w');
                const height = this.getAttribute('h');
                let caption = this.getAttribute('cap');
                const fontsize = this.getAttribute('fs');
                let color = this.getAttribute('bg');
                let rl = this.getAttribute('rl');
                let href = this.getAttribute('href');
                const fallback = this.getAttribute('fallback');
                let enlarge = ""

                color = null

                if (!caption) caption = "";
                if (!rl) rl = "nowhere";
                setTimeout(() => {
                        if (href === "itself") {
                                enlarge = "<br><i class='tiny'>Click for fullscreen</i>"

                                let images = "?"
                                let index = 0
                                let currentIndex = 0;
                                
                                Array.from(this.parentElement.childNodes).filter(child => child.nodeName === "PICTURE-CARD").forEach(element => {
                                        if (element.getAttribute("src") === this.getAttribute("src")) currentIndex = index;
                                        images = images + "src" + index++ + "=" + element.getAttribute("src") + "&"
                                });
                                href = `view.html${images}currentIndex=${currentIndex}`
                        
                        }

                        if (src.split('.')[1] === "mp4") {
                                const path = src.split('/')
                                const filename = path[path.length - 1].split('.')[0]

                                if (href) this.innerHTML = `
                                        <style>#${filename} {
                                                width: ${width};
                                                display:block;
                                        }</style>

                                        <a href="${href}" class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;height: fit-content;">
                                                <video id="${filename}"  style="object-fit:contain;margin:auto;display:block;" loop autoplay muted playsinline><source src="${src}" type="video/mp4"/>
                                                        <source src="${src}" type="video/mp4">
                                                        <picture-card src="${src.split('.')[0]}.${fallback}" w="${width}" h="${height}" bg="${color}" cap="${caption}${enlarge}" rl="${rl}"></picture-card>
                                                </video>
                                                <p class="image-text centered-at-the-bottom" background-color:${color};">${caption}${enlarge}</p>
                                        </a>`
                                else this.innerHTML = `
                                <style>#${filename} {
                                        width: ${width};
                                        display:block;
                                }</style>
                                
                                <div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;height: fit-content;"><video id="${filename}" style="width: ${width};object-fit:contain;margin:auto;display:block;" loop autoplay muted playsinline><source src="${src}" type="video/mp4"/><picture-card src="${src.split('.')[0]}.${fallback}" w="${width}" h="${height}" bg="${color}" cap="${caption}${enlarge}" rl="${rl}"></picture-card></video><p class="image-text centered-at-the-bottom" background-color:${color};">${caption}${enlarge}</p></div>`
                        } else {
                                if (href) this.innerHTML = `<div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;
                        height: fit-content;"><a href="${href}"><img src="${src}" style="width: ${width}; height: ${height};object-fit:contain;margin:auto;"></a><p class="image-text centered-at-the-bottom" background-color:${color};">${caption}${enlarge}</p></div>`;
                                else this.innerHTML = `<div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;
                        height: fit-content;"><img src="${src}" style="width: ${width}; height: ${height};margin:auto;display:block;object-fit:contain;"><p class="image-text centered-at-the-bottom" background-color:${color};">${caption}${enlarge}</p></div>`;
                        }
                }, 0)
                
        }

        setAttribute(name, value) {
                super.setAttribute(name, value)
                if (name === "src") this.connectedCallback()
        }
}
customElements.define('picture-card', PictureCard);

window.addEventListener('pageshow', (event) => {
  const previousPage = sessionStorage.getItem('previous_local_page');
  const targetPage = '/specific-page-path'; // Replace with your target path

  if (previousPage === targetPage) {
    // 1. Put your custom JavaScript behavior here
    console.log('User returned from the specific page!');
    
    // 2. Optional: Clear the value so it does not trigger on a normal refresh
    sessionStorage.removeItem('previous_local_page');
  }
});

window.addEventListener('load', async () => {
        const previousPage = sessionStorage.getItem('previous_local_page');
        const split = previousPage.split('/')

        if (split[split.length - 1] == "view.html") {
                sessionStorage.removeItem('previous_local_page');
                return
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let section = urlParams.get('section');

        console.log(section)

        if (section) {
                await waitForAllVideos()
                document.getElementById(section).scrollIntoView()
        }
});

window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('previous_local_page', window.location.pathname);
});

function waitForAllVideos() {
  // 1. Gather all video elements currently in the DOM
  const videos = Array.from(document.querySelectorAll('video'));
  
  console.log(videos)

  if (videos.length === 0) {
    return Promise.resolve(); // No videos found, resolve immediately
  }

  // 2. Map each video element to a Promise
  const videoPromises = videos.map((video) => {
    return new Promise((resolve) => {
      // If the video has already loaded past the first frame, resolve instantly
      if (video.readyState >= 4) { 
        console.log("resolved")
        resolve();
      } else {
        // Otherwise, wait for the 'loadeddata' event to fire
        video.addEventListener('loadeddata', () => {
          console.log("loaded")
          resolve();
        }, { once: true }); // Automatically removes event listener after execution

        // Optional: Error handling if the video fails to load
        video.addEventListener('error', () => {
        console.log("error")
          resolve(); // Resolve anyway to avoid breaking Promise.all block
        }, { once: true });
      }
    });
  });

  // 3. Return a combined Promise that resolves when all conditions are met
  return Promise.all(videoPromises);
}