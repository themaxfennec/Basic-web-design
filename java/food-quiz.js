const quizData = {
    currentStep: 0,
    cards: document.querySelectorAll('.quiz-card'),
    progressBar: document.getElementById('progress-bar'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    submitBtn: document.getElementById('submit-btn'),
    quizForm: document.getElementById('buzzfeed-quiz'),
    resultsCard: document.getElementById('results-card'),
    dishesContainer: document.getElementById('recommended-dishes-container'),
    warningsContainer: document.getElementById('allergy-safety-warnings')
};

function updateQuizView() {
    // Show/Hide Question Cards
    quizData.cards.forEach((card, index) => {
        if (index === quizData.currentStep) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    // Update Progress Bar Width
    const progressPercent = ((quizData.currentStep + 1) / quizData.cards.length) * 100;
    quizData.progressBar.style.width = `${progressPercent}%`;

    // Manage Button States
    quizData.prevBtn.disabled = quizData.currentStep === 0;

    if (quizData.currentStep === quizData.cards.length - 1) {
        quizData.nextBtn.style.display = 'none';
        quizData.submitBtn.style.display = 'inline-block';
    } else {
        quizData.nextBtn.style.display = 'inline-block';
        quizData.submitBtn.style.display = 'none';
    }
}

// Check if current question has an answer selected before advancing
function isCurrentQuestionAnswered() {
    const currentCard = quizData.cards[quizData.currentStep];
    const radios = currentCard.querySelectorAll('input[type="radio"]');
    return Array.from(radios).some(radio => radio.checked);
}

// Event Listeners for controls
quizData.nextBtn.addEventListener('click', () => {
    if (isCurrentQuestionAnswered()) {
        if (quizData.currentStep < quizData.cards.length - 1) {
            quizData.currentStep++;
            updateQuizView();
        }
    } else {
        alert("Please select an answer to move to the next question!");
    }
});

quizData.prevBtn.addEventListener('click', () => {
    if (quizData.currentStep > 0) {
        quizData.currentStep--;
        updateQuizView();
    }
});

quizData.quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Gather user form results
    const formData = new FormData(quizData.quizForm);
    const answers = {
        q1: formData.get('q1'), // Sharing
        q2: formData.get('q2'), // Vibe
        q3: formData.get('q3'), // Bill
        q4: formData.get('q4'), // Chimaek
        q5: formData.get('q5'), // Cooking
        q6: formData.get('q6'), // Textures
        q7: formData.get('q7'), // Gluten
        q8: formData.get('q8'), // Seafood
        q9: formData.get('q9'), // Eggs
        q10: formData.get('q10'), // Cross-contamination
        q11: formData.get('q11')  // Spice
    };

    // Filters based on answers
    const filters = {
        strictGlutenFree: answers.q7 === 'A',
        avoidSeafood: answers.q8 === 'A',
        avoidEggs: answers.q9 === 'A',
        highAdventure: answers.q6 === 'A',
        lowAdventure: answers.q6 === 'C',
        cafeVibe: answers.q2 === 'C',
        bbqVibe: answers.q2 === 'A'
    };

    // Clear dynamic structures
    quizData.dishesContainer.innerHTML = '';
    quizData.warningsContainer.innerHTML = '';

    // Generate recommendations and safety notices
    generateDishes(filters, answers);
    generateWarnings(answers);

    // Hide Quiz UI, display results area
    quizData.quizForm.style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    quizData.resultsCard.style.display = 'block';
});

//array of 20 distinct objects dynamically filtered
function generateDishes(filters, answers) {
    const all20Dishes = [
        { name: "Samgyeopsal (Grilled Pork Belly)", desc: "The ultimate interactive K-BBQ experience with friends! Cooked right on the table grill.", type: "bbq", gluten: false, seafood: false, egg: false, uniqueText: false },
        { name: "Chimaek (Fried Chicken & Beer)", desc: "Perfect casual Friday night out layout with friends. Crispy, golden, and classic.", type: "social", gluten: true, seafood: false, egg: false, uniqueText: false },
        { name: "Dakgalbi (Spicy Stir-Fried Chicken)", desc: "A massive spicy chicken stir-fry cooked right at your table in a huge iron skillet to share.", type: "social", gluten: true, seafood: false, egg: false, uniqueText: false },
        { name: "Gamjatang (Pork Spine Stew)", desc: "A massive, hearty central pot stew packed with tender pork meant to be shared after a late night.", type: "social", gluten: true, seafood: false, egg: false, uniqueText: false },
        { name: "Budae Jjigae (Army Base Stew)", desc: "Fun, collaborative hot pot layout crammed with ramen, spam, and chewy rice cakes.", type: "social", gluten: true, seafood: false, egg: false, uniqueText: false },
        { name: "Bibimbap (Mixed Rice Bowl)", desc: "Perfect individual bowl loaded with rice, assorted vegetables, and red pepper paste.", type: "individual", gluten: false, seafood: false, egg: true, uniqueText: false },
        { name: "Gimbap (Seaweed Rice Rolls)", desc: "Great individual clean bite or shared snack. Ingredients are easily visible to verify safety.", type: "individual", gluten: false, seafood: false, egg: true, uniqueText: false },
        { name: "Samgyetang (Ginseng Chicken Soup)", desc: "Healthy chicken soup boiling in its own stone pot. Uses safe glutinous rice and zero seafood.", type: "individual", gluten: false, seafood: false, egg: false, uniqueText: false },
        { name: "Japchae (Stir-Fried Glass Noodles)", desc: "A sweet and savory dish using sweet potato starch noodles. Check for standard wheat soy sauce variants.", type: "individual", gluten: true, seafood: false, egg: true, uniqueText: false },
        { name: "Seolleongtang (Ox Bone Soup)", desc: "An individual mild, rich broth soup where you control the salt. Egg-free and seafood-free.", type: "individual", gluten: false, seafood: false, egg: false, uniqueText: false },
        { name: "Haemul Pajeon (Seafood Green Onion Pancake)", desc: "A classic savory green onion pancake packed with squid and shrimp. Shared best on rainy days.", type: "seafood", gluten: true, seafood: true, egg: true, uniqueText: false },
        { name: "Sundubu Jjigae (Soft Tofu Stew)", desc: "Bubbling, fiery soft tofu stew. Uses a robust seafood broth base and an egg mixed in.", type: "seafood", gluten: false, seafood: true, egg: true, uniqueText: false },
        { name: "Kalguksu (Knife-Cut Noodles)", desc: "Comforting, warm knife-cut noodle soup bowls frequently extracted from dried anchovy broths.", type: "seafood", gluten: true, seafood: true, egg: false, uniqueText: false },
        { name: "Gopchang / Makchang (Grilled Intestines)", desc: "High-energy, super-loud table grill food layout for highly adventurous groups.", type: "adventure", gluten: true, seafood: false, egg: false, uniqueText: true },
        { name: "Tteokbokki (Spicy Chewy Rice Cakes)", desc: "Iconic sweet-and-spicy street food snack. Highly chewy. Broth uses anchovies and wheat fish cakes.", type: "adventure", gluten: true, seafood: true, egg: true, uniqueText: true },
        { name: "Naengmyeon (Cold Buckwheat Noodles)", desc: "Rubbery, uniquely cold beef soup noodles. Perfect rubbery chewiness topped with a hard-boiled egg.", type: "adventure", gluten: true, seafood: false, egg: true, uniqueText: true },
        { name: "Patbingsu (Shaved Ice Dessert)", desc: "An aesthetic, towering sweet treat bowl meant to be shared with friends via multiple spoons.", type: "cafe", gluten: false, seafood: false, egg: false, uniqueText: false },
        { name: "Hotteok (Sweet Stuffed Pancakes)", desc: "Gooey, street market comfort pancake loaded with melted brown sugar, cinnamon, and occasional nuts.", type: "cafe", gluten: true, seafood: false, egg: false, uniqueText: false },
        { name: "Bungeoppang (Fish-Shaped Pastry)", desc: "Fun pastry waffle shaped like a fish, but contains **zero** real fish! Stuffed with sweet red bean or custard.", type: "cafe", gluten: true, seafood: false, egg: true, uniqueText: false },
        { name: "Traditional Rice Cakes (Tteok)", desc: "Aesthetic pounded rice snacks matching tea houses perfectly. Coated in delicious sweet bean powders.", type: "cafe", gluten: false, seafood: false, egg: false, uniqueText: false }
    ];

    // Filter logic process loop
    let recommendedList = all20Dishes.filter(dish => {
        if (filters.strictGlutenFree && dish.gluten) return false;
        if (filters.avoidSeafood && dish.seafood) return false;
        if (filters.avoidEggs && dish.egg) return false;
        if (filters.highAdventure && dish.uniqueText === false && dish.type !== "adventure") return false;
        if (filters.lowAdventure && dish.uniqueText === true) return false;
        if (filters.cafeVibe && dish.type !== "cafe" && dish.type !== "individual") return false;
        if (filters.bbqVibe && dish.type !== "bbq" && dish.type !== "adventure" && dish.type !== "social") return false;
        return true;
    });

    // Fallback security safety buffer: If filters are too restrictive, pull standard safe ones
    if (recommendedList.length === 0) {
        recommendedList = all20Dishes.filter(dish => {
            if (filters.strictGlutenFree && dish.gluten) return false;
            if (filters.avoidSeafood && dish.seafood) return false;
            if (filters.avoidEggs && dish.egg) return false;
            return true;
        });
    }

    // Output results to HTML DOM (Limit viewable results cleanly to max 4)
    recommendedList.slice(0, 4).forEach(dish => {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'dish-recommendation';
        dishDiv.innerHTML = `<h4>✨ ${dish.name}</h4><p>${dish.desc}</p>`;
        quizData.dishesContainer.appendChild(dishDiv);
    });
}

// Generate context-driven safety warnings cards
function generateWarnings(answers) {
    let warningCount = 0;

    if (answers.q7 === 'A') {
        createWarningElement("Gluten Allergy Warning", "Standard Korean soy sauce (Ganjang) and red pepper paste (Gochujang) contain wheat ingredients. Ask for dishes with 'Ganjang 빼주세요' (No soy sauce) or bring a gluten-free card.");
        warningCount++;
    }
    if (answers.q8 === 'A') {
        createWarningElement("Severe Seafood Warning", "Anchovy stock (Myeolchi Yuksu) serves as the secret liquid footprint inside almost all soups and tteokbokki sauces. Always double-check by asserting your allergy directly to staff.");
        warningCount++;
    }
    if (answers.q9 === 'A') {
        createWarningElement("Egg Allergen Alert", "Fried eggs come standard on top of individual rice dishes like Bibimbap, and steamed egg pots (Gyeranjjim) are ubiquitous side items during group BBQ rounds.");
        warningCount++;
    }
    if (answers.q10 === 'A') {
        createWarningElement("Cross-Contamination Danger", "Since table-top grills and shared central stews are common dining styles in Korea, let your friends know in advance so you can claim a safe portion or a dedicated cook zone before mixing.");
        warningCount++;
    }
    if (answers.q11 === 'A') {
        createWarningElement("Spice & Digestion Notice", "Korean 'mild' levels can easily trace high quantities of red pepper flakes. Order white non-spicy variants if your system reacts to spice flare-ups.");
        warningCount++;
    }

    // Default universal fallback tip if user notes no direct allergies
    if (warningCount === 0) {
        createWarningElement("Group Dining Etiquette Tip", "When drinking or eating around a group pool table, remember to pour drinks using two hands to show respect to your friends, matching standard cultural norms!");
    }
}

function createWarningElement(title, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'warning-alert';
    alertDiv.innerHTML = `<strong>!! ${title}:</strong> ${message}`;
    quizData.warningsContainer.appendChild(alertDiv);
}

updateQuizView();