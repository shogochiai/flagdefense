// Summary of nation abilities generation
import { NATION_ABILITIES_V2, generateRemainingAbilities, ALL_NATION_ABILITIES } from './nation-abilities-v2';
import { FULL_NATION_DATABASE } from './nations-full-database';

export function getAbilitiesSummary() {
  const predefinedCount = Object.keys(NATION_ABILITIES_V2).length - 1; // -1 for default
  const generatedAbilities = generateRemainingAbilities();
  const generatedCount = Object.keys(generatedAbilities).length;
  const totalNations = FULL_NATION_DATABASE.length;
  
  // Group generated abilities by template type
  const abilityGroups: Record<string, string[]> = {};
  
  Object.entries(generatedAbilities).forEach(([nationId, ability]) => {
    const nation = FULL_NATION_DATABASE.find(n => n.id === nationId);
    if (!nation) return;
    
    if (!abilityGroups[ability.name]) {
      abilityGroups[ability.name] = [];
    }
    abilityGroups[ability.name].push(`${nation.name} ($${nation.gdp}B)`);
  });
  
  return {
    predefinedCount,
    generatedCount,
    totalNations,
    totalAbilities: predefinedCount + generatedCount,
    abilityGroups,
    coverage: ((predefinedCount + generatedCount) / totalNations * 100).toFixed(1) + '%'
  };
}

// Example usage component
export const AbilitiesSummaryDisplay = () => {
  const summary = getAbilitiesSummary();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Nation Abilities Generation Summary</h2>
      <ul>
        <li>Pre-defined abilities: {summary.predefinedCount}</li>
        <li>Generated abilities: {summary.generatedCount}</li>
        <li>Total nations: {summary.totalNations}</li>
        <li>Coverage: {summary.coverage}</li>
      </ul>
      
      <h3>Generated Ability Types:</h3>
      {Object.entries(summary.abilityGroups).map(([abilityName, nations]) => (
        <details key={abilityName}>
          <summary>{abilityName} ({nations.length} nations)</summary>
          <ul style={{ fontSize: '0.9em' }}>
            {nations.slice(0, 5).map((nation, i) => (
              <li key={i}>{nation}</li>
            ))}
            {nations.length > 5 && <li>... and {nations.length - 5} more</li>}
          </ul>
        </details>
      ))}
    </div>
  );
};