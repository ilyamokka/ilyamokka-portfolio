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
                        if (href) this.innerHTML = `<div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;
                height: fit-content;"><a href="${href}"><img src="${src}" style="width: ${width}; height: ${height};"></a><p class="image-text centered-at-the-bottom" style="font-size:${fontsize}; background-color:${color};">${caption}</p></div>`;
                        else this.innerHTML = `<div class="image-card move-${rl}" style="display:block;margin:auto;width: fit-content;
                height: fit-content;"><img src="${src}" style="width: ${width}; height: ${height};"><p class="image-text centered-at-the-bottom" style="font-size:${fontsize}; background-color:${color};">${caption}</p></div>`;
                }, 0)
        }
}
customElements.define('picture-card', PictureCard);