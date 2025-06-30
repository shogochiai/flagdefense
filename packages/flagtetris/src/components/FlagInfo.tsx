import React from 'react';
import { FlagData } from '../types/game';
import './FlagInfo.css';

interface FlagInfoProps {
  currentFlagId: string | null;
  recentFlags: string[];
  flagData: FlagData[];
}

export const FlagInfo: React.FC<FlagInfoProps> = ({ currentFlagId, recentFlags, flagData }) => {
  const getFlagById = (id: string): FlagData | undefined => {
    return flagData.find(flag => flag.id === id);
  };

  const currentFlag = currentFlagId ? getFlagById(currentFlagId) : null;
  const recent = recentFlags.slice(0, 5).map(id => getFlagById(id)).filter(Boolean) as FlagData[];

  return (
    <div className="flag-info">
      <h3>Flag Info</h3>
      
      {currentFlag && (
        <div className="current-flag">
          <h4>Current Flag</h4>
          <div className="flag-detail">
            <span className="flag-emoji">{currentFlag.emoji}</span>
            <div className="flag-text">
              <div className="flag-name">{currentFlag.name.en}</div>
              <div className="flag-name-ja">{currentFlag.name.ja}</div>
            </div>
          </div>
          {currentFlag.capital && (
            <div className="flag-fact">
              <span className="label">Capital:</span>
              <span className="value">{currentFlag.capital}</span>
            </div>
          )}
          {currentFlag.population && (
            <div className="flag-fact">
              <span className="label">Population:</span>
              <span className="value">{currentFlag.population.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {recent.length > 0 && (
        <div className="recent-flags">
          <h4>Recent Flags</h4>
          <div className="recent-list">
            {recent.map((flag, index) => (
              <div key={index} className="recent-item">
                <span className="flag-emoji-small">{flag.emoji}</span>
                <span className="flag-name-small">{flag.name.en}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!currentFlag && recent.length === 0 && (
        <p className="placeholder">Place blocks to learn about countries!</p>
      )}
    </div>
  );
};