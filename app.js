const fileInput = document.querySelector(".file-input");
filterOptions = document.querySelectorAll(".filter button");
filterName = document.querySelector(".filter-info .name");
filterValue = document.querySelector(".filter-info .value");
filterSlider = document.querySelector(".slider input");
rotateOptions = document.querySelectorAll(".rotate button");
previewImg = document.querySelector(".preview-img img");
resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
saveImgBtn = document.querySelector(".save-img");

// Bouton pour enlever l'arrière plan
removeBgBtn = document.querySelector('#removebg')

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
}

const loadImage = () => {
    let file = fileInput.files[0]; //obtenir le fichier sélectionné par l'utilisateur
    if (!file) return //retourner si l'utilisateur n'a pas sélectionné le fichier
    previewImg.src = URL.createObjectURL(file);//passer l'URL du fichier comme aperçu img src
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();//en cliquant sur réinitialiser le bouton, la valeur du filtre est donc réinitialisée si l'utilisateur sélectionne une nouvelle img 
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => { //ajout d'un écouteur d'événement de clic à tous les boutons de filtre
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;

        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;

        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;

        }
    })
});
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");//obtenir le bouton de filtre sélectionné

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === 'inversion') {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {//ajout d'un écouteur d'événement de clic à tous les boutons de rotation/retournement
        if (option.id === "left") {
            rotate -= 90; //si vous cliquez sur le bouton, faites pivoter à gauche, décrémentez la valeur de rotation de -90
        } else if (option.id === "right") {
            rotate += 90; //si vous cliquez sur le bouton, faites pivoter à gauche, incrémentez la valeur de rotation de +90
        } else if (option.id === "horizontal") {
            //si la valeur flipHorizontal est 1, définissez cette valeur
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            // si la valeur flipVertical est 1, définissez cette valeur
            flipVertical = flipVertical === 1 ? -1 : 1;

        }
        applyFilters();
    });
});
const resetFilter = () => {
    //réinitialiser toutes les valeurs de variables à leur valeur par défaut
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();// en cliquant sur le bouton de luminosité, donc la luminosité sélectionnée par défaut
    applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement("canvas"); //création d'un élément de canvas
    const ctx = canvas.getContext("2d");//canvas.getContext() renvoyer un contexte de dessin sur le canvas
    canvas.width = previewImg.naturalWidth;//définir la largeur du canvas sur la largeur réelle de l'image
    canvas.height = previewImg.naturalHeight;//définir la largeur du canvas sur la hauteur réelle de l'image
    //application des filtres sélectionnés par l'utilisateur aux filtres de canvas 
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2) //traduire canvas à partir du centre
    if (rotate !== 0) { //si la valeur de rotation n'est pas 0, faites pivoter le canvas
        ctx.rotate(rotate * Math.PI / 180);

    }
    ctx.scale(flipHorizontal, flipVertical);// flip canvas , horizontally/Verticaly
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    const link = document.createElement("a");// creating <a> element
    link.download = "image.jpg";//passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL()//passing <a> tag href value to canvas data url
    link.click();// clicking <a> tag so the image download
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());


// Ajoutez votre clé API remove.bg ici
const removeBgApiKey = "GCLTFg5odDN9ezikCMJ2Nuiy";

const removeBackground = async () => {
    const formData = new FormData();
    formData.append("image_file", fileInput.files[0]);
    formData.append("size", "regular");

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": removeBgApiKey,
            },
            body: formData,
        });
        const result = await response.blob();

        if (result.errors) {
            console.error("Error removing background:", result.errors[0].title);
        } else {
            
            const url = URL.createObjectURL(result);
            previewImg.src = url;
            // applyFilters(); // Appliquez les filtres après avoir mis à jour l'image
        }
    } catch (error) {
        console.error("Error removing background:", error);
    }
};

// Ajoutez cet écouteur d'événements pour déclencher l'enlèvement de l'arrière-plan
removeBgBtn.addEventListener("click", removeBackground);
