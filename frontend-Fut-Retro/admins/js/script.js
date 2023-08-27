const allSideMenu=document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i=> {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});




//TOGGLE SIDEBAR
const menubar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menubar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function(e) {
    if(window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if(searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else{
            searchButtonIcon.classList.replace( 'bx-x', 'bx-search');
        }
    }
})





if(window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search')
    searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
    if(this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search')
        searchForm.classList.remove('show');
    }
})

// ------------------------------
window.onload = function() {

    const btnSignin = document.getElementById("btn-signin");

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

                if (fetchResponse.results.role !== 'Admin') {

                    return Swal.fire({
                        html: `<h1>Está en la página equivocada :)</h1>
                            <p>Usted no tiene rol 'Admin', su rol es '${fetchResponse.results.role}'.</p>
                            `
                    });

                }
                
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
