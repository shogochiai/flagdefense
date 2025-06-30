import { describe, it, expect } from 'vitest';
import { generateRemainingAbilities, NATION_ABILITIES_V2, ALL_NATION_ABILITIES, getNationAbility } from '../src/spike/nation-abilities-v2';
import { FULL_NATION_DATABASE } from '../src/spike/nations-full-database';

describe('Nation Abilities Generation', () => {
  it('should generate abilities for all undefined nations', () => {
    const remainingAbilities = generateRemainingAbilities();
    const definedNations = new Set(Object.keys(NATION_ABILITIES_V2));
    
    // Check that we generated abilities for nations not in NATION_ABILITIES_V2
    Object.keys(remainingAbilities).forEach(nationId => {
      expect(definedNations.has(nationId)).toBe(false);
    });
  });

  it('should have abilities for all nations in the database', () => {
    // Check that every nation (except default) has an ability
    const nationsWithoutAbilities = FULL_NATION_DATABASE.filter(nation => 
      !ALL_NATION_ABILITIES[nation.id] && nation.id !== 'default'
    );
    
    expect(nationsWithoutAbilities).toHaveLength(0);
  });

  it('should generate appropriate abilities based on GDP', () => {
    const remainingAbilities = generateRemainingAbilities();
    
    // Find a high GDP nation that wasn't pre-defined
    const highGDPNations = FULL_NATION_DATABASE
      .filter(n => n.gdp >= 1000 && !NATION_ABILITIES_V2[n.id])
      .slice(0, 3);
    
    highGDPNations.forEach(nation => {
      const ability = remainingAbilities[nation.id];
      expect(ability).toBeDefined();
      
      // High GDP nations should have powerful effects
      const hasStrongEffect = ability.effects.some(e => 
        (e.type === 'damage' && e.value >= 1.5) ||
        (e.type === 'splash' && e.value >= 1.3) ||
        (e.type === 'buff' && e.value >= 1.2)
      );
      expect(hasStrongEffect).toBe(true);
    });
    
    // Find low GDP nations that weren't pre-defined
    const lowGDPNations = FULL_NATION_DATABASE
      .filter(n => n.gdp < 5 && !NATION_ABILITIES_V2[n.id])
      .slice(0, 3);
    
    lowGDPNations.forEach(nation => {
      const ability = remainingAbilities[nation.id];
      expect(ability).toBeDefined();
      
      // Low GDP nations should focus on money generation
      const hasMoneyEffect = ability.effects.some(e => 
        e.type === 'money' && e.value >= 1.5
      );
      expect(hasMoneyEffect).toBe(true);
    });
  });

  it('should apply regional customizations', () => {
    const remainingAbilities = generateRemainingAbilities();
    
    // Test island nations
    const islandNations = FULL_NATION_DATABASE
      .filter(n => n.name.toLowerCase().includes('island') && !NATION_ABILITIES_V2[n.id])
      .slice(0, 2);
    
    islandNations.forEach(nation => {
      const ability = remainingAbilities[nation.id];
      expect(ability).toBeDefined();
      expect(ability.name).toBe('島国の守護');
      expect(ability.description).toBe('海洋防御+波の力');
    });
    
    // Test Pacific nations
    const pacificNations = ['fiji', 'samoa', 'tonga']
      .filter(id => !NATION_ABILITIES_V2[id]);
    
    pacificNations.forEach(nationId => {
      const ability = remainingAbilities[nationId];
      if (ability) {
        expect(ability.name).toBe('太平洋の守護者');
        expect(ability.description).toBe('海の恵み+防御');
      }
    });
  });

  it('should have valid effect types for all generated abilities', () => {
    const remainingAbilities = generateRemainingAbilities();
    const validEffectTypes = [
      'damage', 'slow', 'splash', 'money', 'range', 'multi', 'pierce',
      'chain', 'laser', 'freeze', 'explosion', 'buff', 'debuff', 'summon', 'transform'
    ];
    
    Object.values(remainingAbilities).forEach(ability => {
      expect(ability.id).toBeTruthy();
      expect(ability.name).toBeTruthy();
      expect(ability.description).toBeTruthy();
      expect(ability.effects.length).toBeGreaterThan(0);
      
      ability.effects.forEach(effect => {
        expect(validEffectTypes).toContain(effect.type);
        expect(effect.value).toBeGreaterThan(0);
      });
    });
  });

  it('getNationAbility should return default for unknown nations', () => {
    const unknownAbility = getNationAbility('unknown_nation');
    expect(unknownAbility.id).toBe('default');
    expect(unknownAbility.name).toBe('通常攻撃');
  });

  it('getNationAbility should return correct ability for known nations', () => {
    // Test pre-defined nation
    const usaAbility = getNationAbility('usa');
    expect(usaAbility.id).toBe('usa');
    expect(usaAbility.name).toBe('スーパーエアストライク');
    
    // Test generated nation
    const generatedAbilities = generateRemainingAbilities();
    const firstGeneratedId = Object.keys(generatedAbilities)[0];
    if (firstGeneratedId) {
      const generatedAbility = getNationAbility(firstGeneratedId);
      expect(generatedAbility.id).toBe(firstGeneratedId);
      expect(generatedAbility.name).toBeTruthy();
    }
  });
});