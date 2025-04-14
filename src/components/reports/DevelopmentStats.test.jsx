import React from 'react';
import { render, screen } from '@testing-library/react';
import DevelopmentStats from './DevelopmentStats';

describe('DevelopmentStats', () => {
  const mockStats = {
    criticalAreas: 2,
    developmentAreas: 3,
    strengthAreas: 5,
    matchPercentage: 75.5
  };

  it('should render all stat cards with correct values', () => {
    render(<DevelopmentStats stats={mockStats} />);
    
    // Check critical areas
    expect(screen.getByText('Critical Focus Areas')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2 areas need immediate attention (score < 40)')).toBeInTheDocument();
    
    // Check development areas
    expect(screen.getByText('Development Opportunities')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('3 areas for potential improvement (score 40-60)')).toBeInTheDocument();
    
    // Check strength areas
    expect(screen.getByText('Areas of Strength')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('5 areas performing well (score > 60)')).toBeInTheDocument();
  });

  it('should render progress bar with correct percentage', () => {
    render(<DevelopmentStats stats={mockStats} />);
    
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle({ width: '75.5%' });
    expect(screen.getByText('75.5%')).toBeInTheDocument();
  });

  it('should handle missing matchPercentage gracefully', () => {
    const statsWithoutPercentage = {
      criticalAreas: 2,
      developmentAreas: 3,
      strengthAreas: 5
    };
    
    render(<DevelopmentStats stats={statsWithoutPercentage} />);
    
    // Progress bar should not be rendered
    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('should handle zero values correctly', () => {
    const zeroStats = {
      criticalAreas: 0,
      developmentAreas: 0,
      strengthAreas: 0,
      matchPercentage: 0
    };
    
    render(<DevelopmentStats stats={zeroStats} />);
    
    // Use getAllByText for multiple elements with the same text
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(3);
    
    expect(screen.getByText('0 areas need immediate attention (score < 40)')).toBeInTheDocument();
    expect(screen.getByText('0 areas for potential improvement (score 40-60)')).toBeInTheDocument();
    expect(screen.getByText('0 areas performing well (score > 60)')).toBeInTheDocument();
  });

  it('should apply correct color schemes to stat cards', () => {
    render(<DevelopmentStats stats={mockStats} />);
    
    // Check critical areas card
    const criticalCard = screen.getByText('Critical Focus Areas').closest('div');
    expect(criticalCard).toHaveClass('border-red-200');
    
    // Check development areas card
    const developmentCard = screen.getByText('Development Opportunities').closest('div');
    expect(developmentCard).toHaveClass('border-amber-200');
    
    // Check strength areas card
    const strengthCard = screen.getByText('Areas of Strength').closest('div');
    expect(strengthCard).toHaveClass('border-emerald-200');
  });
}); 