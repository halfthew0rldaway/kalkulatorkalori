// Kalkulator Kalori Makanan Tradisional - JavaScript

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Initialize Vanilla Tilt for food cards
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2
    });
});

// Quiz Data Component for Alpine.js
function quizData() {
    return {
        currentQuestion: 0,
        selectedAnswer: null,
        score: 0,
        quizCompleted: false,
        userAnswers: [],
        
        questions: [
            { question: "Makanan tradisional Indonesia mana yang memiliki kalori terendah?", options: ["Rendang", "Pecel", "Nasi Goreng", "Gudeg"], correct: 1 },
            { question: "Berapa kalori yang terkandung dalam satu porsi Rendang?", options: ["200 kalori", "280 kalori", "320 kalori", "150 kalori"], correct: 2 },
            { question: "Makanan tradisional mana yang paling cocok untuk diet?", options: ["Soto Ayam", "Rendang", "Nasi Goreng", "Rawon"], correct: 0 },
            { question: "Apa bahan utama dalam Gado-gado?", options: ["Daging sapi", "Nangka muda", "Sayuran segar", "Ayam"], correct: 2 },
            { question: "Makanan tradisional mana yang mengandung protein tinggi?", options: ["Pecel", "Gado-gado", "Sate Ayam", "Gudeg"], correct: 2 },
            { question: "Berapa total kalori jika Anda makan Soto Ayam dan Pecel?", options: ["280 kalori", "320 kalori", "200 kalori", "160 kalori"], correct: 0 },
            { question: "Makanan tradisional mana yang berasal dari Yogyakarta?", options: ["Rawon", "Rendang", "Gudeg", "Soto Ayam"], correct: 2 },
            { question: "Apa yang membuat Rawon berwarna hitam?", options: ["Kecap manis", "Keluak", "Santan", "Gula merah"], correct: 1 }
        ],
        
        selectAnswer(index) { this.selectedAnswer = index; },
        
        nextQuestion() {
            if (this.selectedAnswer === null) return;
            this.userAnswers[this.currentQuestion] = this.selectedAnswer;
            if (this.selectedAnswer === this.questions[this.currentQuestion].correct) { this.score++; }
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.selectedAnswer = this.userAnswers[this.currentQuestion] || null;
            } else {
                this.quizCompleted = true;
            }
        },
        
        previousQuestion() {
            if (this.currentQuestion > 0) {
                this.currentQuestion--;
                this.selectedAnswer = this.userAnswers[this.currentQuestion] || null;
            }
        },
        
        resetQuiz() {
            this.currentQuestion = 0;
            this.selectedAnswer = null;
            this.score = 0;
            this.quizCompleted = false;
            this.userAnswers = [];
        },
        
        getScoreMessage() {
            const percentage = (this.score / this.questions.length) * 100;
            if (percentage >= 90) return "Luar biasa! Anda ahli makanan tradisional! 🏆";
            if (percentage >= 70) return "Bagus sekali! Pengetahuan Anda sangat baik! 👏";
            if (percentage >= 50) return "Lumayan! Masih ada yang perlu dipelajari lagi. 📚";
            return "Jangan menyerah! Coba lagi dan pelajari lebih banyak! 💪";
        }
    };
}

// Main Alpine.js Data Component
function calorieCalculator() {
    return {
        selectedFoods: [],
        isPlaying: false,

        get totalCalories() {
            return this.selectedFoods.reduce((total, food) => total + food.calories, 0);
        },

        init() {
            const audio = document.getElementById('background-music');
            if (audio) {
                audio.onplay = () => { this.isPlaying = true; };
                audio.onpause = () => { this.isPlaying = false; };
            }
        },

        togglePlayback() {
            const audio = document.getElementById('background-music');
            if (!audio) return;
            
            if (this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            this.isPlaying = !this.isPlaying;
        },
        
        toggleFood(id, name, calories) {
            const existingIndex = this.selectedFoods.findIndex(food => food.id === id);
            
            if (existingIndex > -1) {
                this.selectedFoods.splice(existingIndex, 1);
                this.updateButtonText(id, 'Tambah', 'fas fa-plus');
            } else {
                this.selectedFoods.push({ id, name, calories });
                this.updateButtonText(id, 'Hapus', 'fas fa-check');
            }
            this.animateCalorieCounter();
        },
        
        removeFood(id) {
            const index = this.selectedFoods.findIndex(food => food.id === id);
            if (index > -1) {
                this.selectedFoods.splice(index, 1);
                this.updateButtonText(id, 'Tambah', 'fas fa-plus');
                this.animateCalorieCounter();
            }
        },
        
        calculateTotal() {
            if (this.selectedFoods.length === 0) {
                this.showNotification('Pilih makanan terlebih dahulu!', 'warning');
                return;
            }
            this.showCalculationAnimation();
            setTimeout(() => {
                this.showNotification(`Total kalori: ${this.totalCalories} dari ${this.selectedFoods.length} makanan`, 'success');
            }, 1000);
        },
        
        resetCalculator() {
            this.selectedFoods = [];
            document.querySelectorAll('.food-card button[data-food-id]').forEach(btn => {
                btn.innerHTML = '<i class="fas fa-plus mr-1"></i> Tambah';
            });
            this.showNotification('Semua pilihan telah di-reset', 'info');
            this.animateCalorieCounter();
        },
        
        updateButtonText(foodId, text, iconClass) {
            const button = document.querySelector(`[data-food-id="${foodId}"]`);
            if (button) {
                button.innerHTML = `<i class="${iconClass} mr-1"></i> ${text}`;
            }
        },
        
        animateCalorieCounter() {
            const counterElement = document.querySelector('[x-text="totalCalories"]');
            if (counterElement) {
                counterElement.classList.add('animate-pulse');
                setTimeout(() => counterElement.classList.remove('animate-pulse'), 500);
            }
        },
        
        showCalculationAnimation() {
            const calculatorIcon = document.querySelector('.fa-calculator');
            if (calculatorIcon) {
                calculatorIcon.classList.add('animate-spin');
                setTimeout(() => calculatorIcon.classList.remove('animate-spin'), 1000);
            }
        },
        
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            const colors = {
                success: 'bg-green-500', warning: 'bg-yellow-500', error: 'bg-red-500', info: 'bg-blue-500'
            };
            notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
            notification.innerHTML = `<div class="flex items-center"><i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times' : 'info'} mr-2"></i><span>${message}</span></div>`;
            document.body.appendChild(notification);
            setTimeout(() => notification.classList.remove('translate-x-full'), 100);
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };
}

// Enhanced interactions
document.addEventListener('DOMContentLoaded', function() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'r') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('reset-calculator'));
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('calculate-total'));
            }
        }
    });

    // Lazy load images
    const images = document.querySelectorAll('img[src*="assets/"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s';
                setTimeout(() => { img.style.opacity = '1'; }, 200);
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
});