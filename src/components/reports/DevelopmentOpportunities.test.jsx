import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DevelopmentOpportunities from './DevelopmentOpportunities';

// Mock the icons
jest.mock('lucide-react', () => ({
  ArrowUpRight: () => <svg data-testid="arrow-up-right" />,
  Target: () => <svg data-testid="target" />,
  TrendingUp: () => <svg data-testid="trending-up" />,
  Lightbulb: () => <svg data-testid="lightbulb" />
}));

jest.mock('@heroicons/react/24/outline', () => ({
  ChevronUpIcon: () => <svg data-testid="chevron-up" />,
  ChevronDownIcon: () => <svg data-testid="chevron-down" />
}));

const mockOpportunities = [
  {
    id: 'communication',
    category: 'Communication',
    description: 'Communication skills assessment',
    matchPercentage: 35,
    priority: 'critical',
    recommendations: ['Practice active listening', 'Improve presentation skills'],
    idealState: 'Effective communicator with strong presentation skills',
    currentState: 'Basic communication skills with room for improvement'
  },
  {
    id: 'leadership',
    category: 'Leadership',
    description: 'Leadership capabilities assessment',
    matchPercentage: 65,
    priority: 'development',
    recommendations: ['Develop strategic thinking', 'Enhance team management'],
    idealState: 'Strategic leader with strong team management',
    currentState: 'Developing leadership skills with some experience'
  },
  {
    id: 'technical-skills',
    category: 'Technical Skills',
    description: 'Technical proficiency assessment',
    matchPercentage: 85,
    priority: 'strength',
    recommendations: ['Stay updated with latest technologies'],
    idealState: 'Expert in technical domain',
    currentState: 'Strong technical foundation'
  }
];

describe('DevelopmentOpportunities', () => {
  it('should render empty state when no opportunities are provided', () => {
    render(<DevelopmentOpportunities opportunities={[]} />);
    
    expect(screen.getByText('No Development Opportunities')).toBeInTheDocument();
    expect(screen.getByText("Great job! You're performing well in all areas.")).toBeInTheDocument();
  });

  it('should render all opportunities with correct information', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    // Check if all categories are rendered
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    
    // Check if match percentages are displayed
    expect(screen.getByText('35%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    
    // Check if recommendations are displayed
    expect(screen.getByText('Practice active listening')).toBeInTheDocument();
    expect(screen.getByText('Develop strategic thinking')).toBeInTheDocument();
    expect(screen.getByText('Stay updated with latest technologies')).toBeInTheDocument();
  });

  it('should filter opportunities by priority', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    // Select 'critical' priority
    const prioritySelect = screen.getByLabelText('Priority:');
    fireEvent.change(prioritySelect, { target: { value: 'critical' } });
    
    // Only critical priority should be visible
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.queryByText('Leadership')).not.toBeInTheDocument();
    expect(screen.queryByText('Technical Skills')).not.toBeInTheDocument();
  });

  it('should sort opportunities by priority', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    // Click sort by priority button
    const sortByPriorityButton = screen.getByText('Sort by Priority');
    fireEvent.click(sortByPriorityButton);
    
    // Get all opportunity cards
    const opportunityCards = screen.getAllByTestId('opportunity-card');
    
    // Check order: critical -> development -> strength
    expect(opportunityCards[0]).toHaveTextContent('Communication');
    expect(opportunityCards[1]).toHaveTextContent('Leadership');
    expect(opportunityCards[2]).toHaveTextContent('Technical Skills');
  });

  it('should sort opportunities by match percentage', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    // Click sort by match button
    const sortByMatchButton = screen.getByText('Sort by Match');
    fireEvent.click(sortByMatchButton);
    
    // Get all opportunity cards
    const opportunityCards = screen.getAllByTestId('opportunity-card');
    
    // Check order: lowest to highest match percentage
    expect(opportunityCards[0]).toHaveTextContent('Communication');
    expect(opportunityCards[1]).toHaveTextContent('Leadership');
    expect(opportunityCards[2]).toHaveTextContent('Technical Skills');
  });

  it('should toggle sort direction when clicking the same sort button twice', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    // Click sort by match button twice
    const sortByMatchButton = screen.getByText('Sort by Match');
    fireEvent.click(sortByMatchButton);
    fireEvent.click(sortByMatchButton);
    
    // Get all opportunity cards
    const opportunityCards = screen.getAllByTestId('opportunity-card');
    
    // Check order: highest to lowest match percentage
    expect(opportunityCards[0]).toHaveTextContent('Technical Skills');
    expect(opportunityCards[1]).toHaveTextContent('Leadership');
    expect(opportunityCards[2]).toHaveTextContent('Communication');
  });

  // New test cases for threshold configurations
  it('should handle different threshold configurations', () => {
    const customThresholdOpportunities = [
      {
        ...mockOpportunities[0],
        matchPercentage: 25,
        priority: 'critical'
      },
      {
        ...mockOpportunities[1],
        matchPercentage: 35,
        priority: 'development'
      }
    ];

    render(<DevelopmentOpportunities opportunities={customThresholdOpportunities} />);
    
    const opportunityCards = screen.getAllByTestId('opportunity-card');
    expect(opportunityCards).toHaveLength(2);
    
    // Verify priority badges are rendered correctly
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
  });

  // New test cases for accessibility
  it('should have accessible priority filter', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    const prioritySelect = screen.getByLabelText('Priority:');
    expect(prioritySelect).toHaveAttribute('id', 'priority-filter');
    expect(prioritySelect).toHaveAttribute('aria-label', 'Priority:');
  });

  it('should have accessible sort buttons', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    const sortByPriorityButton = screen.getByText('Sort by Priority');
    const sortByMatchButton = screen.getByText('Sort by Match');
    
    expect(sortByPriorityButton).toHaveAttribute('aria-label', 'Sort by Priority');
    expect(sortByMatchButton).toHaveAttribute('aria-label', 'Sort by Match');
  });

  // New test case for dark mode styles
  it('should apply correct dark mode styles', () => {
    render(<DevelopmentOpportunities opportunities={mockOpportunities} />);
    
    const opportunityCards = screen.getAllByTestId('opportunity-card');
    opportunityCards.forEach(card => {
      expect(card).toHaveClass('dark:bg-zinc-900');
      expect(card).toHaveClass('dark:ring-white/10');
    });
    
    const descriptions = screen.getAllByText(/assessment$/);
    descriptions.forEach(desc => {
      expect(desc).toHaveClass('dark:text-zinc-400');
    });
  });
}); 