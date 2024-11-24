

const new_release = [
{
	"image" : "images/Mangojuice.png",
	"title" : "Mango Juice ",
},
{
	"image" : "images/Avocadojuice.png",
	"title" : "Avocado Juice ",
},
{
	"image" : "images/Soursopjuice.png",
	"title" : "Soursop Juice ",
},
];

function renderNew_release() {
    const new_releaseContainer = document.getElementById('new_release-container');
    let html = '';

    new_release.forEach(new_release => {
        html += `
            <div class="col-lg-4 mt-4">
                <a href="product/product.html">
                <div class="card services-text">
                    <div class="card-body">
                    <img class="services-image" src="${new_release.image}">
                    <h4 style="color: #000000;" class="card-title mt-3">${new_release.title}</h4>
                    </div>
                </div>  
                </a>
            </div>
        `;
    });

    new_releaseContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderServices);


const products = [
{
	"image" : "../product/images/proMang.png",
	"title" : "Mango Juice ",
},
{
	"image" : "../product/images/proAvo.png",
	"title" : "Avocado Juice ",
},
{
	"image" : "../product/images/proSour.png",
	"title" : "Soursop Juice ",
},
{
	"image" : "../product/images/proMix.png",
	"title" : "Mix Juice ",
},
{
	"image" : "../product/images/proCal.png",
	"title" : "Calamity Special ",
},
{
	"image" : "../product/images/proApp.png",
	"title" : "Apple Juice ",
},
{
	"image" : "../product/images/proThai.png",
	"title" : "Thailongtea ",
},
{
	"image" : "../product/images/proMonk.png",
	"title" : "Monk Fruit Juice ",
},
{
	"image" : "../product/images/proHerb.png",
	"title" : "Herbal Green Tea ",
},
];

function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    let html = '';

    products.forEach(product => {
        html += `
            <div class="col-lg-4 mt-4">
                <a>
                <div class="card services-text">
                    <div class="card-body">
                    <img class="services-image" src="${product.image}">
                    <h4 style="color: #000000;" class="card-title mt-3">${product.title}</h4>
                    <a class="btn btn-outline-info" href="#">
                        <i class="fa-solid fa-martini-glass-citrus"></i> Order Now!
                    </a>
                    </div>
                </div>  
                </a>
            </div>
        `;
    });

    productsContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProducts);