describe('Vegetables', () => {
    beforeEach(() => {
        global.VEGETABLES = {
            I: {
                name: 'ニンジン',
                color: '#FF6B35',
                emoji: '🥕',
                facts: [
                    'ビタミンAが豊富で、目の健康に良い',
                    'βカロテンが含まれており、抗酸化作用がある',
                    '世界で最も人気のある根菜の一つ'
                ],
                nutrition: 'ビタミンA、食物繊維、カリウム'
            },
            O: {
                name: 'トマト',
                color: '#FF0000',
                emoji: '🍅',
                facts: [
                    'リコピンが豊富で、がん予防効果がある',
                    '実は果物に分類される野菜',
                    'ビタミンCが豊富で免疫力を高める'
                ],
                nutrition: 'リコピン、ビタミンC、カリウム'
            }
        };
    });

    describe('getVegetableInfo', () => {
        test('should return vegetable info for valid type', () => {
            const info = getVegetableInfo('I');
            
            expect(info).toBeDefined();
            expect(info.name).toBe('ニンジン');
            expect(info.color).toBe('#FF6B35');
            expect(info.emoji).toBe('🥕');
        });

        test('should return null for invalid type', () => {
            const info = getVegetableInfo('X');
            expect(info).toBeNull();
        });
    });

    describe('getRandomFact', () => {
        test('should return a fact for valid type', () => {
            const fact = getRandomFact('O');
            
            expect(fact).toBeDefined();
            expect(VEGETABLES.O.facts).toContain(fact);
        });

        test('should return null for invalid type', () => {
            const fact = getRandomFact('X');
            expect(fact).toBeNull();
        });
    });

    describe('updateVegetableDisplay', () => {
        test('should update display elements with vegetable info', () => {
            const mockNameElement = { textContent: '' };
            const mockFactElement = { textContent: '' };
            
            global.document = {
                querySelector: jest.fn((selector) => {
                    if (selector === '.vegetable-name') return mockNameElement;
                    if (selector === '.vegetable-fact') return mockFactElement;
                    return null;
                })
            };
            
            global.Math.random = jest.fn(() => 0);
            
            updateVegetableDisplay('I');
            
            expect(mockNameElement.textContent).toBe('🥕 ニンジン');
            expect(mockFactElement.textContent).toBe('ビタミンAが豊富で、目の健康に良い');
        });

        test('should handle missing elements gracefully', () => {
            global.document = {
                querySelector: jest.fn(() => null)
            };
            
            expect(() => updateVegetableDisplay('I')).not.toThrow();
        });
    });
});