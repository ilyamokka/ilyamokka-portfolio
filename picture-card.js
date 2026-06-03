class PictureCard extends HTMLElement {
        connectedCallback() {
                const src = this.getAttribute('src');
                const width = this.getAttribute('w');
                const height = this.getAttribute('h');
                var caption = this.getAttribute('cap');
                const fontsize = this.getAttribute('fs');
                const color = this.getAttribute('bg');
                var rl = this.getAttribute('rl');
                var href = this.getAttribute('href');
                const fallback = this.getAttribute('fallback');

                if (!caption) caption = "";
                if (!rl) rl = "nowhere";
                setTimeout(() => {
                        if (href === "itself") {
                                var images = "?"
                                var index = 0
                                var currentIndex = 0;
                                
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
                                                        <picture-card src="${src.split('.')[0]}.${fallback}" w="${width}" h="${height}" fs="${fontsize}" bg="${color}" cap="${caption}" rl="${rl}"></picture-card>
                                                </video>
                                        </a>`
                                else this.innerHTML = `
                                <style>#${filename} {
                                        width: ${width};
                                        display:block;
                                }</style>
                                
                                <div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;height: fit-content;"><video id="${filename}" style="width: ${width};object-fit:contain;margin:auto;display:block;" loop autoplay muted playsinline><source src="${src}" type="video/mp4"/><picture-card src="${src.split('.')[0]}.${fallback}" w="${width}" h="${height}" fs="${fontsize}" bg="${color}" cap="${caption}" rl="${rl}"></picture-card></video></div>`
                        } else {
                                if (href) this.innerHTML = `<div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;
                        height: fit-content;"><a href="${href}"><img src="${src}" style="width: ${width}; height: ${height};object-fit:contain;margin:auto;"></a><p class="image-text centered-at-the-bottom" style="font-size:${fontsize}; background-color:${color};">${caption}</p></div>`;
                                else this.innerHTML = `<div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;
                        height: fit-content;"><img src="${src}" style="width: ${width}; height: ${height};margin:auto;display:block;object-fit:contain;"><p class="image-text centered-at-the-bottom" style="font-size:${fontsize}; background-color:${color};">${caption}</p></div>`;
                        }
                }, 0)
                
        }

        setAttribute(name, value) {
                super.setAttribute(name, value)
                if (name === "src") this.connectedCallback()
        }
}
customElements.define('picture-card', PictureCard);