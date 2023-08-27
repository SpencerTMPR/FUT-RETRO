
var categoryActive = '';
var categoriesArray = [];
var productsArray = [];

window.onload = function() {

    const btnRegister = document.getElementById("btn-registrarse");
    const btnSignin = document.getElementById("btn-signin");
    const btnPagar = document.getElementById("btn-pagar");

    if (btnRegister) {

        btnRegister.onclick = async function () {

            const name = document.getElementById('name').value;
            const phone = Number(document.getElementById('phone').value);
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const repeatPassword = document.getElementById('repeat-password').value;
            
            if (name === '' || email === '' || password === '') {
            
                return Swal.fire({
                    html: `<h1>Campos vacíos</h1>
                    <p>Ingrese todos los datos.</p>
                    `
                });
            
            }

            const fetchResponse = await fetchPetition('http://localhost:3050/api/auth/signup_client', 'POST', { name, phone, email, password, confirm_password: repeatPassword });

            if (fetchResponse.message === undefined) {
                
                
                let errorMessage = '';

                fetchResponse.results.forEach(result => {

                    errorMessage += `Propiedad: ${result.property}\nErrores:\n`;
            
                    Object.entries(result.errors).forEach((value) => {
                    errorMessage += `- ${value.map(t => { return ' ' + t })}\n`;
                    });

                    errorMessage += '\n';

                });

                return Swal.fire({
                    title: errorMessage
                });
                
            }

            if (fetchResponse.code === 200 || fetchResponse.code === 201) {
                
                return window.location.href = '/clients/views-mods/M-P1.html';

            } else {

                return Swal.fire({
                    html: `
                        <h1>${fetchResponse.code}</h1>
                        <p>${fetchResponse.message === undefined ? '' : fetchResponse.message}</p>\n
                        <!--<p>${fetchResponse.results === undefined ? '' : fetchResponse.results}</p>\n -->
                    `,  
                });

            }

        };

    }

    if (btnSignin) {

        btnSignin.onclick = async function () {
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === '' || password === '') {
            
                return Swal.fire({
                    html: `<h1>Campos vacíos</h1>
                    <p>Ingrese su correo y la contraseña.</p>
                    `
                });
            
            }

            const fetchResponse = await fetchPetition('http://localhost:3050/api/auth/signin', 'POST', { email, password });

            if (fetchResponse.message === undefined) {

                
                let errorMessage = '';

                fetchResponse.results.forEach(result => {

                    errorMessage += `Propiedad: ${result.property}\nErrores:\n`;
            
                    Object.entries(result.errors).forEach((value) => {
                    errorMessage += `- ${value.map(t => { return ' ' + t })}\n`;
                    });
            
                    errorMessage += '\n';

                });

                return Swal.fire({
                    title: errorMessage
                });
                
            }

            if (fetchResponse.code === 200 || fetchResponse.code === 201) {

                if (fetchResponse.results.role !== 'Client') {

                    return Swal.fire({
                        html: `<h1>Está en la página equivocada :)</h1>
                            <p>Usted no tiene rol 'Client', su rol es '${fetchResponse.results.role}'.</p>
                            `
                    });

                }
                
                return window.location.href = '/clients/views-mods/M-P1.html';

            } else {

                return Swal.fire({
                    html: `
                        <h1>${fetchResponse.code}</h1>
                        <p>${fetchResponse.message === undefined ? '' : fetchResponse.message}</p>\n
                        <!--<p>${fetchResponse.results === undefined ? '' : fetchResponse.results}</p>\n -->
                    `,  
                });

            }

        };

    }

    if (btnPagar) {

        document.getElementById("btn-pagar").onclick = function () {

            const name = document.getElementById('name').value;
            const cardNumber = document.getElementById('card-number').value;
            const expirationDate = document.getElementById('expiration-date').value;
            const code = Number(document.getElementById('code').value);
            const username = document.getElementById('username').value;
            const address = document.getElementById('address').value;

            if (name === '' || cardNumber === '' || expirationDate === '' || 
                code === '' || username === '' || address === '') {
            
                return Swal.fire({
                    html: `<h1>Campos vacíos</h1>
                    <p>Ingrese todos los datos.</p>
                    `
                });

            }

            Swal.fire({
                title: '¿Está seguro de realizar el pago?',
                text: "Se le enviará un correo con la información de su pedido.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then(async (result) => {

                if (result.isConfirmed) {

                    const payment = await makePayment(address);

                    Swal.fire({
                        html: `
                            <h1>¡Gracias por su compra!</h1>
                            <div style="text-align: left;">
                                <p>Estos son los datos de su pedido:</p>
                                <p>- Fecha: ${payment.results.date}</p>
                                <p>- Subtotal: ${payment.results.subtotal}</p>
                                <p>- ISV: ${payment.results.isv}</p>
                                <p>- Comisiones: ${payment.results.commissions.total_commissions}</p>
                                <p>- Total: ${payment.results.total}</p>
                            </div>
                        `
                    }).then((result) => { 

                        window.location.href = '/clients/views-mods/M-P1.html';
    
                    });

                    localStorage.removeItem('products');

                }

            });

        };

    }

}

const verifySession = async () => {

    const fetchResponse = await fetchPetition('http://localhost:3050/api/user/profile', 'GET', {});

    if (fetchResponse.code === 401) {

        return Swal.fire({
                    html: `
                        <h1>${fetchResponse.code}</h1>
                        <p>${fetchResponse.message === undefined ? '' : fetchResponse.message}</p>\n
                        <!--<p>${fetchResponse.results === undefined ? '' : fetchResponse.results}</p>\n -->
                    `,
                }).then(close => {

                    window.location.href = '../Signin.html'      
                
                });        

    }
   
};

const categories = async () => {

    const fetchResponse = await fetchPetition('http://localhost:3050/api/categories', 'GET', {});

    if (fetchResponse.code === 500) {

        return Swal.fire({
                    html: `
                        <h1>${fetchResponse.code}</h1>
                        <p>${fetchResponse.message === undefined ? '' : fetchResponse.message}</p>\n
                    `,
                });

    }

    categoriesArray = fetchResponse.results;

    fetchResponse.results.forEach((category, index) => {
       
        const row = Math.floor(index / 2) + 1; 
        const column = (index % 2) + 1;
        
        const categoryElement = document.createElement('a');
        categoryElement.className = 'btn-categories';
        
        categoryElement.setAttribute('onclick', 'countCompaniesByCat(document.getElementById(this.id).id)');
        categoryElement.setAttribute('id', category._id);
        categoryElement.setAttribute('count', category.count_companies);

        const imgElement = document.createElement('img');
        imgElement.src = category.img;
        imgElement.alt = category.name;
        
        const spanElement = document.createElement('span');
        spanElement.textContent = category.name;
        
        categoryElement.appendChild(spanElement);
        
        categoryElement.style.gridColumnStart = column;
        categoryElement.style.gridColumnEnd = column + 1;
        categoryElement.style.gridRowStart = row;
        categoryElement.style.gridRowEnd = row + 1;

        categoryElement.style.height = '210%';
        
        const container = document.querySelector('.container');
        container.appendChild(categoryElement);        
        
    });

};

const countCompaniesByCat = async (id) => {

    const nameCategory = document.getElementById(id).textContent;
    const countCompanies = document.getElementById(id).getAttribute('count');

    if (countCompanies === '0') {

        return Swal.fire({
            html: `
                <h1>${nameCategory}</h1>
                <p>Esta categoría no tiene empresas registradas.</p>\n
            `,
        });

    }

    return window.location.href = `/clients/views-mods/M-CompaniesByCat.html?info=${nameCategory}?=${id}`;

};

const companiesByCat = async () => { 

    const urlParams = new URLSearchParams(window.location.search);
    const info = urlParams.get('info').split(/\?=/);

    const id = info[1];
    const nameCategory = info[0];

    const title = document.getElementById('title');
    title.textContent = nameCategory;

    const fetchResponse = await fetchPetition(`http://localhost:3050/api/companies/category/${id}`, 'GET', {});

    console.log('fetchResponse', fetchResponse);

    fetchResponse.results.forEach((company, index) => {

        const row = Math.floor(index / 2) + 1; 
        const column = (index % 2) + 1; 
        
        const companyElement = document.createElement('a');
        companyElement.className = 'btn-categories';
        
        companyElement.setAttribute('onclick', 'countProductsByCompany(document.getElementById(this.id).id)');
        companyElement.setAttribute('id', company._id);

        const imgElement = document.createElement('img');
        imgElement.src = company.img;
        imgElement.alt = company.name;
        
        const spanElement = document.createElement('span');
        spanElement.textContent = company.name;
        
        companyElement.appendChild(spanElement);
        
        companyElement.style.gridColumnStart = column;
        companyElement.style.gridColumnEnd = column + 1;
        companyElement.style.gridRowStart = row;
        companyElement.style.gridRowEnd = row + 1;

        companyElement.style.height = '210%';
        
        const container = document.querySelector('.container');
        container.appendChild(companyElement);        
        
    });

};

const countProductsByCompany = async (id) => {

    const nameCompany = document.getElementById(id).textContent;

    const fetchResponse = await fetchPetition(`http://localhost:3050/api/products/company/${id}`, 'GET', {});
        
    if (fetchResponse.count === undefined) {

        return Swal.fire({
            html: `
                <h1>${nameCompany}</h1>
                <p>Esta empresa no tiene productos registrados.</p>\n
            `,
        });

    }

    console.log(nameCompany, id)

    return window.location.href = `M-ProductsByComp.html?info=${nameCompany}?=${id}`;

};

const productsByComp = async () => { 

    const urlParams = new URLSearchParams(window.location.search);
    const info = urlParams.get('info').split(/\?=/);

    const id = info[1];
    const nameCompany = info[0];

    const title = document.getElementById('title');
    title.textContent = nameCompany;

    const fetchResponse = await fetchPetition(`http://localhost:3050/api/products/company/${id}`, 'GET', {});

    productsArray = fetchResponse.results;

    fetchResponse.results.forEach((product, index) => {

        const row = Math.floor(index / 2) + 1; 
        const column = (index % 2) + 1; 
        
        const productElement = document.createElement('div');
        productElement.className = 'containers';
        
        productElement.setAttribute('id', product._id);

        const imgElement = document.createElement('img');
        imgElement.src = product.img;
        imgElement.alt = product.name;
        
        const pElement = document.createElement('p');
        pElement.textContent = `${product.name} - ${product.price } Lps.` ;
        
        const heartIcon = document.createElement('i');
        heartIcon.className = "fa-solid fa-heart";
        
        const cartIcon = document.createElement('i');
        cartIcon.className = "fa-solid fa-shopping-cart";
        cartIcon.style.cursor = 'pointer';

        cartIcon.setAttribute('name', product._id);
        cartIcon.setAttribute('onclick', "showQuantityPrompt(this.getAttribute('name'))");

        const spanQuantity = document.createElement('span');
        spanQuantity.setAttribute('id', `product-quantity-${product._id}`);

        productElement.appendChild(imgElement);
        productElement.appendChild(pElement);
        
        productElement.appendChild(heartIcon);
        productElement.appendChild(cartIcon);

        productElement.appendChild(spanQuantity);

        productElement.style.gridColumnStart = column;
        productElement.style.gridColumnEnd = column + 1;
        productElement.style.gridRowStart = row;
        productElement.style.gridRowEnd = row + 1;
        
        const container = document.querySelector('.container');
        container.appendChild(productElement);        
        
    });

    updateDataProduct();
 
};

const showQuantityPrompt = (id) => {

    const spanElement = document.getElementById('product-quantity-' + id);
    
    Swal.fire({
        title: 'Ingresar cantidad',
        input: 'number',
        inputAttributes: {
            min: 0,
            step: 1
        },
        showCancelButton: true,
        confirmButtonText: 'Agregar al carrito',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (quantity) => {
            if (quantity < '1') {

                console.log('Cantidad ingresada:', typeof quantity);
            
                if (quantity === '0') {

                    return deleteProduct(id);   
               
                }

                return Swal.showValidationMessage(
                    `La cantidad debe ser 1 o mayor`
                );

            } else {

                spanElement.className = 'product-quantity';
                spanElement.textContent = quantity;

                productsArray.forEach(product => {

                    if (product._id === id) {

                        let objects = JSON.parse(localStorage.getItem('products'));
                        let state = false;

                        if (!objects) {
                            objects = []; 
                        }

                        for (const object of objects) {

                            if (object._id === id) {

                                state = true;

                                break;
                                
                            }

                        };
                            
                        if (state) {
                            
                            console.log('si', objects._id, id);
                            
                            return updateUnitsProduct(id, quantity);
                         
                        }

                        objects.push({...product, units: Number(quantity) });

                        localStorage.setItem('products', JSON.stringify(objects));
                        updateDataProduct();

                    }

                });


            }

        }
   
    });

};

const updateUnitsProduct = (id, newUnits) => {
    
    const products = JSON.parse(localStorage.getItem('products'));

    if (products && products.length > 0) {

        const index = products.findIndex(producto => producto._id === id);
      
        if (index !== -1) {
       
            products[index].units = Number(newUnits);

            localStorage.setItem('products', JSON.stringify(products));
      
        }
    
    }

};

const deleteProduct = (id) => {

    const products = JSON.parse(localStorage.getItem('products'));

    if (products && products.length > 0) {

        const index = products.findIndex(producto => producto._id === id);
      
        if (index !== -1) {
       
            products.splice(index, 1);

            localStorage.setItem('products', JSON.stringify(products));

        }

    }

    window.location.href = window.location.href;

};

const updateDataProduct = () => {

    const products = JSON.parse(localStorage.getItem('products'));
                    
    if (products) {

        products.forEach(product => {

            const { _id, units } = product;
            const spanElement = document.getElementById(`product-quantity-${_id}`);

            if (spanElement) {

                spanElement.textContent = units;
                spanElement.className = 'product-quantity';

            }
            
            cartIconColor('green');
        
        });

    }

};

const partialTotal = () => {

    const products = JSON.parse(localStorage.getItem('products'));

    let total = 0;
    let html = '';

    if (!products) {

        return Swal.fire({
            title: 'Tu carrito de compras',
            text: `No tienes productos en tu carrito de compras.`,
            icon: 'info',
            showCancelButton: false,
            showDenyButton: false,
            confirmButtonText: 'Aceptar'
        });

    }

    total = products.reduce((sum, product) => sum + product.units * product.price, 0);

    products.forEach(product => {

        html += `
            <p style="text-align: left">
                ${product.name} <br> 
                - Unidades: ${product.units} <br>
                - Total por producto: ${product.units * product.price} Lps.
            </p><br>
        `;
    
    });

    html += `<p>Total: ${total} Lps.</p>`;

    Swal.fire({
        title: 'Tu carrito de compras',
        html,
        icon: 'info',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Pagar',
        denyButtonText: 'Vaciar carrito',
        cancelButtonText: 'Cerrar',
    }).then((result) => {

        if (result.isConfirmed) {
       
            window.location.href = '/clients/FutRetro3.html';
        
        }

        if (result.isDenied) {

            localStorage.removeItem('products');
            window.location.href = window.location.href;

        }

    });

};

const makePayment = async (address) => {

    let products = JSON.parse(localStorage.getItem('products'));
    let finalProducts = [];

    if (!products) {
            
        return Swal.fire({
            title: 'Tu carrito de compras',
            text: `No tienes productos en tu carrito de compras.`,
            icon: 'info',
            showCancelButton: false,
            showDenyButton: false,
            confirmButtonText: 'Aceptar'
        }).then((result) => {
           
            window.location.href = '/clients/views-mods/M-P1.html'; 
            
        });
        

    }

    products.map(product => { 

        const { _id, units } = product;

        finalProducts.push({ _id_product: _id, units });

    });

    const body = { products: finalProducts, address };

    console.log('body', body);

    const fetchResponse = await fetchPetition('http://localhost:3050/api/bills', 'POST', body);
    console.log('fetchResponse', fetchResponse);

    if (fetchResponse.code !== 201) {

        return Swal.fire({
            title: 'Error',
            text: fetchResponse.message,
            icon: 'error',
            showCancelButton: false,
            showDenyButton: false,
            confirmButtonText: 'Aceptar'
        });

    }

    return fetchResponse;
        
};

const cartIconColor = (color) => {  

    const cartIcon = document.getElementById('cart-icon-top');
    cartIcon.style.color = color;

};


const fetchPetition = async (url, method, body) => {

    const fetchResponse = await fetch(url, { 
        method,
        mode: 'cors',
        credentials: 'include',
        body: method === 'GET' ? undefined : JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json());    

    return fetchResponse;

};
