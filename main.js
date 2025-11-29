const API_KEY = "e89541b1f35569fb178f7ead353a9e6d";
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const moviesGrid = document.getElementById("moviesGrid");
const searchInput = document.getElementById("searchInput");
const sidebar = document.getElementById("sidebar");


document.getElementById("toggleSidebar").addEventListener("click", ()=> sidebar.classList.toggle("open"));

function displayMovies(movies){
    moviesGrid.innerHTML = movies.map(movie=>`
        <div class="col-md-4 mb-4">
            <div class="movie-card">
                <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}" />
                <div class="movie-hover">
                    <h3>${movie.title}</h3>
                    <p>${movie.overview ? movie.overview.substring(0,150)+'...' : 'No description'}</p>
                    <p><strong>Rating:</strong> ${movie.vote_average}</p>
                    <p><strong>Release:</strong> ${movie.release_date || 'N/A'}</p>
                </div>
            </div>
        </div>
    `).join("");
}


function fetchMovies(url){
    fetch(url)
    .then(res=>res.json())
    .then(data=>displayMovies(data.results))
    .catch(err=>console.error(err));
}


document.querySelectorAll('.menu-list li').forEach(item=>{
    item.addEventListener('click', ()=>{
        const type = item.getAttribute('data-type');
        let url = type==='trending' ? 
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}` :
            `https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(url);
        sidebar.classList.remove('open');
    });
});


fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);


searchInput.addEventListener('keyup', ()=>{
    const q = searchInput.value.trim();
    if(q==='') return;
    fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${q}`);
});
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const ageInput = document.getElementById('age');
const passwordInput = document.getElementById('password');
const repasswordInput = document.getElementById('repassword');

const nameRegex = /^[A-Za-z\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+?\d{1,3}[-. ]?)?(\(?\d{3}\)?[-. ]?)?\d{3}[-. ]?\d{4}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const errorMessages = {
    name: 'Name must contain at least 3 letters.',
    email: 'Invalid email format.',
    phone: 'Invalid phone number format.',
    age: 'Age must be between 18 and 100 years old.',
    password: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a symbol.',
    match: 'Passwords do not match.'
};

function validateField(inputElement, regex, errorMessage){
    const value = inputElement.value.trim();
    const feedback = document.getElementById(inputElement.id+'Feedback');
    if(value!=='' && regex.test(value)){
        inputElement.classList.remove('is-invalid');
        inputElement.classList.add('is-valid');
        feedback.textContent='';
        return true;
    } else {
        if(value===''){
            inputElement.classList.remove('is-valid');
            inputElement.classList.remove('is-invalid');
            feedback.textContent='';
            return false;
        } else {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid');
            feedback.textContent=errorMessage;
            return false;
        }
    }
}

function validateAge(){
    const age = parseInt(ageInput.value);
    const feedback = document.getElementById('ageFeedback');
    if(isNaN(age) || age<18 || age>100){
        if(ageInput.value.trim()!==''){
            ageInput.classList.add('is-invalid');
            ageInput.classList.remove('is-valid');
            feedback.textContent=errorMessages.age;
        }
        return false;
    } else {
        ageInput.classList.remove('is-invalid');
        ageInput.classList.add('is-valid');
        feedback.textContent='';
        return true;
    }
}

function validatePasswordMatch(){
    const isPassValid = validateField(passwordInput,passwordRegex,errorMessages.password);
    if(passwordInput.value!==repasswordInput.value && isPassValid){
        repasswordInput.classList.add('is-invalid');
        repasswordInput.classList.remove('is-valid');
        document.getElementById('repasswordFeedback').textContent=errorMessages.match;
        return false;
    } else {
        if(repasswordInput.value.trim()!==''){
            repasswordInput.classList.remove('is-invalid');
            repasswordInput.classList.add('is-valid');
            document.getElementById('repasswordFeedback').textContent='';
        }
        return isPassValid && (passwordInput.value===repasswordInput.value);
    }
}

contactForm.addEventListener('submit',function(e){
    e.preventDefault();
    const isNameValid = validateField(nameInput,nameRegex,errorMessages.name);
    const isEmailValid = validateField(emailInput,emailRegex,errorMessages.email);
    const isPhoneValid = validateField(phoneInput,phoneRegex,errorMessages.phone);
    const isAgeValid = validateAge();
    const isPassMatch = validatePasswordMatch();
    if(isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPassMatch){
        alert('Contact form submitted successfully!');
        contactForm.reset();
    } else {
        alert('Please correct the errors before submitting.');
    }
});

[nameInput,emailInput,phoneInput,passwordInput,repasswordInput].forEach(el=>{
    el.addEventListener('input', ()=>validateField(el,el===nameInput?nameRegex:el===emailInput?emailRegex:el===phoneInput?phoneRegex:passwordRegex,errorMessages[el.id]));
});
ageInput.addEventListener('input',validateAge);
passwordInput.addEventListener('input',validatePasswordMatch);
repasswordInput.addEventListener('input',validatePasswordMatch);
