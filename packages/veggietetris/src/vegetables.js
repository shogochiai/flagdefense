// All 57 vegetable characters for the ultimate veggie party!
const ALL_VEGETABLES = [
    // Fruits treated as veggies
    { id: 'apple', name: 'リンゴ', color: '#FF6B6B', emoji: '🍎', image: 'assets/vegetables/img/apple.png', personality: 'sweet' },
    { id: 'avocado', name: 'アボカド', color: '#6B8E23', emoji: '🥑', image: 'assets/vegetables/img/avocado.png', personality: 'smooth' },
    { id: 'banana', name: 'バナナ', color: '#FFE66D', emoji: '🍌', image: 'assets/vegetables/img/banana.png', personality: 'cheerful' },
    { id: 'grape', name: 'ブドウ', color: '#6B3AA0', emoji: '🍇', image: 'assets/vegetables/img/grape.png', personality: 'playful' },
    { id: 'kiwi', name: 'キウイ', color: '#8FBC8F', emoji: '🥝', image: 'assets/vegetables/img/kiwi.png', personality: 'fuzzy' },
    { id: 'lemon', name: 'レモン', color: '#FFF700', emoji: '🍋', image: 'assets/vegetables/img/lemon.png', personality: 'zesty' },
    { id: 'mandarin', name: 'みかん', color: '#FFA500', emoji: '🍊', image: 'assets/vegetables/img/mandarin.png', personality: 'sunny' },
    { id: 'mango', name: 'マンゴー', color: '#FFD700', emoji: '🥭', image: 'assets/vegetables/img/mango.png', personality: 'tropical' },
    { id: 'orange', name: 'オレンジ', color: '#FF8C00', emoji: '🍊', image: 'assets/vegetables/img/orange.png', personality: 'energetic' },
    { id: 'peach', name: '桃', color: '#FFDAB9', emoji: '🍑', image: 'assets/vegetables/img/peach.png', personality: 'soft' },
    { id: 'pear', name: '梨', color: '#D3D3A3', emoji: '🍐', image: 'assets/vegetables/img/pear.png', personality: 'gentle' },
    { id: 'persimmon', name: '柿', color: '#FF7F00', emoji: '🟠', image: 'assets/vegetables/img/persimmon.png', personality: 'patient' },
    { id: 'pineapple', name: 'パイナップル', color: '#FFD700', emoji: '🍍', image: 'assets/vegetables/img/pineapple.png', personality: 'exotic' },
    { id: 'strawberry', name: 'イチゴ', color: '#FF1744', emoji: '🍓', image: 'assets/vegetables/img/strawberry.png', personality: 'sweet' },
    { id: 'watermelon', name: 'スイカ', color: '#FF6B6B', emoji: '🍉', image: 'assets/vegetables/img/watermelon.png', personality: 'refreshing' },
    
    // True vegetables
    { id: 'arugula', name: 'ルッコラ', color: '#228B22', emoji: '🥬', image: 'assets/vegetables/img/arugula.png', personality: 'peppery' },
    { id: 'asparagus', name: 'アスパラガス', color: '#87A96B', emoji: '🌱', image: 'assets/vegetables/img/asparagus.png', personality: 'elegant' },
    { id: 'bell_pepper', name: 'ピーマン', color: '#00A86B', emoji: '🫑', image: 'assets/vegetables/img/bell_pepper.png', personality: 'vibrant' },
    { id: 'bitter_gourd', name: 'ゴーヤ', color: '#006400', emoji: '🥒', image: 'assets/vegetables/img/bitter_gourd.png', personality: 'tough' },
    { id: 'bitter_melon', name: 'ニガウリ', color: '#228B22', emoji: '🥒', image: 'assets/vegetables/img/bitter_melon.png', personality: 'strong' },
    { id: 'bok_choy', name: 'チンゲン菜', color: '#90EE90', emoji: '🥬', image: 'assets/vegetables/img/bok_choy.png', personality: 'crisp' },
    { id: 'broad_bean', name: 'そら豆', color: '#7CFC00', emoji: '🫘', image: 'assets/vegetables/img/broad_bean.png', personality: 'hearty' },
    { id: 'broccoli', name: 'ブロッコリー', color: '#228B22', emoji: '🥦', image: 'assets/vegetables/img/broccoli.png', personality: 'strong' },
    { id: 'burdock', name: 'ゴボウ', color: '#8B4513', emoji: '🌿', image: 'assets/vegetables/img/burdock.png', personality: 'earthy' },
    { id: 'cabbage', name: 'キャベツ', color: '#90EE90', emoji: '🥬', image: 'assets/vegetables/img/cabbage.png', personality: 'round' },
    { id: 'carrot', name: 'ニンジン', color: '#FF6B35', emoji: '🥕', image: 'assets/vegetables/img/carrot.png', personality: 'crunchy' },
    { id: 'celery', name: 'セロリ', color: '#7FFF00', emoji: '🥬', image: 'assets/vegetables/img/celery.png', personality: 'crisp' },
    { id: 'chili_pepper', name: '唐辛子', color: '#FF0000', emoji: '🌶️', image: 'assets/vegetables/img/chili_pepper.png', personality: 'fiery' },
    { id: 'chinese_cabbage', name: '白菜', color: '#F0FFF0', emoji: '🥬', image: 'assets/vegetables/img/chinese_cabbage.png', personality: 'mild' },
    { id: 'corn', name: 'トウモロコシ', color: '#FFD700', emoji: '🌽', image: 'assets/vegetables/img/corn.png', personality: 'sunny' },
    { id: 'cucumber', name: 'キュウリ', color: '#00FF00', emoji: '🥒', image: 'assets/vegetables/img/cucumber.png', personality: 'cool' },
    { id: 'daikon', name: '大根', color: '#FFFAFA', emoji: '🥕', image: 'assets/vegetables/img/daikon.png', personality: 'refreshing' },
    { id: 'eggplant', name: 'ナス', color: '#6B3AA0', emoji: '🍆', image: 'assets/vegetables/img/eggplant.png', personality: 'smooth' },
    { id: 'garlic', name: 'ニンニク', color: '#F5F5DC', emoji: '🧄', image: 'assets/vegetables/img/garlic.png', personality: 'bold' },
    { id: 'garlic_chive', name: 'ニラ', color: '#228B22', emoji: '🌿', image: 'assets/vegetables/img/garlic_chive.png', personality: 'aromatic' },
    { id: 'ginger', name: 'ショウガ', color: '#BC9A6A', emoji: '🫚', image: 'assets/vegetables/img/ginger.png', personality: 'spicy' },
    { id: 'green_bean', name: 'インゲン', color: '#00FF00', emoji: '🫘', image: 'assets/vegetables/img/green_bean.png', personality: 'snappy' },
    { id: 'green_onion', name: 'ネギ', color: '#9ACD32', emoji: '🌱', image: 'assets/vegetables/img/green_onion.png', personality: 'sharp' },
    { id: 'komatsuna', name: '小松菜', color: '#2E8B57', emoji: '🥬', image: 'assets/vegetables/img/komatsuna.png', personality: 'tender' },
    { id: 'lettuce', name: 'レタス', color: '#90EE90', emoji: '🥬', image: 'assets/vegetables/img/lettuce.png', personality: 'crispy' },
    { id: 'lotus_root', name: 'レンコン', color: '#F5DEB3', emoji: '🥔', image: 'assets/vegetables/img/lotus_root.png', personality: 'unique' },
    { id: 'mizuna', name: '水菜', color: '#00FF7F', emoji: '🥬', image: 'assets/vegetables/img/mizuna.png', personality: 'delicate' },
    { id: 'okra', name: 'オクラ', color: '#8FBC8F', emoji: '🌿', image: 'assets/vegetables/img/okra.png', personality: 'slimy' },
    { id: 'onion', name: 'タマネギ', color: '#C0A080', emoji: '🧅', image: 'assets/vegetables/img/onion.png', personality: 'layered' },
    { id: 'pea', name: 'エンドウ', color: '#32CD32', emoji: '🫛', image: 'assets/vegetables/img/pea.png', personality: 'sweet' },
    { id: 'potato', name: 'ジャガイモ', color: '#DEB887', emoji: '🥔', image: 'assets/vegetables/img/potato.png', personality: 'reliable' },
    { id: 'pumpkin', name: 'カボチャ', color: '#FF8C00', emoji: '🎃', image: 'assets/vegetables/img/pumpkin.png', personality: 'festive' },
    { id: 'spinach', name: 'ホウレンソウ', color: '#006400', emoji: '🥬', image: 'assets/vegetables/img/spinach.png', personality: 'strong' },
    { id: 'sweet_potato', name: 'サツマイモ', color: '#D2691E', emoji: '🍠', image: 'assets/vegetables/img/sweet_potato.png', personality: 'sweet' },
    { id: 'taro', name: '里芋', color: '#9B7653', emoji: '🥔', image: 'assets/vegetables/img/taro.png', personality: 'earthy' },
    { id: 'tomato', name: 'トマト', color: '#FF0000', emoji: '🍅', image: 'assets/vegetables/img/tomato.png', personality: 'juicy' },
    { id: 'turnip', name: 'カブ', color: '#FFFAFA', emoji: '🥔', image: 'assets/vegetables/img/turnip.png', personality: 'mild' },
    { id: 'zucchini', name: 'ズッキーニ', color: '#2E8B57', emoji: '🥒', image: 'assets/vegetables/img/zucchini.png', personality: 'versatile' },
    
    // Fun food items
    { id: 'pasta', name: 'パスタ', color: '#FFDAB9', emoji: '🍝', image: 'assets/vegetables/img/pasta.png', personality: 'fun' },
    { id: 'pizza', name: 'ピザ', color: '#FF6347', emoji: '🍕', image: 'assets/vegetables/img/pizza.png', personality: 'party' },
    { id: 'ramen', name: 'ラーメン', color: '#DEB887', emoji: '🍜', image: 'assets/vegetables/img/ramen.png', personality: 'warm' },
    { id: 'sushi', name: '寿司', color: '#FFB6C1', emoji: '🍣', image: 'assets/vegetables/img/sushi.png', personality: 'elegant' }
];

// Map tetromino shapes to multiple vegetables for variety
const SHAPE_TO_VEGGIES = {
    I: ['carrot', 'asparagus', 'green_onion', 'celery', 'burdock'],
    O: ['tomato', 'apple', 'orange', 'pumpkin', 'watermelon'],
    T: ['eggplant', 'bell_pepper', 'chili_pepper', 'mushroom'],
    S: ['cucumber', 'zucchini', 'green_bean', 'pea'],
    Z: ['corn', 'banana', 'sweet_potato', 'ginger'],
    J: ['broccoli', 'lettuce', 'cabbage', 'spinach'],
    L: ['potato', 'onion', 'garlic', 'turnip', 'taro']
};

// Keep track of current veggie for each shape
const currentVeggieForShape = {};

// Initialize with random veggies
Object.keys(SHAPE_TO_VEGGIES).forEach(shape => {
    const veggies = SHAPE_TO_VEGGIES[shape];
    currentVeggieForShape[shape] = veggies[0];
});

// Get current vegetable data for a shape
function getVegetableForShape(shape) {
    const veggieId = currentVeggieForShape[shape];
    return ALL_VEGETABLES.find(v => v.id === veggieId);
}

// Rotate to next vegetable for a shape
function rotateVegetableForShape(shape) {
    const veggies = SHAPE_TO_VEGGIES[shape];
    const currentIndex = veggies.indexOf(currentVeggieForShape[shape]);
    const nextIndex = (currentIndex + 1) % veggies.length;
    currentVeggieForShape[shape] = veggies[nextIndex];
    return getVegetableForShape(shape);
}

// Party mode: randomly assign vegetables
function randomizeAllVegetables() {
    Object.keys(SHAPE_TO_VEGGIES).forEach(shape => {
        const veggies = SHAPE_TO_VEGGIES[shape];
        const randomIndex = Math.floor(Math.random() * veggies.length);
        currentVeggieForShape[shape] = veggies[randomIndex];
    });
}

// Legacy compatibility
const VEGETABLES = {};
Object.keys(SHAPE_TO_VEGGIES).forEach(shape => {
    const veggie = getVegetableForShape(shape);
    VEGETABLES[shape] = {
        name: veggie.name,
        color: veggie.color,
        emoji: veggie.emoji,
        image: veggie.image,
        facts: [
            `${veggie.name}は栄養豊富！`,
            `${veggie.name}パーティーの時間だ！`,
            `${veggie.name}は${veggie.personality}な性格！`
        ],
        nutrition: 'ビタミン、ミネラル、食物繊維'
    };
});

function getVegetableInfo(type) {
    // Update VEGETABLES object with current veggie
    const veggie = getVegetableForShape(type);
    if (veggie) {
        VEGETABLES[type] = {
            name: veggie.name,
            color: veggie.color,
            emoji: veggie.emoji,
            image: veggie.image,
            facts: [
                `${veggie.name}は栄養豊富！`,
                `${veggie.name}パーティーの時間だ！`,
                `${veggie.name}は${veggie.personality}な性格！`
            ],
            nutrition: 'ビタミン、ミネラル、食物繊維'
        };
    }
    return VEGETABLES[type] || null;
}

function getRandomFact(type) {
    const vegetable = VEGETABLES[type];
    if (!vegetable) return null;
    
    const randomIndex = Math.floor(Math.random() * vegetable.facts.length);
    return vegetable.facts[randomIndex];
}

function updateVegetableDisplay(type) {
    const vegetable = VEGETABLES[type];
    if (!vegetable) return;
    
    const nameElement = document.querySelector('.vegetable-name');
    const factElement = document.querySelector('.vegetable-fact');
    const infoContent = document.querySelector('.vegetable-info .info-content');
    
    if (nameElement && factElement) {
        // Add cute animation class
        nameElement.classList.add('veggie-bounce');
        nameElement.innerHTML = `
            <img src="${vegetable.image}" alt="${vegetable.name}" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 5px;" class="veggie-spin">
            ${vegetable.emoji} ${vegetable.name}
        `;
        factElement.textContent = getRandomFact(type);
        
        // Remove animation class after animation completes
        setTimeout(() => nameElement.classList.remove('veggie-bounce'), 500);
    }
}