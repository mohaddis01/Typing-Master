document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const quoteDisplay = document.getElementById('quote-display');
    const quoteInput = document.getElementById('quote-input');
    const startTestBtn = document.getElementById('start-test');
    const resetTestBtn = document.getElementById('reset-test');
    const newTestBtn = document.getElementById('new-test');
    const difficultySelect = document.getElementById('difficulty-select');
    const durationSelect = document.getElementById('duration-select');
    const resultsSection = document.getElementById('results');
    
    // Stats elements
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timeElement = document.getElementById('time');
    const charactersElement = document.getElementById('characters');
    
    // Result elements
    const finalWpmElement = document.getElementById('final-wpm');
    const finalAccuracyElement = document.getElementById('final-accuracy');
    const finalCharactersElement = document.getElementById('final-characters');
    const finalErrorsElement = document.getElementById('final-errors');
    
    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Test variables
    let timer;
    let timeLeft;
    let isTestRunning = false;
    let startTime;
    let endTime;
    let totalCharactersTyped = 0;
    let correctCharacters = 0;
    let currentQuote = '';
    let currentPosition = 0;
    
    // Quotes database (in a real app, you might fetch these from an API)
    const quotes = {
        easy: [
            "The quick brown fox jumps over the lazy dog.",
            "Programming is the art of telling another human what one wants the computer to do.",
            "The best way to predict the future is to invent it.",
            "Simplicity is the ultimate sophistication.",
            "The only way to learn a new programming language is by writing programs in it."
        ],
        medium: [
            "Computer science is no more about computers than astronomy is about telescopes.",
            "The most disastrous thing that you can ever learn is your first programming language.",
            "The computer was born to solve problems that did not exist before.",
            "The function of good software is to make the complex appear to be simple.",
            "Measuring programming progress by lines of code is like measuring aircraft building progress by weight."
        ],
        hard: [
            "The question of whether computers can think is like the question of whether submarines can swim.",
            "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.",
            "The first 90 percent of the code accounts for the first 90 percent of the development time. The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
            "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
            "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
        ]
    };
    
    // Initialize the test
    function initTest() {
        const difficulty = difficultySelect.value;
        const duration = parseInt(durationSelect.value);
        
        // Get a random quote
        const randomIndex = Math.floor(Math.random() * quotes[difficulty].length);
        currentQuote = quotes[difficulty][randomIndex];
        quoteDisplay.innerHTML = '';
        
        // Display the quote with spans for each character
        currentQuote.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            quoteDisplay.appendChild(charSpan);
        });
        
        // Reset variables
        currentPosition = 0;
        totalCharactersTyped = 0;
        correctCharacters = 0;
        timeLeft = duration;
        timeElement.textContent = timeLeft;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0';
        charactersElement.textContent = '0';
        
        // Highlight first character
        quoteDisplay.childNodes[0].classList.add('current');
        
        // Enable textarea
        quoteInput.value = '';
        quoteInput.disabled = false;
        quoteInput.focus();
        
        // Update UI
        startTestBtn.textContent = 'Restart Test';
        resultsSection.classList.add('hidden');
    }
    
    // Start the test
    function startTest() {
        if (isTestRunning) {
            clearInterval(timer);
        }
        
        initTest();
        isTestRunning = true;
        startTime = new Date();
        
        // Start timer
        timer = setInterval(() => {
            timeLeft--;
            timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }
    
    // End the test
    function endTest() {
        clearInterval(timer);
        isTestRunning = false;
        endTime = new Date();
        quoteInput.disabled = true;
        
        // Calculate final stats
        const timeInMinutes = (endTime - startTime) / 60000;
        const wpm = Math.round((correctCharacters / 5) / timeInMinutes);
        const accuracy = Math.round((correctCharacters / totalCharactersTyped) * 100) || 0;
        const errors = totalCharactersTyped - correctCharacters;
        
        // Display results
        finalWpmElement.textContent = wpm;
        finalAccuracyElement.textContent = `${accuracy}%`;
        finalCharactersElement.textContent = totalCharactersTyped;
        finalErrorsElement.textContent = errors;
        
        resultsSection.classList.remove('hidden');
    }
    
    // Reset the test
    function resetTest() {
        clearInterval(timer);
        isTestRunning = false;
        quoteInput.value = '';
        quoteInput.disabled = true;
        quoteDisplay.innerHTML = '';
        timeElement.textContent = durationSelect.value;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0';
        charactersElement.textContent = '0';
        startTestBtn.textContent = 'Start Test';
        resultsSection.classList.add('hidden');
    }
    
    // Handle typing input
    quoteInput.addEventListener('input', (e) => {
        if (!isTestRunning) return;
        
        const inputArray = quoteInput.value.split('');
        totalCharactersTyped++;
        
        // Check if character is correct
        if (inputArray[currentPosition] === currentQuote[currentPosition]) {
            correctCharacters++;
            quoteDisplay.childNodes[currentPosition].classList.add('correct');
            quoteDisplay.childNodes[currentPosition].classList.remove('incorrect');
        } else {
            quoteDisplay.childNodes[currentPosition].classList.add('incorrect');
            quoteDisplay.childNodes[currentPosition].classList.remove('correct');
        }
        
        // Move to next character
        quoteDisplay.childNodes[currentPosition].classList.remove('current');
        currentPosition++;
        
        // Highlight next character if available
        if (currentPosition < currentQuote.length) {
            quoteDisplay.childNodes[currentPosition].classList.add('current');
        }
        
        // Update real-time stats
        const timeElapsed = (new Date() - startTime) / 60000; // in minutes
        const wpm = Math.round((correctCharacters / 5) / timeElapsed);
        const accuracy = Math.round((correctCharacters / totalCharactersTyped) * 100) || 0;
        
        wpmElement.textContent = wpm;
        accuracyElement.textContent = accuracy;
        charactersElement.textContent = totalCharactersTyped;
        
        // Check if quote is completed
        if (currentPosition === currentQuote.length) {
            // Get new quote for the same difficulty
            const difficulty = difficultySelect.value;
            const randomIndex = Math.floor(Math.random() * quotes[difficulty].length);
            currentQuote = quotes[difficulty][randomIndex];
            quoteDisplay.innerHTML = '';
            
            // Display new quote
            currentQuote.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                quoteDisplay.appendChild(charSpan);
            });
            
            // Reset position and highlight first character
            currentPosition = 0;
            quoteDisplay.childNodes[0].classList.add('current');
            quoteInput.value = '';
        }
    });
    
    // Event listeners
    startTestBtn.addEventListener('click', startTest);
    resetTestBtn.addEventListener('click', resetTest);
    newTestBtn.addEventListener('click', startTest);
    
    // Initialize with disabled input
    quoteInput.disabled = true;
});