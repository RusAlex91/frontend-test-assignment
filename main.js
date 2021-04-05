const galleryfill = {
    //for testing purpose
    createRandomImages: function() {
        let randomN = galleryfill.getRundomNumber(10, 20)
        let gallery = document.getElementsByClassName("gallery")[0]
        var sheet = window.document.styleSheets[0];
        for (let image = 0; image < randomN; image++) {
            var img = document.createElement('img');
            img.classList.add(`gallery__item`);
            img.classList.add(`gallery__item_${image}`);
            gallery.appendChild(img);
            let randomWidth = galleryfill.getRundomNumber(100, 250);
            let randomHeight = galleryfill.getRundomNumber(50, 150);
            sheet.insertRule(`.gallery__item_${image} {
                width: ${randomWidth}px;
                height: 200px;
                background-color: black;
                border: 1px solid tomato;
                // margin: 1rem;
                // box-shadow: 0.3rem 0.4rem 0.4rem rgba(0, 0, 0, 0.4);
                }`)
        }
        galleryfill.createEventListners()
    },
    //for testing purpose
    getRundomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    },
    createEventListners: function() {

        let galleryArr = document.getElementsByClassName("galleryList__item")
        let modal = document.getElementsByClassName("modal")[0]
        var images = document.querySelectorAll('.galleryList__item img');
        Array.from(galleryArr).forEach((li, key) => {

            if (li.getAttribute('enlarge-modal-listener') !== 'true') {
                li.addEventListener("click", function() {
                        li.classList.toggle("enlarged")
                        modal.classList.toggle("blackModal")
                    })
                    //check when image is load
                images[key].addEventListener("load", (event) => {
                    //Just for preloader demonstration when drag n drop image 
                    setTimeout(() => {
                        [].forEach.call(document.querySelectorAll('img[data-src-1]'), (img) => {
                            img.setAttribute('src', img.getAttribute('data-src-1'));
                            img.removeAttribute('data-src-1');
                            galleryControls.initDeleteBtn()
                        });
                    }, 1000);

                });
                modal.addEventListener("click", function() {
                    Array.from(galleryArr).forEach(li => {
                        li.classList.remove("enlarged")
                    });
                    modal.classList.remove("blackModal")
                })
                li.setAttribute('enlarge-modal-listener', 'true');
            }
        });
    }
}

//for initial images
galleryfill.createEventListners()

const galleryLoad = {
    urlTemplateUpload: function(imageSrc) {
        let gallery = document.getElementsByClassName("galleryList")[0]
        let li = document.createElement("li");
        let img = document.createElement('img');
        let div = document.createElement("div");
        let button = document.createElement("button")

        img.setAttribute("loading", "lazy")
        img.setAttribute("decoding", "async")
        img.setAttribute("data-src-1", imageSrc)
            //preloader img
        img.src = "https://i.pinimg.com/originals/6b/67/cb/6b67cb8a166c0571c1290f205c513321.gif"

        li.appendChild(img)
        li.classList.add(`galleryList__item`);

        div.classList.add("middleWrapper");
        button.classList.add("middleWrapper__deletebtn");
        button.textContent = "delete"
        div.appendChild(button)

        li.appendChild(div)

        gallery.appendChild(li);
    },
    urlUpload: function() {
        document.getElementById("upload-img-btn").addEventListener("click", function() {
            let imageInput = document.getElementById("upload-img-input");
            galleryLoad.urlTemplateUpload(imageInput.value)
            galleryfill.createEventListners()
        })
    },
    fileUpload: function() {

        input = document.getElementById('upload-file-input');
        if (!input.files[0]) {
            alert("Please select a file");
        } else {
            var file = input.files[0];
            var fr = new FileReader();
            fr.onload = receivedText;
            fr.readAsText(file);
        }

        function receivedText(e) {
            let lines = e.target.result;
            var newArr = JSON.parse(lines);
            Object.keys(newArr.galleryImages).forEach(key => {
                galleryLoad.urlTemplateUpload(newArr.galleryImages[key].url)
            });
            galleryfill.createEventListners()
        }

    },
    dndUpload: function(files) {
        for (file of files) {
            let url = URL.createObjectURL(file)
            galleryLoad.urlTemplateUpload(url)
        }
        galleryfill.createEventListners()
    }
}

galleryLoad.urlUpload()




const dndHandlers = {
    upload: function() {
        let dropArea = document.getElementById('drop-area');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        })

        function preventDefaults(e) {
            e.preventDefault()
            e.stopPropagation()
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false)
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false)
        })

        function highlight(e) {
            dropArea.classList.add('highlight')
        }

        function unhighlight(e) {
            dropArea.classList.remove('highlight')
        }

        dropArea.addEventListener('drop', handleDrop, false)

        function handleDrop(e) {

            let dt = e.dataTransfer
            let files = dt.files
            galleryLoad.dndUpload(files)
        }

    },
    move: function() {
        var dragSrcEl = undefined;

        function allowDrop(e) {
            e.preventDefault();
        }

        function drag(e) {
            dragSrcEl = this;
            e.dataTransfer.setData('text/html', this.innerHTML);
        }

        function drop(e) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        var cols = document.querySelectorAll('.galleryList__item');
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', drag, false);
            col.addEventListener('dragover', allowDrop, false);
            col.addEventListener('drop', drop, false);
        });
    }
}

dndHandlers.upload()
dndHandlers.move()


galleryControls = {
        initDeleteBtn: function() {
            var closeBtns = document.querySelectorAll('.middleWrapper__deletebtn')

            for (var i = 0, l = closeBtns.length; i < l; i++) {
                closeBtns[i].addEventListener('click', function(e) {
                    e.stopPropagation()
                    var imgWrap = this.parentElement.parentElement;

                    imgWrap.parentElement.removeChild(imgWrap);
                });
            }
        }
    }
    //inital for exist images
galleryControls.initDeleteBtn()

function enableStylesheet() {

    document.getElementById('main').href = 'alternative.css';
    document.getElementsByClassName("galleryList")[0].classList.add("gallery-grid")
}

function disableStylesheet(node) {
    document.getElementById('main').href = 'main.css';
    document.getElementsByClassName("galleryList")[0].classList.remove("gallery-grid")
}