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

window.addEventListener('load', async () => {
        const previousPage = sessionStorage.getItem('previous_local_page');

        if (previousPage) {
                const split = previousPage.split('/')

                if (split[split.length - 1] == "view.html") {
                        sessionStorage.removeItem('previous_local_page');
                        return
                }
        }

        setTimeout(async () => {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                let section = urlParams.get('section');

                if (section) {
                        await waitForAllVideos()
                        document.getElementById(section).scrollIntoView()
                }
        }, 150)
});

window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('previous_local_page', window.location.pathname);
});

function waitForAllVideos() {
  // 1. Gather all video elements currently in the DOM
  const videos = Array.from(document.querySelectorAll('video'))
  const images = Array.from(document.querySelectorAll('img'))

  console.log(videos)
  console.log(images)

  if (videos.length === 0 && images.length === 0) {
    return Promise.resolve();
  }

  const videoPromises = videos.map((video) => {
    return new Promise((resolve) => {
      if (video.readyState >= 4) {
        resolve();
      } else {
        video.addEventListener('loadeddata', () => {
          resolve();
        }, { once: true });

        video.addEventListener('error', () => {
          resolve();
        }, { once: true });
      }
    });
  });

  const imagePromises = images.map((image) => {
    return new Promise((resolve) => {
      if (image.complete) {
        resolve();
      } else {
        img.addEventListener('load', resolve(), { once: true });
        img.addEventListener('error', resolve(), { once: true });
      }
    });
  });

  videoPromises.push(...imagePromises)
  console.log(videoPromises)
  return Promise.all(videoPromises);
}